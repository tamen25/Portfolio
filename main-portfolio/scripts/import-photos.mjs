// Copies the newest web derivatives from photography-portfolio into this site
// for the "Frames from the field" grid. The photography manifest is the source
// of truth (regenerated there by `npm run sync-instagram`), so re-run this
// after each sync. The only cross-site touchpoint; both sites stay independent
// at runtime.
import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..");
const photoSite = join(root, "..", "photography-portfolio");
const COUNT = 9;

const NAMES = {
  iceland: "Iceland",
  spiti: "Spiti",
  astro: "deep sky",
  moon: "Moon",
  leh: "Leh",
  sikkim: "Sikkim",
  journal: "field notes",
};

const source = JSON.parse(
  readFileSync(join(photoSite, "src", "lib", "photo-manifest.json"), "utf8"),
);

const newest = [...source]
  .sort((a, b) => (b.timestamp ?? "").localeCompare(a.timestamp ?? ""))
  .slice(0, COUNT);

const caption = (entry) => {
  const alt = entry.alt ?? entry.id;
  const name = NAMES[entry.collection] ?? entry.collection;
  return alt.toLowerCase().includes(entry.collection) ? alt : `${alt} — ${name}`;
};

const out = [];
for (const entry of newest) {
  const from = join(photoSite, "public", entry.src);
  const to = join(root, "public", entry.src);
  mkdirSync(dirname(to), { recursive: true });
  copyFileSync(from, to);
  out.push({
    id: entry.id,
    src: entry.src,
    width: entry.width,
    height: entry.height,
    caption: caption(entry),
    permalink: entry.permalink ?? null,
  });
}

// Freshest landscape frame doubles as the OG image.
const og = out.find((p) => p.width > p.height) ?? out[0];
copyFileSync(join(root, "public", og.src), join(root, "public", "og.jpg"));

writeFileSync(
  join(root, "src", "lib", "photo-manifest.json"),
  JSON.stringify(out, null, 2) + "\n",
);
console.log(`imported ${out.length} photos (og: ${og.id})`);
