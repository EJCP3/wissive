<script setup lang="ts">
import { ref } from 'vue';
import type { KeyframeData } from '../types';
import { createDefaultKeyframe } from '../types';

const props = defineProps<{
  show: boolean;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'importSequence', frames: KeyframeData[]): void;
}>();

const importJsonText = ref('');
const importError = ref('');

function handleFileUpload(e: Event) {
  const target = e.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (evt) => {
    importJsonText.value = (evt.target?.result as string) || '';
  };
  reader.readAsText(file);
}

function applyImportedJson() {
  try {
    const raw = JSON.parse(importJsonText.value.trim());
    const parsedList = Array.isArray(raw) ? raw : (raw.sequence || raw.frames);
    if (!Array.isArray(parsedList) || parsedList.length === 0) {
      throw new Error('El JSON debe contener un arreglo de fotogramas válido.');
    }
    const newFrames: KeyframeData[] = parsedList.map((item, idx) => {
      const p = item.params || {};
      return createDefaultKeyframe(item.label || `Frame ${idx + 1}`, {
        duration: (item.duration ? item.duration / 1000 : 1.0) || item.duration || 1.0,
        silhouette: item.silhouette || 'circle',
        color: item.color || '#7ED321',
        gazeX: p.gazeX ?? item.gazeX ?? 0,
        gazeY: p.gazeY ?? item.gazeY ?? 0,
        eyeType: p.eyeType ?? item.eyeType ?? 0,
        eyeOpen: p.eyeOpen ?? item.eyeOpen ?? 1.0,
        eyeScale: p.eyeScale ?? item.eyeScale ?? 1.0,
        mouthType: p.mouthType ?? item.mouthType ?? 0,
        mouthCurve: p.mouthCurve ?? item.mouthCurve ?? 0.0,
        mouthOpen: p.mouthOpen ?? item.mouthOpen ?? 0.0,
        hasBrows: Boolean(p.showBrows ?? item.hasBrows),
        browTilt: p.browTilt ?? item.browTilt ?? 0,
        browY: p.browY ?? item.browY ?? 0,
        cheek: p.cheek ?? item.cheek ?? 0,
        sweat: p.sweat ?? item.sweat ?? 0,
        zzz: p.zzz ?? item.zzz ?? 0,
        tears: p.tears ?? item.tears ?? 0,
        storm: p.storm ?? item.storm ?? 0,
        scribble: p.scribble ?? item.scribble ?? 0,
        puff: p.puff ?? item.puff ?? 0,
        bounce: Boolean(item.bounce),
        spin: Boolean(item.spin),
        transitionType: item.transitionType || 'smooth',
      });
    });

    emit('importSequence', newFrames);
    importJsonText.value = '';
    importError.value = '';
    emit('close');
  } catch (err: any) {
    importError.value = err.message || 'Error al procesar el archivo JSON.';
  }
}
</script>

<template>
  <div v-if="show" class="studio-modal-backdrop" @click.self="emit('close')">
    <div class="studio-modal-box">
      <div class="studio-modal-top">
        <span class="studio-modal-title-text">Importar Secuencia JSON</span>
        <button class="studio-modal-close-btn" type="button" @click="emit('close')">✕</button>
      </div>

      <div style="display: flex; flex-direction: column; gap: 0.75rem; margin-top: 0.5rem;">
        <div style="font-size: 0.78rem; color: var(--text-sub);">
          Pega el contenido JSON de una animación exportada previamente o selecciona un archivo <code>.json</code> de tu disco.
        </div>

        <textarea
          v-model="importJsonText"
          rows="8"
          class="studio-input-select"
          style="width: 100%; font-family: monospace; font-size: 0.75rem; resize: vertical;"
          placeholder='[ { "label": "Frame 1", "duration": 1000, "silhouette": "heart", "color": "#F2A9B8", "params": { ... } } ]'
        />

        <div v-if="importError" style="color: #ef4444; font-size: 0.75rem; font-weight: 600;">
          {{ importError }}
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 0.25rem;">
          <label class="timeline-action-btn" style="cursor: pointer;">
            Cargar Archivo .json
            <input type="file" accept=".json,application/json" style="display: none;" @change="handleFileUpload" />
          </label>

          <button
            type="button"
            class="export-primary-btn"
            :disabled="!importJsonText.trim()"
            @click="applyImportedJson"
          >
            Cargar en la Línea de Tiempo
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
