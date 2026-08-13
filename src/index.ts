import { InteractionState, EmojiDefinition, FaceParameters } from './emojis/types';
import { getEmojiDefinition } from './emojis/catalog';
import { createMultiSpring, MultiSpring } from './core/spring';
import { StateManager } from './core/state';
import { sharedLoop } from './core/raf';
import { buildFace } from './render/svg';
import { attachEventListeners } from './events/listeners';
import { soundEngine } from './core/sound';
import { ParticleEmitter } from './render/particles';
import { DragPhysics, DragPhysicsState } from './core/drag';

export interface WissiveOptions {
  target: HTMLElement;
  size?: number;
  sound?: boolean;
  interactive?: boolean;
  draggable?: boolean;
  nearRadius?: number;
  flipX?: boolean;
  emphasis?: boolean;
  gazeTracking?: boolean;
}

export interface WissiveInstance {
  setEmotion: (state: InteractionState) => void;
  spin: (turns?: number) => void;
  bounce: () => void;
  setGaze: (gaze: { x: number; y: number }) => void;
  setGazeTracking: (enabled: boolean) => void;
  setSound: (enabled: boolean) => void;
  setDraggable: (enabled: boolean) => void;
  setFlipX: (flip: boolean) => void;
  setEmphasis: (emphasis: boolean) => void;
  destroy: () => void;
}

export function createEmoji(
  name: string,
  options: WissiveOptions
): WissiveInstance {
  const {
    target,
    size = 120,
    interactive = true,
    draggable: initialDraggable = true,
    nearRadius = 120,
    sound: initialSound = true,
    flipX: initialFlipX = false,
    emphasis: initialEmphasis = false,
    gazeTracking: initialGazeTracking = false,
  } = options;

  const definition: EmojiDefinition = getEmojiDefinition(name) || getEmojiDefinition('mochi')!;
  const motion = definition.motion;

  // Wrapper — absorbs drag translation so the grid layout stays stable
  const wrapper = document.createElement('div');
  wrapper.className = 'wissive-wrapper';
  wrapper.style.width = `${size}px`;
  wrapper.style.height = `${size}px`;
  wrapper.style.display = 'inline-block';
  wrapper.style.position = 'relative';

  const container = document.createElement('div');
  container.className = 'wissive-emoji';
  container.setAttribute('role', 'img');
  container.setAttribute('aria-label', `${definition.name} (${definition.emotion}) emoji`);
  container.style.width = `${size}px`;
  container.style.height = `${size}px`;
  container.style.display = 'inline-block';
  container.style.userSelect = 'none';
  container.style.cursor = interactive ? 'pointer' : 'default';
  container.style.willChange = 'transform';
  container.style.transformOrigin = 'center center';

  wrapper.appendChild(container);
  target.appendChild(wrapper);

  let isFlipX = initialFlipX;
  let isEmphasis = initialEmphasis;
  let isGazeTracking = initialGazeTracking;
  let isSoundEnabled = initialSound;
  let isDraggable = initialDraggable;

  const stateManager = new StateManager();
  const initialPool = definition.expressions.idle;
  const initialParams = stateManager.pickVariant(initialPool, 'idle');

  const springs: MultiSpring<FaceParameters> = createMultiSpring<FaceParameters>(initialParams, {
    stiffness: motion.stiffness,
    damping: motion.damping,
  });

  let isNearActive = false;
  let isHoverActive = false;
  let isClickActive = false;

  let idleTime = Math.random() * 100;
  let isBlinking = false;
  let blinkTimer: number | null = null;
  let nextBlinkTimeout: number | null = null;

  // ─── Particle System ───────────────────────────────────────────────
  // Attached to wrapper (not container) because container.innerHTML is replaced every frame
  const particles = new ParticleEmitter(wrapper, size);

  // ─── Drag Physics State ────────────────────────────────────────────
  let dragState: DragPhysicsState = {
    offsetX: 0,
    offsetY: 0,
    scaleX: 1,
    scaleY: 1,
    rotation: 0,
    isDragging: false,
  };

  let dragPhysics: DragPhysics | null = null;

  const initDrag = () => {
    if (dragPhysics) return;
    dragPhysics = new DragPhysics(
      container,
      (state) => {
        dragState = state;
        applyTransform();
      },
      {
        onDragStart: () => {
          // Emit particles trail while dragging
          if (isSoundEnabled) soundEngine.playSound(definition.emotion, 'click');
        },
        onDragEnd: () => {
          // Burst particles on release (toss)
          particles.burst(definition.emotion, 10);
          if (isSoundEnabled) soundEngine.playSound(definition.emotion, 'bounce');
        },
      }
    );
  };

  if (isDraggable && interactive) {
    initDrag();
  }

  // ─── Unified Transform ─────────────────────────────────────────────
  // Combines: breathing + drag offset + drag elastic deformation
  const applyTransform = () => {
    // Breathing base (overridden by drag deformation when dragging/bouncing)
    const breathSpeed = motion.idleSpeed * 0.35;
    const breathAmp = 0.04;
    const breathScX = 1 + breathAmp * Math.cos(idleTime * breathSpeed);
    const breathScY = 1 - breathAmp * Math.sin(idleTime * breathSpeed);

    // Combine: drag deformation takes priority when active
    const hasDragMotion = dragState.offsetX !== 0 || dragState.offsetY !== 0
      || dragState.scaleX !== 1 || dragState.scaleY !== 1;

    let finalScX: number, finalScY: number, finalRot: number;

    if (hasDragMotion) {
      // Multiply breathing with drag deformation
      finalScX = breathScX * dragState.scaleX;
      finalScY = breathScY * dragState.scaleY;
      finalRot = dragState.rotation;
    } else {
      finalScX = breathScX;
      finalScY = breathScY;
      finalRot = 0;
    }

    const tx = dragState.offsetX;
    const ty = dragState.offsetY;

    container.style.transform =
      `translate(${tx.toFixed(1)}px, ${ty.toFixed(1)}px) ` +
      `rotate(${(finalRot * 180 / Math.PI).toFixed(2)}deg) ` +
      `scale(${finalScX.toFixed(4)}, ${finalScY.toFixed(4)})`;
  };

  // ─── Render ────────────────────────────────────────────────────────
  const render = () => {
    const currentParams = springs.getValues();

    if (isBlinking) {
      currentParams.eyeOpen = 0.05;
    }

    if (stateManager.getState() === 'idle') {
      const speed = motion.idleSpeed;
      const amp = motion.idleAmplitude;

      switch (motion.motionType) {
        case 'bouncy':
          currentParams.bob += Math.abs(Math.sin(idleTime * speed)) * amp - amp * 0.5;
          break;
        case 'flutter':
          currentParams.shiftX += Math.sin(idleTime * speed) * amp;
          currentParams.bob += Math.cos(idleTime * (speed * 0.7)) * (amp * 0.5);
          break;
        case 'float':
          currentParams.bob += Math.sin(idleTime * speed) * amp;
          currentParams.shiftX += Math.cos(idleTime * (speed * 0.6)) * (amp * 0.8);
          break;
        case 'jitter':
          currentParams.shiftX += (Math.random() - 0.5) * amp;
          currentParams.bob += (Math.random() - 0.5) * amp;
          break;
        case 'fiery':
          currentParams.bob += Math.sin(idleTime * speed) * amp;
          break;
        case 'dizzy':
          currentParams.shiftX += Math.sin(idleTime * speed) * amp;
          currentParams.bob += Math.cos(idleTime * speed) * (amp * 0.7);
          break;
        case 'droop':
          currentParams.bob += (Math.sin(idleTime * speed) + 0.5) * amp;
          break;
        case 'pop':
          currentParams.bob += -Math.abs(Math.sin(idleTime * speed)) * amp;
          break;
        case 'serene':
        case 'calm':
        default:
          currentParams.bob += Math.sin(idleTime * speed) * amp;
          break;
      }
    }

    // Apply unified transform (breathing + drag)
    applyTransform();

    container.innerHTML = buildFace(
      definition.silhouette,
      definition.baseColor,
      currentParams,
      size,
      { flipX: isFlipX, emphasis: isEmphasis }
    );
  };

  // ─── Expression Transitions ────────────────────────────────────────
  const transitionToVariant = (newState: InteractionState = stateManager.getState()) => {
    stateManager.setState(newState);
    const pool = stateManager.resolvePool(definition.expressions, newState);
    if (!pool || pool.length === 0) return;

    if (pool.length === 1) {
      const targetParams = stateManager.pickVariant(pool, newState);
      springs.setTargets(targetParams);
      sharedLoop.add(tick);
      return;
    }

    isBlinking = true;
    sharedLoop.add(tick);

    setTimeout(() => {
      const targetParams = stateManager.pickVariant(pool, newState);
      springs.setTargets(targetParams);
      sharedLoop.add(tick);

      setTimeout(() => {
        isBlinking = false;
        sharedLoop.add(tick);
      }, 120);
    }, 100);
  };

  const updateState = (newState: InteractionState) => {
    transitionToVariant(newState);
  };

  // ─── Main Animation Loop ──────────────────────────────────────────
  const tick = (dt: number) => {
    idleTime += dt;
    const isMoving = springs.update(dt);
    render();

    if (!isMoving && stateManager.getState() !== 'idle') {
      sharedLoop.remove(tick);
    }
  };

  sharedLoop.add(tick);

  // ─── Blink ─────────────────────────────────────────────────────────
  const scheduleNextBlink = () => {
    const minDelay = 3000;
    const maxDelay = 7000;
    const delay = minDelay + Math.random() * (maxDelay - minDelay);

    nextBlinkTimeout = window.setTimeout(() => {
      if (stateManager.getState() === 'idle' && !isBlinking) {
        isBlinking = true;
        sharedLoop.add(tick);

        blinkTimer = window.setTimeout(() => {
          isBlinking = false;
          sharedLoop.add(tick);
        }, 180);
      }
      scheduleNextBlink();
    }, delay);
  };

  scheduleNextBlink();

  // ─── Idle Variant Cycling ──────────────────────────────────────────
  let idleTimeoutId: number | null = null;

  const scheduleNextIdleVariant = () => {
    const min = motion.idleIntervalMin;
    const max = motion.idleIntervalMax;
    const delay = min + Math.random() * (max - min);

    idleTimeoutId = window.setTimeout(() => {
      if (stateManager.getState() === 'idle') {
        transitionToVariant('idle');
      }
      scheduleNextIdleVariant();
    }, delay);
  };

  scheduleNextIdleVariant();

  // ─── Autonomous Glance ─────────────────────────────────────────────
  let glanceTimeoutId: number | null = null;
  let glanceResetTimeoutId: number | null = null;

  const scheduleNextGlance = () => {
    const minDelay = 3500;
    const maxDelay = 8000;
    const delay = minDelay + Math.random() * (maxDelay - minDelay);

    glanceTimeoutId = window.setTimeout(() => {
      if (stateManager.getState() === 'idle' && !isGazeTracking) {
        const directions = [
          { x: -9, y: 0 },
          { x: 9, y: 0 },
          { x: -7, y: -4 },
          { x: 7, y: -4 },
          { x: 0, y: -5 },
          { x: 0, y: 4 },
        ];
        const choice = directions[Math.floor(Math.random() * directions.length)];
        springs.setTargets({ gazeX: choice.x, gazeY: choice.y });
        sharedLoop.add(tick);

        const holdTime = 1200 + Math.random() * 1500;
        glanceResetTimeoutId = window.setTimeout(() => {
          if (!isGazeTracking) {
            springs.setTargets({ gazeX: 0, gazeY: 0 });
            sharedLoop.add(tick);
          }
        }, holdTime);
      }
      scheduleNextGlance();
    }, delay);
  };

  scheduleNextGlance();

  // ─── Timer Cleanup ─────────────────────────────────────────────────
  const stopTimers = () => {
    if (idleTimeoutId !== null) {
      clearTimeout(idleTimeoutId);
      idleTimeoutId = null;
    }
    if (nextBlinkTimeout !== null) {
      clearTimeout(nextBlinkTimeout);
      nextBlinkTimeout = null;
    }
    if (blinkTimer !== null) {
      clearTimeout(blinkTimer);
      blinkTimer = null;
    }
    if (glanceTimeoutId !== null) {
      clearTimeout(glanceTimeoutId);
      glanceTimeoutId = null;
    }
    if (glanceResetTimeoutId !== null) {
      clearTimeout(glanceResetTimeoutId);
      glanceResetTimeoutId = null;
    }
  };

  // ─── Event Listeners ───────────────────────────────────────────────
  let detachListeners: (() => void) | null = null;

  const determineCurrentState = (): InteractionState => {
    if (isClickActive) return 'click';
    if (isHoverActive) return 'hover';
    if (isNearActive) return 'near';
    return 'idle';
  };

  if (interactive) {
    detachListeners = attachEventListeners(
      container,
      {
        onHoverStart: () => {
          isHoverActive = true;
          if (isSoundEnabled) soundEngine.playSound(definition.emotion, 'hover');
          updateState(determineCurrentState());
        },
        onHoverEnd: () => {
          isHoverActive = false;
          updateState(determineCurrentState());
        },
        onClickStart: () => {
          isClickActive = true;
          if (isSoundEnabled) soundEngine.playSound(definition.emotion, 'click');
          particles.burst(definition.emotion, 8);
          updateState(determineCurrentState());
        },
        onClickEnd: () => {
          isClickActive = false;
          updateState(determineCurrentState());
        },
        onNearChange: (near) => {
          isNearActive = near;
          updateState(determineCurrentState());
        },
        onGazeMove: (gazeX, gazeY) => {
          if (isGazeTracking) {
            springs.setTargets({ gazeX, gazeY });
            sharedLoop.add(tick);
          }
        },
      },
      nearRadius
    );
  }

  // ─── Public API ────────────────────────────────────────────────────
  return {
    setEmotion(state: InteractionState) {
      updateState(state);
    },
    spin(turns = 1) {
      const current = springs.getValues().turnAngle || 0;
      springs.setTargets({ turnAngle: current + Math.PI * 2 * turns });
      sharedLoop.add(tick);
    },
    bounce() {
      if (isSoundEnabled) soundEngine.playSound(definition.emotion, 'bounce');
      const current = springs.getValues().bob || 0;
      springs.setTargets({ bob: current - 14 });
      sharedLoop.add(tick);
    },
    setGaze(gaze: { x: number; y: number }) {
      springs.setTargets({ gazeX: gaze.x, gazeY: gaze.y });
      sharedLoop.add(tick);
    },
    setGazeTracking(enabled: boolean) {
      isGazeTracking = enabled;
      if (!enabled) {
        springs.setTargets({ gazeX: 0, gazeY: 0 });
        sharedLoop.add(tick);
      }
    },
    setSound(enabled: boolean) {
      isSoundEnabled = enabled;
    },
    setDraggable(enabled: boolean) {
      isDraggable = enabled;
      if (enabled && !dragPhysics && interactive) {
        initDrag();
      } else if (!enabled && dragPhysics) {
        dragPhysics.destroy();
        dragPhysics = null;
        dragState = { offsetX: 0, offsetY: 0, scaleX: 1, scaleY: 1, rotation: 0, isDragging: false };
        applyTransform();
      }
    },
    setFlipX(flip: boolean) {
      isFlipX = flip;
      render();
    },
    setEmphasis(emphasis: boolean) {
      isEmphasis = emphasis;
      render();
    },
    destroy() {
      stopTimers();
      sharedLoop.remove(tick);
      particles.destroy();
      if (dragPhysics) dragPhysics.destroy();
      if (detachListeners) {
        detachListeners();
      }
      wrapper.remove();
    },
  };
}

export * from './emojis/types';
export * from './core/spring';
export * from './core/state';
export * from './core/raf';
export * from './render/svg';
export * from './core/sound';
export * from './core/drag';
export * from './render/particles';
export * from './emojis/catalog';
