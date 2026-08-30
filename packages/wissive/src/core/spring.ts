export interface SpringConfig {
  stiffness: number;
  damping: number;
  mass: number;
}

export type TransitionProfile = 'smooth' | 'bouncy' | 'snappy' | 'gentle' | 'instant';

export const SPRING_PRESETS: Record<TransitionProfile, SpringConfig> = {
  // Suave / Natural: balance equilibrado
  smooth: { stiffness: 170, damping: 18, mass: 1.0 },
  // Elástico / Rebote: oscilación amortiguada con rebote visible
  bouncy: { stiffness: 280, damping: 8, mass: 0.8 },
  // Snappy / Rápido: rápido y preciso sin rebote
  snappy: { stiffness: 420, damping: 30, mass: 0.6 },
  // Gentle / Lento: movimiento relajado y suave
  gentle: { stiffness: 55, damping: 14, mass: 1.4 },
  // Instantáneo: transición directa
  instant: { stiffness: 99999, damping: 9999, mass: 0.001 },
};

export interface SpringState {
  current: number;
  target: number;
  velocity: number;
}

export interface SpringInstance {
  state: SpringState;
  setConfig: (config: Partial<SpringConfig>) => void;
  setTarget: (target: number) => void;
  setCurrent: (value: number) => void;
  update: (dt: number) => boolean;
}

/**
 * Motor de resorte amortiguado (damped spring physics).
 * Utiliza integrador numérico sub-stepped para máxima estabilidad.
 */
export function makeSpring(
  initialValue: number,
  config: Partial<SpringConfig> = {}
): SpringInstance {
  let { stiffness = 170, damping = 18, mass = 1 } = config;
  const state: SpringState = {
    current: initialValue,
    target: initialValue,
    velocity: 0,
  };

  return {
    state,
    setConfig(newConfig: Partial<SpringConfig>) {
      if (newConfig.stiffness !== undefined) stiffness = newConfig.stiffness;
      if (newConfig.damping !== undefined) damping = newConfig.damping;
      if (newConfig.mass !== undefined) mass = newConfig.mass;
    },
    setTarget(target: number) {
      state.target = target;
    },
    setCurrent(value: number) {
      state.current = value;
      state.target = value;
      state.velocity = 0;
    },
    update(dt: number) {
      const maxSubSteps = 4;
      const subDt = dt / maxSubSteps;

      let isMoving = false;
      for (let i = 0; i < maxSubSteps; i++) {
        const displacement = state.current - state.target;
        const springForce = -stiffness * displacement;
        const dampingForce = -damping * state.velocity;
        const acceleration = (springForce + dampingForce) / mass;

        state.velocity += acceleration * subDt;
        state.current += state.velocity * subDt;

        if (
          Math.abs(state.velocity) > 0.0001 ||
          Math.abs(state.current - state.target) > 0.0001
        ) {
          isMoving = true;
        }
      }

      if (!isMoving) {
        state.current = state.target;
        state.velocity = 0;
      }

      return isMoving;
    },
  };
}

export interface MultiSpring<T extends Record<string, number>> {
  getValues: () => T;
  setConfig: (config: Partial<SpringConfig> | TransitionProfile) => void;
  setTargets: (targets: Partial<T>) => void;
  setValues: (values: Partial<T>) => void;
  update: (dt: number) => boolean;
}

const DISCRETE_KEYS = new Set(['eyeType', 'mouthType', 'cascadeTears', 'showBrows']);

export function createMultiSpring<T extends Record<string, number>>(
  initialValues: T,
  config?: Partial<SpringConfig>
): MultiSpring<T> {
  const keys = Object.keys(initialValues) as (keyof T)[];
  const springs = {} as Record<keyof T, SpringInstance>;
  let currentProfile: TransitionProfile | null = null;

  for (const key of keys) {
    springs[key] = makeSpring(initialValues[key], config);
  }

  return {
    getValues() {
      const values = {} as T;
      for (const key of keys) {
        values[key] = springs[key].state.current as T[typeof key];
      }
      return values;
    },
    setConfig(newConfig: Partial<SpringConfig> | TransitionProfile) {
      if (typeof newConfig === 'string') {
        currentProfile = newConfig;
        const resolved = SPRING_PRESETS[newConfig] || SPRING_PRESETS.smooth;
        for (const key of keys) {
          springs[key].setConfig(resolved);
        }
      } else {
        currentProfile = null;
        for (const key of keys) {
          springs[key].setConfig(newConfig);
        }
      }
    },
    setTargets(targets: Partial<T>) {
      const isInstant = currentProfile === 'instant';
      for (const key in targets) {
        if (key in springs) {
          if (isInstant || DISCRETE_KEYS.has(key as string)) {
            // Instantánea o propiedades categóricas discretas
            springs[key].setCurrent(targets[key]!);
          } else {
            springs[key].setTarget(targets[key]!);
          }
        }
      }
    },
    setValues(values: Partial<T>) {
      for (const key in values) {
        if (key in springs) {
          springs[key].setCurrent(values[key]!);
        }
      }
    },
    update(dt: number) {
      let active = false;
      for (const key of keys) {
        const springActive = springs[key].update(dt);
        if (springActive) active = true;
      }
      return active;
    },
  };
}
