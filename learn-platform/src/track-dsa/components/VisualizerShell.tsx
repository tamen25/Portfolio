"use client";
import { useMemo, useState } from "react";
import { usePlayer } from "../player/usePlayer";
import { RENDERERS } from "../renderers/registry";
import { PlayerBar } from "./PlayerBar";
import { CodePanel } from "./CodePanel";
import { ComplexityChart } from "./ComplexityChart";
import { ComparisonView } from "./ComparisonView";
import { bySlug } from "../catalog";

export function VisualizerShell({ slug }: { slug: string }) {
  const entry = bySlug(slug)!;
  const input = useMemo(() => entry.defaultInput(), [entry]);
  const trace = useMemo(() => entry.run(input), [entry, input]);
  const p = usePlayer(trace);
  const Renderer = RENDERERS[entry.renderer];
  const [compareSlug, setCompareSlug] = useState<string | null>(null);
  const other = compareSlug ? bySlug(compareSlug) : null;

  return (
    <div className="flex h-[calc(100vh-57px)] flex-col">
      <div className="grid flex-1 grid-cols-[1fr_360px] overflow-hidden">
        <div className="relative h-full min-h-0">
          {Renderer ? <Renderer frame={p.frame} /> : null}
          {p.frame.narration && (
            <div className="pointer-events-none absolute bottom-10 left-1/2 -translate-x-1/2 rounded-md border border-[var(--color-edge)] bg-[var(--color-stage)]/90 px-3 py-1 font-mono text-xs text-[var(--color-ink)] backdrop-blur-sm">
              {p.frame.narration}
            </div>
          )}
        </div>
        <aside className="space-y-4 overflow-auto border-l border-[var(--color-edge)] p-4">
          <div>
            <h1 className="font-mono text-lg text-[var(--color-ink)]">{entry.name}</h1>
            <p className="font-mono text-xs text-[var(--color-muted)]">
              {entry.complexity.time} time · {entry.complexity.space} space
            </p>
          </div>
          <CodePanel entry={entry} pseudoLine={p.frame.pseudoLine} />
          <p className="text-sm text-[var(--color-muted)]">{entry.summary}</p>
          <ComplexityChart time={entry.complexity.time} />
          {entry.comparableWith && entry.comparableWith.length > 0 && (
            <select
              value={compareSlug ?? ""}
              onChange={(e) => setCompareSlug(e.target.value || null)}
              className="w-full bg-[var(--color-stage)] font-mono text-xs text-[var(--color-muted)]"
              aria-label="compare with"
            >
              <option value="">compare with…</option>
              {entry.comparableWith.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          )}
        </aside>
      </div>
      {other && (
        <div className="border-t border-[var(--color-edge)] p-4">
          <ComparisonView left={entry} right={other} input={input} />
        </div>
      )}
      <PlayerBar
        index={p.index}
        total={p.total}
        playing={p.playing}
        speed={p.speed}
        meta={p.frame.meta}
        onPrev={p.prev}
        onNext={p.next}
        onPlay={p.play}
        onPause={p.pause}
        onScrub={p.scrub}
        onSpeed={p.setSpeed}
      />
    </div>
  );
}
