import { createEmoji, createEmojiGroup, LIB, STATE_GROUPS, ALL_STATES } from '../../../src/index';
import { currentLang, CARD_TOOLTIP_TEXT, COPIED_CHECK_TEXT, STATES_LABEL_TEXT } from './i18n';
import { ORDERED_EMOJIS } from './hero-carousel';

export const SEQUENCES: Record<string, { state: string; duration: number }[]> = {
  saludo: [
    { state: 'curious', duration: 450 },
    { state: 'happy', duration: 700 },
    { state: 'excited', duration: 600 },
    { state: 'idle', duration: 800 },
  ],
  pensar: [
    { state: 'thinking', duration: 1100 },
    { state: 'searching', duration: 900 },
    { state: 'confused', duration: 700 },
    { state: 'proud', duration: 900 },
    { state: 'idle', duration: 800 },
  ],
  celebrar: [
    { state: 'surprised', duration: 350 },
    { state: 'excited', duration: 550 },
    { state: 'laughing', duration: 700 },
    { state: 'celebrate', duration: 800 },
  ],
  dormirse: [
    { state: 'bored', duration: 900 },
    { state: 'drowsy', duration: 1100 },
    { state: 'sleeping', duration: 1600 },
  ],
};

export const THEMES: Record<string, any> = {
  auto: 'auto',
  neon: { baseColor: '#00E5FF' },
  pastel: { baseColor: '#F8BBD0' },
  dark: { baseColor: '#37474F' },
  gold: { baseColor: '#FFD54F' },
};

export function initCatalog(instances: Record<string, any>): void {
  const grid = document.getElementById('emoji-grid');
  const stateSelect = document.getElementById('state-select') as HTMLSelectElement;
  const stateBtns = document.querySelectorAll<HTMLButtonElement>('.btn[data-state]');
  const stateCountLabel = document.getElementById('state-count-label');

  if (stateSelect) {
    stateSelect.innerHTML = STATE_GROUPS.map(g =>
      `<optgroup label="${g.label} (${g.states.length})">` +
      g.states.map(s => `<option value="${s}"${s === 'idle' ? ' selected' : ''}>${s}</option>`).join('') +
      '</optgroup>'
    ).join('');
  }

  if (stateCountLabel) {
    const text = STATES_LABEL_TEXT[currentLang as keyof typeof STATES_LABEL_TEXT] || STATES_LABEL_TEXT.es;
    stateCountLabel.textContent = `${ALL_STATES.length} ${text}`;
  }

  if (grid) {
    grid.innerHTML = '';
    ORDERED_EMOJIS.forEach(name => {
      const def = LIB[name];
      if (!def) return;

      const item = document.createElement('div');
      item.className = 'emoji-item';
      item.title = CARD_TOOLTIP_TEXT[currentLang as keyof typeof CARD_TOOLTIP_TEXT] || CARD_TOOLTIP_TEXT.es;

      item.innerHTML = `
        <div class="emoji-slot" id="slot-${name}"></div>
        <div class="emoji-label">${def.name.charAt(0).toUpperCase() + def.name.slice(1)}</div>
        <div class="emoji-sublabel">${def.emotion}</div>
      `;

      grid.appendChild(item);

      const slot = item.querySelector<HTMLElement>(`#slot-${name}`);
      if (slot) {
        instances[name] = createEmoji(name, { target: slot, size: 120 });
      }

      const sub = item.querySelector<HTMLElement>('.emoji-sublabel');
      const label = item.querySelector<HTMLElement>('.emoji-label');
      if (label && sub) {
        label.addEventListener('click', () => {
          navigator.clipboard.writeText(`createEmoji('${name}', { target, size: 120 })`);
          const original = sub.textContent;
          sub.textContent = COPIED_CHECK_TEXT[currentLang as keyof typeof COPIED_CHECK_TEXT] || COPIED_CHECK_TEXT.es;
          setTimeout(() => { sub.textContent = original; }, 1200);
        });
      }
    });
  }

  // Sinergia multi-emoji
  const emojiGroup = createEmojiGroup(Object.values(instances), {
    proximityThreshold: 220,
    enableGazeSync: true,
    enableSynergies: true,
  });

  function setGlobalState(activeState: string) {
    stateBtns.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.state === activeState);
    });
    if (stateSelect) stateSelect.value = activeState;
    Object.values(instances).forEach(inst => inst.setEmotion(activeState));
  }

  stateBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.dataset.state) setGlobalState(btn.dataset.state);
    });
  });

  if (stateSelect) {
    stateSelect.addEventListener('change', (e) => {
      setGlobalState((e.target as HTMLSelectElement).value);
    });
  }

  let currentFlip = false;
  let currentEmphasis = false;
  let currentGaze = false;
  let currentSound = true;
  let currentDrag = true;
  let currentWander = true;
  let currentSynergy = true;

  document.getElementById('btn-synergy')?.addEventListener('click', (e) => {
    currentSynergy = !currentSynergy;
    (e.target as HTMLElement).classList.toggle('active', currentSynergy);
    if (currentSynergy) {
      emojiGroup.start();
    } else {
      emojiGroup.stop();
      Object.values(instances).forEach(inst => inst.setGaze({ x: 0, y: 0 }));
    }
  });

  document.getElementById('btn-sound')?.addEventListener('click', (e) => {
    currentSound = !currentSound;
    (e.target as HTMLElement).classList.toggle('active', currentSound);
    Object.values(instances).forEach(inst => inst.setSound(currentSound));
  });

  document.getElementById('btn-drag')?.addEventListener('click', (e) => {
    currentDrag = !currentDrag;
    (e.target as HTMLElement).classList.toggle('active', currentDrag);
    Object.values(instances).forEach(inst => inst.setDraggable(currentDrag));
  });

  document.getElementById('btn-wander')?.addEventListener('click', (e) => {
    currentWander = !currentWander;
    (e.target as HTMLElement).classList.toggle('active', currentWander);
    Object.values(instances).forEach(inst => inst.setAutonomousStates(currentWander));
  });

  document.getElementById('btn-gaze')?.addEventListener('click', (e) => {
    currentGaze = !currentGaze;
    (e.target as HTMLElement).classList.toggle('active', currentGaze);
    Object.values(instances).forEach(inst => inst.setGazeTracking(currentGaze));
  });

  document.getElementById('btn-spin')?.addEventListener('click', () => {
    Object.values(instances).forEach(inst => inst.spin(1));
  });

  document.getElementById('btn-bounce')?.addEventListener('click', () => {
    Object.values(instances).forEach(inst => inst.bounce());
  });

  document.getElementById('btn-flip')?.addEventListener('click', (e) => {
    currentFlip = !currentFlip;
    (e.target as HTMLElement).classList.toggle('active', currentFlip);
    Object.values(instances).forEach(inst => inst.setFlipX(currentFlip));
  });

  document.getElementById('btn-emphasis')?.addEventListener('click', (e) => {
    currentEmphasis = !currentEmphasis;
    (e.target as HTMLElement).classList.toggle('active', currentEmphasis);
    Object.values(instances).forEach(inst => inst.setEmphasis(currentEmphasis));
  });

  document.getElementById('theme-select')?.addEventListener('change', (e) => {
    const selectedTheme = THEMES[(e.target as HTMLSelectElement).value] || 'auto';
    Object.values(instances).forEach(inst => {
      if (inst.setTheme) inst.setTheme(selectedTheme);
    });
  });

  document.querySelectorAll<HTMLButtonElement>('.size-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const presetSize = btn.getAttribute('data-size') || 'base';
      Object.values(instances).forEach(inst => {
        if (inst.setSize) inst.setSize(presetSize);
      });
    });
  });

  document.getElementById('btn-sequence-play')?.addEventListener('click', () => {
    const seqKey = (document.getElementById('sequence-select') as HTMLSelectElement)?.value || 'saludo';
    const steps = SEQUENCES[seqKey];
    const mode = (document.getElementById('sequence-mode') as HTMLSelectElement)?.value || 'once';
    if (steps) {
      Object.values(instances).forEach(inst => inst.playSequence(steps, { mode }));
    }
  });

  document.getElementById('btn-sequence-stop')?.addEventListener('click', () => {
    Object.values(instances).forEach(inst => inst.stopSequence());
  });
}
