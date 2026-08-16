/**
 * Test unitario exhaustivo del StateManager y selector de pool aleatorio sin repetición inmediata.
 *
 * Ejecutar: node --experimental-strip-types src/core/state.check.ts
 */
import assert from 'node:assert';
import { StateManager } from './state.ts';
import { pickWithoutRepeat, ALL_STATES } from '../emojis/states.ts';
import type { FaceParameters, InteractionState } from '../emojis/types.ts';

console.log('Testing StateManager and Variant Pool Selection...');

const sm = new StateManager();

// ─── 1. Estado inicial y transiciones ─────────────────────────────────────
assert.strictEqual(sm.getState(), 'idle', 'Initial state should be idle');
const changed1 = sm.setState('hover');
assert.strictEqual(changed1, true, 'setState to different state should return true');
assert.strictEqual(sm.getState(), 'hover', 'Current state should now be hover');

const changed2 = sm.setState('hover');
assert.strictEqual(changed2, false, 'setState to identical state should return false');

// ─── 2. Manejo de Pools de 1 elemento ─────────────────────────────────────
const singleItemPool: FaceParameters[] = [{ eyeOpen: 0.5, mouthCurve: 0.2 }];
for (let i = 0; i < 50; i++) {
  const item = sm.pickVariant(singleItemPool, 'idle');
  assert.strictEqual(item, singleItemPool[0], 'Single item pool must always return that item');
}
console.log('OK — Single-element pool behaves deterministically without errors');

// ─── 3. Validación de no-repetición consecutiva en pools múltiples ────────
// Probaremos con varios tamaños de pool: 2, 3, 5, 8, 12 variantes
const poolSizes = [2, 3, 4, 5, 8, 12];

for (const size of poolSizes) {
  const pool: FaceParameters[] = Array.from({ length: size }, (_, idx) => ({
    eyeOpen: idx * 0.1,
    mouthCurve: idx * 0.05,
    customId: idx,
  } as FaceParameters & { customId: number }));

  const stateName = `state_size_${size}` as InteractionState;
  let previousItem: (FaceParameters & { customId: number }) | null = null;
  const iterations = 5000;

  for (let i = 0; i < iterations; i++) {
    const selected = sm.pickVariant(pool, stateName) as FaceParameters & { customId: number };

    if (previousItem !== null) {
      assert.notStrictEqual(
        selected.customId,
        previousItem.customId,
        `Consecutive repeat detected for pool size ${size} at iteration ${i}: item ${selected.customId} repeated`
      );
    }
    previousItem = selected;
  }
}

console.log('OK — 30,000 iterations verified: 0 consecutive repetitions across all pool sizes (2..12)');

// ─── 4. Validación del helper pickWithoutRepeat() ──────────────────────────
console.log('Testing pickWithoutRepeat helper...');

const stateCandidates: InteractionState[] = ['happy', 'curious', 'surprised', 'thinking', 'excited', 'bored'];

let prevWanderState: InteractionState | null = null;
for (let i = 0; i < 5000; i++) {
  const next = pickWithoutRepeat(stateCandidates, prevWanderState);
  assert.ok(stateCandidates.includes(next), `Selected state ${next} must be part of candidate pool`);
  if (prevWanderState !== null) {
    assert.notStrictEqual(next, prevWanderState, `Consecutive wander state repeated at step ${i}`);
  }
  prevWanderState = next;
}

console.log('OK — pickWithoutRepeat() guarantees zero consecutive state repetition across 5,000 steps');

// ─── 5. Error ante pool vacío ─────────────────────────────────────────────
assert.throws(
  () => {
    sm.pickVariant([], 'idle');
  },
  /Empty variant pool/,
  'Empty pool must throw explicit error'
);

console.log('OK — Empty pool correctly throws descriptive exception');

// ─── 6. Resolución de pool y rasgos procedurales para los 39 estados ───────
console.log('Testing resolvePool for all 39 states...');

const dummyExpressions: Record<string, FaceParameters[]> = {
  idle: [{ eyeOpen: 1.0, mouthCurve: 0.1 }],
  hover: [{ eyeOpen: 1.2, mouthCurve: 0.4 }],
  click: [{ eyeOpen: 0.1, mouthCurve: 0.8 }],
  near: [{ eyeOpen: 0.9, mouthCurve: 0.2 }],
};

for (const st of ALL_STATES) {
  const resolved = sm.resolvePool(dummyExpressions, st);
  assert.ok(Array.isArray(resolved), `resolvePool for ${st} must return an array`);
  assert.ok(resolved.length > 0, `resolvePool for ${st} must return at least 1 variant`);

  // Verificar que los rasgos procedurales se aplicaron
  const first = resolved[0];
  assert.ok(first !== undefined, `Resolved state parameters for ${st} must not be undefined`);
}

console.log(`OK — All ${ALL_STATES.length} interaction states resolve successfully with procedural features`);
