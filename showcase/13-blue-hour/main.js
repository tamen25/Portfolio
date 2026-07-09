// BLUE HOUR — a synthesized swing trio: walking bass, swung ride, rootless piano.
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- charts ---------- */
// chord: [rootMidi, type] — types: '7', 'm7', 'maj7', '7alt'
const TUNES = [
  { name: 'Blue Hour Blues', bpm: 132, brushes: false,
    bars: [[41,'7'],[41,'7'],[41,'7'],[41,'7'],[46,'7'],[46,'7'],[41,'7'],[41,'7'],[48,'7'],[46,'7'],[41,'7'],[48,'7']] },
  { name: 'Half Past Midnight', bpm: 92, brushes: true,
    bars: [[38,'m7'],[43,'7'],[46,'maj7'],[45,'7alt'],[38,'m7'],[43,'7'],[38,'m7'],[45,'7alt']] },
  { name: 'Last Train Swing', bpm: 168, brushes: false,
    bars: [[46,'maj7'],[43,'7'],[36,'m7'],[41,'7'],[46,'maj7'],[43,'7'],[36,'m7'],[41,'7']] },
];
const CHORD = {
  '7':    {tones: [0,4,7,10], voice: [4,10,14]},
  'm7':   {tones: [0,3,7,10], voice: [3,10,14]},
  'maj7': {tones: [0,4,7,11], voice: [4,11,14]},
  '7alt': {tones: [0,4,8,10], voice: [4,10,13]},
};
let tune = 0;

/* ---------- engine ---------- */
let AC, master, crackleGain, playing = false, timer = null;
let bar = 0, beat = 0, nextTime = 0;
const m2f = m => 440 * Math.pow(2, (m - 69) / 12);

function ensureAudio() {
  if (AC) return;
  AC = new (window.AudioContext || window.webkitAudioContext)();
  master = AC.createGain(); master.gain.value = .85; master.connect(AC.destination);
  // vinyl bed: hiss + scheduled pops
  const len = AC.sampleRate * 2, buf = AC.createBuffer(1, len, AC.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
  const src = AC.createBufferSource(); src.buffer = buf; src.loop = true;
  const lp = AC.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 3200;
  crackleGain = AC.createGain(); crackleGain.gain.value = 0;
  src.connect(lp); lp.connect(crackleGain); crackleGain.connect(master);
  src.start();
  setInterval(() => { if (playing && Math.random() < .4) pop(); }, 700);
}
function pop() {
  const t = AC.currentTime + Math.random() * .4;
  const o = AC.createOscillator(), g = AC.createGain();
  o.type = 'square'; o.frequency.value = 300 + Math.random() * 900;
  g.gain.setValueAtTime(.05 + Math.random() * .05, t);
  g.gain.exponentialRampToValueAtTime(.0001, t + .015);
  o.connect(g); g.connect(master); o.start(t); o.stop(t + .02);
}
function noiseBurst(t, dur, filterType, freq, gain) {
  const n = Math.ceil(AC.sampleRate * dur), b = AC.createBuffer(1, n, AC.sampleRate);
  const d = b.getChannelData(0);
  for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / n);
  const s = AC.createBufferSource(); s.buffer = b;
  const f = AC.createBiquadFilter(); f.type = filterType; f.frequency.value = freq; f.Q.value = 1.2;
  const g = AC.createGain(); g.gain.value = gain;
  s.connect(f); f.connect(g); g.connect(master); s.start(t);
}
function ride(t, accent) {
  const T = TUNES[tune];
  if (T.brushes) { noiseBurst(t, .16, 'bandpass', 5200, accent ? .1 : .06); return; }
  noiseBurst(t, .09, 'highpass', 6400, accent ? .13 : .08);
  const o = AC.createOscillator(), g = AC.createGain();      // metallic partial
  o.frequency.value = 5030; g.gain.setValueAtTime(.03, t);
  g.gain.exponentialRampToValueAtTime(.0001, t + .25);
  o.connect(g); g.connect(master); o.start(t); o.stop(t + .26);
}
function chick(t) { noiseBurst(t, .03, 'lowpass', 900, .12); }
function bassNote(t, midi, dur) {
  const o = AC.createOscillator(), g = AC.createGain(), f = AC.createBiquadFilter();
  o.type = 'triangle'; o.frequency.value = m2f(midi);
  f.type = 'lowpass'; f.frequency.value = 620;
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(.62, t + .012);
  g.gain.exponentialRampToValueAtTime(.001, t + dur);
  o.connect(f); f.connect(g); g.connect(master);
  o.start(t); o.stop(t + dur + .05);
  noiseBurst(t, .012, 'lowpass', 1200, .05);                  // finger attack
}
function pianoChord(t, rootMidi, type, vel) {
  CHORD[type].voice.forEach(iv => {
    const o = AC.createOscillator(), g = AC.createGain();
    o.type = 'triangle';
    o.frequency.value = m2f(rootMidi + 12 + iv);
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(vel, t + .008);
    g.gain.exponentialRampToValueAtTime(.001, t + .5 + Math.random() * .3);
    o.connect(g); g.connect(master); o.start(t); o.stop(t + .95);
  });
}
function walkNote(barI, beatI) {
  const T = TUNES[tune], bars = T.bars;
  const [root] = bars[barI % bars.length];
  const tones = CHORD[bars[barI % bars.length][1]].tones;
  const nextRoot = bars[(barI + 1) % bars.length][0];
  if (beatI === 0) return root;
  if (beatI === 3) {                                          // chromatic approach
    const target = nextRoot;
    return target + (Math.random() < .5 ? 1 : -1);
  }
  return root + tones[1 + Math.floor(Math.random() * (tones.length - 1))] - (Math.random() < .3 ? 12 : 0);
}

function schedule() {
  const T = TUNES[tune];
  const q = 60 / T.bpm;                                       // quarter
  while (nextTime < AC.currentTime + .14) {
    const t = nextTime;
    // ride pattern: 1, 2, 2&, 3, 4, 4&  (swing the &s)
    ride(t, beat % 2 === 0);
    if (beat === 1 || beat === 3) {
      chick(t);
      ride(t + q * .66, false);                               // swung skip note
    }
    // bass: quarters
    bassNote(t, walkNote(bar, beat), q * .95);
    // piano comping: sparse, syncopated
    const [root, type] = T.bars[bar % T.bars.length];
    if (beat === 0 && Math.random() < .5) pianoChord(t + q * .66, root, type, .07);
    if (beat === 2 && Math.random() < .6) pianoChord(t, root, type, .08);
    if (beat === 3 && Math.random() < .35) pianoChord(t + q * .66, root, type, .06); // anticipation
    beat++;
    if (beat === 4) { beat = 0; bar++; }
    nextTime += q;
  }
}

/* ---------- transport ---------- */
const btn = document.getElementById('btnListen');
const hint = document.getElementById('ttHint');
function start() {
  ensureAudio(); AC.resume();
  playing = true; bar = 0; beat = 0;
  nextTime = AC.currentTime + .08;
  crackleGain.gain.linearRampToValueAtTime(.012, AC.currentTime + .5);
  timer = setInterval(schedule, 30);
  btn.textContent = '■  END THE SET';
  btn.setAttribute('aria-pressed', 'true');
  hint.textContent = 'DRAG THE RECORD TO SCRATCH IT · THE BAND WILL FORGIVE YOU';
}
function stop() {
  playing = false; clearInterval(timer);
  if (crackleGain) crackleGain.gain.linearRampToValueAtTime(0, AC.currentTime + .3);
  btn.textContent = '▶  START THE TRIO';
  btn.setAttribute('aria-pressed', 'false');
}
btn.addEventListener('click', () => playing ? stop() : start());

/* tune selection */
document.querySelectorAll('.tune').forEach(b => {
  b.addEventListener('click', () => {
    document.querySelectorAll('.tune').forEach(x => x.setAttribute('aria-pressed', 'false'));
    b.setAttribute('aria-pressed', 'true');
    tune = +b.dataset.tune;
    document.getElementById('vTitle').textContent = TUNES[tune].name;
    bar = 0; beat = 0;
    if (playing) nextTime = AC.currentTime + .1;
  });
});

/* ---------- the record: spin + scratch ---------- */
const vinyl = document.getElementById('vinyl');
let angle = 0, scratching = false, lastPA = 0, lastT = 0, angVel = 0;
let scratchSrc = null, scratchF = null, scratchG = null;

function pointerAngle(e) {
  const r = vinyl.getBoundingClientRect();
  return Math.atan2(e.clientY - (r.top + r.height / 2), e.clientX - (r.left + r.width / 2));
}
vinyl.addEventListener('pointerdown', e => {
  scratching = true;
  lastPA = pointerAngle(e); lastT = performance.now();
  vinyl.setPointerCapture(e.pointerId);
  if (AC && playing) {
    clearInterval(timer);                                     // the band waits
    const n = AC.createBufferSource();
    const len = AC.sampleRate, b = AC.createBuffer(1, len, AC.sampleRate);
    const d = b.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    n.buffer = b; n.loop = true;
    scratchF = AC.createBiquadFilter(); scratchF.type = 'bandpass'; scratchF.Q.value = 2.5;
    scratchG = AC.createGain(); scratchG.gain.value = 0;
    n.connect(scratchF); scratchF.connect(scratchG); scratchG.connect(master);
    n.start(); scratchSrc = n;
  }
});
addEventListener('pointermove', e => {
  if (!scratching) return;
  const pa = pointerAngle(e), now = performance.now();
  let d = pa - lastPA;
  if (d > Math.PI) d -= Math.PI * 2; if (d < -Math.PI) d += Math.PI * 2;
  angle += d * 57.3;
  angVel = d / Math.max(8, now - lastT) * 1000;
  lastPA = pa; lastT = now;
  if (scratchF) {
    const v = Math.min(1, Math.abs(angVel) / 9);
    scratchF.frequency.value = 400 + v * 3200;
    scratchG.gain.value = v * .3;
  }
});
addEventListener('pointerup', () => {
  if (!scratching) return;
  scratching = false;
  if (scratchSrc) { scratchG.gain.linearRampToValueAtTime(0, AC.currentTime + .12);
    scratchSrc.stop(AC.currentTime + .15); scratchSrc = null; }
  if (playing) { nextTime = AC.currentTime + .12; timer = setInterval(schedule, 30); }
});

/* spin loop */
const tonearmArm = document.querySelector('.ta-arm');
let t0 = performance.now();
(function spin(now) {
  requestAnimationFrame(spin);
  const dt = now - t0; t0 = now;
  if (playing && !scratching && !reduced) angle += dt * .0333 * 360 / 1800; // 33⅓ rpm
  vinyl.style.transform = `rotate(${angle}deg)`;
  if (tonearmArm) tonearmArm.style.transform = `rotate(${playing ? 24 : 18}deg)`;
})(performance.now());

/* reduced motion: pause the film */
const clubVideo = document.getElementById('clubVideo');
if (reduced && clubVideo) { clubVideo.pause(); clubVideo.removeAttribute('autoplay'); }
