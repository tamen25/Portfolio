"use client";
import type { Frame } from "../types";
import type { GraphState } from "../algorithms/graphs/graph";

export function GraphRenderer({ frame }: { frame: Frame<GraphState> }) {
  const { nodes, edges, visitedIds, activeId } = frame.state;
  // viewBox coordinate space; the SVG scales responsively to fill the stage
  const VB = 400;
  const cx = VB / 2, cy = VB / 2, R = 150, r = 22;
  const px = (x: number) => cx + x * R;
  const py = (y: number) => cy + y * R;
  const visited = new Set(visitedIds);
  const byId = new Map(nodes.map((n) => [n.id, n]));

  return (
    <div className="flex h-full w-full items-center justify-center p-6">
      <svg
        viewBox={`0 0 ${VB} ${VB}`}
        className="h-full max-h-[520px] w-full max-w-[520px]"
        role="img"
        aria-label="graph visualization"
      >
        <defs>
          {/* node depth: subtle top-lit radial */}
          <radialGradient id="g-node" cx="35%" cy="30%" r="75%">
            <stop offset="0%" stopColor="#1b1d24" />
            <stop offset="100%" stopColor="#101116" />
          </radialGradient>
          <radialGradient id="g-active" cx="35%" cy="30%" r="75%">
            <stop offset="0%" stopColor="#ffce7a" />
            <stop offset="100%" stopColor="#f2b45a" />
          </radialGradient>
          <radialGradient id="g-visited" cx="35%" cy="30%" r="75%">
            <stop offset="0%" stopColor="#4d82bd" />
            <stop offset="100%" stopColor="#3a6ea5" />
          </radialGradient>
          {/* glow for the active node */}
          <filter id="glow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="5" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          {/* arrowheads for directed edges */}
          <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" fill="var(--color-frontier)" />
          </marker>
          <marker id="arrow-dim" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" fill="var(--color-edge)" />
          </marker>
        </defs>

        {/* edges */}
        {edges.map((e, i) => {
          const a = byId.get(e.from)!, b = byId.get(e.to)!;
          const ax = px(a.x), ay = py(a.y), bx = px(b.x), by = py(b.y);
          // brighten an edge once both endpoints have been reached
          const live = visited.has(e.from) && visited.has(e.to);
          // shorten a directed edge so the arrowhead lands on the node rim, not center
          let x2 = bx, y2 = by;
          if (e.directed) {
            const dx = bx - ax, dy = by - ay;
            const len = Math.hypot(dx, dy) || 1;
            x2 = bx - (dx / len) * (r + 2);
            y2 = by - (dy / len) * (r + 2);
          }
          return (
            <line
              key={i}
              x1={ax}
              y1={ay}
              x2={x2}
              y2={y2}
              stroke={live ? "var(--color-frontier)" : "var(--color-edge)"}
              strokeWidth={live ? 2.5 : 1.75}
              strokeLinecap="round"
              markerEnd={e.directed ? (live ? "url(#arrow)" : "url(#arrow-dim)") : undefined}
              style={{ transition: "stroke 200ms, stroke-width 200ms" }}
            />
          );
        })}

        {/* nodes */}
        {nodes.map((n) => {
          const isActive = n.id === activeId;
          const isVisited = visited.has(n.id);
          const fill = isActive ? "url(#g-active)" : isVisited ? "url(#g-visited)" : "url(#g-node)";
          const ring = isActive ? "var(--color-active)" : isVisited ? "var(--color-frontier)" : "var(--color-edge)";
          const ink = isActive ? "#20160a" : "var(--color-ink)";
          return (
            <g key={n.id} filter={isActive ? "url(#glow)" : undefined}>
              <circle
                cx={px(n.x)}
                cy={py(n.y)}
                r={r}
                fill={fill}
                stroke={ring}
                strokeWidth={isActive ? 3 : 2}
                style={{ transition: "stroke 200ms, stroke-width 200ms" }}
              />
              <text
                x={px(n.x)}
                y={py(n.y)}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={15}
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
    </div>
  );
}
