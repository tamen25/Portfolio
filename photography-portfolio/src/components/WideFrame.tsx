"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "motion/react";

gsap.registerPlugin(ScrollTrigger);

export function WideFrame() {
  const wrap = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce || !wrap.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".wide-frame-img",
        { scale: 1.14 },
        {
          scale: 1,
          ease: "none",
          scrollTrigger: {
            trigger: wrap.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        },
      );
    }, wrap);
    return () => ctx.revert();
  }, [reduce]);

  return (
    <section className="pt-32">
      <div ref={wrap} className="relative aspect-[2.4/1] w-full overflow-hidden">
        <Image
          src="/hero/panorama-4k.png"
          alt="Low sun breaking through cloud over an Icelandic valley"
          fill
          sizes="100vw"
          quality={95}
          className="wide-frame-img object-cover will-change-transform"
        />
      </div>
      <p className="mx-auto max-w-[1400px] px-6 pt-3 font-exif text-xs text-overcast">
        Iceland · at the edge of the light
      </p>
    </section>
  );
}
