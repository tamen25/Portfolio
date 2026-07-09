# 12 SEVENTY-TWO — build notes

## Concept
The Japanese 72 micro-seasons (七十二候) as a live almanac: the site computes which
five-day season TODAY falls in (almanac year anchored at Risshun, Feb 4; Jan entries
roll to the following calendar year) and sets the page's entire palette from its
season — spring pink, summer green, autumn ochre, winter blue. Full 72-entry dataset
(kanji, romaji, English, sekki, dates) embedded. A horizontal "river" of all 72 lets
you visit any season; canvas particles drift as petals/leaves or snow (winter).

## Type / palette
Noto Serif JP (vertical-rl, text-orientation upright) + EB Garamond + Zen Kaku Gothic.
Washi #F7F0E9 + sumi ink + one seasonal accent via CSS custom properties,
color-mix() for derived tones, 1.2s palette crossfade.

## Iteration log
- PASS 1: date math verified — Jul 8 lands on 第31候 温風至 (Jul 7–11) with summer palette.
- PASS 2: season switching verified (63rd kō → winter tint + snow + RETURN TO TODAY);
  river auto-scrolls to NOW card on load; ink-blur reveal on switch.
- PASS 3 (mobile): vertical JP flips to horizontal at ≤760px, frame single-column;
  reduced motion kills drift/transitions. Footer notes almanac dates drift ±1 day/year.
- Credits: 0.
