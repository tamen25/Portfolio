import Image from "next/image";
import { PROJECTS, SITE } from "@/lib/site";
import Manifesto from "./Manifesto";
import Reveal from "./Reveal";

export default function Developer() {
  return (
    <section id="developer" className="mx-auto max-w-6xl scroll-mt-14 px-6 py-20">
      <Reveal>
        <p className="label-mono mb-4">02 — developer</p>
        <h2 className="font-display text-4xl sm:text-5xl">
          {"// "}
        <span className="text-dev">software</span>
        </h2>
      </Reveal>

      <div className="mt-10 grid items-start gap-10 lg:grid-cols-2">
        <Reveal>
          <Manifesto />
        </Reveal>
        <Reveal delay={120}>
          <p className="text-lg leading-relaxed text-fg2">{SITE.bio.dev}</p>
          <div className="mt-8 flex flex-wrap gap-2">
            {SITE.stack.map((s) => (
              <span
                key={s}
                className="rounded-full border border-line px-3 py-1 font-mono text-xs text-fg2"
              >
                {s}
              </span>
            ))}
          </div>
        </Reveal>
      </div>

      <Reveal className="mt-14">
        <h3 className="mb-6 font-mono text-sm uppercase tracking-widest text-fg3">
          Selected work
        </h3>
      </Reveal>

      <div className="grid gap-6 sm:grid-cols-2">
        {PROJECTS.map((p, i) =>
          p.href ? (
            <Reveal key={p.id} delay={i * 100}>
              <a
                href={p.href}
                className={`group block overflow-hidden rounded-xl border border-line bg-surface transition-colors ${
                  p.accent === "dev" ? "hover:border-dev/60" : "hover:border-photo/60"
                }`}
              >
                {p.preview && (
                  <div className="relative aspect-video overflow-hidden border-b border-line">
                    <Image
                      src={p.preview}
                      alt={`${p.title} homepage`}
                      fill
                      sizes="(min-width: 640px) 50vw, 100vw"
                      className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]"
                    />
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-baseline justify-between">
                    <h4 className="font-display text-2xl">{p.title}</h4>
                    <span className="font-mono text-xs text-fg3 transition-colors group-hover:text-fg">
                      visit ↗
                    </span>
                  </div>
                  <p
                    className={`mt-1 font-mono text-xs ${p.accent === "dev" ? "text-dev" : "text-photo"}`}
                  >
                    {p.subtitle}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-fg2">{p.description}</p>
                  {p.stack.length > 0 && (
                    <p className="mt-4 font-mono text-xs text-fg3">{p.stack.join(" · ")}</p>
                  )}
                </div>
              </a>
            </Reveal>
          ) : (
            <Reveal key={p.id} delay={i * 100}>
              <div className="flex h-full min-h-48 flex-col justify-center rounded-xl border border-dashed border-line/80 p-6 text-center">
                <h4 className="font-display text-2xl text-fg3">{p.title}</h4>
                <p className="mt-1 font-mono text-xs text-fg3">{p.subtitle} — coming soon</p>
                <p className="mx-auto mt-3 max-w-60 text-sm text-fg3/80">{p.description}</p>
              </div>
            </Reveal>
          ),
        )}
      </div>
    </section>
  );
}
