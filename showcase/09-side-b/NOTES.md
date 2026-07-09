# 09 SIDE B — build notes

## Concept
A mixtape shop with a WORKING deck. The music is not a file — it's generated live in
Web Audio (16-step scheduler, kick/hat/bass/pad voices + tape hiss bed). Three tapes
on the shelf hot-swap synth flavors (tempo/key/filter/pattern). Reels spin via CSS
animation gated on play state; VU meters read a real AnalyserNode; REW/FF are
hold-to-wind with counter and reel-direction changes.

## Type / palette
Bungee (chunky retro display) + Permanent Marker (handwritten labels) + Barlow.
Room #C9C2B4, plastic #DAD4C8, case #2B2826, stripe orange #E8622C, teal #17A398,
violet #8069B0, counter phosphor #7CE8D5.

## Sound design (all synthesized)
- dusk commute: 84bpm Am — Am7/Fmaj7/C/G, warm triangle bass, lowpass 950
- pool lights: 96bpm D — Dmaj7/Bm7/A/G, brighter hats, lowpass 1500
- static slow: 70bpm Fm — sparse kicks, heavy hiss, lowpass 650
Lookahead scheduler (25ms tick, 120ms horizon) — standard Web Audio timing pattern.

## Iteration log
- PASS 1: deck renders physical (screws/reels/counter); play → reels spin, counter runs,
  VU responds, hint swaps; hot-swap to pool lights updates label live.
- PASS 2: track numbers were orange on every tape — the --tp custom property sat on the
  inner case span; moved it to the button so ::before markers inherit per-tape color.
- PASS 3: mobile single-column shelf, transport re-centers; reduced motion pauses reels
  (audio still allowed — it's user-initiated).
- Credits: 0. Zero images, zero audio files.
