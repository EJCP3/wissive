import { createEmoji, createCustomEmoji, loadCustomEmoji, LIB, STATE_GROUPS } from '../../../src/index';
import { currentLang, NEUTRAL_CIRCLE_TEXT } from './i18n';
import { highlightCode } from './syntax';

export const SOUND_CUE_LABELS: Record<string, string> = {
  mochi: 'Chime · Sparkle',
  zumi: 'Bloom · Pulse',
  suri: 'Droplet · Bloom',
  nima: 'Whisper · Arrival',
  cota: 'Tick · Toggle',
  dozy: 'Whisper · Loading',
  snug: 'Whisper · Loading',
  lumo: 'Droplet · Scan',
  wilt: 'Droplet · Scan',
  fidge: 'Tick · Pulse',
  knot: 'Tick · Pulse',
  brix: 'Release · Press',
  pip: 'Chime · Success',
  void: 'Page · Ready',
};

export const SHAPES = [
  ['circle', 'Circle'], ['heart', 'Heart'], ['round-blob', 'Round blob'],
  ['capsule', 'Capsule'], ['rounded-squircle', 'Squircle'], ['pear-blob', 'Pear'],
  ['egg-oval', 'Egg'], ['starburst-puff', 'Starburst'], ['pill-vertical', 'Pill'],
  ['ghost-blob', 'Ghost'], ['oval', 'Oval'], ['elongated-oval', 'Elongated oval'],
  ['teardrop-blob', 'Teardrop'], ['flame-blob', 'Flame'], ['droopy-blob', 'Droopy'],
  ['bear-blob', 'Bear (ears)'], ['spiky-blob', 'Spiky'], ['cloud-blob', 'Cloud'],
  ['wide-oval', 'Wide oval'], ['soft-round', 'Soft round'], ['octopus-blob', 'Octopus'],
  ['wave-blob', 'Wave'],
];

export function buildCustomConfigCall(name: string, options: any): string {
  const opts = Object.entries(options || {})
    .filter(([, v]) => v !== undefined && !(Array.isArray(v) && v.length === 0))
    .map(([k, v]) => `  ${k}: ${JSON.stringify(v)},`)
    .join('\n');
  return `createCustomEmoji('${name}', {\n${opts}\n});`;
}

export function buildCustomSnippet(fw: string, options: any): string {
  const configCall = buildCustomConfigCall('mi-emoji', options);
  if (fw === 'react') {
    return `import { createCustomEmoji } from 'wissive';
import { Wissive } from 'wissive/react';

${configCall}

<Wissive name="mi-emoji" />`;
  }
  if (fw === 'vue') {
    return `<script setup>
import { createCustomEmoji } from 'wissive';
import { Wissive } from 'wissive/vue';

${configCall}
<\/script>

<template>
  <Wissive name="mi-emoji" />
</template>`;
  }
  if (fw === 'astro') {
    return `<div id="mi-emoji-slot"></div>

<script>
  import { createCustomEmoji, createEmoji } from 'wissive';
  ${configCall.replace(/\n/g, '\n  ')}
  createEmoji('mi-emoji', { target: document.getElementById('mi-emoji-slot') });
<\/script>`;
  }
  return `import { createCustomEmoji, createEmoji } from 'wissive';

${configCall}

const emoji = createEmoji('mi-emoji', { target });`;
}

export function resolveTraitSelect(value: string, sentinel: string) {
  if (value.startsWith(sentinel + ':')) {
    return { override: Number(value.slice(sentinel.length + 1)) };
  }
  return { from: value || undefined };
}

const pickRandom = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)];

export function randomCustomOptions(): any {
  const allCharacters = Object.keys(LIB).filter(n => n !== 'custom');
  const baseColor = pickRandom(allCharacters.map(n => LIB[n].baseColor));
  const silhouette = pickRandom(SHAPES.map(s => s[0]));

  const extraEyes = Array.from({ length: 11 }, (_, i) => `eye:${i + 21}`);
  const eyesPool = [...allCharacters, '', ...extraEyes];
  const eyesVal = pickRandom(eyesPool);
  const eyes = resolveTraitSelect(eyesVal, 'eye');

  const extraMouths = Array.from({ length: 10 }, (_, i) => `mouth:${i + 15}`);
  const mouthPool = [...allCharacters, '', ...extraMouths];
  const mouthVal = pickRandom(mouthPool);
  const mouth = resolveTraitSelect(mouthVal, 'mouth');

  return {
    baseColor,
    silhouette,
    eyesFrom: eyes.from,
    eyeTypeOverride: eyes.override,
    mouthFrom: mouth.from,
    mouthTypeOverride: mouth.override,
    motionFrom: pickRandom([...allCharacters, '']) || undefined,
    particlesFrom: pickRandom([...allCharacters, '']) || undefined,
    soundFrom: pickRandom([...allCharacters, '']) || undefined,
  };
}

export function initCustomizer(instances: Record<string, any>): void {
  const customGrid = document.getElementById('custom-emoji-grid');
  if (!customGrid) return;

  const customItem = document.createElement('div');
  customItem.className = 'emoji-item';
  customItem.innerHTML = `
    <div class="emoji-slot" id="slot-custom"></div>
    <div class="emoji-label">Mi Emoji</div>
    <div class="emoji-sublabel">personalizado</div>
  `;
  customGrid.appendChild(customItem);
  const customSlot = customItem.querySelector<HTMLElement>('#slot-custom');

  const colorInput = document.getElementById('custom-color') as HTMLInputElement;
  const shapeSelect = document.getElementById('custom-shape') as HTMLSelectElement;
  const eyesSelect = document.getElementById('custom-eyes') as HTMLSelectElement;
  const mouthSelect = document.getElementById('custom-mouth') as HTMLSelectElement;
  const motionSelect = document.getElementById('custom-motion') as HTMLSelectElement;
  const particlesSelect = document.getElementById('custom-particles') as HTMLSelectElement;
  const soundSelect = document.getElementById('custom-sound') as HTMLSelectElement;
  const stateBankContainer = document.getElementById('custom-state-bank') as HTMLElement;
  const customConfigCode = document.getElementById('custom-config-code') as HTMLElement;

  if (!colorInput || !shapeSelect || !eyesSelect || !mouthSelect) return;

  const allNames = Object.keys(LIB).filter(n => n !== 'custom');

  [eyesSelect, mouthSelect, motionSelect, particlesSelect].forEach(select => {
    select.innerHTML = `<option value="" class="custom-select-neutral-option">${NEUTRAL_CIRCLE_TEXT[currentLang as keyof typeof NEUTRAL_CIRCLE_TEXT] || NEUTRAL_CIRCLE_TEXT.es}</option>` +
      allNames.map(n =>
        `<option value="${n}">${n.charAt(0).toUpperCase() + n.slice(1)}</option>`
      ).join('');
  });

  soundSelect.innerHTML = `<option value="" class="custom-select-neutral-option">${NEUTRAL_CIRCLE_TEXT[currentLang as keyof typeof NEUTRAL_CIRCLE_TEXT] || NEUTRAL_CIRCLE_TEXT.es}</option>` +
    allNames.map(n =>
      `<option value="${n}">${SOUND_CUE_LABELS[n] || n}</option>`
    ).join('');

  eyesSelect.innerHTML +=
    '<option value="eye:21">Star</option>' +
    '<option value="eye:22">Side-eye</option>' +
    '<option value="eye:23">Wink</option>' +
    '<option value="eye:24">Anime sparkle</option>' +
    '<option value="eye:25">Sleepy</option>' +
    '<option value="eye:26">Googly</option>' +
    '<option value="eye:27">Waterfall</option>' +
    '<option value="eye:28">Blank stare</option>' +
    '<option value="eye:29">Worried</option>' +
    '<option value="eye:30">Angry zigzag</option>' +
    '<option value="eye:31">Content ring</option>';

  mouthSelect.innerHTML +=
    '<option value="mouth:15">Tongue out</option>' +
    '<option value="mouth:16">Smirk</option>' +
    '<option value="mouth:17">Triangle</option>' +
    '<option value="mouth:18">Cat &gt;3&lt;</option>' +
    '<option value="mouth:19">Square surprise</option>' +
    '<option value="mouth:20">Pursed</option>' +
    '<option value="mouth:21">Teeth row</option>' +
    '<option value="mouth:22">Side tongue</option>' +
    '<option value="mouth:23">Big tongue</option>' +
    '<option value="mouth:24">Sassy smile</option>';

  shapeSelect.innerHTML = SHAPES.map(([value, label]) =>
    `<option value="${value}"${value === 'circle' ? ' selected' : ''}>${label}</option>`
  ).join('');

  stateBankContainer.innerHTML = STATE_GROUPS
    .filter(g => g.label !== 'Interacción')
    .flatMap(g => g.states)
    .map(s => `<button type="button" class="state-chip" data-state="${s}">${s}</button>`)
    .join('');

  function getSelectedStateBank(): string[] {
    return [...stateBankContainer.querySelectorAll('.active')].map(b => (b as HTMLElement).dataset.state || '');
  }

  let customSize: any = 'base';
  let customGaze = false;

  function renderCustomEmoji(options: any): void {
    if (instances.custom) instances.custom.destroy();
    createCustomEmoji('custom', options);
    instances.custom = createEmoji('custom', { target: customSlot, size: customSize, gazeTracking: customGaze });
  }

  let customFw = localStorage.getItem('wissive-custom-fw') || 'vanilla';
  let lastCustomOptions: any = {};

  function renderCustomConfigSnippet(options: any): void {
    lastCustomOptions = options;
    if (customConfigCode) {
      customConfigCode.textContent = buildCustomSnippet(customFw, options);
      highlightCode(customConfigCode);
    }
  }

  document.querySelectorAll<HTMLButtonElement>('#custom-fw-picker .btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.fw === customFw);
    btn.addEventListener('click', () => {
      customFw = btn.dataset.fw || 'vanilla';
      localStorage.setItem('wissive-custom-fw', customFw);
      document.querySelectorAll('#custom-fw-picker .btn').forEach(b => b.classList.toggle('active', b === btn));
      renderCustomConfigSnippet(lastCustomOptions);
    });
  });

  const savedCustom = loadCustomEmoji('custom');
  if (savedCustom) {
    colorInput.value = savedCustom.baseColor;
    shapeSelect.value = savedCustom.silhouette || 'circle';
    LIB.custom = savedCustom;
    instances.custom = createEmoji('custom', { target: customSlot, size: customSize });
    (savedCustom.autonomousStatePool || []).forEach(s => {
      const btn = stateBankContainer.querySelector(`[data-state="${s}"]`);
      if (btn) btn.classList.add('active');
    });
    renderCustomConfigSnippet({
      baseColor: savedCustom.baseColor,
      silhouette: savedCustom.silhouette,
      stateBank: savedCustom.autonomousStatePool || [],
    });
  } else {
    renderCustomEmoji({});
    renderCustomConfigSnippet({ baseColor: colorInput.value });
  }

  function applyCustomFromControls(): void {
    const eyes = resolveTraitSelect(eyesSelect.value, 'eye');
    const mouth = resolveTraitSelect(mouthSelect.value, 'mouth');
    const options = {
      baseColor: colorInput.value,
      silhouette: shapeSelect.value || undefined,
      eyesFrom: eyes.from,
      eyeTypeOverride: eyes.override,
      mouthFrom: mouth.from,
      mouthTypeOverride: mouth.override,
      motionFrom: motionSelect.value || undefined,
      particlesFrom: particlesSelect.value || undefined,
      soundFrom: soundSelect.value || undefined,
      stateBank: getSelectedStateBank(),
    };
    renderCustomEmoji(options);
    renderCustomConfigSnippet(options);
    if (instances.custom?.triggerParticles) {
      instances.custom.triggerParticles(10);
    }
  }

  colorInput.addEventListener('input', applyCustomFromControls);
  shapeSelect.addEventListener('change', applyCustomFromControls);
  eyesSelect.addEventListener('change', applyCustomFromControls);
  mouthSelect.addEventListener('change', applyCustomFromControls);
  motionSelect.addEventListener('change', applyCustomFromControls);
  particlesSelect.addEventListener('change', applyCustomFromControls);
  soundSelect.addEventListener('change', applyCustomFromControls);

  stateBankContainer.addEventListener('click', (e) => {
    const btn = (e.target as HTMLElement).closest('button[data-state]');
    if (!btn) return;
    btn.classList.toggle('active');
    applyCustomFromControls();
  });

  const customSizePicker = document.getElementById('custom-size-picker');
  if (customSizePicker) {
    customSizePicker.addEventListener('click', (e) => {
      const btn = (e.target as HTMLElement).closest('button[data-size]') as HTMLElement;
      if (!btn || !btn.parentElement) return;
      btn.parentElement.querySelectorAll('.state-chip').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      customSize = btn.dataset.size;
      if (instances.custom?.setSize) {
        instances.custom.setSize(customSize);
      }
    });
  }

  const btnRandomize = document.getElementById('btn-randomize');
  if (btnRandomize) {
    btnRandomize.addEventListener('click', () => {
      const options = randomCustomOptions();
      colorInput.value = options.baseColor;
      shapeSelect.value = options.silhouette;
      eyesSelect.value = options.eyeTypeOverride !== undefined ? `eye:${options.eyeTypeOverride}` : (options.eyesFrom || '');
      mouthSelect.value = options.mouthTypeOverride !== undefined ? `mouth:${options.mouthTypeOverride}` : (options.mouthFrom || '');
      motionSelect.value = options.motionFrom || '';
      particlesSelect.value = options.particlesFrom || '';
      soundSelect.value = options.soundFrom || '';
      applyCustomFromControls();
    });
  }

  const btnCustomGaze = document.getElementById('btn-custom-gaze');
  if (btnCustomGaze) {
    btnCustomGaze.addEventListener('click', (e) => {
      customGaze = !customGaze;
      (e.target as HTMLElement).classList.toggle('active', customGaze);
      if (instances.custom?.setGazeTracking) {
        instances.custom.setGazeTracking(customGaze);
      }
    });
  }
}
