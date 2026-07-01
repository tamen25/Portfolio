import Link from "next/link";
import { SITE } from "@/lib/site";
import { HorizonRule } from "./HorizonRule";

export function Footer() {
  return (
    <footer className="mt-32">
      <HorizonRule />
      <div className="mx-auto flex max-w-[1400px] flex-col gap-6 px-6 py-12 md:flex-row md:items-center md:justify-between">
        <p className="font-display text-lg font-medium">{SITE.name}</p>
        <div className="flex gap-8 text-sm text-overcast">
          <Link href="/portfolio" className="transition-colors hover:text-snowlight">
            Portfolio
          </Link>
          <Link href="/#about" className="transition-colors hover:text-snowlight">
            About
          </Link>
          <Link href="/#contact" className="transition-colors hover:text-snowlight">
            Contact
          </Link>
          {SITE.instagram && (
            <a
              href={SITE.instagram}
              target="_blank"
              rel="noreferrer"
              className="transition-colors hover:text-snowlight"
            >
              Instagram
            </a>
          )}
        </div>
        <p className="text-sm text-overcast">© 2026 {SITE.name}</p>
      </div>
    </footer>
  );
}
