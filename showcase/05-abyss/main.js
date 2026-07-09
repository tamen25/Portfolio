// ABYSS — scroll is depth. Canvas does the ocean; the data is real.
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const MAX_DEPTH = 10935;
const SCALE = 1.7;                       // px per meter
const canvas = document.getElementById('sea');
const ctx = canvas.getContext('2d');
let W = 0, H = 0, surfaceH = innerHeight;

/* ---------- creature line art (inline SVG, glow strokes) ---------- */
const GLOW = `<defs><filter id="g" x="-60%" y="-60%" width="220%" height="220%">
  <feGaussianBlur stdDeviation="2.6" result="b"/>
  <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>`;
const CREATURES = {
  squid: `<svg viewBox="0 0 300 150" xmlns="http://www.w3.org/2000/svg">${GLOW}
    <g filter="url(#g)" fill="none" stroke="#5FF2D2" stroke-width="1.6" stroke-linecap="round">
      <path d="M20 75 L95 52 Q112 75 95 98 Z"/>
      <path d="M95 60 Q120 40 118 62 M95 90 Q120 110 118 88"/>
      <circle cx="108" cy="75" r="7"/>
      <path d="M118 68 Q150 58 172 64 M118 72 Q152 66 174 72 M118 78 Q152 84 174 78 M118 82 Q150 92 172 86"/>
      <path d="M120 64 Q190 30 268 42 M120 86 Q190 120 268 108"/>
      <circle cx="272" cy="42" r="3" fill="#5FF2D2"/>
      <circle cx="272" cy="108" r="3" fill="#5FF2D2"/>
    </g></svg>`,
  angler: `<svg viewBox="0 0 300 170" xmlns="http://www.w3.org/2000/svg">${GLOW}
    <g filter="url(#g)" fill="none" stroke="#FF9ECF" stroke-width="1.6" stroke-linecap="round">
      <path d="M60 95 Q95 40 170 52 Q235 62 250 95 Q235 128 170 132 Q95 140 60 95 Z"/>
      <path d="M60 95 L92 82 M60 95 L94 108"/>
      <path d="M74 88 L84 96 L74 104 M96 84 L106 94 L96 102 M120 82 L130 92 L120 100"/>
      <circle cx="180" cy="80" r="8"/>
      <path d="M250 95 L282 74 L282 116 Z"/>
      <path d="M150 52 Q120 8 170 18"/>
    </g>
    <circle cx="174" cy="18" r="7" fill="#FFD27E" filter="url(#g)"/>
    <circle cx="174" cy="18" r="14" fill="none" stroke="#FFD27E" stroke-width=".8" opacity=".5" filter="url(#g)"/>
  </svg>`,
  dumbo: `<svg viewBox="0 0 300 170" xmlns="http://www.w3.org/2000/svg">${GLOW}
    <g filter="url(#g)" fill="none" stroke="#5FF2D2" stroke-width="1.6" stroke-linecap="round">
      <path d="M95 90 Q95 30 150 30 Q205 30 205 90 Q205 116 150 116 Q95 116 95 90 Z"/>
      <path d="M108 46 Q80 26 84 54 Q88 70 106 62 M192 46 Q220 26 216 54 Q212 70 194 62"/>
      <circle cx="132" cy="74" r="5"/><circle cx="168" cy="74" r="5"/>
      <path d="M116 112 Q108 148 132 150 M140 116 Q136 152 158 152 M164 116 Q168 150 186 146 M184 110 Q196 138 208 132"/>
    </g></svg>`,
  snailfish: `<svg viewBox="0 0 300 130" xmlns="http://www.w3.org/2000/svg">${GLOW}
    <g filter="url(#g)" fill="none" stroke="#EAF4F2" stroke-width="1.5" stroke-linecap="round" opacity=".9">
      <path d="M40 65 Q80 22 140 30 Q210 40 268 62 Q210 88 140 96 Q80 104 40 65 Z"/>
      <path d="M92 42 Q120 12 150 34" opacity=".55"/>
      <path d="M96 88 Q124 116 154 92" opacity=".55"/>
      <circle cx="76" cy="58" r="5"/>
      <path d="M52 65 Q60 60 68 64" opacity=".7"/>
    </g></svg>`
};
document.querySelectorAll('.cfig').forEach(f => { f.innerHTML = CREATURES[f.dataset.creature] || ''; });

/* ---------- layout: place milestones at true depths ---------- */
const miles = [...document.querySelectorAll('.mile')];
function layout() {
  surfaceH = innerHeight;
  miles.forEach(m => {
    m.style.top = (surfaceH + (+m.dataset.depth) * SCALE) + 'px';
  });
  document.getElementById('descent').style.height =
    (surfaceH + MAX_DEPTH * SCALE + innerHeight * .9) + 'px';
}
layout();
addEventListener('resize', () => { layout(); resizeCanvas(); });

/* reveal */
const io = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) e.target.classList.add('seen');
}), {threshold: .25});
miles.forEach(m => io.observe(m));

/* ---------- HUD ---------- */
const hDepth = document.getElementById('hDepth'),
      hPress = document.getElementById('hPress'),
      hTemp  = document.getElementById('hTemp'),
      hLight = document.getElementById('hLight'),
      hZone  = document.getElementById('hZone');
const ZONES = [
  [0, 'SURFACE'], [1, 'EPIPELAGIC · SUNLIGHT'], [200, 'MESOPELAGIC · TWILIGHT'],
  [1000, 'BATHYPELAGIC · MIDNIGHT'], [4000, 'ABYSSAL'], [6000, 'HADAL'], [10900, 'CHALLENGER DEEP']
];
const lerp = (a, b, t) => a + (b - a) * t;
function tempAt(d) {
  if (d < 200)  return lerp(22, 12, d / 200);
  if (d < 1000) return lerp(12, 4, (d - 200) / 800);
  if (d < 4000) return lerp(4, 2, (d - 1000) / 3000);
  return lerp(2, 1.2, Math.min(1, (d - 4000) / 6935));
}
let depth = 0;
function updateHUD() {
  depth = Math.max(0, Math.min(MAX_DEPTH, (scrollY + innerHeight * .5 - surfaceH) / SCALE));
  hDepth.textContent = Math.round(depth).toLocaleString('en-US') + ' m';
  hPress.textContent = (depth / 10 + 1).toFixed(depth < 100 ? 1 : 0) + ' atm';
  hTemp.textContent = tempAt(depth).toFixed(1) + '°C';
  const L = 100 * Math.exp(-depth / 55);
  hLight.textContent = depth >= 1000 ? 'NONE · BIOLUM' : (L >= 1 ? L.toFixed(0) + '%' : L.toFixed(3) + '%');
  let z = ZONES[0][1];
  for (const [d, name] of ZONES) if (depth >= d) z = name;
  hZone.textContent = z;
}
addEventListener('scroll', updateHUD, {passive: true});

/* ---------- ocean canvas ---------- */
function resizeCanvas() {
  W = canvas.width = innerWidth * Math.min(devicePixelRatio, 2);
  H = canvas.height = innerHeight * Math.min(devicePixelRatio, 2);
}
resizeCanvas();

/* color stops per depth */
const STOPS = [
  [0,     [111, 185, 205], [46, 122, 147]],
  [200,   [20, 69, 92],    [10, 42, 60]],
  [1000,  [4, 18, 30],     [2, 10, 18]],
  [4000,  [1, 5, 8],       [0, 2, 4]],
  [10935, [0, 1, 2],       [0, 0, 0]]
];
function bgAt(d) {
  let i = 0;
  while (i < STOPS.length - 2 && d > STOPS[i + 1][0]) i++;
  const [d0, t0, b0] = STOPS[i], [d1, t1, b1] = STOPS[i + 1];
  const t = Math.min(1, Math.max(0, (d - d0) / (d1 - d0)));
  const mix = (a, b) => a.map((v, k) => Math.round(lerp(v, b[k], t)));
  return [mix(t0, t1), mix(b0, b1)];
}

/* particles */
const SNOW_N = 180;
const snow = Array.from({length: SNOW_N}, () => ({
  x: Math.random(), y: Math.random(),
  r: .6 + Math.random() * 1.8,
  v: .00012 + Math.random() * .00035,
  a: .15 + Math.random() * .5
}));
const plank = Array.from({length: 46}, () => ({
  x: Math.random(), y: Math.random(),
  hue: Math.random() < .7 ? '#5FF2D2' : '#FF9ECF',
  ph: Math.random() * Math.PI * 2,
  sp: .4 + Math.random() * 1.2
}));
const flares = [];
function dropFlare() {
  flares.push({x: .5 + (Math.random() - .5) * .3, y: .25, vy: .00018, life: 1});
}
document.getElementById('flareBtn').addEventListener('click', dropFlare);
addEventListener('keydown', e => { if (e.key.toLowerCase() === 'f') dropFlare(); });

let lastScroll = scrollY, t0 = performance.now();
function frame(now) {
  requestAnimationFrame(frame);
  if (document.hidden) return;
  const dt = Math.min(50, now - t0); t0 = now;
  const dScroll = scrollY - lastScroll; lastScroll = scrollY;

  const [top, bot] = bgAt(depth);
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, `rgb(${top})`); g.addColorStop(1, `rgb(${bot})`);
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);

  /* flares light the water */
  for (let i = flares.length - 1; i >= 0; i--) {
    const f = flares[i];
    f.y += f.vy * dt - (dScroll / (H)) ;      // sinks, parallax with scroll
    f.life -= dt / 8000;
    if (f.life <= 0 || f.y > 1.4 || f.y < -0.4) { flares.splice(i, 1); continue; }
    const fx = f.x * W, fy = f.y * H;
    const R = W * .34 * f.life;
    const lg = ctx.createRadialGradient(fx, fy, 0, fx, fy, R);
    lg.addColorStop(0, `rgba(255,214,140,${.5 * f.life})`);
    lg.addColorStop(.25, `rgba(255,190,110,${.22 * f.life})`);
    lg.addColorStop(1, 'rgba(255,180,90,0)');
    ctx.fillStyle = lg; ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = `rgba(255,230,170,${f.life})`;
    ctx.beginPath(); ctx.arc(fx, fy, 3.4 * Math.min(devicePixelRatio,2), 0, 7); ctx.fill();
  }

  /* marine snow — denser in the deep, parallax against scroll */
  const density = depth < 150 ? .35 : depth < 1000 ? 1 : .8;
  ctx.fillStyle = '#DCEDEA';
  snow.forEach((p, i) => {
    if (i > SNOW_N * density) return;
    if (!reduced) p.y += p.v * dt;
    p.y -= dScroll / (H * 6);
    if (p.y > 1.05) p.y = -.05; if (p.y < -.1) p.y = 1.05;
    ctx.globalAlpha = p.a * (depth > 60 ? 1 : .5);
    ctx.beginPath();
    ctx.arc(p.x * W, p.y * H, p.r * Math.min(devicePixelRatio,2) * .8, 0, 7);
    ctx.fill();
  });
  ctx.globalAlpha = 1;

  /* bioluminescent plankton below the twilight */
  if (depth > 600) {
    const vis = Math.min(1, (depth - 600) / 500);
    plank.forEach(p => {
      const tw = (Math.sin(now / (700 / p.sp) + p.ph) + 1) / 2;
      if (!reduced) { p.x += Math.sin(now / 4000 + p.ph) * .00004; }
      p.y -= dScroll / (H * 4);
      if (p.y > 1.05) p.y = -.05; if (p.y < -.05) p.y = 1.05;
      const a = tw * .8 * vis;
      if (a < .04) return;
      ctx.save();
      ctx.shadowColor = p.hue; ctx.shadowBlur = 14 * tw * Math.min(devicePixelRatio,2);
      ctx.fillStyle = p.hue; ctx.globalAlpha = a;
      ctx.beginPath();
      ctx.arc(p.x * W, p.y * H, 1.6 * Math.min(devicePixelRatio,2), 0, 7);
      ctx.fill();
      ctx.restore();
    });
    ctx.globalAlpha = 1;
  }
}
updateHUD();
requestAnimationFrame(frame);
