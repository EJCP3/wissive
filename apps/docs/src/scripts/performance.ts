import { createEmoji, setGlobalSound, isGlobalSoundEnabled } from 'wissive';
import type { WissiveInstance } from 'wissive';

const EMOJI_POOL = [
  'mochi', 'zumi', 'suri', 'nima', 'cota', 'dozy', 'snug',
  'lumo', 'wilt', 'fidge', 'knot', 'brix', 'pip', 'void'
];

export function initPerformanceStressTest(): void {
  const container = document.getElementById('stress-grid');
  const fpsDisplay = document.getElementById('stress-fps');
  const countDisplay = document.getElementById('stress-count');
  const spawn50Btn = document.getElementById('btn-spawn-50');
  const spawn100Btn = document.getElementById('btn-spawn-100');
  const bounceAllBtn = document.getElementById('btn-bounce-all');
  const spinAllBtn = document.getElementById('btn-spin-all');
  const randomizeBtn = document.getElementById('btn-randomize-all');
  const clearBtn = document.getElementById('btn-clear-stress');
  const muteBtn = document.getElementById('btn-toggle-sound');

  if (!container) return;

  let activeInstances: WissiveInstance[] = [];
  let frameCount = 0;
  let lastTime = performance.now();
  let currentFps = 60;
  let isMuted = false;

  // FPS Counter
  function updateFps() {
    frameCount++;
    const now = performance.now();
    if (now - lastTime >= 500) {
      currentFps = Math.round((frameCount * 1000) / (now - lastTime));
      if (fpsDisplay) {
        fpsDisplay.textContent = `${currentFps} FPS`;
        fpsDisplay.style.color = currentFps >= 50 ? 'var(--color-success, #10b981)' : currentFps >= 30 ? '#f59e0b' : '#ef4444';
      }
      frameCount = 0;
      lastTime = now;
    }
    requestAnimationFrame(updateFps);
  }
  requestAnimationFrame(updateFps);

  function clearInstances() {
    activeInstances.forEach(inst => inst.destroy());
    activeInstances = [];
    container!.innerHTML = '';
    if (countDisplay) countDisplay.textContent = '0';
  }

  function spawnInstances(count: number) {
    clearInstances();

    for (let i = 0; i < count; i++) {
      const wrapper = document.createElement('div');
      wrapper.className = 'stress-emoji-item';
      container!.appendChild(wrapper);

      const name = EMOJI_POOL[i % EMOJI_POOL.length];
      const inst = createEmoji(name, {
        target: wrapper,
        size: 56,
        interactive: true,
        sound: !isMuted,
        autonomousStates: true,
      });
      activeInstances.push(inst);
    }

    if (countDisplay) countDisplay.textContent = `${activeInstances.length}`;
  }

  spawn50Btn?.addEventListener('click', () => spawnInstances(50));
  spawn100Btn?.addEventListener('click', () => spawnInstances(100));
  clearBtn?.addEventListener('click', clearInstances);

  bounceAllBtn?.addEventListener('click', () => {
    activeInstances.forEach((inst, idx) => {
      setTimeout(() => inst.bounce(), (idx % 10) * 40);
    });
  });

  spinAllBtn?.addEventListener('click', () => {
    activeInstances.forEach((inst, idx) => {
      setTimeout(() => inst.spin(1), (idx % 10) * 30);
    });
  });

  randomizeBtn?.addEventListener('click', () => {
    const states = ['happy', 'excited', 'surprised', 'curious', 'thinking', 'alerting', 'celebrate', 'idle'];
    activeInstances.forEach(inst => {
      const randomState = states[Math.floor(Math.random() * states.length)] as any;
      inst.setEmotion(randomState);
    });
  });

  muteBtn?.addEventListener('click', () => {
    isMuted = !isMuted;
    setGlobalSound(!isMuted);
    muteBtn.textContent = isMuted ? 'Sonido apagado (Global)' : 'Sonido activo (Global)';
  });

  // Iniciar con 24 instancias livianas por defecto
  spawnInstances(24);
}
