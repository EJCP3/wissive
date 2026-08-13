import { InteractionState, FaceParameters } from '../emojis/types';

export class StateManager {
  private currentState: InteractionState = 'idle';
  private lastIndices: Record<string, number> = {};

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
    if (expressions[state] && expressions[state].length > 0) {
      return expressions[state];
    }

    // Mapeo inteligente de los 39 estados de GrokBot a las categorías base
    switch (state) {
      // Reactions
      case 'happy':
      case 'excited':
      case 'playful':
      case 'celebrate':
      case 'laughing':
      case 'proud':
        return expressions.hover || expressions.idle;

      case 'surprised':
      case 'scared':
      case 'alerting':
      case 'notifying':
      case 'bouncing':
        return expressions.click || expressions.hover || expressions.idle;

      case 'suspicious':
      case 'angry':
        return expressions.click || expressions.idle;

      case 'drowsy':
      case 'sleeping':
      case 'powering-down':
      case 'bored':
        return expressions.idle;

      case 'curious':
      case 'thinking':
      case 'searching':
      case 'listening':
      case 'working':
      case 'confused':
      case 'shy':
      case 'sad':
        return expressions.near || expressions.idle;

      // Product Cycle & Morphs
      case 'spawning':
      case 'waking':
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
        return expressions.near || expressions.hover || expressions.idle;

      default:
        return expressions[state] || expressions.idle;
    }
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
