# 05 ABYSS — build notes

## Concept
Scroll = depth. One page descends 0 → 10,935 m (Challenger Deep) at 1.7px/m; every
milestone sits at its TRUE depth with real data (Gabr's 332m scuba record, emperor
penguin 535m, last photon at 1,000m, Cuvier's beaked whale 2,992m, Titanic 3,840m,
snailfish 8,178m). Fixed canvas renders the ocean: depth-interpolated gradient,
marine snow with scroll parallax, bioluminescent plankton below 600m. Signature:
DROP FLARE (button or F) — a sinking light source that illuminates the water and fades.

## Type / palette
Instrument Serif (display) + Martian Mono (HUD). Surface teal #6FB9CD → pure black;
biolum cyan #5FF2D2, jelly pink #FF9ECF, lure amber #FFD27E.

## Creatures
Hand-drawn inline SVG line art (squid, anglerfish, dumbo octopus, snailfish) with
Gaussian-blur glow filters — no generated images, the drawings match the biolum world.

## Iteration log
- PASS 1: verified surface/midnight/bottom renders; HUD physics correct (atm=d/10+1,
  temp piecewise, sunlight exponential decay to NONE·BIOLUM at 1,000m).
- PASS 2: flare verified stationary (jump-scrolls fling it via parallax — natural
  scrolling behaves); zone transitions + card reveals verified.
- PASS 3 (mobile): cards go full-width, HUD wraps to a bottom strip and stays in sync
  with card depths (−800m card ↔ 800m/81atm HUD). Reduced motion: snow stops falling,
  everything remains readable.
- Credits: 0. Zero images.
