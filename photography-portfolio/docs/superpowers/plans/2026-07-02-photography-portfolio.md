# Photography Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the Tamen Dutta landscape-photography portfolio (Home + Portfolio pages) per the approved spec at `photography-portfolio/docs/superpowers/specs/2026-07-02-photography-portfolio-design.md`.

**Architecture:** Next.js App Router site in `photography-portfolio/` (self-contained monorepo folder). Server Components for all sections; motion/scroll/pointer work isolated in `"use client"` leaves. All photo data flows through one manifest (`src/lib/photos.ts`); site identity through `src/lib/site.ts`.

**Tech Stack:** Next.js 16 + TypeScript + Tailwind v4, Motion (`motion/react`), GSAP ScrollTrigger (wide-frame only), `@paper-design/shaders-react` (hero shader, the Paper Shaders library featured on 21st.dev), `@phosphor-icons/react`, `tsx` + `node:test` for tests.

## Global Constraints

- Palette (only these + opacity variants): `--night #07090C`, `--ridge #11151B`, `--snowlight #E8E6E1`, `--overcast #8A929E`, accent `--alpenglow #D98B6A`. One accent, everywhere.
- Dark-only theme. `color-scheme: dark`. No light mode.
- Fonts: Clash Display 500/600 (display), Satoshi 400/500 (body) via `next/font/local`; JetBrains Mono 400 via `next/font/google`, used ONLY for EXIF captions.
- Shape rule: images/cards radius 0; interactive elements full pill (`rounded-full`). Nothing else.
- ZERO em-dashes (`—`) or en-dashes (`–`) in any visible string. Hyphens only.
- CTA labels, fixed: "View portfolio" (portfolio intent, hero only), "Contact" (contact intent, nav + contact section). No synonyms.
- No `window.addEventListener("scroll")` anywhere. Motion `useScroll`/`whileInView` or GSAP ScrollTrigger only.
- Every animation gated behind reduced motion (`useReducedMotion` from `motion/react`, or CSS media query).
- Animate only `transform` and `opacity`.
- Icons: `@phosphor-icons/react` only.
- All images come from the `photos.ts` manifest; every `Photo` has non-empty `alt`. Placeholders are seeded picsum URLs; EXIF placeholder values carry `sample: true`.
- Hero uses `min-h-[100dvh]`, never `h-screen`.
- The cloudops dev server may occupy port 3000; QA this site on port 3001 (`npm run dev -- -p 3001`).
- Run all commands from `G:/Desk/Code/Websites/photography-portfolio` unless stated otherwise.

---

### Task 1: Scaffold the Next.js app and repo docs

**Files:**
- Create: entire Next.js scaffold in `photography-portfolio/` (via temp dir; the folder already contains `docs/` and `design-refs/`)
- Modify: `photography-portfolio/next.config.ts`, `photography-portfolio/package.json`
- Modify: `G:/Desk/Code/Websites/README.md`, `G:/Desk/Code/Websites/CLAUDE.md`

**Interfaces:**
- Consumes: nothing.
- Produces: working `npm run dev` / `npm run build` / `npm test` scripts; `@/*` path alias to `src/*`; picsum allowed in `next/image`.

- [ ] **Step 1: Scaffold via temp dir (create-next-app refuses non-empty dirs)**

```bash
cd "G:/Desk/Code/Websites"
npx create-next-app@latest photography-portfolio-scaffold --typescript --tailwind --eslint --app --src-dir --turbopack --import-alias "@/*" --yes
cp -r photography-portfolio-scaffold/. photography-portfolio/
rm -rf photography-portfolio-scaffold
```

- [ ] **Step 2: Install runtime + dev dependencies**

```bash
cd "G:/Desk/Code/Websites/photography-portfolio"
npm install motion gsap @phosphor-icons/react @paper-design/shaders-react
npm install -D tsx
```

- [ ] **Step 3: Allow picsum placeholder hosts in `next.config.ts`** (picsum 302-redirects to fastly)

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "fastly.picsum.photos" },
    ],
  },
};

export default nextConfig;
```

- [ ] **Step 4: Add test script to `package.json` scripts**

```json
"test": "tsx --test test/*.test.ts"
```

- [ ] **Step 5: Verify the scaffold builds**

Run: `npm run build`
Expected: build succeeds (default create-next-app page).

- [ ] **Step 6: Update repo docs per monorepo convention**

In `G:/Desk/Code/Websites/README.md`, add a row for `photography-portfolio` to the sites table, matching the existing columns (name + description): landscape photography portfolio, Next.js + TypeScript + Tailwind.

In `G:/Desk/Code/Websites/CLAUDE.md`, under "Working in a site", add:

````markdown
### photography-portfolio (Next.js + TypeScript)

```bash
cd photography-portfolio
npm install            # install deps
npm run dev            # start dev server (next dev; use -p 3001 if 3000 is busy)
npm run build          # production build
npm run lint           # eslint
npm test               # tsx --test test/*.test.ts
```
````

- [ ] **Step 7: Commit**

```bash
cd "G:/Desk/Code/Websites"
rtk git add photography-portfolio README.md CLAUDE.md && rtk git commit -m "feat(photography): scaffold Next.js app with deps and repo docs"
```

---

### Task 2: Design tokens, fonts, root layout

**Files:**
- Create: `src/fonts/` (4 woff2 files), `src/app/globals.css` (replace), `src/app/layout.tsx` (replace)
- Delete: default `src/app/page.tsx` content (replace with minimal token proof, rebuilt in Task 5)

**Interfaces:**
- Consumes: scaffold from Task 1.
- Produces: Tailwind classes `bg-night`, `bg-ridge`, `text-snowlight`, `text-overcast`, `bg-alpenglow`, `border-ridge` etc.; `font-display`, `font-body`, `font-exif`; fonts wired as CSS vars `--font-clash`, `--font-satoshi`, `--font-jbmono`.

- [ ] **Step 1: Download Clash Display + Satoshi woff2 from Fontshare**

```bash
mkdir -p src/fonts
curl -sL -A "Mozilla/5.0" "https://api.fontshare.com/v2/css?f[]=clash-display@500,600&f[]=satoshi@400,500&display=swap" -o /tmp/fontshare.css
grep -o 'https://[^)]*\.woff2' /tmp/fontshare.css
```

Download each listed woff2 (one per family+weight) into `src/fonts/` with these exact names: `clash-display-500.woff2`, `clash-display-600.woff2`, `satoshi-400.woff2`, `satoshi-500.woff2`. Match URL to weight by the `font-weight` in the surrounding `@font-face` block of `/tmp/fontshare.css`. If Fontshare is unreachable, retry; do not substitute other fonts.

- [ ] **Step 2: Replace `src/app/globals.css`**

```css
@import "tailwindcss";

@theme {
  --color-night: #07090c;
  --color-ridge: #11151b;
  --color-snowlight: #e8e6e1;
  --color-overcast: #8a929e;
  --color-alpenglow: #d98b6a;

  --font-display: var(--font-clash), sans-serif;
  --font-body: var(--font-satoshi), sans-serif;
  --font-exif: var(--font-jbmono), monospace;
}

html {
  color-scheme: dark;
  scroll-behavior: smooth;
}

body {
  background-color: var(--color-night);
  color: var(--color-snowlight);
  font-family: var(--font-body);
  -webkit-font-smoothing: antialiased;
}

@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }
}
```

- [ ] **Step 3: Replace `src/app/layout.tsx`**

```tsx
import type { Metadata } from "next";
import localFont from "next/font/local";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";

const clash = localFont({
  src: [
    { path: "../fonts/clash-display-500.woff2", weight: "500" },
    { path: "../fonts/clash-display-600.woff2", weight: "600" },
  ],
  variable: "--font-clash",
  display: "swap",
});

const satoshi = localFont({
  src: [
    { path: "../fonts/satoshi-400.woff2", weight: "400" },
    { path: "../fonts/satoshi-500.woff2", weight: "500" },
  ],
  variable: "--font-satoshi",
  display: "swap",
});

const jbMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-jbmono",
});

export const metadata: Metadata = {
  title: "Tamen Dutta | Landscape Photography",
  description:
    "Landscape photography by Tamen Dutta: mountains, coasts, and night skies, photographed slowly.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${clash.variable} ${satoshi.variable} ${jbMono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
```

- [ ] **Step 4: Replace `src/app/page.tsx` with a token proof page** (temporary; rebuilt in Task 5)

```tsx
export default function Home() {
  return (
    <main className="flex min-h-[100dvh] flex-col items-start justify-center gap-4 px-6">
      <h1 className="font-display text-6xl font-medium tracking-tight">
        Alpenglow
      </h1>
      <p className="text-overcast">Token proof page. Replaced by the hero.</p>
      <p className="font-exif text-xs text-overcast">24mm · f/8 · 1/250s · ISO 100</p>
      <div className="h-px w-64 bg-alpenglow/60" />
    </main>
  );
}
```

- [ ] **Step 5: Verify visually and build**

Run: `npm run build`
Expected: success, no font resolution errors.
Then `npm run dev -- -p 3001`, open `http://localhost:3001`: near-black background, Clash Display headline, mono EXIF line, alpenglow rule.

- [ ] **Step 6: Commit**

```bash
cd "G:/Desk/Code/Websites"
rtk git add photography-portfolio && rtk git commit -m "feat(photography): Alpenglow tokens, self-hosted fonts, root layout"
```

---

### Task 3: Site config + photo manifest (TDD)

**Files:**
- Create: `src/lib/site.ts`, `src/lib/photos.ts`, `test/manifest.test.ts`

**Interfaces:**
- Consumes: nothing.
- Produces (exact, used by all later tasks):
  - `SITE: { name: string; tagline: string; email: string; instagram: string | null }`
  - `type CollectionId = "ridgelines" | "coasts" | "nightfall"`
  - `type Exif = { focal: string; aperture: string; shutter: string; iso: number; sample: boolean }`
  - `type Photo = { id: string; src: string; alt: string; collection: CollectionId; width: number; height: number; exif?: Exif }`
  - `type Collection = { id: CollectionId; name: string; blurb: string }`
  - `COLLECTIONS: Collection[]`, `PHOTOS: Photo[]`, `HERO_PHOTO: Photo`, `PANORAMA_PHOTO: Photo`, `INSTAGRAM_PHOTOS: Photo[]`
  - `photosByCollection(id: CollectionId): Photo[]`, `collectionCover(id: CollectionId): Photo`, `formatExif(e: Exif): string`

- [ ] **Step 1: Write the failing test `test/manifest.test.ts`**

```ts
import test from "node:test";
import assert from "node:assert/strict";
import {
  PHOTOS,
  COLLECTIONS,
  HERO_PHOTO,
  PANORAMA_PHOTO,
  INSTAGRAM_PHOTOS,
  photosByCollection,
  collectionCover,
  formatExif,
} from "../src/lib/photos";
import { SITE } from "../src/lib/site";

test("site config is complete", () => {
  assert.ok(SITE.name.length > 0);
  assert.ok(SITE.email.includes("@"));
  assert.ok(SITE.instagram === null || SITE.instagram.startsWith("https://"));
});

test("photo ids are unique", () => {
  const ids = PHOTOS.map((p) => p.id);
  assert.equal(new Set(ids).size, ids.length);
});

test("every photo has alt text and positive dimensions", () => {
  for (const p of [...PHOTOS, HERO_PHOTO, PANORAMA_PHOTO]) {
    assert.ok(p.alt.trim().length > 0, `missing alt: ${p.id}`);
    assert.ok(p.width > 0 && p.height > 0, `bad dims: ${p.id}`);
  }
});

test("every collection has at least 4 photos and a cover", () => {
  for (const c of COLLECTIONS) {
    assert.ok(photosByCollection(c.id).length >= 4, c.id);
    assert.ok(collectionCover(c.id));
  }
});

test("panorama is actually wide", () => {
  assert.ok(PANORAMA_PHOTO.width / PANORAMA_PHOTO.height >= 2);
});

test("instagram strip has 6 photos", () => {
  assert.equal(INSTAGRAM_PHOTOS.length, 6);
});

test("formatExif renders the caption line", () => {
  const line = formatExif({
    focal: "24mm",
    aperture: "f/8",
    shutter: "1/250s",
    iso: 100,
    sample: true,
  });
  assert.equal(line, "24mm · f/8 · 1/250s · ISO 100");
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test`
Expected: FAIL, cannot find module `../src/lib/photos`.

- [ ] **Step 3: Create `src/lib/site.ts`**

```ts
export const SITE = {
  name: "Tamen Dutta",
  tagline: "Landscape photography",
  email: "jj794001@gmail.com",
  // Instagram section stays hidden until this is a profile URL.
  instagram: null as string | null,
};
```

- [ ] **Step 4: Create `src/lib/photos.ts`**

```ts
export type CollectionId = "ridgelines" | "coasts" | "nightfall";

export type Exif = {
  focal: string;
  aperture: string;
  shutter: string;
  iso: number;
  /** true while the values are sample data, not read from a real frame */
  sample: boolean;
};

export type Photo = {
  id: string;
  src: string;
  alt: string;
  collection: CollectionId;
  width: number;
  height: number;
  exif?: Exif;
};

export type Collection = { id: CollectionId; name: string; blurb: string };

export const COLLECTIONS: Collection[] = [
  { id: "ridgelines", name: "Ridgelines", blurb: "High ground, thin light." },
  { id: "coasts", name: "Coasts", blurb: "Where the land gives up." },
  { id: "nightfall", name: "Nightfall", blurb: "After the sun, before the dark." },
];

const exif = (
  focal: string,
  aperture: string,
  shutter: string,
  iso: number,
): Exif => ({ focal, aperture, shutter, iso, sample: true });

// Placeholder photos: seeded picsum URLs. Real photos land in /public/photos
// and replace `src` here; nothing else in the app changes.
const ph = (
  id: string,
  collection: CollectionId,
  alt: string,
  width: number,
  height: number,
  e?: Exif,
): Photo => ({
  id,
  collection,
  alt,
  width,
  height,
  exif: e,
  src: `https://picsum.photos/seed/${id}/${width}/${height}`,
});

export const PHOTOS: Photo[] = [
  ph("ridgelines-01", "ridgelines", "Sunlit ridge above a valley of cloud", 1600, 2000, exif("24mm", "f/8", "1/250s", 100)),
  ph("ridgelines-02", "ridgelines", "Snow arete under a clearing storm", 1600, 1067, exif("70mm", "f/11", "1/500s", 200)),
  ph("ridgelines-03", "ridgelines", "Scree slope in late amber light", 1600, 1200, exif("35mm", "f/8", "1/320s", 100)),
  ph("ridgelines-04", "ridgelines", "Twin summits over morning fog", 1600, 1000, exif("50mm", "f/10", "1/400s", 100)),
  ph("ridgelines-05", "ridgelines", "Cairn on a windswept saddle", 1600, 2000, exif("28mm", "f/9", "1/250s", 125)),
  ph("ridgelines-06", "ridgelines", "Last light on a limestone crest", 1600, 1067, exif("85mm", "f/5.6", "1/640s", 200)),
  ph("coasts-01", "coasts", "Sea stack against silver overcast", 1600, 2000, exif("24mm", "f/11", "2s", 64)),
  ph("coasts-02", "coasts", "Tide lines braided across dark sand", 1600, 1067, exif("35mm", "f/8", "1/125s", 100)),
  ph("coasts-03", "coasts", "Basalt shelf under incoming swell", 1600, 1200, exif("21mm", "f/13", "4s", 64)),
  ph("coasts-04", "coasts", "Lighthouse in drifting sea mist", 1600, 1000, exif("70mm", "f/8", "1/200s", 160)),
  ph("coasts-05", "coasts", "Kelp beds at minus tide", 1600, 2000, exif("28mm", "f/9", "1/100s", 100)),
  ph("coasts-06", "coasts", "Storm front crossing the headland", 1600, 1067, exif("50mm", "f/10", "1/800s", 200)),
  ph("nightfall-01", "nightfall", "Milky Way over a dry lakebed", 1600, 2000, exif("14mm", "f/1.8", "20s", 3200)),
  ph("nightfall-02", "nightfall", "Alpenglow fading from a granite wall", 1600, 1067, exif("70mm", "f/5.6", "1/60s", 400)),
  ph("nightfall-03", "nightfall", "Moonrise between two peaks", 1600, 1200, exif("135mm", "f/4", "1/30s", 800)),
  ph("nightfall-04", "nightfall", "Blue hour over a frozen tarn", 1600, 1000, exif("24mm", "f/8", "8s", 100)),
  ph("nightfall-05", "nightfall", "Star trails above a lone pine", 1600, 2000, exif("20mm", "f/2.8", "30s", 1600)),
  ph("nightfall-06", "nightfall", "Dusk band over rolling foothills", 1600, 1067, exif("50mm", "f/7.1", "1/25s", 320)),
];

export const HERO_PHOTO: Photo = ph(
  "hero-dusk-ridge",
  "ridgelines",
  "Dusk light over a long mountain ridge",
  2400,
  1400,
  exif("35mm", "f/11", "1/60s", 64),
);

export const PANORAMA_PHOTO: Photo = ph(
  "wide-frame-panorama",
  "ridgelines",
  "Panorama of a ridgeline holding the last light",
  2400,
  1000,
  exif("70mm", "f/8", "1/125s", 100),
);

export const photosByCollection = (id: CollectionId): Photo[] =>
  PHOTOS.filter((p) => p.collection === id);

export const collectionCover = (id: CollectionId): Photo =>
  photosByCollection(id)[0];

export const INSTAGRAM_PHOTOS: Photo[] = COLLECTIONS.flatMap((c) =>
  photosByCollection(c.id).slice(0, 2),
);

export const formatExif = (e: Exif): string =>
  `${e.focal} · ${e.aperture} · ${e.shutter} · ISO ${e.iso}`;
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `npm test`
Expected: PASS, 7 tests.

- [ ] **Step 6: Commit**

```bash
cd "G:/Desk/Code/Websites"
rtk git add photography-portfolio && rtk git commit -m "feat(photography): site config and photo manifest with tests"
```

---

### Task 4: Shared UI (HorizonRule, Reveal, Nav, Footer)

**Files:**
- Create: `src/components/HorizonRule.tsx`, `src/components/Reveal.tsx`, `src/components/Nav.tsx`, `src/components/Footer.tsx`

**Interfaces:**
- Consumes: `SITE` from Task 3.
- Produces:
  - `HorizonRule({ className?: string })` server component: the 1px alpenglow rule.
  - `Reveal({ children, className?, delay? }: { children: ReactNode; className?: string; delay?: number })` client scroll-reveal wrapper.
  - `Nav()` client fixed header; `Footer()` server footer.

- [ ] **Step 1: Create `src/components/HorizonRule.tsx`**

```tsx
export function HorizonRule({ className = "" }: { className?: string }) {
  return <div aria-hidden className={`h-px w-full bg-alpenglow/60 ${className}`} />;
}
```

- [ ] **Step 2: Create `src/components/Reveal.tsx`**

```tsx
"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
```

- [ ] **Step 3: Create `src/components/Nav.tsx`**

```tsx
"use client";

import Link from "next/link";
import { useState } from "react";
import { useMotionValueEvent, useScroll } from "motion/react";
import { List, X } from "@phosphor-icons/react";
import { SITE } from "@/lib/site";

const LINKS = [
  { href: "/portfolio", label: "Portfolio" },
  { href: "/#about", label: "About" },
  { href: "/#contact", label: "Contact" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 24));

  const solid = scrolled || open;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-colors duration-300 ${
        solid ? "bg-night/80 backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-6">
        <Link href="/" className="font-display text-lg font-medium tracking-tight">
          {SITE.name}
        </Link>
        <div className="hidden items-center gap-8 md:flex">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm text-overcast transition-colors hover:text-snowlight focus-visible:text-snowlight"
            >
              {l.label}
            </Link>
          ))}
        </div>
        <button
          type="button"
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
          className="text-snowlight md:hidden"
        >
          {open ? <X size={24} /> : <List size={24} />}
        </button>
      </nav>
      {open && (
        <div className="border-t border-ridge px-6 pb-6 md:hidden">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block py-3 text-lg"
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
```

- [ ] **Step 4: Create `src/components/Footer.tsx`**

```tsx
import Link from "next/link";
import { SITE } from "@/lib/site";
import { HorizonRule } from "./HorizonRule";

export function Footer() {
  return (
    <footer className="mt-32">
      <HorizonRule />
      <div className="mx-auto flex max-w-[1400px] flex-col gap-6 px-6 py-12 md:flex-row md:items-center md:justify-between">
        <p className="font-display text-lg font-medium">{SITE.name}</p>
        <div className="flex gap-8 text-sm text-overcast">
          <Link href="/portfolio" className="transition-colors hover:text-snowlight">
            Portfolio
          </Link>
          <Link href="/#about" className="transition-colors hover:text-snowlight">
            About
          </Link>
          <Link href="/#contact" className="transition-colors hover:text-snowlight">
            Contact
          </Link>
          {SITE.instagram && (
            <a
              href={SITE.instagram}
              target="_blank"
              rel="noreferrer"
              className="transition-colors hover:text-snowlight"
            >
              Instagram
            </a>
          )}
        </div>
        <p className="text-sm text-overcast">© 2026 {SITE.name}</p>
      </div>
    </footer>
  );
}
```

- [ ] **Step 5: Wire Nav + Footer into the token proof page to verify** (temporary composition)

In `src/app/page.tsx`, wrap the existing content:

```tsx
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main className="flex min-h-[100dvh] flex-col items-start justify-center gap-4 px-6">
        <h1 className="font-display text-6xl font-medium tracking-tight">
          Alpenglow
        </h1>
        <p className="text-overcast">Token proof page. Replaced by the hero.</p>
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 6: Verify**

Run: `npm run build`
Expected: success.
Dev on 3001: nav fixed on one line at desktop (64px), gains blur after scrolling, hamburger sheet opens/closes below 768px, footer shows horizon rule.

- [ ] **Step 7: Commit**

```bash
cd "G:/Desk/Code/Websites"
rtk git add photography-portfolio && rtk git commit -m "feat(photography): horizon rule, reveal, nav, footer"
```

---

### Task 5: Hero with shader atmosphere

**Files:**
- Create: `src/components/HeroShader.tsx`, `src/components/Hero.tsx`
- Modify: `src/app/page.tsx` (replace proof content with `<Hero />`)

**Interfaces:**
- Consumes: `HERO_PHOTO` (Task 3), `HorizonRule` (Task 4).
- Produces: `Hero()` client section; `HeroShader()` client leaf (default-hidden under reduced motion and WebGL failure).

- [ ] **Step 1: Check the shader package API**

Read `node_modules/@paper-design/shaders-react/README.md` (or `dist` type defs). Confirm the `MeshGradient` export and its prop names (`colors`, `speed`, plus style/size props). If the props differ from Step 2's code, adapt Step 2 to the actual API; keep colors and slow speed semantics. This is the Paper Shaders library that 21st.dev's shader components build on.

- [ ] **Step 2: Create `src/components/HeroShader.tsx`**

```tsx
"use client";

import { Component, type ReactNode, useEffect, useRef, useState } from "react";
import { MeshGradient } from "@paper-design/shaders-react";

class ShaderBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export function HeroShader() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute inset-0 opacity-40 mix-blend-screen"
    >
      {visible && (
        <ShaderBoundary>
          <MeshGradient
            colors={["#07090c", "#11151b", "#8a929e", "#d98b6a"]}
            speed={0.12}
            style={{ width: "100%", height: "100%" }}
          />
        </ShaderBoundary>
      )}
    </div>
  );
}
```

- [ ] **Step 3: Create `src/components/Hero.tsx`**

```tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { motion, useReducedMotion } from "motion/react";
import { HERO_PHOTO } from "@/lib/photos";
import { HorizonRule } from "./HorizonRule";

const HeroShader = dynamic(
  () => import("./HeroShader").then((m) => m.HeroShader),
  { ssr: false },
);

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export function Hero() {
  const reduce = useReducedMotion();

  return (
    <section className="relative flex min-h-[100dvh] items-end overflow-hidden">
      <motion.div
        className="absolute inset-0"
        initial={reduce ? false : { scale: 1.06, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.4, ease: EASE }}
      >
        <Image
          src={HERO_PHOTO.src}
          alt={HERO_PHOTO.alt}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-night via-night/30 to-night/10" />
      </motion.div>
      {!reduce && <HeroShader />}
      <div className="relative z-10 mx-auto w-full max-w-[1400px] px-6 pb-24">
        <motion.h1
          initial={reduce ? false : { y: 32, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.5, ease: EASE }}
          className="max-w-3xl font-display text-5xl font-medium tracking-tight md:text-7xl"
        >
          Landscapes, in their own light.
        </motion.h1>
        <motion.div
          initial={reduce ? false : { scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.1, delay: 0.8, ease: EASE }}
          className="my-6 origin-left"
        >
          <HorizonRule />
        </motion.div>
        <motion.div
          initial={reduce ? false : { y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.9, delay: 1.0, ease: EASE }}
          className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between"
        >
          <p className="max-w-md text-overcast">
            Mountains, coasts, and night skies, photographed slowly.
          </p>
          <Link
            href="/portfolio"
            className="inline-flex h-12 items-center rounded-full bg-alpenglow px-7 text-sm font-medium text-night transition-transform hover:scale-[1.02] active:scale-[0.98]"
          >
            View portfolio
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Replace `src/app/page.tsx`**

```tsx
import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 5: Verify**

Run: `npm run build`
Expected: success.
Dev on 3001: full-bleed image hero fills viewport; shader drifts subtly over it (screen blend); headline rises onto the horizon rule; CTA pill readable (night text on alpenglow). With OS reduced motion enabled: static image, no shader, content visible immediately.

- [ ] **Step 6: Commit**

```bash
cd "G:/Desk/Code/Websites"
rtk git add photography-portfolio && rtk git commit -m "feat(photography): shader hero with orchestrated load-in"
```

---

### Task 6: About + Collections sections

**Files:**
- Create: `src/components/About.tsx`, `src/components/CollectionCard.tsx`, `src/components/Collections.tsx`
- Modify: `src/app/page.tsx`

**Interfaces:**
- Consumes: `photosByCollection`, `collectionCover`, `COLLECTIONS` (Task 3), `Reveal` (Task 4).
- Produces: `About()`, `Collections()` server sections; `CollectionCard({ id, className?, tall?, delay? })`.

- [ ] **Step 1: Create `src/components/About.tsx`**

```tsx
import Image from "next/image";
import { photosByCollection } from "@/lib/photos";
import { Reveal } from "./Reveal";

export function About() {
  const photo = photosByCollection("coasts")[1];

  return (
    <section id="about" className="mx-auto max-w-[1400px] scroll-mt-24 px-6 pt-32">
      <div className="grid gap-10 md:grid-cols-12 md:items-center">
        <Reveal className="md:col-span-5">
          <Image
            src={photo.src}
            alt={photo.alt}
            width={photo.width}
            height={photo.height}
            sizes="(min-width: 768px) 40vw, 100vw"
            className="w-full object-cover"
          />
        </Reveal>
        <Reveal className="md:col-span-6 md:col-start-7" delay={0.1}>
          <h2 className="font-display text-3xl font-medium tracking-tight md:text-4xl">
            About
          </h2>
          {/* Placeholder bio; Tamen supplies the real one (spec section 8). */}
          <p className="mt-6 max-w-[65ch] leading-relaxed text-overcast">
            I am Tamen Dutta. I photograph landscapes: long walks, early
            starts, and weather that rarely cooperates. Every image here was
            made in the field, on foot, waiting for the light to do what it
            was going to do anyway.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Create `src/components/CollectionCard.tsx`**

```tsx
import Image from "next/image";
import Link from "next/link";
import {
  COLLECTIONS,
  collectionCover,
  photosByCollection,
  type CollectionId,
} from "@/lib/photos";
import { Reveal } from "./Reveal";

export function CollectionCard({
  id,
  className = "",
  tall = false,
  delay = 0,
}: {
  id: CollectionId;
  className?: string;
  tall?: boolean;
  delay?: number;
}) {
  const collection = COLLECTIONS.find((c) => c.id === id)!;
  const cover = collectionCover(id);
  const count = photosByCollection(id).length;

  return (
    <Reveal className={className} delay={delay}>
      <Link href={`/portfolio#${id}`} className="group block">
        <div
          className={`relative w-full overflow-hidden ${
            tall ? "aspect-[4/5]" : "aspect-[3/2]"
          }`}
        >
          <Image
            src={cover.src}
            alt={cover.alt}
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        </div>
        <div className="mt-3 flex items-baseline justify-between">
          <h3 className="font-display text-xl font-medium tracking-tight">
            {collection.name}
          </h3>
          <p className="text-sm text-overcast">{count} photographs</p>
        </div>
        <p className="mt-1 text-sm text-overcast">{collection.blurb}</p>
      </Link>
    </Reveal>
  );
}
```

- [ ] **Step 3: Create `src/components/Collections.tsx`**

```tsx
import { COLLECTIONS } from "@/lib/photos";
import { CollectionCard } from "./CollectionCard";
import { Reveal } from "./Reveal";

export function Collections() {
  const [first, second, third] = COLLECTIONS;

  return (
    <section className="mx-auto max-w-[1400px] px-6 pt-32">
      <Reveal>
        <h2 className="font-display text-3xl font-medium tracking-tight md:text-4xl">
          Collections
        </h2>
      </Reveal>
      <div className="mt-10 grid gap-5 md:grid-cols-12">
        <CollectionCard id={first.id} tall className="md:col-span-7 md:row-span-2" />
        <CollectionCard id={second.id} className="md:col-span-5" />
        <CollectionCard id={third.id} delay={0.1} className="md:col-span-5" />
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Add both sections to `src/app/page.tsx`** (after `<Hero />`)

```tsx
import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Collections } from "@/components/Collections";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <About />
        <Collections />
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 5: Verify**

Run: `npm run build`
Expected: success.
Dev on 3001: About splits image/text at desktop, stacks on mobile; Collections shows the 7/5 asymmetric grid (tall left card, two stacked right), single column on mobile; cards scale slightly on hover; names/counts sit below images, not on them.

- [ ] **Step 6: Commit**

```bash
cd "G:/Desk/Code/Websites"
rtk git add photography-portfolio && rtk git commit -m "feat(photography): about and collections sections"
```

---

### Task 7: Wide-frame panorama with GSAP scrub

**Files:**
- Create: `src/components/WideFrame.tsx`
- Modify: `src/app/page.tsx`

**Interfaces:**
- Consumes: `PANORAMA_PHOTO`, `formatExif` (Task 3).
- Produces: `WideFrame()` client section (the only GSAP usage in the site).

- [ ] **Step 1: Create `src/components/WideFrame.tsx`**

```tsx
"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "motion/react";
import { PANORAMA_PHOTO, formatExif } from "@/lib/photos";

gsap.registerPlugin(ScrollTrigger);

export function WideFrame() {
  const wrap = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce || !wrap.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".wide-frame-img",
        { scale: 1.18 },
        {
          scale: 1,
          ease: "none",
          scrollTrigger: {
            trigger: wrap.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        },
      );
    }, wrap);
    return () => ctx.revert();
  }, [reduce]);

  return (
    <section className="pt-32">
      <div ref={wrap} className="relative aspect-[2.4/1] w-full overflow-hidden">
        <Image
          src={PANORAMA_PHOTO.src}
          alt={PANORAMA_PHOTO.alt}
          fill
          sizes="100vw"
          className="wide-frame-img object-cover"
        />
      </div>
      {PANORAMA_PHOTO.exif && (
        <p className="mx-auto max-w-[1400px] px-6 pt-3 font-exif text-xs text-overcast">
          {formatExif(PANORAMA_PHOTO.exif)}
        </p>
      )}
    </section>
  );
}
```

- [ ] **Step 2: Add `<WideFrame />` to `src/app/page.tsx` after `<Collections />`**

```tsx
import { WideFrame } from "@/components/WideFrame";
```

and in `<main>`: `<Collections />` then `<WideFrame />`.

- [ ] **Step 3: Verify**

Run: `npm run build`
Expected: success.
Dev on 3001: panorama zooms from 1.18 to 1.0 as it crosses the viewport (scrubbed to scroll, no jump); EXIF caption below the image in mono. Reduced motion: static.

- [ ] **Step 4: Commit**

```bash
cd "G:/Desk/Code/Websites"
rtk git add photography-portfolio && rtk git commit -m "feat(photography): wide-frame panorama with scroll scrub"
```

---

### Task 8: Instagram + Contact sections, complete home

**Files:**
- Create: `src/components/Instagram.tsx`, `src/components/Contact.tsx`
- Modify: `src/app/page.tsx`

**Interfaces:**
- Consumes: `SITE` (Task 3), `INSTAGRAM_PHOTOS` (Task 3), `Reveal` (Task 4).
- Produces: `Instagram()` (renders `null` while `SITE.instagram` is null), `Contact()`.

- [ ] **Step 1: Create `src/components/Instagram.tsx`**

```tsx
import Image from "next/image";
import { SITE } from "@/lib/site";
import { INSTAGRAM_PHOTOS } from "@/lib/photos";
import { Reveal } from "./Reveal";

export function Instagram() {
  if (!SITE.instagram) return null;

  return (
    <section className="mx-auto max-w-[1400px] px-6 pt-32">
      <Reveal className="flex flex-wrap items-baseline justify-between gap-4">
        <h2 className="font-display text-3xl font-medium tracking-tight md:text-4xl">
          Recent work
        </h2>
        <a
          href={SITE.instagram}
          target="_blank"
          rel="noreferrer"
          className="text-sm text-overcast transition-colors hover:text-snowlight"
        >
          Follow on Instagram
        </a>
      </Reveal>
      <div className="mt-10 columns-2 gap-4 md:columns-3">
        {INSTAGRAM_PHOTOS.map((p) => (
          <a
            key={p.id}
            href={SITE.instagram!}
            target="_blank"
            rel="noreferrer"
            className="group mb-4 block overflow-hidden"
          >
            <Image
              src={p.src}
              alt={p.alt}
              width={p.width}
              height={p.height}
              sizes="(min-width: 768px) 33vw, 50vw"
              className="w-full transition-transform duration-500 group-hover:scale-[1.03]"
            />
          </a>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Create `src/components/Contact.tsx`**

```tsx
import { SITE } from "@/lib/site";
import { Reveal } from "./Reveal";

export function Contact() {
  return (
    <section id="contact" className="mx-auto max-w-[1400px] scroll-mt-24 px-6 pt-32">
      <Reveal className="flex flex-col items-center text-center">
        <h2 className="font-display text-3xl font-medium tracking-tight md:text-5xl">
          Prints and commissions
        </h2>
        <p className="mt-4 max-w-md text-overcast">
          Most photographs here are available as prints. For orders or
          commissions, write to me.
        </p>
        <a
          href={`mailto:${SITE.email}`}
          className="mt-8 inline-flex h-12 items-center rounded-full bg-alpenglow px-7 text-sm font-medium text-night transition-transform hover:scale-[1.02] active:scale-[0.98]"
        >
          Contact
        </a>
      </Reveal>
    </section>
  );
}
```

- [ ] **Step 3: Final `src/app/page.tsx`**

```tsx
import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Collections } from "@/components/Collections";
import { WideFrame } from "@/components/WideFrame";
import { Instagram } from "@/components/Instagram";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <About />
        <Collections />
        <WideFrame />
        <Instagram />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 4: Verify**

Run: `npm run build` then `npm test`
Expected: both pass.
Dev on 3001: Instagram section absent (instagram is null). Temporarily set `instagram: "https://instagram.com/example"` in `src/lib/site.ts`, confirm the masonry grid renders and links out, then revert to `null`. Contact CTA mailto works.

- [ ] **Step 5: Commit**

```bash
cd "G:/Desk/Code/Websites"
rtk git add photography-portfolio && rtk git commit -m "feat(photography): instagram and contact sections, complete home"
```

---

### Task 9: Portfolio page with masonry galleries

**Files:**
- Create: `src/components/gallery/PortfolioGallery.tsx`, `src/app/portfolio/page.tsx`

**Interfaces:**
- Consumes: `COLLECTIONS`, `photosByCollection`, `formatExif`, `type Photo` (Task 3), `Nav`, `Footer`, `HorizonRule`, `Reveal` (Task 4).
- Produces: `PortfolioGallery()` client component. Lightbox is Task 10; until then clicking a photo does nothing visible (state is set but renders nothing).

- [ ] **Step 1: Create `src/components/gallery/PortfolioGallery.tsx`**

```tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import {
  COLLECTIONS,
  photosByCollection,
  formatExif,
  type Photo,
} from "@/lib/photos";
import { Reveal } from "@/components/Reveal";

export type ActivePhoto = { photos: Photo[]; index: number };

export function PortfolioGallery() {
  const [active, setActive] = useState<ActivePhoto | null>(null);

  return (
    <div>
      {COLLECTIONS.map((c) => {
        const photos = photosByCollection(c.id);
        return (
          <section key={c.id} id={c.id} className="scroll-mt-24 pt-20">
            <Reveal>
              <h2 className="font-display text-2xl font-medium tracking-tight md:text-3xl">
                {c.name}
              </h2>
              <p className="mt-2 text-overcast">{c.blurb}</p>
            </Reveal>
            <div className="mt-8 columns-1 gap-4 sm:columns-2 lg:columns-3">
              {photos.map((p, i) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setActive({ photos, index: i })}
                  className="group mb-4 block w-full text-left focus-visible:outline-2 focus-visible:outline-alpenglow"
                >
                  <span className="block overflow-hidden">
                    <Image
                      src={p.src}
                      alt={p.alt}
                      width={p.width}
                      height={p.height}
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="w-full transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  </span>
                  {p.exif && (
                    <span className="mt-2 block font-exif text-xs text-overcast opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
                      {formatExif(p.exif)}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </section>
        );
      })}
      {/* Lightbox mounts here in Task 10, driven by `active`. */}
      {active ? null : null}
    </div>
  );
}
```

- [ ] **Step 2: Create `src/app/portfolio/page.tsx`**

```tsx
import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { HorizonRule } from "@/components/HorizonRule";
import { PortfolioGallery } from "@/components/gallery/PortfolioGallery";

export const metadata: Metadata = {
  title: "Portfolio | Tamen Dutta",
  description: "Landscape photography collections by Tamen Dutta.",
};

export default function PortfolioPage() {
  return (
    <>
      <Nav />
      <main className="mx-auto max-w-[1400px] px-6 pt-32">
        <h1 className="font-display text-4xl font-medium tracking-tight md:text-6xl">
          Portfolio
        </h1>
        <p className="mt-4 max-w-md text-overcast">
          Three collections, photographed over the last several years.
        </p>
        <HorizonRule className="mt-10" />
        <PortfolioGallery />
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 3: Verify**

Run: `npm run build`
Expected: success, `/portfolio` route in output.
Dev on 3001: `/portfolio` shows three anchored collection sections with masonry grids; `/portfolio#coasts` scrolls to Coasts; hover reveals EXIF captions; keyboard focus ring is alpenglow.

- [ ] **Step 4: Commit**

```bash
cd "G:/Desk/Code/Websites"
rtk git add photography-portfolio && rtk git commit -m "feat(photography): portfolio page with masonry collections"
```

---

### Task 10: Lightbox

**Files:**
- Create: `src/components/gallery/Lightbox.tsx`
- Modify: `src/components/gallery/PortfolioGallery.tsx` (mount the lightbox)

**Interfaces:**
- Consumes: `formatExif`, `type Photo` (Task 3), `ActivePhoto` (Task 9).
- Produces: `Lightbox({ photos, index, onIndexChange, onClose })`, focus-trapped modal with Esc/arrow keys.

- [ ] **Step 1: Create `src/components/gallery/Lightbox.tsx`**

```tsx
"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { X, CaretLeft, CaretRight } from "@phosphor-icons/react";
import { formatExif, type Photo } from "@/lib/photos";

type Props = {
  photos: Photo[];
  index: number;
  onIndexChange: (i: number) => void;
  onClose: () => void;
};

export function Lightbox({ photos, index, onIndexChange, onClose }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const photo = photos[index];

  const prev = () => onIndexChange((index - 1 + photos.length) % photos.length);
  const next = () => onIndexChange((index + 1) % photos.length);

  useEffect(() => {
    ref.current?.focus();
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = overflow;
    };
  }, []);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") onClose();
    if (e.key === "ArrowLeft") prev();
    if (e.key === "ArrowRight") next();
    if (e.key === "Tab") {
      const focusables = ref.current?.querySelectorAll<HTMLElement>("button");
      if (!focusables?.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  };

  return (
    <div
      ref={ref}
      role="dialog"
      aria-modal="true"
      aria-label={photo.alt}
      tabIndex={-1}
      onKeyDown={onKeyDown}
      className="fixed inset-0 z-50 flex flex-col bg-night/95 outline-none backdrop-blur-sm"
    >
      <div className="flex justify-end p-4">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="rounded-full p-2 text-snowlight transition-colors hover:bg-ridge active:scale-[0.98]"
        >
          <X size={24} />
        </button>
      </div>
      <div className="relative flex-1 px-4">
        <Image
          key={photo.id}
          src={photo.src}
          alt={photo.alt}
          fill
          sizes="100vw"
          className="object-contain"
        />
      </div>
      <div className="flex items-center justify-between p-4">
        <button
          type="button"
          onClick={prev}
          aria-label="Previous photo"
          className="rounded-full p-2 text-snowlight transition-colors hover:bg-ridge active:scale-[0.98]"
        >
          <CaretLeft size={24} />
        </button>
        {photo.exif && (
          <p className="font-exif text-xs text-overcast">{formatExif(photo.exif)}</p>
        )}
        <button
          type="button"
          onClick={next}
          aria-label="Next photo"
          className="rounded-full p-2 text-snowlight transition-colors hover:bg-ridge active:scale-[0.98]"
        >
          <CaretRight size={24} />
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Mount it in `PortfolioGallery.tsx`**

Add the import:

```tsx
import { Lightbox } from "./Lightbox";
```

Replace the `{active ? null : null}` placeholder line with:

```tsx
{active && (
  <Lightbox
    photos={active.photos}
    index={active.index}
    onIndexChange={(i) => setActive({ photos: active.photos, index: i })}
    onClose={() => setActive(null)}
  />
)}
```

- [ ] **Step 3: Verify**

Run: `npm run build`
Expected: success.
Dev on 3001 on `/portfolio`: click photo opens lightbox; arrows + on-screen buttons navigate within the collection (wrapping); Esc and close button dismiss; Tab cycles only the three buttons; page behind does not scroll; EXIF caption shows.

- [ ] **Step 4: Commit**

```bash
cd "G:/Desk/Code/Websites"
rtk git add photography-portfolio && rtk git commit -m "feat(photography): keyboard-navigable lightbox"
```

---

### Task 11: QA pass, pre-flight checks, push

**Files:**
- Modify: anything the QA pass flags.

**Interfaces:**
- Consumes: everything.
- Produces: verified site, pushed to origin.

- [ ] **Step 1: Full local gates**

```bash
cd "G:/Desk/Code/Websites/photography-portfolio"
npm run lint && npm test && npm run build
```

Expected: all pass, zero warnings that indicate real problems.

- [ ] **Step 2: Copy + tells audit (mechanical)**

```bash
grep -rn "—\|–" src/ && echo "FAIL: dashes found" || echo "OK: no em/en dashes"
```

Also manually re-read every visible string (headlines, buttons, captions, metadata) for broken grammar or AI-sounding phrases. Verify: no eyebrow labels anywhere, "View portfolio" and "Contact" are the only CTA labels, no text overlaid on photos.

- [ ] **Step 3: Visual QA with the gstack skill**

Start dev: `npm run dev -- -p 3001`. Use the gstack browser skill against `http://localhost:3001`:
- Home desktop (1440w): hero fills viewport with CTA visible, sections reveal on scroll, panorama scrubs.
- Home mobile (390w): single column, hamburger menu works, no horizontal overflow.
- `/portfolio` desktop + mobile: masonry, anchors, lightbox open/navigate/close.
- Screenshot each state and actually look at the screenshots; a blank frame means a launch failure to fix, not skip.

- [ ] **Step 4: Reduced-motion + a11y spot check**

Emulate `prefers-reduced-motion: reduce` (gstack/devtools): hero static with content immediately visible, no shader, no scrub. Keyboard-only pass: nav links, gallery buttons, lightbox trap all reachable with visible focus.

- [ ] **Step 5: Fix anything flagged, re-run gates, commit fixes**

```bash
cd "G:/Desk/Code/Websites"
rtk git add photography-portfolio && rtk git commit -m "fix(photography): QA pass fixes"
```

(Skip the commit if nothing changed.)

- [ ] **Step 6: Push**

```bash
rtk git push
```

Expected: `ok main`.
