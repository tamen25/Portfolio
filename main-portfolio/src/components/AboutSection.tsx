"use client";

import { ABOUT } from "@/lib/content";
import AnimatedText from "./AnimatedText";
import ContactButton from "./ContactButton";
import FadeIn from "./FadeIn";

export default function AboutSection() {
  return (
    <section
      id="about"
      className="relative flex min-h-screen items-center justify-center px-5 py-20 sm:px-8 md:px-10"
    >
      {ABOUT.decorations.map((deco) => (
        <FadeIn
          key={deco.id}
          delay={deco.delay}
          x={deco.x}
          y={0}
          duration={0.9}
          className={`absolute ${deco.position}`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={deco.src} alt={deco.alt} className="w-full" />
        </FadeIn>
      ))}

      <div className="flex flex-col items-center">
        <FadeIn delay={0} y={40}>
          <h2
            className="hero-heading text-center font-black uppercase leading-none tracking-tight"
            style={{ fontSize: "clamp(3rem, 12vw, 160px)" }}
          >
            {ABOUT.heading}
          </h2>
        </FadeIn>

        <div className="mt-10 sm:mt-14 md:mt-16">
          <AnimatedText
            text={ABOUT.text}
            className="max-w-[560px] text-center font-medium leading-relaxed text-[#D7E2EA]"
          />
        </div>

        <div className="mt-16 sm:mt-20 md:mt-24">
          <ContactButton />
        </div>
      </div>
    </section>
  );
}
