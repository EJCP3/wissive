/**
 * Wrapper oficial para Vue — `import { Wissive } from 'wissive/vue'`.
 *
 * Mismo patrón que react.tsx (onMounted + onUnmounted + destroy), pero como
 * componente de opciones con render function en vez de un .vue de un solo
 * archivo — evita sumar @vitejs/plugin-vue solo para compilar un SFC.
 * `vue` es peer dependency opcional, igual que react/cuelume.
 */
import { defineComponent, h, onMounted, onUnmounted, ref, type PropType } from 'vue';
import { createEmoji } from './index';
import type { WissiveInstance, WissiveOptions } from './index';

export const Wissive = defineComponent({
  name: 'Wissive',
  props: {
    name: { type: String, required: true },
    options: { type: Object as PropType<Omit<WissiveOptions, 'target'>>, default: () => ({}) },
  },
  setup(props) {
    const slot = ref<HTMLDivElement | null>(null);
    let instance: WissiveInstance | null = null;

    onMounted(() => {
      if (!slot.value) return;
      instance = createEmoji(props.name, { target: slot.value, ...props.options });
    });

    onUnmounted(() => {
      instance?.destroy();
      instance = null;
    });

    return () => h('div', { ref: slot });
  },
});
