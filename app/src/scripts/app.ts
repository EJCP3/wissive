import { initTheme } from './theme';
import { initI18n, applyLang, currentLang } from './i18n';
import { initSyntaxHighlighting } from './syntax';
import { initCopyButtons } from './copy';
import { initHeroCarousel } from './hero-carousel';
import { initCatalog } from './catalog';
import { initCustomizer } from './customizer';
import { initExamplesAndUseCases } from './examples';
import { initFrameworkPicker } from './frameworks';

export function initSidebarObserver(): void {
  const links = document.querySelectorAll<HTMLAnchorElement>('#sidebar-nav a');
  const linkByHref = new Map([...links].map(a => [a.getAttribute('href'), a]));
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      const link = linkByHref.get('#' + entry.target.id);
      if (!link) return;
      link.classList.toggle('active', entry.isIntersecting);
    });
  }, { rootMargin: '-80px 0px -70% 0px' });
  document.querySelectorAll('.doc-section, .example-card[id]').forEach(sec => observer.observe(sec));
}

function initApp(): void {
  const instances: Record<string, any> = {};

  initTheme();
  initI18n();
  initCopyButtons();
  initSyntaxHighlighting();
  initFrameworkPicker();
  initSidebarObserver();

  initHeroCarousel();
  initCatalog(instances);
  initCustomizer(instances);
  initExamplesAndUseCases();

  // Aplicar idioma sincronizado a todos los elementos creados dinámicamente
  applyLang(currentLang);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
