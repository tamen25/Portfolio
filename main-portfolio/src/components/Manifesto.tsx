"use client";

import { useEffect, useRef, useState } from "react";
import { MANIFESTO_LINES } from "@/lib/site";

const FULL = MANIFESTO_LINES.join("\n");

export default function Manifesto() {
  const [text, setText] = useState("");
  const started = useRef(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setTimeout(() => setText(FULL), 0);
      return;
    }
    const el = ref.current;
    if (!el) return;
    let timer: ReturnType<typeof setTimeout>;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting || started.current) return;
      started.current = true;
      io.disconnect();
      let i = 0;
      const tick = () => {
        i += 1 + Math.floor(Math.random() * 2);
        setText(FULL.slice(0, i));
        if (i < FULL.length) timer = setTimeout(tick, 24);
      };
      tick();
    });
    io.observe(el);
    return () => {
      io.disconnect();
      clearTimeout(timer);
    };
  }, []);

  return (
    <div ref={ref} className="overflow-hidden rounded-xl border border-line bg-surface">
      <div className="flex items-center gap-2 border-b border-line px-4 py-2.5">
        <span className="size-2.5 rounded-full bg-fg3/40" />
        <span className="size-2.5 rounded-full bg-fg3/40" />
        <span className="size-2.5 rounded-full bg-fg3/40" />
        <span className="ml-2 font-mono text-xs text-fg3">~/tamen/manifesto.ts</span>
      </div>
      <pre className="min-h-56 whitespace-pre-wrap p-5 font-mono text-sm leading-relaxed text-fg2">
        {text}
        <span className="animate-pulse text-dev">▍</span>
      </pre>
    </div>
  );
}
