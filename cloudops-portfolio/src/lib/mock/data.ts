/**
 * ─── PORTFOLIO MOCK DATA LAYER ───────────────────────────────────────────────
 *
 * This module exists ONLY in the standalone portfolio copy of the storefront.
 * The original app (apps/storefront in the CloudOps monorepo) talks to real
 * backends — Tempo / Mimir / Loki for observability, a loadgen service, and the
 * order-api catalog. None of those exist when the site is deployed to Vercel /
 * Netlify as a static portfolio piece.
 *
 * Instead of ripping out the console pages (which are the most impressive part
 * of the site), we keep every page component exactly as-is and swap what the
 * `/api/*` route handlers return. Those handlers now import from here and serve
 * realistic, slowly-varying synthetic data so the service map, traces, metrics,
 * and load counters all *look live* — nodes pulse, numbers drift, traces stream.
 *
 * Everything here is deterministic-ish noise seeded by the wall clock, so two
 * polls a few seconds apart differ just enough to feel real without ever
 * needing a server-side data store.
 *
 * Shapes MUST match the interfaces the pages consume:
 *   - Topology / TopologyEdge          (src/lib/observe.ts)
 *   - ServiceMetric                    (src/lib/observe.ts)
 *   - TraceSummary                     (src/lib/observe.ts)
 *   - Load Status                      (src/app/load/page.tsx)
 *   - OTLP single-trace JSON           (consumed by src/lib/trace-waterfall.ts)
 */

import type { Topology, ServiceMetric, TraceSummary } from "@/lib/observe";

// The mesh, exactly as it exists in the real deployment. Keeping the same
// service names and call graph means the /services metadata map, the topology
// layout, and the trace waterfall all read as the genuine CloudOps system.
export const SERVICES = [
  "api-gateway",
  "pricing",
  "inventory",
  "fraud",
  "payment",
  "ledger",
  "projection-worker",
] as const;

export type ServiceName = (typeof SERVICES)[number];

// Directed call graph for a place-order flow: gateway fans out to the pricing /
// inventory / fraud / payment chain; payment writes to the ledger; the
// projection-worker consumes events async. Matches diagrams/01_mesh_fanout.
export const EDGES: Array<[ServiceName, ServiceName]> = [
  ["api-gateway", "pricing"],
  ["api-gateway", "inventory"],
  ["api-gateway", "fraud"],
  ["api-gateway", "payment"],
  ["payment", "ledger"],
  ["ledger", "projection-worker"],
  ["inventory", "projection-worker"],
];

// ─── noise helpers ───────────────────────────────────────────────────────────
// A smooth-ish pseudo-random value in [0,1) that changes over time but is stable
// within the same ~2s window, so successive polls drift rather than jump.
function wave(seed: number, periodMs = 11000): number {
  const t = Date.now() / periodMs;
  // two out-of-phase sines → non-repeating-looking value in [0,1)
  return (Math.sin(t + seed) * 0.5 + Math.sin(t * 0.37 + seed * 2.1) * 0.5) * 0.5 + 0.5;
}

function jitter(base: number, spread: number, seed: number): number {
  return Math.max(0, base + (wave(seed) - 0.5) * 2 * spread);
}

// A per-service baseline rps so the mesh has a believable shape (gateway hottest).
const RPS_BASE: Record<ServiceName, number> = {
  "api-gateway": 42,
  pricing: 38,
  inventory: 36,
  fraud: 34,
  payment: 31,
  ledger: 30,
  "projection-worker": 28,
};

// ─── topology ────────────────────────────────────────────────────────────────
export function mockTopology(): Topology {
  const nodes = [...SERVICES].sort();
  const edges = EDGES.map(([source, target], i) => {
    const callRate = jitter(RPS_BASE[target] * 0.6, 6, i + 1);
    // fraud occasionally trips a small error rate to make the map feel alive.
    const errorRate = target === "fraud" && wave(i + 7) > 0.82 ? jitter(0.4, 0.3, i) : 0;
    return { source, target, callRate, errorRate };
  });
  return { nodes, edges };
}

// ─── per-service metrics ─────────────────────────────────────────────────────
export function mockServiceMetrics(): ServiceMetric[] {
  return SERVICES.map((service, i) => {
    const rps = jitter(RPS_BASE[service], 5, i);
    // payment/fraud very occasionally show a blip; everything else stays clean.
    const flaky = (service === "payment" || service === "fraud") && wave(i + 3) > 0.88;
    const errorRate = flaky ? jitter(0.6, 0.4, i) : 0;
    return { service, rps, errorRate };
  });
}

// ─── recent traces ───────────────────────────────────────────────────────────
const ROOT_OPS = [
  { service: "api-gateway", name: "POST /orders" },
  { service: "api-gateway", name: "GET /products" },
  { service: "api-gateway", name: "POST /cart" },
  { service: "api-gateway", name: "GET /products/{id}" },
  { service: "api-gateway", name: "POST /checkout" },
];

// A mulberry32 PRNG — small, fast, and (unlike sin-based hashing) never collapses
// to zero or repeats for consecutive seeds. Each trace gets its own stream.
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hexFrom(rand: () => number, len: number): string {
  const chars = "0123456789abcdef";
  let s = "";
  for (let i = 0; i < len; i++) s += chars[Math.floor(rand() * 16)];
  return s;
}

export function mockRecentTraces(limit = 20): TraceSummary[] {
  const n = Math.min(Math.max(limit, 1), 50);
  const now = Date.now();
  // Rotate the id set every 5s so the list appears to stream new traces, while
  // staying stable within a single poll window.
  const epoch = Math.floor(now / 5000);
  return Array.from({ length: n }, (_, i) => {
    const op = ROOT_OPS[i % ROOT_OPS.length];
    // newest first; each trace a few hundred ms to a few seconds back.
    const startTimeUnixMs = now - i * 1400 - Math.floor(wave(i) * 900);
    const durationMs =
      op.name === "POST /orders" || op.name === "POST /checkout"
        ? jitter(180, 70, i) // full saga is slower
        : jitter(46, 22, i);
    // Distinct, non-zero 32-hex id per (epoch, index).
    const rand = mulberry32((epoch * 2654435761 + i * 40503) >>> 0);
    return {
      traceId: hexFrom(rand, 32),
      rootService: op.service,
      rootName: op.name,
      durationMs,
      startTimeUnixMs,
    };
  });
}

// ─── single trace → OTLP JSON for the waterfall ──────────────────────────────
// Produces the `{ resourceSpans: [...] }` shape that trace-waterfall.ts parses.
// We synthesise a realistic place-order span tree: gateway → (pricing,
// inventory, fraud, payment) → ledger, with plausible offsets and durations.
interface SpanSpec {
  service: ServiceName;
  name: string;
  parent: string | null;
  spanId: string;
  offsetMs: number;
  durationMs: number;
  error?: boolean;
}

function traceSpanSpecs(seed: number): SpanSpec[] {
  const j = (base: number, spread: number, s: number) => jitter(base, spread, seed + s);
  const gw = "aaaa000000000001";
  return [
    { service: "api-gateway", name: "POST /orders", parent: null, spanId: gw, offsetMs: 0, durationMs: j(175, 40, 0) },
    { service: "pricing", name: "quote", parent: gw, spanId: "bbbb000000000002", offsetMs: j(4, 2, 1), durationMs: j(22, 8, 1) },
    { service: "inventory", name: "reserve", parent: gw, spanId: "cccc000000000003", offsetMs: j(28, 4, 2), durationMs: j(31, 10, 2) },
    { service: "fraud", name: "score", parent: gw, spanId: "dddd000000000004", offsetMs: j(60, 5, 3), durationMs: j(40, 14, 3), error: wave(seed) > 0.9 },
    { service: "payment", name: "authorize", parent: gw, spanId: "eeee000000000005", offsetMs: j(102, 6, 4), durationMs: j(54, 16, 4) },
    { service: "ledger", name: "double-entry", parent: "eeee000000000005", spanId: "ffff000000000006", offsetMs: j(120, 6, 5), durationMs: j(26, 8, 5) },
  ];
}

function otlpSpan(spec: SpanSpec, traceId: string, baseNano: number) {
  const startNano = baseNano + Math.round(spec.offsetMs * 1e6);
  const endNano = startNano + Math.round(spec.durationMs * 1e6);
  return {
    traceId,
    spanId: spec.spanId,
    parentSpanId: spec.parent ?? "",
    name: spec.name,
    kind: spec.parent ? 3 : 2, // CLIENT vs SERVER, cosmetic
    startTimeUnixNano: String(startNano),
    endTimeUnixNano: String(endNano),
    status: spec.error ? { code: 2 } : { code: 1 },
  };
}

export function mockTraceOtlp(traceId: string): { resourceSpans: unknown[] } {
  // Seed off the trace id so the same trace renders consistently within a view.
  const seed = [...traceId].reduce((a, c) => a + c.charCodeAt(0), 0);
  const baseNano = Date.now() * 1e6;
  const specs = traceSpanSpecs(seed);

  // Group spans by service into ResourceSpans (one resource per service).
  const byService = new Map<string, SpanSpec[]>();
  for (const s of specs) {
    const list = byService.get(s.service) ?? [];
    list.push(s);
    byService.set(s.service, list);
  }

  const resourceSpans = [...byService.entries()].map(([service, specsForSvc]) => ({
    resource: {
      attributes: [{ key: "service.name", value: { stringValue: service } }],
    },
    scopeSpans: [
      {
        scope: { name: "portfolio-mock" },
        spans: specsForSvc.map((spec) => otlpSpan(spec, traceId, baseNano)),
      },
    ],
  }));

  return { resourceSpans };
}

// ─── load generator status ───────────────────────────────────────────────────
// The load page polls /api/load/status every 2s. We keep a tiny in-memory run
// state so pressing Start/Stop feels real within a session (module scope
// persists per server instance / serverless warm invocation).
interface LoadRunState {
  running: boolean;
  scenario: string | null;
  rps: number;
  startedAt: number;
  durationSeconds: number;
  sentAtStart: number;
}

let runState: LoadRunState | null = null;
let cumulativeSent = 0;

export function mockLoadStart(scenario: string, rps: number, durationSeconds: number) {
  runState = {
    running: true,
    scenario,
    rps,
    startedAt: Date.now(),
    durationSeconds,
    sentAtStart: cumulativeSent,
  };
  return { scenario, rps, durationSeconds };
}

export function mockLoadStop() {
  if (runState) {
    // bank the progress so counters don't reset to zero on stop.
    cumulativeSent = computeSent();
    runState = { ...runState, running: false };
  }
}

function computeSent(): number {
  if (!runState) return cumulativeSent;
  const elapsedMs = Math.min(
    Date.now() - runState.startedAt,
    runState.durationSeconds * 1000,
  );
  return runState.sentAtStart + Math.floor((runState.rps * elapsedMs) / 1000);
}

export function mockLoadStatus() {
  // Auto-expire a run once its duration elapses, like the real loadgen.
  if (runState?.running) {
    const elapsed = Date.now() - runState.startedAt;
    if (elapsed >= runState.durationSeconds * 1000) {
      cumulativeSent = computeSent();
      runState = { ...runState, running: false };
    }
  }

  const running = runState?.running ?? false;
  const sent = running ? computeSent() : cumulativeSent;
  const failed = Math.floor(sent * 0.004); // ~0.4% error budget
  const ok = sent - failed;
  const inflight = running ? Math.round(jitter((runState?.rps ?? 0) * 0.3, 4, 99)) : 0;

  return {
    running,
    configured: true,
    scenario: runState?.scenario ?? null,
    rps: running ? runState?.rps ?? 0 : 0,
    sent,
    ok,
    failed,
    inflight,
  };
}
