import { SITE } from "@/lib/site";
import Reveal from "./Reveal";

export default function About() {
  return (
    <section id="about" className="mx-auto max-w-6xl scroll-mt-14 px-6 py-28">
      <Reveal>
        <p className="label-mono mb-4">04 — about</p>
        <blockquote className="max-w-3xl font-display text-3xl leading-snug sm:text-4xl">
          &ldquo;{SITE.bio.bridge}&rdquo;
        </blockquote>
      </Reveal>

      <div className="mt-14 grid gap-10 sm:grid-cols-2">
        <Reveal>
          <p className="font-mono text-xs text-dev">{"// as a developer"}</p>
          <p className="mt-3 max-w-md leading-relaxed text-fg2">{SITE.about.dev}</p>
        </Reveal>
        <Reveal delay={120}>
          <p className="font-mono text-xs text-photo">— as a photographer</p>
          <p className="mt-3 max-w-md leading-relaxed text-fg2">{SITE.about.photo}</p>
        </Reveal>
      </div>
    </section>
  );
}
