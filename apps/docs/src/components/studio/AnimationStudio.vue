<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import {
  createEmoji,
  createCustomEmoji,
  type WissiveInstance,
  type FaceParameters,
} from 'wissive';

import './studio.css';
import type { KeyframeData, StageBackgroundType, StatePreset, SequenceTemplate } from './types';
import { createDefaultKeyframe } from './types';
import { INITIAL_FRAMES } from './constants/templates';

import StudioCanvas from './components/StudioCanvas.vue';
import StudioInspector from './components/StudioInspector.vue';
import StudioTimeline from './components/StudioTimeline.vue';
import StudioExportModal from './components/StudioExportModal.vue';
import StudioTemplateModal from './components/StudioTemplateModal.vue';
import StudioImportModal from './components/StudioImportModal.vue';

// ─── Sequence State ──────────────────────────────────────────────────
const frames = ref<KeyframeData[]>(INITIAL_FRAMES);
const activeFrameIndex = ref(0);

const currentFrame = computed(() => {
  return frames.value[activeFrameIndex.value] || frames.value[0];
});

const previousFrame = computed(() => {
  if (frames.value.length <= 1) return null;
  const prevIdx = activeFrameIndex.value > 0 ? activeFrameIndex.value - 1 : frames.value.length - 1;
  return frames.value[prevIdx];
});

const totalDuration = computed(() => {
  return frames.value.reduce((acc, f) => acc + (Number(f.duration) || 0), 0);
});

const frameOffsets = computed(() => {
  let acc = 0;
  return frames.value.map((f) => {
    const start = acc;
    const dur = Math.max(0.1, Number(f.duration) || 1.0);
    const end = acc + dur;
    acc = end;
    return { start, end, duration: dur };
  });
});

const rulerTicks = computed(() => {
  const total = Math.ceil(totalDuration.value) || 10;
  const step = total > 8 ? 2 : 1;
  const ticks: { time: number; label: string; leftPercent: number }[] = [];
  for (let t = 0; t <= total; t += step) {
    const pct = totalDuration.value > 0 ? (t / totalDuration.value) * 100 : 0;
    if (pct <= 100) {
      ticks.push({ time: t, label: `${t}s`, leftPercent: pct });
    }
  }
  return ticks;
});

const scrubberPercent = computed(() => {
  if (totalDuration.value <= 0) return 0;
  return Math.min(100, Math.max(0, (currentTime.value / totalDuration.value) * 100));
});

// ─── Viewport & Environment State ────────────────────────────────────
const zoomScale = ref(102);
const playbackSpeed = ref<number>(1.0);
const stageBackground = ref<StageBackgroundType>('gradient');
const onionSkinEnabled = ref(false);

const userCustomColors = ref<string[]>([
  '#FF5252',
  '#7C4DFF',
  '#00E676',
  '#FFD600',
  '#FF4081',
  '#00B0FF',
]);

// ─── Modals State ────────────────────────────────────────────────────
const showExportModal = ref(false);
const showTemplateModal = ref(false);
const showImportModal = ref(false);

// ─── Playback Engine ─────────────────────────────────────────────────
const isPlaying = ref(true);
const currentTime = ref(0);
const canvasComponentRef = ref<InstanceType<typeof StudioCanvas> | null>(null);

let emojiInstance: WissiveInstance | null = null;
let rafId: number | null = null;
let lastTime: number | null = null;

function initEmojiInstance() {
  const stageSlot = canvasComponentRef.value?.stageSlot;
  if (!stageSlot) return;

  if (emojiInstance) {
    emojiInstance.destroy();
    emojiInstance = null;
  }
  stageSlot.innerHTML = '';

  const initialSil = currentFrame.value?.silhouette || 'heart';
  const customName = 'studio_frame_emoji';
  createCustomEmoji(customName, {
    baseColor: currentFrame.value?.color || '#7ED321',
    silhouette: initialSil,
  });

  emojiInstance = createEmoji(customName, {
    target: stageSlot,
    size: '2xl',
    sound: false,
    interactive: false,
    draggable: true,
    gazeTracking: false,
    autonomousStates: false,
    ambientParticles: false,
  });

  if (currentFrame.value) {
    applyFrameToEmoji(currentFrame.value, false);
  }
}

function applyFrameToEmoji(frame: KeyframeData, triggers = true) {
  if (!emojiInstance || !frame) return;

  const transitionType = frame.transitionType || 'smooth';
  emojiInstance.setSpringConfig?.(transitionType);

  if (frame.silhouette) {
    const morphDur = triggers ? Math.min(400, Math.round((frame.duration || 1) * 1000 * 0.4)) : 0;
    emojiInstance.setSilhouette(frame.silhouette, morphDur);
  }

  if (frame.color) {
    emojiInstance.setTheme({ baseColor: frame.color });
  }

  const params: Partial<FaceParameters> = {
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
  };

  if (transitionType === 'bouncy' && triggers) {
    params.bob = -6;
  }

  emojiInstance.playSequence([{ params, duration: Math.round(frame.duration * 1000) }]);

  if (triggers) {
    if (frame.bounce) emojiInstance.bounce?.();
    if (frame.spin) emojiInstance.spin?.(1);
  }
}

function updatePlayback(timestamp: number) {
  if (!isPlaying.value || totalDuration.value <= 0) {
    lastTime = null;
    return;
  }

  if (lastTime === null) {
    lastTime = timestamp;
  }

  const delta = ((timestamp - lastTime) / 1000) * playbackSpeed.value;
  lastTime = timestamp;

  let newTime = currentTime.value + delta;
  if (newTime >= totalDuration.value) {
    newTime = 0;
  }
  currentTime.value = newTime;

  const offsets = frameOffsets.value;
  let foundIndex = 0;
  for (let i = 0; i < offsets.length; i++) {
    if (newTime >= offsets[i].start && (newTime < offsets[i].end || i === offsets.length - 1)) {
      foundIndex = i;
      break;
    }
  }

  if (foundIndex !== activeFrameIndex.value) {
    activeFrameIndex.value = foundIndex;
    const f = frames.value[foundIndex];
    if (f) applyFrameToEmoji(f, true);
  }

  if (isPlaying.value) {
    rafId = requestAnimationFrame(updatePlayback);
  }
}

function togglePlay() {
  isPlaying.value = !isPlaying.value;
  if (isPlaying.value) {
    lastTime = null;
    rafId = requestAnimationFrame(updatePlayback);
  } else if (rafId) {
    cancelAnimationFrame(rafId);
    rafId = null;
    lastTime = null;
  }
}

function seekToFrame(index: number) {
  const offsets = frameOffsets.value;
  if (offsets[index]) {
    currentTime.value = offsets[index].start;
    activeFrameIndex.value = index;
    const f = frames.value[index];
    if (f) applyFrameToEmoji(f, false);
  }
}

function handleTrackScrub(time: number) {
  currentTime.value = time;
  const offsets = frameOffsets.value;
  for (let i = 0; i < offsets.length; i++) {
    if (time >= offsets[i].start && (time < offsets[i].end || i === offsets.length - 1)) {
      if (activeFrameIndex.value !== i) {
        activeFrameIndex.value = i;
        const f = frames.value[i];
        if (f) applyFrameToEmoji(f, false);
      }
      break;
    }
  }
}

// ─── Keyframe Operations ─────────────────────────────────────────────
function addFrame() {
  const prev = currentFrame.value;
  const newF = createDefaultKeyframe(`Frame ${frames.value.length + 1}`, {
    silhouette: prev.silhouette,
    color: prev.color,
    gazeX: prev.gazeX,
    gazeY: prev.gazeY,
    mouthCurve: prev.mouthCurve,
    eyeType: prev.eyeType,
    hasBrows: prev.hasBrows,
    browTilt: prev.browTilt,
    browY: prev.browY,
  });
  frames.value.push(newF);
  activeFrameIndex.value = frames.value.length - 1;
  seekToFrame(activeFrameIndex.value);
}

function duplicateFrame(index: number) {
  const source = frames.value[index];
  if (!source) return;
  const dup = createDefaultKeyframe(`${source.label} (Copia)`, { ...source });
  frames.value.splice(index + 1, 0, dup);
  activeFrameIndex.value = index + 1;
  seekToFrame(activeFrameIndex.value);
}

function removeFrame(index: number) {
  if (frames.value.length <= 1) return;
  frames.value.splice(index, 1);
  if (activeFrameIndex.value >= frames.value.length) {
    activeFrameIndex.value = Math.max(0, frames.value.length - 1);
  }
  seekToFrame(activeFrameIndex.value);
}

function moveFrame(payload: { index: number; direction: -1 | 1 }) {
  const { index, direction } = payload;
  const target = index + direction;
  if (target < 0 || target >= frames.value.length) return;
  const item = frames.value.splice(index, 1)[0];
  frames.value.splice(target, 0, item);
  activeFrameIndex.value = target;
  seekToFrame(target);
}

function applyTemplate(template: SequenceTemplate) {
  frames.value = template.frames.map((f) => createDefaultKeyframe(f.label, { ...f }));
  activeFrameIndex.value = 0;
  seekToFrame(0);
  showTemplateModal.value = false;
}

function importSequence(newFrames: KeyframeData[]) {
  frames.value = newFrames;
  activeFrameIndex.value = 0;
  seekToFrame(0);
  showImportModal.value = false;
}

function applyLibraryState(preset: StatePreset) {
  const f = currentFrame.value;
  if (!f || !preset) return;

  f.label = preset.name;
  const d = preset.data;
  if (d.silhouette) f.silhouette = d.silhouette;
  if (d.color) f.color = d.color;
  f.eyeType = d.eyeType ?? 0;
  f.eyeScale = d.eyeScale ?? 1.0;
  f.eyeOpen = d.eyeOpen ?? 1.0;
  f.mouthType = d.mouthType ?? 0;
  f.mouthCurve = d.mouthCurve ?? 0.0;
  f.mouthOpen = d.mouthOpen ?? 0.0;
  f.hasBrows = d.hasBrows ?? false;
  f.browTilt = d.browTilt ?? 0;
  f.browY = d.browY ?? 0;
  f.cheek = d.cheek ?? 0;
  f.sweat = d.sweat ?? 0;
  f.zzz = d.zzz ?? 0;
  f.tears = d.tears ?? 0;
  f.storm = d.storm ?? 0;
  f.scribble = d.scribble ?? 0;
  f.puff = d.puff ?? 0;
  f.gazeX = d.gazeX ?? 0;
  f.gazeY = d.gazeY ?? 0;
  f.particles = false;
  f.bounce = d.bounce ?? false;
  f.spin = d.spin ?? false;
  f.transitionType = d.transitionType ?? 'smooth';

  applyFrameToEmoji(f, true);
}

function addColorToCustomPalette(color: string) {
  const clean = color.trim();
  if (clean && !userCustomColors.value.includes(clean)) {
    userCustomColors.value.push(clean);
  }
}

function removeColorFromCustomPalette(index: number) {
  userCustomColors.value.splice(index, 1);
}

// ─── Watchers & Lifecycle ────────────────────────────────────────────
watch(
  currentFrame,
  () => {
    if (!isPlaying.value && currentFrame.value) {
      applyFrameToEmoji(currentFrame.value, false);
    }
  },
  { deep: true }
);

onMounted(() => {
  initEmojiInstance();
  rafId = requestAnimationFrame(updatePlayback);
});

onUnmounted(() => {
  if (rafId) cancelAnimationFrame(rafId);
  emojiInstance?.destroy();
  emojiInstance = null;
});
</script>

<template>
  <div class="studio-wrapper">
    <!-- Center Stage Canvas -->
    <StudioCanvas
      ref="canvasComponentRef"
      :current-frame="currentFrame"
      :previous-frame="previousFrame"
      :active-frame-index="activeFrameIndex"
      :zoom-scale="zoomScale"
      v-model:stage-background="stageBackground"
      v-model:onion-skin-enabled="onionSkinEnabled"
    />

    <!-- Right Floating Property Inspector -->
    <StudioInspector
      :current-frame="currentFrame"
      :user-custom-colors="userCustomColors"
      @frame-changed="(triggers) => applyFrameToEmoji(currentFrame, triggers ?? false)"
      @add-color-to-custom-palette="addColorToCustomPalette"
      @remove-color-from-custom-palette="removeColorFromCustomPalette"
      @apply-state-preset="applyLibraryState"
    />

    <!-- Bottom Full-Width Timeline Bar -->
    <StudioTimeline
      :frames="frames"
      :active-frame-index="activeFrameIndex"
      :current-time="currentTime"
      :total-duration="totalDuration"
      :is-playing="isPlaying"
      :playback-speed="playbackSpeed"
      :zoom-scale="zoomScale"
      :scrubber-percent="scrubberPercent"
      :ruler-ticks="rulerTicks"
      @update:playback-speed="playbackSpeed = $event"
      @update:zoom-scale="zoomScale = $event"
      @toggle-play="togglePlay"
      @seek-to-frame="seekToFrame"
      @add-frame="addFrame"
      @duplicate-frame="duplicateFrame"
      @remove-frame="removeFrame"
      @move-frame="moveFrame"
      @open-templates="showTemplateModal = true"
      @open-import="showImportModal = true"
      @open-export="showExportModal = true"
      @track-scrub="handleTrackScrub"
    />

    <!-- Modals -->
    <StudioTemplateModal
      :show="showTemplateModal"
      @close="showTemplateModal = false"
      @select-template="applyTemplate"
    />

    <StudioImportModal
      :show="showImportModal"
      @close="showImportModal = false"
      @import-sequence="importSequence"
    />

    <StudioExportModal
      :show="showExportModal"
      :frames="frames"
      :current-frame="currentFrame"
      :total-duration="totalDuration"
      :frame-offsets="frameOffsets"
      @close="showExportModal = false"
    />
  </div>
</template>
