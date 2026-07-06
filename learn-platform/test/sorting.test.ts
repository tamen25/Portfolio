import test from "node:test";
import assert from "node:assert/strict";
import { bubbleSort } from "../src/track-dsa/algorithms/sorting/bubble";
import { insertionSort } from "../src/track-dsa/algorithms/sorting/insertion";
import { selectionSort } from "../src/track-dsa/algorithms/sorting/selection";
import { mergeSort } from "../src/track-dsa/algorithms/sorting/merge";
import { quickSort } from "../src/track-dsa/algorithms/sorting/quick";
import { heapSort } from "../src/track-dsa/algorithms/sorting/heap";
import { assertSortedTrace, isAscending } from "../src/track-dsa/algorithms/helpers";

const sorters = { bubbleSort, insertionSort, selectionSort, mergeSort, quickSort, heapSort };
const inputs = [[], [1], [3, 1, 2], [5, 4, 3, 2, 1], [2, 2, 1, 1, 3], [9, 3, 7, 1, 8, 2, 6, 4, 5, 0]];

for (const [name, fn] of Object.entries(sorters)) {
  test(`${name}: result is sorted for all inputs`, () => {
    for (const inp of inputs) {
      const trace = fn(inp.slice());
      assert.ok(isAscending(trace.result), `${name} failed on ${inp}`);
      assert.deepEqual(trace.result.slice().sort((a, b) => a - b), trace.result);
    }
  });
  test(`${name}: final frame equals result and is sorted`, () => {
    const trace = fn([4, 2, 5, 1, 3]);
    assertSortedTrace(trace);
    assert.deepEqual(trace.frames[trace.frames.length - 1].state, trace.result);
  });
  test(`${name}: preserves multiset (no lost/added elements)`, () => {
    const inp = [5, 3, 3, 1, 9, 2];
    const trace = fn(inp.slice());
    assert.deepEqual(trace.result.slice().sort((a, b) => a - b), inp.slice().sort((a, b) => a - b));
  });
  test(`${name}: produces at least one frame`, () => {
    const trace = fn([2, 1]);
    assert.ok(trace.frames.length >= 1);
  });
}
