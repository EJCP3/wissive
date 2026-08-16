import { createEmoji } from '../../../src/index';

export function initExamplesAndUseCases(): void {
  // Tabs Preview / Code
  document.querySelectorAll<HTMLElement>('.example-tabs').forEach(tabs => {
    const card = tabs.closest<HTMLElement>('.example-card');
    if (!card) return;
    const preview = card.querySelector<HTMLElement>('.example-preview');
    const code = card.querySelector<HTMLElement>('.example-code');
    if (!preview || !code) return;

    tabs.querySelectorAll<HTMLButtonElement>('.example-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.querySelectorAll('.example-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const showCode = tab.dataset.tab === 'code';
        preview.hidden = showCode;
        code.hidden = !showCode;
      });
    });
  });

  // Instancias de "Uso básico"
  const basicSlot = document.getElementById('example-basic-slot');
  if (basicSlot) {
    createEmoji('mochi', { target: basicSlot, size: 100 });
  }

  const progSlot = document.getElementById('example-prog-slot');
  if (progSlot) {
    const progEmoji = createEmoji('mochi', { target: progSlot, size: 100 });
    document.getElementById('ex-prog-happy')?.addEventListener('click', () => progEmoji.setEmotion('happy'));
    document.getElementById('ex-prog-sad')?.addEventListener('click', () => progEmoji.setEmotion('sad'));
    document.getElementById('ex-prog-bounce')?.addEventListener('click', () => progEmoji.bounce());
  }

  const decorSlot = document.getElementById('example-decor-slot');
  if (decorSlot) {
    createEmoji('nima', { target: decorSlot, size: 100, interactive: false });
  }

  // Casos de uso (9 mockups)
  const slotBtn = document.getElementById('uc-slot-btn');
  if (slotBtn) createEmoji('mochi', { target: slotBtn, size: 26, draggable: false });

  const slotLogo = document.getElementById('uc-slot-logo');
  if (slotLogo) createEmoji('zumi', { target: slotLogo, size: 30, draggable: false });

  const slotEmpty = document.getElementById('uc-slot-empty');
  if (slotEmpty) createEmoji('void', { target: slotEmpty, size: 56, draggable: false, interactive: false, ambientParticles: false });

  const slotToast = document.getElementById('uc-slot-toast');
  if (slotToast) createEmoji('suri', { target: slotToast, size: 30, draggable: false, interactive: false });

  const slotChat = document.getElementById('uc-slot-chat');
  if (slotChat) createEmoji('cota', { target: slotChat, size: 44, draggable: false });

  const slotLoading = document.getElementById('uc-slot-loading');
  if (slotLoading) createEmoji('dozy', { target: slotLoading, size: 40, draggable: false, interactive: false });

  const slotForm = document.getElementById('uc-slot-form');
  if (slotForm) createEmoji('nima', { target: slotForm, size: 26, draggable: false, interactive: false });

  const slotFloat = document.getElementById('uc-slot-float');
  if (slotFloat) createEmoji('pip', { target: slotFloat, size: 36, draggable: false });

  const slotAvatar = document.getElementById('uc-slot-avatar');
  if (slotAvatar) createEmoji('snug', { target: slotAvatar, size: 40, draggable: false });
}
