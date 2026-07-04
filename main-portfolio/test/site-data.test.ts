import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { SITE, PROJECTS, CLOUDOPS_URL, PHOTOS_URL, MANIFESTO_LINES } from "../src/lib/site";
import manifest from "../src/lib/photo-manifest.json";

test("site identity is real", () => {
  assert.equal(SITE.name, "Tamen Dutta");
  assert.equal(SITE.email, "jj794001@gmail.com");
  assert.equal(SITE.location, "Bangalore, IN");
  assert.ok(SITE.socials.length >= 3);
  for (const s of SITE.socials) assert.doesNotThrow(() => new URL(s.href));
});

test("sub-site URLs are well-formed", () => {
  assert.doesNotThrow(() => new URL(CLOUDOPS_URL));
  assert.doesNotThrow(() => new URL(PHOTOS_URL));
});

test("projects: two real linked, placeholders unlinked", () => {
  const real = PROJECTS.filter((p) => p.href !== null);
  const placeholders = PROJECTS.filter((p) => p.href === null);
  assert.equal(real.length, 2);
  assert.ok(placeholders.length >= 1);
  for (const p of real) assert.ok(p.preview?.startsWith("/previews/"));
});

test("manifesto is non-empty", () => {
  assert.ok(MANIFESTO_LINES.length >= 4);
});

test("project preview images exist", () => {
  for (const p of PROJECTS) {
    if (p.preview) {
      assert.ok(
        existsSync(join(import.meta.dirname, "..", "public", p.preview)),
        `missing preview: ${p.preview}`,
      );
    }
  }
});

test("photo manifest: 9 gallery + 1 hero, files exist", () => {
  const photos = manifest as {
    id: string; src: string; width: number; height: number; caption: string; hero?: boolean;
  }[];
  assert.equal(photos.filter((p) => !p.hero).length, 9);
  assert.equal(photos.filter((p) => p.hero).length, 1);
  for (const p of photos) {
    assert.ok(p.caption.length > 0);
    assert.ok(p.width > 0 && p.height > 0);
    assert.ok(
      existsSync(join(import.meta.dirname, "..", "public", p.src)),
      `missing file: ${p.src}`,
    );
  }
  assert.ok(existsSync(join(import.meta.dirname, "..", "public", "og.jpg")));
});
