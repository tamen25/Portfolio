# 18 TESSERACT — build notes

## Concept
Honest 4D: 16 vertices (±1)⁴, 32 edges via XOR bit-trick, double perspective projection
R⁴→R³→R² on a 2D canvas. The DIMENSION dial (2.00–4.00) fades in the z then w
coordinates — square → cube → tesseract morph is the actual math, not an animation of
it. Rotation-plane toggles (X–W, Y–Z, X–Y); drag adds manual spin. W-edges drawn
ultramarine and only exist above d=3; the census table highlights the current polytope
(4/4/1 · 8/12/6/1 · 16/32/24/8). Prose explains the shadow-of-a-shadow honestly.

## Type / palette
Crimson Pro (math serif) + JetBrains Mono. Gallery paper #FBFAF7 · ink · ultramarine #2B47FF.

## Iteration log
- PASS 1: projection verified, dial + census work; figure OVERFLOWED its frame at
  rotation extremes (compound rotations push coords to √2·max).
- PASS 2: widened the 4D camera (3.0→3.4) and reduced screen scale ×.84→×.66 —
  contained through full rotation cycles.
- PASS 3: mobile (canvas square scales, census compresses), reduced motion = no
  auto-spin, drag still works; dial fully functional.
- Credits: 0. LESSON: budget projection scale for the rotation envelope
  (×√2 per compounded plane), not the rest pose.
