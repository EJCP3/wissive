export type CoreInteractionState = 'idle' | 'near' | 'hover' | 'click';

export type LifecycleState =
  | 'sleeping'
  | 'waking'
  | 'idle'
  | 'listening'
  | 'thinking'
  | 'searching'
  | 'working';

export type ReactionState =
  | 'excited'
  | 'surprised'
  | 'suspicious'
  | 'angry'
  | 'drowsy'
  | 'happy'
  | 'curious'
  | 'confused'
  | 'bored'
  | 'proud'
  | 'shy'
  | 'sad'
  | 'laughing'
  | 'scared'
  | 'playful'
  | 'celebrate';

export type MorphState = 'orbit' | 'radar' | 'progress';

export type ProductCycleState =
  | 'spawning'
  | 'humming'
  | 'loading'
  | 'dictating'
  | 'writing'
  | 'sending'
  | 'receiving'
  | 'uploading'
  | 'notifying'
  | 'alerting'
  | 'dragging'
  | 'bouncing'
  | 'powering-down';

export type InteractionState =
  | CoreInteractionState
  | LifecycleState
  | ReactionState
  | MorphState
  | ProductCycleState
  | (string & {});

export interface FaceParameters {
  [key: string]: number;
  /** Eye scale/openness [0..1] */
  eyeOpen: number;
  /** Overall eye size multiplier [0.5..2.0] */
  eyeScale: number;
  /**
   * Eye type selector, 0-31 — ver el switch(eyeType) en render/svg.ts, es
   * la fuente de verdad real (este comentario se desactualizó una vez, no
   * confiar en él a ciegas si volvés a tocar el switch).
   * [0: dot, 1: happy-arc ^, 2: wedge-squint >, 3/4: diagonal-wink-mirrored,
   * 5: pupil-in-white, 6: heart, 7: X, 8: double-line squint, 9: eyebrows-only,
   * 10/11: asymmetric-wink-oval, 12: cat-pupil, 13: big-pupil, 14: closed-serene-arc,
   * 15: droopy-lid, 16: vertical-line (crying), 17: angry-diagonal-brow,
   * 18: spiral (Knot), 19: sleepy-ring, 20: hollow-ring, 21: star,
   * 22: side-eye, 23: single-wink, 24: anime-highlight, 25: sleepy-lash,
   * 26: googly, 27: waterfall-cry ⊓⊓, 28: blank-stare, 29: worried-brow,
   * 30: angry-zigzag-brow, 31: content-ring]
   */
  eyeType: number;
  /** Horizontal distance between both eyes (default 32) */
  eyeGap: number;
  /** Vertical position of the eye line (default 45) */
  eyeY: number;
  /** Vertical position of the mouth (default 63) */
  mouthY: number;
  /** Mouth curvature [-1..1] where 1 is happy curve, -1 is sad curve */
  mouthCurve: number;
  /** Mouth width relative [0.5..1.5] */
  mouthWidth: number;
  /** Mouth opening vertical factor [0..1] for open mouth/surprised */
  mouthOpen: number;
  /**
   * Mouth type selector, 0-24 — ver el switch(mouthType) en render/svg.ts.
   * [0: curve/line (sigue mouthCurve), 1: open-oval, 2: zigzag, 3: flat-line,
   * 4: teeth-clench, 5: teeth-grin, 6: wide-happy-open, 7: X, 8: mask-cover,
   * 9: wavy-w, 10: dot, 11: diagonal-line, 12: frown-curve, 13: hollow-circle,
   * 14: none, 15: tongue-out, 16: smirk, 17: triangle-kitten, 18: cat-three (>3<),
   * 19: box-open, 20: pursed, 21: teeth-row, 22: side-tongue, 23: mega-tongue,
   * 24: cat-cup-smirk]
   */
  mouthType: number;
  /** Eyebrows visible toggle (0: hidden, 1: visible) */
  showBrows: number;
  /** Eyebrow Y offset */
  browY: number;
  /** Eyebrow tilt angle in degrees (+ is angry \ /, - is sad / \) */
  browTilt: number;
  /** Cheek opacity [0..1] */
  cheek: number;
  /** Vertical head bob offset in pixels */
  bob: number;
  /** Horizontal shift in pixels */
  shiftX: number;
  /** Teardrop opacity/scale [0..1] (Lumo) */
  tears: number;
  /** Horizontal gaze shift [-13.2..13.2] */
  gazeX: number;
  /** Vertical gaze shift [-8.4..8.4] */
  gazeY: number;
  /** 3D Head rotation angle in radians [-PI..PI] */
  turnAngle: number;
  /** Opacidad/intensidad del accesorio "Zzz" flotante [0..1] */
  zzz: number;
  /** Opacidad/intensidad de la gota de sudor [0..1] */
  sweat: number;
  /** Nubes de tormenta encima de la cabeza (enfado) [0..1] */
  storm: number;
  /** Garabato/espiral de confusión encima de la cabeza [0..1] */
  scribble: number;
  /** Nubecita de resoplido saliendo de la boca (agotamiento) [0..1] */
  puff: number;
}

/** Firma de movimiento idle — una por personalidad, ver `core/motion.ts` */
export type MotionType =
  | 'bouncy'
  | 'flutter'
  | 'serene'
  | 'float'
  | 'calm'
  | 'droop'
  | 'sob'
  | 'jitter'
  | 'fiery'
  | 'wilt'
  | 'dizzy'
  | 'snooze'
  | 'pop'
  | 'drift';

export interface MotionProfile {
  stiffness: number;
  damping: number;
  idleSpeed: number;
  idleAmplitude: number;
  idleIntervalMin: number;
  idleIntervalMax: number;
  motionType: MotionType;
}

export type SilhouetteType =
  | 'circle'
  | 'capsule'
  | 'rounded-squircle'
  | 'pear-blob'
  | 'egg-oval'
  | 'starburst-puff'
  | 'pill-vertical'
  | 'heart'
  | 'round-blob'
  | 'ghost-blob'
  | 'oval'
  | 'elongated-oval'
  | 'teardrop-blob'
  | 'flame-blob'
  | 'droopy-blob'
  | 'bear-blob'
  | 'spiky-blob'
  | 'cloud-blob'
  | 'wide-oval'
  | 'soft-round'
  | 'octopus-blob'
  | 'wave-blob';

export type EmojiExpressionPool = Record<string, FaceParameters[]>;

export interface EmojiDefinition {
  name: string;
  emotion: string;
  baseColor: string;
  silhouette: SilhouetteType;
  motion: MotionProfile;
  expressions: EmojiExpressionPool;
  /** Emoción cuyo set de partículas usar en bursts (por defecto: `emotion`) */
  particleEmotion?: string;
  /** Emoción cuyo set de sonidos usar (por defecto: `emotion`) */
  soundEmotion?: string;
  /**
   * Banco de estados que este emoji puede visitar por su cuenta en reposo
   * (deambular autónomo). Por defecto: `AUTONOMOUS_STATES` (todo el grupo
   * "Reacciones"). Lo usan sobre todo los emojis personalizados, para elegir
   * su propio repertorio en vez del genérico.
   */
  autonomousStatePool?: InteractionState[];
}
