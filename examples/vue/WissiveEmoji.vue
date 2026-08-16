<!--
  Ejemplo de integración con Vue 3 — Fase 7 de requerimientos.md

  Esto ya existe empaquetado: `import { Wissive } from 'wissive/vue'`
  (ver src/vue.ts) es el mismo patrón, como componente de opciones en vez
  de SFC (para no sumar @vitejs/plugin-vue solo para compilar un archivo).
  Este .vue queda como referencia del patrón manual.

  Patrón: ref() para el nodo destino + onMounted/onUnmounted, simétrico al
  ciclo de vida del componente.
-->
<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { createEmoji, type WissiveInstance, type WissiveOptions } from 'wissive';

const props = withDefaults(
  defineProps<{ name: string } & Omit<WissiveOptions, 'target'>>(),
  { size: 'base' }
);

const slot = ref<HTMLDivElement | null>(null);
let instance: WissiveInstance | null = null;

onMounted(() => {
  if (!slot.value) return;
  instance = createEmoji(props.name, { target: slot.value, ...props });
});

onUnmounted(() => {
  instance?.destroy();
  instance = null;
});
</script>

<template>
  <div ref="slot"></div>
</template>

<!-- Uso: <WissiveEmoji name="mochi" size="lg" sound /> -->
