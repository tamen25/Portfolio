// ORBITAL — a private space line. The numbers are real physics.
import * as THREE from 'three';

const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const canvas = document.getElementById('space');
const renderer = new THREE.WebGLRenderer({canvas, antialias: true, alpha: true});
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(42, 1, .1, 400);

/* ---------- Earth: graticule + atmosphere (no textures) ---------- */
const R = 1;
const earth = new THREE.Group();
// body
earth.add(new THREE.Mesh(
  new THREE.SphereGeometry(R, 48, 48),
  new THREE.MeshBasicMaterial({color: 0x0A1024})
));
// graticule
const gratMat = new THREE.LineBasicMaterial({color: 0x4F7BD9, transparent: true, opacity: .32});
for (let lat = -60; lat <= 60; lat += 30) {
  const r = R * Math.cos(lat * Math.PI / 180), y = R * Math.sin(lat * Math.PI / 180);
  const pts = [];
  for (let i = 0; i <= 90; i++) {
    const a = i / 90 * Math.PI * 2;
    pts.push(new THREE.Vector3(r * Math.cos(a), y, r * Math.sin(a)));
  }
  earth.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), gratMat));
}
for (let lon = 0; lon < 180; lon += 30) {
  const pts = [];
  for (let i = 0; i <= 90; i++) {
    const a = i / 90 * Math.PI * 2;
    const v = new THREE.Vector3(R * Math.cos(a), R * Math.sin(a), 0);
    v.applyAxisAngle(new THREE.Vector3(0, 1, 0), lon * Math.PI / 180);
    pts.push(v);
  }
  earth.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), gratMat));
}
// city lights: random points biased to northern latitudes
{
  const N = 900, pos = new Float32Array(N * 3);
  for (let i = 0; i < N; i++) {
    const lat = (Math.random() ** 1.6) * 1.1 - .25 + Math.random() * .4;
    const lon = Math.random() * Math.PI * 2;
    const r = R * 1.002;
    pos[i*3]   = r * Math.cos(lat) * Math.cos(lon);
    pos[i*3+1] = r * Math.sin(lat);
    pos[i*3+2] = r * Math.cos(lat) * Math.sin(lon);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  earth.add(new THREE.Points(g, new THREE.PointsMaterial({
    color: 0xF0D89A, size: .012, transparent: true, opacity: .8
  })));
}
scene.add(earth);

// atmosphere: additive fresnel shell
scene.add(new THREE.Mesh(
  new THREE.SphereGeometry(R * 1.08, 48, 48),
  new THREE.ShaderMaterial({
    transparent: true, blending: THREE.AdditiveBlending, side: THREE.BackSide,
    vertexShader: `varying vec3 vN; varying vec3 vP;
      void main(){ vN = normalize(normalMatrix * normal);
        vec4 mv = modelViewMatrix * vec4(position,1.); vP = mv.xyz;
        gl_Position = projectionMatrix * mv; }`,
    fragmentShader: `varying vec3 vN; varying vec3 vP;
      void main(){
        float rim = pow(1. - abs(dot(normalize(vN), normalize(-vP))), 2.6);
        gl_FragColor = vec4(vec3(.31,.48,.85) * rim, rim * .9); }`
  })
));

// stars
{
  const N = 1400, pos = new Float32Array(N * 3);
  for (let i = 0; i < N; i++) {
    const v = new THREE.Vector3().randomDirection().multiplyScalar(120 + Math.random() * 160);
    pos.set([v.x, v.y, v.z], i * 3);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  scene.add(new THREE.Points(g, new THREE.PointsMaterial({color: 0xF2EFE9, size: .35, transparent: true, opacity: .7})));
}

/* ---------- orbits (real geometry, real math) ---------- */
const MU = 398600; // km³/s² Earth
const R_E = 6371;  // km
const ORBITS = [
  { alt: 400,  incl: 28.5, name: 'The Weekender',      dur: '3 days',  scaleR: () => R * (1 + 400/R_E * 2.2) },
  { alt: 800,  incl: 98,   name: 'Polar Sunrise Line', dur: '10 days', scaleR: () => R * (1 + 800/R_E * 2.2) },
  { alt: null, incl: 12,   name: 'The Long Way Home',  dur: '6 days',  scaleR: () => R * 2.6 } // stylized lunar ellipse
];
const orbitLines = [], orbitGroups = [];
ORBITS.forEach((o, i) => {
  const grp = new THREE.Group();
  let curve;
  if (o.alt !== null) {
    const r = o.scaleR();
    curve = new THREE.EllipseCurve(0, 0, r, r, 0, Math.PI * 2);
  } else {
    curve = new THREE.EllipseCurve(R * .9, 0, R * 2.1, R * 1.15, 0, Math.PI * 2); // eccentric free-return
  }
  const pts = curve.getPoints(200).map(p => new THREE.Vector3(p.x, 0, p.y));
  const line = new THREE.LineLoop(
    new THREE.BufferGeometry().setFromPoints(pts),
    new THREE.LineBasicMaterial({color: 0xD8B25C, transparent: true, opacity: .18})
  );
  grp.add(line);
  grp.rotation.x = THREE.MathUtils.degToRad(o.incl);
  grp.rotation.z = THREE.MathUtils.degToRad(i * 24 - 20);
  scene.add(grp);
  orbitLines.push(line);
  orbitGroups.push({grp, curve});
});

// the cabin: a champagne glow moving on the selected orbit
const cabin = new THREE.Mesh(
  new THREE.SphereGeometry(.028, 12, 12),
  new THREE.MeshBasicMaterial({color: 0xF0D89A})
);
const cabinGlow = new THREE.Sprite(new THREE.SpriteMaterial({
  map: (() => {
    const c = document.createElement('canvas'); c.width = c.height = 64;
    const x = c.getContext('2d');
    const g = x.createRadialGradient(32,32,0,32,32,32);
    g.addColorStop(0,'rgba(240,216,154,.9)'); g.addColorStop(.4,'rgba(240,216,154,.25)'); g.addColorStop(1,'rgba(240,216,154,0)');
    x.fillStyle = g; x.fillRect(0,0,64,64);
    return new THREE.CanvasTexture(c);
  })(),
  transparent: true, blending: THREE.AdditiveBlending
}));
cabinGlow.scale.set(.34,.34,1);
cabin.add(cabinGlow);
scene.add(cabin);

/* ---------- selection + manifest (honest numbers) ---------- */
let sel = 0, cabinT = 0;
const $ = id => document.getElementById(id);
function periodMin(altKm) {
  const a = R_E + altKm;
  return 2 * Math.PI * Math.sqrt(a**3 / MU) / 60;
}
function velocity(altKm) { return Math.sqrt(MU / (R_E + altKm)); }
function select(i) {
  sel = i;
  orbitLines.forEach((l, k) => l.material.opacity = k === i ? .85 : .14);
  document.querySelectorAll('.itin').forEach((b, k) =>
    b.setAttribute('aria-pressed', String(k === i)));
  const o = ORBITS[i];
  if (o.alt !== null) {
    const T = periodMin(o.alt);
    $('mAlt').textContent = o.alt + ' km';
    $('mPeriod').textContent = T.toFixed(1) + ' min';
    $('mSun').textContent = (1440 / T).toFixed(1);
    $('mVel').textContent = velocity(o.alt).toFixed(2) + ' km/s';
  } else {
    $('mAlt').textContent = '400,171 km';
    $('mPeriod').textContent = '6.0 days';
    $('mSun').textContent = '1 — but what a one';
    $('mVel').textContent = '10.9 km/s TLI';
  }
  $('mDur').textContent = o.dur;
}
document.querySelectorAll('.itin').forEach((b, i) =>
  b.addEventListener('click', () => select(i)));
select(0);

/* ---------- camera / drag ---------- */
let theta = .6, phi = 1.25, dist = 4.6, vT = 0, dragging = false, px = 0, py = 0;
canvas.addEventListener('pointerdown', e => { dragging = true; px = e.clientX; py = e.clientY; canvas.setPointerCapture(e.pointerId); });
addEventListener('pointermove', e => {
  if (!dragging) return;
  theta += (e.clientX - px) * .005;
  phi = Math.min(2.6, Math.max(.5, phi - (e.clientY - py) * .004));
  px = e.clientX; py = e.clientY;
});
addEventListener('pointerup', () => dragging = false);

function resize() {
  const r = canvas.getBoundingClientRect();
  renderer.setSize(r.width, r.height, false);
  camera.aspect = r.width / r.height;
  camera.updateProjectionMatrix();
  dist = camera.aspect < .9 ? 6.4 : 4.6;
}
addEventListener('resize', resize);
resize();

let t0 = performance.now();
(function frame(now) {
  requestAnimationFrame(frame);
  if (document.hidden) return;
  const dt = Math.min(50, now - (t0 || now)); t0 = now;
  if (!reduced) {
    earth.rotation.y += dt * .00004;
    if (!dragging) theta += dt * .00002;
    cabinT = (cabinT + dt * .00006) % 1;
  }
  camera.position.set(
    dist * Math.sin(phi) * Math.sin(theta),
    dist * Math.cos(phi),
    dist * Math.sin(phi) * Math.cos(theta));
  camera.lookAt(0, 0, 0);
  // cabin along selected orbit
  const {grp, curve} = orbitGroups[sel];
  const p = curve.getPoint(cabinT);
  cabin.position.set(p.x, 0, p.y).applyEuler(grp.rotation);
  renderer.render(scene, camera);
})(performance.now());
