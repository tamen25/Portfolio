import test from "node:test";
import assert from "node:assert/strict";
import { TraceBuilder, isAscending, snapshot } from "../src/track-dsa/algorithms/helpers";

test("snapshot returns an independent copy", () => {
  const a = [1, 2, 3];
  const b = snapshot(a);
  b[0] = 99;
  assert.equal(a[0], 1);
});

test("isAscending detects order", () => {
  assert.equal(isAscending([1, 2, 2, 3]), true);
  assert.equal(isAscending([1, 3, 2]), false);
});

test("TraceBuilder builds frames + result", () => {
  const tb = new TraceBuilder<number[]>();
  tb.push([2, 1], { narration: "start" });
  tb.push([1, 2], { narration: "swapped", highlights: [{ indices: [0, 1], role: "swap" }] });
  const trace = tb.build([1, 2]);
  assert.equal(trace.frames.length, 2);
  assert.deepEqual(trace.result, [1, 2]);
  assert.equal(trace.frames[1].highlights[0].role, "swap");
});
