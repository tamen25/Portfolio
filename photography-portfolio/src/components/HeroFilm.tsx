"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useReducedMotion } from "motion/react";

const STILL = "/hero/aurora-still-4k.png"; // 4K source; next/image serves optimized webp
const POSTER = "/hero/aurora-still-4k.webp"; // light placeholder for the <video>
const FILM = "/hero/aurora-4k.mp4";

/**
 * Full-bleed cinemagraph hero background: Tamen's own "Aurora over Kirkjufell"
 * frame, brought to life (the aurora drifts, the falls flow, the mountain stays
 * still). The still (a crisp 4K frame, delivered optimized) paints first; the
 * heavier 4K film is only fetched once the page has settled, so it never
 * competes with first load. Reduced-motion keeps the still — the same photo.
 */
export function HeroFilm() {
  const reduce = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [src, setSrc] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  // Defer loading the film until the page is idle.
  useEffect(() => {
    if (reduce) return;
    let done = false;
    const load = () => {
      if (done) return;
      done = true;
      setSrc(FILM);
    };
    if (document.readyState === "complete") {
      const idle =
        (window as unknown as { requestIdleCallback?: (cb: () => void) => number })
          .requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 400));
      idle(load);
    } else {
      window.addEventListener("load", () => setTimeout(load, 300), { once: true });
    }
  }, [reduce]);

  // Pause the video when the hero scrolls away — no reason to decode off-screen.
  useEffect(() => {
    const v = videoRef.current;
    if (!v || !src) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) v.play().catch(() => {});
        else v.pause();
      },
      { threshold: 0.05 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, [src]);

  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden bg-night">
      {/* Crisp still paints first and covers reduced-motion. */}
      <Image
        src={STILL}
        alt=""
        fill
        priority
        sizes="100vw"
        className="scale-[1.06] object-cover object-center"
      />
      {src && (
        <video
          ref={videoRef}
          className={`absolute inset-0 h-full w-full scale-[1.06] object-cover object-center transition-opacity duration-1000 ${
            ready ? "opacity-100" : "opacity-0"
          }`}
          src={src}
          poster={POSTER}
          muted
          loop
          playsInline
          autoPlay
          preload="auto"
          onCanPlay={() => setReady(true)}
          onLoadedData={() => setReady(true)}
        />
      )}
    </div>
  );
}
