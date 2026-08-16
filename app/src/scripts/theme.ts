export function initTheme(): void {
  const themeToggle = document.getElementById('theme-toggle');
  if (!themeToggle) return;

  function applyTheme(theme: string): void {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('wissive-theme', theme);
    themeToggle.textContent = theme === 'dark' ? 'dias' : 'noche';
  }

  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const savedTheme = localStorage.getItem('wissive-theme');
  applyTheme(savedTheme || (systemPrefersDark ? 'dark' : 'light'));

  themeToggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    applyTheme(current === 'dark' ? 'light' : 'dark');
  });
}
