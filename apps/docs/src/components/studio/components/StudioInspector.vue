<script setup lang="ts">
import { ref, computed } from 'vue';
import type { KeyframeData, StatePreset } from '../types';
import { SILHOUETTES, PRESET_COLORS, ALL_EYE_TYPES, ALL_MOUTH_TYPES } from '../constants/catalog';
import { STATE_CATEGORIES, STATE_PRESETS } from '../constants/presets';

const props = defineProps<{
  currentFrame: KeyframeData;
  userCustomColors: string[];
}>();

const emit = defineEmits<{
  (e: 'frameChanged', triggers?: boolean): void;
  (e: 'addColorToCustomPalette', color: string): void;
  (e: 'removeColorFromCustomPalette', index: number): void;
  (e: 'applyStatePreset', preset: StatePreset): void;
}>();

const inspectorTab = ref<'timing' | 'shape' | 'eyes' | 'mouth' | 'color' | 'brows' | 'effects' | 'presets'>('timing');
const selectedStateCategory = ref<string>('all');

const hasEyeDropper = typeof window !== 'undefined' && 'EyeDropper' in window;

async function openEyeDropper() {
  try {
    // @ts-ignore
    const eyeDropper = new window.EyeDropper();
    const result = await eyeDropper.open();
    if (result?.sRGBHex && props.currentFrame) {
      props.currentFrame.color = result.sRGBHex;
      emit('frameChanged', false);
    }
  } catch (err) {
    // EyeDropper canceled or unsupported
  }
}

const filteredStatePresets = computed(() => {
  if (selectedStateCategory.value === 'all') {
    return STATE_PRESETS;
  }
  return STATE_PRESETS.filter((p) => p.category === selectedStateCategory.value);
});
</script>

<template>
  <div class="studio-right-inspector">
    <!-- Tabs Navigation -->
    <div class="inspector-tabs-row">
      <button
        type="button"
        class="inspector-tab-btn"
        :class="{ active: inspectorTab === 'timing' }"
        @click="inspectorTab = 'timing'"
      >
        Timing
      </button>
      <button
        type="button"
        class="inspector-tab-btn"
        :class="{ active: inspectorTab === 'shape' }"
        @click="inspectorTab = 'shape'"
      >
        Silueta
      </button>
      <button
        type="button"
        class="inspector-tab-btn"
        :class="{ active: inspectorTab === 'eyes' }"
        @click="inspectorTab = 'eyes'"
      >
        Ojos
      </button>
      <button
        type="button"
        class="inspector-tab-btn"
        :class="{ active: inspectorTab === 'mouth' }"
        @click="inspectorTab = 'mouth'"
      >
        Boca
      </button>
      <button
        type="button"
        class="inspector-tab-btn"
        :class="{ active: inspectorTab === 'color' }"
        @click="inspectorTab = 'color'"
      >
        Color
      </button>
      <button
        type="button"
        class="inspector-tab-btn"
        :class="{ active: inspectorTab === 'brows' }"
        @click="inspectorTab = 'brows'"
      >
        Cejas
      </button>
      <button
        type="button"
        class="inspector-tab-btn"
        :class="{ active: inspectorTab === 'effects' }"
        @click="inspectorTab = 'effects'"
      >
        Efectos
      </button>
      <button
        type="button"
        class="inspector-tab-btn"
        :class="{ active: inspectorTab === 'presets' }"
        @click="inspectorTab = 'presets'"
      >
        39 Estados
      </button>
    </div>

    <!-- TAB: TIMING & TRANSICION -->
    <div v-if="inspectorTab === 'timing'" class="inspector-section">
      <div class="inspector-section-label">
        <span>Nombre del Fotograma</span>
      </div>
      <input
        type="text"
        v-model="currentFrame.label"
        class="studio-input-select"
        style="width: 100%;"
        placeholder="Ej: Sorpresa al ver usuario"
      />

      <div class="inspector-section-label" style="margin-top: 0.5rem;">
        <span>Duración del Fotograma</span>
        <span style="font-family: monospace; font-weight: 700;">{{ currentFrame.duration.toFixed(2) }}s</span>
      </div>
      <div style="display: flex; gap: 0.6rem; align-items: center;">
        <input
          type="range"
          min="0.2"
          max="6"
          step="0.1"
          v-model.number="currentFrame.duration"
          style="flex: 1;"
        />
        <input
          type="number"
          min="0.1"
          max="15"
          step="0.1"
          v-model.number="currentFrame.duration"
          class="studio-input-select"
          style="width: 70px; font-family: monospace;"
        />
      </div>

      <div class="inspector-section-label" style="margin-top: 0.5rem;">
        <span>Curva / Perfil de Transición</span>
      </div>
      <div class="effect-chips-grid">
        <button
          type="button"
          class="effect-chip-btn"
          :class="{ active: currentFrame.transitionType === 'smooth' }"
          @click="currentFrame.transitionType = 'smooth'; emit('frameChanged', true)"
        >
          <span>Suave (Natural)</span>
        </button>
        <button
          type="button"
          class="effect-chip-btn"
          :class="{ active: currentFrame.transitionType === 'bouncy' }"
          @click="currentFrame.transitionType = 'bouncy'; emit('frameChanged', true)"
        >
          <span>Elástico (Rebote)</span>
        </button>
        <button
          type="button"
          class="effect-chip-btn"
          :class="{ active: currentFrame.transitionType === 'snappy' }"
          @click="currentFrame.transitionType = 'snappy'; emit('frameChanged', true)"
        >
          <span>Rápido (Snappy)</span>
        </button>
        <button
          type="button"
          class="effect-chip-btn"
          :class="{ active: currentFrame.transitionType === 'gentle' }"
          @click="currentFrame.transitionType = 'gentle'; emit('frameChanged', true)"
        >
          <span>Lento (Gentle)</span>
        </button>
        <button
          type="button"
          class="effect-chip-btn"
          :class="{ active: currentFrame.transitionType === 'instant' }"
          @click="currentFrame.transitionType = 'instant'; emit('frameChanged', true)"
        >
          <span>Instantáneo</span>
        </button>
      </div>
    </div>

    <!-- TAB: SILUETA -->
    <div v-if="inspectorTab === 'shape'" class="inspector-section">
      <div class="inspector-section-label">
        <span>Silueta de este Frame</span>
      </div>
      <select
        v-model="currentFrame.silhouette"
        class="studio-input-select"
        style="width: 100%;"
        @change="emit('frameChanged', false)"
      >
        <option v-for="[sVal, sLabel] in SILHOUETTES" :key="sVal" :value="sVal">
          {{ sLabel }}
        </option>
      </select>

      <div class="catalog-items-grid" style="margin-top: 0.5rem;">
        <button
          v-for="[sVal, sLabel] in SILHOUETTES"
          :key="sVal"
          type="button"
          class="catalog-item-card"
          :class="{ active: currentFrame.silhouette === sVal }"
          @click="currentFrame.silhouette = sVal; emit('frameChanged', false)"
        >
          {{ sLabel }}
        </button>
      </div>
    </div>

    <!-- TAB: OJOS & MIRADA -->
    <div v-if="inspectorTab === 'eyes'" class="inspector-section">
      <div class="inspector-section-label">
        <span>Dirección de Mirada</span>
        <span style="font-size: 0.65rem; color: var(--text-sub);">X: {{ currentFrame.gazeX }} | Y: {{ currentFrame.gazeY }}</span>
      </div>
      <div style="display: flex; gap: 1rem; align-items: center;">
        <div class="gaze-pad-grid">
          <button type="button" class="gaze-pad-btn" :class="{ active: currentFrame.gazeX === -10 && currentFrame.gazeY === -6 }" @click="currentFrame.gazeX = -10; currentFrame.gazeY = -6; emit('frameChanged', false)">NO</button>
          <button type="button" class="gaze-pad-btn" :class="{ active: currentFrame.gazeX === 0 && currentFrame.gazeY === -6 }" @click="currentFrame.gazeX = 0; currentFrame.gazeY = -6; emit('frameChanged', false)">N</button>
          <button type="button" class="gaze-pad-btn" :class="{ active: currentFrame.gazeX === 10 && currentFrame.gazeY === -6 }" @click="currentFrame.gazeX = 10; currentFrame.gazeY = -6; emit('frameChanged', false)">NE</button>
          <button type="button" class="gaze-pad-btn" :class="{ active: currentFrame.gazeX === -10 && currentFrame.gazeY === 0 }" @click="currentFrame.gazeX = -10; currentFrame.gazeY = 0; emit('frameChanged', false)">O</button>
          <button type="button" class="gaze-pad-btn" :class="{ active: currentFrame.gazeX === 0 && currentFrame.gazeY === 0 }" @click="currentFrame.gazeX = 0; currentFrame.gazeY = 0; emit('frameChanged', false)">C</button>
          <button type="button" class="gaze-pad-btn" :class="{ active: currentFrame.gazeX === 10 && currentFrame.gazeY === 0 }" @click="currentFrame.gazeX = 10; currentFrame.gazeY = 0; emit('frameChanged', false)">E</button>
          <button type="button" class="gaze-pad-btn" :class="{ active: currentFrame.gazeX === -10 && currentFrame.gazeY === 6 }" @click="currentFrame.gazeX = -10; currentFrame.gazeY = 6; emit('frameChanged', false)">SO</button>
          <button type="button" class="gaze-pad-btn" :class="{ active: currentFrame.gazeX === 0 && currentFrame.gazeY === 6 }" @click="currentFrame.gazeX = 0; currentFrame.gazeY = 6; emit('frameChanged', false)">S</button>
          <button type="button" class="gaze-pad-btn" :class="{ active: currentFrame.gazeX === 10 && currentFrame.gazeY === 6 }" @click="currentFrame.gazeX = 10; currentFrame.gazeY = 6; emit('frameChanged', false)">SE</button>
        </div>

        <div style="flex: 1; display: flex; flex-direction: column; gap: 0.35rem;">
          <div class="inspector-slider-row">
            <span>Apertura:</span>
            <input type="range" min="0" max="1" step="0.1" v-model.number="currentFrame.eyeOpen" @input="emit('frameChanged', false)" />
            <span class="inspector-slider-val">{{ Math.round(currentFrame.eyeOpen * 100) }}%</span>
          </div>
          <div class="inspector-slider-row">
            <span>Tamaño:</span>
            <input type="range" min="0.6" max="1.5" step="0.05" v-model.number="currentFrame.eyeScale" @input="emit('frameChanged', false)" />
            <span class="inspector-slider-val">{{ currentFrame.eyeScale }}x</span>
          </div>
        </div>
      </div>

      <div class="inspector-section-label" style="margin-top: 0.6rem;">
        <span>Tipo de Ojos (32 Variantes)</span>
      </div>
      <select v-model.number="currentFrame.eyeType" class="studio-input-select" style="width: 100%;" @change="emit('frameChanged', false)">
        <option v-for="e in ALL_EYE_TYPES" :key="e.id" :value="e.id">
          {{ e.id }}: {{ e.label }}
        </option>
      </select>
    </div>

    <!-- TAB: BOCA -->
    <div v-if="inspectorTab === 'mouth'" class="inspector-section">
      <div class="inspector-section-label">
        <span>Tipo de Boca (25 Diseños)</span>
      </div>
      <select v-model.number="currentFrame.mouthType" class="studio-input-select" style="width: 100%;" @change="emit('frameChanged', false)">
        <option v-for="m in ALL_MOUTH_TYPES" :key="m.id" :value="m.id">
          {{ m.id }}: {{ m.label }}
        </option>
      </select>

      <div style="display: flex; flex-direction: column; gap: 0.45rem; margin-top: 0.5rem;">
        <div class="inspector-slider-row">
          <span>Curvatura:</span>
          <input type="range" min="-1" max="1" step="0.1" v-model.number="currentFrame.mouthCurve" @input="emit('frameChanged', false)" />
          <span class="inspector-slider-val">{{ currentFrame.mouthCurve.toFixed(1) }}</span>
        </div>
        <div class="inspector-slider-row">
          <span>Apertura:</span>
          <input type="range" min="0" max="1" step="0.1" v-model.number="currentFrame.mouthOpen" @input="emit('frameChanged', false)" />
          <span class="inspector-slider-val">{{ Math.round(currentFrame.mouthOpen * 100) }}%</span>
        </div>
      </div>
    </div>

    <!-- TAB: COLOR -->
    <div v-if="inspectorTab === 'color'" class="inspector-section">
      <div class="inspector-section-label">
        <span>Selector de Color (Color Picker)</span>
      </div>

      <div class="color-picker-card">
        <div class="color-preview-box" :style="{ background: currentFrame.color }" title="Hacer clic para abrir selector">
          <input
            type="color"
            v-model="currentFrame.color"
            class="color-native-hidden-input"
            @input="emit('frameChanged', false)"
          />
        </div>

        <div style="flex: 1; display: flex; flex-direction: column; gap: 0.4rem;">
          <div style="display: flex; gap: 0.4rem; align-items: center;">
            <input
              type="text"
              v-model="currentFrame.color"
              class="studio-input-select"
              style="flex: 1; font-family: monospace; font-weight: 700; text-transform: uppercase;"
              placeholder="#7ED321"
              @input="emit('frameChanged', false)"
            />
            <button
              v-if="hasEyeDropper"
              type="button"
              class="color-eyedropper-btn"
              title="Cuentagotas (EyeDropper para capturar color en pantalla)"
              @click="openEyeDropper"
            >
              Pipeta
            </button>
          </div>

          <button
            type="button"
            class="color-add-palette-btn"
            @click="emit('addColorToCustomPalette', currentFrame.color)"
          >
            + Guardar en Mi Paleta
          </button>
        </div>
      </div>

      <!-- Mis Colores Guardados -->
      <div v-if="userCustomColors.length > 0" class="inspector-section-label" style="margin-top: 0.5rem;">
        <span>Mis Colores Guardados</span>
        <span style="font-size: 0.68rem; color: var(--text-sub);">{{ userCustomColors.length }} colores</span>
      </div>
      <div v-if="userCustomColors.length > 0" class="preset-colors-wrap">
        <div
          v-for="(c, cIdx) in userCustomColors"
          :key="c + cIdx"
          class="custom-color-chip"
          :style="{ background: c }"
          :class="{ active: currentFrame.color.toLowerCase() === c.toLowerCase() }"
          @click="currentFrame.color = c; emit('frameChanged', false)"
        >
          <button
            type="button"
            class="custom-color-del"
            title="Quitar color"
            @click.stop="emit('removeColorFromCustomPalette', cIdx)"
          >
            ✕
          </button>
        </div>
      </div>

      <!-- Paleta Rápida -->
      <div class="inspector-section-label" style="margin-top: 0.5rem;">
        <span>Paleta Rápida</span>
      </div>
      <div class="preset-colors-wrap">
        <span
          v-for="c in PRESET_COLORS"
          :key="c"
          class="frame-color-dot"
          :class="{ active: currentFrame.color.toLowerCase() === c.toLowerCase() }"
          :style="{ background: c }"
          @click="currentFrame.color = c; emit('frameChanged', false)"
        />
      </div>

      <div class="inspector-slider-row" style="margin-top: 0.6rem;">
        <span>Sonrojo:</span>
        <input type="range" min="0" max="1" step="0.1" v-model.number="currentFrame.cheek" @input="emit('frameChanged', false)" />
        <span class="inspector-slider-val">{{ Math.round(currentFrame.cheek * 100) }}%</span>
      </div>
    </div>

    <!-- TAB: CEJAS -->
    <div v-if="inspectorTab === 'brows'" class="inspector-section">
      <div class="inspector-toggle-card">
        <div>
          <div class="inspector-toggle-title">Activar Cejas</div>
          <div class="inspector-toggle-desc">Mostrar u ocultar cejas en este frame</div>
        </div>
        <button
          type="button"
          class="inspector-toggle-btn"
          :class="{ active: currentFrame.hasBrows }"
          @click="currentFrame.hasBrows = !currentFrame.hasBrows; emit('frameChanged', false)"
        >
          {{ currentFrame.hasBrows ? 'Activado' : 'Desactivado' }}
        </button>
      </div>

      <div v-if="currentFrame.hasBrows" style="display: flex; flex-direction: column; gap: 0.6rem; margin-top: 0.4rem;">
        <div class="inspector-slider-row">
          <span>Inclinación:</span>
          <input
            type="range"
            min="-25"
            max="25"
            step="1"
            v-model.number="currentFrame.browTilt"
            @input="emit('frameChanged', false)"
          />
          <span class="inspector-slider-val">{{ currentFrame.browTilt }}°</span>
        </div>

        <div class="inspector-slider-row">
          <span>Altura Y:</span>
          <input
            type="range"
            min="-6"
            max="6"
            step="1"
            v-model.number="currentFrame.browY"
            @input="emit('frameChanged', false)"
          />
          <span class="inspector-slider-val">{{ currentFrame.browY }}</span>
        </div>
      </div>

      <div
        v-else
        style="font-size: 0.75rem; color: var(--text-sub); line-height: 1.45; background: var(--pill-soft-bg, rgba(0,0,0,0.03)); padding: 0.65rem 0.85rem; border-radius: 10px; border: 1px solid var(--border-soft, rgba(0,0,0,0.06)); margin-top: 0.4rem;"
      >
        Las cejas están desactivadas para este fotograma. Presiona <strong>Activado</strong> si deseas añadir expresión a la mirada.
      </div>
    </div>

    <!-- TAB: EFECTOS -->
    <div v-if="inspectorTab === 'effects'" class="inspector-section">
      <div class="inspector-section-label">
        <span>Acciones y Accesorios Animados</span>
      </div>
      <div class="effect-chips-grid">
        <button
          type="button"
          class="effect-chip-btn"
          :class="{ active: currentFrame.bounce }"
          @click="currentFrame.bounce = !currentFrame.bounce; emit('frameChanged', true)"
        >
          <span>Salto / Rebote</span>
        </button>

        <button
          type="button"
          class="effect-chip-btn"
          :class="{ active: currentFrame.spin }"
          @click="currentFrame.spin = !currentFrame.spin; emit('frameChanged', true)"
        >
          <span>Giro 360°</span>
        </button>

        <button
          type="button"
          class="effect-chip-btn"
          :class="{ active: currentFrame.sweat > 0 }"
          @click="currentFrame.sweat = currentFrame.sweat > 0 ? 0 : 1; emit('frameChanged', false)"
        >
          <span>Gotas Sudor</span>
        </button>

        <button
          type="button"
          class="effect-chip-btn"
          :class="{ active: currentFrame.zzz > 0 }"
          @click="currentFrame.zzz = currentFrame.zzz > 0 ? 0 : 1; emit('frameChanged', false)"
        >
          <span>Zzz Dormir</span>
        </button>

        <button
          type="button"
          class="effect-chip-btn"
          :class="{ active: currentFrame.tears > 0 }"
          @click="currentFrame.tears = currentFrame.tears > 0 ? 0 : 1; emit('frameChanged', false)"
        >
          <span>Lágrimas</span>
        </button>

        <button
          type="button"
          class="effect-chip-btn"
          :class="{ active: currentFrame.storm > 0 }"
          @click="currentFrame.storm = currentFrame.storm > 0 ? 0 : 1; emit('frameChanged', false)"
        >
          <span>Tormenta</span>
        </button>

        <button
          type="button"
          class="effect-chip-btn"
          :class="{ active: currentFrame.scribble > 0 }"
          @click="currentFrame.scribble = currentFrame.scribble > 0 ? 0 : 1; emit('frameChanged', false)"
        >
          <span>Garabato</span>
        </button>

        <button
          type="button"
          class="effect-chip-btn"
          :class="{ active: currentFrame.puff > 0 }"
          @click="currentFrame.puff = currentFrame.puff > 0 ? 0 : 1; emit('frameChanged', false)"
        >
          <span>Bocanada</span>
        </button>
      </div>
    </div>

    <!-- TAB: 39 ESTADOS -->
    <div v-if="inspectorTab === 'presets'" class="inspector-section">
      <div class="inspector-section-label">
        <span>Configuración Rápida por Estado</span>
        <span style="font-size: 0.68rem; color: var(--text-sub);">1 Clic configura silueta y expresión</span>
      </div>

      <div class="state-category-chips">
        <button
          type="button"
          class="state-category-pill"
          :class="{ active: selectedStateCategory === 'all' }"
          @click="selectedStateCategory = 'all'"
        >
          Todos ({{ STATE_PRESETS.length }})
        </button>
        <button
          v-for="cat in STATE_CATEGORIES"
          :key="cat"
          type="button"
          class="state-category-pill"
          :class="{ active: selectedStateCategory === cat }"
          @click="selectedStateCategory = cat"
        >
          {{ cat }}
        </button>
      </div>

      <div class="state-presets-grid">
        <div
          v-for="st in filteredStatePresets"
          :key="st.id"
          class="state-preset-card"
          :class="{ active: currentFrame.label === st.name }"
          @click="emit('applyStatePreset', st)"
        >
          <div class="state-preset-header">
            <span class="state-preset-dot" :style="{ background: st.data.color || '#7ED321' }" />
            <span class="state-preset-name">{{ st.name }}</span>
            <span class="state-preset-sil-badge">{{ st.data.silhouette }}</span>
          </div>
          <div class="state-preset-desc">{{ st.description }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
