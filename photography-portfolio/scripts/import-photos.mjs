/**
 * One-time importer: reads full-res originals from Photo/<Category>/,
 * writes web-sized derivatives to public/photos/<collection>/<slug>.jpg
 * (max 3840px long edge, quality 88), and emits src/lib/photo-manifest.json
 * with the output dimensions. Originals are never modified.
 *
 * Run from the site root: node scripts/import-photos.mjs
 */
import { readdir, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = process.cwd();
const SRC = path.join(ROOT, "Photo");
const OUT = path.join(ROOT, "public", "photos");
const MANIFEST = path.join(ROOT, "src", "lib", "photo-manifest.json");
const LONG_EDGE = 3840;

/** Folder name -> collection id used in the app. */
const COLLECTION_DIRS = {
  Iceland: "iceland",
  Spiti: "spiti",
  Astro: "astro",
  Moon: "moon",
  Leh: "leh",
  Sikkim: "sikkim",
};

/** Files too small or duplicated to publish. */
const SKIP = new Set([
  "Moon/weqweqwe.jpg",
  "Moon/_DSC0001_lapl5_ap2320-Edit.jpg",
  "Moon/_DSC0004-Edit.jpg",
  "Moon/_DSC0004.jpg",
  "Moon/_DSC0005-Edit.jpg",
  "Moon/Full M.jpg",
  "Moon/21-11-2020.jpg",
]);

/** Unreadable source names -> stable slugs. */
const RENAME = {
  "Leh/OPLUSDRAG_com.instagram.android_IgImageView_2025-10-22_01_22_38.png": "valley-01",
  "Leh/OPLUSDRAG_com.instagram.android_IgImageView_2025-10-22_01_23_10.png": "valley-02",
  "Leh/OPLUSDRAG_com.instagram.android_IgImageView_2025-10-22_01_23_14.png": "valley-03",
  "Leh/OPLUSDRAG_com.instagram.android_IgImageView_2025-10-22_01_23_18.png": "valley-04",
  "Leh/OPLUSDRAG_com.instagram.android_IgImageView_2025-10-22_01_23_26.png": "valley-05",
  "Spiti/_DSC6057.jpg": "valley-evening",
};

const slugify = (name) =>
  name
    .replace(/\.[^.]+$/, "")
    .toLowerCase()
    .replace(/[+&]/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

/** Natural sort so "Day 2" comes before "Day 10". */
const natural = new Intl.Collator("en", { numeric: true }).compare;

const manifest = [];
const seen = new Set();

for (const [dir, collection] of Object.entries(COLLECTION_DIRS)) {
  const files = (await readdir(path.join(SRC, dir))).sort(natural);
  await mkdir(path.join(OUT, collection), { recursive: true });

  for (const file of files) {
    const rel = `${dir}/${file}`;
    if (SKIP.has(rel)) continue;

    const slug = RENAME[rel] ?? slugify(file);
    const id = `${collection}-${slug}`;
    if (seen.has(id)) throw new Error(`duplicate id: ${id} (${rel})`);
    seen.add(id);

    const outFile = path.join(OUT, collection, `${slug}.jpg`);
    const { info } = await sharp(path.join(SRC, rel))
      .rotate() // bake in EXIF orientation
      .resize(LONG_EDGE, LONG_EDGE, { fit: "inside", withoutEnlargement: true })
      .jpeg({ quality: 88, progressive: true, mozjpeg: true })
      .toBuffer({ resolveWithObject: true })
      .then(async (r) => {
        await writeFile(outFile, r.data);
        return r;
      });

    manifest.push({
      id,
      collection,
      src: `/photos/${collection}/${slug}.jpg`,
      width: info.width,
      height: info.height,
    });
    console.log(`${rel} -> ${info.width}x${info.height}`);
  }
}

await writeFile(MANIFEST, JSON.stringify(manifest, null, 2) + "\n");
console.log(`\n${manifest.length} photos written; manifest at ${MANIFEST}`);
