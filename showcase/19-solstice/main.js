// SOLSTICE — drag the sun; the page relights. The sun never sets here.
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const R = document.documentElement.style;
const sunGrp = document.getElementById('sunGrp');
const sunGlow = document.getElementById('sunGlow');
const sunEl = document.getElementById('sun');
const scene = document.getElementById('arcScene');
const ccTime = document.getElementById('ccTime');
const ccNote = document.getElementById('ccNote');
const ccAlt = document.getElementById('ccAlt');

/* arc: quadratic bezier P0(60,560) C(600,-60) P1(1140,560) */
const P0 = [60, 500], C = [600, -60], P1 = [1140, 500];
const bez = u => [
  (1-u)*(1-u)*P0[0] + 2*(1-u)*u*C[0] + u*u*P1[0],
  (1-u)*(1-u)*P0[1] + 2*(1-u)*u*C[1] + u*u*P1[1]
];

const lerp = (a, b, t) => a + (b - a) * t;
const hexLerp = (h1, h2, t) => {
  const p = h => [parseInt(h.slice(1,3),16), parseInt(h.slice(3,5),16), parseInt(h.slice(5,7),16)];
  const [r1,g1,b1] = p(h1), [r2,g2,b2] = p(h2);
  return `rgb(${Math.round(lerp(r1,r2,t))},${Math.round(lerp(g1,g2,t))},${Math.round(lerp(b1,b2,t))})`;
};

const NOTES = [
  [0,  'the midnight sun — lowest, largest, most photographed'],
  [2,  'the fjord choir hour; sound carries for miles'],
  [4,  'the ceremonial non-sunrise'],
  [7,  'morning by consensus, not by evidence'],
  [11, 'high noon — the fjord is showing off'],
  [15, 'the long afternoon (it is all long afternoon)'],
  [19, 'golden hour begins its six-hour shift'],
  [22, 'the sun starts its shallow descent toward not-setting'],
  [23.9,'the midnight sun — lowest, largest, most photographed'],
];

let t = 12, drifting = !reduced;
/* shareable time links: ?t=0.6 loads 00:36, ?t=23 loads 23:00 */
const qp = new URLSearchParams(location.search);
if (qp.has('t')) { const v = parseFloat(qp.get('t')); if (!isNaN(v)) { t = Math.min(24, Math.max(0, v)); drifting = false; } }

function relight() {
  const u = t / 24;
  const alt = 1 - Math.abs(u - .5) * 2;        // 0 at midnight ends, 1 at noon
  const h = u - .5;                            // -0.5 … 0.5 across the sky
  // sun position
  const [sx, sy] = bez(u);
  sunGrp.setAttribute('transform', `translate(${sx} ${sy})`);
  sunGrp.setAttribute('aria-valuenow', t.toFixed(1));
  // palette
  const warm = 1 - Math.min(1, alt * 1.6);     // how "midnight golden" we are
  R.setProperty('--sky-top', hexLerp('#7FB8E8', '#2E3E68', warm));
  R.setProperty('--sky-hor', hexLerp('#DCEBF5', '#F2A65E', warm));
  R.setProperty('--page',    hexLerp('#F7F4EE', '#F2E3CD', warm));
  R.setProperty('--acc',     hexLerp('#C97B2D', '#B4471F', warm));
  R.setProperty('--ridge-far',  hexLerp('#8FA6C4', '#6B5876', warm));
  R.setProperty('--ridge-near', hexLerp('#5E7191', '#3A3450', warm));
  sunEl.setAttribute('fill', hexLerp('#FFF3D6', '#FF7A2F', warm));
  sunGlow.setAttribute('r', 64 + warm * 46);
  // shadows: direction from sun's horizontal position, length from altitude
  const shx = -h * 46;
  const shy = 6 + (1 - alt) * 14;
  const blur = 18 + (1 - alt) * 26;
  const shAlpha = .12 + (1 - alt) * .12;
  R.setProperty('--sh-x', shx.toFixed(1) + 'px');
  R.setProperty('--sh-y', shy.toFixed(1) + 'px');
  R.setProperty('--sh-blur', blur.toFixed(0) + 'px');
  R.setProperty('--sh-col', `rgba(40,28,14,${shAlpha.toFixed(3)})`);
  // clock card
  const hh = Math.floor(t), mm = Math.round((t - hh) * 60);
  ccTime.textContent = `${String(hh % 24).padStart(2,'0')}:${String(mm % 60).padStart(2,'0')}`;
  let note = NOTES[0][1];
  for (const [nt, txt] of NOTES) if (t >= nt) note = txt;
  ccNote.textContent = note;
  ccAlt.textContent = `SUN ALTITUDE ${(4 + alt * 40).toFixed(0)}°`;
}

/* ---------- drag the sun ---------- */
let dragging = false;
function setFromClientX(clientX) {
  const r = scene.getBoundingClientRect();
  // map through the viewBox (1200 wide, slice-fitted)
  const scale = Math.max(r.width / 1200, r.height / 640);
  const offX = (r.width - 1200 * scale) / 2;
  const vx = (clientX - r.left - offX) / scale;
  t = Math.min(24, Math.max(0, (vx - 60) / 1080 * 24));
  relight();
}
sunGrp.addEventListener('pointerdown', e => {
  dragging = true; drifting = false;
  sunGrp.setPointerCapture(e.pointerId);
  e.preventDefault();
});
scene.addEventListener('pointerdown', e => {
  if (e.target === sunGrp || sunGrp.contains(e.target)) return;
  dragging = true; drifting = false;
  setFromClientX(e.clientX);
});
addEventListener('pointermove', e => { if (dragging) setFromClientX(e.clientX); });
addEventListener('pointerup', () => dragging = false);
sunGrp.addEventListener('keydown', e => {
  if (e.key === 'ArrowLeft')  { t = Math.max(0, t - .5); drifting = false; relight(); e.preventDefault(); }
  if (e.key === 'ArrowRight') { t = Math.min(24, t + .5); drifting = false; relight(); e.preventDefault(); }
});

/* gentle drift until the visitor takes over */
let last = performance.now();
(function loop(now) {
  requestAnimationFrame(loop);
  if (document.hidden) return;
  const dt = now - last; last = now;
  if (drifting && !reduced) {
    t = (t + dt / 4000) % 24;
    relight();
  }
})(performance.now());
relight();
