import { notFound } from "next/navigation";
import { Nav } from "@/design/components/Nav";
import { DesignShell } from "@/track-system-design/DesignShell";
import { DESIGNS, designBySlug } from "@/track-system-design/catalog";

export function generateStaticParams() {
  return DESIGNS.map((d) => ({ slug: d.slug }));
}

export default async function DesignPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const entry = designBySlug(slug);
  if (!entry) notFound();
  return (
    <main>
      <Nav />
      <DesignShell slug={entry.slug} />
    </main>
  );
}
