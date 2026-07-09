import { SITE } from "@/lib/site";
import HeroCanvas from "./HeroCanvas";
import LocalTime from "./LocalTime";

const NAME = "Tamen Dutta";

export default function Hero() {
  // Per-letter reveal; spaces keep their width but no animation.
  let visibleIndex = 0;

  return (
    <section
      id="hero"
      className="grain relative flex min-h-[100dvh] items-center justify-center overflow-hidden"
    >
      {/* Meteor shader over ink; static dark background remains if WebGL is unavailable */}
      <div className="absolute inset-0" aria-hidden>
        <HeroCanvas />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/50 via-transparent to-ink" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-5xl px-6 pt-14 text-center">
        <p
          className="label-mono mb-6 opacity-0"
          style={{ animation: "fadein 0.8s ease forwards" }}
        >
          01 — hello
        </p>

        <h1
          aria-label={NAME}
          className="font-display text-6xl leading-[0.95] tracking-tight sm:text-8xl lg:text-9xl"
        >
          {NAME.split("").map((ch, i) => {
            if (ch === " ")
              return (
                <span key={i} aria-hidden className="inline-block w-[0.28em]" />
              );
            const delay = 0.15 + visibleIndex * 0.045;
            visibleIndex += 1;
            return (
              <span
                key={i}
                aria-hidden
                className="rise-letter"
                style={{ animationDelay: `${delay}s` }}
              >
                {ch}
              </span>
            );
          })}
        </h1>

        <p
          className="mt-8 font-mono text-sm text-fg2 opacity-0 sm:text-base"
          style={{ animation: "fadein 1s ease 0.7s forwards" }}
        >
          <span className="text-dev">Developer</span>
          <span className="mx-3 text-fg3">×</span>
          <span className="text-photo">Photographer</span>
        </p>

        {/* Live status strip — small, dense, alive. */}
        <div
          className="mt-7 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 font-mono text-xs text-fg3 opacity-0"
          style={{ animation: "fadein 1s ease 0.95s forwards" }}
        >
          <span className="inline-flex items-center gap-2">
            <span className="status-dot inline-block h-1.5 w-1.5 rounded-full bg-[#4ade80]" />
            <span className="text-fg2">Available for select work</span>
          </span>
          <span className="text-line">·</span>
          <span>{SITE.location}</span>
          <span className="text-line">·</span>
          <span>
            <LocalTime className="tabular-nums text-fg2" /> local
          </span>
        </div>
      </div>

      <a
        href="#developer"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 font-mono text-xs text-fg3 transition-colors hover:text-fg"
      >
        scroll ↓
      </a>
    </section>
  );
}
