import type { FaceParameters } from '../emojis/types';

export type SequenceMode = 'loop' | 'once' | 'ping-pong';

export interface SequenceStep {
  /** Nombre de un estado del emoji (usa su pool de expresiones) */
  state?: string;
  /** Parámetros crudos — se aplican encima si además hay `state` */
  params?: Partial<FaceParameters>;
  /** ms que dura este paso antes de pasar al siguiente */
  duration?: number;
}

export interface SequenceOptions {
  mode?: SequenceMode;
  onComplete?: () => void;
}

export const DEFAULT_STEP_MS = 600;

export interface SequencePlayer {
  play: (steps: SequenceStep[], options?: SequenceOptions) => void;
  stop: () => void;
  isPlaying: () => boolean;
}

/**
 * Encadena expresiones en una línea de tiempo.
 *
 * No toca resortes ni DOM: recibe `resolveStep` (paso → parámetros) y
 * `applyStep` (parámetros → destino), de modo que la interpolación entre pasos
 * la sigue haciendo el motor de resortes que ya existe.
 */
export function createSequencePlayer(hooks: {
  resolveStep: (step: SequenceStep) => Partial<FaceParameters>;
  applyStep: (params: Partial<FaceParameters>) => void;
}): SequencePlayer {
  let timer: ReturnType<typeof setTimeout> | null = null;
  let playing = false;

  const stop = () => {
    if (timer !== null) {
      clearTimeout(timer);
      timer = null;
    }
    playing = false;
  };

  const play = (steps: SequenceStep[], options: SequenceOptions = {}) => {
    stop();
    if (steps.length === 0) return;

    const mode = options.mode ?? 'once';
    playing = true;
    let index = 0;
    let direction = 1;

    const advance = () => {
      if (!playing) return;

      const step = steps[index];
      hooks.applyStep(hooks.resolveStep(step));

      timer = setTimeout(() => {
        if (mode === 'ping-pong') {
          // Rebota en los extremos: A,B,C,B,A,B,C…
          if (steps.length > 1) {
            if (index + direction >= steps.length || index + direction < 0) {
              direction = -direction;
            }
            index += direction;
          }
        } else {
          index += 1;
          if (index >= steps.length) {
            if (mode === 'loop') {
              index = 0;
            } else {
              stop();
              options.onComplete?.();
              return;
            }
          }
        }
        advance();
      }, step.duration ?? DEFAULT_STEP_MS);
    };

    advance();
  };

  return { play, stop, isPlaying: () => playing };
}
