// STANZA — the type knows what the words mean.
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* split verses into words → chars (words stay unbreakable) */
document.querySelectorAll('[data-split]').forEach(v => {
  const text = v.textContent;
  v.textContent = '';
  v.setAttribute('aria-label', text);
  text.split(/(\s+)/).forEach(tok => {
    if (!tok) return;
    if (/^\s+$/.test(tok)) { v.appendChild(document.createTextNode(' ')); return; }
    const w = document.createElement('span');
    w.className = 'word';
    w.setAttribute('aria-hidden', 'true');
    [...tok].forEach(c => {
      const s = document.createElement('span');
      s.className = 'ch';
      s.textContent = c;
      w.appendChild(s);
    });
    v.appendChild(w);
  });
});

/* theme switching (page weather) — works even with reduced motion */
const themeSections = document.querySelectorAll('[data-theme]');
const themeIO = new IntersectionObserver(es => {
  es.forEach(e => {
    if (e.isIntersecting) document.body.dataset.theme = e.target.dataset.theme;
  });
}, {threshold: .55});
themeSections.forEach(s => themeIO.observe(s));

/* spine active state */
const spineLinks = [...document.querySelectorAll('.spine a')];
const spineIO = new IntersectionObserver(es => {
  es.forEach(e => {
    if (!e.isIntersecting) return;
    spineLinks.forEach(a => a.classList.toggle('active', a.dataset.dot === e.target.id));
  });
}, {threshold: .55});
document.querySelectorAll('.stanza').forEach(s => spineIO.observe(s));

if (!reduced && window.gsap && window.ScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger);
  const chars = sec => sec.querySelectorAll('.ch');

  /* I — GRAVITY: letters fall from above and land with a bounce */
  {
    const sec = document.querySelector('[data-force="gravity"]');
    gsap.from(chars(sec), {
      scrollTrigger: {trigger: sec, start: 'top 62%'},
      y: () => -innerHeight * (0.5 + Math.random() * 0.5),
      opacity: 0,
      duration: 1.35,
      ease: 'bounce.out',
      stagger: {each: .035, from: 'random'}
    });
  }

  /* II — WIND: letters gust in from the left, then never quite settle */
  {
    const sec = document.querySelector('[data-force="wind"]');
    const cs = chars(sec);
    gsap.from(cs, {
      scrollTrigger: {trigger: sec, start: 'top 62%'},
      x: () => -120 - Math.random() * 260,
      y: () => (Math.random() - .5) * 90,
      rotation: () => (Math.random() - .5) * 24,
      opacity: 0,
      duration: 1.15,
      ease: 'power3.out',
      stagger: {each: .022, from: 'end'},
      onComplete() {
        cs.forEach(c => {
          gsap.to(c, {
            x: `+=${(Math.random() - .5) * 10}`,
            y: `+=${(Math.random() - .5) * 7}`,
            rotation: (Math.random() - .5) * 4,
            duration: 1.6 + Math.random() * 2,
            repeat: -1, yoyo: true, ease: 'sine.inOut'
          });
        });
      }
    });
  }

  /* III — TIDE: a wave rolls through the line, forever */
  {
    const sec = document.querySelector('[data-force="tide"]');
    sec.querySelectorAll('.verse').forEach((v, vi) => {
      const cs = v.querySelectorAll('.ch');
      gsap.from(cs, {
        scrollTrigger: {trigger: sec, start: 'top 62%'},
        opacity: 0, y: 26, duration: .9, stagger: .02
      });
      gsap.to(cs, {
        scrollTrigger: {trigger: sec, start: 'top 62%'},
        y: '-=12',
        duration: 1.9,
        ease: 'sine.inOut',
        repeat: -1, yoyo: true,
        stagger: {each: .07, from: vi ? 'end' : 'start', yoyo: true, repeat: -1}
      });
    });
  }

  /* IV — FOG: legibility itself comes and goes */
  {
    const sec = document.querySelector('[data-force="fog"]');
    const cs = chars(sec);
    gsap.from(cs, {
      scrollTrigger: {trigger: sec, start: 'top 62%'},
      opacity: 0, filter: 'blur(14px)', duration: 1.6, stagger: {each: .03, from: 'random'}
    });
    cs.forEach(c => {
      gsap.to(c, {
        opacity: .25 + Math.random() * .35,
        filter: `blur(${2 + Math.random() * 4}px)`,
        duration: 2.2 + Math.random() * 2.6,
        repeat: -1, yoyo: true, ease: 'sine.inOut', delay: Math.random() * 2
      });
    });
  }

  /* V — HEAT: shimmer rising off the line */
  {
    const sec = document.querySelector('[data-force="heat"]');
    const cs = chars(sec);
    gsap.from(cs, {
      scrollTrigger: {trigger: sec, start: 'top 62%'},
      y: 60, opacity: 0, scaleY: 1.4, transformOrigin: '50% 100%',
      duration: 1.1, ease: 'power2.out', stagger: .025
    });
    cs.forEach(c => {
      gsap.to(c, {
        y: -(2 + Math.random() * 6),
        skewX: (Math.random() - .5) * 7,
        scaleY: 1 + Math.random() * .06,
        duration: .5 + Math.random() * .8,
        repeat: -1, yoyo: true, ease: 'sine.inOut', delay: Math.random()
      });
    });
  }

  /* VI — ECHO: the last line repeats itself into the distance */
  {
    const sec = document.querySelector('[data-force="echo"]');
    gsap.from(chars(sec), {
      scrollTrigger: {trigger: sec, start: 'top 62%'},
      opacity: 0, y: 20, duration: .9, stagger: .02
    });
    gsap.from('.echo-ghost', {
      scrollTrigger: {trigger: sec, start: 'top 55%'},
      y: 0, x: 0, opacity: 0,
      duration: 1.6, ease: 'power2.out', stagger: .18,
      onComplete() {
        document.querySelectorAll('.echo-ghost').forEach((g, i) => {
          gsap.to(g, {
            y: -(28 + i * 34), x: (i + 1) * 14,
            duration: 3.2, ease: 'sine.inOut', repeat: -1, yoyo: true
          });
        });
      }
    });
  }

  /* VII — STILLNESS: letters arrive from every prior chaos and simply stop */
  {
    const sec = document.querySelector('[data-force="still"]');
    gsap.from(chars(sec), {
      scrollTrigger: {trigger: sec, start: 'top 60%'},
      x: () => (Math.random() - .5) * 160,
      y: () => (Math.random() - .5) * 120,
      rotation: () => (Math.random() - .5) * 30,
      opacity: 0,
      duration: 2.1,
      ease: 'expo.out',
      stagger: {each: .018, from: 'random'}
    });
  }

  /* cover title: WONK axis wakes up on load */
  gsap.from('.cover-title', {opacity: 0, y: 30, duration: 1.3, ease: 'power3.out', delay: .15});
  gsap.from(['.imprint', '.cover-sub', '.cover-note', '.cover-cue'], {
    opacity: 0, y: 14, duration: .9, stagger: .12, delay: .5
  });
}
