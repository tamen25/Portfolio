import Link from "next/link";

export function Nav() {
  return (
    <nav className="flex items-center gap-6 border-b border-[var(--color-edge)] px-8 py-4">
      <Link href="/" className="font-mono text-sm text-[var(--color-accent)]">learn·platform</Link>
      <Link href="/dsa" className="text-sm text-[var(--color-muted)] hover:text-[var(--color-ink)]">DSA</Link>
      <Link href="/system-design" className="text-sm text-[var(--color-muted)] hover:text-[var(--color-ink)]">System Design</Link>
      <span className="text-sm text-[var(--color-edge)]">FDE · soon</span>
    </nav>
  );
}
