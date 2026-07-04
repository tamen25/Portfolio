import { SITE } from "@/lib/site";
import Reveal from "./Reveal";

export default function About() {
  return (
    <section id="about" className="mx-auto max-w-6xl scroll-mt-14 px-6 py-20">
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
        <Reveal className="lg:col-span-7">
          <p className="label-mono mb-4">04 — about</p>
          <blockquote className="font-display text-3xl leading-snug sm:text-4xl">
            &ldquo;{SITE.bio.bridge}&rdquo;
          </blockquote>
        </Reveal>

        <div className="lg:col-span-5 lg:border-l lg:border-line/60 lg:pl-14">
          <Reveal className="border-b border-line/60 pb-7">
            <p className="font-mono text-xs text-dev">{"// as a developer"}</p>
            <p className="mt-3 leading-relaxed text-fg2">{SITE.about.dev}</p>
          </Reveal>
          <Reveal delay={120} className="pt-7">
            <p className="font-mono text-xs text-photo">— as a photographer</p>
            <p className="mt-3 leading-relaxed text-fg2">{SITE.about.photo}</p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
