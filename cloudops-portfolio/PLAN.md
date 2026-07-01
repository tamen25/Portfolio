# CloudOps Portfolio — Development Plan

> **Read this first.** This document is the handoff for continuing development on
> the standalone portfolio copy of the CloudOps storefront. It explains what this
> project is, what was already done to make it run without a backend, what is
> still backend-coupled, and a prioritized roadmap. Open it in Claude and pick up
> from the roadmap.

---

## 1. What this project is

The CloudOps monorepo contains a Next.js 15 storefront (`apps/storefront`) that
demos a fully-instrumented, multi-tenant e-commerce platform on Kubernetes. It
has two natures:

1. **Marketing / architecture pages** — Home, Platform, Architecture, Diagrams,
   Pipeline. Heavily animated, visually rich. These are the "it looks amazing"
   part. Almost entirely static/client-side.
2. **Operator console** — `/console` (service map), `/services`, `/traces`,
   `/load`. In the real app these poll same-origin BFF routes (`/api/observe/*`,
   `/api/load/*`) that query in-cluster **Tempo / Mimir / Loki** and a **loadgen**
   service, behind **Cognito** auth.

This repo is a **faithful copy** of that storefront, converted to run **fully
standalone on mock data** so it can be deployed to Vercel/Netlify as a portfolio
piece. The original remains untouched and part of the CloudOps project.

**Branding note:** All "CloudOps" naming/copy/metadata was kept as-is. If you
want to rebrand or templatize, see roadmap item R7.

---

## 2. What was already done (this first pass)

Goal of the first pass: **copy everything needed, add minimal stubs so it builds
and runs looking live, and write this plan.** Done:

### Copied faithfully (identical to source)
- `src/` — all pages, components, libs, styles (except the files listed below)
- `public/diagrams/*` — the 11 architecture diagram PNGs
- `scripts/`, `test/`
- Root config: `next.config.ts`, `tsconfig.json`, `tailwind.config.ts`,
  `postcss.config.mjs`, `eslint.config.mjs`, `next-env.d.ts`, lockfile

### Deliberately NOT copied (deploy-only / not needed to run)
- `node_modules/`, `.next/`, `*.tsbuildinfo` — build artifacts
- `Dockerfile`, `k8s/` — Kubernetes/EKS deploy manifests (irrelevant on Vercel)
- `design/` — a large scratch folder of design-exploration `.jsx`/`.html`/PNG
  files and chat logs (~80 files, not imported by the app). Left behind to keep
  the repo lean. **If you want the internal `/design` preview page to have its
  source references, they are NOT here — but `/design` is flag-gated and off by
  default, so this does not affect the running site.**

### New / modified files (the "minimal stubs")
| File | Change |
|------|--------|
| `src/lib/mock/data.ts` | **NEW.** The entire mock data layer. Synthesises topology, per-service metrics, recent traces, single-trace OTLP for the waterfall, and load-run status. Slowly varies over time so the console looks live. |
| `src/app/api/observe/topology/route.ts` | Rewritten → returns `mockTopology()`. Auth + Mimir removed. |
| `src/app/api/observe/metrics/route.ts` | Rewritten → returns `mockServiceMetrics()`. |
| `src/app/api/observe/traces/route.ts` | Rewritten → returns `mockRecentTraces()` / `mockTraceOtlp()`. |
| `src/app/api/load/status/route.ts` | Rewritten → returns `mockLoadStatus()`. |
| `src/app/api/load/run/route.ts` | Rewritten → `mockLoadStart()`. Admin gate + loadgen removed. |
| `src/app/api/load/stop/route.ts` | Rewritten → `mockLoadStop()`. |
| `src/middleware.ts` | Rewritten → **auth gate removed**; all routes public. Light API rate-limit kept. |
| `package.json` | Renamed to `cloudops-portfolio`; description updated. Dependencies UNCHANGED (see R1). |
| `.env.example` | **NEW.** Documents that no env is required; lists the original vars as optional. |
| `README.md` | **NEW.** Quick start + orientation. |
| `PLAN.md` | **NEW.** This file. |

### Verified
- `npm install` — clean (500 packages).
- `npx next build` — **succeeds.** All 30 routes compile. Console pages
  (`/console`, `/services`, `/traces`, `/load`) now build as public pages.

---

## 3. Current state: what works vs. what's dormant

### ✅ Fully working on mock data
- All marketing/architecture pages (were always static).
- `/console` — service map animates; edges/nodes driven by `mockTopology()`.
- `/services` — rps/error grid driven by `mockServiceMetrics()`.
- `/traces` — table streams from `mockRecentTraces()`; clicking a row renders a
  real span waterfall from `mockTraceOtlp()`.
- `/load` — Start/Stop works; counters climb via in-memory `mockLoadStatus()`.

### ⚠️ Dormant but still compiled (not reachable from nav, not yet cleaned up)
These routes/pages were copied verbatim and still import backend/AWS code. They
compile fine but would error at runtime **if hit directly**. Nothing in the
portfolio nav links to them, so they don't affect the demo. Cleanup = roadmap.
- `src/app/api/cart/*`, `src/app/api/checkout/route.ts` — import `@/lib/cart`,
  `@/lib/api` (order-api), AWS SDK (DynamoDB).
- `src/app/api/privacy/*`, `src/app/api/ws-token/route.ts` — backend-coupled.
- `src/app/api/load/chaos/route.ts` — loadgen chaos endpoint (not wired to a page).
- `src/app/api/health`, `src/app/api/ready` — harmless health probes.
- `src/app/login/*`, `src/app/auth/callback/route.ts` — Cognito OIDC flow. The
  `/login` page renders a friendly "not wired here" state (good enough), but
  the `Sign in` button in the navbar still points at it.
- `src/lib/{auth,bff-auth,cart,api,loadgen-client,realtime,rate-limit}.ts` —
  still present; most now only referenced by the dormant routes above
  (`rate-limit` is still used by middleware).

### AWS SDK still in `package.json`
`@aws-sdk/client-dynamodb`, `@aws-sdk/client-sfn`, `@aws-sdk/lib-dynamodb` are
still dependencies (only the dormant cart/checkout routes use them). They bloat
`node_modules` but don't break anything. Removal = R1.

---

## 4. The mock data layer (`src/lib/mock/data.ts`)

Single source of truth for all synthetic data. Key exports:

| Export | Feeds | Shape |
|--------|-------|-------|
| `mockTopology()` | `/api/observe/topology` | `{ nodes, edges }` (matches `Topology`) |
| `mockServiceMetrics()` | `/api/observe/metrics` | `ServiceMetric[]` |
| `mockRecentTraces(limit)` | `/api/observe/traces` | `TraceSummary[]` |
| `mockTraceOtlp(id)` | `/api/observe/traces?id=` | OTLP `{ resourceSpans }` |
| `mockLoadStart/Stop/Status()` | `/api/load/*` | in-memory run state |

Design notes:
- Values drift via a `wave(seed)` helper (sum of two out-of-phase sines seeded by
  the wall clock) so successive 2–5s polls differ slightly — feels live, never
  jumps. No server-side store needed.
- The service mesh (`SERVICES`, `EDGES`) mirrors the real CloudOps mesh
  (api-gateway → pricing/inventory/fraud/payment → ledger → projection-worker)
  so the topology, `/services` metadata map, and trace tree all read as genuine.
- Occasional synthetic errors (fraud/payment blips) keep the map alive.

**When adding features, extend this file — don't scatter mock logic into pages.**

---

## 5. Roadmap (prioritized)

Suggested order. Each is independent enough to tackle in isolation.

### R1 — Dependency + dead-route cleanup (low risk, high tidiness)
- Delete dormant routes that can't work without a backend and aren't linked:
  `api/cart`, `api/cart/[itemId]`, `api/checkout`, `api/privacy/*`,
  `api/ws-token`, `api/load/chaos`. (Keep `api/health`, `api/ready`.)
- Delete now-unused libs: `lib/cart.ts`, `lib/api.ts`, `lib/loadgen-client.ts`,
  `lib/realtime.ts`, and the auth libs IF nothing else references them (check
  `middleware.ts` still needs `rate-limit.ts`).
- Remove the three `@aws-sdk/*` deps and `jose` (JWT) from `package.json`.
- Remove `scripts/render-k8s.ts` and `scripts/contract-check.ts` (monorepo-only)
  and the `contract-check` npm script.
- Re-run `npm install && npx next build` to confirm still green.

### R2 — Neutralize the "Sign in" / login dead-ends
- Navbar `Sign in` button → either remove it, or point it somewhere real
  (e.g. a GitHub/portfolio link), or keep `/login` but reword it from an ops
  message into a portfolio-appropriate note.
- Decide what `/login`, `/privacy`, `/cookies` should say for a portfolio.

### R3 — Make the console demonstrably interactive
- `/load` scenarios (browse/place-order/burst/mixed/chaos) currently all behave
  the same. Have the scenario influence `mockLoadStatus()` (e.g. `burst` = higher
  rps, `chaos` = higher error rate) AND have an active run visibly raise the
  numbers on `/console` + `/services` (share run state through the mock module).
- Consider a subtle "DEMO" badge so viewers know it's synthetic (honesty +
  it's a nice detail).

### R4 — Content pass for portfolio framing
- Add an "About / how this was built" section or page describing the real
  architecture, your role, the stack. This is what makes it a *portfolio* piece
  vs. a product clone.
- Verify all copy that references internal backlog IDs (`#101`, `#144`, etc.) in
  code comments/subtitles — most are in comments (fine) but check visible strings.

### R5 — Deploy config
- Add `vercel.json` / Netlify config if any redirects/headers are needed.
- `next.config.ts` currently sets `output: "standalone"` (for Docker). On Vercel
  this is ignored/fine; on Netlify use the Next runtime. Confirm the CSP headers
  in `next.config.ts` don't block anything once deployed (they're strict).
- Set `NEXT_PUBLIC_DESIGN_PREVIEW` decision (leave off).

### R6 — Polish / QA
- Cross-page nav audit: every link resolves, no route 404s or redirects to login.
- Responsive/mobile check on the animated pages.
- Lighthouse / perf pass.

### R7 — (Optional) Rebrand / templatize
- If you want it to read as a generic template rather than "CloudOps": replace
  the brand string, swap `app/layout.tsx` metadata, favicon, diagram labels.

---

## 6. Guardrails for continuing in Claude

- **This is a copy.** Nothing here needs to stay in sync with the source repo.
  Diverge freely.
- **Keep all mock logic in `src/lib/mock/data.ts`.**
- Don't reintroduce real backend calls — the deployment target has no backend.
- The marketing/architecture pages are the showpiece; don't regress their
  animations. If touching them, verify visually (`npm run dev`).
- After changes, `npx next build` must stay green.

---

## 7. Quick reference

```bash
npm install          # first time
npm run dev          # dev server, http://localhost:3000
npx next build       # must stay green
npm run lint         # eslint
```

Files you'll touch most: `src/lib/mock/data.ts` (data), `src/app/api/*` (routes),
`src/app/*/page.tsx` (pages), `src/components/site/*` (marketing),
`src/components/console/*` (console UI).
