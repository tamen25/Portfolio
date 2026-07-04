import { SITE } from "@/lib/site";
import HeroCanvas from "./HeroCanvas";

export default function Hero() {
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
        <p className="label-mono mb-6">01 — hello</p>
        <h1 className="font-display text-6xl leading-[0.95] tracking-tight sm:text-8xl lg:text-9xl">
          Tamen Dutta
        </h1>
        <p className="mt-8 font-mono text-sm text-fg2 sm:text-base">
          <span className="text-dev">Developer</span>
          <span className="mx-3 text-fg3">×</span>
          <span className="text-photo">Photographer</span>
        </p>
        <p className="mt-3 font-mono text-xs text-fg3">{SITE.location}</p>
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
