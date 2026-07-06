"use client";
import { useState } from "react";
import type { AlgorithmEntry, Lang } from "../types";

const LANGS: Lang[] = ["pseudo", "py", "js", "cpp", "java"];
const LABEL: Record<Lang, string> = { pseudo: "Pseudo", py: "Py", js: "JS", cpp: "C++", java: "Java" };

export function CodePanel({ entry, pseudoLine }: { entry: AlgorithmEntry; pseudoLine?: number }) {
  const [lang, setLang] = useState<Lang>("pseudo");
  const source = lang === "pseudo" ? entry.pseudocode : entry.code[lang]?.split("\n") ?? null;
  return (
    <div className="rounded-lg border border-[var(--color-edge)] bg-[var(--color-stage)]">
      <div className="flex gap-1 border-b border-[var(--color-edge)] px-2 py-1">
        {LANGS.map((l) => (
          <button
            key={l}
            onClick={() => setLang(l)}
            className={`rounded px-2 py-1 font-mono text-xs ${
              lang === l ? "bg-[var(--color-edge)] text-[var(--color-accent)]" : "text-[var(--color-muted)]"
            }`}
          >
            {LABEL[l]}
          </button>
        ))}
      </div>
      <pre className="overflow-auto p-3 font-mono text-xs leading-relaxed">
        {source ? (
          source.map((line, i) => (
            <div
              key={i}
              className={lang === "pseudo" && i === pseudoLine ? "bg-[var(--color-edge)] text-[var(--color-accent)]" : "text-[var(--color-muted)]"}
            >
              {line || " "}
            </div>
          ))
        ) : (
          <div className="text-[var(--color-muted)]">{`// ${LABEL[lang]} coming soon`}</div>
        )}
      </pre>
    </div>
  );
}
