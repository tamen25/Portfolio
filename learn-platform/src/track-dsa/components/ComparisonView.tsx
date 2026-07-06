"use client";
import { useMemo } from "react";
import type { AlgorithmEntry } from "../types";
import { usePlayer } from "../player/usePlayer";
import { RENDERERS } from "../renderers/registry";

function Side({ entry, input }: { entry: AlgorithmEntry; input: unknown }) {
  const trace = useMemo(() => entry.run(input), [entry, input]);
  const p = usePlayer(trace);
  const Renderer = RENDERERS[entry.renderer]!;
  return (
    <div className="flex-1">
      <div className="mb-1 flex justify-between font-mono text-xs text-[var(--color-muted)]">
        <span>{entry.name}</span>
        <span>{p.frame.meta && Object.entries(p.frame.meta).map(([k, v]) => `${k}:${v}`).join(" ")}</span>
      </div>
      <div className="h-64 rounded border border-[var(--color-edge)]">
        <Renderer frame={p.frame} />
      </div>
      <button onClick={p.playing ? p.pause : p.play} className="mt-1 font-mono text-xs text-[var(--color-accent)]">
        {p.playing ? "pause" : "play"}
      </button>
    </div>
  );
}

export function ComparisonView({ left, right, input }: { left: AlgorithmEntry; right: AlgorithmEntry; input: unknown }) {
  return (
    <div className="flex gap-4">
      <Side entry={left} input={input} />
      <Side entry={right} input={input} />
    </div>
  );
}
