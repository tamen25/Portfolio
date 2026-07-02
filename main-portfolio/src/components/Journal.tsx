"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { JOURNAL } from "@/lib/content";
import SectionHeader from "./SectionHeader";

export default function Journal() {
  return (
    <section className="bg-bg py-16 md:py-24">
      <div className="mx-auto max-w-[1200px] px-6 md:px-10 lg:px-16">
        <SectionHeader
          eyebrow="Journal"
          heading={
            <>
              Recent <em className="font-display italic">thoughts</em>
            </>
          }
          subtext="Notes from the field — cloud, code, and long walks with a camera."
          cta={{ label: "View all", href: "#" }}
        />

        <div className="flex flex-col gap-4">
          {JOURNAL.map((entry, i) => (
            <motion.a
              key={entry.id}
              href="#"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: i * 0.06 }}
              viewport={{ once: true, margin: "-60px" }}
              className="group flex items-center gap-6 rounded-[40px] border border-stroke bg-surface/30 p-4 transition-colors duration-300 hover:bg-surface sm:rounded-full"
            >
              <span className="relative h-16 w-16 shrink-0 overflow-hidden rounded-3xl sm:h-14 sm:w-14 sm:rounded-full">
                <Image
                  src={entry.image}
                  alt=""
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium md:text-base">
                  {entry.title}
                </span>
                <span className="block text-xs text-muted">
                  {entry.readTime}
                </span>
              </span>
              <span className="hidden shrink-0 text-xs text-muted sm:block">
                {entry.date}
              </span>
              <span
                aria-hidden
                className="mr-2 hidden text-muted transition-transform duration-300 group-hover:translate-x-1 sm:block"
              >
                →
              </span>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
