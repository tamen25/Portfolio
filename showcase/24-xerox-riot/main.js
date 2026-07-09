// XEROX RIOT — sheets tear in as you read. That's it. Zines don't need frameworks.
const io = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add('torn'); io.unobserve(e.target); }
}), {threshold: .18});
document.querySelectorAll('[data-tear]').forEach(s => io.observe(s));
