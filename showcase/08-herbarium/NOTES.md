# 08 HERBARIUM PERPETUUM — build notes

## Concept
A botanical archive of four generated pressed-specimen scans, presented as folios that
bloom open (CSS 3D unfold + a tissue-paper overlay that lifts by itself). One folio open
at a time — the specimen is "on the table". Catalogue table includes lost specimens
("EATEN BY TIME (BEETLES)", "DISINTEGRATED UPON OPENING, 2003") for archive truthfulness.

## Assets (Higgsfield)
- 4× soul_2 specimen scans (fern, poppy, eucalyptus, lunaria) — model added gibberish
  handwriting despite no-text prompts (herbarium prior too strong)
- 4× nano_banana_pro edit passes removed ALL text while preserving plants/tape/stains
- Total ~2-5 credits. WebP 69–113KB each.

## Type / palette
Cormorant Garamond (delicate scholarly serif, italic voice) + Cutive Mono (catalogue).
Cream #F4EFE3 · botanical ink #22301F · sage #7A8B6F · wax rust #9C5433. feTurbulence grain.

## Iteration log
- PASS 1: folio open/close + accordion behavior verified; unfold animation + tie-button
  (+ → −) works; sheet layout with taxonomy + note reads beautifully.
- PASS 2 (asset hygiene): zoomed all four scans — every one had gibberish text →
  4 edit passes → verified clean on contact sheet. Rule reaffirmed: ALWAYS zoom
  generated imagery; edit-don't-reroll.
- PASS 3 (mobile): folio covers restack to two rows, sheet single-column, tissue lift
  works on touch (auto-lifts after open). Reduced motion: instant open, no lift delay.
