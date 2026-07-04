import Image from "next/image";
import manifest from "@/lib/photo-manifest.json";
import { SITE } from "@/lib/site";

const heroPhoto = manifest.find((p) => "hero" in p && p.hero)!;

export default function Hero() {
  return (
    <section id="hero" className="grain relative flex min-h-[100dvh] items-center overflow-hidden">
      {/* Static split background — always present; WebGL scene renders above it */}
      <div className="absolute inset-0" aria-hidden>
        {/* left: dev grid */}
        <div
          className="absolute inset-y-0 left-0 w-1/2 opacity-40"
          style={{
            backgroundImage:
              "linear-gradient(#26262655 1px, transparent 1px), linear-gradient(90deg, #26262655 1px, transparent 1px)",
            backgroundSize: "48px 48px",
            maskImage: "linear-gradient(to right, black 40%, transparent)",
          }}
        />
        {/* right: real aurora frame */}
        <div className="absolute inset-y-0 right-0 w-2/3">
          <Image
            src={heroPhoto.src}
            alt=""
            fill
            priority
            sizes="66vw"
            className="object-cover opacity-35"
            style={{ maskImage: "linear-gradient(to left, black 30%, transparent 85%)" }}
          />
        </div>
        {/* vignette to keep type readable */}
        <div className="absolute inset-0 bg-gradient-to-b from-ink/60 via-transparent to-ink" />
      </div>

      {/* Three.js mount point (HeroScene) */}
      <div id="hero-canvas" className="absolute inset-0" />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-6 pt-14">
        <p className="label-mono mb-6">01 — hello</p>
        <h1 className="font-display text-6xl leading-[0.95] tracking-tight sm:text-8xl lg:text-9xl">
          Tamen
          <br />
          Dutta
        </h1>
        <p className="mt-8 font-mono text-sm text-fg2 sm:text-base">
          <span className="text-dev">Developer</span>
          <span className="mx-3 text-fg3">×</span>
          <span className="text-photo">Photographer</span>
        </p>
        <p className="mt-2 font-mono text-xs text-fg3">{SITE.location}</p>
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
