import Link from "next/link";
import { SITE } from "@/lib/site";
import { COLLECTIONS } from "@/lib/photos";
import { HorizonRule } from "./HorizonRule";
import { LensArt } from "./LensArt";
import { NewsletterForm } from "./NewsletterForm";

const SITE_LINKS = [
  { href: "/portfolio", label: "Portfolio" },
  { href: "/#about", label: "About" },
  { href: "/#contact", label: "Contact" },
];

function ColumnHeading({ children }: { children: string }) {
  return (
    <h3 className="font-exif text-xs tracking-[0.2em] text-overcast uppercase">
      {children}
    </h3>
  );
}

export function Footer() {
  return (
    <footer className="relative mt-36 overflow-hidden">
      <HorizonRule />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-48 -bottom-72 w-[40rem] opacity-[0.07]"
      >
        <LensArt className="h-auto w-full" />
      </div>

      <div className="relative mx-auto grid max-w-[1400px] gap-12 px-6 py-16 md:grid-cols-12">
        <div className="md:col-span-5">
          <p className="font-serif text-2xl font-medium tracking-tight">
            {SITE.name}
          </p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-overcast">
            One email when a new collection goes up. No noise, no schedule.
            The light decides.
          </p>
          <NewsletterForm />
        </div>

        <nav className="md:col-span-2 md:col-start-7" aria-label="Site">
          <ColumnHeading>Site</ColumnHeading>
          <ul className="mt-4 space-y-3 text-sm">
            {SITE_LINKS.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="text-overcast transition-colors hover:text-snowlight"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav className="md:col-span-2" aria-label="Collections">
          <ColumnHeading>Collections</ColumnHeading>
          <ul className="mt-4 space-y-3 text-sm">
            {COLLECTIONS.map((c) => (
              <li key={c.id}>
                <Link
                  href={`/portfolio#${c.id}`}
                  className="text-overcast transition-colors hover:text-snowlight"
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="md:col-span-2">
          <ColumnHeading>Contact</ColumnHeading>
          <ul className="mt-4 space-y-3 text-sm">
            <li>
              <a
                href={`mailto:${SITE.email}`}
                className="text-overcast transition-colors hover:text-snowlight"
              >
                {SITE.email}
              </a>
            </li>
            {SITE.instagram && (
              <li>
                <a
                  href={SITE.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="text-overcast transition-colors hover:text-snowlight"
                >
                  Instagram
                </a>
              </li>
            )}
            <li className="text-overcast">Prints ship worldwide.</li>
          </ul>
        </div>
      </div>

      <div className="relative border-t border-ridge">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-2 px-6 py-6 text-xs text-overcast sm:flex-row sm:items-center sm:justify-between">
          <p>
            © 2026 {SITE.name}. All photographs © the artist.
          </p>
          <p className="font-exif">Photographed slowly.</p>
        </div>
      </div>
    </footer>
  );
}
