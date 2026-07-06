import Link from "next/link";
import { Nav } from "@/design/components/Nav";
import { DESIGNS } from "@/track-system-design/catalog";

export default function SystemDesignLanding() {
  return (
    <main>
      <Nav />
      <div className="px-8 py-10">
        <h1 className="font-mono text-2xl text-[var(--color-ink)]">System Design</h1>
        <p className="mt-2 max-w-2xl text-sm text-[var(--color-muted)]">
          Watch each design assemble one component at a time. Step through the build order,
          then read the requirements, capacity math, and tradeoffs.
        </p>
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {DESIGNS.map((d) => (
            <Link
              key={d.slug}
              href={`/system-design/${d.slug}`}
              className="rounded-lg border border-[var(--color-edge)] bg-[var(--color-panel)] p-4 hover:border-[var(--color-accent)]"
            >
              <div className="flex items-baseline justify-between gap-2">
                <span className="font-mono text-[var(--color-ink)]">{d.name}</span>
                <span className="shrink-0 font-mono text-[10px] text-[var(--color-muted)]">
                  {d.steps.length} steps
                </span>
              </div>
              <p className="mt-2 text-sm text-[var(--color-muted)]">{d.summary}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {d.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded border border-[var(--color-edge)] px-1.5 py-0.5 font-mono text-[10px] text-[var(--color-muted)]"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
