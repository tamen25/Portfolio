"use client";

import { motion } from "motion/react";
import { STATS } from "@/lib/content";

export default function Stats() {
  return (
    <section className="bg-bg py-16 md:py-24">
      <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-10 px-6 sm:grid-cols-3 md:px-10 lg:px-16">
        {STATS.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: i * 0.1 }}
            viewport={{ once: true, margin: "-80px" }}
            className="text-center"
          >
            <p className="font-display text-6xl italic md:text-7xl">
              {stat.value}
            </p>
            <p className="mt-2 text-sm uppercase tracking-[0.2em] text-muted">
              {stat.label}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
