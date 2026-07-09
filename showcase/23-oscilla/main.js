// OSCILLA — the website is an instrument. Everything you see is your sound.
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- synth ---------- */
const NOTES = [
  ['A', 'C4', 261.63], ['S', 'D4', 293.66], ['D', 'E4', 329.63], ['F', 'G4', 392.00],
  ['G', 'A4', 440.00], ['H', 'C5', 523.25], ['J', 'D5', 587.33], ['K', 'E5', 659.25],
];
let AC, analyser, master, convolver, dryGain, wetGain;
const active = new Map();   // key → {osc, gain}

function ensureAudio() {
  if (AC) return;
  AC = new (window.AudioContext || window.webkitAudioContext)();
  master = AC.createGain(); master.gain.value = .5;
  analyser = AC.createAnalyser(); analyser.fftSize = 2048;
  // simple synthetic reverb: noise-burst impulse
  convolver = AC.createConvolver();
  const len = AC.sampleRate * 2.2, imp = AC.createBuffer(2, len, AC.sampleRate);
  for (let ch = 0; ch < 2; ch++) {
    const d = imp.getChannelData(ch);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.4);
  }
  convolver.buffer = imp;
  dryGain = AC.createGain(); wetGain = AC.createGain();
  setVerb(+document.getElementById('verb').value);
  master.connect(dryGain); dryGain.connect(analyser);
  master.connect(convolver); convolver.connect(wetGain); wetGain.connect(analyser);
  analyser.connect(AC.destination);
}
function setVerb(v) {
  if (!AC) return;
  wetGain.gain.value = v / 100 * .8;
  dryGain.gain.value = 1 - v / 100 * .4;
}
document.getElementById('verb').addEventListener('input', e => setVerb(+e.target.value));

function noteOn(k, freq) {
  ensureAudio(); AC.resume();
  if (active.has(k)) return;
  const type = document.getElementById('wave').value;
  const o1 = AC.createOscillator(), o2 = AC.createOscillator(), g = AC.createGain();
  o1.type = o2.type = type;
  o1.frequency.value = freq; o2.frequency.value = freq; o2.detune.value = 7;
  g.gain.setValueAtTime(0, AC.currentTime);
  g.gain.linearRampToValueAtTime(.22, AC.currentTime + .02);
  o1.connect(g); o2.connect(g); g.connect(master);
  o1.start(); o2.start();
  active.set(k, {o1, o2, g});
}
function noteOff(k) {
  const n = active.get(k);
  if (!n) return;
  n.g.gain.setTargetAtTime(0, AC.currentTime, .09);
  n.o1.stop(AC.currentTime + .6); n.o2.stop(AC.currentTime + .6);
  active.delete(k);
}

/* ---------- keybed ---------- */
const bed = document.getElementById('keybed');
NOTES.forEach(([k, name, f]) => {
  const b = document.createElement('button');
  b.className = 'key'; b.id = 'key' + k; b.type = 'button';
  b.innerHTML = `${k}<small>${name}</small>`;
  b.setAttribute('aria-label', `Play ${name}`);
  b.addEventListener('pointerdown', e => { b.setPointerCapture(e.pointerId); press(k, f); });
  b.addEventListener('pointerup', () => release(k));
  b.addEventListener('pointerleave', () => release(k));
  bed.appendChild(b);
});
function press(k, f) {
  noteOn(k, f);
  const el = document.getElementById('key' + k);
  if (el) el.classList.add('down');
}
function release(k) {
  noteOff(k);
  const el = document.getElementById('key' + k);
  if (el) el.classList.remove('down');
}
addEventListener('keydown', e => {
  if (e.repeat) return;
  const n = NOTES.find(n => n[0] === e.key.toUpperCase());
  if (n) press(n[0], n[2]);
});
addEventListener('keyup', e => {
  const n = NOTES.find(n => n[0] === e.key.toUpperCase());
  if (n) release(n[0]);
});

/* ---------- the scope: waveform + harmonic bars + afterglow ---------- */
const cv = document.getElementById('scope'), ctx = cv.getContext('2d');
let W, H;
const rs = () => { W = cv.width = innerWidth; H = cv.height = innerHeight; };
rs(); addEventListener('resize', rs);
const wave = new Uint8Array(2048);
const freq = new Uint8Array(1024);

(function draw() {
  requestAnimationFrame(draw);
  if (document.hidden) return;
  // afterglow: translucent black wash instead of clear
  ctx.fillStyle = 'rgba(7,10,13,.16)';
  ctx.fillRect(0, 0, W, H);
  if (!analyser) { grid(); return; }
  analyser.getByteTimeDomainData(wave);
  analyser.getByteFrequencyData(freq);
  grid();
  // harmonic bars (bottom, ghost teal)
  const nb = 96, bw = W / nb;
  for (let i = 0; i < nb; i++) {
    const v = freq[Math.floor(i / nb * 340)] / 255;
    if (v < .01) continue;
    ctx.fillStyle = `rgba(58,242,197,${.06 + v * .3})`;
    const h = v * H * .3;
    ctx.fillRect(i * bw + 1, H - h, bw - 2, h);
  }
  // waveform (center, signal yellow)
  ctx.beginPath();
  const amp = active.size ? 1 : .22;
  for (let i = 0; i < wave.length; i++) {
    const x = i / wave.length * W;
    const y = H * .5 + (wave[i] - 128) / 128 * H * .3 * amp;
    i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
  }
  ctx.strokeStyle = 'rgba(242,233,78,.9)';
  ctx.lineWidth = 2;
  ctx.shadowColor = '#F2E94E';
  ctx.shadowBlur = active.size ? 18 : 6;
  ctx.stroke();
  ctx.shadowBlur = 0;
})();
function grid() {
  ctx.strokeStyle = 'rgba(242,244,245,.05)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let x = 0; x < W; x += 80) { ctx.moveTo(x, 0); ctx.lineTo(x, H); }
  for (let y = 0; y < H; y += 80) { ctx.moveTo(0, y); ctx.lineTo(W, y); }
  ctx.stroke();
  ctx.strokeStyle = 'rgba(242,233,78,.12)';
  ctx.beginPath(); ctx.moveTo(0, H * .5); ctx.lineTo(W, H * .5); ctx.stroke();
}
