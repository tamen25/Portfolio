# Photography Portfolio — Design Spec

**Date:** 2026-07-02
**Site:** `photography-portfolio/` (new top-level site in the Websites monorepo)
**Brand:** Tamen Dutta — landscape photography portfolio
**Reference:** dark cinematic Figma template export in `design-refs/` (not committed)

## 1. Purpose and scope

A portfolio site that presents Tamen Dutta's landscape photography. The photos are
the product; the UI is the dark room they hang in. Two pages:

- **Home (`/`)** — cinematic landing adapted from the template's section rhythm.
- **Portfolio (`/portfolio`)** — collections with masonry galleries and a lightbox.

Approach approved by Tamen: *template skeleton, elevated* — keep the template's dark
mood and section order where it serves, redesign the content around landscape work.

**Design read:** personal landscape-photography portfolio for viewers and potential
print buyers, dark cinematic immersive language, custom Tailwind + Motion + one WebGL
shader layer sourced from 21st.dev.

**Dials:** `DESIGN_VARIANCE: 8` · `MOTION_INTENSITY: 7` · `VISUAL_DENSITY: 2`.

## 2. Design concept — "Alpenglow"

The site behaves like standing outdoors at dusk: near-black cool darkness, the
photographs as the only light sources, one warm accent taken from last light on a
ridgeline.

### 2.1 Color tokens (dark-only, deliberate)

The page theme is locked to dark. This is the explicit brand direction from the
template Tamen chose, not a default; a light mode would work against photograph-first
viewing. Defined as CSS variables, consumed through the Tailwind theme.

| Token | Hex | Role |
|---|---|---|
| `--night` | `#07090C` | page background |
| `--ridge` | `#11151B` | elevated surfaces |
| `--snowlight` | `#E8E6E1` | primary text |
| `--overcast` | `#8A929E` | secondary text |
| `--alpenglow` | `#D98B6A` | single accent: CTAs, active states, horizon rule |

No other accents anywhere. Contrast: WCAG AA minimum for body text, AAA target for
hero copy.

### 2.2 Typography

| Role | Face | Source |
|---|---|---|
| Display / headlines | Clash Display | Fontshare, self-hosted via `next/font/local` |
| Body | Satoshi | Fontshare, self-hosted via `next/font/local` |
| EXIF captions only | JetBrains Mono | Google Fonts via `next/font` |

Display scale: `text-4xl md:text-6xl tracking-tight leading-none`, max 2-line
headlines. Body: `text-base leading-relaxed max-w-[65ch]` in `--overcast`, primary
copy in `--snowlight`. Mono appears **only** in EXIF captions
(`24mm · f/8 · 1/250s · ISO 100`) under photographs.

### 2.3 Shape system (documented rule)

- Images and image cards: **radius 0** — photographic frames are sharp.
- Interactive elements (buttons, pills, lightbox controls): **full pill**.
- No other radii anywhere.

### 2.4 Signature elements (the two memorable things)

1. **The horizon line.** A 1px `--alpenglow` rule used as the recurring structural
   device: the hero headline sits on it, section transitions reuse it, the footer
   closes with it. It is the only decorative line on the site.
2. **The shader hero.** Full-bleed landscape photograph with a slow-drifting WebGL
   fog/atmosphere layer above it (component sourced from 21st.dev, e.g. Paper
   Shaders' fog/mesh; final pick during implementation). Headline rests on the
   horizon line over the image.

Everything else stays quiet so these two carry the identity.

## 3. Pages and sections

### 3.1 Home (`/`)

1. **Hero** — full-bleed landscape + shader atmosphere. Text stack (max 4 elements):
   headline (≤ 2 lines), subtext (≤ 20 words), primary CTA "View portfolio"
   (pill, alpenglow), nav above. `min-h-[100dvh]`, image `next/image priority`.
2. **About** — split layout (image left ~40%, text right), short bio (placeholder
   copy until Tamen provides his own), no CTA.
3. **Selected collections** — asymmetric grid (`2fr 1fr` rhythm, one tall cell),
   3 collections with cover photo, name, photo count. Each links to
   `/portfolio#<collection>`. Placeholder collection names: *Ridgelines*, *Coasts*,
   *Nightfall* — renamed when real photos land.
4. **Wide frame** — one full-width panorama with a scroll-scrubbed zoom-parallax
   (GSAP ScrollTrigger), EXIF caption beneath (outside the image).
5. **Instagram** — masonry grid of 6 recent shots, whole section links to the
   Instagram profile. Profile URL lives in `src/lib/site.ts`; ships as `null`
   (section hidden) until Tamen provides the handle.
6. **Contact** — closing CTA: one headline, one line of copy, one "Contact"
   pill (`mailto:jj794001@gmail.com`; confirm or replace at review). The word
   "Contact" is the single label for the contact intent everywhere (nav + CTA).
7. **Footer** — wordmark, page links, Instagram link, copyright. Horizon rule on top.

Layout families used: full-bleed hero, split, asymmetric grid, full-width scrub,
masonry, centered CTA — no family repeats.

CTA intents on the page: "View portfolio" (portfolio intent, hero only) and
"Contact" (contact intent, contact section + nav link). One label per intent,
everywhere.

### 3.2 Portfolio (`/portfolio`)

1. **Header** — page title + one-line intro, horizon rule.
2. **Collection sections** — one per collection, anchored (`#ridgelines` etc.):
   collection name, optional one-liner, masonry photo grid (CSS columns or grid
   with mixed aspect ratios). Hover: subtle scale (1.03) + EXIF caption fade-in.
3. **Lightbox** — click opens full-viewport viewer: photo, EXIF caption, prev/next,
   keyboard navigation (arrows, Esc), focus-trapped, body scroll locked.

### 3.3 Navigation

Single-line desktop nav, height 64px: wordmark "Tamen Dutta" left; "Portfolio",
"About" (anchor on home), "Contact" (anchor) right. Hamburger sheet below `md`.
Transparent over the hero, gains `--night/80` backdrop blur after scroll.

## 4. Architecture

- **Stack:** Next.js (App Router) + TypeScript + Tailwind v4 + Motion
  (`motion/react`) + GSAP (ScrollTrigger, only for the wide-frame scrub) +
  `@phosphor-icons/react` (one family, `strokeWidth 1.5`).
- **Shaders:** hero atmosphere component pulled from 21st.dev during
  implementation (candidates: Paper Shaders fog/mesh-gradient family). Isolated in
  a `"use client"` leaf, lazy-loaded, paused off-screen, static image fallback.
- **Components:** sections are Server Components; anything with motion, scroll, or
  pointer physics is an isolated client leaf. No `window.addEventListener("scroll")`;
  Motion `useScroll`/`whileInView` and ScrollTrigger only.
- **Photo manifest:** `src/lib/photos.ts` exports `Photo[]`:
  `{ src, alt, collection, aspect, exif? }`. Build ships with seeded picsum
  placeholders (clearly marked); Tamen drops real files into `public/photos/` and
  edits only the manifest. All EXIF placeholder values are marked as sample data.
- **Site config:** `src/lib/site.ts` — name, email, Instagram URL (nullable),
  collection definitions.

Directory sketch:

```
photography-portfolio/
├── docs/superpowers/specs/        # this spec
├── design-refs/                   # Figma exports (gitignored)
├── public/photos/                 # real photos land here
└── src/
    ├── app/                       # layout, page, portfolio/page
    ├── components/                # nav, footer, sections/, gallery/, hero/
    └── lib/                       # photos.ts, site.ts
```

## 5. Motion spec

All gated behind `prefers-reduced-motion` (Motion `useReducedMotion`; CSS media
query for CSS-only effects). Reduced mode: static hero image, instant reveals.

- **Hero load-in (storytelling):** image scale 1.05→1 + fade, shader fade-in,
  headline rises onto the horizon line, nav fades. Single orchestrated sequence.
- **Scroll reveals (hierarchy):** `whileInView` fade/rise with slight stagger on
  section entries, `viewport={{ once: true }}`.
- **Wide-frame scrub (storytelling):** GSAP ScrollTrigger scrubbed zoom-parallax as
  the panorama passes through the viewport.
- **Gallery hover (feedback):** scale 1.03 + caption fade, `:active` scale 0.98 on
  interactive elements.

Only `transform` and `opacity` are animated.

## 6. Performance and accessibility

- LCP < 2.5s: hero via `next/image` with `priority`; shader loads after the image.
- Shader canvas: `pointer-events-none`, paused when off-screen or tab hidden,
  WebGL failure falls back to the plain photograph.
- CLS < 0.1: every image has explicit aspect ratio from the manifest.
- Keyboard: visible focus states throughout; lightbox focus-trapped with Esc/arrows.
- Alt text required on every `Photo` entry.

## 7. Out of scope

Blog, print e-commerce/checkout, CMS, booking system, testimonials, analytics,
light mode. The remaining template sections (testimonials carousel, booking) were
explicitly dropped by Tamen.

## 8. Inputs still owed by Tamen (do not block the build)

- Real photographs → `public/photos/` + manifest entries (placeholders until then)
- Instagram profile URL (section stays hidden until provided)
- Short bio for About (placeholder copy ships first)
- Confirmation of contact email (`jj794001@gmail.com` assumed)
- Eventual domain/subdomain for deployment (site works on `*.vercel.app` first)
