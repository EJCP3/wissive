import type { FaceParameters, SilhouetteType } from '../emojis/types';
import { spiralPoints } from './spiral.ts';
import { generateSilhouettePath } from './silhouette.ts';

export function getSilhouettePath(silhouette: SilhouetteType): string {
  switch (silhouette) {
    case 'circle':
      // Círculo perfecto — base neutra para emojis personalizados
      return 'M 50 13 A 37 37 0 1 0 50 87 A 37 37 0 1 0 50 13 Z';

    case 'heart':
      return 'M 50 21.67 C 54.17 17.5 65 12.5 74.17 16.67 C 85 21.67 89.17 35.83 85 48.33 C 80.83 61.67 66.67 74.17 50 74.17 C 33.33 74.17 19.17 61.67 15 48.33 C 10.83 35.83 15 21.67 25.83 16.67 C 35 12.5 45.83 17.5 50 21.67 Z';

    case 'capsule':
      // Silueta 1: Cápsula Horizontal
      return 'M 26 26 L 74 26 C 88 26 88 74 74 74 L 26 74 C 12 74 12 26 26 26 Z';

    case 'rounded-squircle':
      // Silueta 2: Cuadrado Hiper-Redondeado
      return 'M 32 18 L 68 18 C 84 18 84 32 84 50 C 84 68 84 82 68 82 L 32 82 C 16 82 16 68 16 50 C 16 32 16 18 32 18 Z';

    case 'pear-blob':
      // Silueta 3: Perita / Base Ancha
      return 'M 50 14 C 66 14 72 32 80 54 C 86 70 80 86 50 86 C 20 86 14 70 20 54 C 28 32 34 14 50 14 Z';

    case 'egg-oval':
      // Silueta 4: Huevo Invertido / Cúpula
      return 'M 18 54 C 18 26 32 14 50 14 C 68 14 82 26 82 54 C 82 74 70 84 50 84 C 30 84 18 74 18 54 Z';

    case 'starburst-puff':
      // Silueta 5: Bloque de 4 Abultamientos
      return 'M 34 18 C 50 24 50 24 66 18 C 78 18 84 30 80 46 C 84 62 78 82 66 82 C 50 76 50 76 34 82 C 22 82 16 62 20 46 C 16 30 22 18 34 18 Z';

    case 'pill-vertical':
      // Silueta 6: Cápsula Alta Vertical
      return 'M 26 28 C 26 12 74 12 74 28 L 74 72 C 74 88 26 88 26 72 Z';

    case 'round-blob':
      // Zumi / flutter
      return 'M 86.5 53.64 C 86.5 73.98 70.16 77.2 50 77.2 C 29.84 77.2 13.5 73.98 13.5 53.64 C 13.5 33.29 29.84 16.8 50 16.8 C 70.16 16.8 86.5 33.29 86.5 53.64 Z';

    case 'ghost-blob':
      return 'M 50 14.17 C 70 14.17 83.33 29.17 83.33 47.5 L 83.33 70 C 83.33 75 78.33 75.83 75.83 71.67 C 73.33 65.83 67.5 65.83 65 71.67 C 62.5 77.5 56.67 77.5 54.17 71.67 C 51.67 65.83 45.83 65.83 43.33 71.67 C 40.83 77.5 35 77.5 32.5 71.67 C 30 65.83 24.17 65.83 21.67 71.67 C 19.17 75.83 16.67 75 16.67 70 L 16.67 47.5 C 16.67 29.17 30 14.17 50 14.17 Z';

    case 'oval':
      return 'M 45.24 12.83 C 58.45 10.98 74.32 28.1 76.87 46.26 C 79.31 63.59 69.61 78.41 54.76 80.5 C 39.9 82.59 26.49 71.01 24.06 53.68 C 21.51 35.52 32.04 14.69 45.24 12.83 Z';

    case 'elongated-oval':
      // Suri / pleasure
      return 'M 86.38 54.82 C 87.03 78.56 86.38 75.48 49.94 76.67 C 13.52 77.86 13.5 75.67 13.5 54.82 C 13.5 33.97 29.81 17.07 49.94 17.07 C 70.06 17.07 86.38 33.97 86.38 54.82 Z';

    case 'teardrop-blob':
      return 'M 50 14.17 C 70 14.17 84.17 28.33 84.17 47.5 C 84.17 69.17 69.17 81.67 49.17 81.67 C 30 81.67 15.83 68.33 15.83 47.5 C 15.83 28.33 30 14.17 50 14.17 Z';

    case 'flame-blob':
      return 'M 20 43.33 L 25.83 18.33 L 36.67 35 L 47.5 13.33 L 58.33 33.33 L 70 20 L 75.83 43.33 C 82.5 51.67 80 65.83 70 74.17 C 58.33 83.33 38.33 81.67 27.5 72.5 C 18.33 65 14.17 51.67 20 43.33 Z';

    case 'droopy-blob':
      // Wilt / disappointed — cuerpo + dos brazos laterales
      return 'M 47.83 15.03 C 64.86 12.2 79.26 26.85 79.26 43.84 C 79.26 62.72 77.35 73.65 59.63 78.17 C 41.9 82.69 18.53 73.61 19.16 56.42 C 19.16 33.97 20.59 24.37 35.7 17.57 C 39.66 15.66 43.78 15.72 47.83 15.03 Z M 13.5 49.19 A 6.92 6.92 0 1 0 27.34 49.19 A 6.92 6.92 0 1 0 13.5 49.19 Z M 72.66 49.19 A 6.92 6.92 0 1 0 86.5 49.19 A 6.92 6.92 0 1 0 72.66 49.19 Z';

    case 'bear-blob':
      // Knot / stress — cuerpo + dos orejas
      return 'M 85.2 51.24 C 85.2 71.22 69.15 78.94 49.35 78.94 C 29.55 78.94 13.5 71.22 13.5 51.24 C 13.5 31.26 29.55 15.06 49.35 15.06 C 69.15 15.06 85.2 31.26 85.2 51.24 Z M 86.5 29.08 C 86.5 34.3 81.98 38.53 76.4 38.53 C 70.82 38.53 66.29 34.3 66.29 29.08 C 66.29 23.86 70.82 19.63 76.4 19.63 C 81.98 19.63 86.5 23.86 86.5 29.08 Z M 13.5 29.08 A 10.1 9.45 0 1 0 33.7 29.08 A 10.1 9.45 0 1 0 13.5 29.08 Z';

    case 'spiky-blob':
      return 'M 50 12 C 76 12 88 26 88 48 C 88 64 88 78 84 86 C 78 82 72 92 64 86 C 56 82 50 90 44 86 C 36 92 30 82 12 48 C 12 26 24 12 50 12 Z';

    case 'cloud-blob':
      return 'M 50 12.5 C 60 9.17 69.17 15.83 71.67 21.67 C 79.17 24.17 83.33 32.5 80.83 40 C 85.83 47.5 83.33 57.5 78.33 61.67 C 76.67 70.83 68.33 76.67 60 74.17 C 53.33 80 42.5 80 35.83 74.17 C 27.5 76.67 20 70 18.33 61.67 C 13.33 56.67 11.67 47.5 16.67 40 C 14.17 32.5 20 24.17 27.5 21.67 C 30.83 15 40 9.17 50 12.5 Z';

    case 'wide-oval':
      // Dozy / tired — silueta relajada con base pesada y caída
      return 'M 50 25 C 74 25 88 35 88 56 C 88 74 72 82 50 82 C 28 82 12 74 12 56 C 12 35 26 25 50 25 Z';

    case 'soft-round':
      return 'M 50 15 C 73.33 15 85 26.67 85 48.33 C 85 70 73.33 80 50 80 C 26.67 80 15 70 15 48.33 C 15 26.67 26.67 15 50 15 Z';

    case 'octopus-blob':
      return 'M 50 12.5 C 70 12.5 83.33 27.5 83.33 47.5 L 83.33 65.83 C 83.33 73.33 77.5 75 74.17 69.17 C 71.67 65 66.67 65 64.17 69.17 C 61.67 73.33 56.67 73.33 54.17 69.17 C 51.67 65 46.67 65 44.17 69.17 C 41.67 73.33 36.67 73.33 34.17 69.17 C 31.67 65 26.67 65 24.17 69.17 C 20.83 75 16.67 73.33 16.67 65.83 L 16.67 47.5 C 16.67 27.5 30 12.5 50 12.5 Z';

    case 'wave-blob':
      return 'M 50 13.33 C 63.33 13.33 75 20 76.67 31.67 C 77.5 40 70 43.33 76.67 50 C 82.5 56.67 75 73.33 56.67 76.67 C 50 78.33 43.33 78.33 36.67 75.83 C 21.67 70.83 17.5 58.33 23.33 51.67 C 28.33 45.83 21.67 41.67 23.33 33.33 C 25.83 20.83 36.67 13.33 50 13.33 Z';

    default:
      return 'M 50 12 C 78 12 90 26 90 52 C 90 78 78 88 50 88 C 22 88 10 78 10 52 C 10 26 22 12 50 12 Z';
  }
}

export interface RenderOptions {
  flipX?: boolean;
  emphasis?: boolean;
  radii?: number[];
}

/**
 * Trazo de garabato en coordenadas locales (centrado en 0,0, radio ~10) — una
 * sola figura reutilizada tanto para el ojo de garabato como para la nubecita
 * de confusión sobre la cabeza, para que sean literalmente "el mismo garabato".
 */
const SCRIBBLE_LOCAL_PATH =
  'M -4 2 C 2 2 5 -2 1 -5 C -3 -8 -10 -6 -10 -1 C -10 5 -2 8 4 4 C 9 1 7 -6 0 -7';

function buildScribbleGroup(
  cx: number,
  cy: number,
  scale: number,
  color: string,
  strokeWidth: number,
  extraAttrs = ''
): string {
  return `<g transform="translate(${cx.toFixed(2)}, ${cy.toFixed(2)}) scale(${scale.toFixed(3)})" ${extraAttrs}>
    <path d="${SCRIBBLE_LOCAL_PATH}" stroke="${color}" stroke-width="${(strokeWidth / scale).toFixed(2)}" stroke-linecap="round" stroke-linejoin="round" fill="none" />
  </g>`;
}

export function buildFace(
  silhouette: SilhouetteType,
  baseColor: string,
  params: FaceParameters,
  size: number,
  renderOptions: RenderOptions = {},
  time: number = 0
): string {
  const currentTime = time || (typeof performance !== 'undefined' ? performance.now() / 1000 : Date.now() / 1000);

  const strokeColor = '#2C2C2A';
  const cheekColor = '#F0997B';
  const STROKE_W = 3.5;

  let silhouetteParts = '';
  if (renderOptions.radii && renderOptions.radii.length > 0) {
    // Estado de metamorfosis activa: trazado continuo fluido Catmull-Rom de 64 muestras
    const morphPath = generateSilhouettePath(renderOptions.radii);
    silhouetteParts = `<path class="wissive-silhouette-path" d="${morphPath}" fill="${baseColor}" />`;
  } else {
    // Estado estático oficial: SVG exacto de alta fidelidad con todas sus subpartes (orejas, brazos, curvas)
    const silhouettePath = getSilhouettePath(silhouette);
    silhouetteParts = silhouettePath
      .split(/(?=M )/)
      .map((d) => d.trim())
      .filter(Boolean)
      .map((d) => `<path class="wissive-silhouette-path" d="${d}" fill="${baseColor}" />`)
      .join('');
  }

  const { flipX = false, emphasis = false } = renderOptions;

  const gazeX = Math.max(-13.2, Math.min(13.2, params.gazeX ?? 0));
  const gazeY = Math.max(-8.4, Math.min(8.4, params.gazeY ?? 0));

  const eyeHalfGap = (params.eyeGap ?? 32) / 2;
  const baseEyeY = (params.eyeY ?? 45) + gazeY;
  const rawLeftEyeX = 50 - eyeHalfGap + gazeX;
  const rawRightEyeX = 50 + eyeHalfGap + gazeX;

  const headRadius = 40;
  const headCenterX = 50 + (params.shiftX ?? 0);
  const turn = params.turnAngle ?? 0;

  const computeSphericalProjection = (rawX: number) => {
    const offset = rawX - headCenterX;
    const clampedOffset = Math.max(-headRadius, Math.min(headRadius, offset));
    const long0 = Math.asin(clampedOffset / headRadius);
    const longNew = long0 + turn;
    const cosNew = Math.cos(longNew);

    const isVisible = cosNew > 0;
    const projX = headCenterX + headRadius * Math.sin(longNew);
    const scaleX = isVisible ? Math.max(0, cosNew / Math.cos(long0)) : 0;

    return { projX, scaleX, isVisible };
  };

  const leftProj = computeSphericalProjection(rawLeftEyeX);
  const rightProj = computeSphericalProjection(rawRightEyeX);

  const eyeScale = (params.eyeScale ?? 1.0) * (emphasis ? 1.15 : 1.0);
  const eyeType = Math.round(params.eyeType ?? 0);

  let leftEyeSvg = '';
  let rightEyeSvg = '';

  const renderSingleEye = (x: number, y: number, scaleX: number, isRight: boolean) => {
    if (scaleX <= 0.01) return '';

    const effectiveScale = eyeScale * scaleX;
    const eyeTransform = `transform="translate(${x}, ${y}) scale(${scaleX.toFixed(2)}, 1) translate(${-x}, ${-y})"`;

    switch (eyeType) {
      case 1:
        // Arco hacia arriba — ojos felices (^ ^)
        return `<g ${eyeTransform}><path d="M ${x - 5.83 * eyeScale} ${y + 2.5 * eyeScale} Q ${x} ${y - 5.83 * eyeScale} ${x + 5.83 * eyeScale} ${y + 2.5 * eyeScale}" stroke="${strokeColor}" stroke-width="${STROKE_W}" stroke-linecap="round" fill="none" /></g>`;

      case 2:
        // Kawaii cruzado (> <)
        return isRight
          ? `<g ${eyeTransform}><path d="M ${x - 5 * eyeScale} ${y - 5 * eyeScale} L ${x + 4.17 * eyeScale} ${y} L ${x - 5 * eyeScale} ${y + 5 * eyeScale}" stroke="${strokeColor}" stroke-width="${STROKE_W}" stroke-linecap="round" stroke-linejoin="round" fill="none" /></g>`
          : `<g ${eyeTransform}><path d="M ${x + 5 * eyeScale} ${y - 5 * eyeScale} L ${x - 4.17 * eyeScale} ${y} L ${x + 5 * eyeScale} ${y + 5 * eyeScale}" stroke="${strokeColor}" stroke-width="${STROKE_W}" stroke-linecap="round" stroke-linejoin="round" fill="none" /></g>`;

      case 3:
        // Diagonal enojado (\ /)
        return isRight
          ? `<g ${eyeTransform}><path d="M ${x - 5.83 * eyeScale} ${y - 4.17 * eyeScale} L ${x + 5 * eyeScale} ${y + 4.17 * eyeScale}" stroke="${strokeColor}" stroke-width="${STROKE_W}" stroke-linecap="round" fill="none" /></g>`
          : `<g ${eyeTransform}><path d="M ${x + 5.83 * eyeScale} ${y - 4.17 * eyeScale} L ${x - 5 * eyeScale} ${y + 4.17 * eyeScale}" stroke="${strokeColor}" stroke-width="${STROKE_W}" stroke-linecap="round" fill="none" /></g>`;

      case 4:
        // Diagonal triste (/ \)
        return isRight
          ? `<g ${eyeTransform}><path d="M ${x - 5 * eyeScale} ${y + 4.17 * eyeScale} L ${x + 5.83 * eyeScale} ${y - 4.17 * eyeScale}" stroke="${strokeColor}" stroke-width="${STROKE_W}" stroke-linecap="round" fill="none" /></g>`
          : `<g ${eyeTransform}><path d="M ${x + 5 * eyeScale} ${y + 4.17 * eyeScale} L ${x - 5.83 * eyeScale} ${y - 4.17 * eyeScale}" stroke="${strokeColor}" stroke-width="${STROKE_W}" stroke-linecap="round" fill="none" /></g>`;

      case 5:
        // Pupila con punto blanco arriba a la izquierda
        return `<g ${eyeTransform}>
          <ellipse cx="${x}" cy="${y}" rx="${3.33 * effectiveScale}" ry="${3.33 * effectiveScale}" fill="${strokeColor}" />
          <circle cx="${x - 1.25 * eyeScale}" cy="${y - 1.25 * eyeScale}" r="${1.25 * eyeScale}" fill="#FFFFFF" />
        </g>`;

      case 6: {
        // Corazones en los ojos
        const hr = 5.5 * eyeScale;
        return `<g ${eyeTransform}><path d="M ${x} ${y + hr * 0.7} C ${x - hr * 1.1} ${y - hr * 0.1} ${x - hr * 0.9} ${y - hr * 0.9} ${x} ${y - hr * 0.35} C ${x + hr * 0.9} ${y - hr * 0.9} ${x + hr * 1.1} ${y - hr * 0.1} ${x} ${y + hr * 0.7} Z" fill="#E84855" /></g>`;
      }

      case 7: {
        // Ojo X cruzado
        const xr = 4.2 * eyeScale;
        return `<g ${eyeTransform}>
          <line x1="${x - xr}" y1="${y - xr}" x2="${x + xr}" y2="${y + xr}" stroke="${strokeColor}" stroke-width="${STROKE_W}" stroke-linecap="round" />
          <line x1="${x + xr}" y1="${y - xr}" x2="${x - xr}" y2="${y + xr}" stroke="${strokeColor}" stroke-width="${STROKE_W}" stroke-linecap="round" />
        </g>`;
      }

      case 8: {
        // Doble línea = = (ojos cansados / mareados)
        const lw = 5 * eyeScale;
        return `<g ${eyeTransform}>
          <line x1="${x - lw}" y1="${y - 2.2 * eyeScale}" x2="${x + lw}" y2="${y - 2.2 * eyeScale}" stroke="${strokeColor}" stroke-width="${STROKE_W * 0.8}" stroke-linecap="round" />
          <line x1="${x - lw}" y1="${y + 2.2 * eyeScale}" x2="${x + lw}" y2="${y + 2.2 * eyeScale}" stroke="${strokeColor}" stroke-width="${STROKE_W * 0.8}" stroke-linecap="round" />
        </g>`;
      }

      case 9:
        // Gafas / Lentes
        return `<g ${eyeTransform}>
          <circle cx="${x}" cy="${y}" r="${5.8 * eyeScale}" fill="none" stroke="${strokeColor}" stroke-width="2.6" />
          ${isRight ? `<line x1="${x - 5.8 * eyeScale}" y1="${y}" x2="${x - 10 * eyeScale}" y2="${y}" stroke="${strokeColor}" stroke-width="2.6" stroke-linecap="round" />` : ''}
        </g>`;

      case 10:
        // Guiño: un ojo arco cerrado, el otro cápsula normal
        if (isRight) {
          return `<g ${eyeTransform}><path d="M ${x - 5.83 * eyeScale} ${y + 1 * eyeScale} Q ${x} ${y - 5 * eyeScale} ${x + 5.83 * eyeScale} ${y + 1 * eyeScale}" stroke="${strokeColor}" stroke-width="${STROKE_W}" stroke-linecap="round" fill="none" /></g>`;
        }
        return `<ellipse cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" rx="${(2.83 * effectiveScale).toFixed(2)}" ry="${Math.max(0.5, 2.83 * effectiveScale * Math.max(0.05, params.eyeOpen)).toFixed(2)}" fill="${strokeColor}" />`;

      case 11:
        // Ojo asimétrico: izquierdo punto, derecho raya
        if (isRight) {
          return `<g ${eyeTransform}><line x1="${x - 5 * eyeScale}" y1="${y}" x2="${x + 5 * eyeScale}" y2="${y}" stroke="${strokeColor}" stroke-width="${STROKE_W}" stroke-linecap="round" /></g>`;
        }
        return `<ellipse cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" rx="${(2.83 * effectiveScale).toFixed(2)}" ry="${(2.83 * effectiveScale).toFixed(2)}" fill="${strokeColor}" />`;

      case 12:
        // Óvalo vertical alargado (sorpresa / susto)
        return `<ellipse cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" rx="${(2.2 * effectiveScale).toFixed(2)}" ry="${(5.5 * effectiveScale).toFixed(2)}" fill="${strokeColor}" />`;

      case 13:
        // Círculo grande abierto (asombro O O)
        return `<circle cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" r="${(4.5 * effectiveScale).toFixed(2)}" fill="${strokeColor}" />`;

      case 14:
        // Arco hacia abajo — ojos cerrados serenos (Nima)
        return `<g ${eyeTransform}><path d="M ${x - 5.83 * eyeScale} ${y - 1.67 * eyeScale} Q ${x} ${y + 5.83 * eyeScale} ${x + 5.83 * eyeScale} ${y - 1.67 * eyeScale}" stroke="${strokeColor}" stroke-width="${STROKE_W}" stroke-linecap="round" fill="none" /></g>`;

      case 15:
        // Párpado caído y cansado (Dozy, cansancio) — trazo caído hacia el exterior
        return isRight
          ? `<g ${eyeTransform}><path d="M ${x - 5.5 * eyeScale} ${y - 1.5 * eyeScale} Q ${x + 1 * eyeScale} ${y - 3 * eyeScale} ${x + 6 * eyeScale} ${y + 3 * eyeScale}" stroke="${strokeColor}" stroke-width="${STROKE_W}" stroke-linecap="round" fill="none" /></g>`
          : `<g ${eyeTransform}><path d="M ${x + 5.5 * eyeScale} ${y - 1.5 * eyeScale} Q ${x - 1 * eyeScale} ${y - 3 * eyeScale} ${x - 6 * eyeScale} ${y + 3 * eyeScale}" stroke="${strokeColor}" stroke-width="${STROKE_W}" stroke-linecap="round" fill="none" /></g>`;

      case 16:
        // Raya vertical (Lumo) — la lágrima la aporta el sistema animado `tears`
        return `<g ${eyeTransform}><path d="M ${x} ${y - 4.17 * eyeScale} L ${x} ${y + 3.33 * eyeScale}" stroke="${strokeColor}" stroke-width="${STROKE_W}" stroke-linecap="round" fill="none" /></g>`;

      case 17:
        // Ceja enojada en diagonal (Brix)
        return isRight
          ? `<g ${eyeTransform}><path d="M ${x + 5.83 * eyeScale} ${y - 6.67 * eyeScale} L ${x - 5 * eyeScale} ${y + 0.83 * eyeScale}" stroke="${strokeColor}" stroke-width="${STROKE_W}" stroke-linecap="round" fill="none" /></g>`
          : `<g ${eyeTransform}><path d="M ${x - 5.83 * eyeScale} ${y - 6.67 * eyeScale} L ${x + 5 * eyeScale} ${y + 0.83 * eyeScale}" stroke="${strokeColor}" stroke-width="${STROKE_W}" stroke-linecap="round" fill="none" /></g>`;

      case 18: {
        // Ojo de garabato (Knot) — la misma espiral que dibuja su propia
        // partícula 'spiral' (particles.ts), vía spiralPoints() compartido
        const spiralRadius = 4.6 * eyeScale;
        const d = spiralPoints()
          .map(([ux, uy], i) => {
            const px = (x + ux * spiralRadius).toFixed(2);
            const py = (y + uy * spiralRadius).toFixed(2);
            return `${i === 0 ? 'M' : 'L'} ${px} ${py}`;
          })
          .join(' ');
        // Trazo fino a propósito: con las vueltas tan juntas cerca del centro,
        // un stroke grueso las fusiona en una mancha en vez de leerse como espiral
        return `<g ${eyeTransform}><path d="${d}" stroke="${strokeColor}" stroke-width="1.3" stroke-linecap="round" fill="none" /></g>`;
      }

      case 19:
        // Ojo somnoliento: aro con párpado curvo (Snug)
        return `<g ${eyeTransform}>
          <circle cx="${x}" cy="${y}" r="${4.5 * eyeScale}" fill="none" stroke="${strokeColor}" stroke-width="2.63" />
          <path d="M ${x - 2.83 * eyeScale} ${y - 0.42 * eyeScale} Q ${x} ${y + 2.83 * eyeScale} ${x + 2.83 * eyeScale} ${y - 0.42 * eyeScale}" stroke="${strokeColor}" stroke-width="2.63" stroke-linecap="round" fill="none" />
        </g>`;

      case 20:
        // Aro hueco (Pip, Void)
        return `<g ${eyeTransform}><circle cx="${x}" cy="${y}" r="${3.67 * eyeScale}" fill="none" stroke="${strokeColor}" stroke-width="2.8" /></g>`;

      case 21: {
        // Estrella — asombro/excitación tipo starstruck
        const r = 6 * eyeScale;
        const inner = r * 0.45;
        const pts = [
          [x, y - r],
          [x + inner * 0.59, y - inner * 0.81],
          [x + r * 0.95, y - r * 0.31],
          [x + inner * 0.95, y + inner * 0.31],
          [x + r * 0.59, y + r * 0.81],
          [x, y + inner],
          [x - r * 0.59, y + r * 0.81],
          [x - inner * 0.95, y + inner * 0.31],
          [x - r * 0.95, y - r * 0.31],
          [x - inner * 0.59, y - inner * 0.81],
        ];
        const pathData = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p[0].toFixed(2)} ${p[1].toFixed(2)}`).join(' ') + ' Z';
        return `<g ${eyeTransform}><path d="${pathData}" fill="${strokeColor}" /></g>`;
      }

      case 22:
        // De reojo / desconfiado (¬ ¬)
        return isRight
          ? `<g ${eyeTransform}><path d="M ${x - 5 * eyeScale} ${y - 3 * eyeScale} L ${x + 4 * eyeScale} ${y - 3 * eyeScale} L ${x + 4 * eyeScale} ${y + 3 * eyeScale}" stroke="${strokeColor}" stroke-width="${STROKE_W}" stroke-linecap="round" stroke-linejoin="round" fill="none" /></g>`
          : `<g ${eyeTransform}><path d="M ${x + 5 * eyeScale} ${y - 3 * eyeScale} L ${x - 4 * eyeScale} ${y - 3 * eyeScale} L ${x - 4 * eyeScale} ${y + 3 * eyeScale}" stroke="${strokeColor}" stroke-width="${STROKE_W}" stroke-linecap="round" stroke-linejoin="round" fill="none" /></g>`;

      case 23:
        // Guiño invertido (ojo derecho guiño, izquierdo abierto)
        if (!isRight) {
          return `<g ${eyeTransform}><path d="M ${x - 5.83 * eyeScale} ${y + 1 * eyeScale} Q ${x} ${y - 5 * eyeScale} ${x + 5.83 * eyeScale} ${y + 1 * eyeScale}" stroke="${strokeColor}" stroke-width="${STROKE_W}" stroke-linecap="round" fill="none" /></g>`;
        }
        return `<ellipse cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" rx="${(2.83 * effectiveScale).toFixed(2)}" ry="${Math.max(0.5, 2.83 * effectiveScale * Math.max(0.05, params.eyeOpen)).toFixed(2)}" fill="${strokeColor}" />`;

      case 24:
        // Anime brillante (dos brillos blancos en la pupila)
        return `<g ${eyeTransform}>
          <ellipse cx="${x}" cy="${y}" rx="${4.2 * effectiveScale}" ry="${4.8 * effectiveScale}" fill="${strokeColor}" />
          <circle cx="${x - 1.5 * eyeScale}" cy="${y - 1.8 * eyeScale}" r="${1.6 * eyeScale}" fill="#FFFFFF" />
          <circle cx="${x + 1.5 * eyeScale}" cy="${y + 1.5 * eyeScale}" r="${0.9 * eyeScale}" fill="#FFFFFF" />
        </g>`;

      case 25:
        // Pestaña relajada (arco sereno con pequeña pestaña lateral)
        return isRight
          ? `<g ${eyeTransform}>
              <path d="M ${x - 5.5 * eyeScale} ${y - 1 * eyeScale} Q ${x} ${y + 5.5 * eyeScale} ${x + 5.5 * eyeScale} ${y - 1 * eyeScale}" stroke="${strokeColor}" stroke-width="${STROKE_W}" stroke-linecap="round" fill="none" />
              <line x1="${x + 4.5 * eyeScale}" y1="${y}" x2="${x + 7.5 * eyeScale}" y2="${y - 3 * eyeScale}" stroke="${strokeColor}" stroke-width="${STROKE_W * 0.75}" stroke-linecap="round" />
            </g>`
          : `<g ${eyeTransform}>
              <path d="M ${x - 5.5 * eyeScale} ${y - 1 * eyeScale} Q ${x} ${y + 5.5 * eyeScale} ${x + 5.5 * eyeScale} ${y - 1 * eyeScale}" stroke="${strokeColor}" stroke-width="${STROKE_W}" stroke-linecap="round" fill="none" />
              <line x1="${x - 4.5 * eyeScale}" y1="${y}" x2="${x - 7.5 * eyeScale}" y2="${y - 3 * eyeScale}" stroke="${strokeColor}" stroke-width="${STROKE_W * 0.75}" stroke-linecap="round" />
            </g>`;

      case 26:
        // Ojos saltones (círculos blancos grandes con pupila negra)
        return `<g ${eyeTransform}>
          <circle cx="${x}" cy="${y}" r="${5.8 * effectiveScale}" fill="#FFFFFF" stroke="${strokeColor}" stroke-width="2.2" />
          <circle cx="${x + (params.gazeX ? params.gazeX * 0.15 : 0)}" cy="${y + (params.gazeY ? params.gazeY * 0.15 : 0)}" r="${2.5 * effectiveScale}" fill="${strokeColor}" />
        </g>`;

      case 27:
        // Ojos cascada de lágrimas (línea arqueada con torrente)
        return `<g ${eyeTransform}><path d="M ${x - 6 * eyeScale} ${y} Q ${x} ${y - 5 * eyeScale} ${x + 6 * eyeScale} ${y}" stroke="${strokeColor}" stroke-width="${STROKE_W}" stroke-linecap="round" fill="none" /></g>`;

      case 28:
        // Mirada plana fija / inexpresiva (— —)
        return `<g ${eyeTransform}><line x1="${x - 5.5 * eyeScale}" y1="${y}" x2="${x + 5.5 * eyeScale}" y2="${y}" stroke="${strokeColor}" stroke-width="${STROKE_W}" stroke-linecap="round" /></g>`;

      case 29:
        // Ceja preocupada arqueada con ojito
        return `<g ${eyeTransform}>
          <ellipse cx="${x}" cy="${y + 1 * eyeScale}" rx="${2.8 * effectiveScale}" ry="${2.8 * effectiveScale}" fill="${strokeColor}" />
          <path d="M ${x - 4 * eyeScale} ${y - 4 * eyeScale} Q ${x} ${y - 7 * eyeScale} ${x + 4 * eyeScale} ${y - 5 * eyeScale}" stroke="${strokeColor}" stroke-width="2.2" stroke-linecap="round" fill="none" />
        </g>`;

      case 30:
        // Ojos en zigzag (shock / electrocutado)
        return `<g ${eyeTransform}><path d="M ${x - 5 * eyeScale} ${y - 3 * eyeScale} L ${x - 1.5 * eyeScale} ${y + 3 * eyeScale} L ${x + 1.5 * eyeScale} ${y - 3 * eyeScale} L ${x + 5 * eyeScale} ${y + 3 * eyeScale}" stroke="${strokeColor}" stroke-width="${STROKE_W * 0.8}" stroke-linecap="round" stroke-linejoin="round" fill="none" /></g>`;

      case 31:
        // Aro con pupila centrada flotante
        return `<g ${eyeTransform}>
          <circle cx="${x}" cy="${y}" r="${4.8 * effectiveScale}" fill="none" stroke="${strokeColor}" stroke-width="2.2" />
          <circle cx="${x}" cy="${y}" r="${1.8 * effectiveScale}" fill="${strokeColor}" />
        </g>`;

      case 0:
      default:
        const rx = 2.83 * effectiveScale;
        const ry = Math.max(0.5, rx * Math.max(0.05, params.eyeOpen));
        return `<ellipse cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" rx="${rx.toFixed(2)}" ry="${ry.toFixed(2)}" fill="${strokeColor}" />`;
    }
  };

  leftEyeSvg = leftProj.isVisible ? renderSingleEye(leftProj.projX, baseEyeY, leftProj.scaleX, false) : '';
  rightEyeSvg = rightProj.isVisible ? renderSingleEye(rightProj.projX, baseEyeY, rightProj.scaleX, true) : '';

  let tearsSvg = '';
  const tears = params.tears ?? 0;
  if (tears > 0.01) {
    const tearMaxOpacity = Math.min(1, tears);
    // Slow melancholic cycle (~2.8s per tear drop)
    const dripProgress = (currentTime * 0.36) % 1;

    let dripY = 0;
    let opacity = tearMaxOpacity;
    let scaleY = 1;

    if (dripProgress < 0.25) {
      // Swell under eye
      const p = dripProgress / 0.25;
      dripY = p * 1.2;
      scaleY = 0.75 + p * 0.35;
      opacity = tearMaxOpacity * (0.3 + p * 0.7);
    } else if (dripProgress < 0.82) {
      // Gentle slide down cheek
      const p = (dripProgress - 0.25) / 0.57;
      dripY = 1.2 + p * 10.5;
      scaleY = 1.1 - p * 0.2;
      opacity = tearMaxOpacity;
    } else {
      // Soft fade out at bottom
      const p = (dripProgress - 0.82) / 0.18;
      dripY = 11.7 + p * 2.5;
      scaleY = 0.9 - p * 0.4;
      opacity = tearMaxOpacity * (1 - p);
    }

    if (params.cascadeTears) {
      // Cascada de lágrimas cubriendo la cara
      tearsSvg = `
        <g opacity="${opacity.toFixed(2)}">
          <path d="M ${leftProj.projX - 3} ${baseEyeY + 4} L ${leftProj.projX - 6} 88 L ${leftProj.projX + 2} 88 Z" fill="#7FA6D9" opacity="0.85" />
          <path d="M ${rightProj.projX - 2} ${baseEyeY + 4} L ${rightProj.projX - 2} 88 L ${rightProj.projX + 6} 88 Z" fill="#7FA6D9" opacity="0.85" />
        </g>
      `;
    } else {
      // Dos lágrimas pequeñas y redonditas cayendo animadas bajo los ojos (como Lumo)
      const ly = (baseEyeY + 7).toFixed(2);
      const lx = (leftProj.projX - 1.2).toFixed(2);
      const rx = (rightProj.projX + 1.2).toFixed(2);

      const lxNum = parseFloat(lx);
      const rxNum = parseFloat(rx);
      const lyNum = parseFloat(ly);

      tearsSvg = `
        <g opacity="${opacity.toFixed(2)}">
          <g class="wissive-anim-tear" style="transform-origin: ${lxNum}px ${lyNum}px;">
            <path d="M ${lxNum} ${(lyNum + dripY - 2.5).toFixed(2)} C ${(lxNum - 2).toFixed(2)} ${(lyNum + dripY).toFixed(2)} ${(lxNum - 2.5).toFixed(2)} ${(lyNum + dripY + 2.5).toFixed(2)} ${lxNum} ${(lyNum + dripY + 3.2).toFixed(2)} C ${(lxNum + 2.5).toFixed(2)} ${(lyNum + dripY + 2.5).toFixed(2)} ${(lxNum + 2).toFixed(2)} ${(lyNum + dripY).toFixed(2)} ${lxNum} ${(lyNum + dripY - 2.5).toFixed(2)} Z" fill="#7FA6D9" transform="scale(1, ${scaleY.toFixed(2)})" />
          </g>
          <g class="wissive-anim-tear" style="transform-origin: ${rxNum}px ${lyNum}px; animation-delay: -0.9s;">
            <path d="M ${rxNum} ${(lyNum + dripY - 2.5).toFixed(2)} C ${(rxNum - 2).toFixed(2)} ${(lyNum + dripY).toFixed(2)} ${(rxNum - 2.5).toFixed(2)} ${(lyNum + dripY + 2.5).toFixed(2)} ${rxNum} ${(lyNum + dripY + 3.2).toFixed(2)} C ${(rxNum + 2.5).toFixed(2)} ${(lyNum + dripY + 2.5).toFixed(2)} ${(rxNum + 2).toFixed(2)} ${(lyNum + dripY).toFixed(2)} ${rxNum} ${(lyNum + dripY - 2.5).toFixed(2)} Z" fill="#7FA6D9" transform="scale(1, ${scaleY.toFixed(2)})" />
          </g>
        </g>
      `;
    }
  }

  // --- CEJAS ---
  let browsSvg = '';
  const isBrowsActive = params.showBrows !== undefined
    ? params.showBrows > 0.5
    : params.browY !== 0 || params.browTilt !== 0;

  if (isBrowsActive) {
    const browBaseY = 32 + (params.browY ?? 0);
    const browLeftX = leftProj.projX;
    const browRightX = rightProj.projX;
    const browHalfWidth = 6 * eyeScale;
    const leftAngle = params.browTilt ?? 0;
    const rightAngle = -leftAngle;

    browsSvg = `
      <g>
        <line
          x1="${browLeftX - browHalfWidth}"
          y1="${browBaseY}"
          x2="${browLeftX + browHalfWidth}"
          y2="${browBaseY}"
          stroke="${strokeColor}"
          stroke-width="2.6"
          stroke-linecap="round"
          transform="rotate(${leftAngle}, ${browLeftX}, ${browBaseY})"
        />
        <line
          x1="${browRightX - browHalfWidth}"
          y1="${browBaseY}"
          x2="${browRightX + browHalfWidth}"
          y2="${browBaseY}"
          stroke="${strokeColor}"
          stroke-width="2.6"
          stroke-linecap="round"
          transform="rotate(${rightAngle}, ${browRightX}, ${browBaseY})"
        />
      </g>
    `;
  }

  // --- ACCESORIOS (Sudor, ZZZ, Tormenta, Garabato, Aliento) ---
  let accessoriesSvg = '';

  if (params.sweat) {
    const sweatOpacity = Math.min(1, params.sweat);
    // Gotitas de sudor que brotan y resbalan por la sien derecha
    accessoriesSvg += `
      <g class="wissive-anim-sweat" opacity="${sweatOpacity.toFixed(2)}" fill="#7FA6D9">
        <path d="M 80 28 C 78 30 77 33 79 35 C 81 37 84 36 84 33 C 84 30 81 28 80 28 Z" />
        <path d="M 73 22 C 72 23 71.5 25 72.8 26.5 C 74 27.5 76 27 76 25 C 76 23 74 22 73 22 Z" opacity="0.75" />
      </g>
    `;
  }

  if (params.zzz) {
    // 3 Z's flotando en escalera hacia arriba a la derecha (estilo Snug)
    const zzzOpacity = Math.min(1, params.zzz);
    accessoriesSvg += `
      <g opacity="${zzzOpacity.toFixed(2)}" fill="#383835" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="900">
        <text class="wissive-zzz-1" x="78" y="24" font-size="9" letter-spacing="-0.5">Z</text>
        <text class="wissive-zzz-2" x="84" y="16" font-size="7.5" letter-spacing="-0.5">z</text>
        <text class="wissive-zzz-3" x="89" y="9" font-size="6" letter-spacing="-0.5">z</text>
      </g>
    `;
  }

  if (params.storm) {
    // Dos nubecitas de tormenta encima de la cabeza, sin rayo — solo las nubes.
    // Cada una deriva y respira por su cuenta y fuera de fase para que no se
    // queden pegadas ahí quietas.
    const stormOpacity = Math.min(1, params.storm);
    const driftL = Math.sin(currentTime * 1.4) * 1.2;
    const driftR = Math.sin(currentTime * 1.4 + 1.8) * 1.2;
    const breatheL = 0.85 + Math.sin(currentTime * 1.4) * 0.15;
    const breatheR = 0.85 + Math.sin(currentTime * 1.4 + 1.8) * 0.15;
    accessoriesSvg += `
      <g opacity="${stormOpacity.toFixed(2)}" fill="#8a8a86">
        <path transform="translate(${driftL.toFixed(2)}, ${(Math.abs(driftL) * -0.4).toFixed(2)})" opacity="${breatheL.toFixed(2)}" d="M 22 6 C 22 3 25 1.5 27 2.3 C 27.6 0.5 30 -0.3 31.7 1 C 33.3 -0.7 36.5 0.3 36.5 3 C 38.2 3 39.5 4.5 39 6.2 C 39 8 37.3 9 35.6 9 L 24 9 C 22.3 9 22 7.5 22 6 Z" />
        <path transform="translate(${driftR.toFixed(2)}, ${(Math.abs(driftR) * -0.4).toFixed(2)})" opacity="${breatheR.toFixed(2)}" d="M 62 8 C 62 5.3 64.8 3.9 66.6 4.6 C 67.2 3 69.4 2.3 71 3.5 C 72.5 1.9 75.4 2.8 75.4 5.3 C 77 5.3 78.2 6.7 77.7 8.2 C 77.7 9.8 76.1 10.7 74.6 10.7 L 63.8 10.7 C 62.3 10.7 62 9.4 62 8 Z" />
      </g>
    `;
  }

  if (params.scribble) {
    // El mismo garabato que el ojo de Knot (buildScribbleGroup), pero encima
    // de la cabeza — gira despacio y sin ritmo fijo, como un pensamiento que
    // no logra cerrar el círculo, y late un poco de tamaño con otra frecuencia
    const scribbleOpacity = Math.min(1, params.scribble);
    const wobble = Math.sin(currentTime * 1.6) * 6;
    const pulse = 1 + Math.sin(currentTime * 2.3) * 0.06;
    accessoriesSvg += `
      <g transform="translate(50, 3) rotate(${wobble.toFixed(2)}) translate(-50, -3)" opacity="${scribbleOpacity.toFixed(2)}">
        ${buildScribbleGroup(50, 3, pulse, '#5B7FD6', 2.3)}
      </g>
    `;
  }

  if (params.puff) {
    // Bocanada de aliento cansado saliendo de la boca — sube y se disuelve
    const puffProgress = (currentTime * 0.55) % 1;
    const puffMouthY = params.mouthY ?? 63;
    const puffX = 68 + puffProgress * 12;
    const puffY = puffMouthY - puffProgress * 10;
    const puffScale = 0.4 + puffProgress * 0.9;
    const puffOpacity = Math.min(1, params.puff) * Math.sin(puffProgress * Math.PI) * 0.8;
    if (puffOpacity > 0.01) {
      accessoriesSvg += `
        <g fill="#B9BDB6" opacity="${puffOpacity.toFixed(2)}" transform="translate(${puffX.toFixed(2)}, ${puffY.toFixed(2)}) scale(${puffScale.toFixed(2)})">
          <circle cx="0" cy="0" r="3.4" />
          <circle cx="3" cy="-1.2" r="2.1" />
          <circle cx="-2.4" cy="-1" r="1.8" />
        </g>
      `;
    }
  }

  // --- MEJILLAS O RAYAS ---
  let cheeksSvg = '';
  if (params.whiskers) {
    // Rayas laterales estilo gato/tigre
    cheeksSvg = `
      <g stroke="${strokeColor}" stroke-width="2" stroke-linecap="round" opacity="${(params.cheek || 0.7).toFixed(2)}">
        <line x1="${leftProj.projX - 10}" y1="52" x2="${leftProj.projX - 18}" y2="50" />
        <line x1="${leftProj.projX - 10}" y1="56" x2="${leftProj.projX - 17}" y2="58" />
        <line x1="${rightProj.projX + 10}" y1="52" x2="${rightProj.projX + 18}" y2="50" />
        <line x1="${rightProj.projX + 10}" y1="56" x2="${rightProj.projX + 17}" y2="58" />
      </g>
    `;
  } else if (params.cheek > 0.05) {
    const cheekRadius = (params.cheekRadius ?? 5.5) * (emphasis ? 1.2 : 1.0);
    const cheekY = (params.cheekY ?? 54) + gazeY * 0.5;
    const cheekOpacity = Math.min(1, params.cheek);

    cheeksSvg = `
      <ellipse cx="${leftProj.projX - 3.5}" cy="${cheekY}" rx="${(cheekRadius * leftProj.scaleX).toFixed(2)}" ry="${(cheekRadius * 0.7).toFixed(2)}" fill="${cheekColor}" opacity="${cheekOpacity.toFixed(2)}" />
      <ellipse cx="${rightProj.projX + 3.5}" cy="${cheekY}" rx="${(cheekRadius * rightProj.scaleX).toFixed(2)}" ry="${(cheekRadius * 0.7).toFixed(2)}" fill="${cheekColor}" opacity="${cheekOpacity.toFixed(2)}" />
    `;
  }

  // --- BOCA ---
  const mouthCenterX = 50 + gazeX * 0.8;
  const mouthY = (params.mouthY ?? 63) + gazeY * 0.6;
  const mouthScale = (params.mouthScale ?? 1.0) * (emphasis ? 1.15 : 1.0);
  const mouthCurve = params.mouthCurve ?? 0;
  const mouthOpen = params.mouthOpen ?? 0;
  const mouthType = Math.round(params.mouthType ?? 0);

  let mouthSvg = '';

  const cx = mouthCenterX;
  const cy = mouthY;
  const hw = 5.83 * mouthScale;

  switch (mouthType) {
    case 1: {
      // Sorpresa: círculo 'O'
      const r = Math.max(1.8, (2.8 + mouthOpen * 3.5) * mouthScale);
      mouthSvg = `<ellipse cx="${cx.toFixed(2)}" cy="${cy.toFixed(2)}" rx="${r.toFixed(2)}" ry="${(r * (1 + mouthOpen * 0.4)).toFixed(2)}" fill="${strokeColor}" />`;
      break;
    }

    case 2:
      // Zigzag / Wavy (~ ~ ~)
      mouthSvg = `<path d="M ${(cx - hw).toFixed(2)} ${cy.toFixed(2)} Q ${(cx - hw * 0.5).toFixed(2)} ${(cy - 2.5 * mouthScale).toFixed(2)} ${cx.toFixed(2)} ${cy.toFixed(2)} Q ${(cx + hw * 0.5).toFixed(2)} ${(cy + 2.5 * mouthScale).toFixed(2)} ${(cx + hw).toFixed(2)} ${cy.toFixed(2)}" stroke="${strokeColor}" stroke-width="${STROKE_W}" stroke-linecap="round" fill="none" />`;
      break;

    case 3:
      // Línea plana (—)
      mouthSvg = `<line x1="${(cx - hw).toFixed(2)}" y1="${cy.toFixed(2)}" x2="${(cx + hw).toFixed(2)}" y2="${cy.toFixed(2)}" stroke="${strokeColor}" stroke-width="${STROKE_W}" stroke-linecap="round" />`;
      break;

    case 4: {
      // Dientes apretados [≡] (estilo Knot)
      const bw = 7.5 * mouthScale;
      const bh = 4.2 * mouthScale;
      mouthSvg = `
        <rect x="${(cx - bw).toFixed(2)}" y="${(cy - bh * 0.5).toFixed(2)}" width="${(bw * 2).toFixed(2)}" height="${bh.toFixed(2)}" rx="2" fill="#FFFFFF" stroke="${strokeColor}" stroke-width="2.2" />
        <line x1="${(cx - bw).toFixed(2)}" y1="${cy.toFixed(2)}" x2="${(cx + bw).toFixed(2)}" y2="${cy.toFixed(2)}" stroke="${strokeColor}" stroke-width="1.8" />
        <line x1="${(cx - bw * 0.33).toFixed(2)}" y1="${(cy - bh * 0.5).toFixed(2)}" x2="${(cx - bw * 0.33).toFixed(2)}" y2="${(cy + bh * 0.5).toFixed(2)}" stroke="${strokeColor}" stroke-width="1.8" />
        <line x1="${(cx + bw * 0.33).toFixed(2)}" y1="${(cy - bh * 0.5).toFixed(2)}" x2="${(cx + bw * 0.33).toFixed(2)}" y2="${(cy + bh * 0.5).toFixed(2)}" stroke="${strokeColor}" stroke-width="1.8" />
      `;
      break;
    }

    case 5: {
      // Sonrisa abierta con dientes superiores
      const h = (3.5 + mouthOpen * 4.5) * mouthScale;
      mouthSvg = `
        <path d="M ${(cx - hw).toFixed(2)} ${cy.toFixed(2)} Q ${cx.toFixed(2)} ${(cy + h * 2.2).toFixed(2)} ${(cx + hw).toFixed(2)} ${cy.toFixed(2)} Z" fill="${strokeColor}" />
        <path d="M ${(cx - hw * 0.8).toFixed(2)} ${cy.toFixed(2)} L ${(cx + hw * 0.8).toFixed(2)} ${cy.toFixed(2)} L ${(cx + hw * 0.7).toFixed(2)} ${(cy + h * 0.6).toFixed(2)} L ${(cx - hw * 0.7).toFixed(2)} ${(cy + h * 0.6).toFixed(2)} Z" fill="#FFFFFF" />
      `;
      break;
    }

    case 6: {
      // Boca abierta grande feliz (estilo D) con lengua
      const h = (4 + mouthOpen * 5.5) * mouthScale;
      mouthSvg = `
        <g>
          <path d="M ${(cx - hw).toFixed(2)} ${cy.toFixed(2)} Q ${cx.toFixed(2)} ${(cy + h * 2.2).toFixed(2)} ${(cx + hw).toFixed(2)} ${cy.toFixed(2)} Z" fill="${strokeColor}" />
          <path d="M ${(cx - hw * 0.5).toFixed(2)} ${(cy + h * 1.3).toFixed(2)} Q ${cx.toFixed(2)} ${(cy + h * 0.8).toFixed(2)} ${(cx + hw * 0.5).toFixed(2)} ${(cy + h * 1.3).toFixed(2)} Q ${cx.toFixed(2)} ${(cy + h * 2.1).toFixed(2)} ${(cx - hw * 0.5).toFixed(2)} ${(cy + h * 1.3).toFixed(2)} Z" fill="#FF7B89" />
        </g>
      `;
      break;
    }

    case 7: {
      // Cruz 'X'
      const r = 3.5 * mouthScale;
      mouthSvg = `
        <line x1="${(cx - r).toFixed(2)}" y1="${(cy - r).toFixed(2)}" x2="${(cx + r).toFixed(2)}" y2="${(cy + r).toFixed(2)}" stroke="${strokeColor}" stroke-width="${STROKE_W}" stroke-linecap="round" />
        <line x1="${(cx + r).toFixed(2)}" y1="${(cy - r).toFixed(2)}" x2="${(cx - r).toFixed(2)}" y2="${(cy + r).toFixed(2)}" stroke="${strokeColor}" stroke-width="${STROKE_W}" stroke-linecap="round" />
      `;
      break;
    }

    case 8: {
      // Mascarilla médica
      const mw = 12 * mouthScale;
      const mh = 7.5 * mouthScale;
      mouthSvg = `
        <rect x="${(cx - mw).toFixed(2)}" y="${(cy - mh * 0.4).toFixed(2)}" width="${(mw * 2).toFixed(2)}" height="${mh.toFixed(2)}" rx="3" fill="#FFFFFF" stroke="#8A9BA8" stroke-width="1.8" />
        <line x1="${(cx - mw).toFixed(2)}" y1="${cy.toFixed(2)}" x2="${(cx + mw).toFixed(2)}" y2="${cy.toFixed(2)}" stroke="#C8D4DE" stroke-width="1.2" />
      `;
      break;
    }

    case 9:
      // Boca de gato :3 (W)
      mouthSvg = `
        <path d="M ${(cx - hw).toFixed(2)} ${cy.toFixed(2)} Q ${(cx - hw * 0.5).toFixed(2)} ${(cy + 3.2 * mouthScale).toFixed(2)} ${cx.toFixed(2)} ${cy.toFixed(2)} Q ${(cx + hw * 0.5).toFixed(2)} ${(cy + 3.2 * mouthScale).toFixed(2)} ${(cx + hw).toFixed(2)} ${cy.toFixed(2)}" stroke="${strokeColor}" stroke-width="${STROKE_W}" stroke-linecap="round" fill="none" />
      `;
      break;

    case 10:
      // Punto pequeño (•)
      mouthSvg = `<circle cx="${cx.toFixed(2)}" cy="${cy.toFixed(2)}" r="${(1.9 * mouthScale).toFixed(2)}" fill="${strokeColor}" />`;
      break;

    case 11:
      // Línea diagonal ( / )
      mouthSvg = `<line x1="${(cx - hw * 0.8).toFixed(2)}" y1="${(cy + 2.5 * mouthScale).toFixed(2)}" x2="${(cx + hw * 0.8).toFixed(2)}" y2="${(cy - 2.5 * mouthScale).toFixed(2)}" stroke="${strokeColor}" stroke-width="${STROKE_W}" stroke-linecap="round" />`;
      break;

    case 12:
      // Curva triste / descontento (∩)
      mouthSvg = `<path d="M ${(cx - hw).toFixed(2)} ${(cy + 2 * mouthScale).toFixed(2)} Q ${cx.toFixed(2)} ${(cy - 4.5 * mouthScale).toFixed(2)} ${(cx + hw).toFixed(2)} ${(cy + 2 * mouthScale).toFixed(2)}" stroke="${strokeColor}" stroke-width="${STROKE_W}" stroke-linecap="round" fill="none" />`;
      break;

    case 13:
      // Círculo hueco 'o'
      mouthSvg = `<circle cx="${cx.toFixed(2)}" cy="${cy.toFixed(2)}" r="${(3.2 * mouthScale).toFixed(2)}" fill="none" stroke="${strokeColor}" stroke-width="${STROKE_W}" />`;
      break;

    case 14:
      // Sin boca (invisible)
      mouthSvg = '';
      break;

    case 15: {
      // Lengua afuera traviesa (:P)
      const tw = 3.2 * mouthScale;
      const th = 4.8 * mouthScale;
      mouthSvg = `
        <line x1="${(cx - hw).toFixed(2)}" y1="${cy.toFixed(2)}" x2="${(cx + hw).toFixed(2)}" y2="${cy.toFixed(2)}" stroke="${strokeColor}" stroke-width="${STROKE_W}" stroke-linecap="round" />
        <path d="M ${(cx - tw * 0.7).toFixed(2)} ${cy.toFixed(2)} C ${(cx - tw).toFixed(2)} ${(cy + th).toFixed(2)} ${(cx + tw).toFixed(2)} ${(cy + th).toFixed(2)} ${(cx + tw * 0.7).toFixed(2)} ${cy.toFixed(2)} Z" fill="#FF5E7E" stroke="${strokeColor}" stroke-width="1.8" />
        <line x1="${cx.toFixed(2)}" y1="${cy.toFixed(2)}" x2="${cx.toFixed(2)}" y2="${(cy + th * 0.65).toFixed(2)}" stroke="#D93856" stroke-width="1.2" />
      `;
      break;
    }

    case 16:
      // Media sonrisa pícara / smirk lateral
      mouthSvg = `<path d="M ${(cx - hw * 0.4).toFixed(2)} ${cy.toFixed(2)} Q ${(cx + hw * 0.4).toFixed(2)} ${(cy + 0.5).toFixed(2)} ${(cx + hw * 1.1).toFixed(2)} ${(cy - 3.5 * mouthScale).toFixed(2)}" stroke="${strokeColor}" stroke-width="${STROKE_W}" stroke-linecap="round" fill="none" />`;
      break;

    case 17:
      // Triángulo gatito ▲
      mouthSvg = `<path d="M ${(cx - hw * 0.6).toFixed(2)} ${(cy + 2.5 * mouthScale).toFixed(2)} L ${cx.toFixed(2)} ${(cy - 2.5 * mouthScale).toFixed(2)} L ${(cx + hw * 0.6).toFixed(2)} ${(cy + 2.5 * mouthScale).toFixed(2)} Z" fill="${strokeColor}" />`;
      break;

    case 18:
      // Kawaii >3<
      mouthSvg = `<path d="M ${(cx - hw * 0.6).toFixed(2)} ${(cy - 2.2 * mouthScale).toFixed(2)} Q ${(cx + 1).toFixed(2)} ${cy.toFixed(2)} ${(cx - hw * 0.6).toFixed(2)} ${(cy + 2.2 * mouthScale).toFixed(2)}" stroke="${strokeColor}" stroke-width="${STROKE_W}" stroke-linecap="round" fill="none" />`;
      break;

    case 19: {
      // Caja cuadrada abierta (grito / asombro)
      const bw = 5 * mouthScale;
      const bh = 5.5 * mouthScale;
      mouthSvg = `<rect x="${(cx - bw).toFixed(2)}" y="${(cy - bh * 0.5).toFixed(2)}" width="${(bw * 2).toFixed(2)}" height="${bh.toFixed(2)}" rx="1.5" fill="${strokeColor}" />`;
      break;
    }

    case 20:
      // Boquita apretada / disgusto
      mouthSvg = `<path d="M ${(cx - hw * 0.7).toFixed(2)} ${(cy - 1).toFixed(2)} Q ${cx.toFixed(2)} ${(cy + 2 * mouthScale).toFixed(2)} ${(cx + hw * 0.7).toFixed(2)} ${(cy - 1).toFixed(2)}" stroke="${strokeColor}" stroke-width="${STROKE_W}" stroke-linecap="round" fill="none" />`;
      break;

    case 21: {
      // Fila completa de dientes blancos
      const bw = 8 * mouthScale;
      const bh = 3.8 * mouthScale;
      mouthSvg = `
        <rect x="${(cx - bw).toFixed(2)}" y="${(cy - bh * 0.5).toFixed(2)}" width="${(bw * 2).toFixed(2)}" height="${bh.toFixed(2)}" rx="2" fill="#FFFFFF" stroke="${strokeColor}" stroke-width="2.2" />
        <line x1="${(cx - bw * 0.5).toFixed(2)}" y1="${(cy - bh * 0.5).toFixed(2)}" x2="${(cx - bw * 0.5).toFixed(2)}" y2="${(cy + bh * 0.5).toFixed(2)}" stroke="${strokeColor}" stroke-width="1.5" />
        <line x1="${cx.toFixed(2)}" y1="${(cy - bh * 0.5).toFixed(2)}" x2="${cx.toFixed(2)}" y2="${(cy + bh * 0.5).toFixed(2)}" stroke="${strokeColor}" stroke-width="1.5" />
        <line x1="${(cx + bw * 0.5).toFixed(2)}" y1="${(cy - bh * 0.5).toFixed(2)}" x2="${(cx + bw * 0.5).toFixed(2)}" y2="${(cy + bh * 0.5).toFixed(2)}" stroke="${strokeColor}" stroke-width="1.5" />
      `;
      break;
    }

    case 22: {
      // Lengua lateral saliendo por la comisura
      mouthSvg = `
        <path d="M ${(cx - hw).toFixed(2)} ${cy.toFixed(2)} Q ${cx.toFixed(2)} ${(cy + 3 * mouthScale).toFixed(2)} ${(cx + hw).toFixed(2)} ${cy.toFixed(2)}" stroke="${strokeColor}" stroke-width="${STROKE_W}" stroke-linecap="round" fill="none" />
        <path d="M ${(cx + hw * 0.2).toFixed(2)} ${(cy + 1).toFixed(2)} C ${(cx + hw * 0.2).toFixed(2)} ${(cy + 5 * mouthScale).toFixed(2)} ${(cx + hw * 0.8).toFixed(2)} ${(cy + 5 * mouthScale).toFixed(2)} ${(cx + hw * 0.8).toFixed(2)} ${(cy + 1).toFixed(2)} Z" fill="#FF5E7E" stroke="${strokeColor}" stroke-width="1.5" />
      `;
      break;
    }

    case 23: {
      // Lengua gigante feliz abierta
      const h = 5.5 * mouthScale;
      mouthSvg = `
        <path d="M ${(cx - hw * 1.1).toFixed(2)} ${cy.toFixed(2)} Q ${cx.toFixed(2)} ${(cy + h * 2.2).toFixed(2)} ${(cx + hw * 1.1).toFixed(2)} ${cy.toFixed(2)} Z" fill="${strokeColor}" />
        <ellipse cx="${cx.toFixed(2)}" cy="${(cy + h * 1.4).toFixed(2)}" rx="${(hw * 0.65).toFixed(2)}" ry="${(h * 0.65).toFixed(2)}" fill="#FF6584" />
      `;
      break;
    }

    case 24:
      // Smirk taza (sonrisa de lado curvada en U asimétrica)
      mouthSvg = `<path d="M ${(cx - hw * 0.5).toFixed(2)} ${(cy - 1).toFixed(2)} Q ${(cx - 1).toFixed(2)} ${(cy + 4 * mouthScale).toFixed(2)} ${(cx + hw * 0.9).toFixed(2)} ${(cy + 1).toFixed(2)}" stroke="${strokeColor}" stroke-width="${STROKE_W}" stroke-linecap="round" fill="none" />`;
      break;

    case 0:
    default:
      if (Math.abs(mouthCurve) < 0.05 && mouthOpen < 0.05) {
        // Línea neutra simple
        mouthSvg = `<line x1="${(cx - hw).toFixed(2)}" y1="${cy.toFixed(2)}" x2="${(cx + hw).toFixed(2)}" y2="${cy.toFixed(2)}" stroke="${strokeColor}" stroke-width="${STROKE_W}" stroke-linecap="round" />`;
      } else if (mouthOpen > 0.1) {
        // Boca abierta dinámica con curvatura
        const h = (mouthOpen * 5 + 1.5) * mouthScale;
        const cyPeak = cy + mouthCurve * 5 * mouthScale;
        mouthSvg = `<path d="M ${(cx - hw).toFixed(2)} ${cy.toFixed(2)} Q ${cx.toFixed(2)} ${(cyPeak + h).toFixed(2)} ${(cx + hw).toFixed(2)} ${cy.toFixed(2)} Q ${cx.toFixed(2)} ${(cyPeak - h * 0.3).toFixed(2)} ${(cx - hw).toFixed(2)} ${cy.toFixed(2)} Z" fill="${strokeColor}" stroke="${strokeColor}" stroke-width="1.5" stroke-linejoin="round" />`;
      } else {
        // Arco de sonrisa/tristeza dinámico
        const cyPeak = cy + mouthCurve * 5 * mouthScale;
        mouthSvg = `<path d="M ${(cx - hw).toFixed(2)} ${cy.toFixed(2)} Q ${cx.toFixed(2)} ${cyPeak.toFixed(2)} ${(cx + hw).toFixed(2)} ${cy.toFixed(2)}" stroke="${strokeColor}" stroke-width="${STROKE_W}" stroke-linecap="round" fill="none" />`;
      }
      break;
  }

  const groupTransform = flipX ? 'translate(100, 0) scale(-1, 1)' : '';

  return `
    <svg viewBox="0 0 100 100" width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <style>
          @keyframes wissive-zzz-loop {
            0% { transform: translate(0px, 4px) scale(0.55); opacity: 0; }
            18% { transform: translate(3px, -2px) scale(0.85); opacity: 0.95; }
            55% { transform: translate(8px, -11px) scale(1.1); opacity: 1; }
            85% { transform: translate(14px, -19px) scale(0.85); opacity: 0.6; }
            100% { transform: translate(18px, -25px) scale(0.5); opacity: 0; }
          }
          @keyframes wissive-tear-drip {
            0% { transform: translateY(-2px) scaleY(0.7); opacity: 0.4; }
            50% { transform: translateY(5px) scaleY(1.18); opacity: 0.95; }
            85% { transform: translateY(12px) scaleY(0.8); opacity: 0.3; }
            100% { transform: translateY(15px) scaleY(0.3); opacity: 0; }
          }
          @keyframes wissive-sweat-slide {
            0% { transform: translateY(0px); opacity: 0.4; }
            50% { transform: translateY(5px); opacity: 0.95; }
            100% { transform: translateY(9px); opacity: 0.15; }
          }
          .wissive-silhouette-path {
            transition: fill 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          }
          .wissive-zzz-1 { animation: wissive-zzz-loop 3s cubic-bezier(0.33, 0, 0.25, 1) infinite 0s; transform-box: fill-box; transform-origin: center; }
          .wissive-zzz-2 { animation: wissive-zzz-loop 3s cubic-bezier(0.33, 0, 0.25, 1) infinite -1s; transform-box: fill-box; transform-origin: center; }
          .wissive-zzz-3 { animation: wissive-zzz-loop 3s cubic-bezier(0.33, 0, 0.25, 1) infinite -2s; transform-box: fill-box; transform-origin: center; }
          .wissive-anim-tear { animation: wissive-tear-drip 1.8s cubic-bezier(0.4, 0, 0.6, 1) infinite; transform-box: fill-box; transform-origin: top center; }
          .wissive-anim-sweat { animation: wissive-sweat-slide 2.2s ease-in-out infinite; transform-box: fill-box; transform-origin: top center; }
        </style>
      </defs>
      <g transform="${groupTransform}">
        <!-- Silueta del cuerpo (una o varias subformas: cuerpo + orejas, brazos…) -->
        ${silhouetteParts}
        <!-- Mejillas o Rayas -->
        ${cheeksSvg}
        <!-- Accesorios (ZZZ, Gotas) -->
        ${accessoriesSvg}
        <!-- Lágrimas -->
        ${tearsSvg}
        <!-- Ojos -->
        ${leftEyeSvg}
        ${rightEyeSvg}
        <!-- Cejas -->
        ${browsSvg}
        <!-- Boca -->
        ${mouthSvg}
      </g>
    </svg>
  `;
}

export function renderSvgElement(
  silhouette: SilhouetteType,
  baseColor: string,
  params: FaceParameters,
  size: number,
  renderOptions: RenderOptions = {}
): string {
  return buildFace(silhouette, baseColor, params, size, renderOptions);
}
