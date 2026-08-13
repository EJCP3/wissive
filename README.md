# Wissive

**Micro-librería de JavaScript de emojis "vivos" — reactivos a hover, click y proximidad del mouse.**

---

## 1. ¿Qué es Wissive?

Wissive es una librería de JavaScript vanilla (sin dependencias obligatorias, sin framework)
que renderiza emojis tipo *blob* con personalidad propia. Cada emoji reacciona en tiempo real
a la interacción del usuario — no es una imagen estática ni un GIF: es un motor que dibuja el
rostro por código (SVG) y lo anima con física de resorte (spring physics), eligiendo
expresiones de forma semi-aleatoria dentro de un set curado para cada estado de interacción.

No es un set de iconos. Es un **motor de expresión** con un catálogo de personajes ya
diseñados, pensado para que cualquier desarrollador lo instale y tenga, en dos líneas de
código, un emoji que "está vivo" en su interfaz.

---

## 2. Objetivo del proyecto

- Dar a cualquier sitio web una forma rápida de añadir personalidad y feedback emocional a
  través de una carita animada, sin tener que diseñar ni animar nada desde cero.
- Que la librería sea **liviana, sin dependencias obligatorias**, y utilizable tanto con
  bundlers modernos como directamente desde un `<script>` en HTML plano.
- Que **no dependa de ningún framework** para funcionar, pero que se pueda envolver fácilmente
  en React, Vue o Astro sin fricción.
- Que cada emoji se sienta "vivo" gracias a variedad real: no una sola expresión por estado,
  sino un pool de expresiones que se sortea, evitando la sensación de repetición.

---

## 3. Funcionalidad principal

### 3.1 Catálogo de emojis
14 personajes base con diseño propio (ver `design.md`), cada uno con 24 expresiones
distribuidas en 4 estados de interacción.

### 3.2 Estados de interacción
| Estado | Disparador | Descripción |
|---|---|---|
| `idle` | Sin interacción | Estado de reposo del emoji, respiración lenta. |
| `near` | El cursor se acerca sin tocar el emoji (radio configurable) | El emoji "nota" que algo se acerca. |
| `hover` | `mouseenter` / `mouseleave` | El cursor está directamente sobre el emoji. |
| `click` | `mousedown` / `mouseup` (o `touchstart` en móvil) | Reacción a la interacción directa. |

Cada estado tiene un **pool de variantes** de expresión; al dispararse el estado se sortea una
variante evitando repetir la anterior inmediatamente, dando sensación de variedad.

### 3.3 Motor de animación
- Interpolación de parámetros (apertura de ojos, curvatura de boca, posición de cejas, etc.)
  mediante un sistema de **resorte amortiguado (spring physics)**, no `transition` lineal de
  CSS. Esto da movimiento orgánico entre expresiones.
- Un único `requestAnimationFrame` central compartido entre todas las instancias activas en
  una misma página (no un loop por emoji).

### 3.4 Sonido (opcional)
Integración opcional con [Cuelume](https://cuelume-site.pages.dev/) (librería de sonidos de
interacción sintetizados con Web Audio, sin archivos de audio). Se detecta en tiempo de
ejecución; si no está instalada, la librería sigue funcionando en silencio sin romperse.

### 3.5 Accesibilidad
- `role="img"` + `aria-label` describiendo la emoción actual.
- Soporte de teclado (`tabindex`, `Enter`/`Espacio` equivalen a click).
- Respeta `prefers-reduced-motion` del sistema operativo.
- Fallback definido para touch (sin hover/near reales en móvil).

---

## 4. Cómo estará construido

### 4.1 Lenguaje y estructura
- Código fuente en **TypeScript**, compilado a JS. Da autocompletado y tipos (`.d.ts`) a quien
  la instale, sin obligar a nadie a usar TS.
- Sin dependencias de runtime obligatorias. Cuelume es *peer dependency* opcional.

### 4.2 Arquitectura interna (capas)
```
Diseño (paths/parametros SVG por expresión, por emoji)
   ↓
Catálogo (LIB: nombre, color, forma base, pools de expresión por estado)
   ↓
Motor de resorte (interpola parámetros numéricos en cada frame)
   ↓
Selector de estado (idle/near/hover/click + sorteo del pool)
   ↓
Renderer SVG (dibuja el emoji a partir de los parámetros actuales)
   ↓
Capa de eventos (mouseenter/leave, mousedown/up, mousemove global para "near")
```

### 4.3 API pública (borrador)
```js
import { createEmoji } from 'wissive';

const emoji = createEmoji('mochi', {
  target: document.querySelector('#slot'),
  size: 120,
  sound: true,       // requiere cuelume instalado
  interactive: true, // false = solo decorativo, sin eventos
});

emoji.setEmotion('feliz');  // control programático
emoji.destroy();            // limpieza (RAF + listeners)
```

### 4.4 Formatos de build
- **ESM** — uso estándar con bundlers (Vite, Webpack, Rollup, Astro, etc.).
- **UMD/IIFE** — uso directo con `<script>`, sin instalar nada, vía CDN (jsDelivr/unpkg).
- **CJS** — compatibilidad con proyectos Node/legacy.

### 4.5 Integración con frameworks
Wissive no depende de ningún framework, pero se puede envolver en cualquiera mediante
lifecycle hooks (`useEffect`/`onMounted`/script de Astro) que llaman a `createEmoji()` en el
montaje y a `.destroy()` en el desmontaje. Wrappers oficiales (`wissive/react`, `wissive/vue`)
se evalúan como paquetes satélite en una fase posterior — no bloquean el core.

### 4.6 Distribución
- Publicación en npm bajo un solo paquete (`wissive`), con *exports* separados por formato.
- Documentación y demo interactivo publicados como sitio estático (similar en espíritu al de
  Cuelume: mostrar la librería funcionando en vivo en la propia página de docs).

---

## 5. Alcance fuera de la v1

Estas ideas quedan documentadas pero no forman parte del primer release (ver fases en
`requerimientos.md`):
- Wrappers oficiales para React/Vue.
- Secuencias encadenadas de expresiones (`.playSequence()`).
- Seguimiento de cursor con la mirada (ojos que se mueven, no solo cambian).
- Temas de color personalizados por el usuario de la librería.
- Emojis adicionales más allá de los 14 iniciales.