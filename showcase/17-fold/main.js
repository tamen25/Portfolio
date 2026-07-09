// FOLD — a sheet that folds itself. Four hinges, one slider.
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const range = document.getElementById('foldRange');
const fTL = document.getElementById('fTL');
const fBR = document.getElementById('fBR');
const wL = document.getElementById('wL');
const wR = document.getElementById('wR');
const sheet = document.getElementById('sheet');
const shadow = document.getElementById('shadow');
const flWord = document.getElementById('flWord');
const flStep = document.getElementById('flStep');

const WORDS = ['FLAT SHEET', 'THE DIAGONAL', 'THE QUARTER', 'THE BEAK', 'IT STANDS'];

// t: 0..400 → four sequential folds of 0..100 each
function apply(t) {
  const s1 = Math.min(1, t / 100);              // TL flap folds over the diagonal
  const s2 = Math.min(1, Math.max(0, (t - 100) / 100)); // BR corner folds up to quarter
  const s3 = Math.min(1, Math.max(0, (t - 200) / 100)); // left wing lifts
  const s4 = Math.min(1, Math.max(0, (t - 300) / 100)); // right wing lifts

  // Fold 1: top-left triangle rotates 180° over the ↗ diagonal (axis 1,1,0)
  fTL.style.transform = `rotate3d(1, 1, 0, ${s1 * -180}deg)`;
  // Fold 2: bottom-right half folds along the anti-diagonal toward the center
  fBR.style.transform = `rotate3d(1, -1, 0, ${s2 * -178}deg)`;
  // Fold 3: a small beak tuck, hinged on its own short crease — stays inside the model
  wL.style.opacity = s2 > .95 ? 1 : 0;
  wL.style.transform = `rotate3d(1, 1, 0, ${s3 * -165}deg)`;
  // Fold 4: the model stands up on the table
  const lift = s4;
  sheet.style.transform =
    `rotateX(${56 - lift * 34}deg) rotateZ(${-42 + lift * 26}deg) translateZ(${lift * 26}px) translateY(${lift * -6}%)`;
  shadow.style.transform = `scale(${1 - lift * .32})`;
  shadow.style.opacity = 1 - lift * .35;

  const step = t >= 380 ? 4 : t >= 300 ? 3 : t >= 200 ? 2 : t >= 100 ? 1 : t > 8 ? 1 : 0;
  const word = t < 8 ? 0 : t < 100 ? 1 : t < 200 ? 2 : t < 300 ? 3 : 4;
  flWord.textContent = WORDS[word];
  flStep.textContent = `STEP ${Math.min(4, Math.ceil(t / 100))} / 4`.replace('STEP 0', 'STEP 0');
  if (t === 0) flStep.textContent = 'STEP 0 / 4';
}
range.addEventListener('input', () => apply(+range.value));
apply(0);

/* auto-fold */
let anim = null;
function animateTo(target) {
  cancelAnimationFrame(anim);
  if (reduced) { range.value = target; apply(target); return; }
  const t0 = performance.now(), from = +range.value, dur = Math.abs(target - from) * 6;
  (function tick(now) {
    const p = Math.min(1, (now - t0) / Math.max(1, dur));
    const ease = p < .5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
    const v = from + (target - from) * ease;
    range.value = v; apply(v);
    if (p < 1) anim = requestAnimationFrame(tick);
  })(t0);
}
document.getElementById('btnFold').addEventListener('click', () => animateTo(400));
document.getElementById('btnFlat').addEventListener('click', () => animateTo(0));
