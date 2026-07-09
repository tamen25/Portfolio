# 13 BLUE HOUR — build notes

## Concept
An after-hours jazz room. The trio is SYNTHESIZED live in Web Audio — this is the
musically ambitious sibling of SIDE B: swung ride pattern (1, 2, 2&, 3, 4, 4& with
0.66 swing), algorithmic walking bass (root → chord tones → chromatic approach to the
next bar's root), rootless piano voicings (3-7-9) comping on syncopated slots with
probability. Three tunes = three charts (F blues 132, D-minor ballad 92 w/ brushes,
Bb I-VI-ii-V 168). Vinyl crackle bed + random pops.
Signature: the record — spins at a true 33⅓ rpm while playing; DRAG to scratch
(pointer angle drives rotation; angular velocity drives a bandpass scratch noise;
the band pauses mid-bar and resumes when you let go).

## Assets
- soul_2 club plate (0.12cr) → kling3_0_turbo 5s cinemagraph (7.5cr) — smoke through
  the spotlight beam, flickering candles. Video flagship #3.
- NOTE: Higgsfield generate_audio is SPEECH-ONLY (music models locked to the game
  pipeline; the tool says decline substitutes) — hence the synthesized trio.
- NOTE: kling returned a preset_recommendation ("IN THE DARK") — declined via
  declined_preset_id for a literal generation.

## Type / palette
DM Serif Display (italic jazz-poster) + Work Sans. Night #0D0A08 · amber #E0A458 ·
brass · bordeaux label #6E2F35 · cream.

## Iteration log
- PASS 1: doors + turntable verified; play state flips button/label; no console errors
  (one expected 404 while club.mp4 was still rendering — poster covered it).
- PASS 2: scratch interaction — angle-follow + velocity-driven bandpass verified in code
  path; band pause/resume on pointerdown/up.
- PASS 3: mobile single column, reduced-motion (no spin, film paused; audio remains
  user-initiated).
- Credits: ~8.
