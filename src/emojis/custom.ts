import type { EmojiDefinition, InteractionState, SilhouetteType } from './types';
import { LIB, EMOJI_COTA } from './catalog.ts';
import { ALL_WANDERABLE_STATES } from './states.ts';

const STORAGE_PREFIX = 'wissive:custom:';

export interface CustomEmojiOptions {
  /** Color base, ej. '#F2A9B8' */
  baseColor?: string;
  /** Silueta base — cualquiera de las 22 que soporta getSilhouettePath() en
   *  render/svg.ts (las 14 de los personajes del catálogo + 8 sin usar
   *  todavía por ninguno). Default 'circle'. */
  silhouette?: SilhouetteType;
  /** Nombre de un emoji del catálogo (LIB) del que tomar el tipo/tamaño de ojos */
  eyesFrom?: string;
  /** Nombre de un emoji del catálogo del que tomar el tipo/curva/ancho de boca */
  mouthFrom?: string;
  /**
   * Tipo de ojo crudo (ver el switch(eyeType) en render/svg.ts, 0-23) — para
   * los tipos nuevos que ningún personaje del catálogo usa todavía (estrella,
   * reojo, guiño). Gana sobre `eyesFrom` si se especifican los dos.
   */
  eyeTypeOverride?: number;
  /** Tipo de boca crudo (0-16), mismo caso que eyeTypeOverride. Gana sobre `mouthFrom`. */
  mouthTypeOverride?: number;
  /** Nombre de un emoji del catálogo del que tomar la animación idle (motion) */
  motionFrom?: string;
  /** Nombre de un emoji del catálogo del que tomar el estilo de partículas (burst) */
  particlesFrom?: string;
  /** Nombre de un emoji del catálogo del que tomar el set de sonidos */
  soundFrom?: string;
  /**
   * Banco de estados que este emoji puede realizar por su cuenta en reposo
   * (deambular autónomo) — cualquier subconjunto de ALL_WANDERABLE_STATES
   * (todos menos idle/near/hover/click). Elegido a mano por quien arma el
   * emoji, así que aquí sí se permiten los de "Ciclo de producto"/"Morfos
   * de agente" — es una decisión explícita, no la librería inventando.
   * Sin especificar, usa el banco genérico (AUTONOMOUS_STATES, 16 "Reacciones").
   */
  stateBank?: InteractionState[];
}

function cloneExpressions(source: EmojiDefinition['expressions']): EmojiDefinition['expressions'] {
  const out: EmojiDefinition['expressions'] = {};
  for (const state in source) {
    out[state] = source[state].map((p) => ({ ...p }));
  }
  return out;
}

/**
 * Construye una definición de emoji personalizado: base neutra (Cota),
 * silueta a elección (circle por default), con ojos/boca/animación tomados
 * opcionalmente de cualquier otro emoji del catálogo.
 */
export function buildCustomEmoji(name: string, options: CustomEmojiOptions = {}): EmojiDefinition {
  const eyesSource = options.eyesFrom ? LIB[options.eyesFrom] : undefined;
  const mouthSource = options.mouthFrom ? LIB[options.mouthFrom] : undefined;
  const motionSource = options.motionFrom ? LIB[options.motionFrom] : undefined;
  const particlesSource = options.particlesFrom ? LIB[options.particlesFrom] : undefined;
  const soundSource = options.soundFrom ? LIB[options.soundFrom] : undefined;

  const expressions = cloneExpressions(EMOJI_COTA.expressions);
  for (const state in expressions) {
    // Cada emoji tiene un banco de variantes por estado (idle/near/hover/click) —
    // se toma la variante del mismo estado, no solo la de idle, para conservar
    // los matices (cheek, bob, etc.) al pasar de un estado a otro.
    const eyesVariant = eyesSource && (eyesSource.expressions[state]?.[0] ?? eyesSource.expressions.idle[0]);
    const mouthVariant = mouthSource && (mouthSource.expressions[state]?.[0] ?? mouthSource.expressions.idle[0]);

    expressions[state] = expressions[state].map((p) => ({
      ...p,
      ...(eyesVariant && { eyeType: eyesVariant.eyeType, eyeScale: eyesVariant.eyeScale }),
      ...(mouthVariant && {
        mouthType: mouthVariant.mouthType,
        mouthCurve: mouthVariant.mouthCurve,
        mouthWidth: mouthVariant.mouthWidth,
      }),
      // Los overrides van al final y ganan: son para los tipos nuevos que
      // ningún personaje del catálogo tiene todavía, así que no hay un
      // "from" del que copiarlos.
      ...(options.eyeTypeOverride !== undefined && { eyeType: options.eyeTypeOverride }),
      ...(options.mouthTypeOverride !== undefined && { mouthType: options.mouthTypeOverride }),
    }));
  }

  // idle/near/hover/click no se "visitan" al deambular — los sigue
  // decidiendo la interacción real; todo lo demás es elección válida aquí.
  const stateBank = options.stateBank?.filter((s) => ALL_WANDERABLE_STATES.includes(s));

  return {
    name,
    emotion: 'custom',
    baseColor: options.baseColor || EMOJI_COTA.baseColor,
    silhouette: options.silhouette || 'circle',
    motion: motionSource ? { ...motionSource.motion } : { ...EMOJI_COTA.motion },
    expressions,
    particleEmotion: particlesSource?.emotion,
    soundEmotion: soundSource?.emotion,
    ...(stateBank && stateBank.length > 0 && { autonomousStatePool: stateBank }),
  };
}

export function saveCustomEmoji(name: string, def: EmojiDefinition): void {
  localStorage.setItem(STORAGE_PREFIX + name, JSON.stringify(def));
}

export function loadCustomEmoji(name: string): EmojiDefinition | null {
  const raw = localStorage.getItem(STORAGE_PREFIX + name);
  return raw ? (JSON.parse(raw) as EmojiDefinition) : null;
}

/**
 * Construye (o reconstruye) un emoji personalizado, lo persiste en localStorage
 * y lo registra en LIB para poder usarlo directamente con createEmoji(name, ...).
 */
export function createCustomEmoji(name: string, options: CustomEmojiOptions = {}): EmojiDefinition {
  const def = buildCustomEmoji(name, options);
  LIB[name] = def;
  saveCustomEmoji(name, def);
  return def;
}
