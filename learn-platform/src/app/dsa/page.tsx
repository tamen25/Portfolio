import Link from "next/link";
import { Nav } from "@/design/components/Nav";
import { byCategory } from "@/track-dsa/catalog";

export default function DsaLanding() {
  const groups = byCategory();
  return (
    <main>
      <Nav />
      <div className="px-8 py-10">
        <h1 className="font-mono text-2xl text-[var(--color-ink)]">DSA</h1>
        {Object.entries(groups).map(([cat, entries]) => (
          <section key={cat} className="mt-8">
            <h2 className="font-mono text-xs uppercase tracking-widest text-[var(--color-accent)]">{cat}</h2>
            <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {entries.map((e) => (
                <Link
                  key={e.slug}
                  href={`/dsa/${e.slug}`}
                  className="rounded-lg border border-[var(--color-edge)] bg-[var(--color-panel)] p-4 hover:border-[var(--color-accent)]"
                >
                  <div className="flex justify-between">
                    <span className="font-mono text-[var(--color-ink)]">{e.name}</span>
                    <span className="font-mono text-xs text-[var(--color-muted)]">{e.complexity.time}</span>
                  </div>
                  <p className="mt-2 text-sm text-[var(--color-muted)]">{e.summary}</p>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
