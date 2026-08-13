import { EmojiDefinition, FaceParameters } from './types';

function createDefaultParams(overrides: Partial<FaceParameters> = {}): FaceParameters {
  return {
    eyeOpen: 1.0,
    eyeScale: 1.0,
    eyeType: 0,
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
    ...overrides,
  };
}

// 1. Mochi (happy) - Corazón rosa alegre
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
      createDefaultParams({ eyeType: 2, mouthType: 0, mouthCurve: 0.5, cheek: 0.4 }), // squintWedge + smileCurve
      createDefaultParams({ eyeType: 1, mouthType: 0, mouthCurve: 0.6, cheek: 0.45, bob: -2 }), // closedArc + smileCurve
      createDefaultParams({ eyeType: 6, mouthType: 6, cheek: 0.6, bob: 1.5 }), // heartEyes + wideHappyOpen
      createDefaultParams({ eyeType: 11, mouthType: 0, mouthCurve: 0.5, cheek: 0.4 }), // winkLineDot + smileCurve
      createDefaultParams({ eyeType: 2, mouthType: 6, cheek: 0.5, bob: -1 }), // squintWedge + wideHappyOpen
      createDefaultParams({ eyeType: 1, mouthType: 0, mouthCurve: 0.48, cheek: 0.38, bob: 1 }), // closedArc + smileCurve
    ],
    near: [
      createDefaultParams({ eyeType: 1, mouthType: 5, cheek: 0.6, bob: -1.5 }), // closedArc + teethGrin
      createDefaultParams({ eyeType: 2, mouthType: 6, cheek: 0.65, bob: -2.5 }), // squintWedge + wideHappyOpen
    ],
    hover: [
      createDefaultParams({ eyeType: 6, mouthType: 6, cheek: 0.8, blushStripes: 1, bob: -4 }), // heartEyes + wideHappyOpen + blush
      createDefaultParams({ eyeType: 1, mouthType: 6, cheek: 0.85, blushStripes: 1, bob: -4.5 }),
    ],
    click: [
      createDefaultParams({ eyeType: 2, mouthType: 6, cheek: 1.0, blushStripes: 1, bob: -7 }),
      createDefaultParams({ eyeType: 6, mouthType: 6, cheek: 1.0, blushStripes: 1, bob: -6 }),
    ],
  },
};

// 2. Zumi (flutter) - Blob amarillo vibrante
export const EMOJI_ZUMI: EmojiDefinition = {
  name: 'zumi',
  emotion: 'flutter',
  baseColor: '#F2CB4E',
  silhouette: 'round-blob',
  motion: {
    stiffness: 260,
    damping: 12,
    idleSpeed: 5.5,
    idleAmplitude: 3.0,
    idleIntervalMin: 6000,
    idleIntervalMax: 12000,
    motionType: 'flutter',
  },
  expressions: {
    idle: [
      createDefaultParams({ eyeType: 11, mouthType: 0, mouthCurve: 0.3, cheek: 0.2 }), // winkLineDot + smileCurve
      createDefaultParams({ eyeType: 0, mouthType: 9, cheek: 0.25, shiftX: 2 }), // dotSimple + wavyWMouth
      createDefaultParams({ eyeType: 10, mouthType: 1, cheek: 0.3, shiftX: -2 }), // shockAsym + ovalOpen
      createDefaultParams({ eyeType: 11, mouthType: 0, mouthCurve: 0.2, cheek: 0.25, bob: 1 }),
      createDefaultParams({ eyeType: 2, mouthType: 0, mouthCurve: 0.4, cheek: 0.2, shiftX: 1.5 }),
      createDefaultParams({ eyeType: 9, mouthType: 0, mouthCurve: 0.5, cheek: 0.35, shiftX: -1.5 }), // sunglasses + smile
    ],
    near: [
      createDefaultParams({ eyeType: 11, mouthType: 6, cheek: 0.4, shiftX: 3 }), // wink + wideHappyOpen
      createDefaultParams({ eyeType: 9, mouthType: 0, mouthCurve: 0.6, cheek: 0.45, shiftX: -3 }), // sunglasses
    ],
    hover: [
      createDefaultParams({ eyeType: 9, mouthType: 0, mouthCurve: 0.8, cheek: 0.7, shiftX: 4 }), // sunglasses + cool smile
      createDefaultParams({ eyeType: 2, mouthType: 6, cheek: 0.75, shiftX: -4 }),
    ],
    click: [
      createDefaultParams({ eyeType: 2, mouthType: 6, cheek: 1.0, bob: -7 }),
      createDefaultParams({ eyeType: 9, mouthType: 6, cheek: 1.0, bob: -6 }),
    ],
  },
};

// 3. Suri (pleasure) - Blob rosa placentero
export const EMOJI_SURI: EmojiDefinition = {
  name: 'suri',
  emotion: 'pleasure',
  baseColor: '#F28FC2',
  silhouette: 'round-blob',
  motion: {
    stiffness: 120,
    damping: 22,
    idleSpeed: 1.5,
    idleAmplitude: 2.0,
    idleIntervalMin: 6000,
    idleIntervalMax: 12000,
    motionType: 'serene',
  },
  expressions: {
    idle: [
      createDefaultParams({ eyeType: 1, mouthType: 0, mouthCurve: 0.5, cheek: 0.4 }), // closedArc + smileCurve
      createDefaultParams({ eyeType: 1, mouthType: 9, cheek: 0.45, bob: -1 }), // closedArc + wavyWMouth
      createDefaultParams({ eyeType: 6, mouthType: 0, mouthCurve: 0.6, cheek: 0.55, bob: 1 }), // heartEyes + smile
      createDefaultParams({ eyeType: 1, mouthType: 0, mouthCurve: 0.52, cheek: 0.42, bob: -0.5 }),
      createDefaultParams({ eyeType: 1, mouthType: 9, cheek: 0.48, bob: 0.5 }),
      createDefaultParams({ eyeType: 6, mouthType: 6, cheek: 0.6, bob: -1 }), // heartEyes + wideHappyOpen
    ],
    near: [
      createDefaultParams({ eyeType: 1, mouthType: 6, cheek: 0.6, bob: -1.5 }), // closedArc + wideHappyOpen
      createDefaultParams({ eyeType: 6, mouthType: 6, cheek: 0.65, bob: -2 }),
    ],
    hover: [
      createDefaultParams({ eyeType: 6, mouthType: 6, cheek: 0.8, bob: -3.5 }), // heartEyes + wideHappyOpen
      createDefaultParams({ eyeType: 1, mouthType: 6, cheek: 0.85, bob: -4 }),
    ],
    click: [
      createDefaultParams({ eyeType: 1, mouthType: 6, cheek: 1.0, bob: -6.5 }),
      createDefaultParams({ eyeType: 6, mouthType: 6, cheek: 1.0, bob: -7 }),
    ],
  },
};

// 4. Nima (peaceful) - Fantasma verde místico
export const EMOJI_NIMA: EmojiDefinition = {
  name: 'nima',
  emotion: 'peaceful',
  baseColor: '#9AC9A0',
  silhouette: 'ghost-blob',
  motion: {
    stiffness: 100,
    damping: 24,
    idleSpeed: 1.2,
    idleAmplitude: 4.0,
    idleIntervalMin: 6000,
    idleIntervalMax: 12000,
    motionType: 'float',
  },
  expressions: {
    idle: [
      createDefaultParams({ eyeType: 1, mouthType: 0, mouthCurve: 0.4, cheek: 0.1 }), // closedArc + smileCurve
      createDefaultParams({ eyeType: 1, mouthType: 9, cheek: 0.12, bob: -2 }), // closedArc + wavyWMouth
      createDefaultParams({ eyeType: 0, mouthType: 0, mouthCurve: 0.38, cheek: 0.08, bob: 2 }),
      createDefaultParams({ eyeType: 1, mouthType: 0, mouthCurve: 0.42, cheek: 0.1, bob: -1 }),
      createDefaultParams({ eyeType: 0, mouthType: 9, cheek: 0.14, bob: 1 }),
      createDefaultParams({ eyeType: 1, mouthType: 0, mouthCurve: 0.4, cheek: 0.1, bob: -1.5 }),
    ],
    near: [
      createDefaultParams({ eyeType: 1, mouthType: 9, cheek: 0.25, bob: -2 }),
      createDefaultParams({ eyeType: 1, mouthType: 6, cheek: 0.28, bob: -3 }),
    ],
    hover: [
      createDefaultParams({ eyeType: 1, mouthType: 6, cheek: 0.55, bob: -4 }),
      createDefaultParams({ eyeType: 6, mouthType: 6, cheek: 0.6, bob: -4.5 }),
    ],
    click: [
      createDefaultParams({ eyeType: 1, mouthType: 6, cheek: 0.8, bob: -6.5 }),
      createDefaultParams({ eyeType: 6, mouthType: 6, cheek: 0.85, bob: -7 }),
    ],
  },
};

// 5. Cota (normal) - Óvalo menta
export const EMOJI_COTA: EmojiDefinition = {
  name: 'cota',
  emotion: 'normal',
  baseColor: '#C9DCD3',
  silhouette: 'oval',
  motion: {
    stiffness: 170,
    damping: 20,
    idleSpeed: 1.8,
    idleAmplitude: 1.2,
    idleIntervalMin: 6000,
    idleIntervalMax: 12000,
    motionType: 'calm',
  },
  expressions: {
    idle: [
      createDefaultParams({ eyeType: 0, mouthType: 3 }), // dotSimple + flatLine
      createDefaultParams({ eyeType: 0, mouthType: 11, shiftX: 1.5 }), // dotSimple + diagonalLine
      createDefaultParams({ eyeType: 10, mouthType: 1, bob: -0.8 }), // shockAsym + ovalOpen
      createDefaultParams({ eyeType: 0, mouthType: 10, shiftX: -1.5 }), // dotSimple + dotMouth
      createDefaultParams({ eyeType: 0, mouthType: 3, bob: -0.5 }),
      createDefaultParams({ eyeType: 0, mouthType: 11, bob: 0.8 }),
    ],
    near: [
      createDefaultParams({ eyeType: 0, mouthType: 11, cheek: 0.2, bob: -1 }),
      createDefaultParams({ eyeType: 10, mouthType: 1, cheek: 0.22, bob: -1.5 }),
    ],
    hover: [
      createDefaultParams({ eyeType: 13, mouthType: 1, cheek: 0.45, bob: -2.5 }), // wideCircleEyes + ovalOpen
      createDefaultParams({ eyeType: 0, mouthType: 1, cheek: 0.5, bob: -3 }),
    ],
    click: [
      createDefaultParams({ eyeType: 13, mouthType: 1, cheek: 0.75, bob: -4.5 }),
      createDefaultParams({ eyeType: 10, mouthType: 6, cheek: 0.8, bob: -5 }),
    ],
  },
};

// 6. Dozy (tired) - Óvalo horizontal
export const EMOJI_DOZY: EmojiDefinition = {
  name: 'dozy',
  emotion: 'tired',
  baseColor: '#D6DBCF',
  silhouette: 'elongated-oval',
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
    idle: [
      createDefaultParams({ eyeType: 1, mouthType: 1, zzz: 1, bob: 1.5 }), // closedArc + ovalOpen + ZZZ
      createDefaultParams({ eyeType: 8, mouthType: 11, bob: 2.5 }), // tiredLineSlits + diagonalLine
      createDefaultParams({ eyeType: 1, mouthType: 8, bob: 0.8 }), // closedArc + maskCover
      createDefaultParams({ eyeType: 8, mouthType: 3, bob: 2.0 }), // tiredLineSlits + flatLine
      createDefaultParams({ eyeType: 1, mouthType: 1, zzz: 1, bob: 1.8 }),
      createDefaultParams({ eyeType: 8, mouthType: 11, bob: 2.4 }),
    ],
    near: [
      createDefaultParams({ eyeType: 8, mouthType: 11, bob: 3 }),
      createDefaultParams({ eyeType: 1, mouthType: 8, bob: 3.5 }),
    ],
    hover: [
      createDefaultParams({ eyeType: 1, mouthType: 8, bob: 4.5 }), // maskCover
      createDefaultParams({ eyeType: 8, mouthType: 3, bob: 5 }),
    ],
    click: [
      createDefaultParams({ eyeType: 1, mouthType: 1, zzz: 1, bob: 6.5 }),
      createDefaultParams({ eyeType: 8, mouthType: 11, bob: 7 }),
    ],
  },
};

// 7. Lumo (sad) - Blob azul melancólico
export const EMOJI_LUMO: EmojiDefinition = {
  name: 'lumo',
  emotion: 'sad',
  baseColor: '#7FA6D9',
  silhouette: 'teardrop-blob',
  motion: {
    stiffness: 110,
    damping: 22,
    idleSpeed: 1.1,
    idleAmplitude: 2.2,
    idleIntervalMin: 6000,
    idleIntervalMax: 12000,
    motionType: 'droop',
  },
  expressions: {
    idle: [
      createDefaultParams({ eyeType: 3, mouthType: 12, tears: 1, bob: 1 }), // droopySlant + frownCurve + tears
      createDefaultParams({ eyeType: 3, mouthType: 12, sweat: 1, tears: 1, bob: 1.8 }), // droopy + sweat
      createDefaultParams({ eyeType: 3, mouthType: 1, cascadeTears: 1, tears: 1, bob: 0.8 }), // cascadeTears
      createDefaultParams({ eyeType: 3, mouthType: 12, tears: 1, bob: 1.4 }),
      createDefaultParams({ eyeType: 3, mouthType: 3, tears: 1, bob: 2.0 }),
      createDefaultParams({ eyeType: 3, mouthType: 12, cascadeTears: 1, tears: 1, bob: 1.2 }),
    ],
    near: [
      createDefaultParams({ eyeType: 3, mouthType: 12, sweat: 1, tears: 1, bob: 2.2 }),
      createDefaultParams({ eyeType: 3, mouthType: 1, cascadeTears: 1, tears: 1, bob: 2.8 }),
    ],
    hover: [
      createDefaultParams({ eyeType: 3, mouthType: 1, cascadeTears: 1, tears: 1, bob: 4 }), // cascadeTears
      createDefaultParams({ eyeType: 3, mouthType: 12, cascadeTears: 1, tears: 1, bob: 4.5 }),
    ],
    click: [
      createDefaultParams({ eyeType: 3, mouthType: 12, cascadeTears: 1, tears: 1, bob: 6.5 }),
      createDefaultParams({ eyeType: 3, mouthType: 1, cascadeTears: 1, tears: 1, bob: 7 }),
    ],
  },
};

// 8. Fidge (anxiety) - Nube lavanda inquieta
export const EMOJI_FIDGE: EmojiDefinition = {
  name: 'fidge',
  emotion: 'anxiety',
  baseColor: '#A99BD9',
  silhouette: 'round-blob',
  motion: {
    stiffness: 300,
    damping: 10,
    idleSpeed: 8.5,
    idleAmplitude: 1.6,
    idleIntervalMin: 6000,
    idleIntervalMax: 12000,
    motionType: 'jitter',
  },
  expressions: {
    idle: [
      createDefaultParams({ eyeType: 5, mouthType: 4, sweat: 1 }), // pupilRings + teethClench + sweat
      createDefaultParams({ eyeType: 12, mouthType: 4, sweat: 1, shiftX: 1.5, bob: -1 }), // panicOpen + teethClench
      createDefaultParams({ eyeType: 7, mouthType: 2, sweat: 1, shiftX: -1.5, bob: 1 }), // xEyes + zigzag
      createDefaultParams({ eyeType: 5, mouthType: 4, sweat: 1, shiftX: 1.0, bob: -0.5 }),
      createDefaultParams({ eyeType: 12, mouthType: 2, sweat: 1, shiftX: -1.0, bob: 0.5 }),
      createDefaultParams({ eyeType: 7, mouthType: 4, sweat: 1, shiftX: 2.0, bob: -0.8 }),
    ],
    near: [
      createDefaultParams({ eyeType: 12, mouthType: 4, sweat: 1, shiftX: 2.5, bob: -1.5 }),
      createDefaultParams({ eyeType: 5, mouthType: 4, sweat: 1, shiftX: -2.5, bob: -2 }),
    ],
    hover: [
      createDefaultParams({ eyeType: 7, mouthType: 2, sweat: 1, shiftX: 3.0, cheek: 0.3, bob: -3 }), // xEyes + zigzag
      createDefaultParams({ eyeType: 12, mouthType: 4, sweat: 1, shiftX: -3.0, cheek: 0.35, bob: -3.5 }),
    ],
    click: [
      createDefaultParams({ eyeType: 7, mouthType: 4, sweat: 1, shiftX: 4.0, cheek: 0.6, bob: -5 }),
      createDefaultParams({ eyeType: 5, mouthType: 4, sweat: 1, shiftX: -4.0, cheek: 0.65, bob: -5.5 }),
    ],
  },
};

// 9. Brix (anger) - Rojo llama enojado
export const EMOJI_BRIX: EmojiDefinition = {
  name: 'brix',
  emotion: 'anger',
  baseColor: '#D9566A',
  silhouette: 'flame-blob',
  motion: {
    stiffness: 240,
    damping: 15,
    idleSpeed: 2.8,
    idleAmplitude: 2.8,
    idleIntervalMin: 6000,
    idleIntervalMax: 12000,
    motionType: 'fiery',
  },
  expressions: {
    idle: [
      createDefaultParams({ eyeType: 4, mouthType: 12, browY: 2, browTilt: 20 }), // angrySlant + frownCurve
      createDefaultParams({ eyeType: 4, mouthType: 4, browY: 3, browTilt: 25, bob: -1.5 }), // angrySlant + teethClench
      createDefaultParams({ eyeType: 4, mouthType: 7, browY: 4, browTilt: 30, bob: 1.5 }), // angrySlant + crossMouth
      createDefaultParams({ eyeType: 7, mouthType: 4, browY: 3, browTilt: 25, bob: -0.8 }), // xEyes + teethClench
      createDefaultParams({ eyeType: 4, mouthType: 12, browY: 2, browTilt: 22, bob: 0.8 }),
      createDefaultParams({ eyeType: 4, mouthType: 4, browY: 3, browTilt: 26, bob: -1.2 }),
    ],
    near: [
      createDefaultParams({ eyeType: 4, mouthType: 4, browY: 4, browTilt: 28, bob: -2 }),
      createDefaultParams({ eyeType: 4, mouthType: 7, browY: 5, browTilt: 32, bob: -2.5 }), // crossMouth
    ],
    hover: [
      createDefaultParams({ eyeType: 4, mouthType: 7, browY: 6, browTilt: 35, cheek: 0.4, bob: -3.5 }), // crossMouth
      createDefaultParams({ eyeType: 7, mouthType: 4, browY: 6, browTilt: 35, cheek: 0.45, bob: -4 }),
    ],
    click: [
      createDefaultParams({ eyeType: 7, mouthType: 4, browY: 8, browTilt: 40, cheek: 0.8, bob: -6.5 }),
      createDefaultParams({ eyeType: 4, mouthType: 7, browY: 8, browTilt: 40, cheek: 0.85, bob: -7 }),
    ],
  },
};

// 10. Wilt (disappointed) - Amarillo caído desanimado
export const EMOJI_WILT: EmojiDefinition = {
  name: 'wilt',
  emotion: 'disappointed',
  baseColor: '#EBD98A',
  silhouette: 'droopy-blob',
  motion: {
    stiffness: 95,
    damping: 26,
    idleSpeed: 0.8,
    idleAmplitude: 3.2,
    idleIntervalMin: 6000,
    idleIntervalMax: 12000,
    motionType: 'droop',
  },
  expressions: {
    idle: [
      createDefaultParams({ eyeType: 3, mouthType: 12, browY: 2, browTilt: -18, bob: 1.5 }), // droopySlant + frownCurve
      createDefaultParams({ eyeType: 3, mouthType: 3, browY: 2.2, browTilt: -20, sweat: 1, bob: 2.2 }), // droopy + flatLine + sweat
      createDefaultParams({ eyeType: 3, mouthType: 12, browY: 1.8, browTilt: -16, bob: 1.0 }),
      createDefaultParams({ eyeType: 3, mouthType: 11, browY: 2, browTilt: -18, bob: 1.8 }), // diagonalLine
      createDefaultParams({ eyeType: 3, mouthType: 12, browY: 2.5, browTilt: -22, bob: 2.5 }),
      createDefaultParams({ eyeType: 3, mouthType: 3, browY: 1.9, browTilt: -17, bob: 1.4 }),
    ],
    near: [
      createDefaultParams({ eyeType: 3, mouthType: 12, browY: 3, browTilt: -22, bob: 2.8 }),
      createDefaultParams({ eyeType: 3, mouthType: 3, browY: 3.5, browTilt: -25, sweat: 1, bob: 3.2 }),
    ],
    hover: [
      createDefaultParams({ eyeType: 3, mouthType: 3, browY: 4.5, browTilt: -28, sweat: 1, bob: 4.2 }), // flatLine + sweat
      createDefaultParams({ eyeType: 3, mouthType: 12, browY: 5, browTilt: -30, bob: 4.8 }),
    ],
    click: [
      createDefaultParams({ eyeType: 3, mouthType: 12, browY: 6.5, browTilt: -35, bob: 6.8 }),
      createDefaultParams({ eyeType: 3, mouthType: 3, browY: 7, browTilt: -38, sweat: 1, bob: 7.2 }),
    ],
  },
};

// 11. Knot (stress) - Terracota con orejas estresado
export const EMOJI_KNOT: EmojiDefinition = {
  name: 'knot',
  emotion: 'stress',
  baseColor: '#C97F76',
  silhouette: 'bear-blob',
  motion: {
    stiffness: 280,
    damping: 11,
    idleSpeed: 6.5,
    idleAmplitude: 2.0,
    idleIntervalMin: 6000,
    idleIntervalMax: 12000,
    motionType: 'dizzy',
  },
  expressions: {
    idle: [
      createDefaultParams({ eyeType: 7, mouthType: 2 }), // xEyes + zigzag
      createDefaultParams({ eyeType: 5, mouthType: 4, shiftX: 1.8, bob: -1 }), // pupilRings + teethClench
      createDefaultParams({ eyeType: 7, mouthType: 2, shiftX: -1.8, bob: 1 }),
      createDefaultParams({ eyeType: 5, mouthType: 4, shiftX: 1.2, bob: -0.5 }),
      createDefaultParams({ eyeType: 7, mouthType: 2, shiftX: -1.2, bob: 0.5 }),
      createDefaultParams({ eyeType: 5, mouthType: 4, shiftX: 2.0, bob: -0.8 }),
    ],
    near: [
      createDefaultParams({ eyeType: 5, mouthType: 4, shiftX: 2.5, bob: -1.5 }),
      createDefaultParams({ eyeType: 7, mouthType: 2, shiftX: -2.5, bob: -2 }),
    ],
    hover: [
      createDefaultParams({ eyeType: 7, mouthType: 2, shiftX: 3.5, cheek: 0.3, sweat: 1, bob: -3 }), // xEyes + zigzag + sweat
      createDefaultParams({ eyeType: 5, mouthType: 4, shiftX: -3.5, cheek: 0.35, sweat: 1, bob: -3.5 }),
    ],
    click: [
      createDefaultParams({ eyeType: 7, mouthType: 4, shiftX: 4.5, cheek: 0.6, sweat: 1, bob: -5.5 }),
      createDefaultParams({ eyeType: 7, mouthType: 2, shiftX: -4.5, cheek: 0.65, sweat: 1, bob: -6 }),
    ],
  },
};

// 12. Snug (sleepy) - Celeste soñoliento
export const EMOJI_SNUG: EmojiDefinition = {
  name: 'snug',
  emotion: 'sleepy',
  baseColor: '#AFCBE0',
  silhouette: 'round-blob',
  motion: {
    stiffness: 85,
    damping: 25,
    idleSpeed: 0.7,
    idleAmplitude: 2.2,
    idleIntervalMin: 6000,
    idleIntervalMax: 12000,
    motionType: 'serene',
  },
  expressions: {
    idle: [
      createDefaultParams({ eyeType: 1, mouthType: 0, mouthCurve: 0.4, zzz: 1 }), // closedArc + smile + ZZZ
      createDefaultParams({ eyeType: 1, mouthType: 8 }), // closedArc + maskCover
      createDefaultParams({ eyeType: 8, mouthType: 0, mouthCurve: 0.3, bob: -0.8 }), // tiredLineSlits + smile
      createDefaultParams({ eyeType: 1, mouthType: 0, mouthCurve: 0.4, zzz: 1, bob: 0.5 }),
      createDefaultParams({ eyeType: 1, mouthType: 8, bob: 1.6 }), // maskCover
      createDefaultParams({ eyeType: 8, mouthType: 3, bob: -0.5 }),
    ],
    near: [
      createDefaultParams({ eyeType: 1, mouthType: 8, bob: 1.8 }), // maskCover
      createDefaultParams({ eyeType: 8, mouthType: 0, mouthCurve: 0.4, bob: 2.2 }),
    ],
    hover: [
      createDefaultParams({ eyeType: 8, mouthType: 0, mouthCurve: 0.5, cheek: 0.2, bob: 3.2 }),
      createDefaultParams({ eyeType: 1, mouthType: 8, cheek: 0.25, bob: 3.8 }),
    ],
    click: [
      createDefaultParams({ eyeType: 1, mouthType: 1, zzz: 1, cheek: 0.5, bob: 5.2 }),
      createDefaultParams({ eyeType: 1, mouthType: 8, cheek: 0.55, bob: 5.8 }),
    ],
  },
};

// 13. Pip (surprised) - Durazno de sorpresa
export const EMOJI_PIP: EmojiDefinition = {
  name: 'pip',
  emotion: 'surprised',
  baseColor: '#F0B98A',
  silhouette: 'spiky-blob',
  motion: {
    stiffness: 250,
    damping: 13,
    idleSpeed: 3.8,
    idleAmplitude: 3.5,
    idleIntervalMin: 6000,
    idleIntervalMax: 12000,
    motionType: 'pop',
  },
  expressions: {
    idle: [
      createDefaultParams({ eyeType: 13, mouthType: 1 }), // wideCircleEyes + ovalOpen
      createDefaultParams({ eyeType: 10, mouthType: 1, bob: -2 }), // shockAsym + ovalOpen
      createDefaultParams({ eyeType: 5, mouthType: 6, bob: 1.5 }), // pupilRings + wideHappyOpen
      createDefaultParams({ eyeType: 0, mouthType: 1, bob: -1 }),
      createDefaultParams({ eyeType: 13, mouthType: 1, bob: 1 }),
      createDefaultParams({ eyeType: 5, mouthType: 6, bob: -1.8 }),
    ],
    near: [
      createDefaultParams({ eyeType: 10, mouthType: 1, eyeScale: 1.15, bob: -2.5 }),
      createDefaultParams({ eyeType: 5, mouthType: 6, eyeScale: 1.2, bob: -3 }),
    ],
    hover: [
      createDefaultParams({ eyeType: 5, mouthType: 6, eyeScale: 1.3, cheek: 0.3, bob: -4.5 }), // pupilRings + wideHappyOpen
      createDefaultParams({ eyeType: 13, mouthType: 6, eyeScale: 1.35, cheek: 0.35, bob: -5 }),
    ],
    click: [
      createDefaultParams({ eyeType: 13, mouthType: 6, eyeScale: 1.5, cheek: 0.6, bob: -7 }),
      createDefaultParams({ eyeType: 5, mouthType: 6, eyeScale: 1.55, cheek: 0.65, bob: -7.5 }),
    ],
  },
};

// 14. Void (numbness) - Nube lila etérea
export const EMOJI_VOID: EmojiDefinition = {
  name: 'void',
  emotion: 'numbness',
  baseColor: '#D9C6E0',
  silhouette: 'cloud-blob',
  motion: {
    stiffness: 70,
    damping: 28,
    idleSpeed: 0.9,
    idleAmplitude: 4.5,
    idleIntervalMin: 6000,
    idleIntervalMax: 12000,
    motionType: 'float',
  },
  expressions: {
    idle: [
      createDefaultParams({ eyeType: 0, mouthType: 10 }), // dotSimple + dotMouth
      createDefaultParams({ eyeType: 0, mouthType: 3, bob: -2, shiftX: 2 }), // dotSimple + flatLine
      createDefaultParams({ eyeType: 8, mouthType: 3, bob: 2, shiftX: -2 }), // tiredLineSlits + flatLine
      createDefaultParams({ eyeType: 0, mouthType: 10, bob: -1, shiftX: -1.5 }),
      createDefaultParams({ eyeType: 8, mouthType: 3, bob: 1, shiftX: 1.5 }),
      createDefaultParams({ eyeType: 0, mouthType: 10, bob: -1.5, shiftX: 0 }),
    ],
    near: [
      createDefaultParams({ eyeType: 0, mouthType: 3, bob: -2 }),
      createDefaultParams({ eyeType: 8, mouthType: 3, bob: -2.5 }),
    ],
    hover: [
      createDefaultParams({ eyeType: 8, mouthType: 3, cheek: 0.15, bob: -3.5 }), // tiredLineSlits + flatLine
      createDefaultParams({ eyeType: 0, mouthType: 3, cheek: 0.2, bob: -4 }),
    ],
    click: [
      createDefaultParams({ eyeType: 0, mouthType: 10, cheek: 0.3, bob: -5 }),
      createDefaultParams({ eyeType: 8, mouthType: 3, cheek: 0.35, bob: -5.5 }),
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

export function getEmojiDefinition(name: string): EmojiDefinition | undefined {
  return LIB[name.toLowerCase()];
}
