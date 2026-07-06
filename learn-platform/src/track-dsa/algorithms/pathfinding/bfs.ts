import type { Trace } from "../../types";
import { TraceBuilder } from "../helpers";
import { type Grid, type GridState, neighbors, reconstruct } from "./grid";

export function bfsPath(grid: Grid): Trace<GridState> {
  const tb = new TraceBuilder<GridState>();
  const [sr, sc] = grid.start;
  const q: [number, number][] = [[sr, sc]];
  const seen = new Set([`${sr},${sc}`]);
  const prev = new Map<string, [number, number]>();
  const visited: [number, number][] = [];
  const key = (r: number, c: number) => `${r},${c}`;

  const snap = (frontier: [number, number][], path: [number, number][] = []): GridState => ({
    grid,
    visited: visited.slice(),
    frontier: frontier.slice(),
    path,
  });

  while (q.length) {
    const [r, c] = q.shift()!;
    visited.push([r, c]);
    tb.push(snap(q), { narration: `Visit (${r}, ${c})`, highlights: [], meta: { visited: visited.length } });
    if (r === grid.end[0] && c === grid.end[1]) {
      const path = reconstruct(prev, grid.end);
      tb.push(snap([], path), { narration: `Reached end — path length ${path.length}`, highlights: [] });
      return tb.build(snap([], path));
    }
    for (const [nr, nc] of neighbors(grid, r, c)) {
      if (!seen.has(key(nr, nc))) {
        seen.add(key(nr, nc));
        prev.set(key(nr, nc), [r, c]);
        q.push([nr, nc]);
      }
    }
  }
  tb.push(snap([], []), { narration: "No path", highlights: [] });
  return tb.build(snap([], []));
}
