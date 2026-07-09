// ARCHIVE-7 — redaction game + document choreography
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* open the folder */
const folder = document.getElementById('folder');
const fileBody = document.getElementById('fileBody');
document.getElementById('openFile').addEventListener('click', () => {
  folder.classList.add('open');
  fileBody.hidden = false;
  setTimeout(() => {
    fileBody.scrollIntoView({behavior: reduced ? 'auto' : 'smooth', block: 'start'});
    folder.style.display = 'none';
  }, reduced ? 50 : 800);
});

/* redaction game */
const redactions = [...document.querySelectorAll('.redact')];
const dtCount = document.getElementById('dtCount');
const tag = document.getElementById('declassTag');
const banner = document.getElementById('completeBanner');
let revealed = 0;
const total = redactions.length;
dtCount.textContent = `0 / ${total}`;

redactions.forEach(r => {
  r.setAttribute('aria-pressed', 'false');
  r.addEventListener('click', () => {
    if (r.classList.contains('revealed')) return;
    r.classList.add('revealed');
    r.setAttribute('aria-pressed', 'true');
    revealed++;
    dtCount.textContent = `${revealed} / ${total}`;
    if (revealed === total) complete();
  });
});

function complete() {
  tag.classList.add('done');
  banner.hidden = false;
  const st = banner.querySelector('.stamp-complete');
  st.setAttribute('data-slam', '');
  requestAnimationFrame(() => st.classList.add('slammed'));
  banner.scrollIntoView({behavior: reduced ? 'auto' : 'smooth', block: 'center'});
}

/* stamps slam + map route draws when seen */
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    if (e.target.matches('[data-slam]')) e.target.classList.add('slammed');
    if (e.target.matches('.schematic')) e.target.classList.add('animate');
    io.unobserve(e.target);
  });
}, {threshold: .5});
document.querySelectorAll('[data-slam], .schematic').forEach(el => io.observe(el));
