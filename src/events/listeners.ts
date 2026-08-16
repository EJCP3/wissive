export interface EventCallbacks {
  onHoverStart: () => void;
  onHoverEnd: () => void;
  onClickStart: () => void;
  onClickEnd: () => void;
  onNearChange: (isNear: boolean) => void;
  onGazeMove?: (gazeX: number, gazeY: number) => void;
}

export function attachEventListeners(
  element: HTMLElement,
  callbacks: EventCallbacks,
  nearRadius: number = 120
): () => void {
  let isHovered = false;
  let isClicked = false;
  let isNear = false;

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

  const handleTouchStart = (e: TouchEvent) => {
    e.preventDefault();
    isClicked = true;
    callbacks.onClickStart();
  };

  const handleTouchEnd = () => {
    if (!isClicked) return;
    isClicked = false;
    callbacks.onClickEnd();
  };

  // Keyboard & Focus accessibility
  let isFocused = false;
  let isKeyDown = false;

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

  element.addEventListener('touchstart', handleTouchStart, { passive: false });
  window.addEventListener('touchend', handleTouchEnd);

  const handleGlobalMouseMove = (e: MouseEvent) => {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const distance = Math.hypot(e.clientX - centerX, e.clientY - centerY);

    // Gaze tracking opcional
    if (callbacks.onGazeMove) {
      const normX = Math.max(-0.6, Math.min(0.6, (e.clientX - centerX) / (window.innerWidth / 2)));
      const normY = Math.max(-0.6, Math.min(0.6, (e.clientY - centerY) / (window.innerHeight / 2)));
      callbacks.onGazeMove(22 * normX, 14 * normY);
    }

    if (isHovered || isClicked || isFocused) return;

    const nowNear = distance <= nearRadius;
    if (nowNear !== isNear) {
      isNear = nowNear;
      callbacks.onNearChange(isNear);
    }
  };

  window.addEventListener('mousemove', handleGlobalMouseMove);

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
    window.removeEventListener('mousemove', handleGlobalMouseMove);
  };
}

