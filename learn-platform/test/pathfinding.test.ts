import test from "node:test";
import assert from "node:assert/strict";
import { makeGrid } from "../src/track-dsa/algorithms/pathfinding/grid";
import { bfsPath } from "../src/track-dsa/algorithms/pathfinding/bfs";
import { dfsPath } from "../src/track-dsa/algorithms/pathfinding/dfs";
import { dijkstraPath } from "../src/track-dsa/algorithms/pathfinding/dijkstra";
import { astarPath } from "../src/track-dsa/algorithms/pathfinding/astar";

const open = makeGrid(3, 3, [], [0, 0], [2, 2]);
// wall column at c=1 across all rows fully splits the grid → no path
const blocked = makeGrid(3, 3, [[0, 1], [1, 1], [2, 1]], [0, 0], [2, 2]);

const finders = { bfsPath, dfsPath, dijkstraPath, astarPath };
for (const [name, fn] of Object.entries(finders)) {
  test(`${name}: finds a path on open grid, start→end`, () => {
    const t = fn(open);
    const path = t.result.path;
    assert.deepEqual(path[0], [0, 0]);
    assert.deepEqual(path[path.length - 1], [2, 2]);
  });
  test(`${name}: path is contiguous (adjacent steps)`, () => {
    const t = fn(open);
    const path = t.result.path;
    for (let i = 1; i < path.length; i++) {
      const d = Math.abs(path[i][0] - path[i - 1][0]) + Math.abs(path[i][1] - path[i - 1][1]);
      assert.equal(d, 1, `${name} non-adjacent step`);
    }
  });
  test(`${name}: returns empty path when blocked`, () => {
    const t = fn(blocked);
    assert.equal(t.result.path.length, 0);
  });
}
test("bfs finds shortest length on open 3x3 = 5 cells", () => {
  assert.equal(bfsPath(open).result.path.length, 5);
});
