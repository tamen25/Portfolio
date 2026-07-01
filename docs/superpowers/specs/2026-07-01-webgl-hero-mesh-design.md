# WebGL Hero — Interactive 3D Service Mesh

**Date:** 2026-07-01
**Project:** cloudops-portfolio
**Status:** Approved design → implementation planning

## Goal

Give the portfolio homepage a **wow-factor first impression** by replacing the
existing 2D SVG `ClusterOrbit` background in `PlatformHero` with a live,
interactive **3D service mesh** rendered in WebGL. The mesh mirrors the real
CloudOps service topology, so the visual centerpiece *is* the product — not
decorative filler.

## Decisions (locked)

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Goal | Wow-factor / first impression | User-selected |
| Hero style | Interactive 3D service mesh | On-theme; the site is about a mesh |
| Tech | **React Three Fiber + drei** | Matches declarative component style; fast to build; lazy-loaded |
| Degradation | **None** — full 3D everywhere | It's a portfolio piece; the WebGL is the point |
| Render pause when off-screen | **Yes** | Not degradation — identical visual when viewed; saves GPU when scrolled away |
| Data source | **Reuse real topology** (`SERVICES`/`EDGES` from `src/lib/mock/data.ts`) | Stays truthful to the console; not abstract filler |

## Placement (refined from initial proposal)

The landing surface is **`src/components/site/PlatformHero.tsx`** (full-height
`min-h-screen`, centered headline), NOT the second `Hero` section. It already
composes a 2D `ClusterOrbit` + `HeroLogStream` as its background. The new WebGL
mesh **replaces `ClusterOrbit`** as the background centerpiece, layered behind
the centered headline/buttons (which stay on top, unchanged).

- `ClusterOrbit.tsx` is left in the repo but no longer imported by `PlatformHero`
  (kept for reference / potential reuse; not deleted in this scope).
- `HeroLogStream` stays.

## Components

### `HeroMesh.tsx` (new, client component)
The public entry. Owns the R3F `<Canvas>`, camera, lighting, and the render-pause
behavior. Positioned absolutely as the hero background (`absolute inset-0 -z-10`),
`pointer-events` enabled only over the canvas so drag-to-orbit works without
blocking the buttons.

Responsibilities:
- Mount the `<Canvas>` with a dark transparent background over the hero's existing
  `line-grid`.
- Pause the render loop when the hero scrolls out of view (IntersectionObserver
  → `frameloop="never"` / resume `"always"`).
- Compose `<MeshScene />`.

### `MeshScene.tsx` (new)
The scene contents (inside Canvas). Responsibilities:
- Compute a stable 3D layout for nodes from `SERVICES` + `EDGES` (deterministic —
  see Layout below).
- Render `<Node>` for each service and `<Edge>` for each directed link.
- Slow auto-rotation of the whole graph group.
- Mouse parallax / drag-to-orbit via drei `<OrbitControls>` (damped, autoRotate,
  zoom/pan disabled — orbit only).
- Animate data "packets" traveling source→target along each edge.
- Hover state: hovering a node highlights it + its incident edges.

### `Node.tsx` (new)
A single service node: an emissive sphere in brand teal, gentle pulse (scale/
emissive intensity via `useFrame`), optional billboard label (drei `<Text>` /
`<Html>`) showing the service name. Brighter/scaled on hover.

### `Edge.tsx` (new)
A directed link between two nodes: a thin line/tube in a muted brand tone, plus a
small emissive "packet" sphere that animates from source→target on a loop,
representing request flow. Highlighted when either endpoint is hovered.

### `mesh-layout.ts` (new, pure module)
Pure function: `layout(services, edges) → Map<serviceName, [x,y,z]>`.
Deterministic layered layout (mirrors the left→right depth idea from the 2D
`ServiceMap`, lifted into 3D): BFS depth from `api-gateway` sets one axis; nodes
at the same depth spread on the other two axes. No physics sim — stable positions
keep the scene calm. Exported and unit-testable without WebGL.

## Data flow

```
src/lib/mock/data.ts          mesh-layout.ts              HeroMesh (Canvas)
  SERVICES (7) ───────┐
  EDGES (7 links) ────┼──►  layout() → positions ──►  MeshScene
                      │                                 ├─ Node × 7
  (topology is static shape;                            └─ Edge × 7 (+ packets)
   no polling needed for the hero —
   it's a visual, not the live console)
```

The hero mesh uses the **static topology shape** (`SERVICES`/`EDGES`), not live
polling. Animation (pulse, packets, rotation) is time-driven in `useFrame`, so it
looks alive without any network calls. This keeps the hero self-contained and
matches the "no backend" constraint.

## Visual spec

- Palette (from `src/styles/tokens.css`):
  - Background: `#0d1117` (bg-base) — canvas transparent over existing grid.
  - Nodes / packets (emissive): brand `#5eead4` / `#2dd4bf` / `#14b8a6`.
  - Edges: muted `#30363d` (border-default) base, brand tint on active/hover.
  - Labels: `#cdd9e5` (fg-base).
- Slow auto-rotation (~0.05–0.1 rad/s). Damped orbit on drag.
- Node pulse: subtle, out-of-phase per node (seeded) so it shimmers, never
  strobes.
- Packets: one per edge, looping source→target, easing so flow reads as requests.

## Dependencies

Add to `cloudops-portfolio/package.json`:
- `three`
- `@react-three/fiber`
- `@react-three/drei`
- `@types/three` (dev)

Bundle impact (~150KB gzipped) is isolated to the homepage via dynamic import
(`next/dynamic`, `ssr: false`) so other routes are unaffected.

## CSP / deploy compatibility

No `next.config.ts` changes needed. R3F/Three bundle as `'self'` scripts (allowed
by `script-src 'self'`). WebGL rendering needs no external origins. `img-src`
already allows `data: blob:` (covers any canvas texture). Fully Vercel-safe.

## SSR / hydration

`HeroMesh` is `"use client"` and imported via `next/dynamic({ ssr: false })` so
WebGL never runs on the server. A lightweight placeholder (the existing grid /
a static gradient) shows during the brief client mount so there's no layout
shift.

## Error handling

- **WebGL unavailable / context lost:** wrap `MeshScene` in an error boundary;
  on failure fall back to rendering the existing `line-grid` background alone
  (headline still perfect). This is a safety net, not a "degraded mode" — it only
  triggers on genuine WebGL failure, which is rare on target devices.
- No network calls → no fetch error paths.

## Testing

- **`mesh-layout.test.ts`** (tsx --test, fits existing `test/` setup): assert
  `layout()` returns a position for every service, positions are deterministic
  (same input → same output), and no two nodes share identical coordinates.
- **Build gate:** `npx next build` must stay green (per PLAN.md guardrail).
- **Lint:** `npm run lint` clean.
- **Visual/manual:** `npm run dev` — confirm mesh renders, rotates, orbits on
  drag, nodes hover-highlight, packets flow, headline/buttons remain clickable on
  top, no console CSP violations.
- Rendering itself (WebGL output) is verified visually, not unit-tested.

## Out of scope

- Live-polling the hero mesh from `/api/observe/topology` (the console already
  does live data; the hero is a static-shape visual).
- Rebuilding the console `ServiceMap` in 3D (separate future item).
- Deleting `ClusterOrbit.tsx` (kept for reference).
- Mobile/reduced-motion degraded variants (explicitly declined).

## Guardrails (from PLAN.md)

- `npx next build` stays green.
- Don't reintroduce real backend calls.
- Don't regress existing marketing-page animations (`HeroLogStream`, headline).
