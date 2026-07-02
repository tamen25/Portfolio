"use client";

import { useState } from "react";

// No mailing-list backend yet; the form validates and confirms locally so the
// footer behaves like the finished site while the list provider is chosen.
export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "error" | "done">("idle");

  if (state === "done") {
    return (
      <p className="mt-5 text-sm text-snowlight">
        Added. The next field note will reach you.
      </p>
    );
  }

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
          setState("done");
        } else {
          setState("error");
        }
      }}
      className="mt-5 max-w-sm"
    >
      <div className="flex overflow-hidden rounded-full bg-night ring-1 ring-snowlight/15 transition focus-within:ring-alpenglow/60">
        <input
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (state === "error") setState("idle");
          }}
          placeholder="you@example.com"
          aria-label="Email address"
          aria-invalid={state === "error"}
          className="h-11 min-w-0 flex-1 bg-transparent px-5 text-sm text-snowlight placeholder:text-overcast/60 focus:outline-none"
        />
        <button
          type="submit"
          className="px-5 text-sm font-medium text-night transition-colors bg-alpenglow hover:bg-alpenglow/90 active:scale-[0.98]"
        >
          Submit
        </button>
      </div>
      {state === "error" && (
        <p role="alert" className="mt-2 text-xs text-alpenglow">
          That email doesn&rsquo;t look right. Check it and try again.
        </p>
      )}
    </form>
  );
}
