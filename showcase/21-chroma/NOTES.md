# 21 CHROMA — build notes

## Concept
The sRGB gamut as one object: 13,824 points (24³ RGB lattice) converted through real
sRGB→XYZ(D65)→CIELAB math and plotted at (a*, L*, b*), each point wearing its own
color. Orbitable; click-to-sample (raycast with drag/click disambiguation); a wireframe
marker rings the sampled point. WORKING TOOL: the Contrast Bench — set sampled colors
as text/background, get the true WCAG ratio ((L1+.05)/(L2+.05) on linearized luminance)
with honest verdicts ("FAILS — beautiful, but unreadable").

## Type / palette
Manrope + Fira Code. Neutral void #101014 so the gamut is the only color. Title wears
a spectrum gradient — the one indulgence.

## Iteration log
- PASS 1: solid rendered but camera sat INSIDE the cloud → dist 4.4→7.6.
- PASS 2: discovered the daemon caches JS modules like CSS (?v= bust needed);
  daemon wedged twice more (about:blank tab) — cleanup + re-goto recovers.
- PASS 3: end-to-end tool verification via title/console channel: sampled #006490,
  bench computed 3.22:1 → "LARGE TEXT ONLY (AA large)". Mobile stacks bench below.
- Credits: 0.
