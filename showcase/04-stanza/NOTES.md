# 04 STANZA — build notes

## Concept
"Invisible Forces" — an original seven-stanza poem where the typography enacts each
stanza's meaning: GRAVITY falls with bounce physics, WIND gusts in and never settles,
TIDE rolls a permanent wave through the line, FOG oscillates legibility itself,
HEAT shimmers upward, ECHO repeats into blurred ghosts, STILLNESS simply stops
(the punchline of restraint). The page background is weather too — each stanza tints
the whole site via CSS custom-property themes.

## Type / palette
Fraunces variable (opsz 9–144, wght, SOFT, WONK — italic cover word runs WONK=1) +
Azeret Mono labels. Seven themed palettes, one per force, swapped by IntersectionObserver.

## Tech
GSAP + ScrollTrigger (SRI-pinned). Hand-rolled splitter: words → nowrap spans → char
spans (SplitText is a paid plugin; 15 lines replace it). Zero images, zero credits.

## Iteration log
- PASS 1: all seven behaviors verified by scrolled viewport screenshots; gravity/tide/echo
  land exactly as intended.
- PASS 2: CRITICAL TYPO BUG — per-char inline-blocks allowed mid-word line breaks
  ("sho / re"). Rewrote splitter to group chars inside white-space:nowrap word spans.
- PASS 3 (mobile): spine numerals collided with verses at 390px → spine hidden ≤760px;
  verses re-verified; reduced-motion path leaves a perfectly readable static poem
  (fog/echo base states are fully legible — blur exists only inside animations).
