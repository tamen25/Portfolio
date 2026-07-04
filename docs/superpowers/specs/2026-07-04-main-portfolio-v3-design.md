# main-portfolio v3 — Design Spec

Date: 2026-07-04
Status: approved direction (elevated rebuild of Tamen's own emergent concept)

## Background

Two previous main-portfolio iterations (faithful template recreations) were rejected and
deleted. Tamen then built his own concept on emergent
(`creative-coder-66.preview.emergentagent.com`) — a dark split-identity one-pager,
"Tamen Dutta — Developer × Photographer". The preview is broken (corrupted `Hero.jsx`),
but the full source was recovered from its webpack dev bundle. Decision: keep his
concept and section skeleton, rebuild it properly in Next.js, redesign the hero (lost),
elevate typography/motion/craft, and replace all fake content with real content.

## Goals

- Hub site at the apex domain (`tamendutta.com`) introducing Tamen as
  "Software Developer × Photographer".
- Route visitors to the two existing sub-sites: cloudops-portfolio and
  photography-portfolio.
- One page, no sub-routes. Dark, cinematic, premium — not minimal.

## Non-goals

- No contact form / backend (mailto + socials only).
- No stats blocks (all invented numbers dropped).
- No CMS; content lives in one TS module.

## Stack & Conventions

- New top-level folder `main-portfolio/` (repo is a monorepo of independent sites).
- Next.js 16.2.x, React 19.2.x, Tailwind CSS 4, TypeScript 5 — same versions as
  photography-portfolio.
- Dev port **3002** (`next dev -p 3002`). cloudops=3000, photography=3001.
- Fonts via `next/font/google`: Playfair Display (display serif), Outfit (body sans),
  JetBrains Mono (labels/code).
- Motion & 3D: **Three.js via `@react-three/fiber` + `@react-three/drei`** for the hero
  scene; **Lenis** smooth scrolling; IntersectionObserver reveal hook; typing animation.
  No GSAP/framer-motion. Three.js is client-only via `next/dynamic` (no SSR), so the
  initial HTML stays light. Respect `prefers-reduced-motion` and missing WebGL with
  static fallbacks everywhere.
- Scripts: `dev`, `build`, `lint`, `test` (`tsx --test test/*.test.ts`),
  `import-photos` (`node scripts/import-photos.mjs`).

## Design language

Palette (from Tamen's emergent build — keep):

| Token | Value |
|---|---|
| `--bg` | `#050505` |
| `--surface` | `#121212` |
| `--border` | `#262626` |
| `--text-primary` | `#f5f5f5` |
| `--text-secondary` | `#a3a3a3` |
| `--text-muted` | `#525252` |
| `--dev-accent` | `#38bdf8` |
| `--photo-accent` | `#d4d4d4` |
| `--photo-warmth` | `#2e2a25` |

Cool (sky/mono/grid) codes the developer identity; warm neutrals + photography code the
photographer identity. Mono numbered section labels (`01 — hello` … `05 — contact`).
Film-grain overlay on photographic surfaces.

## Page structure (single route `/`)

### Nav
Fixed top bar: `tamen.dutta` wordmark (mono), `/ portfolio` label, anchor links to
sections, `Say hello` mailto button. Translucent blur over `--bg`.

### 01 — Hero (new design; emergent original lost)
Full viewport. Giant Playfair Display "Tamen Dutta" with the line
"Developer × Photographer" over a **Three.js particle scene** (single R3F canvas,
~3–4k points, additive blending) that carries the split identity:

- Left half: points settle into a structured lattice/grid (code), tinted `--dev-accent`.
- Right half: points drift as an organic nebula/star cloud (his astro photography),
  warm-neutral tint.
- Cursor parallax biases the field toward whichever identity is hovered; gentle
  continuous drift otherwise. Scroll fades/disperses the field into section 02.

Fallbacks: mobile low-power, `prefers-reduced-motion`, or no WebGL → static split
treatment (grid-line texture left, Iceland aurora photo masked with grain right).
Mono label `01 — hello`, scroll cue. Type is DOM (not WebGL) — always crisp and
selectable.

### 02 — Developer
- Editor card `~/tamen/manifesto.ts`: typed-out principles with blinking cursor
  (recovered emergent bit, kept).
- Short bio (real copy, no invented numbers):
  "I build resilient interfaces and API-first systems. Comfortable across the stack —
  from low-level performance work to design-driven product engineering."
- **Selected work = the two sub-sites + future placeholders** (per Tamen):
  - CloudOps Portfolio — observability console (traces, metrics, logs) —
    Next.js / TypeScript / Tailwind — card imagery is a **captured homepage
    screenshot** of the real site; whole card links to `CLOUDOPS_URL`. Primary card,
    dev-accent treatment.
  - Photography Portfolio — dark cinematic gallery of real frames — captured
    homepage screenshot; whole card links to `PHOTOS_URL`. Secondary card,
    warm treatment.
  - 1–2 **placeholder cards for future projects** — dashed-border, muted
    "in orbit — coming soon" treatment, non-clickable.
  - Screenshots captured from the running sites during implementation, committed as
    static images under `public/previews/`.
- Stack chips (editable list in `site.ts`; initial: TypeScript, React, Next.js,
  Node.js, Python, PostgreSQL, Docker, AWS, TailwindCSS).

### 03 — Photographer
- Statement: "A slow, patient practice…" (recovered copy).
- Masonry gallery of ~9 real photos across collections (iceland, spiti, astro, moon,
  leh, sikkim), each with EXIF-style mono caption + real location. Curated list
  finalized during implementation from the manifest. **Every photo is a link to the
  photography site** (`PHOTOS_URL`) — hover shows "view on photography ↗".
- CTA panel → photography-portfolio (`PHOTOS_URL`).

### 04 — About
Bridge quote: "Two crafts, one obsession: pattern. Whether it's a well-typed function
or a well-timed frame, I'm looking for the shape underneath." Dual mini-bios under
`// as a developer` and `— as a photographer` labels.

### 05 — Contact
Large mailto CTA (`jj794001@gmail.com`), social row, location line. No form.

### Footer
"Crafted in the dark · v1.0" + minimal links.

## Content (single source: `src/lib/site.ts`)

- Name: Tamen Dutta
- Role: Software Developer × Photographer
- Email: `jj794001@gmail.com`
- Location: Bangalore, IN
- GitHub: `https://github.com/tamen25`
- LinkedIn: `https://www.linkedin.com/in/tamen-dutta/`
- Instagram: `https://www.instagram.com/tamendutta/`
- Domain: `https://tamendutta.com` (metadata/OG only)
- Bios: recovered dev/photo/bridge copy (above)
- Stats: none

## Sub-site wiring

Links read from env; defaults depend on environment:

- `NEXT_PUBLIC_CLOUDOPS_URL` — prod default `https://cloudops.tamendutta.com`,
  dev default `http://localhost:3000`
- `NEXT_PUBLIC_PHOTOS_URL` — prod default `https://photography.tamendutta.com`,
  dev default `http://localhost:3001`

(`NODE_ENV`-based fallback when env unset.) `.env.example` committed with both.

## Photos pipeline

`scripts/import-photos.mjs`:
1. Reads `../photography-portfolio/src/lib/photo-manifest.json`
   (144 entries: `{id, collection, src, width, height}`).
2. Copies a curated id list (~10: gallery 9 + hero aurora) from
   `../photography-portfolio/public/photos/` into `main-portfolio/public/photos/`.
3. Writes `src/lib/photo-manifest.json` (id, src, width, height, location, exif-ish
   caption fields maintained in the curated list).

Copied derivatives are committed (repo already serves web derivatives from git in
photography-portfolio; originals stay gitignored there). Sites remain independent at
build/runtime — the script is the only cross-folder touchpoint.

## Architecture

```
main-portfolio/
├── package.json            # dev -p 3002
├── .env.example
├── scripts/import-photos.mjs
├── src/
│   ├── app/
│   │   ├── layout.tsx      # fonts, metadata (title, OG, tamendutta.com)
│   │   ├── page.tsx        # section composition
│   │   └── globals.css     # tokens, grain, utilities
│   ├── components/
│   │   ├── Nav.tsx  Hero.tsx  HeroScene.tsx  Developer.tsx  Photographer.tsx
│   │   ├── About.tsx  Contact.tsx  Footer.tsx
│   │   ├── SmoothScroll.tsx # Lenis provider
│   │   └── Reveal.tsx      # IntersectionObserver reveal wrapper
│   └── lib/
│       ├── site.ts         # all content
│       └── photo-manifest.json
├── public/previews/        # captured homepage screenshots of both sub-sites
└── test/
    └── site-data.test.ts
```

All components server components except leaf client components (`HeroScene` — R3F
canvas, `next/dynamic` no-SSR; manifesto typing; `SmoothScroll`; `Reveal`).

## Error handling

- Missing photo file for a manifest entry → build-time test failure (not runtime 404).
- Env URLs absent → environment-based fallbacks; links always render.
- Reduced motion → typing renders full text instantly; hero static; Lenis disabled.
- No WebGL / canvas init failure → hero falls back to static split, page fully usable.

## Testing

- `test/site-data.test.ts`: every manifest entry's file exists under `public/photos`;
  site.ts URLs are well-formed; email non-empty; curated manifest non-empty.
- `npm run lint`, `npm run build` must pass.
- Visual QA via browse (screenshots desktop + mobile) before sign-off.

## Repo chores

- Add `main-portfolio` section to root `CLAUDE.md` and row to `README.md` table.
