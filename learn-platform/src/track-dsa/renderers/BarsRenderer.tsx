"use client";
import type { Frame, HighlightRole } from "../types";
import { ROLE_COLOR, DEFAULT_BAR } from "@/design/tokens";
import { Stage } from "./Stage";

// only the "live" roles pulse; settled states stay flat so the scope reads calm
const GLOW_ROLES = new Set<HighlightRole>(["active", "current", "swap", "pivot", "cell-fill"]);

export function BarsRenderer({ frame }: { frame: Frame<number[]> }) {
  const data = frame.state;
  const max = Math.max(1, ...data);
  const roleOf = new Map<number, HighlightRole>();
  for (const h of frame.highlights) for (const i of h.indices) roleOf.set(i, h.role);

  return (
    <Stage label="array">
      <div className="flex h-full w-full items-end justify-center gap-[3px] px-2 pb-1">
        {data.map((v, i) => {
          const role = roleOf.get(i);
          const c = role ? ROLE_COLOR[role] : DEFAULT_BAR;
          return (
            <div
              key={i}
              className="flex-1 rounded-t-sm transition-all duration-200"
              style={{
                height: `${Math.max(2, (v / max) * 100)}%`,
                backgroundColor: c,
                boxShadow: role && GLOW_ROLES.has(role) ? `0 0 10px ${c}` : "none",
              }}
            />
          );
        })}
      </div>
    </Stage>
  );
}
