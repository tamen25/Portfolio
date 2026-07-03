"use client";

import { useEffect, useRef, useState } from "react";
import { MARQUEE_ROW_1, MARQUEE_ROW_2 } from "@/lib/content";

function Row({ images, x }: { images: string[]; x: number }) {
  return (
    <div
      className="flex gap-3"
      style={{ transform: `translateX(${x}px)`, willChange: "transform" }}
    >
      {[...images, ...images, ...images].map((src, i) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={i}
          src={src}
          alt=""
          loading="lazy"
          className="h-[270px] w-[420px] max-w-none shrink-0 rounded-2xl object-cover"
        />
      ))}
    </div>
  );
}

/** Two image rows that slide opposite ways, driven by page scroll. */
export default function MarqueeSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const el = sectionRef.current;
      if (!el) return;
      const sectionTop = el.getBoundingClientRect().top + window.scrollY;
      setOffset((window.scrollY - sectionTop + window.innerHeight) * 0.3);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="flex flex-col gap-3 bg-[#0C0C0C] pb-10 pt-24 sm:pt-32 md:pt-40"
    >
      <Row images={MARQUEE_ROW_1} x={offset - 200} />
      <Row images={MARQUEE_ROW_2} x={-(offset - 200)} />
    </section>
  );
}
