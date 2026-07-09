// SLIPSTREAM — the drawing becomes the machine.
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const zone = document.getElementById('morphZone');
const photo = document.getElementById('photo');
const print = document.getElementById('print');
const scan = document.getElementById('scan');
const cap = document.getElementById('morphCap');

/* prepare line-draw: every path gets its dash length */
const lines = [...print.querySelectorAll('.ln')];
lines.forEach(l => {
  const len = l.getTotalLength ? l.getTotalLength() : 0;
  l.style.strokeDasharray = len;
  l.style.strokeDashoffset = reduced ? 0 : len;
});
const dims = [...print.querySelectorAll('.dim, .dtx')];
dims.forEach(d => d.style.opacity = reduced ? 1 : 0);

function update() {
  const r = zone.getBoundingClientRect();
  const total = r.height - innerHeight;
  const p = Math.min(1, Math.max(0, -r.top / total));   // 0..1 through the zone
  // phase 1 (0–.45): lines draw
  const draw = Math.min(1, p / .45);
  lines.forEach((l, i) => {
    const len = +l.style.strokeDasharray || 0;
    const local = Math.min(1, Math.max(0, draw * lines.length - i * .6));
    l.style.strokeDashoffset = reduced ? 0 : len * (1 - local);
  });
  // phase 1.5 (.35–.5): dimensions fade in
  const dimIn = Math.min(1, Math.max(0, (p - .35) / .15));
  dims.forEach(d => d.style.opacity = reduced ? 1 : dimIn);
  // phase 2 (.5–.95): the photograph wipes across, lines dissolve behind it
  const wipe = Math.min(1, Math.max(0, (p - .5) / .45));
  photo.style.clipPath = `inset(0 ${100 - wipe * 100}% 0 0)`;
  print.style.opacity = 1 - wipe * .92;
  scan.style.opacity = wipe > 0 && wipe < 1 ? .9 : 0;
  scan.style.left = `calc(${wipe * 100}% - 1px)`;
  cap.textContent = p < .45 ? 'FIG. 1 — DRAWN'
                 : p < .5  ? 'FIG. 1 — DIMENSIONED'
                 : wipe < 1 ? 'FIG. 1 — BECOMING'
                 : 'FIG. 1 — AIRBORNE';
}
addEventListener('scroll', update, {passive: true});
addEventListener('resize', update);
update();
