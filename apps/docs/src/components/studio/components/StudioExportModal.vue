<script setup lang="ts">
import { ref, computed } from 'vue';
import type { KeyframeData } from '../types';
import {
  downloadGif,
  downloadStandaloneSvg,
  downloadSpriteSheet,
  downloadJsonFile,
  generateFrameworkCode,
  buildFaceSvg,
} from '../utils/exportGenerators';
import { getSilhouetteProfile } from 'wissive';

const props = defineProps<{
  show: boolean;
  frames: KeyframeData[];
  currentFrame: KeyframeData;
  totalDuration: number;
  frameOffsets: { start: number; end: number; duration: number }[];
}>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const exportTab = ref<'gif' | 'svg' | 'spritesheet' | 'vanilla' | 'vue' | 'react' | 'astro' | 'json'>('gif');
const copyFeedback = ref(false);

// GIF settings
const isGeneratingGif = ref(false);
const gifProgress = ref(0);
const gifSize = ref<128 | 256 | 512>(256);
const gifFps = ref<15 | 30>(30);
const gifBg = ref<'transparent' | 'white' | 'dark' | 'custom'>('transparent');
const gifCustomBg = ref('#7ED321');

const currentCode = computed(() => {
  return generateFrameworkCode(props.frames, exportTab.value);
});

async function handleDownloadGif() {
  if (isGeneratingGif.value) return;
  isGeneratingGif.value = true;
  gifProgress.value = 0;

  try {
    await downloadGif(props.frames, props.totalDuration, props.frameOffsets, {
      size: gifSize.value,
      fps: gifFps.value,
      bg: gifBg.value,
      customBg: gifCustomBg.value,
      onProgress: (pct) => {
        gifProgress.value = pct;
      },
    });
  } catch (err) {
    console.error('Error downloading GIF:', err);
  } finally {
    isGeneratingGif.value = false;
  }
}

function handleDownloadSvg() {
  downloadStandaloneSvg(props.currentFrame);
}

function handleDownloadSpriteSheet() {
  downloadSpriteSheet(props.frames);
}

function handleDownloadJson() {
  downloadJsonFile(currentCode.value);
}

async function copyCode() {
  try {
    await navigator.clipboard.writeText(currentCode.value);
    copyFeedback.value = true;
    setTimeout(() => {
      copyFeedback.value = false;
    }, 2000);
  } catch (err) {
    console.error('Failed to copy code', err);
  }
}
</script>

<template>
  <div v-if="show" class="studio-modal-backdrop" @click.self="emit('close')">
    <div class="studio-modal-box">
      <div class="studio-modal-top">
        <span class="studio-modal-title-text">Exportar Multimedia & Código</span>
        <button class="studio-modal-close-btn" type="button" @click="emit('close')">✕</button>
      </div>

      <div class="studio-modal-content-inner">
        <div class="export-framework-tabs">
          <button
            type="button"
            class="export-tab-chip"
            :class="{ active: exportTab === 'gif' }"
            @click="exportTab = 'gif'"
          >
            GIF Animado
          </button>
          <button
            type="button"
            class="export-tab-chip"
            :class="{ active: exportTab === 'svg' }"
            @click="exportTab = 'svg'"
          >
            SVG
          </button>
          <button
            type="button"
            class="export-tab-chip"
            :class="{ active: exportTab === 'spritesheet' }"
            @click="exportTab = 'spritesheet'"
          >
            Sprite Sheet
          </button>
          <button
            type="button"
            class="export-tab-chip"
            :class="{ active: exportTab === 'vanilla' }"
            @click="exportTab = 'vanilla'"
          >
            Vanilla JS
          </button>
          <button
            type="button"
            class="export-tab-chip"
            :class="{ active: exportTab === 'vue' }"
            @click="exportTab = 'vue'"
          >
            Vue 3
          </button>
          <button
            type="button"
            class="export-tab-chip"
            :class="{ active: exportTab === 'react' }"
            @click="exportTab = 'react'"
          >
            React
          </button>
          <button
            type="button"
            class="export-tab-chip"
            :class="{ active: exportTab === 'astro' }"
            @click="exportTab = 'astro'"
          >
            Astro
          </button>
          <button
            type="button"
            class="export-tab-chip"
            :class="{ active: exportTab === 'json' }"
            @click="exportTab = 'json'"
          >
            JSON
          </button>
        </div>

        <!-- TAB 1: GIF ANIMADO -->
        <div v-if="exportTab === 'gif'" class="export-media-box">
          <div class="export-options-grid">
            <div>
              <label style="font-size: 0.72rem; font-weight: 700; display: block; margin-bottom: 0.35rem;">
                Resolución
              </label>
              <div style="display: flex; gap: 0.4rem;">
                <button
                  v-for="s in [128, 256, 512]"
                  :key="s"
                  type="button"
                  class="state-category-pill"
                  :class="{ active: gifSize === s }"
                  @click="gifSize = s as (128 | 256 | 512)"
                >
                  {{ s }}x{{ s }}px
                </button>
              </div>
            </div>

            <div>
              <label style="font-size: 0.72rem; font-weight: 700; display: block; margin-bottom: 0.35rem;">
                Frecuencia de Fotogramas (FPS)
              </label>
              <div style="display: flex; gap: 0.4rem;">
                <button
                  v-for="f in [15, 30]"
                  :key="f"
                  type="button"
                  class="state-category-pill"
                  :class="{ active: gifFps === f }"
                  @click="gifFps = f as (15 | 30)"
                >
                  {{ f }} FPS
                </button>
              </div>
            </div>

            <div style="grid-column: span 2;">
              <label style="font-size: 0.72rem; font-weight: 700; display: block; margin-bottom: 0.35rem;">
                Fondo del GIF
              </label>
              <div style="display: flex; gap: 0.4rem; align-items: center;">
                <button
                  type="button"
                  class="state-category-pill"
                  :class="{ active: gifBg === 'transparent' }"
                  @click="gifBg = 'transparent'"
                >
                  Transparente (Alpha)
                </button>
                <button
                  type="button"
                  class="state-category-pill"
                  :class="{ active: gifBg === 'white' }"
                  @click="gifBg = 'white'"
                >
                  Blanco
                </button>
                <button
                  type="button"
                  class="state-category-pill"
                  :class="{ active: gifBg === 'dark' }"
                  @click="gifBg = 'dark'"
                >
                  Oscuro (#121217)
                </button>
                <input
                  type="color"
                  v-model="gifCustomBg"
                  style="width: 32px; height: 28px; border: none; border-radius: 6px; cursor: pointer;"
                  @input="gifBg = 'custom'"
                />
              </div>
            </div>
          </div>

          <!-- GIF Progress -->
          <div v-if="isGeneratingGif">
            <div style="font-size: 0.75rem; font-weight: 600; color: #3b82f6;">
              Renderizando fotogramas... {{ gifProgress }}%
            </div>
            <div class="export-progress-wrap">
              <div class="export-progress-bar" :style="{ width: `${gifProgress}%` }"></div>
            </div>
          </div>

          <div style="display: flex; justify-content: flex-end; margin-top: 0.5rem;">
            <button
              type="button"
              class="export-primary-btn"
              :disabled="isGeneratingGif"
              @click="handleDownloadGif"
            >
              {{ isGeneratingGif ? 'Generando GIF...' : 'Generar y Descargar .gif' }}
            </button>
          </div>
        </div>

        <!-- TAB 2: SVG ANIMADO -->
        <div v-if="exportTab === 'svg'" class="export-media-box">
          <div style="font-size: 0.78rem; color: var(--text-sub); line-height: 1.45;">
            Descarga un archivo <strong>.svg vectorial puro</strong> de alta fidelidad listo para usar en Figma, Illustrator, sitios web o documentos sin scripts externos.
          </div>

          <div style="display: flex; justify-content: center; padding: 1.5rem; background: var(--bg-light); border-radius: 12px; border: 1px solid var(--border-soft);">
            <div v-html="buildFaceSvg(currentFrame, 180)" />
          </div>

          <div style="display: flex; justify-content: flex-end;">
            <button type="button" class="export-primary-btn" @click="handleDownloadSvg">
              Descargar archivo .svg
            </button>
          </div>
        </div>

        <!-- TAB 3: SPRITE SHEET PNG -->
        <div v-if="exportTab === 'spritesheet'" class="export-media-box">
          <div style="font-size: 0.78rem; color: var(--text-sub); line-height: 1.45;">
            Genera una tira horizontal PNG transparente con todos los fotogramas clave alineados para su uso en videojuegos (Unity, Godot, Unreal, Phaser).
          </div>

          <div class="spritesheet-preview-scroll">
            <div style="display: flex; gap: 0.75rem; min-width: max-content;">
              <div
                v-for="(f, fIdx) in frames"
                :key="f.id"
                style="display: flex; flex-direction: column; align-items: center; gap: 0.3rem;"
              >
                <div v-html="buildFaceSvg(f, 80)" />
                <span style="font-size: 0.65rem; color: var(--text-sub);">F{{ fIdx + 1 }}</span>
              </div>
            </div>
          </div>

          <div style="display: flex; justify-content: flex-end;">
            <button type="button" class="export-primary-btn" @click="handleDownloadSpriteSheet">
              Descargar Sprite Sheet PNG
            </button>
          </div>
        </div>

        <!-- TABS DE CÓDIGO -->
        <div v-if="['vanilla', 'vue', 'react', 'astro', 'json'].includes(exportTab)">
          <div class="export-code-panel">
            <pre class="export-code-pre"><code>{{ currentCode }}</code></pre>
          </div>

          <div class="export-actions-row">
            <span v-if="copyFeedback" class="export-copy-confirm">
              ✓ ¡Copiado al portapapeles!
            </span>
            <button class="export-primary-btn" type="button" @click="copyCode">
              Copiar Código
            </button>
            <button
              v-if="exportTab === 'json'"
              class="export-primary-btn"
              type="button"
              style="background: #3b82f6; color: white;"
              @click="handleDownloadJson"
            >
              Descargar .json
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
