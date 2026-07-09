// RAINCODE — fogged glass you wipe + rain that keeps writing
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const winEl = document.getElementById('window');
const fogC = document.getElementById('fog');
const rainC = document.getElementById('rain');
const fx = fogC.getContext('2d');
const rx = rainC.getContext('2d');
const DPR = Math.min(devicePixelRatio, 2);
let W, H;

function resize() {
  const r = winEl.getBoundingClientRect();
  W = Math.round(r.width * DPR); H = Math.round(r.height * DPR);
  [fogC, rainC].forEach(c => { c.width = W; c.height = H; });
  paintFog(1);
}
/* ---------- fog layer ---------- */
function paintFog(alpha) {
  fx.globalCompositeOperation = 'source-over';
  const g = fx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, `rgba(159,180,196,${.62 * alpha})`);
  g.addColorStop(.5, `rgba(139,160,178,${.55 * alpha})`);
  g.addColorStop(1, `rgba(120,140,158,${.66 * alpha})`);
  fx.fillStyle = g;
  fx.fillRect(0, 0, W, H);
  // condensation texture
  fx.globalAlpha = .1 * alpha;
  for (let i = 0; i < 240; i++) {
    fx.beginPath();
    fx.arc(Math.random() * W, Math.random() * H, Math.random() * 2.4 * DPR, 0, 7);
    fx.fillStyle = '#DCE9F2';
    fx.fill();
  }
  fx.globalAlpha = 1;
}

/* wipe with cursor */
let wiped = false;
const hint = document.getElementById('winHint');
function wipe(x, y) {
  fx.globalCompositeOperation = 'destination-out';
  const r = 62 * DPR;
  const g = fx.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, 'rgba(0,0,0,.85)');
  g.addColorStop(.7, 'rgba(0,0,0,.4)');
  g.addColorStop(1, 'rgba(0,0,0,0)');
  fx.fillStyle = g;
  fx.beginPath(); fx.arc(x, y, r, 0, 7); fx.fill();
  if (!wiped) { wiped = true; hint.classList.add('gone'); }
}
winEl.addEventListener('pointermove', e => {
  const r = winEl.getBoundingClientRect();
  wipe((e.clientX - r.left) * DPR, (e.clientY - r.top) * DPR);
});
winEl.addEventListener('pointerdown', e => {
  const r = winEl.getBoundingClientRect();
  wipe((e.clientX - r.left) * DPR, (e.clientY - r.top) * DPR);
});

/* fog slowly re-condenses */
setInterval(() => { if (!document.hidden && !reduced) paintFog(.045); }, 300);

/* ---------- rain streaks on the glass ---------- */
const drops = Array.from({length: 90}, () => newDrop(true));
function newDrop(seed) {
  return {
    x: Math.random(),
    y: seed ? Math.random() : -.05,
    len: .04 + Math.random() * .12,
    sp: .0018 + Math.random() * .0042,
    w: (Math.random() < .82 ? .9 : 1.6),
    a: .12 + Math.random() * .3,
    drift: (Math.random() - .5) * .0004
  };
}
let t0 = performance.now();
function frame(now) {
  requestAnimationFrame(frame);
  if (document.hidden) return;
  const dt = Math.min(50, now - t0); t0 = now;
  rx.clearRect(0, 0, W, H);
  rx.lineCap = 'round';
  drops.forEach((d, i) => {
    if (!reduced) { d.y += d.sp * dt * .06; d.x += d.drift * dt * .06; }
    if (d.y - d.len > 1.05) drops[i] = newDrop(false);
    const x = d.x * W, y = d.y * H;
    const grad = rx.createLinearGradient(x, y - d.len * H, x, y);
    grad.addColorStop(0, 'rgba(220,233,242,0)');
    grad.addColorStop(1, `rgba(220,233,242,${d.a})`);
    rx.strokeStyle = grad;
    rx.lineWidth = d.w * DPR;
    rx.beginPath();
    rx.moveTo(x, y - d.len * H);
    rx.lineTo(x, y);
    rx.stroke();
    // bead at the tip
    rx.fillStyle = `rgba(230,242,250,${d.a * 1.4})`;
    rx.beginPath(); rx.arc(x, y, d.w * DPR * .9, 0, 7); rx.fill();
  });
}

/* ---------- clock ---------- */
const feedTime = document.getElementById('feedTime');
setInterval(() => {
  const d = new Date();
  feedTime.textContent = String(d.getHours()).padStart(2, '0') + ':' +
                         String(d.getMinutes()).padStart(2, '0') + ' SPRAWL TIME';
}, 1000);

/* reduced motion: freeze the film, keep one clean wipe */
const vid = document.getElementById('cityVideo');
if (reduced && vid) { vid.pause(); vid.removeAttribute('autoplay'); }

addEventListener('resize', resize);
resize();
requestAnimationFrame(frame);
