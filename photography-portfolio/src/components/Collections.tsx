import { COLLECTIONS } from "@/lib/photos";
import { CollectionCard } from "./CollectionCard";
import { Reveal } from "./Reveal";

export function Collections() {
  const [first, second, third] = COLLECTIONS;

  return (
    <section className="mx-auto max-w-[1400px] px-6 pt-32">
      <Reveal>
        <h2 className="font-display text-3xl font-medium tracking-tight md:text-4xl">
          Collections
        </h2>
      </Reveal>
      <div className="mt-10 grid gap-5 md:grid-cols-12">
        <CollectionCard id={first.id} tall className="md:col-span-7 md:row-span-2" />
        <CollectionCard id={second.id} className="md:col-span-5" />
        <CollectionCard id={third.id} delay={0.1} className="md:col-span-5" />
      </div>
    </section>
  );
}
