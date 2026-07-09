# FABLE SHOWCASE — Master State

> **Mission:** 25 fundamentally different websites demonstrating extreme web design
> capability. Each: distinct aesthetic, advanced technique, `/guide` route, ≥3 iteration
> passes, deployed to Netlify. Hub site (FABLE INDEX) links all 25 = the link served.
> Fully autonomous. Fresh ideas only — no reuse of prior portfolio concepts.

## ✅ GOAL COMPLETE (2026-07-08)
All 25 sites + FABLE INDEX hub LIVE with /guide routes and ≥3 iteration passes each.
Blocker resolved (user added Netlify credits). THE LINK: https://fable-index.netlify.app

## Resume instructions (for future sessions)
1. Read this file fully. Continue from the first site with status ≠ `DONE`.
2. Follow the per-site workflow below exactly. Never skip iteration passes.
3. Update the roster status + credits + deploy registry after every site.
4. Don't touch completed sites. Don't ask the user anything until all 26 are live.

## Hard constraints
- **Credits:** started 600 (Higgsfield Pro). Images cheap, video expensive.
  Budget: ≤20 credits/site images typical; video ONLY for flagged flagship sites
  (max ~3 videos whole run). Track spend below. Check `balance` periodically.
- **Netlify:** token in env (`NETLIFY_AUTH_TOKEN`), CLI installed globally.
  Naming: `fable-XX-slug` → fallback suffix if taken. Deploy: `netlify deploy --prod --dir <folder>` (no build step, no build minutes).
- **Pinterest:** use for mood/ideas per site (browse skill, logged-out); direct-download
  only texture/reference imagery; generated assets preferred for hero usage. Log usage in guides.
- **No build step:** plain HTML/CSS/JS + ESM via CDN import maps (three, gsap via jsdelivr/esm.sh).
  Fonts: Google Fonts / Fontshare CDN. Each site self-contained in its folder.

## Per-site workflow
1. Concept lock (roster below) → quick Pinterest mood sweep → `NOTES.md` in site folder
2. Assets via Higgsfield `generate_image` (download to `assets/`); video only if flagged
3. Build `showcase/XX-slug/` → `index.html`, `guide/index.html`, css/js
4. QA: browse-skill screenshots @1440w + 390w, console errors, interactions
5. **Iteration pass ×3 minimum** — fine-toothed comb: design problems, complexify,
   polish. Log each pass in NOTES.md (what changed & why)
6. `/guide` — how this site was made: concept, assets, tech, iteration log
7. Deploy → record URL below → update status/credits

## Quality bar (every site)
Responsive to 390px · no console errors · visible focus states · `prefers-reduced-motion`
respected · real copy (no lorem) · distinct type pairing (never repeat a display face
across sites) · palette named in CSS custom props · one unforgettable signature element.
Avoid the 3 AI-slop looks: cream+terracotta serif, black+acid-green accent, hairline broadsheet.

## Roster (status: TODO → BUILDING → ITERATING → DONE)

| ## | Name | Concept / signature | Tech core | Status | Credits |
|----|------|---------------------|-----------|--------|---------|
| 01 | TERRA OBSCURA | Planetary survey instrument; live procedural terrain you can reseed | Three.js + custom shaders, HUD UI | DONE | 0 |
| 02 | VELVET NOIR | Couture perfume house; liquid transitions, smoke; **flagship video hero** | GSAP, generated editorial imagery | DONE | ~9 |
| 03 | ARCHIVE-7 | Declassified dossier; interactive redaction bars, scanned paper | CSS craft, scroll narrative | DONE | 0 |
| 04 | STANZA | Kinetic typography poem; type behaves like the words mean | Variable fonts + GSAP | DONE | 0 |
| 05 | ABYSS | Deep-sea descent; scroll = depth, bioluminescent life at true depths | Canvas particles + scroll engine | DONE | 0 |
| 06 | BUREAU BAUHAUS | Centenary exhibition; draggable poster composer | SVG/CSS geometry, drag physics | DONE | 0 |
| 07 | RAINCODE | Cyberpunk megacity; rain-streaked window you wipe clear with cursor | Canvas rain + wipeable fog, generated city film | DONE | ~8 |
| 08 | HERBARIUM | Botanical archive; specimens bloom open | Generated scans, paper grain, delicate serif | DONE | ~4 |
| 09 | SIDE B | Mixtape shop; working skeuomorphic CSS-3D tape deck | CSS 3D + Web Audio | DONE | 0 |
| 10 | ORBITAL | Private space line; booking flow plotted as orbits | Three.js Earth + atmosphere shader | DONE | 0 |
| 11 | CHISEL (moved up) | Generated statue → REAL 3D GLB mesh → cursor-lit chiaroscuro | image_to_3d + Three.js GLTF | DONE | ~20 |
| 20 | MYCELIUM | Document-space walker network grows with reading depth; colonizes read sections | canvas walkers + IO steering | DONE | 0 |
| 12 | SEVENTY-TWO | Japanese 72 micro-seasons almanac; today's real micro-season | Vertical writing, ink-bleed transitions | DONE | 0 |
| 16→ | LEDGER (as site 16) | City of Vellum annual report; 4 hand-built SVG chart assemblies | createElementNS, Swiss grid | DONE | 0 |
| 14 | DYNASTY ARCADE | Playable MOTH & LANTERN micro-game, CRT treatment, hi-score persistence | 192×144 canvas game + WebAudio bleeps | DONE | 0 |
| 15 | MORAINE | Glacier memorial; ice shader melt-line BOUND to USGS Grinnell series | GLSL fbm ice + scroll-data binding | DONE | 0 |
| 13→ | BLUE HOUR (moved up) | Jazz club; synthesized swing trio, scratchable 33⅓ record, club cinemagraph | Web Audio swing engine + kling film | DONE | ~8 |
| 17 | FOLD | Origami studio; sheet folds itself via slider-scrubbed CSS-3D hinges | clip-path facets + transform-origin creases | DONE | 0 |
| 18 | TESSERACT | 4D geometry; dimension dial fades in z/w coords; double perspective divide | canvas 2D, XOR edge trick | DONE | 0 |
| 19 | SOLSTICE | Draggable sun on bezier arc drives page-wide CSS-var light engine; ?t= share links | SVG + custom-property relight | DONE | 0 |

| 21 | CHROMA | sRGB gamut in CIELAB as pickable point cloud + WCAG contrast bench | Three.js Points + real color math | DONE | 0 |
| 22 | SLIPSTREAM | Sticky-scroll blueprint→photograph morph w/ scan line; jet-age fiction | SVG line draw + clip-path wipe | DONE | ~1.5 |
| 23 | OSCILLA | Polyphonic synth; the page IS the analyser (waveform+FFT visuals) | Web Audio + canvas afterglow | DONE | 0 |
| 24 | XEROX RIOT | Zine about zines; toner grain, torn clip-paths, 5-line JS | CSS craft | DONE | 0 |
| 25 | CARAVAN | Kilim map; route embroiders with scroll, camel rides getPointAtLength | SVG dash reveal | DONE | 0 |
| — | FABLE INDEX (hub) | 25 palette-true doors + THE METHOD meta-guide | data-driven tiles | DONE | 0 |

## Deploy registry
| ## | URL | Netlify site id |
|----|-----|-----------------|
| 01 | https://fable-01-terra-obscura.netlify.app | 05b2bd3a-49d6-4995-9453-9a750849ebf8 |
| 02 | https://fable-02-velvet-noir.netlify.app | 6a679350-b492-4bc3-818a-e70e3f865490 |
| 03 | https://fable-03-archive-7.netlify.app | 412308f8-edf5-4d92-b296-9993e2361792 |
| 04 | https://fable-04-stanza.netlify.app | 8af3c41b-42d2-4c4b-89cd-ad8afc25acf9 |
| 05 | https://fable-05-abyss.netlify.app | d1a82c54-16ac-4e39-8f73-a961168db48d |
| 06 | https://fable-06-bureau-bauhaus.netlify.app | (see Netlify) |
| 07 | https://fable-07-raincode.netlify.app | (see Netlify) |
| 08 | https://fable-08-herbarium.netlify.app | (see Netlify) |
| 09 | https://fable-09-side-b.netlify.app | (see Netlify) |
| 10 | https://fable-10-orbital.netlify.app | (see Netlify) |
| 11 | https://fable-11-chisel.netlify.app | (see Netlify) |
| 12 | https://fable-12-seventy-two.netlify.app | (see Netlify) |
| 13 | https://fable-13-blue-hour.netlify.app | (see Netlify) |
| 14 | https://fable-14-dynasty-arcade.netlify.app | (see Netlify) |
| 15 | https://fable-15-moraine.netlify.app | (see Netlify) |
| 16 | https://fable-16-ledger.netlify.app | (see Netlify) |
| 17 | https://fable-17-fold.netlify.app | (see Netlify) |
| 18 | https://fable-18-tesseract.netlify.app | (see Netlify) |
| 19 | https://fable-19-solstice.netlify.app | (see Netlify) |
| 20 | https://fable-20-mycelium.netlify.app | (see Netlify) |
| 21 | https://fable-21-chroma.netlify.app | 6296cf9f |
| 22 | https://fable-22-slipstream.netlify.app | 4eeb9e18 |
| 23 | https://fable-23-oscilla.netlify.app | 5ccc633c |
| 24 | https://fable-24-xerox-riot.netlify.app | 80382445 |
| 25 | https://fable-25-caravan.netlify.app | 35666e4f |
| HUB | https://fable-index.netlify.app | 58d9b775 — THE LINK |
| hub | https://fable-index.netlify.app (claimed, not deployed) | 58d9b775-99eb-4894-b632-b46ae02e1c75 |

## Credit ledger
| Event | Δ | Remaining |
|-------|---|-----------|
| Start | – | 600 |
| Site 02 images+edit+5s video | −9 | ~591 |
| Site 07 city plate + 5s video | −8 | ~583 |
| Site 08 4 specimens + 4 edit passes | −4 | ~579 |
| Site 11 statue image + image_to_3d GLB | −20 | ~559 |
| Site 13 club plate + 5s video | −8 | ~551 |

## Decisions log
- 2026-07-08: No-build static architecture chosen (speed, zero build minutes, CDN ESM).
- 2026-07-08: frontend-design skill = calibration only (anti-generic); restraint bias overridden — spectacle is the deliverable. No style-imposing skills.
- 2026-07-08: Video reserved for ~3 flagships (02 VELVET NOIR confirmed; others decided in flow).
- 2026-07-08 (user): GO WILDER — abuse capabilities maximally: generate_3d GLB statues (site 20 CHISEL → pulled to 11), generate_audio (BLUE HOUR jazz), more cinemagraphs, heavier shaders.
- OPS: netlify CLI mangles JSON args on Windows — use curl REST API for createSite/rename; `netlify deploy --prod --dir <folder> --site <id>` works fine.
- OPS: local QA = `npx http-server showcase -p 8123` + gstack browse daemon (`~/.claude/skills/gstack/browse/dist/browse`): goto/viewport 390x844/screenshot/console/click.
- OPS: site 01 took ~1 session-hour incl. pipeline setup; zero credits. Pinterest logged-out scrape works (i.pinimg.com URLs from browse html).
- OPS: full-page browse screenshots DON'T fire ScrollTrigger (below-fold looks blank) — QA with viewport shots + scrollIntoView.
- OPS: Higgsfield: max 4 concurrent jobs (Pro); images ~0.12cr, 5s kling3_0_turbo video 7.5cr; image_to_3d GLB 20cr; models write gibberish labels on products — fix with nano_banana_pro edit pass, don't re-roll. Job_ids work as start_image refs.
- OPS: generate_audio is SPEECH-ONLY (music/SFX models locked to game pipeline — decline substitutes). Synthesize music with Web Audio instead.
- OPS: kling may return preset_recommendation — pass declined_preset_id to force literal prompt.
- OPS: browse js eval: `browse js "code"`. SRI hashes for CDN scripts: curl | openssl dgst -sha384 -binary | base64.
- OPS: browse caches CSS **and JS modules** across gotos — bump `?v=N` on both when iterating.
- OPS: browse daemon renderer can WEDGE after heavy synthetic-event js (captures blank, evals lost) — `browse cleanup` + fresh goto recovers; prefer URL params (?t=) to reach states.
- LEARNED: author display:flex beats the hidden attribute — pair custom display with [hidden]{display:none}.
