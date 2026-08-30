import type { InteractionState, FaceParameters } from '../emojis/types';

/**
 * Procedural overrides per state to ensure ALL 39 states have unique facial geometry
 */
function getProceduralStateParams(base: FaceParameters, state: InteractionState): FaceParameters {
  const p = { ...base };

  switch (state) {
    // 💤 Reposo & Sueño
    case 'sleeping':
      p.eyeOpen = 0.05;
      p.eyeType = 2; // ^‿^ closed happy arc
      p.mouthCurve = 0.2;
      p.browY = 3;
      p.browTilt = -0.1;
      p.cheek = 0.2;
      p.zzz = 1; // dormido de verdad = con sus zzz, no solo ojos cerrados
      break;

    case 'drowsy':
    case 'powering-down':
      p.eyeOpen = 0.35;
      p.mouthCurve = 0.0;
      p.browY = 4;
      p.browTilt = 0.1;
      p.zzz = 0.55; // entrando en sueño: zzz más tenue que dormido del todo
      p.sweat = 0.8; // gota de agotamiento en la frente
      p.puff = 0.7; // resoplido cansado
      break;

    case 'bored':
      p.eyeOpen = 0.45;
      p.mouthCurve = -0.2;
      p.browY = 2;
      p.gazeX = 6;
      p.puff = 0.4; // suspiro de aburrimiento, más tenue que el de agotamiento
      break;

    case 'waking':
    case 'spawning':
      p.eyeOpen = 0.75;
      p.eyeScale = 1.1;
      p.mouthCurve = 0.4;
      p.browY = -2;
      break;

    // 🔥 Ira, Alerta & Tensión
    case 'angry':
      p.eyeType = 3; // >‿< or sharp eyes
      p.browTilt = -0.75;
      p.mouthCurve = -0.65;
      p.mouthOpen = 0.2;
      p.eyeScale = 1.15;
      p.storm = 1; // nube de tormenta + rayo encima de la cabeza
      break;

    case 'alerting':
    case 'notifying':
      p.eyeScale = 1.3;
      p.browTilt = -0.4;
      p.mouthOpen = 0.45;
      p.mouthCurve = 0.1;
      break;

    case 'suspicious':
      p.browTilt = -0.5;
      p.eyeScale = 0.9;
      p.mouthCurve = -0.3;
      p.gazeX = -8;
      break;

    // 🎉 Alegría & Excitación
    case 'excited':
    case 'celebrate':
      p.eyeScale = 1.35;
      p.mouthCurve = 0.9;
      p.mouthOpen = 0.55;
      p.cheek = 0.85;
      p.browY = -4;
      break;

    case 'happy':
    case 'playful':
      p.eyeScale = 1.15;
      p.mouthCurve = 0.75;
      p.cheek = 0.6;
      p.browY = -2;
      break;

    case 'laughing':
      p.eyeType = 2;
      p.mouthCurve = 0.95;
      p.mouthOpen = 0.7;
      p.cheek = 0.9;
      p.bob = -3;
      break;

    case 'proud':
      p.eyeScale = 1.1;
      p.mouthCurve = 0.65;
      p.browY = -3;
      p.bob = -4;
      break;

    // 🤖 IA, Pensamiento & Proceso
    case 'thinking':
    case 'searching':
      p.browTilt = 0.5;
      p.eyeScale = 1.1;
      p.mouthWidth = 0.6;
      p.mouthCurve = 0.1;
      p.shiftX = -4;
      break;

    case 'dictating':
    case 'listening':
    case 'writing':
    case 'humming':
      p.mouthOpen = 0.45;
      p.mouthCurve = 0.4;
      p.eyeScale = 1.08;
      p.cheek = 0.4;
      break;

    case 'loading':
    case 'orbit':
    case 'radar':
    case 'progress':
      p.eyeScale = 1.15;
      p.mouthCurve = 0.3;
      p.browY = -2;
      break;

    // 😱 Sorpresa, Miedo & Duda
    case 'surprised':
      p.eyeScale = 1.45;
      p.mouthOpen = 0.75;
      p.mouthCurve = 0.0;
      p.browY = -7;
      break;

    case 'scared':
      p.eyeScale = 1.4;
      p.mouthOpen = 0.8;
      p.mouthCurve = -0.55;
      p.browTilt = 0.5;
      break;

    case 'confused':
      p.browTilt = 0.65;
      p.mouthCurve = -0.3;
      p.shiftX = -5;
      p.scribble = 1; // garabato de confusión encima de la cabeza
      break;

    case 'curious':
      p.browTilt = -0.3;
      p.eyeScale = 1.2;
      p.mouthCurve = 0.45;
      p.shiftX = 3;
      break;

    case 'shy':
      p.eyeScale = 0.85;
      p.gazeY = 6;
      p.cheek = 0.95;
      p.mouthCurve = 0.35;
      break;

    case 'sad':
      p.browTilt = 0.6;
      p.mouthCurve = -0.65;
      p.tears = 0.8;
      p.browY = 2;
      break;

    default:
      break;
  }

  return p;
}

export class StateManager {
  private currentState: InteractionState;
  private lastIndices: Record<string, number> = {};

  constructor(initialState: InteractionState = 'idle') {
    this.currentState = initialState;
  }

  public getState(): InteractionState {
    return this.currentState;
  }

  public setState(newState: InteractionState): boolean {
    const changed = this.currentState !== newState;
    this.currentState = newState;
    return changed;
  }

  public resolvePool(
    expressions: Record<string, FaceParameters[]>,
    state: InteractionState = this.currentState
  ): FaceParameters[] {
    let pool: FaceParameters[] = [];

    if (expressions[state] && expressions[state].length > 0) {
      pool = expressions[state];
    } else {
      // Fallback base
      switch (state) {
        case 'happy':
        case 'excited':
        case 'playful':
        case 'celebrate':
        case 'laughing':
        case 'proud':
          pool = expressions.hover || expressions.idle;
          break;

        case 'surprised':
        case 'scared':
        case 'alerting':
        case 'notifying':
        case 'bouncing':
          pool = expressions.click || expressions.hover || expressions.idle;
          break;

        case 'suspicious':
        case 'angry':
          pool = expressions.click || expressions.idle;
          break;

        case 'curious':
        case 'thinking':
        case 'searching':
        case 'listening':
        case 'working':
        case 'confused':
        case 'shy':
        case 'sad':
        case 'dictating':
        case 'writing':
        case 'sending':
        case 'receiving':
        case 'uploading':
        case 'dragging':
        case 'humming':
        case 'loading':
        case 'orbit':
        case 'radar':
        case 'progress':
          pool = expressions.near || expressions.hover || expressions.idle;
          break;

        default:
          pool = expressions[state] || expressions.idle;
          break;
      }
    }

    // Aplicar proceduralmente los rasgos específicos del estado
    return pool.map(baseParams => getProceduralStateParams(baseParams, state));
  }

  public pickVariant(
    pool: FaceParameters[],
    state: InteractionState = this.currentState
  ): FaceParameters {
    if (!pool || pool.length === 0) {
      throw new Error(`Empty variant pool for state "${state}"`);
    }

    if (pool.length === 1) {
      this.lastIndices[state] = 0;
      return pool[0];
    }

    const lastIdx = this.lastIndices[state] ?? -1;
    let nextIdx = Math.floor(Math.random() * pool.length);

    while (nextIdx === lastIdx) {
      nextIdx = Math.floor(Math.random() * pool.length);
    }

    this.lastIndices[state] = nextIdx;
    return pool[nextIdx];
  }
}

export function createStateManager(initialState: InteractionState = 'idle'): StateManager {
  return new StateManager(initialState);
}

