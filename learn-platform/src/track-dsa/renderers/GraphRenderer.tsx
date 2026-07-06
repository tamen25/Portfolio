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
          return (
            <line key={i} x1={px(a.x)} y1={py(a.y)} x2={px(b.x)} y2={py(b.y)} stroke="var(--color-edge)" strokeWidth={1.5} />
          );
        })}
        {nodes.map((n) => {
          const fill =
            n.id === activeId
              ? "var(--color-accent)"
              : visited.has(n.id)
                ? "var(--color-visited)"
                : "var(--color-panel)";
          return (
            <g key={n.id}>
              <circle cx={px(n.x)} cy={py(n.y)} r={18} fill={fill} stroke="var(--color-edge)" />
              <text x={px(n.x)} y={py(n.y) + 4} textAnchor="middle" fontSize={12} fill="var(--color-ink)" fontFamily="var(--font-mono)">
                {n.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
