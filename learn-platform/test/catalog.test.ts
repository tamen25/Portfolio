import test from "node:test";
import assert from "node:assert/strict";
import { CATALOG, bySlug } from "../src/track-dsa/catalog";

test("all slugs are unique", () => {
  const slugs = CATALOG.map((e) => e.slug);
  assert.equal(new Set(slugs).size, slugs.length);
});

test("every entry has pseudocode and python", () => {
  for (const e of CATALOG) {
    assert.ok(e.pseudocode && e.pseudocode.length > 0, `${e.slug} missing pseudocode`);
    assert.ok(e.code.py && e.code.py.length > 0, `${e.slug} missing python`);
  }
});

test("every frame's pseudoLine is a valid index into pseudocode", () => {
  for (const e of CATALOG) {
    const trace = e.run(e.defaultInput());
    for (const f of trace.frames) {
      if (f.pseudoLine !== undefined) {
        assert.ok(
          f.pseudoLine >= 0 && f.pseudoLine < e.pseudocode.length,
          `${e.slug}: pseudoLine ${f.pseudoLine} out of range (len ${e.pseudocode.length})`
        );
      }
    }
  }
});

test("every entry produces at least one frame on default input", () => {
  for (const e of CATALOG) {
    const trace = e.run(e.defaultInput());
    assert.ok(trace.frames.length >= 1, `${e.slug} produced no frames`);
  }
});

test("comparableWith slugs resolve to real entries", () => {
  for (const e of CATALOG) {
    for (const s of e.comparableWith ?? []) {
      assert.ok(bySlug(s), `${e.slug} comparableWith unknown slug ${s}`);
    }
  }
});

test("bySlug resolves and misses correctly", () => {
  assert.ok(bySlug("bubble-sort"));
  assert.equal(bySlug("nope"), undefined);
});
