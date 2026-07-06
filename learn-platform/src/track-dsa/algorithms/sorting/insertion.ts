import type { Trace } from "../../types";
import { TraceBuilder, snapshot } from "../helpers";

export function insertionSort(input: number[]): Trace<number[]> {
  const a = input.slice();
  const tb = new TraceBuilder<number[]>();
  let comparisons = 0, swaps = 0;
  tb.push(snapshot(a), { narration: "Start", pseudoLine: 0, meta: { comparisons, swaps } });
  for (let i = 1; i < a.length; i++) {
    let j = i;
    tb.push(snapshot(a), {
      narration: `Insert a[${i}] = ${a[i]}`,
      highlights: [{ indices: [i], role: "active" }], pseudoLine: 1, meta: { comparisons, swaps },
    });
    while (j > 0 && (comparisons++, a[j - 1] > a[j])) {
      [a[j - 1], a[j]] = [a[j], a[j - 1]];
      swaps++;
      tb.push(snapshot(a), {
        narration: `Shift ${a[j]} left`,
        highlights: [{ indices: [j - 1, j], role: "swap" }], pseudoLine: 2,
        codeLine: { py: 2 }, meta: { comparisons, swaps },
      });
      j--;
    }
  }
  return tb.build(a);
}
