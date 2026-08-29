import { createEmoji, createCustomEmoji } from 'wissive';

const EMOJI_NAMES = [
  'mochi', 'zumi', 'suri', 'nima', 'cota', 'dozy', 'lumo',
  'fidge', 'brix', 'wilt', 'knot', 'snug', 'pip', 'void',
];

const SHAPES = [
  'circle', 'heart', 'round-blob', 'capsule', 'rounded-squircle', 'pear-blob',
  'egg-oval', 'starburst-puff', 'pill-vertical', 'ghost-blob', 'oval',
  'elongated-oval', 'teardrop-blob', 'flame-blob', 'droopy-blob',
  'bear-blob', 'spiky-blob', 'cloud-blob', 'wide-oval', 'soft-round',
  'octopus-blob', 'wave-blob',
];

const COLORS = [
  '#FFD93D', '#FF6B6B', '#6BCB77', '#4D96FF', '#FF8B8B', '#A66CFF',
  '#FF7EB3', '#7AFDD6', '#F9C80E', '#FF595E', '#8AC926', '#1982C4',
  '#6A4C93', '#FF99C8', '#FCF6BD', '#D0F4DE', '#A9DEF9', '#E4C1F9',
  '#F694C1', '#EDE7B1', '#A8DADC', '#FFB4A2', '#E5989B', '#B5838D',
  '#FFCDB2', '#8ECAE6', '#219EBC', '#FB8500', '#FFB703', '#023047',
];

const pick = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

const COLS = 18;
const ROWS = 10;

function initOG(): void {
  const grid = document.getElementById('og-emoji-grid');
  if (!grid) return;

  const total = COLS * ROWS;

  // Mezclar los 14 emojis base para que no se repitan consecutivamente
  const shuffled: string[] = [];
  for (let i = 0; i < total; i++) {
    shuffled.push(pick(EMOJI_NAMES));
  }

  // Para cada segundo emoji, usar un custom con diseño único
  for (let i = 0; i < total; i++) {
    const slot = document.createElement('div');
    slot.className = 'og-slot';
    grid.appendChild(slot);

    const useCustom = Math.random() > 0.35; // 65% custom, 35% base

    if (useCustom) {
      const customName = `og-${i}`;
      const eyeSource = pick(EMOJI_NAMES);
      const mouthSource = pick(EMOJI_NAMES);
      // Asegurar que ojos y boca vengan de personajes distintos
      let mouthFinal = mouthSource;
      if (mouthFinal === eyeSource) {
        mouthFinal = pick(EMOJI_NAMES.filter(n => n !== eyeSource));
      }

      createCustomEmoji(customName, {
        baseColor: pick(COLORS),
        silhouette: pick(SHAPES),
        eyesFrom: eyeSource,
        mouthFrom: mouthFinal,
        motionFrom: pick(EMOJI_NAMES),
      });

      createEmoji(customName, {
        target: slot,
        size: 48,
        interactive: false,
        sound: false,
        autonomousStates: true,
      });
    } else {
      createEmoji(shuffled[i], {
        target: slot,
        size: 48,
        interactive: false,
        sound: false,
        autonomousStates: true,
      });
    }
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initOG);
} else {
  initOG();
}
