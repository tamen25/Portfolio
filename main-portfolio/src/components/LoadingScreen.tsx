"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { SITE } from "@/lib/site";

const DURATION_MS = 2700;

export default function LoadingScreen({
  onComplete,
}: {
  onComplete: () => void;
}) {
  const [count, setCount] = useState(0);
  const [wordIndex, setWordIndex] = useState(0);
  const finished = useRef(false);

  useEffect(() => {
    let raf: number;
    let timeout: ReturnType<typeof setTimeout>;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - start) / DURATION_MS, 1);
      setCount(Math.round(progress * 100));
      if (progress < 1) {
        raf = requestAnimationFrame(tick);
      } else if (!finished.current) {
        finished.current = true;
        timeout = setTimeout(onComplete, 400);
      }
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timeout);
    };
  }, [onComplete]);

  useEffect(() => {
    const id = setInterval(
      () => setWordIndex((i) => (i + 1) % SITE.loadingWords.length),
      900,
    );
    return () => clearInterval(id);
  }, []);

  return (
    <motion.div
      exit={{ opacity: 0, transition: { duration: 0.5 } }}
      className="fixed inset-0 z-[9999] bg-bg"
    >
      <motion.p
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="absolute left-6 top-6 text-xs uppercase tracking-[0.3em] text-muted"
      >
        Portfolio
      </motion.p>

      <div className="absolute inset-0 flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.span
            key={wordIndex}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="font-display text-4xl italic text-text-primary/80 md:text-6xl lg:text-7xl"
          >
            {SITE.loadingWords[wordIndex]}
          </motion.span>
        </AnimatePresence>
      </div>

      <p className="absolute bottom-8 right-6 font-display text-6xl tabular-nums text-text-primary md:text-8xl lg:text-9xl">
        {String(count).padStart(3, "0")}
      </p>

      <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-stroke/50">
        <div
          className="accent-gradient h-full origin-left"
          style={{
            transform: `scaleX(${count / 100})`,
            boxShadow: "0 0 8px rgba(137, 170, 204, 0.35)",
          }}
        />
      </div>
    </motion.div>
  );
}
