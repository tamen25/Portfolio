# 01 TERRA OBSCURA — build notes

## Concept
A planetary survey instrument. The page IS the instrument: live procedural terrain
(GPU-displaced heightfield) rendered with hypsometric amber-phosphor ramp + antialiased
contour lines, annotated by DOM leader-line callouts (APEX/NADIR computed from real
height data). RESEED generates a new world; SEA LEVEL and RELIEF are live uniforms.

## Pinterest sweep takeaways (search: "sci-fi HUD interface design")
- Near-black + white hairline linework + ONE accent (ref used red; I chose amber phosphor to dodge the black+acid-accent cliché)
- Leader-line callouts annotating a 3D object = the signature interaction of broadcast HUD packs
- Data-raster strips (dot matrices) in margins — I tie mine to the real elevation histogram (structure = information)
- Tiny uppercase labels with index numbers, translucent globe wireframes
- REJECTED: teal hexagon hologram look (generic game HUD)

## Type
- Display: Archivo Variable (caps, wide width axis, 900)
- Data/utility: IBM Plex Mono

## Palette
- Carbon #0A0B0D, bone #E8E4DA linework, phosphor amber ramp #1A0F00→#FFB000→#FFE8B0,
  basin teal #0E2B33 (water), alert #FF4B1F (sparingly)

## Iteration log
- PASS 1 (framing & furniture): camera in (r3.0→2.62, FOV 36), broader landforms (scale 2.55, ridge .30),
  sea .32→.475 for coastline drama, leader-line gap fixed, PROFILE A—A′ cross-section added,
  headline break fixed.
- PASS 2 (data honesty): fixed global altitude scale (apex no longer always 1.000), ridge bias
  recentred (−.09), survey log seeds made clickable/loadable, log copy rewritten from real renders
  (THE BRAID / DEEPWATER / RINGWATER with true stats), callout clamps clear of HUD panels.
- PASS 3 (small screens & touch): camera radius scales with aspect (<0.9), log rows single-column
  stack on mobile, LOAD chip always visible on touch, guide page written and verified.
- Verified: no console errors, mobile 390px, guide route, reduced-motion path in code.
