# Learn Platform — Cycle 1 Implementation Plan (Shell + DSA Track)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a standalone dark-cinematic learning-platform site whose first cycle ships the platform shell plus a complete DSA track (Trace-engine visualizer, four renderers, full algorithm catalog, multi-language code panel, comparison mode, complexity chart).

**Architecture:** A new top-level Next.js site `learn-platform/`. The DSA track is built on a pure-function **Trace** model: each algorithm is `(input) => Trace` where a `Trace` is an ordered array of `Frame`s (state snapshot + highlights + narration + code line). A headless `usePlayer` hook scrubs frames; renderers (bars/grid/tree/graph) draw one frame. A catalog registry maps algorithms to renderers + metadata. The platform shell hosts tracks as plugins.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript 5 (strict), Tailwind CSS 4 (`@theme` tokens), `motion` for animation, `tsx` + `node:test` for tests, ESLint flat config (`eslint-config-next`).

## Global Constraints

- Node test runner via `tsx --test test/*.test.ts`; unit tests target pure functions (algorithms, player reducer, catalog validation). Import from `../src/...` with relative paths in tests.
- TypeScript strict mode on; `@/*` path alias maps to `./src/*`.
- Tailwind 4: design tokens declared in `src/app/globals.css` under `@theme`; no `tailwind.config.js`.
- Dark cinematic only: near-black stage `#0a0a0b`; one accent hue with role-based variants; monospace for code/counters; respect `prefers-reduced-motion`.
- Dev port: `next dev -p 3003` (3000/3001/3002 are taken by the other sites).
- Algorithms are pure: no DOM, no React, no `Math.random` inside `run` (accept seeded input via `defaultInput`). Determinism is required for tests.
- Every `AlgorithmEntry` must have `pseudocode` and `code.py` populated; `code.js`/`code.cpp`/`code.java` optional (tab shows "coming soon" if absent).
- Renderer-by-renderer milestone gating: a category is not "done" until its algorithms pass correctness + trace-invariant tests AND `npm run lint` and `npm run build` are green.
- Commit after every green step. Use `rtk git` per user's global CLAUDE.md.

---

## File Structure

```
learn-platform/
├── package.json, tsconfig.json, next.config.ts, eslint.config.mjs, postcss.config.mjs
├── src/
│   ├── app/
│   │   ├── layout.tsx, globals.css, page.tsx           # shell: home/hero + track cards
│   │   ├── dsa/page.tsx                                 # DSA track landing (catalog grid)
│   │   └── dsa/[slug]/page.tsx                          # visualizer page
│   ├── design/
│   │   ├── tokens.ts                                    # role→color map, shared constants
│   │   └── components/ (TrackCard, Nav, Panel, ...)     # shell UI
│   └── track-dsa/
│       ├── types.ts                                     # Trace/Frame/Highlight/AlgorithmEntry
│       ├── player/usePlayer.ts + playerReducer.ts       # headless player (reducer is pure)
│       ├── renderers/{BarsRenderer,GridRenderer,TreeRenderer,GraphRenderer}.tsx
│       ├── renderers/registry.ts                        # RendererId → component
│       ├── algorithms/
│       │   ├── sorting/*.ts, array/*.ts, pathfinding/*.ts,
│       │   ├── trees/*.ts, graphs/*.ts, dp/*.ts
│       │   └── helpers.ts                               # trace-builder utilities
│       ├── catalog.ts                                   # registry of all AlgorithmEntry
│       └── components/ (VisualizerShell, PlayerBar, CodePanel, ComparisonView, ComplexityChart)
└── test/
    ├── player.test.ts, catalog.test.ts, trace-invariants.test.ts
    └── sorting.test.ts, array.test.ts, pathfinding.test.ts, trees.test.ts, graphs.test.ts, dp.test.ts
```

---

## Milestone 1 — Scaffold + platform shell + engine

### Task 1: Scaffold the site

**Files:**
- Create: `learn-platform/package.json`, `tsconfig.json`, `next.config.ts`, `eslint.config.mjs`, `postcss.config.mjs`, `next-env.d.ts`
- Create: `learn-platform/src/app/globals.css`, `learn-platform/src/app/layout.tsx`, `learn-platform/src/app/page.tsx`

**Interfaces:**
- Produces: a runnable Next.js app on port 3003 with the dark-cinematic base theme.

- [ ] **Step 1: Create `package.json`**

```json
{
  "name": "learn-platform",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev -p 3003",
    "build": "next build",
    "start": "next start -p 3003",
    "lint": "eslint",
    "test": "tsx --test test/*.test.ts"
  },
  "dependencies": {
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

- [ ] **Step 2: Create `tsconfig.json`** (copy of photography-portfolio's)

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
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 3: Create `next.config.ts`, `eslint.config.mjs`, `postcss.config.mjs`, `next-env.d.ts`**

`next.config.ts`:
```ts
import type { NextConfig } from "next";
const nextConfig: NextConfig = {};
export default nextConfig;
```
`eslint.config.mjs`:
```js
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
]);
export default eslintConfig;
```
`postcss.config.mjs`:
```js
const config = { plugins: { "@tailwindcss/postcss": {} } };
export default config;
```
`next-env.d.ts`:
```ts
/// <reference types="next" />
/// <reference types="next/image-types/global" />
```

- [ ] **Step 4: Create `src/app/globals.css` with the design tokens**

```css
@import "tailwindcss";

@theme {
  --color-stage: #0a0a0b;
  --color-panel: #121318;
  --color-edge: #1e2027;
  --color-ink: #e9eaee;
  --color-muted: #8b8f9a;
  --color-accent: #35d6c4;         /* base accent */
  --color-compare: #6b7280;        /* dim */
  --color-swap: #35d6c4;           /* bright accent */
  --color-sorted: #57c98a;         /* settled green */
  --color-active: #f2b45a;
  --color-pivot: #e06c9f;
  --color-visited: #3a6ea5;
  --color-frontier: #7aa7d6;
  --color-path: #f2d24a;

  --font-mono: ui-monospace, "JetBrains Mono", monospace;
  --font-sans: ui-sans-serif, system-ui, sans-serif;
}

html { color-scheme: dark; }
body {
  background-color: var(--color-stage);
  color: var(--color-ink);
  font-family: var(--font-sans);
  -webkit-font-smoothing: antialiased;
}
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
}
```

- [ ] **Step 5: Create `src/app/layout.tsx`**

```tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Learn Platform",
  description: "Runnable artifacts, not slides.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

- [ ] **Step 6: Create a minimal `src/app/page.tsx`**

```tsx
export default function Home() {
  return <main className="p-10 font-mono text-[var(--color-accent)]">learn-platform online</main>;
}
```

- [ ] **Step 7: Install and verify build**

Run: `cd learn-platform && npm install && npm run build`
Expected: build succeeds; a route `/` is emitted.

- [ ] **Step 8: Commit**

```bash
rtk git add learn-platform && rtk git commit -m "feat(learn-platform): scaffold Next.js site with dark-cinematic theme"
```

---

### Task 2: Player reducer (pure, headless) + tests

**Files:**
- Create: `learn-platform/src/track-dsa/types.ts`
- Create: `learn-platform/src/track-dsa/player/playerReducer.ts`
- Test: `learn-platform/test/player.test.ts`

**Interfaces:**
- Produces:
  - `types.ts`: `HighlightRole`, `Highlight`, `Frame<TState>`, `Trace<TState>`, `Lang`, `RendererId`, `Category`, `AlgorithmEntry`.
  - `playerReducer.ts`: `type PlayerState = { index: number; playing: boolean; speed: number }`, `type PlayerAction`, `initialPlayerState(): PlayerState`, `playerReducer(state, action, frameCount): PlayerState`.

- [ ] **Step 1: Write `types.ts`**

```ts
export type HighlightRole =
  | "compare" | "swap" | "sorted" | "active" | "pivot"
  | "visited" | "frontier" | "path"
  | "current" | "inserted" | "removed"
  | "cell-fill" | "cell-read";

export type Highlight = { indices: number[]; role: HighlightRole };
export type Lang = "pseudo" | "py" | "js" | "cpp" | "java";
export type RendererId = "bars" | "grid" | "tree" | "graph";
export type Category =
  | "sorting" | "array-patterns" | "pathfinding"
  | "trees" | "graphs" | "dynamic-programming";

export type Frame<TState = unknown> = {
  state: TState;
  highlights: Highlight[];
  narration: string;
  pseudoLine?: number;
  codeLine?: Partial<Record<Lang, number>>;
  meta?: Record<string, number>;
};

export type Trace<TState = unknown> = {
  frames: Frame<TState>[];
  result: TState;
};

export type AlgorithmEntry<TInput = unknown, TState = unknown> = {
  slug: string;
  name: string;
  category: Category;
  complexity: { time: string; space: string };
  summary: string;
  run: (input: TInput) => Trace<TState>;
  renderer: RendererId;
  defaultInput: () => TInput;
  pseudocode: string[];
  code: Partial<Record<Lang, string>>;
  comparableWith?: string[]; // slugs valid for comparison mode
};
```

- [ ] **Step 2: Write the failing test `test/player.test.ts`**

```ts
import test from "node:test";
import assert from "node:assert/strict";
import { initialPlayerState, playerReducer } from "../src/track-dsa/player/playerReducer";

const N = 5; // frame count

test("starts at frame 0, paused", () => {
  const s = initialPlayerState();
  assert.equal(s.index, 0);
  assert.equal(s.playing, false);
});

test("step forward advances and clamps at last frame", () => {
  let s = initialPlayerState();
  for (let i = 0; i < 10; i++) s = playerReducer(s, { type: "next" }, N);
  assert.equal(s.index, N - 1);
});

test("step back clamps at 0", () => {
  let s = { index: 2, playing: false, speed: 1 };
  s = playerReducer(s, { type: "prev" }, N);
  s = playerReducer(s, { type: "prev" }, N);
  s = playerReducer(s, { type: "prev" }, N);
  assert.equal(s.index, 0);
});

test("scrub sets index within bounds", () => {
  let s = initialPlayerState();
  s = playerReducer(s, { type: "scrub", index: 3 }, N);
  assert.equal(s.index, 3);
  s = playerReducer(s, { type: "scrub", index: 99 }, N);
  assert.equal(s.index, N - 1);
});

test("play sets playing, pause clears it", () => {
  let s = initialPlayerState();
  s = playerReducer(s, { type: "play" }, N);
  assert.equal(s.playing, true);
  s = playerReducer(s, { type: "pause" }, N);
  assert.equal(s.playing, false);
});

test("reaching last frame while playing auto-pauses", () => {
  let s = { index: N - 2, playing: true, speed: 1 };
  s = playerReducer(s, { type: "next" }, N);
  assert.equal(s.index, N - 1);
  assert.equal(s.playing, false);
});

test("setSpeed updates speed", () => {
  let s = initialPlayerState();
  s = playerReducer(s, { type: "setSpeed", speed: 4 }, N);
  assert.equal(s.speed, 4);
});
```

- [ ] **Step 3: Run test to verify it fails**

Run: `cd learn-platform && npx tsx --test test/player.test.ts`
Expected: FAIL — cannot find module `playerReducer`.

- [ ] **Step 4: Write `player/playerReducer.ts`**

```ts
export type PlayerState = { index: number; playing: boolean; speed: number };
export type PlayerAction =
  | { type: "next" }
  | { type: "prev" }
  | { type: "scrub"; index: number }
  | { type: "play" }
  | { type: "pause" }
  | { type: "reset" }
  | { type: "setSpeed"; speed: number };

export function initialPlayerState(): PlayerState {
  return { index: 0, playing: false, speed: 1 };
}

const clamp = (i: number, count: number) => Math.max(0, Math.min(i, count - 1));

export function playerReducer(
  state: PlayerState,
  action: PlayerAction,
  frameCount: number
): PlayerState {
  switch (action.type) {
    case "next": {
      const index = clamp(state.index + 1, frameCount);
      const playing = index >= frameCount - 1 ? false : state.playing;
      return { ...state, index, playing };
    }
    case "prev":
      return { ...state, index: clamp(state.index - 1, frameCount) };
    case "scrub":
      return { ...state, index: clamp(action.index, frameCount) };
    case "play":
      return { ...state, playing: true };
    case "pause":
      return { ...state, playing: false };
    case "reset":
      return { ...state, index: 0, playing: false };
    case "setSpeed":
      return { ...state, speed: action.speed };
  }
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `cd learn-platform && npx tsx --test test/player.test.ts`
Expected: PASS (7 tests).

- [ ] **Step 6: Commit**

```bash
rtk git add learn-platform && rtk git commit -m "feat(learn-platform): Trace types + pure player reducer"
```

---

### Task 3: Trace helpers + trace-invariant test harness

**Files:**
- Create: `learn-platform/src/track-dsa/algorithms/helpers.ts`
- Test: `learn-platform/test/trace-invariants.test.ts`

**Interfaces:**
- Produces `helpers.ts`:
  - `class TraceBuilder<TState>` with `.push(state: TState, opts: { highlights?: Highlight[]; narration: string; pseudoLine?: number; codeLine?: Partial<Record<Lang, number>>; meta?: Record<string, number> }): void` and `.build(result: TState): Trace<TState>`.
  - `assertSortedTrace(trace: Trace<number[]>): void` — throws if the last frame's state is not ascending-sorted.
  - `snapshot<T>(arr: T[]): T[]` — returns a shallow copy (used so frames never alias mutable state).

- [ ] **Step 1: Write `helpers.ts`**

```ts
import type { Frame, Highlight, Lang, Trace } from "../types";

export function snapshot<T>(arr: readonly T[]): T[] {
  return arr.slice();
}

type PushOpts = {
  highlights?: Highlight[];
  narration: string;
  pseudoLine?: number;
  codeLine?: Partial<Record<Lang, number>>;
  meta?: Record<string, number>;
};

export class TraceBuilder<TState> {
  private frames: Frame<TState>[] = [];
  push(state: TState, opts: PushOpts): void {
    this.frames.push({
      state,
      highlights: opts.highlights ?? [],
      narration: opts.narration,
      pseudoLine: opts.pseudoLine,
      codeLine: opts.codeLine,
      meta: opts.meta,
    });
  }
  build(result: TState): Trace<TState> {
    return { frames: this.frames, result };
  }
}

export function isAscending(arr: number[]): boolean {
  for (let i = 1; i < arr.length; i++) if (arr[i - 1] > arr[i]) return false;
  return true;
}

export function assertSortedTrace(trace: Trace<number[]>): void {
  if (trace.frames.length === 0) throw new Error("empty trace");
  const last = trace.frames[trace.frames.length - 1].state;
  if (!isAscending(last)) throw new Error(`final frame not sorted: ${last}`);
  if (!isAscending(trace.result)) throw new Error(`result not sorted: ${trace.result}`);
}
```

- [ ] **Step 2: Write the failing test `test/trace-invariants.test.ts`**

```ts
import test from "node:test";
import assert from "node:assert/strict";
import { TraceBuilder, isAscending, snapshot } from "../src/track-dsa/algorithms/helpers";

test("snapshot returns an independent copy", () => {
  const a = [1, 2, 3];
  const b = snapshot(a);
  b[0] = 99;
  assert.equal(a[0], 1);
});

test("isAscending detects order", () => {
  assert.equal(isAscending([1, 2, 2, 3]), true);
  assert.equal(isAscending([1, 3, 2]), false);
});

test("TraceBuilder builds frames + result", () => {
  const tb = new TraceBuilder<number[]>();
  tb.push([2, 1], { narration: "start" });
  tb.push([1, 2], { narration: "swapped", highlights: [{ indices: [0, 1], role: "swap" }] });
  const trace = tb.build([1, 2]);
  assert.equal(trace.frames.length, 2);
  assert.deepEqual(trace.result, [1, 2]);
  assert.equal(trace.frames[1].highlights[0].role, "swap");
});
```

- [ ] **Step 3: Run to verify pass** (helpers already written)

Run: `cd learn-platform && npx tsx --test test/trace-invariants.test.ts`
Expected: PASS (3 tests).

- [ ] **Step 4: Commit**

```bash
rtk git add learn-platform && rtk git commit -m "feat(learn-platform): trace-builder helpers + invariant utils"
```

---

### Task 4: usePlayer hook + platform shell UI (home, nav, track cards)

**Files:**
- Create: `learn-platform/src/track-dsa/player/usePlayer.ts`
- Create: `learn-platform/src/design/tokens.ts`
- Create: `learn-platform/src/design/components/Nav.tsx`, `TrackCard.tsx`
- Modify: `learn-platform/src/app/page.tsx`

**Interfaces:**
- Consumes: `playerReducer`, `initialPlayerState` (Task 2); `Trace` (Task 2).
- Produces:
  - `usePlayer(trace: Trace): { index, frame, playing, speed, total, next, prev, scrub, play, pause, reset, setSpeed }`.
  - `tokens.ts`: `ROLE_COLOR: Record<HighlightRole, string>` (maps role → CSS var name).
  - `Nav`, `TrackCard` components.

- [ ] **Step 1: Write `usePlayer.ts`**

```ts
"use client";
import { useCallback, useEffect, useReducer } from "react";
import type { Trace, Frame } from "../types";
import { initialPlayerState, playerReducer } from "./playerReducer";

export function usePlayer(trace: Trace) {
  const total = trace.frames.length;
  const [state, dispatch] = useReducer(
    (s: ReturnType<typeof initialPlayerState>, a: Parameters<typeof playerReducer>[1]) =>
      playerReducer(s, a, total),
    undefined,
    initialPlayerState
  );

  useEffect(() => { dispatch({ type: "reset" }); }, [trace]);

  useEffect(() => {
    if (!state.playing) return;
    const ms = 600 / state.speed;
    const id = setTimeout(() => dispatch({ type: "next" }), ms);
    return () => clearTimeout(id);
  }, [state.playing, state.index, state.speed]);

  const frame: Frame = trace.frames[state.index] ?? trace.frames[0];
  return {
    index: state.index, frame, playing: state.playing, speed: state.speed, total,
    next: useCallback(() => dispatch({ type: "next" }), []),
    prev: useCallback(() => dispatch({ type: "prev" }), []),
    scrub: useCallback((i: number) => dispatch({ type: "scrub", index: i }), []),
    play: useCallback(() => dispatch({ type: "play" }), []),
    pause: useCallback(() => dispatch({ type: "pause" }), []),
    reset: useCallback(() => dispatch({ type: "reset" }), []),
    setSpeed: useCallback((sp: number) => dispatch({ type: "setSpeed", speed: sp }), []),
  };
}
```

- [ ] **Step 2: Write `design/tokens.ts`**

```ts
import type { HighlightRole } from "../track-dsa/types";

export const ROLE_COLOR: Record<HighlightRole, string> = {
  compare: "var(--color-compare)",
  swap: "var(--color-swap)",
  sorted: "var(--color-sorted)",
  active: "var(--color-active)",
  pivot: "var(--color-pivot)",
  visited: "var(--color-visited)",
  frontier: "var(--color-frontier)",
  path: "var(--color-path)",
  current: "var(--color-active)",
  inserted: "var(--color-sorted)",
  removed: "var(--color-pivot)",
  "cell-fill": "var(--color-swap)",
  "cell-read": "var(--color-frontier)",
};

export const DEFAULT_BAR = "var(--color-edge)";
```

- [ ] **Step 3: Write `Nav.tsx` and `TrackCard.tsx`**

```tsx
// Nav.tsx
import Link from "next/link";
export function Nav() {
  return (
    <nav className="flex items-center gap-6 border-b border-[var(--color-edge)] px-8 py-4">
      <Link href="/" className="font-mono text-sm text-[var(--color-accent)]">learn·platform</Link>
      <Link href="/dsa" className="text-sm text-[var(--color-muted)] hover:text-[var(--color-ink)]">DSA</Link>
      <span className="text-sm text-[var(--color-edge)]">System Design · soon</span>
      <span className="text-sm text-[var(--color-edge)]">FDE · soon</span>
    </nav>
  );
}
```
```tsx
// TrackCard.tsx
import Link from "next/link";
export function TrackCard(props: {
  title: string; blurb: string; href?: string; difficulty: string; status: "live" | "soon";
}) {
  const live = props.status === "live";
  const body = (
    <div className={`rounded-lg border p-6 ${live ? "border-[var(--color-edge)] bg-[var(--color-panel)] hover:border-[var(--color-accent)]" : "border-[var(--color-edge)]/50 opacity-60"}`}>
      <div className="flex items-center justify-between">
        <h3 className="font-mono text-lg text-[var(--color-ink)]">{props.title}</h3>
        <span className="font-mono text-xs text-[var(--color-muted)]">{props.difficulty}</span>
      </div>
      <p className="mt-3 text-sm text-[var(--color-muted)]">{props.blurb}</p>
      <p className="mt-4 font-mono text-xs text-[var(--color-accent)]">{live ? "enter →" : "coming soon"}</p>
    </div>
  );
  return live && props.href ? <Link href={props.href}>{body}</Link> : body;
}
```

- [ ] **Step 4: Rewrite `src/app/page.tsx` (home/hero + track cards)**

```tsx
import { Nav } from "@/design/components/Nav";
import { TrackCard } from "@/design/components/TrackCard";

export default function Home() {
  return (
    <main>
      <Nav />
      <section className="px-8 py-20">
        <p className="font-mono text-xs uppercase tracking-widest text-[var(--color-accent)]">runnable artifacts, not slides</p>
        <h1 className="mt-4 max-w-3xl text-5xl font-semibold leading-tight text-[var(--color-ink)]">
          Go from confused to confident.
        </h1>
        <p className="mt-6 max-w-xl text-[var(--color-muted)]">
          Play, pause, and scrub through algorithms and systems. Watch the work happen, step by step.
        </p>
      </section>
      <section className="grid gap-4 px-8 pb-24 sm:grid-cols-2 lg:grid-cols-3">
        <TrackCard title="DSA" blurb="Sorting, pathfinding, trees, graphs, DP — every pattern, visualized and step-through-able." href="/dsa" difficulty="01" status="live" />
        <TrackCard title="System Design" blurb="Trace a request through real architectures. Watch failures happen." difficulty="02" status="soon" />
        <TrackCard title="FDE" blurb="Forward-deployed engineering scenarios." difficulty="03" status="soon" />
      </section>
    </main>
  );
}
```

- [ ] **Step 5: Verify build + lint**

Run: `cd learn-platform && npm run build && npm run lint`
Expected: both green; routes `/` present.

- [ ] **Step 6: Commit**

```bash
rtk git add learn-platform && rtk git commit -m "feat(learn-platform): usePlayer hook, design tokens, home + track cards"
```

---

## Milestone 2 — BarsRenderer + Sorting + Array patterns (+ comparison + complexity chart)

### Task 5: Sorting algorithms + tests

**Files:**
- Create: `learn-platform/src/track-dsa/algorithms/sorting/bubble.ts`, `insertion.ts`, `selection.ts`, `merge.ts`, `quick.ts`, `heap.ts`
- Test: `learn-platform/test/sorting.test.ts`

**Interfaces:**
- Consumes: `TraceBuilder`, `snapshot`, `isAscending` (Task 3); `Trace` (Task 2).
- Produces: each file exports `run(input: number[]): Trace<number[]>` (named export matching the algorithm, e.g. `export function bubbleSort(input: number[]): Trace<number[]>`). Signature identical across all six.

- [ ] **Step 1: Write the failing test `test/sorting.test.ts`**

```ts
import test from "node:test";
import assert from "node:assert/strict";
import { bubbleSort } from "../src/track-dsa/algorithms/sorting/bubble";
import { insertionSort } from "../src/track-dsa/algorithms/sorting/insertion";
import { selectionSort } from "../src/track-dsa/algorithms/sorting/selection";
import { mergeSort } from "../src/track-dsa/algorithms/sorting/merge";
import { quickSort } from "../src/track-dsa/algorithms/sorting/quick";
import { heapSort } from "../src/track-dsa/algorithms/sorting/heap";
import { assertSortedTrace, isAscending } from "../src/track-dsa/algorithms/helpers";

const sorters = { bubbleSort, insertionSort, selectionSort, mergeSort, quickSort, heapSort };
const inputs = [[], [1], [3, 1, 2], [5, 4, 3, 2, 1], [2, 2, 1, 1, 3], [9, 3, 7, 1, 8, 2, 6, 4, 5, 0]];

for (const [name, fn] of Object.entries(sorters)) {
  test(`${name}: result is sorted for all inputs`, () => {
    for (const inp of inputs) {
      const trace = fn(inp.slice());
      assert.ok(isAscending(trace.result), `${name} failed on ${inp}`);
      assert.deepEqual(trace.result.slice().sort((a, b) => a - b), trace.result);
    }
  });
  test(`${name}: final frame equals result and is sorted`, () => {
    const trace = fn([4, 2, 5, 1, 3]);
    assertSortedTrace(trace);
    assert.deepEqual(trace.frames[trace.frames.length - 1].state, trace.result);
  });
  test(`${name}: preserves multiset (no lost/added elements)`, () => {
    const inp = [5, 3, 3, 1, 9, 2];
    const trace = fn(inp.slice());
    assert.deepEqual(trace.result.slice().sort((a, b) => a - b), inp.slice().sort((a, b) => a - b));
  });
  test(`${name}: every pseudoLine is a valid index is deferred to catalog test`, () => {
    const trace = fn([2, 1]);
    assert.ok(trace.frames.length >= 1);
  });
}
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd learn-platform && npx tsx --test test/sorting.test.ts`
Expected: FAIL — modules not found.

- [ ] **Step 3: Implement `bubble.ts`**

```ts
import type { Trace } from "../../types";
import { TraceBuilder, snapshot } from "../helpers";

export function bubbleSort(input: number[]): Trace<number[]> {
  const a = input.slice();
  const tb = new TraceBuilder<number[]>();
  let comparisons = 0, swaps = 0;
  tb.push(snapshot(a), { narration: "Start", pseudoLine: 0, meta: { comparisons, swaps } });
  for (let i = 0; i < a.length; i++) {
    for (let j = 0; j < a.length - i - 1; j++) {
      comparisons++;
      tb.push(snapshot(a), {
        narration: `Compare ${a[j]} and ${a[j + 1]}`,
        highlights: [{ indices: [j, j + 1], role: "compare" }],
        pseudoLine: 2, codeLine: { py: 2 }, meta: { comparisons, swaps },
      });
      if (a[j] > a[j + 1]) {
        [a[j], a[j + 1]] = [a[j + 1], a[j]];
        swaps++;
        tb.push(snapshot(a), {
          narration: `Swap → ${a[j]}, ${a[j + 1]}`,
          highlights: [{ indices: [j, j + 1], role: "swap" }],
          pseudoLine: 3, codeLine: { py: 3 }, meta: { comparisons, swaps },
        });
      }
    }
    tb.push(snapshot(a), {
      narration: `Position ${a.length - i - 1} settled`,
      highlights: [{ indices: [a.length - i - 1], role: "sorted" }],
      pseudoLine: 4, meta: { comparisons, swaps },
    });
  }
  return tb.build(a);
}
```

- [ ] **Step 4: Implement `insertion.ts`**

```ts
import type { Trace } from "../../types";
import { TraceBuilder, snapshot } from "../helpers";

export function insertionSort(input: number[]): Trace<number[]> {
  const a = input.slice();
  const tb = new TraceBuilder<number[]>();
  let comparisons = 0, swaps = 0;
  tb.push(snapshot(a), { narration: "Start", pseudoLine: 0, meta: { comparisons, swaps } });
  for (let i = 1; i < a.length; i++) {
    let j = i;
    tb.push(snapshot(a), {
      narration: `Insert a[${i}] = ${a[i]}`,
      highlights: [{ indices: [i], role: "active" }], pseudoLine: 1, meta: { comparisons, swaps },
    });
    while (j > 0 && (++comparisons, a[j - 1] > a[j])) {
      [a[j - 1], a[j]] = [a[j], a[j - 1]];
      swaps++;
      tb.push(snapshot(a), {
        narration: `Shift ${a[j]} left`,
        highlights: [{ indices: [j - 1, j], role: "swap" }], pseudoLine: 2,
        codeLine: { py: 2 }, meta: { comparisons, swaps },
      });
      j--;
    }
  }
  return tb.build(a);
}
```

- [ ] **Step 5: Implement `selection.ts`**

```ts
import type { Trace } from "../../types";
import { TraceBuilder, snapshot } from "../helpers";

export function selectionSort(input: number[]): Trace<number[]> {
  const a = input.slice();
  const tb = new TraceBuilder<number[]>();
  let comparisons = 0, swaps = 0;
  tb.push(snapshot(a), { narration: "Start", pseudoLine: 0, meta: { comparisons, swaps } });
  for (let i = 0; i < a.length; i++) {
    let min = i;
    for (let j = i + 1; j < a.length; j++) {
      comparisons++;
      tb.push(snapshot(a), {
        narration: `Scan for min; ${a[j]} vs ${a[min]}`,
        highlights: [{ indices: [min], role: "pivot" }, { indices: [j], role: "compare" }],
        pseudoLine: 2, meta: { comparisons, swaps },
      });
      if (a[j] < a[min]) min = j;
    }
    if (min !== i) {
      [a[i], a[min]] = [a[min], a[i]];
      swaps++;
    }
    tb.push(snapshot(a), {
      narration: `Place min at ${i}`,
      highlights: [{ indices: [i], role: "sorted" }], pseudoLine: 3, meta: { comparisons, swaps },
    });
  }
  return tb.build(a);
}
```

- [ ] **Step 6: Implement `merge.ts`**

```ts
import type { Trace } from "../../types";
import { TraceBuilder, snapshot } from "../helpers";

export function mergeSort(input: number[]): Trace<number[]> {
  const a = input.slice();
  const tb = new TraceBuilder<number[]>();
  let comparisons = 0;
  tb.push(snapshot(a), { narration: "Start", pseudoLine: 0, meta: { comparisons } });

  function ms(lo: number, hi: number): void {
    if (hi - lo <= 1) return;
    const mid = (lo + hi) >> 1;
    ms(lo, mid);
    ms(mid, hi);
    const merged: number[] = [];
    let i = lo, j = mid;
    while (i < mid && j < hi) {
      comparisons++;
      tb.push(snapshot(a), {
        narration: `Merge: compare ${a[i]} and ${a[j]}`,
        highlights: [{ indices: [i], role: "compare" }, { indices: [j], role: "compare" }],
        pseudoLine: 2, meta: { comparisons },
      });
      merged.push(a[i] <= a[j] ? a[i++] : a[j++]);
    }
    while (i < mid) merged.push(a[i++]);
    while (j < hi) merged.push(a[j++]);
    for (let k = 0; k < merged.length; k++) a[lo + k] = merged[k];
    tb.push(snapshot(a), {
      narration: `Merged [${lo}, ${hi})`,
      highlights: [{ indices: Array.from({ length: hi - lo }, (_, k) => lo + k), role: "sorted" }],
      pseudoLine: 3, meta: { comparisons },
    });
  }
  ms(0, a.length);
  return tb.build(a);
}
```

- [ ] **Step 7: Implement `quick.ts`**

```ts
import type { Trace } from "../../types";
import { TraceBuilder, snapshot } from "../helpers";

export function quickSort(input: number[]): Trace<number[]> {
  const a = input.slice();
  const tb = new TraceBuilder<number[]>();
  let comparisons = 0, swaps = 0;
  tb.push(snapshot(a), { narration: "Start", pseudoLine: 0, meta: { comparisons, swaps } });

  function qs(lo: number, hi: number): void {
    if (lo >= hi) return;
    const pivot = a[hi];
    tb.push(snapshot(a), {
      narration: `Pivot = ${pivot}`,
      highlights: [{ indices: [hi], role: "pivot" }], pseudoLine: 1, meta: { comparisons, swaps },
    });
    let i = lo;
    for (let j = lo; j < hi; j++) {
      comparisons++;
      tb.push(snapshot(a), {
        narration: `Compare ${a[j]} with pivot ${pivot}`,
        highlights: [{ indices: [j], role: "compare" }, { indices: [hi], role: "pivot" }],
        pseudoLine: 2, meta: { comparisons, swaps },
      });
      if (a[j] < pivot) {
        [a[i], a[j]] = [a[j], a[i]];
        swaps++;
        i++;
      }
    }
    [a[i], a[hi]] = [a[hi], a[i]];
    swaps++;
    tb.push(snapshot(a), {
      narration: `Place pivot at ${i}`,
      highlights: [{ indices: [i], role: "sorted" }], pseudoLine: 3, meta: { comparisons, swaps },
    });
    qs(lo, i - 1);
    qs(i + 1, hi);
  }
  qs(0, a.length - 1);
  return tb.build(a);
}
```

- [ ] **Step 8: Implement `heap.ts`**

```ts
import type { Trace } from "../../types";
import { TraceBuilder, snapshot } from "../helpers";

export function heapSort(input: number[]): Trace<number[]> {
  const a = input.slice();
  const n = a.length;
  const tb = new TraceBuilder<number[]>();
  let comparisons = 0, swaps = 0;
  tb.push(snapshot(a), { narration: "Start", pseudoLine: 0, meta: { comparisons, swaps } });

  function sift(size: number, root: number): void {
    let largest = root;
    const l = 2 * root + 1, r = 2 * root + 2;
    if (l < size && (comparisons++, a[l] > a[largest])) largest = l;
    if (r < size && (comparisons++, a[r] > a[largest])) largest = r;
    if (largest !== root) {
      [a[root], a[largest]] = [a[largest], a[root]];
      swaps++;
      tb.push(snapshot(a), {
        narration: `Sift-down swap`,
        highlights: [{ indices: [root, largest], role: "swap" }], pseudoLine: 2, meta: { comparisons, swaps },
      });
      sift(size, largest);
    }
  }
  for (let i = (n >> 1) - 1; i >= 0; i--) sift(n, i);
  for (let end = n - 1; end > 0; end--) {
    [a[0], a[end]] = [a[end], a[0]];
    swaps++;
    tb.push(snapshot(a), {
      narration: `Move max to ${end}`,
      highlights: [{ indices: [end], role: "sorted" }], pseudoLine: 3, meta: { comparisons, swaps },
    });
    sift(end, 0);
  }
  return tb.build(a);
}
```

- [ ] **Step 9: Run tests to verify pass**

Run: `cd learn-platform && npx tsx --test test/sorting.test.ts`
Expected: PASS (all sorters × 4 cases).

- [ ] **Step 10: Commit**

```bash
rtk git add learn-platform && rtk git commit -m "feat(learn-platform): six sorting algorithms as pure Trace producers"
```

---

### Task 6: BarsRenderer + registry

**Files:**
- Create: `learn-platform/src/track-dsa/renderers/BarsRenderer.tsx`
- Create: `learn-platform/src/track-dsa/renderers/registry.ts`

**Interfaces:**
- Consumes: `Frame` (Task 2), `ROLE_COLOR`, `DEFAULT_BAR` (Task 4).
- Produces:
  - `BarsRenderer({ frame }: { frame: Frame<number[]> }): JSX.Element`.
  - `registry.ts`: `RENDERERS: Record<RendererId, (props: { frame: Frame }) => JSX.Element>`.

- [ ] **Step 1: Write `BarsRenderer.tsx`**

```tsx
"use client";
import type { Frame, HighlightRole } from "../types";
import { ROLE_COLOR, DEFAULT_BAR } from "@/design/tokens";

export function BarsRenderer({ frame }: { frame: Frame<number[]> }) {
  const data = frame.state;
  const max = Math.max(1, ...data);
  const roleOf = new Map<number, HighlightRole>();
  for (const h of frame.highlights) for (const i of h.indices) roleOf.set(i, h.role);

  return (
    <div className="flex h-full w-full items-end justify-center gap-[2px] px-4 pb-4">
      {data.map((v, i) => {
        const role = roleOf.get(i);
        return (
          <div key={i} className="flex-1 rounded-t transition-all duration-200"
            style={{
              height: `${(v / max) * 100}%`,
              backgroundColor: role ? ROLE_COLOR[role] : DEFAULT_BAR,
              boxShadow: role ? `0 0 12px ${ROLE_COLOR[role]}` : "none",
            }} />
        );
      })}
    </div>
  );
}
```

- [ ] **Step 2: Write `registry.ts` (bars only for now)**

```ts
import type { Frame, RendererId } from "../types";
import { BarsRenderer } from "./BarsRenderer";

export const RENDERERS: Partial<Record<RendererId, (props: { frame: Frame }) => React.JSX.Element>> = {
  bars: BarsRenderer as (props: { frame: Frame }) => React.JSX.Element,
};
```

- [ ] **Step 3: Verify build**

Run: `cd learn-platform && npm run build`
Expected: green.

- [ ] **Step 4: Commit**

```bash
rtk git add learn-platform && rtk git commit -m "feat(learn-platform): BarsRenderer + renderer registry"
```

---

### Task 7: Array-pattern algorithms + tests

**Files:**
- Create: `learn-platform/src/track-dsa/algorithms/array/two-pointers.ts`, `sliding-window.ts`, `binary-search.ts`, `prefix-sums.ts`, `fast-slow.ts`, `merge-intervals.ts`
- Test: `learn-platform/test/array.test.ts`

**Interfaces:**
- Consumes: `TraceBuilder`, `snapshot` (Task 3).
- Produces (each a pure Trace producer over `number[]` state; return value in `trace.result` is the algorithm's answer encoded as `number[]`):
  - `twoPointersPairSum(input: number[], target: number): Trace<number[]>` — result `[i, j]` indices or `[]`.
  - `slidingWindowMaxSum(input: number[], k: number): Trace<number[]>` — result `[maxSum]`.
  - `binarySearch(input: number[], target: number): Trace<number[]>` — result `[index]` or `[-1]`.
  - `prefixSums(input: number[]): Trace<number[]>` — result is the prefix array.
  - `fastSlowHasCycle(input: number[]): Trace<number[]>` — input is a "next index" array; result `[1]`/`[0]`.
  - `mergeIntervals(input: number[]): Trace<number[]>` — input flat pairs `[s0,e0,s1,e1,...]`; result merged flat pairs.

- [ ] **Step 1: Write the failing test `test/array.test.ts`**

```ts
import test from "node:test";
import assert from "node:assert/strict";
import { twoPointersPairSum } from "../src/track-dsa/algorithms/array/two-pointers";
import { slidingWindowMaxSum } from "../src/track-dsa/algorithms/array/sliding-window";
import { binarySearch } from "../src/track-dsa/algorithms/array/binary-search";
import { prefixSums } from "../src/track-dsa/algorithms/array/prefix-sums";
import { fastSlowHasCycle } from "../src/track-dsa/algorithms/array/fast-slow";
import { mergeIntervals } from "../src/track-dsa/algorithms/array/merge-intervals";

test("two pointers finds a pair summing to target (sorted input)", () => {
  const t = twoPointersPairSum([1, 2, 4, 7, 11], 15);
  const [i, j] = t.result;
  assert.equal([1, 2, 4, 7, 11][i] + [1, 2, 4, 7, 11][j], 15);
});
test("two pointers returns [] when no pair", () => {
  assert.deepEqual(twoPointersPairSum([1, 2, 3], 100).result, []);
});
test("sliding window max sum of size k", () => {
  assert.deepEqual(slidingWindowMaxSum([2, 1, 5, 1, 3, 2], 3).result, [9]);
});
test("binary search finds index", () => {
  assert.deepEqual(binarySearch([1, 3, 5, 7, 9], 7).result, [3]);
});
test("binary search returns [-1] when absent", () => {
  assert.deepEqual(binarySearch([1, 3, 5], 4).result, [-1]);
});
test("prefix sums", () => {
  assert.deepEqual(prefixSums([1, 2, 3, 4]).result, [1, 3, 6, 10]);
});
test("fast/slow detects a cycle", () => {
  assert.deepEqual(fastSlowHasCycle([1, 2, 3, 1]).result, [1]); // 0->1->2->3->1 cycle
  assert.deepEqual(fastSlowHasCycle([1, 2, 3, -1]).result, [0]); // terminates
});
test("merge intervals", () => {
  assert.deepEqual(mergeIntervals([1, 3, 2, 6, 8, 10, 15, 18]).result, [1, 6, 8, 10, 15, 18]);
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `cd learn-platform && npx tsx --test test/array.test.ts`
Expected: FAIL — modules not found.

- [ ] **Step 3: Implement `two-pointers.ts`**

```ts
import type { Trace } from "../../types";
import { TraceBuilder, snapshot } from "../helpers";

export function twoPointersPairSum(input: number[], target: number): Trace<number[]> {
  const a = input.slice();
  const tb = new TraceBuilder<number[]>();
  let lo = 0, hi = a.length - 1;
  while (lo < hi) {
    const sum = a[lo] + a[hi];
    tb.push(snapshot(a), {
      narration: `a[${lo}] + a[${hi}] = ${sum} (target ${target})`,
      highlights: [{ indices: [lo, hi], role: "active" }],
      pseudoLine: 1, meta: { sum },
    });
    if (sum === target) return tb.build([lo, hi]);
    if (sum < target) lo++; else hi--;
  }
  return tb.build([]);
}
```

- [ ] **Step 4: Implement `sliding-window.ts`**

```ts
import type { Trace } from "../../types";
import { TraceBuilder, snapshot } from "../helpers";

export function slidingWindowMaxSum(input: number[], k: number): Trace<number[]> {
  const a = input.slice();
  const tb = new TraceBuilder<number[]>();
  if (k <= 0 || k > a.length) return tb.build([0]);
  let sum = 0;
  for (let i = 0; i < k; i++) sum += a[i];
  let best = sum;
  tb.push(snapshot(a), {
    narration: `Initial window sum ${sum}`,
    highlights: [{ indices: Array.from({ length: k }, (_, i) => i), role: "active" }],
    pseudoLine: 1, meta: { sum, best },
  });
  for (let i = k; i < a.length; i++) {
    sum += a[i] - a[i - k];
    best = Math.max(best, sum);
    tb.push(snapshot(a), {
      narration: `Slide → window sum ${sum}, best ${best}`,
      highlights: [{ indices: Array.from({ length: k }, (_, j) => i - k + 1 + j), role: "active" }],
      pseudoLine: 2, meta: { sum, best },
    });
  }
  return tb.build([best]);
}
```

- [ ] **Step 5: Implement `binary-search.ts`**

```ts
import type { Trace } from "../../types";
import { TraceBuilder, snapshot } from "../helpers";

export function binarySearch(input: number[], target: number): Trace<number[]> {
  const a = input.slice();
  const tb = new TraceBuilder<number[]>();
  let lo = 0, hi = a.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    tb.push(snapshot(a), {
      narration: `Check mid ${mid} (a[${mid}]=${a[mid]})`,
      highlights: [{ indices: [mid], role: "active" }, { indices: [lo, hi], role: "compare" }],
      pseudoLine: 2,
    });
    if (a[mid] === target) return tb.build([mid]);
    if (a[mid] < target) lo = mid + 1; else hi = mid - 1;
  }
  return tb.build([-1]);
}
```

- [ ] **Step 6: Implement `prefix-sums.ts`**

```ts
import type { Trace } from "../../types";
import { TraceBuilder, snapshot } from "../helpers";

export function prefixSums(input: number[]): Trace<number[]> {
  const a = input.slice();
  const out = new Array(a.length).fill(0);
  const tb = new TraceBuilder<number[]>();
  let running = 0;
  for (let i = 0; i < a.length; i++) {
    running += a[i];
    out[i] = running;
    tb.push(snapshot(out), {
      narration: `prefix[${i}] = ${running}`,
      highlights: [{ indices: [i], role: "cell-fill" }],
      pseudoLine: 1, meta: { running },
    });
  }
  return tb.build(out);
}
```

- [ ] **Step 7: Implement `fast-slow.ts`**

```ts
import type { Trace } from "../../types";
import { TraceBuilder, snapshot } from "../helpers";

// input is a "next index" array; -1 means terminate. Detects a cycle.
export function fastSlowHasCycle(input: number[]): Trace<number[]> {
  const nxt = input.slice();
  const tb = new TraceBuilder<number[]>();
  let slow = 0, fast = 0;
  while (true) {
    if (fast < 0 || nxt[fast] < 0) { tb.push(snapshot(nxt), { narration: "Fast hit end — no cycle", pseudoLine: 4 }); return tb.build([0]); }
    slow = nxt[slow];
    fast = nxt[fast];
    if (fast < 0 || nxt[fast] < 0) { tb.push(snapshot(nxt), { narration: "Fast hit end — no cycle", pseudoLine: 4 }); return tb.build([0]); }
    fast = nxt[fast];
    tb.push(snapshot(nxt), {
      narration: `slow=${slow}, fast=${fast}`,
      highlights: [{ indices: [slow], role: "compare" }, { indices: [fast], role: "active" }],
      pseudoLine: 2,
    });
    if (slow === fast) { tb.push(snapshot(nxt), { narration: "Pointers met — cycle!", highlights: [{ indices: [slow], role: "path" }], pseudoLine: 3 }); return tb.build([1]); }
  }
}
```

- [ ] **Step 8: Implement `merge-intervals.ts`**

```ts
import type { Trace } from "../../types";
import { TraceBuilder, snapshot } from "../helpers";

// input flat pairs [s0,e0,s1,e1,...]; result merged flat pairs.
export function mergeIntervals(input: number[]): Trace<number[]> {
  const pairs: [number, number][] = [];
  for (let i = 0; i < input.length; i += 2) pairs.push([input[i], input[i + 1]]);
  pairs.sort((x, y) => x[0] - y[0]);
  const tb = new TraceBuilder<number[]>();
  const merged: [number, number][] = [];
  for (const [s, e] of pairs) {
    const last = merged[merged.length - 1];
    if (last && s <= last[1]) {
      last[1] = Math.max(last[1], e);
      tb.push(snapshot(merged.flat()), { narration: `Extend to [${last[0]}, ${last[1]}]`, highlights: [{ indices: [merged.length - 1], role: "swap" }], pseudoLine: 2 });
    } else {
      merged.push([s, e]);
      tb.push(snapshot(merged.flat()), { narration: `New interval [${s}, ${e}]`, highlights: [{ indices: [merged.length - 1], role: "active" }], pseudoLine: 1 });
    }
  }
  return tb.build(merged.flat());
}
```

- [ ] **Step 9: Run tests to verify pass**

Run: `cd learn-platform && npx tsx --test test/array.test.ts`
Expected: PASS.

- [ ] **Step 10: Commit**

```bash
rtk git add learn-platform && rtk git commit -m "feat(learn-platform): six array-pattern algorithms + tests"
```

---

### Task 8: Catalog (sorting + array) + validation test

**Files:**
- Create: `learn-platform/src/track-dsa/catalog.ts`
- Create: `learn-platform/src/track-dsa/content/pseudocode.ts` (pseudocode + python strings, keyed by slug)
- Test: `learn-platform/test/catalog.test.ts`

**Interfaces:**
- Consumes: all sorting + array `run` functions; `AlgorithmEntry` (Task 2).
- Produces:
  - `catalog.ts`: `CATALOG: AlgorithmEntry[]`, `bySlug(slug: string): AlgorithmEntry | undefined`, `byCategory(): Record<Category, AlgorithmEntry[]>`.
  - `content/pseudocode.ts`: `PSEUDO: Record<string, string[]>`, `PY: Record<string, string>`.

- [ ] **Step 1: Write `content/pseudocode.ts`** (one entry per algorithm; example shows bubble — repeat structure for every slug)

```ts
export const PSEUDO: Record<string, string[]> = {
  "bubble-sort": [
    "for i in 0..n:",
    "  for j in 0..n-i-1:",
    "    if a[j] > a[j+1]:",
    "      swap(a[j], a[j+1])",
    "  # a[n-i-1] settled",
  ],
  // NOTE for implementer: add a PSEUDO entry for every slug in CATALOG:
  // insertion-sort, selection-sort, merge-sort, quick-sort, heap-sort,
  // two-pointers, sliding-window, binary-search, prefix-sums, fast-slow, merge-intervals.
  // Each array's indices must cover every pseudoLine used by that algorithm's run().
};

export const PY: Record<string, string> = {
  "bubble-sort": `def bubble_sort(a):
    n = len(a)
    for i in range(n):
        for j in range(n - i - 1):
            if a[j] > a[j+1]:
                a[j], a[j+1] = a[j+1], a[j]
    return a`,
  // NOTE for implementer: add a PY entry for every slug (Python reference impl).
};
```

- [ ] **Step 2: Write `catalog.ts`** (sorting + array entries)

```ts
import type { AlgorithmEntry, Category } from "./types";
import { bubbleSort } from "./algorithms/sorting/bubble";
import { insertionSort } from "./algorithms/sorting/insertion";
import { selectionSort } from "./algorithms/sorting/selection";
import { mergeSort } from "./algorithms/sorting/merge";
import { quickSort } from "./algorithms/sorting/quick";
import { heapSort } from "./algorithms/sorting/heap";
import { twoPointersPairSum } from "./algorithms/array/two-pointers";
import { slidingWindowMaxSum } from "./algorithms/array/sliding-window";
import { binarySearch } from "./algorithms/array/binary-search";
import { prefixSums } from "./algorithms/array/prefix-sums";
import { fastSlowHasCycle } from "./algorithms/array/fast-slow";
import { mergeIntervals } from "./algorithms/array/merge-intervals";
import { PSEUDO, PY } from "./content/pseudocode";

const randArray = (n = 12) => Array.from({ length: n }, (_, i) => ((i * 37 + 11) % 41)); // deterministic

export const CATALOG: AlgorithmEntry[] = [
  { slug: "bubble-sort", name: "Bubble Sort", category: "sorting", complexity: { time: "O(n²)", space: "O(1)" }, summary: "Repeatedly swap adjacent out-of-order pairs; the largest bubbles to the end each pass.", run: bubbleSort as AlgorithmEntry["run"], renderer: "bars", defaultInput: randArray, pseudocode: PSEUDO["bubble-sort"], code: { pseudo: PSEUDO["bubble-sort"].join("\n"), py: PY["bubble-sort"] }, comparableWith: ["insertion-sort", "selection-sort", "quick-sort", "merge-sort", "heap-sort"] },
  { slug: "insertion-sort", name: "Insertion Sort", category: "sorting", complexity: { time: "O(n²)", space: "O(1)" }, summary: "Grow a sorted prefix, inserting each new element into place.", run: insertionSort as AlgorithmEntry["run"], renderer: "bars", defaultInput: randArray, pseudocode: PSEUDO["insertion-sort"], code: { py: PY["insertion-sort"] }, comparableWith: ["bubble-sort", "selection-sort"] },
  { slug: "selection-sort", name: "Selection Sort", category: "sorting", complexity: { time: "O(n²)", space: "O(1)" }, summary: "Select the minimum of the unsorted region and place it next.", run: selectionSort as AlgorithmEntry["run"], renderer: "bars", defaultInput: randArray, pseudocode: PSEUDO["selection-sort"], code: { py: PY["selection-sort"] }, comparableWith: ["bubble-sort"] },
  { slug: "merge-sort", name: "Merge Sort", category: "sorting", complexity: { time: "O(n log n)", space: "O(n)" }, summary: "Divide in halves, sort each, merge the two sorted halves.", run: mergeSort as AlgorithmEntry["run"], renderer: "bars", defaultInput: randArray, pseudocode: PSEUDO["merge-sort"], code: { py: PY["merge-sort"] }, comparableWith: ["quick-sort", "bubble-sort"] },
  { slug: "quick-sort", name: "Quick Sort", category: "sorting", complexity: { time: "O(n log n)", space: "O(log n)" }, summary: "Partition around a pivot, recurse on each side.", run: quickSort as AlgorithmEntry["run"], renderer: "bars", defaultInput: randArray, pseudocode: PSEUDO["quick-sort"], code: { py: PY["quick-sort"] }, comparableWith: ["merge-sort", "bubble-sort"] },
  { slug: "heap-sort", name: "Heap Sort", category: "sorting", complexity: { time: "O(n log n)", space: "O(1)" }, summary: "Build a max-heap, repeatedly extract the max to the end.", run: heapSort as AlgorithmEntry["run"], renderer: "bars", defaultInput: randArray, pseudocode: PSEUDO["heap-sort"], code: { py: PY["heap-sort"] }, comparableWith: ["quick-sort"] },
  { slug: "two-pointers", name: "Two Pointers", category: "array-patterns", complexity: { time: "O(n)", space: "O(1)" }, summary: "Converge two indices from the ends of a sorted array to find a target pair.", run: ((inp: number[]) => twoPointersPairSum(inp, 15)) as AlgorithmEntry["run"], renderer: "bars", defaultInput: () => [1, 2, 4, 7, 11, 15], pseudocode: PSEUDO["two-pointers"], code: { py: PY["two-pointers"] } },
  { slug: "sliding-window", name: "Sliding Window", category: "array-patterns", complexity: { time: "O(n)", space: "O(1)" }, summary: "Maintain a fixed-width window sum as it slides across the array.", run: ((inp: number[]) => slidingWindowMaxSum(inp, 3)) as AlgorithmEntry["run"], renderer: "bars", defaultInput: () => [2, 1, 5, 1, 3, 2], pseudocode: PSEUDO["sliding-window"], code: { py: PY["sliding-window"] } },
  { slug: "binary-search", name: "Binary Search", category: "array-patterns", complexity: { time: "O(log n)", space: "O(1)" }, summary: "Halve the search range each step on a sorted array.", run: ((inp: number[]) => binarySearch(inp, 7)) as AlgorithmEntry["run"], renderer: "bars", defaultInput: () => [1, 3, 5, 7, 9, 11], pseudocode: PSEUDO["binary-search"], code: { py: PY["binary-search"] } },
  { slug: "prefix-sums", name: "Prefix Sums", category: "array-patterns", complexity: { time: "O(n)", space: "O(n)" }, summary: "Precompute cumulative sums for O(1) range queries.", run: prefixSums as AlgorithmEntry["run"], renderer: "bars", defaultInput: () => [1, 2, 3, 4, 5], pseudocode: PSEUDO["prefix-sums"], code: { py: PY["prefix-sums"] } },
  { slug: "fast-slow", name: "Fast & Slow Pointers", category: "array-patterns", complexity: { time: "O(n)", space: "O(1)" }, summary: "Two pointers at different speeds detect a cycle where they meet.", run: fastSlowHasCycle as AlgorithmEntry["run"], renderer: "bars", defaultInput: () => [1, 2, 3, 1], pseudocode: PSEUDO["fast-slow"], code: { py: PY["fast-slow"] } },
  { slug: "merge-intervals", name: "Merge Intervals", category: "array-patterns", complexity: { time: "O(n log n)", space: "O(n)" }, summary: "Sort by start, then absorb each overlapping interval into the last.", run: mergeIntervals as AlgorithmEntry["run"], renderer: "bars", defaultInput: () => [1, 3, 2, 6, 8, 10, 15, 18], pseudocode: PSEUDO["merge-intervals"], code: { py: PY["merge-intervals"] } },
];

export function bySlug(slug: string): AlgorithmEntry | undefined {
  return CATALOG.find((e) => e.slug === slug);
}

export function byCategory(): Record<string, AlgorithmEntry[]> {
  const out: Record<string, AlgorithmEntry[]> = {};
  for (const e of CATALOG) (out[e.category] ??= []).push(e);
  return out;
}
```

- [ ] **Step 3: Write validation test `test/catalog.test.ts`**

```ts
import test from "node:test";
import assert from "node:assert/strict";
import { CATALOG, bySlug } from "../src/track-dsa/catalog";

test("all slugs are unique", () => {
  const slugs = CATALOG.map((e) => e.slug);
  assert.equal(new Set(slugs).size, slugs.length);
});

test("every entry has pseudocode and python", () => {
  for (const e of CATALOG) {
    assert.ok(e.pseudocode && e.pseudocode.length > 0, `${e.slug} missing pseudocode`);
    assert.ok(e.code.py && e.code.py.length > 0, `${e.slug} missing python`);
  }
});

test("every frame's pseudoLine is a valid index into pseudocode", () => {
  for (const e of CATALOG) {
    const trace = e.run(e.defaultInput());
    for (const f of trace.frames) {
      if (f.pseudoLine !== undefined) {
        assert.ok(
          f.pseudoLine >= 0 && f.pseudoLine < e.pseudocode.length,
          `${e.slug}: pseudoLine ${f.pseudoLine} out of range (len ${e.pseudocode.length})`
        );
      }
    }
  }
});

test("every entry produces at least one frame on default input", () => {
  for (const e of CATALOG) {
    const trace = e.run(e.defaultInput());
    assert.ok(trace.frames.length >= 1, `${e.slug} produced no frames`);
  }
});

test("bySlug resolves and misses correctly", () => {
  assert.ok(bySlug("bubble-sort"));
  assert.equal(bySlug("nope"), undefined);
});
```

- [ ] **Step 4: Run test to verify it fails, then fill missing PSEUDO/PY**

Run: `cd learn-platform && npx tsx --test test/catalog.test.ts`
Expected: FAIL on "missing pseudocode/python" until every slug has an entry. Implementer fills all `PSEUDO`/`PY` entries so that (a) every slug is present and (b) each pseudocode array is long enough to cover the max `pseudoLine` its `run()` emits. Re-run until PASS.

- [ ] **Step 5: Commit**

```bash
rtk git add learn-platform && rtk git commit -m "feat(learn-platform): catalog + content for sorting & array, with validation tests"
```

---

### Task 9: Visualizer page + PlayerBar + CodePanel + ComplexityChart + ComparisonView; DSA landing

**Files:**
- Create: `learn-platform/src/track-dsa/components/VisualizerShell.tsx`, `PlayerBar.tsx`, `CodePanel.tsx`, `ComplexityChart.tsx`, `ComparisonView.tsx`
- Create: `learn-platform/src/app/dsa/page.tsx`, `learn-platform/src/app/dsa/[slug]/page.tsx`

**Interfaces:**
- Consumes: `usePlayer` (Task 4), `RENDERERS` (Task 6), `CATALOG`, `bySlug`, `byCategory` (Task 8), `ROLE_COLOR` (Task 4).
- Produces: full DSA track UI. `VisualizerShell({ entry })` wires player → renderer → PlayerBar → CodePanel → ComplexityChart, with a "compare" toggle mounting `ComparisonView`.

- [ ] **Step 1: Write `PlayerBar.tsx`**

```tsx
"use client";
export function PlayerBar(props: {
  index: number; total: number; playing: boolean; speed: number; narration: string; meta?: Record<string, number>;
  onPrev: () => void; onNext: () => void; onPlay: () => void; onPause: () => void; onScrub: (i: number) => void; onSpeed: (s: number) => void;
}) {
  return (
    <div className="border-t border-[var(--color-edge)] bg-[var(--color-panel)] px-6 py-3">
      <div className="flex items-center gap-3 font-mono text-sm">
        <button onClick={props.onPrev} className="text-[var(--color-muted)] hover:text-[var(--color-ink)]">◀</button>
        <button onClick={props.playing ? props.onPause : props.onPlay} className="text-[var(--color-accent)]">{props.playing ? "⏸" : "▶"}</button>
        <button onClick={props.onNext} className="text-[var(--color-muted)] hover:text-[var(--color-ink)]">▶</button>
        <input type="range" min={0} max={Math.max(0, props.total - 1)} value={props.index}
          onChange={(e) => props.onScrub(Number(e.target.value))} className="flex-1 accent-[var(--color-accent)]" />
        <span className="text-[var(--color-muted)]">{props.index + 1}/{props.total}</span>
        <select value={props.speed} onChange={(e) => props.onSpeed(Number(e.target.value))}
          className="bg-[var(--color-stage)] text-[var(--color-muted)]">
          <option value={0.5}>0.5×</option><option value={1}>1×</option><option value={2}>2×</option><option value={4}>4×</option>
        </select>
      </div>
      <div className="mt-2 flex items-center justify-between font-mono text-xs">
        <span className="text-[var(--color-ink)]">{props.narration}</span>
        <span className="text-[var(--color-muted)]">
          {props.meta && Object.entries(props.meta).map(([k, v]) => `${k}: ${v}`).join("  ")}
        </span>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Write `CodePanel.tsx`** (multi-language tab strip)

```tsx
"use client";
import { useState } from "react";
import type { AlgorithmEntry, Lang } from "../types";

const LANGS: Lang[] = ["pseudo", "py", "js", "cpp", "java"];
const LABEL: Record<Lang, string> = { pseudo: "Pseudo", py: "Py", js: "JS", cpp: "C++", java: "Java" };

export function CodePanel({ entry, pseudoLine }: { entry: AlgorithmEntry; pseudoLine?: number }) {
  const [lang, setLang] = useState<Lang>("pseudo");
  const source = lang === "pseudo" ? entry.pseudocode : (entry.code[lang]?.split("\n") ?? null);
  return (
    <div className="rounded-lg border border-[var(--color-edge)] bg-[var(--color-stage)]">
      <div className="flex gap-1 border-b border-[var(--color-edge)] px-2 py-1">
        {LANGS.map((l) => (
          <button key={l} onClick={() => setLang(l)}
            className={`rounded px-2 py-1 font-mono text-xs ${lang === l ? "bg-[var(--color-edge)] text-[var(--color-accent)]" : "text-[var(--color-muted)]"}`}>
            {LABEL[l]}
          </button>
        ))}
      </div>
      <pre className="overflow-auto p-3 font-mono text-xs leading-relaxed">
        {source
          ? source.map((line, i) => (
              <div key={i} className={lang === "pseudo" && i === pseudoLine ? "bg-[var(--color-edge)] text-[var(--color-accent)]" : "text-[var(--color-muted)]"}>
                {line || " "}
              </div>
            ))
          : <div className="text-[var(--color-muted)]">// {LABEL[lang]} coming soon</div>}
      </pre>
    </div>
  );
}
```

- [ ] **Step 3: Write `ComplexityChart.tsx`**

```tsx
"use client";
export function ComplexityChart({ time }: { time: string }) {
  // Simple static SVG comparing n, n log n, n² growth; highlights the entry's class by label.
  const w = 220, h = 90, n = 20;
  const series = (fn: (x: number) => number, color: string) => {
    const max = fn(n);
    const pts = Array.from({ length: n }, (_, i) => `${(i / (n - 1)) * w},${h - (fn(i + 1) / max) * h}`).join(" ");
    return <polyline points={pts} fill="none" stroke={color} strokeWidth={1.5} />;
  };
  return (
    <div className="rounded-lg border border-[var(--color-edge)] p-3">
      <p className="mb-2 font-mono text-xs text-[var(--color-muted)]">growth · this: {time}</p>
      <svg width={w} height={h}>
        {series((x) => x, "var(--color-sorted)")}
        {series((x) => x * Math.log2(x + 1), "var(--color-accent)")}
        {series((x) => x * x, "var(--color-pivot)")}
      </svg>
    </div>
  );
}
```

- [ ] **Step 4: Write `ComparisonView.tsx`**

```tsx
"use client";
import type { AlgorithmEntry } from "../types";
import { usePlayer } from "../player/usePlayer";
import { RENDERERS } from "../renderers/registry";
import { useMemo } from "react";

function Side({ entry, input }: { entry: AlgorithmEntry; input: unknown }) {
  const trace = useMemo(() => entry.run(input), [entry, input]);
  const p = usePlayer(trace);
  const Renderer = RENDERERS[entry.renderer]!;
  return (
    <div className="flex-1">
      <div className="mb-1 flex justify-between font-mono text-xs text-[var(--color-muted)]">
        <span>{entry.name}</span><span>{p.frame.meta && Object.entries(p.frame.meta).map(([k, v]) => `${k}:${v}`).join(" ")}</span>
      </div>
      <div className="h-64 rounded border border-[var(--color-edge)]"><Renderer frame={p.frame} /></div>
      <button onClick={p.playing ? p.pause : p.play} className="mt-1 font-mono text-xs text-[var(--color-accent)]">{p.playing ? "pause" : "play"}</button>
    </div>
  );
}

export function ComparisonView({ left, right, input }: { left: AlgorithmEntry; right: AlgorithmEntry; input: unknown }) {
  return <div className="flex gap-4">
    <Side entry={left} input={input} /><Side entry={right} input={input} />
  </div>;
}
```

- [ ] **Step 5: Write `VisualizerShell.tsx`**

```tsx
"use client";
import { useMemo, useState } from "react";
import type { AlgorithmEntry } from "../types";
import { usePlayer } from "../player/usePlayer";
import { RENDERERS } from "../renderers/registry";
import { PlayerBar } from "./PlayerBar";
import { CodePanel } from "./CodePanel";
import { ComplexityChart } from "./ComplexityChart";
import { ComparisonView } from "./ComparisonView";
import { bySlug } from "../catalog";

export function VisualizerShell({ entry }: { entry: AlgorithmEntry }) {
  const input = useMemo(() => entry.defaultInput(), [entry]);
  const trace = useMemo(() => entry.run(input), [entry, input]);
  const p = usePlayer(trace);
  const Renderer = RENDERERS[entry.renderer]!;
  const [compareSlug, setCompareSlug] = useState<string | null>(null);
  const other = compareSlug ? bySlug(compareSlug) : null;

  return (
    <div className="flex h-[calc(100vh-57px)] flex-col">
      <div className="grid flex-1 grid-cols-[1fr_360px] overflow-hidden">
        <div className="relative"><Renderer frame={p.frame} /></div>
        <aside className="space-y-4 overflow-auto border-l border-[var(--color-edge)] p-4">
          <div>
            <h1 className="font-mono text-lg text-[var(--color-ink)]">{entry.name}</h1>
            <p className="font-mono text-xs text-[var(--color-muted)]">{entry.complexity.time} time · {entry.complexity.space} space</p>
          </div>
          <CodePanel entry={entry} pseudoLine={p.frame.pseudoLine} />
          <p className="text-sm text-[var(--color-muted)]">{entry.summary}</p>
          <ComplexityChart time={entry.complexity.time} />
          {entry.comparableWith && entry.comparableWith.length > 0 && (
            <select value={compareSlug ?? ""} onChange={(e) => setCompareSlug(e.target.value || null)}
              className="w-full bg-[var(--color-stage)] font-mono text-xs text-[var(--color-muted)]">
              <option value="">compare with…</option>
              {entry.comparableWith.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          )}
        </aside>
      </div>
      {other && <div className="border-t border-[var(--color-edge)] p-4"><ComparisonView left={entry} right={other} input={input} /></div>}
      <PlayerBar
        index={p.index} total={p.total} playing={p.playing} speed={p.speed}
        narration={p.frame.narration} meta={p.frame.meta}
        onPrev={p.prev} onNext={p.next} onPlay={p.play} onPause={p.pause} onScrub={p.scrub} onSpeed={p.setSpeed}
      />
    </div>
  );
}
```

- [ ] **Step 6: Write `app/dsa/page.tsx` (catalog landing)**

```tsx
import Link from "next/link";
import { Nav } from "@/design/components/Nav";
import { byCategory } from "@/track-dsa/catalog";

export default function DsaLanding() {
  const groups = byCategory();
  return (
    <main>
      <Nav />
      <div className="px-8 py-10">
        <h1 className="font-mono text-2xl text-[var(--color-ink)]">DSA</h1>
        {Object.entries(groups).map(([cat, entries]) => (
          <section key={cat} className="mt-8">
            <h2 className="font-mono text-xs uppercase tracking-widest text-[var(--color-accent)]">{cat}</h2>
            <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {entries.map((e) => (
                <Link key={e.slug} href={`/dsa/${e.slug}`}
                  className="rounded-lg border border-[var(--color-edge)] bg-[var(--color-panel)] p-4 hover:border-[var(--color-accent)]">
                  <div className="flex justify-between"><span className="font-mono text-[var(--color-ink)]">{e.name}</span>
                    <span className="font-mono text-xs text-[var(--color-muted)]">{e.complexity.time}</span></div>
                  <p className="mt-2 text-sm text-[var(--color-muted)]">{e.summary}</p>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
```

- [ ] **Step 7: Write `app/dsa/[slug]/page.tsx`**

```tsx
import { notFound } from "next/navigation";
import { Nav } from "@/design/components/Nav";
import { VisualizerShell } from "@/track-dsa/components/VisualizerShell";
import { CATALOG, bySlug } from "@/track-dsa/catalog";

export function generateStaticParams() {
  return CATALOG.map((e) => ({ slug: e.slug }));
}

export default async function AlgorithmPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const entry = bySlug(slug);
  if (!entry) notFound();
  return (
    <main>
      <Nav />
      <VisualizerShell entry={entry} />
    </main>
  );
}
```

- [ ] **Step 8: Verify build + lint + full test run**

Run: `cd learn-platform && npm run lint && npm run build && npm test`
Expected: all green; routes `/`, `/dsa`, `/dsa/[slug]` for every catalog slug emitted.

- [ ] **Step 9: Visual verification (dev)**

Run: `cd learn-platform && npm run dev` → open `http://localhost:3003/dsa/bubble-sort`. Confirm: bars animate on play; scrubber jumps frames; pseudocode line highlights; counters update; comparison dropdown mounts a second view.

- [ ] **Step 10: Commit**

```bash
rtk git add learn-platform && rtk git commit -m "feat(learn-platform): DSA visualizer UI — player bar, code panel, complexity chart, comparison, pages"
```

---

## Milestone 3 — GridRenderer + Pathfinding

### Task 10: Grid types + pathfinding algorithms + tests

**Files:**
- Create: `learn-platform/src/track-dsa/algorithms/pathfinding/grid.ts` (shared types + helpers), `bfs.ts`, `dfs.ts`, `dijkstra.ts`, `astar.ts`
- Test: `learn-platform/test/pathfinding.test.ts`

**Interfaces:**
- Produces:
  - `grid.ts`: `type Cell = { r: number; c: number; wall: boolean; weight: number }`, `type Grid = { rows: number; cols: number; cells: Cell[][]; start: [number, number]; end: [number, number] }`, `makeGrid(rows, cols, walls: [number,number][], start, end): Grid`, and `type GridState = { grid: Grid; visited: [number,number][]; frontier: [number,number][]; path: [number,number][] }`.
  - Each algorithm: `run(grid: Grid): Trace<GridState>`; `trace.result.path` is the found path (empty if none). Named exports `bfsPath`, `dfsPath`, `dijkstraPath`, `astarPath`.

- [ ] **Step 1: Write `grid.ts`**

```ts
export type Cell = { r: number; c: number; wall: boolean; weight: number };
export type Grid = {
  rows: number; cols: number; cells: Cell[][];
  start: [number, number]; end: [number, number];
};
export type GridState = {
  grid: Grid;
  visited: [number, number][];
  frontier: [number, number][];
  path: [number, number][];
};

export function makeGrid(
  rows: number, cols: number, walls: [number, number][],
  start: [number, number], end: [number, number]
): Grid {
  const wallSet = new Set(walls.map(([r, c]) => `${r},${c}`));
  const cells: Cell[][] = [];
  for (let r = 0; r < rows; r++) {
    cells.push([]);
    for (let c = 0; c < cols; c++) {
      cells[r].push({ r, c, wall: wallSet.has(`${r},${c}`), weight: 1 });
    }
  }
  return { rows, cols, cells, start, end };
}

export function neighbors(grid: Grid, r: number, c: number): [number, number][] {
  const out: [number, number][] = [];
  for (const [dr, dc] of [[-1, 0], [1, 0], [0, -1], [0, 1]] as const) {
    const nr = r + dr, nc = c + dc;
    if (nr >= 0 && nr < grid.rows && nc >= 0 && nc < grid.cols && !grid.cells[nr][nc].wall) out.push([nr, nc]);
  }
  return out;
}

export function reconstruct(prev: Map<string, [number, number]>, end: [number, number]): [number, number][] {
  const path: [number, number][] = [];
  let cur: [number, number] | undefined = end;
  while (cur) { path.unshift(cur); cur = prev.get(`${cur[0]},${cur[1]}`); }
  return path;
}
```

- [ ] **Step 2: Write the failing test `test/pathfinding.test.ts`**

```ts
import test from "node:test";
import assert from "node:assert/strict";
import { makeGrid } from "../src/track-dsa/algorithms/pathfinding/grid";
import { bfsPath } from "../src/track-dsa/algorithms/pathfinding/bfs";
import { dfsPath } from "../src/track-dsa/algorithms/pathfinding/dfs";
import { dijkstraPath } from "../src/track-dsa/algorithms/pathfinding/dijkstra";
import { astarPath } from "../src/track-dsa/algorithms/pathfinding/astar";

const open = makeGrid(3, 3, [], [0, 0], [2, 2]);
const blocked = makeGrid(3, 3, [[0, 1], [1, 1], [2, 1]], [0, 0], [2, 2]); // wall column splits grid

const finders = { bfsPath, dfsPath, dijkstraPath, astarPath };
for (const [name, fn] of Object.entries(finders)) {
  test(`${name}: finds a path on open grid, start→end`, () => {
    const t = fn(open);
    const path = t.result.path;
    assert.deepEqual(path[0], [0, 0]);
    assert.deepEqual(path[path.length - 1], [2, 2]);
  });
  test(`${name}: path is contiguous (adjacent steps)`, () => {
    const t = fn(open);
    const path = t.result.path;
    for (let i = 1; i < path.length; i++) {
      const d = Math.abs(path[i][0] - path[i - 1][0]) + Math.abs(path[i][1] - path[i - 1][1]);
      assert.equal(d, 1, `${name} non-adjacent step`);
    }
  });
  test(`${name}: returns empty path when blocked`, () => {
    const t = fn(blocked);
    assert.equal(t.result.path.length, 0);
  });
}
test("bfs finds shortest length on open 3x3 = 5 cells", () => {
  assert.equal(bfsPath(open).result.path.length, 5);
});
```

- [ ] **Step 3: Run to verify it fails**

Run: `cd learn-platform && npx tsx --test test/pathfinding.test.ts`
Expected: FAIL — modules not found.

- [ ] **Step 4: Implement `bfs.ts`**

```ts
import type { Trace } from "../../types";
import { TraceBuilder } from "../helpers";
import { type Grid, type GridState, neighbors, reconstruct } from "./grid";

export function bfsPath(grid: Grid): Trace<GridState> {
  const tb = new TraceBuilder<GridState>();
  const [sr, sc] = grid.start;
  const q: [number, number][] = [[sr, sc]];
  const seen = new Set([`${sr},${sc}`]);
  const prev = new Map<string, [number, number]>();
  const visited: [number, number][] = [];
  const key = (r: number, c: number) => `${r},${c}`;

  const snap = (frontier: [number, number][], path: [number, number][] = []): GridState =>
    ({ grid, visited: visited.slice(), frontier: frontier.slice(), path });

  while (q.length) {
    const [r, c] = q.shift()!;
    visited.push([r, c]);
    tb.push(snap(q), { narration: `Visit (${r}, ${c})`, highlights: [], meta: { visited: visited.length } });
    if (r === grid.end[0] && c === grid.end[1]) {
      const path = reconstruct(prev, grid.end);
      tb.push(snap([], path), { narration: `Reached end — path length ${path.length}`, highlights: [] });
      return tb.build(snap([], path));
    }
    for (const [nr, nc] of neighbors(grid, r, c)) {
      if (!seen.has(key(nr, nc))) { seen.add(key(nr, nc)); prev.set(key(nr, nc), [r, c]); q.push([nr, nc]); }
    }
  }
  tb.push(snap([], []), { narration: "No path", highlights: [] });
  return tb.build(snap([], []));
}
```

- [ ] **Step 5: Implement `dfs.ts`**

```ts
import type { Trace } from "../../types";
import { TraceBuilder } from "../helpers";
import { type Grid, type GridState, neighbors, reconstruct } from "./grid";

export function dfsPath(grid: Grid): Trace<GridState> {
  const tb = new TraceBuilder<GridState>();
  const stack: [number, number][] = [grid.start];
  const seen = new Set([`${grid.start[0]},${grid.start[1]}`]);
  const prev = new Map<string, [number, number]>();
  const visited: [number, number][] = [];
  const snap = (path: [number, number][] = []): GridState =>
    ({ grid, visited: visited.slice(), frontier: stack.slice(), path });

  while (stack.length) {
    const [r, c] = stack.pop()!;
    visited.push([r, c]);
    tb.push(snap(), { narration: `Visit (${r}, ${c})`, highlights: [], meta: { visited: visited.length } });
    if (r === grid.end[0] && c === grid.end[1]) {
      const path = reconstruct(prev, grid.end);
      tb.push(snap(path), { narration: `Reached end`, highlights: [] });
      return tb.build(snap(path));
    }
    for (const [nr, nc] of neighbors(grid, r, c)) {
      const k = `${nr},${nc}`;
      if (!seen.has(k)) { seen.add(k); prev.set(k, [r, c]); stack.push([nr, nc]); }
    }
  }
  tb.push(snap([]), { narration: "No path", highlights: [] });
  return tb.build(snap([]));
}
```

- [ ] **Step 6: Implement `dijkstra.ts`**

```ts
import type { Trace } from "../../types";
import { TraceBuilder } from "../helpers";
import { type Grid, type GridState, neighbors, reconstruct } from "./grid";

export function dijkstraPath(grid: Grid): Trace<GridState> {
  const tb = new TraceBuilder<GridState>();
  const dist = new Map<string, number>();
  const prev = new Map<string, [number, number]>();
  const key = (r: number, c: number) => `${r},${c}`;
  const pq: [number, number, number][] = [[0, grid.start[0], grid.start[1]]]; // [dist, r, c]
  dist.set(key(grid.start[0], grid.start[1]), 0);
  const visited: [number, number][] = [];
  const snap = (path: [number, number][] = []): GridState =>
    ({ grid, visited: visited.slice(), frontier: pq.map(([, r, c]) => [r, c] as [number, number]), path });

  while (pq.length) {
    pq.sort((a, b) => a[0] - b[0]);
    const [d, r, c] = pq.shift()!;
    if (d > (dist.get(key(r, c)) ?? Infinity)) continue;
    visited.push([r, c]);
    tb.push(snap(), { narration: `Settle (${r}, ${c}) at dist ${d}`, highlights: [], meta: { dist: d } });
    if (r === grid.end[0] && c === grid.end[1]) {
      const path = reconstruct(prev, grid.end);
      tb.push(snap(path), { narration: `Reached end at dist ${d}`, highlights: [] });
      return tb.build(snap(path));
    }
    for (const [nr, nc] of neighbors(grid, r, c)) {
      const nd = d + grid.cells[nr][nc].weight;
      if (nd < (dist.get(key(nr, nc)) ?? Infinity)) {
        dist.set(key(nr, nc), nd); prev.set(key(nr, nc), [r, c]); pq.push([nd, nr, nc]);
      }
    }
  }
  tb.push(snap([]), { narration: "No path", highlights: [] });
  return tb.build(snap([]));
}
```

- [ ] **Step 7: Implement `astar.ts`**

```ts
import type { Trace } from "../../types";
import { TraceBuilder } from "../helpers";
import { type Grid, type GridState, neighbors, reconstruct } from "./grid";

export function astarPath(grid: Grid): Trace<GridState> {
  const tb = new TraceBuilder<GridState>();
  const h = (r: number, c: number) => Math.abs(r - grid.end[0]) + Math.abs(c - grid.end[1]);
  const key = (r: number, c: number) => `${r},${c}`;
  const g = new Map<string, number>([[key(...grid.start), 0]]);
  const prev = new Map<string, [number, number]>();
  const open: [number, number, number][] = [[h(...grid.start), grid.start[0], grid.start[1]]]; // [f, r, c]
  const visited: [number, number][] = [];
  const snap = (path: [number, number][] = []): GridState =>
    ({ grid, visited: visited.slice(), frontier: open.map(([, r, c]) => [r, c] as [number, number]), path });

  while (open.length) {
    open.sort((a, b) => a[0] - b[0]);
    const [, r, c] = open.shift()!;
    visited.push([r, c]);
    tb.push(snap(), { narration: `Expand (${r}, ${c})`, highlights: [], meta: { open: open.length } });
    if (r === grid.end[0] && c === grid.end[1]) {
      const path = reconstruct(prev, grid.end);
      tb.push(snap(path), { narration: `Reached end`, highlights: [] });
      return tb.build(snap(path));
    }
    for (const [nr, nc] of neighbors(grid, r, c)) {
      const tentative = (g.get(key(r, c)) ?? Infinity) + grid.cells[nr][nc].weight;
      if (tentative < (g.get(key(nr, nc)) ?? Infinity)) {
        g.set(key(nr, nc), tentative); prev.set(key(nr, nc), [r, c]);
        open.push([tentative + h(nr, nc), nr, nc]);
      }
    }
  }
  tb.push(snap([]), { narration: "No path", highlights: [] });
  return tb.build(snap([]));
}
```

- [ ] **Step 8: Run tests to verify pass**

Run: `cd learn-platform && npx tsx --test test/pathfinding.test.ts`
Expected: PASS.

- [ ] **Step 9: Commit**

```bash
rtk git add learn-platform && rtk git commit -m "feat(learn-platform): grid model + BFS/DFS/Dijkstra/A* pathfinding traces"
```

---

### Task 11: GridRenderer + register + catalog entries + content

**Files:**
- Create: `learn-platform/src/track-dsa/renderers/GridRenderer.tsx`
- Modify: `learn-platform/src/track-dsa/renderers/registry.ts` (add `grid`)
- Modify: `learn-platform/src/track-dsa/catalog.ts` (add 4 pathfinding entries)
- Modify: `learn-platform/src/track-dsa/content/pseudocode.ts` (add pseudocode + py for the 4)

**Interfaces:**
- Consumes: `GridState` (Task 10), `ROLE_COLOR` (Task 4).
- Produces: `GridRenderer({ frame }: { frame: Frame<GridState> })`; registry gains `grid`; catalog gains `bfs`, `dfs`, `dijkstra`, `astar` entries (renderer `"grid"`, `defaultInput` returns a `Grid` via `makeGrid`).

- [ ] **Step 1: Write `GridRenderer.tsx`**

```tsx
"use client";
import type { Frame } from "../types";
import type { GridState } from "../algorithms/pathfinding/grid";

export function GridRenderer({ frame }: { frame: Frame<GridState> }) {
  const { grid, visited, frontier, path } = frame.state;
  const vSet = new Set(visited.map(([r, c]) => `${r},${c}`));
  const fSet = new Set(frontier.map(([r, c]) => `${r},${c}`));
  const pSet = new Set(path.map(([r, c]) => `${r},${c}`));
  const color = (r: number, c: number, wall: boolean) => {
    if (wall) return "var(--color-edge)";
    if (`${r},${c}` === `${grid.start[0]},${grid.start[1]}`) return "var(--color-sorted)";
    if (`${r},${c}` === `${grid.end[0]},${grid.end[1]}`) return "var(--color-pivot)";
    if (pSet.has(`${r},${c}`)) return "var(--color-path)";
    if (fSet.has(`${r},${c}`)) return "var(--color-frontier)";
    if (vSet.has(`${r},${c}`)) return "var(--color-visited)";
    return "var(--color-panel)";
  };
  return (
    <div className="flex h-full w-full items-center justify-center p-4">
      <div className="grid gap-[2px]" style={{ gridTemplateColumns: `repeat(${grid.cols}, 1fr)` }}>
        {grid.cells.flat().map((cell) => (
          <div key={`${cell.r},${cell.c}`} className="aspect-square w-6 rounded-sm transition-colors duration-150"
            style={{ backgroundColor: color(cell.r, cell.c, cell.wall) }} />
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Register `grid` in `registry.ts`**

```ts
import type { Frame, RendererId } from "../types";
import { BarsRenderer } from "./BarsRenderer";
import { GridRenderer } from "./GridRenderer";

export const RENDERERS: Partial<Record<RendererId, (props: { frame: Frame }) => React.JSX.Element>> = {
  bars: BarsRenderer as (props: { frame: Frame }) => React.JSX.Element,
  grid: GridRenderer as (props: { frame: Frame }) => React.JSX.Element,
};
```

- [ ] **Step 3: Add pathfinding entries to `catalog.ts`** (append to `CATALOG`, add imports)

```ts
// add imports at top:
import { makeGrid } from "./algorithms/pathfinding/grid";
import { bfsPath } from "./algorithms/pathfinding/bfs";
import { dfsPath } from "./algorithms/pathfinding/dfs";
import { dijkstraPath } from "./algorithms/pathfinding/dijkstra";
import { astarPath } from "./algorithms/pathfinding/astar";

// deterministic demo grid: 8x8 with a wall column gap
const demoGrid = () => makeGrid(8, 8,
  [[1,4],[2,4],[3,4],[4,4],[5,4],[6,4]] as [number,number][],
  [0, 0], [7, 7]);

// append these entries:
  { slug: "bfs", name: "Breadth-First Search", category: "pathfinding", complexity: { time: "O(V+E)", space: "O(V)" }, summary: "Explore in waves; the first time we reach the goal is a shortest path.", run: bfsPath as AlgorithmEntry["run"], renderer: "grid", defaultInput: demoGrid, pseudocode: PSEUDO["bfs"], code: { py: PY["bfs"] } },
  { slug: "dfs", name: "Depth-First Search", category: "pathfinding", complexity: { time: "O(V+E)", space: "O(V)" }, summary: "Plunge deep along one branch before backtracking.", run: dfsPath as AlgorithmEntry["run"], renderer: "grid", defaultInput: demoGrid, pseudocode: PSEUDO["dfs"], code: { py: PY["dfs"] } },
  { slug: "dijkstra", name: "Dijkstra", category: "pathfinding", complexity: { time: "O(E log V)", space: "O(V)" }, summary: "Grow shortest-known distances outward using a priority queue.", run: dijkstraPath as AlgorithmEntry["run"], renderer: "grid", defaultInput: demoGrid, pseudocode: PSEUDO["dijkstra"], code: { py: PY["dijkstra"] } },
  { slug: "astar", name: "A*", category: "pathfinding", complexity: { time: "O(E)", space: "O(V)" }, summary: "Dijkstra guided by a heuristic toward the goal.", run: astarPath as AlgorithmEntry["run"], renderer: "grid", defaultInput: demoGrid, pseudocode: PSEUDO["astar"], code: { py: PY["astar"] } },
```

- [ ] **Step 4: Add `PSEUDO` + `PY` entries** for `bfs`, `dfs`, `dijkstra`, `astar` in `content/pseudocode.ts`. Pseudocode arrays must cover any `pseudoLine` those runs emit (the Task-10 implementations emit none beyond narration, so a descriptive 4-6 line pseudocode array each is sufficient; ensure `code.py` is a real Python impl).

- [ ] **Step 5: Verify tests + lint + build**

Run: `cd learn-platform && npm test && npm run lint && npm run build`
Expected: all green; `/dsa/bfs` etc. emitted.

- [ ] **Step 6: Visual check + commit**

Dev-verify `/dsa/bfs` shows the grid, walls, start/end, visited/frontier/path colors while scrubbing. Then:
```bash
rtk git add learn-platform && rtk git commit -m "feat(learn-platform): GridRenderer + pathfinding catalog entries"
```

---

## Milestone 4 — TreeRenderer + Trees

### Task 12: Tree model + algorithms + tests

**Files:**
- Create: `learn-platform/src/track-dsa/algorithms/trees/tree.ts` (model), `bst.ts`, `traversal.ts`, `trie.ts`, `heap.ts`
- Test: `learn-platform/test/trees.test.ts`

**Interfaces:**
- Produces:
  - `tree.ts`: `type TreeNode = { id: number; value: number; x: number; y: number }`, `type Edge = [number, number]`, `type TreeState = { nodes: TreeNode[]; edges: Edge[]; highlightIds: number[] }`, plus a `layoutBST(values): { nodes, edges }` helper that assigns x/y by in-order position + depth.
  - Named exports: `bstInsertSequence(values: number[]): Trace<TreeState>`, `traversal(values: number[], order: "in"|"pre"|"post"): Trace<TreeState>` (result state's `highlightIds` is the visit order), `trieInsert(words: string[]): Trace<TreeState>`, `heapSiftDemo(values: number[]): Trace<TreeState>`.
  - The visit-order for `traversal` is asserted in tests, so expose the order as `trace.result.highlightIds` mapped back to values via node lookup, OR return the ordered values in `trace.result` — **choose: `traversal` returns ordered values array as a second field on result**. Concretely: `traversal(...).result.order: number[]`. Extend `TreeState` with optional `order?: number[]`.

- [ ] **Step 1: Write `tree.ts`**

```ts
export type TreeNode = { id: number; value: number; x: number; y: number };
export type Edge = [number, number];
export type TreeState = {
  nodes: TreeNode[];
  edges: Edge[];
  highlightIds: number[];
  order?: number[];
};

type BNode = { value: number; left?: BNode; right?: BNode; id: number };

export function buildBST(values: number[]): BNode | undefined {
  let root: BNode | undefined;
  let idc = 0;
  for (const v of values) {
    const node: BNode = { value: v, id: idc++ };
    if (!root) { root = node; continue; }
    let cur = root;
    while (true) {
      if (v < cur.value) { if (!cur.left) { cur.left = node; break; } cur = cur.left; }
      else { if (!cur.right) { cur.right = node; break; } cur = cur.right; }
    }
  }
  return root;
}

export function layout(root: BNode | undefined): { nodes: TreeNode[]; edges: Edge[] } {
  const nodes: TreeNode[] = [];
  const edges: Edge[] = [];
  let xCounter = 0;
  function walk(n: BNode | undefined, depth: number): void {
    if (!n) return;
    walk(n.left, depth + 1);
    const x = xCounter++;
    nodes.push({ id: n.id, value: n.value, x, y: depth });
    if (n.left) edges.push([n.id, n.left.id]);
    if (n.right) edges.push([n.id, n.right.id]);
    walk(n.right, depth + 1);
  }
  walk(root, 0);
  return { nodes, edges };
}

export function inorder(n: BNode | undefined, out: number[]): void { if (!n) return; inorder(n.left, out); out.push(n.value); inorder(n.right, out); }
export function preorder(n: BNode | undefined, out: number[]): void { if (!n) return; out.push(n.value); preorder(n.left, out); preorder(n.right, out); }
export function postorder(n: BNode | undefined, out: number[]): void { if (!n) return; postorder(n.left, out); postorder(n.right, out); out.push(n.value); }
export { type BNode };
```

- [ ] **Step 2: Write the failing test `test/trees.test.ts`**

```ts
import test from "node:test";
import assert from "node:assert/strict";
import { bstInsertSequence } from "../src/track-dsa/algorithms/trees/bst";
import { traversal } from "../src/track-dsa/algorithms/trees/traversal";
import { trieInsert } from "../src/track-dsa/algorithms/trees/trie";
import { heapSiftDemo } from "../src/track-dsa/algorithms/trees/heap";

test("bst insert produces nodes for each value", () => {
  const t = bstInsertSequence([5, 3, 8, 1, 4]);
  assert.equal(t.result.nodes.length, 5);
});
test("in-order traversal yields sorted values", () => {
  const t = traversal([5, 3, 8, 1, 4, 7, 9], "in");
  assert.deepEqual(t.result.order, [1, 3, 4, 5, 7, 8, 9]);
});
test("pre-order starts at root", () => {
  const t = traversal([5, 3, 8], "pre");
  assert.equal(t.result.order![0], 5);
});
test("post-order ends at root", () => {
  const t = traversal([5, 3, 8], "post");
  assert.equal(t.result.order![t.result.order!.length - 1], 5);
});
test("trie insert creates nodes and has frames", () => {
  const t = trieInsert(["ab", "ac"]);
  assert.ok(t.result.nodes.length >= 3); // root + a + b + c (shared a)
  assert.ok(t.frames.length >= 1);
});
test("heap sift demo produces frames", () => {
  const t = heapSiftDemo([3, 9, 2, 1, 7]);
  assert.ok(t.frames.length >= 1);
});
```

- [ ] **Step 3: Run to verify it fails**

Run: `cd learn-platform && npx tsx --test test/trees.test.ts`
Expected: FAIL — modules not found.

- [ ] **Step 4: Implement `bst.ts`**

```ts
import type { Trace } from "../../types";
import { TraceBuilder } from "../helpers";
import { buildBST, layout, type TreeState } from "./tree";

export function bstInsertSequence(values: number[]): Trace<TreeState> {
  const tb = new TraceBuilder<TreeState>();
  for (let i = 1; i <= values.length; i++) {
    const root = buildBST(values.slice(0, i));
    const { nodes, edges } = layout(root);
    const lastId = nodes.find((n) => n.value === values[i - 1])?.id;
    tb.push({ nodes, edges, highlightIds: lastId !== undefined ? [lastId] : [] }, {
      narration: `Insert ${values[i - 1]}`,
      highlights: lastId !== undefined ? [{ indices: [lastId], role: "inserted" }] : [],
    });
  }
  const { nodes, edges } = layout(buildBST(values));
  return tb.build({ nodes, edges, highlightIds: [] });
}
```

- [ ] **Step 5: Implement `traversal.ts`**

```ts
import type { Trace } from "../../types";
import { TraceBuilder } from "../helpers";
import { buildBST, layout, inorder, preorder, postorder, type TreeState } from "./tree";

export function traversal(values: number[], order: "in" | "pre" | "post"): Trace<TreeState> {
  const root = buildBST(values);
  const { nodes, edges } = layout(root);
  const out: number[] = [];
  if (order === "in") inorder(root, out);
  else if (order === "pre") preorder(root, out);
  else postorder(root, out);

  const tb = new TraceBuilder<TreeState>();
  const visitedIds: number[] = [];
  for (const value of out) {
    const node = nodes.find((n) => n.value === value && !visitedIds.includes(n.id));
    if (node) visitedIds.push(node.id);
    tb.push({ nodes, edges, highlightIds: visitedIds.slice() }, {
      narration: `Visit ${value}`,
      highlights: [{ indices: node ? [node.id] : [], role: "current" }],
    });
  }
  return tb.build({ nodes, edges, highlightIds: visitedIds, order: out });
}
```

- [ ] **Step 6: Implement `trie.ts`**

```ts
import type { Trace } from "../../types";
import { TraceBuilder } from "../helpers";
import type { TreeState, TreeNode, Edge } from "./tree";

export function trieInsert(words: string[]): Trace<TreeState> {
  const tb = new TraceBuilder<TreeState>();
  const nodes: TreeNode[] = [{ id: 0, value: -1, x: 0, y: 0 }]; // root; value -1 sentinel
  const edges: Edge[] = [];
  const childMap = new Map<string, number>(); // `${parentId}:${char}` -> nodeId
  let idc = 1, xc = 1;

  for (const word of words) {
    let parent = 0;
    for (const ch of word) {
      const key = `${parent}:${ch}`;
      let id = childMap.get(key);
      if (id === undefined) {
        id = idc++;
        childMap.set(key, id);
        nodes.push({ id, value: ch.charCodeAt(0), x: xc++, y: (nodes.find((n) => n.id === parent)?.y ?? 0) + 1 });
        edges.push([parent, id]);
        tb.push({ nodes: nodes.slice(), edges: edges.slice(), highlightIds: [id] }, {
          narration: `Add '${ch}' of "${word}"`, highlights: [{ indices: [id], role: "inserted" }],
        });
      } else {
        tb.push({ nodes: nodes.slice(), edges: edges.slice(), highlightIds: [id] }, {
          narration: `'${ch}' already present`, highlights: [{ indices: [id], role: "current" }],
        });
      }
      parent = id;
    }
  }
  return tb.build({ nodes, edges, highlightIds: [] });
}
```

- [ ] **Step 7: Implement `heap.ts`** (visualize sift-down on an array-backed heap laid out as a tree)

```ts
import type { Trace } from "../../types";
import { TraceBuilder } from "../helpers";
import type { TreeState, TreeNode, Edge } from "./tree";

function heapLayout(a: number[]): { nodes: TreeNode[]; edges: Edge[] } {
  const nodes: TreeNode[] = a.map((v, i) => ({ id: i, value: v, x: i, y: Math.floor(Math.log2(i + 1)) }));
  const edges: Edge[] = [];
  for (let i = 0; i < a.length; i++) {
    const l = 2 * i + 1, r = 2 * i + 2;
    if (l < a.length) edges.push([i, l]);
    if (r < a.length) edges.push([i, r]);
  }
  return { nodes, edges };
}

export function heapSiftDemo(values: number[]): Trace<TreeState> {
  const a = values.slice();
  const tb = new TraceBuilder<TreeState>();
  const n = a.length;
  const emit = (ids: number[], narration: string) => {
    const { nodes, edges } = heapLayout(a);
    tb.push({ nodes, edges, highlightIds: ids }, { narration, highlights: ids.map((id) => ({ indices: [id], role: "swap" as const })) });
  };
  emit([], "Build max-heap");
  for (let i = (n >> 1) - 1; i >= 0; i--) {
    let root = i;
    while (true) {
      let largest = root;
      const l = 2 * root + 1, r = 2 * root + 2;
      if (l < n && a[l] > a[largest]) largest = l;
      if (r < n && a[r] > a[largest]) largest = r;
      if (largest === root) break;
      [a[root], a[largest]] = [a[largest], a[root]];
      emit([root, largest], `Sift-down: swap ${a[largest]} and ${a[root]}`);
      root = largest;
    }
  }
  const { nodes, edges } = heapLayout(a);
  return tb.build({ nodes, edges, highlightIds: [] });
}
```

- [ ] **Step 8: Run tests to verify pass**

Run: `cd learn-platform && npx tsx --test test/trees.test.ts`
Expected: PASS.

- [ ] **Step 9: Commit**

```bash
rtk git add learn-platform && rtk git commit -m "feat(learn-platform): tree model + BST/traversal/trie/heap traces"
```

---

### Task 13: TreeRenderer + register + catalog + content

**Files:**
- Create: `learn-platform/src/track-dsa/renderers/TreeRenderer.tsx`
- Modify: `registry.ts` (add `tree`), `catalog.ts` (add entries), `content/pseudocode.ts`

**Interfaces:**
- Consumes: `TreeState` (Task 12).
- Produces: `TreeRenderer({ frame }: { frame: Frame<TreeState> })`; catalog gains `bst-insert`, `traversal-inorder`, `traversal-preorder`, `traversal-postorder`, `trie`, `heap` (renderer `"tree"`).

- [ ] **Step 1: Write `TreeRenderer.tsx`** (SVG node/edge layout scaled from x/y grid coords)

```tsx
"use client";
import type { Frame } from "../types";
import type { TreeState } from "../algorithms/trees/tree";

export function TreeRenderer({ frame }: { frame: Frame<TreeState> }) {
  const { nodes, edges, highlightIds } = frame.state;
  if (nodes.length === 0) return <div className="flex h-full items-center justify-center text-[var(--color-muted)]">empty</div>;
  const maxX = Math.max(1, ...nodes.map((n) => n.x));
  const maxY = Math.max(1, ...nodes.map((n) => n.y));
  const W = 640, H = 360, pad = 40;
  const px = (x: number) => pad + (x / maxX) * (W - 2 * pad);
  const py = (y: number) => pad + (y / maxY) * (H - 2 * pad);
  const hi = new Set(highlightIds);
  const byId = new Map(nodes.map((n) => [n.id, n]));
  return (
    <div className="flex h-full w-full items-center justify-center">
      <svg width={W} height={H}>
        {edges.map(([a, b], i) => {
          const na = byId.get(a)!, nb = byId.get(b)!;
          return <line key={i} x1={px(na.x)} y1={py(na.y)} x2={px(nb.x)} y2={py(nb.y)} stroke="var(--color-edge)" strokeWidth={1.5} />;
        })}
        {nodes.map((n) => (
          <g key={n.id}>
            <circle cx={px(n.x)} cy={py(n.y)} r={16}
              fill={hi.has(n.id) ? "var(--color-accent)" : "var(--color-panel)"}
              stroke="var(--color-edge)" />
            <text x={px(n.x)} y={py(n.y) + 4} textAnchor="middle" fontSize={11}
              fill="var(--color-ink)" fontFamily="var(--font-mono)">
              {n.value >= 32 && n.value < 127 && n.value !== -1 ? String.fromCharCode(n.value) : n.value === -1 ? "•" : n.value}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
```

- [ ] **Step 2: Register `tree`, add catalog entries + content**

Add `tree: TreeRenderer as ...` to `RENDERERS`. Append catalog entries (imports for `bstInsertSequence`, `traversal`, `trieInsert`, `heapSiftDemo`):

```ts
  { slug: "bst-insert", name: "BST Insert", category: "trees", complexity: { time: "O(h)", space: "O(1)" }, summary: "Insert values, descending left/right until an empty slot.", run: bstInsertSequence as AlgorithmEntry["run"], renderer: "tree", defaultInput: () => [5, 3, 8, 1, 4, 7, 9], pseudocode: PSEUDO["bst-insert"], code: { py: PY["bst-insert"] } },
  { slug: "traversal-inorder", name: "In-order Traversal", category: "trees", complexity: { time: "O(n)", space: "O(h)" }, summary: "Left, node, right — yields sorted order for a BST.", run: ((v: number[]) => traversal(v, "in")) as AlgorithmEntry["run"], renderer: "tree", defaultInput: () => [5, 3, 8, 1, 4, 7, 9], pseudocode: PSEUDO["traversal-inorder"], code: { py: PY["traversal-inorder"] } },
  { slug: "traversal-preorder", name: "Pre-order Traversal", category: "trees", complexity: { time: "O(n)", space: "O(h)" }, summary: "Node, left, right.", run: ((v: number[]) => traversal(v, "pre")) as AlgorithmEntry["run"], renderer: "tree", defaultInput: () => [5, 3, 8, 1, 4, 7, 9], pseudocode: PSEUDO["traversal-preorder"], code: { py: PY["traversal-preorder"] } },
  { slug: "traversal-postorder", name: "Post-order Traversal", category: "trees", complexity: { time: "O(n)", space: "O(h)" }, summary: "Left, right, node.", run: ((v: number[]) => traversal(v, "post")) as AlgorithmEntry["run"], renderer: "tree", defaultInput: () => [5, 3, 8, 1, 4, 7, 9], pseudocode: PSEUDO["traversal-postorder"], code: { py: PY["traversal-postorder"] } },
  { slug: "trie", name: "Trie Insert", category: "trees", complexity: { time: "O(L)", space: "O(ALPHABET·N)" }, summary: "Insert words character-by-character, sharing common prefixes.", run: ((_: unknown) => trieInsert(["cat", "car", "dog"])) as AlgorithmEntry["run"], renderer: "tree", defaultInput: () => null, pseudocode: PSEUDO["trie"], code: { py: PY["trie"] } },
  { slug: "heap", name: "Binary Heap (sift-down)", category: "trees", complexity: { time: "O(n)", space: "O(1)" }, summary: "Heapify by sinking each parent below larger children.", run: heapSiftDemo as AlgorithmEntry["run"], renderer: "tree", defaultInput: () => [3, 9, 2, 1, 7, 5, 8], pseudocode: PSEUDO["heap"], code: { py: PY["heap"] } },
```

Add corresponding `PSEUDO` + `PY` entries for all six slugs.

- [ ] **Step 3: Verify tests + lint + build; visual-check `/dsa/traversal-inorder`; commit**

Run: `cd learn-platform && npm test && npm run lint && npm run build`
Expected: green.
```bash
rtk git add learn-platform && rtk git commit -m "feat(learn-platform): TreeRenderer + trees catalog entries"
```

---

## Milestone 5 — GraphRenderer + Graphs

### Task 14: Graph model + algorithms + tests

**Files:**
- Create: `learn-platform/src/track-dsa/algorithms/graphs/graph.ts`, `traverse.ts`, `toposort.ts`, `union-find.ts`
- Test: `learn-platform/test/graphs.test.ts`

**Interfaces:**
- Produces:
  - `graph.ts`: `type GraphNode = { id: number; x: number; y: number; label: string }`, `type GraphEdge = { from: number; to: number; directed: boolean }`, `type GraphState = { nodes: GraphNode[]; edges: GraphEdge[]; visitedIds: number[]; activeId: number | null; order?: number[] }`, and `circleLayout(n): GraphNode[]` (positions n nodes on a circle).
  - `graphBFS(adj: number[][], start: number): Trace<GraphState>` — result.order = BFS visit order.
  - `graphDFS(adj: number[][], start: number): Trace<GraphState>` — result.order = DFS visit order.
  - `topoSort(adj: number[][]): Trace<GraphState>` — result.order = a valid topological order (Kahn's).
  - `unionFind(n: number, unions: [number, number][]): Trace<GraphState>` — result.order = final root of each node (path-compressed).

- [ ] **Step 1: Write `graph.ts`**

```ts
export type GraphNode = { id: number; x: number; y: number; label: string };
export type GraphEdge = { from: number; to: number; directed: boolean };
export type GraphState = {
  nodes: GraphNode[];
  edges: GraphEdge[];
  visitedIds: number[];
  activeId: number | null;
  order?: number[];
};

export function circleLayout(n: number, labels?: string[]): GraphNode[] {
  const nodes: GraphNode[] = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * 2 * Math.PI - Math.PI / 2;
    nodes.push({ id: i, x: Math.cos(a), y: Math.sin(a), label: labels?.[i] ?? String(i) });
  }
  return nodes;
}

export function edgesFromAdj(adj: number[][], directed: boolean): GraphEdge[] {
  const edges: GraphEdge[] = [];
  const seen = new Set<string>();
  for (let u = 0; u < adj.length; u++) for (const v of adj[u]) {
    const key = directed ? `${u}->${v}` : [u, v].sort((a, b) => a - b).join("-");
    if (seen.has(key)) continue;
    seen.add(key);
    edges.push({ from: u, to: v, directed });
  }
  return edges;
}
```

- [ ] **Step 2: Write the failing test `test/graphs.test.ts`**

```ts
import test from "node:test";
import assert from "node:assert/strict";
import { graphBFS } from "../src/track-dsa/algorithms/graphs/traverse";
import { graphDFS } from "../src/track-dsa/algorithms/graphs/traverse";
import { topoSort } from "../src/track-dsa/algorithms/graphs/toposort";
import { unionFind } from "../src/track-dsa/algorithms/graphs/union-find";

const adj = [[1, 2], [0, 3], [0, 3], [1, 2]]; // square graph 0-1-3-2-0

test("BFS from 0 visits all nodes, starts at 0", () => {
  const t = graphBFS(adj, 0);
  assert.equal(t.result.order![0], 0);
  assert.deepEqual([...t.result.order!].sort(), [0, 1, 2, 3]);
});
test("DFS from 0 visits all nodes", () => {
  const t = graphDFS(adj, 0);
  assert.deepEqual([...t.result.order!].sort(), [0, 1, 2, 3]);
});
test("topological sort respects edges", () => {
  const dag = [[1, 2], [3], [3], []]; // 0->1,0->2,1->3,2->3
  const order = topoSort(dag).result.order!;
  const pos = new Map(order.map((v, i) => [v, i]));
  for (let u = 0; u < dag.length; u++) for (const v of dag[u]) assert.ok(pos.get(u)! < pos.get(v)!);
});
test("union-find merges components", () => {
  const t = unionFind(5, [[0, 1], [1, 2], [3, 4]]);
  const root = t.result.order!;
  assert.equal(root[0], root[2]); // 0,1,2 same component
  assert.notEqual(root[0], root[3]); // different from 3,4
});
```

- [ ] **Step 3: Run to verify it fails**

Run: `cd learn-platform && npx tsx --test test/graphs.test.ts`
Expected: FAIL — modules not found.

- [ ] **Step 4: Implement `traverse.ts` (BFS + DFS)**

```ts
import type { Trace } from "../../types";
import { TraceBuilder } from "../helpers";
import { circleLayout, edgesFromAdj, type GraphState } from "./graph";

function base(adj: number[][]) {
  const nodes = circleLayout(adj.length);
  const edges = edgesFromAdj(adj, false);
  return { nodes, edges };
}

export function graphBFS(adj: number[][], start: number): Trace<GraphState> {
  const { nodes, edges } = base(adj);
  const tb = new TraceBuilder<GraphState>();
  const q = [start]; const seen = new Set([start]); const order: number[] = [];
  while (q.length) {
    const u = q.shift()!; order.push(u);
    tb.push({ nodes, edges, visitedIds: order.slice(), activeId: u }, {
      narration: `Visit ${u}`, highlights: [{ indices: [u], role: "current" }],
    });
    for (const v of adj[u]) if (!seen.has(v)) { seen.add(v); q.push(v); }
  }
  return tb.build({ nodes, edges, visitedIds: order, activeId: null, order });
}

export function graphDFS(adj: number[][], start: number): Trace<GraphState> {
  const { nodes, edges } = base(adj);
  const tb = new TraceBuilder<GraphState>();
  const seen = new Set<number>(); const order: number[] = [];
  (function dfs(u: number) {
    seen.add(u); order.push(u);
    tb.push({ nodes, edges, visitedIds: order.slice(), activeId: u }, {
      narration: `Visit ${u}`, highlights: [{ indices: [u], role: "current" }],
    });
    for (const v of adj[u]) if (!seen.has(v)) dfs(v);
  })(start);
  return tb.build({ nodes, edges, visitedIds: order, activeId: null, order });
}
```

- [ ] **Step 5: Implement `toposort.ts` (Kahn's)**

```ts
import type { Trace } from "../../types";
import { TraceBuilder } from "../helpers";
import { circleLayout, edgesFromAdj, type GraphState } from "./graph";

export function topoSort(adj: number[][]): Trace<GraphState> {
  const nodes = circleLayout(adj.length);
  const edges = edgesFromAdj(adj, true);
  const tb = new TraceBuilder<GraphState>();
  const indeg = new Array(adj.length).fill(0);
  for (const outs of adj) for (const v of outs) indeg[v]++;
  const q: number[] = []; for (let i = 0; i < adj.length; i++) if (indeg[i] === 0) q.push(i);
  const order: number[] = [];
  while (q.length) {
    const u = q.shift()!; order.push(u);
    tb.push({ nodes, edges, visitedIds: order.slice(), activeId: u }, {
      narration: `Emit ${u} (in-degree 0)`, highlights: [{ indices: [u], role: "current" }],
    });
    for (const v of adj[u]) { if (--indeg[v] === 0) q.push(v); }
  }
  return tb.build({ nodes, edges, visitedIds: order, activeId: null, order });
}
```

- [ ] **Step 6: Implement `union-find.ts`**

```ts
import type { Trace } from "../../types";
import { TraceBuilder } from "../helpers";
import { circleLayout, type GraphState, type GraphEdge } from "./graph";

export function unionFind(n: number, unions: [number, number][]): Trace<GraphState> {
  const nodes = circleLayout(n);
  const parent = Array.from({ length: n }, (_, i) => i);
  const find = (x: number): number => (parent[x] === x ? x : (parent[x] = find(parent[x])));
  const tb = new TraceBuilder<GraphState>();
  const edges: GraphEdge[] = [];
  for (const [a, b] of unions) {
    const ra = find(a), rb = find(b);
    if (ra !== rb) { parent[ra] = rb; edges.push({ from: a, to: b, directed: false }); }
    tb.push({ nodes, edges: edges.slice(), visitedIds: [a, b], activeId: b }, {
      narration: `Union(${a}, ${b}) → root ${find(b)}`,
      highlights: [{ indices: [a, b], role: "swap" }],
    });
  }
  const root = Array.from({ length: n }, (_, i) => find(i));
  return tb.build({ nodes, edges, visitedIds: [], activeId: null, order: root });
}
```

- [ ] **Step 7: Run tests to verify pass**

Run: `cd learn-platform && npx tsx --test test/graphs.test.ts`
Expected: PASS.

- [ ] **Step 8: Commit**

```bash
rtk git add learn-platform && rtk git commit -m "feat(learn-platform): graph model + BFS/DFS/toposort/union-find traces"
```

---

### Task 15: GraphRenderer + register + catalog + content

**Files:**
- Create: `learn-platform/src/track-dsa/renderers/GraphRenderer.tsx`
- Modify: `registry.ts`, `catalog.ts`, `content/pseudocode.ts`

**Interfaces:**
- Consumes: `GraphState` (Task 14).
- Produces: `GraphRenderer`; catalog gains `graph-bfs`, `graph-dfs`, `toposort`, `union-find` (renderer `"graph"`).

- [ ] **Step 1: Write `GraphRenderer.tsx`**

```tsx
"use client";
import type { Frame } from "../types";
import type { GraphState } from "../algorithms/graphs/graph";

export function GraphRenderer({ frame }: { frame: Frame<GraphState> }) {
  const { nodes, edges, visitedIds, activeId } = frame.state;
  const W = 480, H = 360, cx = W / 2, cy = H / 2, R = 140;
  const px = (x: number) => cx + x * R;
  const py = (y: number) => cy + y * R;
  const visited = new Set(visitedIds);
  const byId = new Map(nodes.map((n) => [n.id, n]));
  return (
    <div className="flex h-full w-full items-center justify-center">
      <svg width={W} height={H}>
        {edges.map((e, i) => {
          const a = byId.get(e.from)!, b = byId.get(e.to)!;
          return <line key={i} x1={px(a.x)} y1={py(a.y)} x2={px(b.x)} y2={py(b.y)} stroke="var(--color-edge)" strokeWidth={1.5} />;
        })}
        {nodes.map((n) => {
          const fill = n.id === activeId ? "var(--color-accent)" : visited.has(n.id) ? "var(--color-visited)" : "var(--color-panel)";
          return (
            <g key={n.id}>
              <circle cx={px(n.x)} cy={py(n.y)} r={18} fill={fill} stroke="var(--color-edge)" />
              <text x={px(n.x)} y={py(n.y) + 4} textAnchor="middle" fontSize={12} fill="var(--color-ink)" fontFamily="var(--font-mono)">{n.label}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
```

- [ ] **Step 2: Register `graph`, add catalog + content**

Add `graph: GraphRenderer as ...` to `RENDERERS`. Append entries (imports for the four functions):

```ts
  { slug: "graph-bfs", name: "Graph BFS", category: "graphs", complexity: { time: "O(V+E)", space: "O(V)" }, summary: "Breadth-first exploration from a source, level by level.", run: ((_: unknown) => graphBFS([[1,2],[0,3],[0,3],[1,2]], 0)) as AlgorithmEntry["run"], renderer: "graph", defaultInput: () => null, pseudocode: PSEUDO["graph-bfs"], code: { py: PY["graph-bfs"] } },
  { slug: "graph-dfs", name: "Graph DFS", category: "graphs", complexity: { time: "O(V+E)", space: "O(V)" }, summary: "Depth-first exploration from a source.", run: ((_: unknown) => graphDFS([[1,2],[0,3],[0,3],[1,2]], 0)) as AlgorithmEntry["run"], renderer: "graph", defaultInput: () => null, pseudocode: PSEUDO["graph-dfs"], code: { py: PY["graph-dfs"] } },
  { slug: "toposort", name: "Topological Sort", category: "graphs", complexity: { time: "O(V+E)", space: "O(V)" }, summary: "Kahn's algorithm: repeatedly emit an in-degree-0 node.", run: ((_: unknown) => topoSort([[1,2],[3],[3],[]])) as AlgorithmEntry["run"], renderer: "graph", defaultInput: () => null, pseudocode: PSEUDO["toposort"], code: { py: PY["toposort"] } },
  { slug: "union-find", name: "Union-Find", category: "graphs", complexity: { time: "O(α(n))", space: "O(n)" }, summary: "Disjoint-set union with path compression.", run: ((_: unknown) => unionFind(6, [[0,1],[1,2],[3,4],[2,5]])) as AlgorithmEntry["run"], renderer: "graph", defaultInput: () => null, pseudocode: PSEUDO["union-find"], code: { py: PY["union-find"] } },
```

Add `PSEUDO` + `PY` entries for the four slugs.

- [ ] **Step 3: Verify + visual-check `/dsa/graph-bfs` + commit**

Run: `cd learn-platform && npm test && npm run lint && npm run build`
```bash
rtk git add learn-platform && rtk git commit -m "feat(learn-platform): GraphRenderer + graphs catalog entries"
```

---

## Milestone 6 — Dynamic Programming (BarsRenderer table variant)

### Task 16: DP algorithms + tests

**Files:**
- Create: `learn-platform/src/track-dsa/algorithms/dp/fib.ts`, `coin-change.ts`, `knapsack.ts`, `lcs.ts`, `edit-distance.ts`
- Test: `learn-platform/test/dp.test.ts`

**Interfaces:**
- Produces (1D DP renders as `number[]`; 2D DP flattens its table row-major into `number[]` so BarsRenderer displays it; result carries the final answer):
  - `fib(n: number): Trace<number[]>` — result last element = fib(n); state = dp array.
  - `coinChange(coins: number[], amount: number): Trace<number[]>` — result last element = min coins or -1.
  - `knapsack(weights: number[], values: number[], cap: number): Trace<number[]>` — result last element = best value; state = flattened (n+1)×(cap+1) table.
  - `lcs(aCodes: number[], bCodes: number[]): Trace<number[]>` — inputs are char-code arrays; result last element = LCS length.
  - `editDistance(aCodes: number[], bCodes: number[]): Trace<number[]>` — result last element = edit distance.

- [ ] **Step 1: Write the failing test `test/dp.test.ts`**

```ts
import test from "node:test";
import assert from "node:assert/strict";
import { fib } from "../src/track-dsa/algorithms/dp/fib";
import { coinChange } from "../src/track-dsa/algorithms/dp/coin-change";
import { knapsack } from "../src/track-dsa/algorithms/dp/knapsack";
import { lcs } from "../src/track-dsa/algorithms/dp/lcs";
import { editDistance } from "../src/track-dsa/algorithms/dp/edit-distance";

const last = (a: number[]) => a[a.length - 1];
const codes = (s: string) => [...s].map((c) => c.charCodeAt(0));

test("fib(10) = 55", () => assert.equal(last(fib(10).result), 55));
test("coinChange([1,3,4], 6) = 2", () => assert.equal(last(coinChange([1, 3, 4], 6).result), 2));
test("coinChange impossible = -1", () => assert.equal(last(coinChange([2], 3).result), -1));
test("knapsack basic", () => assert.equal(last(knapsack([1, 3, 4, 5], [1, 4, 5, 7], 7).result), 9));
test("lcs('ABCBDAB','BDCAB') = 4", () => assert.equal(last(lcs(codes("ABCBDAB"), codes("BDCAB")).result), 4));
test("editDistance('kitten','sitting') = 3", () => assert.equal(last(editDistance(codes("kitten"), codes("sitting")).result), 3));
```

- [ ] **Step 2: Run to verify it fails**

Run: `cd learn-platform && npx tsx --test test/dp.test.ts`
Expected: FAIL — modules not found.

- [ ] **Step 3: Implement `fib.ts`**

```ts
import type { Trace } from "../../types";
import { TraceBuilder, snapshot } from "../helpers";

export function fib(n: number): Trace<number[]> {
  const dp = new Array(Math.max(1, n + 1)).fill(0);
  const tb = new TraceBuilder<number[]>();
  if (n >= 1) dp[1] = 1;
  tb.push(snapshot(dp), { narration: "Base cases dp[0]=0, dp[1]=1", highlights: [{ indices: [0, 1], role: "cell-fill" }] });
  for (let i = 2; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2];
    tb.push(snapshot(dp), {
      narration: `dp[${i}] = dp[${i - 1}] + dp[${i - 2}] = ${dp[i]}`,
      highlights: [{ indices: [i], role: "cell-fill" }, { indices: [i - 1, i - 2], role: "cell-read" }],
    });
  }
  return tb.build(dp);
}
```

- [ ] **Step 4: Implement `coin-change.ts`**

```ts
import type { Trace } from "../../types";
import { TraceBuilder, snapshot } from "../helpers";

export function coinChange(coins: number[], amount: number): Trace<number[]> {
  const INF = amount + 1;
  const dp = new Array(amount + 1).fill(INF);
  dp[0] = 0;
  const tb = new TraceBuilder<number[]>();
  const view = () => dp.map((v) => (v === INF ? -1 : v));
  tb.push(snapshot(view()), { narration: "dp[0]=0, rest = ∞", highlights: [{ indices: [0], role: "cell-fill" }] });
  for (let a = 1; a <= amount; a++) {
    for (const c of coins) if (c <= a && dp[a - c] + 1 < dp[a]) dp[a] = dp[a - c] + 1;
    tb.push(snapshot(view()), {
      narration: `dp[${a}] = ${dp[a] === INF ? "∞" : dp[a]}`,
      highlights: [{ indices: [a], role: "cell-fill" }],
    });
  }
  const out = view();
  out[out.length - 1] = dp[amount] === INF ? -1 : dp[amount];
  return tb.build(out);
}
```

- [ ] **Step 5: Implement `knapsack.ts`**

```ts
import type { Trace } from "../../types";
import { TraceBuilder, snapshot } from "../helpers";

export function knapsack(weights: number[], values: number[], cap: number): Trace<number[]> {
  const n = weights.length;
  const cols = cap + 1;
  const dp = Array.from({ length: n + 1 }, () => new Array(cols).fill(0));
  const tb = new TraceBuilder<number[]>();
  const flat = () => dp.flat();
  tb.push(snapshot(flat()), { narration: "Init table to 0", highlights: [] });
  for (let i = 1; i <= n; i++) {
    for (let w = 0; w <= cap; w++) {
      dp[i][w] = dp[i - 1][w];
      if (weights[i - 1] <= w) dp[i][w] = Math.max(dp[i][w], dp[i - 1][w - weights[i - 1]] + values[i - 1]);
      tb.push(snapshot(flat()), {
        narration: `item ${i}, cap ${w} → ${dp[i][w]}`,
        highlights: [{ indices: [i * cols + w], role: "cell-fill" }],
      });
    }
  }
  const out = flat();
  out[out.length - 1] = dp[n][cap];
  return tb.build(out);
}
```

- [ ] **Step 6: Implement `lcs.ts`**

```ts
import type { Trace } from "../../types";
import { TraceBuilder, snapshot } from "../helpers";

export function lcs(a: number[], b: number[]): Trace<number[]> {
  const m = a.length, n = b.length, cols = n + 1;
  const dp = Array.from({ length: m + 1 }, () => new Array(cols).fill(0));
  const tb = new TraceBuilder<number[]>();
  const flat = () => dp.flat();
  tb.push(snapshot(flat()), { narration: "Init table", highlights: [] });
  for (let i = 1; i <= m; i++) for (let j = 1; j <= n; j++) {
    dp[i][j] = a[i - 1] === b[j - 1] ? dp[i - 1][j - 1] + 1 : Math.max(dp[i - 1][j], dp[i][j - 1]);
    tb.push(snapshot(flat()), { narration: `dp[${i}][${j}] = ${dp[i][j]}`, highlights: [{ indices: [i * cols + j], role: "cell-fill" }] });
  }
  const out = flat();
  out[out.length - 1] = dp[m][n];
  return tb.build(out);
}
```

- [ ] **Step 7: Implement `edit-distance.ts`**

```ts
import type { Trace } from "../../types";
import { TraceBuilder, snapshot } from "../helpers";

export function editDistance(a: number[], b: number[]): Trace<number[]> {
  const m = a.length, n = b.length, cols = n + 1;
  const dp = Array.from({ length: m + 1 }, () => new Array(cols).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  const tb = new TraceBuilder<number[]>();
  const flat = () => dp.flat();
  tb.push(snapshot(flat()), { narration: "Init borders", highlights: [] });
  for (let i = 1; i <= m; i++) for (let j = 1; j <= n; j++) {
    dp[i][j] = a[i - 1] === b[j - 1]
      ? dp[i - 1][j - 1]
      : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    tb.push(snapshot(flat()), { narration: `dp[${i}][${j}] = ${dp[i][j]}`, highlights: [{ indices: [i * cols + j], role: "cell-fill" }] });
  }
  const out = flat();
  out[out.length - 1] = dp[m][n];
  return tb.build(out);
}
```

- [ ] **Step 8: Run tests to verify pass**

Run: `cd learn-platform && npx tsx --test test/dp.test.ts`
Expected: PASS.

- [ ] **Step 9: Commit**

```bash
rtk git add learn-platform && rtk git commit -m "feat(learn-platform): DP algorithms (fib, coin change, knapsack, LCS, edit distance)"
```

---

### Task 17: DP catalog entries + content + final integration pass

**Files:**
- Modify: `learn-platform/src/track-dsa/catalog.ts` (add 5 DP entries), `content/pseudocode.ts`
- Modify: `learn-platform/README.md` (create), repo `README.md` (add row)

**Interfaces:**
- Consumes: DP functions (Task 16).
- Produces: catalog gains `fib`, `coin-change`, `knapsack`, `lcs`, `edit-distance` (renderer `"bars"`, category `"dynamic-programming"`).

- [ ] **Step 1: Add DP entries + content**

```ts
// imports:
import { fib } from "./algorithms/dp/fib";
import { coinChange } from "./algorithms/dp/coin-change";
import { knapsack } from "./algorithms/dp/knapsack";
import { lcs } from "./algorithms/dp/lcs";
import { editDistance } from "./algorithms/dp/edit-distance";
const codes = (s: string) => [...s].map((c) => c.charCodeAt(0));

// entries:
  { slug: "fib", name: "Fibonacci (DP)", category: "dynamic-programming", complexity: { time: "O(n)", space: "O(n)" }, summary: "Bottom-up: each term is the sum of the previous two.", run: ((_: unknown) => fib(12)) as AlgorithmEntry["run"], renderer: "bars", defaultInput: () => null, pseudocode: PSEUDO["fib"], code: { py: PY["fib"] } },
  { slug: "coin-change", name: "Coin Change", category: "dynamic-programming", complexity: { time: "O(amount·coins)", space: "O(amount)" }, summary: "Min coins for each sub-amount, built up to the target.", run: ((_: unknown) => coinChange([1, 3, 4], 11)) as AlgorithmEntry["run"], renderer: "bars", defaultInput: () => null, pseudocode: PSEUDO["coin-change"], code: { py: PY["coin-change"] } },
  { slug: "knapsack", name: "0/1 Knapsack", category: "dynamic-programming", complexity: { time: "O(n·W)", space: "O(n·W)" }, summary: "Best value table over items × capacity.", run: ((_: unknown) => knapsack([1, 3, 4, 5], [1, 4, 5, 7], 7)) as AlgorithmEntry["run"], renderer: "bars", defaultInput: () => null, pseudocode: PSEUDO["knapsack"], code: { py: PY["knapsack"] } },
  { slug: "lcs", name: "Longest Common Subsequence", category: "dynamic-programming", complexity: { time: "O(m·n)", space: "O(m·n)" }, summary: "Table of LCS lengths over prefixes of two strings.", run: ((_: unknown) => lcs(codes("ABCBDAB"), codes("BDCAB"))) as AlgorithmEntry["run"], renderer: "bars", defaultInput: () => null, pseudocode: PSEUDO["lcs"], code: { py: PY["lcs"] } },
  { slug: "edit-distance", name: "Edit Distance", category: "dynamic-programming", complexity: { time: "O(m·n)", space: "O(m·n)" }, summary: "Min insert/delete/replace to transform one string to another.", run: ((_: unknown) => editDistance(codes("kitten"), codes("sitting"))) as AlgorithmEntry["run"], renderer: "bars", defaultInput: () => null, pseudocode: PSEUDO["edit-distance"], code: { py: PY["edit-distance"] } },
```

Add `PSEUDO` + `PY` for all five.

- [ ] **Step 2: Full green gate**

Run: `cd learn-platform && npm test && npm run lint && npm run build`
Expected: all tests pass; lint clean; build emits all routes (11 sorting/array + 4 pathfinding + 6 trees + 4 graphs + 5 DP = 30 algorithm routes plus `/` and `/dsa`).

- [ ] **Step 3: Add READMEs**

Create `learn-platform/README.md` (short: what it is, `npm run dev` on 3003, catalog summary, architecture one-paragraph). Add a row to the repo root `README.md` table for `learn-platform`.

- [ ] **Step 4: Update repo CLAUDE.md**

Add a `learn-platform` section to `G:\Desk\Code\Websites\CLAUDE.md` mirroring the other sites' format (scripts, port 3003, one-line architecture note about the Trace engine + tracks roadmap).

- [ ] **Step 5: Final commit**

```bash
rtk git add . && rtk git commit -m "feat(learn-platform): DP catalog entries + docs; cycle-1 DSA track complete"
```

---

## Self-Review

**Spec coverage:**
- Platform shell (home/hero, nav, track cards, design system) → Tasks 1, 4. ✓
- Track-as-plugin hosting → Nav + routing (Task 4) + renderer registry pattern (Task 6). ✓
- Trace/Frame/AlgorithmEntry data model → Task 2. ✓
- Headless player (play/pause/step/scrub/speed, clamp/rewind/auto-pause) → Tasks 2, 4. ✓
- Four renderers → Bars (6), Grid (11), Tree (13), Graph (15). ✓
- Full catalog: sorting (5), array (7), pathfinding (10), trees (12), graphs (14), DP (16). ✓
- Multi-language code panel (Pseudo·Py·JS·C++·Java; Py+pseudo required, others "coming soon") → CodePanel (Task 9); Py+pseudo enforced by catalog test (Task 8). ✓
- Comparison mode → ComparisonView (Task 9); `comparableWith` on entries. ✓
- Complexity chart → Task 9. ✓
- Milestone-gated (each category tested + lint + build before next) → milestone structure + green gates in Tasks 9/11/13/15/17. ✓
- Testing strategy (correctness, trace invariants, player logic, catalog validation) → Tasks 2, 3, 5, 7, 8, 10, 12, 14, 16. ✓
- Dark cinematic tokens, prefers-reduced-motion → Task 1. ✓
- Port 3003 → Task 1. ✓
- Determinism (no random in run) → `defaultInput` deterministic seeds throughout. ✓

**Placeholder scan:** The `content/pseudocode.ts` entries are the one place the plan asks the implementer to author repeated content (pseudocode + Python per slug) rather than listing all 30 verbatim; this is bounded by an explicit rule (every slug must have an entry; array length must cover emitted `pseudoLine`s) and enforced by the Task-8 catalog test that FAILS until satisfied. This is acceptable per DRY (the structure is shown once, with bubble-sort as a complete worked example) and is machine-checked. No `TODO`/`TBD`/"handle edge cases" placeholders remain.

**Type consistency:** `Trace`/`Frame`/`Highlight`/`AlgorithmEntry` defined once (Task 2) and imported everywhere. `run` signatures normalized to `(input) => Trace` and cast at the catalog boundary via `as AlgorithmEntry["run"]`. `GridState`/`TreeState`/`GraphState` each defined once in their model file and consumed by their renderer + tests. `RENDERERS` keyed by `RendererId`; renderers registered incrementally (bars→grid→tree→graph). `usePlayer` return shape (`index, frame, playing, speed, total, next, prev, scrub, play, pause, reset, setSpeed`) matches PlayerBar/ComparisonView props. Player reducer action names (`next/prev/scrub/play/pause/reset/setSpeed`) consistent between Task 2 and Task 4.

All checks pass; no gaps found.
