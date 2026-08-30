import type { SilhouetteType } from 'wissive';

export type TransitionProfile = 'smooth' | 'bouncy' | 'snappy' | 'gentle' | 'instant';
export type StageBackgroundType = 'gradient' | 'transparent' | 'light' | 'dark';

export interface KeyframeData {
  id: string;
  label: string;
  duration: number; // in seconds
  silhouette: SilhouetteType;
  color: string;
  gazeX: number; // -12 to 12
  gazeY: number; // -8 to 8
  eyeType: number; // 0 to 31
  eyeOpen: number; // 0 to 1
  eyeScale: number; // 0.6 to 1.5
  mouthType: number; // 0 to 24
  mouthCurve: number; // -1 to 1
  mouthOpen: number; // 0 to 1
  hasBrows: boolean;
  browTilt: number; // -25 to 25
  browY: number; // -6 to 6
  cheek: number; // 0 to 1
  transitionType: TransitionProfile;
  particles: boolean;
  bounce: boolean;
  spin: boolean;
  sweat: number;
  zzz: number;
  tears: number;
  storm: number;
  scribble: number;
  puff: number;
}

export interface StatePreset {
  id: string;
  name: string;
  category: string;
  description: string;
  data: Partial<KeyframeData>;
}

export interface SequenceTemplate {
  id: string;
  name: string;
  badge: string;
  description: string;
  frames: KeyframeData[];
}

let keyframeIdCounter = 0;
export function createDefaultKeyframe(label = 'Frame', overrides: Partial<KeyframeData> = {}): KeyframeData {
  return {
    id: `kf_${++keyframeIdCounter}_${Date.now()}`,
    label,
    duration: 1.0,
    silhouette: 'heart',
    color: '#7ED321',
    gazeX: 0,
    gazeY: 0,
    eyeType: 0,
    eyeOpen: 1.0,
    eyeScale: 1.0,
    mouthType: 0,
    mouthCurve: 0.0,
    mouthOpen: 0.0,
    hasBrows: false,
    browTilt: 0,
    browY: 0,
    cheek: 0,
    transitionType: 'smooth',
    particles: false,
    bounce: false,
    spin: false,
    sweat: 0,
    zzz: 0,
    tears: 0,
    storm: 0,
    scribble: 0,
    puff: 0,
    ...overrides,
  };
}
