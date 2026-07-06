import test from "node:test";
import assert from "node:assert/strict";
import { twoPointersPairSum } from "../src/track-dsa/algorithms/array/two-pointers";
import { slidingWindowMaxSum } from "../src/track-dsa/algorithms/array/sliding-window";
import { binarySearch } from "../src/track-dsa/algorithms/array/binary-search";
import { prefixSums } from "../src/track-dsa/algorithms/array/prefix-sums";
import { fastSlowHasCycle } from "../src/track-dsa/algorithms/array/fast-slow";
import { mergeIntervals } from "../src/track-dsa/algorithms/array/merge-intervals";

test("two pointers finds a pair summing to target (sorted input)", () => {
  const arr = [1, 2, 4, 7, 11];
  const t = twoPointersPairSum(arr, 15);
  const [i, j] = t.result;
  assert.equal(arr[i] + arr[j], 15);
});
test("two pointers returns [] when no pair", () => {
  assert.deepEqual(twoPointersPairSum([1, 2, 3], 100).result, []);
});
test("sliding window max sum of size k", () => {
  assert.deepEqual(slidingWindowMaxSum([2, 1, 5, 1, 3, 2], 3).result, [9]);
});
test("binary search finds index", () => {
  assert.deepEqual(binarySearch([1, 3, 5, 7, 9], 7).result, [3]);
});
test("binary search returns [-1] when absent", () => {
  assert.deepEqual(binarySearch([1, 3, 5], 4).result, [-1]);
});
test("prefix sums", () => {
  assert.deepEqual(prefixSums([1, 2, 3, 4]).result, [1, 3, 6, 10]);
});
test("fast/slow detects a cycle", () => {
  assert.deepEqual(fastSlowHasCycle([1, 2, 3, 1]).result, [1]); // 0->1->2->3->1 cycle
  assert.deepEqual(fastSlowHasCycle([1, 2, 3, -1]).result, [0]); // terminates
});
test("merge intervals", () => {
  assert.deepEqual(mergeIntervals([1, 3, 2, 6, 8, 10, 15, 18]).result, [1, 6, 8, 10, 15, 18]);
});
