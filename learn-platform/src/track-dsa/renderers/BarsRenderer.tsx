"use client";
import type { Frame, HighlightRole } from "../types";
import { ROLE_COLOR, DEFAULT_BAR } from "@/design/tokens";

export function BarsRenderer({ frame }: { frame: Frame<number[]> }) {
  const data = frame.state;
  const max = Math.max(1, ...data);
  const roleOf = new Map<number, HighlightRole>();
  for (const h of frame.highlights) for (const i of h.indices) roleOf.set(i, h.role);

  return (
    <div className="flex h-full w-full items-end justify-center gap-[2px] px-4 pb-4">
      {data.map((v, i) => {
        const role = roleOf.get(i);
        return (
          <div
            key={i}
            className="flex-1 rounded-t transition-all duration-200"
            style={{
              height: `${(v / max) * 100}%`,
              backgroundColor: role ? ROLE_COLOR[role] : DEFAULT_BAR,
              boxShadow: role ? `0 0 12px ${ROLE_COLOR[role]}` : "none",
            }}
          />
        );
      })}
    </div>
  );
}
