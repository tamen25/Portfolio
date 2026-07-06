# DSA Visualizer — Design

**Date:** 2026-07-06
**Status:** Approved (design), pending implementation plan
**Location:** new standalone site `dsa-visualizer/` at the repo root

## Purpose

A standalone, dark-cinematic web app that visualizes the full DSA canon — data
structures, algorithm patterns, and classic algorithms — as animated,
step-through-able walkthroughs. Every algorithm can be played, paused, stepped
forward/back, scrubbed, and speed-adjusted, with synchronized narration,
pseudocode highlighting, and live counters. The goal is a genuine learning tool
covering "all patterns needed to master DSA, and all algorithms visualized" —
not a toy with a handful of sorts.

It is a new top-level site in the monorepo (like `main-portfolio`,
`photography-portfolio`, `cloudops-portfolio`), self-contained with its own
`package.json` and tooling.

## Core concept — the Trace contract

Every algorithm is a **pure function** that takes an input and returns a
`Trace`: an ordered array of `Frame`s. A `Frame` is a snapshot of the
algorithm's state at one moment plus what to emphasize and a line of narration.
Algorithms never touch the DOM. This total separation of computation from
rendering is what makes stepping, rewind, scrubbing, and testing trivial and
deterministic.

```
Algorithm (pure fn)  ──►  Trace (Frame[])  ──►  Player  ──►  Renderer
   e.g. bubbleSort         data + highlights      scrub/step    bars / grid / tree / graph
                           + narration            + speed
```

## Architecture — four layers

Each layer has one clear purpose, communicates through a well-defined interface,
and is understandable and testable in isolation.

1. **Algorithms** (`src/algorithms/**`) — pure TS functions, one per algorithm,
   producing a `Trace`. No React, no rendering. Fully unit-testable.
2. **Player** (`src/player/usePlayer.ts`) — a headless controller (React hook /
   state machine) owning current frame index, play/pause, speed, step
   forward/back, scrub. Knows nothing about *what* is being rendered — only
   `frames.length` and an index.
3. **Renderers** (`src/renderers/**`) — visual components that take a single
   `Frame` and draw it. One renderer per *shape* of data, reused across many
   algorithms:
   - `BarsRenderer` — arrays/sorting (and DP tables as a bars/table variant)
   - `GridRenderer` — pathfinding grids with walls/weights
   - `TreeRenderer` — trees, tries, heaps
   - `GraphRenderer` — general graphs
4. **Catalog + shell** (`src/catalog.ts`, `src/app/**`) — a registry mapping
   each algorithm to its function, renderer, and metadata; plus the app shell
   (category nav, catalog home page, visualizer page with player controls,
   narration, pseudocode/complexity panel).

**Why this shape:** adding an algorithm = write one pure function + register one
catalog entry. It reuses an existing renderer and the entire player/shell for
free. That is what makes a 40+ item catalog tractable — each addition is
bounded and repeatable.

## Data model

```ts
type HighlightRole =
  | 'compare' | 'swap' | 'sorted' | 'active' | 'pivot'
  | 'visited' | 'frontier' | 'path'      // pathfinding/graphs
  | 'current' | 'inserted' | 'removed'   // trees
  | 'cell-fill' | 'cell-read';           // DP tables

type Highlight = { indices: number[]; role: HighlightRole };

type Frame<TState> = {
  state: TState;                    // snapshot of the data at this step
  highlights: Highlight[];          // what to emphasize and why (drives color)
  narration: string;                // one plain-language line
  pseudoLine?: number;              // index into entry.pseudocode to highlight
  meta?: Record<string, number>;    // counters: comparisons, swaps, queue size…
};

type Trace<TState> = {
  frames: Frame<TState>[];
  result: TState;                   // final state, for assertions/tests
};
```

`TState` is generic per data shape: `number[]` for sorting, a `Cell[][]` grid
for pathfinding, a node structure for trees, an adjacency form for graphs, a
2D table for DP. The **player is fully data-agnostic** — it only ever reads
`frames.length` and an index.

### Catalog entry

```ts
type RendererId = 'bars' | 'grid' | 'tree' | 'graph';
type Category =
  | 'sorting' | 'array-patterns' | 'pathfinding'
  | 'trees' | 'graphs' | 'dynamic-programming';

type AlgorithmEntry<TInput = unknown, TState = unknown> = {
  slug: string;                     // 'bubble-sort' → /algorithm/bubble-sort
  name: string;
  category: Category;
  complexity: { time: string; space: string };
  summary: string;                  // one-paragraph explainer
  run: (input: TInput) => Trace<TState>;   // the pure algorithm
  renderer: RendererId;
  defaultInput: () => TInput;       // seed data so the page loads populated
  pseudocode: string[];             // lines shown in the code panel
};
```

### Component boundaries

| Unit | Responsibility | Depends on |
|---|---|---|
| `algorithms/*` | Produce a `Trace` from input | nothing (pure TS) |
| `usePlayer(trace)` | Index, play/pause, speed, step, scrub | nothing (headless) |
| `renderers/*` | Draw one `Frame` | its `TState` shape only |
| `catalog.ts` | Registry of all `AlgorithmEntry`s | algorithms + renderer ids |
| `VisualizerPage` | Wire entry → player → renderer → controls | all of the above |

## UI shell, interaction & aesthetic

**Visualizer page layout** (dark cinematic; near-black stage, one glowing accent
hue whose variants encode highlight roles; dense composed layout, not airy):

```
┌────────────────────────────────────────────────────────────┐
│  DSA·VIS   Sorting  Array  Pathfinding  Trees  Graphs  DP    │  ← category nav
├──────────────────────────────────┬─────────────────────────┤
│                                  │  Bubble Sort             │
│        VISUALIZATION STAGE       │  O(n²) time · O(1) space │
│      (bars / grid / tree / graph)│  Pseudocode              │
│    ← highlights glow by role     │  ▸ if a[j] > a[j+1]  ←hl │
│                                  │  Summary paragraph…      │
├──────────────────────────────────┴─────────────────────────┤
│  ⏮ ◀ ▶/⏸ ▶ ⏭   ──●────────  speed ▁▂▃   frame 12 / 88       │  ← player bar
│  "Comparing 5 and 3 → swap"      comparisons: 14  swaps: 6   │  ← narration+counters
└────────────────────────────────────────────────────────────┘
```

**Interactions:**
- **Player bar:** step-back, play/pause, step-forward, jump to start/end, a
  draggable **scrubber** to any frame, and speed control. All driven by
  `usePlayer`.
- **Input controls** (per renderer): sorting → randomize / size slider;
  pathfinding → draw walls, set start/end; trees → insert/remove values; graphs
  → pick a preset/edit; DP → edit the input string/weights. Changing input
  re-runs the pure algorithm → new trace → player resets to frame 0.
- **Narration + live counters** update per frame; **pseudocode line highlights**
  in sync via `frame.pseudoLine`.

**Catalog home page:** dense grid of algorithm cards grouped by category, each
card showing name + complexity + a tiny static preview. This is where "all
patterns visualized" becomes browsable; the catalog grows and the home grows
with it.

**Aesthetic specifics:** near-black stage (~`#0a0a0b`), monospace for
pseudocode/counters, one accent hue whose brightness variants encode highlight
roles (`compare` dim, `swap` bright, `sorted` settled green, `path` full glow,
`visited`/`frontier` distinct cool tones). Motion is smooth but purposeful
(transforms/opacity, no layout thrash), respecting `prefers-reduced-motion`.
Consistent with the dark cinematic direction of the other portfolio sites.

## Full catalog scope (this build)

The **entire catalog** ships in this build, sequenced renderer-by-renderer. Each
category is fully built, tested, lint+build green, and visually verified before
the next begins — so there is always a working, growing site at every milestone.

**BarsRenderer**
- Sorting: bubble, insertion, selection, merge, quick, heap
- Array patterns: two pointers, sliding window, binary search, prefix sums,
  fast/slow pointers, merge intervals

**GridRenderer**
- Pathfinding: BFS, DFS, Dijkstra, A* (walls + weights, drawable)

**TreeRenderer**
- BST insert / delete, traversals (in/pre/post-order), trie insert/search,
  binary heap (sift-up / sift-down)

**GraphRenderer**
- Graph BFS/DFS, topological sort, union-find (with path compression)

**DP** (BarsRenderer table variant)
- 1D: Fibonacci/climbing-stairs, coin change
- 2D: 0/1 knapsack, longest common subsequence, edit distance

(Exact final list may shift slightly during planning, but the target is
comprehensive coverage across all five renderer families. Backtracking and bit
manipulation are candidates to fold into array-patterns/graphs if they fit an
existing renderer cleanly; otherwise deferred to a follow-up cycle rather than
inventing a fifth renderer here.)

## Build sequencing (single cycle, milestone-gated)

Order, each milestone fully done + tested + lint/build green + visually verified
before advancing:

1. **Scaffold + engine.** `dsa-visualizer/` (Next 16, React 19, Tailwind 4,
   `tsx` tests, `motion` for animation — matching the other sites). `Trace`/
   `Frame` types, `usePlayer`, `catalog.ts`, app shell (nav, home, visualizer
   page), player bar with scrubber/speed, narration, counters, pseudocode panel.
2. **BarsRenderer + Sorting + Array patterns** — complete and tested.
3. **GridRenderer + Pathfinding** — complete and tested.
4. **TreeRenderer + Trees** — complete and tested.
5. **GraphRenderer + Graphs** — complete and tested.
6. **DP category** (bars/table variant) — complete and tested.

The engine is stress-tested against every data shape by the end. Because
milestone 1 delivers the full shell and one working renderer's worth of
algorithms, the site is shippable and demoable from milestone 2 onward.

## Testing strategy

The Trace model keeps the heavy logic in pure functions, so tests are clean.
Follows repo convention: `tsx --test test/*.test.ts`, plus `lint` and `build`.

- **Algorithm correctness:** `run(input).result` equals a known expected output
  (sorted array, correct shortest-path length, correct DP value, etc.).
- **Trace invariants:** e.g. a `swap` frame only reorders two elements; frame
  count is bounded; the final frame is fully `sorted`/`path`-complete; every
  `pseudoLine` is a valid index into `pseudocode`.
- **Player logic:** `usePlayer` unit-tested — stepping past the end clamps,
  rewind returns to frame 0, scrub sets index, speed changes interval, play then
  pause stops advancing.
- **Renderers/shell:** light smoke tests; the substantive logic lives in pure
  functions that are trivially tested.

## Out of scope (YAGNI)

- Accounts, saving, sharing, any backend — fully static / client-side.
- Live multi-language code display beyond the pseudocode panel; no code editor.
- Mobile-perfect layout — responsive-reasonable, but desktop is the target for a
  dense tool.
- A fifth renderer for exotic structures; anything that doesn't fit the four
  renderers is deferred to a follow-up cycle rather than expanding this one.

## The scaling promise

After this cycle, adding a variant (e.g. a quicksort pivot strategy) or a new
algorithm against an existing renderer is a bounded, repeatable task against a
proven engine — which is what makes "all patterns, all algorithms" sustainable
over time instead of collapsing under its own weight.
