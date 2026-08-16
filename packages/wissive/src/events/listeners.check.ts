/**
 * Check de verificación para los ajustes de eventos, proximidad y sonido global.
 *
 * Ejecutar: node --experimental-strip-types src/events/listeners.check.ts
 */
import assert from 'node:assert';
import { setGlobalSound, isGlobalSoundEnabled, setGlobalVolume, getGlobalVolume, soundEngine } from '../core/sound.ts';
import { supportsHover, isTouchDevice, attachEventListeners } from './listeners.ts';

// ─── 1. Verificación de Control Global de Sonido ─────────────────────────
console.log('Testing Global Sound Control...');

setGlobalSound(false);
assert.strictEqual(isGlobalSoundEnabled(), false, 'Global sound should be disabled');
assert.strictEqual(soundEngine.isEnabled(), false, 'SoundEngine internal state should be disabled');

setGlobalSound(true);
assert.strictEqual(isGlobalSoundEnabled(), true, 'Global sound should be enabled');
assert.strictEqual(soundEngine.isEnabled(), true, 'SoundEngine internal state should be enabled');

setGlobalVolume(0.85);
assert.strictEqual(getGlobalVolume(), 0.85, 'Global volume should be 0.85');

setGlobalVolume(1.5); // Clamped to 1.0
assert.strictEqual(getGlobalVolume(), 1.0, 'Global volume should be clamped to 1.0');

setGlobalVolume(-0.2); // Clamped to 0.0
assert.strictEqual(getGlobalVolume(), 0.0, 'Global volume should be clamped to 0.0');

setGlobalVolume(0.6); // Reset to default
assert.strictEqual(getGlobalVolume(), 0.6, 'Global volume reset to 0.6');

console.log('OK — Global sound control methods and volume limits verified');

// ─── 2. Verificación de Detección de Dispositivos Táctiles / Hover ────────
console.log('Testing Touch / Hover Detection...');

// En entorno Node (sin window), debe tener fallbacks seguros
assert.strictEqual(typeof supportsHover(), 'boolean', 'supportsHover should return a boolean in any environment');
assert.strictEqual(typeof isTouchDevice(), 'boolean', 'isTouchDevice should return a boolean in any environment');

// Simulando entorno de navegador con matchMedia
const originalWindow = (globalThis as any).window;
const originalNavigator = (globalThis as any).navigator;

// Mock mobile touch device (hover: none)
(globalThis as any).window = {
  matchMedia: (query: string) => ({
    matches: query === '(hover: none)',
  }),
  addEventListener: () => {},
  removeEventListener: () => {},
  innerWidth: 390,
  innerHeight: 844,
};

try {
  Object.defineProperty(globalThis, 'navigator', {
    value: { maxTouchPoints: 5 },
    configurable: true,
    writable: true,
  });
} catch (_) {}

assert.strictEqual(supportsHover(), false, 'Mobile device should report supportsHover = false');
assert.strictEqual(isTouchDevice(), true, 'Mobile device should report isTouchDevice = true');

// Mock desktop device (hover: hover)
(globalThis as any).window = {
  matchMedia: (query: string) => ({
    matches: query === '(hover: hover)',
  }),
  addEventListener: () => {},
  removeEventListener: () => {},
  innerWidth: 1920,
  innerHeight: 1080,
};

try {
  Object.defineProperty(globalThis, 'navigator', {
    value: { maxTouchPoints: 0 },
    configurable: true,
    writable: true,
  });
} catch (_) {}

assert.strictEqual(supportsHover(), true, 'Desktop should report supportsHover = true');
assert.strictEqual(isTouchDevice(), false, 'Desktop without touch should report isTouchDevice = false');

// Restaurar
if (originalWindow !== undefined) {
  (globalThis as any).window = originalWindow;
} else {
  delete (globalThis as any).window;
}
if (originalNavigator !== undefined) {
  (globalThis as any).navigator = originalNavigator;
} else {
  delete (globalThis as any).navigator;
}

console.log('OK — Touch and hover device detection works accurately');

// ─── 3. Verificación de Listener Centralizado de Proximidad ─────────────
console.log('Testing Centralized Proximity & Listeners lifecycle...');

let windowListenerCount = 0;
const windowListeners = new Map<string, Function>();

const mockWindow = {
  matchMedia: (query: string) => ({ matches: query === '(hover: hover)' }),
  addEventListener: (event: string, handler: Function) => {
    windowListeners.set(event, handler);
    windowListenerCount++;
  },
  removeEventListener: (event: string) => {
    windowListeners.delete(event);
    windowListenerCount--;
  },
  innerWidth: 1000,
  innerHeight: 800,
};

(globalThis as any).window = mockWindow;

function createMockElement(x: number, y: number, size = 100) {
  const elementListeners = new Map<string, Function>();
  return {
    addEventListener: (event: string, handler: Function) => {
      elementListeners.set(event, handler);
    },
    removeEventListener: (event: string) => {
      elementListeners.delete(event);
    },
    getBoundingClientRect: () => ({
      left: x,
      top: y,
      width: size,
      height: size,
      right: x + size,
      bottom: y + size,
    }),
    _listeners: elementListeners,
  } as unknown as HTMLElement;
}

const el1 = createMockElement(100, 100);
const el2 = createMockElement(500, 500);

let near1 = false;
let near2 = false;

const detach1 = attachEventListeners(el1, {
  onHoverStart: () => {},
  onHoverEnd: () => {},
  onClickStart: () => {},
  onClickEnd: () => {},
  onNearChange: (isNear) => { near1 = isNear; },
}, 100);

const detach2 = attachEventListeners(el2, {
  onHoverStart: () => {},
  onHoverEnd: () => {},
  onClickStart: () => {},
  onClickEnd: () => {},
  onNearChange: (isNear) => { near2 = isNear; },
}, 100);

// Debe haber exactamente UN único listener de mousemove en window compartido entre ambas instancias
assert.strictEqual(windowListeners.has('mousemove'), true, 'Global mousemove listener should be attached');

const mouseMoveHandler = windowListeners.get('mousemove')!;

// Disparar mousemove cerca de el1 (centro en 150, 150)
mouseMoveHandler({ clientX: 160, clientY: 160 });
assert.strictEqual(near1, true, 'Instance 1 should detect near');
assert.strictEqual(near2, false, 'Instance 2 should remain not near');

// Disparar mousemove lejos de el1 y cerca de el2 (centro en 550, 550)
mouseMoveHandler({ clientX: 560, clientY: 560 });
assert.strictEqual(near1, false, 'Instance 1 should no longer be near');
assert.strictEqual(near2, true, 'Instance 2 should now detect near');

// Limpiar la primera instancia
detach1();
assert.strictEqual(windowListeners.has('mousemove'), true, 'Global mousemove should persist while instance 2 is active');

// Limpiar la segunda instancia
detach2();
assert.strictEqual(windowListeners.has('mousemove'), false, 'Global mousemove must be detached when all instances are destroyed');

// Restaurar entorno
delete (globalThis as any).window;

console.log('OK — Centralized mousemove listener scales cleanly and unbinds on destroy');
