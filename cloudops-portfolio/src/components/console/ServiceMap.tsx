"use client";

import { useMemo, useState } from "react";
import type { Topology, TopologyEdge } from "@/lib/observe";

/*
 * Force-directed service constellation. A seeded spring simulation runs once
 * per topology (deterministic — same nodes give the same layout every poll, so
 * the map never jumps while traffic numbers drift). Nodes render as glowing
 * orbs sized by throughput; edges are curved beziers carrying a flowing packet.
 */

const W = 1200;
const H = 680;
const ITERATIONS = 320;
const ROOT = "api-gateway";

interface Node {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  depth: number;
  traffic: number; // summed incident call rate → orb size
}

// Deterministic PRNG so initial placement (and therefore the whole layout) is
// stable across renders. Mulberry32.
function rng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function computeDepths(nodes: string[], edges: TopologyEdge[]): Map<string, number> {
  const adj = new Map<string, string[]>();
  for (const e of edges) {
    if (!adj.has(e.source)) adj.set(e.source, []);
    adj.get(e.source)!.push(e.target);
  }
  const depth = new Map<string, number>();
  const root = nodes.includes(ROOT) ? ROOT : nodes[0];
  if (!root) return depth;
  const queue: Array<[string, number]> = [[root, 0]];
  depth.set(root, 0);
  while (queue.length) {
    const [n, d] = queue.shift()!;
    for (const next of adj.get(n) ?? []) {
      if (!depth.has(next)) {
        depth.set(next, d + 1);
        queue.push([next, d + 1]);
      }
    }
  }
  let max = 0;
  for (const d of depth.values()) max = Math.max(max, d);
  for (const n of nodes) if (!depth.has(n)) depth.set(n, max + 1);
  return depth;
}

function simulate(topo: Topology): Node[] {
  const depth = computeDepths(topo.nodes, topo.edges);
  const maxDepth = Math.max(1, ...depth.values());

  // Per-node traffic = sum of incident edge call rates (both directions).
  const traffic = new Map<string, number>();
  for (const n of topo.nodes) traffic.set(n, 0);
  for (const e of topo.edges) {
    traffic.set(e.source, (traffic.get(e.source) ?? 0) + e.callRate);
    traffic.set(e.target, (traffic.get(e.target) ?? 0) + e.callRate);
  }

  const rand = rng(1337);
  const cx = W / 2;
  const cy = H / 2;

  // Seed positions: X biased by BFS depth (flow reads left→right), Y + jitter
  // random but deterministic, so the sim starts from a sane, repeatable state.
  const nodes: Node[] = topo.nodes.map((id) => {
    const d = depth.get(id) ?? 0;
    const x = 120 + (d / maxDepth) * (W - 240) + (rand() - 0.5) * 80;
    const y = 90 + rand() * (H - 180);
    return { id, x, y, vx: 0, vy: 0, depth: d, traffic: traffic.get(id) ?? 0 };
  });
  const byId = new Map(nodes.map((n) => [n.id, n]));

  const edges = topo.edges
    .map((e) => [byId.get(e.source), byId.get(e.target)] as const)
    .filter((p): p is readonly [Node, Node] => Boolean(p[0] && p[1]));

  const REPULSION = 42000;
  const SPRING = 0.012;
  const SPRING_LEN = 150;
  const CENTER = 0.008;
  const DAMPING = 0.85;

  for (let it = 0; it < ITERATIONS; it++) {
    // Repulsion (every pair).
    for (let i = 0; i < nodes.length; i++) {
      const a = nodes[i];
      for (let j = i + 1; j < nodes.length; j++) {
        const b = nodes[j];
        let dx = a.x - b.x;
        let dy = a.y - b.y;
        let dist2 = dx * dx + dy * dy;
        if (dist2 < 0.01) {
          dx = (rand() - 0.5) * 0.1;
          dy = (rand() - 0.5) * 0.1;
          dist2 = 0.01;
        }
        const force = REPULSION / dist2;
        const dist = Math.sqrt(dist2);
        const fx = (dx / dist) * force;
        const fy = (dy / dist) * force;
        a.vx += fx;
        a.vy += fy;
        b.vx -= fx;
        b.vy -= fy;
      }
    }
    // Spring (edges pull connected nodes toward a rest length).
    for (const [a, b] of edges) {
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;
      const force = (dist - SPRING_LEN) * SPRING;
      const fx = (dx / dist) * force;
      const fy = (dy / dist) * force;
      a.vx += fx;
      a.vy += fy;
      b.vx -= fx;
      b.vy -= fy;
    }
    // Gentle pull to centre, integrate, damp.
    for (const n of nodes) {
      n.vx += (cx - n.x) * CENTER;
      n.vy += (cy - n.y) * CENTER;
      n.vx *= DAMPING;
      n.vy *= DAMPING;
      n.x += n.vx;
      n.y += n.vy;
      n.x = Math.max(60, Math.min(W - 60, n.x));
      n.y = Math.max(60, Math.min(H - 60, n.y));
    }
  }
  return nodes;
}

// Tier colour by BFS depth so the constellation reads in bands.
function tier(depth: number): { core: string; glow: string } {
  const palette = [
    { core: "#7db8ff", glow: "#7db8ff" }, // edge — brightest
    { core: "#4d9fff", glow: "#4d9fff" },
    { core: "#3b82f6", glow: "#3b82f6" },
    { core: "#6366f1", glow: "#6366f1" }, // deep — cool indigo
    { core: "#818cf8", glow: "#818cf8" },
  ];
  return palette[Math.min(depth, palette.length - 1)];
}

function edgeColor(e: TopologyEdge): string {
  const ratio = e.callRate > 0 ? e.errorRate / e.callRate : 0;
  if (ratio >= 0.1) return "#e5534b";
  if (ratio >= 0.01) return "#c69026";
  return "#4d9fff";
}

function radius(traffic: number, isRoot: boolean): number {
  // sqrt keeps the biggest hubs from dwarfing everything.
  return Math.min(26, 7 + Math.sqrt(traffic) * 1.15) + (isRoot ? 3 : 0);
}

export function ServiceMap({ topology }: { topology: Topology }) {
  const nodes = useMemo(() => simulate(topology), [topology]);
  const byId = useMemo(() => new Map(nodes.map((n) => [n.id, n])), [nodes]);
  const [hover, setHover] = useState<string | null>(null);

  if (topology.nodes.length === 0) {
    return (
      <div className="grid h-[520px] place-items-center rounded-xl border border-border-muted/60 bg-bg-elev/30">
        <p className="font-mono text-sm text-fg-subtle">
          no traffic yet — start a run on <span className="text-brand-400">/load</span>
        </p>
      </div>
    );
  }

  const neighbours = new Set<string>();
  if (hover) {
    for (const e of topology.edges) {
      if (e.source === hover) neighbours.add(e.target);
      if (e.target === hover) neighbours.add(e.source);
    }
  }

  return (
    <div className="relative overflow-hidden rounded-xl border border-border-muted/60 bg-[radial-gradient(120%_120%_at_50%_0%,rgba(77,159,255,0.06),transparent_60%)] bg-bg-elev/20">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-auto w-full"
        role="img"
        aria-label="Service map"
      >
        <defs>
          <filter id="node-glow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <radialGradient id="orb" cx="35%" cy="30%" r="75%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
            <stop offset="35%" stopColor="currentColor" stopOpacity="0.9" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0.35" />
          </radialGradient>
        </defs>

        {/* edges — curved beziers with a flowing packet */}
        {topology.edges.map((e, i) => {
          const a = byId.get(e.source);
          const b = byId.get(e.target);
          if (!a || !b) return null;
          const active =
            !hover || hover === e.source || hover === e.target;
          const color = edgeColor(e);
          const mx = (a.x + b.x) / 2;
          const my = (a.y + b.y) / 2;
          // curvature perpendicular to the edge for an organic arc
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const len = Math.sqrt(dx * dx + dy * dy) || 1;
          const curve = Math.min(60, len * 0.18);
          const ctrlX = mx - (dy / len) * curve;
          const ctrlY = my + (dx / len) * curve;
          const d = `M ${a.x} ${a.y} Q ${ctrlX} ${ctrlY} ${b.x} ${b.y}`;
          const width = Math.min(1 + e.callRate * 0.06, 3);
          return (
            <g
              key={`${e.source}->${e.target}`}
              style={{ opacity: active ? 1 : 0.12, transition: "opacity .25s" }}
            >
              <path
                d={d}
                fill="none"
                stroke={color}
                strokeOpacity={0.45}
                strokeWidth={width}
                strokeLinecap="round"
              />
              <circle r={2.4} fill={color}>
                <animateMotion
                  dur={`${3 + (i % 5) * 0.7}s`}
                  repeatCount="indefinite"
                  path={d}
                  rotate="auto"
                  begin={`${(i % 7) * 0.4}s`}
                />
                <animate
                  attributeName="opacity"
                  values="0;1;1;0"
                  dur={`${3 + (i % 5) * 0.7}s`}
                  repeatCount="indefinite"
                  begin={`${(i % 7) * 0.4}s`}
                />
              </circle>
            </g>
          );
        })}

        {/* nodes — glowing orbs */}
        {nodes.map((n) => {
          const isRoot = n.id === ROOT;
          const r = radius(n.traffic, isRoot);
          const { core } = tier(n.depth);
          const dim = hover && hover !== n.id && !neighbours.has(n.id);
          const focus = hover === n.id;
          return (
            <g
              key={n.id}
              transform={`translate(${n.x},${n.y})`}
              style={{ opacity: dim ? 0.2 : 1, transition: "opacity .25s", cursor: "pointer" }}
              onMouseEnter={() => setHover(n.id)}
              onMouseLeave={() => setHover(null)}
            >
              {/* ambient halo */}
              <circle
                r={r + (focus ? 12 : 7)}
                fill={core}
                opacity={focus ? 0.28 : 0.14}
                filter="url(#node-glow)"
              >
                {!hover && (
                  <animate
                    attributeName="opacity"
                    values="0.1;0.22;0.1"
                    dur="4s"
                    repeatCount="indefinite"
                    begin={`${(n.x % 5) * 0.3}s`}
                  />
                )}
              </circle>
              {/* orb */}
              <circle r={r} color={core} fill="url(#orb)" stroke={core} strokeWidth={1.25} strokeOpacity={0.9} />
              {isRoot && (
                <circle r={r + 4} fill="none" stroke={core} strokeWidth={1} strokeOpacity={0.5} strokeDasharray="3 4" />
              )}
              {/* label */}
              <text
                y={r + 15}
                textAnchor="middle"
                className={focus ? "fill-fg-base" : "fill-fg-muted"}
                style={{ font: `${focus ? 600 : 500} 12px var(--font-mono)`, transition: "fill .2s" }}
              >
                {n.id}
              </text>
              {focus && (
                <text
                  y={r + 30}
                  textAnchor="middle"
                  className="fill-brand-400"
                  style={{ font: "500 10px var(--font-mono)" }}
                >
                  {n.traffic.toFixed(0)} rps
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
