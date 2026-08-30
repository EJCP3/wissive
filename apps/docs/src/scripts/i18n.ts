export const COPIED_TEXT = { es: '¡Copiado!', en: 'Copied!' };
export const COPIED_CHECK_TEXT = { es: 'copiado ✓', en: 'copied ✓' };
export const INSTALL_COPIED_TEXT = { es: '¡Copiado! ✓', en: 'Copied! ✓' };
export const CARD_TOOLTIP_TEXT = {
  es: 'Click en el nombre para copiar el snippet',
  en: 'Click the name to copy the snippet',
};
export const RANDOM_TOOLTIP_TEXT = { es: 'Click para copiar el snippet', en: 'Click to copy the snippet' };
export const NEUTRAL_CIRCLE_TEXT = { es: '(círculo neutro)', en: '(neutral circle)' };
export const STATES_LABEL_TEXT = { es: 'Estados:', en: 'States:' };
export const MOBILE_TOC_ARIA = { es: 'Contenido de la página', en: 'Page contents' };
export const TITLE_TEXT = { es: 'Wissive — Emojis vivos', en: 'Wissive — Living emojis' };
export const THEME_TOOLTIP_TEXT = {
  light: { es: 'Modo claro (Día)', en: 'Light mode (Day)' },
  dark: { es: 'Modo oscuro (Noche)', en: 'Dark mode (Night)' },
};

export const I18N_EN: [string, string][] = [
  ['.hero .tagline', `Interactive emojis with living expressions, sounds, and unique customization for distinct personalities — add micro-life to your web.`],
  ['.hero-try-label', 'Try it — click or hover'],
  ['.copy-btn', 'Copy'],

  ['.mobile-toc a[href="#introduccion"]', 'Introduction'],
  ['.mobile-toc a[href="#instalacion"]', 'Installation'],
  ['.mobile-toc a[href="#catalogo"]', 'Catalog'],
  ['.mobile-toc a[href="#casos-de-uso"]', 'Use cases'],
  ['.mobile-toc a[href="#personalizado"]', 'Customize'],
  ['.mobile-toc a[href="#uso-basico"]', 'Basic usage'],
  ['.mobile-toc a[href="#opciones"]', 'Options'],
  ['.mobile-toc a[href="#estados"]', 'States'],
  ['.mobile-toc a[href="#sonido"]', 'Sound'],
  ['.mobile-toc a[href="#accesibilidad"]', 'Accessibility'],
  ['.mobile-toc a[href="#movil"]', 'Mobile & touch'],
  ['.mobile-toc a[href="#frameworks"]', 'Frameworks'],
  ['.mobile-toc a[href="#rendimiento"]', 'Performance'],

  ['.sidebar-label', '☰ On this page'],
  ['.sidebar-nav-group a[href="#introduccion"]', 'Introduction'],
  ['.sidebar-nav-group a[href="#instalacion"]', 'Installation'],
  ['.sidebar-nav-group a[href="#catalogo"]', 'Catalog'],
  ['.sidebar-nav-group a[href="#casos-de-uso"]', 'Use cases'],
  ['.sidebar-nav-group a[href="#personalizado"]', 'Your own emoji'],
  ['.sidebar-nav-group a[href="#uso-basico"]', 'Basic usage'],
  ['.sidebar-nav-group a[href="#ej-basico"]', 'Basic emoji'],
  ['.sidebar-nav-group a[href="#ej-programatico"]', 'Programmatic control'],
  ['.sidebar-nav-group a[href="#ej-decorativo"]', 'Decorative only'],
  ['.sidebar-nav-group a[href="#opciones"]', 'Options'],
  ['.sidebar-nav-group a[href="#estados"]', 'Interaction states'],
  ['.sidebar-nav-group a[href="#sonido"]', 'Sound'],
  ['.sidebar-nav-group a[href="#accesibilidad"]', 'Accessibility'],
  ['.sidebar-nav-group a[href="#movil"]', 'Mobile & touch'],
  ['.sidebar-nav-group a[href="#frameworks"]', 'Frameworks'],
  ['.sidebar-nav-group a[href="#rendimiento"]', 'Performance (QA)'],
  ['.sidebar-nav-group a[href="#estudio-animacion"]', 'Animation Studio'],
  ['#tab-btn-studio', 'Studio'],
  ['.topnav-links a[data-tab-target="studio"]', 'Studio'],
  ['#estudio-animacion h2', 'Animation Studio & Montage'],
  ['#estudio-animacion p', 'Create your own custom animation sequences by composing expressions, states, and timings on the timeline. Drag the playhead to preview in real-time and export ready-to-use code for your project.'],
  ['.sidebar-nav-group a[href="#creditos"]', 'Credits'],

  ['#introduccion h2', 'Introduction'],
  ['#introduccion p:nth-of-type(1)', `Wissive is a vanilla JavaScript/TypeScript library — zero required runtime dependencies, no framework needed — that renders 14 <em>blob</em>-style characters with unique designs and real-time interactivity. Each one features 24 expressions across 4 interaction states, interpolated with a damped spring instead of a linear CSS <code>transition</code>, giving movement an organic, living feel.`],
  ['#introduccion p:nth-of-type(2)', `It's not just an icon set: it's a full expression engine. In addition to its pre-built catalog, it allows you to <strong>create and customize your own emoji</strong> by combining silhouettes, eyes, mouths, colors, sounds, and particles with just a few lines of code.`],

  ['#instalacion h2', 'Installation'],
  ['#instalacion p:nth-of-type(1)', 'Via pnpm, to use with a bundler:'],
  ['#instalacion p:nth-of-type(2)', 'Or via CDN, nothing to install:'],
  ['#instalacion p:nth-of-type(3)', 'Lightweight micro-library with zero required runtime dependencies.'],

  ['#catalogo h2', 'Catalog — 14 personalities'],
  ['#catalogo > p', `Each emoji has 24 expressions spread across 4 states. Try the controls, or click any emoji's name to copy its <code>createEmoji()</code>.`],
  ['#catalogo .toolbar-label:nth-of-type(1)', 'State:'],
  ['#btn-synergy', 'Multi-Emoji Synergy'],
  ['#btn-sound', 'Sound'],
  ['#btn-drag', 'Drag'],
  ['#btn-wander', 'Wander'],
  ['#btn-gaze', 'Follow Cursor'],
  ['#btn-spin', 'Spin 360°'],
  ['#btn-bounce', 'Bounce'],
  ['#btn-flip', 'Mirror'],
  ['#btn-emphasis', 'Emphasis'],
  ['#theme-select option[value="auto"]', 'Auto (By State)'],
  ['#theme-select option[value="neon"]', 'Neon Cyberpunk'],
  ['#theme-select option[value="pastel"]', 'Soft Pastel'],
  ['#theme-select option[value="gold"]', 'Golden Glam'],
  ['#sequence-select option[value="saludo"]', 'Greeting'],
  ['#sequence-select option[value="pensar"]', 'Think and reply'],
  ['#sequence-select option[value="celebrar"]', 'Celebrate'],
  ['#sequence-select option[value="dormirse"]', 'Fall asleep'],
  ['#sequence-mode option[value="once"]', 'once'],
  ['#sequence-mode option[value="loop"]', 'loop'],
  ['#sequence-mode option[value="ping-pong"]', 'ping-pong'],
  ['#btn-sequence-play', 'Play'],
  ['#btn-sequence-stop', 'Stop'],

  ['#casos-de-uso h2', 'Use cases'],
  ['#casos-de-uso > p', `Not just a catalog to look at — every character is meant to live inside a real interface. These are UI mockups built with CSS; the emoji in each one is a real instance, mounted with <code>createEmoji()</code>.`],
  ['.usecase-card:nth-of-type(1) .usecase-card-label', 'Button icon'],
  ['.usecase-card:nth-of-type(2) .usecase-card-label', 'Logo / brand'],
  ['.usecase-card:nth-of-type(3) .usecase-card-label', 'Empty state'],
  ['.usecase-card:nth-of-type(4) .usecase-card-label', 'Notification'],
  ['.usecase-card:nth-of-type(5) .usecase-card-label', 'Assistant / chat'],
  ['.usecase-card:nth-of-type(6) .usecase-card-label', 'Loading state'],
  ['.usecase-card:nth-of-type(7) .usecase-card-label', 'Form feedback'],
  ['.usecase-card:nth-of-type(8) .usecase-card-label', 'Floating mascot'],
  ['.usecase-card:nth-of-type(9) .usecase-card-label', 'User avatar'],
  ['.uc-like-btn-text', 'Like <span class="uc-like-count">128</span>'],
  ['.uc-navbar-links', 'Home · Pricing · Blog'],
  ['.uc-empty-text', "There's nothing here yet"],
  ['.uc-toast-text strong', 'Done'],
  ['.uc-toast-text span', 'Your changes were saved.'],
  ['.uc-chat-bubble', 'Hi! What can I help with today?'],
  ['.uc-field-label', 'Email'],
  ['.uc-comment-time', '2h ago'],
  ['.uc-comment-text', 'Looks amazing, congrats!'],

  ['#personalizado h2', 'Your own emoji'],
  ['#personalizado > p', 'Circle base, pick the traits: eyes, mouth, personality, particles, and sound from any of the 14, mixed however you like.'],
  ['#btn-randomize', 'Randomize'],
  ['#btn-custom-gaze', 'Follow Cursor'],
  ['#custom-panel-wrapper .toolbar-label:nth-of-type(1)', 'Color:'],
  ['#custom-panel-wrapper .toolbar-label:nth-of-type(2)', 'Shape:'],
  ['#custom-panel-wrapper .toolbar-label:nth-of-type(3)', 'Eyes from:'],
  ['#custom-panel-wrapper .toolbar-label:nth-of-type(4)', 'Mouth from:'],
  ['#custom-panel-wrapper .toolbar-label:nth-of-type(5)', 'Personality from:'],
  ['#custom-panel-wrapper .toolbar-label:nth-of-type(6)', 'Particles from:'],
  ['#custom-panel-wrapper .toolbar-label:nth-of-type(7)', 'Sound from:'],
  ['#custom-panel-wrapper .toolbar-label:nth-of-type(8)', 'Size:'],
  ['#custom-panel-wrapper .toolbar-label:nth-of-type(9)', 'Animation bank — what it wanders into while idle:'],
  ['#personalizado p[style*="margin-top: 2rem"]', 'Your configuration, ready to copy:'],

  ['#uso-basico h2', 'Basic usage'],
  ['#uso-basico > p', `Three common ways to use <code>createEmoji()</code>, with the real code for each.`],
  ['.example-card:nth-of-type(1) .example-card-title', 'Basic emoji'],
  ['.example-card:nth-of-type(2) .example-card-title', 'Programmatic control'],
  ['.example-card:nth-of-type(3) .example-card-title', 'Decorative only (no listeners)'],
  ['#ex-prog-happy', 'Happy'],
  ['#ex-prog-sad', 'Sad'],
  ['#ex-prog-bounce', 'Bounce'],

  ['#opciones h2', 'Options'],
  ['#opciones > p', `Second parameter of <code>createEmoji(name, options)</code>.`],
  ['#opciones th:nth-child(1)', 'Option'],
  ['#opciones th:nth-child(2)', 'Type'],
  ['#opciones th:nth-child(3)', 'Default'],
  ['#opciones th:nth-child(4)', 'What it does'],
  ['#opciones tr:nth-child(1) td:nth-child(4)', 'Where it mounts (required).'],
  ['#opciones tr:nth-child(2) td:nth-child(4)', `Size in px, or <code>xs/sm/base/lg/xl/2xl</code>.`],
  ['#opciones tr:nth-child(3) td:nth-child(4)', `<code>false</code> = decorative only, no listeners.`],
  ['#opciones tr:nth-child(4) td:nth-child(4)', 'Requires Cuelume installed.'],
  ['#opciones tr:nth-child(5) td:nth-child(4)', 'Draggable, with spring physics.'],
  ['#opciones tr:nth-child(6) td:nth-child(4)', `Radius in px for the <code>near</code> state.`],
  ['#opciones tr:nth-child(7) td:nth-child(4)', 'The eyes follow the cursor.'],
  ['#opciones tr:nth-child(8) td:nth-child(4)', 'Occasional particles while idle.'],
  ['#opciones tr:nth-child(9) td:nth-child(4)', 'Wanders into random reactions while idle.'],
  ['#opciones tr:nth-child(10) td:nth-child(4)', `Follows <code>prefers-reduced-motion</code>, or forced.`],
  ['#opciones tr:nth-child(11) td:nth-child(4)', 'Custom base color.'],

  ['#estados h2', 'Interaction states'],
  ['#estados > p', 'Each state fires a pool of variants; one is drawn at random, avoiding the previous one.'],
  ['#estados th:nth-child(1)', 'State'],
  ['#estados th:nth-child(2)', 'Trigger'],
  ['#estados th:nth-child(3)', 'Description'],
  ['#estados tr:nth-child(1) td:nth-child(2)', 'No interaction'],
  ['#estados tr:nth-child(1) td:nth-child(3)', 'Idle, slow breathing.'],
  ['#estados tr:nth-child(2) td:nth-child(2)', 'Cursor gets close (configurable radius)'],
  ['#estados tr:nth-child(2) td:nth-child(3)', 'The emoji "notices" something approaching.'],
  ['#estados tr:nth-child(3) td:nth-child(3)', 'Cursor directly on top.'],
  ['#estados tr:nth-child(4) td:nth-child(2)', `<code>mousedown</code>/<code>up</code>, <code>touchstart</code>, Enter/Space`],
  ['#estados tr:nth-child(4) td:nth-child(3)', 'Direct interaction.'],

  ['#sonido h2', 'Sound (optional)'],
  ['#sonido > p', `Optional integration with <a href="https://cuelume-site.pages.dev/" target="_blank" rel="noopener">Cuelume</a> — <em>peer dependency</em>, never required. Detected at runtime (dynamic import); if it isn't installed, the library still works, silently, with no console errors.`],

  ['#accesibilidad h2', 'Accessibility'],
  ['#accesibilidad > p', `<code>role="img"</code> + dynamic <code>aria-label</code> based on the current emotion and state. Keyboard navigable (<code>tabindex</code>, Enter/Space act as click). Respects the operating system's <code>prefers-reduced-motion</code>. Stroke/fill contrast verified ≥3:1 (WCAG) across all 14 emojis.`],

  ['#movil h2', 'Mobile & Touch Screens'],
  ['#movil > p', 'On mobile devices there is no persistent cursor or <code>:hover</code> state. Wissive automatically detects touch environments (<code>isTouchDevice()</code> / <code>supportsHover()</code>) and optimizes interactions:'],
  ['#movil li:nth-child(1)', '<strong>Battery & CPU Savings:</strong> Disables continuous mouse proximity calculations on purely touch screens.'],
  ['#movil li:nth-child(2)', '<strong>Clean Touch Handling:</strong> <code>touchstart</code> and <code>touchend</code> trigger and restore expressions instantly, avoiding sticky hover states.'],
  ['#movil li:nth-child(3)', '<strong>Touch Drag Physics:</strong> <code>DragPhysics</code> supports direct touch gestures with inertia and bounce without blocking page scrolling.'],
  ['#movil li:nth-child(4)', '<strong>Autonomous Micro-life:</strong> With <code>autonomousStates: true</code>, emojis blink, glance around, and change emotions on their own without requiring user interaction.'],

  ['#frameworks h2', 'Framework integration'],
  ['#frameworks > p', `Official wrappers for React, Vue, and Astro (<code>wissive/react</code>, <code>wissive/vue</code>, <code>wissive/astro</code>) — for React/Vue they package the usual <code>createEmoji()</code> + <code>destroy()</code> pattern; for Astro there's no timing problem to solve (none needed), they just save repeating the <code>&lt;script&gt;</code> if you use the emoji on several pages. Pick one — the block below remembers it.`],
  ['#frameworks p:last-of-type', `Full examples in <a href="https://github.com/EJCP3/wissive/tree/master/examples" target="_blank" rel="noopener"><code>examples/</code></a>.`],

  ['#rendimiento h2', 'Performance & Stress (QA)'],
  ['#rendimiento > p', 'Wissive uses a single shared requestAnimationFrame loop and ultra-optimized sub-stepped physics calculations. Test the library rendering 50 or 100 simultaneous living emojis in real-time.'],

  ['#creditos h2', 'Credits'],
  ['#creditos > p', `MIT license. Optional sound via <a href="https://cuelume-site.pages.dev/" target="_blank" rel="noopener">Cuelume</a>`],
];

export let currentLang = 'es';

export function applyLang(lang: string): void {
  I18N_EN.forEach(([selector, en]) => {
    document.querySelectorAll<HTMLElement>(selector).forEach(el => {
      if (el.dataset.es === undefined) el.dataset.es = el.innerHTML;
      el.innerHTML = lang === 'en' ? en : el.dataset.es;
    });
  });
  document.querySelectorAll<HTMLElement>('.custom-select-neutral-option').forEach(opt => {
    opt.textContent = NEUTRAL_CIRCLE_TEXT[lang as keyof typeof NEUTRAL_CIRCLE_TEXT] || NEUTRAL_CIRCLE_TEXT.es;
  });
  document.querySelectorAll<HTMLElement>('.emoji-item[title]').forEach(item => {
    item.title = CARD_TOOLTIP_TEXT[lang as keyof typeof CARD_TOOLTIP_TEXT] || CARD_TOOLTIP_TEXT.es;
  });
  const countLabel = document.getElementById('state-count-label');
  if (countLabel) {
    const text = STATES_LABEL_TEXT[lang as keyof typeof STATES_LABEL_TEXT] || STATES_LABEL_TEXT.es;
    countLabel.textContent = `42 ${text}`;
  }
  const mobileToc = document.querySelector('.mobile-toc');
  if (mobileToc) {
    mobileToc.setAttribute('aria-label', MOBILE_TOC_ARIA[lang as keyof typeof MOBILE_TOC_ARIA] || MOBILE_TOC_ARIA.es);
  }
  const themeTooltipText = document.getElementById('theme-tooltip-text');
  if (themeTooltipText) {
    const currentTheme = (document.documentElement.getAttribute('data-theme') || 'dark') as 'light' | 'dark';
    const textMap = THEME_TOOLTIP_TEXT[currentTheme] || THEME_TOOLTIP_TEXT.dark;
    themeTooltipText.textContent = textMap[lang as keyof typeof textMap] || textMap.es;
  }
  document.documentElement.lang = lang;
  document.title = TITLE_TEXT[lang as keyof typeof TITLE_TEXT] || TITLE_TEXT.es;
  const langToggle = document.getElementById('lang-toggle');
  if (langToggle) langToggle.textContent = lang === 'en' ? 'ES' : 'EN';
  localStorage.setItem('wissive-lang', lang);
  currentLang = lang;
}

export function initI18n(): void {
  const savedLang = localStorage.getItem('wissive-lang') || 'es';
  if (savedLang !== 'es') {
    applyLang(savedLang);
  }
  const langToggle = document.getElementById('lang-toggle');
  if (langToggle) {
    langToggle.addEventListener('click', () => {
      applyLang(currentLang === 'en' ? 'es' : 'en');
    });
  }
}
