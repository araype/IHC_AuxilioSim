/* ═══════════════════════════════════════════════════════════════════════════
   AuxilioSim — Escenarios narrativos
   Cada escenario sigue el arco del prototipo: Planteamiento → Desarrollo →
   Clímax → Resolución. Una escena define su acto (0-3), su ilustración
   (función ART), el subtítulo de la guía por voz y la interacción que exige.

   Tipos de escena: intro · tutorial · explore · choice · hold · drag · swipe · summary
   ═══════════════════════════════════════════════════════════════════════════ */

const ACTS = [
  { name: 'Planteamiento', cap: 'Conoce los controles' },
  { name: 'Desarrollo',    cap: 'Explora el entorno' },
  { name: 'Clímax',        cap: 'Actúa ante la emergencia' },
  { name: 'Resolución',    cap: 'Estabiliza y revisa' },
];

const GESTURES = {
  tap:   { icon: 'hand',   title: 'Toca',               desc: 'Toca un objeto con punto dorado o elige una acción', mouse: 'Clic' },
  hold:  { icon: 'hold',   title: 'Mantén pulsado',     desc: 'Presiona sin soltar para acciones continuas',       mouse: 'Clic sostenido' },
  drag:  { icon: 'move',   title: 'Arrastra',           desc: 'Lleva un objeto hasta la zona marcada',             mouse: 'Arrastrar' },
  swipe: { icon: 'swipe',  title: 'Desliza hacia arriba', desc: 'Gesto rápido y firme, de abajo hacia arriba',      mouse: 'Arrastrar hacia arriba' },
};

/* ─── ILUSTRACIÓN · piezas reutilizables ─────────────────────────────────── */
const VIEW = '0 0 1200 520';
// Paleta cálida del prototipo (PDF): se parece a una casa real
const THEMES = {
  warm:  { w1: '#f3e9d3', w2: '#e8dbbf', f1: '#b8956a', f2: '#8e6d47', edge: '#cda981' },
  alert: { w1: '#f1c7ae', w2: '#efe0c4', f1: '#b58c63', f2: '#936743', edge: '#c9a07a' },
  cool:  { w1: '#e6f0ef', w2: '#d4e5e3', f1: '#b8956a', f2: '#8e6d47', edge: '#cda981' },
  rest:  { w1: '#efe7d8', w2: '#e3d7c2', f1: '#b8956a', f2: '#8e6d47', edge: '#cda981' },
};
const P = { body: '#978473', head: '#a8978a', arm: '#8b7867', skin: '#c29f86', dark: '#6f5f52' };

// Pared + suelo que se extienden más allá del viewBox (overflow visible) para
// llenar el escenario a cualquier proporción de pantalla.
function room(theme, h = 380) {
  const t = THEMES[theme] || THEMES.warm;
  return `<defs>
    <linearGradient id="gWall" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="${h}"><stop offset="0" stop-color="${t.w1}"/><stop offset="1" stop-color="${t.w2}"/></linearGradient>
    <linearGradient id="gFloor" gradientUnits="userSpaceOnUse" x1="0" y1="${h}" x2="0" y2="${h + 380}"><stop offset="0" stop-color="${t.f1}"/><stop offset="1" stop-color="${t.f2}"/></linearGradient>
    <linearGradient id="gSteel" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8f98a5"/><stop offset="1" stop-color="#58616d"/></linearGradient>
    <radialGradient id="gHeat"><stop offset="0" stop-color="#e2553a" stop-opacity=".7"/><stop offset="1" stop-color="#e2553a" stop-opacity="0"/></radialGradient>
    <pattern id="pCloth" width="16" height="16" patternUnits="userSpaceOnUse" patternTransform="rotate(40)"><rect width="16" height="16" fill="#fbf6ee"/><rect width="7" height="16" fill="#eadfcb"/></pattern>
    <pattern id="pGauze" width="12" height="12" patternUnits="userSpaceOnUse"><rect width="12" height="12" fill="#fdfdfb"/><path d="M0 6h12M6 0v12" stroke="#e6e6df" stroke-width="1.5"/></pattern>
  </defs>
  <rect x="-4000" y="-4000" width="9200" height="${4000 + h}" fill="url(#gWall)"/>
  <rect x="-4000" y="${h}" width="9200" height="6" fill="${t.edge}"/>
  <rect x="-4000" y="${h + 6}" width="9200" height="4000" fill="url(#gFloor)"/>`;
}

// Persona estilizada (como en el prototipo): cabeza + torso redondeado + brazos.
function person(x, base, pose = 'stand', o = {}) {
  const top = base - 170, sh = top + 24;
  const A = {
    stand: [`M${x - 34} ${sh} L${x - 46} ${sh + 68}`],
    cook:  [`M${x - 34} ${sh} L${x - 72} ${sh - 36}`],
    reach: [`M${x - 34} ${sh + 4} L${x - 112} ${sh + 2}`],
    hurt:  [`M${x - 34} ${sh + 4} Q${x - 72} ${sh - 8} ${x - 14} ${sh - 6}`],
    choke: [`M${x - 30} ${sh + 8} Q${x - 52} ${sh - 22} ${x - 10} ${sh - 36}`, `M${x + 30} ${sh + 8} Q${x + 52} ${sh - 22} ${x + 10} ${sh - 36}`],
    sink:  [`M${x + 30} ${sh + 6} L${x + 222} ${sh + 24}`],
    offer: [`M${x - 34} ${sh + 10} L${x - 118} ${sh + 38}`],
    eat:   [`M${x + 34} ${sh + 6} L${x + 78} ${sh + 46}`],
    chop:  [`M${x + 34} ${sh + 6} L${x + 74} ${sh + 46}`, `M${x - 34} ${sh + 6} L${x - 58} ${sh + 48}`],
    raise: [`M${x - 30} ${sh} L${x - 56} ${sh - 104}`],
    relax: [`M${x - 34} ${sh + 4} Q${x - 50} ${sh + 46} ${x - 26} ${sh + 74}`],
  }[pose];
  const body = o.dark ? P.dark : P.body, head = o.dark ? '#7d6d60' : P.head, arm = o.dark ? '#5f5146' : P.arm;
  return `<g class="person">
    <rect x="${x - 44}" y="${top}" width="88" height="132" rx="40" fill="${body}"/>
    <circle cx="${x}" cy="${top - 30}" r="27" fill="${head}"/>
    ${A.map(d => `<path d="${d}" stroke="${arm}" stroke-width="20" stroke-linecap="round" fill="none"/>`).join('')}
  </g>`;
}

const star = (cx, cy, r) =>
  `<path class="throb" d="M${cx} ${cy - r} L${cx + r * .28} ${cy - r * .28} L${cx + r} ${cy} L${cx + r * .28} ${cy + r * .28} L${cx} ${cy + r} L${cx - r * .28} ${cy + r * .28} L${cx - r} ${cy} L${cx - r * .28} ${cy - r * .28} Z" fill="#dc2626"/>`;

function stove(potOn = true) {
  return `<rect x="140" y="200" width="270" height="180" fill="url(#gSteel)"/>
    <rect x="140" y="200" width="270" height="16" fill="#aab2bd"/>
    <circle cx="205" cy="232" r="21" fill="#2d2a27"/><circle cx="335" cy="232" r="21" fill="#2d2a27"/>
    <rect x="160" y="290" width="230" height="8" rx="4" fill="#4d555f" opacity=".5"/>
    ${potOn ? `<rect x="268" y="148" width="20" height="9" rx="4" fill="#58616d"/><rect x="382" y="148" width="20" height="9" rx="4" fill="#58616d"/>
    <path d="M285 154 h100 v24 a50 22 0 0 1 -100 0 z" fill="#8a93a6"/>
    <ellipse cx="335" cy="154" rx="58" ry="9" fill="#a3abbb"/>` : ''}`;
}
function sinkUnit(x = 790) {
  return `<rect x="${x}" y="250" width="320" height="130" rx="18" fill="#dccaa5"/>
    <rect x="${x + 40}" y="262" width="160" height="56" rx="10" fill="#8c95a6"/>
    <rect x="${x + 46}" y="268" width="148" height="44" rx="8" fill="#7f889a"/>
    <path d="M${x + 170} 262 V200 a22 22 0 0 1 44 0 v10" stroke="#8c95a6" stroke-width="12" stroke-linecap="round" fill="none"/>`;
}
const cloth = (x, y, r = -10, w = 90, h = 52) =>
  `<g transform="translate(${x} ${y}) rotate(${r})"><rect width="${w}" height="${h}" rx="7" fill="url(#pCloth)" stroke="#cdbfa8" stroke-width="2" stroke-dasharray="5 4"/></g>`;

function diningRoom() {
  return `<rect x="140" y="70" width="230" height="170" rx="10" fill="#dde9ec" stroke="#cbb994" stroke-width="12"/>
    <path d="M255 70 V240 M140 155 H370" stroke="#cbb994" stroke-width="8"/>
    <rect x="960" y="250" width="150" height="130" rx="14" fill="#dccaa5"/>
    <rect x="1010" y="232" width="46" height="18" rx="5" fill="#3b3530"/>`;
}
function diningTable() {
  return `<rect x="380" y="270" width="440" height="18" rx="6" fill="#8d5d3e"/>
    <rect x="402" y="288" width="16" height="92" fill="#7a4f34"/><rect x="782" y="288" width="16" height="92" fill="#7a4f34"/>
    <ellipse cx="520" cy="266" rx="46" ry="9" fill="#f4efe6" stroke="#d8cfc0" stroke-width="2"/>
    <ellipse cx="680" cy="266" rx="46" ry="9" fill="#f4efe6" stroke="#d8cfc0" stroke-width="2"/>
    <circle cx="668" cy="259" r="8" fill="#9b5a3c"/><circle cx="688" cy="258" r="7" fill="#9b5a3c"/>
    <rect x="752" y="228" width="26" height="42" rx="4" fill="#cfe6ee" stroke="#a9c7d2" stroke-width="2"/>`;
}
function counter() {
  return `<rect x="900" y="92" width="240" height="8" rx="3" fill="#c7b28a"/>
    <g transform="translate(962 30)"><rect x="46" y="-10" width="40" height="14" rx="5" fill="none" stroke="#b91c1c" stroke-width="5"/>
      <rect width="130" height="62" rx="10" fill="#dc2626"/><rect x="56" y="12" width="18" height="38" rx="3" fill="#fff"/><rect x="46" y="22" width="38" height="18" rx="3" fill="#fff"/></g>`;
}
function counterFront() {
  return `<rect x="272" y="280" width="616" height="100" fill="#dccaa5"/>
    <path d="M580 290 V372" stroke="#cbb68f" stroke-width="3"/>
    <rect x="260" y="262" width="640" height="18" rx="4" fill="#c7b28a"/>
    <rect x="470" y="248" width="210" height="14" rx="5" fill="#c89a62"/>
    <circle cx="500" cy="244" r="7" fill="#e0833a"/><circle cx="518" cy="244" r="7" fill="#e0833a"/><circle cx="536" cy="244" r="7" fill="#e0833a"/>
    <path d="M600 244 L684 238 L684 248 L600 250 Z" fill="#c3cad3"/><rect x="684" y="239" width="44" height="10" rx="4" fill="#3b3530"/>`;
}
function bigVictim(extra = '') {
  return `<g opacity=".55"><circle cx="700" cy="74" r="46" fill="#6f5f52"/><rect x="620" y="126" width="160" height="300" rx="72" fill="#6f5f52"/></g>
    <g id="victim">
      <circle cx="600" cy="96" r="50" fill="${P.head}"/>
      <rect x="516" y="156" width="168" height="280" rx="76" fill="${P.body}"/>
      <path d="M530 190 L500 380 M670 190 L700 380" stroke="${P.arm}" stroke-width="34" stroke-linecap="round"/>
      <circle cx="600" cy="342" r="6" fill="#6d5c4f"/>
      <circle id="obj" cx="600" cy="120" r="10" fill="#8a5a3c"/>
    </g>
    <g id="fist"><path d="M492 250 Q540 300 588 306 M708 250 Q660 300 612 306" stroke="#5f5146" stroke-width="26" stroke-linecap="round" fill="none"/>
      <circle cx="600" cy="306" r="24" fill="#54473d"/></g>${extra}`;
}
function bigArm(extra = '') {
  return `<rect x="40" y="176" width="150" height="150" rx="22" fill="#6e8fb0"/>
    <rect x="150" y="192" width="700" height="118" rx="59" fill="#c9a68c"/>
    <ellipse cx="870" cy="251" rx="84" ry="70" fill="#c29f86"/>
    <rect x="900" y="196" width="100" height="26" rx="13" fill="#c29f86"/><rect x="920" y="228" width="98" height="26" rx="13" fill="#c29f86"/>
    <rect x="916" y="260" width="92" height="26" rx="13" fill="#c29f86"/><rect x="896" y="290" width="80" height="24" rx="12" fill="#c29f86"/>
    <g id="bleed"><ellipse cx="470" cy="262" rx="26" ry="10" fill="#b3261e" opacity=".55"/><circle cx="440" cy="280" r="6" fill="#b3261e"/><circle cx="505" cy="276" r="5" fill="#b3261e"/></g>
    <path d="M428 254 L516 240" stroke="#9e1f18" stroke-width="8" stroke-linecap="round"/>${extra}`;
}
const dropTarget = (x, y, r = 76) => `<g id="drop-target"><circle class="dt" cx="${x}" cy="${y}" r="${r}"/></g>`;

const ART = {
  /* Quemadura */
  kitchen: () => room('warm') + stove() + sinkUnit() + cloth(800, 214) + person(560, 380, 'cook'),
  accident: () => room('alert') + `<circle class="pulse" cx="335" cy="190" r="170" fill="url(#gHeat)"/>` + stove() + sinkUnit() + cloth(800, 214) +
    person(540, 380, 'reach') + `<circle cx="428" cy="236" r="16" fill="#e0553a" class="throb"/>` + star(412, 214, 22),
  sink: () => room('cool') + `<rect x="520" y="240" width="360" height="140" rx="18" fill="#dccaa5"/>
      <rect x="560" y="252" width="240" height="70" rx="12" fill="#8c95a6"/><rect x="566" y="258" width="228" height="58" rx="10" fill="#7f889a"/>
      <path d="M650 252 V186 a24 24 0 0 1 48 0 v14" stroke="#8c95a6" stroke-width="13" stroke-linecap="round" fill="none"/>` +
    cloth(810, 196, 8, 70, 42) + person(470, 380, 'sink') +
    `<circle cx="692" cy="258" r="15" fill="${P.skin}"/><circle id="burn" cx="688" cy="256" r="9" fill="#d9573f"/>
     <g id="water"><path class="stream" d="M698 206 V318" stroke="#8ccfdc" stroke-width="11" stroke-linecap="round"/><ellipse cx="698" cy="318" rx="46" ry="7" fill="#a9dde6" opacity=".8"/></g>`,
  cover: () => room('rest', 330) + `<rect x="700" y="250" width="300" height="80" rx="14" fill="#dccaa5"/>` + person(620, 400, 'offer') +
    `<circle cx="500" cy="292" r="16" fill="${P.skin}"/><circle id="burn2" cx="524" cy="286" r="12" fill="#d9573f" opacity=".6"/>` +
    dropTarget(510, 288) + `<g id="cloth-on">${cloth(470, 266, -8, 80, 50)}</g>`,

  /* Atragantamiento */
  dining: () => room('warm') + diningRoom() + person(600, 360, 'eat') + diningTable(),
  choke: () => room('alert') + diningRoom() + diningTable() + person(600, 380, 'choke') +
    `<circle class="ripple" cx="600" cy="204" r="34"/><circle class="ripple d2" cx="600" cy="204" r="34"/>
     <text x="660" y="140" font-size="54" font-weight="800" fill="#dc2626" font-family="Inter, sans-serif">!</text>`,
  position: () => room('cool', 470) + bigVictim(),
  thrust: () => room('cool', 470) + bigVictim(`<g id="jarrow"><path d="M660 380 Q606 380 604 336 L604 236" stroke="#dc2626" stroke-width="8" stroke-dasharray="14 10" fill="none" stroke-linecap="round"/>
      <path d="M586 244 L604 212 L622 244 Z" fill="#dc2626"/></g>`),
  recover: () => room('rest') + diningRoom() + person(600, 360, 'relax') + diningTable() + person(880, 380, 'stand', { dark: true }) +
    `<circle cx="664" cy="140" r="22" fill="#16a34a"/><path d="M653 140 l8 8 l14 -16" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`,

  /* Corte */
  counter: () => room('warm') + counter() + person(560, 380, 'chop') + counterFront(),
  cut: () => room('alert') + counter() + person(560, 380, 'hurt') + counterFront() +
    `<circle class="pulse" cx="548" cy="222" r="60" fill="url(#gHeat)"/><circle cx="548" cy="222" r="12" fill="#b3261e" class="throb"/>
     <circle cx="590" cy="256" r="4" fill="#b3261e"/><circle cx="604" cy="258" r="3" fill="#b3261e"/>`,
  arm: () => room('cool', 470) + bigArm(dropTarget(472, 252, 92) +
    `<g id="gauze-on"><rect x="404" y="206" width="136" height="92" rx="10" fill="url(#pGauze)" stroke="#dcdcd4" stroke-width="2"/></g>`),
  press: () => room('cool', 470) + bigArm(`<g id="gauze-on" style="opacity:1"><rect x="404" y="206" width="136" height="92" rx="10" fill="url(#pGauze)" stroke="#dcdcd4" stroke-width="2"/>
      <ellipse id="blot" cx="472" cy="252" rx="34" ry="18" fill="#c0392b"/></g>
      <g id="hands"><ellipse cx="450" cy="226" rx="64" ry="34" fill="#5b8fd6" stroke="#4a78b8" stroke-width="3"/><ellipse cx="500" cy="240" rx="60" ry="32" fill="#6a9be0" stroke="#4a78b8" stroke-width="3"/></g>`),
  elevate: () => room('rest') + person(600, 380, 'raise') +
    `<rect x="534" y="142" width="30" height="42" rx="8" fill="#fbfbf8" stroke="#dcdcd4" stroke-width="2" transform="rotate(-14 549 163)"/>
     <path d="M600 262 c-10 -14 -30 -4 -18 12 l18 16 l18 -16 c12 -16 -8 -26 -18 -12z" fill="#dc2626"/>
     <path d="M430 262 H780" stroke="#8b7d6c" stroke-width="3" stroke-dasharray="10 8"/>
     <text x="790" y="268" font-size="20" font-weight="700" fill="#6d6154" font-family="Inter, sans-serif">nivel del corazón</text>`,
};

/* ─── ESCENARIOS ─────────────────────────────────────────────────────────── */
const SCENARIOS = {
  quemadura: {
    id: 'quemadura', num: '01', title: 'Quemadura en la cocina', short: 'Quemadura',
    level: 'Nivel 1 • Urgencia Media', tone: 'amber', icon: 'flame', img: 'img/quemadura-agua.jpg',
    objective: 'Enfriamiento térmico con agua corriente',
    desc: 'Evaluación rápida de quemadura de 1er grado en antebrazo. Regulación del grifo para enfriamiento continuo sin dañar la dermis.',
    introTitle: 'Primeros auxilios<br>ante una quemadura',
    introText: 'Practica, en un entorno seguro y guiado, los pasos ante una quemadura doméstica: enfriar, no usar remedios caseros y cubrir.',
    duration: '~2 min', gestures: ['tap', 'hold', 'drag'],
    key: { label: 'Bajo el agua', unit: 's', target: 10, note: 'objetivo 10 s ≈ 20 min reales' },
    checklist: [
      { id: 'tutorial', text: 'Tutorial de gestos completado' },
      { id: 'first', text: 'Eligió enfriar con agua, sin remedios caseros' },
      { id: 'cool', text: 'Enfrió la quemadura bajo el agua de forma continua' },
      { id: 'cover', text: 'Cubrió la quemadura con un paño limpio, sin apretar' },
    ],
    tip: 'Retira anillos, pulseras o reloj de la zona <em>antes</em> de que se inflame: después pueden cortar la circulación. Si la quemadura es mayor que la palma de la mano, afecta cara, manos o genitales, o tiene ampollas grandes, busca atención médica.',
    scenes: [
      { type: 'intro', act: 0, name: 'Menú', cta: 'Iniciar tutorial' },
      { type: 'tutorial', act: 0, name: 'Tutorial', cta: 'Entrar a la cocina',
        text: '"Toca los objetos para examinarlos, mantén pulsado para acciones continuas y arrastra para colocar objetos."' },
      { type: 'explore', act: 1, name: 'Cocina', art: 'kitchen', label: 'Escena', cta: 'Siguiente',
        text: 'Un familiar cocina junto a la estufa. Los objetos interactuables se resaltan con un punto dorado: tócalos para conocerlos.',
        spots: [
          { id: 'olla', label: 'Olla', x: 335, y: 146, info: 'Olla con agua hirviendo. Su asa metálica puede superar los 60 °C: suficiente para quemar la piel en un segundo.' },
          { id: 'grifo', label: 'Grifo', x: 1004, y: 196, info: 'Grifo de agua fría. Será tu herramienta principal: agua corriente y fresca, ni helada ni caliente.' },
          { id: 'pano', label: 'Paño', x: 846, y: 238, below: true, info: 'Paño de cocina limpio. Servirá para cubrir la quemadura sin apretar una vez enfriada.' },
        ] },
      { type: 'choice', act: 2, name: 'Accidente', art: 'accident', theme: 'alert', timed: true, check: 'first', cta: 'Ir al agua',
        text: '"¡Se quemó la mano con la olla! Rápido: ¿qué haces primero?"',
        options: [
          { id: 'agua', label: 'Enfriar con agua corriente', correct: true, fb: '"Bien. El agua corriente detiene el daño en la piel y alivia el dolor. Vamos al grifo."' },
          { id: 'hielo', label: 'Poner hielo', fb: '"El hielo contrae los vasos sanguíneos y puede dañar aún más la piel. Usa agua corriente, no helada."' },
          { id: 'pasta', label: 'Untar pasta dental', fb: '"Es un mito: la pasta dental no enfría y puede infectar la herida."' },
          { id: 'grasa', label: 'Aplicar mantequilla o aceite', fb: '"Las grasas retienen el calor y empeoran la quemadura."' },
        ] },
      { type: 'hold', act: 2, name: 'Grifo', art: 'sink', theme: 'cool', check: 'cool', cta: 'Cubrir la quemadura', ctaTone: 'teal',
        text: '"Abre el grifo y mantén la mano bajo el agua hasta que el indicador se complete."',
        target: 10, unit: 'bajo el agua', state: 'water', holdLabel: 'Mantén pulsado para dejar la mano bajo el agua',
        note: '10 s aquí equivalen a 15–20 min en la vida real',
        release: '"¡No retires la mano todavía! El enfriamiento debe ser continuo."',
        done: '"Muy bien. En la vida real mantén el agua corriendo de 15 a 20 minutos."' },
      { type: 'drag', act: 3, name: 'Cubrir', art: 'cover', theme: 'rest', check: 'cover', state: 'covered', cta: 'Ver resumen', ctaTone: 'green',
        text: '"Ahora cubre la quemadura con un paño limpio, sin apretar. Arrástralo hasta la mano."',
        items: [
          { id: 'pano', label: 'Paño limpio', sw: 'url', correct: true, fb: '"¡Bien hecho! Cubrir protege la herida de roces e infecciones."' },
          { id: 'algodon', label: 'Algodón', sw: '#f4f1ea', fb: '"El algodón suelta fibras que se pegan a la herida. Usa un paño o gasa limpia."' },
          { id: 'venda', label: 'Vendaje apretado', sw: '#e9dcc6', fb: '"Apretar puede cortar la circulación cuando la zona se hinche. Cubre sin presionar."' },
        ] },
      { type: 'summary', act: 3, name: 'Resumen' },
    ],
  },

  heimlich: {
    id: 'heimlich', num: '02', title: 'Atragantamiento en el comedor', short: 'Atragantamiento',
    level: 'Nivel 2 • Urgencia Alta', tone: 'red', icon: 'choke', img: 'img/heimlich-asfixia.jpg',
    objective: 'Desobstrucción con Maniobra de Heimlich',
    desc: 'Reconocimiento del signo universal de asfixia. Posicionamiento postural guiado y aplicación de compresiones abdominales ascendentes.',
    introTitle: 'Primeros auxilios<br>ante un atragantamiento',
    introText: 'Reconoce el signo universal de asfixia y practica la maniobra de Heimlich: posición, punto de apoyo y compresiones en “J”.',
    duration: '~2 min', gestures: ['tap', 'swipe'],
    key: { label: 'Fuerza media', unit: 'N', target: '85–100', note: 'rango óptimo 85–100 N' },
    checklist: [
      { id: 'tutorial', text: 'Tutorial de gestos completado' },
      { id: 'first', text: 'Reconoció el atragantamiento y actuó sin esperar' },
      { id: 'position', text: 'Colocó el puño dos dedos sobre el ombligo' },
      { id: 'thrusts', text: 'Aplicó 5 compresiones abdominales válidas' },
      { id: 'after', text: 'Recomendó revisión médica tras la maniobra' },
    ],
    tip: 'Si la persona tose con fuerza, anímala a seguir tosiendo. Si la tos no es eficaz, el protocolo ERC alterna <em>5 golpes en la espalda</em> y <em>5 compresiones abdominales</em>. En bebés, embarazadas u obesidad la técnica cambia: consulta la Guía.',
    scenes: [
      { type: 'intro', act: 0, name: 'Menú', cta: 'Iniciar tutorial' },
      { type: 'tutorial', act: 0, name: 'Tutorial', cta: 'Entrar al comedor',
        text: '"Toca para examinar y elegir. Para las compresiones, desliza rápido y firme de abajo hacia arriba."' },
      { type: 'explore', act: 1, name: 'Comedor', art: 'dining', label: 'Escena', cta: 'Siguiente',
        text: 'La familia almuerza en el comedor. Toca los objetos con punto dorado para conocer los riesgos y recursos.',
        spots: [
          { id: 'plato', label: 'Plato', x: 678, y: 250, info: 'Carne en trozos grandes: una de las causas más frecuentes de atragantamiento en adultos.' },
          { id: 'vaso', label: 'Vaso de agua', x: 765, y: 222, info: 'Beber agua NO ayuda si la vía aérea está bloqueada: puede empeorar la asfixia.' },
          { id: 'telefono', label: 'Teléfono', x: 1033, y: 226, info: 'Si la maniobra no funciona o la persona pierde el conocimiento, llama al número de emergencias de tu país.' },
        ] },
      { type: 'choice', act: 2, name: 'Signo universal', art: 'choke', theme: 'alert', timed: true, check: 'first', cta: 'Colocarse detrás',
        text: '"¡Se lleva las manos al cuello y no puede hablar! ¿Qué haces?"',
        options: [
          { id: 'preguntar', label: 'Preguntar: «¿Te estás atragantando?»', correct: true, fb: '"Asiente, pero no puede hablar ni toser con fuerza: la obstrucción es grave. Actúa ya."' },
          { id: 'agua', label: 'Darle agua', fb: '"El agua no pasa si la vía está obstruida y puede empeorar la asfixia."' },
          { id: 'dedos', label: 'Buscar el objeto con los dedos', fb: '"Barrer la boca a ciegas puede empujar el objeto más adentro."' },
          { id: 'esperar', label: 'Esperar a que se le pase', fb: '"Sin aire, cada segundo cuenta. No esperes."' },
        ] },
      { type: 'choice', act: 2, name: 'Posición', art: 'position', theme: 'cool', check: 'position', state: 'fist', cta: 'Aplicar compresiones',
        text: '"La tos no es eficaz. Colócate detrás e inclínala hacia adelante. ¿Dónde colocas el puño?"',
        options: [
          { id: 'abdomen', label: 'Dos dedos sobre el ombligo', spot: { x: 600, y: 306 }, correct: true, fb: '"Correcto: puño con el pulgar hacia dentro, dos dedos sobre el ombligo; la otra mano lo sujeta."' },
          { id: 'pecho', label: 'Sobre el esternón', spot: { x: 600, y: 222 }, fb: '"Ahí podrías lesionar las costillas. El puño va en el abdomen, sobre el ombligo."' },
          { id: 'cuello', label: 'En el cuello', spot: { x: 600, y: 160 }, fb: '"Nunca presiones el cuello. Busca el punto dos dedos por encima del ombligo."' },
        ] },
      { type: 'swipe', act: 2, name: 'Compresiones', art: 'thrust', theme: 'cool', check: 'thrusts', state: 'fist', reps: 5, cta: 'Después de la maniobra', ctaTone: 'green',
        text: '"Desliza hacia arriba con fuerza: hacia dentro y hacia arriba, en forma de J. Necesitas 5 compresiones válidas."',
        done: '"¡El objeto salió! Vuelve a respirar."' },
      { type: 'choice', act: 3, name: 'Recuperación', art: 'recover', theme: 'rest', check: 'after', cta: 'Ver resumen', ctaTone: 'green',
        text: '"Ya respira y puede hablar. ¿Qué haces ahora?"',
        options: [
          { id: 'medico', label: 'Recomendar revisión médica', correct: true, fb: '"Correcto. Las compresiones abdominales pueden causar lesiones internas: siempre debe revisarla un profesional."' },
          { id: 'comer', label: 'Que siga comiendo', fb: '"Primero debe recuperarse y ser evaluada: la maniobra puede dejar lesiones."' },
          { id: 'nada', label: 'Nada, ya pasó', fb: '"Aunque se sienta bien, necesita una revisión médica tras la maniobra."' },
        ] },
      { type: 'summary', act: 3, name: 'Resumen' },
    ],
  },

  corte: {
    id: 'corte', num: '03', title: 'Corte y hemorragia menor', short: 'Corte',
    level: 'Nivel 1 • Urgencia Leve', tone: 'blue', icon: 'plus', img: 'img/botiquin-corte.jpg',
    objective: 'Presión directa y elevación de extremidad',
    desc: 'Manejo aséptico de herida incisa. Selección de gasas del botiquín, presión directa hemostática y elevación controlada.',
    introTitle: 'Primeros auxilios<br>ante un corte con sangrado',
    introText: 'Protégete, elige el material correcto del botiquín y controla el sangrado con presión directa y elevación.',
    duration: '~2 min', gestures: ['tap', 'drag', 'hold'],
    key: { label: 'Presión continua', unit: 's', target: 8, note: 'objetivo 8 s ≈ 10 min reales' },
    checklist: [
      { id: 'tutorial', text: 'Tutorial de gestos completado' },
      { id: 'first', text: 'Se protegió con guantes antes de tocar la herida' },
      { id: 'gauze', text: 'Eligió gasa estéril del botiquín' },
      { id: 'pressure', text: 'Mantuvo presión directa continua' },
      { id: 'elevate', text: 'Elevó el brazo y vendó sin apretar' },
    ],
    tip: 'Si la gasa se empapa, <em>no la retires</em>: coloca otra encima y sigue presionando. Busca atención médica si el sangrado no cede en 10–15 minutos, si la herida es profunda o está sucia, o si hace años que no te vacunas contra el tétanos.',
    scenes: [
      { type: 'intro', act: 0, name: 'Menú', cta: 'Iniciar tutorial' },
      { type: 'tutorial', act: 0, name: 'Tutorial', cta: 'Entrar a la cocina',
        text: '"Toca para elegir, arrastra el material hasta la herida y mantén pulsado para presionar."' },
      { type: 'explore', act: 1, name: 'Encimera', art: 'counter', label: 'Escena', cta: 'Siguiente',
        text: 'Un familiar corta verduras en la encimera. Toca los objetos con punto dorado para conocerlos.',
        spots: [
          { id: 'tabla', label: 'Tabla', x: 500, y: 236, info: 'Tabla de cortar. Mantén los dedos flexionados (en «garra») al cortar para protegerlos.' },
          { id: 'cuchillo', label: 'Cuchillo', x: 706, y: 230, info: 'Cuchillo afilado: los cortes en dedos y antebrazo son los más comunes al cocinar.' },
          { id: 'botiquin', label: 'Botiquín', x: 1027, y: 60, below: true, info: 'Botiquín: guantes, gasas estériles, vendas y esparadrapo. Conoce dónde está antes de necesitarlo.' },
        ] },
      { type: 'choice', act: 2, name: 'Corte', art: 'cut', theme: 'alert', timed: true, check: 'first', cta: 'Colocar la gasa',
        text: '"¡Se cortó el antebrazo y sangra! ¿Qué haces primero?"',
        options: [
          { id: 'guantes', label: 'Ponerme guantes y abrir el botiquín', correct: true, fb: '"Bien: protegerte evita infecciones para ambos. Ahora, el material."' },
          { id: 'alcohol', label: 'Echar alcohol en la herida', fb: '"El alcohol daña el tejido y no detiene el sangrado."' },
          { id: 'torniquete', label: 'Hacer un torniquete', fb: '"El torniquete es solo para hemorragias masivas que no ceden. Aquí basta presión directa."' },
          { id: 'sangrar', label: 'Dejar que sangre para limpiar', fb: '"Perder sangre no limpia la herida. Controla el sangrado cuanto antes."' },
        ] },
      { type: 'drag', act: 2, name: 'Gasa', art: 'arm', theme: 'cool', check: 'gauze', state: 'gauze', cta: 'Presionar', ctaTone: 'teal',
        text: '"Arrastra el material correcto del botiquín sobre la herida."',
        items: [
          { id: 'gasa', label: 'Gasa estéril', sw: '#fdfdfb', correct: true, fb: '"Correcto. La gasa estéril absorbe la sangre y favorece el coágulo."' },
          { id: 'algodon', label: 'Algodón', sw: '#f4f1ea', fb: '"El algodón deja fibras dentro de la herida. Usa gasa estéril."' },
          { id: 'papel', label: 'Papel de cocina', sw: '#efe9dc', fb: '"El papel se deshace y deja restos en la herida."' },
        ] },
      { type: 'hold', act: 2, name: 'Presión', art: 'press', theme: 'cool', check: 'pressure', cta: 'Elevar el brazo', ctaTone: 'teal', red: true,
        text: '"Presiona firme y de forma continua sobre la gasa hasta que el indicador se complete."',
        target: 8, unit: 'de presión', state: 'pressing', holdLabel: 'Mantén pulsado para presionar la gasa',
        note: '8 s aquí equivalen a unos 10 min reales',
        release: '"¡Mantén la presión! Si la sueltas, el coágulo se rompe."',
        done: '"El sangrado se ha detenido. No retires la gasa."' },
      { type: 'choice', act: 3, name: 'Elevación', art: 'elevate', theme: 'rest', check: 'elevate', cta: 'Ver resumen', ctaTone: 'green',
        text: '"El sangrado cedió. ¿Cuál es el siguiente paso?"',
        options: [
          { id: 'elevar', label: 'Elevar el brazo y vendar sin apretar', correct: true, fb: '"Correcto. Elevar por encima del corazón reduce el flujo; la venda mantiene la gasa en su sitio."' },
          { id: 'quitar', label: 'Quitar la gasa para revisar', fb: '"Retirarla arranca el coágulo. Si se empapa, añade otra encima."' },
          { id: 'apretar', label: 'Vendar muy apretado', fb: '"Un vendaje muy apretado corta la circulación."' },
        ] },
      { type: 'summary', act: 3, name: 'Resumen' },
    ],
  },
};
const ORDER = ['quemadura', 'heimlich', 'corte'];

/* ─── GUÍA (contenido de consulta) ───────────────────────────────────────── */
const GUIDE = {
  quemadura: {
    alert: { tone: 'amber', title: 'Regla de oro', text: 'Nunca uses hielo, pasta dental, mantequilla ni remedios caseros: aumentan el daño y el riesgo de infección.' },
    caption: 'Agua fresca corriente 15–20 min — nunca hielo',
    steps: [
      ['Aleja la fuente de calor', 'Aparta a la persona del origen del accidente. Retira ropa suelta, anillos y pulseras cerca de la zona antes de que se inflame.'],
      ['Agua fresca corriente 15–20 minutos', 'Deja correr agua fresca (no helada) sobre la quemadura de forma continua.'],
      ['Cubre sin apretar', 'Usa un paño limpio o gasa estéril, sin presionar. No revientes las ampollas.'],
      ['Evalúa la gravedad', 'Si es mayor que la palma de la mano, profunda, o afecta cara, manos o genitales, llama a emergencias.'],
    ],
    myths: [['Hielo directo', 'Causa vasoconstricción y más daño en el tejido.'], ['Pasta dental', 'No enfría y puede introducir bacterias.'], ['Mantequilla o aceite', 'Atrapa el calor y favorece la infección.'], ['Vinagre o limón', 'Su acidez irrita y lesiona la piel.']],
  },
  heimlich: {
    alert: { tone: 'red', title: 'Signo universal de asfixia', text: 'La persona se lleva las manos al cuello y no puede hablar ni toser con fuerza. Actúa en los primeros segundos.' },
    caption: 'Manos en el cuello: actúa de inmediato',
    steps: [
      ['Confirma el atragantamiento', 'Pregunta «¿Te estás atragantando?». Si tose con fuerza, anímala a seguir tosiendo.'],
      ['5 golpes en la espalda', 'Si la tos no es eficaz, inclínala hacia adelante y da 5 golpes secos entre los omóplatos con el talón de la mano.'],
      ['5 compresiones abdominales', 'Desde detrás, puño dos dedos sobre el ombligo, la otra mano encima; tira hacia dentro y hacia arriba (en «J»).'],
      ['Alterna y pide ayuda', 'Alterna 5 golpes y 5 compresiones. Si pierde el conocimiento, llama a emergencias e inicia RCP.'],
      ['Bebés menores de 1 año', 'No uses compresiones abdominales: 5 golpes en la espalda y 5 compresiones torácicas con dos dedos.'],
    ],
    myths: [['Dar agua', 'No desobstruye y puede empeorar la asfixia.'], ['Barrido a ciegas', 'Meter los dedos puede empujar el objeto más adentro.'], ['Esperar', 'Sin aire, el daño cerebral empieza en minutos.']],
  },
  corte: {
    alert: { tone: 'green', title: 'Presión directa', text: 'Es el método más eficaz: mantén la presión continua al menos 10 minutos sin retirar la gasa.' },
    caption: 'Gasa estéril + presión directa — nunca retires la primera gasa',
    steps: [
      ['Protégete', 'Lávate las manos o ponte guantes antes de tocar la herida.'],
      ['Presión directa con gasa', 'Coloca una gasa estéril y presiona firme durante 10–15 minutos sin levantarla.'],
      ['Eleva la extremidad', 'Si es posible, eleva el brazo por encima del nivel del corazón.'],
      ['Venda sin apretar', 'Cuando ceda, fija la gasa con una venda que no corte la circulación.'],
      ['Busca atención médica', 'Si no cede en 15 min, es profunda, está sucia o se ve tejido o hueso.'],
    ],
    myths: [['Alcohol en la herida', 'Daña el tejido y duele sin detener el sangrado.'], ['Algodón', 'Deja fibras dentro de la herida.'], ['Torniquete de entrada', 'Solo para hemorragias masivas que no ceden.']],
  },
};
