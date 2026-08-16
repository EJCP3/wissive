import type { FaceParameters, SilhouetteType } from '../emojis/types';
import { spiralPoints } from './spiral.ts';

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
      return 'M 50 20.83 C 73.33 20.83 87.5 31.67 87.5 47.5 C 87.5 64.17 73.33 75.83 50 75.83 C 26.67 75.83 12.5 64.17 12.5 47.5 C 12.5 31.67 26.67 20.83 50 20.83 Z';

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
  const silhouettePath = getSilhouettePath(silhouette);
  // Una silueta puede tener varias subformas (cuerpo + orejas). Se dibuja cada una
  // como <path> propio: así el solapamiento une en vez de recortar agujeros.
  const silhouetteParts = silhouettePath
    .split(/(?=M )/)
    .map((d) => d.trim())
    .filter(Boolean)
    .map((d) => `<path d="${d}" fill="${baseColor}" />`)
    .join('');

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
        // Arco hacia arriba ^ ^
        return `<g ${eyeTransform}><path d="M ${x - 5.83 * eyeScale} ${y + 1.67 * eyeScale} Q ${x} ${y - 5.83 * eyeScale} ${x + 5.83 * eyeScale} ${y + 1.67 * eyeScale}" stroke="${strokeColor}" stroke-width="${STROKE_W}" stroke-linecap="round" fill="none" /></g>`;

      case 2:
        // Cuña > <
        return isRight
          ? `<g ${eyeTransform}><path d="M ${x + 3.33 * eyeScale} ${y - 5 * eyeScale} L ${x - 3.33 * eyeScale} ${y} L ${x + 3.33 * eyeScale} ${y + 5 * eyeScale}" stroke="${strokeColor}" stroke-width="${STROKE_W}" stroke-linecap="round" stroke-linejoin="round" fill="none" /></g>`
          : `<g ${eyeTransform}><path d="M ${x - 3.33 * eyeScale} ${y - 5 * eyeScale} L ${x + 3.33 * eyeScale} ${y} L ${x - 3.33 * eyeScale} ${y + 5 * eyeScale}" stroke="${strokeColor}" stroke-width="${STROKE_W}" stroke-linecap="round" stroke-linejoin="round" fill="none" /></g>`;

      case 3:
        return isRight
          ? `<g ${eyeTransform}><line x1="${x - 5 * eyeScale}" y1="${y + 3 * eyeScale}" x2="${x + 5 * eyeScale}" y2="${y - 3 * eyeScale}" stroke="${strokeColor}" stroke-width="3.2" stroke-linecap="round" /></g>`
          : `<g ${eyeTransform}><line x1="${x - 5 * eyeScale}" y1="${y - 3 * eyeScale}" x2="${x + 5 * eyeScale}" y2="${y + 3 * eyeScale}" stroke="${strokeColor}" stroke-width="3.2" stroke-linecap="round" /></g>`;

      case 4:
        return isRight
          ? `<g ${eyeTransform}><line x1="${x - 5 * eyeScale}" y1="${y - 3 * eyeScale}" x2="${x + 5 * eyeScale}" y2="${y + 3 * eyeScale}" stroke="${strokeColor}" stroke-width="3.2" stroke-linecap="round" /></g>`
          : `<g ${eyeTransform}><line x1="${x - 5 * eyeScale}" y1="${y + 3 * eyeScale}" x2="${x + 5 * eyeScale}" y2="${y - 3 * eyeScale}" stroke="${strokeColor}" stroke-width="3.2" stroke-linecap="round" /></g>`;

      case 5:
        // Ojo con pupila (blanco sin contorno + pupila baja)
        return `<g ${eyeTransform}>
          <ellipse cx="${x}" cy="${y}" rx="${5 * eyeScale}" ry="${5.83 * eyeScale}" fill="#ffffff" />
          <circle cx="${x}" cy="${y + 0.83 * eyeScale}" r="${2.17 * eyeScale}" fill="${strokeColor}" />
        </g>`;

      case 6:
        return `<g ${eyeTransform} fill="#E3536C"><path d="M ${x} ${y + 5 * eyeScale} C ${x - 8 * eyeScale} ${y - 2 * eyeScale} ${x - 5 * eyeScale} ${y - 7 * eyeScale} ${x} ${y - 3 * eyeScale} C ${x + 5 * eyeScale} ${y - 7 * eyeScale} ${x + 8 * eyeScale} ${y - 2 * eyeScale} ${x} ${y + 5 * eyeScale} Z" /></g>`;

      case 7:
        return `<g ${eyeTransform} stroke="${strokeColor}" stroke-width="3.2">
          <line x1="${x - 4.5 * eyeScale}" y1="${y - 4.5 * eyeScale}" x2="${x + 4.5 * eyeScale}" y2="${y + 4.5 * eyeScale}" stroke-linecap="round" />
          <line x1="${x - 4.5 * eyeScale}" y1="${y + 4.5 * eyeScale}" x2="${x + 4.5 * eyeScale}" y2="${y - 4.5 * eyeScale}" stroke-linecap="round" />
        </g>`;

      case 8:
        return `<g ${eyeTransform} stroke="${strokeColor}" stroke-width="2.8" stroke-linecap="round">
          <line x1="${x - 5 * eyeScale}" y1="${y - 2}" x2="${x + 5 * eyeScale}" y2="${y - 2}" />
          <line x1="${x - 5 * eyeScale}" y1="${y + 2}" x2="${x + 5 * eyeScale}" y2="${y + 2}" />
        </g>`;

      case 9:
        if (isRight) return '';
        return `<g transform="translate(0, 0)">
          <path d="M ${leftProj.projX - 12} ${y - 2} L ${rightProj.projX + 12} ${y - 2}" stroke="${strokeColor}" stroke-width="2.8" />
          <rect x="${leftProj.projX - 9}" y="${y - 6}" width="16" height="12" rx="3" fill="${strokeColor}" />
          <rect x="${rightProj.projX - 7}" y="${y - 6}" width="16" height="12" rx="3" fill="${strokeColor}" />
        </g>`;

      case 10:
        if (!isRight) {
          return `<g ${eyeTransform}><ellipse cx="${x}" cy="${y}" rx="${6 * eyeScale}" ry="${8 * eyeScale}" fill="${strokeColor}" /></g>`;
        }
        return `<g ${eyeTransform}><circle cx="${x}" cy="${y}" r="${3.2 * eyeScale}" fill="${strokeColor}" /></g>`;

      case 11:
        if (!isRight) {
          return `<g ${eyeTransform}><line x1="${x - 5 * eyeScale}" y1="${y}" x2="${x + 5 * eyeScale}" y2="${y}" stroke="${strokeColor}" stroke-width="3.2" stroke-linecap="round" /></g>`;
        }
        return `<g ${eyeTransform}><circle cx="${x}" cy="${y}" r="${4.2 * eyeScale}" fill="${strokeColor}" /></g>`;

      case 12:
        return `<g ${eyeTransform}>
          <ellipse cx="${x}" cy="${y}" rx="${3 * eyeScale}" ry="${6 * eyeScale}" fill="${strokeColor}" />
        </g>`;

      case 13:
        return `<g ${eyeTransform}><circle cx="${x}" cy="${y}" r="${6.5 * eyeScale}" fill="${strokeColor}" /></g>`;

      case 14:
        // Arco hacia abajo — ojos cerrados serenos (Nima)
        return `<g ${eyeTransform}><path d="M ${x - 5.83 * eyeScale} ${y - 1.67 * eyeScale} Q ${x} ${y + 5.83 * eyeScale} ${x + 5.83 * eyeScale} ${y - 1.67 * eyeScale}" stroke="${strokeColor}" stroke-width="${STROKE_W}" stroke-linecap="round" fill="none" /></g>`;

      case 15:
        // Párpado caído (Dozy, Wilt)
        return isRight
          ? `<g ${eyeTransform}><path d="M ${x + 6.67 * eyeScale} ${y + 2.5 * eyeScale} Q ${x} ${y - 5 * eyeScale} ${x - 6.67 * eyeScale} ${y - 0.83 * eyeScale}" stroke="${strokeColor}" stroke-width="${STROKE_W}" stroke-linecap="round" fill="none" /></g>`
          : `<g ${eyeTransform}><path d="M ${x - 6.67 * eyeScale} ${y + 2.5 * eyeScale} Q ${x} ${y - 5 * eyeScale} ${x + 6.67 * eyeScale} ${y - 0.83 * eyeScale}" stroke="${strokeColor}" stroke-width="${STROKE_W}" stroke-linecap="round" fill="none" /></g>`;

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
        const k = r * 0.22; // qué tan "pinchado" queda el centro entre puntas
        const d = `M ${x} ${y - r} Q ${x + k} ${y - k} ${x + r} ${y} Q ${x + k} ${y + k} ${x} ${y + r} Q ${x - k} ${y + k} ${x - r} ${y} Q ${x - k} ${y - k} ${x} ${y - r} Z`;
        return `<g ${eyeTransform}><path d="${d}" fill="${strokeColor}" /></g>`;
      }

      case 22:
        // Reojo — pupila corrida al mismo lado en ambos ojos (desconfianza)
        return `<g ${eyeTransform}>
          <ellipse cx="${x}" cy="${y}" rx="${5.5 * eyeScale}" ry="${3.3 * eyeScale}" fill="#ffffff" stroke="${strokeColor}" stroke-width="1.4" />
          <circle cx="${x - 2.2 * eyeScale}" cy="${y}" r="${1.8 * eyeScale}" fill="${strokeColor}" />
        </g>`;

      case 23:
        // Guiño de un solo ojo — a diferencia de 3/4 (que espejan la misma
        // diagonal en los dos ojos), acá uno se cierra y el otro queda normal
        return isRight
          ? `<g ${eyeTransform}><ellipse cx="${x}" cy="${y}" rx="${2.83 * eyeScale}" ry="${Math.max(0.5, 2.83 * eyeScale * Math.max(0.05, params.eyeOpen))}" fill="${strokeColor}" /></g>`
          : `<g ${eyeTransform}><path d="M ${x - 5 * eyeScale} ${y} Q ${x} ${y + 4 * eyeScale} ${x + 5 * eyeScale} ${y}" stroke="${strokeColor}" stroke-width="${STROKE_W}" stroke-linecap="round" fill="none" /></g>`;

      case 24: {
        // Ojo grande estilo anime, con brillo — óvalo relleno + punto blanco
        const rx = 4.2 * eyeScale, ry = 5.8 * eyeScale;
        return `<g ${eyeTransform}>
          <ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${strokeColor}" />
          <circle cx="${x - rx * 0.35}" cy="${y - ry * 0.4}" r="${1.3 * eyeScale}" fill="#ffffff" />
        </g>`;
      }

      case 25:
        // Entrecerrado con pestaña — mirada relajada
        return isRight
          ? `<g ${eyeTransform}>
              <path d="M ${x - 5 * eyeScale} ${y} Q ${x} ${y + 2 * eyeScale} ${x + 5 * eyeScale} ${y}" stroke="${strokeColor}" stroke-width="${STROKE_W}" stroke-linecap="round" fill="none" />
              <line x1="${x + 5 * eyeScale}" y1="${y - 0.5 * eyeScale}" x2="${x + 7 * eyeScale}" y2="${y - 2.5 * eyeScale}" stroke="${strokeColor}" stroke-width="2" stroke-linecap="round" />
            </g>`
          : `<g ${eyeTransform}>
              <path d="M ${x - 5 * eyeScale} ${y} Q ${x} ${y + 2 * eyeScale} ${x + 5 * eyeScale} ${y}" stroke="${strokeColor}" stroke-width="${STROKE_W}" stroke-linecap="round" fill="none" />
              <line x1="${x - 5 * eyeScale}" y1="${y - 0.5 * eyeScale}" x2="${x - 7 * eyeScale}" y2="${y - 2.5 * eyeScale}" stroke="${strokeColor}" stroke-width="2" stroke-linecap="round" />
            </g>`;

      case 26:
        // Saltón — aro hueco con pupila corrida a una esquina (googly eyes)
        return `<g ${eyeTransform}>
          <circle cx="${x}" cy="${y}" r="${5 * eyeScale}" fill="none" stroke="${strokeColor}" stroke-width="2.2" />
          <circle cx="${x + 1.6 * eyeScale}" cy="${y + 1.6 * eyeScale}" r="${1.7 * eyeScale}" fill="${strokeColor}" />
        </g>`;

      case 27: {
        // Cascada ⊓⊓ — ojos "desbordado llorando" de anime/manga
        const w = 4 * eyeScale, h = 8 * eyeScale;
        return `<g ${eyeTransform}><path d="M ${x - w} ${y + h} L ${x - w} ${y - h} L ${x + w} ${y - h} L ${x + w} ${y + h}" stroke="${strokeColor}" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" fill="none" /></g>`;
      }

      case 28:
        // Mirada plana — óvalo fijo, no reacciona a eyeOpen (a diferencia del
        // 0 default), "no me importa nada" permanente
        return `<g ${eyeTransform}><ellipse cx="${x}" cy="${y}" rx="${4.5 * eyeScale}" ry="${3 * eyeScale}" fill="${strokeColor}" /></g>`;

      case 29:
        // Ceja preocupada — arco hacia arriba + pupila chica debajo
        return `<g ${eyeTransform}>
          <path d="M ${x - 4 * eyeScale} ${y - 3 * eyeScale} Q ${x} ${y - 6 * eyeScale} ${x + 4 * eyeScale} ${y - 2.5 * eyeScale}" stroke="${strokeColor}" stroke-width="2" stroke-linecap="round" fill="none" />
          <circle cx="${x}" cy="${y + 1.5 * eyeScale}" r="${1.6 * eyeScale}" fill="${strokeColor}" />
        </g>`;

      case 30:
        // Ceja enojada en zigzag — más dramática que la diagonal simple (17)
        return isRight
          ? `<g ${eyeTransform}><path d="M ${x + 6 * eyeScale} ${y - 6 * eyeScale} L ${x + 2 * eyeScale} ${y - 3 * eyeScale} L ${x + 5 * eyeScale} ${y - 1 * eyeScale} L ${x - 3 * eyeScale} ${y + 2 * eyeScale}" stroke="${strokeColor}" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round" fill="none" /></g>`
          : `<g ${eyeTransform}><path d="M ${x - 6 * eyeScale} ${y - 6 * eyeScale} L ${x - 2 * eyeScale} ${y - 3 * eyeScale} L ${x - 5 * eyeScale} ${y - 1 * eyeScale} L ${x + 3 * eyeScale} ${y + 2 * eyeScale}" stroke="${strokeColor}" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round" fill="none" /></g>`;

      case 31:
        // Aro con pupila chica centrada — mirada contenta, distinto del 20
        // (aro sin nada adentro) y del 26 (pupila grande corrida a un lado)
        return `<g ${eyeTransform}>
          <circle cx="${x}" cy="${y}" r="${4 * eyeScale}" fill="none" stroke="${strokeColor}" stroke-width="2" />
          <circle cx="${x}" cy="${y}" r="${1.3 * eyeScale}" fill="${strokeColor}" />
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
          <g transform="translate(0, ${dripY.toFixed(2)}) scale(${scaleY.toFixed(2)})">
            <!-- Lágrima redondita ojo izquierdo -->
            <path d="M ${lx} ${(lyNum - 2.5).toFixed(2)} C ${(lxNum + 2.2).toFixed(2)} ${(lyNum - 0.5).toFixed(2)} ${(lxNum + 2.2).toFixed(2)} ${(lyNum + 2.2).toFixed(2)} ${lx} ${(lyNum + 3.2).toFixed(2)} C ${(lxNum - 2.2).toFixed(2)} ${(lyNum + 2.2).toFixed(2)} ${(lxNum - 2.2).toFixed(2)} ${(lyNum - 0.5).toFixed(2)} ${lx} ${(lyNum - 2.5).toFixed(2)} Z" fill="#ffffff" />
            <!-- Lágrima redondita ojo derecho -->
            <path d="M ${rx} ${(lyNum - 2.5).toFixed(2)} C ${(rxNum + 2.2).toFixed(2)} ${(lyNum - 0.5).toFixed(2)} ${(rxNum + 2.2).toFixed(2)} ${(lyNum + 2.2).toFixed(2)} ${rx} ${(lyNum + 3.2).toFixed(2)} C ${(rxNum - 2.2).toFixed(2)} ${(lyNum + 2.2).toFixed(2)} ${(rxNum - 2.2).toFixed(2)} ${(lyNum - 0.5).toFixed(2)} ${rx} ${(lyNum - 2.5).toFixed(2)} Z" fill="#ffffff" />
          </g>
        </g>
      `;
    }
  }

  let accessoriesSvg = '';
  if (params.zzz) {
    const cycleTime = currentTime * 0.75;
    const zCount = 3;

    accessoriesSvg += `<g stroke="${strokeColor}" fill="none" stroke-linecap="round" stroke-linejoin="round">`;

    for (let i = 0; i < zCount; i++) {
      const progress = ((cycleTime + (i / zCount)) % 1);
      const x = 68 + progress * 20 + Math.sin(progress * Math.PI * 2) * 2;
      const y = 30 - progress * 26;
      const scale = 0.5 + Math.sin(progress * Math.PI) * 0.65;
      const opacity = Math.sin(progress * Math.PI) * 0.95;

      const strokeW = (1.8 + scale * 0.7).toFixed(2);
      const zScale = scale.toFixed(2);

      if (opacity > 0.01) {
        accessoriesSvg += `
          <g transform="translate(${x.toFixed(2)}, ${y.toFixed(2)}) scale(${zScale}) translate(-72, -31)" opacity="${opacity.toFixed(2)}">
            <path d="M 68 28 L 76 28 L 68 34 L 76 34" stroke-width="${strokeW}" />
          </g>
        `;
      }
    }
    accessoriesSvg += `</g>`;
  }

  if (params.sweat) {
    // Varias gotas, no una sola: cada una en su propia fase y en un lado
    // distinto de la frente, para que se lea como agotamiento de verdad
    const drops = [
      { x: 80, delay: 0, scale: 1 },
      { x: 20, delay: 0.4, scale: 0.85 },
      { x: 71, delay: 0.7, scale: 0.7 },
    ];
    const sweatOpacity = Math.min(1, params.sweat);

    accessoriesSvg += `<g fill="#7FA6D9">`;
    for (const drop of drops) {
      const progress = (currentTime * 1.2 + drop.delay) % 1;
      const dropY = 25 + progress * 7; // 25 = centro Y del path base
      const opacity = sweatOpacity * Math.sin(progress * Math.PI);
      if (opacity > 0.01) {
        // Escala alrededor del propio centro de la gota (80, 25), luego la
        // mueve a su posición final — si se escala desde el origen del
        // viewBox, la gota "vuela" en vez de encogerse en su sitio.
        accessoriesSvg += `
          <g transform="translate(${drop.x}, ${dropY.toFixed(2)}) scale(${drop.scale}) translate(-80, -25)" opacity="${opacity.toFixed(2)}">
            <path d="M 76 26 C 76 22 80 20 80 20 C 80 20 84 22 84 26 C 84 28.5 82.2 30 80 30 C 77.8 30 76 28.5 76 26 Z" />
          </g>
        `;
      }
    }
    accessoriesSvg += `</g>`;
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

  let browsSvg = '';
  if (params.browY !== 0 || params.browTilt !== 0) {
    const browBaseY = 32 + params.browY + gazeY * 0.5;
    const leftAngle = params.browTilt;
    const rightAngle = -params.browTilt;

    browsSvg = `
      <g transform="rotate(${leftAngle}, ${leftProj.projX}, ${browBaseY})">
        <line x1="${leftProj.projX - 6}" y1="${browBaseY}" x2="${leftProj.projX + 6}" y2="${browBaseY}" stroke="${strokeColor}" stroke-width="2.8" stroke-linecap="round" />
      </g>
      <g transform="rotate(${rightAngle}, ${rightProj.projX}, ${browBaseY})">
        <line x1="${rightProj.projX - 6}" y1="${browBaseY}" x2="${rightProj.projX + 6}" y2="${browBaseY}" stroke="${strokeColor}" stroke-width="2.8" stroke-linecap="round" />
      </g>
    `;
  }

  // Boca (24 tipos únicos, 0-24, más el default por mouthCurve)
  const mouthType = Math.round(params.mouthType ?? 0);
  const mouthW = Math.max(0, 14 * params.mouthWidth);
  const mouthX = 50 + gazeX * 0.6;
  const mouthY = (params.mouthY ?? 63) + gazeY * 0.4;

  let mouthSvg = '';
  switch (mouthType) {
    case 1: // ovalOpen / O
      mouthSvg = `<ellipse cx="${mouthX}" cy="${mouthY}" rx="${mouthW}" ry="${mouthW * 1.24}" fill="#B3554A" />`;
      break;

    case 2: { // zigzag / ~~~~
      const step = (mouthW * 2) / 4;
      let d = `M ${mouthX - mouthW} ${mouthY}`;
      for (let i = 1; i <= 4; i++) d += ` L ${mouthX - mouthW + step * i} ${mouthY + (i % 2 ? 2.83 : 0)}`;
      mouthSvg = `<path d="${d}" fill="none" stroke="${strokeColor}" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round" />`;
      break;
    }

    case 3: // flatLine / —
      mouthSvg = `<line x1="${mouthX - mouthW}" y1="${mouthY}" x2="${mouthX + mouthW}" y2="${mouthY}" stroke="${strokeColor}" stroke-width="${STROKE_W}" stroke-linecap="round" />`;
      break;

    case 13: // hollowCircle / o  (Fidge)
      mouthSvg = `<circle cx="${mouthX}" cy="${mouthY}" r="${mouthW * 2}" fill="none" stroke="${strokeColor}" stroke-width="2.8" />`;
      break;

    case 14: // sin boca (Nima)
      mouthSvg = '';
      break;

    case 4: // teethClench / [≡]
      mouthSvg = `
        <rect x="${mouthX - 10}" y="${mouthY - 4}" width="20" height="8" rx="2" fill="#ffffff" stroke="${strokeColor}" stroke-width="2.5" />
        <line x1="${mouthX - 10}" y1="${mouthY}" x2="${mouthX + 10}" y2="${mouthY}" stroke="${strokeColor}" stroke-width="1.8" />
        <line x1="${mouthX - 3}" y1="${mouthY - 4}" x2="${mouthX - 3}" y2="${mouthY + 4}" stroke="${strokeColor}" stroke-width="1.5" />
        <line x1="${mouthX + 3}" y1="${mouthY - 4}" x2="${mouthX + 3}" y2="${mouthY + 4}" stroke="${strokeColor}" stroke-width="1.5" />
      `;
      break;

    case 5: // teethGrin / Sonrisa con dientes superiores
      mouthSvg = `
        <path d="M ${mouthX - 12} ${mouthY - 2} Q ${mouthX} ${mouthY + 12} ${mouthX + 12} ${mouthY - 2} Z" fill="${strokeColor}" />
        <path d="M ${mouthX - 10} ${mouthY - 2} L ${mouthX + 10} ${mouthY - 2} L ${mouthX + 8} ${mouthY + 2} L ${mouthX - 8} ${mouthY + 2} Z" fill="#ffffff" />
      `;
      break;

    case 6: // wideHappyOpen / D
      mouthSvg = `<path d="M ${mouthX - 13} ${mouthY - 3} Q ${mouthX} ${mouthY + 14} ${mouthX + 13} ${mouthY - 3} Z" fill="#E87C8A" stroke="${strokeColor}" stroke-width="2.5" />`;
      break;

    case 7: // crossMouth / X
      mouthSvg = `
        <g stroke="${strokeColor}" stroke-width="3.5" stroke-linecap="round">
          <line x1="${mouthX - 5}" y1="${mouthY - 5}" x2="${mouthX + 5}" y2="${mouthY + 5}" />
          <line x1="${mouthX - 5}" y1="${mouthY + 5}" x2="${mouthX + 5}" y2="${mouthY - 5}" />
        </g>
      `;
      break;

    case 8: // maskCover / Mascarilla médica
      mouthSvg = `
        <g>
          <line x1="12" y1="${mouthY - 2}" x2="${mouthX - 14}" y2="${mouthY - 2}" stroke="#ffffff" stroke-width="2" />
          <line x1="12" y1="${mouthY + 4}" x2="${mouthX - 14}" y2="${mouthY + 4}" stroke="#ffffff" stroke-width="2" />
          <line x1="88" y1="${mouthY - 2}" x2="${mouthX + 14}" y2="${mouthY - 2}" stroke="#ffffff" stroke-width="2" />
          <line x1="88" y1="${mouthY + 4}" x2="${mouthX + 14}" y2="${mouthY + 4}" stroke="#ffffff" stroke-width="2" />
          <rect x="${mouthX - 15}" y="${mouthY - 7}" width="30" height="16" rx="3" fill="#ffffff" stroke="${strokeColor}" stroke-width="2.2" />
        </g>
      `;
      break;

    case 9: // wavyWMouth / ~ / 3
      mouthSvg = `<path d="M ${mouthX - 6} ${mouthY} Q ${mouthX - 3} ${mouthY - 3} ${mouthX} ${mouthY} Q ${mouthX + 3} ${mouthY - 3} ${mouthX + 6} ${mouthY}" fill="none" stroke="${strokeColor}" stroke-width="2.8" stroke-linecap="round" />`;
      break;

    case 10: // dotMouth / •
      mouthSvg = `<circle cx="${mouthX}" cy="${mouthY}" r="2.5" fill="${strokeColor}" />`;
      break;

    case 11: // diagonalLine / /
      mouthSvg = `<line x1="${mouthX - 6}" y1="${mouthY + 3}" x2="${mouthX + 6}" y2="${mouthY - 3}" stroke="${strokeColor}" stroke-width="3" stroke-linecap="round" />`;
      break;

    case 12: // frownCurve / ∩
      mouthSvg = `<path d="M ${mouthX - mouthW} ${mouthY + 4} Q ${mouthX} ${mouthY - 6} ${mouthX + mouthW} ${mouthY + 4}" fill="none" stroke="${strokeColor}" stroke-width="3.2" stroke-linecap="round" />`;
      break;

    case 15: // tongueOut / :P juguetón
      mouthSvg = `
        <path d="M ${mouthX - mouthW} ${mouthY} Q ${mouthX} ${mouthY + 6} ${mouthX + mouthW} ${mouthY}" fill="none" stroke="${strokeColor}" stroke-width="${STROKE_W}" stroke-linecap="round" />
        <path d="M ${mouthX - 3} ${mouthY + 2} Q ${mouthX} ${mouthY + 10} ${mouthX + 3} ${mouthY + 2} Z" fill="#E3536C" />
      `;
      break;

    case 16: // smirk / media sonrisa asimétrica
      mouthSvg = `<path d="M ${mouthX - mouthW} ${mouthY} Q ${mouthX + mouthW * 0.3} ${mouthY} ${mouthX + mouthW} ${mouthY - 5}" fill="none" stroke="${strokeColor}" stroke-width="${STROKE_W}" stroke-linecap="round" />`;
      break;

    case 17: // triangleMouth / gatito
      mouthSvg = `<path d="M ${mouthX - 3.5} ${mouthY - 2} L ${mouthX + 3.5} ${mouthY - 2} L ${mouthX} ${mouthY + 4} Z" fill="#E3536C" />`;
      break;

    case 18: // catThree / >3< — la curva doble típica de las caras kawaii
      mouthSvg = `<path d="M ${mouthX - 3} ${mouthY - 4} Q ${mouthX + 3} ${mouthY - 4} ${mouthX - 1} ${mouthY} Q ${mouthX + 3} ${mouthY + 4} ${mouthX - 3} ${mouthY + 4}" fill="none" stroke="${strokeColor}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" />`;
      break;

    case 19: // boxOpen / boca cuadrada de sorpresa
      mouthSvg = `<path d="M ${mouthX - 6} ${mouthY - 4} L ${mouthX + 6} ${mouthY - 4} L ${mouthX + 4} ${mouthY + 5} L ${mouthX - 4} ${mouthY + 5} Z" fill="#B3554A" stroke="${strokeColor}" stroke-width="2" />`;
      break;

    case 20: // pursed / mmm, boquita apretada
      mouthSvg = `<ellipse cx="${mouthX}" cy="${mouthY}" rx="3" ry="1.4" fill="none" stroke="${strokeColor}" stroke-width="2.2" />`;
      break;

    case 21: { // teethRow / sonrisa abierta con fila de dientes marcados
      const w = mouthW;
      let bars = '';
      for (let i = 1; i < 4; i++) {
        const bx = mouthX - w + ((2 * w) / 4) * i;
        bars += `<line x1="${bx.toFixed(2)}" y1="${mouthY - 4}" x2="${bx.toFixed(2)}" y2="${mouthY + 4}" stroke="${strokeColor}" stroke-width="1.3" />`;
      }
      mouthSvg = `<rect x="${(mouthX - w).toFixed(2)}" y="${mouthY - 4}" width="${(w * 2).toFixed(2)}" height="8" rx="2" fill="#ffffff" stroke="${strokeColor}" stroke-width="2.2" />${bars}`;
      break;
    }

    case 22: // sideTongue / lengua de costado, asimétrica (a diferencia de 15, centrada)
      mouthSvg = `
        <path d="M ${mouthX - mouthW} ${mouthY} Q ${mouthX} ${mouthY + 5} ${mouthX + mouthW} ${mouthY}" fill="none" stroke="${strokeColor}" stroke-width="${STROKE_W}" stroke-linecap="round" />
        <path d="M ${mouthX + mouthW - 3} ${mouthY + 2} Q ${mouthX + mouthW + 3} ${mouthY + 6} ${mouthX + mouthW - 1} ${mouthY + 9} Q ${mouthX + mouthW - 5} ${mouthY + 6} ${mouthX + mouthW - 3} ${mouthY + 2} Z" fill="#E3536C" />
      `;
      break;

    case 23: // megaTongue / boca abierta con lengua grande, goofy
      mouthSvg = `
        <path d="M ${mouthX - mouthW * 1.1} ${mouthY - 3} Q ${mouthX} ${mouthY + 10} ${mouthX + mouthW * 1.1} ${mouthY - 3} Z" fill="#8a2f36" />
        <ellipse cx="${mouthX}" cy="${mouthY + 4}" rx="${mouthW * 0.6}" ry="4" fill="#E3536C" />
      `;
      break;

    case 24: // catCup / sonrisa sassy con labio inferior marcado
      mouthSvg = `
        <path d="M ${mouthX - mouthW} ${mouthY} Q ${mouthX} ${mouthY + 7} ${mouthX + mouthW} ${mouthY - 2}" fill="none" stroke="${strokeColor}" stroke-width="${STROKE_W}" stroke-linecap="round" />
        <ellipse cx="${mouthX + mouthW * 0.3}" cy="${mouthY + 3}" rx="2" ry="1.2" fill="#E3536C" opacity="0.7" />
      `;
      break;

    case 0:
    default:
      // smileCurve estándar
      if (params.mouthCurve === 0) {
        mouthSvg = `<line x1="${mouthX - mouthW}" y1="${mouthY}" x2="${mouthX + mouthW}" y2="${mouthY}" stroke="${strokeColor}" stroke-width="${STROKE_W}" stroke-linecap="round" />`;
      } else {
        const mouthControlY = mouthY + params.mouthCurve * 14;
        mouthSvg = `<path d="M ${mouthX - mouthW} ${mouthY} Q ${mouthX} ${mouthControlY.toFixed(2)} ${mouthX + mouthW} ${mouthY}" fill="none" stroke="${strokeColor}" stroke-width="${STROKE_W}" stroke-linecap="round" />`;
      }
      break;
  }

  // Mejillas o rayas de sonrojo
  const cheekOpacity = Math.max(0, Math.min(1, params.cheek));
  let cheeksSvg = '';
  if (params.blushStripes) {
    cheeksSvg = `
      <g stroke="#E3536C" stroke-width="2" opacity="0.75" stroke-linecap="round">
        <line x1="20" y1="52" x2="24" y2="58" />
        <line x1="24" y1="52" x2="28" y2="58" />
        <line x1="28" y1="52" x2="32" y2="58" />
        <line x1="68" y1="52" x2="72" y2="58" />
        <line x1="72" y1="52" x2="76" y2="58" />
        <line x1="76" y1="52" x2="80" y2="58" />
      </g>
    `;
  } else if (cheekOpacity > 0.01) {
    cheeksSvg = `
      <ellipse cx="${27 + gazeX * 0.4}" cy="${56 + gazeY * 0.4}" rx="6" ry="4" fill="${cheekColor}" opacity="${cheekOpacity.toFixed(2)}" />
      <ellipse cx="${73 + gazeX * 0.4}" cy="${56 + gazeY * 0.4}" rx="6" ry="4" fill="${cheekColor}" opacity="${cheekOpacity.toFixed(2)}" />
    `;
  }

  const groupTransform = [
    `translate(${(params.shiftX ?? 0).toFixed(2)}, ${params.bob.toFixed(2)})`,
    flipX ? 'translate(100, 0) scale(-1, 1)' : '',
    emphasis ? 'translate(50, 50) scale(1.1) translate(-50, -50)' : '',
  ].filter(Boolean).join(' ');

  return `
    <svg width="${size}" height="${size}" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" style="overflow: visible;">
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
