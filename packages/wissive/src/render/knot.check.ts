/**
 * Check de Knot (stress): ojos de garabato + boca de línea recta.
 *
 * El ojo de garabato (svg.ts, eyeType 18) debe ser LITERALMENTE la misma
 * espiral que ya dibuja el burst de partículas de Knot (particles.ts, shape
 * 'spiral') — ambos consumen `spiralPoints()` de spiral.ts. El riesgo real
 * aquí no es "que no se vea bien", es que alguien reimplemente la fórmula a
 * mano en un tercer sitio y las dos espirales empiecen a divergir sin que
 * nadie lo note; este check falla si eso pasa.
 *
 * Ejecutar:  node --experimental-strip-types src/render/knot.check.ts
 */
import assert from 'node:assert';
import { readFileSync } from 'node:fs';
import { LIB } from '../emojis/catalog.ts';
import { buildFace } from './svg.ts';
import { spiralPoints } from './spiral.ts';

// 1. Knot debe seguir usando ojos de garabato + boca de línea en los 4 estados
const knot = LIB.knot;
for (const stateName of ['idle', 'near', 'hover', 'click'] as const) {
  for (const p of knot.expressions[stateName]) {
    assert.strictEqual(p.eyeType, 18, `Knot en "${stateName}" debe usar eyeType 18 (garabato)`);
    assert.strictEqual(p.mouthType, 3, `Knot en "${stateName}" debe usar mouthType 3 (línea recta)`);
  }
}

// 2. El SVG debe dibujar la boca como <line> de verdad
const p = knot.expressions.idle[0];
const svg = buildFace(knot.silhouette, knot.baseColor, p, 100, {}, 0);
assert.ok(svg.includes('<line'), 'la boca de Knot no aparece como <line> en el SVG');

// 3. svg.ts (ojo) y particles.ts (partícula 'spiral' de Knot) deben consumir
//    spiralPoints() de spiral.ts — ninguno debe traer su propia copia de la
//    fórmula, o dejarán de ser "el mismo garabato" en cuanto alguien la toque
const svgSource = readFileSync(new URL('./svg.ts', import.meta.url), 'utf8');
const particlesSource = readFileSync(new URL('./particles.ts', import.meta.url), 'utf8');

assert.ok(svgSource.includes("from './spiral"), 'svg.ts debe importar spiralPoints de spiral.ts');
assert.ok(particlesSource.includes("from './spiral"), 'particles.ts debe importar spiralPoints de spiral.ts');

// Fórmula vieja que existió antes de compartir el código — si vuelve a aparecer,
// alguien la reimplementó a mano en vez de reusar spiralPoints()
const inlineFormula = /Math\.PI \* 2\)\s*\*\s*s\s*\*\s*0\.85/;
assert.ok(!inlineFormula.test(particlesSource), 'particles.ts tiene la fórmula de espiral duplicada a mano');

// 4. spiralPoints() debe producir una secuencia real (no vacía ni degenerada),
//    arrancando en el centro (radio 0) y creciendo hacia afuera hasta el borde (radio ≈ 1)
const pts = spiralPoints();
assert.ok(pts.length > 20, `spiralPoints() da muy pocos puntos para leerse como espiral: ${pts.length}`);
assert.deepStrictEqual(pts[0], [0, 0], 'la espiral debe arrancar en el centro (radio 0)');
const [lastX, lastY] = pts[pts.length - 1];
assert.ok(Math.abs(Math.hypot(lastX, lastY) - 1) < 0.05, 'la espiral debe terminar cerca del borde (radio ≈ 1)');

console.log(
  `OK — Knot: ojos de garabato + boca de línea recta; ojo y partícula comparten ` +
  `spiralPoints() (${pts.length} puntos), sin fórmula duplicada`
);
