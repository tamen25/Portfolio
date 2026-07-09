// TESSERACT — real projection math: R⁴ → R³ → R² with a dimension dial.
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const cv = document.getElementById('stage'), ctx = cv.getContext('2d');
const DPR = Math.min(devicePixelRatio, 2);
let S = 0;
function resize() {
  const r = cv.getBoundingClientRect();
  S = Math.round(r.width * DPR);
  cv.width = cv.height = S;
}
addEventListener('resize', resize); resize();

/* 16 vertices of the tesseract: every ±1 combination in 4D */
const VERTS = [];
for (let i = 0; i < 16; i++)
  VERTS.push([i & 1 ? 1 : -1, i & 2 ? 1 : -1, i & 4 ? 1 : -1, i & 8 ? 1 : -1]);
/* 32 edges: pairs differing in exactly one coordinate */
const EDGES = [];
for (let a = 0; a < 16; a++)
  for (let b = a + 1; b < 16; b++) {
    const diff = a ^ b;
    if ((diff & (diff - 1)) === 0) EDGES.push([a, b]);
  }

/* dimension dial: z and w coordinates fade in as d passes 3 and 4 */
const dimEl = document.getElementById('dim');
const dValue = document.getElementById('dValue');
const dName = document.getElementById('dName');
const rXW = document.getElementById('rXW'), rYZ = document.getElementById('rYZ'), rXY = document.getElementById('rXY');

let aXW = .4, aYZ = .2, aXY = 0;
let dragging = false, px = 0, py = 0;
cv.addEventListener('pointerdown', e => { dragging = true; px = e.clientX; py = e.clientY; cv.setPointerCapture(e.pointerId); });
addEventListener('pointermove', e => {
  if (!dragging) return;
  aXY += (e.clientX - px) * .006;
  aYZ += (e.clientY - py) * .006;
  px = e.clientX; py = e.clientY;
});
addEventListener('pointerup', () => dragging = false);

function rot(v, i, j, a) {
  const c = Math.cos(a), s = Math.sin(a);
  const vi = v[i], vj = v[j];
  v[i] = vi * c - vj * s;
  v[j] = vi * s + vj * c;
}

function frame(now) {
  requestAnimationFrame(frame);
  if (document.hidden) return;
  const d = +dimEl.value / 100;                 // 2.00 … 4.00
  const zAmt = Math.min(1, Math.max(0, d - 2)); // z fades in over 2→3
  const wAmt = Math.min(1, Math.max(0, d - 3)); // w fades in over 3→4
  dValue.textContent = d.toFixed(2);
  dName.textContent = d < 2.5 ? 'square' : d < 3.02 ? 'cube' : d < 3.98 ? 'unfolding…' : 'tesseract';
  document.getElementById('rowSq').classList.toggle('active', d < 2.5);
  document.getElementById('rowCu').classList.toggle('active', d >= 2.5 && d < 3.5);
  document.getElementById('rowTe').classList.toggle('active', d >= 3.5);

  if (!reduced) {
    if (rXW.checked) aXW += .006;
    if (rYZ.checked) aYZ += .004;
    if (rXY.checked) aXY += .003;
  }

  ctx.clearRect(0, 0, S, S);
  const pts = VERTS.map(v0 => {
    const v = [v0[0], v0[1], v0[2] * zAmt, v0[3] * wAmt];
    rot(v, 0, 3, aXW);           // X–W double-rotation half
    rot(v, 1, 2, aYZ);           // Y–Z half
    rot(v, 0, 1, aXY);           // screen-plane spin
    // 4D → 3D perspective (camera at w = 3)
    const pw = 1 / (3.4 - v[3] * .9);
    const x3 = v[0] * pw * 3, y3 = v[1] * pw * 3, z3 = v[2] * pw * 3;
    // 3D → 2D perspective (camera at z = 4.2)
    const pz = 1 / (4.2 - z3 * 1.1);
    return {
      x: S / 2 + x3 * pz * S * .66,
      y: S / 2 + y3 * pz * S * .66,
      depth: (v[3] + 1) / 2,      // w-depth colors the two "cubes"
      near: pz
    };
  });

  // edges: ultramarine when they connect into the 4th dimension, ink otherwise
  EDGES.forEach(([a, b]) => {
    const A = pts[a], B = pts[b];
    const isW = (a ^ b) === 8;
    const wMix = (A.depth + B.depth) / 2;
    ctx.strokeStyle = isW
      ? `rgba(43,71,255,${.25 + wAmt * .65})`
      : `rgba(21,19,15,${.9 - wMix * .55})`;
    ctx.lineWidth = (isW ? 1.1 : 1.5) * DPR * (0.7 + (A.near + B.near) * .9);
    if (isW && wAmt < .02) return;             // w-edges don't exist below 4D
    ctx.beginPath(); ctx.moveTo(A.x, A.y); ctx.lineTo(B.x, B.y); ctx.stroke();
  });
  // vertices
  pts.forEach((p, i) => {
    const inW = VERTS[i][3] > 0;
    if (inW && wAmt < .02) { if (i & 8) return; }
    ctx.fillStyle = inW ? '#2B47FF' : '#15130F';
    ctx.beginPath();
    ctx.arc(p.x, p.y, (inW ? 2.6 : 3) * DPR * (0.6 + p.near), 0, 7);
    ctx.fill();
  });
}
dimEl.addEventListener('input', () => {});
requestAnimationFrame(frame);
