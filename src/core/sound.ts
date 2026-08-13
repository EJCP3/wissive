import { play, setVolume } from 'cuelume';

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
    try {
      setVolume(this.volume);
    } catch (_) {}
  }

  public setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  public setVolumeLevel(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    try {
      setVolume(this.volume);
    } catch (_) {}
  }

  public playCue(cueName: CueSoundType, options: { volume?: number } = {}) {
    if (!this.enabled) return;
    try {
      play(cueName as any, { volume: options.volume ?? this.volume });
    } catch (e) {
      // Ignorar restricciones de autoplay si aún no se ha interactuado
    }
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
