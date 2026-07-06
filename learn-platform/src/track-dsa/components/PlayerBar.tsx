"use client";

export function PlayerBar(props: {
  index: number;
  total: number;
  playing: boolean;
  speed: number;
  narration: string;
  meta?: Record<string, number>;
  onPrev: () => void;
  onNext: () => void;
  onPlay: () => void;
  onPause: () => void;
  onScrub: (i: number) => void;
  onSpeed: (s: number) => void;
}) {
  return (
    <div className="border-t border-[var(--color-edge)] bg-[var(--color-panel)] px-6 py-3">
      <div className="flex items-center gap-3 font-mono text-sm">
        <button onClick={props.onPrev} className="text-[var(--color-muted)] hover:text-[var(--color-ink)]" aria-label="step back">◀</button>
        <button onClick={props.playing ? props.onPause : props.onPlay} className="text-[var(--color-accent)]" aria-label="play/pause">
          {props.playing ? "⏸" : "▶"}
        </button>
        <button onClick={props.onNext} className="text-[var(--color-muted)] hover:text-[var(--color-ink)]" aria-label="step forward">▶</button>
        <input
          type="range"
          min={0}
          max={Math.max(0, props.total - 1)}
          value={props.index}
          onChange={(e) => props.onScrub(Number(e.target.value))}
          className="flex-1 accent-[var(--color-accent)]"
          aria-label="scrub"
        />
        <span className="text-[var(--color-muted)]">{props.index + 1}/{props.total}</span>
        <select
          value={props.speed}
          onChange={(e) => props.onSpeed(Number(e.target.value))}
          className="bg-[var(--color-stage)] text-[var(--color-muted)]"
          aria-label="speed"
        >
          <option value={0.5}>0.5×</option>
          <option value={1}>1×</option>
          <option value={2}>2×</option>
          <option value={4}>4×</option>
        </select>
      </div>
      <div className="mt-2 flex items-center justify-between font-mono text-xs">
        <span className="text-[var(--color-ink)]">{props.narration}</span>
        <span className="text-[var(--color-muted)]">
          {props.meta && Object.entries(props.meta).map(([k, v]) => `${k}: ${v}`).join("  ")}
        </span>
      </div>
    </div>
  );
}
