// MYCELIUM — the network grows as you read, and colonizes what you've seen.
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const cv = document.getElementById('net'), ctx = cv.getContext('2d');
const DPR = Math.min(devicePixelRatio, 2);
let W, H;

/* trail buffer: we never clear — hyphae accumulate like ink in soil */
let trail;
function resize() {
  W = cv.width = innerWidth * DPR;
  H = cv.height = innerHeight * DPR;
  // redraw everything from history after resize
  ctx.lineCap = 'round';
  redrawAll();
}

/* ---------- walkers ---------- */
/* Each walker: position in DOCUMENT space (x, docY), heading, energy.
   Painted in viewport space each frame: y = docY - scrollY. */
const segments = [];      // permanent history: {x1,y1,x2,y2,w,glow} in doc space
const walkers = [];
const nodes = [];         // branch points that pulse
function spawnWalker(x, docY, heading, energy, target) {
  walkers.push({x, y: docY, h: heading, e: energy, target, w: 1 + Math.random() * 1.2});
}
/* seed: several roots at the top of the document */
for (let i = 0; i < 7; i++)
  spawnWalker(innerWidth * (0.12 + Math.random() * 0.76), -10,
              Math.PI / 2 + (Math.random() - .5) * .6, 220 + Math.random() * 200);

/* growth budget follows reading depth */
function budget() { return scrollY + innerHeight * 1.15; }

function step(wk) {
  const STEP = 3.2;
  if (wk.target) {
    const dx = wk.target.x - wk.x, dy = wk.target.y - wk.y;
    const want = Math.atan2(dy, dx);
    let d = want - wk.h;
    while (d > Math.PI) d -= Math.PI * 2;
    while (d < -Math.PI) d += Math.PI * 2;
    wk.h += d * .14 + (Math.random() - .5) * .18;
    if (Math.hypot(dx, dy) < 10) { wk.target.el.classList.add('lit'); wk.e = 0;
      nodes.push({x: wk.target.x, y: wk.target.y, born: performance.now(), big: true}); }
  } else {
    wk.h += (Math.random() - .5) * .5;
    wk.h += (Math.PI / 2 - wk.h) * .02;               // gravity: prefer downward
  }
  const nx = wk.x + Math.cos(wk.h) * STEP;
  const ny = wk.y + Math.sin(wk.h) * STEP;
  segments.push({x1: wk.x, y1: wk.y, x2: nx, y2: ny, w: wk.w});
  drawSeg(segments[segments.length - 1]);
  wk.x = nx; wk.y = ny; wk.e--;
  if (wk.x < 8 || wk.x > innerWidth - 8) wk.h = Math.PI - wk.h;
  // branching
  if (!wk.target && Math.random() < .024 && walkers.length < 42) {
    if (Math.random() < .3) nodes.push({x: wk.x, y: wk.y, born: performance.now()});
    spawnWalker(wk.x, wk.y, wk.h + (Math.random() < .5 ? .9 : -.9),
                wk.e * (.4 + Math.random() * .3));
    wk.w *= .92;
  }
}

function drawSeg(s) {
  ctx.strokeStyle = 'rgba(233,245,218,.34)';
  ctx.lineWidth = s.w * DPR * .8;
  ctx.beginPath();
  ctx.moveTo(s.x1 * DPR, (s.y1 - scrollY) * DPR);
  ctx.lineTo(s.x2 * DPR, (s.y2 - scrollY) * DPR);
  ctx.stroke();
}
function redrawAll() {
  ctx.clearRect(0, 0, W, H);
  segments.forEach(drawSeg);
}

/* ---------- section colonization ---------- */
const anchors = [...document.querySelectorAll('.anchor')].map(el => {
  const r = el.getBoundingClientRect();
  return {el, x: r.left + r.width / 2, y: r.top + scrollY + r.height / 2, sent: false};
});
function refreshAnchors() {
  anchors.forEach(a => {
    const r = a.el.getBoundingClientRect();
    a.x = r.left + r.width / 2;
    a.y = r.top + scrollY + r.height / 2;
  });
}
addEventListener('resize', () => { refreshAnchors(); resize(); });

const io = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return;
  const a = anchors.find(a => a.el === e.target);
  if (!a || a.sent) return;
  a.sent = true;
  // the nearest grown point sends a thread toward this section
  let best = null, bd = 1e9;
  for (let i = segments.length - 1; i >= 0 && i > segments.length - 400; i--) {
    const s = segments[i];
    const d = Math.hypot(s.x2 - a.x, s.y2 - a.y);
    if (d < bd) { bd = d; best = s; }
  }
  const sx = best ? best.x2 : innerWidth / 2, sy = best ? best.y2 : scrollY - 40;
  spawnWalker(sx, sy, Math.atan2(a.y - sy, a.x - sx), 800, a);
}), {threshold: .4});
anchors.forEach(a => io.observe(a.el));

/* ---------- loop ---------- */
let lastScroll = -1;
(function frame() {
  requestAnimationFrame(frame);
  if (document.hidden) return;
  if (scrollY !== lastScroll) { lastScroll = scrollY; redrawAll(); }
  const bud = budget();
  let work = reduced ? 2 : 6;                        // growth speed per frame
  for (const wk of walkers) {
    if (wk.e <= 0) continue;
    if (!wk.target && wk.y > bud) continue;          // wait for the reader
    for (let i = 0; i < work; i++) if (wk.e-- > 0) step(wk);
  }
  // prune dead walkers
  for (let i = walkers.length - 1; i >= 0; i--) if (walkers[i].e <= 0) walkers.splice(i, 1);
  // node pulses
  const now = performance.now();
  nodes.forEach(n => {
    const age = (now - n.born) / 1000;
    const a = Math.max(0, (n.big ? .8 : .22) - age * (n.big ? .16 : .4));
    if (a <= 0) return;
    const r = (n.big ? 7 : 2.2) + age * (n.big ? 5 : 3);
    ctx.strokeStyle = `rgba(184,233,134,${a})`;
    ctx.lineWidth = DPR;
    ctx.beginPath();
    ctx.arc(n.x * DPR, (n.y - scrollY) * DPR, r * DPR, 0, 7);
    ctx.stroke();
  });
})();
resize();
