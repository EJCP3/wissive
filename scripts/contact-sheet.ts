/**
 * Hoja de contactos: renderiza cada personalidad y cada estado en varios
 * instantes como SVG estático, sin requestAnimationFrame ni navegador.
 *
 * Sirve para juzgar de un vistazo si una animación está muerta (fotogramas
 * casi idénticos) o pasada de amplitud (saltos bruscos), sin tener que ir
 * clicando 42 estados en la app.
 *
 * Ejecutar:  pnpm sheet
 */
import { writeFileSync } from 'node:fs';
import { buildFace } from '../src/render/svg.ts';
import { LIB } from '../src/emojis/catalog.ts';
import { applyIdleMotion, applyStateMotion } from '../src/core/motion.ts';
import { STATE_GROUPS, PERSONALITY_DRIVEN_STATES } from '../src/emojis/states.ts';
import { StateManager } from '../src/core/state.ts';

const TIMES = [0, 0.35, 0.7, 1.05, 1.4, 1.75];
const SIZE = 84;
const sm = new StateManager();

function frame(def: (typeof LIB)[string], t: number, state?: string) {
  const pool = sm.resolvePool(def.expressions, state ?? 'idle');
  const p = { ...pool[0] };
  const usedState =
    state && !PERSONALITY_DRIVEN_STATES.includes(state as never)
      ? applyStateMotion(state, p, t, def.motion.idleSpeed, def.motion.idleAmplitude)
      : false;
  if (!usedState) {
    applyIdleMotion(def.motion.motionType, p, t, def.motion.idleSpeed, def.motion.idleAmplitude, 1);
  }
  return buildFace(def.silhouette, def.baseColor, p, SIZE, {}, t);
}

const row = (label: string, sub: string, cells: string[]) => `
  <div class="row">
    <div class="label"><b>${label}</b><span>${sub}</span></div>
    <div class="frames">${cells.map((c) => `<div class="cell">${c}</div>`).join('')}</div>
  </div>`;

const personalidades = Object.values(LIB)
  .map((def) => row(def.name, def.motion.motionType, TIMES.map((t) => frame(def, t))))
  .join('');

// Todos los estados sobre el mismo emoji, para aislar la diferencia del estado
const mochi = LIB.mochi;
const estados = STATE_GROUPS.map(
  (g) =>
    `<h2>${g.label}</h2>` +
    g.states
      .map((s) =>
        row(
          String(s),
          PERSONALITY_DRIVEN_STATES.includes(s) ? 'personalidad del emoji' : 'firma propia',
          TIMES.map((t) => frame(mochi, t, String(s)))
        )
      )
      .join('')
).join('');

const html = `<!doctype html><meta charset="utf-8"><title>Wissive — hoja de contactos</title>
<style>
  body{font:14px/1.4 system-ui,sans-serif;background:#faf9f7;color:#2c2c2a;margin:0;padding:28px}
  h1{font-size:22px;margin:0 0 4px}
  h2{font-size:15px;margin:26px 0 8px;color:#7a7a76;text-transform:uppercase;letter-spacing:.06em}
  p.hint{color:#7a7a76;margin:0 0 22px;max-width:70ch}
  .row{display:flex;align-items:center;gap:14px;border-bottom:1px solid #ececea;padding:5px 0}
  .label{width:150px;flex:none;display:flex;flex-direction:column}
  .label b{font-size:14px}
  .label span{font-size:11px;color:#9a9a96}
  .frames{display:flex;gap:6px;overflow-x:auto}
  .cell{width:${SIZE}px;height:${SIZE}px;flex:none;display:flex;align-items:center;justify-content:center}
</style>
<h1>Wissive — hoja de contactos</h1>
<p class="hint">Cada fila es una animación muestreada en 6 instantes (0 → 1,75 s). Si una fila se ve casi idéntica de izquierda a derecha, esa animación está muerta; si salta demasiado, está pasada de amplitud.</p>
<h2>Personalidades (animación idle)</h2>
${personalidades}
<h1 style="margin-top:38px">Estados</h1>
<p class="hint">Todos sobre Mochi, para que la diferencia que veas venga del estado y no del emoji.</p>
${estados}
`;

const out = process.argv[2] ?? 'hoja-contactos.html';
writeFileSync(out, html, 'utf8');
console.log(
  `escrito ${out} — ${Object.keys(LIB).length} personalidades, ` +
    `${STATE_GROUPS.reduce((n, g) => n + g.states.length, 0)} estados`
);
