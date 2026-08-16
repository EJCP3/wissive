// Import dinámico: cuelume es peer dependency opcional. Un import estático
// rompería la carga entera de la librería para quien no la tenga instalada
// (el caso normal). Se resuelve una sola vez y se cachea la promesa.
type CuelumeModule = {
  play: (name: any, options?: { volume?: number }) => void;
  setVolume: (volume: number) => void;
} | null;

let cuelumePromise: Promise<CuelumeModule> | undefined;
function getCuelume(): Promise<CuelumeModule> {
  if (!cuelumePromise) {
    cuelumePromise = import(/* @vite-ignore */ 'cuelume').catch(() => null);
  }
  return cuelumePromise;
}

export type CueSoundType =
  | 'chime'
  | 'sparkle'
  | 'droplet'
  | 'bloom'
  | 'whisper'
  | 'tick'
  | 'press'
  | 'release'
  | 'toggle'
  | 'success'
  | 'error'
  | 'page'
  | 'loading'
  | 'ready'
  | 'pulse'
  | 'scan'
  | 'arrival';

export class SoundEngine {
  private enabled: boolean = true;
  private volume: number = 0.6;

  constructor() {
    getCuelume().then((m) => {
      try {
        m?.setVolume(this.volume);
      } catch (_) {}
    });
  }

  public setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  public setVolumeLevel(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    getCuelume().then((m) => {
      try {
        m?.setVolume(this.volume);
      } catch (_) {}
    });
  }

  public getVolumeLevel(): number {
    return this.volume;
  }

  public playCue(cueName: CueSoundType, options: { volume?: number } = {}) {
    if (!this.enabled) return;
    getCuelume().then((m) => {
      try {
        m?.play(cueName as any, { volume: options.volume ?? this.volume });
      } catch (e) {
        // Ignorar restricciones de autoplay si aún no se ha interactuado
      }
    });
  }

  public playSound(emotion: string, action: 'hover' | 'click' | 'bounce') {
    if (!this.enabled) return;

    let cue: CueSoundType = 'tick';

    switch (emotion) {
      case 'happy': // Mochi
        cue = action === 'click' ? 'sparkle' : 'chime';
        break;

      case 'flutter': // Zumi
        cue = action === 'click' ? 'pulse' : 'bloom';
        break;

      case 'pleasure': // Suri
        cue = action === 'click' ? 'bloom' : 'droplet';
        break;

      case 'peaceful': // Nima
        cue = action === 'click' ? 'arrival' : 'whisper';
        break;

      case 'normal': // Cota
        cue = action === 'click' ? 'toggle' : 'tick';
        break;

      case 'tired':
      case 'sleepy': // Dozy / Snug
        cue = action === 'click' ? 'loading' : 'whisper';
        break;

      case 'sad':
      case 'disappointed': // Lumo / Wilt
        cue = action === 'click' ? 'scan' : 'droplet';
        break;

      case 'anxiety':
      case 'stress': // Fidge / Knot
        cue = action === 'click' ? 'pulse' : 'tick';
        break;

      case 'anger': // Brix
        cue = action === 'click' ? 'press' : 'release';
        break;

      case 'surprised': // Pip
        cue = action === 'click' ? 'success' : 'chime';
        break;

      case 'numbness': // Void
        cue = action === 'click' ? 'ready' : 'page';
        break;

      default:
        cue = action === 'click' ? 'sparkle' : 'tick';
        break;
    }

    this.playCue(cue);
  }
}

export const soundEngine = new SoundEngine();

/**
 * Control global del sonido para todas las instancias de Wissive en la página.
 */
export function setGlobalSound(enabled: boolean): void {
  soundEngine.setEnabled(enabled);
}

/**
 * Consulta si el sonido está habilitado globalmente.
 */
export function isGlobalSoundEnabled(): boolean {
  return soundEngine.isEnabled();
}

/**
 * Ajusta el nivel de volumen global (0.0 a 1.0) para todos los sonidos de Wissive.
 */
export function setGlobalVolume(volume: number): void {
  soundEngine.setVolumeLevel(volume);
}

/**
 * Obtiene el volumen global actual (0.0 a 1.0).
 */
export function getGlobalVolume(): number {
  return soundEngine.getVolumeLevel();
}

