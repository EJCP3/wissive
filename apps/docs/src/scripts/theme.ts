import { createEmoji, buildCustomEmoji, LIB } from 'wissive';
import type { WissiveInstance } from 'wissive';
import { THEME_TOOLTIP_TEXT } from './i18n';

// Registrar emojis especializados para la marca y el selector de tema
function ensureSpecializedEmojis(): void {
  if (!LIB['classic-happy']) {
    LIB['classic-happy'] = buildCustomEmoji('classic-happy', {
      baseColor: '#FFD23F',
      silhouette: 'circle',
      eyesFrom: 'mochi',
      mouthFrom: 'mochi',
      motionFrom: 'mochi',
      particlesFrom: 'mochi',
      soundFrom: 'mochi',
      stateBank: ['happy', 'excited', 'celebrate', 'playful', 'curious', 'laughing'],
    });
  }

  if (!LIB['day-sun']) {
    LIB['day-sun'] = buildCustomEmoji('day-sun', {
      baseColor: '#F59E0B',
      silhouette: 'circle',
      eyesFrom: 'mochi',
      mouthFrom: 'mochi',
      motionFrom: 'zumi',
      particlesFrom: 'mochi',
      soundFrom: 'mochi',
      stateBank: ['excited', 'happy', 'celebrate', 'playful', 'proud'],
    });
  }

  if (!LIB['night-moon']) {
    LIB['night-moon'] = buildCustomEmoji('night-moon', {
      baseColor: '#6366F1',
      silhouette: 'circle',
      eyesFrom: 'snug',
      mouthFrom: 'snug',
      motionFrom: 'snug',
      particlesFrom: 'snug',
      soundFrom: 'snug',
      stateBank: ['sleeping', 'drowsy', 'peaceful', 'idle'],
    });
  }
}

export function initBrandEmoji(): void {
  ensureSpecializedEmojis();

  const brandSlot = document.getElementById('nav-brand-emoji');
  if (!brandSlot) return;

  brandSlot.innerHTML = '';
  const brandEmoji = createEmoji('classic-happy', {
    target: brandSlot,
    size: 28,
    interactive: true,
    sound: false,
    autonomousStates: true,
  });

  const brandLink = document.querySelector('.brand');
  brandLink?.addEventListener('mouseenter', () => {
    brandEmoji.bounce();
    brandEmoji.setEmotion('happy');
  });
}

export function initTheme(): void {
  ensureSpecializedEmojis();

  const themeToggle = document.getElementById('theme-toggle');
  const themeSlot = document.getElementById('theme-emoji-slot');
  if (!themeToggle || !themeSlot) return;

  let currentThemeEmoji: WissiveInstance | null = null;

  function applyTheme(theme: string, animate = false): void {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('wissive-theme', theme);

    if (currentThemeEmoji) {
      currentThemeEmoji.destroy();
      currentThemeEmoji = null;
    }

    themeSlot!.innerHTML = '';
    const isDark = theme === 'dark';
    const emojiName = isDark ? 'night-moon' : 'day-sun';

    currentThemeEmoji = createEmoji(emojiName, {
      target: themeSlot!,
      size: 24,
      interactive: false,
      sound: false,
      autonomousStates: true,
    });

    themeToggle!.setAttribute(
      'aria-label',
      isDark ? 'Cambiar a modo claro (Día)' : 'Cambiar a modo oscuro (Noche)'
    );

    const tooltipTextEl = document.getElementById('theme-tooltip-text');
    if (tooltipTextEl) {
      const lang = (localStorage.getItem('wissive-lang') || 'es') as 'es' | 'en';
      const textMap = isDark ? THEME_TOOLTIP_TEXT.dark : THEME_TOOLTIP_TEXT.light;
      tooltipTextEl.textContent = textMap[lang] || textMap.es;
    }

    if (animate && currentThemeEmoji) {
      currentThemeEmoji.bounce();
      currentThemeEmoji.triggerParticles(6);
    }
  }

  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const savedTheme = localStorage.getItem('wissive-theme');
  applyTheme(savedTheme || (systemPrefersDark ? 'dark' : 'light'), false);

  themeToggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    const nextTheme = current === 'dark' ? 'light' : 'dark';
    applyTheme(nextTheme, true);
  });
}
