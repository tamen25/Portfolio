# 14 DYNASTY ARCADE — build notes

## Concept
A one-cabinet game studio. The hero is MOTH & LANTERN — an original playable
micro-game: steer the moth (pointer/touch/arrows), gather glowing embers (+10),
dodge cyan wind gusts (3 hearts, 1.4s invulnerability), difficulty ramps with score,
hi-score persists in localStorage. Rendered at a true 192×144 canvas upscaled with
image-rendering:pixelated under a CRT treatment (scanlines, glass reflection +
vignette, marquee flicker, 4.2s glitch flick). WebAudio bleeps (coin chirp, collect,
sawtooth death). Below: "Games we never shipped" — the studio's well-dressed ghosts.

## Type / palette
Press Start 2P (arcade UI) + Rubik. Hall #0E0A1E · cabinet indigo #191036 ·
magenta #FF3D8B · cyan #35E5DC · ember #FFB454 · phosphor chrome.

## Iteration log
- PASS 1: attract mode → coin-in → gameplay verified; moth follows pointer, embers pulse.
- PASS 2: automated Lissajous sweep collected an ember (SCORE 10 read from HUD) and then
  flew into gusts and died — GAME OVER screen, heart depletion, hi-score persistence all
  verified end-to-end in a real browser session.
- PASS 3: mobile (cards single-column; canvas scales, touch = pointermove); reduced
  motion kills marquee flicker/CRT flick/blink (game itself only animates when playing).
- Credits: 0. The game is 190 lines of vanilla canvas.
