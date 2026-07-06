"use client";
import type { Frame } from "../types";
import type { GraphState } from "../algorithms/graphs/graph";
import { Stage, GlowDefs } from "./Stage";

export function GraphRenderer({ frame }: { frame: Frame<GraphState> }) {
  const { nodes, edges, visitedIds, activeId } = frame.state;
  const VB = 400;
  const cx = VB / 2, cy = VB / 2, R = 150, r = 21;
  const px = (x: number) => cx + x * R;
  const py = (y: number) => cy + y * R;
  const visited = new Set(visitedIds);
  const byId = new Map(nodes.map((n) => [n.id, n]));

  return (
    <Stage label="graph">
      <svg
        viewBox={`0 0 ${VB} ${VB}`}
        className="h-full max-h-[560px] w-full max-w-[560px]"
        role="img"
        aria-label="graph traversal"
      >
        <GlowDefs />
        <defs>
          <marker id="g-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" fill="var(--color-frontier)" />
          </marker>
          <marker id="g-arrow-dim" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" fill="var(--color-muted)" />
          </marker>
        </defs>

        {edges.map((e, i) => {
          const a = byId.get(e.from)!, b = byId.get(e.to)!;
          const ax = px(a.x), ay = py(a.y), bx = px(b.x), by = py(b.y);
          const live = visited.has(e.from) && visited.has(e.to);
          let x2 = bx, y2 = by;
          if (e.directed) {
            const dx = bx - ax, dy = by - ay;
            const len = Math.hypot(dx, dy) || 1;
            x2 = bx - (dx / len) * (r + 3);
            y2 = by - (dy / len) * (r + 3);
          }
          return (
            <line
              key={i}
              x1={ax}
              y1={ay}
              x2={x2}
              y2={y2}
              stroke={live ? "var(--color-frontier)" : "var(--color-edge)"}
              strokeWidth={live ? 2 : 1.5}
              strokeLinecap="round"
              markerEnd={e.directed ? (live ? "url(#g-arrow)" : "url(#g-arrow-dim)") : undefined}
              style={{ transition: "stroke 200ms, stroke-width 200ms" }}
            />
          );
        })}

        {nodes.map((n) => {
          const isActive = n.id === activeId;
          const isVisited = visited.has(n.id);
          const fill = isActive
            ? "var(--color-active)"
            : isVisited
              ? "var(--color-visited)"
              : "var(--color-stage)";
          const ring = isActive
            ? "var(--color-active)"
            : isVisited
              ? "var(--color-frontier)"
              : "var(--color-edge)";
          const ink = isActive ? "#1a1206" : "var(--color-ink)";
          return (
            <g key={n.id} filter={isActive ? "url(#stage-glow)" : undefined}>
              <circle
                cx={px(n.x)}
                cy={py(n.y)}
                r={r}
                fill={fill}
                stroke={ring}
                strokeWidth={2}
                style={{ transition: "fill 200ms, stroke 200ms" }}
              />
              <text
                x={px(n.x)}
                y={py(n.y)}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={14}
                fontWeight={600}
                fill={ink}
                fontFamily="var(--font-mono)"
                style={{ transition: "fill 200ms" }}
              >
                {n.label}
              </text>
            </g>
          );
        })}
      </svg>
    </Stage>
  );
}
