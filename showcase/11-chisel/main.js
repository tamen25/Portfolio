// CHISEL — a generated statue, lifted to real geometry, lit by your cursor.
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const canvas = document.getElementById('room');
const renderer = new THREE.WebGLRenderer({canvas, antialias: true});
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.1;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0F0F11);
scene.fog = new THREE.Fog(0x0F0F11, 6, 14);
const camera = new THREE.PerspectiveCamera(38, 1, .1, 60);

/* ---------- room ---------- */
const floor = new THREE.Mesh(
  new THREE.CircleGeometry(9, 48),
  new THREE.MeshStandardMaterial({color: 0x141416, roughness: .9, metalness: 0})
);
floor.rotation.x = -Math.PI / 2;
floor.position.y = -1.02;
floor.receiveShadow = true;
scene.add(floor);

const plinth = new THREE.Mesh(
  new THREE.CylinderGeometry(.62, .68, .82, 48),
  new THREE.MeshStandardMaterial({color: 0x151518, roughness: .78, metalness: .05})
);
plinth.position.y = -.62;
plinth.castShadow = plinth.receiveShadow = true;
scene.add(plinth);

// brass ring on the plinth
const ring = new THREE.Mesh(
  new THREE.TorusGeometry(.63, .012, 12, 64),
  new THREE.MeshStandardMaterial({color: 0xB98A44, roughness: .3, metalness: .9})
);
ring.rotation.x = Math.PI / 2;
ring.position.y = -.22;
scene.add(ring);

/* ---------- lights: the visitor holds the key ---------- */
scene.add(new THREE.AmbientLight(0x74767E, .12));
const key = new THREE.SpotLight(0xFFD9A8, 60, 20, .55, .45, 1.6);
key.position.set(2.4, 2.6, 2.4);
key.castShadow = true;
key.shadow.mapSize.set(1024, 1024);
key.shadow.bias = -0.0002;
scene.add(key);
scene.add(key.target);
const rim = new THREE.DirectionalLight(0x7C90C8, .35);
rim.position.set(-3, 1.4, -2.6);
scene.add(rim);

/* ---------- the statue ---------- */
const marble = new THREE.MeshStandardMaterial({
  color: 0xEDEDEA, roughness: .5, metalness: 0,
});
let statue = null, polys = 0;
new GLTFLoader().load('assets/statue.glb', gltf => {
  statue = gltf.scene;
  statue.traverse(o => {
    if (o.isMesh) {
      o.material = marble;
      o.castShadow = o.receiveShadow = true;
      polys += o.geometry.index ? o.geometry.index.count / 3 : o.geometry.attributes.position.count / 3;
    }
  });
  // normalize: center, sit on plinth, ~1.5 world-units tall
  const box = new THREE.Box3().setFromObject(statue);
  const size = box.getSize(new THREE.Vector3());
  const scale = 1.52 / size.y;
  statue.scale.setScalar(scale);
  box.setFromObject(statue);
  const c = box.getCenter(new THREE.Vector3());
  statue.position.sub(c);
  statue.position.y += (box.max.y - box.min.y) / 2 - .21;
  scene.add(statue);
  key.target = statue;
  // placard truths
  const cm = v => Math.round(v * (52 / 1.52) * 100) / 100; // statue fiction: 52cm tall
  document.getElementById('pDims').textContent =
    `${cm(size.x * scale).toFixed(0)} × ${cm(size.y * scale).toFixed(0)} × ${cm(size.z * scale).toFixed(0)} cm`;
  document.getElementById('pPolys').textContent =
    Math.round(polys).toLocaleString('en-US') + ' triangles';
  document.getElementById('loading').classList.add('done');
}, undefined, err => {
  document.getElementById('loading').innerHTML =
    '<span class="mono">THE MARBLE IS STILL IN THE QUARRY — REFRESH IN A MOMENT</span>';
});

/* ---------- cursor = key light ---------- */
let mx = .35, my = .3;
addEventListener('pointermove', e => {
  mx = e.clientX / innerWidth - .5;
  my = e.clientY / innerHeight - .5;
}, {passive: true});

/* drag to orbit */
let theta = .45, dragging = false, px = 0, vTheta = 0;
canvas.addEventListener('pointerdown', e => { dragging = true; px = e.clientX; });
addEventListener('pointermove', e => {
  if (!dragging) return;
  vTheta = (e.clientX - px) * .006;
  theta += vTheta; px = e.clientX;
});
addEventListener('pointerup', () => dragging = false);

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
  if (!dragging) { vTheta *= .92; theta += vTheta; if (!reduced) theta += dt * .00004; }
  const dist = camera.aspect < .9 ? 5.4 : 3.9;
  camera.position.set(dist * Math.sin(theta), .42, dist * Math.cos(theta));
  camera.lookAt(0, .18, 0);
  // key light rides a dome driven by the cursor
  const la = -mx * 2.6 + theta;      // cursor left/right swings the key around the piece
  const lh = 1.2 - my * 2.2;         // cursor up/down raises and lowers it
  key.position.set(3 * Math.sin(la), Math.max(.2, lh), 3 * Math.cos(la));
  key.intensity = 46 + (1 - Math.abs(my)) * 26;
  renderer.render(scene, camera);
})(performance.now());
