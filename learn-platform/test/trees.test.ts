import test from "node:test";
import assert from "node:assert/strict";
import { bstInsertSequence } from "../src/track-dsa/algorithms/trees/bst";
import { traversal } from "../src/track-dsa/algorithms/trees/traversal";
import { trieInsert } from "../src/track-dsa/algorithms/trees/trie";
import { heapSiftDemo } from "../src/track-dsa/algorithms/trees/heap";

test("bst insert produces nodes for each value", () => {
  const t = bstInsertSequence([5, 3, 8, 1, 4]);
  assert.equal(t.result.nodes.length, 5);
});
test("in-order traversal yields sorted values", () => {
  const t = traversal([5, 3, 8, 1, 4, 7, 9], "in");
  assert.deepEqual(t.result.order, [1, 3, 4, 5, 7, 8, 9]);
});
test("pre-order starts at root", () => {
  const t = traversal([5, 3, 8], "pre");
  assert.equal(t.result.order![0], 5);
});
test("post-order ends at root", () => {
  const t = traversal([5, 3, 8], "post");
  assert.equal(t.result.order![t.result.order!.length - 1], 5);
});
test("trie insert creates nodes and has frames", () => {
  const t = trieInsert(["ab", "ac"]);
  assert.ok(t.result.nodes.length >= 3); // root + a + b + c (shared a)
  assert.ok(t.frames.length >= 1);
});
test("heap sift demo produces frames", () => {
  const t = heapSiftDemo([3, 9, 2, 1, 7]);
  assert.ok(t.frames.length >= 1);
});
