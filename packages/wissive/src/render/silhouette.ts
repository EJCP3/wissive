import type { SilhouetteType } from '../emojis/types';

export const PROFILE_SAMPLES = 64;
export const TAU = Math.PI * 2;

export const ANGLES = Array.from({ length: PROFILE_SAMPLES }, (_, i) => (i / PROFILE_SAMPLES) * TAU);
export const COS = ANGLES.map(Math.cos);
export const SIN = ANGLES.map(Math.sin);

export interface Point {
  x: number;
  y: number;
}

/** Round number to 2 decimals to keep SVG path string light & fast */
export const r2 = (v: number) => Math.round(v * 100) / 100;

export const clamp = (v: number, lo = 0, hi = 1) => (v < lo ? lo : v > hi ? hi : v);
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/**
 * Superellipse formula: |x/sx|^n + |y/sy|^n = 1
 */
export function superellipseProfile(n: number, sx = 1, sy = 1): number[] {
  return ANGLES.map((_, i) => {
    const c = Math.abs((COS[i] ?? 0) / sx) ** n;
    const s = Math.abs((SIN[i] ?? 0) / sy) ** n;
    return (c + s) ** (-1 / n);
  });
}

/**
 * Normaliza los radios para que el radio máximo o medio sea consistente
 */
export function normalizeRadii(radii: number[], targetMax = 1.0): number[] {
  const peak = Math.max(...radii);
  if (peak <= 0) return radii;
  const k = targetMax / peak;
  return radii.map((r) => r * k);
}

/**
 * Perfil radial a partir de polígono 2D por raycasting desde el centro
 */
export function profileFromPolygon(poly: Point[], cx = 0, cy = 0): number[] {
  const radii = new Array<number>(PROFILE_SAMPLES).fill(1);
  const n = poly.length;
  for (let k = 0; k < PROFILE_SAMPLES; k++) {
    const dx = COS[k] ?? 0;
    const dy = SIN[k] ?? 0;
    let best = 0;
    for (let i = 0; i < n; i++) {
      const a = poly[i]!;
      const b = poly[(i + 1) % n]!;
      const ex = b.x - a.x;
      const ey = b.y - a.y;
      const den = dx * ey - dy * ex;
      if (Math.abs(den) < 1e-9) continue;
      const px = a.x - cx;
      const py = a.y - cy;
      const t = (px * ey - py * ex) / den;
      const u = (px * dy - py * dx) / den;
      if (t > best && u >= 0 && u <= 1) best = t;
    }
    radii[k] = best || 1;
  }
  return radii;
}

/**
 * Envolvente convexa de dos círculos (utilizado para cápsulas, gotas y peras)
 */
export function hullOfCircles(
  x1: number,
  y1: number,
  r1: number,
  x2: number,
  y2: number,
  r2v: number,
  steps = 96
): Point[] {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const dist = Math.hypot(dx, dy) || 1e-6;
  const base = Math.atan2(dy, dx);
  const spread = Math.acos(Math.max(-1, Math.min(1, (r1 - r2v) / dist)));
  const pts: Point[] = [];
  for (let i = 0; i <= steps / 2; i++) {
    const a = base + spread + ((TAU - 2 * spread) * i) / (steps / 2);
    pts.push({ x: x1 + Math.cos(a) * r1, y: y1 + Math.sin(a) * r1 });
  }
  for (let i = 0; i <= steps / 2; i++) {
    const a = base - spread + ((2 * spread) * i) / (steps / 2);
    pts.push({ x: x2 + Math.cos(a) * r2v, y: y2 + Math.sin(a) * r2v });
  }
  return pts;
}

function cubicBezierPoint(
  p0: Point,
  p1: Point,
  p2: Point,
  p3: Point,
  t: number
): Point {
  const mt = 1 - t;
  const mt2 = mt * mt;
  const t2 = t * t;
  return {
    x: mt2 * mt * p0.x + 3 * mt2 * t * p1.x + 3 * mt * t2 * p2.x + t2 * t * p3.x,
    y: mt2 * mt * p0.y + 3 * mt2 * t * p1.y + 3 * mt * t2 * p2.y + t2 * t * p3.y,
  };
}

/**
 * Genera el perfil de corazón basado exactamente en el trazado SVG artesanal kawaii de Mochi
 */
function createHeartProfile(): number[] {
  const segments: [Point, Point, Point, Point][] = [
    [{ x: 50, y: 21.67 }, { x: 54.17, y: 17.5 }, { x: 65, y: 12.5 }, { x: 74.17, y: 16.67 }],
    [{ x: 74.17, y: 16.67 }, { x: 85, y: 21.67 }, { x: 89.17, y: 35.83 }, { x: 85, y: 48.33 }],
    [{ x: 85, y: 48.33 }, { x: 80.83, y: 61.67 }, { x: 66.67, y: 74.17 }, { x: 50, y: 74.17 }],
    [{ x: 50, y: 74.17 }, { x: 33.33, y: 74.17 }, { x: 19.17, y: 61.67 }, { x: 15, y: 48.33 }],
    [{ x: 15, y: 48.33 }, { x: 10.83, y: 35.83 }, { x: 15, y: 21.67 }, { x: 25.83, y: 16.67 }],
    [{ x: 25.83, y: 16.67 }, { x: 35, y: 12.5 }, { x: 45.83, y: 17.5 }, { x: 50, y: 21.67 }],
  ];

  const poly: Point[] = [];
  const cx = 50;
  const cy = 46;
  const stepsPerSeg = 20;

  for (const seg of segments) {
    for (let i = 0; i < stepsPerSeg; i++) {
      const pt = cubicBezierPoint(seg[0], seg[1], seg[2], seg[3], i / stepsPerSeg);
      poly.push({ x: (pt.x - cx) / 36, y: (pt.y - cy) / 36 });
    }
  }

  return normalizeRadii(profileFromPolygon(poly, 0, 0), 1.05);
}

/**
 * Perfiles radiales precalculados (64 muestras cada uno)
 */
export const SILHOUETTE_PROFILES: Record<SilhouetteType, number[]> = {
  // Círculo neutro
  circle: new Array(PROFILE_SAMPLES).fill(1.0),

  // Corazón
  heart: createHeartProfile(),

  // Round Blob (Armónicos sutiles orgánicos)
  'round-blob': normalizeRadii(
    ANGLES.map((a) => 1 + 0.075 * Math.cos(2 * a + 0.5) + 0.035 * Math.cos(3 * a + 2.1)),
    1.02
  ),

  // Cápsula horizontal
  capsule: normalizeRadii(
    profileFromPolygon(hullOfCircles(-0.45, 0, 0.62, 0.45, 0, 0.62), 0, 0),
    1.08
  ),

  // Squircle (Superelipse n=4.2)
  'rounded-squircle': normalizeRadii(superellipseProfile(4.2), 1.12),

  // Pera (Base ancha, parte superior cónica)
  'pear-blob': normalizeRadii(
    ANGLES.map((a) => {
      const s = Math.sin(a); // y hacia abajo es positivo
      return 1.0 + 0.22 * s + 0.08 * Math.cos(2 * a);
    }),
    1.06
  ),

  // Huevo (Parte superior abovedada, base algo más compacta, proporción vertical exacta)
  'egg-oval': normalizeRadii(
    ANGLES.map((_, i) => {
      const c = (COS[i] ?? 0) / 0.86;
      const s = ((SIN[i] ?? 0) + 0.12 * (1 - Math.abs(COS[i] ?? 0))) / 1.16;
      return Math.sqrt(c * c + s * s) ** -1;
    }),
    1.08
  ),

  // Estrella / Puff (4 lóbulos hinchados)
  'starburst-puff': normalizeRadii(
    ANGLES.map((a) => 1.0 + 0.16 * Math.cos(4 * a)),
    1.08
  ),

  // Cápsula vertical (Píldora alta)
  'pill-vertical': normalizeRadii(
    profileFromPolygon(hullOfCircles(0, -0.42, 0.6, 0, 0.42, 0.6), 0, 0),
    1.08
  ),

  // Fantasma (Cúpula arriba y ondas ruffle abajo)
  'ghost-blob': normalizeRadii(
    ANGLES.map((a) => {
      const y = Math.sin(a);
      const wave = y > 0.2 ? 0.12 * Math.sin(a * 6) : 0;
      return 1.0 + (y < 0 ? 0.08 : 0.02) + wave;
    }),
    1.06
  ),

  // Óvalo suave
  oval: normalizeRadii(
    ANGLES.map((_, i) => {
      const c = (COS[i] ?? 0) / 1.15;
      const s = (SIN[i] ?? 0) / 0.9;
      return Math.sqrt(c * c + s * s) ** -1;
    }),
    1.05
  ),

  // Óvalo alargado
  'elongated-oval': normalizeRadii(
    ANGLES.map((_, i) => {
      const c = (COS[i] ?? 0) / 1.25;
      const s = (SIN[i] ?? 0) / 0.82;
      return Math.sqrt(c * c + s * s) ** -1;
    }),
    1.08
  ),

  // Gota / Teardrop (Punta afilada arriba, base redonda abajo)
  'teardrop-blob': normalizeRadii(
    profileFromPolygon(hullOfCircles(0, 0.26, 0.66, 0, -0.92, 0.06), 0, 0),
    1.08
  ),

  // Llama (3 crestas arriba, cuerpo curvo abajo)
  'flame-blob': normalizeRadii(
    ANGLES.map((a) => {
      const isTop = Math.sin(a) < 0;
      const flamePuffs = isTop ? 0.24 * Math.abs(Math.sin(a * 2.5)) : -0.04 * Math.cos(a * 2);
      return 1.0 + flamePuffs;
    }),
    1.08
  ),

  // Droopy / Wilt (Caído)
  'droopy-blob': normalizeRadii(
    ANGLES.map((a) => {
      const s = Math.sin(a);
      return 1.0 + 0.18 * Math.max(0, s) - 0.08 * Math.max(0, -s);
    }),
    1.05
  ),

  // Spiky blob
  'spiky-blob': normalizeRadii(
    ANGLES.map((a) => 1.0 + 0.18 * Math.sin(8 * a)),
    1.06
  ),

  // Cloud blob
  'cloud-blob': normalizeRadii(
    ANGLES.map((a) => 1.0 + 0.14 * Math.sin(5 * a + 0.4)),
    1.06
  ),

  // Wide oval
  'wide-oval': normalizeRadii(
    ANGLES.map((_, i) => {
      const c = (COS[i] ?? 0) / 1.28;
      const s = (SIN[i] ?? 0) / 0.78;
      return Math.sqrt(c * c + s * s) ** -1;
    }),
    1.08
  ),

  // Soft round
  'soft-round': normalizeRadii(
    ANGLES.map((a) => 1.0 + 0.04 * Math.cos(4 * a)),
    1.02
  ),

  // Octopus blob
  'octopus-blob': normalizeRadii(
    ANGLES.map((a) => {
      const y = Math.sin(a);
      return 1.0 + (y > 0.3 ? 0.15 * Math.sin(a * 7) : 0);
    }),
    1.06
  ),

  // Wave blob
  'wave-blob': normalizeRadii(
    ANGLES.map((a) => 1.0 + 0.12 * Math.sin(3 * a + 0.8)),
    1.04
  ),

  // Bear blob (Cuerpo redondeado con dos orejitas en -45° y -135°)
  'bear-blob': normalizeRadii(
    ANGLES.map((a) => {
      const ear1 = Math.exp(-Math.pow(Math.atan2(Math.sin(a - (-Math.PI * 0.25)), Math.cos(a - (-Math.PI * 0.25))), 2) / 0.12) * 0.35;
      const ear2 = Math.exp(-Math.pow(Math.atan2(Math.sin(a - (-Math.PI * 0.75)), Math.cos(a - (-Math.PI * 0.75))), 2) / 0.12) * 0.35;
      return 1.0 + ear1 + ear2;
    }),
    1.12
  ),
};

/**
 * Devuelve el perfil radial de 64 muestras para una silueta dada
 */
export function getSilhouetteProfile(type: SilhouetteType): number[] {
  return SILHOUETTES_PROFILES_MAP.get(type) || SILHOUETTE_PROFILES.circle;
}

const SILHOUETTES_PROFILES_MAP = new Map<string, number[]>(
  Object.entries(SILHOUETTE_PROFILES)
);

/**
 * Interpola linealmente entre dos conjuntos de 64 radios
 */
export function blendProfiles(a: number[], b: number[], t: number): number[] {
  const out = new Array<number>(PROFILE_SAMPLES);
  for (let i = 0; i < PROFILE_SAMPLES; i++) {
    out[i] = lerp(a[i] ?? 1, b[i] ?? 1, t);
  }
  return out;
}

/**
 * Convierte un perfil de 64 radios en 64 puntos 2D en coordenadas de SVG (cx, cy, radio base)
 */
export function toPoints(
  radii: number[],
  cx = 50,
  cy = 50,
  baseRadius = 37,
  scaleX = 1.0,
  scaleY = 1.0
): Point[] {
  const pts: Point[] = new Array(PROFILE_SAMPLES);
  for (let i = 0; i < PROFILE_SAMPLES; i++) {
    const r = (radii[i] ?? 1.0) * baseRadius;
    const px = cx + (COS[i] ?? 0) * r * scaleX;
    const py = cy + (SIN[i] ?? 0) * r * scaleY;
    pts[i] = { x: px, y: py };
  }
  return pts;
}

/**
 * Convierte polilínea cerrada de 64 puntos en curva Bézier cúbica Catmull-Rom cerrada continua
 */
export function closedCatmullRomPath(pts: Point[], tension = 1 / 6): string {
  const n = pts.length;
  if (n < 3) return '';
  const first = pts[0]!;
  let d = `M ${r2(first.x)} ${r2(first.y)}`;
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n]!;
    const p1 = pts[i]!;
    const p2 = pts[(i + 1) % n]!;
    const p3 = pts[(i + 2) % n]!;
    const c1x = p1.x + (p2.x - p0.x) * tension;
    const c1y = p1.y + (p2.y - p0.y) * tension;
    const c2x = p2.x - (p3.x - p1.x) * tension;
    const c2y = p2.y - (p3.y - p1.y) * tension;
    d += ` C ${r2(c1x)} ${r2(c1y)} ${r2(c2x)} ${r2(c2y)} ${r2(p2.x)} ${r2(p2.y)}`;
  }
  return `${d} Z`;
}

/**
 * Genera el SVG `<path d="..." />` suave a partir de cualquier perfil de 64 radios
 */
export function generateSilhouettePath(radii: number[], cx = 50, cy = 50, radius = 37): string {
  const points = toPoints(radii, cx, cy, radius);
  return closedCatmullRomPath(points);
}
