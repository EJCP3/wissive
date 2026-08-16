import { InteractionState } from '../emojis/types';

export interface EmojiTheme {
  baseColor: string;
  strokeColor?: string;
  glowColor?: string;
}

export type ThemeOption = 'auto' | EmojiTheme;

/**
 * Mapeo de paleta de colores por estado de emoción/actividad
 */
export const STATE_THEME_MAP: Partial<Record<InteractionState, EmojiTheme>> = {
  // Emociones positivas & energía
  happy: { baseColor: '#F7C6CE', strokeColor: '#1c1917' },
  excited: { baseColor: '#FFD54F', strokeColor: '#1c1917' },
  celebrate: { baseColor: '#FF80AB', strokeColor: '#1c1917' },
  laughing: { baseColor: '#FFE082', strokeColor: '#1c1917' },
  playful: { baseColor: '#F48FB1', strokeColor: '#1c1917' },
  proud: { baseColor: '#CE93D8', strokeColor: '#1c1917' },

  // Reposo, sueño & descanso
  idle: { baseColor: '#F7C6CE', strokeColor: '#1c1917' },
  sleeping: { baseColor: '#9FA8DA', strokeColor: '#1A237E' },
  drowsy: { baseColor: '#C5CAE9', strokeColor: '#283593' },
  'powering-down': { baseColor: '#78909C', strokeColor: '#263238' },
  bored: { baseColor: '#B0BEC5', strokeColor: '#37474F' },

  // Fuego, ira & alerta
  angry: { baseColor: '#EF5350', strokeColor: '#B71C1C' },
  alerting: { baseColor: '#FF7043', strokeColor: '#BF360C' },
  notifying: { baseColor: '#FFA726', strokeColor: '#E65100' },
  suspicious: { baseColor: '#D4E157', strokeColor: '#33691E' },

  // Pensamiento, procesamiento & escaneo AI
  thinking: { baseColor: '#4DD0E1', strokeColor: '#006064' },
  searching: { baseColor: '#26C6DA', strokeColor: '#004D40' },
  loading: { baseColor: '#4FC3F7', strokeColor: '#01579B' },
  listening: { baseColor: '#81C784', strokeColor: '#1B5E20' },
  dictating: { baseColor: '#AED581', strokeColor: '#33691E' },
  writing: { baseColor: '#FFF176', strokeColor: '#F57F17' },
  orbit: { baseColor: '#80DEEA', strokeColor: '#00838F' },
  radar: { baseColor: '#4DB6AC', strokeColor: '#004D40' },
  progress: { baseColor: '#64B5F6', strokeColor: '#0D47A1' },

  // Tristeza, duda & empatía
  sad: { baseColor: '#90CAF9', strokeColor: '#1565C0' },
  scared: { baseColor: '#B39DDB', strokeColor: '#4527A0' },
  confused: { baseColor: '#FFE082', strokeColor: '#E65100' },
  curious: { baseColor: '#A5D6A7', strokeColor: '#1B5E20' },
  shy: { baseColor: '#F48FB1', strokeColor: '#880E4F' },
  waking: { baseColor: '#FFF59D', strokeColor: '#F57F17' },
  spawning: { baseColor: '#E1BEE7', strokeColor: '#4A148C' },
};

/**
 * Convierte color HEX a objeto RGB {r, g, b}
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  let c = hex.trim().replace('#', '');
  if (c.length === 3) {
    c = c.split('').map(x => x + x).join('');
  }
  const num = parseInt(c, 16);
  if (isNaN(num)) return { r: 247, g: 198, b: 206 };
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

/**
 * Interpola suavemente entre dos colores HEX
 */
export function blendColors(colorA: string, colorB: string, factor: number): string {
  const rgbA = hexToRgb(colorA);
  const rgbB = hexToRgb(colorB);

  const f = Math.max(0, Math.min(1, factor));
  const r = Math.round(rgbA.r + (rgbB.r - rgbA.r) * f);
  const g = Math.round(rgbA.g + (rgbB.g - rgbA.g) * f);
  const b = Math.round(rgbA.b + (rgbB.b - rgbA.b) * f);

  const toHex = (n: number) => n.toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/**
 * Obtiene el tema sugerido para un estado dado, con fallback a la paleta predeterminada del emoji.
 */
export function getThemeForState(_state: InteractionState, defaultBaseColor: string): EmojiTheme {
  return {
    baseColor: defaultBaseColor,
    strokeColor: '#1c1917',
  };
}

