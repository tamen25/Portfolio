// HERBARIUM PERPETUUM — folios that bloom open
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

document.querySelectorAll('.folio').forEach(folio => {
  const cover = folio.querySelector('.folio-cover');
  const sheet = folio.querySelector('.folio-sheet');
  const tissue = folio.querySelector('.tissue');

  cover.addEventListener('click', () => {
    const open = folio.dataset.open === 'true';
    // close others (one specimen on the table at a time)
    document.querySelectorAll('.folio[data-open="true"]').forEach(f => {
      if (f !== folio) {
        f.dataset.open = 'false';
        f.querySelector('.folio-sheet').hidden = true;
        f.querySelector('.folio-cover').setAttribute('aria-expanded', 'false');
        f.querySelector('.tissue').classList.remove('lifted');
      }
    });
    folio.dataset.open = String(!open);
    sheet.hidden = open;
    cover.setAttribute('aria-expanded', String(!open));
    if (!open) {
      // tissue paper lifts by itself a moment after opening
      setTimeout(() => tissue.classList.add('lifted'), reduced ? 0 : 1100);
      if (!reduced) setTimeout(() =>
        sheet.scrollIntoView({behavior: 'smooth', block: 'nearest'}), 250);
    } else {
      tissue.classList.remove('lifted');
    }
  });
});
