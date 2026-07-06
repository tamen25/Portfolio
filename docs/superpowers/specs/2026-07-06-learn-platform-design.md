# Learn Platform — Design (Cycle 1: Shell + DSA Track)

**Date:** 2026-07-06
**Status:** Approved (design), pending implementation plan
**Location:** new standalone site `learn-platform/` at the repo root (folder is a
placeholder; real product name TBD before launch)
**Supersedes:** `2026-07-06-dsa-visualizer-design.md` (the DSA visualizer is now
one track of this platform)
**Reference:** getreqflow.com — used as a *functional* reference (what
interactions/tracks exist), rendered in the user's own dark-cinematic style. We
write our own algorithms, copy, and visuals; no assets, code, or content copied.

## Purpose

An interactive, dark-cinematic learning platform for engineers — "runnable
artifacts, not slides." Multiple specialized tracks (DSA, System Design, and
later FDE) plus cross-cutting learning features (spaced-repetition quiz). Every
concept is something you can play, pause, scrub, and step through, with
synchronized narration, real code, and complexity insight.

This is a new top-level site in the monorepo (like `main-portfolio`,
`photography-portfolio`, `cloudops-portfolio`), self-contained with its own
`package.json` and tooling (Next 16, React 19, Tailwind 4, `tsx` tests,
`motion` for animation — matching the other sites).

## Scope decomposition (whole platform)

The platform is too large for one spec. It decomposes into independent
sub-projects that share the shell and design system; each gets its own
spec → plan → build cycle:

- **Sub-project 0 — Platform shell.** Scaffold, navigation, home/hero, track
  cards, design system (dark cinematic), routing that hosts tracks.
- **Sub-project 1 — DSA track.** Trace engine + renderers + full catalog, plus
  Reqflow-grade extras (real multi-language code, comparison mode, complexity
  charts).
- **Sub-project 2 — System Design track.** Live architecture request-trace
  simulator (Instagram/Uber-style; watch failures happen). A *different* engine
  (diagram/flow simulation, not the array/grid Trace model). Later cycle.
- **Sub-project 3 — Spaced-repetition quiz (SM-2).** Cross-cutting flashcard /
  review system usable across tracks. Later cycle.
- **Sub-project 4 — FDE track.** Forward-deployed engineering. On the roadmap;
  scoped when reached.

### Roadmap

- **Cycle 1 (this spec): Platform shell + DSA track.** Ships a real, demoable
  product proving the platform pattern.
- **Cycle 2: System Design track.** Plugs into the proven shell.
- **Cycle 3: Spaced-repetition quiz.** Cross-cutting across tracks.
- **Later: FDE track.**

The rest of this document specifies **Cycle 1** in full.

---

## Cycle 1 — Platform shell + DSA track

### Part A — Platform shell

- **Home / hero.** Dark-cinematic landing ("go from confused to confident"-style
  message in the user's own words), a dense composed layout (not airy),
  numbered/progressive sections, and **track cards** (DSA active; System Design
  and FDE shown as "coming soon"). Cards carry difficulty indicators.
- **Navigation.** Persistent header; routes to the active track and (later)
  other tracks. Track-scoped sub-nav inside a track (category browser).
- **Design system.** Near-black stage (~`#0a0a0b`), one glowing accent hue with
  role-based variants, monospace for code/counters, purposeful motion
  (transforms/opacity, respect `prefers-reduced-motion`). Consistent with the
  other portfolio sites' dark cinematic direction. Shared tokens/components live
  in `src/design/**` so every track inherits them.
- **Track hosting.** A track is a self-contained module registered into the
  platform (its own routes, catalog, renderers). The shell knows tracks
  abstractly (title, icon, status, route) and does not depend on a track's
  internals — mirroring the plugin pattern used inside the DSA track.

### Part B — DSA track

The DSA track is the previously-approved visualizer design, extended with the
Reqflow-grade extras.

#### Core concept — the Trace contract

Every algorithm is a **pure function** returning a `Trace`: an ordered array of
`Frame`s (a state snapshot + highlights + narration). Algorithms never touch the
DOM. This separation makes stepping, rewind, scrubbing, and testing trivial and
deterministic.

```
Algorithm (pure fn) ──► Trace (Frame[]) ──► Player ──► Renderer
   e.g. bubbleSort       data+highlights     scrub/step   bars/grid/tree/graph
                         +narration          +speed
```

#### Architecture — four layers

1. **Algorithms** (`tracks/dsa/algorithms/**`) — pure TS, one per algorithm,
   producing a `Trace`. Fully unit-testable.
2. **Player** (`tracks/dsa/player/usePlayer.ts`) — headless controller: frame
   index, play/pause, speed, step, scrub. Data-agnostic.
3. **Renderers** (`tracks/dsa/renderers/**`) — draw one `Frame`, one per data
   shape: `BarsRenderer` (arrays/sorting; DP tables as a variant),
   `GridRenderer` (pathfinding), `TreeRenderer` (trees/tries/heaps),
   `GraphRenderer` (graphs).
4. **Catalog** (`tracks/dsa/catalog.ts`) — registry of `AlgorithmEntry`s
   (function, renderer, metadata) + the track's pages.

#### Data model

```ts
type HighlightRole =
  | 'compare' | 'swap' | 'sorted' | 'active' | 'pivot'
  | 'visited' | 'frontier' | 'path'
  | 'current' | 'inserted' | 'removed'
  | 'cell-fill' | 'cell-read';

type Highlight = { indices: number[]; role: HighlightRole };

type Frame<TState> = {
  state: TState;
  highlights: Highlight[];
  narration: string;
  pseudoLine?: number;              // index into entry.pseudocode
  codeLine?: Partial<Record<Lang, number>>;  // per-language line to highlight
  meta?: Record<string, number>;    // counters
};

type Trace<TState> = { frames: Frame<TState>[]; result: TState };

type Lang = 'pseudo' | 'py' | 'js' | 'cpp' | 'java';

type AlgorithmEntry<TInput = unknown, TState = unknown> = {
  slug: string;
  name: string;
  category: Category;
  complexity: { time: string; space: string };
  summary: string;
  run: (input: TInput) => Trace<TState>;
  renderer: 'bars' | 'grid' | 'tree' | 'graph';
  defaultInput: () => TInput;
  pseudocode: string[];
  code: Partial<Record<Lang, string>>;  // real source per language (tabbed)
};

type Category =
  | 'sorting' | 'array-patterns' | 'pathfinding'
  | 'trees' | 'graphs' | 'dynamic-programming';
```

`TState` is generic per data shape; the player only reads `frames.length` + an
index.

#### Reqflow-grade extras (part of cycle 1)

- **Multi-language code panel.** A tab strip (Pseudo · Py · JS · C++ · Java)
  beside the visualization. **Architecturally supports all four real languages
  from day one**; in cycle 1, **pseudocode + Python are required and fully wired
  (highlight synced via `codeLine`)**; JS/C++/Java tabs are populated
  per-algorithm as content lands (a tab with no source shows a tasteful
  "coming soon" state rather than breaking).
- **Comparison mode.** Two algorithms of the same renderer shape run side by
  side on the *same* input, each with its own player synced to a shared
  timeline, showing step-count / comparison / swap metrics. (Enabled where it
  makes sense, e.g. sorting.)
- **Complexity charts.** A small draggable chart (e.g. O(n²) vs O(n log n))
  illustrating growth, tied to the current algorithm's complexity.

#### UI shell (visualizer page)

```
┌────────────────────────────────────────────────────────────┐
│  [platform]  DSA ▸ Sorting  Array  Pathfinding  Trees  ...  │
├──────────────────────────────────┬─────────────────────────┤
│                                  │  Bubble Sort  O(n²)/O(1) │
│        VISUALIZATION STAGE       │ ┌ Pseudo│Py│JS│C++│Java┐ │
│  (bars/grid/tree/graph, glow by  │ │ ▸ if a[j] > a[j+1] hl │ │
│   highlight role)                │ └───────────────────────┘ │
│                                  │  Summary · complexity chart│
├──────────────────────────────────┴─────────────────────────┤
│  ⏮ ◀ ▶/⏸ ▶ ⏭  ──●────  speed ▁▂▃  frame 12/88  [compare]   │
│  "Comparing 5 and 3 → swap"     comparisons:14  swaps:6      │
└────────────────────────────────────────────────────────────┘
```

Interactions: player bar (step/play/scrub/speed/jump), per-renderer input
controls (randomize/size; draw walls + set start/end; insert/remove nodes; edit
DP input), synced narration + counters + code highlight, comparison toggle.

**Catalog home (track landing):** dense grid of algorithm cards grouped by
category, each with name + complexity + tiny preview.

### Full DSA catalog (cycle 1)

Sequenced renderer-by-renderer; each category fully built, tested, lint+build
green, and visually verified before the next.

- **BarsRenderer** — Sorting: bubble, insertion, selection, merge, quick, heap.
  Array patterns: two pointers, sliding window, binary search, prefix sums,
  fast/slow pointers, merge intervals.
- **GridRenderer** — Pathfinding: BFS, DFS, Dijkstra, A* (walls + weights).
- **TreeRenderer** — BST insert/delete, traversals (in/pre/post-order), trie
  insert/search, binary heap (sift-up/sift-down).
- **GraphRenderer** — graph BFS/DFS, topological sort, union-find (path
  compression).
- **DP** (BarsRenderer table variant) — 1D: Fibonacci/climbing-stairs, coin
  change. 2D: 0/1 knapsack, LCS, edit distance.

Backtracking and bit-manipulation fold into array-patterns/graphs only if they
fit an existing renderer cleanly; otherwise deferred to a follow-up rather than
inventing a fifth renderer in cycle 1.

## Build sequencing (cycle 1, single milestone-gated pass)

Each milestone fully done + tested + lint/build green + visually verified before
advancing, so there is always a working, growing site:

1. **Scaffold + platform shell + engine.** `learn-platform/`, design system,
   home/hero, track cards, nav, track-hosting; DSA `Trace`/`Frame` types,
   `usePlayer`, `catalog.ts`, visualizer page, player bar, code panel
   (multi-lang tab strip), narration, counters.
2. **BarsRenderer + Sorting + Array patterns** (+ comparison mode + complexity
   chart wired here first) — complete and tested.
3. **GridRenderer + Pathfinding** — complete and tested.
4. **TreeRenderer + Trees** — complete and tested.
5. **GraphRenderer + Graphs** — complete and tested.
6. **DP category** (bars/table variant) — complete and tested.

Pseudocode + Python code populated for every algorithm as it lands; JS/C++/Java
filled opportunistically without gating the milestone.

## Testing strategy

Repo convention: `tsx --test test/*.test.ts`, plus `lint` and `build`.

- **Algorithm correctness:** `run(input).result` equals a known expected output.
- **Trace invariants:** swap frames reorder only two elements; frame count
  bounded; final frame is fully complete; every `pseudoLine`/`codeLine` is a
  valid index into the corresponding source.
- **Player logic:** clamp past end, rewind to 0, scrub sets index, speed changes
  interval, play→pause stops advancing.
- **Comparison mode:** both players stay on the shared timeline; metrics match
  each trace's counters.
- **Shell/renderers:** light smoke tests; substantive logic lives in pure
  functions.

## Out of scope (cycle 1)

- System Design track, FDE track, spaced-repetition quiz — later cycles
  (architecture leaves room; not built now).
- Accounts, saving, sharing, any backend — fully static / client-side.
- Live code *editing/execution*; the code panel is display-only.
- Full population of JS/C++/Java for all 40 algorithms — architecture supports
  it; only pseudocode + Python are required in cycle 1.
- Mobile-perfect layout — responsive-reasonable; desktop is the target.
- A fifth DSA renderer for exotic structures.

## The scaling promise

The shell hosts tracks as plugins; each track hosts algorithms as plugins. After
cycle 1, adding an algorithm, a language tab's source, or an entire new track is
a bounded, repeatable task against a proven engine — which is what makes a
multi-track platform sustainable instead of collapsing under its own weight.
