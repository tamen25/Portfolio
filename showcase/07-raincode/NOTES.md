# 07 RAINCODE — build notes

## Concept
The city through a wet window. Generated cyberpunk megacity plate (soul_2) animated
into a 5s cinemagraph (kling3_0_turbo — neon flicker, drifting aircar lights, moving
haze). Over it: TWO canvases — a rain layer (procedural streaks with beads) and a fog
layer the visitor wipes clear with their cursor (destination-out radial brush).
The fog re-condenses every 300ms. Signature: wiping the glass.

## Assets
- soul_2 city plate (~0.12cr) — model composed it inside a window WITH real mullions,
  so the CSS fake mullion was removed (pass 1 catch).
- kling3_0_turbo 5s cinemagraph (7.5cr). city.webp 89KB poster + city.mp4 3.5MB.

## Type / palette
Chakra Petch (techno grotesk) + Noto Sans JP (雨のコード). Void #060B12, neon teal
#38E8D4, magenta #F056C7, fog #9FB4C4.

## Iteration log
- PASS 1: double-frame conflict (generated mullions + CSS mullion) → removed CSS bar.
- PASS 2: simulated a cursor wipe path via dispatched PointerEvents — fog clears,
  city video shows through, recondensation works, hint fades after first wipe.
- PASS 3 (mobile): fog canvas has touch-action:none so wiping works by finger;
  reduced-motion freezes film + stops rain/recondense, page still legible.
- Credits: ~8. Video flagship #2.
