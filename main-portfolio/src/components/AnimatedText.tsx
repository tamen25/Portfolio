"use client";

import { Fragment, useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";

function Char({
  char,
  index,
  total,
  progress,
}: {
  char: string;
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const start = index / total;
  const end = start + 1 / total;
  const opacity = useTransform(progress, [start, end], [0.2, 1]);
  return <motion.span style={{ opacity }}>{char}</motion.span>;
}

/**
 * Character-by-character scroll reveal: each character brightens from
 * 0.2 to full opacity as the paragraph moves through the viewport.
 * Words are kept in nowrap spans with plain spaces between them so
 * line-breaking stays natural.
 */
export default function AnimatedText({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.8", "end 0.2"],
  });

  const words = text.split(" ");
  const total = text.length;
  const items = words.map((word, wi) => ({
    word,
    start: words.slice(0, wi).join(" ").length + (wi > 0 ? 1 : 0),
  }));

  return (
    <p ref={ref} className={className}>
      {items.map(({ word, start }, wi) => (
        <Fragment key={wi}>
          <span className="inline-block whitespace-nowrap">
            {word.split("").map((char, ci) => (
              <Char
                key={ci}
                char={char}
                index={start + ci}
                total={total}
                progress={scrollYProgress}
              />
            ))}
          </span>
          {wi < items.length - 1 ? " " : null}
        </Fragment>
      ))}
    </p>
  );
}
