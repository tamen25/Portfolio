import type { Trace } from "../../types";
import { TraceBuilder, snapshot } from "../helpers";

export function quickSort(input: number[]): Trace<number[]> {
  const a = input.slice();
  const tb = new TraceBuilder<number[]>();
  let comparisons = 0, swaps = 0;
  tb.push(snapshot(a), { narration: "Start", pseudoLine: 0, meta: { comparisons, swaps } });

  function qs(lo: number, hi: number): void {
    if (lo >= hi) return;
    const pivot = a[hi];
    tb.push(snapshot(a), {
      narration: `Pivot = ${pivot}`,
      highlights: [{ indices: [hi], role: "pivot" }], pseudoLine: 1, meta: { comparisons, swaps },
    });
    let i = lo;
    for (let j = lo; j < hi; j++) {
      comparisons++;
      tb.push(snapshot(a), {
        narration: `Compare ${a[j]} with pivot ${pivot}`,
        highlights: [{ indices: [j], role: "compare" }, { indices: [hi], role: "pivot" }],
        pseudoLine: 2, meta: { comparisons, swaps },
      });
      if (a[j] < pivot) {
        [a[i], a[j]] = [a[j], a[i]];
        swaps++;
        i++;
      }
    }
    [a[i], a[hi]] = [a[hi], a[i]];
    swaps++;
    tb.push(snapshot(a), {
      narration: `Place pivot at ${i}`,
      highlights: [{ indices: [i], role: "sorted" }], pseudoLine: 3, meta: { comparisons, swaps },
    });
    qs(lo, i - 1);
    qs(i + 1, hi);
  }
  qs(0, a.length - 1);
  return tb.build(a);
}
