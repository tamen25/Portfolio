"use client";

export function ComplexityChart({ time }: { time: string }) {
  const w = 220, h = 90, n = 20;
  const series = (fn: (x: number) => number, color: string, key: string) => {
    const max = fn(n);
    const pts = Array.from({ length: n }, (_, i) => `${(i / (n - 1)) * w},${h - (fn(i + 1) / max) * h}`).join(" ");
    return <polyline key={key} points={pts} fill="none" stroke={color} strokeWidth={1.5} />;
  };
  return (
    <div className="rounded-lg border border-[var(--color-edge)] p-3">
      <p className="mb-2 font-mono text-xs text-[var(--color-muted)]">growth · this: {time}</p>
      <svg width={w} height={h}>
        {series((x) => x, "var(--color-sorted)", "n")}
        {series((x) => x * Math.log2(x + 1), "var(--color-accent)", "nlogn")}
        {series((x) => x * x, "var(--color-pivot)", "n2")}
      </svg>
    </div>
  );
}
