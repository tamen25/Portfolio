// LEDGER — charts assemble from raw ticks. All SVG hand-authored, no libraries.
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const NS = 'http://www.w3.org/2000/svg';
const el = (tag, attrs, parent) => {
  const e = document.createElementNS(NS, tag);
  for (const k in attrs) e.setAttribute(k, attrs[k]);
  parent.appendChild(e);
  return e;
};

/* ---------- FIG 1: population line ---------- */
const POP = [[1900,41],[1910,58],[1920,84],[1931,71],[1940,96],[1950,139],[1962,187]];
{
  const svg = document.querySelector('.line-chart');
  const grid = svg.querySelector('.grid');
  const X = y => 40 + (y - 1900) / 62 * 650;
  const Y = v => 270 - v / 200 * 240;
  for (let v = 0; v <= 200; v += 50) {
    el('line', {x1: 40, x2: 690, y1: Y(v), y2: Y(v)}, grid);
    el('text', {x: 8, y: Y(v) + 4}, grid).textContent = v;
  }
  [1900,1920,1940,1962].forEach(yr => {
    el('text', {x: X(yr) - 14, y: 292}, grid).textContent = yr;
  });
  const path = svg.querySelector('.pop-line');
  path.setAttribute('d', POP.map((p, i) =>
    `${i ? 'L' : 'M'}${X(p[0])} ${Y(p[1])}`).join(' '));
  const dots = svg.querySelector('.pop-dots');
  POP.forEach(([yr, v]) => {
    el('circle', {cx: X(yr), cy: Y(v), r: 4.5}, dots);
    if (yr === 1931 || yr === 1962)
      el('text', {x: X(yr) + (yr === 1962 ? -34 : 8), y: Y(v) - 12}, dots).textContent = v + (yr === 1931 ? ' — the Fog' : '');
  });
  // draw-on-scroll
  const len = path.getTotalLength();
  path.style.strokeDasharray = len;
  path.style.strokeDashoffset = reduced ? 0 : len;
}

/* ---------- FIG 2: umbrella bars ---------- */
const UMB = [[/*J*/'J',62],['F',58],['M',66],['A',71],['M',64],['J',31],['J',59],['A',63],['S',70],['O',88],['N',74],['D',69]];
{
  const svg = document.querySelector('.bar-chart');
  const bw = 42, gap = 12, x0 = 46;
  UMB.forEach(([m, v], i) => {
    const h = v / 90 * 230;
    const r = el('rect', {
      x: x0 + i * (bw + gap), y: 270 - h, width: bw, height: h,
      class: i === 5 ? 'junebar' : ''
    }, svg);
    if (!reduced) {
      r.style.transformOrigin = `${x0 + i * (bw + gap) + bw/2}px 270px`;
      r.style.transform = 'scaleY(0)';
      r.style.transition = `transform .7s cubic-bezier(.2,1.2,.3,1) ${i * 60}ms`;
    }
    el('text', {x: x0 + i * (bw + gap) + bw/2 - 4, y: 290}, svg).textContent = m;
    el('text', {x: x0 + i * (bw + gap) + bw/2 - 10, y: 262 - h}, svg).textContent = v;
  });
}

/* ---------- FIG 3: streetlamp waffle ---------- */
{
  const w = document.querySelector('.waffle');
  const total = 124, flick = 11, dark = 4;
  // scatter the flickering & dark dots deterministically
  const special = {};
  [7, 19, 33, 41, 56, 63, 78, 88, 97, 104, 117].forEach(i => special[i] = 'flick');
  [110, 118, 121, 123].forEach(i => special[i] = 'dark');
  for (let i = 0; i < total; i++) {
    const d = document.createElement('i');
    d.className = 'dot ' + (special[i] || '');
    d.style.transitionDelay = (i * 9) + 'ms';
    w.appendChild(d);
  }
}

/* ---------- FIG 4: letters diverging ---------- */
const LETTERS = [
  ['THE NEW PARKING METERS', -214, 12],
  ['THE FOUNTAIN SCHEDULE', -88, 31],
  ['LIBRARY OPENING HOURS', -61, 140],
  ['THE HARVEST PARADE', -12, 178],
  ['THE PIGEONS', -96, 94],
];
{
  const svg = document.querySelector('.div-chart');
  const mid = 400, scale = 220 / 214, rowH = 54, y0 = 30;
  el('line', {x1: mid, x2: mid, y1: 10, y2: 300, class: 'axis'}, svg);
  LETTERS.forEach(([label, neg, pos], i) => {
    const y = y0 + i * rowH;
    const wNeg = -neg * scale, wPos = pos * scale;
    const rn = el('rect', {x: mid - wNeg, y, width: wNeg, height: 26, class: 'neg'}, svg);
    const rp = el('rect', {x: mid + 2, y, width: wPos, height: 26, class: 'pos'}, svg);
    if (!reduced) {
      rn.style.transformOrigin = `${mid}px 0`; rn.style.transform = 'scaleX(0)';
      rn.style.transition = `transform .8s cubic-bezier(.2,1,.3,1) ${i * 90}ms`;
      rp.style.transformOrigin = `${mid}px 0`; rp.style.transform = 'scaleX(0)';
      rp.style.transition = `transform .8s cubic-bezier(.2,1,.3,1) ${i * 90 + 60}ms`;
    }
    el('text', {x: mid + 10, y: y - 7}, svg).textContent = label;
    el('text', {x: mid - wNeg - 4, y: y + 18, 'text-anchor': 'end', class: 'val'}, svg).textContent = neg;
    el('text', {x: mid + wPos + 8, y: y + 18, class: 'val'}, svg).textContent = '+' + pos;
  });
  el('text', {x: mid - 8, y: 316, 'text-anchor': 'end', class: 'val'}, svg).textContent = 'COMPLAINTS ←';
  el('text', {x: mid + 8, y: 316, class: 'val'}, svg).textContent = '→ PRAISE';
}

/* ---------- assembly on scroll ---------- */
const io = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return;
  e.target.classList.add('seen');
  // fire chart-specific assembly
  if (e.target.id === 'fig1' && !reduced) {
    const p = e.target.querySelector('.pop-line');
    p.style.transition = 'stroke-dashoffset 2.2s cubic-bezier(.4,0,.2,1)';
    p.style.strokeDashoffset = 0;
  }
  if ((e.target.id === 'fig2' || e.target.id === 'fig4') && !reduced) {
    e.target.querySelectorAll('rect').forEach(r => r.style.transform = 'none');
  }
  io.unobserve(e.target);
}), {threshold: .35});
document.querySelectorAll('.fig').forEach(f => io.observe(f));
