import test from "node:test";
import assert from "node:assert/strict";
import { DESIGNS, designBySlug } from "../src/track-system-design/catalog";

test("all design slugs are unique", () => {
  const slugs = DESIGNS.map((d) => d.slug);
  assert.equal(new Set(slugs).size, slugs.length);
});

test("every design has steps, notes, tags, and a scale", () => {
  for (const d of DESIGNS) {
    assert.ok(d.steps.length > 0, `${d.slug} missing steps`);
    assert.ok(d.notes.length > 0, `${d.slug} missing notes`);
    assert.ok(d.tags.length > 0, `${d.slug} missing tags`);
    assert.ok(d.scale.length > 0, `${d.slug} missing scale`);
    for (const n of d.notes) {
      assert.ok(n.heading && n.body.length > 0, `${d.slug} note "${n.heading}" is empty`);
    }
  }
});

test("every design builds at least one frame", () => {
  for (const d of DESIGNS) {
    const trace = d.build();
    assert.ok(trace.frames.length >= 1, `${d.slug} produced no frames`);
  }
});

test("each frame's stepLine indexes into steps", () => {
  for (const d of DESIGNS) {
    for (const f of d.build().frames) {
      if (f.pseudoLine !== undefined) {
        assert.ok(
          f.pseudoLine >= 0 && f.pseudoLine < d.steps.length,
          `${d.slug}: stepLine ${f.pseudoLine} out of range (len ${d.steps.length})`
        );
      }
    }
  }
});

test("focusId and every edge endpoint reference a revealed component", () => {
  for (const d of DESIGNS) {
    for (const f of d.build().frames) {
      const ids = new Set(f.state.components.map((c) => c.id));
      if (f.state.focusId !== null) {
        assert.ok(ids.has(f.state.focusId), `${d.slug}: focusId ${f.state.focusId} not revealed`);
      }
      for (const e of f.state.edges) {
        assert.ok(ids.has(e.from), `${d.slug}: edge from ${e.from} not revealed`);
        assert.ok(ids.has(e.to), `${d.slug}: edge to ${e.to} not revealed`);
      }
    }
  }
});

test("designBySlug resolves and misses correctly", () => {
  assert.ok(designBySlug("url-shortener"));
  assert.equal(designBySlug("nope"), undefined);
});
