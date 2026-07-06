import Link from "next/link";

export function TrackCard(props: {
  title: string;
  blurb: string;
  href?: string;
  difficulty: string;
  status: "live" | "soon";
}) {
  const live = props.status === "live";
  const body = (
    <div
      className={`rounded-lg border p-6 ${
        live
          ? "border-[var(--color-edge)] bg-[var(--color-panel)] hover:border-[var(--color-accent)]"
          : "border-[var(--color-edge)]/50 opacity-60"
      }`}
    >
      <div className="flex items-center justify-between">
        <h3 className="font-mono text-lg text-[var(--color-ink)]">{props.title}</h3>
        <span className="font-mono text-xs text-[var(--color-muted)]">{props.difficulty}</span>
      </div>
      <p className="mt-3 text-sm text-[var(--color-muted)]">{props.blurb}</p>
      <p className="mt-4 font-mono text-xs text-[var(--color-accent)]">
        {live ? "enter →" : "coming soon"}
      </p>
    </div>
  );
  return live && props.href ? <Link href={props.href}>{body}</Link> : body;
}
