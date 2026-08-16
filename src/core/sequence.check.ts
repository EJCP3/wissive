/**
 * Check del reproductor de secuencias: orden de pasos en los tres modos.
 *
 * Lo que puede romperse en silencio es el rebote de ping-pong (repetir los
 * extremos, o salirse del array) y que `once` no pare nunca.
 *
 * Ejecutar:  node --experimental-strip-types src/core/sequence.check.ts
 */
import assert from 'node:assert';
import { createSequencePlayer, type SequenceStep, type SequenceMode } from './sequence.ts';

/** Reproduce una secuencia con tiempo simulado y devuelve el orden de pasos visitados */
function trace(steps: SequenceStep[], mode: SequenceMode, ticks: number): string[] {
  const visited: string[] = [];
  let completed = false;

  const player = createSequencePlayer({
    resolveStep: (step) => step.params ?? {},
    applyStep: (params) => visited.push(String((params as { id?: string }).id)),
  });

  player.play(steps, { mode, onComplete: () => { completed = true; } });

  // El player usa setTimeout; avanzamos el reloj drenando los timers pendientes
  for (let i = 0; i < ticks && !completed; i++) {
    const pending = (globalThis as unknown as { __drain?: () => void }).__drain;
    if (pending) pending();
  }
  return visited;
}

// setTimeout sincrónico y controlado: cada llamada guarda el callback,
// __drain ejecuta el que esté pendiente. Evita depender de temporizadores reales.
let pendingCb: (() => void) | null = null;
const realSetTimeout = globalThis.setTimeout;
const realClearTimeout = globalThis.clearTimeout;
(globalThis as unknown as { setTimeout: unknown }).setTimeout = ((cb: () => void) => {
  pendingCb = cb;
  return 1 as unknown as ReturnType<typeof setTimeout>;
}) as typeof setTimeout;
(globalThis as unknown as { clearTimeout: unknown }).clearTimeout = (() => {
  pendingCb = null;
}) as typeof clearTimeout;
(globalThis as unknown as { __drain: () => void }).__drain = () => {
  const cb = pendingCb;
  pendingCb = null;
  cb?.();
};

const STEPS: SequenceStep[] = [
  { params: { id: 'A' } as never },
  { params: { id: 'B' } as never },
  { params: { id: 'C' } as never },
];

// once — recorre una vez y para (no debe repetir ni desbordar)
assert.deepStrictEqual(trace(STEPS, 'once', 20), ['A', 'B', 'C'], 'modo once');

// loop — vuelve al principio indefinidamente
assert.deepStrictEqual(
  trace(STEPS, 'loop', 6).slice(0, 7),
  ['A', 'B', 'C', 'A', 'B', 'C', 'A'],
  'modo loop'
);

// ping-pong — rebota sin repetir los extremos
assert.deepStrictEqual(
  trace(STEPS, 'ping-pong', 8).slice(0, 9),
  ['A', 'B', 'C', 'B', 'A', 'B', 'C', 'B', 'A'],
  'modo ping-pong'
);

// Un solo paso en ping-pong no debe salirse del array ni congelar el bucle
assert.deepStrictEqual(
  trace([{ params: { id: 'solo' } as never }], 'ping-pong', 3).slice(0, 3),
  ['solo', 'solo', 'solo'],
  'ping-pong con un solo paso'
);

// Secuencia vacía no debe lanzar
assert.deepStrictEqual(trace([], 'loop', 3), [], 'secuencia vacía');

globalThis.setTimeout = realSetTimeout;
globalThis.clearTimeout = realClearTimeout;
console.log('OK — once, loop, ping-pong, paso único y secuencia vacía se comportan bien');
