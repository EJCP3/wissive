/**
 * Check de regresión: cada personalidad debe moverse distinto.
 *
 * El bug original era que 'fiery', 'serene' y 'calm' producían exactamente el
 * mismo `bob += sin(t*speed)*amp` que el default — 8 de 14 emojis compartían
 * animación. Este check falla si dos firmas vuelven a colapsar en una sola.
 *
 * Ejecutar:  node --experimental-strip-types src/core/motion.check.ts
 */
import assert from 'node:assert';
import { IDLE_MOTIONS, STATE_MOTIONS } from './motion.ts';
import { ALL_STATES, PERSONALITY_DRIVEN_STATES, AUTONOMOUS_STATES, STATE_GROUPS, pickWithoutRepeat } from '../emojis/states.ts';

const TRACKED = [
  'bob', 'shiftX', 'turnAngle', 'eyeScale', 'eyeOpen',
  'browY', 'browTilt', 'mouthCurve', 'mouthOpen', 'cheek', 'gazeX', 'gazeY',
] as const;

function neutralParams() {
  const p: Record<string, number> = {};
  for (const k of TRACKED) p[k] = k === 'eyeScale' || k === 'eyeOpen' ? 1 : 0;
  return p;
}

/** Muestrea una firma de movimiento a lo largo de 6 s */
function signature(name: string): string {
  const fn = IDLE_MOTIONS[name as keyof typeof IDLE_MOTIONS];
  const samples: string[] = [];
  for (let step = 0; step < 60; step++) {
    const t = step * 0.1;
    const p = neutralParams();
    fn(p as never, t, 2, 2);
    samples.push(TRACKED.map((k) => p[k].toFixed(3)).join(','));
  }
  return samples.join('|');
}

const names = Object.keys(IDLE_MOTIONS);
assert.strictEqual(names.length, 14, `se esperaban 14 firmas, hay ${names.length}`);

// 1. Ninguna firma puede ser inerte (todo a cero = emoji muerto)
for (const name of names) {
  const inert = neutralParams();
  const moved = neutralParams();
  IDLE_MOTIONS[name as keyof typeof IDLE_MOTIONS](moved as never, 1.3, 2, 2);
  assert.notDeepStrictEqual(moved, inert, `"${name}" no mueve ningún parámetro`);
}

// 2. Ningún par de firmas puede ser idéntico
const seen = new Map<string, string>();
for (const name of names) {
  const sig = signature(name);
  const twin = seen.get(sig);
  assert.strictEqual(twin, undefined, `"${name}" y "${twin}" tienen la misma animación`);
  seen.set(sig, name);
}

// 3. Cada firma debe tener movimiento secundario, no solo bob/shiftX —
//    es lo que separa "se desplaza" de "está vivo".
const PRIMARY = new Set(['bob', 'shiftX']);
for (const name of names) {
  const p = neutralParams();
  const base = neutralParams();
  let touchedSecondary = false;
  for (let step = 0; step < 60 && !touchedSecondary; step++) {
    const sample = neutralParams();
    IDLE_MOTIONS[name as keyof typeof IDLE_MOTIONS](sample as never, step * 0.1, 2, 2);
    touchedSecondary = TRACKED.some((k) => !PRIMARY.has(k) && sample[k] !== base[k]);
  }
  void p;
  assert.ok(touchedSecondary, `"${name}" solo mueve bob/shiftX — le falta movimiento secundario`);
}

/* ── Estados ───────────────────────────────────────────────────────────
 * Mismo problema que con las personalidades: siete grupos de `case` hacían
 * que 5 estados compartieran mirada, 4 la boca, 4 el salto… y 15 se quedaran
 * inmóviles. Estos asserts impiden que vuelva a pasar.
 * ─────────────────────────────────────────────────────────────────── */

function stateSignature(state: string): string {
  const fn = STATE_MOTIONS[state];
  const samples: string[] = [];
  for (let step = 0; step < 60; step++) {
    const p = neutralParams();
    fn(p as never, step * 0.1, 2, 2);
    samples.push(TRACKED.map((k) => p[k].toFixed(3)).join(','));
  }
  return samples.join('|');
}

// Todo estado que no dependa de la personalidad debe tener firma propia
const stateNeedingMotion = ALL_STATES.filter(
  (s) => !PERSONALITY_DRIVEN_STATES.includes(s)
) as string[];

for (const state of stateNeedingMotion) {
  assert.ok(STATE_MOTIONS[state], `el estado "${state}" no tiene movimiento propio`);
}

// Los estados de interacción NO deben tener firma de estado: mandan la personalidad
for (const state of PERSONALITY_DRIVEN_STATES as string[]) {
  assert.ok(
    !STATE_MOTIONS[state],
    `"${state}" debe usar la animación del emoji, no una de estado`
  );
}

// Ningún par de estados puede moverse igual
const seenStates = new Map<string, string>();
for (const state of stateNeedingMotion) {
  const sig = stateSignature(state);
  const twin = seenStates.get(sig);
  assert.strictEqual(twin, undefined, `los estados "${state}" y "${twin}" se mueven igual`);
  seenStates.set(sig, state);
}

// Ningún estado puede quedarse completamente inmóvil
for (const state of stateNeedingMotion) {
  let moves = false;
  for (let step = 0; step < 60 && !moves; step++) {
    const p = neutralParams();
    const base = neutralParams();
    STATE_MOTIONS[state](p as never, step * 0.1, 2, 2);
    moves = TRACKED.some((k) => p[k] !== base[k]);
  }
  assert.ok(moves, `el estado "${state}" se queda congelado`);
}

// El registro de estados no debe tener duplicados (el desplegable repetía `idle`)
const dupes = ALL_STATES.filter((s, i) => ALL_STATES.indexOf(s) !== i);
assert.deepStrictEqual(dupes, [], `estados duplicados en el registro: ${dupes.join(', ')}`);

/* ── Deambular autónomo ────────────────────────────────────────────────
 * El emoji visita estados solo del grupo "Reacciones": si un "Ciclo de
 * producto" o "Morfo de agente" se colara aquí, el emoji podría mostrar
 * "uploading" o "thinking" sin que la app lo haya pedido — mentira visual.
 * ─────────────────────────────────────────────────────────────────── */

assert.ok(AUTONOMOUS_STATES.length > 1, 'el pool de deambular autónomo necesita más de un estado');

const reacciones = STATE_GROUPS.find((g) => g.label === 'Reacciones')!.states;
assert.deepStrictEqual(
  [...AUTONOMOUS_STATES].sort(),
  [...reacciones].sort(),
  'el deambular autónomo debe ser exactamente el grupo "Reacciones", ni más ni menos'
);

const prodOAgente = [
  ...STATE_GROUPS.find((g) => g.label === 'Ciclo de producto')!.states,
  ...STATE_GROUPS.find((g) => g.label === 'Morfos de agente')!.states,
];
for (const s of prodOAgente) {
  assert.ok(
    !AUTONOMOUS_STATES.includes(s),
    `"${s}" es de ciclo de producto/agente — no debe aparecer al azar en reposo`
  );
}
for (const s of PERSONALITY_DRIVEN_STATES) {
  assert.ok(!AUTONOMOUS_STATES.includes(s), `"${s}" es de interacción — no debe deambular`);
}

// pickWithoutRepeat no debe repetir el anterior, y sí debe cubrir el pool entero con suficientes tiradas
{
  let prev: string | null = null;
  const seenPicks = new Set<string>();
  for (let i = 0; i < 500; i++) {
    const next = pickWithoutRepeat(AUTONOMOUS_STATES as string[], prev);
    assert.notStrictEqual(next, prev, 'pickWithoutRepeat repitió el estado anterior');
    seenPicks.add(next);
    prev = next;
  }
  assert.strictEqual(
    seenPicks.size,
    AUTONOMOUS_STATES.length,
    `en 500 tiradas debieron aparecer los ${AUTONOMOUS_STATES.length} estados, salieron ${seenPicks.size}`
  );
}

// Con un solo elemento en el pool, no debe colgarse en un while(true)
assert.strictEqual(pickWithoutRepeat(['solo'], 'solo'), 'solo', 'pool de un solo estado debe devolverlo igual');

console.log(
  `OK — ${names.length} personalidades, ${stateNeedingMotion.length} estados y ` +
  `${AUTONOMOUS_STATES.length} reacciones deambulables, todo distinto, sin congelados/duplicados/mentiras`
);
