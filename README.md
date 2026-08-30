# Wissive

**Librería de emojis interactivos con expresiones vivas y física de resorte real.**

[![npm version](https://img.shields.io/npm/v/wissive.svg?color=6366f1)](https://www.npmjs.com/package/wissive)
[![npm bundle size](https://img.shields.io/bundlephobia/minzip/wissive?color=10b981)](https://bundlephobia.com/package/wissive)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**Sitio web y Documentación en vivo:** [https://wissive-docs.vercel.app/](https://wissive.vercel.app/)  
**Paquete en NPM:** [https://www.npmjs.com/package/wissive](https://www.npmjs.com/package/wissive)  
**Repositorio en GitHub:** [https://github.com/EJCP3/wissive](https://github.com/EJCP3/wissive)

---

## Instalación rápida

### Vía Gestor de Paquetes
```bash
# pnpm
pnpm add wissive

# npm
npm install wissive

# yarn
yarn add wissive
```

```javascript
import { createEmoji } from 'wissive';

const emoji = createEmoji('mochi', {
  target: document.querySelector('#slot'),
  size: 120,
});
```

### Vía CDN (sin instalación)
```html
<script src="https://cdn.jsdelivr.net/npm/wissive/dist/wissive.umd.js"></script>
<div id="slot"></div>

<script>
  Wissive.create('mochi', {
    target: document.querySelector('#slot'),
    size: 120,
  });
</script>
```

---

## ¿Qué es Wissive?

Wissive es una librería de JavaScript/TypeScript vanilla (**sin frameworks ni dependencias de runtime obligatorias**) que renderiza personajes vectoriales reactivos en tiempo real. 

No es una imagen estática ni un GIF: es un **motor de expresión** que dibuja el rostro por código (SVG) y lo interpola con **física de resorte amortiguada (*spring physics*)**, logrando un movimiento orgánico que reacciona de verdad al cursor, al teclado, al arrastre (*drag & drop*) y al tacto.

---

## Características Principales

- **Catálogo de 14 personajes vivos**: Mochi, Zumi, Suri, Nima, Cota, Dozy, Lumo, Fidge, Brix, Wilt, Knot, Snug, Pip y Void.
- **Crea tu propio emoji personalizado**: Mezcla más de 20 siluetas vectoriales, rasgos faciales, colores, sonidos y partículas con `createCustomEmoji()`.
- **Física de resorte real**: Movimiento elástico y fluido sin transiciones CSS lineales rígidas.
- **Seguimiento del cursor (*Gaze Tracking*)**: Los ojos siguen la posición del ratón en tiempo real.
- **Arrastre con inercia (*Drag & Drop*)**: Arrastra los emojis por la pantalla con física y rebote.
- **Secuencias de animación**: Encadena estados con `.playSequence()` en modos `once`, `loop` o `ping-pong`.
- **Sonido sintetizado con Web Audio**: Integración opcional con [Cuelume](https://cuelume-site.pages.dev/).
- **Emisor de partículas**: Ráfagas de destellos, estrellas y corazones con `.triggerParticles()`.
- **Temas de color dinámicos**: Cambia la paleta en caliente (`auto`, `neon`, `pastel`, `gold`).
- **Accesibilidad total**: `role="img"`, `aria-label` dinámico, soporte de teclado y respeto estricto a `prefers-reduced-motion`.
- **Multi-Framework**: Wrappers oficiales y tipados para **React**, **Vue** y **Astro**.

---

## Crea tu Propio Emoji

Puedes diseñar emojis completamente personalizados mezclando siluetas, ojos, bocas, colores y animaciones:

```javascript
import { createCustomEmoji, createEmoji } from 'wissive';

// 1. Construir y registrar el emoji personalizado
createCustomEmoji('mi-personaje', {
  baseColor: '#FFD23F',
  silhouette: 'circle', // 'circle', 'heart', 'starburst-puff', 'capsule', 'pear-blob', etc.
  eyesFrom: 'mochi',
  mouthFrom: 'suri',
  motionFrom: 'zumi',
  particlesFrom: 'mochi',
  soundFrom: 'mochi',
  stateBank: ['happy', 'excited', 'celebrate', 'playful'],
});

// 2. Instanciarlo en tu contenedor
const miEmoji = createEmoji('mi-personaje', {
  target: document.querySelector('#mi-slot'),
  size: 100,
  gazeTracking: true,
  draggable: true,
});
```

---

## Integración con Frameworks

Wissive incluye soporte nativo y componentes para los principales frameworks:

### React
```tsx
import { Wissive } from 'wissive/react';

export function MiComponente() {
  return (
    <Wissive
      name="mochi"
      size={120}
      options={{
        sound: true,
        gazeTracking: true,
        draggable: true,
      }}
    />
  );
}
```

### Vue
```vue
<script setup>
import { Wissive } from 'wissive/vue';
</script>

<template>
  <Wissive name="zumi" size="lg" :options="{ sound: true, draggable: true }" />
</template>
```

### Astro
```astro
---
import Wissive from 'wissive/astro';
---

<Wissive name="mochi" size={120} sound={true} />
```

---

## Optimización para Móvil y Pantallas Táctiles

Wissive está diseñado para funcionar de manera nativa y fluida tanto en escritorio como en dispositivos móviles:

- **Detección de Hardware (`isTouchDevice()` / `supportsHover()`):** Desactiva listeners globales pesados de proximidad en pantallas táctiles (`hover: none`) para ahorrar batería y CPU.
- **Gestión de Toque sin Estados Fantasma:** `touchstart` y `touchend` gestionan limpiamente el ciclo de interacción sin dejar estados `:hover` pegados.
- **Arrastre Táctil (`Drag & Drop`):** Soporta gestos directos con el dedo con deformación elástica (*Squash & Stretch*) sin bloquear el scroll general de la página.
- **Micro-vida Autónoma:** Mediante parpadeos aleatorios (`scheduleNextBlink`), miradas espontáneas (`scheduleNextGlance`) y cambios emocionales (`autonomousStates: true`), los emojis se mantienen vivos y expresivos sin requerir movimiento de ratón.

---

## API Reference

### `createEmoji(name, options)`

#### Opciones principales (`WissiveOptions`):
| Opción | Tipo | Default | Descripción |
|---|---|---|---|
| `target` | `HTMLElement` | *(requerido)* | Elemento contenedor donde se monta el emoji. |
| `size` | `WissiveSize` | `'base'` (120px) | Tamaño en px o preset (`'xs'`, `'sm'`, `'base'`, `'lg'`, `'xl'`, `'2xl'`). |
| `interactive` | `boolean` | `true` | Habilita eventos de ratón, proximidad y hover. |
| `draggable` | `boolean` | `true` | Permite arrastrar el emoji con inercia y física. |
| `gazeTracking` | `boolean` | `false` | Los ojos siguen el cursor activamente. |
| `sound` | `boolean` | `true` | Reproduce efectos de sonido si Cuelume está presente. |
| `autonomousStates` | `boolean` | `true` | Deambula de forma autónoma entre emociones al estar en reposo. |
| `theme` | `ThemeOption` | `'auto'` | Tema de color (`'auto'`, `'neon'`, `'pastel'`, `'gold'`). |
| `reducedMotion` | `'auto' \| boolean` | `'auto'` | Respeta accesibilidad de movimiento reducido del sistema. |

#### Métodos de la Instancia (`WissiveInstance`):
```javascript
const emoji = createEmoji('mochi', { target });

emoji.setEmotion('excited');       // Cambia la emoción activa
emoji.bounce();                   // Provoca un salto elástico
emoji.spin(1);                    // Giro de 360°
emoji.setGaze({ x: 0.5, y: -0.2 }); // Ajusta la dirección de la mirada
emoji.setGazeTracking(true);      // Activa/desactiva seguimiento de cursor
emoji.setTheme('neon');           // Cambia el tema de color en vivo
emoji.triggerParticles(8);        // Emite una ráfaga de partículas
emoji.playSequence([              // Reproduce una secuencia de estados
  { state: 'thinking', duration: 800 },
  { state: 'happy', duration: 1000 },
], { mode: 'loop' });
emoji.destroy();                  // Limpieza determinística de memoria y listeners
```

---

## Enlaces y Recursos

- **Documentación Interactiva:** [https://wissive-docs.vercel.app/](https://wissive-docs.vercel.app/)
- **Código Fuente en GitHub:** [https://github.com/EJCP3/wissive](https://github.com/EJCP3/wissive)
- **Reportar problemas:** [https://github.com/EJCP3/wissive/issues](https://github.com/EJCP3/wissive/issues)
- **Licencia:** MIT © 2026
