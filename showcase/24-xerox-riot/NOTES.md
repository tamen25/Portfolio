# 24 XEROX RIOT — build notes

## Concept
A zine about zines, rendered entirely in CSS toner: photocopy grain (feTurbulence at
9% alpha over everything), torn sheet edges (8-point jagged clip-path), crooked
paste-up rotations, offset-print headline shadow, circular stickers, Caveat scribble
annotations, marker highlights, a CSS barcode. Sheets "tear in" on scroll (single
IntersectionObserver — main.js is 5 lines, which is itself the joke and the point).
Copy carries the whole aesthetic: manifesto, lunch-break zine tutorial, bus-zine
reviews, classifieds.

## Type / palette
Anton (poster display) + Courier Prime + Caveat. Desk #B9B4A8 · paper #F2F0EA ·
toner #141414 · riot pink #FF2E88 · safety orange #FF7A1A.

## Iteration log
- PASS 1: cover verified — stickers, tear edges, shadow offset, scribble all land.
- PASS 2: copy tightening (every ad/review earns its place; the scribble kisses
  "purpose" — kept, it's a zine).
- PASS 3: mobile padding + sticker shrink; reduced motion = fade only.
- STATUS: BUILT + QA'd locally. Deploy blocked (Netlify credits). Credits: 0.
