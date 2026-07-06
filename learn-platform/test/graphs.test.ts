import test from "node:test";
import assert from "node:assert/strict";
import { graphBFS, graphDFS } from "../src/track-dsa/algorithms/graphs/traverse";
import { topoSort } from "../src/track-dsa/algorithms/graphs/toposort";
import { unionFind } from "../src/track-dsa/algorithms/graphs/union-find";

const adj = [[1, 2], [0, 3], [0, 3], [1, 2]]; // square graph 0-1-3-2-0

test("BFS from 0 visits all nodes, starts at 0", () => {
  const t = graphBFS(adj, 0);
  assert.equal(t.result.order![0], 0);
  assert.deepEqual([...t.result.order!].sort(), [0, 1, 2, 3]);
});
test("DFS from 0 visits all nodes", () => {
  const t = graphDFS(adj, 0);
  assert.deepEqual([...t.result.order!].sort(), [0, 1, 2, 3]);
});
test("topological sort respects edges", () => {
  const dag = [[1, 2], [3], [3], []]; // 0->1,0->2,1->3,2->3
  const order = topoSort(dag).result.order!;
  const pos = new Map(order.map((v, i) => [v, i]));
  for (let u = 0; u < dag.length; u++) for (const v of dag[u]) assert.ok(pos.get(u)! < pos.get(v)!);
});
test("union-find merges components", () => {
  const t = unionFind(5, [[0, 1], [1, 2], [3, 4]]);
  const root = t.result.order!;
  assert.equal(root[0], root[2]); // 0,1,2 same component
  assert.notEqual(root[0], root[3]); // different from 3,4
});
