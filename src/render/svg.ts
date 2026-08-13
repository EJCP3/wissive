import { FaceParameters, SilhouetteType } from '../emojis/types';

export function getSilhouettePath(silhouette: SilhouetteType): string {
  switch (silhouette) {
    case 'heart':
      // Corazón rechoncho y llenito (Mochi)
      return 'M 50 25 C 44 10 16 10 8 32 C 2 52 24 76 50 88 C 76 76 98 52 92 32 C 84 10 56 10 50 25 Z';

    case 'round-blob':
      return 'M 50 12 C 78 12 90 26 90 52 C 90 78 78 88 50 88 C 22 88 10 78 10 52 C 10 26 22 12 50 12 Z';

    case 'ghost-blob':
      return 'M 50 12 C 76 12 88 24 88 48 C 88 66 88 78 88 88 C 76 80 68 92 58 88 C 48 84 40 92 30 88 C 20 84 12 90 12 88 C 12 78 12 66 12 48 C 12 24 24 12 50 12 Z';

    case 'oval':
      return 'M 50 8 C 78 8 88 28 88 52 C 88 76 76 92 50 92 C 24 92 12 76 12 52 C 12 28 22 8 50 8 Z';

    case 'elongated-oval':
      return 'M 50 18 C 78 18 94 30 94 52 C 94 74 78 86 50 86 C 22 86 6 74 6 52 C 6 30 22 18 50 18 Z';

    case 'teardrop-blob':
      return 'M 50 14 C 76 14 90 26 90 52 C 90 76 76 88 50 88 C 24 88 10 76 10 52 C 10 26 24 14 50 14 Z';

    case 'flame-blob':
      return 'M 50 16 L 58 4 L 64 20 L 74 6 L 82 22 L 90 32 C 92 54 88 86 50 86 C 12 86 8 54 10 32 L 18 22 L 26 6 L 36 20 L 42 4 Z';

    case 'droopy-blob':
      return 'M 50 16 C 68 16 78 26 78 44 C 84 56 94 72 82 88 C 66 94 34 94 18 88 C 6 72 16 56 22 44 C 22 26 32 16 50 16 Z';

    case 'bear-blob':
      return 'M 50 18 C 58 18 64 8 74 8 C 84 8 86 18 88 28 C 92 46 90 68 82 84 C 72 90 62 90 50 90 C 38 90 28 90 18 84 C 10 68 8 46 12 28 C 14 18 16 8 26 8 C 36 8 42 18 50 18 Z';

    case 'spiky-blob':
      return 'M 50 12 C 76 12 88 26 88 48 C 88 64 88 78 84 86 C 78 82 72 92 64 86 C 56 82 50 90 44 86 C 36 92 30 82 12 48 C 12 26 24 12 50 12 Z';

    case 'cloud-blob':
      return 'M 50 14 C 66 10 78 18 84 28 C 90 38 92 52 86 64 C 82 76 72 86 58 88 C 44 90 34 84 26 88 C 14 86 8 74 10 62 C 12 50 10 38 18 28 C 26 18 34 10 50 14 Z';

    default:
      return 'M 50 12 C 78 12 90 26 90 52 C 90 78 78 88 50 88 C 22 88 10 78 10 52 C 10 26 22 12 50 12 Z';
  }
}

export interface RenderOptions {
  flipX?: boolean;
  emphasis?: boolean;
}

export function buildFace(
  silhouette: SilhouetteType,
  baseColor: string,
  params: FaceParameters,
  size: number,
  renderOptions: RenderOptions = {}
): string {
  const strokeColor = '#2C2C2A';
  const cheekColor = '#F0997B';
  const silhouettePath = getSilhouettePath(silhouette);

  const { flipX = false, emphasis = false } = renderOptions;

  const gazeX = Math.max(-13.2, Math.min(13.2, params.gazeX ?? 0));
  const gazeY = Math.max(-8.4, Math.min(8.4, params.gazeY ?? 0));

  const baseEyeY = 45 + gazeY;
  const rawLeftEyeX = 34 + gazeX;
  const rawRightEyeX = 66 + gazeX;

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
        // Arcos felices ^ ^ / closedArc
        return `<g ${eyeTransform}><path d="M ${x - 5 * eyeScale} ${y + 2} Q ${x} ${y - 5 * eyeScale} ${x + 5 * eyeScale} ${y + 2}" stroke="${strokeColor}" stroke-width="3.2" stroke-linecap="round" fill="none" /></g>`;

      case 2:
        // Cuñas guiño > < / squintWedge
        return isRight
          ? `<g ${eyeTransform}><path d="M ${x + 5 * eyeScale} ${y - 3 * eyeScale} L ${x - 3 * eyeScale} ${y} L ${x + 5 * eyeScale} ${y + 3 * eyeScale}" stroke="${strokeColor}" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" fill="none" /></g>`
          : `<g ${eyeTransform}><path d="M ${x - 5 * eyeScale} ${y - 3 * eyeScale} L ${x + 3 * eyeScale} ${y} L ${x - 5 * eyeScale} ${y + 3 * eyeScale}" stroke="${strokeColor}" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" fill="none" /></g>`;

      case 3:
        // Inclinado caído \ / / droopySlant
        return isRight
          ? `<g ${eyeTransform}><line x1="${x - 5 * eyeScale}" y1="${y + 3 * eyeScale}" x2="${x + 5 * eyeScale}" y2="${y - 3 * eyeScale}" stroke="${strokeColor}" stroke-width="3.2" stroke-linecap="round" /></g>`
          : `<g ${eyeTransform}><line x1="${x - 5 * eyeScale}" y1="${y - 3 * eyeScale}" x2="${x + 5 * eyeScale}" y2="${y + 3 * eyeScale}" stroke="${strokeColor}" stroke-width="3.2" stroke-linecap="round" /></g>`;

      case 4:
        // Inclinado enojado / \ / angrySlant
        return isRight
          ? `<g ${eyeTransform}><line x1="${x - 5 * eyeScale}" y1="${y - 3 * eyeScale}" x2="${x + 5 * eyeScale}" y2="${y + 3 * eyeScale}" stroke="${strokeColor}" stroke-width="3.2" stroke-linecap="round" /></g>`
          : `<g ${eyeTransform}><line x1="${x - 5 * eyeScale}" y1="${y + 3 * eyeScale}" x2="${x + 5 * eyeScale}" y2="${y - 3 * eyeScale}" stroke="${strokeColor}" stroke-width="3.2" stroke-linecap="round" /></g>`;

      case 5:
        // Anillo con pupila centro (•) (•) / pupilRings
        return `<g ${eyeTransform}>
          <circle cx="${x}" cy="${y}" r="${5.8 * eyeScale}" fill="#ffffff" stroke="${strokeColor}" stroke-width="2.5" />
          <circle cx="${x}" cy="${y}" r="${2.4 * eyeScale}" fill="${strokeColor}" />
        </g>`;

      case 6:
        // Ojos de corazón ♥ ♥ / heartEyes
        return `<g ${eyeTransform} fill="#E3536C"><path d="M ${x} ${y + 5 * eyeScale} C ${x - 8 * eyeScale} ${y - 2 * eyeScale} ${x - 5 * eyeScale} ${y - 7 * eyeScale} ${x} ${y - 3 * eyeScale} C ${x + 5 * eyeScale} ${y - 7 * eyeScale} ${x + 8 * eyeScale} ${y - 2 * eyeScale} ${x} ${y + 5 * eyeScale} Z" /></g>`;

      case 7:
        // Ojos en X x x / xEyes
        return `<g ${eyeTransform} stroke="${strokeColor}" stroke-width="3.2">
          <line x1="${x - 4.5 * eyeScale}" y1="${y - 4.5 * eyeScale}" x2="${x + 4.5 * eyeScale}" y2="${y + 4.5 * eyeScale}" stroke-linecap="round" />
          <line x1="${x - 4.5 * eyeScale}" y1="${y + 4.5 * eyeScale}" x2="${x + 4.5 * eyeScale}" y2="${y - 4.5 * eyeScale}" stroke-linecap="round" />
        </g>`;

      case 8:
        // Ranuras dobles/simples horizontales cansadas - - / tiredLineSlits
        return `<g ${eyeTransform} stroke="${strokeColor}" stroke-width="2.8" stroke-linecap="round">
          <line x1="${x - 5 * eyeScale}" y1="${y - 2}" x2="${x + 5 * eyeScale}" y2="${y - 2}" />
          <line x1="${x - 5 * eyeScale}" y1="${y + 2}" x2="${x + 5 * eyeScale}" y2="${y + 2}" />
        </g>`;

      case 9:
        // Gafas de sol negras estilo cool / sunglasses
        if (isRight) return ''; // Se dibuja el par de gafas como una sola pieza unificada
        return `<g transform="translate(0, 0)">
          <!-- Patilla y montura de gafas -->
          <path d="M ${leftProj.projX - 12} ${y - 2} L ${rightProj.projX + 12} ${y - 2}" stroke="${strokeColor}" stroke-width="2.8" />
          <!-- Lente Izquierdo -->
          <rect x="${leftProj.projX - 9}" y="${y - 6}" width="16" height="12" rx="3" fill="${strokeColor}" />
          <!-- Lente Derecho -->
          <rect x="${rightProj.projX - 7}" y="${y - 6}" width="16" height="12" rx="3" fill="${strokeColor}" />
        </g>`;

      case 10:
        // Asimétrico de shock (uno grande ovalado vertical, uno punto O •) / shockAsym
        if (!isRight) {
          return `<g ${eyeTransform}><ellipse cx="${x}" cy="${y}" rx="${6 * eyeScale}" ry="${8 * eyeScale}" fill="${strokeColor}" /></g>`;
        }
        return `<g ${eyeTransform}><circle cx="${x}" cy="${y}" r="${3.2 * eyeScale}" fill="${strokeColor}" /></g>`;

      case 11:
        // Guiño pícaro asimétrico (- •) / winkLineDot
        if (!isRight) {
          return `<g ${eyeTransform}><line x1="${x - 5 * eyeScale}" y1="${y}" x2="${x + 5 * eyeScale}" y2="${y}" stroke="${strokeColor}" stroke-width="3.2" stroke-linecap="round" /></g>`;
        }
        return `<g ${eyeTransform}><circle cx="${x}" cy="${y}" r="${4.2 * eyeScale}" fill="${strokeColor}" /></g>`;

      case 12:
        // Pánico con gotas / panicOpen
        return `<g ${eyeTransform}>
          <ellipse cx="${x}" cy="${y}" rx="${3 * eyeScale}" ry="${6 * eyeScale}" fill="${strokeColor}" />
        </g>`;

      case 13:
        // Ojos redondos muy abiertos O O / wideCircleEyes
        return `<g ${eyeTransform}><circle cx="${x}" cy="${y}" r="${6.5 * eyeScale}" fill="${strokeColor}" /></g>`;

      default:
        // Punto simple limpio • • / dotSimple
        const rx = 3.5 * effectiveScale;
        const ry = Math.max(0.6, 4.5 * params.eyeOpen * eyeScale);
        return `<ellipse cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" rx="${rx.toFixed(2)}" ry="${ry.toFixed(2)}" fill="${strokeColor}" />`;
    }
  };

  leftEyeSvg = leftProj.isVisible ? renderSingleEye(leftProj.projX, baseEyeY, leftProj.scaleX, false) : '';
  rightEyeSvg = rightProj.isVisible ? renderSingleEye(rightProj.projX, baseEyeY, rightProj.scaleX, true) : '';

  // Lágrimas de Lumo o cascada
  let tearsSvg = '';
  const tears = params.tears ?? 0;
  if (tears > 0.01) {
    const tearOpacity = Math.min(1, tears);
    if (params.cascadeTears) {
      // Cascada de lágrimas cubriendo la cara
      tearsSvg = `
        <g opacity="${tearOpacity.toFixed(2)}">
          <path d="M ${leftProj.projX - 3} ${baseEyeY + 4} L ${leftProj.projX - 6} 88 L ${leftProj.projX + 2} 88 Z" fill="#7FA6D9" opacity="0.85" />
          <path d="M ${rightProj.projX - 2} ${baseEyeY + 4} L ${rightProj.projX - 2} 88 L ${rightProj.projX + 6} 88 Z" fill="#7FA6D9" opacity="0.85" />
        </g>
      `;
    } else {
      tearsSvg = `
        <g opacity="${tearOpacity.toFixed(2)}">
          <path d="M ${leftProj.projX - 1} ${baseEyeY + 6} L ${leftProj.projX - 1} ${baseEyeY + 18}" stroke="#ffffff" stroke-width="3" stroke-linecap="round" />
          <path d="M ${rightProj.projX + 1} ${baseEyeY + 6} L ${rightProj.projX + 1} ${baseEyeY + 18}" stroke="#ffffff" stroke-width="3" stroke-linecap="round" />
        </g>
      `;
    }
  }

  // Accesorios adicionales: ZZZ, Gotas de sudor, Rayas de sonrojo
  let accessoriesSvg = '';
  if (params.zzz) {
    accessoriesSvg += `
      <g stroke="${strokeColor}" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round" opacity="0.85">
        <path d="M 70 20 L 78 20 L 70 28 L 78 28" />
        <path d="M 80 12 L 85 12 L 80 17 L 85 17" stroke-width="2" />
      </g>
    `;
  }

  if (params.sweat) {
    accessoriesSvg += `
      <g fill="#7FA6D9" opacity="${Math.min(1, params.sweat).toFixed(2)}">
        <path d="M 76 26 C 76 22 80 20 80 20 C 80 20 84 22 84 26 C 84 28.5 82.2 30 80 30 C 77.8 30 76 28.5 76 26 Z" />
      </g>
    `;
  }

  // Cejas
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

  // Boca (13 tipos únicos)
  const mouthType = Math.round(params.mouthType ?? 0);
  const mouthW = Math.max(3, 14 * params.mouthWidth);
  const mouthX = 50 + gazeX * 0.6;
  const mouthY = 63 + gazeY * 0.4;

  let mouthSvg = '';
  switch (mouthType) {
    case 1: // ovalOpen / O
      mouthSvg = `<ellipse cx="${mouthX}" cy="${mouthY}" rx="5" ry="7" fill="#E87C8A" stroke="${strokeColor}" stroke-width="2.5" />`;
      break;

    case 2: // zigzag / ~~~~
      mouthSvg = `<path d="M ${mouthX - 12} ${mouthY} L ${mouthX - 8} ${mouthY - 3} L ${mouthX - 4} ${mouthY + 2} L ${mouthX} ${mouthY - 3} L ${mouthX + 4} ${mouthY + 2} L ${mouthX + 8} ${mouthY - 3} L ${mouthX + 12} ${mouthY}" fill="none" stroke="${strokeColor}" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round" />`;
      break;

    case 3: // flatLine / —
      mouthSvg = `<line x1="${mouthX - mouthW}" y1="${mouthY}" x2="${mouthX + mouthW}" y2="${mouthY}" stroke="${strokeColor}" stroke-width="3.2" stroke-linecap="round" />`;
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

    case 0:
    default:
      // smileCurve estándar
      if (params.mouthCurve === 0) {
        mouthSvg = `<line x1="${mouthX - mouthW}" y1="${mouthY}" x2="${mouthX + mouthW}" y2="${mouthY}" stroke="${strokeColor}" stroke-width="3.2" stroke-linecap="round" />`;
      } else {
        const mouthControlY = mouthY + params.mouthCurve * 14;
        mouthSvg = `<path d="M ${mouthX - mouthW} ${mouthY} Q ${mouthX} ${mouthControlY.toFixed(2)} ${mouthX + mouthW} ${mouthY}" fill="none" stroke="${strokeColor}" stroke-width="3.2" stroke-linecap="round" />`;
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
      <g transform="${groupTransform}">
        <!-- Silueta del cuerpo -->
        <path d="${silhouettePath}" fill="${baseColor}" />
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
