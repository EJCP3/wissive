import { createEmoji } from 'wissive';

const EMOJI_NAMES = [
  'mochi', 'zumi', 'suri', 'nima', 'cota', 'dozy', 'lumo',
  'fidge', 'brix', 'wilt', 'knot', 'snug', 'pip', 'void',
];

const COLS = 18;
const ROWS = 10;

function initOG(): void {
  const grid = document.getElementById('og-emoji-grid');
  if (!grid) return;

  const total = COLS * ROWS; // 180 emojis

  for (let i = 0; i < total; i++) {
    const name = EMOJI_NAMES[Math.floor(Math.random() * EMOJI_NAMES.length)];
    const slot = document.createElement('div');
    slot.className = 'og-slot';
    grid.appendChild(slot);

    createEmoji(name, {
      target: slot,
      size: 48,
      interactive: false,
      sound: false,
      autonomousStates: true,
    });
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initOG);
} else {
  initOG();
}
