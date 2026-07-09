# 25 CARAVAN — build notes

## Concept
Silk Road in one scroll. A sticky kilim map (SVG pattern weave, madder/indigo bands,
terrain glyphs) under a tall journey: scroll progress = kilometers (0 → 7,000);
the route embroiders itself via a pathLength-normalized dash-reveal; a camel marker
rides route.getPointAtLength(tip); the odometer names each leg. Five city stops with
cargo manifests that tell one continuous story (the letter, delivered at Constantinople).

## Type / palette
Amiri + Karla. Loom #201A14 · sand #E8DCC3 · madder #A03A2A · indigo #2C3A63 · saffron #D9A036.

## Iteration log
- PASS 1: map/odometer/stops verified; ROUTE RENDERED AS A BLACK FILLED BLOB —
  cloneNode kept the geometry but the clone's new id escaped the #route{fill:none}
  selector → default black fill. Fix: explicit style.fill='none' on the clone.
  LESSON: clones inherit attributes, not your id-scoped CSS.
- PASS 2: verified halfway state (3,850 KM · Samarkand, dashes east of the tip only).
- PASS 3: mobile single-column stops; reduced motion renders the full route immediately.
- STATUS: BUILT + QA'd locally. Deploy blocked (Netlify credits). Credits: 0.
