"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { SITE } from "@/lib/site";
import HlsVideo from "./HlsVideo";
import RingLink from "./RingLink";

export default function Hero({ started }: { started: boolean }) {
  const rootRef = useRef<HTMLElement>(null);
  const [roleIndex, setRoleIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(
      () => setRoleIndex((i) => (i + 1) % SITE.roles.length),
      2000,
    );
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!started || !rootRef.current) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.fromTo(
        ".name-reveal",
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1.2 },
        0.1,
      );
      tl.fromTo(
        ".blur-in",
        { opacity: 0, y: 20, filter: "blur(10px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 1, stagger: 0.1 },
        0.3,
      );
    }, rootRef);
    return () => ctx.revert();
  }, [started]);

  return (
    <section
      id="home"
      ref={rootRef}
      className="relative flex min-h-screen items-center justify-center overflow-hidden"
    >
      <div className="absolute inset-0">
        <HlsVideo />
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-bg to-transparent" />
      </div>

      <div className="relative z-10 flex flex-col items-center px-6 text-center">
        <p className="blur-in mb-8 text-xs uppercase tracking-[0.3em] text-muted opacity-0">
          Collection &rsquo;26
        </p>
        <h1 className="name-reveal mb-6 font-display text-6xl italic leading-[0.9] tracking-tight text-text-primary opacity-0 md:text-8xl lg:text-9xl">
          {SITE.name}
        </h1>
        <p className="blur-in mb-4 text-sm text-muted opacity-0 md:text-base">
          A{" "}
          <span
            key={roleIndex}
            className="animate-role-fade-in inline-block font-display italic text-text-primary"
          >
            {SITE.roles[roleIndex]}
          </span>{" "}
          lives in {SITE.city}.
        </p>
        <p className="blur-in mb-12 max-w-md text-sm text-muted opacity-0 md:text-base">
          {SITE.description}
        </p>
        <div className="blur-in inline-flex gap-4 opacity-0">
          <RingLink
            href="#work"
            wrapperClassName="transition-transform duration-300 hover:scale-105"
            className="bg-text-primary px-7 py-3.5 text-sm font-medium text-bg group-hover:bg-bg group-hover:text-text-primary"
          >
            See Works
          </RingLink>
          <RingLink
            href={`mailto:${SITE.email}`}
            wrapperClassName="transition-transform duration-300 hover:scale-105"
            className="border-2 border-stroke bg-bg px-7 py-3.5 text-sm group-hover:border-transparent"
          >
            Reach out...
          </RingLink>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-3">
        <span className="text-xs uppercase tracking-[0.2em] text-muted">
          Scroll
        </span>
        <span className="relative block h-10 w-px overflow-hidden bg-stroke">
          <span className="animate-scroll-down absolute left-0 top-0 h-1/2 w-full bg-text-primary" />
        </span>
      </div>
    </section>
  );
}
