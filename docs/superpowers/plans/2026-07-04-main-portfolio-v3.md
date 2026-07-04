# main-portfolio v3 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the hub site at tamendutta.com — a dark, cinematic, single-page "Developer × Photographer" portfolio routing to the two sub-sites.

**Architecture:** New independent Next.js app at `main-portfolio/` (monorepo of independent sites, no shared deps). One route (`/`), content in `src/lib/site.ts`, real photos copied from photography-portfolio by a script, Three.js particle hero via @react-three/fiber, Lenis smooth scroll, IntersectionObserver reveals.

**Tech Stack:** Next.js 16.2.10, React 19.2.4, TypeScript 5, Tailwind CSS 4, three + @react-three/fiber@^9, lenis@^1, tsx (node:test).

**Spec:** `docs/superpowers/specs/2026-07-04-main-portfolio-v3-design.md`

## Global Constraints

- Folder: `main-portfolio/` at repo root. Dev port **3002**. Never hoist deps to repo root.
- Versions pinned to match photography-portfolio: `next@16.2.10`, `react@19.2.4`, `react-dom@19.2.4`, `eslint-config-next@16.2.10`, `tailwindcss@^4`, `tsx@^4.22.4`, `typescript@^5`.
- Palette tokens exactly: bg `#050505`, surface `#121212`, border `#262626`, text `#f5f5f5` / `#a3a3a3` / `#525252`, dev accent `#38bdf8`, photo accent `#d4d4d4`, photo warmth `#2e2a25`.
- Fonts via `next/font/google` only: Playfair Display (display), Outfit (body), JetBrains Mono (labels/code).
- Real content only. No invented stats, no fake EXIF numbers, no lorem. Captions = real location/subject only.
- Email `jj794001@gmail.com` · Location "Bangalore, IN" · GitHub `https://github.com/tamen25` · LinkedIn `https://www.linkedin.com/in/tamen-dutta/` · Instagram `https://www.instagram.com/tamendutta/` · Domain `https://tamendutta.com`.
- Sub-site URLs from env `NEXT_PUBLIC_CLOUDOPS_URL` / `NEXT_PUBLIC_PHOTOS_URL`; fallback prod `https://cloudops.tamendutta.com` / `https://photography.tamendutta.com`, dev `http://localhost:3000` / `http://localhost:3001`.
- All motion respects `prefers-reduced-motion`; page fully usable without WebGL.
- Every task ends: `npm run lint && npm test && npm run build` green in `main-portfolio/` (build from Task 1 on; tests from Task 2 on), then commit with `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>` trailer.
- Windows environment; run shell commands via Git Bash. All paths below relative to repo root `G:/Desk/Code/Websites`.
- **Design quality (per Tamen):** before implementing any UI task (Tasks 5, 6, 8, 9, 10), load the `frontend-design:frontend-design` and `taste-skill` skills and apply their standards. The code in this plan is the structural baseline — elevate spacing, type scale, hover states, and motion to those skills' bar. Do not change tokens, fonts, section structure, copy, or interfaces. Target: wow, smooth, beautiful — never templated.

---

### Task 1: Scaffold main-portfolio

**Files:**
- Create: `main-portfolio/package.json`, `main-portfolio/tsconfig.json`, `main-portfolio/next.config.ts`, `main-portfolio/postcss.config.mjs`, `main-portfolio/eslint.config.mjs`, `main-portfolio/.env.example`, `main-portfolio/src/app/layout.tsx`, `main-portfolio/src/app/page.tsx`, `main-portfolio/src/app/globals.css`

**Interfaces:**
- Produces: CSS tokens (`bg-ink`, `bg-surface`, `border-line`, `text-fg`, `text-fg2`, `text-fg3`, `text-dev`, `text-photo`, `bg-warm`, `font-display`, `font-sans`, `font-mono`), utility classes `.reveal/.revealed`, `.grain`, `.label-mono`. Font CSS vars `--font-playfair`, `--font-outfit`, `--font-jetbrains` set on `<html>`.

- [ ] **Step 1: Create package.json**

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
    "test": "tsx --test test/*.test.ts",
    "import-photos": "node scripts/import-photos.mjs"
  },
  "dependencies": {
    "@react-three/fiber": "^9.0.0",
    "lenis": "^1.1.0",
    "next": "16.2.10",
    "react": "19.2.4",
    "react-dom": "19.2.4",
    "three": "^0.170.0"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "@types/three": "^0.170.0",
    "eslint": "^9",
    "eslint-config-next": "16.2.10",
    "tailwindcss": "^4",
    "tsx": "^4.22.4",
    "typescript": "^5"
  }
}
```

- [ ] **Step 2: Copy config files from photography-portfolio and install**

```bash
cd main-portfolio
cp ../photography-portfolio/tsconfig.json .
cp ../photography-portfolio/next.config.ts .
cp ../photography-portfolio/postcss.config.mjs .
cp ../photography-portfolio/eslint.config.mjs .
npm install
```

If any copied config references photography-specific paths, strip them (open and check; expected: none — they are stock).

- [ ] **Step 3: Create .env.example**

`main-portfolio/.env.example`:

```bash
# Sub-site links. Unset = prod defaults (cloudops./photography.tamendutta.com)
# in production builds, localhost:3000/3001 in dev.
NEXT_PUBLIC_CLOUDOPS_URL=
NEXT_PUBLIC_PHOTOS_URL=
```

- [ ] **Step 4: Create globals.css**

`main-portfolio/src/app/globals.css`:

```css
@import "tailwindcss";

@theme {
  --color-ink: #050505;
  --color-surface: #121212;
  --color-line: #262626;
  --color-fg: #f5f5f5;
  --color-fg2: #a3a3a3;
  --color-fg3: #525252;
  --color-dev: #38bdf8;
  --color-photo: #d4d4d4;
  --color-warm: #2e2a25;
  --font-display: var(--font-playfair), ui-serif, Georgia, serif;
  --font-sans: var(--font-outfit), ui-sans-serif, system-ui, sans-serif;
  --font-mono: var(--font-jetbrains), ui-monospace, SFMono-Regular, monospace;
}

html {
  background: var(--color-ink);
  color: var(--color-fg);
  scroll-behavior: smooth;
}

::selection {
  background: color-mix(in srgb, var(--color-dev) 30%, transparent);
  color: var(--color-fg);
}

/* Mono numbered section label, e.g. "02 — developer" */
.label-mono {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: var(--color-fg3);
}

/* Scroll reveal */
.reveal {
  opacity: 0;
  transform: translateY(24px);
  transition:
    opacity 0.9s cubic-bezier(0.22, 1, 0.36, 1),
    transform 0.9s cubic-bezier(0.22, 1, 0.36, 1);
}
.reveal.revealed {
  opacity: 1;
  transform: none;
}

/* Film grain overlay — apply to positioned containers */
.grain::after {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0.07;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
}

@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  .reveal { opacity: 1; transform: none; transition: none; }
}
```

- [ ] **Step 5: Create layout.tsx**

`main-portfolio/src/app/layout.tsx`:

```tsx
import type { Metadata } from "next";
import { Playfair_Display, Outfit, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
});
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains" });

export const metadata: Metadata = {
  metadataBase: new URL("https://tamendutta.com"),
  title: "Tamen Dutta — Developer × Photographer",
  description:
    "Software developer and photographer based in Bangalore. Two crafts, one obsession: pattern.",
  openGraph: {
    title: "Tamen Dutta — Developer × Photographer",
    description:
      "Software developer and photographer based in Bangalore. Two crafts, one obsession: pattern.",
    url: "https://tamendutta.com",
    siteName: "Tamen Dutta",
    images: ["/og.jpg"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${outfit.variable} ${jetbrains.variable}`}
    >
      <body className="bg-ink font-sans text-fg antialiased">{children}</body>
    </html>
  );
}
```

- [ ] **Step 6: Create placeholder page.tsx**

`main-portfolio/src/app/page.tsx`:

```tsx
export default function Home() {
  return (
    <main>
      <h1 className="font-display text-5xl">Tamen Dutta</h1>
    </main>
  );
}
```

- [ ] **Step 7: Verify build and lint**

```bash
cd main-portfolio && npm run lint && npm run build
```

Expected: both exit 0. (No tests yet.)

- [ ] **Step 8: Commit**

```bash
git add main-portfolio
git commit -m "feat(main-portfolio): scaffold Next.js app with design tokens and fonts

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 2: Content module (site.ts) + tests

**Files:**
- Create: `main-portfolio/src/lib/site.ts`
- Test: `main-portfolio/test/site-data.test.ts`

**Interfaces:**
- Produces:
  - `SITE: { name: string; role: string; email: string; location: string; domain: string; socials: { label: string; href: string }[]; bio: { dev: string; photo: string; bridge: string }; stack: string[] }`
  - `CLOUDOPS_URL: string`, `PHOTOS_URL: string`
  - `PROJECTS: Project[]` where `type Project = { id: string; title: string; subtitle: string; description: string; stack: string[]; href: string | null; preview: string | null; accent: "dev" | "photo" }` (`href: null` + `preview: null` = future-project placeholder card)
  - `MANIFESTO_LINES: string[]`

- [ ] **Step 1: Write the failing test**

`main-portfolio/test/site-data.test.ts`:

```ts
import { test } from "node:test";
import assert from "node:assert/strict";
import { SITE, PROJECTS, CLOUDOPS_URL, PHOTOS_URL, MANIFESTO_LINES } from "../src/lib/site";

test("site identity is real", () => {
  assert.equal(SITE.name, "Tamen Dutta");
  assert.equal(SITE.email, "jj794001@gmail.com");
  assert.equal(SITE.location, "Bangalore, IN");
  assert.ok(SITE.socials.length >= 3);
  for (const s of SITE.socials) assert.doesNotThrow(() => new URL(s.href));
});

test("sub-site URLs are well-formed", () => {
  assert.doesNotThrow(() => new URL(CLOUDOPS_URL));
  assert.doesNotThrow(() => new URL(PHOTOS_URL));
});

test("projects: two real linked, placeholders unlinked", () => {
  const real = PROJECTS.filter((p) => p.href !== null);
  const placeholders = PROJECTS.filter((p) => p.href === null);
  assert.equal(real.length, 2);
  assert.ok(placeholders.length >= 1);
  for (const p of real) assert.ok(p.preview?.startsWith("/previews/"));
});

test("manifesto is non-empty", () => {
  assert.ok(MANIFESTO_LINES.length >= 4);
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
cd main-portfolio && npm test
```

Expected: FAIL — cannot find module `../src/lib/site`.

- [ ] **Step 3: Write site.ts**

`main-portfolio/src/lib/site.ts`:

```ts
const isProd = process.env.NODE_ENV === "production";

export const CLOUDOPS_URL =
  process.env.NEXT_PUBLIC_CLOUDOPS_URL ||
  (isProd ? "https://cloudops.tamendutta.com" : "http://localhost:3000");

export const PHOTOS_URL =
  process.env.NEXT_PUBLIC_PHOTOS_URL ||
  (isProd ? "https://photography.tamendutta.com" : "http://localhost:3001");

export const SITE = {
  name: "Tamen Dutta",
  role: "Developer × Photographer",
  email: "jj794001@gmail.com",
  location: "Bangalore, IN",
  domain: "https://tamendutta.com",
  socials: [
    { label: "GitHub", href: "https://github.com/tamen25" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/tamen-dutta/" },
    { label: "Instagram", href: "https://www.instagram.com/tamendutta/" },
  ],
  bio: {
    dev: "I build resilient interfaces and API-first systems. Comfortable across the stack — from low-level performance work to design-driven product engineering.",
    photo:
      "I chase quiet light and loud shadows. My frames sit somewhere between documentary honesty and cinematic restraint.",
    bridge:
      "Two crafts, one obsession: pattern. Whether it's a well-typed function or a well-timed frame, I'm looking for the shape underneath.",
  },
  stack: [
    "TypeScript",
    "React",
    "Next.js",
    "Node.js",
    "Python",
    "PostgreSQL",
    "Docker",
    "AWS",
    "TailwindCSS",
  ],
};

export type Project = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  stack: string[];
  href: string | null;
  preview: string | null;
  accent: "dev" | "photo";
};

export const PROJECTS: Project[] = [
  {
    id: "cloudops",
    title: "CloudOps Console",
    subtitle: "Observability, end to end",
    description:
      "A live observability console — distributed traces, metrics and logs rendered as one navigable system.",
    stack: ["Next.js", "TypeScript", "Tailwind"],
    href: CLOUDOPS_URL,
    preview: "/previews/cloudops.jpg",
    accent: "dev",
  },
  {
    id: "photography",
    title: "Photography",
    subtitle: "Frames from the field",
    description:
      "A dark, cinematic gallery of real work — Iceland, Spiti, Leh, Sikkim, and the night sky.",
    stack: ["Next.js", "TypeScript", "Tailwind"],
    href: PHOTOS_URL,
    preview: "/previews/photography.jpg",
    accent: "photo",
  },
  {
    id: "next-01",
    title: "In orbit",
    subtitle: "Next project",
    description: "Something new is being built. Check back soon.",
    stack: [],
    href: null,
    preview: null,
    accent: "dev",
  },
  {
    id: "next-02",
    title: "In orbit",
    subtitle: "Next frame",
    description: "New collections are being edited. Check back soon.",
    stack: [],
    href: null,
    preview: null,
    accent: "photo",
  },
];

export const MANIFESTO_LINES = [
  "const principles = [",
  '  "ship small, ship often",',
  '  "make state visible",',
  '  "delete more than you add",',
  "];",
  "",
  "export function ship(idea: Idea): Product {",
  "  return refine(build(idea)); // keep going.",
  "}",
];
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
cd main-portfolio && npm test
```

Expected: PASS (4 tests). Note: `/previews/*.jpg` files don't exist yet — Task 7 captures them; this test only checks the string path.

- [ ] **Step 5: Lint, build, commit**

```bash
cd main-portfolio && npm run lint && npm run build
cd .. && git add main-portfolio/src/lib/site.ts main-portfolio/test/site-data.test.ts
git commit -m "feat(main-portfolio): content module with real identity, projects, env-based sub-site URLs

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 3: Photo import script + curated manifest

**Files:**
- Create: `main-portfolio/scripts/import-photos.mjs`
- Create (generated): `main-portfolio/src/lib/photo-manifest.json`, `main-portfolio/public/photos/**`, `main-portfolio/public/og.jpg`
- Test: append to `main-portfolio/test/site-data.test.ts`

**Interfaces:**
- Produces: `photo-manifest.json` — array of `{ id: string; src: string; width: number; height: number; caption: string; hero?: true }`. Gallery = entries without `hero`; hero photo = the entry with `hero: true` (aurora, also copied to `/og.jpg`).

- [ ] **Step 1: Write the failing test (append to site-data.test.ts)**

```ts
import { existsSync } from "node:fs";
import { join } from "node:path";
import manifest from "../src/lib/photo-manifest.json";

test("photo manifest: 9 gallery + 1 hero, files exist", () => {
  const photos = manifest as {
    id: string; src: string; width: number; height: number; caption: string; hero?: boolean;
  }[];
  assert.equal(photos.filter((p) => !p.hero).length, 9);
  assert.equal(photos.filter((p) => p.hero).length, 1);
  for (const p of photos) {
    assert.ok(p.caption.length > 0);
    assert.ok(p.width > 0 && p.height > 0);
    assert.ok(
      existsSync(join(import.meta.dirname, "..", "public", p.src)),
      `missing file: ${p.src}`,
    );
  }
  assert.ok(existsSync(join(import.meta.dirname, "..", "public", "og.jpg")));
});
```

(Imports go at the top of the file; `assert`/`test` already imported.)

- [ ] **Step 2: Run test to verify it fails**

```bash
cd main-portfolio && npm test
```

Expected: FAIL — cannot resolve `../src/lib/photo-manifest.json`.

- [ ] **Step 3: Write the import script**

`main-portfolio/scripts/import-photos.mjs`:

```js
// Copies curated web derivatives from photography-portfolio into this site.
// The only cross-site touchpoint; both sites stay independent at runtime.
import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..");
const photoSite = join(root, "..", "photography-portfolio");

// Real captions only — location/subject, no invented EXIF.
const CURATED = [
  { id: "iceland-aurora-kirk", caption: "Aurora over Kirkjufell — Iceland", hero: true },
  { id: "iceland-aurora-plane", caption: "Aurora from the plane — Iceland" },
  { id: "spiti-milky-pn-chand", caption: "Milky Way over Chandratal — Spiti" },
  { id: "spiti-langza-buddha", caption: "Langza Buddha — Spiti" },
  { id: "astro-andromeda-2022", caption: "Andromeda — deep sky" },
  { id: "moon-moonhdr", caption: "Moon, HDR composite" },
  { id: "leh-valley-01", caption: "Valley — Leh" },
  { id: "sikkim-sun600-2", caption: "Sunrise at 600mm — Sikkim" },
  { id: "iceland-day-2-gulfoss", caption: "Gullfoss — Iceland" },
  { id: "spiti-key-1", caption: "Key Monastery — Spiti" },
];

const source = JSON.parse(
  readFileSync(join(photoSite, "src", "lib", "photo-manifest.json"), "utf8"),
);

const out = [];
for (const pick of CURATED) {
  const entry = source.find((p) => p.id === pick.id);
  if (!entry) throw new Error(`id not in source manifest: ${pick.id}`);
  const from = join(photoSite, "public", entry.src);
  const to = join(root, "public", entry.src);
  mkdirSync(dirname(to), { recursive: true });
  copyFileSync(from, to);
  const rec = {
    id: entry.id,
    src: entry.src,
    width: entry.width,
    height: entry.height,
    caption: pick.caption,
  };
  if (pick.hero) {
    rec.hero = true;
    copyFileSync(from, join(root, "public", "og.jpg"));
  }
  out.push(rec);
}

writeFileSync(
  join(root, "src", "lib", "photo-manifest.json"),
  JSON.stringify(out, null, 2) + "\n",
);
console.log(`imported ${out.length} photos`);
```

- [ ] **Step 4: Run the script, then tests**

```bash
cd main-portfolio && npm run import-photos && npm test
```

Expected: `imported 10 photos`, then PASS (all tests).

- [ ] **Step 5: Lint, build, commit (derivatives are committed by design)**

```bash
cd main-portfolio && npm run lint && npm run build
cd .. && git add main-portfolio/scripts main-portfolio/src/lib/photo-manifest.json main-portfolio/public/photos main-portfolio/public/og.jpg main-portfolio/test/site-data.test.ts
git commit -m "feat(main-portfolio): curated real-photo import pipeline from photography-portfolio

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 4: Page shell — SmoothScroll, Reveal, Nav, Footer, section skeleton

**Files:**
- Create: `main-portfolio/src/components/SmoothScroll.tsx`, `main-portfolio/src/components/Reveal.tsx`, `main-portfolio/src/components/Nav.tsx`, `main-portfolio/src/components/Footer.tsx`
- Modify: `main-portfolio/src/app/layout.tsx`, `main-portfolio/src/app/page.tsx`

**Interfaces:**
- Consumes: `SITE` from `@/lib/site` (Task 2).
- Produces: `<Reveal className? delay?>` wrapper div (adds `.revealed` in view); section anchor ids `developer`, `photographer`, `about`, `contact` that Nav links to; `<SmoothScroll>` wrapping body content.

- [ ] **Step 1: Create SmoothScroll.tsx**

```tsx
"use client";

import Lenis from "lenis";
import { useEffect } from "react";

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ lerp: 0.12 });
    let raf = requestAnimationFrame(function loop(t) {
      lenis.raf(t);
      raf = requestAnimationFrame(loop);
    });
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);
  return <>{children}</>;
}
```

- [ ] **Step 2: Create Reveal.tsx**

```tsx
"use client";

import { useEffect, useRef } from "react";

export default function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("revealed");
          io.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={`reveal ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}
```

- [ ] **Step 3: Create Nav.tsx**

```tsx
import { SITE } from "@/lib/site";

const LINKS = [
  { href: "#developer", label: "developer" },
  { href: "#photographer", label: "photographer" },
  { href: "#about", label: "about" },
  { href: "#contact", label: "contact" },
];

export default function Nav() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-line/60 bg-ink/70 backdrop-blur-md">
      <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        <a href="#top" className="font-mono text-sm text-fg">
          tamen.dutta
          <span className="ml-2 text-fg3">/ portfolio</span>
        </a>
        <div className="hidden items-center gap-6 font-mono text-xs text-fg2 sm:flex">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} className="transition-colors hover:text-fg">
              {l.label}
            </a>
          ))}
        </div>
        <a
          href={`mailto:${SITE.email}`}
          className="rounded-full border border-line px-4 py-1.5 font-mono text-xs text-fg transition-colors hover:border-dev hover:text-dev"
        >
          Say hello
        </a>
      </nav>
    </header>
  );
}
```

- [ ] **Step 4: Create Footer.tsx**

```tsx
import { SITE } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="border-t border-line/60 py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 font-mono text-xs text-fg3 sm:flex-row">
        <span>Crafted in the dark · v1.0</span>
        <span>
          © {new Date().getFullYear()} {SITE.name}
        </span>
      </div>
    </footer>
  );
}
```

- [ ] **Step 5: Wire layout + section skeleton in page.tsx**

In `layout.tsx`, wrap children:

```tsx
import SmoothScroll from "@/components/SmoothScroll";
// ... inside <body>:
        <SmoothScroll>{children}</SmoothScroll>
```

Replace `page.tsx`:

```tsx
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div id="top">
      <Nav />
      <main>
        <section id="hero" className="flex min-h-screen items-center justify-center">
          <h1 className="font-display text-5xl">Tamen Dutta</h1>
        </section>
        <section id="developer" className="min-h-screen" />
        <section id="photographer" className="min-h-screen" />
        <section id="about" />
        <section id="contact" />
      </main>
      <Footer />
    </div>
  );
}
```

- [ ] **Step 6: Verify, commit**

```bash
cd main-portfolio && npm run lint && npm test && npm run build
cd .. && git add main-portfolio/src
git commit -m "feat(main-portfolio): page shell — nav, footer, lenis smooth scroll, reveal hook

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 5: Hero — DOM layer + static split fallback

**Files:**
- Create: `main-portfolio/src/components/Hero.tsx`
- Modify: `main-portfolio/src/app/page.tsx` (replace `#hero` section with `<Hero />`)

**Interfaces:**
- Consumes: `SITE` from `@/lib/site`; hero photo entry (`hero: true`) from `@/lib/photo-manifest.json`.
- Produces: `<Hero />` server-renderable component. Contains a slot `<div id="hero-canvas" className="absolute inset-0">` that Task 6 fills with the R3F scene (Task 6 converts Hero to mount `<HeroScene />` inside that div).

- [ ] **Step 1: Create Hero.tsx**

```tsx
import Image from "next/image";
import manifest from "@/lib/photo-manifest.json";
import { SITE } from "@/lib/site";

const heroPhoto = manifest.find((p) => "hero" in p && p.hero)!;

export default function Hero() {
  return (
    <section id="hero" className="grain relative flex min-h-screen items-center overflow-hidden">
      {/* Static split background — always present; WebGL scene renders above it */}
      <div className="absolute inset-0" aria-hidden>
        {/* left: dev grid */}
        <div
          className="absolute inset-y-0 left-0 w-1/2 opacity-40"
          style={{
            backgroundImage:
              "linear-gradient(#26262655 1px, transparent 1px), linear-gradient(90deg, #26262655 1px, transparent 1px)",
            backgroundSize: "48px 48px",
            maskImage: "linear-gradient(to right, black 40%, transparent)",
          }}
        />
        {/* right: real aurora frame */}
        <div className="absolute inset-y-0 right-0 w-2/3">
          <Image
            src={heroPhoto.src}
            alt=""
            fill
            priority
            sizes="66vw"
            className="object-cover opacity-35"
            style={{ maskImage: "linear-gradient(to left, black 30%, transparent 85%)" }}
          />
        </div>
        {/* vignette to keep type readable */}
        <div className="absolute inset-0 bg-gradient-to-b from-ink/60 via-transparent to-ink" />
      </div>

      {/* Three.js mount point (Task 6) */}
      <div id="hero-canvas" className="absolute inset-0" />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-6 pt-14">
        <p className="label-mono mb-6">01 — hello</p>
        <h1 className="font-display text-6xl leading-[0.95] tracking-tight sm:text-8xl lg:text-9xl">
          Tamen
          <br />
          Dutta
        </h1>
        <p className="mt-8 font-mono text-sm text-fg2 sm:text-base">
          <span className="text-dev">Developer</span>
          <span className="mx-3 text-fg3">×</span>
          <span className="text-photo">Photographer</span>
        </p>
        <p className="mt-2 font-mono text-xs text-fg3">{SITE.location}</p>
      </div>

      <a
        href="#developer"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 font-mono text-xs text-fg3 transition-colors hover:text-fg"
      >
        scroll ↓
      </a>
    </section>
  );
}
```

- [ ] **Step 2: Use it in page.tsx**

Replace the `#hero` placeholder section with `<Hero />` (import it).

- [ ] **Step 3: Visual check**

```bash
cd main-portfolio && npm run dev &
```

Browse `http://localhost:3002`, screenshot desktop 1440x900 and mobile 375x812. Verify: name renders huge in Playfair, aurora visible right, grid left, readable, no layout overflow.

- [ ] **Step 4: Lint, test, build, commit**

```bash
cd main-portfolio && npm run lint && npm test && npm run build
cd .. && git add main-portfolio/src
git commit -m "feat(main-portfolio): hero with split identity and static fallback background

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 6: HeroScene — Three.js particle field

**Files:**
- Create: `main-portfolio/src/components/HeroScene.tsx`, `main-portfolio/src/components/HeroCanvas.tsx`
- Modify: `main-portfolio/src/components/Hero.tsx`, `main-portfolio/src/app/globals.css`

**Interfaces:**
- Consumes: mounts inside Hero's `#hero-canvas` div.
- Produces: `<HeroScene />` client component (default export), rendered only when motion+WebGL allowed.

- [ ] **Step 1: Create HeroScene.tsx**

```tsx
"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef, useState, useEffect } from "react";
import * as THREE from "three";

const COUNT = 3600;
const DEV = new THREE.Color("#38bdf8");
const WARM = new THREE.Color("#d8c3a5");

function Field() {
  const points = useRef<THREE.Points>(null);
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  const { positions, colors, seeds } = useMemo(() => {
    const positions = new Float32Array(COUNT * 3);
    const colors = new Float32Array(COUNT * 3);
    const seeds = new Float32Array(COUNT);
    for (let i = 0; i < COUNT; i++) {
      const left = i < COUNT / 2;
      let x: number, y: number, z: number;
      if (left) {
        // structured lattice, jittered — code side
        const col = i % 30;
        const row = Math.floor((i % (COUNT / 2)) / 30);
        x = -7 + col * 0.22 + (Math.random() - 0.5) * 0.06;
        y = -3.3 + row * 0.11 + (Math.random() - 0.5) * 0.06;
        z = (Math.random() - 0.5) * 1.5;
      } else {
        // gaussian nebula — photo side
        const r = Math.abs(gaussian()) * 2.4;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        x = 3.5 + r * Math.sin(phi) * Math.cos(theta) * 1.6;
        y = r * Math.sin(phi) * Math.sin(theta);
        z = r * Math.cos(phi);
      }
      positions.set([x, y, z], i * 3);
      const c = left ? DEV : WARM;
      const f = 0.35 + Math.random() * 0.65;
      colors.set([c.r * f, c.g * f, c.b * f], i * 3);
      seeds[i] = Math.random() * Math.PI * 2;
    }
    return { positions, colors, seeds };

    function gaussian() {
      let u = 0, v = 0;
      while (u === 0) u = Math.random();
      while (v === 0) v = Math.random();
      return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
    }
  }, []);

  const base = useMemo(() => positions.slice(), [positions]);

  useFrame(({ clock }) => {
    const pts = points.current;
    if (!pts) return;
    const t = clock.elapsedTime;
    const arr = (pts.geometry.attributes.position as THREE.BufferAttribute)
      .array as Float32Array;
    for (let i = 0; i < COUNT; i++) {
      const j = i * 3;
      const s = seeds[i];
      arr[j] = base[j] + Math.sin(t * 0.25 + s) * 0.05;
      arr[j + 1] = base[j + 1] + Math.cos(t * 0.2 + s * 1.3) * 0.05;
    }
    pts.geometry.attributes.position.needsUpdate = true;
    // cursor parallax bias
    pts.rotation.y += (mouse.current.x * 0.12 - pts.rotation.y) * 0.04;
    pts.rotation.x += (-mouse.current.y * 0.08 - pts.rotation.x) * 0.04;
    // scroll dispersal
    const fade = Math.max(0, 1 - window.scrollY / window.innerHeight);
    (pts.material as THREE.PointsMaterial).opacity = 0.8 * fade;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        vertexColors
        transparent
        opacity={0.8}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export default function HeroScene() {
  const [ok, setOk] = useState(false);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2") ?? canvas.getContext("webgl");
    if (gl) setOk(true);
  }, []);
  if (!ok) return null;
  return (
    <Canvas
      camera={{ position: [0, 0, 7], fov: 55 }}
      gl={{ antialias: false, powerPreference: "low-power" }}
      dpr={[1, 1.5]}
      className="animate-[fadein_1.5s_ease_forwards]"
    >
      <Field />
    </Canvas>
  );
}
```

Add to `globals.css`:

```css
@keyframes fadein {
  from { opacity: 0; }
  to { opacity: 1; }
}
```

- [ ] **Step 2: Mount in Hero via next/dynamic**

Hero.tsx must stay a server component; add a tiny client wrapper instead. Create the dynamic import inline in `Hero.tsx` is not allowed (`ssr: false` requires client) — so put it in the mount div via a client component:

Create `main-portfolio/src/components/HeroCanvas.tsx`:

```tsx
"use client";

import dynamic from "next/dynamic";

const HeroScene = dynamic(() => import("./HeroScene"), { ssr: false });

export default function HeroCanvas() {
  return <HeroScene />;
}
```

In `Hero.tsx`, replace the empty mount div:

```tsx
import HeroCanvas from "./HeroCanvas";
// ...
      <div id="hero-canvas" className="absolute inset-0">
        <HeroCanvas />
      </div>
```

- [ ] **Step 3: Visual + perf check**

Dev server; browse screenshot. Verify particles render both sides (cool lattice left, warm nebula right), drift smoothly, fade on scroll. Check console for WebGL errors. Screenshot with reduced motion off; then verify page still renders content with JS `matchMedia` emulation not required — static fallback visible before canvas fades in.

- [ ] **Step 4: Lint, test, build, commit**

```bash
cd main-portfolio && npm run lint && npm test && npm run build
cd .. && git add main-portfolio/src
git commit -m "feat(main-portfolio): three.js split-identity particle hero with fallbacks

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 7: Sub-site homepage screenshots → public/previews

**Files:**
- Create: `main-portfolio/public/previews/cloudops.jpg`, `main-portfolio/public/previews/photography.jpg`
- Test: append to `main-portfolio/test/site-data.test.ts`

**Interfaces:**
- Produces: the two preview images `PROJECTS[].preview` already points at.

- [ ] **Step 1: Write the failing test (append)**

```ts
test("project preview images exist", () => {
  for (const p of PROJECTS) {
    if (p.preview) {
      assert.ok(
        existsSync(join(import.meta.dirname, "..", "public", p.preview)),
        `missing preview: ${p.preview}`,
      );
    }
  }
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
cd main-portfolio && npm test
```

Expected: FAIL — missing preview: /previews/cloudops.jpg.

- [ ] **Step 3: Boot both sub-sites and capture screenshots (browse skill binary)**

```bash
cd cloudops-portfolio && npm run dev &          # port 3000
cd photography-portfolio && npm run dev -- -p 3001 &
mkdir -p main-portfolio/public/previews
B="$HOME/.claude/skills/gstack/browse/dist/browse"
"$B" viewport 1600x1000
"$B" goto http://localhost:3000 && sleep 4
"$B" screenshot --viewport main-portfolio/public/previews/cloudops.png
"$B" goto http://localhost:3001 && sleep 4
"$B" screenshot --viewport main-portfolio/public/previews/photography.png
```

Convert PNG → JPG (quality 82) so the repo stays light. Use sharp from photography-portfolio's toolchain if available, else `npx --yes sharp-cli`:

```bash
cd main-portfolio/public/previews
npx --yes sharp-cli -i cloudops.png -o cloudops.jpg --quality 82 && rm cloudops.png
npx --yes sharp-cli -i photography.png -o photography.jpg --quality 82 && rm photography.png
```

Kill both dev servers afterwards. Eyeball both JPGs (Read tool) — they must show real homepages, not error pages.

- [ ] **Step 4: Run tests to verify pass, commit**

```bash
cd main-portfolio && npm test && npm run lint && npm run build
cd .. && git add main-portfolio/public/previews main-portfolio/test/site-data.test.ts
git commit -m "feat(main-portfolio): captured sub-site homepage previews

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 8: Developer section — manifesto editor, work cards, stack

**Files:**
- Create: `main-portfolio/src/components/Manifesto.tsx`, `main-portfolio/src/components/Developer.tsx`
- Modify: `main-portfolio/src/app/page.tsx` (replace `#developer` placeholder)

**Interfaces:**
- Consumes: `SITE`, `PROJECTS`, `MANIFESTO_LINES` from `@/lib/site`; `Reveal`.
- Produces: `<Developer />` section with anchor id `developer`.

- [ ] **Step 1: Create Manifesto.tsx (client, typing effect)**

```tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { MANIFESTO_LINES } from "@/lib/site";

const FULL = MANIFESTO_LINES.join("\n");

export default function Manifesto() {
  const [text, setText] = useState("");
  const started = useRef(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setText(FULL);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting || started.current) return;
      started.current = true;
      io.disconnect();
      let i = 0;
      const tick = () => {
        i += 1 + Math.floor(Math.random() * 2);
        setText(FULL.slice(0, i));
        if (i < FULL.length) setTimeout(tick, 24);
      };
      tick();
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className="overflow-hidden rounded-xl border border-line bg-surface">
      <div className="flex items-center gap-2 border-b border-line px-4 py-2.5">
        <span className="size-2.5 rounded-full bg-fg3/40" />
        <span className="size-2.5 rounded-full bg-fg3/40" />
        <span className="size-2.5 rounded-full bg-fg3/40" />
        <span className="ml-2 font-mono text-xs text-fg3">~/tamen/manifesto.ts</span>
      </div>
      <pre className="min-h-56 whitespace-pre-wrap p-5 font-mono text-sm leading-relaxed text-fg2">
        {text}
        <span className="animate-pulse text-dev">▍</span>
      </pre>
    </div>
  );
}
```

- [ ] **Step 2: Create Developer.tsx**

```tsx
import Image from "next/image";
import { PROJECTS, SITE } from "@/lib/site";
import Manifesto from "./Manifesto";
import Reveal from "./Reveal";

export default function Developer() {
  return (
    <section id="developer" className="mx-auto max-w-6xl scroll-mt-14 px-6 py-28">
      <Reveal>
        <p className="label-mono mb-4">02 — developer</p>
        <h2 className="font-display text-4xl sm:text-5xl">
          // <span className="text-dev">software</span>
        </h2>
      </Reveal>

      <div className="mt-12 grid items-start gap-10 lg:grid-cols-2">
        <Reveal>
          <Manifesto />
        </Reveal>
        <Reveal delay={120}>
          <p className="text-lg leading-relaxed text-fg2">{SITE.bio.dev}</p>
          <div className="mt-8 flex flex-wrap gap-2">
            {SITE.stack.map((s) => (
              <span
                key={s}
                className="rounded-full border border-line px-3 py-1 font-mono text-xs text-fg2"
              >
                {s}
              </span>
            ))}
          </div>
        </Reveal>
      </div>

      <Reveal className="mt-20">
        <h3 className="mb-8 font-mono text-sm uppercase tracking-widest text-fg3">
          Selected work
        </h3>
      </Reveal>

      <div className="grid gap-6 sm:grid-cols-2">
        {PROJECTS.map((p, i) =>
          p.href ? (
            <Reveal key={p.id} delay={i * 100}>
              <a
                href={p.href}
                className={`group block overflow-hidden rounded-xl border border-line bg-surface transition-colors ${
                  p.accent === "dev" ? "hover:border-dev/60" : "hover:border-photo/60"
                }`}
              >
                {p.preview && (
                  <div className="relative aspect-video overflow-hidden border-b border-line">
                    <Image
                      src={p.preview}
                      alt={`${p.title} homepage`}
                      fill
                      sizes="(min-width: 640px) 50vw, 100vw"
                      className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]"
                    />
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-baseline justify-between">
                    <h4 className="font-display text-2xl">{p.title}</h4>
                    <span className="font-mono text-xs text-fg3 transition-colors group-hover:text-fg">
                      visit ↗
                    </span>
                  </div>
                  <p className={`mt-1 font-mono text-xs ${p.accent === "dev" ? "text-dev" : "text-photo"}`}>
                    {p.subtitle}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-fg2">{p.description}</p>
                  {p.stack.length > 0 && (
                    <p className="mt-4 font-mono text-xs text-fg3">{p.stack.join(" · ")}</p>
                  )}
                </div>
              </a>
            </Reveal>
          ) : (
            <Reveal key={p.id} delay={i * 100}>
              <div className="flex h-full min-h-48 flex-col justify-center rounded-xl border border-dashed border-line/80 p-6 text-center">
                <h4 className="font-display text-2xl text-fg3">{p.title}</h4>
                <p className="mt-1 font-mono text-xs text-fg3">{p.subtitle} — coming soon</p>
                <p className="mx-auto mt-3 max-w-60 text-sm text-fg3/80">{p.description}</p>
              </div>
            </Reveal>
          ),
        )}
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Replace placeholder in page.tsx, visual check**

Swap `<section id="developer" .../>` for `<Developer />`. Dev server, screenshot section: manifesto types when scrolled into view, both preview cards + two dashed placeholders render 2×2.

- [ ] **Step 4: Lint, test, build, commit**

```bash
cd main-portfolio && npm run lint && npm test && npm run build
cd .. && git add main-portfolio/src
git commit -m "feat(main-portfolio): developer section — manifesto editor, work cards, stack

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 9: Photographer section — gallery + CTA

**Files:**
- Create: `main-portfolio/src/components/Photographer.tsx`
- Modify: `main-portfolio/src/app/page.tsx`

**Interfaces:**
- Consumes: `photo-manifest.json` (gallery = entries without `hero`), `PHOTOS_URL`, `SITE.bio.photo`, `Reveal`.
- Produces: `<Photographer />` section, anchor id `photographer`. Every photo links to `PHOTOS_URL`.

- [ ] **Step 1: Create Photographer.tsx**

```tsx
import Image from "next/image";
import manifest from "@/lib/photo-manifest.json";
import { PHOTOS_URL, SITE } from "@/lib/site";
import Reveal from "./Reveal";

const gallery = manifest.filter((p) => !("hero" in p && p.hero));

export default function Photographer() {
  return (
    <section id="photographer" className="scroll-mt-14 border-y border-line/60 bg-warm/20 py-28">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <p className="label-mono mb-4">03 — photographer</p>
          <h2 className="font-display text-4xl sm:text-5xl">
            Frames <span className="italic text-photo">from the field</span>
          </h2>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-fg2">{SITE.bio.photo}</p>
        </Reveal>

        <div className="mt-14 columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4">
          {gallery.map((p, i) => (
            <Reveal key={p.id} delay={(i % 3) * 90}>
              <a
                href={PHOTOS_URL}
                className="group relative block overflow-hidden rounded-lg border border-line/60"
              >
                <Image
                  src={p.src}
                  alt={p.caption}
                  width={p.width}
                  height={p.height}
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="w-full transition-transform duration-700 group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 flex items-end bg-gradient-to-t from-ink/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <div className="flex w-full items-center justify-between p-4">
                    <span className="font-mono text-xs text-fg">{p.caption}</span>
                    <span className="font-mono text-xs text-photo">view ↗</span>
                  </div>
                </div>
              </a>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-14">
          <a
            href={PHOTOS_URL}
            className="group flex items-center justify-between rounded-xl border border-line bg-surface p-8 transition-colors hover:border-photo/60"
          >
            <div>
              <h3 className="font-display text-2xl sm:text-3xl">The full gallery lives here</h3>
              <p className="mt-2 font-mono text-xs text-fg3">
                iceland · spiti · leh · sikkim · deep sky · moon
              </p>
            </div>
            <span className="font-mono text-sm text-photo transition-transform duration-300 group-hover:translate-x-1">
              photography.tamendutta.com ↗
            </span>
          </a>
        </Reveal>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Wire into page.tsx, visual check**

Replace placeholder. Screenshot: masonry balanced, captions on hover, all links point at `PHOTOS_URL`.

- [ ] **Step 3: Lint, test, build, commit**

```bash
cd main-portfolio && npm run lint && npm test && npm run build
cd .. && git add main-portfolio/src
git commit -m "feat(main-portfolio): photographer section — real-photo masonry linking to photography site

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 10: About + Contact sections

**Files:**
- Create: `main-portfolio/src/components/About.tsx`, `main-portfolio/src/components/Contact.tsx`
- Modify: `main-portfolio/src/app/page.tsx`

**Interfaces:**
- Consumes: `SITE` from `@/lib/site`, `Reveal`.
- Produces: `<About />` (id `about`), `<Contact />` (id `contact`).

- [ ] **Step 1: Create About.tsx**

```tsx
import { SITE } from "@/lib/site";
import Reveal from "./Reveal";

export default function About() {
  return (
    <section id="about" className="mx-auto max-w-4xl scroll-mt-14 px-6 py-28">
      <Reveal>
        <p className="label-mono mb-10">04 — about</p>
        <blockquote className="font-display text-3xl leading-snug sm:text-4xl">
          <span className="text-fg3">“</span>
          {SITE.bio.bridge}
          <span className="text-fg3">”</span>
        </blockquote>
      </Reveal>
      <div className="mt-14 grid gap-10 sm:grid-cols-2">
        <Reveal delay={100}>
          <p className="mb-3 font-mono text-xs text-dev">{"// as a developer"}</p>
          <p className="leading-relaxed text-fg2">{SITE.bio.dev}</p>
        </Reveal>
        <Reveal delay={200}>
          <p className="mb-3 font-mono text-xs text-photo">— as a photographer</p>
          <p className="leading-relaxed text-fg2">{SITE.bio.photo}</p>
        </Reveal>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Create Contact.tsx**

```tsx
import { SITE } from "@/lib/site";
import Reveal from "./Reveal";

export default function Contact() {
  return (
    <section id="contact" className="border-t border-line/60 py-28">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <Reveal>
          <p className="label-mono mb-6">05 — contact</p>
          <h2 className="font-display text-4xl sm:text-6xl">
            Let’s make <span className="italic text-dev">something</span>
          </h2>
          <a
            href={`mailto:${SITE.email}`}
            className="mt-10 inline-block rounded-full border border-line px-8 py-4 font-mono text-sm transition-colors hover:border-dev hover:text-dev"
          >
            {SITE.email}
          </a>
        </Reveal>
        <Reveal delay={150}>
          <div className="mt-10 flex items-center justify-center gap-8 font-mono text-xs text-fg2">
            {SITE.socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                className="transition-colors hover:text-fg"
              >
                {s.label} ↗
              </a>
            ))}
          </div>
          <p className="mt-8 font-mono text-xs text-fg3">Based in {SITE.location}</p>
        </Reveal>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Wire both into page.tsx**

Final `page.tsx`:

```tsx
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Developer from "@/components/Developer";
import Photographer from "@/components/Photographer";
import About from "@/components/About";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div id="top">
      <Nav />
      <main>
        <Hero />
        <Developer />
        <Photographer />
        <About />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
```

- [ ] **Step 4: Lint, test, build, commit**

```bash
cd main-portfolio && npm run lint && npm test && npm run build
cd .. && git add main-portfolio/src
git commit -m "feat(main-portfolio): about and contact sections

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 11: Repo docs + full QA pass

**Files:**
- Modify: `README.md` (root), `CLAUDE.md` (root)

**Interfaces:**
- Consumes: everything above.

- [ ] **Step 1: Add main-portfolio to root README table and CLAUDE.md**

CLAUDE.md — add under "Working in a site":

```markdown
### main-portfolio (Next.js + TypeScript) — hub at tamendutta.com

```bash
cd main-portfolio
npm install            # install deps
npm run dev            # dev server on port 3002
npm run build          # production build
npm run lint           # eslint
npm test               # tsx --test test/*.test.ts
npm run import-photos  # re-copy curated photos from photography-portfolio
```
```

README.md — add a row for `main-portfolio` to the sites table (hub site, port 3002, links to the two sub-sites).

- [ ] **Step 2: Full verification**

```bash
cd main-portfolio && npm run lint && npm test && npm run build
```

Expected: all green.

- [ ] **Step 3: Visual QA (browse)**

Dev server on 3002. Screenshot: full page desktop 1440×900 (top, each section), mobile 375×812. Checks:
- Hero particles + type crisp; scroll fade works; no console errors.
- Manifesto types on scroll-into-view.
- Work cards: 2 real with screenshots linking to localhost:3000/3001 (dev fallback), 2 dashed placeholders.
- Gallery photos hover → caption + "view ↗"; click target = photography URL.
- Contact mailto correct; socials open real profiles.
- No horizontal overflow at 375px.

Fix anything broken before committing.

- [ ] **Step 4: Commit**

```bash
git add README.md CLAUDE.md
git commit -m "docs: register main-portfolio hub site in README and CLAUDE.md

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```
