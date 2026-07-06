import type { Trace } from "../../types";
import { TraceBuilder, snapshot } from "../helpers";

export function selectionSort(input: number[]): Trace<number[]> {
  const a = input.slice();
  const tb = new TraceBuilder<number[]>();
  let comparisons = 0, swaps = 0;
  tb.push(snapshot(a), { narration: "Start", pseudoLine: 0, meta: { comparisons, swaps } });
  for (let i = 0; i < a.length; i++) {
    let min = i;
    for (let j = i + 1; j < a.length; j++) {
      comparisons++;
      tb.push(snapshot(a), {
        narration: `Scan for min; ${a[j]} vs ${a[min]}`,
        highlights: [{ indices: [min], role: "pivot" }, { indices: [j], role: "compare" }],
        pseudoLine: 2, meta: { comparisons, swaps },
      });
      if (a[j] < a[min]) min = j;
    }
    if (min !== i) {
      [a[i], a[min]] = [a[min], a[i]];
      swaps++;
    }
    tb.push(snapshot(a), {
      narration: `Place min at ${i}`,
      highlights: [{ indices: [i], role: "sorted" }], pseudoLine: 3, meta: { comparisons, swaps },
    });
  }
  return tb.build(a);
}
