"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { WORKS, type WorkCard } from "@/lib/content";
import SectionHeader from "./SectionHeader";

function CardBody({ card }: { card: WorkCard }) {
  return (
    <div className="group relative h-full w-full cursor-pointer overflow-hidden rounded-3xl border border-stroke bg-surface">
      {card.image ? (
        <Image
          src={card.image}
          alt={card.alt}
          fill
          sizes="(min-width: 768px) 50vw, 100vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
      ) : (
        <div aria-hidden className={`absolute inset-0 ${card.art ?? ""}`} />
      )}

      <div
        aria-hidden
        className="halftone absolute inset-0 opacity-20 mix-blend-multiply"
      />

      <div className="absolute bottom-4 left-5 z-10 text-left transition-opacity duration-300 group-hover:opacity-0">
        <p className="text-sm font-medium text-text-primary">{card.title}</p>
        <p className="text-xs text-muted">{card.category}</p>
      </div>

      <div className="absolute inset-0 flex items-center justify-center bg-bg/70 opacity-0 backdrop-blur-lg transition-opacity duration-500 group-hover:opacity-100">
        <span className="animate-gradient-shift inline-flex rounded-full p-[2px]">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-5 py-2.5 text-sm text-black">
            {card.href ? (
              <>
                View — <em className="font-display italic">{card.title}</em>
              </>
            ) : (
              <>Coming soon</>
            )}
          </span>
        </span>
      </div>
    </div>
  );
}

export default function Works() {
  return (
    <section id="work" className="bg-bg py-12 md:py-16">
      <div className="mx-auto max-w-[1200px] px-6 md:px-10 lg:px-16">
        <SectionHeader
          eyebrow="Selected Work"
          heading={
            <>
              Featured <em className="font-display italic">projects</em>
            </>
          }
          subtext="A selection of projects I've worked on, from concept to launch."
          cta={{ label: "View all work", href: "#work" }}
        />

        <div className="grid grid-cols-1 gap-5 md:grid-cols-12 md:gap-6">
          {WORKS.map((card, i) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                delay: (i % 2) * 0.1,
                ease: [0.25, 0.1, 0.25, 1],
              }}
              viewport={{ once: true, margin: "-80px" }}
              className={card.layout}
            >
              {card.href ? (
                <a
                  href={card.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`Open ${card.title}`}
                  className="block h-full w-full"
                >
                  <CardBody card={card} />
                </a>
              ) : (
                <CardBody card={card} />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
