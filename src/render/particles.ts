import { spiralPoints } from './spiral.ts';

export type ParticleShape =
  | 'heart' | 'star' | 'sparkle' | 'drop' | 'diamond' | 'zigzag' | 'circle' | 'ring' | 'zzz'
  // Añadidas para que las 14 emociones tengan partícula propia
  | 'petal' | 'spiral' | 'bubble' | 'ember' | 'shard' | 'burst' | 'dot' | 'glitch';

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
  shape: ParticleShape;
  color: string;
  opacity: number;
  swayFreq?: number;
  swayAmp?: number;
}

export class ParticleEmitter {
  private particles: Particle[] = [];
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private animating = false;
  private rafId: number | null = null;
  private size: number;
  private dpr: number;

  constructor(container: HTMLElement, size: number) {
    this.size = size;
    this.dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;

    this.canvas = document.createElement('canvas');
    this.setupCanvas();

    container.style.position = 'relative';
    container.style.overflow = 'visible';
    container.appendChild(this.canvas);

    this.ctx = this.canvas.getContext('2d')!;
  }

  private setupCanvas() {
    const dpr = this.dpr;
    const canvasSize = this.size * 2.5;

    this.canvas.width = canvasSize * dpr;
    this.canvas.height = canvasSize * dpr;
    this.canvas.style.cssText = `
      position: absolute;
      top: -${this.size * 0.75}px;
      left: -${this.size * 0.75}px;
      width: ${canvasSize}px;
      height: ${canvasSize}px;
      pointer-events: none;
      z-index: 10;
    `;
  }

  public resize(newSize: number) {
    this.size = newSize;
    this.dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
    this.setupCanvas();
  }

  public burst(emotion: string, count: number = 8, originX?: number, originY?: number) {
    const canvasSize = this.size * 2.5;
    const cx = originX ?? (canvasSize / 2);
    const cy = originY ?? (canvasSize / 2);

    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.7;
      const speed = 2.5 + Math.random() * 3.5;
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
    const radiusOffset = 10 + Math.random() * 15;
    const spawnX = cx + Math.cos(angle) * radiusOffset;
    const spawnY = cy + Math.sin(angle) * radiusOffset;

    const maxLife = 0.6 + Math.random() * 0.5;

    const base: Particle = {
      x: spawnX,
      y: spawnY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 1.2,
      life: maxLife,
      maxLife: maxLife,
      size: (6 + Math.random() * 8) * (this.size / 120),
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.2,
      shape: 'circle',
      color: '#F2A9B8',
      opacity: 1,
    };

    const isAccent = Math.random() > 0.6;

    // Cada emoción: par de formas propio, paleta propia y física propia.
    // Antes 10 de las 14 compartían rama y se veían idénticas.
    const pick = (palette: string[]) => palette[Math.floor(Math.random() * palette.length)];

    switch (emotion) {
      // Mochi — corazones que suben ligeros
      case 'happy':
        base.shape = isAccent ? 'sparkle' : 'heart';
        base.color = pick(['#F2A9B8', '#E3536C', '#FF8FAB', '#FFD1DC', '#FFF0F5']);
        base.vy -= 0.6;
        break;

      // Suri — pétalos que caen meciéndose
      case 'pleasure':
        base.shape = isAccent ? 'circle' : 'petal';
        base.color = pick(['#F28FC2', '#FFC2DE', '#FFE3F0', '#E5739F']);
        base.vy += 0.9;
        base.vx *= 0.6;
        base.rotSpeed *= 2.5;
        base.swayFreq = 5 + Math.random() * 3;
        base.swayAmp = 0.9 + Math.random() * 0.5;
        break;

      // Zumi — chispas doradas rápidas y erráticas
      case 'flutter':
        base.shape = isAccent ? 'sparkle' : 'star';
        base.color = pick(['#F2CB4E', '#FFD700', '#FFA500', '#FFF4CC']);
        base.vy -= 1;
        base.vx *= 1.5;
        base.rotSpeed *= 2;
        break;

      // Nima — anillos verdes que ascienden serenos
      case 'peaceful':
        base.shape = isAccent ? 'circle' : 'ring';
        base.color = pick(['#9AC9A0', '#B5E8B5', '#7FD17F', '#E8F5E9']);
        base.vy -= 0.8;
        base.swayFreq = 8 + Math.random() * 4;
        base.swayAmp = 0.4 + Math.random() * 0.4;
        break;

      // Cota — puntos menta, discretos y sin dramatismo
      case 'normal':
        base.shape = isAccent ? 'circle' : 'dot';
        base.color = pick(['#C9DCD3', '#A8C7BB', '#E4F0EA', '#8FB3A4']);
        base.size *= 0.65;
        base.vx *= 0.5;
        base.vy *= 0.5;
        break;

      // Dozy — zzz grises pesados
      case 'tired':
        base.shape = isAccent ? 'ring' : 'zzz';
        base.color = pick(['#D6DBCF', '#BFC7B8', '#EDF0E8', '#A9B3A0']);
        base.vy -= 1.2;
        base.vx *= 0.25;
        base.swayFreq = 6 + Math.random() * 4;
        base.swayAmp = 0.5;
        break;

      // Snug — burbujas de sueño, grandes y lentísimas
      case 'sleepy':
        base.shape = isAccent ? 'zzz' : 'bubble';
        base.color = pick(['#AFCBE0', '#D3E8F5', '#ffffff', '#8FB6D1']);
        base.size *= 1.35;
        base.vy -= 1.5;
        base.vx *= 0.2;
        base.swayFreq = 3 + Math.random() * 2;
        base.swayAmp = 0.7;
        break;

      // Lumo — lágrimas azules que caen rectas
      case 'sad':
        base.shape = isAccent ? 'circle' : 'drop';
        base.color = pick(['#7FA6D9', '#A0C4E8', '#6B9ACF', '#E1F5FE']);
        base.vy += 1.8;
        base.vx *= 0.3;
        break;

      // Wilt — fragmentos ocre que caen dando tumbos
      case 'disappointed':
        base.shape = isAccent ? 'drop' : 'shard';
        base.color = pick(['#EBD98A', '#C9B86B', '#F5E9B8', '#A89550']);
        base.vy += 1.2;
        base.vx *= 0.8;
        base.rotSpeed *= 4;
        break;

      // Fidge — zigzags morados nerviosos y pequeños
      case 'anxiety':
        base.shape = isAccent ? 'circle' : 'zigzag';
        base.color = pick(['#A99BD9', '#C4B5F0', '#8B7BC4', '#D1C4E9']);
        base.size *= 0.8;
        base.vx *= 1.4;
        break;

      // Knot — espirales que giran sobre sí mismas
      case 'stress':
        base.shape = isAccent ? 'zigzag' : 'spiral';
        base.color = pick(['#C97F76', '#E09A91', '#A85F57', '#F0BDB6']);
        base.size *= 0.9;
        base.rotSpeed *= 6;
        base.swayFreq = 12 + Math.random() * 6;
        base.swayAmp = 0.6;
        break;

      // Brix — brasas que suben con el calor
      case 'anger':
        base.shape = isAccent ? 'diamond' : 'ember';
        base.color = pick(['#D9566A', '#FF4444', '#FF6B35', '#FFA033']);
        base.vy -= 1.4;
        base.vx *= 0.7;
        base.size *= 0.9;
        break;

      // Pip — estallido radial con esquirlas saliendo disparadas
      case 'surprised':
        base.shape = isAccent ? 'dot' : 'burst';
        base.color = pick(['#F0B98A', '#FFCFA3', '#FF9F1C', '#FFE8D1']);
        base.size *= 1.15;
        base.vx *= 1.8;
        base.vy *= 1.8;
        break;

      // Void — fallos lilas que apenas se mueven y se apagan rápido
      case 'numbness':
        base.shape = isAccent ? 'dot' : 'glitch';
        base.color = pick(['#D9C6E0', '#C0A8CC', '#EDE2F0', '#A98FB8']);
        base.vx *= 0.25;
        base.vy *= 0.25;
        base.life *= 0.6;
        base.rotSpeed = 0;
        break;

      default:
        base.shape = isAccent ? 'sparkle' : 'circle';
        base.color = pick(['#F2A9B8', '#F2CB4E', '#9AC9A0']);
        break;
    }

    return base;
  }

  private tick = () => {
    const width = this.canvas.width;
    const height = this.canvas.height;

    this.ctx.clearRect(0, 0, width, height);

    const dt = 0.016;

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];

      p.life -= dt;
      if (p.life <= 0) {
        this.particles.splice(i, 1);
        continue;
      }

      p.vx *= 0.95;
      p.vy *= 0.95;

      if (p.swayFreq && p.swayAmp) {
        p.x += Math.sin((p.maxLife - p.life) * p.swayFreq) * p.swayAmp;
      }

      p.x += p.vx;
      p.y += p.vy;
      p.rotation += p.rotSpeed;

      this.drawParticle(p);
    }

    if (this.particles.length > 0) {
      this.rafId = requestAnimationFrame(this.tick);
    } else {
      this.animating = false;
      this.ctx.clearRect(0, 0, width, height);
    }
  };

  private drawParticle(p: Particle) {
    const ctx = this.ctx;
    const dpr = this.dpr;

    const lifeProgress = 1 - p.life / p.maxLife;

    let scaleFactor = 1;
    if (lifeProgress < 0.18) {
      scaleFactor = lifeProgress / 0.18;
    } else if (lifeProgress > 0.65) {
      scaleFactor = (1 - lifeProgress) / 0.35;
    }
    scaleFactor = Math.max(0, Math.min(1.2, scaleFactor));

    const s = p.size * scaleFactor;
    if (s <= 0.1) return;

    const opacity = Math.max(0, Math.min(1, (p.life / p.maxLife) * 1.2));

    ctx.save();
    ctx.translate(p.x * dpr, p.y * dpr);
    ctx.rotate(p.rotation);
    ctx.globalAlpha = opacity;

    switch (p.shape) {
      case 'heart':
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.moveTo(0, s * 0.35 * dpr);
        ctx.bezierCurveTo(
          -s * 0.7 * dpr, -s * 0.1 * dpr,
          -s * 0.8 * dpr, -s * 0.8 * dpr,
          0, -s * 0.45 * dpr
        );
        ctx.bezierCurveTo(
          s * 0.8 * dpr, -s * 0.8 * dpr,
          s * 0.7 * dpr, -s * 0.1 * dpr,
          0, s * 0.35 * dpr
        );
        ctx.closePath();
        ctx.fill();
        break;

      case 'star': {
        ctx.fillStyle = p.color;
        ctx.beginPath();
        const pts = 5;
        const outerR = s * dpr;
        const innerR = s * 0.45 * dpr;
        for (let j = 0; j < pts * 2; j++) {
          const r = j % 2 === 0 ? outerR : innerR;
          const angle = (j * Math.PI) / pts - Math.PI / 2;
          const px = Math.cos(angle) * r;
          const py = Math.sin(angle) * r;
          if (j === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.fill();
        break;
      }

      case 'sparkle': {
        ctx.fillStyle = p.color;
        ctx.beginPath();
        const r = s * 1.1 * dpr;
        ctx.moveTo(0, -r);
        ctx.quadraticCurveTo(0, 0, r, 0);
        ctx.quadraticCurveTo(0, 0, 0, r);
        ctx.quadraticCurveTo(0, 0, -r, 0);
        ctx.quadraticCurveTo(0, 0, 0, -r);
        ctx.closePath();
        ctx.fill();
        break;
      }

      case 'drop':
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.moveTo(0, -s * 0.8 * dpr);
        ctx.bezierCurveTo(
          s * 0.7 * dpr, -s * 0.2 * dpr,
          s * 0.6 * dpr, s * 0.7 * dpr,
          0, s * 0.7 * dpr
        );
        ctx.bezierCurveTo(
          -s * 0.6 * dpr, s * 0.7 * dpr,
          -s * 0.7 * dpr, -s * 0.2 * dpr,
          0, -s * 0.8 * dpr
        );
        ctx.closePath();
        ctx.fill();
        break;

      case 'diamond':
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.moveTo(0, -s * dpr);
        ctx.lineTo(s * 0.65 * dpr, 0);
        ctx.lineTo(0, s * dpr);
        ctx.lineTo(-s * 0.65 * dpr, 0);
        ctx.closePath();
        ctx.fill();
        break;

      case 'zigzag':
        ctx.strokeStyle = p.color;
        ctx.lineWidth = Math.max(2, s * 0.25) * dpr;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();
        ctx.moveTo(-s * 0.6 * dpr, -s * 0.5 * dpr);
        ctx.lineTo(-s * 0.1 * dpr, -s * 0.1 * dpr);
        ctx.lineTo(-s * 0.3 * dpr, s * 0.1 * dpr);
        ctx.lineTo(s * 0.6 * dpr, s * 0.5 * dpr);
        ctx.stroke();
        break;

      case 'ring':
        ctx.strokeStyle = p.color;
        ctx.lineWidth = Math.max(1.5, s * 0.25) * dpr;
        ctx.beginPath();
        ctx.arc(0, 0, s * 0.55 * dpr, 0, Math.PI * 2);
        ctx.stroke();
        break;

      case 'zzz':
        ctx.strokeStyle = p.color;
        ctx.lineWidth = Math.max(2, s * 0.25) * dpr;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();
        ctx.moveTo(-s * 0.4 * dpr, -s * 0.5 * dpr);
        ctx.lineTo(s * 0.4 * dpr, -s * 0.5 * dpr);
        ctx.lineTo(-s * 0.4 * dpr, s * 0.5 * dpr);
        ctx.lineTo(s * 0.4 * dpr, s * 0.5 * dpr);
        ctx.stroke();
        break;

      case 'petal':
        // Pétalo: dos curvas que se cierran en punta
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.moveTo(0, -s * 0.9 * dpr);
        ctx.quadraticCurveTo(s * 0.75 * dpr, -s * 0.1 * dpr, 0, s * 0.9 * dpr);
        ctx.quadraticCurveTo(-s * 0.75 * dpr, -s * 0.1 * dpr, 0, -s * 0.9 * dpr);
        ctx.closePath();
        ctx.fill();
        break;

      case 'spiral': {
        ctx.strokeStyle = p.color;
        ctx.lineWidth = Math.max(1.5, s * 0.2) * dpr;
        ctx.lineCap = 'round';
        ctx.beginPath();
        const radius = s * 0.85 * dpr;
        spiralPoints().forEach(([ux, uy], i) => {
          const px = ux * radius;
          const py = uy * radius;
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        });
        ctx.stroke();
        break;
      }

      case 'bubble':
        // Burbuja: contorno suave con un brillo descentrado
        ctx.strokeStyle = p.color;
        ctx.lineWidth = Math.max(1, s * 0.14) * dpr;
        ctx.beginPath();
        ctx.arc(0, 0, s * 0.6 * dpr, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = p.color;
        ctx.globalAlpha *= 0.7;
        ctx.beginPath();
        ctx.arc(-s * 0.22 * dpr, -s * 0.24 * dpr, s * 0.13 * dpr, 0, Math.PI * 2);
        ctx.fill();
        break;

      case 'ember': {
        // Brasa: gota invertida, más ancha abajo
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.moveTo(0, -s * 0.95 * dpr);
        ctx.bezierCurveTo(
          s * 0.5 * dpr, -s * 0.2 * dpr,
          s * 0.62 * dpr, s * 0.55 * dpr,
          0, s * 0.75 * dpr
        );
        ctx.bezierCurveTo(
          -s * 0.62 * dpr, s * 0.55 * dpr,
          -s * 0.5 * dpr, -s * 0.2 * dpr,
          0, -s * 0.95 * dpr
        );
        ctx.closePath();
        ctx.fill();
        break;
      }

      case 'shard':
        // Fragmento irregular
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.moveTo(0, -s * 0.9 * dpr);
        ctx.lineTo(s * 0.55 * dpr, -s * 0.15 * dpr);
        ctx.lineTo(s * 0.2 * dpr, s * 0.85 * dpr);
        ctx.lineTo(-s * 0.45 * dpr, s * 0.3 * dpr);
        ctx.closePath();
        ctx.fill();
        break;

      case 'burst': {
        // Estallido: cuatro rayos radiales, sin relleno central
        ctx.strokeStyle = p.color;
        ctx.lineWidth = Math.max(1.5, s * 0.22) * dpr;
        ctx.lineCap = 'round';
        ctx.beginPath();
        for (let j = 0; j < 4; j++) {
          const a = (j * Math.PI) / 2;
          const inner = s * 0.3 * dpr;
          const outer = s * dpr;
          ctx.moveTo(Math.cos(a) * inner, Math.sin(a) * inner);
          ctx.lineTo(Math.cos(a) * outer, Math.sin(a) * outer);
        }
        ctx.stroke();
        break;
      }

      case 'dot':
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(0, 0, s * 0.28 * dpr, 0, Math.PI * 2);
        ctx.fill();
        break;

      case 'glitch':
        // Fallo: dos rectángulos desplazados
        ctx.fillStyle = p.color;
        ctx.fillRect(-s * 0.6 * dpr, -s * 0.28 * dpr, s * 1.2 * dpr, s * 0.22 * dpr);
        ctx.globalAlpha *= 0.6;
        ctx.fillRect(-s * 0.25 * dpr, s * 0.06 * dpr, s * 0.9 * dpr, s * 0.16 * dpr);
        break;

      case 'circle':
      default:
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(0, 0, s * 0.5 * dpr, 0, Math.PI * 2);
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
