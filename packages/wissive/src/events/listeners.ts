export interface EventCallbacks {
  onHoverStart: () => void;
  onHoverEnd: () => void;
  onClickStart: () => void;
  onClickEnd: () => void;
  onNearChange: (isNear: boolean) => void;
  onGazeMove?: (gazeX: number, gazeY: number) => void;
}

/**
 * Detecta si el dispositivo actual soporta hover real (puntero fino como mouse o trackpad).
 * Devuelve false en dispositivos táctiles primarios (smartphones, tablets sin mouse).
 */
export function supportsHover(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return true;
  return window.matchMedia('(hover: hover)').matches;
}

/**
 * Detecta si el entorno es primariamente táctil (pantallas táctiles sin hover).
 */
export function isTouchDevice(): boolean {
  if (typeof window === 'undefined') return false;
  return (
    (typeof window.matchMedia === 'function' && window.matchMedia('(hover: none)').matches) ||
    'ontouchstart' in window ||
    (typeof navigator !== 'undefined' && navigator.maxTouchPoints > 0)
  );
}

// ─── Proximity & Gaze Centralized Manager ─────────────────────────────
// Un solo listener de 'mousemove' en window compartido por todas las instancias
// de la página, en lugar de N listeners individuales.
interface ProximitySubscriber {
  element: HTMLElement;
  nearRadius: number;
  isNear: boolean;
  isActive: () => boolean;
  onNearChange: (isNear: boolean) => void;
  onGazeMove?: (gazeX: number, gazeY: number) => void;
}

const proximitySubscribers = new Set<ProximitySubscriber>();
let isGlobalMouseMoveAttached = false;

function handleGlobalMouseMove(e: MouseEvent) {
  const clientX = e.clientX;
  const clientY = e.clientY;
  const halfWinW = (typeof window !== 'undefined' ? window.innerWidth : 1000) / 2 || 1;
  const halfWinH = (typeof window !== 'undefined' ? window.innerHeight : 1000) / 2 || 1;

  for (const sub of proximitySubscribers) {
    const rect = sub.element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Gaze tracking opcional
    if (sub.onGazeMove) {
      const normX = Math.max(-0.6, Math.min(0.6, (clientX - centerX) / halfWinW));
      const normY = Math.max(-0.6, Math.min(0.6, (clientY - centerY) / halfWinH));
      sub.onGazeMove(22 * normX, 14 * normY);
    }

    // Si ya está en hover, click o foco, ignoramos el cálculo de proximidad
    if (sub.isActive()) {
      continue;
    }

    const distance = Math.hypot(clientX - centerX, clientY - centerY);
    const nowNear = distance <= sub.nearRadius;
    if (nowNear !== sub.isNear) {
      sub.isNear = nowNear;
      sub.onNearChange(nowNear);
    }
  }
}

function registerProximitySubscriber(sub: ProximitySubscriber) {
  proximitySubscribers.add(sub);
  if (!isGlobalMouseMoveAttached && typeof window !== 'undefined') {
    window.addEventListener('mousemove', handleGlobalMouseMove, { passive: true });
    isGlobalMouseMoveAttached = true;
  }
}

function unregisterProximitySubscriber(sub: ProximitySubscriber) {
  proximitySubscribers.delete(sub);
  if (proximitySubscribers.size === 0 && isGlobalMouseMoveAttached && typeof window !== 'undefined') {
    window.removeEventListener('mousemove', handleGlobalMouseMove);
    isGlobalMouseMoveAttached = false;
  }
}

export function attachEventListeners(
  element: HTMLElement,
  callbacks: EventCallbacks,
  nearRadius: number = 120
): () => void {
  if (typeof window === 'undefined') {
    return () => {};
  }

  let isHovered = false;
  let isClicked = false;
  let isFocused = false;
  let isKeyDown = false;

  const handleMouseEnter = () => {
    isHovered = true;
    callbacks.onHoverStart();
  };

  const handleMouseLeave = () => {
    isHovered = false;
    isClicked = false;
    callbacks.onHoverEnd();
  };

  const handleMouseDown = (e: MouseEvent) => {
    if (e.button !== 0) return;
    isClicked = true;
    callbacks.onClickStart();
  };

  const handleMouseUp = () => {
    if (!isClicked) return;
    isClicked = false;
    callbacks.onClickEnd();
  };

  // ─── Touch Support ──────────────────────────────────────────────────
  const handleTouchStart = () => {
    isClicked = true;
    callbacks.onClickStart();
  };

  const handleTouchEnd = () => {
    if (!isClicked) return;
    isClicked = false;
    callbacks.onClickEnd();
  };

  const handleTouchCancel = () => {
    if (!isClicked) return;
    isClicked = false;
    callbacks.onClickEnd();
  };

  // ─── Keyboard & Focus accessibility ─────────────────────────────────
  const handleFocus = () => {
    isFocused = true;
    callbacks.onHoverStart();
  };

  const handleBlur = () => {
    isFocused = false;
    if (isKeyDown) {
      isKeyDown = false;
      isClicked = false;
      callbacks.onClickEnd();
    }
    callbacks.onHoverEnd();
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault(); // Evitar scroll de la página con la tecla Espacio
      if (!isKeyDown) {
        isKeyDown = true;
        isClicked = true;
        callbacks.onClickStart();
      }
    }
  };

  const handleKeyUp = (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (isKeyDown) {
        isKeyDown = false;
        isClicked = false;
        callbacks.onClickEnd();
      }
    }
  };

  element.addEventListener('mouseenter', handleMouseEnter);
  element.addEventListener('mouseleave', handleMouseLeave);
  element.addEventListener('mousedown', handleMouseDown);
  window.addEventListener('mouseup', handleMouseUp);

  element.addEventListener('focus', handleFocus);
  element.addEventListener('blur', handleBlur);
  element.addEventListener('keydown', handleKeyDown);
  element.addEventListener('keyup', handleKeyUp);

  element.addEventListener('touchstart', handleTouchStart, { passive: true });
  window.addEventListener('touchend', handleTouchEnd, { passive: true });
  window.addEventListener('touchcancel', handleTouchCancel, { passive: true });

  // ─── Proximity Subscriber Registration ─────────────────────────────
  // En dispositivos puramente táctiles (hover: none), omitimos el cálculo de proximidad
  // continuo para ahorrar batería y CPU, salvo que se active gazeTracking explícito.
  const proximitySubscriber: ProximitySubscriber = {
    element,
    nearRadius,
    isNear: false,
    isActive: () => isHovered || isClicked || isFocused,
    onNearChange: callbacks.onNearChange,
    onGazeMove: callbacks.onGazeMove,
  };

  if (supportsHover() || callbacks.onGazeMove) {
    registerProximitySubscriber(proximitySubscriber);
  }

  return () => {
    element.removeEventListener('mouseenter', handleMouseEnter);
    element.removeEventListener('mouseleave', handleMouseLeave);
    element.removeEventListener('mousedown', handleMouseDown);
    window.removeEventListener('mouseup', handleMouseUp);

    element.removeEventListener('focus', handleFocus);
    element.removeEventListener('blur', handleBlur);
    element.removeEventListener('keydown', handleKeyDown);
    element.removeEventListener('keyup', handleKeyUp);

    element.removeEventListener('touchstart', handleTouchStart);
    window.removeEventListener('touchend', handleTouchEnd);
    window.removeEventListener('touchcancel', handleTouchCancel);

    unregisterProximitySubscriber(proximitySubscriber);
  };
}


