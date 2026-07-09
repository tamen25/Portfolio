// CARAVAN — the route embroiders itself; the caravan rides the thread's tip.
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const route = document.getElementById('route');
const camel = document.getElementById('camel');
const journey = document.getElementById('journey');
const odo = document.getElementById('odometer');
const LEN = route.getTotalLength();
const TOTAL_KM = 7000;
const STOPS = [
  [0, "THE GATE OF CHANG'AN"], [1800, 'THE KASHGAR CROSSROADS'],
  [3400, 'THE BLUE OF SAMARKAND'], [5200, 'THE ROUND CITY OF BAGHDAD'],
  [7000, 'THE GOLDEN HORN — DELIVERED'],
];

/* draw setup: dashed route revealed by a mask-like second dash trick —
   simplest robust: use strokeDasharray pattern but animate a covering offset
   via a duplicated path. Instead: set dasharray to [LEN] and offset, sacrificing
   the dashed look while traveling; restore dashes behind the tip with a twin. */
const twin = route.cloneNode();
twin.id = 'routeDone';
twin.style.stroke = 'var(--madder)';
twin.style.fill = 'none';
twin.style.strokeWidth = '3.4';
twin.style.strokeLinecap = 'round';
twin.setAttribute('stroke-dasharray', '9 7');
route.parentNode.insertBefore(twin, route);
route.style.strokeDasharray = LEN;
route.style.strokeDashoffset = LEN;
route.style.stroke = 'transparent';           // the original becomes a measuring ghost
// the twin is clipped to the traveled fraction with a mask rectangle approach:
// simpler: twin uses pathLength trick
twin.setAttribute('pathLength', 100);
twin.style.strokeDasharray = '2.2 1.8';       // dashes in pathLength units
twin.style.strokeDashoffset = 0;

function setProgress(p) {
  // reveal: draw twin only up to p using dasharray: [visible, huge gap]
  const dashes = [];
  const unit = 4;                              // 2.2 dash + 1.8 gap
  const total = p * 100;
  let acc = 0;
  while (acc + 2.2 <= total) { dashes.push(2.2, 1.8); acc += unit; }
  const rem = Math.max(0, total - acc);
  if (rem > 0) dashes.push(Math.min(rem, 2.2), 0);
  dashes.push(0, 1000);                        // hide the rest
  twin.style.strokeDasharray = dashes.join(' ');
  // camel at the tip
  const pt = route.getPointAtLength(LEN * p);
  camel.setAttribute('transform', `translate(${pt.x} ${pt.y})`);
  // odometer
  const km = Math.round(TOTAL_KM * p);
  let label = STOPS[0][1];
  for (const [k, name] of STOPS) if (km >= k - 60) label = name;
  odo.textContent = `${km.toLocaleString('en-US')} KM · ${label}`;
}

function update() {
  const r = journey.getBoundingClientRect();
  const total = r.height - innerHeight;
  const p = Math.min(1, Math.max(0, -r.top / total));
  setProgress(reduced ? 1 : p);
}
addEventListener('scroll', update, {passive: true});
addEventListener('resize', update);
update();

/* stops reveal */
const io = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) e.target.classList.add('here');
}), {threshold: .3});
document.querySelectorAll('.stop').forEach(s => io.observe(s));
