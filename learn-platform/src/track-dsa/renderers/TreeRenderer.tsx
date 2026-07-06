"use client";
import type { Frame } from "../types";
import type { TreeState } from "../algorithms/trees/tree";
import { Stage, GlowDefs } from "./Stage";

export function TreeRenderer({ frame }: { frame: Frame<TreeState> }) {
  const { nodes, edges, highlightIds } = frame.state;
  if (nodes.length === 0) {
    return (
      <Stage label="tree">
        <span className="font-mono text-xs text-[var(--color-muted)]">empty tree</span>
      </Stage>
    );
  }
  const maxX = Math.max(1, ...nodes.map((n) => n.x));
  const maxY = Math.max(1, ...nodes.map((n) => n.y));
  const VW = 640, VH = 380, pad = 44, r = 18;
  const px = (x: number) => pad + (x / maxX) * (VW - 2 * pad);
  const py = (y: number) => pad + (y / maxY) * (VH - 2 * pad);
  const hi = new Set(highlightIds);
  const byId = new Map(nodes.map((n) => [n.id, n]));
  const glyph = (v: number) =>
    v >= 32 && v < 127 && v !== -1 ? String.fromCharCode(v) : v === -1 ? "•" : String(v);

  return (
    <Stage label="tree">
      <svg
        viewBox={`0 0 ${VW} ${VH}`}
        className="h-full max-h-[560px] w-full"
        role="img"
        aria-label="tree structure"
      >
        <GlowDefs />
        {edges.map(([a, b], i) => {
          const na = byId.get(a)!, nb = byId.get(b)!;
          return (
            <line
              key={i}
              x1={px(na.x)}
              y1={py(na.y)}
              x2={px(nb.x)}
              y2={py(nb.y)}
              stroke="var(--color-edge)"
              strokeWidth={1.5}
              strokeLinecap="round"
            />
          );
        })}
        {nodes.map((n) => {
          const isHi = hi.has(n.id);
          return (
            <g key={n.id} filter={isHi ? "url(#stage-glow)" : undefined}>
              <circle
                cx={px(n.x)}
                cy={py(n.y)}
                r={r}
                fill={isHi ? "var(--color-active)" : "var(--color-stage)"}
                stroke={isHi ? "var(--color-active)" : "var(--color-edge)"}
                strokeWidth={2}
                style={{ transition: "fill 200ms, stroke 200ms" }}
              />
              <text
                x={px(n.x)}
                y={py(n.y)}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={13}
                fontWeight={600}
                fill={isHi ? "#1a1206" : "var(--color-ink)"}
                fontFamily="var(--font-mono)"
                style={{ transition: "fill 200ms" }}
              >
                {glyph(n.value)}
              </text>
            </g>
          );
        })}
      </svg>
    </Stage>
  );
}
