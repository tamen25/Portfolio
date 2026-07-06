"use client";
import type { Frame } from "../track-dsa/types";
import type { ArchState, ComponentKind } from "./types";
import { Stage, GlowDefs } from "../track-dsa/renderers/Stage";

// each family gets a stable accent so a diagram is readable at a glance
const KIND_COLOR: Record<ComponentKind, string> = {
  client: "var(--color-frontier)",
  cdn: "var(--color-sorted)",
  gateway: "var(--color-active)",
  service: "var(--color-accent)",
  cache: "var(--color-path)",
  db: "var(--color-visited)",
  queue: "var(--color-pivot)",
  storage: "var(--color-visited)",
};

const KIND_TAG: Record<ComponentKind, string> = {
  client: "client",
  cdn: "edge",
  gateway: "gateway",
  service: "service",
  cache: "cache",
  db: "store",
  queue: "queue",
  storage: "store",
};

export function ArchRenderer({ frame }: { frame: Frame<ArchState> }) {
  const { components, edges, focusId } = frame.state;
  const VW = 720, VH = 440;
  const BW = 132, BH = 58;
  const px = (x: number) => 40 + x * (VW - 80);
  const py = (y: number) => 40 + y * (VH - 80);
  const byId = new Map(components.map((c) => [c.id, c]));

  return (
    <Stage label="architecture">
      <svg
        viewBox={`0 0 ${VW} ${VH}`}
        className="h-full max-h-[560px] w-full"
        role="img"
        aria-label="system architecture"
      >
        <GlowDefs />
        <defs>
          <marker id="arch-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" fill="var(--color-muted)" />
          </marker>
        </defs>

        {/* connectors */}
        {edges.map((e, i) => {
          const a = byId.get(e.from), b = byId.get(e.to);
          if (!a || !b) return null;
          const ax = px(a.x), ay = py(a.y), bx = px(b.x), by = py(b.y);
          const dx = bx - ax, dy = by - ay;
          const len = Math.hypot(dx, dy) || 1;
          // stop the line at the target box edge so the arrowhead sits outside it
          const x2 = bx - (dx / len) * (BW / 2 + 6);
          const y2 = by - (dy / len) * (BH / 2 + 6);
          const mx = (ax + x2) / 2, my = (ay + y2) / 2;
          return (
            <g key={i}>
              <line
                x1={ax}
                y1={ay}
                x2={x2}
                y2={y2}
                stroke="var(--color-edge)"
                strokeWidth={1.75}
                strokeLinecap="round"
                markerEnd="url(#arch-arrow)"
              />
              {e.label && (
                <text
                  x={mx}
                  y={my - 5}
                  textAnchor="middle"
                  fontSize={11}
                  fill="var(--color-muted)"
                  fontFamily="var(--font-mono)"
                >
                  {e.label}
                </text>
              )}
            </g>
          );
        })}

        {/* component boxes */}
        {components.map((c) => {
          const isFocus = c.id === focusId;
          const accent = KIND_COLOR[c.kind];
          const cx = px(c.x), cy = py(c.y);
          return (
            <g key={c.id} filter={isFocus ? "url(#stage-glow)" : undefined}>
              <rect
                x={cx - BW / 2}
                y={cy - BH / 2}
                width={BW}
                height={BH}
                rx={8}
                fill="var(--color-stage)"
                stroke={isFocus ? accent : "var(--color-edge)"}
                strokeWidth={isFocus ? 2.5 : 1.5}
                style={{ transition: "stroke 200ms, stroke-width 200ms" }}
              />
              {/* left accent bar keys the family */}
              <rect x={cx - BW / 2} y={cy - BH / 2} width={4} height={BH} rx={2} fill={accent} />
              <text
                x={cx}
                y={cy - 4}
                textAnchor="middle"
                fontSize={13}
                fontWeight={600}
                fill="var(--color-ink)"
                fontFamily="var(--font-mono)"
              >
                {c.label}
              </text>
              <text
                x={cx}
                y={cy + 13}
                textAnchor="middle"
                fontSize={9.5}
                fill={accent}
                fontFamily="var(--font-mono)"
                style={{ letterSpacing: "0.1em" }}
              >
                {KIND_TAG[c.kind].toUpperCase()}
              </text>
            </g>
          );
        })}
      </svg>
    </Stage>
  );
}
