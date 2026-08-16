/**
 * Test unitario exhaustivo del motor de física de resortes (makeSpring y createMultiSpring).
 *
 * Ejecutar: node --experimental-strip-types src/core/spring.check.ts
 */
import assert from 'node:assert';
import { makeSpring, createMultiSpring } from './spring.ts';

console.log('Testing makeSpring physics engine...');

// ─── 1. Condiciones iniciales ─────────────────────────────────────────────
const s1 = makeSpring(10);
assert.strictEqual(s1.state.current, 10, 'Initial current should be 10');
assert.strictEqual(s1.state.target, 10, 'Initial target should be 10');
assert.strictEqual(s1.state.velocity, 0, 'Initial velocity should be 0');

// Sin cambio de target, update() debe retornar false (no hay movimiento)
const moved0 = s1.update(0.016);
assert.strictEqual(moved0, false, 'Spring at rest should not move');
assert.strictEqual(s1.state.current, 10, 'Position must remain identical');

// ─── 2. Respuesta y Convergencia hacia nuevo Target ───────────────────────
s1.setTarget(20);
assert.strictEqual(s1.state.target, 20, 'Target should update to 20');

let frames = 0;
let isMoving = true;
const maxFrames = 300; // Máximo ~5 segundos a 60fps

while (isMoving && frames < maxFrames) {
  isMoving = s1.update(0.016); // 16.6ms por frame
  frames++;
}

assert.strictEqual(isMoving, false, `Spring must settle within ${maxFrames} frames (took ${frames})`);
assert.ok(
  Math.abs(s1.state.current - 20) < 0.001,
  `Spring current position (${s1.state.current}) must reach target (20)`
);
assert.strictEqual(s1.state.velocity, 0, 'Velocity must be 0 after settling');

console.log(`OK — Spring reached target and settled cleanly in ${frames} frames`);

// ─── 3. Comportamiento de setCurrent (teletransporte / reseteo) ───────────
s1.setCurrent(50);
assert.strictEqual(s1.state.current, 50, 'setCurrent must update current value immediately');
assert.strictEqual(s1.state.target, 50, 'setCurrent must update target value immediately');
assert.strictEqual(s1.state.velocity, 0, 'setCurrent must reset velocity to 0');
assert.strictEqual(s1.update(0.016), false, 'Spring should be at rest immediately after setCurrent');

console.log('OK — setCurrent correctly snaps value and cancels velocity');

// ─── 4. Estabilidad numérica con distintos pasos de tiempo (dt) ───────────
const dtList = [0.004, 0.008, 0.016, 0.033, 0.05]; // 240Hz, 120Hz, 60Hz, 30Hz, 20Hz

for (const dt of dtList) {
  const spring = makeSpring(0, { stiffness: 220, damping: 20 });
  spring.setTarget(100);

  let steps = 0;
  let active = true;
  while (active && steps < 1000) {
    active = spring.update(dt);
    // Verificar que nunca genere NaN ni valores infinitos
    assert.ok(!Number.isNaN(spring.state.current), `Current must not be NaN at dt=${dt}`);
    assert.ok(!Number.isNaN(spring.state.velocity), `Velocity must not be NaN at dt=${dt}`);
    assert.ok(Number.isFinite(spring.state.current), `Current must be finite at dt=${dt}`);
    steps++;
  }

  assert.strictEqual(active, false, `Spring must converge with dt=${dt}`);
  assert.ok(Math.abs(spring.state.current - 100) < 0.001, `Target reached at dt=${dt}`);
}

console.log('OK — Numerical stability verified across 240Hz, 120Hz, 60Hz, 30Hz and 20Hz frame rates');

// ─── 5. Test de createMultiSpring (resortes multidimensionales) ───────────
console.log('Testing createMultiSpring...');

const initialFace = {
  eyeOpen: 1.0,
  eyeScale: 1.0,
  mouthCurve: 0.5,
  mouthOpen: 0.0,
  bob: 0.0,
};

const multi = createMultiSpring(initialFace, { stiffness: 180, damping: 18 });
assert.deepStrictEqual(multi.getValues(), initialFace, 'Initial multi values must match');

multi.setTargets({
  eyeOpen: 0.1,
  mouthCurve: -0.6,
  bob: -10,
});

let multiFrames = 0;
let multiActive = true;

while (multiActive && multiFrames < 300) {
  multiActive = multi.update(0.016);
  multiFrames++;
}

const finalValues = multi.getValues();
assert.strictEqual(multiActive, false, 'MultiSpring must settle');
assert.ok(Math.abs(finalValues.eyeOpen - 0.1) < 0.001, 'eyeOpen reached target');
assert.ok(Math.abs(finalValues.mouthCurve - (-0.6)) < 0.001, 'mouthCurve reached target');
assert.ok(Math.abs(finalValues.bob - (-10)) < 0.001, 'bob reached target');
assert.strictEqual(finalValues.eyeScale, 1.0, 'Untouched target eyeScale remained intact');

// Test setValues (teletransporte simultáneo)
multi.setValues({ eyeOpen: 0.9, bob: 5 });
const snappedValues = multi.getValues();
assert.strictEqual(snappedValues.eyeOpen, 0.9, 'snapped eyeOpen value verified');
assert.strictEqual(snappedValues.bob, 5, 'snapped bob value verified');
assert.strictEqual(multi.update(0.016), false, 'MultiSpring must be at rest after setValues');

console.log('OK — createMultiSpring handles concurrent parameter updates and settling accurately');
