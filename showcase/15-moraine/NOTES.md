# 15 MORAINE — build notes

## Concept
A memorial in ice, to ice. Full-screen GLSL ice shader (fbm veins, crevasse noise,
sparkle, cursor "warm breath" lens) whose melt line is BOUND TO THE PUBLISHED RECORD:
scroll interpolates year/acreage between Grinnell Glacier's USGS-series data points
(1850: 710ac → 1966: 326 → 1993: 240 → 2005: 152 → ~120 today; 1920 & 2026
interpolated, labeled as such on the page). uMelt = (710−acres)/710. The fixed gauge
reads year / acres / % remaining, always agreeing with the ice on screen.

## Type / palette
Cormorant (memorial serif) + Archivo Narrow (gauge). Rock #0A0E12 · glacial ice
#BFE3F2/#5FA8C7 · meltwater teal #3EC5C0.

## Iteration log
- PASS 1: layout + gauge verified; SHADER MASK WAS INVERTED (1850 showed rock,
  2026 showed ice) and sparkles rendered as confetti squares.
- PASS 2: rewrote the edge as `th = uMelt*.96 + ragged` with ice above; meltwater
  pool clamped below the edge; sparkles tiny/rare/vein-modulated. Verified 1850 =
  full ice, 2006 = 21% with glowing melt line.
- PASS 3: mobile gauge drops to bottom-right; era cards single-align; reduced motion
  freezes shader time (still renders). 
- Credits: 0. LESSON: signed distance conventions deserve a comment the moment you
  write them — the mask inversion cost a pass.
