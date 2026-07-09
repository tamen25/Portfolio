# 16 LEDGER — build notes

## Concept
"City of Vellum — Annual Report 1962." Data-as-art in strict Swiss red/black/white:
four hand-authored SVG charts that assemble on scroll — population line (draws itself
via stroke-dashoffset, annotated "71 — the Fog"), umbrella bars (June dip in red,
staggered scaleY pop-in), streetlamp waffle (124 dots = 12,400 lamps; flickering dots
actually flicker), diverging letters-by-tone (pigeons on both sides of zero).
Fictional data, internally consistent, audited tone of voice.

## Type / palette
Familjen Grotesk only. Paper #F3F1EC · ink #141414 · red #D0312D. 6px rules,
3px figure heads — Swiss weights.

## Iteration log
- PASS 1: cover grid + all four figures verified at 1440 (line draw, bar stagger,
  waffle scale-in, diverging reveal).
- PASS 2: annotation collisions checked (Fog label sits clear); June bar red reads as
  intended; axis captions COMPLAINTS ← / → PRAISE.
- PASS 3: mobile — waffle re-grids to 16 columns, cover stacks; reduced motion renders
  everything pre-assembled (no dashoffset, no transitions, flicker off).
- All charts: no libraries, ~150 lines of createElementNS. Credits: 0.
