# Main Portfolio Hub — Design Spec

**Date:** 2026-07-03
**Status:** Approved by Tamen
**Folder:** `main-portfolio/` (new top-level site in the Websites monorepo)

## Purpose

The site the apex domain (no subdomain) points to. A single-page dark
cinematic landing page that presents Tamen Dutta and routes visitors out to
the other sites in this monorepo (photography-portfolio, cloudops-portfolio,
and future sites) via the Selected Works grid.

## Decisions

| Decision | Choice |
| --- | --- |
| Stack | Next.js 16 + TypeScript + Tailwind 4 (matches sibling sites), plus `gsap`, `motion` (maintained framer-motion successor, same API), `hls.js` |
| Routing | Single page (`app/page.tsx`), one client component per section; smooth-scroll anchors; no react-router |
| Works grid | 2 real site cards (Photography, CloudOps) + 2 placeholder cards, preserving the 7/5/5/7 bento layout |
| Site links | Env vars `NEXT_PUBLIC_PHOTOGRAPHY_URL` and `NEXT_PUBLIC_CLOUDOPS_URL`, documented in `.env.example`, defaulting to local dev ports |
| Identity | Name **Tamen Dutta**, logo ring **TD**, roles `["Creative", "CloudOps", "Photographer", "Builder"]`, city placeholder until supplied, email `jj794001@gmail.com`, GitHub `tamen25` real + other socials placeholder, stats decorative (20+ / 95+ / 200%) |
| Theme | Forced dark, no light mode |

## Global Design System

### Fonts
Google Fonts: Inter (300–700) and Instrument Serif (italic 400).
- `--font-body: 'Inter', sans-serif` → `font-body`
- `--font-display: 'Instrument Serif', serif` → `font-display`

### CSS custom properties (HSL triplets, no `hsl()` wrapper)
```
--bg: 0 0% 4%;
--surface: 0 0% 8%;
--text: 0 0% 96%;
--muted: 0 0% 53%;
--stroke: 0 0% 12%;
--accent: 0 0% 96%;
```

### Tailwind custom colors
`bg`, `surface`, `text-primary`, `muted`, `stroke` — each `hsl(var(--*))`.

### Accent gradient
`linear-gradient(90deg, #89AACC 0%, #4E85BF 100%)` — logo ring, hover
borders, progress bars. Utility class `.accent-gradient`.

### Custom animations
- `scroll-down`: translateY(-100%) → translateY(200%), 1.5s ease-in-out infinite
- `role-fade-in`: opacity 0 + translateY(8px) → opacity 1 + translateY(0), 0.4s ease-out
- `gradient-shift`: background-position 0% 50% → 100% 50% → 0% 50%, 6s ease infinite

## Sections

### 1. Loading Screen
Full-screen overlay (`fixed inset-0 z-[9999] bg-bg`), requestAnimationFrame
counter 000→100 over 2700ms.
- Top-left "Portfolio" label: `text-xs text-muted uppercase tracking-[0.3em]`, animates y −20→0, opacity 0→1.
- Center rotating words `["Design", "Create", "Inspire"]` every 900ms, AnimatePresence `mode="wait"`, y 20→0→−20. `text-4xl md:text-6xl lg:text-7xl font-display italic text-text-primary/80`.
- Bottom-right counter: `text-6xl md:text-8xl lg:text-9xl font-display tabular-nums`, `String(count).padStart(3, "0")`.
- Bottom progress bar: `h-[3px] bg-stroke/50`, inner `.accent-gradient` scaleX(count/100), `box-shadow: 0 0 8px rgba(137, 170, 204, 0.35)`.
- On count = 100: 400ms delay, then `onComplete`.

### 2. Hero
Full-viewport, background HLS video, centered content.

**Video:** `https://stream.mux.com/Aa02T7oM1wH5Mk5EEVDYhbZ1ChcdhRsS2m1NYyx4Ua1g.m3u8`
via hls.js (`Hls.isSupported()` else native HLS `video.src`). `autoPlay muted
loop playsInline`, absolutely centered, `min-w-full min-h-full object-cover
-translate-x-1/2 -translate-y-1/2`. Overlay `bg-black/20`; bottom fade `h-48
bg-gradient-to-t from-bg to-transparent`.

**Navbar:** fixed top-center pill — `inline-flex items-center rounded-full
backdrop-blur-md border border-white/10 bg-surface px-2 py-2`, gains
`shadow-md shadow-black/10` past scrollY 100. Contents: TD logo (9×9 circle,
accent-gradient ring reversing on hover, inner `bg-bg` circle, `font-display
italic text-[13px]`, scales 110% on hover) · divider · nav links Home / Work /
Resume (`text-xs sm:text-sm rounded-full px-3 sm:px-4 py-1.5 sm:py-2`; active
`text-text-primary bg-stroke/50`) · divider · "Say hi ↗" button with gradient
hover border ring (absolute span, `inset: -2px`, inner `bg-surface
rounded-full backdrop-blur-md`).

**Content (z-10, centered):**
- Eyebrow "COLLECTION '26", `.blur-in`.
- Name **Tamen Dutta**: `text-6xl md:text-8xl lg:text-9xl font-display italic leading-[0.9] tracking-tight mb-6`, `.name-reveal`.
- Role line: "A {role} lives in {city placeholder}." — roles cycle every 2s through `["Creative", "CloudOps", "Photographer", "Builder"]`, role word `font-display italic animate-role-fade-in inline-block` with `key={roleIndex}`.
- Description: `text-sm md:text-base text-muted max-w-md mb-12` — "Designing seamless digital interactions by focusing on the unique nuances which bring systems to life."
- CTAs: "See Works" (solid `bg-text-primary text-bg`, hover inverts with gradient ring) and "Reach out..." (outlined `border-2 border-stroke`, hover gradient ring). Both `rounded-full text-sm px-7 py-3.5 hover:scale-105`.

**GSAP entrance** (`power3.out`): `.name-reveal` opacity 0→1 y 50→0 1.2s
delay 0.1s; `.blur-in` opacity 0→1 blur(10px)→0 y 20→0 1s stagger 0.1
delay 0.3s.

**Scroll indicator:** bottom-center "SCROLL" label over `w-px h-10 bg-stroke`
line with `.animate-scroll-down` highlight.

### 3. Selected Works — the hub segments
`bg-bg py-12 md:py-16`, inner `max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16`.

Header (Framer Motion whileInView, opacity 0→1 y 30→0 1s ease
[0.25,0.1,0.25,1], viewport once, margin −100px): eyebrow line + "Selected
Work" · heading "Featured *projects*" (italic display word) · subtext ·
desktop "View all work" button.

Bento grid `grid-cols-1 md:grid-cols-12 gap-5 md:gap-6`, spans 7/5/5/7:
1. **Landscape Photography** → `NEXT_PUBLIC_PHOTOGRAPHY_URL` (external link)
2. **CloudOps** → `NEXT_PUBLIC_CLOUDOPS_URL` (external link)
3. Placeholder card (future site)
4. Placeholder card (future site)

Each card: `bg-surface border border-stroke rounded-3xl`, background image
`object-cover group-hover:scale-105`, halftone overlay (radial-gradient
`#000 1px` at 4×4px, `opacity-20 mix-blend-multiply`), hover `bg-bg/70` +
`backdrop-blur-lg` fade-in, hover pill with animated gradient border and
"View — *Title*".

### 4. Journal
`bg-bg py-16 md:py-24`. Same header pattern ("Recent *thoughts*"). 4 entries
as horizontal pills (`rounded-[40px] sm:rounded-full`): image, title, read
time, date. `flex items-center gap-6 p-4 bg-surface/30 hover:bg-surface
border border-stroke`. Placeholder content.

### 5. Explorations (parallax gallery)
`min-h-[300vh]`. Layer 1: pinned h-screen center (GSAP
`ScrollTrigger.create({ pin, pinSpacing: false })`) with eyebrow
"Explorations", heading "Visual *playground*", subtext + Dribbble button.
Layer 2 (z-20 absolute): `grid-cols-2 gap-12 md:gap-40` in `max-w-[1400px]`,
6 items in 2 columns with GSAP scroll-driven parallax; cards
`aspect-square max-w-[320px]` with rotation and click lightbox.

### 6. Stats
`bg-bg py-16 md:py-24`, 3-column grid: 20+ Years Experience, 95+ Projects
Done, 200% Satisfied Clients (decorative placeholders).

### 7. Contact / Footer
`bg-bg pt-16 md:pt-20 pb-8 md:pb-12 overflow-hidden`. Same HLS video flipped
(`scale-y-[-1]`), overlay `bg-black/60`. GSAP marquee "BUILDING THE FUTURE • "
×10, `xPercent: -50, duration 40, ease "none", repeat -1`. Email CTA
`mailto:jj794001@gmail.com` with gradient hover ring. Footer bar: socials
(GitHub real → `github.com/tamen25`; Twitter/LinkedIn/Dribbble placeholders)
+ green pulsing dot + "Available for projects".

## Non-goals

- No CMS, no real journal content, no light mode, no resume page (nav link
  can point to `#` or future URL).
- No shared code with sibling sites — the folder stays self-contained per
  repo convention.

## Verification

- `npm run lint`, `npm test` (tsx --test, covering site config/link logic),
  and `npm run build` all pass inside `main-portfolio/`.
- `README.md` table and root `CLAUDE.md` gain a main-portfolio entry.
