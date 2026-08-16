/**
 * Check de accesorios (zzz, sweat, storm, scribble, puff): cada uno debe
 * llegar al resorte y al SVG para CUALQUIER emoji, no solo el que lo trae
 * horneado de fábrica.
 *
 * El bug real que este check habría cazado: el resorte de cada instancia se
 * crea una sola vez a partir del `idle` inicial y solo anima las claves que
 * ya existían ahí. Si un accesorio no está en `createDefaultParams()`, un
 * emoji que no lo trae de fábrica (p.ej. Mochi con "storm") pide el valor
 * pero el resorte lo descarta en silencio — el número nunca llega, el SVG
 * nunca lo dibuja, y no hay ningún error que lo delate.
 *
 * Ejecutar:  node --experimental-strip-types src/render/accessories.check.ts
 */
import assert from 'node:assert';
import { LIB } from '../emojis/catalog.ts';
import { StateManager } from '../core/state.ts';
import { createMultiSpring } from '../core/spring.ts';
import { buildFace } from './svg.ts';

const sm = new StateManager();
const mochi = LIB.mochi; // no trae storm/scribble/sweat/puff horneados

type AccessoryKey = 'storm' | 'scribble' | 'sweat' | 'puff' | 'zzz';

function chainEndsAt(state: string, key: AccessoryKey, expected: number): number {
  const initialParams = sm.pickVariant(mochi.expressions.idle, 'idle');
  assert.ok(key in initialParams, `"${key}" debe existir ya en el idle inicial de todo emoji`);

  const springs = createMultiSpring(initialParams, { stiffness: 220, damping: 14 });
  const pool = sm.resolvePool(mochi.expressions, state);
  const target = sm.pickVariant(pool, state);
  assert.strictEqual(target[key], expected, `resolvePool("${state}") debe pedir ${key}=${expected}`);

  springs.setTargets(target);
  for (let i = 0; i < 500; i++) springs.update(1 / 60);

  const final = springs.getValues()[key];
  assert.ok(
    Math.abs(final - expected) < 0.01,
    `Mochi en "${state}" debe terminar con ${key}≈${expected}, dio ${final}`
  );
  return final;
}

const results: Record<string, number> = {
  storm: chainEndsAt('angry', 'storm', 1),
  scribble: chainEndsAt('confused', 'scribble', 1),
  sweat: chainEndsAt('drowsy', 'sweat', 0.8),
  puff: chainEndsAt('drowsy', 'puff', 0.7),
  zzz: chainEndsAt('sleeping', 'zzz', 1),
};

// El SVG debe dibujar de verdad el marcado de cada accesorio, no solo cargar el número
const base = sm.pickVariant(mochi.expressions.idle, 'idle');
const svgWith = (overrides: Partial<Record<AccessoryKey, number>>, time = 0) =>
  buildFace(mochi.silhouette, mochi.baseColor, { ...base, ...overrides } as never, 100, {}, time);

assert.ok(svgWith({ storm: 1 }).includes('#8a8a86'), 'las nubes del storm no aparecen en el SVG');
assert.ok(svgWith({ scribble: 1 }).includes('M -4 2 C 2 2'), 'el garabato no aparece en el SVG');
assert.ok(svgWith({ puff: 1 }, 0.9).includes('#B9BDB6'), 'la nubecita de resoplido no aparece en el SVG');
assert.ok(svgWith({ zzz: 1 }).includes('M 68 28 L 76 28'), 'el zzz no aparece en el SVG');

// El sudor debe ser VARIAS gotas, no una sola — se cuentan las apariciones
// del path base en un instante fijo (a esa hora las tres deben ser visibles)
const dropMarker = 'M 76 26 C 76 22 80 20';
const sweatDropCount = svgWith({ sweat: 1 }, 0.15).split(dropMarker).length - 1;
assert.ok(sweatDropCount > 1, `el sudor debe dibujar varias gotas, dibujó ${sweatDropCount}`);

// Dozy (la personalidad "tired") debe traer sweat+puff horneados en su propio idle,
// pero SIN zzz — zzz es "dormido", y Dozy está agotado, no dormido
const dozyIdle = LIB.dozy.expressions.idle[0];
assert.ok(
  dozyIdle.sweat > 0 && dozyIdle.puff > 0,
  'Dozy debe traer sweat+puff de fábrica en idle, no solo al pasar por el estado "drowsy"'
);
assert.strictEqual(dozyIdle.zzz, 0, 'Dozy no debe llevar zzz — está agotado, no dormido');

// Knot (la personalidad "stress") debe traer storm+scribble horneados en TODOS
// sus estados de interacción, no solo en idle — es su sello, no una visita
for (const stateName of ['idle', 'near', 'hover', 'click'] as const) {
  for (const variant of LIB.knot.expressions[stateName]) {
    assert.ok(
      variant.storm > 0 && variant.scribble > 0,
      `Knot en "${stateName}" debe traer storm+scribble de fábrica, no solo al pasar por "angry"/"confused"`
    );
  }
}

console.log(
  `OK — accesorios llegan al resorte y al SVG para un emoji sin horneado propio ` +
  `(${Object.entries(results).map(([k, v]) => `${k}=${v.toFixed(2)}`).join(', ')}); Dozy horneado`
);
