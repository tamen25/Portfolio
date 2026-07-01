"use client";

import Link from "next/link";
import { useState } from "react";
import { useMotionValueEvent, useScroll } from "motion/react";
import { List, X } from "@phosphor-icons/react";
import { SITE } from "@/lib/site";

const LINKS = [
  { href: "/portfolio", label: "Portfolio" },
  { href: "/#about", label: "About" },
  { href: "/#contact", label: "Contact" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 24));

  const solid = scrolled || open;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-colors duration-300 ${
        solid ? "bg-night/80 backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-6">
        <Link href="/" className="font-display text-lg font-medium tracking-tight">
          {SITE.name}
        </Link>
        <div className="hidden items-center gap-8 md:flex">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm text-overcast transition-colors hover:text-snowlight focus-visible:text-snowlight"
            >
              {l.label}
            </Link>
          ))}
        </div>
        <button
          type="button"
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
          className="text-snowlight md:hidden"
        >
          {open ? <X size={24} /> : <List size={24} />}
        </button>
      </nav>
      {open && (
        <div className="border-t border-ridge px-6 pb-6 md:hidden">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block py-3 text-lg"
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
