import type { AlgorithmEntry } from "./types";
import { bubbleSort } from "./algorithms/sorting/bubble";
import { insertionSort } from "./algorithms/sorting/insertion";
import { selectionSort } from "./algorithms/sorting/selection";
import { mergeSort } from "./algorithms/sorting/merge";
import { quickSort } from "./algorithms/sorting/quick";
import { heapSort } from "./algorithms/sorting/heap";
import { twoPointersPairSum } from "./algorithms/array/two-pointers";
import { slidingWindowMaxSum } from "./algorithms/array/sliding-window";
import { binarySearch } from "./algorithms/array/binary-search";
import { prefixSums } from "./algorithms/array/prefix-sums";
import { fastSlowHasCycle } from "./algorithms/array/fast-slow";
import { mergeIntervals } from "./algorithms/array/merge-intervals";
import { makeGrid } from "./algorithms/pathfinding/grid";
import { bfsPath } from "./algorithms/pathfinding/bfs";
import { dfsPath } from "./algorithms/pathfinding/dfs";
import { dijkstraPath } from "./algorithms/pathfinding/dijkstra";
import { astarPath } from "./algorithms/pathfinding/astar";
import { bstInsertSequence } from "./algorithms/trees/bst";
import { traversal } from "./algorithms/trees/traversal";
import { trieInsert } from "./algorithms/trees/trie";
import { heapSiftDemo } from "./algorithms/trees/heap";
import { PSEUDO, PY } from "./content/pseudocode";

// deterministic seed array (no Math.random inside run)
const randArray = (n = 12) => Array.from({ length: n }, (_, i) => (i * 37 + 11) % 41);

// deterministic demo grid: 8x8 with a partial wall column (gap at row 0 and row 7)
const demoGrid = () =>
  makeGrid(
    8,
    8,
    [[1, 4], [2, 4], [3, 4], [4, 4], [5, 4], [6, 4]] as [number, number][],
    [0, 0],
    [7, 7]
  );

export const CATALOG: AlgorithmEntry[] = [
  { slug: "bubble-sort", name: "Bubble Sort", category: "sorting", complexity: { time: "O(n²)", space: "O(1)" }, summary: "Repeatedly swap adjacent out-of-order pairs; the largest bubbles to the end each pass.", run: bubbleSort as AlgorithmEntry["run"], renderer: "bars", defaultInput: randArray, pseudocode: PSEUDO["bubble-sort"], code: { pseudo: PSEUDO["bubble-sort"].join("\n"), py: PY["bubble-sort"] }, comparableWith: ["insertion-sort", "selection-sort", "quick-sort", "merge-sort", "heap-sort"] },
  { slug: "insertion-sort", name: "Insertion Sort", category: "sorting", complexity: { time: "O(n²)", space: "O(1)" }, summary: "Grow a sorted prefix, inserting each new element into place.", run: insertionSort as AlgorithmEntry["run"], renderer: "bars", defaultInput: randArray, pseudocode: PSEUDO["insertion-sort"], code: { py: PY["insertion-sort"] }, comparableWith: ["bubble-sort", "selection-sort"] },
  { slug: "selection-sort", name: "Selection Sort", category: "sorting", complexity: { time: "O(n²)", space: "O(1)" }, summary: "Select the minimum of the unsorted region and place it next.", run: selectionSort as AlgorithmEntry["run"], renderer: "bars", defaultInput: randArray, pseudocode: PSEUDO["selection-sort"], code: { py: PY["selection-sort"] }, comparableWith: ["bubble-sort"] },
  { slug: "merge-sort", name: "Merge Sort", category: "sorting", complexity: { time: "O(n log n)", space: "O(n)" }, summary: "Divide in halves, sort each, merge the two sorted halves.", run: mergeSort as AlgorithmEntry["run"], renderer: "bars", defaultInput: randArray, pseudocode: PSEUDO["merge-sort"], code: { py: PY["merge-sort"] }, comparableWith: ["quick-sort", "bubble-sort"] },
  { slug: "quick-sort", name: "Quick Sort", category: "sorting", complexity: { time: "O(n log n)", space: "O(log n)" }, summary: "Partition around a pivot, recurse on each side.", run: quickSort as AlgorithmEntry["run"], renderer: "bars", defaultInput: randArray, pseudocode: PSEUDO["quick-sort"], code: { py: PY["quick-sort"] }, comparableWith: ["merge-sort", "bubble-sort"] },
  { slug: "heap-sort", name: "Heap Sort", category: "sorting", complexity: { time: "O(n log n)", space: "O(1)" }, summary: "Build a max-heap, repeatedly extract the max to the end.", run: heapSort as AlgorithmEntry["run"], renderer: "bars", defaultInput: randArray, pseudocode: PSEUDO["heap-sort"], code: { py: PY["heap-sort"] }, comparableWith: ["quick-sort"] },
  { slug: "two-pointers", name: "Two Pointers", category: "array-patterns", complexity: { time: "O(n)", space: "O(1)" }, summary: "Converge two indices from the ends of a sorted array to find a target pair.", run: ((inp: number[]) => twoPointersPairSum(inp, 15)) as AlgorithmEntry["run"], renderer: "bars", defaultInput: () => [1, 2, 4, 7, 11, 15], pseudocode: PSEUDO["two-pointers"], code: { py: PY["two-pointers"] } },
  { slug: "sliding-window", name: "Sliding Window", category: "array-patterns", complexity: { time: "O(n)", space: "O(1)" }, summary: "Maintain a fixed-width window sum as it slides across the array.", run: ((inp: number[]) => slidingWindowMaxSum(inp, 3)) as AlgorithmEntry["run"], renderer: "bars", defaultInput: () => [2, 1, 5, 1, 3, 2], pseudocode: PSEUDO["sliding-window"], code: { py: PY["sliding-window"] } },
  { slug: "binary-search", name: "Binary Search", category: "array-patterns", complexity: { time: "O(log n)", space: "O(1)" }, summary: "Halve the search range each step on a sorted array.", run: ((inp: number[]) => binarySearch(inp, 7)) as AlgorithmEntry["run"], renderer: "bars", defaultInput: () => [1, 3, 5, 7, 9, 11], pseudocode: PSEUDO["binary-search"], code: { py: PY["binary-search"] } },
  { slug: "prefix-sums", name: "Prefix Sums", category: "array-patterns", complexity: { time: "O(n)", space: "O(n)" }, summary: "Precompute cumulative sums for O(1) range queries.", run: prefixSums as AlgorithmEntry["run"], renderer: "bars", defaultInput: () => [1, 2, 3, 4, 5], pseudocode: PSEUDO["prefix-sums"], code: { py: PY["prefix-sums"] } },
  { slug: "fast-slow", name: "Fast & Slow Pointers", category: "array-patterns", complexity: { time: "O(n)", space: "O(1)" }, summary: "Two pointers at different speeds detect a cycle where they meet.", run: fastSlowHasCycle as AlgorithmEntry["run"], renderer: "bars", defaultInput: () => [1, 2, 3, 1], pseudocode: PSEUDO["fast-slow"], code: { py: PY["fast-slow"] } },
  { slug: "merge-intervals", name: "Merge Intervals", category: "array-patterns", complexity: { time: "O(n log n)", space: "O(n)" }, summary: "Sort by start, then absorb each overlapping interval into the last.", run: mergeIntervals as AlgorithmEntry["run"], renderer: "bars", defaultInput: () => [1, 3, 2, 6, 8, 10, 15, 18], pseudocode: PSEUDO["merge-intervals"], code: { py: PY["merge-intervals"] } },
  { slug: "bfs", name: "Breadth-First Search", category: "pathfinding", complexity: { time: "O(V+E)", space: "O(V)" }, summary: "Explore in waves; the first time we reach the goal is a shortest path.", run: bfsPath as AlgorithmEntry["run"], renderer: "grid", defaultInput: demoGrid, pseudocode: PSEUDO["bfs"], code: { py: PY["bfs"] } },
  { slug: "dfs", name: "Depth-First Search", category: "pathfinding", complexity: { time: "O(V+E)", space: "O(V)" }, summary: "Plunge deep along one branch before backtracking.", run: dfsPath as AlgorithmEntry["run"], renderer: "grid", defaultInput: demoGrid, pseudocode: PSEUDO["dfs"], code: { py: PY["dfs"] } },
  { slug: "dijkstra", name: "Dijkstra", category: "pathfinding", complexity: { time: "O(E log V)", space: "O(V)" }, summary: "Grow shortest-known distances outward using a priority queue.", run: dijkstraPath as AlgorithmEntry["run"], renderer: "grid", defaultInput: demoGrid, pseudocode: PSEUDO["dijkstra"], code: { py: PY["dijkstra"] } },
  { slug: "astar", name: "A*", category: "pathfinding", complexity: { time: "O(E)", space: "O(V)" }, summary: "Dijkstra guided by a heuristic toward the goal.", run: astarPath as AlgorithmEntry["run"], renderer: "grid", defaultInput: demoGrid, pseudocode: PSEUDO["astar"], code: { py: PY["astar"] } },
  { slug: "bst-insert", name: "BST Insert", category: "trees", complexity: { time: "O(h)", space: "O(1)" }, summary: "Insert values, descending left/right until an empty slot.", run: bstInsertSequence as AlgorithmEntry["run"], renderer: "tree", defaultInput: () => [5, 3, 8, 1, 4, 7, 9], pseudocode: PSEUDO["bst-insert"], code: { py: PY["bst-insert"] } },
  { slug: "traversal-inorder", name: "In-order Traversal", category: "trees", complexity: { time: "O(n)", space: "O(h)" }, summary: "Left, node, right — yields sorted order for a BST.", run: ((v: number[]) => traversal(v, "in")) as AlgorithmEntry["run"], renderer: "tree", defaultInput: () => [5, 3, 8, 1, 4, 7, 9], pseudocode: PSEUDO["traversal-inorder"], code: { py: PY["traversal-inorder"] } },
  { slug: "traversal-preorder", name: "Pre-order Traversal", category: "trees", complexity: { time: "O(n)", space: "O(h)" }, summary: "Node, left, right.", run: ((v: number[]) => traversal(v, "pre")) as AlgorithmEntry["run"], renderer: "tree", defaultInput: () => [5, 3, 8, 1, 4, 7, 9], pseudocode: PSEUDO["traversal-preorder"], code: { py: PY["traversal-preorder"] } },
  { slug: "traversal-postorder", name: "Post-order Traversal", category: "trees", complexity: { time: "O(n)", space: "O(h)" }, summary: "Left, right, node.", run: ((v: number[]) => traversal(v, "post")) as AlgorithmEntry["run"], renderer: "tree", defaultInput: () => [5, 3, 8, 1, 4, 7, 9], pseudocode: PSEUDO["traversal-postorder"], code: { py: PY["traversal-postorder"] } },
  { slug: "trie", name: "Trie Insert", category: "trees", complexity: { time: "O(L)", space: "O(ALPHABET·N)" }, summary: "Insert words character-by-character, sharing common prefixes.", run: (() => trieInsert(["cat", "car", "dog"])) as AlgorithmEntry["run"], renderer: "tree", defaultInput: () => null, pseudocode: PSEUDO["trie"], code: { py: PY["trie"] } },
  { slug: "heap", name: "Binary Heap (sift-down)", category: "trees", complexity: { time: "O(n)", space: "O(1)" }, summary: "Heapify by sinking each parent below larger children.", run: heapSiftDemo as AlgorithmEntry["run"], renderer: "tree", defaultInput: () => [3, 9, 2, 1, 7, 5, 8], pseudocode: PSEUDO["heap"], code: { py: PY["heap"] } },
];

export function bySlug(slug: string): AlgorithmEntry | undefined {
  return CATALOG.find((e) => e.slug === slug);
}

export function byCategory(): Record<string, AlgorithmEntry[]> {
  const out: Record<string, AlgorithmEntry[]> = {};
  for (const e of CATALOG) (out[e.category] ??= []).push(e);
  return out;
}
