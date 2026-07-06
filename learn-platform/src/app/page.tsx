import { Nav } from "@/design/components/Nav";
import { TrackCard } from "@/design/components/TrackCard";

export default function Home() {
  return (
    <main>
      <Nav />
      <section className="px-8 py-20">
        <p className="font-mono text-xs uppercase tracking-widest text-[var(--color-accent)]">
          runnable artifacts, not slides
        </p>
        <h1 className="mt-4 max-w-3xl text-5xl font-semibold leading-tight text-[var(--color-ink)]">
          Go from confused to confident.
        </h1>
        <p className="mt-6 max-w-xl text-[var(--color-muted)]">
          Play, pause, and scrub through algorithms and systems. Watch the work happen, step by step.
        </p>
      </section>
      <section className="grid gap-4 px-8 pb-24 sm:grid-cols-2 lg:grid-cols-3">
        <TrackCard
          title="DSA"
          blurb="Sorting, pathfinding, trees, graphs, DP — every pattern, visualized and step-through-able."
          href="/dsa"
          difficulty="01"
          status="live"
        />
        <TrackCard
          title="System Design"
          blurb="Trace a request through real architectures. Watch failures happen."
          difficulty="02"
          status="soon"
        />
        <TrackCard title="FDE" blurb="Forward-deployed engineering scenarios." difficulty="03" status="soon" />
      </section>
    </main>
  );
}
