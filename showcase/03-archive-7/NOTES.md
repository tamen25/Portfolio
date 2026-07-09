# 03 ARCHIVE-7 — build notes

## Concept
A declassified Cold-War dossier the visitor declassifies themselves. Case 1959-ARC-7,
"The Atlas Forger" — a cartographer who forges maps of places that don't exist, except
the maps keep being correct. 22 interactive redaction bars; revealing all of them
triggers FULLY DECLASSIFIED and the file's twist lands in the final redaction.
Zero generated assets — everything is CSS/SVG craft (paper grain via feTurbulence
data-URI, stamps, fingerprint, schematic map).

## Pinterest sweep ("declassified document dossier graphic design")
Kept: scratchy irregular redaction bars, rubber-stamp double borders + rotation +
multiply blending, typed TO/FROM headers, file tabs, oxblood/manila palette,
handwritten margin notes. Rejected: clean modern "spy thriller" landing-page look.

## Type / palette
Special Elite (typewriter body) · Courier Prime (forms/tables) · Caveat (pen notes)
· Stardos Stencil (stamps/title). Desk #221E19 · paper #EFE7D2 · manila #D9C48F ·
ink #1B1A17 · stamp red #A8271F · purple #5C3A6E · pen blue #2A4A73.

## Iteration log
- PASS 1: stamps were ghost-invisible — grain mask had ~5% alpha and erased them;
  removed mask, kept multiply blend. Folder-open 3D interaction verified.
- PASS 2: played the whole game via scripted clicks — 22/22 flips the tag to red,
  completion banner + stamp slam work, route map draws on scroll. Revealed redactions
  read as red-tinted declassified text (kept).
- PASS 3 (mobile): CRITICAL — .file-body{display:flex} overrode the hidden attribute,
  documents were visible before opening the folder → added .file-body[hidden]{display:none}.
  Stamp/table overlap on mobile kept (authentic document clutter, still readable).
- Learned: author display beats the hidden attribute — always pair custom display with
  an explicit [hidden] rule.
