# 10 ORBITAL — build notes

## Concept
A private space line where the booking flow IS an orbital diagram. Procedural Earth
(graticule lines + 900 city-light points + additive fresnel atmosphere shader — zero
textures), three itineraries as real 3D orbits, a champagne cabin-glow travelling the
selected one. The manifest computes honest physics: T = 2π√(a³/μ), v = √(μ/a),
sunrises/day = 1440/T. Lunar free-return drawn as an eccentric ellipse.

## Type / palette
Marcellus (Trajan-luxury display) + Outfit + Spline Sans Mono.
Space #05070F · midnight #0A1024 · champagne #D8B25C · porcelain #F2EFE9 · atmosphere #4F7BD9.

## Iteration log
- PASS 1: Earth + atmosphere + orbits verified; selection switches highlight + cabin path;
  manifest math checks out (400km → 92.4min → 15.6 sunrises).
- PASS 2: lunar itinerary — eccentric ellipse reads as "leaving the frame" (kept: it
  communicates distance); manifest swaps to TLI velocity + "1 — but what a one".
- PASS 3 (mobile): canvas becomes a 56vh panel, itineraries + manifest stack below;
  camera pulls back on narrow aspect; reduced motion stops rotation/cabin, drag still works.
- Credits: 0. Zero textures — the Earth is lines, points, and one fresnel shader.
