export type Cell = { r: number; c: number; wall: boolean; weight: number };
export type Grid = {
  rows: number;
  cols: number;
  cells: Cell[][];
  start: [number, number];
  end: [number, number];
};
export type GridState = {
  grid: Grid;
  visited: [number, number][];
  frontier: [number, number][];
  path: [number, number][];
};

export function makeGrid(
  rows: number,
  cols: number,
  walls: [number, number][],
  start: [number, number],
  end: [number, number]
): Grid {
  const wallSet = new Set(walls.map(([r, c]) => `${r},${c}`));
  const cells: Cell[][] = [];
  for (let r = 0; r < rows; r++) {
    cells.push([]);
    for (let c = 0; c < cols; c++) {
      cells[r].push({ r, c, wall: wallSet.has(`${r},${c}`), weight: 1 });
    }
  }
  return { rows, cols, cells, start, end };
}

export function neighbors(grid: Grid, r: number, c: number): [number, number][] {
  const out: [number, number][] = [];
  for (const [dr, dc] of [[-1, 0], [1, 0], [0, -1], [0, 1]] as const) {
    const nr = r + dr, nc = c + dc;
    if (nr >= 0 && nr < grid.rows && nc >= 0 && nc < grid.cols && !grid.cells[nr][nc].wall) out.push([nr, nc]);
  }
  return out;
}

export function reconstruct(prev: Map<string, [number, number]>, end: [number, number]): [number, number][] {
  const path: [number, number][] = [];
  let cur: [number, number] | undefined = end;
  while (cur) {
    path.unshift(cur);
    cur = prev.get(`${cur[0]},${cur[1]}`);
  }
  return path;
}
