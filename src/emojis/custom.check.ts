/**
 * Check del "banco de animaciones" de emojis personalizados (stateBank):
 * qué estados puede deambular por su cuenta un emoji custom.
 *
 * A diferencia del deambular genérico (AUTONOMOUS_STATES, solo "Reacciones"),
 * el banco de un custom lo elige explícitamente quien lo arma — por eso aquí
 * SÍ se permiten estados de "Ciclo de producto"/"Morfos de agente"
 * (ALL_WANDERABLE_STATES); lo único que sigue sin tener sentido es
 * idle/near/hover/click, que no se "visitan", los decide la interacción real.
 *
 * Ejecutar:  node --experimental-strip-types src/emojis/custom.check.ts
 */
import assert from 'node:assert';
import { buildCustomEmoji } from './custom.ts';
import {
  AUTONOMOUS_STATES,
  ALL_WANDERABLE_STATES,
  PERSONALITY_DRIVEN_STATES,
  resolveAutonomousStatePool,
} from './states.ts';

// 1. Sin stateBank: no debe fijar autonomousStatePool (así hereda el genérico)
const withoutBank = buildCustomEmoji('t1', {});
assert.strictEqual(
  withoutBank.autonomousStatePool,
  undefined,
  'sin stateBank, el custom no debe fijar autonomousStatePool (debe heredar el genérico)'
);

// 2. Con stateBank válido: debe quedar tal cual en la definición
const withBank = buildCustomEmoji('t2', { stateBank: ['happy', 'curious', 'sad'] });
assert.deepStrictEqual(
  withBank.autonomousStatePool,
  ['happy', 'curious', 'sad'],
  'el stateBank válido debe pasar íntegro a la definición'
);

// 3. Un estado de "ciclo de producto"/"agente" (uploading, thinking) SÍ debe
//    sobrevivir — a diferencia del deambular genérico, aquí es elección explícita
const withProductStates = buildCustomEmoji('t3', {
  stateBank: ['happy', 'uploading', 'thinking', 'sad'] as never,
});
assert.deepStrictEqual(
  withProductStates.autonomousStatePool,
  ['happy', 'uploading', 'thinking', 'sad'],
  'uploading/thinking son elección válida en el banco de un custom explícito'
);

// 4. idle/near/hover/click SÍ deben filtrarse — no se "visitan" al deambular
const withInteractionStates = buildCustomEmoji('t4', {
  stateBank: ['happy', 'idle', 'click', 'sad'] as never,
});
assert.deepStrictEqual(
  withInteractionStates.autonomousStatePool,
  ['happy', 'sad'],
  'idle/near/hover/click no deben poder entrar al banco de deambular'
);

// 5. stateBank vacío o solo-interacción no debe dejar un array vacío colgado
//    (mejor undefined = "usa el genérico" que un banco que nunca deambula)
const allInteraction = buildCustomEmoji('t5', { stateBank: PERSONALITY_DRIVEN_STATES });
assert.strictEqual(
  allInteraction.autonomousStatePool,
  undefined,
  'si todo el stateBank es de interacción, debe quedar undefined (usa el genérico), no []'
);

// 6. Todo ALL_WANDERABLE_STATES debe sobrevivir el filtro íntegro (los 38)
const fullBank = buildCustomEmoji('t6', { stateBank: ALL_WANDERABLE_STATES });
assert.deepStrictEqual(fullBank.autonomousStatePool, ALL_WANDERABLE_STATES);
assert.strictEqual(ALL_WANDERABLE_STATES.length, 38, `se esperaban 38, hay ${ALL_WANDERABLE_STATES.length}`);

// 7. resolveAutonomousStatePool: prioridad opción > definición > genérico
assert.deepStrictEqual(resolveAutonomousStatePool(['a'] as never, ['b'] as never), ['a']);
assert.deepStrictEqual(resolveAutonomousStatePool(undefined, ['b'] as never), ['b']);
assert.deepStrictEqual(resolveAutonomousStatePool(undefined, undefined), AUTONOMOUS_STATES);

console.log(
  `OK — banco de animaciones de emojis personalizados: ${ALL_WANDERABLE_STATES.length} estados ` +
  `elegibles a mano, interacción filtrada, herencia y prioridad correctos`
);
