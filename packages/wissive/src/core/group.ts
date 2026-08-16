import { WissiveInstance } from '../index';
import { sharedLoop } from './raf';
import { soundEngine } from './sound';

export interface EmojiGroupOptions {
  proximityThreshold?: number; // Distancia en px para activar la sinergia (def: 220px)
  enableGazeSync?: boolean;    // Los emojis se miran entre sí cuando están cerca (def: true)
  enableSynergies?: boolean;   // Reacciones emocionales cruzadas (def: true)
}

interface ConnectedPair {
  idA: string;
  idB: string;
  connectedSince: number;
}

export class EmojiGroup {
  private instances: Map<string, WissiveInstance> = new Map();
  private options: Required<EmojiGroupOptions>;
  private connectedPairs: Map<string, ConnectedPair> = new Map();
  private isRunning = false;

  constructor(instances: WissiveInstance[] = [], options: EmojiGroupOptions = {}) {
    this.options = {
      proximityThreshold: options.proximityThreshold ?? 220,
      enableGazeSync: options.enableGazeSync ?? true,
      enableSynergies: options.enableSynergies ?? true,
    };

    instances.forEach(inst => this.add(inst));
    this.start();
  }

  public add(instance: WissiveInstance) {
    if (!instance || !instance.id) return;
    this.instances.set(instance.id, instance);
  }

  public remove(instance: WissiveInstance) {
    if (!instance || !instance.id) return;
    this.instances.delete(instance.id);
  }

  public start() {
    if (this.isRunning) return;
    this.isRunning = true;
    sharedLoop.add(this.update);
  }

  public stop() {
    if (!this.isRunning) return;
    this.isRunning = false;
    sharedLoop.remove(this.update);
  }

  private getPairKey(id1: string, id2: string): string {
    return id1 < id2 ? `${id1}:${id2}` : `${id2}:${id1}`;
  }

  private update = () => {
    const list = Array.from(this.instances.values());
    if (list.length < 2) return;

    const currentPairKeys = new Set<string>();

    for (let i = 0; i < list.length; i++) {
      for (let j = i + 1; j < list.length; j++) {
        const instA = list[i];
        const instB = list[j];

        const posA = instA.getPosition();
        const posB = instB.getPosition();

        const dx = posB.x - posA.x;
        const dy = posB.y - posA.y;
        const distance = Math.hypot(dx, dy);

        if (distance <= this.options.proximityThreshold && distance > 0) {
          const pairKey = this.getPairKey(instA.id, instB.id);
          currentPairKeys.add(pairKey);

          // 1. Mirada mutua (Gaze Sync)
          if (this.options.enableGazeSync) {
            const normXA = Math.max(-0.8, Math.min(0.8, dx / 160)) * 22;
            const normYA = Math.max(-0.8, Math.min(0.8, dy / 160)) * 14;

            instA.setGaze({ x: normXA, y: normYA });
            instB.setGaze({ x: -normXA, y: -normYA });
          }

          // 2. Evento de primera conexión (Sinergia)
          let pairInfo = this.connectedPairs.get(pairKey);
          if (!pairInfo) {
            pairInfo = {
              idA: instA.id,
              idB: instB.id,
              connectedSince: Date.now(),
            };
            this.connectedPairs.set(pairKey, pairInfo);
            this.triggerSynergy(instA, instB);
          } else {
            // Emisión continua suave de chispas en la mitad de su trayectoria
            if (Math.random() < 0.08 && this.options.enableSynergies) {
              instA.triggerParticles(1);
              instB.triggerParticles(1);
            }
          }
        }
      }
    }

    // Limpiar pares que ya no están cerca
    for (const [pairKey, pair] of this.connectedPairs.entries()) {
      if (!currentPairKeys.has(pairKey)) {
        const instA = this.instances.get(pair.idA);
        const instB = this.instances.get(pair.idB);

        if (instA) instA.setGaze({ x: 0, y: 0 });
        if (instB) instB.setGaze({ x: 0, y: 0 });

        this.connectedPairs.delete(pairKey);
      }
    }
  };

  /**
   * Reacción de sinergia entre dos emojis según sus emociones
   */
  private triggerSynergy(instA: WissiveInstance, instB: WissiveInstance) {
    if (!this.options.enableSynergies) return;

    const catA = instA.emotionCategory || 'happy';
    const catB = instB.emotionCategory || 'happy';

    // Ráfaga de partículas conectivas y sonido de sinergia
    soundEngine.playSound(catA, 'hover');
    instA.triggerParticles(6);
    instB.triggerParticles(6);


    // Reacciones entre tipos de emociones
    if (catA === 'happy' && catB === 'happy') {
      // Ambas muy felices -> Rebotan juntas
      instA.bounce();
      instB.bounce();
    } else if ((catA === 'happy' && catB === 'sad') || (catA === 'sad' && catB === 'happy')) {
      // Feliz reconforta a Triste
      const happyInst = catA === 'happy' ? instA : instB;
      const sadInst = catA === 'sad' ? instA : instB;
      happyInst.setEmotion('hover');
      sadInst.setEmotion('near');
    } else if (catA === 'intense' || catB === 'intense') {
      // Choque de energía / estrés -> Giro rápido
      instA.spin(0.5);
      instB.spin(0.5);
    }
  }

  public destroy() {
    this.stop();
    this.instances.clear();
    this.connectedPairs.clear();
  }
}

export function createEmojiGroup(
  instances: WissiveInstance[] = [],
  options: EmojiGroupOptions = {}
): EmojiGroup {
  return new EmojiGroup(instances, options);
}
