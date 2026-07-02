import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { SITE, SITE_LINKS, SOCIALS } from "../src/lib/site";
import { WORKS, JOURNAL, EXPLORATIONS, STATS } from "../src/lib/content";

test("site identity is complete", () => {
  assert.equal(SITE.initials, "TD");
  assert.ok(SITE.name.length > 0);
  assert.ok(SITE.email.includes("@"));
  assert.ok(SITE.city.length > 0);
  assert.ok(SITE.roles.length >= 2);
  assert.ok(SITE.loadingWords.length >= 2);
  assert.ok(SITE.github.startsWith("https://github.com/"));
});

test("hub links are absolute URLs", () => {
  for (const url of Object.values(SITE_LINKS)) {
    assert.ok(/^https?:\/\//.test(url), url);
  }
});

test("socials all have absolute hrefs", () => {
  assert.ok(SOCIALS.length >= 4);
  for (const s of SOCIALS) {
    assert.ok(s.href.startsWith("https://"), s.label);
  }
});

test("works grid: 4 cards, first two are the real sites", () => {
  assert.equal(WORKS.length, 4);
  assert.equal(WORKS[0].href, SITE_LINKS.photography);
  assert.equal(WORKS[1].href, SITE_LINKS.cloudops);
  assert.equal(WORKS[2].href, null);
  assert.equal(WORKS[3].href, null);
  const ids = WORKS.map((w) => w.id);
  assert.equal(new Set(ids).size, ids.length);
  for (const w of WORKS) {
    assert.ok(w.image !== null || w.art, `card needs image or art: ${w.id}`);
  }
});

test("journal has 4 entries, explorations 6, stats 3", () => {
  assert.equal(JOURNAL.length, 4);
  assert.equal(EXPLORATIONS.length, 6);
  assert.equal(STATS.length, 3);
});

test("every referenced local image exists in public/", () => {
  const images = [
    ...WORKS.map((w) => w.image),
    ...JOURNAL.map((j) => j.image),
    ...EXPLORATIONS.map((e) => e.image),
  ].filter((p): p is string => p !== null);
  for (const img of images) {
    const file = path.join(process.cwd(), "public", img);
    assert.ok(fs.existsSync(file), `missing: ${img}`);
  }
});
