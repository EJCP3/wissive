import type { FaceParameters, MotionType } from '../emojis/types';

/**
 * Animación idle por personalidad.
 *
 * Cada emoji tiene una firma de movimiento propia. La clave para que se sienta
 * "vivo" no es el desplazamiento principal (bob/shiftX) sino el movimiento
 * secundario: inclinación de cabeza desfasada, respiración leída en eyeScale,
 * micro-expresión (cejas/boca/mejillas) y acentos irregulares que rompen el
 * bucle senoidal perfecto.
 *
 * Todas las funciones son ADITIVAS sobre los valores del resorte.
 */
export type IdleMotionFn = (
  p: FaceParameters,
  t: number,
  speed: number,
  amp: number
) => void;

/** Acento corto y esporádico: 1 durante una fracción del ciclo, 0 el resto. */
function accent(t: number, period: number, width: number): number {
  const cycle = (t / period) % 1;
  return cycle < width ? Math.sin((cycle / width) * Math.PI) : 0;
}

export const IDLE_MOTIONS: Record<MotionType, IdleMotionFn> = {
  // Mochi — saltitos alegres, mejillas que florecen en el apogeo
  bouncy(p, t, speed, amp) {
    const hop = Math.abs(Math.sin(t * speed));
    p.bob += hop * amp - amp * 0.5;
    p.cheek += hop * 0.15;
    p.eyeScale += hop * 0.04;
    p.turnAngle += Math.sin(t * speed * 0.5) * 0.05;
  },

  // Zumi — aleteo rápido lateral, entrecierra los ojos por el zumbido
  flutter(p, t, speed, amp) {
    const beat = Math.sin(t * speed);
    p.shiftX += beat * amp;
    p.bob += Math.cos(t * speed * 0.7) * amp * 0.5;
    p.turnAngle += beat * 0.06;
    p.eyeScale -= Math.abs(beat) * 0.03;
  },

  // Suri — respiración profunda y lenta, inclinación que va por detrás
  serene(p, t, speed, amp) {
    const breath = Math.sin(t * speed);
    p.bob += breath * amp;
    p.eyeScale += breath * 0.05;
    p.cheek += (breath + 1) * 0.06;
    p.turnAngle += Math.sin(t * speed * 0.4 - 0.6) * 0.045;
  },

  // Nima — deriva fantasmal en ocho (frecuencias 2:1)
  float(p, t, speed, amp) {
    p.bob += Math.sin(t * speed) * amp;
    p.shiftX += Math.sin(t * speed * 0.5) * amp * 1.1;
    p.turnAngle += Math.sin(t * speed * 0.5 - 0.9) * 0.07;
  },

  // Cota — respiración mínima y mirada que divaga sin rumbo
  calm(p, t, speed, amp) {
    const breath = Math.sin(t * speed);
    p.bob += breath * amp;
    p.eyeScale += breath * 0.025;
    p.gazeX += Math.sin(t * speed * 0.23) * 2.5;
    p.turnAngle += Math.sin(t * speed * 0.31) * 0.03;
  },

  // Dozy — cabecea hasta dormirse y despierta de golpe
  droop(p, t, speed, amp) {
    const cycle = (t * speed * 0.18) % 1;
    // Caída lenta (82% del ciclo) y recuperación brusca (18%)
    const sag = cycle < 0.82 ? cycle / 0.82 : 1 - (cycle - 0.82) / 0.18;
    p.bob += sag * amp * 2.2;
    p.eyeOpen = Math.max(0, p.eyeOpen - sag * 0.45);
    p.browY += sag * 2;
    p.turnAngle += sag * 0.12;
  },

  // Lumo — respiración entrecortada del llanto, mirada baja
  sob(p, t, speed, amp) {
    // Dos senos incompatibles = respiración irregular, nunca se repite igual
    const shudder = Math.sin(t * speed) + Math.sin(t * speed * 2.7) * 0.4;
    p.bob += shudder * amp;
    p.browY += 1 + Math.sin(t * speed) * 0.8;
    p.gazeY += 1.5;
    p.mouthCurve -= 0.05 + Math.abs(Math.sin(t * speed)) * 0.05;
  },

  // Fidge — temblor nervioso y mirada que se dispara de un lado a otro
  jitter(p, t, speed, amp) {
    p.shiftX += (Math.random() - 0.5) * amp;
    p.bob += (Math.random() - 0.5) * amp;
    p.gazeX += Math.sin(t * speed * 1.7) * 4 + (Math.random() - 0.5) * 2;
    p.turnAngle += (Math.random() - 0.5) * 0.03;
  },

  // Brix — rumor contenido que estalla en llamaradas puntuales
  fiery(p, t, speed, amp) {
    const rumble = Math.sin(t * speed * 3.1) * 0.35;
    // Potencia alta = pico corto y raro en vez de una onda suave
    const flare = Math.pow(Math.max(0, Math.sin(t * speed * 0.35)), 6);
    p.bob += rumble * amp - flare * amp * 1.8;
    p.shiftX += rumble * amp * 0.5;
    p.eyeScale += flare * 0.18;
    p.browY -= flare * 2.5;
    p.browTilt -= flare * 0.25;
  },

  // Wilt — se desinfla y se vuelve a inflar, resignado
  wilt(p, t, speed, amp) {
    const deflate = (Math.sin(t * speed * 0.6) + 1) / 2;
    p.bob += deflate * amp * 1.8;
    p.mouthCurve -= deflate * 0.12;
    p.browY += deflate * 1.6;
    p.eyeScale -= deflate * 0.05;
  },

  // Knot — bamboleo circular con la cabeza rodando
  dizzy(p, t, speed, amp) {
    p.shiftX += Math.sin(t * speed) * amp;
    p.bob += Math.cos(t * speed) * amp * 0.7;
    p.turnAngle += Math.sin(t * speed) * 0.14;
    p.gazeX += Math.cos(t * speed) * 3;
  },

  // Snug — respiración profunda de sueño, párpados pesados
  snooze(p, t, speed, amp) {
    const breath = Math.sin(t * speed);
    p.bob += breath * amp * 1.6;
    p.eyeScale += breath * 0.06;
    p.eyeOpen *= 0.35;
    p.cheek += (breath + 1) * 0.05;
    p.turnAngle += Math.sin(t * speed - 0.8) * 0.05;
  },

  // Pip — sobresaltos secos; entre uno y otro aguanta la respiración con tensión
  pop(p, t, speed, amp) {
    const startle = accent(t, 1 / (speed * 0.1), 0.18);
    // Base tensa: sin ella se quedaba congelado entre sobresaltos
    const held = Math.sin(t * speed * 1.6) * 0.18;
    p.bob += held * amp - startle * amp * 2.2;
    p.eyeScale += held * 0.02 + startle * 0.22;
    p.browY -= startle * 3;
    p.mouthOpen += startle * 0.25;
  },

  // Void — casi inmóvil, con micro-fallos tipo glitch
  drift(p, t, speed, amp) {
    p.bob += Math.sin(t * speed) * amp * 0.6;
    const glitch = accent(t, 3.7, 0.04);
    p.shiftX += glitch * (Math.random() - 0.5) * 5;
    p.gazeX += glitch * (Math.random() - 0.5) * 6;
    p.eyeScale -= glitch * 0.08;
  },
};

/**
 * Aplica la animación idle correspondiente al perfil de movimiento.
 * `intensity` reduce la amplitud sin apagarla — los estados near/hover/click
 * siguen respirando en vez de quedarse congelados.
 */
export function applyIdleMotion(
  motionType: MotionType,
  p: FaceParameters,
  t: number,
  speed: number,
  amp: number,
  intensity = 1
): void {
  const fn = IDLE_MOTIONS[motionType] || IDLE_MOTIONS.calm;
  fn(p, t, speed, amp * intensity);
}

/* ─────────────────────────────────────────────────────────────────────
 * Movimiento por estado
 *
 * Antes eran siete grupos de `case` encadenados: 5 estados compartían el
 * mismo barrido de mirada, 4 la misma boca, 4 el mismo salto… y 15 estados
 * se quedaban completamente inmóviles. Aquí cada estado tiene su propia
 * firma; `speed`/`amp` vienen del emoji, así que un mismo estado se sigue
 * sintiendo distinto en Mochi que en Void.
 * ──────────────────────────────────────────────────────────────────── */

export const STATE_MOTIONS: Record<string, IdleMotionFn> = {
  // ── Ciclo de vida ──────────────────────────────────────────────────
  sleeping(p, t) {
    const breath = Math.sin(t * 0.9);
    p.eyeOpen = 0.05;
    p.bob += breath * 2.4;
    p.eyeScale += breath * 0.04;
    // Suspiro más hondo de vez en cuando
    p.bob += accent(t, 9, 0.15) * 1.8;
  },
  waking(p, t) {
    const stretch = accent(t, 4, 0.4);
    p.bob += Math.sin(t * 2.2) * 1.6 - stretch * 3;
    p.eyeOpen = Math.min(1, 0.35 + stretch * 0.65);
    p.eyeScale += stretch * 0.1;
    p.turnAngle += Math.sin(t * 1.1) * 0.06;
  },
  listening(p, t) {
    // Cabeza ladeada y sostenida, con asentimientos cortos
    p.turnAngle += 0.1 + Math.sin(t * 1.4) * 0.03;
    p.bob += accent(t, 2.6, 0.25) * 2.2;
    p.eyeScale += 0.06;
    p.gazeY -= 0.8;
  },
  thinking(p, t) {
    // Mirada arriba a la izquierda, vagando despacio
    p.gazeX += -6 + Math.sin(t * 0.9) * 3;
    p.gazeY += -4 + Math.cos(t * 0.7) * 2;
    p.browY -= 1 + Math.sin(t * 1.3) * 0.8;
    p.turnAngle += Math.sin(t * 0.6) * 0.05;
  },
  searching(p, t) {
    // Barrido horizontal rápido, como quien rastrea una lista
    p.gazeX += Math.sin(t * 5.5) * 11;
    p.gazeY += Math.sin(t * 2.3) * 2.5;
    p.turnAngle += Math.sin(t * 5.5) * 0.05;
    p.eyeScale += 0.05;
  },
  working(p, t) {
    // Cadencia regular de trabajo, boca firme
    p.bob += Math.sin(t * 3.4) * 1.4;
    p.turnAngle += Math.sin(t * 3.4 - 0.5) * 0.035;
    p.gazeY += 1.5;
    p.mouthWidth *= 0.9;
  },

  // ── Reacciones ─────────────────────────────────────────────────────
  excited(p, t) {
    p.bob += -Math.abs(Math.sin(t * 7)) * 5.5;
    p.eyeScale += 0.1 + Math.abs(Math.sin(t * 7)) * 0.06;
    p.cheek += 0.2;
    p.turnAngle += Math.sin(t * 3.5) * 0.07;
  },
  surprised(p, t) {
    // Congelado del susto, con un temblor fino encima
    p.bob += Math.sin(t * 9) * 0.9;
    p.eyeScale += 0.12;
    p.browY -= 1.5;
    p.shiftX += Math.sin(t * 13) * 0.4;
  },
  suspicious(p, t) {
    // Casi inmóvil: mira de reojo y aguanta
    p.gazeX += -7 + Math.sin(t * 0.5) * 2.5;
    p.eyeScale -= 0.08;
    p.browTilt -= 0.12;
    p.bob += Math.sin(t * 0.8) * 0.5;
  },
  angry(p, t) {
    p.shiftX += (Math.random() - 0.5) * 3;
    p.bob += (Math.random() - 0.5) * 2;
    // Aprieta las cejas por rachas
    const clench = accent(t, 2.2, 0.3);
    p.browY -= clench * 2;
    p.browTilt -= clench * 0.2;
  },
  drowsy(p, t) {
    const sag = (Math.sin(t * 0.8) + 1) / 2;
    p.bob += sag * 3;
    p.eyeOpen = Math.max(0.08, 0.5 - sag * 0.4);
    // Reabre los ojos de golpe cuando se le va la cabeza
    p.eyeOpen += accent(t, 6.5, 0.08) * 0.5;
    p.browY += sag * 2;
  },
  happy(p, t) {
    p.bob += -Math.abs(Math.sin(t * 3.2)) * 2.4;
    p.cheek += 0.15 + Math.abs(Math.sin(t * 3.2)) * 0.1;
    p.turnAngle += Math.sin(t * 1.6) * 0.05;
  },
  curious(p, t) {
    // Ladeo que oscila y mirada que salta de un punto a otro
    p.turnAngle += Math.sin(t * 1.2) * 0.13;
    p.gazeX += Math.sin(t * 2.1) * 6;
    p.eyeScale += 0.08;
    p.bob += Math.sin(t * 2.4) * 1;
  },
  confused(p, t) {
    // Bamboleo lento de lado a lado, cejas descompensadas
    p.turnAngle += Math.sin(t * 0.9) * 0.16;
    p.shiftX += Math.sin(t * 0.9) * 1.8;
    p.browTilt += 0.15 + Math.sin(t * 1.7) * 0.1;
    p.gazeX += Math.sin(t * 0.6) * 4;
  },
  bored(p, t) {
    // Vaivén lentísimo, mirada perdida fuera de cuadro, suspiro
    p.shiftX += Math.sin(t * 0.5) * 2.2;
    p.gazeX += 6 + Math.sin(t * 0.3) * 3;
    p.eyeOpen = Math.min(p.eyeOpen, 0.5);
    p.bob += accent(t, 7, 0.2) * 2;
  },
  proud(p, t) {
    // Pecho arriba, barbilla levantada
    p.bob += -2 + Math.sin(t * 1.1) * 0.8;
    p.turnAngle += Math.sin(t * 0.7) * 0.04;
    p.gazeY -= 2;
    p.cheek += 0.1;
  },
  shy(p, t) {
    // Se encoge y mira abajo desviando
    p.bob += 1.5 + Math.sin(t * 1.3) * 0.7;
    p.gazeX += -4 + Math.sin(t * 0.9) * 1.5;
    p.gazeY += 4;
    p.cheek += 0.25;
    p.eyeScale -= 0.06;
  },
  sad(p, t) {
    p.bob += 2 + Math.sin(t * 0.9) * 1.4;
    p.gazeY += 3;
    p.browY += 1.5;
    p.turnAngle += Math.sin(t * 0.5) * 0.03;
  },
  laughing(p, t) {
    // Sacudida rápida con la boca marcando el ritmo
    p.bob += -Math.abs(Math.sin(t * 9)) * 4;
    p.mouthOpen += 0.2 + Math.abs(Math.sin(t * 9)) * 0.3;
    p.cheek += 0.3;
    p.turnAngle += Math.sin(t * 4.5) * 0.05;
  },
  scared(p, t) {
    // Tiritona de frecuencia alta y encogimiento
    p.shiftX += Math.sin(t * 22) * 1.2;
    p.bob += 1.2 + Math.sin(t * 18) * 0.8;
    p.eyeScale += 0.14;
    p.browTilt += 0.2;
  },
  playful(p, t) {
    // Bamboleo irregular: dos frecuencias que no encajan
    p.bob += (Math.sin(t * 4.3) + Math.sin(t * 6.7) * 0.5) * 1.8;
    p.turnAngle += Math.sin(t * 3.1) * 0.11;
    p.shiftX += Math.sin(t * 2.2) * 1.5;
    p.cheek += 0.18;
  },
  celebrate(p, t) {
    // Saltos grandes con giro alterno
    p.bob += -Math.abs(Math.sin(t * 5)) * 7;
    p.turnAngle += Math.sin(t * 2.5) * 0.18;
    p.cheek += 0.35;
    p.eyeScale += 0.1;
  },

  // ── Morfos de agente ───────────────────────────────────────────────
  orbit(p, t) {
    // Órbita circular limpia y continua
    p.gazeX += Math.cos(t * 2.2) * 10;
    p.gazeY += Math.sin(t * 2.2) * 6;
    p.turnAngle += Math.cos(t * 2.2) * 0.06;
  },
  radar(p, t) {
    // Barrido con pausa en cada extremo (no es un seno puro)
    const sweep = Math.sin(t * 1.6);
    p.gazeX += Math.sign(sweep) * Math.pow(Math.abs(sweep), 0.45) * 11;
    p.turnAngle += sweep * 0.05;
    p.eyeScale += 0.04;
  },
  progress(p, t) {
    // Latido de metrónomo, sin desplazamiento lateral
    const beat = Math.pow(Math.max(0, Math.sin(t * 3)), 3);
    p.bob += -beat * 3;
    p.eyeScale += beat * 0.09;
  },

  // ── Ciclo de producto ──────────────────────────────────────────────
  spawning(p, t) {
    // Aparición con rebote que se va asentando
    const settle = Math.exp(-((t * 1.5) % 6) * 0.7);
    p.bob += -Math.sin(t * 6) * 4 * settle;
    p.eyeScale += settle * 0.15;
  },
  humming(p, t) {
    p.bob += Math.sin(t * 2.6) * 1.6;
    p.mouthOpen += 0.1 + Math.abs(Math.sin(t * 2.6)) * 0.08;
    p.turnAngle += Math.sin(t * 1.3) * 0.05;
    p.cheek += 0.12;
  },
  loading(p, t) {
    // Pulso paciente, sin prisa
    p.eyeScale += Math.sin(t * 1.8) * 0.08;
    p.bob += Math.sin(t * 1.8) * 1.2;
    p.gazeY += Math.sin(t * 0.9) * 1.5;
  },
  dictating(p, t) {
    // Boca disparada, cabeza quieta
    p.mouthOpen = 0.25 + Math.abs(Math.sin(t * 11)) * 0.4;
    p.bob += Math.sin(t * 2) * 0.6;
    p.browY -= 0.5;
  },
  writing(p, t) {
    // Cabezadas cortas siguiendo el renglón, mirada abajo
    p.gazeY += 4;
    p.gazeX += Math.sin(t * 4.5) * 5;
    p.bob += Math.abs(Math.sin(t * 4.5)) * 1.2;
  },
  sending(p, t) {
    // Empuje hacia delante que vuelve
    const push = accent(t, 1.6, 0.3);
    p.shiftX += push * 4;
    p.bob += -push * 2;
    p.turnAngle += push * 0.08;
  },
  receiving(p, t) {
    // Retroceso al recibir, ojos que se abren
    const pull = accent(t, 1.6, 0.3);
    p.shiftX += -pull * 4;
    p.bob += pull * 1.5;
    p.eyeScale += pull * 0.12;
  },
  uploading(p, t) {
    // Deriva que sube y reaparece abajo
    const rise = 1 - ((t * 0.7) % 1);
    p.bob += rise * 4 - 2;
    p.gazeY -= 2;
    p.eyeScale += (1 - rise) * 0.05;
  },
  notifying(p, t) {
    // Doble repique: dos toques seguidos y pausa
    const blip = accent(t, 2.4, 0.12) + accent(t - 0.22, 2.4, 0.12);
    p.bob += -blip * 4;
    p.eyeScale += blip * 0.12;
    p.turnAngle += blip * 0.06;
  },
  alerting(p, t) {
    // Sacudida urgente y ojos muy abiertos
    p.shiftX += Math.sin(t * 16) * 2.5;
    p.bob += Math.sin(t * 12) * 1.5;
    p.eyeScale += 0.16;
    p.browY -= 2;
  },
  dragging(p, t) {
    // Bamboleo que va por detrás, como algo colgando
    p.turnAngle += Math.sin(t * 2.4 - 1.2) * 0.14;
    p.shiftX += Math.sin(t * 2.4) * 2;
    p.bob += Math.cos(t * 2.4 - 1.2) * 1.5;
  },
  bouncing(p, t) {
    // Rebote vertical puro y grande
    p.bob += -Math.abs(Math.sin(t * 5.5)) * 8;
  },
  'powering-down'(p, t) {
    // Se hunde y parpadea de forma intermitente antes de apagarse
    const sink = Math.min(1, (t % 8) / 8);
    p.bob += sink * 4;
    p.eyeOpen = Math.max(0.03, 0.4 - sink * 0.37);
    p.eyeOpen += accent(t, 2.7, 0.05) * 0.3;
    p.eyeScale -= sink * 0.1;
  },
};

/**
 * Aplica el movimiento propio de un estado.
 * Devuelve `false` si el estado no tiene firma propia — en ese caso el llamador
 * debe recurrir a la animación de personalidad del emoji.
 */
export function applyStateMotion(
  state: string,
  p: FaceParameters,
  t: number,
  speed: number,
  amp: number
): boolean {
  const fn = STATE_MOTIONS[state];
  if (!fn) return false;
  fn(p, t, speed, amp);
  return true;
}
