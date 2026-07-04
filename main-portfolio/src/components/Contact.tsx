import { SITE } from "@/lib/site";
import Reveal from "./Reveal";

export default function Contact() {
  return (
    <section id="contact" className="scroll-mt-14 border-t border-line/60 py-20">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <div className="flex flex-wrap items-baseline justify-between gap-4">
            <p className="label-mono">05 — contact</p>
            <p className="font-mono text-xs text-fg3">{SITE.location} · UTC+5:30</p>
          </div>
          <h2 className="mt-6 font-display text-4xl sm:text-5xl">
            One inbox, <span className="italic text-dev">both crafts</span>
          </h2>
        </Reveal>

        <Reveal className="mt-8" delay={100}>
          <a
            href={`mailto:${SITE.email}`}
            className="group block border-y border-line/60 py-8 sm:py-10"
          >
            <span className="block break-all font-display text-[clamp(2.25rem,7vw,5.5rem)] leading-none transition-colors duration-300 group-hover:text-dev">
              {SITE.email}
            </span>
            <span className="mt-4 block font-mono text-xs text-fg3 transition-colors duration-300 group-hover:text-dev">
              opens your mail app ↗
            </span>
          </a>
        </Reveal>

        <Reveal className="mt-8" delay={160}>
          <div className="flex flex-wrap gap-x-8 gap-y-4">
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
        </Reveal>
      </div>
    </section>
  );
}
