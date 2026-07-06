"use client";
import type { Frame } from "../types";
import type { TreeState } from "../algorithms/trees/tree";

export function TreeRenderer({ frame }: { frame: Frame<TreeState> }) {
  const { nodes, edges, highlightIds } = frame.state;
  if (nodes.length === 0) {
    return <div className="flex h-full items-center justify-center text-[var(--color-muted)]">empty</div>;
  }
  const maxX = Math.max(1, ...nodes.map((n) => n.x));
  const maxY = Math.max(1, ...nodes.map((n) => n.y));
  const W = 640, H = 360, pad = 40;
  const px = (x: number) => pad + (x / maxX) * (W - 2 * pad);
  const py = (y: number) => pad + (y / maxY) * (H - 2 * pad);
  const hi = new Set(highlightIds);
  const byId = new Map(nodes.map((n) => [n.id, n]));
  const glyph = (v: number) =>
    v >= 32 && v < 127 && v !== -1 ? String.fromCharCode(v) : v === -1 ? "•" : String(v);
  return (
    <div className="flex h-full w-full items-center justify-center">
      <svg width={W} height={H}>
        {edges.map(([a, b], i) => {
          const na = byId.get(a)!, nb = byId.get(b)!;
          return (
            <line key={i} x1={px(na.x)} y1={py(na.y)} x2={px(nb.x)} y2={py(nb.y)} stroke="var(--color-edge)" strokeWidth={1.5} />
          );
        })}
        {nodes.map((n) => (
          <g key={n.id}>
            <circle
              cx={px(n.x)}
              cy={py(n.y)}
              r={16}
              fill={hi.has(n.id) ? "var(--color-accent)" : "var(--color-panel)"}
              stroke="var(--color-edge)"
            />
            <text x={px(n.x)} y={py(n.y) + 4} textAnchor="middle" fontSize={11} fill="var(--color-ink)" fontFamily="var(--font-mono)">
              {glyph(n.value)}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
