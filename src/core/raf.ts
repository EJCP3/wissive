export type FrameCallback = (dt: number) => void;

class AnimationLoop {
  private callbacks: Set<FrameCallback> = new Set();
  private handle: number | null = null;
  private lastTime: number = 0;

  public add(cb: FrameCallback): void {
    this.callbacks.add(cb);
    if (!this.handle) {
      this.lastTime = performance.now();
      this.tick = this.tick.bind(this);
      this.handle = requestAnimationFrame(this.tick);
    }
  }

  public remove(cb: FrameCallback): void {
    this.callbacks.delete(cb);
    if (this.callbacks.size === 0 && this.handle !== null) {
      cancelAnimationFrame(this.handle);
      this.handle = null;
    }
  }

  public get size(): number {
    return this.callbacks.size;
  }

  private tick(now: number): void {
    const dt = Math.min((now - this.lastTime) / 1000, 0.1);
    this.lastTime = now;

    this.callbacks.forEach((cb) => cb(dt));

    if (this.callbacks.size > 0) {
      this.handle = requestAnimationFrame(this.tick);
    } else {
      this.handle = null;
    }
  }
}

export const sharedLoop = new AnimationLoop();
