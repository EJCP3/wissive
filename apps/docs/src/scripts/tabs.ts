import { initSidebarObserver } from './app';

export type TabType = 'docs' | 'labs' | 'studio';

const LABS_HASHES = new Set(['#catalogo', '#personalizado', '#labs']);
const STUDIO_HASHES = new Set(['#studio', '#estudio', '#estudio-animacion']);
const DOCS_HASHES = new Set([
  '#docs',
  '#introduccion',
  '#instalacion',
  '#casos-de-uso',
  '#uso-basico',
  '#ej-basico',
  '#ej-programatico',
  '#ej-decorativo',
  '#opciones',
  '#estados',
  '#sonido',
  '#accesibilidad',
  '#frameworks',
  '#rendimiento',
  '#creditos',
]);

export function switchTab(tab: TabType, shouldScroll = false): void {
  // Update view tab buttons (segment control in sidebar)
  const tabBtns = document.querySelectorAll<HTMLButtonElement>('.view-tab');
  tabBtns.forEach(btn => {
    const isTarget = btn.dataset.view === tab;
    btn.classList.toggle('active', isTarget);
    btn.setAttribute('aria-selected', isTarget ? 'true' : 'false');
  });

  // Update topnav active state
  const topnavLinks = document.querySelectorAll<HTMLAnchorElement>('.nav-link-tab');
  topnavLinks.forEach(link => {
    link.classList.toggle('active', link.dataset.tabTarget === tab);
  });

  // Update visible view container
  const docsView = document.getElementById('view-docs');
  const labsView = document.getElementById('view-labs');
  const studioView = document.getElementById('view-studio');

  if (docsView) docsView.classList.toggle('active', tab === 'docs');
  if (labsView) labsView.classList.toggle('active', tab === 'labs');
  if (studioView) studioView.classList.toggle('active', tab === 'studio');

  // Update sidebar navigation and label
  const sidebarDocs = document.getElementById('sidebar-nav-docs');
  const sidebarLabs = document.getElementById('sidebar-nav-labs');
  const sidebarLabel = document.querySelector<HTMLElement>('.sidebar-label');

  if (sidebarDocs) sidebarDocs.classList.toggle('active', tab === 'docs');
  if (sidebarLabs) sidebarLabs.classList.toggle('active', tab === 'labs');
  if (sidebarLabel) {
    sidebarLabel.style.display = tab === 'studio' ? 'none' : '';
  }

  // Re-run observer so links inside the active view are observed
  initSidebarObserver();

  if (shouldScroll) {
    const targetElement = document.getElementById('app-main') || document.getElementById('docs-view-root');
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
  }
}

export function initTabs(): void {
  // Bind tab buttons (segment control in sidebar)
  document.querySelectorAll<HTMLButtonElement>('.view-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = (btn.dataset.view || 'labs') as TabType;
      switchTab(target);
    });
  });

  // Bind topnav links
  document.querySelectorAll<HTMLAnchorElement>('.nav-link-tab').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = (link.dataset.tabTarget || 'labs') as TabType;
      switchTab(target, true);
    });
  });

  // Determine initial tab based on hash
  const hash = window.location.hash.toLowerCase();
  if (DOCS_HASHES.has(hash)) {
    switchTab('docs');
  } else if (STUDIO_HASHES.has(hash)) {
    switchTab('studio');
  } else {
    switchTab('labs');
  }

  // Listen to hash changes in case of anchor clicks elsewhere
  window.addEventListener('hashchange', () => {
    const currentHash = window.location.hash.toLowerCase();
    if (DOCS_HASHES.has(currentHash)) {
      switchTab('docs');
    } else if (STUDIO_HASHES.has(currentHash)) {
      switchTab('studio');
    } else if (LABS_HASHES.has(currentHash)) {
      switchTab('labs');
    }
  });
}

