import { SITE } from "@/lib/site";
import Reveal from "./Reveal";
import LocalTime from "./LocalTime";

export default function Contact() {
  return (
    <section id="contact" className="scroll-mt-14 border-t border-line/60 py-20">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <div className="flex flex-wrap items-baseline justify-between gap-4">
            <p className="label-mono">05 — contact</p>
            <p className="font-mono text-xs text-fg3">
              {SITE.location} · <LocalTime className="tabular-nums" /> local
            </p>
          </div>
          <h2 className="mt-6 font-display text-4xl sm:text-5xl">
            One inbox, <span className="italic text-dev">both crafts</span>
          </h2>
        </Reveal>

        <Reveal className="mt-10" delay={100}>
          <a
            href={`mailto:${SITE.email}`}
            className="group block border-y border-line/60 py-9 sm:py-12"
          >
            <span className="block break-all font-display text-[clamp(2.25rem,7vw,5.5rem)] leading-none transition-colors duration-300 group-hover:text-dev">
              {SITE.email}
            </span>
            <span className="mt-4 block font-mono text-xs text-fg3 transition-colors duration-300 group-hover:text-dev">
              opens your mail app ↗
            </span>
          </a>
        </Reveal>

        {/* Dense composed band: channels fill the width, a status card anchors the right. */}
        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          <Reveal className="lg:col-span-2" delay={140}>
            <ul className="grid h-full grid-rows-3 divide-y divide-line/60 rounded-xl border border-line/60">
              {SITE.socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex items-center justify-between px-6 py-5 transition-colors hover:bg-surface/60"
                  >
                    <span className="font-display text-xl sm:text-2xl">{s.label}</span>
                    <span className="font-mono text-xs text-fg3 transition-colors group-hover:text-fg">
                      {s.href.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "")} ↗
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={200}>
            <div className="flex h-full flex-col justify-between gap-6 rounded-xl border border-line/60 bg-surface/40 p-6">
              <div>
                <span className="inline-flex items-center gap-2 font-mono text-xs">
                  <span className="status-dot inline-block h-1.5 w-1.5 rounded-full bg-[#4ade80]" />
                  <span className="text-fg2">Available for select work</span>
                </span>
                <p className="mt-4 text-sm leading-relaxed text-fg2">
                  Open to product engineering, and to prints &amp; commissions.
                  Replies usually within a day.
                </p>
              </div>
              <dl className="grid grid-cols-2 gap-y-3 border-t border-line/60 pt-5 font-mono text-xs">
                <dt className="text-fg3">Based in</dt>
                <dd className="text-right text-fg2">{SITE.location}</dd>
                <dt className="text-fg3">Local time</dt>
                <dd className="text-right tabular-nums text-fg2">
                  <LocalTime /> +5:30
                </dd>
                <dt className="text-fg3">Crafts</dt>
                <dd className="text-right text-fg2">Software · Photography</dd>
              </dl>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
