"use client";

import { motion } from "motion/react";
import RingLink from "./RingLink";

type SectionHeaderProps = {
  eyebrow: string;
  heading: React.ReactNode;
  subtext: string;
  cta?: { label: string; href: string; external?: boolean };
};

export default function SectionHeader({
  eyebrow,
  heading,
  subtext,
  cta,
}: SectionHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
      viewport={{ once: true, margin: "-100px" }}
      className="mb-10 flex flex-col gap-4 md:mb-14 md:flex-row md:items-end md:justify-between"
    >
      <div>
        <div className="mb-4 flex items-center gap-3">
          <span className="h-px w-8 bg-stroke" />
          <span className="text-xs uppercase tracking-[0.3em] text-muted">
            {eyebrow}
          </span>
        </div>
        <h2 className="text-3xl tracking-tight md:text-5xl">{heading}</h2>
        <p className="mt-3 max-w-md text-sm text-muted md:text-base">
          {subtext}
        </p>
      </div>
      {cta && (
        <RingLink
          href={cta.href}
          external={cta.external}
          wrapperClassName="hidden md:inline-flex"
          className="border-2 border-stroke bg-bg px-5 py-2.5 text-sm group-hover:border-transparent"
        >
          {cta.label} <span aria-hidden>→</span>
        </RingLink>
      )}
    </motion.div>
  );
}
