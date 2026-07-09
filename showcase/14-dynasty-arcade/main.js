// MOTH & LANTERN — an original micro-game at 192×144, upscaled through a CRT.
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const cv = document.getElementById('game'), ctx = cv.getContext('2d');
const W = 192, H = 144;
const attract = document.getElementById('attract');
const hudScore = document.getElementById('hudScore');
const hudLives = document.getElementById('hudLives');
const attractHi = document.getElementById('attractHi');
let hi = +(localStorage.getItem('dynasty-hi') || 0);
attractHi.textContent = 'HI-SCORE ' + hi;

/* ---------- bleeps ---------- */
let AC;
function bleep(f0, f1, dur, type = 'square', vol = .12) {
  if (!AC) AC = new (window.AudioContext || window.webkitAudioContext)();
  const t = AC.currentTime;
  const o = AC.createOscillator(), g = AC.createGain();
  o.type = type;
  o.frequency.setValueAtTime(f0, t);
  o.frequency.exponentialRampToValueAtTime(Math.max(30, f1), t + dur);
  g.gain.setValueAtTime(vol, t);
  g.gain.exponentialRampToValueAtTime(.0001, t + dur);
  o.connect(g); g.connect(AC.destination);
  o.start(t); o.stop(t + dur + .02);
}

/* ---------- state ---------- */
let running = false, score = 0, lives = 3, inv = 0, tGame = 0;
const moth = {x: W/2, y: H/2, tx: W/2, ty: H/2, wing: 0};
let embers = [], gusts = [], sparks = [];
const keys = {};

function reset() {
  score = 0; lives = 3; inv = 0; tGame = 0;
  moth.x = moth.tx = W/2; moth.y = moth.ty = H/2;
  embers = []; gusts = []; sparks = [];
  for (let i = 0; i < 4; i++) spawnEmber();
}
function spawnEmber() {
  embers.push({x: 10 + Math.random()*(W-20), y: 12 + Math.random()*(H-30),
    ph: Math.random()*7, vy: (Math.random()-.5)*.06});
}
function spawnGust() {
  const y = 10 + Math.random()*(H-20);
  const dir = Math.random() < .5 ? 1 : -1;
  gusts.push({y, x: dir > 0 ? -30 : W+30, dir,
    sp: (.6 + Math.random()*.5 + Math.min(1, score/300)) * dir, w: 26});
}

/* ---------- input ---------- */
cv.addEventListener('pointermove', e => {
  const r = cv.getBoundingClientRect();
  moth.tx = (e.clientX - r.left) / r.width * W;
  moth.ty = (e.clientY - r.top) / r.height * H;
});
addEventListener('keydown', e => {
  keys[e.key] = true;
  if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight',' '].includes(e.key)) e.preventDefault();
  if (!running && (e.key === ' ' || e.key === 'Enter')) start();
});
addEventListener('keyup', e => keys[e.key] = false);
attract.addEventListener('click', start);

function start() {
  reset();
  running = true;
  attract.classList.add('off');
  bleep(880, 1320, .12, 'square', .15); // coin
  setTimeout(() => bleep(1320, 1760, .1), 120);
}
function gameOver() {
  running = false;
  if (score > hi) { hi = score; localStorage.setItem('dynasty-hi', hi); }
  attractHi.textContent = 'HI-SCORE ' + hi;
  attract.querySelector('.a-title').textContent = 'GAME OVER — ' + score;
  attract.querySelector('.a-cta').textContent = 'CLICK TO PLAY AGAIN';
  attract.classList.remove('off');
  bleep(300, 60, .5, 'sawtooth', .14);
}

/* ---------- loop ---------- */
let gustTimer = 0, last = performance.now();
function frame(now) {
  requestAnimationFrame(frame);
  const dt = Math.min(40, now - last) / 16.7; last = now;
  // background
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, '#0A0714'); g.addColorStop(1, '#120B24');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  // lantern at bottom center — the light source of the whole scene
  const lx = W/2, ly = H - 8;
  const lg = ctx.createRadialGradient(lx, ly, 0, lx, ly, 70);
  lg.addColorStop(0, 'rgba(255,180,84,.5)');
  lg.addColorStop(.3, 'rgba(255,180,84,.12)');
  lg.addColorStop(1, 'rgba(255,180,84,0)');
  ctx.fillStyle = lg; ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = '#FFB454';
  ctx.fillRect(lx-3, ly-4, 6, 6);
  ctx.fillStyle = '#7A4A12';
  ctx.fillRect(lx-5, ly+2, 10, 3);

  if (running) {
    tGame += dt;
    // keyboard steering
    const k = 2.6 * dt;
    if (keys.ArrowLeft || keys.a) moth.tx -= k * 2;
    if (keys.ArrowRight || keys.d) moth.tx += k * 2;
    if (keys.ArrowUp || keys.w) moth.ty -= k * 2;
    if (keys.ArrowDown || keys.s) moth.ty += k * 2;
    moth.tx = Math.max(4, Math.min(W-4, moth.tx));
    moth.ty = Math.max(4, Math.min(H-4, moth.ty));
    moth.x += (moth.tx - moth.x) * .12 * dt;
    moth.y += (moth.ty - moth.y) * .12 * dt;
    moth.wing += dt * .8;
    if (inv > 0) inv -= dt / 60;

    // gust spawning ramps with score
    gustTimer -= dt;
    if (gustTimer <= 0) {
      spawnGust();
      gustTimer = Math.max(28, 90 - score / 4);
    }
    // embers
    embers.forEach(e => { e.ph += dt * .1; e.y += e.vy * dt; });
    for (let i = embers.length - 1; i >= 0; i--) {
      const e = embers[i];
      if (Math.hypot(e.x - moth.x, e.y - moth.y) < 7) {
        embers.splice(i, 1); score += 10;
        bleep(660, 1320, .09, 'square', .1);
        for (let s = 0; s < 6; s++) sparks.push({x: e.x, y: e.y,
          vx: (Math.random()-.5)*1.6, vy: (Math.random()-.5)*1.6, life: 1});
        spawnEmber();
        if (embers.length < 4 && Math.random() < .5) spawnEmber();
      }
    }
    // gusts
    for (let i = gusts.length - 1; i >= 0; i--) {
      const gu = gusts[i];
      gu.x += gu.sp * dt * 1.6;
      if ((gu.dir > 0 && gu.x > W + 40) || (gu.dir < 0 && gu.x < -40)) { gusts.splice(i, 1); continue; }
      if (inv <= 0 && Math.abs(gu.y - moth.y) < 5 && Math.abs(gu.x - moth.x) < gu.w/2 + 3) {
        lives--; inv = 1.4;
        bleep(220, 80, .3, 'sawtooth', .13);
        if (lives <= 0) { gameOver(); }
      }
    }
    sparks.forEach(s => { s.x += s.vx*dt; s.y += s.vy*dt; s.life -= dt*.06; });
    sparks = sparks.filter(s => s.life > 0);
    hudScore.textContent = 'SCORE ' + score;
    hudLives.textContent = '♥'.repeat(Math.max(0, lives)) + '·'.repeat(3 - Math.max(0, lives));
  }

  // ---- draw embers ----
  embers.forEach(e => {
    const p = (Math.sin(e.ph) + 1) / 2;
    const eg = ctx.createRadialGradient(e.x, e.y, 0, e.x, e.y, 8);
    eg.addColorStop(0, `rgba(255,180,84,${.5 + p*.4})`);
    eg.addColorStop(1, 'rgba(255,180,84,0)');
    ctx.fillStyle = eg;
    ctx.fillRect(e.x-8, e.y-8, 16, 16);
    ctx.fillStyle = p > .5 ? '#FFE2B0' : '#FFB454';
    ctx.fillRect(e.x-1, e.y-1, 2, 2);
  });
  // ---- draw gusts (wind streaks) ----
  ctx.fillStyle = 'rgba(53,229,220,.55)';
  gusts.forEach(gu => {
    for (let s = 0; s < 3; s++) {
      const off = s * 9 * Math.sign(gu.sp) * -1;
      ctx.fillRect(gu.x - gu.w/2 + off, gu.y - 1 + (s-1), gu.w - s*6, 1);
    }
  });
  // ---- draw sparks ----
  sparks.forEach(s => {
    ctx.fillStyle = `rgba(255,226,176,${s.life})`;
    ctx.fillRect(s.x, s.y, 1.5, 1.5);
  });
  // ---- draw moth ----
  if (running || !reduced) {
    const blinkOut = inv > 0 && Math.floor(inv * 12) % 2 === 0;
    if (!blinkOut) {
      const wing = Math.sin(moth.wing) > 0;
      ctx.fillStyle = '#E8E4F5';
      ctx.fillRect(moth.x-1, moth.y-2, 2, 5);                     // body
      ctx.fillStyle = '#FF3D8B';
      if (wing) { ctx.fillRect(moth.x-5, moth.y-2, 4, 3); ctx.fillRect(moth.x+1, moth.y-2, 4, 3); }
      else      { ctx.fillRect(moth.x-4, moth.y-1, 3, 2); ctx.fillRect(moth.x+1, moth.y-1, 3, 2); }
      const mg = ctx.createRadialGradient(moth.x, moth.y, 0, moth.x, moth.y, 10);
      mg.addColorStop(0, 'rgba(255,61,139,.25)'); mg.addColorStop(1, 'rgba(255,61,139,0)');
      ctx.fillStyle = mg; ctx.fillRect(moth.x-10, moth.y-10, 20, 20);
    }
  }
}
requestAnimationFrame(frame);
