// BUREAU BAUHAUS — the printing table
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const stage = document.getElementById('stage');
const COLORS = ['#D53A2F', '#1D5DA8', '#F2B705', '#141311'];
const TYPES = ['circle', 'square', 'bar', 'tri', 'arc', 'dots'];
let shapes = [];
let uid = 0;

/* ---------- hero parallax ---------- */
if (!reduced) {
  const gs = document.querySelectorAll('.hero-geo .g');
  addEventListener('mousemove', e => {
    const nx = e.clientX / innerWidth - .5, ny = e.clientY / innerHeight - .5;
    gs.forEach(g => {
      const p = +g.dataset.px;
      g.style.translate = `${nx * p}px ${ny * p}px`;
    });
  }, {passive: true});
}

/* ---------- shape model ---------- */
function rnd(a, b) { return a + Math.random() * (b - a); }
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

function makeShape(type) {
  return {
    id: ++uid,
    type: type || pick(TYPES),
    x: rnd(.08, .72),          // fraction of stage
    y: rnd(.06, .7),
    s: rnd(.16, .42),          // size as fraction of stage width
    rot: pick([0, 0, 15, 30, 45, -30]),
    ci: Math.floor(Math.random() * COLORS.length)
  };
}

function renderShape(s) {
  let el = stage.querySelector(`[data-id="${s.id}"]`);
  if (!el) {
    el = document.createElement('div');
    el.className = 'shape';
    el.dataset.id = s.id;
    el.tabIndex = 0;
    el.setAttribute('role', 'img');
    stage.appendChild(el);
    wireShape(el, s);
  }
  const W = stage.clientWidth;
  const px = s.s * W;
  el.setAttribute('aria-label', `${s.type} form, draggable`);
  el.style.left = (s.x * 100) + '%';
  el.style.top = (s.y * 100) + '%';
  el.style.transform = `rotate(${s.rot}deg)`;
  const c = COLORS[s.ci];
  el.style.width = px + 'px';
  el.style.height = (s.type === 'bar' ? px * .18 : px) + 'px';
  el.style.background = 'none';
  el.style.border = 'none';
  el.style.borderRadius = '0';
  el.style.clipPath = 'none';
  el.style.backgroundImage = 'none';
  switch (s.type) {
    case 'circle': el.style.background = c; el.style.borderRadius = '50%'; break;
    case 'square': el.style.background = c; break;
    case 'bar':    el.style.background = c; break;
    case 'tri':    el.style.background = c; el.style.clipPath = 'polygon(50% 0,100% 100%,0 100%)'; break;
    case 'arc':
      el.style.border = `${px * .16}px solid ${c}`;
      el.style.borderColor = `${c} transparent transparent ${c}`;
      el.style.borderRadius = '50%';
      break;
    case 'dots':
      el.style.backgroundImage = `radial-gradient(${c} 22%, transparent 26%)`;
      el.style.backgroundSize = `${Math.max(10, px * .18)}px ${Math.max(10, px * .18)}px`;
      break;
  }
}

function renderAll() {
  stage.querySelectorAll('.shape').forEach(el => {
    if (!shapes.find(s => String(s.id) === el.dataset.id)) el.remove();
  });
  shapes.forEach(renderShape);
}

/* ---------- interactions ---------- */
function wireShape(el, s) {
  let sx, sy, ox, oy, moved, dragging = false;
  el.addEventListener('pointerdown', e => {
    dragging = true; moved = 0;
    sx = e.clientX; sy = e.clientY; ox = s.x; oy = s.y;
    el.setPointerCapture(e.pointerId);
    el.style.zIndex = ++uid + 10;
    e.preventDefault();
  });
  el.addEventListener('pointermove', e => {
    if (!dragging) return;
    const r = stage.getBoundingClientRect();
    const dx = (e.clientX - sx), dy = (e.clientY - sy);
    moved = Math.max(moved, Math.abs(dx) + Math.abs(dy));
    s.x = Math.min(1.02, Math.max(-.25, ox + dx / r.width));
    s.y = Math.min(1.05, Math.max(-.2, oy + dy / r.height));
    el.style.left = (s.x * 100) + '%';
    el.style.top = (s.y * 100) + '%';
  });
  el.addEventListener('pointerup', () => {
    dragging = false;
    if (moved < 5) { s.ci = (s.ci + 1) % COLORS.length; renderShape(s); }
  });
  el.addEventListener('dblclick', () => { s.rot = (s.rot + 15) % 360; renderShape(s); });
  el.addEventListener('keydown', e => {
    const step = e.shiftKey ? .05 : .015;
    if (e.key === 'ArrowLeft')  { s.x -= step; renderShape(s); e.preventDefault(); }
    if (e.key === 'ArrowRight') { s.x += step; renderShape(s); e.preventDefault(); }
    if (e.key === 'ArrowUp')    { s.y -= step; renderShape(s); e.preventDefault(); }
    if (e.key === 'ArrowDown')  { s.y += step; renderShape(s); e.preventDefault(); }
    if (e.key.toLowerCase() === 'c') { s.ci = (s.ci + 1) % COLORS.length; renderShape(s); }
    if (e.key.toLowerCase() === 'r') { s.rot = (s.rot + 15) % 360; renderShape(s); }
  });
}

/* ---------- compose / add / download ---------- */
function shuffle() {
  shapes = [];
  const n = 5 + Math.floor(Math.random() * 3);
  for (let i = 0; i < n; i++) {
    const t = TYPES[i % TYPES.length];
    shapes.push(makeShape(t));
  }
  // the primary triad always shows up for work
  shapes[0].ci = 0; shapes[1].ci = 1; shapes[2].ci = 2;
  if (shapes[3]) shapes[3].ci = 3;
  // one anchor: big, primary-colored
  shapes[0].s = rnd(.45, .6); shapes[0].x = rnd(.15, .45); shapes[0].y = rnd(.08, .3);
  renderAll();
}
document.getElementById('btnShuffle').addEventListener('click', shuffle);
document.getElementById('btnAdd').addEventListener('click', () => {
  shapes.push(makeShape()); renderAll();
});

document.getElementById('btnDownload').addEventListener('click', async () => {
  try { await document.fonts.load('900 90px Jost'); } catch (e) {}
  const W = 1200, H = 1800;
  const c = document.createElement('canvas');
  c.width = W; c.height = H;
  const x = c.getContext('2d');
  x.fillStyle = '#F2EFE9'; x.fillRect(0, 0, W, H);
  shapes.forEach(s => {
    const px = s.s * W, cx = s.x * W + px / 2, cy = s.y * H + (s.type === 'bar' ? px * .09 : px / 2);
    x.save();
    x.translate(cx, cy);
    x.rotate(s.rot * Math.PI / 180);
    x.fillStyle = COLORS[s.ci];
    switch (s.type) {
      case 'circle': x.beginPath(); x.arc(0, 0, px / 2, 0, 7); x.fill(); break;
      case 'square': x.fillRect(-px / 2, -px / 2, px, px); break;
      case 'bar':    x.fillRect(-px / 2, -px * .09, px, px * .18); break;
      case 'tri':
        x.beginPath(); x.moveTo(0, -px / 2); x.lineTo(px / 2, px / 2); x.lineTo(-px / 2, px / 2);
        x.closePath(); x.fill(); break;
      case 'arc':
        x.lineWidth = px * .16;
        x.strokeStyle = COLORS[s.ci];
        x.beginPath(); x.arc(0, 0, px / 2 - px * .08, Math.PI * .75, Math.PI * 1.75); x.stroke(); break;
      case 'dots': {
        const g = Math.max(10, px * .18);
        for (let ix = -px / 2; ix < px / 2; ix += g)
          for (let iy = -px / 2; iy < px / 2; iy += g) {
            x.beginPath(); x.arc(ix + g / 2, iy + g / 2, g * .22, 0, 7); x.fill();
          }
        break;
      }
    }
    x.restore();
  });
  x.fillStyle = '#141311';
  x.font = '900 76px Jost, sans-serif';
  x.textBaseline = 'alphabetic';
  x.fillText('BAUHAUS', W * .06, H * .96);
  x.textAlign = 'right';
  x.fillText('100+', W * .94, H * .96);
  const a = document.createElement('a');
  a.download = 'bureau-bauhaus-poster.png';
  a.href = c.toDataURL('image/png');
  a.click();
});

addEventListener('resize', renderAll);
shuffle();
