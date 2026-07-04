// Copies curated web derivatives from photography-portfolio into this site.
// The only cross-site touchpoint; both sites stay independent at runtime.
import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..");
const photoSite = join(root, "..", "photography-portfolio");

// Real captions only — location/subject, no invented EXIF.
const CURATED = [
  { id: "iceland-aurora-kirk", caption: "Aurora over Kirkjufell — Iceland", hero: true },
  { id: "iceland-aurora-plane", caption: "Aurora from the plane — Iceland" },
  { id: "spiti-milky-pn-chand", caption: "Milky Way over Chandratal — Spiti" },
  { id: "spiti-langza-buddha", caption: "Langza Buddha — Spiti" },
  { id: "astro-andromeda-2022", caption: "Andromeda — deep sky" },
  { id: "moon-moonhdr", caption: "Moon, HDR composite" },
  { id: "leh-valley-01", caption: "Valley — Leh" },
  { id: "sikkim-sun600-2", caption: "Sunrise at 600mm — Sikkim" },
  { id: "iceland-day-2-gulfoss", caption: "Gullfoss — Iceland" },
  { id: "spiti-key-1", caption: "Key Monastery — Spiti" },
];

const source = JSON.parse(
  readFileSync(join(photoSite, "src", "lib", "photo-manifest.json"), "utf8"),
);

const out = [];
for (const pick of CURATED) {
  const entry = source.find((p) => p.id === pick.id);
  if (!entry) throw new Error(`id not in source manifest: ${pick.id}`);
  const from = join(photoSite, "public", entry.src);
  const to = join(root, "public", entry.src);
  mkdirSync(dirname(to), { recursive: true });
  copyFileSync(from, to);
  const rec = {
    id: entry.id,
    src: entry.src,
    width: entry.width,
    height: entry.height,
    caption: pick.caption,
  };
  if (pick.hero) {
    rec.hero = true;
    copyFileSync(from, join(root, "public", "og.jpg"));
  }
  out.push(rec);
}

writeFileSync(
  join(root, "src", "lib", "photo-manifest.json"),
  JSON.stringify(out, null, 2) + "\n",
);
console.log(`imported ${out.length} photos`);
