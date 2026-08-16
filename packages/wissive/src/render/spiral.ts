/**
 * Puntos de una espiral de Arquímedes, en radio unitario (0 en el centro, 1
 * en el borde) — la misma figura que usa el burst de partículas de Knot
 * (`particles.ts`, shape 'spiral') y el ojo de garabato (`svg.ts`, eyeType 18).
 * Un solo lugar para la matemática: si cambia el giro, cambia en los dos sitios a la vez.
 */
export function spiralPoints(turns = 2.2, step = 0.25): Array<[number, number]> {
  const points: Array<[number, number]> = [];
  const maxAngle = turns * Math.PI * 2;
  for (let a = 0; a <= maxAngle; a += step) {
    const r = a / maxAngle;
    points.push([Math.cos(a) * r, Math.sin(a) * r]);
  }
  return points;
}
