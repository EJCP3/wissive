import type { SequenceTemplate, KeyframeData } from '../types';
import { createDefaultKeyframe } from '../types';

export const SEQUENCE_TEMPLATES: SequenceTemplate[] = [
  {
    id: 'greeting',
    name: 'Saludo Amigable',
    badge: 'Popular',
    description: 'De reposo neutro a una sonrisa con guiño y sonrojo alegre.',
    frames: [
      createDefaultKeyframe('1: Reposo Atento', { duration: 0.8, silhouette: 'circle', color: '#7ED321', eyeType: 0, mouthCurve: 0.0 }),
      createDefaultKeyframe('2: Sonrisa Cálida', { duration: 1.0, silhouette: 'heart', color: '#F2A9B8', eyeType: 1, mouthCurve: 0.8, cheek: 0.6 }),
      createDefaultKeyframe('3: Guiño Pícaro', { duration: 1.2, silhouette: 'heart', color: '#F2A9B8', eyeType: 10, mouthCurve: 0.9, cheek: 0.8, bounce: true }),
    ],
  },
  {
    id: 'celebration',
    name: 'Éxito & Celebración',
    badge: 'Energía',
    description: 'Sorpresa feliz seguida de un salto con giro y ojos de estrella.',
    frames: [
      createDefaultKeyframe('1: Espera Expectante', { duration: 0.8, silhouette: 'rounded-squircle', color: '#BD10E0', gazeX: 0, gazeY: -3 }),
      createDefaultKeyframe('2: ¡Sorpresa!', { duration: 0.8, silhouette: 'ghost-blob', color: '#FFAA64', eyeType: 13, mouthType: 1, mouthOpen: 0.9, bounce: true }),
      createDefaultKeyframe('3: Fiesta & Giro', { duration: 1.5, silhouette: 'starburst-puff', color: '#FFD600', eyeType: 24, mouthType: 6, mouthCurve: 0.9, cheek: 0.9, bounce: true, spin: true }),
    ],
  },
  {
    id: 'alert_error',
    name: 'Alerta & Error',
    badge: 'Sistema',
    description: 'Alerta roja de fuego y cejas marcadas con transición a lágrima.',
    frames: [
      createDefaultKeyframe('1: Estado Normal', { duration: 0.8, silhouette: 'capsule', color: '#7ED321', eyeType: 0 }),
      createDefaultKeyframe('2: Alerta / Peligro', { duration: 1.0, silhouette: 'flame-blob', color: '#E85B64', eyeType: 7, mouthType: 4, mouthCurve: -0.6, storm: 1, hasBrows: true, browTilt: -18 }),
      createDefaultKeyframe('3: Decepción & Lágrima', { duration: 1.2, silhouette: 'teardrop-blob', color: '#5B8FD4', eyeType: 16, mouthType: 12, mouthCurve: -0.8, tears: 1 }),
    ],
  },
  {
    id: 'thinking_eureka',
    name: 'Pensando & ¡Eureka!',
    badge: 'Idea',
    description: 'Procesando duda con espirales hasta encontrar la solución brillante.',
    frames: [
      createDefaultKeyframe('1: Mirada al Cielo', { duration: 1.0, silhouette: 'rounded-squircle', color: '#BD10E0', gazeX: 8, gazeY: -5, hasBrows: true, browTilt: 8 }),
      createDefaultKeyframe('2: Procesando...', { duration: 1.0, silhouette: 'round-blob', color: '#BD10E0', eyeType: 18, mouthType: 13, spin: true }),
      createDefaultKeyframe('3: ¡Eureka!', { duration: 1.4, silhouette: 'starburst-puff', color: '#00E676', eyeType: 21, mouthType: 6, mouthCurve: 0.9, cheek: 0.8, bounce: true }),
    ],
  },
  {
    id: 'tired_sleep',
    name: 'Cansancio & Sueño',
    badge: 'Relax',
    description: 'Bostezos, párpados que se cierran y descanso profundo con Zzz.',
    frames: [
      createDefaultKeyframe('1: Bostezo', { duration: 1.0, silhouette: 'soft-round', color: '#E3536C', eyeType: 14, eyeOpen: 0.5, mouthType: 1, mouthOpen: 0.7, puff: 1 }),
      createDefaultKeyframe('2: Párpados Caídos', { duration: 1.0, silhouette: 'wide-oval', color: '#E2E8D8', eyeType: 15, eyeOpen: 0.3, sweat: 0.5 }),
      createDefaultKeyframe('3: Dormir Profundo', { duration: 1.6, silhouette: 'soft-round', color: '#98C5E8', eyeType: 14, eyeOpen: 0.1, zzz: 1 }),
    ],
  },
  {
    id: 'chat_flow',
    name: 'Mensajería & Chat',
    badge: 'App',
    description: 'Secuencia completa de atención, escritura y envío de mensaje.',
    frames: [
      createDefaultKeyframe('1: Escuchando', { duration: 0.8, silhouette: 'pear-blob', color: '#A8D5BA', eyeType: 31, gazeX: -4 }),
      createDefaultKeyframe('2: Escribiendo...', { duration: 1.0, silhouette: 'egg-oval', color: '#7ED321', eyeType: 0, eyeOpen: 0.9, gazeX: 0, gazeY: 6 }),
      createDefaultKeyframe('3: Mensaje Enviado', { duration: 1.2, silhouette: 'capsule', color: '#00B0FF', eyeType: 2, mouthType: 9, mouthCurve: 0.7, bounce: true }),
    ],
  },
];

export const INITIAL_FRAMES: KeyframeData[] = [
  createDefaultKeyframe('1: Verde Normal', { duration: 1.0, silhouette: 'circle', color: '#7ED321', mouthCurve: 0.0, gazeX: 0 }),
  createDefaultKeyframe('2: Negro & Sonrisa', { duration: 1.0, silhouette: 'rounded-squircle', color: '#18181B', mouthType: 6, mouthCurve: 0.9, mouthOpen: 0.6 }),
  createDefaultKeyframe('3: Mira a la Izquierda', { duration: 1.2, silhouette: 'egg-oval', color: '#F2A9B8', mouthCurve: 0.4, gazeX: -11, gazeY: 0 }),
  createDefaultKeyframe('4: Amarillo & Sorpresa', { duration: 1.0, silhouette: 'capsule', color: '#F2CB4E', mouthType: 1, mouthOpen: 0.8, eyeScale: 1.3, hasBrows: true, browTilt: -12, browY: -2 }),
  createDefaultKeyframe('5: Llama & Salto', { duration: 1.5, silhouette: 'flame-blob', color: '#4A90E2', eyeType: 2, mouthCurve: 0.9, particles: false, bounce: false, cheek: 0.8, hasBrows: false }),
];
