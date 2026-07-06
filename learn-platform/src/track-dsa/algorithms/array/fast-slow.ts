import type { Trace } from "../../types";
import { TraceBuilder, snapshot } from "../helpers";

// input is a "next index" array; -1 means terminate. Detects a cycle.
export function fastSlowHasCycle(input: number[]): Trace<number[]> {
  const nxt = input.slice();
  const tb = new TraceBuilder<number[]>();
  let slow = 0, fast = 0;
  while (true) {
    if (fast < 0 || nxt[fast] < 0) {
      tb.push(snapshot(nxt), { narration: "Fast hit end — no cycle", pseudoLine: 4 });
      return tb.build([0]);
    }
    slow = nxt[slow];
    fast = nxt[fast];
    if (fast < 0 || nxt[fast] < 0) {
      tb.push(snapshot(nxt), { narration: "Fast hit end — no cycle", pseudoLine: 4 });
      return tb.build([0]);
    }
    fast = nxt[fast];
    tb.push(snapshot(nxt), {
      narration: `slow=${slow}, fast=${fast}`,
      highlights: [{ indices: [slow], role: "compare" }, { indices: [fast], role: "active" }],
      pseudoLine: 2,
    });
    if (slow === fast) {
      tb.push(snapshot(nxt), {
        narration: "Pointers met — cycle!",
        highlights: [{ indices: [slow], role: "path" }],
        pseudoLine: 3,
      });
      return tb.build([1]);
    }
  }
}
