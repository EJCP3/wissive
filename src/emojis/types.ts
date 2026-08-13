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
  /** Eye type selector [0: dot, 1: happy-arc ^, 2: wedge-squint >, 3: droopy-slant \, 4: angry-slant /, 5: pupil-ring, 6: hollow-ring, 7: spiral, 8: sleepy-lid] */
  eyeType: number;
  /** Mouth curvature [-1..1] where 1 is happy curve, -1 is sad curve */
  mouthCurve: number;
  /** Mouth width relative [0.5..1.5] */
  mouthWidth: number;
  /** Mouth opening vertical factor [0..1] for open mouth/surprised */
  mouthOpen: number;
  /** Mouth type selector [0: curve/line, 1: open-oval, 2: zigzag] */
  mouthType: number;
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
}

export interface MotionProfile {
  stiffness: number;
  damping: number;
  idleSpeed: number;
  idleAmplitude: number;
  idleIntervalMin: number;
  idleIntervalMax: number;
  motionType: 'bouncy' | 'flutter' | 'serene' | 'float' | 'calm' | 'droop' | 'jitter' | 'fiery' | 'dizzy' | 'pop';
}

export type SilhouetteType =
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
  | 'cloud-blob';

export type EmojiExpressionPool = Record<string, FaceParameters[]>;

export interface EmojiDefinition {
  name: string;
  emotion: string;
  baseColor: string;
  silhouette: SilhouetteType;
  motion: MotionProfile;
  expressions: EmojiExpressionPool;
}
