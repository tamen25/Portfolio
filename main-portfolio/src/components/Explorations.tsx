"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AnimatePresence, motion } from "motion/react";
import { EXPLORATIONS } from "@/lib/content";
import RingLink from "./RingLink";

gsap.registerPlugin(ScrollTrigger);

export default function Explorations() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);
  const rightColRef = useRef<HTMLDivElement>(null);
  const [lightbox, setLightbox] = useState<number | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "bottom bottom",
        pin: contentRef.current,
        pinSpacing: false,
      });

      gsap.fromTo(
        leftColRef.current,
        { y: 0 },
        {
          y: -400,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        },
      );

      gsap.fromTo(
        rightColRef.current,
        { y: 160 },
        {
          y: -700,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        },
      );
    }, section);

    return () => ctx.revert();
  }, []);

  const left = EXPLORATIONS.filter((_, i) => i % 2 === 0);
  const right = EXPLORATIONS.filter((_, i) => i % 2 === 1);

  return (
    <section ref={sectionRef} className="relative min-h-[300vh] bg-bg">
      {/* Layer 1: pinned center copy */}
      <div
        ref={contentRef}
        className="z-10 flex h-screen flex-col items-center justify-center px-6 text-center"
      >
        <div className="mb-4 flex items-center gap-3">
          <span className="h-px w-8 bg-stroke" />
          <span className="text-xs uppercase tracking-[0.3em] text-muted">
            Explorations
          </span>
          <span className="h-px w-8 bg-stroke" />
        </div>
        <h2 className="text-3xl tracking-tight md:text-5xl">
          Visual <em className="font-display italic">playground</em>
        </h2>
        <p className="mt-3 max-w-md text-sm text-muted md:text-base">
          Sketches, frames, and experiments that never made it to a case
          study — but taught me something anyway.
        </p>
        <RingLink
          href="https://dribbble.com"
          external
          wrapperClassName="mt-8 transition-transform duration-300 hover:scale-105"
          className="border-2 border-stroke bg-bg px-6 py-3 text-sm group-hover:border-transparent"
        >
          Dribbble <span aria-hidden>↗</span>
        </RingLink>
      </div>

      {/* Layer 2: parallax columns */}
      <div className="pointer-events-none absolute inset-0 z-20">
        <div className="mx-auto grid h-full max-w-[1400px] grid-cols-2 gap-12 px-6 md:gap-40 md:px-10">
          <div
            ref={leftColRef}
            className="flex flex-col items-start gap-24 pt-[60vh]"
          >
            {left.map((item) => (
              <ExplorationCard
                key={item.id}
                image={item.image}
                alt={item.alt}
                rotate={item.rotate}
                onOpen={() =>
                  setLightbox(EXPLORATIONS.findIndex((e) => e.id === item.id))
                }
              />
            ))}
          </div>
          <div
            ref={rightColRef}
            className="flex flex-col items-end gap-24 pt-[100vh]"
          >
            {right.map((item) => (
              <ExplorationCard
                key={item.id}
                image={item.image}
                alt={item.alt}
                rotate={item.rotate}
                onOpen={() =>
                  setLightbox(EXPLORATIONS.findIndex((e) => e.id === item.id))
                }
              />
            ))}
          </div>
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(null)}
            className="fixed inset-0 z-[100] flex cursor-zoom-out items-center justify-center bg-bg/90 p-6 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.92 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="relative aspect-square w-full max-w-2xl overflow-hidden rounded-3xl"
            >
              <Image
                src={EXPLORATIONS[lightbox].image}
                alt={EXPLORATIONS[lightbox].alt}
                fill
                sizes="(min-width: 768px) 42rem, 100vw"
                className="object-cover"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function ExplorationCard({
  image,
  alt,
  rotate,
  onOpen,
}: {
  image: string;
  alt: string;
  rotate: string;
  onOpen: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={`View ${alt}`}
      className={`pointer-events-auto relative aspect-square w-full max-w-[320px] cursor-zoom-in overflow-hidden rounded-3xl border border-stroke transition-transform duration-500 hover:scale-[1.03] ${rotate}`}
    >
      <Image
        src={image}
        alt={alt}
        fill
        sizes="320px"
        className="object-cover"
      />
    </button>
  );
}
