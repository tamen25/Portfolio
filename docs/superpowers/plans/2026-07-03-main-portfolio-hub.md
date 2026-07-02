# Main Portfolio Hub Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build `main-portfolio/`, the single-page dark landing site the apex domain points to, which presents Tamen Dutta and links out to the other sites in this monorepo.

**Architecture:** A new self-contained Next.js 16 app-router site. One client page (`app/page.tsx`) composes seven section components; identity and content live in two small `src/lib` modules covered by `node:test` tests. GSAP drives scroll effects, `motion` drives enter/exit animations, hls.js streams the background video.

**Tech Stack:** Next.js 16.2.10, React 19.2.4, TypeScript 5, Tailwind CSS 4, gsap ^3.15, motion ^12.42, hls.js ^1.6, tsx test runner.

**Spec:** `docs/superpowers/specs/2026-07-03-main-portfolio-hub-design.md`

## Global Constraints

- All work happens inside `G:\Desk\Code\Websites\main-portfolio\` — the folder is self-contained; never hoist dependencies to the repo root.
- Prefix every git command with `rtk` (`rtk git add`, `rtk git commit`, …).
- Commit messages: conventional style with scope `main-portfolio`, ending with the trailer `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>`.
- Design tokens (verbatim): `--bg: 0 0% 4%; --surface: 0 0% 8%; --text: 0 0% 96%; --muted: 0 0% 53%; --stroke: 0 0% 12%; --accent: 0 0% 96%;` Accent gradient `linear-gradient(90deg, #89AACC 0%, #4E85BF 100%)`.
- Fonts: Inter (300–700) as `font-body`, Instrument Serif italic 400 as `font-display`, both via `next/font/google`.
- Forced dark theme. No light mode.
- HLS stream URL: `https://stream.mux.com/Aa02T7oM1wH5Mk5EEVDYhbZ1ChcdhRsS2m1NYyx4Ua1g.m3u8`
- Next.js 16 has breaking changes vs training data — if any API is in doubt, read `main-portfolio/node_modules/next/dist/docs/` (mirror `photography-portfolio`'s patterns; they are proven on 16.2.10).
- Dev port 3002 (3000 = cloudops, 3001 = photography).

---

### Task 1: Scaffold the site

**Files:**
- Create: `main-portfolio/package.json`
- Create: `main-portfolio/tsconfig.json`
- Create: `main-portfolio/next.config.ts`
- Create: `main-portfolio/postcss.config.mjs`
- Create: `main-portfolio/eslint.config.mjs`
- Create: `main-portfolio/.env.example`
- Create: `main-portfolio/src/app/globals.css`
- Create: `main-portfolio/src/app/layout.tsx`
- Create: `main-portfolio/src/app/page.tsx` (placeholder, replaced in Task 4)
- Copy: 11 jpgs from `photography-portfolio/public/photos/` into `main-portfolio/public/`

**Interfaces:**
- Consumes: nothing.
- Produces: a building Next.js app; CSS utility classes `bg-bg`, `bg-surface`, `text-text-primary`, `text-muted`, `bg-stroke`/`border-stroke`, `font-body`, `font-display`, `.accent-gradient`, `.accent-gradient-reverse`, `.animate-scroll-down`, `.animate-role-fade-in`, `.animate-gradient-shift`, `.halftone`, `.art-cloudops`, `.art-future`; image paths `/cards/photography.jpg`, `/journal/j1.jpg`–`j4.jpg`, `/explore/e1.jpg`–`e6.jpg`.

- [ ] **Step 1: Create config files**

`main-portfolio/package.json`:

```json
{
  "name": "main-portfolio",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev -p 3002",
    "build": "next build",
    "start": "next start -p 3002",
    "lint": "eslint",
    "test": "tsx --test test/*.test.ts"
  },
  "dependencies": {
    "gsap": "^3.15.0",
    "hls.js": "^1.6.5",
    "motion": "^12.42.2",
    "next": "16.2.10",
    "react": "19.2.4",
    "react-dom": "19.2.4"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "eslint": "^9",
    "eslint-config-next": "16.2.10",
    "tailwindcss": "^4",
    "tsx": "^4.22.4",
    "typescript": "^5"
  }
}
```

`main-portfolio/tsconfig.json` — copy of photography-portfolio's:

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "react-jsx",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./src/*"] }
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts",
    ".next/dev/types/**/*.ts",
    "**/*.mts"
  ],
  "exclude": ["node_modules"]
}
```

`main-portfolio/next.config.ts`:

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {};

export default nextConfig;
```

`main-portfolio/postcss.config.mjs`:

```js
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;
```

`main-portfolio/eslint.config.mjs` — copy of photography-portfolio's:

```js
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
```

`main-portfolio/.env.example`:

```bash
# Where the Works grid cards link out to. Set to the real subdomain URLs
# at deploy time (e.g. https://photos.example.com). Local defaults match
# each site's dev port.
NEXT_PUBLIC_PHOTOGRAPHY_URL=http://localhost:3001
NEXT_PUBLIC_CLOUDOPS_URL=http://localhost:3000
```

- [ ] **Step 2: Create globals.css**

`main-portfolio/src/app/globals.css`:

```css
@import "tailwindcss";

@theme inline {
  --color-bg: hsl(var(--bg));
  --color-surface: hsl(var(--surface));
  --color-text-primary: hsl(var(--text));
  --color-muted: hsl(var(--muted));
  --color-stroke: hsl(var(--stroke));

  --font-body: var(--font-inter), sans-serif;
  --font-display: var(--font-instrument), serif;
}

:root {
  --bg: 0 0% 4%;
  --surface: 0 0% 8%;
  --text: 0 0% 96%;
  --muted: 0 0% 53%;
  --stroke: 0 0% 12%;
  --accent: 0 0% 96%;
}

html {
  color-scheme: dark;
  scroll-behavior: smooth;
}

body {
  background-color: hsl(var(--bg));
  color: hsl(var(--text));
  font-family: var(--font-body);
  -webkit-font-smoothing: antialiased;
}

/* Accent gradient — logo ring, hover borders, progress bars. */
.accent-gradient {
  background-image: linear-gradient(90deg, #89aacc 0%, #4e85bf 100%);
}

.accent-gradient-reverse {
  background-image: linear-gradient(90deg, #4e85bf 0%, #89aacc 100%);
}

@keyframes scroll-down {
  from {
    transform: translateY(-100%);
  }
  to {
    transform: translateY(200%);
  }
}

.animate-scroll-down {
  animation: scroll-down 1.5s ease-in-out infinite;
}

@keyframes role-fade-in {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-role-fade-in {
  animation: role-fade-in 0.4s ease-out;
}

@keyframes gradient-shift {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

/* Animated gradient border ring (used behind pill buttons on hover). */
.animate-gradient-shift {
  background-image: linear-gradient(90deg, #89aacc, #4e85bf, #89aacc);
  background-size: 200% 200%;
  animation: gradient-shift 6s ease infinite;
}

/* Halftone dot overlay for work cards. */
.halftone {
  background-image: radial-gradient(circle, #000 1px, transparent 1px);
  background-size: 4px 4px;
}

/* CSS art for cards without photography. */
.art-cloudops {
  background:
    radial-gradient(120% 90% at 80% 10%, rgba(78, 133, 191, 0.35), transparent 60%),
    radial-gradient(90% 90% at 15% 85%, rgba(137, 170, 204, 0.18), transparent 55%),
    hsl(var(--surface));
}

.art-future {
  background:
    radial-gradient(100% 80% at 50% 0%, rgba(137, 170, 204, 0.12), transparent 60%),
    hsl(var(--surface));
}

@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }

  .animate-scroll-down,
  .animate-role-fade-in,
  .animate-gradient-shift {
    animation: none;
  }
}
```

- [ ] **Step 3: Create layout.tsx and placeholder page.tsx**

`main-portfolio/src/app/layout.tsx`:

```tsx
import type { Metadata } from "next";
import { Inter, Instrument_Serif } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

const instrument = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Tamen Dutta | Portfolio",
  description:
    "Tamen Dutta — creative, CloudOps engineer, and landscape photographer. The hub for all my work.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${instrument.variable}`}>
      <body className="bg-bg font-body text-text-primary">{children}</body>
    </html>
  );
}
```

`main-portfolio/src/app/page.tsx` (temporary — replaced in Task 4):

```tsx
export default function Home() {
  return <main className="min-h-screen" />;
}
```

- [ ] **Step 4: Copy card/journal/exploration images**

```bash
cd "G:\Desk\Code\Websites\main-portfolio"
mkdir -p public/cards public/journal public/explore
cp ../photography-portfolio/public/photos/iceland/aurora-kirk.jpg      public/cards/photography.jpg
cp ../photography-portfolio/public/photos/iceland/day-1-sun-voyager.jpg public/journal/j1.jpg
cp ../photography-portfolio/public/photos/iceland/day-1-reyk.jpg        public/journal/j2.jpg
cp ../photography-portfolio/public/photos/spiti/cb-1.jpg                public/journal/j3.jpg
cp ../photography-portfolio/public/photos/spiti/chit-1.jpg              public/journal/j4.jpg
cp ../photography-portfolio/public/photos/iceland/day-2-geysir.jpg      public/explore/e1.jpg
cp ../photography-portfolio/public/photos/iceland/day-2-gulfoss.jpg     public/explore/e2.jpg
cp ../photography-portfolio/public/photos/spiti/chandra-lake-2.jpg      public/explore/e3.jpg
cp ../photography-portfolio/public/photos/spiti/cb-hd.jpg               public/explore/e4.jpg
cp ../photography-portfolio/public/photos/iceland/day-10-church-1.jpg   public/explore/e5.jpg
cp ../photography-portfolio/public/photos/spiti/chand-house.jpg         public/explore/e6.jpg
```

- [ ] **Step 5: Install and verify build**

```bash
cd "G:\Desk\Code\Websites\main-portfolio"
npm install
npm run build
```

Expected: `npm run build` exits 0 with a `/` route in the output table.

- [ ] **Step 6: Commit**

```bash
cd "G:\Desk\Code\Websites"
rtk git add main-portfolio
rtk git commit -m "feat(main-portfolio): scaffold Next.js hub site

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 2: Data layer (site identity + content), TDD

**Files:**
- Create: `main-portfolio/test/site.test.ts`
- Create: `main-portfolio/src/lib/site.ts`
- Create: `main-portfolio/src/lib/content.ts`

**Interfaces:**
- Consumes: image paths from Task 1.
- Produces:
  - `SITE: { name: string; initials: string; city: string; email: string; github: string; roles: string[]; loadingWords: string[]; description: string }`
  - `SITE_LINKS: { photography: string; cloudops: string }`
  - `SOCIALS: { label: string; href: string }[]`
  - `WorkCard = { id: string; title: string; category: string; href: string | null; image: string | null; alt: string; art?: string; layout: string }`
  - `WORKS: WorkCard[]` (length 4; [0] photography, [1] cloudops, [2]/[3] `href: null` placeholders)
  - `JOURNAL: { id: string; title: string; readTime: string; date: string; image: string }[]` (length 4)
  - `EXPLORATIONS: { id: string; image: string; alt: string; rotate: string }[]` (length 6)
  - `STATS: { value: string; label: string }[]` (length 3)

- [ ] **Step 1: Write the failing test**

`main-portfolio/test/site.test.ts`:

```ts
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { SITE, SITE_LINKS, SOCIALS } from "../src/lib/site";
import { WORKS, JOURNAL, EXPLORATIONS, STATS } from "../src/lib/content";

test("site identity is complete", () => {
  assert.equal(SITE.initials, "TD");
  assert.ok(SITE.name.length > 0);
  assert.ok(SITE.email.includes("@"));
  assert.ok(SITE.city.length > 0);
  assert.ok(SITE.roles.length >= 2);
  assert.ok(SITE.loadingWords.length >= 2);
  assert.ok(SITE.github.startsWith("https://github.com/"));
});

test("hub links are absolute URLs", () => {
  for (const url of Object.values(SITE_LINKS)) {
    assert.ok(/^https?:\/\//.test(url), url);
  }
});

test("socials all have absolute hrefs", () => {
  assert.ok(SOCIALS.length >= 4);
  for (const s of SOCIALS) {
    assert.ok(s.href.startsWith("https://"), s.label);
  }
});

test("works grid: 4 cards, first two are the real sites", () => {
  assert.equal(WORKS.length, 4);
  assert.equal(WORKS[0].href, SITE_LINKS.photography);
  assert.equal(WORKS[1].href, SITE_LINKS.cloudops);
  assert.equal(WORKS[2].href, null);
  assert.equal(WORKS[3].href, null);
  const ids = WORKS.map((w) => w.id);
  assert.equal(new Set(ids).size, ids.length);
  for (const w of WORKS) {
    assert.ok(w.image !== null || w.art, `card needs image or art: ${w.id}`);
  }
});

test("journal has 4 entries, explorations 6, stats 3", () => {
  assert.equal(JOURNAL.length, 4);
  assert.equal(EXPLORATIONS.length, 6);
  assert.equal(STATS.length, 3);
});

test("every referenced local image exists in public/", () => {
  const images = [
    ...WORKS.map((w) => w.image),
    ...JOURNAL.map((j) => j.image),
    ...EXPLORATIONS.map((e) => e.image),
  ].filter((p): p is string => p !== null);
  for (const img of images) {
    const file = path.join(process.cwd(), "public", img);
    assert.ok(fs.existsSync(file), `missing: ${img}`);
  }
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd "G:\Desk\Code\Websites\main-portfolio" && npm test`
Expected: FAIL — cannot find module `../src/lib/site`.

- [ ] **Step 3: Write the modules**

`main-portfolio/src/lib/site.ts`:

```ts
export const SITE = {
  name: "Tamen Dutta",
  initials: "TD",
  // Placeholder until Tamen supplies a real city (spec: Decisions table).
  city: "the mountains",
  email: "jj794001@gmail.com",
  github: "https://github.com/tamen25",
  roles: ["Creative", "CloudOps", "Photographer", "Builder"],
  loadingWords: ["Design", "Create", "Inspire"],
  description:
    "Designing seamless digital interactions by focusing on the unique nuances which bring systems to life.",
};

// Where the hub's segments point. Real subdomain URLs are injected at
// deploy time via env; local defaults match each site's dev port.
export const SITE_LINKS = {
  photography:
    process.env.NEXT_PUBLIC_PHOTOGRAPHY_URL ?? "http://localhost:3001",
  cloudops: process.env.NEXT_PUBLIC_CLOUDOPS_URL ?? "http://localhost:3000",
};

export const SOCIALS = [
  { label: "GitHub", href: SITE.github },
  // Placeholders until real profiles are supplied.
  { label: "Twitter", href: "https://twitter.com" },
  { label: "LinkedIn", href: "https://linkedin.com" },
  { label: "Dribbble", href: "https://dribbble.com" },
];
```

`main-portfolio/src/lib/content.ts`:

```ts
import { SITE_LINKS } from "./site";

export type WorkCard = {
  id: string;
  title: string;
  category: string;
  /** null = future-site placeholder card */
  href: string | null;
  /** null = CSS art card (set `art`) */
  image: string | null;
  alt: string;
  art?: string;
  /** grid span + aspect classes; bento rows are 7/5 then 5/7 */
  layout: string;
};

export const WORKS: WorkCard[] = [
  {
    id: "photography",
    title: "Landscape Photography",
    category: "Photography portfolio",
    href: SITE_LINKS.photography,
    image: "/cards/photography.jpg",
    alt: "Aurora over the church at Kirkjufell, Iceland",
    layout: "md:col-span-7 aspect-[4/3] md:aspect-[7/4]",
  },
  {
    id: "cloudops",
    title: "CloudOps",
    category: "Cloud & DevOps portfolio",
    href: SITE_LINKS.cloudops,
    image: null,
    alt: "",
    art: "art-cloudops",
    layout: "md:col-span-5 aspect-[4/3] md:aspect-[5/4]",
  },
  {
    id: "future-1",
    title: "Next Project",
    category: "In the works",
    href: null,
    image: null,
    alt: "",
    art: "art-future",
    layout: "md:col-span-5 aspect-[4/3] md:aspect-[5/4]",
  },
  {
    id: "future-2",
    title: "Something New",
    category: "Coming soon",
    href: null,
    image: null,
    alt: "",
    art: "art-future",
    layout: "md:col-span-7 aspect-[4/3] md:aspect-[7/4]",
  },
];

export const JOURNAL = [
  {
    id: "terraform-photos",
    title: "What Terraform taught me about composing photographs",
    readTime: "6 min read",
    date: "Jun 2026",
    image: "/journal/j1.jpg",
  },
  {
    id: "midnight-deploys",
    title: "Midnight deploys and midnight suns",
    readTime: "4 min read",
    date: "May 2026",
    image: "/journal/j2.jpg",
  },
  {
    id: "slow-systems",
    title: "Slow photography, fast systems",
    readTime: "5 min read",
    date: "Apr 2026",
    image: "/journal/j3.jpg",
  },
  {
    id: "spiti-notes",
    title: "Field notes from Spiti: packing for altitude",
    readTime: "7 min read",
    date: "Mar 2026",
    image: "/journal/j4.jpg",
  },
];

export const EXPLORATIONS = [
  { id: "e1", image: "/explore/e1.jpg", alt: "Geysir erupting, Iceland", rotate: "-rotate-3" },
  { id: "e2", image: "/explore/e2.jpg", alt: "Gullfoss waterfall, Iceland", rotate: "rotate-2" },
  { id: "e3", image: "/explore/e3.jpg", alt: "Chandra Taal lake, Spiti", rotate: "-rotate-2" },
  { id: "e4", image: "/explore/e4.jpg", alt: "Chandra Bhaga range, Spiti", rotate: "rotate-3" },
  { id: "e5", image: "/explore/e5.jpg", alt: "Black church of Budir, Iceland", rotate: "-rotate-1" },
  { id: "e6", image: "/explore/e6.jpg", alt: "House under Chandra peaks, Spiti", rotate: "rotate-1" },
];

export const STATS = [
  { value: "20+", label: "Years Experience" },
  { value: "95+", label: "Projects Done" },
  { value: "200%", label: "Satisfied Clients" },
];
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd "G:\Desk\Code\Websites\main-portfolio" && npm test`
Expected: PASS — 6 tests, 0 failures.

- [ ] **Step 5: Commit**

```bash
cd "G:\Desk\Code\Websites"
rtk git add main-portfolio/test main-portfolio/src/lib
rtk git commit -m "feat(main-portfolio): site identity and content data with tests

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 3: Shared primitives + LoadingScreen

**Files:**
- Create: `main-portfolio/src/components/RingLink.tsx`
- Create: `main-portfolio/src/components/HlsVideo.tsx`
- Create: `main-portfolio/src/components/SectionHeader.tsx`
- Create: `main-portfolio/src/components/LoadingScreen.tsx`

**Interfaces:**
- Consumes: `SITE` from `@/lib/site`; CSS utilities from Task 1.
- Produces:
  - `RingLink({ href, className?, wrapperClassName?, external?, children })` — anchor pill with animated gradient hover ring. `className` styles the inner pill (padding/colors); `group-hover:*` classes work against the outer `group`.
  - `HlsVideo({ className? })` — absolutely-centered cover `<video>` streaming the Mux HLS source.
  - `SectionHeader({ eyebrow, heading, subtext, cta? })` — whileInView-animated section header; `heading` is ReactNode so callers pass `<>Featured <em className="font-display italic">projects</em></>`.
  - `LoadingScreen({ onComplete })` — full-screen counter overlay; calls `onComplete` 400ms after reaching 100.

- [ ] **Step 1: Write RingLink**

`main-portfolio/src/components/RingLink.tsx`:

```tsx
type RingLinkProps = {
  href: string;
  /** classes for the inner pill: padding, colors, text size */
  className?: string;
  /** classes for the outer anchor: visibility, scale-on-hover */
  wrapperClassName?: string;
  external?: boolean;
  children: React.ReactNode;
};

/** Pill link that reveals an animated gradient border ring on hover. */
export default function RingLink({
  href,
  className = "",
  wrapperClassName = "",
  external = false,
  children,
}: RingLinkProps) {
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
      className={`group relative inline-flex items-center justify-center rounded-full ${wrapperClassName}`}
    >
      <span
        aria-hidden
        className="animate-gradient-shift pointer-events-none absolute -inset-[2px] rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />
      <span
        className={`relative inline-flex items-center justify-center gap-2 rounded-full transition-all duration-300 ${className}`}
      >
        {children}
      </span>
    </a>
  );
}
```

- [ ] **Step 2: Write HlsVideo**

`main-portfolio/src/components/HlsVideo.tsx`:

```tsx
"use client";

import { useEffect, useRef } from "react";

const STREAM =
  "https://stream.mux.com/Aa02T7oM1wH5Mk5EEVDYhbZ1ChcdhRsS2m1NYyx4Ua1g.m3u8";

/** Absolutely-centered, cover-fitted background video fed by hls.js. */
export default function HlsVideo({ className = "" }: { className?: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    let hls: import("hls.js").default | undefined;
    let cancelled = false;

    (async () => {
      const { default: Hls } = await import("hls.js");
      if (cancelled) return;
      if (Hls.isSupported()) {
        hls = new Hls();
        hls.loadSource(STREAM);
        hls.attachMedia(video);
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = STREAM;
      }
    })();

    return () => {
      cancelled = true;
      hls?.destroy();
    };
  }, []);

  return (
    <video
      ref={videoRef}
      autoPlay
      muted
      loop
      playsInline
      className={`absolute left-1/2 top-1/2 h-auto min-h-full w-auto min-w-full -translate-x-1/2 -translate-y-1/2 object-cover ${className}`}
    />
  );
}
```

- [ ] **Step 3: Write SectionHeader**

`main-portfolio/src/components/SectionHeader.tsx`:

```tsx
"use client";

import { motion } from "motion/react";
import RingLink from "./RingLink";

type SectionHeaderProps = {
  eyebrow: string;
  heading: React.ReactNode;
  subtext: string;
  cta?: { label: string; href: string; external?: boolean };
};

export default function SectionHeader({
  eyebrow,
  heading,
  subtext,
  cta,
}: SectionHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
      viewport={{ once: true, margin: "-100px" }}
      className="mb-10 flex flex-col gap-4 md:mb-14 md:flex-row md:items-end md:justify-between"
    >
      <div>
        <div className="mb-4 flex items-center gap-3">
          <span className="h-px w-8 bg-stroke" />
          <span className="text-xs uppercase tracking-[0.3em] text-muted">
            {eyebrow}
          </span>
        </div>
        <h2 className="text-3xl tracking-tight md:text-5xl">{heading}</h2>
        <p className="mt-3 max-w-md text-sm text-muted md:text-base">
          {subtext}
        </p>
      </div>
      {cta && (
        <RingLink
          href={cta.href}
          external={cta.external}
          wrapperClassName="hidden md:inline-flex"
          className="border-2 border-stroke bg-bg px-5 py-2.5 text-sm group-hover:border-transparent"
        >
          {cta.label} <span aria-hidden>→</span>
        </RingLink>
      )}
    </motion.div>
  );
}
```

- [ ] **Step 4: Write LoadingScreen**

`main-portfolio/src/components/LoadingScreen.tsx`:

```tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { SITE } from "@/lib/site";

const DURATION_MS = 2700;

export default function LoadingScreen({
  onComplete,
}: {
  onComplete: () => void;
}) {
  const [count, setCount] = useState(0);
  const [wordIndex, setWordIndex] = useState(0);
  const finished = useRef(false);

  useEffect(() => {
    let raf: number;
    let timeout: ReturnType<typeof setTimeout>;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - start) / DURATION_MS, 1);
      setCount(Math.round(progress * 100));
      if (progress < 1) {
        raf = requestAnimationFrame(tick);
      } else if (!finished.current) {
        finished.current = true;
        timeout = setTimeout(onComplete, 400);
      }
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timeout);
    };
  }, [onComplete]);

  useEffect(() => {
    const id = setInterval(
      () => setWordIndex((i) => (i + 1) % SITE.loadingWords.length),
      900,
    );
    return () => clearInterval(id);
  }, []);

  return (
    <motion.div
      exit={{ opacity: 0, transition: { duration: 0.5 } }}
      className="fixed inset-0 z-[9999] bg-bg"
    >
      <motion.p
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="absolute left-6 top-6 text-xs uppercase tracking-[0.3em] text-muted"
      >
        Portfolio
      </motion.p>

      <div className="absolute inset-0 flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.span
            key={wordIndex}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="font-display text-4xl italic text-text-primary/80 md:text-6xl lg:text-7xl"
          >
            {SITE.loadingWords[wordIndex]}
          </motion.span>
        </AnimatePresence>
      </div>

      <p className="absolute bottom-8 right-6 font-display text-6xl tabular-nums text-text-primary md:text-8xl lg:text-9xl">
        {String(count).padStart(3, "0")}
      </p>

      <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-stroke/50">
        <div
          className="accent-gradient h-full origin-left"
          style={{
            transform: `scaleX(${count / 100})`,
            boxShadow: "0 0 8px rgba(137, 170, 204, 0.35)",
          }}
        />
      </div>
    </motion.div>
  );
}
```

- [ ] **Step 5: Verify build and commit**

```bash
cd "G:\Desk\Code\Websites\main-portfolio"
npm run build
cd "G:\Desk\Code\Websites"
rtk git add main-portfolio/src/components
rtk git commit -m "feat(main-portfolio): shared primitives and loading screen

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

Expected: build exits 0 (components are not yet imported by the page; this catches syntax/type errors via the compiler pass).

---

### Task 4: Navbar + Hero, wired into the page

**Files:**
- Create: `main-portfolio/src/components/Navbar.tsx`
- Create: `main-portfolio/src/components/Hero.tsx`
- Modify: `main-portfolio/src/app/page.tsx` (replace placeholder)

**Interfaces:**
- Consumes: `RingLink`, `HlsVideo`, `LoadingScreen`, `SITE`.
- Produces: `Navbar()` (fixed pill nav), `Hero({ started: boolean })` — GSAP entrance runs when `started` flips true. Page anchors: hero section `id="home"`, works `id="work"` (Task 5), footer `id="contact"` (Task 7).

- [ ] **Step 1: Write Navbar**

`main-portfolio/src/components/Navbar.tsx`:

```tsx
"use client";

import { useEffect, useState } from "react";
import { SITE } from "@/lib/site";
import RingLink from "./RingLink";

const LINKS = [
  { label: "Home", href: "#home" },
  { label: "Work", href: "#work" },
  { label: "Resume", href: "#" }, // placeholder until a resume exists
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("Home");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 100);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed left-0 right-0 top-0 z-50 flex justify-center px-4 pt-4 md:pt-6">
      <nav
        className={`inline-flex items-center rounded-full border border-white/10 bg-surface px-2 py-2 backdrop-blur-md transition-shadow duration-300 ${
          scrolled ? "shadow-md shadow-black/10" : ""
        }`}
      >
        <a
          href="#home"
          aria-label="Home"
          onClick={() => setActive("Home")}
          className="accent-gradient group relative grid h-9 w-9 place-items-center rounded-full transition-transform duration-300 hover:scale-110"
        >
          <span
            aria-hidden
            className="accent-gradient-reverse absolute inset-0 rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          />
          <span className="relative grid h-[30px] w-[30px] place-items-center rounded-full bg-bg font-display text-[13px] italic">
            {SITE.initials}
          </span>
        </a>

        <span className="mx-1 hidden h-5 w-px bg-stroke sm:block" />

        {LINKS.map((link) => (
          <a
            key={link.label}
            href={link.href}
            onClick={() => setActive(link.label)}
            className={`rounded-full px-3 py-1.5 text-xs transition-colors sm:px-4 sm:py-2 sm:text-sm ${
              active === link.label
                ? "bg-stroke/50 text-text-primary"
                : "text-muted hover:bg-stroke/50 hover:text-text-primary"
            }`}
          >
            {link.label}
          </a>
        ))}

        <span className="mx-1 hidden h-5 w-px bg-stroke sm:block" />

        <RingLink
          href={`mailto:${SITE.email}`}
          className="bg-surface px-3 py-1.5 text-xs backdrop-blur-md sm:px-4 sm:py-2 sm:text-sm"
        >
          Say hi <span aria-hidden>↗</span>
        </RingLink>
      </nav>
    </header>
  );
}
```

- [ ] **Step 2: Write Hero**

`main-portfolio/src/components/Hero.tsx`:

```tsx
"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { SITE } from "@/lib/site";
import HlsVideo from "./HlsVideo";
import RingLink from "./RingLink";

export default function Hero({ started }: { started: boolean }) {
  const rootRef = useRef<HTMLElement>(null);
  const [roleIndex, setRoleIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(
      () => setRoleIndex((i) => (i + 1) % SITE.roles.length),
      2000,
    );
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!started || !rootRef.current) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.fromTo(
        ".name-reveal",
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1.2 },
        0.1,
      );
      tl.fromTo(
        ".blur-in",
        { opacity: 0, y: 20, filter: "blur(10px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 1, stagger: 0.1 },
        0.3,
      );
    }, rootRef);
    return () => ctx.revert();
  }, [started]);

  return (
    <section
      id="home"
      ref={rootRef}
      className="relative flex min-h-screen items-center justify-center overflow-hidden"
    >
      <div className="absolute inset-0">
        <HlsVideo />
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-bg to-transparent" />
      </div>

      <div className="relative z-10 flex flex-col items-center px-6 text-center">
        <p className="blur-in mb-8 text-xs uppercase tracking-[0.3em] text-muted opacity-0">
          Collection &rsquo;26
        </p>
        <h1 className="name-reveal mb-6 font-display text-6xl italic leading-[0.9] tracking-tight text-text-primary opacity-0 md:text-8xl lg:text-9xl">
          {SITE.name}
        </h1>
        <p className="blur-in mb-4 text-sm text-muted opacity-0 md:text-base">
          A{" "}
          <span
            key={roleIndex}
            className="animate-role-fade-in inline-block font-display italic text-text-primary"
          >
            {SITE.roles[roleIndex]}
          </span>{" "}
          lives in {SITE.city}.
        </p>
        <p className="blur-in mb-12 max-w-md text-sm text-muted opacity-0 md:text-base">
          {SITE.description}
        </p>
        <div className="blur-in inline-flex gap-4 opacity-0">
          <RingLink
            href="#work"
            wrapperClassName="transition-transform duration-300 hover:scale-105"
            className="bg-text-primary px-7 py-3.5 text-sm font-medium text-bg group-hover:bg-bg group-hover:text-text-primary"
          >
            See Works
          </RingLink>
          <RingLink
            href={`mailto:${SITE.email}`}
            wrapperClassName="transition-transform duration-300 hover:scale-105"
            className="border-2 border-stroke bg-bg px-7 py-3.5 text-sm group-hover:border-transparent"
          >
            Reach out...
          </RingLink>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-3">
        <span className="text-xs uppercase tracking-[0.2em] text-muted">
          Scroll
        </span>
        <span className="relative block h-10 w-px overflow-hidden bg-stroke">
          <span className="animate-scroll-down absolute left-0 top-0 h-1/2 w-full bg-text-primary" />
        </span>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Replace page.tsx**

`main-portfolio/src/app/page.tsx`:

```tsx
"use client";

import { useState } from "react";
import { AnimatePresence } from "motion/react";
import LoadingScreen from "@/components/LoadingScreen";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      <AnimatePresence>
        {isLoading && (
          <LoadingScreen onComplete={() => setIsLoading(false)} />
        )}
      </AnimatePresence>
      <Navbar />
      <main>
        <Hero started={!isLoading} />
      </main>
    </>
  );
}
```

- [ ] **Step 4: Verify in dev, then build**

```bash
cd "G:\Desk\Code\Websites\main-portfolio"
npm run build
```

Expected: exit 0. Optionally `npm run dev` and eyeball http://localhost:3002 — loading counter runs 000→100, hero name reveals, roles cycle, video plays.

- [ ] **Step 5: Commit**

```bash
cd "G:\Desk\Code\Websites"
rtk git add main-portfolio/src
rtk git commit -m "feat(main-portfolio): loading flow, navbar, and hero

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 5: Selected Works bento grid (the hub segments)

**Files:**
- Create: `main-portfolio/src/components/Works.tsx`
- Modify: `main-portfolio/src/app/page.tsx` (add `<Works />` after `<Hero />`)

**Interfaces:**
- Consumes: `WORKS`, `WorkCard` from `@/lib/content`; `SectionHeader`.
- Produces: `Works()` — section with `id="work"`.

- [ ] **Step 1: Write Works**

`main-portfolio/src/components/Works.tsx`:

```tsx
"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { WORKS, type WorkCard } from "@/lib/content";
import SectionHeader from "./SectionHeader";

function CardBody({ card }: { card: WorkCard }) {
  return (
    <div className="group relative h-full w-full cursor-pointer overflow-hidden rounded-3xl border border-stroke bg-surface">
      {card.image ? (
        <Image
          src={card.image}
          alt={card.alt}
          fill
          sizes="(min-width: 768px) 50vw, 100vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
      ) : (
        <div aria-hidden className={`absolute inset-0 ${card.art ?? ""}`} />
      )}

      <div
        aria-hidden
        className="halftone absolute inset-0 opacity-20 mix-blend-multiply"
      />

      <div className="absolute bottom-4 left-5 z-10 text-left transition-opacity duration-300 group-hover:opacity-0">
        <p className="text-sm font-medium text-text-primary">{card.title}</p>
        <p className="text-xs text-muted">{card.category}</p>
      </div>

      <div className="absolute inset-0 flex items-center justify-center bg-bg/70 opacity-0 backdrop-blur-lg transition-opacity duration-500 group-hover:opacity-100">
        <span className="animate-gradient-shift inline-flex rounded-full p-[2px]">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-5 py-2.5 text-sm text-black">
            {card.href ? (
              <>
                View —{" "}
                <em className="font-display italic">{card.title}</em>
              </>
            ) : (
              <>Coming soon</>
            )}
          </span>
        </span>
      </div>
    </div>
  );
}

export default function Works() {
  return (
    <section id="work" className="bg-bg py-12 md:py-16">
      <div className="mx-auto max-w-[1200px] px-6 md:px-10 lg:px-16">
        <SectionHeader
          eyebrow="Selected Work"
          heading={
            <>
              Featured <em className="font-display italic">projects</em>
            </>
          }
          subtext="A selection of projects I've worked on, from concept to launch."
          cta={{ label: "View all work", href: "#work" }}
        />

        <div className="grid grid-cols-1 gap-5 md:grid-cols-12 md:gap-6">
          {WORKS.map((card, i) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                delay: (i % 2) * 0.1,
                ease: [0.25, 0.1, 0.25, 1],
              }}
              viewport={{ once: true, margin: "-80px" }}
              className={card.layout}
            >
              {card.href ? (
                <a
                  href={card.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`Open ${card.title}`}
                  className="block h-full w-full"
                >
                  <CardBody card={card} />
                </a>
              ) : (
                <CardBody card={card} />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Add to page**

In `main-portfolio/src/app/page.tsx`, add `import Works from "@/components/Works";` and render `<Works />` directly after `<Hero started={!isLoading} />` inside `<main>`.

- [ ] **Step 3: Verify build and commit**

```bash
cd "G:\Desk\Code\Websites\main-portfolio"
npm run build
cd "G:\Desk\Code\Websites"
rtk git add main-portfolio/src
rtk git commit -m "feat(main-portfolio): selected-works bento linking to the other sites

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 6: Journal + Stats sections

**Files:**
- Create: `main-portfolio/src/components/Journal.tsx`
- Create: `main-portfolio/src/components/Stats.tsx`
- Modify: `main-portfolio/src/app/page.tsx` (add `<Journal />` after `<Works />`; `<Stats />` will sit after `<Explorations />` once Task 7 lands — for now render it after `<Journal />`)

**Interfaces:**
- Consumes: `JOURNAL`, `STATS` from `@/lib/content`; `SectionHeader`.
- Produces: `Journal()`, `Stats()`.

- [ ] **Step 1: Write Journal**

`main-portfolio/src/components/Journal.tsx`:

```tsx
"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { JOURNAL } from "@/lib/content";
import SectionHeader from "./SectionHeader";

export default function Journal() {
  return (
    <section className="bg-bg py-16 md:py-24">
      <div className="mx-auto max-w-[1200px] px-6 md:px-10 lg:px-16">
        <SectionHeader
          eyebrow="Journal"
          heading={
            <>
              Recent <em className="font-display italic">thoughts</em>
            </>
          }
          subtext="Notes from the field — cloud, code, and long walks with a camera."
          cta={{ label: "View all", href: "#" }}
        />

        <div className="flex flex-col gap-4">
          {JOURNAL.map((entry, i) => (
            <motion.a
              key={entry.id}
              href="#"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: i * 0.06 }}
              viewport={{ once: true, margin: "-60px" }}
              className="group flex items-center gap-6 rounded-[40px] border border-stroke bg-surface/30 p-4 transition-colors duration-300 hover:bg-surface sm:rounded-full"
            >
              <span className="relative h-16 w-16 shrink-0 overflow-hidden rounded-3xl sm:h-14 sm:w-14 sm:rounded-full">
                <Image
                  src={entry.image}
                  alt=""
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium md:text-base">
                  {entry.title}
                </span>
                <span className="block text-xs text-muted">
                  {entry.readTime}
                </span>
              </span>
              <span className="hidden shrink-0 text-xs text-muted sm:block">
                {entry.date}
              </span>
              <span
                aria-hidden
                className="mr-2 hidden text-muted transition-transform duration-300 group-hover:translate-x-1 sm:block"
              >
                →
              </span>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Write Stats**

`main-portfolio/src/components/Stats.tsx`:

```tsx
"use client";

import { motion } from "motion/react";
import { STATS } from "@/lib/content";

export default function Stats() {
  return (
    <section className="bg-bg py-16 md:py-24">
      <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-10 px-6 sm:grid-cols-3 md:px-10 lg:px-16">
        {STATS.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: i * 0.1 }}
            viewport={{ once: true, margin: "-80px" }}
            className="text-center"
          >
            <p className="font-display text-6xl italic md:text-7xl">
              {stat.value}
            </p>
            <p className="mt-2 text-sm uppercase tracking-[0.2em] text-muted">
              {stat.label}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Add to page, verify, commit**

Add imports and render `<Journal />` then `<Stats />` after `<Works />` in `page.tsx`.

```bash
cd "G:\Desk\Code\Websites\main-portfolio"
npm run build
cd "G:\Desk\Code\Websites"
rtk git add main-portfolio/src
rtk git commit -m "feat(main-portfolio): journal and stats sections

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 7: Explorations parallax gallery

**Files:**
- Create: `main-portfolio/src/components/Explorations.tsx`
- Modify: `main-portfolio/src/app/page.tsx` (render `<Explorations />` between `<Journal />` and `<Stats />`)

**Interfaces:**
- Consumes: `EXPLORATIONS` from `@/lib/content`; `RingLink`.
- Produces: `Explorations()` — 300vh section, pinned center copy, two parallax columns, click-to-lightbox.

- [ ] **Step 1: Write Explorations**

`main-portfolio/src/components/Explorations.tsx`:

```tsx
"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AnimatePresence, motion } from "motion/react";
import { EXPLORATIONS } from "@/lib/content";
import RingLink from "./RingLink";

gsap.registerPlugin(ScrollTrigger);

export default function Explorations() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);
  const rightColRef = useRef<HTMLDivElement>(null);
  const [lightbox, setLightbox] = useState<number | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "bottom bottom",
        pin: contentRef.current,
        pinSpacing: false,
      });

      gsap.fromTo(
        leftColRef.current,
        { y: 0 },
        {
          y: -400,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        },
      );

      gsap.fromTo(
        rightColRef.current,
        { y: 160 },
        {
          y: -700,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        },
      );
    }, section);

    return () => ctx.revert();
  }, []);

  const left = EXPLORATIONS.filter((_, i) => i % 2 === 0);
  const right = EXPLORATIONS.filter((_, i) => i % 2 === 1);

  return (
    <section ref={sectionRef} className="relative min-h-[300vh] bg-bg">
      {/* Layer 1: pinned center copy */}
      <div
        ref={contentRef}
        className="z-10 flex h-screen flex-col items-center justify-center px-6 text-center"
      >
        <div className="mb-4 flex items-center gap-3">
          <span className="h-px w-8 bg-stroke" />
          <span className="text-xs uppercase tracking-[0.3em] text-muted">
            Explorations
          </span>
          <span className="h-px w-8 bg-stroke" />
        </div>
        <h2 className="text-3xl tracking-tight md:text-5xl">
          Visual <em className="font-display italic">playground</em>
        </h2>
        <p className="mt-3 max-w-md text-sm text-muted md:text-base">
          Sketches, frames, and experiments that never made it to a case
          study — but taught me something anyway.
        </p>
        <RingLink
          href="https://dribbble.com"
          external
          wrapperClassName="mt-8 transition-transform duration-300 hover:scale-105"
          className="border-2 border-stroke bg-bg px-6 py-3 text-sm group-hover:border-transparent"
        >
          Dribbble <span aria-hidden>↗</span>
        </RingLink>
      </div>

      {/* Layer 2: parallax columns */}
      <div className="pointer-events-none absolute inset-0 z-20">
        <div className="mx-auto grid h-full max-w-[1400px] grid-cols-2 gap-12 px-6 md:gap-40 md:px-10">
          <div ref={leftColRef} className="flex flex-col items-start gap-24 pt-[60vh]">
            {left.map((item) => (
              <ExplorationCard
                key={item.id}
                image={item.image}
                alt={item.alt}
                rotate={item.rotate}
                onOpen={() =>
                  setLightbox(EXPLORATIONS.findIndex((e) => e.id === item.id))
                }
              />
            ))}
          </div>
          <div
            ref={rightColRef}
            className="flex flex-col items-end gap-24 pt-[100vh]"
          >
            {right.map((item) => (
              <ExplorationCard
                key={item.id}
                image={item.image}
                alt={item.alt}
                rotate={item.rotate}
                onOpen={() =>
                  setLightbox(EXPLORATIONS.findIndex((e) => e.id === item.id))
                }
              />
            ))}
          </div>
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(null)}
            className="fixed inset-0 z-[100] flex cursor-zoom-out items-center justify-center bg-bg/90 p-6 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.92 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="relative aspect-square w-full max-w-2xl overflow-hidden rounded-3xl"
            >
              <Image
                src={EXPLORATIONS[lightbox].image}
                alt={EXPLORATIONS[lightbox].alt}
                fill
                sizes="(min-width: 768px) 42rem, 100vw"
                className="object-cover"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function ExplorationCard({
  image,
  alt,
  rotate,
  onOpen,
}: {
  image: string;
  alt: string;
  rotate: string;
  onOpen: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={`View ${alt}`}
      className={`pointer-events-auto relative aspect-square w-full max-w-[320px] cursor-zoom-in overflow-hidden rounded-3xl border border-stroke transition-transform duration-500 hover:scale-[1.03] ${rotate}`}
    >
      <Image
        src={image}
        alt={alt}
        fill
        sizes="320px"
        className="object-cover"
      />
    </button>
  );
}
```

- [ ] **Step 2: Add to page, verify, commit**

Render `<Explorations />` between `<Journal />` and `<Stats />` in `page.tsx`.

```bash
cd "G:\Desk\Code\Websites\main-portfolio"
npm run build
cd "G:\Desk\Code\Websites"
rtk git add main-portfolio/src
rtk git commit -m "feat(main-portfolio): explorations parallax gallery with lightbox

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 8: Contact / Footer + final page assembly

**Files:**
- Create: `main-portfolio/src/components/Footer.tsx`
- Modify: `main-portfolio/src/app/page.tsx` (render `<Footer />` after `</main>`)

**Interfaces:**
- Consumes: `HlsVideo`, `RingLink`, `SITE`, `SOCIALS`.
- Produces: `Footer()` — section with `id="contact"`; flipped video, GSAP marquee, email CTA, socials + availability dot.

- [ ] **Step 1: Write Footer**

`main-portfolio/src/components/Footer.tsx`:

```tsx
"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { SITE, SOCIALS } from "@/lib/site";
import HlsVideo from "./HlsVideo";
import RingLink from "./RingLink";

export default function Footer() {
  const marqueeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!marqueeRef.current) return;
    const tween = gsap.to(marqueeRef.current, {
      xPercent: -50,
      duration: 40,
      ease: "none",
      repeat: -1,
    });
    return () => {
      tween.kill();
    };
  }, []);

  return (
    <footer
      id="contact"
      className="relative overflow-hidden bg-bg pb-8 pt-16 md:pb-12 md:pt-20"
    >
      <div className="absolute inset-0">
        <HlsVideo className="scale-y-[-1]" />
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute left-0 right-0 top-0 h-32 bg-gradient-to-b from-bg to-transparent" />
      </div>

      <div className="relative z-10">
        {/* Marquee: two identical halves so xPercent -50 loops seamlessly */}
        <div ref={marqueeRef} className="flex w-max whitespace-nowrap">
          {[0, 1].map((half) => (
            <span
              key={half}
              className="font-display text-5xl italic text-text-primary/90 md:text-7xl"
            >
              {Array.from({ length: 10 }, () => "BUILDING THE FUTURE • ").join(
                "",
              )}
            </span>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center gap-8 px-6">
          <RingLink
            href={`mailto:${SITE.email}`}
            wrapperClassName="transition-transform duration-300 hover:scale-105"
            className="border-2 border-stroke bg-bg px-8 py-4 text-sm group-hover:border-transparent md:text-base"
          >
            {SITE.email} <span aria-hidden>↗</span>
          </RingLink>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-6 border-t border-stroke/60 px-6 pt-8 sm:flex-row md:px-10 lg:px-16">
          <div className="flex gap-5">
            {SOCIALS.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                className="text-xs uppercase tracking-[0.15em] text-muted transition-colors hover:text-text-primary"
              >
                {social.label}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-2 text-xs text-muted">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            Available for projects
          </div>
        </div>
      </div>
    </footer>
  );
}
```

- [ ] **Step 2: Final page.tsx**

`main-portfolio/src/app/page.tsx` (final form):

```tsx
"use client";

import { useState } from "react";
import { AnimatePresence } from "motion/react";
import LoadingScreen from "@/components/LoadingScreen";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Works from "@/components/Works";
import Journal from "@/components/Journal";
import Explorations from "@/components/Explorations";
import Stats from "@/components/Stats";
import Footer from "@/components/Footer";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      <AnimatePresence>
        {isLoading && (
          <LoadingScreen onComplete={() => setIsLoading(false)} />
        )}
      </AnimatePresence>
      <Navbar />
      <main>
        <Hero started={!isLoading} />
        <Works />
        <Journal />
        <Explorations />
        <Stats />
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 3: Verify build and commit**

```bash
cd "G:\Desk\Code\Websites\main-portfolio"
npm run build
cd "G:\Desk\Code\Websites"
rtk git add main-portfolio/src
rtk git commit -m "feat(main-portfolio): contact footer with marquee and full page assembly

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 9: Full verification + repo docs

**Files:**
- Modify: `README.md` (add row to Websites table)
- Modify: `CLAUDE.md` (add per-site section)

**Interfaces:**
- Consumes: everything above.
- Produces: green lint/test/build; repo docs current.

- [ ] **Step 1: Run all checks**

```bash
cd "G:\Desk\Code\Websites\main-portfolio"
npm run lint
npm test
npm run build
```

Expected: all three exit 0. Fix anything that fails before proceeding.

- [ ] **Step 2: Visual smoke test**

```bash
cd "G:\Desk\Code\Websites\main-portfolio"
npm run dev
```

Open http://localhost:3002 and verify: loading counter → hero video + name reveal → works cards hover + the two real cards open the sibling sites → journal pills → explorations parallax pins and lightbox opens → stats → footer marquee scrolls and flipped video plays. Stop the dev server after.

- [ ] **Step 3: Update README.md**

In the Websites table, add after the photography row:

```markdown
| [`main-portfolio/`](./main-portfolio) | Next.js + TypeScript + Tailwind | Root-domain hub landing page linking to all sites |
```

- [ ] **Step 4: Update CLAUDE.md**

Add after the photography-portfolio section:

```markdown
### main-portfolio (Next.js + TypeScript)

The root-domain hub site. Links out to the other sites via
`NEXT_PUBLIC_PHOTOGRAPHY_URL` / `NEXT_PUBLIC_CLOUDOPS_URL` (see `.env.example`).

```bash
cd main-portfolio
npm install            # install deps
npm run dev            # start dev server on port 3002
npm run build          # production build
npm run lint           # eslint
npm test               # tsx --test test/*.test.ts
```
```

- [ ] **Step 5: Final commit**

```bash
cd "G:\Desk\Code\Websites"
rtk git add README.md CLAUDE.md
rtk git commit -m "docs: register main-portfolio hub site in repo docs

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```
