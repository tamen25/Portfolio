# 17 FOLD — build notes

## Concept
An origami studio of one square. The hero sheet folds itself in true CSS 3D — four
hinged pieces (clip-path triangles with transform-origin creases) scrubbed by a
FOLD PROGRESS slider (0–400 = four sequential folds), with FOLD IT FOR ME / UNFOLD
auto-animation. Steps: the diagonal → the quarter → the beak tuck → it stands
(the whole model tips upright, shadow tightens). Crease-diagram cards use real
origami notation (dashed valley / solid mountain / red arrows).

## Type / palette
Shippori Mincho (display) + Karla. Room #EFE9DE · paper #FAF7F0 · crane red #C9412F.

## Iteration log
- PASS 1: folds 1–2 read beautifully (paper shading, diagonal seam); FINAL STATE FAILED —
  "wings" hinged on full-inset triangles flew outside the table and read as shards.
- PASS 2: redesigned folds 3–4 to be geometrically contained: a small beak tuck
  (26%-sized flap on its own crease, +2px z) and a whole-model stand-up (rotateX 56→22°,
  shadow scale/opacity). Honest step names ("IT STANDS"); crease diagrams re-captioned
  to match the real sequence.
- PASS 3: mobile (single-column crease cards ≤540px); reduced motion = slider jumps
  without tweening.
- LESSON: CSS-3D hinges must own SMALL, locally-clipped geometry; full-inset elements
  rotate their empty space too.
- Credits: 0.
