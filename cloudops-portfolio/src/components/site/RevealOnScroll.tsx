"use client";

import { useEffect } from "react";

/**
 * Progressive-enhancement layer for marketing pages. Mounted once near the
 * root; it wires two effects over the existing DOM without owning any markup:
 *
 *  1. Scroll reveal — adds `.revealed` to every `[data-reveal]` element as it
 *     enters the viewport (staggered by each element's own transition-delay).
 *  2. Spotlight — updates `--mx/--my` on `.spotlight-card`s under the cursor so
 *     the ice-blue border glow tracks the pointer.
 *
 * Reduced-motion users get everything revealed immediately (no observer) and
 * no spotlight tracking. If JS never runs, the CSS fallbacks keep content
 * visible — nothing here is required to see the page.
 */
export function RevealOnScroll() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let observer: IntersectionObserver | null = null;

    const targets = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal]"),
    );

    if (reduce) {
      targets.forEach((el) => el.classList.add("revealed"));
    } else {
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              entry.target.classList.add("revealed");
              observer?.unobserve(entry.target);
            }
          }
        },
        { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
      );
      targets.forEach((el) => observer!.observe(el));
    }

    // Spotlight cursor tracking (skipped under reduced motion).
    function onPointerMove(e: PointerEvent) {
      const card = (e.target as HTMLElement | null)?.closest<HTMLElement>(
        ".spotlight-card",
      );
      if (!card) return;
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${e.clientX - r.left}px`);
      card.style.setProperty("--my", `${e.clientY - r.top}px`);
    }
    if (!reduce) {
      window.addEventListener("pointermove", onPointerMove, { passive: true });
    }

    return () => {
      observer?.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
    };
  }, []);

  return null;
}
