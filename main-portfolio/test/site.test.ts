import test from "node:test";
import assert from "node:assert/strict";
import {
  NAV_LINKS,
  HERO,
  MARQUEE_IMAGES,
  MARQUEE_ROW_1,
  MARQUEE_ROW_2,
  ABOUT,
  SERVICES,
  PROJECTS,
} from "../src/lib/content";

test("nav has the 4 links from the spec", () => {
  assert.deepEqual(
    NAV_LINKS.map((l) => l.label),
    ["About", "Price", "Projects", "Contact"],
  );
  for (const l of NAV_LINKS) {
    assert.ok(
      l.href.startsWith("#") || l.href.startsWith("mailto:"),
      l.label,
    );
  }
});

test("hero content is complete", () => {
  assert.ok(HERO.heading.toLowerCase().includes("jack"));
  assert.ok(HERO.tagline.length > 0);
  assert.ok(HERO.portrait.startsWith("https://"));
});

test("marquee has 21 unique https images split 11/10", () => {
  assert.equal(MARQUEE_IMAGES.length, 21);
  assert.equal(new Set(MARQUEE_IMAGES).size, 21);
  assert.equal(MARQUEE_ROW_1.length, 11);
  assert.equal(MARQUEE_ROW_2.length, 10);
  for (const url of MARQUEE_IMAGES) {
    assert.ok(url.startsWith("https://motionsites.ai/assets/"), url);
  }
});

test("about has text and 4 corner decorations", () => {
  assert.ok(ABOUT.text.length > 100);
  assert.equal(ABOUT.decorations.length, 4);
  for (const d of ABOUT.decorations) {
    assert.ok(d.src.startsWith("https://"), d.id);
    assert.ok(d.alt.length > 0, d.id);
  }
});

test("services list the 5 numbered offerings", () => {
  assert.equal(SERVICES.length, 5);
  assert.deepEqual(
    SERVICES.map((s) => s.number),
    ["01", "02", "03", "04", "05"],
  );
  for (const s of SERVICES) {
    assert.ok(s.name.length > 0);
    assert.ok(s.description.length > 0);
  }
});

test("projects: 3 cards, 3 https images each, valid categories", () => {
  assert.equal(PROJECTS.length, 3);
  for (const p of PROJECTS) {
    assert.ok(["Client", "Personal"].includes(p.category), p.name);
    assert.equal(p.col1Images.length, 2);
    for (const img of [...p.col1Images, p.col2Image]) {
      assert.ok(img.startsWith("https://images.higgs.ai/"), p.name);
    }
  }
});
