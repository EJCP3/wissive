/**
 * Utilidades de accesibilidad (A11y) para Wissive:
 * - Detección y subscripción a prefers-reduced-motion
 * - Cálculo de luminancia relativa y ratio de contraste WCAG 2.1
 */

/**
 * Detecta si el usuario prefiere movimiento reducido en su sistema operativo.
 */
export function isReducedMotionPreferred(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) {
    return false;
  }
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Se suscribe a los cambios de la preferencia prefers-reduced-motion del sistema.
 */
export function subscribeToReducedMotion(onChange: (reduced: boolean) => void): () => void {
  if (typeof window === 'undefined' || !window.matchMedia) {
    return () => {};
  }
  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const listener = (e: MediaQueryListEvent) => onChange(e.matches);
  
  if (mediaQuery.addEventListener) {
    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  } else {
    // Fallback para navegadores antiguos
    mediaQuery.addListener(listener);
    return () => mediaQuery.removeListener(listener);
  }
}

/**
 * Convierte un color HEX o RGB a componentes [R, G, B] normalizados (0 a 1).
 */
function parseColorToRGB(color: string): [number, number, number] {
  let hex = color.trim().replace('#', '');
  if (hex.length === 3) {
    hex = hex.split('').map(c => c + c).join('');
  }
  if (hex.length === 6) {
    const num = parseInt(hex, 16);
    return [(num >> 16 & 255) / 255, (num >> 8 & 255) / 255, (num & 255) / 255];
  }
  // Default a negro si no se puede parsear
  return [0, 0, 0];
}

/**
 * Calcula la luminancia relativa de un color según la norma WCAG 2.1.
 */
export function getLuminance(color: string): number {
  const [r, g, b] = parseColorToRGB(color);
  const transformComponent = (c: number) => {
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  };
  const R = transformComponent(r);
  const G = transformComponent(g);
  const B = transformComponent(b);
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

/**
 * Calcula el ratio de contraste entre dos colores (e.g. 3:1, 4.5:1).
 */
export function getContrastRatio(color1: string, color2: string): number {
  const l1 = getLuminance(color1);
  const l2 = getLuminance(color2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Verifica si el ratio de contraste cumple con los criterios mínimos de WCAG (3:1 para componentes gráficos).
 */
export function checkContrast(bgColor: string, fgColor: string, minRatio: number = 3.0): {
  ratio: number;
  passes: boolean;
} {
  const ratio = getContrastRatio(bgColor, fgColor);
  return {
    ratio: Number(ratio.toFixed(2)),
    passes: ratio >= minRatio,
  };
}
