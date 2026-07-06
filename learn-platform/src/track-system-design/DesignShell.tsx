"use client";
import { useMemo } from "react";
import { usePlayer } from "../track-dsa/player/usePlayer";
import { PlayerBar } from "../track-dsa/components/PlayerBar";
import { ArchRenderer } from "./ArchRenderer";
import { designBySlug } from "./catalog";
import type { Frame } from "../track-dsa/types";
import type { ArchState } from "./types";

export function DesignShell({ slug }: { slug: string }) {
  const entry = designBySlug(slug)!;
  const trace = useMemo(() => entry.build(), [entry]);
  const p = usePlayer(trace);
  // usePlayer is unparameterized, so narrow the frame back to the built state
  const frame = p.frame as Frame<ArchState>;
  const stepLine = frame.pseudoLine;

  return (
    <div className="flex h-[calc(100vh-57px)] flex-col">
      <div className="grid flex-1 grid-cols-[1fr_380px] overflow-hidden">
        <div className="relative h-full min-h-0">
          <ArchRenderer frame={frame} />
          {frame.narration && (
            <div className="pointer-events-none absolute bottom-10 left-1/2 -translate-x-1/2 max-w-[80%] rounded-md border border-[var(--color-edge)] bg-[var(--color-stage)]/90 px-3 py-1 text-center font-mono text-xs text-[var(--color-ink)] backdrop-blur-sm">
              {frame.narration}
            </div>
          )}
        </div>

        <aside className="space-y-5 overflow-auto border-l border-[var(--color-edge)] p-4">
          <div>
            <h1 className="font-mono text-lg text-[var(--color-ink)]">{entry.name}</h1>
            <p className="mt-1 font-mono text-xs text-[var(--color-muted)]">{entry.scale}</p>
          </div>

          {/* build steps — current step highlighted, like the DSA code panel */}
          <div className="rounded-lg border border-[var(--color-edge)] bg-[var(--color-stage)]">
            <div className="border-b border-[var(--color-edge)] px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-muted)]">
              Build order
            </div>
            <ol className="p-2 font-mono text-xs leading-relaxed">
              {entry.steps.map((s, i) => (
                <li
                  key={i}
                  className={`flex gap-2 rounded px-1.5 py-1 ${
                    i === stepLine
                      ? "bg-[var(--color-edge)] text-[var(--color-accent)]"
                      : "text-[var(--color-muted)]"
                  }`}
                >
                  <span className="opacity-60">{i + 1}</span>
                  <span>{s}</span>
                </li>
              ))}
            </ol>
          </div>

          <p className="text-sm text-[var(--color-muted)]">{entry.summary}</p>

          {entry.notes.map((n) => (
            <div key={n.heading}>
              <h2 className="font-mono text-xs uppercase tracking-widest text-[var(--color-accent)]">
                {n.heading}
              </h2>
              <ul className="mt-2 space-y-1.5">
                {n.body.map((line, i) => (
                  <li key={i} className="text-sm text-[var(--color-muted)]">
                    {line}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </aside>
      </div>

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
