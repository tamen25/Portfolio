"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { SITE, SOCIALS } from "@/lib/site";
import HlsVideo from "./HlsVideo";
import RingLink from "./RingLink";

export default function Footer() {
  const marqueeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!marqueeRef.current) return;
    const tween = gsap.to(marqueeRef.current, {
      xPercent: -50,
      duration: 40,
      ease: "none",
      repeat: -1,
    });
    return () => {
      tween.kill();
    };
  }, []);

  return (
    <footer
      id="contact"
      className="relative overflow-hidden bg-bg pb-8 pt-16 md:pb-12 md:pt-20"
    >
      <div className="absolute inset-0">
        <HlsVideo className="scale-y-[-1]" />
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute left-0 right-0 top-0 h-32 bg-gradient-to-b from-bg to-transparent" />
      </div>

      <div className="relative z-10">
        {/* Marquee: two identical halves so xPercent -50 loops seamlessly */}
        <div ref={marqueeRef} className="flex w-max whitespace-nowrap">
          {[0, 1].map((half) => (
            <span
              key={half}
              className="font-display text-5xl italic text-text-primary/90 md:text-7xl"
            >
              {Array.from({ length: 10 }, () => "BUILDING THE FUTURE • ").join(
                "",
              )}
            </span>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center gap-8 px-6">
          <RingLink
            href={`mailto:${SITE.email}`}
            wrapperClassName="transition-transform duration-300 hover:scale-105"
            className="border-2 border-stroke bg-bg px-8 py-4 text-sm group-hover:border-transparent md:text-base"
          >
            {SITE.email} <span aria-hidden>↗</span>
          </RingLink>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-6 border-t border-stroke/60 px-6 pt-8 sm:flex-row md:px-10 lg:px-16">
          <div className="flex gap-5">
            {SOCIALS.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                className="text-xs uppercase tracking-[0.15em] text-muted transition-colors hover:text-text-primary"
              >
                {social.label}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-2 text-xs text-muted">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            Available for projects
          </div>
        </div>
      </div>
    </footer>
  );
}
