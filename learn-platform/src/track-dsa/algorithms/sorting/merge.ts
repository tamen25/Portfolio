import type { Trace } from "../../types";
import { TraceBuilder, snapshot } from "../helpers";

export function mergeSort(input: number[]): Trace<number[]> {
  const a = input.slice();
  const tb = new TraceBuilder<number[]>();
  let comparisons = 0;
  tb.push(snapshot(a), { narration: "Start", pseudoLine: 0, meta: { comparisons } });

  function ms(lo: number, hi: number): void {
    if (hi - lo <= 1) return;
    const mid = (lo + hi) >> 1;
    ms(lo, mid);
    ms(mid, hi);
    const merged: number[] = [];
    let i = lo, j = mid;
    while (i < mid && j < hi) {
      comparisons++;
      tb.push(snapshot(a), {
        narration: `Merge: compare ${a[i]} and ${a[j]}`,
        highlights: [{ indices: [i], role: "compare" }, { indices: [j], role: "compare" }],
        pseudoLine: 2, meta: { comparisons },
      });
      merged.push(a[i] <= a[j] ? a[i++] : a[j++]);
    }
    while (i < mid) merged.push(a[i++]);
    while (j < hi) merged.push(a[j++]);
    for (let k = 0; k < merged.length; k++) a[lo + k] = merged[k];
    tb.push(snapshot(a), {
      narration: `Merged [${lo}, ${hi})`,
      highlights: [{ indices: Array.from({ length: hi - lo }, (_, k) => lo + k), role: "sorted" }],
      pseudoLine: 3, meta: { comparisons },
    });
  }
  ms(0, a.length);
  return tb.build(a);
}
