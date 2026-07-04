import { SITE } from "@/lib/site";

const LINKS = [
  { href: "#developer", label: "developer" },
  { href: "#photographer", label: "photographer" },
  { href: "#about", label: "about" },
  { href: "#contact", label: "contact" },
];

export default function Nav() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-line/60 bg-ink/70 backdrop-blur-md">
      <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        <a href="#top" className="font-mono text-sm text-fg">
          tamen.dutta
          <span className="ml-2 text-fg3">/ portfolio</span>
        </a>
        <div className="hidden items-center gap-6 font-mono text-xs text-fg2 sm:flex">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} className="transition-colors hover:text-fg">
              {l.label}
            </a>
          ))}
        </div>
        <a
          href={`mailto:${SITE.email}`}
          className="rounded-full border border-line px-4 py-1.5 font-mono text-xs text-fg transition-colors hover:border-dev hover:text-dev"
        >
          Say hello
        </a>
      </nav>
    </header>
  );
}
