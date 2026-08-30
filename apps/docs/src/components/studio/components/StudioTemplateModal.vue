<script setup lang="ts">
import type { SequenceTemplate } from '../types';
import { SEQUENCE_TEMPLATES } from '../constants/templates';

const props = defineProps<{
  show: boolean;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'selectTemplate', template: SequenceTemplate): void;
}>();
</script>

<template>
  <div v-if="show" class="studio-modal-backdrop" @click.self="emit('close')">
    <div class="studio-modal-box">
      <div class="studio-modal-top">
        <span class="studio-modal-title-text">Plantillas de Animaciones Prehechas</span>
        <button class="studio-modal-close-btn" type="button" @click="emit('close')">✕</button>
      </div>

      <div class="template-modal-grid">
        <div
          v-for="tpl in SEQUENCE_TEMPLATES"
          :key="tpl.id"
          class="template-modal-card"
          @click="emit('selectTemplate', tpl)"
        >
          <div class="template-card-top">
            <span class="template-card-name">{{ tpl.name }}</span>
            <span class="template-card-badge">{{ tpl.badge }}</span>
          </div>
          <div class="template-card-desc">{{ tpl.description }}</div>
          <div style="font-size: 0.65rem; color: var(--text-sub); margin-top: 0.2rem;">
            {{ tpl.frames.length }} fotogramas configurados
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
