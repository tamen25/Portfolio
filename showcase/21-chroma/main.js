// CHROMA — the sRGB gamut in CIELAB space. Real conversions, pickable points.
import * as THREE from 'three';

const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- color math (sRGB → XYZ D65 → Lab) ---------- */
function srgb2lin(c) { return c <= .04045 ? c / 12.92 : Math.pow((c + .055) / 1.055, 2.4); }
function rgb2lab(r, g, b) {
  const R = srgb2lin(r), G = srgb2lin(g), B = srgb2lin(b);
  let X = .4124 * R + .3576 * G + .1805 * B;
  let Y = .2126 * R + .7152 * G + .0722 * B;
  let Z = .0193 * R + .1192 * G + .9505 * B;
  X /= .95047; Z /= 1.08883;
  const f = t => t > .008856 ? Math.cbrt(t) : (7.787 * t + 16 / 116);
  const fx = f(X), fy = f(Y), fz = f(Z);
  return [116 * fy - 16, 500 * (fx - fy), 200 * (fy - fz)]; // L, a, b
}
function luminance(r, g, b) {
  return .2126 * srgb2lin(r) + .7152 * srgb2lin(g) + .0722 * srgb2lin(b);
}
const hex = (r, g, b) =>
  '#' + [r, g, b].map(v => Math.round(v * 255).toString(16).padStart(2, '0')).join('').toUpperCase();

/* ---------- build the solid ---------- */
const N = 24;                                     // 24³ = 13,824 points
const count = N * N * N;
const pos = new Float32Array(count * 3);
const col = new Float32Array(count * 3);
const meta = [];                                  // rgb + lab per point
let i = 0;
for (let r = 0; r < N; r++) for (let g = 0; g < N; g++) for (let b = 0; b < N; b++) {
  const R = r / (N - 1), G = g / (N - 1), B = b / (N - 1);
  const [L, A, Bb] = rgb2lab(R, G, B);
  pos[i * 3]     = A * .022;                      // a* → x
  pos[i * 3 + 1] = (L - 50) * .026;               // L* → y (centered)
  pos[i * 3 + 2] = Bb * .022;                     // b* → z
  col[i * 3] = R; col[i * 3 + 1] = G; col[i * 3 + 2] = B;
  meta.push({R, G, B, L, A, Bb});
  i++;
}
const geo = new THREE.BufferGeometry();
geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
const points = new THREE.Points(geo, new THREE.PointsMaterial({
  size: .024, vertexColors: true, sizeAttenuation: true
}));

const canvas = document.getElementById('solid');
const renderer = new THREE.WebGLRenderer({canvas, antialias: true, alpha: true});
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
const scene = new THREE.Scene();
scene.add(points);
const camera = new THREE.PerspectiveCamera(40, 1, .1, 60);

/* selection marker */
const marker = new THREE.Mesh(
  new THREE.SphereGeometry(.06, 16, 16),
  new THREE.MeshBasicMaterial({color: 0xffffff, wireframe: true})
);
marker.visible = false;
scene.add(marker);

/* ---------- orbit ---------- */
let theta = 2.2, phi = 1.4, dist = 7.6, dragging = false, moved = 0, px = 0, py = 0;
canvas.addEventListener('pointerdown', e => {
  dragging = true; moved = 0; px = e.clientX; py = e.clientY;
  canvas.setPointerCapture(e.pointerId);
});
addEventListener('pointermove', e => {
  if (!dragging) return;
  moved += Math.abs(e.clientX - px) + Math.abs(e.clientY - py);
  theta += (e.clientX - px) * .006;
  phi = Math.min(2.6, Math.max(.4, phi - (e.clientY - py) * .005));
  px = e.clientX; py = e.clientY;
});
addEventListener('pointerup', () => dragging = false);

/* ---------- picking ---------- */
const ray = new THREE.Raycaster();
ray.params.Points.threshold = .045;
const ptr = new THREE.Vector2();
const $ = id => document.getElementById(id);
let sample = null, colA = {r:1,g:1,b:1}, colB = {r:0,g:0,b:0};

canvas.addEventListener('click', e => {
  if (moved > 6) return;                          // that was a drag
  const r = canvas.getBoundingClientRect();
  ptr.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
  ray.setFromCamera(ptr, camera);
  const hit = ray.intersectObject(points)[0];
  if (!hit) return;
  const m = meta[hit.index];
  sample = m;
  marker.visible = true;
  marker.position.set(pos[hit.index*3], pos[hit.index*3+1], pos[hit.index*3+2]);
  $('sw').style.background = hex(m.R, m.G, m.B);
  $('svHex').textContent = hex(m.R, m.G, m.B);
  $('svRgb').textContent = `rgb(${Math.round(m.R*255)} ${Math.round(m.G*255)} ${Math.round(m.B*255)})`;
  $('svLab').textContent = `lab(${m.L.toFixed(0)} ${m.A.toFixed(0)} ${m.Bb.toFixed(0)})`;
  $('pickHint').textContent = 'SAMPLED — SET IT AS TEXT OR BACKGROUND ON THE BENCH';
});

/* ---------- contrast bench ---------- */
function contrast(c1, c2) {
  const l1 = luminance(c1.r, c1.g, c1.b), l2 = luminance(c2.r, c2.g, c2.b);
  const [hi, lo] = l1 > l2 ? [l1, l2] : [l2, l1];
  return (hi + .05) / (lo + .05);
}
function updateBench() {
  const demo = $('ctDemo');
  demo.style.color = hex(colA.r, colA.g, colA.b);
  demo.style.background = hex(colB.r, colB.g, colB.b);
  const c = contrast(colA, colB);
  $('ctRatio').textContent = c.toFixed(2) + ' : 1';
  const v = $('ctVerdict');
  if (c >= 7)        { v.textContent = 'AAA — read all night';            v.className = 'ct-verdict pass'; }
  else if (c >= 4.5) { v.textContent = 'AA — solid for body text';        v.className = 'ct-verdict pass'; }
  else if (c >= 3)   { v.textContent = 'LARGE TEXT ONLY (AA large)';      v.className = 'ct-verdict'; }
  else               { v.textContent = 'FAILS — beautiful, but unreadable'; v.className = 'ct-verdict fail'; }
}
$('slotA').addEventListener('click', () => {
  if (sample) { colA = {r: sample.R, g: sample.G, b: sample.B}; updateBench(); }
});
$('slotB').addEventListener('click', () => {
  if (sample) { colB = {r: sample.R, g: sample.G, b: sample.B}; updateBench(); }
});
updateBench();

/* ---------- loop ---------- */
function resize() {
  const r = canvas.getBoundingClientRect();
  renderer.setSize(r.width, r.height, false);
  camera.aspect = r.width / r.height;
  camera.updateProjectionMatrix();
}
addEventListener('resize', resize);
resize();
let t0 = performance.now();
(function frame(now) {
  requestAnimationFrame(frame);
  if (document.hidden) return;
  const dt = Math.min(50, now - t0); t0 = now;
  if (!dragging && !reduced) theta += dt * .00012;
  camera.position.set(
    dist * Math.sin(phi) * Math.sin(theta),
    dist * Math.cos(phi),
    dist * Math.sin(phi) * Math.cos(theta));
  camera.lookAt(0, 0, 0);
  renderer.render(scene, camera);
})(performance.now());
