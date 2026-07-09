# 19 SOLSTICE — build notes

## Concept
Midnight-sun festival. The sun is a draggable slider on a quadratic-bezier arc
(pointer drag, arc-click, arrow keys, ARIA slider role); its position drives a
whole-page LIGHT ENGINE via CSS custom properties: sky gradient, page tint, accent,
ridge colors, sun color/glow radius, and every element's shadow (direction from
azimuth, length/blur/alpha from altitude). The sun never sets — minimum altitude 4°.
Shareable time links via ?t=HOURS (added in pass 3). Gentle auto-drift until the
visitor takes over.

## Type / palette
Syne (festival display) + Albert Sans. Live palette: noon #7FB8E8 sky ↔ midnight
#2E3E68→#F2A65E horizon; sun #FFF3D6 ↔ #FF7A2F.

## Iteration log
- PASS 1: noon/midnight relight verified — dramatic and coherent; shadows lengthen
  and swing correctly.
- PASS 2: at midnight the sun hid BEHIND the mountains → re-layered SVG (far ridge
  behind sun, near ridge in front) + raised arc horizon points; the midnight sun now
  grazes between ridges like the real one.
- PASS 3: browse-daemon renderer wedged during synthetic-event QA (captures went
  blank; daemon restart fixed) → added ?t= param so any time state is verifiable by
  plain page load; doubles as a shareable feature. Mobile + reduced-motion (no drift).
- Credits: 0.
