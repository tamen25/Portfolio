// FABLE INDEX — 25 doors, each wearing its site's true palette.
const SITES = [
  ['01','TERRA OBSCURA','Reseed a planet; every contour computed live on your GPU.',
   'https://fable-01-terra-obscura.netlify.app','#0A0B0D','#E8E4DA','#FFB000',
   'radial-gradient(circle at 80% 110%, rgba(255,176,0,.35), transparent 55%)'],
  ['02','VELVET NOIR','A couture perfume house with a living, smoking film for a hero.',
   'https://fable-02-velvet-noir.netlify.app','#0A0608','#EFE7DB','#E2A45B',
   'radial-gradient(ellipse at 20% -20%, rgba(226,164,91,.3), transparent 60%)'],
  ['03','ARCHIVE-7','A declassified dossier; peel all 22 redactions for the twist.',
   'https://fable-03-archive-7.netlify.app','#EFE7D2','#1B1A17','#A8271F',
   'repeating-linear-gradient(0deg, transparent 0 26px, rgba(27,26,23,.08) 26px 34px)'],
  ['04','STANZA','A poem where gravity, wind, fog and echo typeset themselves.',
   'https://fable-04-stanza.netlify.app','#F5F1E8','#191713','#8C4A2F',
   'linear-gradient(160deg, transparent 60%, rgba(140,74,47,.14))'],
  ['05','ABYSS','Scroll to 10,935 m. Real records at true depths. You have flares.',
   'https://fable-05-abyss.netlify.app','#04121E','#EAF4F2','#5FF2D2',
   'linear-gradient(180deg, rgba(95,242,210,.12), transparent 55%)'],
  ['06','BUREAU BAUHAUS','Compose a Bauhaus poster on the printing table; take the PNG home.',
   'https://fable-06-bureau-bauhaus.netlify.app','#F2EFE9','#141311','#D53A2F',
   'radial-gradient(circle at 85% 20%, #D53A2F 18%, transparent 19%), linear-gradient(45deg, transparent 78%, #F2B705 79%)'],
  ['07','RAINCODE','A neon megacity behind fogged glass. Wipe it with your cursor.',
   'https://fable-07-raincode.netlify.app','#060B12','#DCE9F2','#38E8D4',
   'linear-gradient(180deg, rgba(56,232,212,.14), rgba(240,86,199,.1))'],
  ['08','HERBARIUM','Four pressed specimens in folios that bloom open. Tissue included.',
   'https://fable-08-herbarium.netlify.app','#F4EFE3','#22301F','#9C5433',
   'radial-gradient(ellipse at 50% 120%, rgba(122,139,111,.25), transparent 60%)'],
  ['09','SIDE B','A working cassette deck. The lo-fi is synthesized as you listen.',
   'https://fable-09-side-b.netlify.app','#DAD4C8','#221F1C','#E8622C',
   'linear-gradient(90deg, transparent 46%, rgba(232,98,44,.5) 46% 54%, rgba(23,163,152,.5) 54% 62%, transparent 62%)'],
  ['10','ORBITAL','A private space line; the booking flow is real orbital mechanics.',
   'https://fable-10-orbital.netlify.app','#05070F','#F2EFE9','#D8B25C',
   'radial-gradient(circle at 50% 140%, rgba(79,123,217,.4), transparent 60%)'],
  ['11','CHISEL','A statue dreamed as text, lifted to real 3D, lit by your cursor.',
   'https://fable-11-chisel.netlify.app','#0F0F11','#EDEDEA','#B98A44',
   'radial-gradient(ellipse at 50% 0%, rgba(255,217,168,.2), transparent 55%)'],
  ['12','SEVENTY-TWO','Japan’s 72 micro-seasons; the page computes today’s and dresses for it.',
   'https://fable-12-seventy-two.netlify.app','#F7F0E9','#2A2320','#C4707F',
   'radial-gradient(circle at 85% 15%, rgba(196,112,127,.3), transparent 45%)'],
  ['13','BLUE HOUR','A jazz room; the trio is oscillators and probability. Scratch the record.',
   'https://fable-13-blue-hour.netlify.app','#0D0A08','#EFE6D8','#E0A458',
   'radial-gradient(circle at 20% 110%, rgba(224,164,88,.3), transparent 55%)'],
  ['14','DYNASTY ARCADE','One cabinet, one playable game. The gusts do not negotiate.',
   'https://fable-14-dynasty-arcade.netlify.app','#191036','#E8E4F5','#FF3D8B',
   'repeating-linear-gradient(0deg, rgba(0,0,0,.22) 0 2px, transparent 2px 4px)'],
  ['15','MORAINE','A glacier memorial; the ice melts exactly as much as the record says.',
   'https://fable-15-moraine.netlify.app','#0A0E12','#EAF2F5','#3EC5C0',
   'linear-gradient(180deg, rgba(191,227,242,.25) 30%, transparent 62%)'],
  ['16','LEDGER','The annual report of an imaginary city, audited sincerely.',
   'https://fable-16-ledger.netlify.app','#F3F1EC','#141414','#D0312D',
   'linear-gradient(90deg, transparent 70%, rgba(208,49,45,.7) 70% 78%, transparent 78%), linear-gradient(0deg, rgba(20,20,20,.85) 12%, transparent 12%)'],
  ['17','FOLD','A sheet of paper folds itself. Unfold, and all is forgiven.',
   'https://fable-17-fold.netlify.app','#EFE9DE','#26221C','#C9412F',
   'linear-gradient(135deg, transparent 55%, rgba(38,34,28,.1) 55%)'],
  ['18','TESSERACT','Drag a slider into the fourth dimension. The math is real.',
   'https://fable-18-tesseract.netlify.app','#FBFAF7','#15130F','#2B47FF',
   'linear-gradient(45deg, transparent 48%, rgba(43,71,255,.4) 48% 52%, transparent 52%), linear-gradient(-45deg, transparent 48%, rgba(21,19,15,.3) 48% 52%, transparent 52%)'],
  ['19','SOLSTICE','Drag the sun; every shadow on the page obeys. It never sets.',
   'https://fable-19-solstice.netlify.app','#2E3E68','#FFFFFF','#F2A65E',
   'radial-gradient(circle at 80% 30%, rgba(242,166,94,.65), transparent 45%)'],
  ['20','MYCELIUM','A fungal network grows as you read and colonizes what you’ve seen.',
   'https://fable-20-mycelium.netlify.app','#12100C','#EDEAE2','#B8E986',
   'radial-gradient(circle at 30% -10%, rgba(184,233,134,.2), transparent 55%)'],
  ['21','CHROMA','Every color your screen can make, as one object. Pick two; test them.',
   'https://fable-21-chroma.netlify.app','#101014','#F0F0F4','#4BC8FF',
   'linear-gradient(120deg, rgba(255,75,110,.25), rgba(255,210,75,.2), rgba(75,227,138,.2), rgba(75,200,255,.25))'],
  ['22','SLIPSTREAM','A blueprint draws itself, then becomes the airliner. Jet age, dinner jackets.',
   'https://fable-22-slipstream.netlify.app','#16324F','#EAF2FA','#D9A441',
   'repeating-linear-gradient(0deg, transparent 0 24px, rgba(234,242,250,.06) 24px 25px), repeating-linear-gradient(90deg, transparent 0 24px, rgba(234,242,250,.06) 24px 25px)'],
  ['23','OSCILLA','This website is an instrument. Everything you see is your sound.',
   'https://fable-23-oscilla.netlify.app','#070A0D','#F2F4F5','#F2E94E',
   'radial-gradient(ellipse at 50% 100%, rgba(58,242,197,.2), transparent 55%)'],
  ['24','XEROX RIOT','A zine about zines. 100% toner. No algorithm chose this. (One did.)',
   'https://fable-24-xerox-riot.netlify.app','#F2F0EA','#141414','#FF2E88',
   'linear-gradient(3deg, transparent 82%, rgba(255,46,136,.8) 82% 90%, transparent 90%)'],
  ['25','CARAVAN','Chang’an to Constantinople in one scroll. The route embroiders itself.',
   'https://fable-25-caravan.netlify.app','#201A14','#F2EAD8','#D9A036',
   'repeating-linear-gradient(45deg, rgba(217,160,54,.1) 0 10px, transparent 10px 20px)'],
];
const wrap = document.getElementById('doors');
SITES.forEach(([no, name, hook, url, bg, ink, acc, motif]) => {
  const a = document.createElement('a');
  a.className = 'door';
  a.href = url;
  a.style.setProperty('--bg', bg);
  a.style.setProperty('--ink', ink);
  a.style.setProperty('--acc', acc);
  a.style.setProperty('--motif', motif);
  a.innerHTML = `
    <span class="d-no">SITE ${no} / 25</span>
    <span class="d-name">${name}</span>
    <span class="d-hook">${hook}</span>
    <span class="d-go">ENTER</span>`;
  wrap.appendChild(a);
});
