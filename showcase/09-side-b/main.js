// SIDE B — the deck is real. Music generated live with Web Audio, no files.
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

const FLAVORS = {
  dusk: {
    bpm: 84, root: 45, // A1
    chords: [[57,60,64,67],[53,57,60,65],[48,52,55,60],[55,59,62,67]], // Am7 F C G
    bass:  [0,0,7,0, 0,0,3,5, 0,0,7,0, 0,0,10,12],
    filter: 950, hiss: .012, kick: [0,4,8,12], hat: [2,6,10,14]
  },
  pool: {
    bpm: 96, root: 50, // D2
    chords: [[62,66,69,73],[59,62,66,71],[57,61,64,69],[55,59,62,66]], // Dmaj7 Bm7 Amaj7-ish G
    bass:  [0,0,12,0, 7,0,0,5, 0,0,12,0, 7,0,4,2],
    filter: 1500, hiss: .008, kick: [0,4,8,12], hat: [2,5,6,10,13,14]
  },
  static: {
    bpm: 70, root: 41, // F1
    chords: [[53,56,60,63],[51,55,58,62],[48,51,56,60],[53,56,60,63]], // Fm7 Ebmaj7 Abmaj7 Fm7
    bass:  [0,0,0,0, 3,0,0,0, 0,0,5,0, 3,0,0,0],
    filter: 650, hiss: .022, kick: [0,8], hat: [4,12]
  }
};
let flavor = 'dusk';

/* ---------- audio engine ---------- */
let AC, master, analyser, hissGain, playing = false;
let step = 0, nextTime = 0, timer = null;
const m2f = m => 440 * Math.pow(2, (m - 69) / 12);

function ensureAudio() {
  if (AC) return;
  AC = new (window.AudioContext || window.webkitAudioContext)();
  master = AC.createGain(); master.gain.value = .8;
  analyser = AC.createAnalyser(); analyser.fftSize = 512;
  master.connect(analyser); analyser.connect(AC.destination);
  // tape hiss bed
  const len = AC.sampleRate * 2;
  const buf = AC.createBuffer(1, len, AC.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1);
  const hiss = AC.createBufferSource(); hiss.buffer = buf; hiss.loop = true;
  const hp = AC.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 3000;
  hissGain = AC.createGain(); hissGain.gain.value = 0;
  hiss.connect(hp); hp.connect(hissGain); hissGain.connect(master);
  hiss.start();
}

function kick(t) {
  const o = AC.createOscillator(), g = AC.createGain();
  o.frequency.setValueAtTime(140, t);
  o.frequency.exponentialRampToValueAtTime(42, t + .11);
  g.gain.setValueAtTime(.9, t);
  g.gain.exponentialRampToValueAtTime(.001, t + .3);
  o.connect(g); g.connect(master); o.start(t); o.stop(t + .32);
}
function hat(t) {
  const src = AC.createBufferSource();
  const b = AC.createBuffer(1, AC.sampleRate * .06, AC.sampleRate);
  const d = b.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length);
  src.buffer = b;
  const f = AC.createBiquadFilter(); f.type = 'highpass'; f.frequency.value = 7000;
  const g = AC.createGain(); g.gain.value = .16;
  src.connect(f); f.connect(g); g.connect(master); src.start(t);
}
function bass(t, midi, dur) {
  const o = AC.createOscillator(), g = AC.createGain(), f = AC.createBiquadFilter();
  o.type = 'triangle'; o.frequency.value = m2f(midi);
  f.type = 'lowpass'; f.frequency.value = 700;
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(.5, t + .015);
  g.gain.exponentialRampToValueAtTime(.001, t + dur);
  o.connect(f); f.connect(g); g.connect(master); o.start(t); o.stop(t + dur + .05);
}
function pad(t, notes, dur, cutoff) {
  notes.forEach(n => {
    [-6, 5].forEach(det => {
      const o = AC.createOscillator(), g = AC.createGain(), f = AC.createBiquadFilter();
      o.type = 'sawtooth'; o.frequency.value = m2f(n); o.detune.value = det;
      f.type = 'lowpass'; f.frequency.setValueAtTime(cutoff, t);
      f.frequency.linearRampToValueAtTime(cutoff * .55, t + dur);
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(.05, t + dur * .35);
      g.gain.linearRampToValueAtTime(0, t + dur);
      o.connect(f); f.connect(g); g.connect(master);
      o.start(t); o.stop(t + dur + .05);
    });
  });
}

function schedule() {
  const F = FLAVORS[flavor];
  const spb = 60 / F.bpm / 4; // per 16th
  while (nextTime < AC.currentTime + .12) {
    const s16 = step % 16, bar = (step / 16 | 0) % 4;
    if (F.kick.includes(s16)) kick(nextTime);
    if (F.hat.includes(s16)) hat(nextTime);
    const bs = F.bass[s16];
    if (bs !== 0 || s16 === 0) bass(nextTime, F.root + bs, spb * 3.2);
    if (s16 === 0) pad(nextTime, F.chords[bar], spb * 16, F.filter);
    nextTime += spb; step++;
  }
}

/* ---------- transport / UI ---------- */
const cassette = document.getElementById('cassette');
const btnPlay = document.getElementById('btnPlay');
const counterEl = document.getElementById('counter');
const vuL = document.getElementById('vuL'), vuR = document.getElementById('vuR');
const hint = document.getElementById('deckHint');
let count = 0, countTimer = null;

function startCount(rate) {
  clearInterval(countTimer);
  countTimer = setInterval(() => {
    count = Math.max(0, count + rate);
    counterEl.textContent = String(Math.round(count) % 1000).padStart(3, '0');
  }, 120);
}
function stopCount() { clearInterval(countTimer); countTimer = null; }

function play() {
  ensureAudio();
  AC.resume();
  if (playing) return;
  playing = true;
  step = 0; nextTime = AC.currentTime + .06;
  hissGain.gain.linearRampToValueAtTime(FLAVORS[flavor].hiss, AC.currentTime + .4);
  timer = setInterval(schedule, 25);
  cassette.classList.add('playing');
  btnPlay.setAttribute('aria-pressed', 'true');
  hint.textContent = 'NOW DUBBING · EVERY PLAY IS A SLIGHTLY DIFFERENT TAKE';
  startCount(1);
  meterLoop();
}
function stop() {
  if (!playing) { count = 0; counterEl.textContent = '000'; return; }
  playing = false;
  clearInterval(timer);
  if (hissGain) hissGain.gain.linearRampToValueAtTime(0, AC.currentTime + .2);
  cassette.classList.remove('playing');
  btnPlay.setAttribute('aria-pressed', 'false');
  hint.textContent = 'PRESS PLAY — THE MUSIC IS GENERATED LIVE, NOT A FILE';
  stopCount();
  vuL.style.height = vuR.style.height = '8%';
}
btnPlay.addEventListener('click', () => playing ? stop() : play());
document.getElementById('btnStop').addEventListener('click', stop);

/* REW / FF: hold to wind */
function wind(btn, rate, dir) {
  const el = document.getElementById(btn);
  let held = false, wasPlaying = false;
  const start = () => {
    held = true; el.classList.add('held');
    wasPlaying = playing; if (playing) stop();
    cassette.classList.add('playing');
    cassette.querySelectorAll('.reel').forEach(r => {
      r.style.animationDuration = '.42s';
      r.style.animationDirection = dir;
    });
    startCount(rate);
  };
  const end = () => {
    if (!held) return;
    held = false; el.classList.remove('held');
    cassette.classList.remove('playing');
    cassette.querySelectorAll('.reel').forEach(r => {
      r.style.animationDuration = '2.4s';
      r.style.animationDirection = 'normal';
    });
    stopCount();
    if (wasPlaying) play();
  };
  el.addEventListener('pointerdown', start);
  el.addEventListener('pointerup', end);
  el.addEventListener('pointerleave', end);
  el.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); if (!held) start(); } });
  el.addEventListener('keyup', e => { if (e.key === 'Enter' || e.key === ' ') end(); });
}
wind('btnRew', -6, 'reverse');
wind('btnFf', 6, 'normal');

/* VU meters */
function meterLoop() {
  if (!playing) return;
  requestAnimationFrame(meterLoop);
  const data = new Uint8Array(analyser.fftSize);
  analyser.getByteTimeDomainData(data);
  let sum = 0;
  for (let i = 0; i < data.length; i++) { const v = (data[i] - 128) / 128; sum += v * v; }
  const rms = Math.sqrt(sum / data.length);
  const pct = Math.min(96, 8 + rms * 300);
  vuL.style.height = pct + '%';
  vuR.style.height = Math.max(8, pct * (0.82 + Math.random() * .2)) + '%';
}

/* ---------- tape selection ---------- */
const cTitle = document.getElementById('cTitle');
document.querySelectorAll('.tape').forEach(tp => {
  tp.addEventListener('click', () => {
    document.querySelectorAll('.tape').forEach(t => t.setAttribute('aria-pressed', 'false'));
    tp.setAttribute('aria-pressed', 'true');
    flavor = tp.dataset.flavor;
    cTitle.textContent = tp.dataset.title;
    count = 0; counterEl.textContent = '000';
    if (playing) { // hot-swap the tape
      clearInterval(timer);
      step = 0; nextTime = AC.currentTime + .12;
      hissGain.gain.linearRampToValueAtTime(FLAVORS[flavor].hiss, AC.currentTime + .3);
      timer = setInterval(schedule, 25);
    }
    if (!reduced) cassette.animate(
      [{transform: 'translateY(-14px)'}, {transform: 'translateY(0)'}],
      {duration: 320, easing: 'cubic-bezier(.3,1.6,.4,1)'}
    );
  });
});
