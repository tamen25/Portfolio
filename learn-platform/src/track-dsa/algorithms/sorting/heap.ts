import type { Trace } from "../../types";
import { TraceBuilder, snapshot } from "../helpers";

export function heapSort(input: number[]): Trace<number[]> {
  const a = input.slice();
  const n = a.length;
  const tb = new TraceBuilder<number[]>();
  let comparisons = 0, swaps = 0;
  tb.push(snapshot(a), { narration: "Start", pseudoLine: 0, meta: { comparisons, swaps } });

  function sift(size: number, root: number): void {
    let largest = root;
    const l = 2 * root + 1, r = 2 * root + 2;
    if (l < size && (comparisons++, a[l] > a[largest])) largest = l;
    if (r < size && (comparisons++, a[r] > a[largest])) largest = r;
    if (largest !== root) {
      [a[root], a[largest]] = [a[largest], a[root]];
      swaps++;
      tb.push(snapshot(a), {
        narration: `Sift-down swap`,
        highlights: [{ indices: [root, largest], role: "swap" }], pseudoLine: 2, meta: { comparisons, swaps },
      });
      sift(size, largest);
    }
  }
  for (let i = (n >> 1) - 1; i >= 0; i--) sift(n, i);
  for (let end = n - 1; end > 0; end--) {
    [a[0], a[end]] = [a[end], a[0]];
    swaps++;
    tb.push(snapshot(a), {
      narration: `Move max to ${end}`,
      highlights: [{ indices: [end], role: "sorted" }], pseudoLine: 3, meta: { comparisons, swaps },
    });
    sift(end, 0);
  }
  return tb.build(a);
}
