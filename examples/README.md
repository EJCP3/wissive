# Ejemplos de integración por framework

Para los tres, lo más simple es el wrapper oficial — ya viene con la librería, no hay que
copiar nada:

```jsx
import { Wissive } from 'wissive/react';
<Wissive name="mochi" size="lg" sound />
```

```vue
<script setup>
import { Wissive } from 'wissive/vue';
</script>
<template>
  <Wissive name="mochi" :options="{ size: 'lg' }" />
</template>
```

```astro
---
import Wissive from 'wissive/astro';
---
<Wissive name="mochi" size="lg" sound />
```

`react`/`vue`/`astro` son *peer dependencies* opcionales — igual que Cuelume, si no están
instaladas solo falla el subpath que corresponde, el core (`wissive` a secas) sigue
funcionando. El de Astro es distinto a los otros dos: no resuelve un problema de timing (su
`<script>` ya corre client-side sin ceremonia), solo evita repetir el `<script>` si usás el
emoji en varias páginas — y por eso es `export default` (React/Vue exportan `Wissive` con
nombre; un `.astro` no puede).

Los archivos de esta carpeta son la implementación real de esos tres wrappers (no una copia —
`src/react.tsx`, `src/vue.ts` y `src/astro/Wissive.astro` son literalmente lo mismo), más el
patrón manual para quien prefiera no depender de ellos:

- [`react/WissiveEmoji.tsx`](react/WissiveEmoji.tsx) — `useRef` + `useEffect`, patrón manual.
- [`vue/WissiveEmoji.vue`](vue/WissiveEmoji.vue) — `onMounted` + `onUnmounted`, patrón manual.
- [`astro/wissive-demo.astro`](astro/wissive-demo.astro) — `<script>` de cliente directo,
  sin componente, para un uso puntual en una sola página.

## Por qué no hay fugas de memoria

`createEmoji().destroy()` limpia todo lo que la instancia pudo haber abierto:

| Recurso | Dónde se limpia |
|---|---|
| RAF compartido | `sharedLoop.remove(tick)` |
| 8 timers propios (blink, glance, idle, ambient particles, autonomous state) | `stopTimers()` |
| Listeners de mouse/touch/teclado | `detachListeners()` (retorno de `attachEventListeners`) |
| Listener de `prefers-reduced-motion` | `unsubscribeReducedMotion()` |
| Canvas de partículas + su propio RAF | `particles.destroy()` |
| Drag (listeners + RAF de física) | `dragPhysics.destroy()` |
| Secuencia en curso | `sequencePlayer.stop()` |
| DOM | `wrapper.remove()` |

Verificado leyendo cada `destroy()` de la cadena (`src/index.ts`, `src/render/particles.ts`,
`src/core/drag.ts`, `src/core/sequence.ts`, `src/core/a11y.ts`) — cada recurso que se abre
tiene su contraparte de cierre y `destroy()` los llama a todos.

**Nota honesta:** esto es una auditoría estática del código de limpieza, no una corrida real
de montar/desmontar 100 veces en una app React/Vue/Astro con el profiler de memoria abierto
(el entorno donde se generó este ejemplo no tiene acceso a un navegador real). Si quieres el
cierre completo de Fase 7 tal como lo pide `requerimientos.md`, corre uno de estos ejemplos en
un proyecto real y mira el heap en DevTools tras varios ciclos de mount/unmount.
