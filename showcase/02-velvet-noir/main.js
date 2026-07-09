// VELVET NOIR — scroll choreography + la pyramide
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* nav veil */
const nav = document.getElementById('nav');
addEventListener('scroll', () => nav.classList.toggle('scrolled', scrollY > 40), {passive:true});

/* reduced motion: freeze the film on its poster */
const video = document.getElementById('heroVideo');
if (reduced && video) { video.pause(); video.removeAttribute('autoplay'); }

/* ---------- la pyramide data ---------- */
const EAUX = {
  encre: {
    tete:'Bergamote noire', coeur:'Iris · Encre', fond:'Cuir',
    note:'Nuit d’Encre — the hour of writing. Its base outlasts the night by a page or two.'
  },
  oud: {
    tete:'Encens', coeur:'Oud du Laos', fond:'Ambre gris',
    note:'Oud Liturgie — the hour of ceremony. The amber base behaves like embers: warmer the longer you stay.'
  },
  cire: {
    tete:'Miel noir', coeur:'Cire d’abeille', fond:'Fumée',
    note:'Cire Perdue — the hour of the last candle. Sillage like smoke after the flame.'
  }
};
const STRATA_LINES = {
  tete:'The opening — gone in twenty minutes, remembered all night.',
  coeur:'The heart — where the composition tells the truth.',
  fond:'The base — what the pillow keeps until dawn.'
};
const nTete=document.getElementById('nTete'),
      nCoeur=document.getElementById('nCoeur'),
      nFond=document.getElementById('nFond'),
      pyNote=document.getElementById('pyNote');
let currentEau='encre';

function setEau(key){
  currentEau=key;
  const e=EAUX[key];
  if(!reduced && window.gsap){
    gsap.fromTo([nTete,nCoeur,nFond],{opacity:0,y:6},{opacity:1,y:0,duration:.5,stagger:.08,
      onStart(){nTete.textContent=e.tete;nCoeur.textContent=e.coeur;nFond.textContent=e.fond}});
    gsap.fromTo(pyNote,{opacity:0},{opacity:1,duration:.6,delay:.15,
      onStart(){pyNote.textContent=e.note}});
  }else{
    nTete.textContent=e.tete;nCoeur.textContent=e.coeur;nFond.textContent=e.fond;
    pyNote.textContent=e.note;
  }
}
document.querySelectorAll('.py-tabs [data-py]').forEach(tab=>{
  tab.addEventListener('click',()=>{
    document.querySelectorAll('.py-tabs [data-py]').forEach(t=>t.setAttribute('aria-selected',t===tab?'true':'false'));
    setEau(tab.dataset.py);
  });
});
document.querySelectorAll('.stratum').forEach(s=>{
  const show=()=>{pyNote.textContent=STRATA_LINES[s.dataset.s]};
  const back=()=>{pyNote.textContent=EAUX[currentEau].note};
  s.addEventListener('mouseenter',show); s.addEventListener('mouseleave',back);
  s.addEventListener('focus',show); s.addEventListener('blur',back);
});

/* eau rows link → pyramid tab */
document.querySelectorAll('.eau').forEach(row=>{
  row.querySelector('.eau-link').addEventListener('click',()=>{
    const key=row.dataset.eau;
    document.querySelectorAll('.py-tabs [data-py]').forEach(t=>t.setAttribute('aria-selected',t.dataset.py===key?'true':'false'));
    setEau(key);
  });
});

/* ---------- GSAP choreography ---------- */
if(!reduced && window.gsap && window.ScrollTrigger){
  gsap.registerPlugin(ScrollTrigger);

  // hero entrance
  gsap.timeline({defaults:{ease:'power3.out'}})
    .from('.hero-over',{opacity:0,y:14,duration:.9,delay:.25})
    .from('.wordmark',{opacity:0,y:34,duration:1.25,letterSpacing:'.12em'},'-=.5')
    .from('.hero-rule',{opacity:0,scaleX:.55,duration:.9},'-=.65')
    .from('.hero-tag',{opacity:0,y:12,duration:.8},'-=.55')
    .from('.scroll-cue',{opacity:0,duration:.7},'-=.3');

  // manifesto fragments
  gsap.from('.m-frag',{
    scrollTrigger:{trigger:'.manifesto',start:'top 68%'},
    opacity:0,y:36,duration:1.05,stagger:.17,ease:'power3.out'
  });
  gsap.from('.manifesto-sub',{
    scrollTrigger:{trigger:'.manifesto',start:'top 55%'},
    opacity:0,y:18,duration:.9,delay:.4
  });

  // collection head card
  gsap.from('.ci-head',{
    scrollTrigger:{trigger:'.ci-head',start:'top 88%'},
    opacity:0,y:44,duration:1
  });

  // eau rows
  document.querySelectorAll('.eau').forEach(row=>{
    const flip=row.classList.contains('eau-flip');
    gsap.from(row.querySelector('.eau-fig'),{
      scrollTrigger:{trigger:row,start:'top 74%'},
      opacity:0,x:flip?46:-46,duration:1.1,ease:'power3.out'
    });
    gsap.from(row.querySelector('.eau-body'),{
      scrollTrigger:{trigger:row,start:'top 74%'},
      opacity:0,x:flip?-30:30,duration:1.1,delay:.12,ease:'power3.out'
    });
  });

  // pyramid strata rise
  gsap.from('.stratum',{
    scrollTrigger:{trigger:'.py-tri',start:'top 80%'},
    opacity:0,y:26,duration:.8,stagger:.14,ease:'power2.out'
  });

  // muse
  gsap.from('.muse-fig',{
    scrollTrigger:{trigger:'.muse',start:'top 72%'},
    opacity:0,scale:1.06,duration:1.3,ease:'power2.out'
  });
  gsap.from('.muse-text',{
    scrollTrigger:{trigger:'.muse',start:'top 72%'},
    opacity:0,y:26,duration:1,delay:.15
  });

  // ghost wordmark drift
  gsap.from('.maison-word',{
    scrollTrigger:{trigger:'.maison',start:'top 92%'},
    y:'42%',opacity:0,duration:1.4,ease:'power2.out'
  });

  // slow parallax on hero video after scroll
  gsap.to('.hero-video',{
    scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:true},
    y:'12%',scale:1.05
  });
}
