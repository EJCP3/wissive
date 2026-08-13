interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  rotation: number;
  rotSpeed: number;
  shape: string;
  color: string;
  opacity: number;
}

export class ParticleEmitter {
  private particles: Particle[] = [];
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private animating = false;
  private rafId: number | null = null;

  constructor(container: HTMLElement, size: number) {

    this.canvas = document.createElement('canvas');
    this.canvas.width = size * 2;
    this.canvas.height = size * 2;
    this.canvas.style.cssText = `
      position: absolute;
      top: -${size * 0.5}px;
      left: -${size * 0.5}px;
      width: ${size * 2}px;
      height: ${size * 2}px;
      pointer-events: none;
      z-index: 10;
    `;
    container.style.position = 'relative';
    container.style.overflow = 'visible';
    container.appendChild(this.canvas);

    this.ctx = this.canvas.getContext('2d')!;
  }

  public burst(emotion: string, count: number = 6) {
    const cx = this.canvas.width / 2;
    const cy = this.canvas.height / 2;

    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.6;
      const speed = 1.5 + Math.random() * 2.5;
      const particle = this.createParticle(emotion, cx, cy, angle, speed);
      this.particles.push(particle);
    }

    if (!this.animating) {
      this.animating = true;
      this.tick();
    }
  }

  private createParticle(
    emotion: string,
    cx: number,
    cy: number,
    angle: number,
    speed: number
  ): Particle {
    const base: Particle = {
      x: cx + (Math.random() - 0.5) * 20,
      y: cy + (Math.random() - 0.5) * 20,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 1.5,
      life: 1,
      maxLife: 1,
      size: 5 + Math.random() * 6,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.15,
      shape: 'circle',
      color: '#F2A9B8',
      opacity: 1,
    };

    switch (emotion) {
      case 'happy':
      case 'pleasure':
        base.shape = 'heart';
        base.color = ['#F2A9B8', '#E3536C', '#FF8FAB'][Math.floor(Math.random() * 3)];
        base.size = 5 + Math.random() * 5;
        break;

      case 'flutter':
        base.shape = 'star';
        base.color = ['#F2CB4E', '#FFD700', '#FFA500'][Math.floor(Math.random() * 3)];
        base.size = 4 + Math.random() * 5;
        break;

      case 'peaceful':
        base.shape = 'circle';
        base.color = ['#9AC9A0', '#B5E8B5', '#7FD17F'][Math.floor(Math.random() * 3)];
        base.size = 3 + Math.random() * 4;
        base.vy -= 0.5;
        break;

      case 'surprised':
        base.shape = 'star';
        base.color = ['#F0B98A', '#FFD700', '#FFF4CC'][Math.floor(Math.random() * 3)];
        base.size = 5 + Math.random() * 6;
        break;

      case 'anger':
        base.shape = 'diamond';
        base.color = ['#D9566A', '#FF4444', '#FF6B35'][Math.floor(Math.random() * 3)];
        base.size = 4 + Math.random() * 4;
        base.vy += 0.5;
        break;

      case 'sad':
      case 'disappointed':
        base.shape = 'drop';
        base.color = ['#7FA6D9', '#A0C4E8', '#6B9ACF'][Math.floor(Math.random() * 3)];
        base.size = 3 + Math.random() * 3;
        base.vy += 1;
        base.vx *= 0.3;
        break;

      case 'anxiety':
      case 'stress':
        base.shape = 'zigzag';
        base.color = ['#A99BD9', '#C97F76', '#FF6B6B'][Math.floor(Math.random() * 3)];
        base.size = 3 + Math.random() * 3;
        break;

      case 'tired':
      case 'sleepy':
        base.shape = 'circle';
        base.color = ['#AFCBE0', '#D6DBCF', '#ffffff'][Math.floor(Math.random() * 3)];
        base.size = 3 + Math.random() * 4;
        base.vy -= 1.5;
        base.vx *= 0.2;
        break;

      default:
        base.shape = 'circle';
        base.color = ['#F2A9B8', '#F2CB4E', '#9AC9A0'][Math.floor(Math.random() * 3)];
        break;
    }

    return base;
  }

  private tick = () => {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];

      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.04; // gravity
      p.vx *= 0.99;
      p.life -= 0.018;
      p.rotation += p.rotSpeed;
      p.opacity = Math.max(0, p.life);

      if (p.life <= 0) {
        this.particles.splice(i, 1);
        continue;
      }

      this.drawParticle(p);
    }

    if (this.particles.length > 0) {
      this.rafId = requestAnimationFrame(this.tick);
    } else {
      this.animating = false;
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  };

  private drawParticle(p: Particle) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation);
    ctx.globalAlpha = p.opacity * 0.85;

    const s = p.size * (0.5 + p.life * 0.5);

    switch (p.shape) {
      case 'heart':
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.moveTo(0, s * 0.4);
        ctx.bezierCurveTo(-s, -s * 0.3, -s * 0.5, -s, 0, -s * 0.4);
        ctx.bezierCurveTo(s * 0.5, -s, s, -s * 0.3, 0, s * 0.4);
        ctx.fill();
        break;

      case 'star':
        ctx.fillStyle = p.color;
        ctx.beginPath();
        for (let j = 0; j < 5; j++) {
          const angle = (j * Math.PI * 2) / 5 - Math.PI / 2;
          const inner = (j + 0.5) * Math.PI * 2 / 5 - Math.PI / 2;
          ctx.lineTo(Math.cos(angle) * s, Math.sin(angle) * s);
          ctx.lineTo(Math.cos(inner) * s * 0.4, Math.sin(inner) * s * 0.4);
        }
        ctx.closePath();
        ctx.fill();
        break;

      case 'diamond':
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.moveTo(0, -s);
        ctx.lineTo(s * 0.6, 0);
        ctx.lineTo(0, s);
        ctx.lineTo(-s * 0.6, 0);
        ctx.closePath();
        ctx.fill();
        break;

      case 'drop':
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(0, s * 0.2, s * 0.55, 0, Math.PI * 2);
        ctx.moveTo(0, -s * 0.6);
        ctx.quadraticCurveTo(s * 0.4, s * 0.1, 0, s * 0.6);
        ctx.quadraticCurveTo(-s * 0.4, s * 0.1, 0, -s * 0.6);
        ctx.fill();
        break;

      case 'zigzag':
        ctx.strokeStyle = p.color;
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(-s, 0);
        ctx.lineTo(-s * 0.4, -s * 0.5);
        ctx.lineTo(s * 0.4, s * 0.5);
        ctx.lineTo(s, 0);
        ctx.stroke();
        break;

      case 'circle':
      default:
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(0, 0, s * 0.5, 0, Math.PI * 2);
        ctx.fill();
        break;
    }

    ctx.restore();
  }

  public destroy() {
    if (this.rafId !== null) cancelAnimationFrame(this.rafId);
    this.particles = [];
    this.canvas.remove();
  }
}
