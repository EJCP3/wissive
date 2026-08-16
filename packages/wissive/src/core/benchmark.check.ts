/**
 * Benchmark de rendimiento y prueba de estrés para múltiples instancias simultáneas.
 *
 * Requisito Fase 9: Test de rendimiento con 50+ instancias simultáneas sin caída de FPS.
 *
 * Ejecutar: node --experimental-strip-types src/core/benchmark.check.ts
 */
import assert from 'node:assert';
import { createMultiSpring } from './spring.ts';
import type { MultiSpring } from './spring.ts';
import { StateManager } from './state.ts';
import { getEmojiDefinition } from '../emojis/catalog.ts';
import { buildFace } from '../render/svg.ts';
import type { FaceParameters, EmojiDefinition } from '../emojis/types.ts';

console.log('─── Wissive Multi-Instance Performance & Stress Benchmark ───\n');

const emojiNames = [
  'mochi', 'zumi', 'suri', 'nima', 'cota', 'dozy', 'snug',
  'lumo', 'wilt', 'fidge', 'knot', 'brix', 'pip', 'void'
];

interface MockInstance {
  definition: EmojiDefinition;
  springs: MultiSpring<FaceParameters>;
  stateManager: StateManager;
  idleTime: number;
}

function createBenchmarkInstance(name: string): MockInstance {
  const definition = getEmojiDefinition(name) || getEmojiDefinition('mochi')!;
  const stateManager = new StateManager();
  const initialPool = definition.expressions.idle;
  const initialParams = stateManager.pickVariant(initialPool, 'idle');
  const springs = createMultiSpring(initialParams, {
    stiffness: definition.motion.stiffness,
    damping: definition.motion.damping,
  });

  return {
    definition,
    springs,
    stateManager,
    idleTime: Math.random() * 100,
  };
}

function runStressTest(instanceCount: number, totalFrames = 120): {
  instanceCount: number;
  totalTimeMs: number;
  avgFrameMs: number;
  maxFrameMs: number;
  fpsEquivalent: number;
} {
  // Instanciar los emojis distribuidos entre los 14 personajes del catálogo
  const instances: MockInstance[] = [];
  for (let i = 0; i < instanceCount; i++) {
    const name = emojiNames[i % emojiNames.length];
    instances.push(createBenchmarkInstance(name));
  }

  // Provocar cambios de estado y objetivos de resorte en un 30% de las instancias cada 15 frames
  const frameDurations: number[] = [];
  const dt = 0.016; // 60 FPS delta

  const startMemory = process.memoryUsage().heapUsed;
  const startTime = performance.now();

  for (let f = 0; f < totalFrames; f++) {
    const frameStart = performance.now();

    // Trigger de interacción periódica
    if (f % 15 === 0) {
      for (let i = 0; i < instances.length; i += 3) {
        const inst = instances[i];
        const state = f % 30 === 0 ? 'hover' : (f % 45 === 0 ? 'click' : 'idle');
        inst.stateManager.setState(state);
        const pool = inst.stateManager.resolvePool(inst.definition.expressions, state);
        const target = inst.stateManager.pickVariant(pool, state);
        inst.springs.setTargets(target);
      }
    }

    // Loop de simulación por frame (física de resorte + generación SVG)
    for (let i = 0; i < instances.length; i++) {
      const inst = instances[i];
      inst.idleTime += dt;
      inst.springs.update(dt);
      const params = inst.springs.getValues();

      // Renderizado de rostro por código (SVG)
      buildFace(
        inst.definition.silhouette,
        inst.definition.baseColor,
        params,
        120,
        { flipX: false, emphasis: false },
        inst.idleTime
      );
    }

    const frameEnd = performance.now();
    frameDurations.push(frameEnd - frameStart);
  }

  const totalTimeMs = performance.now() - startTime;
  const endMemory = process.memoryUsage().heapUsed;
  const memoryDeltaMB = (endMemory - startMemory) / (1024 * 1024);

  const avgFrameMs = frameDurations.reduce((a, b) => a + b, 0) / totalFrames;
  const maxFrameMs = Math.max(...frameDurations);
  const fpsEquivalent = 1000 / avgFrameMs;

  console.log(`[${instanceCount} instancias simultáneas x ${totalFrames} frames]`);
  console.log(`  • Tiempo total:       ${totalTimeMs.toFixed(2)} ms`);
  console.log(`  • Promedio por frame: ${avgFrameMs.toFixed(3)} ms (Frame budget: 16.6 ms)`);
  console.log(`  • Frame más pesado:   ${maxFrameMs.toFixed(3)} ms`);
  console.log(`  • FPS equivalente:    ${fpsEquivalent.toFixed(0)} FPS`);
  console.log(`  • Memoria Heap Delta: ${memoryDeltaMB.toFixed(2)} MB\n`);

  return {
    instanceCount,
    totalTimeMs,
    avgFrameMs,
    maxFrameMs,
    fpsEquivalent,
  };
}

// ─── Ejecutar pruebas de estrés para 50, 100 y 200 instancias ───────────────
const result50 = runStressTest(50, 120);
const result100 = runStressTest(100, 120);
const result200 = runStressTest(200, 120);

// ─── Validaciones de Requerimientos de Rendimiento (Fase 9) ────────────────
// 50 instancias deben procesar el frame completo holgadamente en < 16.6ms (objetivo < 6ms)
assert.ok(
  result50.avgFrameMs < 6.0,
  `50 instances frame time (${result50.avgFrameMs.toFixed(2)}ms) must be under 6ms (well within 16.6ms 60fps limit)`
);

// 100 instancias deben mantenerse por debajo del frame budget de 16.6ms
assert.ok(
  result100.avgFrameMs < 16.6,
  `100 instances frame time (${result100.avgFrameMs.toFixed(2)}ms) must remain below 16.6ms (60 FPS)`
);

console.log('✅ Criterio de cierre Fase 9 superado: 50 y 100 instancias simultáneas corren holgadamente a 60+ FPS sin saturar el CPU.');
