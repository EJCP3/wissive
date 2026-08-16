import { currentLang, COPIED_TEXT, INSTALL_COPIED_TEXT } from './i18n';

export function showCopyToast(target: HTMLElement): void {
  const toast = document.createElement('div');
  toast.className = 'copy-toast';
  toast.textContent = COPIED_TEXT[currentLang as keyof typeof COPIED_TEXT] || COPIED_TEXT.es;
  target.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('show'));
  setTimeout(() => toast.remove(), 1200);
}

export function initCopyButtons(): void {
  // Chip de instalación en Hero
  const installChip = document.getElementById('install-chip');
  if (installChip) {
    installChip.addEventListener('click', function () {
      navigator.clipboard.writeText('pnpm add wissive');
      const original = this.innerHTML;
      this.textContent = INSTALL_COPIED_TEXT[currentLang as keyof typeof INSTALL_COPIED_TEXT] || INSTALL_COPIED_TEXT.es;
      setTimeout(() => {
        this.innerHTML = original;
      }, 1200);
    });
  }

  // Botones Copiar en code-blocks
  document.querySelectorAll<HTMLButtonElement>('.copy-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const codeEl = btn.nextElementSibling;
      const code = codeEl?.textContent || '';
      navigator.clipboard.writeText(code);
      const original = btn.textContent;
      btn.textContent = COPIED_TEXT[currentLang as keyof typeof COPIED_TEXT] || COPIED_TEXT.es;
      setTimeout(() => {
        btn.textContent = original;
      }, 1200);
    });
  });
}
