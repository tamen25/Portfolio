import test from "node:test";
import assert from "node:assert/strict";
import {
  PHOTOS,
  COLLECTIONS,
  HERO_PHOTO,
  PANORAMA_PHOTO,
  INSTAGRAM_PHOTOS,
  ORDER,
  photosByCollection,
  collectionCover,
  formatExif,
  type CollectionId,
} from "../src/lib/photos";
import { SITE } from "../src/lib/site";

test("site config is complete", () => {
  assert.ok(SITE.name.length > 0);
  assert.ok(SITE.email.includes("@"));
  assert.ok(SITE.instagram === null || SITE.instagram.startsWith("https://"));
});

test("photo ids are unique", () => {
  const ids = PHOTOS.map((p) => p.id);
  assert.equal(new Set(ids).size, ids.length);
});

test("every photo has alt text and positive dimensions", () => {
  for (const p of [...PHOTOS, HERO_PHOTO, PANORAMA_PHOTO]) {
    assert.ok(p.alt.trim().length > 0, `missing alt: ${p.id}`);
    assert.ok(p.width > 0 && p.height > 0, `bad dims: ${p.id}`);
  }
});

test("every collection has at least 4 photos and a cover", () => {
  for (const c of COLLECTIONS) {
    assert.ok(photosByCollection(c.id).length >= 4, c.id);
    assert.ok(collectionCover(c.id));
  }
});

test("panorama is actually wide", () => {
  assert.ok(PANORAMA_PHOTO.width / PANORAMA_PHOTO.height >= 2);
});

test("instagram strip has 6 photos", () => {
  assert.equal(INSTAGRAM_PHOTOS.length, 6);
});

test("curated ORDER only references real photo ids, no duplicates", () => {
  for (const [collection, ids] of Object.entries(ORDER)) {
    assert.equal(new Set(ids).size, ids.length, `${collection}: duplicate id`);
    for (const id of ids) {
      assert.ok(
        PHOTOS.some((p) => p.id === id && p.collection === collection),
        `${collection}: unknown id ${id}`,
      );
    }
  }
});

test("curated photos lead their collection in the given order", () => {
  for (const [collection, ids] of Object.entries(ORDER)) {
    const shown = photosByCollection(collection as CollectionId).map(
      (p) => p.id,
    );
    assert.deepEqual(shown.slice(0, ids.length), ids, collection);
  }
});

test("formatExif renders the caption line", () => {
  const line = formatExif({
    focal: "24mm",
    aperture: "f/8",
    shutter: "1/250s",
    iso: 100,
    sample: true,
  });
  assert.equal(line, "24mm · f/8 · 1/250s · ISO 100");
});
