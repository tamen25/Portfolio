"use client";

import { useEffect, useState } from "react";
import { COLLECTIONS } from "@/lib/photos";

/**
 * Sticky jump bar for the portfolio page: one pill per collection, the
 * section currently in view highlighted. Tracking uses IntersectionObserver
 * against a band near the top of the viewport, so there is no scroll
 * listener and nothing runs per frame.
 */
export function CollectionNav() {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const sections = COLLECTIONS.map((c) =>
      document.getElementById(c.id),
    ).filter((el): el is HTMLElement => el !== null);

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-20% 0px -70% 0px" },
    );
    for (const s of sections) io.observe(s);
    return () => io.disconnect();
  }, []);

  return (
    <nav
      aria-label="Collections"
      className="sticky top-16 z-30 -mx-6 bg-night/85 px-6 py-3 backdrop-blur-md"
    >
      <ul className="flex gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {COLLECTIONS.map((c) => (
          <li key={c.id}>
            <a
              href={`#${c.id}`}
              aria-current={active === c.id ? "true" : undefined}
              className={`inline-flex h-9 items-center rounded-full border px-4 text-sm whitespace-nowrap transition-colors ${
                active === c.id
                  ? "border-alpenglow bg-alpenglow text-night"
                  : "border-snowlight/15 text-overcast hover:border-snowlight/40 hover:text-snowlight"
              }`}
            >
              {c.name}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
