/**
 * Pure logic for the Instagram sync pipeline: normalizing feed payloads
 * (Behold JSON feed or Instagram Graph API), mapping posts to collections,
 * and building the photo manifest. No network or filesystem access here —
 * see sync-instagram.mjs for the runner.
 */

/** Hashtag / caption keyword -> collection id. First match wins. */
export const COLLECTION_TAGS = {
  iceland: "iceland",
  spiti: "spiti",
  ladakh: "leh",
  leh: "leh",
  sikkim: "sikkim",
  astro: "astro",
  astrophotography: "astro",
  deepsky: "astro",
  milkyway: "astro",
  nightsky: "astro",
  moon: "moon",
  lunar: "moon",
};

const hashtagsOf = (post) =>
  post.hashtags?.length
    ? post.hashtags.map((h) => h.toLowerCase())
    : [...(post.caption ?? "").matchAll(/#(\w+)/g)].map((m) => m[1].toLowerCase());

export const collectionFor = (post) => {
  for (const tag of hashtagsOf(post)) {
    if (COLLECTION_TAGS[tag]) return COLLECTION_TAGS[tag];
  }
  return "journal";
};

/** First caption line with hashtags stripped, for alt text. */
export const altFrom = (caption, fallback = "Photograph from Instagram") => {
  const line = (caption ?? "")
    .split("\n")[0]
    .replace(/#\w+/g, "")
    .replace(/\s+/g, " ")
    .trim();
  return line.length > 0 ? line.slice(0, 140) : fallback;
};

/** Instagram permalink -> stable shortcode slug. */
export const shortcodeOf = (permalink, fallbackId) => {
  const m = /\/(?:p|reel)\/([A-Za-z0-9_-]+)/.exec(permalink ?? "");
  return (m ? m[1] : String(fallbackId)).toLowerCase();
};

/**
 * Normalize one feed payload into flat image records:
 * { key, postId, timestamp, permalink, caption, hashtags, url, width?, height? }
 * Carousels are expanded (all IMAGE children); videos are skipped.
 */
export const normalizeBehold = (feed) => flatten(feed.posts ?? [], beholdImages);

export const normalizeGraph = (media) => flatten(media, graphImages);

const flatten = (posts, imagesOf) =>
  posts.flatMap((post) => {
    const images = imagesOf(post);
    const shortcode = shortcodeOf(post.permalink, post.id);
    return images.map((img, i) => ({
      key: images.length > 1 ? `${shortcode}-${i + 1}` : shortcode,
      postId: post.id,
      timestamp: post.timestamp ?? null,
      permalink: post.permalink ?? null,
      caption: post.caption ?? "",
      hashtags: post.hashtags ?? [],
      ...img,
    }));
  });

const beholdImages = (post) => {
  if (post.mediaType === "VIDEO") return [];
  if (post.mediaType === "CAROUSEL_ALBUM" && post.children?.length) {
    return post.children
      .filter((c) => c.mediaType !== "VIDEO")
      .map((c) => sized(c));
  }
  return [sized(post)];
};

const sized = (media) => {
  const full = media.sizes?.full;
  return {
    url: full?.mediaUrl ?? media.mediaUrl,
    width: full?.width,
    height: full?.height,
  };
};

const graphImages = (post) => {
  if (post.media_type === "VIDEO") return [];
  const children = post.children?.data;
  if (post.media_type === "CAROUSEL_ALBUM" && children?.length) {
    return children
      .filter((c) => c.media_type !== "VIDEO")
      .map((c) => ({ url: c.media_url }));
  }
  return [{ url: post.media_url }];
};

/**
 * Build the new manifest: images from this sync plus previously synced
 * Instagram entries (recognizable by the "-ig-" id marker) whose files are
 * still wanted, newest first. Curated (non-Instagram) entries are dropped —
 * Instagram is the source of truth after the first sync.
 *
 * `images` must already carry width/height and a local `src`.
 */
export const buildManifest = (oldManifest, images) => {
  const fresh = images.map((img) => ({
    id: `${img.collection}-ig-${img.key}`,
    collection: img.collection,
    src: img.src,
    width: img.width,
    height: img.height,
    alt: altFrom(img.caption),
    permalink: img.permalink,
    timestamp: img.timestamp,
  }));
  const freshIds = new Set(fresh.map((e) => e.id));
  const kept = oldManifest.filter(
    (e) => e.id.includes("-ig-") && !freshIds.has(e.id),
  );
  return [...fresh, ...kept].sort(
    (a, b) => (b.timestamp ?? "").localeCompare(a.timestamp ?? ""),
  );
};
