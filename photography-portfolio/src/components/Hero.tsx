"use client";

import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { motion, useReducedMotion } from "motion/react";
import { COLLECTIONS, collectionCover } from "@/lib/photos";
import { LensArt } from "./LensArt";

const HeroShader = dynamic(
  () => import("./HeroShader").then((m) => m.HeroShader),
  { ssr: false },
);

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export function Hero() {
  const reduce = useReducedMotion();

  return (
    <section className="relative flex min-h-[100dvh] items-center overflow-hidden">
      {!reduce && <HeroShader />}

      <motion.div
        aria-hidden
        initial={reduce ? false : { opacity: 0, x: 80, rotate: 6 }}
        animate={{ opacity: 1, x: 0, rotate: 0 }}
        transition={{ duration: 1.6, ease: EASE }}
        className="absolute top-1/2 right-[-52vmin] w-[104vmin] -translate-y-1/2 opacity-60 sm:right-[-38vmin] md:right-[-24vmin] md:opacity-100 lg:right-[-14vmin]"
      >
        <LensArt className="h-auto w-full drop-shadow-[0_0_120px_rgba(19,29,51,0.9)]" />
      </motion.div>

      {/* vignette so the headline stays readable over the glass */}
      <div className="absolute inset-0 bg-gradient-to-r from-night via-night/70 to-transparent md:via-night/40" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-night to-transparent" />

      <div className="relative z-10 mx-auto w-full max-w-[1400px] px-6 pt-24 pb-16">
        <motion.h1
          initial={reduce ? false : { y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.2, ease: EASE }}
          className="max-w-4xl font-serif text-[clamp(3rem,7vw,5.75rem)] leading-[1.06] font-medium tracking-tight text-balance"
        >
          Capturing <em className="text-alpenglow/90">moments</em> the light
          leaves behind
        </motion.h1>

        <motion.p
          initial={reduce ? false : { y: 28, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.45, ease: EASE }}
          className="mt-6 max-w-md leading-relaxed text-overcast"
        >
          Landscape photography from long walks and early starts: Iceland&rsquo;s
          ring road, the high Himalaya, and the night sky, photographed slowly.
        </motion.p>

        <motion.div
          initial={reduce ? false : { y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.6, ease: EASE }}
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
            className="text-sm text-overcast underline-offset-4 transition-colors hover:text-snowlight hover:underline"
          >
            Prints &amp; commissions
          </a>
        </motion.div>

        <motion.div
          initial={reduce ? false : { y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.8, ease: EASE }}
          className="mt-16 flex gap-3"
        >
          {COLLECTIONS.slice(0, 3).map((c) => {
            const cover = collectionCover(c.id);
            return (
              <Link
                key={c.id}
                href={`/portfolio#${c.id}`}
                className="group relative block w-24 overflow-hidden rounded-md ring-1 ring-snowlight/15 sm:w-28"
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
    </section>
  );
}
