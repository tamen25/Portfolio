"use client";

import { useEffect, useState } from "react";
import { SITE } from "@/lib/site";
import RingLink from "./RingLink";

const LINKS = [
  { label: "Home", href: "#home" },
  { label: "Work", href: "#work" },
  { label: "Resume", href: "#" }, // placeholder until a resume exists
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("Home");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 100);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed left-0 right-0 top-0 z-50 flex justify-center px-4 pt-4 md:pt-6">
      <nav
        className={`inline-flex items-center rounded-full border border-white/10 bg-surface px-2 py-2 backdrop-blur-md transition-shadow duration-300 ${
          scrolled ? "shadow-md shadow-black/10" : ""
        }`}
      >
        <a
          href="#home"
          aria-label="Home"
          onClick={() => setActive("Home")}
          className="accent-gradient group relative grid h-9 w-9 place-items-center rounded-full transition-transform duration-300 hover:scale-110"
        >
          <span
            aria-hidden
            className="accent-gradient-reverse absolute inset-0 rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          />
          <span className="relative grid h-[30px] w-[30px] place-items-center rounded-full bg-bg font-display text-[13px] italic">
            {SITE.initials}
          </span>
        </a>

        <span className="mx-1 hidden h-5 w-px bg-stroke sm:block" />

        {LINKS.map((link) => (
          <a
            key={link.label}
            href={link.href}
            onClick={() => setActive(link.label)}
            className={`rounded-full px-3 py-1.5 text-xs transition-colors sm:px-4 sm:py-2 sm:text-sm ${
              active === link.label
                ? "bg-stroke/50 text-text-primary"
                : "text-muted hover:bg-stroke/50 hover:text-text-primary"
            }`}
          >
            {link.label}
          </a>
        ))}

        <span className="mx-1 hidden h-5 w-px bg-stroke sm:block" />

        <RingLink
          href={`mailto:${SITE.email}`}
          className="bg-surface px-3 py-1.5 text-xs backdrop-blur-md sm:px-4 sm:py-2 sm:text-sm"
        >
          Say hi <span aria-hidden>↗</span>
        </RingLink>
      </nav>
    </header>
  );
}
