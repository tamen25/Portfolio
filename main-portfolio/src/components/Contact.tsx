import { SITE } from "@/lib/site";
import Reveal from "./Reveal";

export default function Contact() {
  return (
    <section id="contact" className="scroll-mt-14 border-t border-line/60 py-28">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <p className="label-mono mb-4">05 — contact</p>
          <h2 className="font-display text-4xl sm:text-5xl">
            One inbox, <span className="italic text-dev">both crafts</span>
          </h2>
        </Reveal>

        <Reveal className="mt-10" delay={100}>
          <a
            href={`mailto:${SITE.email}`}
            className="inline-block break-all font-display text-3xl underline-offset-8 transition-colors hover:text-dev hover:underline sm:text-5xl lg:text-6xl"
          >
            {SITE.email}
          </a>
        </Reveal>

        <Reveal className="mt-16" delay={180}>
          <div className="flex flex-col gap-6 border-t border-line/60 pt-8 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-6">
              {SITE.socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  className="font-mono text-sm text-fg2 transition-colors hover:text-fg"
                >
                  {s.label} ↗
                </a>
              ))}
            </div>
            <p className="font-mono text-xs text-fg3">{SITE.location} · UTC+5:30</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
