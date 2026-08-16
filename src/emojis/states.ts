import type { InteractionState } from './types';

/**
 * Registro de estados en runtime — fuente única de verdad.
 *
 * Los tipos de `types.ts` solo existen en compilación, así que la UI se
 * inventaba su propia lista y quedó desincronizada: `idle` duplicado,
 * etiquetas en francés y un recuento de 39 que no cuadraba con la realidad.
 */
export interface StateGroup {
  label: string;
  states: InteractionState[];
}

export const STATE_GROUPS: StateGroup[] = [
  {
    label: 'Interacción',
    states: ['idle', 'near', 'hover', 'click'],
  },
  {
    // `idle` vive en el grupo de Interacción, no se repite aquí
    label: 'Ciclo de vida',
    states: ['sleeping', 'waking', 'listening', 'thinking', 'searching', 'working'],
  },
  {
    label: 'Reacciones',
    states: [
      'excited', 'surprised', 'suspicious', 'angry', 'drowsy', 'happy',
      'curious', 'confused', 'bored', 'proud', 'shy', 'sad',
      'laughing', 'scared', 'playful', 'celebrate',
    ],
  },
  {
    label: 'Morfos de agente',
    states: ['orbit', 'radar', 'progress'],
  },
  {
    label: 'Ciclo de producto',
    states: [
      'spawning', 'humming', 'loading', 'dictating', 'writing', 'sending',
      'receiving', 'uploading', 'notifying', 'alerting', 'dragging',
      'bouncing', 'powering-down',
    ],
  },
];

/** Todos los estados, sin repetidos, en orden de grupo */
export const ALL_STATES: InteractionState[] = STATE_GROUPS.flatMap((g) => g.states);

/** Estados cuya animación la pone la personalidad del emoji, no el estado */
export const PERSONALITY_DRIVEN_STATES: InteractionState[] = ['idle', 'near', 'hover', 'click'];

/**
 * Estados que el emoji puede visitar por su cuenta en reposo (deambular
 * autónomo) — solo "Reacciones": son expresión pura, sin significado de
 * aplicación. Deliberadamente NO incluye "Ciclo de producto" ni "Morfos de
 * agente" (uploading, thinking, orbit…): esos los debe fijar la app anfitriona
 * porque comunican un estado real, y mostrarlos al azar sería mentir.
 */
export const AUTONOMOUS_STATES: InteractionState[] =
  STATE_GROUPS.find((g) => g.label === 'Reacciones')!.states;

/**
 * Todo estado que un emoji podría "visitar" al deambular — es decir, todos
 * menos los de Interacción (idle/near/hover/click no se "visitan", los
 * decide la interacción real del usuario). A diferencia de AUTONOMOUS_STATES,
 * esto SÍ incluye Ciclo de producto/Morfos de agente: sirve como el universo
 * de opciones cuando alguien elige el banco a mano (p.ej. el picker del
 * emoji personalizado) — ahí ya no es la librería "mintiendo" por su cuenta,
 * es una elección explícita del usuario para su propio emoji.
 */
export const ALL_WANDERABLE_STATES: InteractionState[] = ALL_STATES.filter(
  (s) => !PERSONALITY_DRIVEN_STATES.includes(s)
);

/**
 * Resuelve qué banco de estados usar para deambular, en orden de prioridad:
 * opción explícita del llamador > banco propio del emoji (p.ej. un custom
 * con `stateBank`) > banco genérico. Función pura para poder testear la
 * prioridad sin tener que instanciar un emoji real (createEmoji necesita DOM).
 */
export function resolveAutonomousStatePool(
  explicitPool: InteractionState[] | undefined,
  definitionPool: InteractionState[] | undefined
): InteractionState[] {
  return explicitPool ?? definitionPool ?? AUTONOMOUS_STATES;
}

/** Elige uno al azar de `pool`, evitando repetir `previous` cuando hay más de una opción */
export function pickWithoutRepeat<T>(pool: T[], previous: T | null): T {
  if (pool.length <= 1) return pool[0];
  let next = pool[Math.floor(Math.random() * pool.length)];
  while (next === previous) {
    next = pool[Math.floor(Math.random() * pool.length)];
  }
  return next;
}
