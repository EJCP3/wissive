import { buildFace, getSilhouetteProfile } from 'wissive';
import type { KeyframeData } from '../types';

export function buildFaceSvg(frame: KeyframeData, size = 220): string {
  if (!frame) return '';
  return buildFace(
    frame.silhouette,
    frame.color,
    {
      gazeX: frame.gazeX,
      gazeY: frame.gazeY,
      eyeType: frame.eyeType,
      eyeOpen: frame.eyeOpen,
      eyeScale: frame.eyeScale,
      mouthType: frame.mouthType,
      mouthCurve: frame.mouthCurve,
      mouthOpen: frame.mouthOpen,
      showBrows: frame.hasBrows ? 1 : 0,
      browTilt: frame.hasBrows ? frame.browTilt : 0,
      browY: frame.hasBrows ? frame.browY : 0,
      cheek: frame.cheek,
      sweat: frame.sweat,
      zzz: frame.zzz,
      tears: frame.tears,
      storm: frame.storm,
      scribble: frame.scribble,
      puff: frame.puff,
    },
    size,
    { radii: getSilhouetteProfile(frame.silhouette) }
  );
}

function hexToRgb(hex: string): [number, number, number] {
  let c = (hex || '#7ED321').replace('#', '');
  if (c.length === 3) c = c.split('').map((x) => x + x).join('');
  const num = parseInt(c, 16);
  if (isNaN(num)) return [126, 211, 33];
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function interpolateColor(colorA: string, colorB: string, t: number): string {
  try {
    const [r1, g1, b1] = hexToRgb(colorA);
    const [r2, g2, b2] = hexToRgb(colorB);
    return rgbToHex(
      r1 + (r2 - r1) * t,
      g1 + (g2 - g1) * t,
      b1 + (b2 - b1) * t
    );
  } catch {
    return colorB || colorA || '#7ED321';
  }
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function getEaseProgress(progress: number, profile: string): number {
  if (profile === 'instant') return progress >= 1 ? 1 : 0;
  if (profile === 'bouncy') {
    // Spring overshoot curve
    return 1 - Math.cos(progress * Math.PI * 2.5) * Math.exp(-progress * 3);
  }
  if (profile === 'snappy') {
    // Fast snappy ease out
    return 1 - Math.pow(1 - progress, 4);
  }
  if (profile === 'gentle') {
    // Gentle sine ease in-out
    return -(Math.cos(Math.PI * progress) - 1) / 2;
  }
  // Default 'smooth' cubic in-out
  return progress < 0.5
    ? 4 * progress * progress * progress
    : 1 - Math.pow(-2 * progress + 2, 3) / 2;
}

export async function downloadGif(
  frames: KeyframeData[],
  totalDuration: number,
  frameOffsets: { start: number; end: number; duration: number }[],
  options: {
    size: 128 | 256 | 512;
    fps: 15 | 30;
    bg: 'transparent' | 'white' | 'dark' | 'custom';
    customBg: string;
    onProgress?: (pct: number) => void;
  }
): Promise<void> {
  if (frames.length === 0) return;

  const { size, fps, bg, customBg, onProgress } = options;
  const frameDelayMs = Math.round(1000 / fps);
  const totalSecs = totalDuration;
  const totalFrames = Math.max(1, Math.round(totalSecs * fps));

  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) throw new Error('No canvas context');

  const gifencModule = await import('gifenc');
  const GIFEncoder = gifencModule.GIFEncoder || (gifencModule.default as any)?.GIFEncoder;
  const quantize = gifencModule.quantize || (gifencModule.default as any)?.quantize;
  const applyPalette = gifencModule.applyPalette || (gifencModule.default as any)?.applyPalette;

  const gif = GIFEncoder();

  for (let f = 0; f < totalFrames; f++) {
    const time = (f / totalFrames) * totalSecs;
    if (onProgress) {
      onProgress(Math.round(((f + 1) / totalFrames) * 100));
    }

    // 1. Identify active keyframe index in timeline
    let activeIdx = 0;
    for (let i = 0; i < frameOffsets.length; i++) {
      if (time >= frameOffsets[i].start && (time < frameOffsets[i].end || i === frameOffsets.length - 1)) {
        activeIdx = i;
        break;
      }
    }

    const curOffset = frameOffsets[activeIdx];
    const toFrame = frames[activeIdx];
    const prevIdx = (activeIdx - 1 + frames.length) % frames.length;
    const fromFrame = (activeIdx === 0 && time < 0.45) ? frames[0] : frames[prevIdx];

    // 2. Metamorphosis & Spring Transition Timing
    const transDuration = Math.min(0.45, curOffset.duration * 0.75);
    const elapsedInFrame = time - curOffset.start;
    const rawProgress = Math.min(1, Math.max(0, elapsedInFrame / Math.max(0.01, transDuration)));
    const easeT = getEaseProgress(rawProgress, toFrame.transitionType || 'smooth');

    // 3. Continuous Catmull-Rom Spline Silhouette Radii Interpolation
    const fromRadii = getSilhouetteProfile(fromFrame.silhouette);
    const toRadii = getSilhouetteProfile(toFrame.silhouette);
    const interpolatedRadii = fromRadii.map((r0, rIdx) => {
      const r1 = toRadii[rIdx] ?? r0;
      return r0 + (r1 - r0) * easeT;
    });

    // 4. Color Interpolation
    const interpolatedColor = interpolateColor(fromFrame.color, toFrame.color, easeT);

    // 5. Facial Parameters Interpolation
    const interpParams: any = {
      gazeX: lerp(fromFrame.gazeX ?? 0, toFrame.gazeX ?? 0, easeT),
      gazeY: lerp(fromFrame.gazeY ?? 0, toFrame.gazeY ?? 0, easeT),
      eyeScale: lerp(fromFrame.eyeScale ?? 1, toFrame.eyeScale ?? 1, easeT),
      eyeOpen: lerp(fromFrame.eyeOpen ?? 1, toFrame.eyeOpen ?? 1, easeT),
      mouthCurve: lerp(fromFrame.mouthCurve ?? 0, toFrame.mouthCurve ?? 0, easeT),
      mouthOpen: lerp(fromFrame.mouthOpen ?? 0, toFrame.mouthOpen ?? 0, easeT),
      browTilt: lerp(
        fromFrame.hasBrows ? (fromFrame.browTilt ?? 0) : 0,
        toFrame.hasBrows ? (toFrame.browTilt ?? 0) : 0,
        easeT
      ),
      browY: lerp(
        fromFrame.hasBrows ? (fromFrame.browY ?? 0) : 0,
        toFrame.hasBrows ? (toFrame.browY ?? 0) : 0,
        easeT
      ),
      showBrows: (fromFrame.hasBrows || toFrame.hasBrows) ? 1 : 0,
      cheek: lerp(fromFrame.cheek ?? 0, toFrame.cheek ?? 0, easeT),
      sweat: easeT > 0.5 ? toFrame.sweat : fromFrame.sweat,
      zzz: easeT > 0.5 ? toFrame.zzz : fromFrame.zzz,
      tears: easeT > 0.5 ? toFrame.tears : fromFrame.tears,
      storm: easeT > 0.5 ? toFrame.storm : fromFrame.storm,
      scribble: easeT > 0.5 ? toFrame.scribble : fromFrame.scribble,
      puff: easeT > 0.5 ? toFrame.puff : fromFrame.puff,
      eyeType: easeT >= 0.5 ? toFrame.eyeType : fromFrame.eyeType,
      mouthType: easeT >= 0.5 ? toFrame.mouthType : fromFrame.mouthType,
    };

    if (toFrame.transitionType === 'bouncy' && rawProgress < 1) {
      interpParams.bob = -6 * Math.sin(rawProgress * Math.PI);
    }

    const targetSilhouette = easeT >= 0.5 ? toFrame.silhouette : fromFrame.silhouette;

    // 6. Build organic morphing face SVG
    const svgStr = buildFace(
      targetSilhouette,
      interpolatedColor,
      interpParams,
      size,
      {
        radii: interpolatedRadii,
      }
    );

    ctx.clearRect(0, 0, size, size);

    if (bg === 'white') {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, size, size);
    } else if (bg === 'dark') {
      ctx.fillStyle = '#121217';
      ctx.fillRect(0, 0, size, size);
    } else if (bg === 'custom') {
      ctx.fillStyle = customBg;
      ctx.fillRect(0, 0, size, size);
    }

    await new Promise<void>((res) => {
      const img = new Image();
      const svgBlob = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);
      img.onload = () => {
        ctx.drawImage(img, 0, 0, size, size);
        URL.revokeObjectURL(url);
        res();
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        res();
      };
      img.src = url;
    });

    const { data } = ctx.getImageData(0, 0, size, size);
    const isTransparent = bg === 'transparent';
    const palette = quantize(data, 256, { format: isTransparent ? 'rgba4444' : 'rgb565' });
    const index = applyPalette(data, palette, isTransparent ? 'rgba4444' : 'rgb565');

    gif.writeFrame(index, size, size, {
      palette,
      delay: frameDelayMs,
      transparent: isTransparent,
    });
  }

  gif.finish();
  const bytes = gif.bytes();
  const blob = new Blob([bytes], { type: 'image/gif' });
  const dlUrl = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = dlUrl;
  a.download = 'wissive-animation.gif';
  a.click();
  URL.revokeObjectURL(dlUrl);
}

export function downloadStandaloneSvg(frame: KeyframeData): void {
  const svgStr = buildFaceSvg(frame, 320);
  const blob = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'wissive-emoji.svg';
  a.click();
  URL.revokeObjectURL(url);
}

export async function downloadSpriteSheet(frames: KeyframeData[]): Promise<void> {
  const size = 160;
  const count = frames.length;
  const canvas = document.createElement('canvas');
  canvas.width = size * count;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  for (let i = 0; i < count; i++) {
    const svgStr = buildFaceSvg(frames[i], size);
    await new Promise<void>((res) => {
      const img = new Image();
      const svgBlob = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);
      img.onload = () => {
        ctx.drawImage(img, i * size, 0, size, size);
        URL.revokeObjectURL(url);
        res();
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        res();
      };
      img.src = url;
    });
  }

  canvas.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'wissive-spritesheet.png';
    a.click();
    URL.revokeObjectURL(url);
  }, 'image/png');
}

export function downloadJsonFile(content: string, filename = 'wissive-secuencia.json'): void {
  const blob = new Blob([content], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function generateFrameworkCode(frames: KeyframeData[], targetFramework: string): string {
  const seqData = frames.map((f) => ({
    label: f.label,
    duration: Math.round(f.duration * 1000),
    silhouette: f.silhouette,
    color: f.color,
    params: {
      gazeX: f.gazeX,
      gazeY: f.gazeY,
      eyeType: f.eyeType,
      eyeOpen: f.eyeOpen,
      eyeScale: f.eyeScale,
      mouthType: f.mouthType,
      mouthCurve: f.mouthCurve,
      mouthOpen: f.mouthOpen,
      showBrows: f.hasBrows ? 1 : 0,
      browTilt: f.hasBrows ? f.browTilt : 0,
      browY: f.hasBrows ? f.browY : 0,
      cheek: f.cheek,
      sweat: f.sweat,
      zzz: f.zzz,
      tears: f.tears,
      storm: f.storm,
      scribble: f.scribble,
      puff: f.puff,
    },
    ...(f.bounce && { bounce: true }),
    ...(f.spin && { spin: true }),
  }));

  const seqJson = JSON.stringify(seqData, null, 2);

  switch (targetFramework) {
    case 'vue':
      return `<` + `script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { createCustomEmoji, createEmoji, type WissiveInstance } from 'wissive';

const slotRef = ref<HTMLDivElement | null>(null);
let instance: WissiveInstance | null = null;

const sequence = ${seqJson};

onMounted(() => {
  if (slotRef.value) {
    createCustomEmoji('mi-animacion', { silhouette: sequence[0]?.silhouette || 'circle' });
    instance = createEmoji('mi-animacion', { target: slotRef.value, size: '2xl', interactive: false });
    instance.playSequence(sequence, { mode: 'loop' });
  }
});

onUnmounted(() => {
  instance?.destroy();
});
</` + `script>

<template>
  <div ref="slotRef" class="emoji-wrapper"></div>
</template>`;

    case 'react':
      return `import React, { useEffect, useRef } from 'react';
import { createCustomEmoji, createEmoji, type WissiveInstance } from 'wissive';

const sequence = ${seqJson};

export function WissiveAnimation() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    createCustomEmoji('mi-animacion', { silhouette: sequence[0]?.silhouette || 'circle' });
    const instance = createEmoji('mi-animacion', {
      target: containerRef.current,
      size: '2xl',
      interactive: false,
    });
    instance.playSequence(sequence, { mode: 'loop' });

    return () => {
      instance.destroy();
    };
  }, []);

  return <div ref={containerRef} />;
}`;

    case 'astro':
      return `---
// Componente de Animación Wissive en Astro
---
<div id="wissive-stage"></div>

<script>
  import { createCustomEmoji, createEmoji } from 'wissive';

  const sequence = ${seqJson};
  const target = document.getElementById('wissive-stage');

  if (target) {
    createCustomEmoji('mi-animacion', { silhouette: sequence[0]?.silhouette || 'circle' });
    const instance = createEmoji('mi-animacion', { target, size: '2xl', interactive: false });
    instance.playSequence(sequence, { mode: 'loop' });
  }
</` + `script>`;

    case 'json':
      return seqJson;

    case 'vanilla':
    default:
      return `import { createCustomEmoji, createEmoji } from 'wissive';

const sequence = ${seqJson};

const target = document.getElementById('emoji-container');
createCustomEmoji('mi-animacion', { silhouette: sequence[0]?.silhouette || 'circle' });

const emoji = createEmoji('mi-animacion', {
  target: target,
  size: '2xl',
  interactive: false,
});

emoji.playSequence(sequence, { mode: 'loop' });`;
  }
}
