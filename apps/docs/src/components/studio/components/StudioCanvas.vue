<script setup lang="ts">
import { ref } from 'vue';
import type { KeyframeData, StageBackgroundType } from '../types';
import { buildFaceSvg } from '../utils/exportGenerators';

const props = defineProps<{
  currentFrame: KeyframeData;
  previousFrame: KeyframeData | null;
  activeFrameIndex: number;
  zoomScale: number;
  stageBackground: StageBackgroundType;
  onionSkinEnabled: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:stageBackground', bg: StageBackgroundType): void;
  (e: 'update:onionSkinEnabled', enabled: boolean): void;
}>();

const stageSlot = ref<HTMLDivElement | null>(null);

defineExpose({
  stageSlot,
});
</script>

<template>
  <div
    class="studio-canvas-stage"
    :class="{
      'stage-bg-gradient': stageBackground === 'gradient',
      'stage-bg-transparent': stageBackground === 'transparent',
      'stage-bg-light': stageBackground === 'light',
      'stage-bg-dark': stageBackground === 'dark',
    }"
  >
    <!-- Top Left Floating Toolbar -->
    <div class="stage-top-toolbar">
      <div class="stage-tool-pill">
        <span class="stage-frame-dot" :style="{ background: currentFrame.color }"></span>
        <span>Frame {{ activeFrameIndex + 1 }}: {{ currentFrame.label }}</span>
      </div>

      <!-- Onion Skinning Toggle -->
      <button
        type="button"
        class="onion-toggle-btn"
        :class="{ active: onionSkinEnabled }"
        title="Piel de Cebolla: Muestra el fotograma anterior semitransparente"
        @click="emit('update:onionSkinEnabled', !onionSkinEnabled)"
      >
        Onion Skin
      </button>

      <!-- Stage Background Mode Selector -->
      <div class="stage-tool-pill">
        <button
          type="button"
          class="stage-tool-btn"
          :class="{ active: stageBackground === 'gradient' }"
          @click="emit('update:stageBackground', 'gradient')"
        >
          Gradiente
        </button>
        <button
          type="button"
          class="stage-tool-btn"
          :class="{ active: stageBackground === 'transparent' }"
          @click="emit('update:stageBackground', 'transparent')"
        >
          Cuadrícula
        </button>
        <button
          type="button"
          class="stage-tool-btn"
          :class="{ active: stageBackground === 'light' }"
          @click="emit('update:stageBackground', 'light')"
        >
          Luz
        </button>
        <button
          type="button"
          class="stage-tool-btn"
          :class="{ active: stageBackground === 'dark' }"
          @click="emit('update:stageBackground', 'dark')"
        >
          Oscuro
        </button>
      </div>
    </div>

    <!-- Onion Skin Ghost Layer -->
    <div
      v-if="onionSkinEnabled && previousFrame"
      class="onion-skin-layer"
      v-html="buildFaceSvg(previousFrame, 220)"
    />

    <!-- Main Animated Emoji Mount Point -->
    <div
      class="studio-main-emoji"
      :style="{ transform: `scale(${zoomScale / 100})` }"
      ref="stageSlot"
    />
  </div>
</template>
