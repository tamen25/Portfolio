"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { COLLECTIONS, collectionCover } from "@/lib/photos";
import { HeroFilm } from "./HeroFilm";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

// "Capturing moments the light leaves behind" — revealed word by word.
const HEAD = [
  { t: "Capturing" },
  { t: "moments", em: true },
  { t: "the" },
  { t: "light" },
  { t: "leaves" },
  { t: "behind" },
];

export function Hero() {
  const reduce = useReducedMotion();

  return (
    <section className="relative flex min-h-[100dvh] items-center overflow-hidden">
      <HeroFilm />

      {/* Legibility scrims over the film. */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-night via-night/70 to-transparent md:via-night/45" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-night/90 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-52 bg-gradient-to-t from-night via-night/50 to-transparent" />

      <div className="relative z-10 mx-auto w-full max-w-[1400px] px-6 pt-24 pb-16">
        <motion.p
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE }}
          className="mb-6 font-exif text-xs tracking-[0.32em] text-overcast uppercase"
        >
          Field series — Iceland · Himalaya · Deep sky
        </motion.p>

        <h1 className="max-w-4xl font-serif text-[clamp(3rem,7vw,5.75rem)] leading-[1.04] font-medium tracking-tight text-balance">
          {HEAD.map((w, i) => (
            <span key={i} className="inline-block overflow-hidden align-baseline">
              <motion.span
                className={`inline-block ${w.em ? "text-alpenglow italic" : ""}`}
                initial={reduce ? false : { y: "110%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.9, delay: 0.15 + i * 0.08, ease: EASE }}
              >
                {w.t}
              </motion.span>
              {i < HEAD.length - 1 && " "}
            </span>
          ))}
        </h1>

        <motion.p
          initial={reduce ? false : { y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.7, ease: EASE }}
          className="mt-6 max-w-md leading-relaxed text-snowlight/75"
        >
          Landscape photography from long walks and early starts: Iceland&rsquo;s
          ring road, the high Himalaya, and the night sky, photographed slowly.
        </motion.p>

        <motion.div
          initial={reduce ? false : { y: 22, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.85, ease: EASE }}
          className="mt-9 flex flex-wrap items-center gap-6"
        >
          <Link
            href="/portfolio"
            className="inline-flex h-12 items-center rounded-full bg-alpenglow px-7 text-sm font-medium text-night transition-transform hover:scale-[1.02] active:scale-[0.98]"
          >
            View projects
          </Link>
          <a
            href="#contact"
            className="text-sm text-snowlight/80 underline-offset-4 transition-colors hover:text-snowlight hover:underline"
          >
            Prints &amp; commissions
          </a>
        </motion.div>

        <motion.div
          initial={reduce ? false : { y: 22, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.9, delay: 1, ease: EASE }}
          className="mt-16 flex items-end gap-3"
        >
          {COLLECTIONS.slice(0, 3).map((c) => {
            const cover = collectionCover(c.id);
            return (
              <Link
                key={c.id}
                href={`/portfolio#${c.id}`}
                className="group relative block w-24 overflow-hidden rounded-md ring-1 ring-snowlight/15 transition duration-300 hover:ring-alpenglow/50 sm:w-28"
                aria-label={`${c.name} collection`}
              >
                <Image
                  src={cover.src}
                  alt={cover.alt}
                  width={cover.width}
                  height={cover.height}
                  sizes="112px"
                  className="aspect-[3/2] w-full object-cover opacity-80 transition duration-500 group-hover:scale-105 group-hover:opacity-100"
                />
              </Link>
            );
          })}
        </motion.div>
      </div>

      {/* This is his frame — say so. */}
      <p className="absolute right-6 bottom-6 z-10 hidden font-exif text-[0.65rem] tracking-[0.18em] text-snowlight/45 md:block">
        AURORA OVER KIRKJUFELL · TAMEN DUTTA
      </p>
    </section>
  );
}
