import type { Trace } from "../../types";
import { TraceBuilder } from "../helpers";
import { type Grid, type GridState, neighbors, reconstruct } from "./grid";

export function dfsPath(grid: Grid): Trace<GridState> {
  const tb = new TraceBuilder<GridState>();
  const stack: [number, number][] = [grid.start];
  const seen = new Set([`${grid.start[0]},${grid.start[1]}`]);
  const prev = new Map<string, [number, number]>();
  const visited: [number, number][] = [];
  const snap = (path: [number, number][] = []): GridState => ({
    grid,
    visited: visited.slice(),
    frontier: stack.slice(),
    path,
  });

  while (stack.length) {
    const [r, c] = stack.pop()!;
    visited.push([r, c]);
    tb.push(snap(), { narration: `Visit (${r}, ${c})`, highlights: [], meta: { visited: visited.length } });
    if (r === grid.end[0] && c === grid.end[1]) {
      const path = reconstruct(prev, grid.end);
      tb.push(snap(path), { narration: `Reached end`, highlights: [] });
      return tb.build(snap(path));
    }
    for (const [nr, nc] of neighbors(grid, r, c)) {
      const k = `${nr},${nc}`;
      if (!seen.has(k)) {
        seen.add(k);
        prev.set(k, [r, c]);
        stack.push([nr, nc]);
      }
    }
  }
  tb.push(snap([]), { narration: "No path", highlights: [] });
  return tb.build(snap([]));
}
