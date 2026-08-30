import { InteractionState, EmojiDefinition, FaceParameters, SilhouetteType } from './emojis/types';
import { getEmojiDefinition } from './emojis/catalog';
import { createMultiSpring, MultiSpring, TransitionProfile, SpringConfig } from './core/spring';
import { StateManager } from './core/state';
import { sharedLoop } from './core/raf';
import { buildFace } from './render/svg';
import { getSilhouetteProfile, blendProfiles } from './render/silhouette';
import { attachEventListeners, supportsHover, isTouchDevice } from './events/listeners';
import {
  soundEngine,
  setGlobalSound,
  isGlobalSoundEnabled,
  setGlobalVolume,
  getGlobalVolume,
} from './core/sound';
import { ParticleEmitter } from './render/particles';
import { DragPhysics, DragPhysicsState } from './core/drag';
import { isReducedMotionPreferred, subscribeToReducedMotion } from './core/a11y';
import { blendColors, ThemeOption } from './core/theme';
import { applyIdleMotion, applyStateMotion } from './core/motion';
import { createSequencePlayer, SequenceStep, SequenceOptions } from './core/sequence';
import { resolveAutonomousStatePool, pickWithoutRepeat } from './emojis/states';
import { createEmojiGroup } from './core/group';

/** Cuánta animación de personalidad conserva cada estado de interacción */
const INTERACTION_MOTION_INTENSITY: Record<string, number> = {
  idle: 1,
  near: 0.7,
  hover: 0.5,
  click: 0.35,
};


export type WissivePresetSize = 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl';
export type WissiveSize = WissivePresetSize | number;

export const SIZE_PRESETS: Record<WissivePresetSize, number> = {
  xs: 48,
  sm: 80,
  base: 120,
  lg: 160,
  xl: 200,
  '2xl': 240,
};

export function resolveSize(size: WissiveSize = 'base'): number {
  if (typeof size === 'number') return size;
  return SIZE_PRESETS[size] ?? 120;
}

export interface WissiveOptions {
  target: HTMLElement;
  size?: WissiveSize;
  sound?: boolean;
  interactive?: boolean;
  draggable?: boolean;
  nearRadius?: number;
  flipX?: boolean;
  emphasis?: boolean;
  gazeTracking?: boolean;
  ambientParticles?: boolean;
  /** Visita reacciones al azar cuando está en reposo, para que se sienta vivo (default: true) */
  autonomousStates?: boolean;
  /** Qué estados puede visitar al deambular (default: `definition.autonomousStatePool` o AUTONOMOUS_STATES) */
  autonomousStatePool?: InteractionState[];
  reducedMotion?: 'auto' | boolean;
  theme?: ThemeOption;
}

export interface WissiveInstance {
  id: string;
  name: string;
  emotionCategory: string;
  getElement: () => HTMLElement;
  getPosition: () => { x: number; y: number };
  getCurrentState: () => InteractionState;
  setEmotion: (state: InteractionState) => void;
  spin: (turns?: number) => void;
  bounce: () => void;
  setGaze: (gaze: { x: number; y: number }) => void;
  setGazeTracking: (enabled: boolean) => void;
  setSound: (enabled: boolean) => void;
  setDraggable: (enabled: boolean) => void;
  setFlipX: (flip: boolean) => void;
  setEmphasis: (emphasis: boolean) => void;
  setAmbientParticles: (enabled: boolean) => void;
  setAutonomousStates: (enabled: boolean) => void;
  setAutonomousStatePool: (pool: InteractionState[]) => void;
  setReducedMotion: (setting: 'auto' | boolean) => void;
  setTheme: (theme: ThemeOption) => void;
  setSize: (size: WissiveSize) => void;
  setSilhouette: (silhouette: SilhouetteType, duration?: number) => void;
  setSpringConfig: (config: Partial<SpringConfig> | TransitionProfile) => void;
  triggerParticles: (count?: number) => void;
  playSequence: (steps: SequenceStep[], options?: SequenceOptions) => void;
  stopSequence: () => void;
  isSequencePlaying: () => boolean;
  destroy: () => void;
}



export function createEmoji(
  name: string,
  options: WissiveOptions
): WissiveInstance {
  const {
    target,
    size = 'base',
    interactive = true,
    draggable: initialDraggable = true,
    nearRadius = 120,
    sound: initialSound = true,
    flipX: initialFlipX = false,
    emphasis: initialEmphasis = false,
    gazeTracking: initialGazeTracking = false,
    ambientParticles: initialAmbientParticles = true,
    autonomousStates: initialAutonomousStates = true,
    autonomousStatePool: initialAutonomousStatePool,
    reducedMotion: initialReducedMotion = 'auto',
    theme: initialTheme = 'auto',
  } = options;

  const definition: EmojiDefinition = getEmojiDefinition(name) || getEmojiDefinition('mochi')!;
  const motion = definition.motion;

  let currentSize = resolveSize(size);
  let userReducedMotionSetting: 'auto' | boolean = initialReducedMotion;
  let userThemeSetting: ThemeOption = initialTheme;
  let currentColor = definition.baseColor;
  const particleEmotion = definition.particleEmotion || definition.emotion;
  const soundEmotion = definition.soundEmotion || definition.emotion;

  const isReducedMotionActive = (): boolean => {
    if (typeof userReducedMotionSetting === 'boolean') return userReducedMotionSetting;
    return isReducedMotionPreferred();
  };




  // Wrapper — absorbs drag translation so the grid layout stays stable
  const wrapper = document.createElement('div');
  wrapper.className = 'wissive-wrapper';
  wrapper.style.width = `${currentSize}px`;
  wrapper.style.height = `${currentSize}px`;
  wrapper.style.display = 'inline-block';
  wrapper.style.position = 'relative';

  const container = document.createElement('div');
  container.className = 'wissive-emoji';
  container.setAttribute('role', 'img');
  if (interactive) {
    container.setAttribute('tabindex', '0');
  }
  
  const stateLabels: Partial<Record<InteractionState, string>> = {
    idle: 'Reposo',
    near: 'Cerca',
    hover: 'Hover',
    click: 'Presionado',
  };


  const updateAriaLabel = (st: InteractionState) => {
    container.setAttribute(
      'aria-label',
      `${definition.name} (${definition.emotion}) emoji - Estado: ${stateLabels[st] || st}`
    );
  };

  updateAriaLabel('idle');

  container.style.width = `${currentSize}px`;
  container.style.height = `${currentSize}px`;
  container.style.display = 'inline-block';
  container.style.userSelect = 'none';
  container.style.cursor = interactive ? 'pointer' : 'default';
  container.style.willChange = 'transform';
  container.style.transformOrigin = 'center center';

  wrapper.appendChild(container);
  target.appendChild(wrapper);

  const unsubscribeReducedMotion = subscribeToReducedMotion(() => {
    render();
  });

  let isFlipX = initialFlipX;
  let isEmphasis = initialEmphasis;
  let isGazeTracking = initialGazeTracking;
  let isSoundEnabled = initialSound;
  let isDraggable = initialDraggable;
  let isAmbientParticlesEnabled = initialAmbientParticles;
  let isAutonomousStatesEnabled = initialAutonomousStates;
  let autonomousStatePool: InteractionState[] = resolveAutonomousStatePool(
    initialAutonomousStatePool,
    definition.autonomousStatePool
  );

  const stateManager = new StateManager();
  const initialPool = definition.expressions.idle;
  const initialParams = stateManager.pickVariant(initialPool, 'idle');

  const springs: MultiSpring<FaceParameters> = createMultiSpring<FaceParameters>(initialParams, {
    stiffness: motion.stiffness,
    damping: motion.damping,
  });

  // ─── Silhouette Radial Morphing State (Catmull-Rom continuous morph) ──
  let currentSilhouette: SilhouetteType = definition.silhouette;
  let currentRadii: number[] = [...getSilhouetteProfile(currentSilhouette)];
  let targetRadii: number[] = [...currentRadii];
  let morphFromRadii: number[] = [...currentRadii];
  let morphStartTime = 0;
  let morphDuration = 400;
  let isMorphing = false;

  let isNearActive = false;
  let isHoverActive = false;
  let isClickActive = false;

  let idleTime = Math.random() * 100;
  let isBlinking = false;
  let blinkTimer: number | null = null;
  let nextBlinkTimeout: number | null = null;

  // ─── Particle System ───────────────────────────────────────────────
  // Attached to wrapper (not container) because container.innerHTML is replaced every frame
  const particles = new ParticleEmitter(wrapper, currentSize);


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
          if (isSoundEnabled) soundEngine.playSound(soundEmotion, 'click');
        },
        onDragEnd: () => {
          // Burst particles on release (toss)
          particles.burst(particleEmotion, 10);
          if (isSoundEnabled) soundEngine.playSound(soundEmotion, 'bounce');
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
    // Breathing base (overridden by drag deformation when dragging/bouncing or disabled if reduced motion)
    const isReduced = isReducedMotionActive();
    const breathSpeed = isReduced ? 0 : motion.idleSpeed * 0.35;
    const breathAmp = isReduced ? 0 : 0.04;
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
    const currentState = stateManager.getState();

    // Transición suave de color de tema (en 'auto' se conserva el color original predeterminado)
    let targetThemeColor = definition.baseColor;
    if (typeof userThemeSetting === 'object' && userThemeSetting.baseColor) {
      targetThemeColor = userThemeSetting.baseColor;
    }

    currentColor = blendColors(currentColor, targetThemeColor, 0.15);


    if (isBlinking) {
      currentParams.eyeOpen = 0.05;
    }

    // Cada estado tiene firma propia; si no la tiene (idle/near/hover/click),
    // manda la animación de personalidad del emoji, atenuada según el estado.
    if (!isReducedMotionActive()) {
      const hasStateMotion = applyStateMotion(
        currentState as string,
        currentParams,
        idleTime,
        motion.idleSpeed,
        motion.idleAmplitude
      );

      if (!hasStateMotion) {
        const intensity = INTERACTION_MOTION_INTENSITY[currentState as string] ?? 1;
        applyIdleMotion(
          motion.motionType,
          currentParams,
          idleTime,
          motion.idleSpeed,
          motion.idleAmplitude,
          intensity
        );
      }
    }

    // Apply unified transform (breathing + drag)
    applyTransform();

    container.innerHTML = buildFace(
      definition.silhouette,
      currentColor,
      currentParams,
      currentSize,
      {
        flipX: isFlipX,
        emphasis: isEmphasis,
        radii: currentRadii,
      },
      idleTime
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
    updateAriaLabel(newState);
    transitionToVariant(newState);
  };

  // ─── Expression Timeline ───────────────────────────────────────────
  const sequencePlayer = createSequencePlayer({
    resolveStep(step) {
      // Un paso puede referirse a un estado (reutiliza su pool de expresiones)
      // y/o traer parámetros crudos, que mandan sobre el estado.
      const fromState = step.state
        ? stateManager.pickVariant(
            stateManager.resolvePool(definition.expressions, step.state),
            step.state
          )
        : {};
      return { ...fromState, ...step.params };
    },
    applyStep(params) {
      springs.setTargets(params);
      sharedLoop.add(tick);
    },
  });


  // ─── Main Animation Loop ──────────────────────────────────────────
  const tick = (dt: number) => {
    idleTime += dt;
    const isMoving = springs.update(dt);

    // Actualización de metamorfosis continua durante la transición
    if (isMorphing) {
      const now = typeof performance !== 'undefined' ? performance.now() : Date.now();
      const elapsed = now - morphStartTime;
      const progress = Math.min(1, Math.max(0, elapsed / morphDuration));
      const easeT = 1 - Math.pow(1 - progress, 4);
      currentRadii = blendProfiles(morphFromRadii, targetRadii, easeT);
      if (progress >= 1) {
        isMorphing = false;
        currentRadii = [...targetRadii];
      }
    }

    render();

    if (!isMoving && !isMorphing && stateManager.getState() !== 'idle') {
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
      // Una secuencia en curso manda sobre el ciclado aleatorio de idle
      if (stateManager.getState() === 'idle' && !sequencePlayer.isPlaying()) {
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
      if (stateManager.getState() === 'idle' && !isGazeTracking && !sequencePlayer.isPlaying()) {
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

  // ─── Autonomous Ambient Particles ──────────────────────────────────
  let ambientParticleTimeoutId: number | null = null;

  const scheduleNextAmbientParticle = () => {
    const minDelay = 3500;
    const maxDelay = 8500;
    const delay = minDelay + Math.random() * (maxDelay - minDelay);

    ambientParticleTimeoutId = window.setTimeout(() => {
      if (isAmbientParticlesEnabled && !isReducedMotionActive()) {
        const currentState = stateManager.getState();
        if (currentState === 'idle' || currentState === 'near' || currentState === 'hover') {
          // Emit 2 to 4 ambient particles around the emoji
          const count = Math.floor(2 + Math.random() * 3);
          particles.burst(particleEmotion, count);
        }
      }
      scheduleNextAmbientParticle();
    }, delay);
  };

  scheduleNextAmbientParticle();

  // ─── Autonomous State Wandering ─────────────────────────────────────
  // Sin esto el emoji solo cambia de estado por interacción del usuario o
  // por llamadas explícitas — en reposo se queda pegado a "idle" para
  // siempre. Aquí, de tanto en tanto, visita solo una reacción real (nunca
  // los estados de "ciclo de producto"/"agente" como uploading o thinking:
  // esos los debe decidir la app anfitriona porque significan algo, no son
  // decoración).
  let autonomousTimeoutId: number | null = null;
  let autonomousHoldTimeoutId: number | null = null;
  let lastAutonomousState: InteractionState | null = null;

  const scheduleNextAutonomousState = () => {
    const minDelay = 5000;
    const maxDelay = 11000;
    const delay = minDelay + Math.random() * (maxDelay - minDelay);

    autonomousTimeoutId = window.setTimeout(() => {
      const canWander =
        isAutonomousStatesEnabled &&
        autonomousStatePool.length > 0 &&
        !isReducedMotionActive() &&
        !sequencePlayer.isPlaying() &&
        stateManager.getState() === 'idle' &&
        !isNearActive && !isHoverActive && !isClickActive;

      if (canWander) {
        const next = pickWithoutRepeat(autonomousStatePool, lastAutonomousState);
        lastAutonomousState = next;
        updateState(next);

        const holdTime = 1800 + Math.random() * 2200;
        autonomousHoldTimeoutId = window.setTimeout(() => {
          // Si el usuario interactuó durante la visita, eso manda; si no, vuelve a idle
          if (stateManager.getState() === next && !isNearActive && !isHoverActive && !isClickActive) {
            updateState('idle');
          }
        }, holdTime);
      }
      scheduleNextAutonomousState();
    }, delay);
  };

  scheduleNextAutonomousState();

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
    if (ambientParticleTimeoutId !== null) {
      clearTimeout(ambientParticleTimeoutId);
      ambientParticleTimeoutId = null;
    }
    if (autonomousTimeoutId !== null) {
      clearTimeout(autonomousTimeoutId);
      autonomousTimeoutId = null;
    }
    if (autonomousHoldTimeoutId !== null) {
      clearTimeout(autonomousHoldTimeoutId);
      autonomousHoldTimeoutId = null;
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
          if (isSoundEnabled) soundEngine.playSound(soundEmotion, 'hover');
          updateState(determineCurrentState());
        },
        onHoverEnd: () => {
          isHoverActive = false;
          updateState(determineCurrentState());
        },
        onClickStart: () => {
          isClickActive = true;
          if (isSoundEnabled) soundEngine.playSound(soundEmotion, 'click');
          if (!isReducedMotionActive()) {
            particles.burst(particleEmotion, 8);
          }
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

  const instanceId = 'wissive-' + Math.random().toString(36).substring(2, 9);

  // ─── Public API ────────────────────────────────────────────────────
  return {
    id: instanceId,
    name: definition.name,
    emotionCategory: definition.emotion,
    getElement() {
      return container;
    },
    getPosition() {
      const rect = container.getBoundingClientRect();
      return {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      };
    },
    getCurrentState() {
      return stateManager.getState();
    },
    setEmotion(state: InteractionState) {
      if (!isReducedMotionActive()) {
        if (state === 'click') {
          particles.burst(particleEmotion, 8);
        } else if (state === 'hover') {
          particles.burst(particleEmotion, 4);
        }
      }
      updateState(state);
    },
    spin(turns = 1) {
      const current = springs.getValues().turnAngle || 0;
      springs.setTargets({ turnAngle: current + Math.PI * 2 * turns });
      sharedLoop.add(tick);
    },
    bounce() {
      if (isSoundEnabled) soundEngine.playSound(soundEmotion, 'bounce');
      if (!isReducedMotionActive()) {
        particles.burst(particleEmotion, 5);
      }
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
    setAmbientParticles(enabled: boolean) {
      isAmbientParticlesEnabled = enabled;
    },
    setAutonomousStates(enabled: boolean) {
      isAutonomousStatesEnabled = enabled;
    },
    setAutonomousStatePool(pool: InteractionState[]) {
      autonomousStatePool = pool;
    },
    setReducedMotion(setting: 'auto' | boolean) {
      userReducedMotionSetting = setting;
      render();
    },
    setTheme(theme: ThemeOption) {
      userThemeSetting = theme;
      render();
    },
    setSize(newSize: WissiveSize) {
      currentSize = resolveSize(newSize);
      wrapper.style.width = `${currentSize}px`;
      wrapper.style.height = `${currentSize}px`;
      container.style.width = `${currentSize}px`;
      container.style.height = `${currentSize}px`;
      particles.resize(currentSize);
      render();
    },
    setSilhouette(newSilhouette: SilhouetteType, duration = 400) {
      if (currentSilhouette === newSilhouette && !isMorphing) return;
      currentSilhouette = newSilhouette;
      definition.silhouette = newSilhouette;
      morphFromRadii = [...currentRadii];
      targetRadii = getSilhouetteProfile(newSilhouette);
      morphStartTime = typeof performance !== 'undefined' ? performance.now() : Date.now();
      morphDuration = isReducedMotionActive() ? 0 : duration;

      if (morphDuration === 0) {
        currentRadii = [...targetRadii];
        isMorphing = false;
      } else {
        isMorphing = true;
      }

      sharedLoop.add(tick);
      render();
    },
    setSpringConfig(config: Partial<SpringConfig> | TransitionProfile) {
      springs.setConfig(config);
    },
    triggerParticles(count = 8) {
      if (!isReducedMotionActive()) {
        particles.burst(particleEmotion, count);
      }
    },
    playSequence(steps: SequenceStep[], options?: SequenceOptions) {
      sequencePlayer.play(steps, options);
    },
    stopSequence() {
      sequencePlayer.stop();
      transitionToVariant(stateManager.getState());
    },
    isSequencePlaying() {
      return sequencePlayer.isPlaying();
    },
    destroy() {
      sequencePlayer.stop();
      stopTimers();
      unsubscribeReducedMotion();
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
export * from './render/silhouette';
export * from './core/sound';
export * from './core/drag';
export * from './render/particles';
export * from './core/a11y';
export * from './core/theme';
export * from './core/motion';
export * from './core/sequence';
export * from './core/group';
export * from './events/listeners';
export * from './emojis/catalog';
export * from './emojis/custom';
export * from './emojis/states';

export const Wissive = {
  create: createEmoji,
  createGroup: createEmojiGroup,
  setGlobalSound,
  isGlobalSoundEnabled,
  setGlobalVolume,
  getGlobalVolume,
  supportsHover,
  isTouchDevice,
};

export default Wissive;




