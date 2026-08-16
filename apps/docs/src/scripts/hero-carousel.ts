import { createEmoji, createCustomEmoji } from 'wissive';
import { currentLang, RANDOM_TOOLTIP_TEXT } from './i18n';
import { showCopyToast } from './copy';
import { randomCustomOptions, buildCustomConfigCall } from './customizer';

export const ORDERED_EMOJIS = [
  'mochi',   // happy
  'zumi',    // flutter
  'suri',    // pleasure
  'nima',    // peaceful
  'cota',    // normal
  'dozy',    // tired
  'lumo',    // sad
  'fidge',   // anxiety
  'brix',    // anger
  'wilt',    // disappointed
  'knot',    // stress
  'snug',    // sleepy
  'pip',     // surprised
  'void',    // numbness
];

export function initHeroCarousel(): void {
  const heroRow = document.getElementById('hero-try-row');
  if (!heroRow) return;

  const HERO_RANDOM_COUNT = 4;
  const heroRandomNames: string[] = [];
  const heroRandomOptions = new Map<string, any>();

  for (let i = 0; i < HERO_RANDOM_COUNT; i++) {
    const name = `hero-random-${i}`;
    const options = randomCustomOptions();
    createCustomEmoji(name, options);
    heroRandomOptions.set(name, options);
    heroRandomNames.push(name);
  }

  const heroFaces = [...ORDERED_EMOJIS];
  heroRandomNames.forEach((name, i) => {
    const pos = Math.floor((i + 1) * (heroFaces.length / (heroRandomNames.length + 1)));
    heroFaces.splice(pos, 0, name);
  });

  [...heroFaces, ...heroFaces].forEach(name => {
    const slot = document.createElement('div');
    slot.className = 'hero-try-item';
    heroRow.appendChild(slot);
    createEmoji(name, { target: slot, size: 68, draggable: false });

    if (heroRandomOptions.has(name)) {
      slot.title = RANDOM_TOOLTIP_TEXT[currentLang as keyof typeof RANDOM_TOOLTIP_TEXT] || RANDOM_TOOLTIP_TEXT.es;
      slot.addEventListener('click', () => {
        const snippet = `${buildCustomConfigCall(name, heroRandomOptions.get(name))}\n\nconst emoji = createEmoji('${name}', { target });`;
        navigator.clipboard.writeText(snippet);
        showCopyToast(slot);
      });
    }
  });
}
