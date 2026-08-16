import type { EmojiDefinition, FaceParameters } from './types';

function createDefaultParams(overrides: Partial<FaceParameters> = {}): FaceParameters {
  return {
    eyeOpen: 1.0,
    eyeScale: 1.0,
    eyeType: 0,
    eyeGap: 32,
    eyeY: 45,
    mouthY: 63,
    mouthCurve: 0.0,
    mouthWidth: 0.8,
    mouthOpen: 0.0,
    mouthType: 0,
    browY: 0,
    browTilt: 0,
    cheek: 0,
    bob: 0,
    shiftX: 0,
    tears: 0,
    gazeX: 0,
    gazeY: 0,
    turnAngle: 0,
    // En 0 por defecto pero SIEMPRE presentes: el resorte solo anima claves
    // que existían en el objeto inicial. Si faltaran aquí, un override
    // procedural (p.ej. "sleeping" poniendo zzz=1) se descartaría en
    // silencio para cualquier emoji que no las trajera ya de fábrica.
    zzz: 0,
    sweat: 0,
    storm: 0,
    scribble: 0,
    puff: 0,
    ...overrides,
  };
}

// 1. Mochi (happy) - Corazón rosa feliz kawaii >‿<
export const EMOJI_MOCHI: EmojiDefinition = {
  name: 'mochi',
  emotion: 'happy',
  baseColor: '#F2A9B8',
  silhouette: 'heart',
  motion: {
    stiffness: 220,
    damping: 14,
    idleSpeed: 3.2,
    idleAmplitude: 2.5,
    idleIntervalMin: 6000,
    idleIntervalMax: 12000,
    motionType: 'bouncy',
  },
  expressions: {
    idle: [
      createDefaultParams({ eyeType: 2, eyeScale: 1, eyeGap: 28.33, eyeY: 43.33, mouthType: 0, mouthY: 53.33, mouthWidth: 0.39, mouthCurve: 0.43, cheek: 0 }), // >‿<
      createDefaultParams({ eyeType: 2, eyeScale: 1, eyeGap: 28.33, eyeY: 43.33, mouthType: 0, mouthY: 53.33, mouthWidth: 0.39, mouthCurve: 0.43, cheek: 0, bob: -1.5 }),
      createDefaultParams({ eyeType: 2, eyeScale: 1, eyeGap: 28.33, eyeY: 43.33, mouthType: 0, mouthY: 53.33, mouthWidth: 0.39, mouthCurve: 0.43, cheek: 0, bob: 1.0 }), // ^‿^
      createDefaultParams({ eyeType: 2, eyeScale: 1, eyeGap: 28.33, eyeY: 43.33, mouthType: 0, mouthY: 53.33, mouthWidth: 0.39, mouthCurve: 0.43, cheek: 0 }),
    ],
    near: [
      createDefaultParams({ eyeType: 2, eyeScale: 1, eyeGap: 28.33, eyeY: 43.33, mouthType: 0, mouthY: 53.33, mouthWidth: 0.39, mouthCurve: 0.43, cheek: 0, bob: -1.5 }),
      createDefaultParams({ eyeType: 2, eyeScale: 1, eyeGap: 28.33, eyeY: 43.33, mouthType: 0, mouthY: 53.33, mouthWidth: 0.39, mouthCurve: 0.43, cheek: 0, bob: -2.5 }),
    ],
    hover: [
      createDefaultParams({ eyeType: 2, eyeScale: 1, eyeGap: 28.33, eyeY: 43.33, mouthType: 0, mouthY: 53.33, mouthWidth: 0.39, mouthCurve: 0.43, cheek: 0.3, bob: -4 }),
      createDefaultParams({ eyeType: 2, eyeScale: 1, eyeGap: 28.33, eyeY: 43.33, mouthType: 0, mouthY: 53.33, mouthWidth: 0.39, mouthCurve: 0.43, cheek: 0.3, bob: -4.5 }),
    ],
    click: [
      createDefaultParams({ eyeType: 2, eyeScale: 1, eyeGap: 28.33, eyeY: 43.33, mouthType: 0, mouthY: 53.33, mouthWidth: 0.39, mouthCurve: 0.43, cheek: 0.5, bob: -7 }),
      createDefaultParams({ eyeType: 2, eyeScale: 1, eyeGap: 28.33, eyeY: 43.33, mouthType: 0, mouthY: 53.33, mouthWidth: 0.39, mouthCurve: 0.43, cheek: 0.5, bob: -6 }),
    ],
  },
};

// 2. Zumi (flutter) - Amarillo vibrante > - <
export const EMOJI_ZUMI: EmojiDefinition = {
  name: 'zumi',
  emotion: 'flutter',
  baseColor: '#F2CB4E',
  silhouette: 'round-blob',
  motion: {
    stiffness: 300,
    damping: 10,
    idleSpeed: 4.5,
    idleAmplitude: 3.8,
    idleIntervalMin: 4000,
    idleIntervalMax: 9000,
    motionType: 'flutter',
  },
  expressions: {
    idle: [
      createDefaultParams({ eyeType: 2, eyeScale: 1, eyeGap: 30, eyeY: 43.33, mouthType: 3, mouthY: 45.83, mouthWidth: 0.27, mouthCurve: 0, cheek: 0.3 }),
      createDefaultParams({ eyeType: 2, eyeScale: 1, eyeGap: 30, eyeY: 43.33, mouthType: 3, mouthY: 45.83, mouthWidth: 0.27, mouthCurve: 0, cheek: 0.4, bob: -1.5 }),
      createDefaultParams({ eyeType: 2, eyeScale: 1, eyeGap: 30, eyeY: 43.33, mouthType: 3, mouthY: 45.83, mouthWidth: 0.27, mouthCurve: 0, cheek: 0.35, bob: 1 }),
    ],
    near: [
      createDefaultParams({ eyeType: 2, eyeScale: 1, eyeGap: 30, eyeY: 43.33, mouthType: 3, mouthY: 45.83, mouthWidth: 0.27, mouthCurve: 0, cheek: 0.5, bob: -2 }),
    ],
    hover: [
      createDefaultParams({ eyeType: 2, eyeScale: 1, eyeGap: 30, eyeY: 43.33, mouthType: 3, mouthY: 45.83, mouthWidth: 0.27, mouthCurve: 0, cheek: 0.7, bob: -4 }),
    ],
    click: [
      createDefaultParams({ eyeType: 2, eyeScale: 1, eyeGap: 30, eyeY: 43.33, mouthType: 3, mouthY: 45.83, mouthWidth: 0.27, mouthCurve: 0, cheek: 0.9, bob: -6 }),
    ],
  },
};

// 3. Suri (pleasure) - Rosa pastel ^ ^
export const EMOJI_SURI: EmojiDefinition = {
  name: 'suri',
  emotion: 'pleasure',
  baseColor: '#F28FC2',
  silhouette: 'elongated-oval',
  motion: {
    stiffness: 140,
    damping: 18,
    idleSpeed: 1.8,
    idleAmplitude: 1.8,
    idleIntervalMin: 7000,
    idleIntervalMax: 14000,
    motionType: 'serene',
  },
  expressions: {
    idle: [
      createDefaultParams({ eyeType: 1, eyeScale: 1, eyeGap: 26.67, eyeY: 45, mouthType: 0, mouthY: 53.33, mouthWidth: 0.36, mouthCurve: 0.48, cheek: 0.4 }),
      createDefaultParams({ eyeType: 1, eyeScale: 1, eyeGap: 26.67, eyeY: 45, mouthType: 0, mouthY: 53.33, mouthWidth: 0.36, mouthCurve: 0.48, cheek: 0.5, bob: 1.0 }),
    ],
    near: [
      createDefaultParams({ eyeType: 1, eyeScale: 1, eyeGap: 26.67, eyeY: 45, mouthType: 0, mouthY: 53.33, mouthWidth: 0.36, mouthCurve: 0.48, cheek: 0.6, bob: 2.0 }),
    ],
    hover: [
      createDefaultParams({ eyeType: 1, eyeScale: 1, eyeGap: 26.67, eyeY: 45, mouthType: 0, mouthY: 53.33, mouthWidth: 0.36, mouthCurve: 0.48, cheek: 0.75, bob: 3.5 }),
    ],
    click: [
      createDefaultParams({ eyeType: 1, eyeScale: 1, eyeGap: 26.67, eyeY: 45, mouthType: 0, mouthY: 53.33, mouthWidth: 0.36, mouthCurve: 0.48, cheek: 0.9, bob: 5.0 }),
    ],
  },
};

// 4. Nima (peaceful) - Fantasma verde salvia ^ ^
export const EMOJI_NIMA: EmojiDefinition = {
  name: 'nima',
  emotion: 'peaceful',
  baseColor: '#9AC9A0',
  silhouette: 'ghost-blob',
  motion: {
    stiffness: 110,
    damping: 22,
    idleSpeed: 1.2,
    idleAmplitude: 2.0,
    idleIntervalMin: 8000,
    idleIntervalMax: 15000,
    motionType: 'float',
  },
  expressions: {
    idle: [
      createDefaultParams({ eyeType: 14, eyeScale: 1, eyeGap: 25, eyeY: 43.33, mouthType: 14, mouthY: 51.67, mouthWidth: 0, mouthCurve: 0 }),
      createDefaultParams({ eyeType: 14, eyeScale: 1, eyeGap: 25, eyeY: 43.33, mouthType: 14, mouthY: 51.67, mouthWidth: 0, mouthCurve: 0, bob: 1.5 }),
    ],
    near: [
      createDefaultParams({ eyeType: 14, eyeScale: 1, eyeGap: 25, eyeY: 43.33, mouthType: 14, mouthY: 51.67, mouthWidth: 0, mouthCurve: 0, bob: 2.0 }),
    ],
    hover: [
      createDefaultParams({ eyeType: 14, eyeScale: 1, eyeGap: 25, eyeY: 43.33, mouthType: 14, mouthY: 51.67, mouthWidth: 0, mouthCurve: 0, cheek: 0.3, bob: 3.0 }),
    ],
    click: [
      createDefaultParams({ eyeType: 14, eyeScale: 1, eyeGap: 25, eyeY: 43.33, mouthType: 14, mouthY: 51.67, mouthWidth: 0, mouthCurve: 0, cheek: 0.5, bob: 4.5 }),
    ],
  },
};

// 5. Cota (normal) - Óvalo menta neutro • — •
export const EMOJI_COTA: EmojiDefinition = {
  name: 'cota',
  emotion: 'normal',
  baseColor: '#C9DCD3',
  silhouette: 'oval',
  motion: {
    stiffness: 160,
    damping: 18,
    idleSpeed: 1.5,
    idleAmplitude: 1.2,
    idleIntervalMin: 8000,
    idleIntervalMax: 16000,
    motionType: 'calm',
  },
  expressions: {
    idle: [
      createDefaultParams({ eyeType: 0, eyeScale: 1, eyeGap: 23.33, eyeY: 45.83, mouthType: 3, mouthY: 56.67, mouthWidth: 0.33, mouthCurve: 0 }),
      createDefaultParams({ eyeType: 0, eyeScale: 1, eyeGap: 23.33, eyeY: 45.83, mouthType: 3, mouthY: 56.67, mouthWidth: 0.33, mouthCurve: 0, bob: -0.8 }),
    ],
    near: [
      createDefaultParams({ eyeType: 0, eyeScale: 1, eyeGap: 23.33, eyeY: 45.83, mouthType: 3, mouthY: 56.67, mouthWidth: 0.33, mouthCurve: 0, bob: 1.2 }),
    ],
    hover: [
      createDefaultParams({ eyeType: 0, eyeScale: 1, eyeGap: 23.33, eyeY: 45.83, mouthType: 3, mouthY: 56.67, mouthWidth: 0.33, mouthCurve: 0, cheek: 0.2, bob: 2.5 }),
    ],
    click: [
      createDefaultParams({ eyeType: 0, eyeScale: 1, eyeGap: 23.33, eyeY: 45.83, mouthType: 3, mouthY: 56.67, mouthWidth: 0.33, mouthCurve: 0, cheek: 0.4, bob: 4.0 }),
    ],
  },
};

// 6. Dozy (tired) - Óvalo gris cansado \ — /
export const EMOJI_DOZY: EmojiDefinition = {
  name: 'dozy',
  emotion: 'tired',
  baseColor: '#D6DBCF',
  silhouette: 'wide-oval',
  motion: {
    stiffness: 90,
    damping: 24,
    idleSpeed: 0.9,
    idleAmplitude: 2.8,
    idleIntervalMin: 6000,
    idleIntervalMax: 12000,
    motionType: 'droop',
  },
  expressions: {
    // Cansado de verdad: párpados caídos + gotas de sudor + resoplido —
    // sin zzz, que es "dormido"; Dozy está agotado pero despierto.
    idle: [
      createDefaultParams({ eyeType: 15, eyeScale: 0.85, eyeGap: 26.67, eyeY: 45.83, mouthType: 3, mouthY: 56.67, mouthWidth: 0.24, mouthCurve: 0, sweat: 1, puff: 0.7, bob: 1.5 }),
      createDefaultParams({ eyeType: 15, eyeScale: 0.85, eyeGap: 26.67, eyeY: 45.83, mouthType: 3, mouthY: 56.67, mouthWidth: 0.24, mouthCurve: 0, sweat: 1, puff: 0.7, bob: 2.5 }),
    ],
    near: [
      createDefaultParams({ eyeType: 15, eyeScale: 0.85, eyeGap: 26.67, eyeY: 45.83, mouthType: 3, mouthY: 56.67, mouthWidth: 0.24, mouthCurve: 0, sweat: 1, puff: 0.7, bob: 3.5 }),
    ],
    hover: [
      createDefaultParams({ eyeType: 15, eyeScale: 0.85, eyeGap: 26.67, eyeY: 45.83, mouthType: 3, mouthY: 56.67, mouthWidth: 0.24, mouthCurve: 0, sweat: 1, puff: 0.85, bob: 4.5 }),
    ],
    click: [
      createDefaultParams({ eyeType: 15, eyeScale: 0.85, eyeGap: 26.67, eyeY: 45.83, mouthType: 3, mouthY: 56.67, mouthWidth: 0.24, mouthCurve: 0, sweat: 1, puff: 1, bob: 6.5 }),
    ],
  },
};

// 7. Lumo (sad) - Gota azul triste con lágrimas
export const EMOJI_LUMO: EmojiDefinition = {
  name: 'lumo',
  emotion: 'sad',
  baseColor: '#7FA6D9',
  silhouette: 'teardrop-blob',
  motion: {
    stiffness: 100,
    damping: 20,
    idleSpeed: 1.1,
    idleAmplitude: 2.2,
    idleIntervalMin: 7000,
    idleIntervalMax: 13000,
    motionType: 'sob',
  },
  expressions: {
    idle: [
      createDefaultParams({ eyeType: 16, eyeScale: 1, eyeGap: 25, eyeY: 43.33, mouthType: 3, mouthY: 55, mouthWidth: 0.3, mouthCurve: 0, tears: 1, bob: 1.8 }),
      createDefaultParams({ eyeType: 16, eyeScale: 1, eyeGap: 25, eyeY: 43.33, mouthType: 3, mouthY: 55, mouthWidth: 0.3, mouthCurve: 0, tears: 1, bob: 2.8 }),
    ],
    near: [
      createDefaultParams({ eyeType: 16, eyeScale: 1, eyeGap: 25, eyeY: 43.33, mouthType: 3, mouthY: 55, mouthWidth: 0.3, mouthCurve: 0, tears: 1, bob: 3.5 }),
    ],
    hover: [
      createDefaultParams({ eyeType: 16, eyeScale: 1, eyeGap: 25, eyeY: 43.33, mouthType: 3, mouthY: 55, mouthWidth: 0.3, mouthCurve: 0, tears: 1, bob: 4.8 }),
    ],
    click: [
      createDefaultParams({ eyeType: 16, eyeScale: 1, eyeGap: 25, eyeY: 43.33, mouthType: 3, mouthY: 55, mouthWidth: 0.3, mouthCurve: 0, tears: 1, bob: 6.0 }),
    ],
  },
};

// 8. Fidge (anxiety) - Nube morada con ojos de anillo
export const EMOJI_FIDGE: EmojiDefinition = {
  name: 'fidge',
  emotion: 'anxiety',
  baseColor: '#A99BD9',
  silhouette: 'cloud-blob',
  motion: {
    stiffness: 350,
    damping: 8,
    idleSpeed: 5.5,
    idleAmplitude: 1.5,
    idleIntervalMin: 3000,
    idleIntervalMax: 7000,
    motionType: 'jitter',
  },
  expressions: {
    idle: [
      createDefaultParams({ eyeType: 5, eyeScale: 1, eyeGap: 25, eyeY: 43.33, mouthType: 13, mouthY: 56.67, mouthWidth: 0.08, mouthCurve: 0 }),
      createDefaultParams({ eyeType: 5, eyeScale: 1, eyeGap: 25, eyeY: 43.33, mouthType: 13, mouthY: 56.67, mouthWidth: 0.08, mouthCurve: 0, shiftX: 1.5 }),
    ],
    near: [
      createDefaultParams({ eyeType: 5, eyeScale: 1, eyeGap: 25, eyeY: 43.33, mouthType: 13, mouthY: 56.67, mouthWidth: 0.08, mouthCurve: 0, shiftX: 2.5 }),
    ],
    hover: [
      createDefaultParams({ eyeType: 5, eyeScale: 1, eyeGap: 25, eyeY: 43.33, mouthType: 13, mouthY: 56.67, mouthWidth: 0.08, mouthCurve: 0, shiftX: 4.0 }),
    ],
    click: [
      createDefaultParams({ eyeType: 5, eyeScale: 1, eyeGap: 25, eyeY: 43.33, mouthType: 13, mouthY: 56.67, mouthWidth: 0.08, mouthCurve: 0, shiftX: 6.0 }),
    ],
  },
};

// 9. Brix (anger) - Fuego rojo enojado / \
export const EMOJI_BRIX: EmojiDefinition = {
  name: 'brix',
  emotion: 'anger',
  baseColor: '#D9566A',
  silhouette: 'flame-blob',
  motion: {
    stiffness: 280,
    damping: 12,
    idleSpeed: 3.8,
    idleAmplitude: 2.0,
    idleIntervalMin: 4000,
    idleIntervalMax: 8000,
    motionType: 'fiery',
  },
  expressions: {
    idle: [
      createDefaultParams({ eyeType: 17, eyeScale: 1, eyeGap: 28.33, eyeY: 46.67, mouthType: 0, mouthY: 61.67, mouthWidth: 0.33, mouthCurve: -0.48 }),
      createDefaultParams({ eyeType: 17, eyeScale: 1, eyeGap: 28.33, eyeY: 46.67, mouthType: 0, mouthY: 61.67, mouthWidth: 0.33, mouthCurve: -0.48 }),
    ],
    near: [
      createDefaultParams({ eyeType: 17, eyeScale: 1, eyeGap: 28.33, eyeY: 46.67, mouthType: 0, mouthY: 61.67, mouthWidth: 0.33, mouthCurve: -0.48 }),
    ],
    hover: [
      createDefaultParams({ eyeType: 17, eyeScale: 1, eyeGap: 28.33, eyeY: 46.67, mouthType: 0, mouthY: 61.67, mouthWidth: 0.33, mouthCurve: -0.48 }),
    ],
    click: [
      createDefaultParams({ eyeType: 17, eyeScale: 1, eyeGap: 28.33, eyeY: 46.67, mouthType: 0, mouthY: 61.67, mouthWidth: 0.33, mouthCurve: -0.48 }),
    ],
  },
};

// 10. Wilt (disappointed) - Peón amarillo desilusionado
export const EMOJI_WILT: EmojiDefinition = {
  name: 'wilt',
  emotion: 'disappointed',
  baseColor: '#EBD98A',
  silhouette: 'droopy-blob',
  motion: {
    stiffness: 100,
    damping: 22,
    idleSpeed: 1.0,
    idleAmplitude: 2.0,
    idleIntervalMin: 7000,
    idleIntervalMax: 14000,
    motionType: 'wilt',
  },
  expressions: {
    idle: [
      createDefaultParams({ eyeType: 15, eyeScale: 1.15, eyeGap: 25, eyeY: 43.33, mouthType: 0, mouthY: 63.33, mouthWidth: 0.45, mouthCurve: -0.54, bob: 1.5 }),
      createDefaultParams({ eyeType: 15, eyeScale: 1.15, eyeGap: 25, eyeY: 43.33, mouthType: 0, mouthY: 63.33, mouthWidth: 0.45, mouthCurve: -0.54, bob: 2.5 }),
    ],
    near: [
      createDefaultParams({ eyeType: 15, eyeScale: 1.15, eyeGap: 25, eyeY: 43.33, mouthType: 0, mouthY: 63.33, mouthWidth: 0.45, mouthCurve: -0.54, bob: 3.5 }),
    ],
    hover: [
      createDefaultParams({ eyeType: 15, eyeScale: 1.15, eyeGap: 25, eyeY: 43.33, mouthType: 0, mouthY: 63.33, mouthWidth: 0.45, mouthCurve: -0.54, bob: 4.5 }),
    ],
    click: [
      createDefaultParams({ eyeType: 15, eyeScale: 1.15, eyeGap: 25, eyeY: 43.33, mouthType: 0, mouthY: 63.33, mouthWidth: 0.45, mouthCurve: -0.54, bob: 6.0 }),
    ],
  },
};

// 11. Knot (stress) - Osito rosado estresado con espirales y zigzag
export const EMOJI_KNOT: EmojiDefinition = {
  name: 'knot',
  emotion: 'stress',
  baseColor: '#C97F76',
  silhouette: 'bear-blob',
  motion: {
    stiffness: 320,
    damping: 9,
    idleSpeed: 4.8,
    idleAmplitude: 2.2,
    idleIntervalMin: 3500,
    idleIntervalMax: 7500,
    motionType: 'dizzy',
  },
  expressions: {
    // Estresado de verdad: la espiral de mareo en los ojos ya lo insinuaba,
    // pero el sello de Knot es cargar con la nube de tormenta Y el garabato
    // de confusión encima a la vez — agobiado por todos lados, no solo mareado.
    idle: [
      createDefaultParams({ eyeType: 18, eyeScale: 1, eyeGap: 26.67, eyeY: 45, mouthType: 3, mouthY: 58.33, mouthWidth: 0.42, mouthCurve: 0, storm: 1, scribble: 1 }),
      createDefaultParams({ eyeType: 18, eyeScale: 1, eyeGap: 26.67, eyeY: 45, mouthType: 3, mouthY: 58.33, mouthWidth: 0.42, mouthCurve: 0, storm: 1, scribble: 1, shiftX: 1.5 }),
    ],
    near: [
      createDefaultParams({ eyeType: 18, eyeScale: 1, eyeGap: 26.67, eyeY: 45, mouthType: 3, mouthY: 58.33, mouthWidth: 0.42, mouthCurve: 0, storm: 1, scribble: 1, shiftX: 3.0 }),
    ],
    hover: [
      createDefaultParams({ eyeType: 18, eyeScale: 1, eyeGap: 26.67, eyeY: 45, mouthType: 3, mouthY: 58.33, mouthWidth: 0.42, mouthCurve: 0, storm: 1, scribble: 1, shiftX: 4.5 }),
    ],
    click: [
      createDefaultParams({ eyeType: 18, eyeScale: 1, eyeGap: 26.67, eyeY: 45, mouthType: 3, mouthY: 58.33, mouthWidth: 0.42, mouthCurve: 0, storm: 1, scribble: 1, shiftX: 6.5 }),
    ],
  },
};

// 12. Snug (sleepy) - Celeste adormilado con ZZZ
export const EMOJI_SNUG: EmojiDefinition = {
  name: 'snug',
  emotion: 'sleepy',
  baseColor: '#AFCBE0',
  silhouette: 'soft-round',
  motion: {
    stiffness: 85,
    damping: 25,
    idleSpeed: 0.7,
    idleAmplitude: 2.2,
    idleIntervalMin: 6000,
    idleIntervalMax: 12000,
    motionType: 'snooze',
  },
  expressions: {
    idle: [
      createDefaultParams({ eyeType: 19, eyeScale: 1, eyeGap: 26.67, eyeY: 45, mouthType: 3, mouthY: 56.67, mouthWidth: 0.27, mouthCurve: 0, zzz: 1, bob: 0.5 }),
      createDefaultParams({ eyeType: 19, eyeScale: 1, eyeGap: 26.67, eyeY: 45, mouthType: 3, mouthY: 56.67, mouthWidth: 0.27, mouthCurve: 0, zzz: 1, bob: 1.5 }),
    ],
    near: [
      createDefaultParams({ eyeType: 19, eyeScale: 1, eyeGap: 26.67, eyeY: 45, mouthType: 3, mouthY: 56.67, mouthWidth: 0.27, mouthCurve: 0, zzz: 1, bob: 2.5 }),
    ],
    hover: [
      createDefaultParams({ eyeType: 19, eyeScale: 1, eyeGap: 26.67, eyeY: 45, mouthType: 3, mouthY: 56.67, mouthWidth: 0.27, mouthCurve: 0, zzz: 1, bob: 3.8 }),
    ],
    click: [
      createDefaultParams({ eyeType: 19, eyeScale: 1, eyeGap: 26.67, eyeY: 45, mouthType: 3, mouthY: 56.67, mouthWidth: 0.27, mouthCurve: 0, zzz: 1, bob: 5.5 }),
    ],
  },
};

// 13. Pip (surprised) - Durazno sorprendido • O •
export const EMOJI_PIP: EmojiDefinition = {
  name: 'pip',
  emotion: 'surprised',
  baseColor: '#F0B98A',
  silhouette: 'octopus-blob',
  motion: {
    stiffness: 250,
    damping: 12,
    idleSpeed: 2.8,
    idleAmplitude: 3.0,
    idleIntervalMin: 5000,
    idleIntervalMax: 10000,
    motionType: 'pop',
  },
  expressions: {
    idle: [
      createDefaultParams({ eyeType: 20, eyeScale: 0.8, eyeGap: 21.67, eyeY: 43.33, mouthType: 1, mouthY: 55, mouthWidth: 0.21, mouthCurve: 0 }),
      createDefaultParams({ eyeType: 20, eyeScale: 0.8, eyeGap: 21.67, eyeY: 43.33, mouthType: 1, mouthY: 55, mouthWidth: 0.21, mouthCurve: 0, bob: -2 }),
    ],
    near: [
      createDefaultParams({ eyeType: 20, eyeScale: 0.8, eyeGap: 21.67, eyeY: 43.33, mouthType: 1, mouthY: 55, mouthWidth: 0.21, mouthCurve: 0, bob: -3 }),
    ],
    hover: [
      createDefaultParams({ eyeType: 20, eyeScale: 0.8, eyeGap: 21.67, eyeY: 43.33, mouthType: 1, mouthY: 55, mouthWidth: 0.21, mouthCurve: 0, bob: -5 }),
    ],
    click: [
      createDefaultParams({ eyeType: 20, eyeScale: 0.8, eyeGap: 21.67, eyeY: 43.33, mouthType: 1, mouthY: 55, mouthWidth: 0.21, mouthCurve: 0, bob: -8 }),
    ],
  },
};

// 14. Void (numbness) - Lila entumecido O — O
export const EMOJI_VOID: EmojiDefinition = {
  name: 'void',
  emotion: 'numbness',
  baseColor: '#D9C6E0',
  silhouette: 'wave-blob',
  motion: {
    stiffness: 100,
    damping: 24,
    idleSpeed: 0.8,
    idleAmplitude: 1.5,
    idleIntervalMin: 9000,
    idleIntervalMax: 18000,
    motionType: 'drift',
  },
  expressions: {
    idle: [
      createDefaultParams({ eyeType: 20, eyeScale: 0.75, eyeGap: 23.33, eyeY: 44.17, mouthType: 3, mouthY: 56.67, mouthWidth: 0.33, mouthCurve: 0 }),
      createDefaultParams({ eyeType: 20, eyeScale: 0.75, eyeGap: 23.33, eyeY: 44.17, mouthType: 3, mouthY: 56.67, mouthWidth: 0.33, mouthCurve: 0, bob: 1.0 }),
    ],
    near: [
      createDefaultParams({ eyeType: 20, eyeScale: 0.75, eyeGap: 23.33, eyeY: 44.17, mouthType: 3, mouthY: 56.67, mouthWidth: 0.33, mouthCurve: 0, bob: 2.0 }),
    ],
    hover: [
      createDefaultParams({ eyeType: 20, eyeScale: 0.75, eyeGap: 23.33, eyeY: 44.17, mouthType: 3, mouthY: 56.67, mouthWidth: 0.33, mouthCurve: 0, bob: 3.0 }),
    ],
    click: [
      createDefaultParams({ eyeType: 20, eyeScale: 0.75, eyeGap: 23.33, eyeY: 44.17, mouthType: 3, mouthY: 56.67, mouthWidth: 0.33, mouthCurve: 0, bob: 4.5 }),
    ],
  },
};

export const LIB: Record<string, EmojiDefinition> = {
  mochi: EMOJI_MOCHI,
  zumi: EMOJI_ZUMI,
  suri: EMOJI_SURI,
  nima: EMOJI_NIMA,
  cota: EMOJI_COTA,
  dozy: EMOJI_DOZY,
  lumo: EMOJI_LUMO,
  fidge: EMOJI_FIDGE,
  brix: EMOJI_BRIX,
  wilt: EMOJI_WILT,
  knot: EMOJI_KNOT,
  snug: EMOJI_SNUG,
  pip: EMOJI_PIP,
  void: EMOJI_VOID,
};

export function getEmojiDefinition(nameOrEmotion: string): EmojiDefinition {
  const key = nameOrEmotion.toLowerCase();
  if (LIB[key]) return LIB[key];
  const found = Object.values(LIB).find((item) => item.emotion === key);
  return found || EMOJI_MOCHI;
}
