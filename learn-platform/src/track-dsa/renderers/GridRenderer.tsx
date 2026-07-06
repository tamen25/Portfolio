"use client";
import type { Frame } from "../types";
import type { GridState } from "../algorithms/pathfinding/grid";

export function GridRenderer({ frame }: { frame: Frame<GridState> }) {
  const { grid, visited, frontier, path } = frame.state;
  const vSet = new Set(visited.map(([r, c]) => `${r},${c}`));
  const fSet = new Set(frontier.map(([r, c]) => `${r},${c}`));
  const pSet = new Set(path.map(([r, c]) => `${r},${c}`));
  const color = (r: number, c: number, wall: boolean) => {
    if (wall) return "var(--color-edge)";
    if (`${r},${c}` === `${grid.start[0]},${grid.start[1]}`) return "var(--color-sorted)";
    if (`${r},${c}` === `${grid.end[0]},${grid.end[1]}`) return "var(--color-pivot)";
    if (pSet.has(`${r},${c}`)) return "var(--color-path)";
    if (fSet.has(`${r},${c}`)) return "var(--color-frontier)";
    if (vSet.has(`${r},${c}`)) return "var(--color-visited)";
    return "var(--color-panel)";
  };
  return (
    <div className="flex h-full w-full items-center justify-center p-4">
      <div className="grid gap-[2px]" style={{ gridTemplateColumns: `repeat(${grid.cols}, 1fr)` }}>
        {grid.cells.flat().map((cell) => (
          <div
            key={`${cell.r},${cell.c}`}
            className="aspect-square w-6 rounded-sm transition-colors duration-150"
            style={{ backgroundColor: color(cell.r, cell.c, cell.wall) }}
          />
        ))}
      </div>
    </div>
  );
}
