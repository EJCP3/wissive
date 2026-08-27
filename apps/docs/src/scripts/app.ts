import { initTheme, initBrandEmoji } from './theme';
import { initI18n, applyLang, currentLang } from './i18n';
import { initSyntaxHighlighting } from './syntax';
import { initCopyButtons } from './copy';
import { initHeroCarousel } from './hero-carousel';
import { initCatalog } from './catalog';
import { initCustomizer } from './customizer';
import { initExamplesAndUseCases } from './examples';
import { initFrameworkPicker } from './frameworks';
import { initPerformanceStressTest } from './performance';
import { initTabs } from './tabs';

let activeObserver: IntersectionObserver | null = null;

export function initSidebarObserver(): void {
  if (activeObserver) {
    activeObserver.disconnect();
  }

  const links = document.querySelectorAll<HTMLAnchorElement>('.sidebar-nav-group.active a');
  const linkByHref = new Map([...links].map(a => [a.getAttribute('href'), a]));
  
  activeObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      const link = linkByHref.get('#' + entry.target.id);
      if (!link) return;
      link.classList.toggle('active', entry.isIntersecting);
    });
  }, { rootMargin: '-80px 0px -70% 0px' });

  const activeView = document.querySelector('.tab-view.active');
  if (activeView) {
    activeView.querySelectorAll('.doc-section, .example-card[id]').forEach(sec => activeObserver!.observe(sec));
  }
}

function initApp(): void {
  const instances: Record<string, any> = {};

  initTheme();
  initBrandEmoji();
  initI18n();
  initCopyButtons();
  initSyntaxHighlighting();
  initFrameworkPicker();
  initTabs();
  initSidebarObserver();

  initHeroCarousel();
  initCatalog(instances);
  initCustomizer(instances);
  initExamplesAndUseCases();
  initPerformanceStressTest();

  // Aplicar idioma sincronizado a todos los elementos creados dinámicamente
  applyLang(currentLang);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
