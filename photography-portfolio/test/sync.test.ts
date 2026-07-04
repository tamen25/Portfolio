import test from "node:test";
import assert from "node:assert/strict";
import {
  altFrom,
  buildManifest,
  collectionFor,
  fixExportEncoding,
  normalizeBehold,
  normalizeExport,
  normalizeGraph,
  shortcodeOf,
} from "../scripts/sync-lib.mjs";

const beholdFeed = {
  username: "tamendutta",
  posts: [
    {
      id: "1",
      mediaType: "IMAGE",
      caption: "Aurora over Kirkjufell\n#iceland #aurora",
      hashtags: ["iceland", "aurora"],
      permalink: "https://www.instagram.com/p/AbC123/",
      timestamp: "2026-06-01T10:00:00+0000",
      mediaUrl: "https://cdn.example/a.jpg",
      sizes: { full: { mediaUrl: "https://cdn.example/a-full.jpg", width: 1440, height: 1080 } },
    },
    {
      id: "2",
      mediaType: "CAROUSEL_ALBUM",
      caption: "Milky Way over Langza #spiti",
      hashtags: ["spiti"],
      permalink: "https://www.instagram.com/p/DeF456/",
      timestamp: "2026-06-10T10:00:00+0000",
      children: [
        { id: "2a", mediaType: "IMAGE", sizes: { full: { mediaUrl: "https://cdn.example/b1.jpg", width: 1080, height: 1350 } } },
        { id: "2b", mediaType: "VIDEO", mediaUrl: "https://cdn.example/b2.mp4" },
        { id: "2c", mediaType: "IMAGE", sizes: { full: { mediaUrl: "https://cdn.example/b3.jpg", width: 1080, height: 1350 } } },
      ],
    },
    {
      id: "3",
      mediaType: "VIDEO",
      caption: "reel",
      permalink: "https://www.instagram.com/reel/GhI789/",
      timestamp: "2026-06-11T10:00:00+0000",
      mediaUrl: "https://cdn.example/c.mp4",
    },
  ],
};

test("behold: expands carousels, skips videos, keeps sizes", () => {
  const images = normalizeBehold(beholdFeed);
  assert.equal(images.length, 3);
  assert.deepEqual(images.map((i) => i.key), ["abc123", "def456-1", "def456-2"]);
  assert.equal(images[0].url, "https://cdn.example/a-full.jpg");
  assert.equal(images[0].width, 1440);
  assert.equal(images[1].width, 1080);
});

test("graph: expands carousels, skips videos, parses caption hashtags", () => {
  const images = normalizeGraph([
    {
      id: "10",
      media_type: "CAROUSEL_ALBUM",
      caption: "Pangong at dawn #ladakh",
      permalink: "https://www.instagram.com/p/JkL012/",
      timestamp: "2026-05-01T08:00:00+0000",
      children: {
        data: [
          { id: "10a", media_type: "IMAGE", media_url: "https://ig.example/1.jpg" },
          { id: "10b", media_type: "VIDEO", media_url: "https://ig.example/2.mp4" },
        ],
      },
    },
    { id: "11", media_type: "VIDEO", media_url: "https://ig.example/3.mp4", permalink: "https://www.instagram.com/reel/MnO345/" },
  ]);
  assert.equal(images.length, 1);
  assert.equal(images[0].key, "jkl012");
  assert.equal(images[0].width, undefined);
  assert.equal(collectionFor(images[0]), "leh");
});

test("collection mapping: hashtags win, journal is the fallback", () => {
  assert.equal(collectionFor({ hashtags: ["Iceland"] }), "iceland");
  assert.equal(collectionFor({ caption: "night sky #milkyway" }), "astro");
  assert.equal(collectionFor({ caption: "no tags here" }), "journal");
});

test("alt text: first line, hashtags stripped, fallback provided", () => {
  assert.equal(altFrom("Aurora over Kirkjufell\n#iceland"), "Aurora over Kirkjufell");
  assert.equal(altFrom("#moody #iceland"), "Photograph from Instagram");
});

test("shortcode extraction handles posts, reels, and missing permalinks", () => {
  assert.equal(shortcodeOf("https://www.instagram.com/p/AbC123/"), "abc123");
  assert.equal(shortcodeOf("https://www.instagram.com/reel/XyZ/"), "xyz");
  assert.equal(shortcodeOf(undefined, 42), "42");
});

test("export: expands carousels, skips videos, reads captions and timestamps", () => {
  const posts = [
    {
      media: [
        {
          uri: "media/posts/202506/solo.jpg",
          creation_timestamp: 1750000000,
          title: "Aurora over Kirkjufell #iceland",
        },
      ],
    },
    {
      title: "Milky Way over Langza #spiti",
      creation_timestamp: 1750100000,
      media: [
        { uri: "media/posts/202506/a.jpg", creation_timestamp: 1750100000 },
        { uri: "media/posts/202506/b.mp4", creation_timestamp: 1750100000 },
        { uri: "media/posts/202506/c.jpg", creation_timestamp: 1750100000 },
      ],
    },
  ];
  const images = normalizeExport(posts);
  assert.equal(images.length, 3);
  assert.equal(images[0].key, "1750000000");
  assert.deepEqual(
    images.slice(1).map((i) => i.key),
    ["1750100000-1", "1750100000-2"],
  );
  assert.equal(images[0].file, "media/posts/202506/solo.jpg");
  assert.equal(collectionFor(images[0]), "iceland");
  assert.equal(collectionFor(images[1]), "spiti");
  assert.equal(images[1].timestamp, new Date(1750100000 * 1000).toISOString());
  assert.equal(images[0].permalink, null);
});

test("export: fixes latin-1 mangled UTF-8 captions", () => {
  assert.equal(fixExportEncoding("MÃ¥ne"), "Måne");
  assert.equal(fixExportEncoding(""), "");
});

test("buildManifest replaces curated entries, keeps prior IG entries, newest first", () => {
  const old = [
    { id: "iceland-aurora-kirk", collection: "iceland", src: "/photos/iceland/aurora-kirk.jpg", width: 3840, height: 2824 },
    { id: "spiti-ig-old1", collection: "spiti", src: "/photos/spiti/ig-old1.jpg", width: 1080, height: 1350, timestamp: "2026-01-01T00:00:00+0000" },
  ];
  const placed = normalizeBehold(beholdFeed).map((img) => ({
    ...img,
    collection: collectionFor(img),
    src: `/photos/${collectionFor(img)}/ig-${img.key}.jpg`,
  }));
  const manifest = buildManifest(old, placed);

  assert.ok(!manifest.some((e) => e.id === "iceland-aurora-kirk"), "curated entry dropped");
  assert.ok(manifest.some((e) => e.id === "spiti-ig-old1"), "prior IG entry kept");
  assert.equal(manifest[0].id, "spiti-ig-def456-1", "newest post first");
  const ids = manifest.map((e) => e.id);
  assert.equal(new Set(ids).size, ids.length, "ids unique");
  const first = manifest.find((e) => e.id === "iceland-ig-abc123");
  assert.equal(first?.alt, "Aurora over Kirkjufell");
  assert.equal(first?.permalink, "https://www.instagram.com/p/AbC123/");
});
