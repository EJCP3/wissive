<script setup lang="ts">
import { ref, computed } from 'vue';
import type { KeyframeData } from '../types';

const props = defineProps<{
  frames: KeyframeData[];
  activeFrameIndex: number;
  currentTime: number;
  totalDuration: number;
  isPlaying: boolean;
  playbackSpeed: number;
  zoomScale: number;
  scrubberPercent: number;
  rulerTicks: { time: number; label: string; leftPercent: number }[];
}>();

const emit = defineEmits<{
  (e: 'update:playbackSpeed', speed: number): void;
  (e: 'update:zoomScale', zoom: number): void;
  (e: 'togglePlay'): void;
  (e: 'seekToFrame', index: number): void;
  (e: 'addFrame'): void;
  (e: 'duplicateFrame', index: number): void;
  (e: 'removeFrame', index: number): void;
  (e: 'moveFrame', payload: { index: number; direction: -1 | 1 }): void;
  (e: 'openTemplates'): void;
  (e: 'openImport'): void;
  (e: 'openExport'): void;
  (e: 'trackScrub', time: number): void;
}>();

const trackInnerRef = ref<HTMLDivElement | null>(null);

function formatTime(seconds: number): string {
  const s = Math.max(0, Math.floor(seconds));
  const mins = Math.floor(s / 60);
  const secs = s % 60;
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

function onTrackPointerDown(e: PointerEvent) {
  if (!trackInnerRef.value || props.totalDuration <= 0) return;

  const rect = trackInnerRef.value.getBoundingClientRect();
  const updateFromPointer = (clientX: number) => {
    const x = Math.max(0, Math.min(rect.width, clientX - rect.left));
    const pct = x / rect.width;
    const t = pct * props.totalDuration;
    emit('trackScrub', t);
  };

  updateFromPointer(e.clientX);

  const onPointerMove = (moveEvt: PointerEvent) => {
    updateFromPointer(moveEvt.clientX);
  };

  const onPointerUp = () => {
    window.removeEventListener('pointermove', onPointerMove);
    window.removeEventListener('pointerup', onPointerUp);
  };

  window.addEventListener('pointermove', onPointerMove);
  window.addEventListener('pointerup', onPointerUp);
}
</script>

<template>
  <div class="studio-bottom-timeline-bar">
    <!-- Top Row Controls -->
    <div class="timeline-top-controls">
      <div class="timeline-left-controls">
        <span style="font-size: 0.85rem; font-weight: 700;">Secuencia: {{ frames.length }} Frames</span>

        <!-- Quick Action Buttons -->
        <button
          type="button"
          class="timeline-action-btn"
          title="Duplicar frame actual"
          @click="emit('duplicateFrame', activeFrameIndex)"
        >
          Duplicar
        </button>

        <button
          type="button"
          class="timeline-action-btn"
          title="Agregar nuevo frame"
          @click="emit('addFrame')"
        >
          + Nuevo Frame
        </button>

        <!-- Template Presets Button -->
        <button
          type="button"
          class="timeline-action-btn"
          style="background: rgba(59, 130, 246, 0.1); color: #3b82f6; border-color: rgba(59, 130, 246, 0.2);"
          title="Cargar plantilla de secuencia prehecha"
          @click="emit('openTemplates')"
        >
          Plantillas
        </button>

        <!-- Import JSON Button -->
        <button
          type="button"
          class="timeline-action-btn"
          title="Cargar secuencia desde archivo JSON o código copiado"
          @click="emit('openImport')"
        >
          Importar
        </button>

        <!-- Playback Speed Control -->
        <div class="timeline-speed-pills">
          <button
            v-for="spd in [0.5, 1.0, 1.5, 2.0]"
            :key="spd"
            type="button"
            class="speed-pill-btn"
            :class="{ active: playbackSpeed === spd }"
            @click="emit('update:playbackSpeed', spd)"
          >
            {{ spd }}x
          </button>
        </div>
      </div>

      <!-- Center Time & Play Button -->
      <div class="timeline-center-playback">
        <span class="timeline-time-text">{{ formatTime(currentTime) }}</span>
        <button
          type="button"
          class="timeline-big-play-btn"
          :aria-label="isPlaying ? 'Pausar' : 'Reproducir'"
          @click="emit('togglePlay')"
        >
          <svg v-if="isPlaying" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <rect x="6" y="4" width="4" height="16" rx="1.5" />
            <rect x="14" y="4" width="4" height="16" rx="1.5" />
          </svg>
          <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="6 3 20 12 6 21 6 3" />
          </svg>
        </button>
        <span class="timeline-time-text timeline-time-muted">{{ formatTime(totalDuration) }}</span>
      </div>

      <!-- Right Export Button -->
      <button class="timeline-export-btn" type="button" @click="emit('openExport')">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
        Exportar Multimedia
      </button>
    </div>

    <!-- Full-Width Track & Ruler Area -->
    <div class="timeline-full-track-box">
      <div class="timeline-full-ruler">
        <div
          v-for="tick in rulerTicks"
          :key="tick.time"
          class="timeline-full-tick"
          :style="{ left: `${tick.leftPercent}%` }"
        >
          {{ tick.label }}
        </div>
      </div>

      <!-- Track Container -->
      <div
        class="timeline-track-inner"
        ref="trackInnerRef"
        @pointerdown="onTrackPointerDown"
      >
        <!-- Scrubber Needle -->
        <div class="timeline-full-scrubber" :style="{ left: `${scrubberPercent}%` }">
          <div class="timeline-full-scrubber-head"></div>
        </div>

        <!-- Horizontal Frames Sequence -->
        <div class="timeline-full-clips-row">
          <div
            v-for="(frame, idx) in frames"
            :key="frame.id"
            class="timeline-full-clip-card"
            :class="{ active: activeFrameIndex === idx }"
            :style="{ flex: `${frame.duration} 1 0%` }"
            @click.stop="emit('seekToFrame', idx)"
          >
            <button
              type="button"
              class="clip-delete-pill"
              title="Eliminar frame"
              @click.stop="emit('removeFrame', idx)"
            >
              ✕
            </button>

            <span class="clip-badge-dot" :style="{ background: frame.color }"></span>

            <div class="clip-label-text">{{ frame.label }}</div>

            <div class="clip-duration-text">{{ frame.duration.toFixed(1).replace('.', ',') }} s</div>

            <!-- Reordering Arrows (Move Left / Right) -->
            <div class="clip-reorder-row">
              <button
                type="button"
                class="clip-move-btn"
                :disabled="idx === 0"
                title="Mover a la izquierda"
                @click.stop="emit('moveFrame', { index: idx, direction: -1 })"
              >
                ◀
              </button>
              <button
                type="button"
                class="clip-move-btn"
                :disabled="idx === frames.length - 1"
                title="Mover a la derecha"
                @click.stop="emit('moveFrame', { index: idx, direction: 1 })"
              >
                ▶
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom Meta Row (Zoom & Info) -->
    <div class="timeline-bottom-meta-row">
      <div class="timeline-zoom-controls">
        <input
          type="range"
          min="60"
          max="160"
          step="2"
          :value="zoomScale"
          @input="emit('update:zoomScale', Number(($event.target as HTMLInputElement).value))"
          class="timeline-zoom-slider"
        />
        <span>{{ zoomScale }} %</span>
      </div>

      <span>{{ formatTime(currentTime) }} / {{ formatTime(totalDuration) }}</span>
    </div>
  </div>
</template>
