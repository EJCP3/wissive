/**
 * Drag & Toss physics with elastic Squash & Stretch deformation.
 *
 * The user can grab an emoji and drag it around. While dragging, the body
 * stretches in the direction of movement. When released, it flies away with
 * the accumulated velocity and bounces back to its origin like jelly.
 */

export interface DragPhysicsState {
  /** Current visual offset from origin (px) */
  offsetX: number;
  offsetY: number;
  /** Squash & Stretch deformation for CSS transform */
  scaleX: number;
  scaleY: number;
  /** Rotation from drag inertia (rad) */
  rotation: number;
  /** true while the user is actively dragging */
  isDragging: boolean;
}

interface Vec2 {
  x: number;
  y: number;
}

export class DragPhysics {
  // Position
  private posX = 0;
  private posY = 0;

  // Velocity
  private velX = 0;
  private velY = 0;

  // Drag tracking
  private dragging = false;
  private startPointerX = 0;
  private startPointerY = 0;
  private lastPointerX = 0;
  private lastPointerY = 0;
  private lastPointerTime = 0;

  // Velocity samples for a smooth toss (ring buffer of last N moves)
  private velocitySamples: Vec2[] = [];
  private readonly MAX_SAMPLES = 6;

  // Spring constants for the return-to-origin bounce
  private readonly springK = 0.08;   // stiffness — lower = softer jelly
  private readonly springD = 0.82;   // damping   — lower = bouncier
  private readonly tossDecay = 0.96; // air friction on free flight

  // Stretch limits
  private readonly maxStretch = 0.25;

  // Physics loop
  private animating = false;
  private rafId: number | null = null;

  // Callbacks
  private onUpdate: (state: DragPhysicsState) => void;
  private onDragStart?: () => void;
  private onDragEnd?: () => void;

  // Element ref
  private el: HTMLElement;

  constructor(
    element: HTMLElement,
    onUpdate: (state: DragPhysicsState) => void,
    options?: {
      onDragStart?: () => void;
      onDragEnd?: () => void;
    }
  ) {
    this.el = element;
    this.onUpdate = onUpdate;
    this.onDragStart = options?.onDragStart;
    this.onDragEnd = options?.onDragEnd;

    // Mouse events
    this.el.addEventListener('mousedown', this.handlePointerDown as EventListener);
    window.addEventListener('mousemove', this.handlePointerMove as EventListener);
    window.addEventListener('mouseup', this.handlePointerUp as EventListener);

    // Touch events
    this.el.addEventListener('touchstart', this.handleTouchDown, { passive: false });
    window.addEventListener('touchmove', this.handleTouchMove, { passive: false });
    window.addEventListener('touchend', this.handleTouchUp);
  }

  // ─── Pointer Abstraction ───────────────────────────────────────────

  private handlePointerDown = (e: MouseEvent) => {
    e.preventDefault();
    this.startDrag(e.clientX, e.clientY);
  };

  private handlePointerMove = (e: MouseEvent) => {
    if (!this.dragging) return;
    this.moveDrag(e.clientX, e.clientY);
  };

  private handlePointerUp = () => {
    if (!this.dragging) return;
    this.endDrag();
  };

  private handleTouchDown = (e: TouchEvent) => {
    e.preventDefault();
    const t = e.touches[0];
    this.startDrag(t.clientX, t.clientY);
  };

  private handleTouchMove = (e: TouchEvent) => {
    if (!this.dragging) return;
    e.preventDefault();
    const t = e.touches[0];
    this.moveDrag(t.clientX, t.clientY);
  };

  private handleTouchUp = () => {
    if (!this.dragging) return;
    this.endDrag();
  };

  // ─── Drag Logic ────────────────────────────────────────────────────

  private startDrag(px: number, py: number) {
    this.dragging = true;
    this.startPointerX = px - this.posX;
    this.startPointerY = py - this.posY;
    this.lastPointerX = px;
    this.lastPointerY = py;
    this.lastPointerTime = performance.now();
    this.velocitySamples = [];

    // Kill any existing velocity so the emoji "sticks" to the cursor
    this.velX = 0;
    this.velY = 0;

    this.el.style.cursor = 'grabbing';
    this.onDragStart?.();
    this.startPhysicsLoop();
  }

  private moveDrag(px: number, py: number) {
    const now = performance.now();
    const dt = Math.max(1, now - this.lastPointerTime);

    // Track velocity samples
    this.velocitySamples.push({
      x: (px - this.lastPointerX) / dt,
      y: (py - this.lastPointerY) / dt,
    });
    if (this.velocitySamples.length > this.MAX_SAMPLES) {
      this.velocitySamples.shift();
    }

    this.posX = px - this.startPointerX;
    this.posY = py - this.startPointerY;
    this.lastPointerX = px;
    this.lastPointerY = py;
    this.lastPointerTime = now;
  }

  private endDrag() {
    this.dragging = false;
    this.el.style.cursor = 'pointer';

    // Compute toss velocity from recent samples (average)
    if (this.velocitySamples.length > 0) {
      let sx = 0, sy = 0;
      for (const s of this.velocitySamples) {
        sx += s.x;
        sy += s.y;
      }
      // Scale factor: velocity was per-ms, we want px/frame at ~60fps (~16ms)
      const n = this.velocitySamples.length;
      this.velX = (sx / n) * 16;
      this.velY = (sy / n) * 16;

      // Clamp max toss speed
      const maxV = 25;
      const speed = Math.hypot(this.velX, this.velY);
      if (speed > maxV) {
        this.velX = (this.velX / speed) * maxV;
        this.velY = (this.velY / speed) * maxV;
      }
    }

    this.onDragEnd?.();
    this.startPhysicsLoop();
  }

  // ─── Physics Simulation ────────────────────────────────────────────

  private startPhysicsLoop() {
    if (this.animating) return;
    this.animating = true;
    this.rafId = requestAnimationFrame(this.physicsTick);
  }

  private physicsTick = () => {

    if (this.dragging) {
      // While dragging, just emit the current state with elastic deformation
      this.emitState();
      this.rafId = requestAnimationFrame(this.physicsTick);
      return;
    }

    // Free flight: apply spring back to origin + air friction
    // Spring force: F = -k * pos
    const fx = -this.springK * this.posX;
    const fy = -this.springK * this.posY;

    this.velX = (this.velX + fx) * this.springD;
    this.velY = (this.velY + fy) * this.springD;

    // Air decay
    this.velX *= this.tossDecay;
    this.velY *= this.tossDecay;

    this.posX += this.velX;
    this.posY += this.velY;

    this.emitState();

    // Stop when close enough to origin and nearly stationary
    const dist = Math.hypot(this.posX, this.posY);
    const speed = Math.hypot(this.velX, this.velY);
    if (dist < 0.3 && speed < 0.1) {
      this.posX = 0;
      this.posY = 0;
      this.velX = 0;
      this.velY = 0;
      this.animating = false;
      this.emitState();
      return;
    }

    this.rafId = requestAnimationFrame(this.physicsTick);
  };

  private emitState() {
    // Compute elastic Squash & Stretch based on velocity
    let stretchX = 1;
    let stretchY = 1;
    let rotation = 0;

    if (this.dragging) {
      // Stretch in drag direction
      const dx = this.posX;
      const dy = this.posY;
      const dist = Math.hypot(dx, dy);
      const stretch = Math.min(this.maxStretch, dist * 0.002);
      const angle = Math.atan2(dy, dx);

      // Decompose stretch along the drag direction
      stretchX = 1 + stretch * Math.abs(Math.cos(angle));
      stretchY = 1 - stretch * 0.5 * Math.abs(Math.cos(angle));
      // Slight counter-axis compression
      if (Math.abs(Math.sin(angle)) > Math.abs(Math.cos(angle))) {
        stretchY = 1 + stretch * Math.abs(Math.sin(angle));
        stretchX = 1 - stretch * 0.5 * Math.abs(Math.sin(angle));
      }

      rotation = Math.atan2(dy, dx) * 0.06; // subtle tilt in drag direction
    } else {
      // Velocity-based jelly wobble during free flight / bounce
      const speed = Math.hypot(this.velX, this.velY);
      const wobble = Math.min(this.maxStretch, speed * 0.012);
      const angle = Math.atan2(this.velY, this.velX);

      stretchX = 1 + wobble * Math.abs(Math.cos(angle));
      stretchY = 1 - wobble * 0.6 * Math.abs(Math.cos(angle));
      if (Math.abs(Math.sin(angle)) > Math.abs(Math.cos(angle))) {
        stretchY = 1 + wobble * Math.abs(Math.sin(angle));
        stretchX = 1 - wobble * 0.6 * Math.abs(Math.sin(angle));
      }

      rotation = Math.atan2(this.velY, this.velX) * 0.04;
    }

    this.onUpdate({
      offsetX: this.posX,
      offsetY: this.posY,
      scaleX: stretchX,
      scaleY: stretchY,
      rotation,
      isDragging: this.dragging,
    });
  }

  public destroy() {
    if (this.rafId !== null) cancelAnimationFrame(this.rafId);
    this.el.removeEventListener('mousedown', this.handlePointerDown as EventListener);
    window.removeEventListener('mousemove', this.handlePointerMove as EventListener);
    window.removeEventListener('mouseup', this.handlePointerUp as EventListener);
    this.el.removeEventListener('touchstart', this.handleTouchDown);
    window.removeEventListener('touchmove', this.handleTouchMove);
    window.removeEventListener('touchend', this.handleTouchUp);
  }
}
