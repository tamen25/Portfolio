"use client";
import type { ReactNode } from "react";

/**
 * Shared instrument frame for every algorithm visualization. Gives all four
 * renderers one consistent "bench" — a subtle inset panel with a faint grid
 * wash — so they read as the same instrument rather than four separate widgets.
 */
export function Stage({ children, label }: { children: ReactNode; label?: string }) {
  return (
    <div className="relative flex h-full w-full items-center justify-center p-6 sm:p-8">
      <div
        className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-xl border border-[var(--color-edge)]"
        style={{
          backgroundColor: "var(--color-panel)",
          backgroundImage:
            "radial-gradient(circle at 50% 40%, rgba(53,214,196,0.04), transparent 60%)",
        }}
      >
        {/* faint bench grid */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage:
              "linear-gradient(var(--color-edge) 1px, transparent 1px), linear-gradient(90deg, var(--color-edge) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
            maskImage: "radial-gradient(circle at 50% 50%, black, transparent 78%)",
            WebkitMaskImage: "radial-gradient(circle at 50% 50%, black, transparent 78%)",
          }}
        />
        {label && (
          <span className="absolute left-3 top-2.5 font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-muted)]">
            {label}
          </span>
        )}
        <div className="relative flex h-full w-full items-center justify-center p-4">
          {children}
        </div>
      </div>
    </div>
  );
}

/** Shared SVG filter defs — one tight glow used across renderers. */
export function GlowDefs() {
  return (
    <defs>
      <filter id="stage-glow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="3.5" result="b" />
        <feMerge>
          <feMergeNode in="b" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
  );
}
