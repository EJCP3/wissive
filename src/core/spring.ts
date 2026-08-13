export interface SpringConfig {
  stiffness: number;
  damping: number;
  mass: number;
}

export interface SpringState {
  current: number;
  target: number;
  velocity: number;
}

export interface SpringInstance {
  state: SpringState;
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
  const { stiffness = 180, damping = 18, mass = 1 } = config;
  const state: SpringState = {
    current: initialValue,
    target: initialValue,
    velocity: 0,
  };

  return {
    state,
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
  setTargets: (targets: Partial<T>) => void;
  setValues: (values: Partial<T>) => void;
  update: (dt: number) => boolean;
}

export function createMultiSpring<T extends Record<string, number>>(
  initialValues: T,
  config?: Partial<SpringConfig>
): MultiSpring<T> {
  const keys = Object.keys(initialValues) as (keyof T)[];
  const springs = {} as Record<keyof T, SpringInstance>;

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
    setTargets(targets: Partial<T>) {
      for (const key in targets) {
        if (key in springs) {
          springs[key].setTarget(targets[key]!);
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
