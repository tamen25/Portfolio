// TERRA OBSCURA — TSK-01 "Cartograph"
// Live procedural terrain: CPU heightfield → GPU displacement → per-pixel contours.
import * as THREE from 'three';

/* ---------------- seeded noise ---------------- */
function mulberry32(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
class Simplex{
  constructor(rand){
    this.p=new Uint8Array(512);const perm=new Uint8Array(256);
    for(let i=0;i<256;i++)perm[i]=i;
    for(let i=255;i>0;i--){const j=Math.floor(rand()*(i+1));[perm[i],perm[j]]=[perm[j],perm[i]]}
    for(let i=0;i<512;i++)this.p[i]=perm[i&255];
    this.grad=[[1,1],[-1,1],[1,-1],[-1,-1],[1,0],[-1,0],[0,1],[0,-1]];
  }
  noise(x,y){
    const F=0.5*(Math.sqrt(3)-1),G=(3-Math.sqrt(3))/6;
    const s=(x+y)*F,i=Math.floor(x+s),j=Math.floor(y+s),t=(i+j)*G;
    const x0=x-(i-t),y0=y-(j-t);
    const i1=x0>y0?1:0,j1=x0>y0?0:1;
    const x1=x0-i1+G,y1=y0-j1+G,x2=x0-1+2*G,y2=y0-1+2*G;
    const ii=i&255,jj=j&255;let n=0;
    let t0=0.5-x0*x0-y0*y0;
    if(t0>0){const g=this.grad[this.p[ii+this.p[jj]]&7];t0*=t0;n+=t0*t0*(g[0]*x0+g[1]*y0)}
    let t1=0.5-x1*x1-y1*y1;
    if(t1>0){const g=this.grad[this.p[ii+i1+this.p[jj+j1]]&7];t1*=t1;n+=t1*t1*(g[0]*x1+g[1]*y1)}
    let t2=0.5-x2*x2-y2*y2;
    if(t2>0){const g=this.grad[this.p[ii+1+this.p[jj+1]]&7];t2*=t2;n+=t2*t2*(g[0]*x2+g[1]*y2)}
    return 70*n;
  }
}

/* ---------------- heightfield ---------------- */
const N=256, SIZE=2.4, BASE_RELIEF=0.42;
function buildField(seed){
  const rand=mulberry32(seed);
  const sx=new Simplex(rand);
  const off1=rand()*100, off2=rand()*100;
  const fbm=(x,y,oct)=>{let a=0,amp=.5,f=1;for(let o=0;o<oct;o++){a+=amp*sx.noise(x*f,y*f);amp*=.5;f*=2}return a};
  const data=new Float32Array(N*N);
  for(let iy=0;iy<N;iy++)for(let ix=0;ix<N;ix++){
    const nx=(ix/N-.5)*2.55+off1, ny=(iy/N-.5)*2.55+off2;
    const wx=fbm(nx+5.2,ny+1.3,3)*.42, wy=fbm(nx-3.1,ny+4.7,3)*.42;      // domain warp
    let e=fbm(nx+wx,ny+wy,6);
    const ridge=1-Math.abs(fbm(nx*1.55+wy,ny*1.55+wx,4));                  // ridged component
    e=e*.70+(ridge*2-1)*.30-.09;   // -.09 recenters ridge bias so the sea slider midpoint bites
    data[iy*N+ix]=e;
  }
  // fixed global scale (not per-seed stretch) so APEX/NADIR are honest per world
  let apex={h:-1,i:0}, nadir={h:2,i:0};
  const hist=new Float32Array(48);
  for(let k=0;k<N*N;k++){
    const h=Math.min(1,Math.max(0,(data[k]+1.05)/2.1)); data[k]=h;
    if(h>apex.h)apex={h,i:k};
    if(h<nadir.h)nadir={h,i:k};
    hist[Math.min(47,h*48|0)]++;
  }
  let hm=0; for(const v of hist) hm=Math.max(hm,v);
  for(let b=0;b<48;b++)hist[b]/=hm;
  return {data,apex,nadir,hist};
}
const landPct=(data,sea)=>{let c=0;for(let k=0;k<data.length;k++)if(data[k]>=sea)c++;return Math.round(100*c/data.length)};

/* ---------------- three setup ---------------- */
const stage=document.getElementById('stage');
const canvas=document.getElementById('scene');
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
let renderer;
try{
  renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:true});
}catch(e){
  stage.innerHTML='<p style="padding:40px;font-family:monospace">WebGL unavailable — the instrument needs a GPU. The rest of the survey continues below.</p>';
  throw e;
}
renderer.setPixelRatio(Math.min(devicePixelRatio,2));
const camera=new THREE.PerspectiveCamera(36,1,.1,50);
const scene=new THREE.Scene();

let seed=(Math.random()*0xFFFFFFFF)>>>0;
let field=buildField(seed);
const tex=new THREE.DataTexture(field.data,N,N,THREE.RedFormat,THREE.FloatType);
tex.needsUpdate=true;

const uniforms={
  uHeight:{value:tex},
  uSea:{value:.475},
  uRelief:{value:BASE_RELIEF},
  uTime:{value:0},
  uTexel:{value:1/N},
};
const material=new THREE.ShaderMaterial({
  uniforms,
  vertexShader:/*glsl*/`
    uniform sampler2D uHeight; uniform float uRelief;
    varying float vH; varying vec2 vUv;
    void main(){
      vUv=uv;
      float h=texture2D(uHeight,uv).r;
      vH=h;
      vec3 p=position; p.z+=h*uRelief;
      gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.);
    }`,
  fragmentShader:/*glsl*/`
    uniform sampler2D uHeight; uniform float uSea,uTime,uTexel,uRelief;
    varying float vH; varying vec2 vUv;
    float cline(float h,float st){
      float f=abs(fract(h/st-.5)-.5)*st;
      float w=fwidth(h)*1.3;
      return 1.-smoothstep(0.,max(w,1e-5),f);
    }
    void main(){
      float h=vH;
      // slope shading from neighbors
      float hx=texture2D(uHeight,vUv+vec2(uTexel,0.)).r-texture2D(uHeight,vUv-vec2(uTexel,0.)).r;
      float hy=texture2D(uHeight,vUv+vec2(0.,uTexel)).r-texture2D(uHeight,vUv-vec2(0.,uTexel)).r;
      vec3 nrm=normalize(vec3(-hx*22.*uRelief,-hy*22.*uRelief,1.));
      float light=clamp(dot(nrm,normalize(vec3(-.55,.4,.74))),0.,1.);
      vec3 col;
      if(h<uSea){
        float d=(uSea-h)/max(uSea,1e-4);
        col=mix(vec3(.075,.20,.235),vec3(.016,.05,.068),pow(d,.7));
        col=mix(col,col*vec3(.85,1.,1.05),.5+.5*light);
        float dc=cline(h,.05);
        col=mix(col,vec3(.35,.55,.58),dc*.10);
      }else{
        float t=(h-uSea)/max(1.-uSea,1e-4);
        vec3 c1=vec3(.11,.066,.012),c2=vec3(.47,.235,.0),c3=vec3(1.,.69,.0),c4=vec3(1.,.92,.72);
        col=t<.34?mix(c1,c2,t/.34):t<.67?mix(c2,c3,(t-.34)/.33):mix(c3,c4,(t-.67)/.33);
        col*= .5+.55*light;
        float minor=cline(h,.02), major=cline(h,.10);
        col=mix(col,vec3(.91,.89,.855),minor*.09+major*.20);
      }
      // shoreline ink
      float sl=1.-smoothstep(0.,.0045,abs(h-uSea));
      col=mix(col,vec3(.93,.91,.87),sl*.8);
      // faint survey grid
      vec2 g=abs(fract(vUv*16.)-.5);
      float grid=1.-smoothstep(.0,.04,min(g.x,g.y));
      col=mix(col,vec3(.9),grid*.028);
      // scan sweep
      float s=abs(fract(vUv.y-uTime*.05)-.5);
      col+=vec3(1.,.75,.3)*smoothstep(.02,.0,s)*.14;
      // edge fade
      float ef=smoothstep(.5,.435,max(abs(vUv.x-.5),abs(vUv.y-.5)));
      gl_FragColor=vec4(col,ef);
    }`,
  transparent:true,
});
const geo=new THREE.PlaneGeometry(SIZE,SIZE,N-1,N-1);
const mesh=new THREE.Mesh(geo,material);
mesh.rotation.x=-Math.PI/2;
scene.add(mesh);

/* base plinth: thin dark slab under terrain for mass */
const plinth=new THREE.Mesh(
  new THREE.BoxGeometry(SIZE*1.001,.05,SIZE*1.001),
  new THREE.MeshBasicMaterial({color:0x0d0f13})
);
plinth.position.y=-.028;
scene.add(plinth);

/* ---------------- camera orbit ---------------- */
let theta=.72, phi=1.02, radius=2.62;
let vTheta=0, vPhi=0, lastPointer=0, dragging=false, px=0, py=0;
function placeCamera(){
  phi=Math.min(1.32,Math.max(.55,phi));
  camera.position.set(
    radius*Math.sin(phi)*Math.sin(theta),
    radius*Math.cos(phi),
    radius*Math.sin(phi)*Math.cos(theta));
  camera.lookAt(0,.14,0);
}
canvas.addEventListener('pointerdown',e=>{dragging=true;px=e.clientX;py=e.clientY;canvas.setPointerCapture(e.pointerId)});
addEventListener('pointermove',e=>{
  if(!dragging)return;
  vTheta=(e.clientX-px)*.005; vPhi=-(e.clientY-py)*.004;
  theta+=vTheta; phi+=vPhi;
  px=e.clientX; py=e.clientY; lastPointer=performance.now();
});
addEventListener('pointerup',()=>dragging=false);

/* ---------------- HUD refs ---------------- */
const $=id=>document.getElementById(id);
const seedLabel=$('seedLabel'),landLine=$('landLine'),reliefLine=$('reliefLine'),fovLine=$('fovLine');
const coApex=$('calloutApex'),coNadir=$('calloutNadir'),apexVal=$('apexVal'),nadirVal=$('nadirVal');
const leaders=$('leaders');
leaders.innerHTML=`
  <circle id="cA" r="4"/><line id="lA"/>
  <circle id="cN" r="4"/><line id="lN"/>`;
const cA=$('cA'),lA=$('lA'),cN=$('cN'),lN=$('lN');

const hex=s=>'0x'+s.toString(16).toUpperCase().padStart(8,'0');
function gridToLocal(i){
  const ix=i%N, iy=(i/N)|0;
  // PlaneGeometry: x -half..+half (u 0..1), y +half..-half (v 1..0)
  const u=ix/(N-1), v=iy/(N-1);
  return new THREE.Vector3((u-.5)*SIZE,(v-.5)*SIZE,0);
}
function updateStats(){
  seedLabel.textContent=hex(seed);
  landLine.textContent=`LAND ${landPct(field.data,uniforms.uSea.value)}%`;
  reliefLine.textContent=`RELIEF ×${(uniforms.uRelief.value/BASE_RELIEF).toFixed(2)}`;
  apexVal.textContent=`ALT ${field.apex.h.toFixed(3)}`;
  const depth=uniforms.uSea.value-field.nadir.h;
  nadirVal.textContent=depth>0?`DEPTH −${depth.toFixed(3)}`:`ALT ${field.nadir.h.toFixed(3)}`;
  drawHisto(); drawRaster(); drawProfile();
}
const projV=new THREE.Vector3();
function placeCallout(i,h,co,circ,line){
  const local=gridToLocal(i); local.z=h*uniforms.uRelief.value;
  projV.copy(local); mesh.localToWorld(projV); projV.project(camera);
  const r=canvas.getBoundingClientRect();
  const x=(projV.x*.5+.5)*r.width, y=(-projV.y*.5+.5)*r.height;
  const vis=projV.z<1&&x>130&&x<r.width-250&&y>115&&y<r.height-150;
  co.style.opacity=vis?1:0; circ.style.opacity=vis?.85:0; line.style.opacity=vis?.65:0;
  if(!vis)return;
  co.style.left=x+'px'; co.style.top=(y-46)+'px';
  circ.setAttribute('cx',x); circ.setAttribute('cy',y);
  line.setAttribute('x1',x); line.setAttribute('y1',y-4);
  line.setAttribute('x2',x); line.setAttribute('y2',y-46);
}

/* ---------------- histogram + raster ---------------- */
const histo=$('histo'),hctx=histo.getContext('2d');
function drawHisto(){
  const w=histo.width,hh=histo.height;
  hctx.clearRect(0,0,w,hh);
  const bw=w/48;
  for(let b=0;b<48;b++){
    const v=field.hist[b];
    hctx.fillStyle=b/48<uniforms.uSea.value?'rgba(60,140,150,.75)':'rgba(255,176,0,.75)';
    hctx.fillRect(b*bw,hh-v*(hh-6),bw-1.2,v*(hh-6));
  }
  const sx=uniforms.uSea.value*w;
  hctx.strokeStyle='rgba(232,228,218,.8)'; hctx.setLineDash([3,3]);
  hctx.beginPath(); hctx.moveTo(sx,0); hctx.lineTo(sx,hh); hctx.stroke(); hctx.setLineDash([]);
}
const raster=$('raster'),rctx=raster.getContext('2d');
function drawRaster(){
  raster.width=raster.clientWidth*Math.min(devicePixelRatio,2);
  const w=raster.width,hh=raster.height=26*Math.min(devicePixelRatio,2);
  rctx.clearRect(0,0,w,hh);
  const step=7*Math.min(devicePixelRatio,2);
  for(let x=0;x<w;x+=step){
    const bin=field.hist[Math.min(47,(x/w*48)|0)];
    const dots=Math.round(bin*3);
    for(let d=0;d<3;d++){
      rctx.fillStyle=d<dots?'rgba(255,176,0,.55)':'rgba(232,228,218,.10)';
      rctx.fillRect(x,hh-6-d*(hh/3.4),2.4,2.4);
    }
  }
}

/* ---------------- profile A—A' (row through apex) ---------------- */
const profile=$('profile'),pctx=profile?profile.getContext('2d'):null;
function drawProfile(){
  if(!pctx)return;
  const w=profile.width,hh=profile.height;
  pctx.clearRect(0,0,w,hh);
  const iy=(field.apex.i/N)|0, sea=uniforms.uSea.value, pad=3;
  // sea fill
  pctx.fillStyle='rgba(60,140,150,.25)';
  const seaY=hh-pad-sea*(hh-2*pad);
  pctx.fillRect(0,seaY,w,hh-pad-seaY);
  // terrain line
  pctx.beginPath();
  for(let x=0;x<w;x++){
    const h=field.data[iy*N+Math.min(N-1,(x/w*N)|0)];
    const y=hh-pad-h*(hh-2*pad);
    x===0?pctx.moveTo(x,y):pctx.lineTo(x,y);
  }
  pctx.strokeStyle='rgba(255,176,0,.9)'; pctx.lineWidth=1.2; pctx.stroke();
  // sea line
  pctx.strokeStyle='rgba(232,228,218,.5)'; pctx.setLineDash([3,3]);
  pctx.beginPath(); pctx.moveTo(0,seaY); pctx.lineTo(w,seaY); pctx.stroke(); pctx.setLineDash([]);
}

/* ---------------- controls ---------------- */
function setWorld(s){
  seed=s>>>0;
  field=buildField(seed);
  tex.image.data=field.data; tex.needsUpdate=true;
  updateStats(); needsRender=true;
}
$('reseed').addEventListener('click',()=>setWorld(Math.random()*0xFFFFFFFF));

/* survey log rows load their world into the instrument */
document.querySelectorAll('.log-row[data-seed]').forEach(row=>{
  const load=()=>{
    setWorld(parseInt(row.dataset.seed,16));
    document.getElementById('instrument').scrollIntoView({behavior:reduced?'auto':'smooth'});
  };
  row.addEventListener('click',load);
  row.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();load()}});
});
$('sea').addEventListener('input',e=>{
  uniforms.uSea.value=+e.target.value;
  landLine.textContent=`LAND ${landPct(field.data,uniforms.uSea.value)}%`;
  const depth=uniforms.uSea.value-field.nadir.h;
  nadirVal.textContent=depth>0?`DEPTH −${depth.toFixed(3)}`:`ALT ${field.nadir.h.toFixed(3)}`;
  drawHisto(); drawProfile(); needsRender=true;
});
$('relief').addEventListener('input',e=>{
  uniforms.uRelief.value=BASE_RELIEF*+e.target.value;
  reliefLine.textContent=`RELIEF ×${(+e.target.value).toFixed(2)}`;
  needsRender=true;
});

/* ---------------- clock ---------------- */
const clock=$('clock');
setInterval(()=>{
  clock.textContent=new Date().toISOString().slice(11,19)+'Z';
},1000);

/* ---------------- loop ---------------- */
let needsRender=true, inView=true;
new IntersectionObserver(en=>inView=en[0].isIntersecting,{threshold:.02}).observe(stage);
function resize(){
  const r=stage.getBoundingClientRect();
  renderer.setSize(r.width,r.height,false);
  camera.aspect=r.width/r.height; camera.updateProjectionMatrix();
  radius=camera.aspect<0.9?2.62+(0.9-camera.aspect)*1.9:2.62;   // pull back on narrow screens
  leaders.setAttribute('viewBox',`0 0 ${r.width} ${r.height}`);
  drawRaster(); needsRender=true;
}
addEventListener('resize',resize); resize();

let t0=performance.now();
function frame(now){
  requestAnimationFrame(frame);
  if(!inView||document.hidden)return;
  const dt=Math.min(.05,(now-t0)/1000); t0=now;
  const idle=!dragging&&now-lastPointer>2500;
  if(!reduced){
    uniforms.uTime.value+=dt;
    if(idle)theta+=dt*.07;
    needsRender=true;
  }
  if(!dragging){vTheta*=.9;vPhi*=.9;theta+=vTheta;phi+=vPhi;if(Math.abs(vTheta)>1e-4)needsRender=true}
  if(needsRender||dragging){
    placeCamera();
    renderer.render(scene,camera);
    placeCallout(field.apex.i,field.apex.h,coApex,cA,lA);
    placeCallout(field.nadir.i,field.nadir.h,coNadir,cN,lN);
    if(reduced)needsRender=false;
  }
  fovLine.textContent=idle&&!reduced?'DRIFT AUTO':'DRIFT MANUAL';
}
updateStats();
placeCamera();
requestAnimationFrame(frame);
