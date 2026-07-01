# WebGL Hero Mesh Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the 2D SVG `ClusterOrbit` background in the homepage `PlatformHero` with a live, interactive 3D service mesh rendered in WebGL via React Three Fiber, mirroring the real CloudOps service topology.

**Architecture:** A pure layout module computes deterministic 3D positions from the existing `SERVICES`/`EDGES` data. A lazy-loaded (`ssr:false`) `HeroMesh` client component mounts an R3F `<Canvas>` containing a `MeshScene` that renders `Node` and `Edge` components with time-driven animation (pulse, packets, auto-rotate) and drag-to-orbit. The render loop pauses when the hero scrolls off-screen. It is layered as an absolute background behind the existing centered headline in `PlatformHero`.

**Tech Stack:** Next 16, React 19, TypeScript, `three`, `@react-three/fiber` v9, `@react-three/drei` v10 (React-19 compatible). Tests: `node:test` + `node:assert/strict` via `tsx --test`.

## Global Constraints

- All commands run from `cloudops-portfolio/` (the site is a monorepo subfolder). Absolute repo root: `G:/Desk/Code/Websites`; site: `G:/Desk/Code/Websites/cloudops-portfolio`.
- `npx next build` MUST stay green (PLAN.md guardrail).
- `npm run lint` (covers `src test scripts`) MUST stay clean.
- Do NOT reintroduce real backend calls — hero mesh uses static topology shape only, no polling, no fetch.
- Do NOT regress existing marketing animations (`HeroLogStream`, headline). Buttons/links in `PlatformHero` must stay clickable (canvas sits behind, `-z-10`).
- Reuse real data: import `SERVICES` and the directed edge list from `src/lib/mock/data.ts`. Do NOT invent an abstract mesh.
- No degraded/mobile/reduced-motion variants (explicitly declined). Full 3D everywhere. The only "pause" is the off-screen render-loop pause (identical visual when viewed).
- Palette (from `src/styles/tokens.css`): bg `#0d1117`; brand `#5eead4` / `#2dd4bf` / `#14b8a6`; edges `#30363d`; labels `#cdd9e5`.
- React 19 requires `@react-three/fiber@^9` and `@react-three/drei@^10` (fiber v8 / drei v9 are React 18 only). Pin these majors. If npm reports a peer conflict, install with the latest matching majors and record the resolved versions in the commit.
- Tests import from source with `.ts`-less relative paths (e.g. `../src/lib/mesh-layout`), matching existing tests.

---

### Task 1: Export the directed edge list from the mock data module

`EDGES` in `src/lib/mock/data.ts` is currently a private `const`. The layout module and scene need it. Export it (and confirm `SERVICES` is already exported — it is). This is the smallest reviewable unit: a pure data-surface change with no behavior change.

**Files:**
- Modify: `src/lib/mock/data.ts` (the `const EDGES` declaration, ~line 40)

**Interfaces:**
- Consumes: nothing.
- Produces: `export const EDGES: Array<[ServiceName, ServiceName]>` and existing `export const SERVICES` / `export type ServiceName` from `src/lib/mock/data.ts`.

- [ ] **Step 1: Make EDGES exported**

Change the declaration from:

```ts
const EDGES: Array<[ServiceName, ServiceName]> = [
```

to:

```ts
export const EDGES: Array<[ServiceName, ServiceName]> = [
```

Leave the array contents and all other usages unchanged.

- [ ] **Step 2: Verify the build still compiles**

Run: `npx tsc --noEmit`
Expected: no errors (an exported const is still usable internally).

- [ ] **Step 3: Commit**

```bash
git add src/lib/mock/data.ts
git commit -m "refactor: export EDGES from mock data for reuse in hero mesh"
```

---

### Task 2: Pure 3D layout module (`mesh-layout.ts`)

A deterministic pure function mapping the service graph to 3D coordinates. Layered by BFS depth from `api-gateway` on the X axis; nodes at the same depth spread on Y (and a little Z) so the graph reads as a 3D fan-out. No physics, fully deterministic, unit-testable without WebGL.

**Files:**
- Create: `src/lib/mesh-layout.ts`
- Test: `test/mesh-layout.test.ts`

**Interfaces:**
- Consumes: `SERVICES`, `EDGES`, `ServiceName` from `src/lib/mock/data.ts` (Task 1).
- Produces:
  - `export type Vec3 = [number, number, number]`
  - `export function meshLayout(): Map<ServiceName, Vec3>` — deterministic; every service present; no two services share identical coordinates.
  - `export const ROOT = "api-gateway"` (the BFS root).

- [ ] **Step 1: Write the failing test**

Create `test/mesh-layout.test.ts`:

```ts
import test from "node:test";
import assert from "node:assert/strict";
import { meshLayout } from "../src/lib/mesh-layout";
import { SERVICES } from "../src/lib/mock/data";

test("meshLayout returns a position for every service", () => {
  const layout = meshLayout();
  for (const svc of SERVICES) {
    assert.ok(layout.has(svc), `missing position for ${svc}`);
  }
  assert.equal(layout.size, SERVICES.length);
});

test("meshLayout is deterministic", () => {
  const a = meshLayout();
  const b = meshLayout();
  for (const svc of SERVICES) {
    assert.deepEqual(a.get(svc), b.get(svc));
  }
});

test("meshLayout gives every node a distinct position", () => {
  const layout = meshLayout();
  const seen = new Set<string>();
  for (const pos of layout.values()) {
    const key = pos.map((n) => n.toFixed(4)).join(",");
    assert.ok(!seen.has(key), `duplicate position ${key}`);
    seen.add(key);
  }
});

test("api-gateway sits at the shallowest X (root of fan-out)", () => {
  const layout = meshLayout();
  const rootX = layout.get("api-gateway")![0];
  for (const svc of SERVICES) {
    if (svc === "api-gateway") continue;
    assert.ok(layout.get(svc)![0] >= rootX, `${svc} should be at or right of root`);
  }
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx tsx --test test/mesh-layout.test.ts`
Expected: FAIL — cannot find module `../src/lib/mesh-layout`.

- [ ] **Step 3: Write minimal implementation**

Create `src/lib/mesh-layout.ts`:

```ts
// Deterministic 3D layout for the hero service mesh. Layered by BFS depth from
// api-gateway (X axis = call-flow direction), siblings spread on Y with a small
// deterministic Z offset so the graph reads as a 3D fan-out. Pure + testable;
// no WebGL, no randomness, no time dependency.
import { SERVICES, EDGES, type ServiceName } from "@/lib/mock/data";

export type Vec3 = [number, number, number];
export const ROOT: ServiceName = "api-gateway";

const X_GAP = 3.2; // spacing between depth columns
const Y_GAP = 2.2; // spacing between siblings in a column
const Z_SPREAD = 1.4; // deterministic depth jitter so it isn't planar

function computeDepths(): Map<ServiceName, number> {
  const adj = new Map<ServiceName, ServiceName[]>();
  for (const [s, t] of EDGES) {
    if (!adj.has(s)) adj.set(s, []);
    adj.get(s)!.push(t);
  }
  const depth = new Map<ServiceName, number>();
  const queue: Array<[ServiceName, number]> = [[ROOT, 0]];
  depth.set(ROOT, 0);
  while (queue.length) {
    const [n, d] = queue.shift()!;
    for (const next of adj.get(n) ?? []) {
      if (!depth.has(next)) {
        depth.set(next, d + 1);
        queue.push([next, d + 1]);
      }
    }
  }
  // Any service unreachable from root goes one column past the deepest.
  let max = 0;
  for (const d of depth.values()) max = Math.max(max, d);
  for (const svc of SERVICES) if (!depth.has(svc)) depth.set(svc, max + 1);
  return depth;
}

export function meshLayout(): Map<ServiceName, Vec3> {
  const depth = computeDepths();

  // Group services by depth to center each column vertically.
  const columns = new Map<number, ServiceName[]>();
  for (const svc of SERVICES) {
    const d = depth.get(svc)!;
    if (!columns.has(d)) columns.set(d, []);
    columns.get(d)!.push(svc);
  }

  const positions = new Map<ServiceName, Vec3>();
  const maxDepth = Math.max(...depth.values());
  const xCenter = (maxDepth * X_GAP) / 2;

  for (const [d, svcs] of columns) {
    const yCenter = ((svcs.length - 1) * Y_GAP) / 2;
    svcs.forEach((svc, i) => {
      const x = d * X_GAP - xCenter;
      const y = i * Y_GAP - yCenter;
      // Deterministic Z from a stable hash of depth+index so columns aren't flat.
      const z = ((d * 7 + i * 13) % 5) / 4 * Z_SPREAD - Z_SPREAD / 2;
      positions.set(svc, [x, y, z]);
    });
  }
  return positions;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx tsx --test test/mesh-layout.test.ts`
Expected: PASS (4 tests).

- [ ] **Step 5: Lint**

Run: `npm run lint`
Expected: clean.

- [ ] **Step 6: Commit**

```bash
git add src/lib/mesh-layout.ts test/mesh-layout.test.ts
git commit -m "feat: deterministic 3D layout module for hero service mesh"
```

---

### Task 3: Install React Three Fiber dependencies

Add the WebGL stack. Isolated task because a reviewer might approve/reject the dependency choice independently, and it must land before any component that imports it.

**Files:**
- Modify: `package.json`, `package-lock.json` (via npm)

**Interfaces:**
- Produces: `three`, `@react-three/fiber`, `@react-three/drei` importable; `@types/three` for TS.

- [ ] **Step 1: Install runtime deps**

Run: `npm install three@^0.171.0 @react-three/fiber@^9.0.0 @react-three/drei@^10.0.0`
Expected: installs without peer-dependency errors against React 19. If a peer conflict is reported, retry with `@react-three/fiber@latest @react-three/drei@latest` and record the resolved versions.

- [ ] **Step 2: Install types (dev)**

Run: `npm install -D @types/three@^0.171.0`
Expected: installs clean.

- [ ] **Step 3: Verify build still green (no usage yet)**

Run: `npx next build`
Expected: SUCCESS — deps present but unused yet, so no behavior change.

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add three / react-three-fiber / drei for hero mesh"
```

---

### Task 4: `Edge` component — link line + flowing packet

A single directed link: a line between two 3D points plus an emissive packet that loops source→target, representing request flow. Highlight color when active.

**Files:**
- Create: `src/components/site/mesh/Edge.tsx`

**Interfaces:**
- Consumes: `Vec3` from `src/lib/mesh-layout`.
- Produces: `export function Edge(props: { from: Vec3; to: Vec3; active: boolean; seed: number }): JSX.Element`.

- [ ] **Step 1: Implement the component**

Create `src/components/site/mesh/Edge.tsx`:

```tsx
"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Vector3, type Mesh } from "three";
import type { Vec3 } from "@/lib/mesh-layout";

const BASE = "#30363d";
const ACTIVE = "#2dd4bf";
const PACKET = "#5eead4";

export function Edge({ from, to, active, seed }: { from: Vec3; to: Vec3; active: boolean; seed: number }) {
  const packet = useRef<Mesh>(null);
  const a = new Vector3(...from);
  const b = new Vector3(...to);

  useFrame((state) => {
    if (!packet.current) return;
    // t in [0,1) loops; seed offsets each edge so packets don't move in lockstep.
    const t = (state.clock.elapsedTime * 0.35 + seed * 0.17) % 1;
    packet.current.position.lerpVectors(a, b, t);
  });

  return (
    <group>
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[new Float32Array([...from, ...to]), 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial color={active ? ACTIVE : BASE} transparent opacity={active ? 0.9 : 0.4} />
      </line>
      <mesh ref={packet}>
        <sphereGeometry args={[0.09, 12, 12]} />
        <meshBasicMaterial color={PACKET} toneMapped={false} />
      </mesh>
    </group>
  );
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/site/mesh/Edge.tsx
git commit -m "feat: Edge component with flowing packet for hero mesh"
```

---

### Task 5: `Node` component — pulsing service sphere + label

One service node: an emissive brand-teal sphere that pulses subtly (out-of-phase per node), with a floating label. Brighter/larger on hover.

**Files:**
- Create: `src/components/site/mesh/Node.tsx`

**Interfaces:**
- Consumes: `Vec3` from `src/lib/mesh-layout`; drei `Text`.
- Produces: `export function Node(props: { position: Vec3; label: string; seed: number; hovered: boolean; onHover: (h: boolean) => void }): JSX.Element`.

- [ ] **Step 1: Implement the component**

Create `src/components/site/mesh/Node.tsx`:

```tsx
"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import type { Mesh } from "three";
import type { Vec3 } from "@/lib/mesh-layout";

const BRAND = "#2dd4bf";
const BRAND_HOT = "#5eead4";
const LABEL = "#cdd9e5";

export function Node({
  position,
  label,
  seed,
  hovered,
  onHover,
}: {
  position: Vec3;
  label: string;
  seed: number;
  hovered: boolean;
  onHover: (h: boolean) => void;
}) {
  const mesh = useRef<Mesh>(null);

  useFrame((state) => {
    if (!mesh.current) return;
    // Subtle out-of-phase pulse; never strobes.
    const pulse = 1 + Math.sin(state.clock.elapsedTime * 1.2 + seed) * 0.06;
    const scale = (hovered ? 1.5 : 1) * pulse;
    mesh.current.scale.setScalar(scale);
  });

  return (
    <group position={position}>
      <mesh
        ref={mesh}
        onPointerOver={(e) => {
          e.stopPropagation();
          onHover(true);
        }}
        onPointerOut={() => onHover(false)}
      >
        <sphereGeometry args={[0.32, 24, 24]} />
        <meshStandardMaterial
          color={hovered ? BRAND_HOT : BRAND}
          emissive={hovered ? BRAND_HOT : BRAND}
          emissiveIntensity={hovered ? 1.4 : 0.6}
          toneMapped={false}
        />
      </mesh>
      <Text
        position={[0, 0.6, 0]}
        fontSize={0.34}
        color={LABEL}
        anchorX="center"
        anchorY="bottom"
        outlineWidth={0.01}
        outlineColor="#0d1117"
      >
        {label}
      </Text>
    </group>
  );
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/site/mesh/Node.tsx
git commit -m "feat: Node component with pulse + label for hero mesh"
```

---

### Task 6: `MeshScene` — compose nodes, edges, rotation, orbit, hover

The scene inside the Canvas: builds positions from `meshLayout()`, renders a `Node` per service and an `Edge` per link, tracks hover state (highlighting incident edges), slowly auto-rotates the group, and enables damped drag-to-orbit.

**Files:**
- Create: `src/components/site/mesh/MeshScene.tsx`

**Interfaces:**
- Consumes: `meshLayout`, `Vec3` (`src/lib/mesh-layout`); `SERVICES`, `EDGES` (`src/lib/mock/data`); `Node` (Task 5); `Edge` (Task 4); drei `OrbitControls`.
- Produces: `export function MeshScene(): JSX.Element`.

- [ ] **Step 1: Implement the component**

Create `src/components/site/mesh/MeshScene.tsx`:

```tsx
"use client";

import { useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import type { Group } from "three";
import { meshLayout } from "@/lib/mesh-layout";
import { SERVICES, EDGES, type ServiceName } from "@/lib/mock/data";
import { Node } from "./Node";
import { Edge } from "./Edge";

export function MeshScene() {
  const group = useRef<Group>(null);
  const [hovered, setHovered] = useState<ServiceName | null>(null);
  const positions = useMemo(() => meshLayout(), []);

  useFrame((_, delta) => {
    if (group.current) group.current.rotation.y += delta * 0.08;
  });

  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[6, 6, 8]} intensity={1.2} color="#5eead4" />
      <group ref={group}>
        {EDGES.map(([s, t], i) => (
          <Edge
            key={`${s}->${t}`}
            from={positions.get(s)!}
            to={positions.get(t)!}
            active={hovered === s || hovered === t}
            seed={i}
          />
        ))}
        {SERVICES.map((svc, i) => (
          <Node
            key={svc}
            position={positions.get(svc)!}
            label={svc}
            seed={i * 1.7}
            hovered={hovered === svc}
            onHover={(h) => setHovered(h ? svc : null)}
          />
        ))}
      </group>
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        enableDamping
        dampingFactor={0.08}
        rotateSpeed={0.5}
      />
    </>
  );
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/site/mesh/MeshScene.tsx
git commit -m "feat: MeshScene composing hero mesh nodes/edges with orbit + rotate"
```

---

### Task 7: `HeroMesh` — Canvas host + off-screen render pause + error boundary

The public entry. Hosts the R3F `<Canvas>`, positions the camera, wraps `MeshScene` in a WebGL error boundary, and pauses the render loop (`frameloop`) when scrolled out of view via IntersectionObserver.

**Files:**
- Create: `src/components/site/mesh/HeroMesh.tsx`

**Interfaces:**
- Consumes: `MeshScene` (Task 6); `@react-three/fiber` `Canvas`.
- Produces: `export function HeroMesh(): JSX.Element` (default-styled absolute-fill background).

- [ ] **Step 1: Implement the component**

Create `src/components/site/mesh/HeroMesh.tsx`:

```tsx
"use client";

import { Component, useEffect, useRef, useState, type ReactNode } from "react";
import { Canvas } from "@react-three/fiber";
import { MeshScene } from "./MeshScene";

// Only triggers on genuine WebGL failure (context lost / unsupported). Not a
// "degraded mode" — on success the full mesh always renders. On failure we fall
// back to nothing (the hero's existing line-grid remains visible underneath).
class WebGLBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export function HeroMesh() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.01 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="absolute inset-0 -z-10"
    >
      <WebGLBoundary>
        <Canvas
          camera={{ position: [0, 0, 12], fov: 50 }}
          frameloop={visible ? "always" : "never"}
          gl={{ antialias: true, alpha: true }}
          style={{ background: "transparent" }}
        >
          <MeshScene />
        </Canvas>
      </WebGLBoundary>
    </div>
  );
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/site/mesh/HeroMesh.tsx
git commit -m "feat: HeroMesh Canvas host with off-screen pause + WebGL error boundary"
```

---

### Task 8: Wire HeroMesh into PlatformHero (lazy, ssr:false) replacing ClusterOrbit

Swap the 2D `ClusterOrbit` background for the lazily-loaded `HeroMesh` in `PlatformHero`. Dynamic import with `ssr:false` keeps WebGL off the server and isolates the bundle to the homepage. `HeroLogStream`, headline, buttons unchanged.

**Files:**
- Modify: `src/components/site/PlatformHero.tsx`

**Interfaces:**
- Consumes: `HeroMesh` (Task 7) via `next/dynamic`.
- Produces: updated homepage hero (visual change).

- [ ] **Step 1: Replace the ClusterOrbit import + usage**

In `src/components/site/PlatformHero.tsx`:

Remove the static import line:
```tsx
import { ClusterOrbit } from "./ClusterOrbit";
```

Add a dynamic import near the top (after the remaining imports):
```tsx
import dynamic from "next/dynamic";

const HeroMesh = dynamic(
  () => import("./mesh/HeroMesh").then((m) => m.HeroMesh),
  { ssr: false },
);
```

Replace the usage line:
```tsx
      <ClusterOrbit />
```
with:
```tsx
      <HeroMesh />
```

Leave `<HeroLogStream />`, the `line-grid` div, headline, and buttons exactly as they are.

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Lint**

Run: `npm run lint`
Expected: clean. (`ClusterOrbit.tsx` remains in the repo, now unimported — that is intended per spec and is not a lint error.)

- [ ] **Step 4: Production build gate**

Run: `npx next build`
Expected: SUCCESS. All routes compile; homepage builds with the client-only dynamic chunk.

- [ ] **Step 5: Commit**

```bash
git add src/components/site/PlatformHero.tsx
git commit -m "feat: use 3D WebGL HeroMesh as homepage hero background"
```

---

### Task 9: Manual visual verification + CSP check

The WebGL output itself is verified by eye, not unit tests. Confirm the mesh renders and interacts, and that no CSP violation appears.

**Files:** none (verification only).

- [ ] **Step 1: Start the dev server**

Run: `npm run dev`
Open: `http://localhost:3000`

- [ ] **Step 2: Verify against this checklist**

- [ ] Homepage hero shows a 3D mesh of 7 labeled nodes (api-gateway, pricing, inventory, fraud, payment, ledger, projection-worker).
- [ ] The graph slowly auto-rotates.
- [ ] Dragging on the hero orbits the camera (damped, snaps back to rotating).
- [ ] Hovering a node enlarges/brightens it and highlights its edges.
- [ ] Emissive packets travel along edges (request flow).
- [ ] The "CloudOps Platform" headline and both buttons are fully visible and clickable on top of the canvas.
- [ ] `HeroLogStream` still runs.
- [ ] Browser devtools Console shows NO CSP violation and NO WebGL error.
- [ ] Scroll down past the hero, then back — no crash; mesh still animates (render resumes).

- [ ] **Step 3: If all pass, record verification**

No commit needed (no file change). If any check fails, treat it as a bug: use systematic-debugging before patching, then re-run the failing check.

---

## Notes for the implementer

- If `tsc --noEmit` isn't wired as a script, run it directly as shown; it uses the repo `tsconfig.json`.
- `line`/`bufferGeometry`/`meshStandardMaterial` etc. are R3F intrinsic elements provided by `@react-three/fiber` — no import needed for the JSX tags themselves; only `three` classes used in code (`Vector3`, `Mesh`, `Group`, `Float32Array`) are imported.
- The `@/` alias maps to `src/` (see `tsconfig.json` paths) — used consistently above.
- Do NOT delete `ClusterOrbit.tsx`; it is intentionally retained, just unimported.
