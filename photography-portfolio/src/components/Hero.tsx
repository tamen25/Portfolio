"use client";

import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { motion, useReducedMotion } from "motion/react";
import { HERO_PHOTO } from "@/lib/photos";
import { HorizonRule } from "./HorizonRule";

const HeroShader = dynamic(
  () => import("./HeroShader").then((m) => m.HeroShader),
  { ssr: false },
);

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export function Hero() {
  const reduce = useReducedMotion();

  return (
    <section className="relative flex min-h-[100dvh] items-end overflow-hidden">
      <motion.div
        className="absolute inset-0"
        initial={reduce ? false : { scale: 1.06, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.4, ease: EASE }}
      >
        <Image
          src={HERO_PHOTO.src}
          alt={HERO_PHOTO.alt}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-night via-night/30 to-night/10" />
      </motion.div>
      {!reduce && <HeroShader />}
      <div className="relative z-10 mx-auto w-full max-w-[1400px] px-6 pb-24">
        <motion.h1
          initial={reduce ? false : { y: 32, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.5, ease: EASE }}
          className="max-w-3xl font-display text-5xl font-medium tracking-tight md:text-7xl"
        >
          Landscapes, in their own light.
        </motion.h1>
        <motion.div
          initial={reduce ? false : { scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.1, delay: 0.8, ease: EASE }}
          className="my-6 origin-left"
        >
          <HorizonRule />
        </motion.div>
        <motion.div
          initial={reduce ? false : { y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.9, delay: 1.0, ease: EASE }}
          className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between"
        >
          <p className="max-w-md text-overcast">
            Mountains, coasts, and night skies, photographed slowly.
          </p>
          <Link
            href="/portfolio"
            className="inline-flex h-12 items-center rounded-full bg-alpenglow px-7 text-sm font-medium text-night transition-transform hover:scale-[1.02] active:scale-[0.98]"
          >
            View portfolio
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
