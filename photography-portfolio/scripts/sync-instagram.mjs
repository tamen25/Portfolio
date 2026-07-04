/**
 * Syncs the photo manifest from Instagram. Two supported sources:
 *
 *   1. Behold JSON feed (https://behold.so — free plan serves 6 posts):
 *      set BEHOLD_FEED_URL in .env.local or the environment.
 *
 *   2. Instagram API with Instagram Login (Meta app, full history):
 *      put a long-lived access token in .instagram-token (gitignored) or
 *      set IG_ACCESS_TOKEN. The token is auto-refreshed on every run and
 *      written back to .instagram-token, so it never expires as long as
 *      you sync at least once every 60 days.
 *
 * Downloads new images to public/photos/<collection>/, probes dimensions,
 * and rewrites src/lib/photo-manifest.json (newest first). Incremental:
 * already-downloaded images are kept, curated pre-Instagram entries are
 * dropped from the manifest on the first successful sync.
 *
 * Run from the site root: npm run sync-instagram
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";
import {
  buildManifest,
  collectionFor,
  normalizeBehold,
  normalizeGraph,
} from "./sync-lib.mjs";

const ROOT = process.cwd();
const OUT = path.join(ROOT, "public", "photos");
const MANIFEST = path.join(ROOT, "src", "lib", "photo-manifest.json");
const TOKEN_FILE = path.join(ROOT, ".instagram-token");
const GRAPH = "https://graph.instagram.com";

const loadEnvFile = async () => {
  for (const name of [".env.local", ".env"]) {
    const file = path.join(ROOT, name);
    if (!existsSync(file)) continue;
    for (const line of (await readFile(file, "utf8")).split("\n")) {
      const m = /^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/.exec(line);
      if (m && !(m[1] in process.env)) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
    }
  }
};

const getJson = async (url) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} — ${url.split("?")[0]}`);
  return res.json();
};

const fetchBehold = async (feedUrl) => {
  const feed = await getJson(feedUrl);
  return normalizeBehold(feed);
};

const fetchGraph = async (token) => {
  const fields =
    "id,caption,media_type,media_url,permalink,timestamp,children{id,media_type,media_url}";
  const media = [];
  let url = `${GRAPH}/me/media?fields=${fields}&limit=100&access_token=${token}`;
  while (url) {
    const page = await getJson(url);
    media.push(...(page.data ?? []));
    url = page.paging?.next ?? null;
  }
  return normalizeGraph(media);
};

const refreshToken = async (token) => {
  try {
    const res = await getJson(
      `${GRAPH}/refresh_access_token?grant_type=ig_refresh_token&access_token=${token}`,
    );
    if (res.access_token) {
      await writeFile(TOKEN_FILE, res.access_token + "\n");
      console.log(`token refreshed (valid ${Math.round(res.expires_in / 86400)} more days)`);
    }
  } catch (err) {
    console.warn(`token refresh failed (sync still ok): ${err.message}`);
  }
};

const download = async (url, file) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`download failed: ${res.status} ${url.split("?")[0]}`);
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, Buffer.from(await res.arrayBuffer()));
};

const main = async () => {
  await loadEnvFile();
  const beholdUrl = process.env.BEHOLD_FEED_URL;
  let token = process.env.IG_ACCESS_TOKEN;
  if (!token && existsSync(TOKEN_FILE)) {
    token = (await readFile(TOKEN_FILE, "utf8")).trim();
  }

  let images;
  if (beholdUrl) {
    console.log("source: Behold feed");
    images = await fetchBehold(beholdUrl);
  } else if (token) {
    console.log("source: Instagram Graph API");
    images = await fetchGraph(token);
  } else {
    console.error(
      [
        "No Instagram source configured. Either:",
        "  - set BEHOLD_FEED_URL in .env.local (behold.so feed URL), or",
        "  - put a long-lived Instagram access token in .instagram-token",
        "See .env.example for details.",
      ].join("\n"),
    );
    process.exit(1);
  }

  if (images.length === 0) {
    console.error("feed returned no images — manifest left untouched");
    process.exit(1);
  }

  const placed = [];
  for (const img of images) {
    const collection = collectionFor(img);
    const rel = `/photos/${collection}/ig-${img.key}.jpg`;
    const file = path.join(ROOT, "public", rel);
    if (!existsSync(file)) {
      await download(img.url, file);
      console.log(`downloaded ${rel}`);
    }
    let { width, height } = img;
    if (!width || !height) {
      const meta = await sharp(file).metadata();
      width = meta.width;
      height = meta.height;
    }
    placed.push({ ...img, collection, src: rel, width, height });
  }

  const old = JSON.parse(await readFile(MANIFEST, "utf8"));
  const manifest = buildManifest(old, placed);
  await writeFile(MANIFEST, JSON.stringify(manifest, null, 2) + "\n");
  console.log(
    `manifest written: ${manifest.length} photos (${placed.length} from this sync)`,
  );

  if (token && !process.env.IG_ACCESS_TOKEN) await refreshToken(token);
  await mkdir(OUT, { recursive: true });
};

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
