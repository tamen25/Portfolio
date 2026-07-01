import { SITE } from "@/lib/site";
import { Reveal } from "./Reveal";

export function Contact() {
  return (
    <section id="contact" className="mx-auto max-w-[1400px] scroll-mt-24 px-6 pt-32">
      <Reveal className="flex flex-col items-center text-center">
        <h2 className="font-display text-3xl font-medium tracking-tight md:text-5xl">
          Prints and commissions
        </h2>
        <p className="mt-4 max-w-md text-overcast">
          Most photographs here are available as prints. For orders or
          commissions, write to me.
        </p>
        <a
          href={`mailto:${SITE.email}`}
          className="mt-8 inline-flex h-12 items-center rounded-full bg-alpenglow px-7 text-sm font-medium text-night transition-transform hover:scale-[1.02] active:scale-[0.98]"
        >
          Contact
        </a>
      </Reveal>
    </section>
  );
}
