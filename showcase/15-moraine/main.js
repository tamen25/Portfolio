// MORAINE — the ice retreats exactly as much as the record says.
import * as THREE from 'three';

const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const canvas = document.getElementById('ice');
const renderer = new THREE.WebGLRenderer({canvas, antialias: false});
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
const scene = new THREE.Scene();
const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

const uniforms = {
  uTime: {value: 0},
  uMelt: {value: 0},         // 0 = 1850 full ice · 1 = all ice gone
  uRes: {value: new THREE.Vector2(1, 1)},
  uMouse: {value: new THREE.Vector2(.5, .5)},
};
scene.add(new THREE.Mesh(
  new THREE.PlaneGeometry(2, 2),
  new THREE.ShaderMaterial({
    uniforms,
    vertexShader: `void main(){ gl_Position = vec4(position, 1.); }`,
    fragmentShader: /*glsl*/`
      precision highp float;
      uniform float uTime, uMelt;
      uniform vec2 uRes, uMouse;

      float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
      float noise(vec2 p){
        vec2 i = floor(p), f = fract(p);
        f = f * f * (3. - 2. * f);
        return mix(mix(hash(i), hash(i + vec2(1, 0)), f.x),
                   mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), f.x), f.y);
      }
      float fbm(vec2 p){
        float a = 0., amp = .5;
        for(int i = 0; i < 5; i++){ a += amp * noise(p); p *= 2.03; amp *= .5; }
        return a;
      }

      void main(){
        vec2 uv = gl_FragCoord.xy / uRes;
        vec2 p = uv * vec2(uRes.x / uRes.y, 1.) * 3.2;

        // the ice edge: ice fills the screen in 1850 and retreats upward as uMelt grows
        float ragged = (fbm(vec2(uv.x * 6.0, 3.7)) - .5) * .18;
        float th = uMelt * .96 + ragged;         // rock below th, ice above
        float iceMask = smoothstep(th - .012, th + .012, uv.y);

        // ---- rock (exposed ground) ----
        float rn = fbm(p * 1.7 + 9.0);
        vec3 rock = mix(vec3(.045, .055, .07), vec3(.10, .115, .13), rn);
        // moraine stripes — the receipt
        float strat = smoothstep(.42, .5, noise(vec2(uv.y * 60.0, uv.x * 2.0)));
        rock = mix(rock, vec3(.14, .13, .12), strat * .25 * (1.0 - uv.y));
        // meltwater pooling just below the ice edge
        float pool = smoothstep(.06, .0, th - uv.y) * step(uv.y, th) * uMelt;
        rock = mix(rock, vec3(.10, .48, .47), pool * .6);

        // ---- ice ----
        vec2 drift = vec2(uTime * .008, uTime * .004);
        float veins = fbm(p * 2.2 + drift);
        float deep  = fbm(p * .8 - drift * .5);
        vec3 ice = mix(vec3(.48, .70, .82), vec3(.86, .95, .99), veins);
        ice = mix(ice, vec3(.24, .52, .70), deep * .55);
        // crevasses
        float cr = smoothstep(.48, .5, noise(p * vec2(1.2, 7.0) + 4.0));
        ice = mix(ice, vec3(.16, .36, .55), cr * .5);
        // sparkle — rare, tiny, modulated by the vein structure
        float sp = step(.9986, hash(floor(p * 90.0) + floor(uTime * 2.0)));
        ice += sp * veins * .3;
        // mouse lens: a warm breath on the ice
        float lens = smoothstep(.24, .0, distance(uv, uMouse));
        ice = mix(ice, vec3(.95, .98, 1.0), lens * .18);

        vec3 col = mix(rock, ice, iceMask);
        // edge glow line
        float edgeLine = smoothstep(.012, .0, abs(uv.y - th)) * step(.02, uMelt);
        col += vec3(.5, .85, .95) * edgeLine * .5;
        // vignette
        col *= 1.0 - .35 * pow(distance(uv, vec2(.5, .45)), 1.6);
        gl_FragColor = vec4(col, 1.);
      }`
  })
));

function resize() {
  renderer.setSize(innerWidth, innerHeight, false);
  uniforms.uRes.value.set(innerWidth * Math.min(devicePixelRatio, 2), innerHeight * Math.min(devicePixelRatio, 2));
}
addEventListener('resize', resize);
resize();
addEventListener('pointermove', e => {
  uniforms.uMouse.value.set(e.clientX / innerWidth, 1 - e.clientY / innerHeight);
}, {passive: true});

/* ---------- data binding: scroll = time = published melt ---------- */
const BASE = 710; // acres, 1850
const eras = [...document.querySelectorAll('.era')].map(el => ({
  el, year: +el.dataset.year, acres: +el.dataset.acres
}));
const gYear = document.getElementById('gYear');
const gArea = document.getElementById('gArea');
const gPct = document.getElementById('gPct');

const io = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) e.target.classList.add('seen');
}), {threshold: .3});
eras.forEach(e => io.observe(e.el));

function update() {
  const mid = scrollY + innerHeight * .5;
  // find surrounding eras and interpolate year/acres between them
  let a = {year: 1850, acres: BASE, pos: 0}, b = null;
  for (const e of eras) {
    const pos = e.el.offsetTop + e.el.offsetHeight / 2;
    if (pos <= mid) a = {year: e.year, acres: e.acres, pos};
    else { b = {year: e.year, acres: e.acres, pos}; break; }
  }
  let year = a.year, acres = a.acres;
  if (b) {
    const t = Math.min(1, Math.max(0, (mid - a.pos) / (b.pos - a.pos)));
    year = Math.round(a.year + (b.year - a.year) * t);
    acres = Math.round(a.acres + (b.acres - a.acres) * t);
  }
  uniforms.uMelt.value = (BASE - acres) / BASE;
  gYear.textContent = year;
  gArea.textContent = acres + ' acres of ice';
  gPct.textContent = Math.round(acres / BASE * 100) + '% remains';
}
addEventListener('scroll', update, {passive: true});
update();

let t0 = performance.now();
(function frame(now) {
  requestAnimationFrame(frame);
  if (document.hidden) return;
  if (!reduced) uniforms.uTime.value += Math.min(50, now - t0) / 1000;
  t0 = now;
  renderer.render(scene, camera);
})(performance.now());
