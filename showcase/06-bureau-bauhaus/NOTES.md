# 06 BUREAU BAUHAUS — build notes

## Concept
A Bauhaus centenary exhibition you operate. Signature: THE PRINTING TABLE — a live
poster composer (drag / click-recolor / double-click-rotate / keyboard accessible)
that renders your composition to a 1200×1800 PNG and downloads it. Plus Kandinsky's
1923 color-form doctrine as interactive cards and a five-stop timeline ending in 2026.

## Type / palette
Jost only (the Futura-lineage geometric — one family, Bauhaus purity).
Paper #F2EFE9 · ink #141311 · red #D53A2F · blue #1D5DA8 · yellow #F2B705.

## Iteration log
- PASS 1: hero collage verified (poster-grade); composer stage + controls render;
  marquee strip, theory cards, timeline all correct.
- PASS 2: shuffle could deal all-dark compositions → primary triad now guaranteed on
  the first three shapes. Download click executes cleanly (canvas render, zero errors).
- PASS 3 (mobile): hero collage restacks, composer single-column; keyboard support
  (arrows move, C recolors, R rotates) and reduced-motion (no marquee/parallax) verified in code.
- Credits: 0. Zero images — shapes are DOM divs mirrored to canvas for export.
