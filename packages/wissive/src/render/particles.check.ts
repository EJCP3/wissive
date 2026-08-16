/**
 * Check de partículas: cada emoción debe tener identidad propia.
 *
 * El bug era que 10 de las 14 emociones compartían rama del switch
 * (happy/pleasure, sad/disappointed, anxiety/stress, tired/sleepy, y
 * normal/numbness cayendo al default), así que se veían idénticas.
 *
 * Ejecutar:  node --experimental-strip-types src/render/particles.check.ts
 */
import assert from 'node:assert';
import { ParticleEmitter } from './particles.ts';
import { LIB } from '../emojis/catalog.ts';

// El emisor toca DOM y canvas; con estos stubs basta para inspeccionar
// qué partículas genera sin necesidad de un navegador.
const canvasStub = {
  width: 0,
  height: 0,
  style: {} as Record<string, string>,
  getContext: () => ({ clearRect() {}, save() {}, restore() {}, translate() {}, rotate() {}, beginPath() {}, moveTo() {}, lineTo() {}, arc() {}, fill() {}, stroke() {}, closePath() {}, quadraticCurveTo() {}, bezierCurveTo() {}, fillRect() {} }),
  remove() {},
};
(globalThis as unknown as { document: unknown }).document = {
  createElement: () => ({ ...canvasStub, style: {} }),
};
(globalThis as unknown as { window: unknown }).window = { devicePixelRatio: 1 };
(globalThis as unknown as { requestAnimationFrame: unknown }).requestAnimationFrame = () => 0;
(globalThis as unknown as { cancelAnimationFrame: unknown }).cancelAnimationFrame = () => {};

const host = { style: {} as Record<string, string>, appendChild() {} };

/** Huella de una emoción: formas usadas, paleta y sentido del movimiento */
function fingerprint(emotion: string): string {
  const emitter = new ParticleEmitter(host as never, 120);
  const shapes = new Set<string>();
  const colors = new Set<string>();
  let vySum = 0;
  let sizeSum = 0;
  let count = 0;

  // Varias tandas: `isAccent` es aleatorio, así se ven ambas formas
  for (let run = 0; run < 40; run++) {
    const particles = (emitter as unknown as { particles: Array<Record<string, unknown>> }).particles;
    particles.length = 0;
    emitter.burst(emotion, 6);
    for (const p of particles) {
      shapes.add(String(p.shape));
      colors.add(String(p.color));
      vySum += Number(p.vy);
      sizeSum += Number(p.size);
      count += 1;
    }
  }

  return JSON.stringify({
    shapes: [...shapes].sort(),
    colors: [...colors].sort(),
    sube: vySum / count < 0,
    tam: (sizeSum / count).toFixed(1),
  });
}

const emotions = Object.values(LIB).map((d) => d.emotion);
assert.strictEqual(new Set(emotions).size, 14, 'se esperaban 14 emociones distintas en el catálogo');

// Ninguna emoción puede caer al default: eso significaría no tener identidad
const seen = new Map<string, string>();
for (const emotion of emotions) {
  const fp = fingerprint(emotion);
  const twin = seen.get(fp);
  assert.strictEqual(
    twin,
    undefined,
    `las emociones "${emotion}" y "${twin}" generan partículas idénticas`
  );
  seen.set(fp, emotion);
}

// La forma manda sobre el color: dos emociones con las mismas figuras se leen
// igual aunque cambie la paleta (le pasaba a flutter y surprised, ambas star+burst).
const seenShapes = new Map<string, string>();
for (const emotion of emotions) {
  const shapes = JSON.parse(fingerprint(emotion)).shapes.join('+');
  const twin = seenShapes.get(shapes);
  assert.strictEqual(
    twin,
    undefined,
    `"${emotion}" y "${twin}" usan las mismas formas (${shapes}); el color solo no basta`
  );
  seenShapes.set(shapes, emotion);
}

// Y ninguna debe coincidir con el fallback genérico
const fallback = fingerprint('__emocion_inexistente__');
for (const emotion of emotions) {
  assert.notStrictEqual(
    fingerprint(emotion),
    fallback,
    `"${emotion}" está cayendo al default en vez de tener su propia rama`
  );
}

console.log(`OK — ${emotions.length} emociones con partículas propias, ninguna repetida ni genérica`);
