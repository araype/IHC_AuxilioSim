/* ═══════════════════════════════════════════════════════════════════════════
   AuxilioSim — aplicación
   Shell responsive (sidebar en escritorio · tab bar en móvil), vistas
   Escenarios / Simulador / Guía / Métricas y el motor de escenas narrativas.
   ═══════════════════════════════════════════════════════════════════════════ */
(() => {
'use strict';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const DAY = 864e5;

/* ─── ICONOS (trazos estilo lucide) ──────────────────────────────────────── */
const ICONS = {
  plus: '<path d="M12 5v14M5 12h14"/>',
  volume: '<path d="M11 5 6 9H2v6h4l5 4V5z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M19 5a10 10 0 0 1 0 14"/>',
  mute: '<path d="M11 5 6 9H2v6h4l5 4V5z"/><path d="m22 9-6 6M16 9l6 6"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1"/>',
  asterisk: '<path d="M12 4v16M5.1 8l13.8 8M5.1 16l13.8-8"/>',
  timer: '<circle cx="12" cy="14" r="8"/><path d="M12 10v4l2 2M10 2h4"/>',
  book: '<path d="M2 4h6a4 4 0 0 1 4 4v13a3 3 0 0 0-3-3H2z"/><path d="M22 4h-6a4 4 0 0 0-4 4v13a3 3 0 0 1 3-3h7z"/>',
  chart: '<path d="M3 3v18h18"/><path d="m7 15 4-4 3 3 5-6"/>',
  shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/>',
  flame: '<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.4-.5-2-1-3-1.1-2.1-.2-4 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.2.4-2.3 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>',
  choke: '<circle cx="12" cy="4.5" r="2"/><path d="M12 7v7m-4 8 4-8 4 8M5 9.5l7 1.5 7-1.5"/>',
  target: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
  check: '<path d="m5 12 5 5 9-10"/>',
  checkCircle: '<circle cx="12" cy="12" r="10"/><path d="m8 12 3 3 5-6"/>',
  history: '<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5M12 7v5l4 2"/>',
  play: '<path d="M7 4v16l13-8z"/>',
  right: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  left: '<path d="M19 12H5M11 18l-6-6 6-6"/>',
  sliders: '<path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12"/><circle cx="16" cy="6" r="2"/><circle cx="10" cy="12" r="2"/><circle cx="18" cy="18" r="2"/>',
  cap: '<path d="M22 10 12 5 2 10l10 5 10-5z"/><path d="M6 12v5c3 2 9 2 12 0v-5"/>',
  chevron: '<path d="m9 6 6 6-6 6"/>',
  x: '<path d="M18 6 6 18M6 6l12 12"/>',
  share: '<path d="M4 12v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7M16 6l-4-4-4 4M12 2v13"/>',
  refresh: '<path d="M21 12a9 9 0 1 1-3-6.7L21 8"/><path d="M21 3v5h-5"/>',
  hand: '<path d="M9 11V5a2 2 0 0 1 4 0v6m0-1V9a2 2 0 0 1 4 0v3m0-1a2 2 0 0 1 4 0v3a8 8 0 0 1-8 8h-1a8 8 0 0 1-6.3-3.1L3 15.5a2 2 0 0 1 3-2.6L9 16"/>',
  hold: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/>',
  move: '<path d="M5 9 2 12l3 3M9 5l3-3 3 3M15 19l-3 3-3-3M19 9l3 3-3 3M2 12h20M12 2v20"/>',
  swipe: '<path d="M12 20V4M6 10l6-6 6 6"/>',
  alert: '<path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/><path d="M12 9v4M12 17h.01"/>',
  info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>',
  goggles: '<rect x="2" y="7" width="20" height="10" rx="5"/><circle cx="8" cy="12" r="2.5"/><circle cx="16" cy="12" r="2.5"/>',
};
const icon = (n, cls = '') => `<svg class="ic ${cls}" viewBox="0 0 24 24" aria-hidden="true">${ICONS[n] || ''}</svg>`;
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

/* ─── ESTADO PERSISTENTE ─────────────────────────────────────────────────── */
const STORE = 'auxiliosim.v2';
const scoreOf = r => Math.max(0, Math.round((r.ac / Math.max(1, r.ac + r.er)) * 100) - (r.tta > 15 ? 5 : 0));
function seed() {
  const now = Date.now();
  return [
    { sc: 'quemadura', at: now - 9 * DAY, ac: 3, er: 0, tta: 9.8, total: 58, key: 10, firstErr: 0 },
    { sc: 'corte', at: now - 3 * DAY, ac: 4, er: 0, tta: 16.2, total: 71, key: 8, firstErr: 0 },
  ].map(r => ({ ...r, score: scoreOf(r) }));
}
function load() {
  try {
    const d = JSON.parse(localStorage.getItem(STORE));
    if (d && Array.isArray(d.history)) return { settings: { voice: false, stress: false, haptic: true, ...d.settings }, history: d.history };
  } catch (e) { /* almacenamiento no disponible */ }
  return { settings: { voice: false, stress: false, haptic: true }, history: seed() };
}
const db = load();
function save() { try { localStorage.setItem(STORE, JSON.stringify(db)); } catch (e) { /* sin persistencia */ } }

const runsOf = id => db.history.filter(r => r.sc === id);
const bestOf = id => runsOf(id).reduce((m, r) => Math.max(m, r.score), 0);
const readiness = () => Math.round(ORDER.reduce((s, id) => s + bestOf(id), 0) / ORDER.length);
function rel(ts) {
  const d = Math.floor((Date.now() - ts) / DAY);
  return d <= 0 ? 'hoy' : d === 1 ? 'ayer' : `hace ${d}d`;
}
const fmtS = v => (v == null ? '—' : `${(+v).toFixed(1)} s`);

/* ─── UTILIDADES DE INTERFAZ ─────────────────────────────────────────────── */
function toast(msg) {
  const t = document.createElement('div');
  t.className = 'toast'; t.textContent = msg;
  $('#toasts').appendChild(t);
  setTimeout(() => t.remove(), 2800);
}
function haptic(p) { if (db.settings.haptic && navigator.vibrate) navigator.vibrate(p); }
function speak(text) {
  if (!db.settings.voice || !('speechSynthesis' in window)) return;
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text.replace(/["«»]/g, ''));
  u.lang = 'es-ES'; u.rate = 1.02;
  speechSynthesis.speak(u);
}
function openModal(html) {
  $('#modal-body').innerHTML = html;
  $('#modal').hidden = false;
  $('#modal-body button, #modal-body a')?.focus();
}
function closeModal() { $('#modal').hidden = true; }

/* ─── NAVEGACIÓN ─────────────────────────────────────────────────────────── */
const TABS = {
  escenarios: { title: 'Escenarios', sub: 'Emergencias domésticas simuladas', icon: 'asterisk', render: renderHub },
  simulador:  { title: 'Simulador', sub: 'Práctica narrativa guiada', icon: 'timer', render: renderSimTab },
  guia:       { title: 'Guía', sub: 'Protocolos ERC · AHA · Cruz Roja', icon: 'book', render: renderGuide },
  metricas:   { title: 'Métricas', sub: 'Tu progreso y tiempos de reacción', icon: 'chart', render: renderMetrics },
};
let tab = 'escenarios';

function buildNav() {
  const items = Object.entries(TABS);
  $('#side-nav').innerHTML = items.map(([k, t]) =>
    `<button class="side-link" data-tab="${k}">${icon(t.icon)}${t.title}</button>`).join('');
  $('#tabbar').innerHTML = items.map(([k, t]) =>
    `<button class="tab" data-tab="${k}">${icon(t.icon)}${t.title}</button>`).join('');
}
function go(name) {
  tab = TABS[name] ? name : 'escenarios';
  $$('[data-tab]').forEach(b => b.dataset.tab === tab ? b.setAttribute('aria-current', 'page') : b.removeAttribute('aria-current'));
  $('#section-label').textContent = TABS[tab].title;
  $('#page-title').textContent = TABS[tab].title;
  $('#page-sub').textContent = TABS[tab].sub;
  $('#main').innerHTML = TABS[tab].render();
  $('#main').scrollTop = 0;
  if (location.hash !== '#' + tab) history.replaceState(null, '', '#' + tab);
}

/* ─── VISTA: ESCENARIOS (hub) ────────────────────────────────────────────── */
function statusOf(id) {
  const runs = runsOf(id);
  if (!runs.length) return `<span class="sc-status">${icon('history')}Pendiente de práctica</span>`;
  const last = Math.max(...runs.map(r => r.at));
  const times = runs.length === 1 ? '1 vez' : `${runs.length} veces`;
  return `<span class="sc-status">${icon('checkCircle')}Completado ${times} · ${rel(last)}</span>`;
}
function renderHub() {
  const pct = readiness();
  const month = ORDER.filter(id => runsOf(id).some(r => Date.now() - r.at < 30 * DAY)).length;
  const next = ORDER.find(id => !runsOf(id).length) || ORDER[0];
  const s = db.settings;
  return `<div class="page">
    <div class="hub-top">
      <section class="card status" aria-label="Estado de capacitación">
        <div class="status-head">
          <span class="eyebrow">${icon('shield')}Estado de capacitación</span>
          ${s.stress ? '<span class="pill pill-red">Modo Estrés Activo</span>' : '<span class="pill pill-green">Modo Práctica Activo</span>'}
        </div>
        <div class="status-row"><h3>Nivel de preparación</h3><span class="status-pct">${pct}%</span></div>
        <div class="bar" role="progressbar" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100"><span style="width:${pct}%"></span></div>
        <div class="status-foot"><span>${month} de ${ORDER.length} protocolos completados este mes</span><button class="link" data-go="metricas">Ver historial</button></div>
        <div class="status-acts">${ACTS.map((a, i) => `<div class="status-act"><b>${i + 1}. ${a.name}</b>${a.cap}</div>`).join('')}</div>
      </section>
      ${configCard()}
    </div>

    <section aria-labelledby="sc-h">
      <div class="sec-head" style="margin-bottom:18px">
        <div><h2 class="h2" id="sc-h">Selecciona un Escenario</h2>
        <p class="lead">Emergencias domésticas simuladas en entorno guiado e interactivo</p></div>
        <span class="pill pill-soft">${ORDER.length} disponibles</span>
      </div>
      <div class="sc-grid">${ORDER.map(id => scenarioCard(SCENARIOS[id], id === next)).join('')}</div>
    </section>
    <p class="compliance">${icon('shield')}Conforme a directrices ERC y Cruz Roja Internacional</p>
  </div>`;
}
function scenarioCard(sc, primary) {
  return `<article class="card sc-card">
    <span class="pill tone-${sc.tone}">${sc.level}</span>
    <div class="sc-title"><span class="sc-icon">${icon(sc.icon)}</span>
      <div><div class="eyebrow">Escenario ${sc.num}</div><h3>${sc.title}</h3></div></div>
    <div class="sc-media"><img src="${sc.img}" alt="" loading="lazy">
      <div class="sc-obj">${icon('target')}Objetivo: ${sc.objective}</div></div>
    <p class="sc-desc">${sc.desc}</p>
    <div class="sc-foot">${statusOf(sc.id)}
      ${primary
        ? `<button class="btn btn-red" data-start="${sc.id}">Iniciar Simulación ${icon('play')}</button>`
        : `<button class="btn btn-soft" data-start="${sc.id}">Entrenar ${icon('right')}</button>`}
    </div>
  </article>`;
}
function configCard() {
  const s = db.settings;
  const row = (k, t, d) => `<label class="switch-row"><span><b>${t}</b><small>${d}</small></span>
    <span class="switch"><input type="checkbox" role="switch" data-setting="${k}" ${s[k] ? 'checked' : ''}><span></span></span></label>`;
  return `<section class="card config" aria-label="Configuración del simulador">
    <div class="config-head"><h3>${icon('sliders')}Configuración del Simulador</h3><small>Opciones locales</small></div>
    ${row('voice', 'Instrucciones por voz', 'Narrador paso a paso')}
    ${row('stress', 'Con límite de tiempo', 'Simula presión de estrés real (15 s)')}
    ${row('haptic', 'Vibración háptica', 'Feedback táctil en móviles compatibles')}
    <button class="row-btn" data-gestures><span>${icon('cap')}Ver tutorial rápido de gestos táctiles</span>${icon('chevron')}</button>
  </section>`;
}

/* ─── VISTA: SIMULADOR (lanzador) ────────────────────────────────────────── */
function renderSimTab() {
  const resume = sim.sc && sim.i > 0 && sim.sc.scenes[sim.i].type !== 'summary'
    ? `<div class="card resume"><div><b>Continuar: ${sim.sc.title}</b>
        <p>Escena ${sim.i + 1} de ${sim.sc.scenes.length} · ${ACTS[sim.sc.scenes[sim.i].act].name}</p></div>
        <button class="btn btn-red" data-resume>Continuar ${icon('play')}</button></div>` : '';
  return `<div class="page">
    <div><h2 class="h2">Cómo funciona cada simulación</h2>
      <p class="lead">Cada escenario es una historia corta en cuatro actos. Avanzas escena a escena, con la guía por voz en subtítulos y un marcador de aciertos y errores.</p></div>
    ${resume}
    <div class="acts-line">${ACTS.map((a, i) => `<div class="card act-card"><span class="n">${i + 1}</span><b>${a.name}</b>
      <p>${['Presentación del caso y tutorial de gestos: toca, mantén pulsado, arrastra o desliza.',
            'Exploras el lugar de la escena y sus objetos clave, antes de que ocurra el accidente.',
            'Ocurre la emergencia: decides bajo presión y ejecutas la técnica correcta.',
            'Estabilizas a la persona y revisas tu desempeño con un resumen clínico.'][i]}</p></div>`).join('')}</div>
    <section><h3 class="eyebrow" style="margin-bottom:12px">Elige un escenario</h3>
      <div class="sc-rows">${ORDER.map(id => { const sc = SCENARIOS[id]; return `<div class="card sc-row">
        <img src="${sc.img}" alt=""><div><b>${sc.num} · ${sc.title}</b><small>${sc.level} · ${sc.duration} · ${sc.scenes.length} escenas</small></div>
        <button class="btn btn-soft" data-start="${id}">Entrenar ${icon('right')}</button></div>`; }).join('')}</div>
    </section>
  </div>`;
}

/* ─── VISTA: GUÍA ────────────────────────────────────────────────────────── */
let guideTab = 'quemadura';
function renderGuide() {
  const g = GUIDE[guideTab], sc = SCENARIOS[guideTab];
  return `<div class="page">
    <div><h2 class="h2">Guía de primeros auxilios</h2><p class="lead">Protocolos resumidos según ERC, AHA y Cruz Roja Internacional. En una emergencia real, llama al número de emergencias de tu país.</p></div>
    <div class="seg" role="tablist">${ORDER.map(id => `<button role="tab" data-guide="${id}" aria-selected="${id === guideTab}">${SCENARIOS[id].short}</button>`).join('')}</div>
    <div class="guide">
      <div class="guide-aside">
        <div class="guide-img"><img src="${sc.img}" alt="${esc(g.caption)}"><div class="sc-obj">${icon('info')}${g.caption}</div></div>
        <div class="callout ${g.alert.tone}">${icon('alert')}<div><b>${g.alert.title}</b>${g.alert.text}</div></div>
        <button class="btn btn-red" data-start="${guideTab}">Practicar este escenario ${icon('play')}</button>
      </div>
      <div style="display:flex;flex-direction:column;gap:18px">
        <ol class="steps">${g.steps.map((s, i) => `<li class="card step"><span class="n">${i + 1}</span><div><b>${s[0]}</b><p>${s[1]}</p></div></li>`).join('')}</ol>
        <div><h3 class="eyebrow" style="margin-bottom:10px">Mitos a evitar</h3>
          <div class="myths">${g.myths.map(m => `<div class="myth"><span class="x">✕</span><div><b>${m[0]}</b> — ${m[1]}</div></div>`).join('')}</div></div>
      </div>
    </div>
  </div>`;
}

/* ─── VISTA: MÉTRICAS ────────────────────────────────────────────────────── */
function renderMetrics() {
  const H = db.history;
  const ttas = H.map(r => r.tta).filter(v => v != null);
  const avg = ttas.length ? ttas.reduce((a, b) => a + b, 0) / ttas.length : null;
  const demyth = H.length ? Math.round(H.filter(r => !r.firstErr).length / H.length * 100) : 0;
  const lastTta = id => { const r = runsOf(id).sort((a, b) => b.at - a.at)[0]; return r ? r.tta : null; };
  const bar = id => {
    const v = lastTta(id), w = v == null ? 0 : Math.min(100, v / 30 * 100);
    const col = v == null ? 'transparent' : v <= 15 ? 'var(--green-600)' : 'var(--red-600)';
    return `<div class="tta-row"><span>${SCENARIOS[id].short}</span>
      <div class="tta-track"><span style="width:${w}%;background:${col}"></span><i class="tta-goal"></i></div><b>${fmtS(v)}</b></div>`;
  };
  const allChecks = ORDER.flatMap(id => SCENARIOS[id].checklist.filter(c => c.id !== 'tutorial').map(c => ({ ...c, sc: id })));
  return `<div class="page">
    <div><h2 class="h2">Métricas de rendimiento</h2><p class="lead">Historial de entrenamiento y tiempo de reacción frente a la meta clínica (&lt; 15 s).</p></div>
    <div class="kpis">
      <div class="card kpi"><span class="eyebrow">Preparación</span><div class="v" style="color:var(--red-600)">${readiness()}%</div><small>Media de tu mejor puntuación por escenario</small></div>
      <div class="card kpi"><span class="eyebrow">Sesiones</span><div class="v">${H.length}</div><small>${ORDER.filter(id => runsOf(id).length).length} de ${ORDER.length} escenarios practicados</small></div>
      <div class="card kpi"><span class="eyebrow">1ª acción media</span><div class="v" style="color:${avg != null && avg <= 15 ? 'var(--green-600)' : 'var(--ink)'}">${fmtS(avg)}</div><small>Meta: menos de 15 s</small></div>
      <div class="card kpi"><span class="eyebrow">Desmitificación</span><div class="v">${demyth}%</div><small>Sesiones sin elegir un mito en la primera decisión</small></div>
    </div>
    <div class="m-grid">
      <div style="display:flex;flex-direction:column;gap:20px">
        <section class="card panel"><h3>Tiempo de primera acción <span class="pill tone-blue">Meta &lt; 15 s</span></h3>
          ${ORDER.map(bar).join('')}<p class="tta-legend">Última sesión de cada escenario · escala 0–30 s · la línea marca la meta de 15 s</p></section>
        <section class="card panel"><h3>Historial</h3>
          ${H.length ? `<ul class="hist">${[...H].sort((a, b) => b.at - a.at).slice(0, 8).map(r => `<li>
            <span><b>${SCENARIOS[r.sc].title}</b><br><small>${new Date(r.at).toLocaleDateString('es', { day: 'numeric', month: 'short' })} · ✓ ${r.ac} · ✗ ${r.er} · 1ª acción ${fmtS(r.tta)} · ${Math.round(r.total)} s en total</small></span>
            <span class="score" style="color:${r.score >= 90 ? 'var(--green-600)' : r.score >= 70 ? 'var(--amber-800)' : 'var(--red-600)'}">${r.score}</span></li>`).join('')}</ul>`
            : '<p class="lead">Aún no hay sesiones registradas.</p>'}
        </section>
      </div>
      <div style="display:flex;flex-direction:column;gap:20px">
        <section class="card panel"><h3>Auditoría de protocolos</h3><ul class="checks">
          ${allChecks.map(c => { const ok = runsOf(c.sc).length > 0; return `<li><span class="${ok ? 'dot-ok' : 'dot-no'}">${icon('check')}</span><span>${c.text}<br><small style="color:var(--muted)">${SCENARIOS[c.sc].short}</small></span></li>`; }).join('')}
        </ul></section>
        <div class="actions-row">
          <button class="btn btn-red" data-share>${icon('share')}Compartir certificado</button>
          <button class="btn btn-ghost" data-reset>${icon('refresh')}Reiniciar progreso</button>
        </div>
      </div>
    </div>
  </div>`;
}

/* ═══════════════════════════════════════════════════════════════════════════
   MOTOR DEL SIMULADOR NARRATIVO
   ═══════════════════════════════════════════════════════════════════════════ */
let sim = {};
let cleanups = [];
const simEl = () => $('#sim');
const scene = () => sim.sc.scenes[sim.i];
function later(fn, ms) { const t = setTimeout(fn, ms); cleanups.push(() => clearTimeout(t)); }
function every(fn, ms) { const t = setInterval(fn, ms); cleanups.push(() => clearInterval(t)); return t; }
function cleanup() { cleanups.forEach(f => f()); cleanups = []; }

function startSim(id) {
  sim = { sc: SCENARIOS[id], i: 0, ac: 0, er: 0, checks: {}, errs: {}, done: {}, choice: {}, t0: 0, tta: null, key: null, forces: [], saved: false, firstErr: 0 };
  openSim();
  goScene(0);
}
function openSim() {
  simEl().hidden = false;
  document.body.classList.add('sim-open');
  document.addEventListener('keydown', simKeys);
}
function hideSim() {
  cleanup();
  if ('speechSynthesis' in window) speechSynthesis.cancel();
  simEl().hidden = true;
  document.body.classList.remove('sim-open');
  document.removeEventListener('keydown', simKeys);
}
function closeSim() { hideSim(); go(tab); }

function simKeys(e) { if (e.key === 'Escape' && $('#modal').hidden) closeSim(); }

function goScene(i) {
  cleanup();
  sim.i = i;
  const s = scene();
  if (s.type === 'explore' && !sim.t0) sim.t0 = Date.now();
  const total = sim.sc.scenes.length;
  const light = s.type === 'summary';
  const dark = s.type === 'intro' || s.type === 'tutorial';
  const prev = sim.sc.scenes[i - 1];
  simEl().innerHTML = `
    <div class="stage dark ${s.art ? 'scene' : ''}" data-theme="${s.theme || (s.art ? 'warm' : '')}" data-type="${s.type}">
      <div class="stage-progress" style="width:${(i + 1) / total * 100}%"></div>
      <div class="stage-top">
        <div>
          <ol class="acts" aria-label="Arco narrativo">${ACTS.map((a, k) => `<li class="${k === s.act ? 'on' : k < s.act ? 'past' : ''}" ${k === s.act ? 'aria-current="step"' : ''}><span class="n">${k + 1}</span><span class="t">${a.name}</span></li>`).join('')}</ol>
          <p class="act-cap">${ACTS[s.act].name} · ${ACTS[s.act].cap} — Escena ${i + 1} de ${total}</p>
        </div>
        <div class="top-right">
          <span class="chip-d" id="timer" hidden></span>
          ${s.act >= 2 && !light ? `<span class="chip-d" id="score" aria-label="Aciertos y errores">${scoreHtml()}</span>` : ''}
          ${!dark && !light ? `<span class="chip-d scene-pill">Escena: ${s.name}</span>` : ''}
          <button class="close-btn" data-close aria-label="Salir del simulador">${icon('x')}</button>
        </div>
      </div>
      ${s.art ? `<div class="stage-art"><svg viewBox="${VIEW}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Escena: ${s.name}">${ART[s.art]()}<g id="spots"></g></svg></div>
        <div class="stage-tray" id="tray"></div>` : `<div class="stage-body" id="body"></div>`}
      ${s.text || s.art ? `<div class="stage-sub" id="sub" aria-live="polite"><div class="sub-label" id="sub-label"></div><p class="sub-text" id="sub-text"></p></div>` : ''}
    </div>
    <div class="sim-foot">
      <button class="back-link" data-back>${icon('left')}${i === 0 ? 'Escenarios' : prev.name}</button>
      <span class="foot-hint" id="hint"></span>
      ${light ? '' : `<button class="cta ${s.ctaTone || ''}" id="cta" data-next>${s.cta} ${icon('right')}</button>`}
    </div>`;
  if (s.text) sub(s.label === 'Escena' ? 'Escena' : 'Guía (voz) · Subtítulo', s.text);
  SCENE[s.type](s);
  if (sim.done[i]) restoreDone(s);
}

function sub(label, text, tone = '') {
  const l = $('#sub-label'), t = $('#sub-text');
  if (!l) return;
  $('#sub').className = 'stage-sub ' + tone;
  l.className = 'sub-label ' + tone;
  const ic = { ok: 'checkCircle', bad: 'alert', info: 'info' }[tone] || (label === 'Escena' ? 'info' : 'volume');
  l.innerHTML = icon(ic) + esc(label);
  t.textContent = text;
  speak(text);
}
function cta(on) {
  const b = $('#cta');
  if (!b) return;
  b.disabled = !on;
  if (on) { b.classList.add('ready'); $('#hint').textContent = ''; }
}
function hint(t) { const h = $('#hint'); if (h) h.textContent = t; }
const scoreHtml = () => `<span class="ok">✓ ${sim.ac}</span>·<span class="bad">✕ ${sim.er}</span>`;
function score() { const e = $('#score'); if (e) e.innerHTML = scoreHtml(); }
function flash(text, bad = false) {
  const art = $('.stage-art') || $('.stage-body');
  if (!art) return;
  const f = document.createElement('div');
  f.className = 'flash' + (bad ? ' bad' : '');
  f.innerHTML = icon(bad ? 'x' : 'check') + text;
  art.appendChild(f);
  setTimeout(() => f.remove(), 1900);
}
function setState(...tokens) { const st = $('.stage'); if (st) st.dataset.state = tokens.join(' '); }
function succeed(s, text) {
  sim.done[sim.i] = true;
  sim.ac++; score();
  if (s.check) sim.checks[s.check] = true;
  if (s.timed && sim.tta == null) sim.tta = (Date.now() - sim.sceneStart) / 1000;
  stopTimer();
  sub('✓ Correcto', text, 'ok');
  flash('¡Bien hecho!');
  haptic([40, 30, 60]);
  cta(true);
}
function fail(s, text, el) {
  sim.er++; score();
  sim.errs[s.check] = (sim.errs[s.check] || 0) + 1;
  if (s.check === 'first') sim.firstErr++;
  sub('✕ Revisa tu decisión', text, 'bad');
  flash('Inténtalo de nuevo', true);
  haptic([180]);
  const st = $('.stage'); st.classList.remove('shake'); void st.offsetWidth; st.classList.add('shake');
  if (el) { el.classList.add('wrong'); el.disabled = true; el.setAttribute('aria-disabled', 'true'); }
}
function restoreDone(s) {
  cta(true);
  if (s.state && s.type !== 'hold') setState(s.state, s.type === 'swipe' ? 'expelled' : '');
  if (s.type === 'hold') { $('.stage').style.setProperty('--p', 1); const h = $('.hold'); if (h) { h.style.setProperty('--p', 1); $('#hold-val').textContent = s.target + 's'; } }
  if (s.type === 'choice' && sim.choice[sim.i]) {
    $$('.opt').forEach(b => { b.disabled = true; if (b.dataset.id === sim.choice[sim.i]) b.classList.add('right'); });
  }
  if (s.type === 'drag') $$('.drag-item').forEach(b => { b.disabled = true; if (s.items.find(x => x.id === b.dataset.id)?.correct) b.classList.add('used'); });
  if (s.type === 'swipe') { $$('.reps i').forEach(r => r.classList.add('on')); }
  sub('✓ Completado', 'Ya completaste esta escena. Continúa cuando quieras.', 'ok');
}

// temporizador de estrés (15 s) para la primera decisión crítica
function startTimer(s) {
  sim.sceneStart = Date.now();
  if (!s.timed || !db.settings.stress || sim.done[sim.i]) return;
  const el = $('#timer'); el.hidden = false;
  let left = 15;
  const tick = () => {
    el.textContent = `⏱ ${left}s`;
    el.classList.toggle('warn', left <= 5);
    if (left-- <= 0) {
      stopTimer();
      sim.er++; score(); sim.firstErr++;
      sub('✕ Se acabó el tiempo', '"En una emergencia real cada segundo cuenta. Decide ahora."', 'bad');
      flash('Tiempo agotado', true);
      haptic([200, 80, 200]);
    }
  };
  tick();
  sim.timer = every(tick, 1000);
}
function stopTimer() { clearInterval(sim.timer); const el = $('#timer'); if (el) el.hidden = true; }

/* ─── Renderizadores por tipo de escena ─────────────────────────────────── */
const SCENE = {
  intro(s) {
    const sc = sim.sc;
    $('#body').innerHTML = `<div class="intro">
      <div class="intro-copy">
        <span class="pill tone-${sc.tone}">${sc.level}</span>
        <div class="sc-title"><span class="sc-icon">${icon(sc.icon)}</span>
          <div><div class="eyebrow">Escenario ${sc.num} · ${sc.title}</div></div></div>
        <h1 class="intro-title">${sc.introTitle}</h1>
        <p class="intro-text">${sc.introText}</p>
        <div class="intro-meta"><span class="pill pill-soft">${icon('timer')}${sc.duration}</span><span class="pill pill-soft">${sc.scenes.length - 2} escenas interactivas</span>
          <span class="pill pill-soft">${sim.sc.gestures.map(g => GESTURES[g].title).join(' · ')}</span></div>
        <div class="intro-arc">${ACTS.map((a, k) => `<div><b>${k + 1}. ${a.name}</b>${a.cap}</div>`).join('')}</div>
      </div>
      <div class="sc-media intro-media"><img src="${sc.img}" alt=""><div class="sc-obj">${icon('target')}Objetivo: ${sc.objective}</div></div>
    </div>`;
    speak(sc.introTitle.replace('<br>', ' ') + '. ' + sc.introText);
  },

  tutorial(s) {
    $('#body').innerHTML = `<div class="tut">${sim.sc.gestures.map(g => { const G = GESTURES[g]; return `
      <div class="gest" data-g="${g}" tabindex="0" role="button" aria-label="Practicar: ${G.title}">
        <span class="gest-ic">${icon(G.icon)}</span><b>${G.title}</b><span>${G.desc}</span><em>Pruébalo aquí · ${G.mouse}</em>
      </div>`; }).join('')}</div>`;
    $$('.gest').forEach(el => {
      let x0, y0, t0, down = false;
      const done = () => {
        if (el.classList.contains('done')) return;
        el.classList.add('done'); el.querySelector('em').textContent = '✓ Dominado';
        haptic([30]);
        const all = $$('.gest').every(g => g.classList.contains('done'));
        if (all) flash('¡Listo para empezar!');
      };
      el.addEventListener('pointerdown', e => { down = true; x0 = e.clientX; y0 = e.clientY; t0 = Date.now(); el.classList.add('pressing'); el.setPointerCapture(e.pointerId); });
      el.addEventListener('pointerup', e => {
        if (!down) return; down = false; el.classList.remove('pressing');
        const dx = e.clientX - x0, dy = e.clientY - y0, dist = Math.hypot(dx, dy), dt = Date.now() - t0, g = el.dataset.g;
        if ((g === 'tap' && dist < 12 && dt < 600) || (g === 'hold' && dist < 16 && dt >= 700) ||
            (g === 'drag' && dist >= 40) || (g === 'swipe' && dy <= -40)) done();
      });
      el.addEventListener('pointercancel', () => { down = false; el.classList.remove('pressing'); });
      el.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); done(); } });
    });
    sim.checks.tutorial = true;
  },

  explore(s) {
    drawSpots(s.spots.map(p => ({ ...p, key: p.id })));
    $('#tray').innerHTML = s.spots.map(p => `<button class="opt" data-spot="${p.id}">${p.label}</button>`).join('');
    const seen = new Set();
    const show = id => {
      const p = s.spots.find(x => x.id === id);
      seen.add(id);
      $$(`[data-spot="${id}"]`).forEach(e => e.classList.add('seen'));
      sub(`Objeto · ${p.label}`, p.info, 'info');
      hint(`${seen.size} de ${s.spots.length} objetos explorados`);
      haptic([20]);
    };
    bindSpots(show);
    hint(`0 de ${s.spots.length} objetos explorados`);
  },

  choice(s) {
    const spots = s.options.filter(o => o.spot).map(o => ({ ...o.spot, id: o.id, label: o.label, key: o.id }));
    if (spots.length) drawSpots(spots, true);
    $('#tray').innerHTML = s.options.map(o => `<button class="opt" data-id="${o.id}">${o.label}</button>`).join('') +
      (spots.length ? '<p class="tray-hint">También puedes tocar directamente el punto en la figura</p>' : '');
    cta(false);
    hint('Elige una acción para continuar');
    const pick = id => {
      if (sim.done[sim.i]) return;
      const o = s.options.find(x => x.id === id);
      const btn = $(`.opt[data-id="${id}"]`);
      if (btn.disabled) return;
      if (o.correct) {
        btn.classList.add('right');
        $$('.opt').forEach(b => b.disabled = true);
        sim.choice[sim.i] = id;
        if (s.state) setState(s.state);
        $(`#spots [data-spot="${id}"]`)?.classList.add('seen');
        succeed(s, o.fb);
      } else {
        $(`#spots [data-spot="${id}"]`)?.classList.add('wrong');
        fail(s, o.fb, btn);
      }
    };
    $$('.opt').forEach(b => b.addEventListener('click', () => pick(b.dataset.id)));
    if (spots.length) bindSpots(pick);
    startTimer(s);
  },

  hold(s) {
    $('#tray').innerHTML = `<div class="hold-wrap">
      <button class="hold ${s.red ? 'red' : ''}" id="hold" aria-label="${s.holdLabel}"><span class="hold-in"><b id="hold-val">0s</b><small>${s.unit}</small></span></button>
      <p class="hold-cap">${s.holdLabel}<small>${s.note}</small></p></div>`;
    cta(false);
    hint('Mantén pulsado el indicador hasta completarlo');
    const btn = $('#hold'), stage = $('.stage');
    let held = 0, raf = 0, last = 0, on = false, breaks = 0;
    const paint = () => {
      const p = Math.min(1, held / s.target);
      btn.style.setProperty('--p', p);
      stage.style.setProperty('--p', p);
      $('#hold-val').textContent = `${Math.floor(held)}s`;
    };
    const loop = t => {
      held += (t - last) / 1000; last = t;
      paint();
      if (held >= s.target) { stop(true); return; }
      raf = requestAnimationFrame(loop);
    };
    const start = e => {
      if (on || sim.done[sim.i]) return;
      e?.preventDefault?.();
      on = true; btn.classList.add('on'); setState(s.state);
      if (e?.pointerId != null) btn.setPointerCapture(e.pointerId);
      last = performance.now(); raf = requestAnimationFrame(loop);
      if (held === 0) sub('Guía (voz) · Subtítulo', '"Así, muy bien. No sueltes."');
      haptic([20]);
    };
    const stop = complete => {
      if (!on) return;
      on = false; cancelAnimationFrame(raf); btn.classList.remove('on');
      if (complete === true) {
        held = s.target; paint();
        sim.key = s.target;
        later(() => setState(''), 900);
        succeed(s, s.done);
      } else {
        setState('');
        if (held > 0.4) { breaks++; sub('✕ No sueltes', s.release, 'bad'); haptic([120]); hint(`Interrupciones: ${breaks} — el progreso se conserva, pero en la vida real debe ser continuo`); }
      }
    };
    btn.addEventListener('pointerdown', start);
    btn.addEventListener('pointerup', () => stop());
    btn.addEventListener('pointercancel', () => stop());
    btn.addEventListener('lostpointercapture', () => stop());
    btn.addEventListener('contextmenu', e => e.preventDefault());
    btn.addEventListener('keydown', e => { if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) start(e); });
    btn.addEventListener('keyup', e => { if (e.key === ' ' || e.key === 'Enter') stop(); });
    cleanups.push(() => cancelAnimationFrame(raf));
  },

  drag(s) {
    const sw = v => v === 'url' ? 'repeating-linear-gradient(45deg,#fbf6ee 0 6px,#eadfcb 6px 12px)' : v;
    $('#tray').innerHTML = s.items.map(it => `<button class="drag-item" data-id="${it.id}"><span class="sw" style="background:${sw(it.sw)};border:1px solid #d8ccb8"></span>${it.label}</button>`).join('') +
      '<p class="tray-hint">Arrastra hasta la zona marcada · o toca el objeto para colocarlo</p>';
    cta(false);
    hint('Coloca el material correcto');
    const stage = $('.stage');
    const target = () => $('#drop-target .dt').getBoundingClientRect();
    const over = (x, y) => { const r = target(), m = 30; return x > r.left - m && x < r.right + m && y > r.top - m && y < r.bottom + m; };
    const apply = (it, btn) => {
      if (sim.done[sim.i] || btn.disabled) return;
      if (it.correct) {
        btn.classList.add('used'); $$('.drag-item').forEach(b => b.disabled = true);
        setState(s.state);
        succeed(s, it.fb);
      } else fail(s, it.fb, btn);
    };
    $$('.drag-item').forEach(btn => {
      const it = s.items.find(x => x.id === btn.dataset.id);
      let ghost = null, x0 = 0, y0 = 0, down = false;
      btn.addEventListener('pointerdown', e => { if (btn.disabled) return; down = true; x0 = e.clientX; y0 = e.clientY; btn.setPointerCapture(e.pointerId); });
      btn.addEventListener('pointermove', e => {
        if (!down) return;
        if (!ghost && Math.hypot(e.clientX - x0, e.clientY - y0) > 8) {
          ghost = btn.cloneNode(true); ghost.classList.add('drag-ghost'); document.body.appendChild(ghost);
          btn.style.opacity = '.35';
        }
        if (ghost) {
          ghost.style.left = e.clientX + 'px'; ghost.style.top = e.clientY + 'px';
          stage.classList.toggle('drop-hot', over(e.clientX, e.clientY));
        }
      });
      const end = e => {
        if (!down) return; down = false;
        stage.classList.remove('drop-hot'); btn.style.opacity = '';
        if (ghost) {
          ghost.remove(); ghost = null;
          if (e.type === 'pointerup' && over(e.clientX, e.clientY)) apply(it, btn);
          else if (e.type === 'pointerup') sub('Guía (voz) · Subtítulo', '"Suéltalo encima de la zona marcada."', 'info');
        } else if (e.type === 'pointerup') apply(it, btn);
      };
      btn.addEventListener('pointerup', end);
      btn.addEventListener('pointercancel', end);
      btn.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); apply(it, btn); } });
      btn.addEventListener('click', e => e.preventDefault());
    });
  },

  swipe(s) {
    setState(s.state);
    $('#tray').innerHTML = `<div class="swipe-wrap">
      <div class="swipe-pad" id="pad" tabindex="0" role="button" aria-label="Zona de compresión: desliza hacia arriba o pulsa la flecha arriba">${icon('swipe')}Desliza hacia arriba</div>
      <div class="swipe-info">
        <b id="rep-txt">Compresiones: 0 / ${s.reps}</b>
        <div class="reps">${Array.from({ length: s.reps }, () => '<i></i>').join('')}</div>
        <div class="gauge" aria-hidden="true"><span class="band" style="left:${85 / 130 * 100}%;width:${15 / 130 * 100}%"></span><span class="needle" id="needle" style="left:0"></span></div>
        <small id="force-txt">Fuerza estimada: — · óptimo 85–100 N</small>
      </div></div>`;
    cta(false);
    hint('Desliza rápido y firme de abajo hacia arriba');
    const pad = $('#pad'), stage = $('.stage');
    let count = 0, y0 = 0, t0 = 0, down = false;
    const compress = force => {
      if (sim.done[sim.i]) return;
      force = Math.round(Math.min(130, force));
      sim.forces.push(force);
      $('#needle').style.left = `calc(${force / 130 * 100}% - 2px)`;
      $('#force-txt').textContent = `Fuerza estimada: ${force} N · óptimo 85–100 N`;
      pad.classList.remove('hit', 'low'); void pad.offsetWidth;
      if (force < 80) {
        pad.classList.add('low');
        sub('✕ Fuerza insuficiente', `"${force} N no basta. Hazlo más rápido y más largo: hacia dentro y hacia arriba."`, 'bad');
        haptic([100]);
      } else {
        count++;
        pad.classList.add('hit');
        stage.classList.add('bump'); later(() => stage.classList.remove('bump'), 160);
        $$('.reps i').forEach((r, k) => r.classList.toggle('on', k < count));
        $('#rep-txt').textContent = `Compresiones: ${count} / ${s.reps}`;
        sub('Guía (voz) · Subtítulo', force > 110 ? `"Compresión ${count}: válida, pero algo brusca (${force} N)."` : `"Compresión ${count} de ${s.reps}. ¡Buena fuerza!"`);
        haptic([40, 20, 40]);
        if (count >= s.reps) {
          setState(s.state, 'expelled');
          const good = sim.forces.filter(f => f >= 80);
          sim.key = Math.round(good.reduce((a, b) => a + b, 0) / good.length);
          succeed(s, s.done);
        }
      }
      later(() => pad.classList.remove('hit', 'low'), 450);
    };
    pad.addEventListener('pointerdown', e => { down = true; y0 = e.clientY; t0 = performance.now(); pad.setPointerCapture(e.pointerId); });
    pad.addEventListener('pointerup', e => {
      if (!down) return; down = false;
      const dy = y0 - e.clientY, dt = Math.max(16, performance.now() - t0);
      if (dy < 25) { sub('Guía (voz) · Subtítulo', '"Desliza de abajo hacia arriba, en un solo movimiento."', 'info'); return; }
      const v = dy / dt; // px/ms
      compress(30 + v * 45 + dy * 0.1);
    });
    pad.addEventListener('pointercancel', () => { down = false; });
    pad.addEventListener('keydown', e => { if (e.key === 'ArrowUp' || e.key === 'Enter' || e.key === ' ') { e.preventDefault(); compress(92); } });
  },

  summary() {
    const sc = sim.sc;
    const total = sim.t0 ? (Date.now() - sim.t0) / 1000 : 0;
    const rec = { sc: sc.id, at: Date.now(), ac: sim.ac, er: sim.er, tta: sim.tta, total, key: sim.key, firstErr: sim.firstErr };
    rec.score = scoreOf(rec);
    if (!sim.saved) { if (rec.ac > 0) { db.history.push(rec); save(); } sim.saved = true; sim.rec = rec; }
    const r = sim.rec;
    const verdict = r.score >= 90 ? ['green', 'Protocolo dominado'] : r.score >= 70 ? ['amber', 'Buen trabajo — repasa los errores'] : ['red', 'Sigue practicando'];
    const next = ORDER[(ORDER.indexOf(sc.id) + 1) % ORDER.length];
    const k = sc.key;
    $('#body').innerHTML = `<div class="sum">
      <div class="sum-head">
        <div><p class="eyebrow">Resolución · Escena: Resumen</p><h2 class="h2">Resumen de la práctica</h2>
          <p class="lead">${sc.title} · puntuación ${r.score}/100</p></div>
        <span class="pill tone-${verdict[0]}">${verdict[1]}</span>
      </div>
      <div class="sum-stats">
        <div class="stat g"><b>${r.ac}</b><span>Aciertos</span></div>
        <div class="stat r"><b>${r.er}</b><span>Errores</span></div>
        <div class="stat ${r.tta != null && r.tta <= 15 ? 'g' : 'r'}"><b>${r.tta != null ? r.tta.toFixed(1) + 's' : '—'}</b><span>Primera acción (meta &lt; 15 s)</span></div>
        <div class="stat t"><b>${r.key != null ? r.key + (k.unit === 's' ? 's' : ' ' + k.unit) : '—'}</b><span>${k.label} (${k.note})</span></div>
        <div class="stat"><b>${Math.round(r.total)}s</b><span>Tiempo total</span></div>
      </div>
      <div class="sum-grid">
        <ul class="card checks sum-check">${sc.checklist.map(c => { const ok = !!sim.checks[c.id], e = sim.errs[c.id] || 0; return `<li>
          <span class="${ok ? 'dot-ok' : 'dot-no'}">${icon(ok ? 'check' : 'x')}</span>
          <span>${c.text}${e ? `<small>${e} intento${e > 1 ? 's' : ''} fallido${e > 1 ? 's' : ''} antes de acertar</small>` : ''}</span></li>`; }).join('')}</ul>
        <div class="callout blue">${icon('info')}<div><b>Microaprendizaje</b>${sc.tip}</div></div>
      </div>
      <div class="sum-actions">
        <button class="btn btn-ghost" data-restart>${icon('refresh')}Repetir escena</button>
        <button class="btn btn-soft" data-close>Volver al menú</button>
        <button class="btn btn-red" data-startsim="${next}">Siguiente: ${SCENARIOS[next].short} ${icon('right')}</button>
      </div>
    </div>`;
    speak(`Resumen. ${r.ac} aciertos y ${r.er} errores. ${verdict[1]}.`);
  },
};

/* hotspots dorados dentro de la ilustración SVG */
function drawSpots(spots, noLabel = false) {
  $('#spots').innerHTML = spots.map(p => {
    const w = p.label.length * 11.5 + 34;
    const ly = p.below ? 34 : -58;
    return `<g class="hs" data-spot="${p.key}" tabindex="0" role="button" aria-label="${esc(p.label)}" transform="translate(${p.x} ${p.y})">
      <circle class="hit" r="48"/><circle class="ring" r="15"/><circle class="dot" r="10"/>
      ${noLabel ? '' : `<g class="lbl" transform="translate(${-w / 2} ${ly})"><rect width="${w}" height="38" rx="19"/><text x="${w / 2}" y="26" text-anchor="middle">${esc(p.label)}</text></g>`}
    </g>`;
  }).join('');
}
function bindSpots(fn) {
  $$('[data-spot]').forEach(el => {
    el.addEventListener('click', () => fn(el.dataset.spot));
    el.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fn(el.dataset.spot); } });
  });
}

/* ─── EVENTOS GLOBALES ───────────────────────────────────────────────────── */
function share() {
  const n = ORDER.filter(id => runsOf(id).length).length;
  const text = `He completado ${n}/${ORDER.length} escenarios de primeros auxilios en AuxilioSim (preparación ${readiness()}%).`;
  if (navigator.share) navigator.share({ title: 'Certificado AuxilioSim', text, url: location.href }).catch(() => {});
  else navigator.clipboard?.writeText(text).then(() => toast('Certificado copiado al portapapeles'), () => toast(text));
}
function gesturesModal() {
  openModal(`<h3>Gestos del simulador</h3><p>Funcionan con el dedo en pantallas táctiles y con el ratón o teclado en escritorio.</p>
    <div class="gest-list">${Object.values(GESTURES).map(g => `<div class="gest-item">${icon(g.icon)}<div><b>${g.title}</b><small>${g.desc} · Ratón: ${g.mouse.toLowerCase()}</small></div></div>`).join('')}
    <div class="gest-item">${icon('info')}<div><b>Teclado</b><small>Tab para moverte, Enter para tocar, Espacio sostenido para mantener, ↑ para comprimir, Esc para salir</small></div></div></div>
    <button class="btn btn-red btn-block" data-modal-close>Entendido</button>`);
}

document.addEventListener('click', e => {
  const t = e.target.closest('button, [data-go]');
  if (!t) return;
  const d = t.dataset;
  if (d.tab) { if (!simEl().hidden) hideSim(); go(d.tab); }
  else if (d.go) go(d.go);
  else if (d.start) startSim(d.start);
  else if (d.startsim) startSim(d.startsim);
  else if (d.resume !== undefined) { openSim(); goScene(sim.i); }
  else if (d.guide) { guideTab = d.guide; go('guia'); }
  else if (d.gestures !== undefined) gesturesModal();
  else if (d.modalClose !== undefined) closeModal();
  else if (d.share !== undefined) share();
  else if (d.reset !== undefined) openModal(`<h3>¿Reiniciar el progreso?</h3><p>Se borrarán el historial, las puntuaciones y las métricas guardadas en este dispositivo.</p>
      <div class="actions-row" style="margin-top:20px;justify-content:flex-end"><button class="btn btn-ghost" data-modal-close>Cancelar</button><button class="btn btn-red" data-confirm-reset>Sí, reiniciar</button></div>`);
  else if (d.confirmReset !== undefined) { db.history = []; save(); closeModal(); go(tab); toast('Progreso reiniciado'); }
  else if (d.close !== undefined) closeSim();
  else if (d.back !== undefined) sim.i === 0 ? closeSim() : goScene(sim.i - 1);
  else if (d.next !== undefined && !t.disabled) goScene(Math.min(sim.i + 1, sim.sc.scenes.length - 1));
  else if (d.restart !== undefined) startSim(sim.sc.id);
});
document.addEventListener('change', e => {
  const k = e.target.dataset.setting;
  if (!k) return;
  db.settings[k] = e.target.checked; save();
  if (k === 'voice') syncVoice();
  if (k === 'stress' && tab === 'escenarios') go('escenarios');
  toast({ voice: 'Instrucciones por voz', stress: 'Límite de tiempo (15 s)', haptic: 'Vibración háptica' }[k] + (e.target.checked ? ' activado' : ' desactivado'));
});
$('#modal').addEventListener('click', e => { if (e.target.id === 'modal') closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape' && !$('#modal').hidden) closeModal(); });

function syncVoice() {
  const b = $('#voice-btn'), on = db.settings.voice;
  b.setAttribute('aria-pressed', on);
  b.innerHTML = icon(on ? 'volume' : 'mute');
  b.title = on ? 'Voz activada' : 'Voz desactivada';
  $$('[data-setting="voice"]').forEach(i => i.checked = on);
  if (!on && 'speechSynthesis' in window) speechSynthesis.cancel();
}
$('#voice-btn').addEventListener('click', () => {
  db.settings.voice = !db.settings.voice; save(); syncVoice();
  toast(db.settings.voice ? 'Narrador por voz activado' : 'Narrador por voz desactivado');
});
function syncOnline() { $$('.online').forEach(o => { o.textContent = navigator.onLine ? 'ONLINE' : 'OFFLINE'; o.classList.toggle('off', !navigator.onLine); }); }
addEventListener('online', syncOnline);
addEventListener('offline', syncOnline);

/* ─── INICIO ─────────────────────────────────────────────────────────────── */
buildNav();
syncVoice();
syncOnline();
$$('.brand-mark').forEach(m => m.innerHTML = icon('plus'));
$('#avatar').innerHTML = icon('user');
go(location.hash.slice(1) || 'escenarios');
const q = new URLSearchParams(location.search).get('scenario');
if (q) {
  const id = SCENARIOS[q] ? q : ORDER[+q - 1];
  const n = +new URLSearchParams(location.search).get('scene') || 0; // ?scenario=quemadura&scene=3 abre una escena concreta (demos)
  if (id) { startSim(id); if (n > 0 && n < SCENARIOS[id].scenes.length) { sim.t0 = Date.now(); goScene(n); } }
}
if ('serviceWorker' in navigator && location.protocol.startsWith('http')) navigator.serviceWorker.register('sw.js').catch(() => {});
})();
