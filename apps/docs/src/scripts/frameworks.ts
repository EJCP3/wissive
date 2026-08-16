import { highlightCode } from './syntax';

export const FW_SNIPPETS = {
  vanilla: `import { createEmoji } from 'wissive';

const instance = createEmoji('mochi', { target });
// ...
instance.destroy();`,
  react: `import { Wissive } from 'wissive/react';

<Wissive name="mochi" size="lg" sound />`,
  vue: `<script setup>
import { Wissive } from 'wissive/vue';
<\/script>

<template>
  <Wissive name="mochi" :options="{ size: 'lg', sound: true }" />
</template>`,
  astro: `---
import Wissive from 'wissive/astro';
---
<Wissive name="mochi" size="lg" sound />`,
};

export function initFrameworkPicker(): void {
  const fwPicker = document.getElementById('fw-picker');
  if (!fwPicker) return;

  function setFramework(fw: keyof typeof FW_SNIPPETS): void {
    localStorage.setItem('wissive-fw', fw);
    document.querySelectorAll<HTMLButtonElement>('#fw-picker .btn').forEach(b => {
      b.classList.toggle('active', b.dataset.fw === fw);
    });
    document.querySelectorAll<HTMLElement>('[data-fw-slot="mount"] code').forEach(code => {
      code.textContent = FW_SNIPPETS[fw] || FW_SNIPPETS.vanilla;
      highlightCode(code);
    });
  }

  document.querySelectorAll<HTMLButtonElement>('#fw-picker .btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const fw = (btn.dataset.fw as keyof typeof FW_SNIPPETS) || 'vanilla';
      setFramework(fw);
    });
  });

  const savedFw = (localStorage.getItem('wissive-fw') as keyof typeof FW_SNIPPETS) || 'vanilla';
  setFramework(savedFw);
}
