export const PSEUDO: Record<string, string[]> = {
  "bubble-sort": [
    "for i in 0..n:",
    "  for j in 0..n-i-1:",
    "    if a[j] > a[j+1]:",
    "      swap(a[j], a[j+1])",
    "  # a[n-i-1] settled",
  ],
  "insertion-sort": [
    "for i in 1..n:",
    "  key = a[i]",
    "  shift larger elements right, insert key",
  ],
  "selection-sort": [
    "for i in 0..n:",
    "  min = i",
    "  find min in a[i+1..n]",
    "  swap(a[i], a[min])",
  ],
  "merge-sort": [
    "sort(lo, hi):",
    "  split into halves, sort each",
    "  merge: compare fronts, take smaller",
    "  copy merged back into a[lo..hi]",
  ],
  "quick-sort": [
    "sort(lo, hi):",
    "  pivot = a[hi]",
    "  compare each a[j] with pivot",
    "  place pivot at its final index, recurse",
  ],
  "heap-sort": [
    "build max-heap",
    "for end from n-1 down to 1:",
    "  sift-down to restore heap",
    "  move max to end",
  ],
  "two-pointers": [
    "lo, hi = 0, n-1",
    "while lo < hi: check a[lo]+a[hi] vs target",
    "move the pointer that shrinks the gap",
  ],
  "sliding-window": [
    "sum = sum of first k",
    "best = sum",
    "slide: add a[i], drop a[i-k]; track best",
  ],
  "binary-search": [
    "lo, hi = 0, n-1",
    "while lo <= hi:",
    "  mid = (lo+hi)//2; compare a[mid] with target",
  ],
  "prefix-sums": [
    "running = 0",
    "for i: running += a[i]; prefix[i] = running",
  ],
  "fast-slow": [
    "slow, fast = start, start",
    "advance slow by 1, fast by 2",
    "if slow == fast: cycle found",
    "if fast hits end: no cycle",
    "# terminate",
  ],
  "merge-intervals": [
    "sort intervals by start",
    "for each: push as new interval, or",
    "extend the last if it overlaps",
  ],
  "bfs": [
    "queue = [start]",
    "while queue: pop front, mark visited",
    "push unseen neighbors",
    "first arrival at end = shortest path",
  ],
  "dfs": [
    "stack = [start]",
    "while stack: pop top, mark visited",
    "push unseen neighbors (go deep first)",
  ],
  "dijkstra": [
    "dist[start] = 0, others = ∞",
    "pop nearest unsettled node",
    "relax edges: dist[v] = min(dist[v], dist[u]+w)",
    "repeat until end settled",
  ],
  "astar": [
    "f(n) = g(n) + h(n)  # h = manhattan",
    "pop lowest f from open set",
    "relax neighbors, push with new f",
    "stop when end is expanded",
  ],
  "bst-insert": [
    "for each value:",
    "  descend left if smaller, right if larger",
    "  attach at the first empty slot",
  ],
  "traversal-inorder": [
    "inorder(node):",
    "  inorder(left); visit(node); inorder(right)",
    "  # yields sorted order for a BST",
  ],
  "traversal-preorder": [
    "preorder(node):",
    "  visit(node); preorder(left); preorder(right)",
  ],
  "traversal-postorder": [
    "postorder(node):",
    "  postorder(left); postorder(right); visit(node)",
  ],
  "trie": [
    "for each word:",
    "  walk from root, following/creating a child per char",
    "  shared prefixes reuse existing nodes",
  ],
  "heap": [
    "for i from n//2-1 down to 0:",
    "  sift-down i: swap with larger child",
    "  repeat until heap property holds",
  ],
  "graph-bfs": [
    "queue = [start]",
    "while queue: pop front u, record u",
    "enqueue unseen neighbors of u",
  ],
  "graph-dfs": [
    "dfs(u): mark u, record u",
    "  for each unseen neighbor v: dfs(v)",
  ],
  "toposort": [
    "compute in-degree of every node",
    "queue all in-degree-0 nodes",
    "pop u, emit it, decrement neighbors",
    "enqueue any that reach in-degree 0",
  ],
  "union-find": [
    "parent[i] = i",
    "find(x): follow parents, compress path",
    "union(a, b): point root(a) at root(b)",
  ],
};

export const PY: Record<string, string> = {
  "bubble-sort": `def bubble_sort(a):
    n = len(a)
    for i in range(n):
        for j in range(n - i - 1):
            if a[j] > a[j + 1]:
                a[j], a[j + 1] = a[j + 1], a[j]
    return a`,
  "insertion-sort": `def insertion_sort(a):
    for i in range(1, len(a)):
        key = a[i]
        j = i - 1
        while j >= 0 and a[j] > key:
            a[j + 1] = a[j]
            j -= 1
        a[j + 1] = key
    return a`,
  "selection-sort": `def selection_sort(a):
    n = len(a)
    for i in range(n):
        m = i
        for j in range(i + 1, n):
            if a[j] < a[m]:
                m = j
        a[i], a[m] = a[m], a[i]
    return a`,
  "merge-sort": `def merge_sort(a):
    if len(a) <= 1:
        return a
    mid = len(a) // 2
    left, right = merge_sort(a[:mid]), merge_sort(a[mid:])
    out, i, j = [], 0, 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            out.append(left[i]); i += 1
        else:
            out.append(right[j]); j += 1
    return out + left[i:] + right[j:]`,
  "quick-sort": `def quick_sort(a, lo=0, hi=None):
    if hi is None:
        hi = len(a) - 1
    if lo >= hi:
        return a
    pivot, i = a[hi], lo
    for j in range(lo, hi):
        if a[j] < pivot:
            a[i], a[j] = a[j], a[i]
            i += 1
    a[i], a[hi] = a[hi], a[i]
    quick_sort(a, lo, i - 1)
    quick_sort(a, i + 1, hi)
    return a`,
  "heap-sort": `def heap_sort(a):
    n = len(a)
    def sift(size, root):
        largest = root
        l, r = 2 * root + 1, 2 * root + 2
        if l < size and a[l] > a[largest]: largest = l
        if r < size and a[r] > a[largest]: largest = r
        if largest != root:
            a[root], a[largest] = a[largest], a[root]
            sift(size, largest)
    for i in range(n // 2 - 1, -1, -1):
        sift(n, i)
    for end in range(n - 1, 0, -1):
        a[0], a[end] = a[end], a[0]
        sift(end, 0)
    return a`,
  "two-pointers": `def pair_sum(a, target):
    lo, hi = 0, len(a) - 1
    while lo < hi:
        s = a[lo] + a[hi]
        if s == target:
            return [lo, hi]
        if s < target:
            lo += 1
        else:
            hi -= 1
    return []`,
  "sliding-window": `def max_window_sum(a, k):
    s = sum(a[:k])
    best = s
    for i in range(k, len(a)):
        s += a[i] - a[i - k]
        best = max(best, s)
    return best`,
  "binary-search": `def binary_search(a, target):
    lo, hi = 0, len(a) - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        if a[mid] == target:
            return mid
        if a[mid] < target:
            lo = mid + 1
        else:
            hi = mid - 1
    return -1`,
  "prefix-sums": `def prefix_sums(a):
    out, running = [], 0
    for x in a:
        running += x
        out.append(running)
    return out`,
  "fast-slow": `def has_cycle(nxt):
    slow = fast = 0
    while True:
        if fast < 0 or nxt[fast] < 0:
            return False
        slow = nxt[slow]
        fast = nxt[fast]
        if fast < 0 or nxt[fast] < 0:
            return False
        fast = nxt[fast]
        if slow == fast:
            return True`,
  "merge-intervals": `def merge_intervals(intervals):
    intervals.sort()
    merged = []
    for s, e in intervals:
        if merged and s <= merged[-1][1]:
            merged[-1][1] = max(merged[-1][1], e)
        else:
            merged.append([s, e])
    return merged`,
  "bfs": `from collections import deque

def bfs(grid, start, end):
    q = deque([start])
    seen = {start}
    prev = {}
    while q:
        r, c = q.popleft()
        if (r, c) == end:
            return reconstruct(prev, end)
        for n in neighbors(grid, r, c):
            if n not in seen:
                seen.add(n); prev[n] = (r, c); q.append(n)
    return []`,
  "dfs": `def dfs(grid, start, end):
    stack = [start]
    seen = {start}
    prev = {}
    while stack:
        r, c = stack.pop()
        if (r, c) == end:
            return reconstruct(prev, end)
        for n in neighbors(grid, r, c):
            if n not in seen:
                seen.add(n); prev[n] = (r, c); stack.append(n)
    return []`,
  "dijkstra": `import heapq

def dijkstra(grid, start, end):
    dist = {start: 0}
    prev = {}
    pq = [(0, start)]
    while pq:
        d, (r, c) = heapq.heappop(pq)
        if (r, c) == end:
            return reconstruct(prev, end)
        for n in neighbors(grid, r, c):
            nd = d + weight(grid, n)
            if nd < dist.get(n, float('inf')):
                dist[n] = nd; prev[n] = (r, c)
                heapq.heappush(pq, (nd, n))
    return []`,
  "astar": `import heapq

def astar(grid, start, end):
    def h(n): return abs(n[0]-end[0]) + abs(n[1]-end[1])
    g = {start: 0}
    prev = {}
    open_set = [(h(start), start)]
    while open_set:
        _, (r, c) = heapq.heappop(open_set)
        if (r, c) == end:
            return reconstruct(prev, end)
        for n in neighbors(grid, r, c):
            t = g[(r, c)] + weight(grid, n)
            if t < g.get(n, float('inf')):
                g[n] = t; prev[n] = (r, c)
                heapq.heappush(open_set, (t + h(n), n))
    return []`,
  "bst-insert": `def insert(root, value):
    if root is None:
        return Node(value)
    if value < root.value:
        root.left = insert(root.left, value)
    else:
        root.right = insert(root.right, value)
    return root`,
  "traversal-inorder": `def inorder(node, out):
    if not node:
        return
    inorder(node.left, out)
    out.append(node.value)
    inorder(node.right, out)`,
  "traversal-preorder": `def preorder(node, out):
    if not node:
        return
    out.append(node.value)
    preorder(node.left, out)
    preorder(node.right, out)`,
  "traversal-postorder": `def postorder(node, out):
    if not node:
        return
    postorder(node.left, out)
    postorder(node.right, out)
    out.append(node.value)`,
  "trie": `def insert(root, word):
    node = root
    for ch in word:
        if ch not in node.children:
            node.children[ch] = TrieNode()
        node = node.children[ch]
    node.is_word = True`,
  "heap": `def heapify(a):
    n = len(a)
    def sift(size, root):
        largest = root
        l, r = 2 * root + 1, 2 * root + 2
        if l < size and a[l] > a[largest]: largest = l
        if r < size and a[r] > a[largest]: largest = r
        if largest != root:
            a[root], a[largest] = a[largest], a[root]
            sift(size, largest)
    for i in range(n // 2 - 1, -1, -1):
        sift(n, i)
    return a`,
  "graph-bfs": `from collections import deque

def bfs(adj, start):
    order, seen = [], {start}
    q = deque([start])
    while q:
        u = q.popleft()
        order.append(u)
        for v in adj[u]:
            if v not in seen:
                seen.add(v)
                q.append(v)
    return order`,
  "graph-dfs": `def dfs(adj, start):
    order, seen = [], set()
    def go(u):
        seen.add(u)
        order.append(u)
        for v in adj[u]:
            if v not in seen:
                go(v)
    go(start)
    return order`,
  "toposort": `from collections import deque

def toposort(adj):
    indeg = [0] * len(adj)
    for outs in adj:
        for v in outs:
            indeg[v] += 1
    q = deque(i for i, d in enumerate(indeg) if d == 0)
    order = []
    while q:
        u = q.popleft()
        order.append(u)
        for v in adj[u]:
            indeg[v] -= 1
            if indeg[v] == 0:
                q.append(v)
    return order`,
  "union-find": `def union_find(n, unions):
    parent = list(range(n))
    def find(x):
        while parent[x] != x:
            parent[x] = parent[parent[x]]
            x = parent[x]
        return x
    for a, b in unions:
        parent[find(a)] = find(b)
    return [find(i) for i in range(n)]`,
};

export const JS: Record<string, string> = {
  "bubble-sort": `function bubbleSort(a) {
  for (let i = 0; i < a.length; i++)
    for (let j = 0; j < a.length - i - 1; j++)
      if (a[j] > a[j + 1]) [a[j], a[j + 1]] = [a[j + 1], a[j]];
  return a;
}`,
  "insertion-sort": `function insertionSort(a) {
  for (let i = 1; i < a.length; i++) {
    const key = a[i];
    let j = i - 1;
    while (j >= 0 && a[j] > key) a[j + 1] = a[j--];
    a[j + 1] = key;
  }
  return a;
}`,
  "selection-sort": `function selectionSort(a) {
  for (let i = 0; i < a.length; i++) {
    let m = i;
    for (let j = i + 1; j < a.length; j++) if (a[j] < a[m]) m = j;
    [a[i], a[m]] = [a[m], a[i]];
  }
  return a;
}`,
  "merge-sort": `function mergeSort(a) {
  if (a.length <= 1) return a;
  const mid = a.length >> 1;
  const left = mergeSort(a.slice(0, mid)), right = mergeSort(a.slice(mid));
  const out = [];
  let i = 0, j = 0;
  while (i < left.length && j < right.length)
    out.push(left[i] <= right[j] ? left[i++] : right[j++]);
  return [...out, ...left.slice(i), ...right.slice(j)];
}`,
  "quick-sort": `function quickSort(a, lo = 0, hi = a.length - 1) {
  if (lo >= hi) return a;
  const pivot = a[hi];
  let i = lo;
  for (let j = lo; j < hi; j++)
    if (a[j] < pivot) [a[i], a[j]] = [a[j], a[i++]];
  [a[i], a[hi]] = [a[hi], a[i]];
  quickSort(a, lo, i - 1);
  quickSort(a, i + 1, hi);
  return a;
}`,
  "heap-sort": `function heapSort(a) {
  const n = a.length;
  const sift = (size, root) => {
    let largest = root;
    const l = 2 * root + 1, r = 2 * root + 2;
    if (l < size && a[l] > a[largest]) largest = l;
    if (r < size && a[r] > a[largest]) largest = r;
    if (largest !== root) {
      [a[root], a[largest]] = [a[largest], a[root]];
      sift(size, largest);
    }
  };
  for (let i = (n >> 1) - 1; i >= 0; i--) sift(n, i);
  for (let end = n - 1; end > 0; end--) {
    [a[0], a[end]] = [a[end], a[0]];
    sift(end, 0);
  }
  return a;
}`,
  "two-pointers": `function pairSum(a, target) {
  let lo = 0, hi = a.length - 1;
  while (lo < hi) {
    const sum = a[lo] + a[hi];
    if (sum === target) return [lo, hi];
    if (sum < target) lo++; else hi--;
  }
  return [-1, -1];
}`,
  "sliding-window": `function maxWindowSum(a, k) {
  let sum = 0;
  for (let i = 0; i < k; i++) sum += a[i];
  let best = sum;
  for (let i = k; i < a.length; i++) {
    sum += a[i] - a[i - k];
    best = Math.max(best, sum);
  }
  return best;
}`,
  "binary-search": `function binarySearch(a, target) {
  let lo = 0, hi = a.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (a[mid] === target) return mid;
    if (a[mid] < target) lo = mid + 1; else hi = mid - 1;
  }
  return -1;
}`,
  "prefix-sums": `function prefixSums(a) {
  const out = [0];
  for (const x of a) out.push(out[out.length - 1] + x);
  return out;
}`,
  "fast-slow": `function hasCycle(next) {
  let slow = 0, fast = 0;
  do {
    slow = next[slow];
    fast = next[next[fast]];
  } while (fast != null && slow !== fast);
  return slow === fast;
}`,
  "merge-intervals": `function mergeIntervals(intervals) {
  intervals.sort((x, y) => x[0] - y[0]);
  const out = [];
  for (const [s, e] of intervals) {
    const last = out[out.length - 1];
    if (last && s <= last[1]) last[1] = Math.max(last[1], e);
    else out.push([s, e]);
  }
  return out;
}`,
  "bfs": `function bfs(grid, start, end) {
  const q = [start], seen = new Set([start.join()]);
  const prev = new Map();
  while (q.length) {
    const [r, c] = q.shift();
    if (r === end[0] && c === end[1]) return rebuild(prev, end);
    for (const n of neighbors(grid, r, c))
      if (!seen.has(n.join())) {
        seen.add(n.join());
        prev.set(n.join(), [r, c]);
        q.push(n);
      }
  }
  return [];
}`,
  "dfs": `function dfs(grid, start, end) {
  const stack = [start], seen = new Set();
  const prev = new Map();
  while (stack.length) {
    const [r, c] = stack.pop();
    const key = r + "," + c;
    if (seen.has(key)) continue;
    seen.add(key);
    if (r === end[0] && c === end[1]) return rebuild(prev, end);
    for (const n of neighbors(grid, r, c))
      if (!seen.has(n.join())) {
        prev.set(n.join(), [r, c]);
        stack.push(n);
      }
  }
  return [];
}`,
  "dijkstra": `function dijkstra(grid, start, end) {
  const dist = new Map([[start.join(), 0]]);
  const pq = [[0, start]];
  const prev = new Map();
  while (pq.length) {
    pq.sort((a, b) => a[0] - b[0]);
    const [d, [r, c]] = pq.shift();
    if (r === end[0] && c === end[1]) return rebuild(prev, end);
    for (const n of neighbors(grid, r, c)) {
      const nd = d + weight(grid, n);
      if (nd < (dist.get(n.join()) ?? Infinity)) {
        dist.set(n.join(), nd);
        prev.set(n.join(), [r, c]);
        pq.push([nd, n]);
      }
    }
  }
  return [];
}`,
  "astar": `function astar(grid, start, end) {
  const h = ([r, c]) => Math.abs(r - end[0]) + Math.abs(c - end[1]);
  const g = new Map([[start.join(), 0]]);
  const pq = [[h(start), start]];
  const prev = new Map();
  while (pq.length) {
    pq.sort((a, b) => a[0] - b[0]);
    const [, [r, c]] = pq.shift();
    if (r === end[0] && c === end[1]) return rebuild(prev, end);
    for (const n of neighbors(grid, r, c)) {
      const t = g.get(r + "," + c) + weight(grid, n);
      if (t < (g.get(n.join()) ?? Infinity)) {
        g.set(n.join(), t);
        prev.set(n.join(), [r, c]);
        pq.push([t + h(n), n]);
      }
    }
  }
  return [];
}`,
  "bst-insert": `function insert(root, value) {
  if (!root) return { value, left: null, right: null };
  if (value < root.value) root.left = insert(root.left, value);
  else root.right = insert(root.right, value);
  return root;
}`,
  "traversal-inorder": `function inorder(node, out = []) {
  if (!node) return out;
  inorder(node.left, out);
  out.push(node.value);
  inorder(node.right, out);
  return out;
}`,
  "traversal-preorder": `function preorder(node, out = []) {
  if (!node) return out;
  out.push(node.value);
  preorder(node.left, out);
  preorder(node.right, out);
  return out;
}`,
  "traversal-postorder": `function postorder(node, out = []) {
  if (!node) return out;
  postorder(node.left, out);
  postorder(node.right, out);
  out.push(node.value);
  return out;
}`,
  "trie": `function insert(root, word) {
  let node = root;
  for (const ch of word) {
    node.children[ch] ??= { children: {}, isWord: false };
    node = node.children[ch];
  }
  node.isWord = true;
}`,
  "heap": `function heapify(a) {
  const n = a.length;
  const sift = (size, root) => {
    let largest = root;
    const l = 2 * root + 1, r = 2 * root + 2;
    if (l < size && a[l] > a[largest]) largest = l;
    if (r < size && a[r] > a[largest]) largest = r;
    if (largest !== root) {
      [a[root], a[largest]] = [a[largest], a[root]];
      sift(size, largest);
    }
  };
  for (let i = (n >> 1) - 1; i >= 0; i--) sift(n, i);
  return a;
}`,
  "graph-bfs": `function bfs(adj, start) {
  const order = [], seen = new Set([start]);
  const q = [start];
  while (q.length) {
    const u = q.shift();
    order.push(u);
    for (const v of adj[u])
      if (!seen.has(v)) { seen.add(v); q.push(v); }
  }
  return order;
}`,
  "graph-dfs": `function dfs(adj, start) {
  const order = [], seen = new Set();
  const go = (u) => {
    seen.add(u);
    order.push(u);
    for (const v of adj[u]) if (!seen.has(v)) go(v);
  };
  go(start);
  return order;
}`,
  "toposort": `function toposort(adj) {
  const indeg = adj.map(() => 0);
  for (const outs of adj) for (const v of outs) indeg[v]++;
  const q = [];
  indeg.forEach((d, i) => { if (d === 0) q.push(i); });
  const order = [];
  while (q.length) {
    const u = q.shift();
    order.push(u);
    for (const v of adj[u]) if (--indeg[v] === 0) q.push(v);
  }
  return order;
}`,
  "union-find": `function unionFind(n, unions) {
  const parent = [...Array(n).keys()];
  const find = (x) => {
    while (parent[x] !== x) x = parent[x] = parent[parent[x]];
    return x;
  };
  for (const [a, b] of unions) parent[find(a)] = find(b);
  return parent.map((_, i) => find(i));
}`,
};

export const CPP: Record<string, string> = {
  "bubble-sort": `void bubble_sort(vector<int>& a) {
  for (int i = 0; i < a.size(); i++)
    for (int j = 0; j + i + 1 < a.size(); j++)
      if (a[j] > a[j + 1]) swap(a[j], a[j + 1]);
}`,
  "insertion-sort": `void insertion_sort(vector<int>& a) {
  for (int i = 1; i < a.size(); i++) {
    int key = a[i], j = i - 1;
    while (j >= 0 && a[j] > key) a[j + 1] = a[j--];
    a[j + 1] = key;
  }
}`,
  "selection-sort": `void selection_sort(vector<int>& a) {
  for (int i = 0; i < a.size(); i++) {
    int m = i;
    for (int j = i + 1; j < a.size(); j++) if (a[j] < a[m]) m = j;
    swap(a[i], a[m]);
  }
}`,
  "merge-sort": `void merge_sort(vector<int>& a, int lo, int hi) {
  if (hi - lo <= 1) return;
  int mid = (lo + hi) / 2;
  merge_sort(a, lo, mid);
  merge_sort(a, mid, hi);
  inplace_merge(a.begin() + lo, a.begin() + mid, a.begin() + hi);
}`,
  "quick-sort": `void quick_sort(vector<int>& a, int lo, int hi) {
  if (lo >= hi) return;
  int pivot = a[hi], i = lo;
  for (int j = lo; j < hi; j++)
    if (a[j] < pivot) swap(a[i++], a[j]);
  swap(a[i], a[hi]);
  quick_sort(a, lo, i - 1);
  quick_sort(a, i + 1, hi);
}`,
  "heap-sort": `void heap_sort(vector<int>& a) {
  make_heap(a.begin(), a.end());
  sort_heap(a.begin(), a.end());
}`,
  "two-pointers": `pair<int,int> pair_sum(vector<int>& a, int target) {
  int lo = 0, hi = a.size() - 1;
  while (lo < hi) {
    int s = a[lo] + a[hi];
    if (s == target) return {lo, hi};
    s < target ? lo++ : hi--;
  }
  return {-1, -1};
}`,
  "sliding-window": `int max_window_sum(vector<int>& a, int k) {
  int sum = 0;
  for (int i = 0; i < k; i++) sum += a[i];
  int best = sum;
  for (int i = k; i < a.size(); i++) {
    sum += a[i] - a[i - k];
    best = max(best, sum);
  }
  return best;
}`,
  "binary-search": `int binary_search(vector<int>& a, int target) {
  int lo = 0, hi = a.size() - 1;
  while (lo <= hi) {
    int mid = (lo + hi) / 2;
    if (a[mid] == target) return mid;
    a[mid] < target ? lo = mid + 1 : hi = mid - 1;
  }
  return -1;
}`,
  "prefix-sums": `vector<int> prefix_sums(vector<int>& a) {
  vector<int> out{0};
  for (int x : a) out.push_back(out.back() + x);
  return out;
}`,
  "fast-slow": `bool has_cycle(vector<int>& next) {
  int slow = 0, fast = 0;
  do {
    slow = next[slow];
    fast = next[next[fast]];
  } while (slow != fast);
  return true;
}`,
  "merge-intervals": `vector<pair<int,int>> merge_intervals(vector<pair<int,int>> iv) {
  sort(iv.begin(), iv.end());
  vector<pair<int,int>> out;
  for (auto& [s, e] : iv) {
    if (!out.empty() && s <= out.back().second)
      out.back().second = max(out.back().second, e);
    else out.push_back({s, e});
  }
  return out;
}`,
  "bfs": `vector<Cell> bfs(Grid& g, Cell start, Cell end) {
  queue<Cell> q; q.push(start);
  set<Cell> seen{start};
  map<Cell, Cell> prev;
  while (!q.empty()) {
    Cell u = q.front(); q.pop();
    if (u == end) return rebuild(prev, end);
    for (Cell n : neighbors(g, u))
      if (!seen.count(n)) { seen.insert(n); prev[n] = u; q.push(n); }
  }
  return {};
}`,
  "dfs": `vector<Cell> dfs(Grid& g, Cell start, Cell end) {
  stack<Cell> st; st.push(start);
  set<Cell> seen;
  map<Cell, Cell> prev;
  while (!st.empty()) {
    Cell u = st.top(); st.pop();
    if (seen.count(u)) continue;
    seen.insert(u);
    if (u == end) return rebuild(prev, end);
    for (Cell n : neighbors(g, u))
      if (!seen.count(n)) { prev[n] = u; st.push(n); }
  }
  return {};
}`,
  "dijkstra": `vector<Cell> dijkstra(Grid& g, Cell start, Cell end) {
  priority_queue<pair<int,Cell>, vector<pair<int,Cell>>, greater<>> pq;
  map<Cell,int> dist{{start, 0}};
  map<Cell,Cell> prev;
  pq.push({0, start});
  while (!pq.empty()) {
    auto [d, u] = pq.top(); pq.pop();
    if (u == end) return rebuild(prev, end);
    for (Cell n : neighbors(g, u)) {
      int nd = d + weight(g, n);
      if (!dist.count(n) || nd < dist[n]) {
        dist[n] = nd; prev[n] = u; pq.push({nd, n});
      }
    }
  }
  return {};
}`,
  "astar": `vector<Cell> astar(Grid& g, Cell start, Cell end) {
  auto h = [&](Cell c){ return abs(c.r-end.r) + abs(c.c-end.c); };
  priority_queue<pair<int,Cell>, vector<pair<int,Cell>>, greater<>> pq;
  map<Cell,int> gs{{start, 0}};
  map<Cell,Cell> prev;
  pq.push({h(start), start});
  while (!pq.empty()) {
    Cell u = pq.top().second; pq.pop();
    if (u == end) return rebuild(prev, end);
    for (Cell n : neighbors(g, u)) {
      int t = gs[u] + weight(g, n);
      if (!gs.count(n) || t < gs[n]) {
        gs[n] = t; prev[n] = u; pq.push({t + h(n), n});
      }
    }
  }
  return {};
}`,
  "bst-insert": `Node* insert(Node* root, int value) {
  if (!root) return new Node{value, nullptr, nullptr};
  if (value < root->value) root->left = insert(root->left, value);
  else root->right = insert(root->right, value);
  return root;
}`,
  "traversal-inorder": `void inorder(Node* node, vector<int>& out) {
  if (!node) return;
  inorder(node->left, out);
  out.push_back(node->value);
  inorder(node->right, out);
}`,
  "traversal-preorder": `void preorder(Node* node, vector<int>& out) {
  if (!node) return;
  out.push_back(node->value);
  preorder(node->left, out);
  preorder(node->right, out);
}`,
  "traversal-postorder": `void postorder(Node* node, vector<int>& out) {
  if (!node) return;
  postorder(node->left, out);
  postorder(node->right, out);
  out.push_back(node->value);
}`,
  "trie": `void insert(TrieNode* root, const string& word) {
  TrieNode* node = root;
  for (char ch : word) {
    if (!node->children.count(ch)) node->children[ch] = new TrieNode();
    node = node->children[ch];
  }
  node->isWord = true;
}`,
  "heap": `void heapify(vector<int>& a) {
  int n = a.size();
  function<void(int,int)> sift = [&](int size, int root) {
    int largest = root, l = 2*root+1, r = 2*root+2;
    if (l < size && a[l] > a[largest]) largest = l;
    if (r < size && a[r] > a[largest]) largest = r;
    if (largest != root) { swap(a[root], a[largest]); sift(size, largest); }
  };
  for (int i = n/2 - 1; i >= 0; i--) sift(n, i);
}`,
  "graph-bfs": `vector<int> bfs(vector<vector<int>>& adj, int start) {
  vector<int> order;
  vector<bool> seen(adj.size(), false);
  queue<int> q; q.push(start); seen[start] = true;
  while (!q.empty()) {
    int u = q.front(); q.pop();
    order.push_back(u);
    for (int v : adj[u])
      if (!seen[v]) { seen[v] = true; q.push(v); }
  }
  return order;
}`,
  "graph-dfs": `vector<int> dfs(vector<vector<int>>& adj, int start) {
  vector<int> order;
  vector<bool> seen(adj.size(), false);
  function<void(int)> go = [&](int u) {
    seen[u] = true;
    order.push_back(u);
    for (int v : adj[u]) if (!seen[v]) go(v);
  };
  go(start);
  return order;
}`,
  "toposort": `vector<int> toposort(vector<vector<int>>& adj) {
  vector<int> indeg(adj.size(), 0), order;
  for (auto& outs : adj) for (int v : outs) indeg[v]++;
  queue<int> q;
  for (int i = 0; i < adj.size(); i++) if (!indeg[i]) q.push(i);
  while (!q.empty()) {
    int u = q.front(); q.pop();
    order.push_back(u);
    for (int v : adj[u]) if (--indeg[v] == 0) q.push(v);
  }
  return order;
}`,
  "union-find": `struct DSU {
  vector<int> parent;
  DSU(int n) : parent(n) { iota(parent.begin(), parent.end(), 0); }
  int find(int x) {
    while (parent[x] != x) x = parent[x] = parent[parent[x]];
    return x;
  }
  void unite(int a, int b) { parent[find(a)] = find(b); }
};`,
};

export const JAVA: Record<string, string> = {
  "bubble-sort": `static void bubbleSort(int[] a) {
  for (int i = 0; i < a.length; i++)
    for (int j = 0; j < a.length - i - 1; j++)
      if (a[j] > a[j + 1]) { int t = a[j]; a[j] = a[j + 1]; a[j + 1] = t; }
}`,
  "insertion-sort": `static void insertionSort(int[] a) {
  for (int i = 1; i < a.length; i++) {
    int key = a[i], j = i - 1;
    while (j >= 0 && a[j] > key) a[j + 1] = a[j--];
    a[j + 1] = key;
  }
}`,
  "selection-sort": `static void selectionSort(int[] a) {
  for (int i = 0; i < a.length; i++) {
    int m = i;
    for (int j = i + 1; j < a.length; j++) if (a[j] < a[m]) m = j;
    int t = a[i]; a[i] = a[m]; a[m] = t;
  }
}`,
  "merge-sort": `static int[] mergeSort(int[] a) {
  if (a.length <= 1) return a;
  int mid = a.length / 2;
  int[] left = mergeSort(Arrays.copyOfRange(a, 0, mid));
  int[] right = mergeSort(Arrays.copyOfRange(a, mid, a.length));
  int[] out = new int[a.length];
  int i = 0, j = 0, k = 0;
  while (i < left.length && j < right.length)
    out[k++] = left[i] <= right[j] ? left[i++] : right[j++];
  while (i < left.length) out[k++] = left[i++];
  while (j < right.length) out[k++] = right[j++];
  return out;
}`,
  "quick-sort": `static void quickSort(int[] a, int lo, int hi) {
  if (lo >= hi) return;
  int pivot = a[hi], i = lo;
  for (int j = lo; j < hi; j++)
    if (a[j] < pivot) { int t = a[i]; a[i++] = a[j]; a[j] = t; }
  int t = a[i]; a[i] = a[hi]; a[hi] = t;
  quickSort(a, lo, i - 1);
  quickSort(a, i + 1, hi);
}`,
  "heap-sort": `static void heapSort(int[] a) {
  int n = a.length;
  for (int i = n / 2 - 1; i >= 0; i--) sift(a, n, i);
  for (int end = n - 1; end > 0; end--) {
    int t = a[0]; a[0] = a[end]; a[end] = t;
    sift(a, end, 0);
  }
}
static void sift(int[] a, int size, int root) {
  int largest = root, l = 2 * root + 1, r = 2 * root + 2;
  if (l < size && a[l] > a[largest]) largest = l;
  if (r < size && a[r] > a[largest]) largest = r;
  if (largest != root) {
    int t = a[root]; a[root] = a[largest]; a[largest] = t;
    sift(a, size, largest);
  }
}`,
  "two-pointers": `static int[] pairSum(int[] a, int target) {
  int lo = 0, hi = a.length - 1;
  while (lo < hi) {
    int s = a[lo] + a[hi];
    if (s == target) return new int[]{lo, hi};
    if (s < target) lo++; else hi--;
  }
  return new int[]{-1, -1};
}`,
  "sliding-window": `static int maxWindowSum(int[] a, int k) {
  int sum = 0;
  for (int i = 0; i < k; i++) sum += a[i];
  int best = sum;
  for (int i = k; i < a.length; i++) {
    sum += a[i] - a[i - k];
    best = Math.max(best, sum);
  }
  return best;
}`,
  "binary-search": `static int binarySearch(int[] a, int target) {
  int lo = 0, hi = a.length - 1;
  while (lo <= hi) {
    int mid = (lo + hi) >>> 1;
    if (a[mid] == target) return mid;
    if (a[mid] < target) lo = mid + 1; else hi = mid - 1;
  }
  return -1;
}`,
  "prefix-sums": `static int[] prefixSums(int[] a) {
  int[] out = new int[a.length + 1];
  for (int i = 0; i < a.length; i++) out[i + 1] = out[i] + a[i];
  return out;
}`,
  "fast-slow": `static boolean hasCycle(int[] next) {
  int slow = 0, fast = 0;
  do {
    slow = next[slow];
    fast = next[next[fast]];
  } while (slow != fast);
  return true;
}`,
  "merge-intervals": `static List<int[]> mergeIntervals(int[][] iv) {
  Arrays.sort(iv, (x, y) -> x[0] - y[0]);
  List<int[]> out = new ArrayList<>();
  for (int[] cur : iv) {
    if (!out.isEmpty() && cur[0] <= out.get(out.size() - 1)[1])
      out.get(out.size() - 1)[1] = Math.max(out.get(out.size() - 1)[1], cur[1]);
    else out.add(cur);
  }
  return out;
}`,
  "bfs": `static List<Cell> bfs(Grid g, Cell start, Cell end) {
  Queue<Cell> q = new ArrayDeque<>(); q.add(start);
  Set<Cell> seen = new HashSet<>(List.of(start));
  Map<Cell, Cell> prev = new HashMap<>();
  while (!q.isEmpty()) {
    Cell u = q.poll();
    if (u.equals(end)) return rebuild(prev, end);
    for (Cell n : neighbors(g, u))
      if (seen.add(n)) { prev.put(n, u); q.add(n); }
  }
  return List.of();
}`,
  "dfs": `static List<Cell> dfs(Grid g, Cell start, Cell end) {
  Deque<Cell> stack = new ArrayDeque<>(); stack.push(start);
  Set<Cell> seen = new HashSet<>();
  Map<Cell, Cell> prev = new HashMap<>();
  while (!stack.isEmpty()) {
    Cell u = stack.pop();
    if (!seen.add(u)) continue;
    if (u.equals(end)) return rebuild(prev, end);
    for (Cell n : neighbors(g, u))
      if (!seen.contains(n)) { prev.put(n, u); stack.push(n); }
  }
  return List.of();
}`,
  "dijkstra": `static List<Cell> dijkstra(Grid g, Cell start, Cell end) {
  PriorityQueue<int[]> pq = new PriorityQueue<>((x, y) -> x[0] - y[0]);
  Map<Cell, Integer> dist = new HashMap<>(Map.of(start, 0));
  Map<Cell, Cell> prev = new HashMap<>();
  pq.add(new int[]{0, start.id()});
  while (!pq.isEmpty()) {
    int[] top = pq.poll();
    Cell u = Cell.of(top[1]);
    if (u.equals(end)) return rebuild(prev, end);
    for (Cell n : neighbors(g, u)) {
      int nd = top[0] + weight(g, n);
      if (nd < dist.getOrDefault(n, Integer.MAX_VALUE)) {
        dist.put(n, nd); prev.put(n, u); pq.add(new int[]{nd, n.id()});
      }
    }
  }
  return List.of();
}`,
  "astar": `static List<Cell> astar(Grid g, Cell start, Cell end) {
  ToIntFunction<Cell> h = c -> Math.abs(c.r - end.r) + Math.abs(c.c - end.c);
  PriorityQueue<int[]> pq = new PriorityQueue<>((x, y) -> x[0] - y[0]);
  Map<Cell, Integer> gs = new HashMap<>(Map.of(start, 0));
  Map<Cell, Cell> prev = new HashMap<>();
  pq.add(new int[]{h.applyAsInt(start), start.id()});
  while (!pq.isEmpty()) {
    Cell u = Cell.of(pq.poll()[1]);
    if (u.equals(end)) return rebuild(prev, end);
    for (Cell n : neighbors(g, u)) {
      int t = gs.get(u) + weight(g, n);
      if (t < gs.getOrDefault(n, Integer.MAX_VALUE)) {
        gs.put(n, t); prev.put(n, u);
        pq.add(new int[]{t + h.applyAsInt(n), n.id()});
      }
    }
  }
  return List.of();
}`,
  "bst-insert": `static Node insert(Node root, int value) {
  if (root == null) return new Node(value);
  if (value < root.value) root.left = insert(root.left, value);
  else root.right = insert(root.right, value);
  return root;
}`,
  "traversal-inorder": `static void inorder(Node node, List<Integer> out) {
  if (node == null) return;
  inorder(node.left, out);
  out.add(node.value);
  inorder(node.right, out);
}`,
  "traversal-preorder": `static void preorder(Node node, List<Integer> out) {
  if (node == null) return;
  out.add(node.value);
  preorder(node.left, out);
  preorder(node.right, out);
}`,
  "traversal-postorder": `static void postorder(Node node, List<Integer> out) {
  if (node == null) return;
  postorder(node.left, out);
  postorder(node.right, out);
  out.add(node.value);
}`,
  "trie": `static void insert(TrieNode root, String word) {
  TrieNode node = root;
  for (char ch : word.toCharArray()) {
    node.children.putIfAbsent(ch, new TrieNode());
    node = node.children.get(ch);
  }
  node.isWord = true;
}`,
  "heap": `static void heapify(int[] a) {
  for (int i = a.length / 2 - 1; i >= 0; i--) sift(a, a.length, i);
}
static void sift(int[] a, int size, int root) {
  int largest = root, l = 2 * root + 1, r = 2 * root + 2;
  if (l < size && a[l] > a[largest]) largest = l;
  if (r < size && a[r] > a[largest]) largest = r;
  if (largest != root) {
    int t = a[root]; a[root] = a[largest]; a[largest] = t;
    sift(a, size, largest);
  }
}`,
  "graph-bfs": `static List<Integer> bfs(List<List<Integer>> adj, int start) {
  List<Integer> order = new ArrayList<>();
  boolean[] seen = new boolean[adj.size()];
  Queue<Integer> q = new ArrayDeque<>(); q.add(start); seen[start] = true;
  while (!q.isEmpty()) {
    int u = q.poll();
    order.add(u);
    for (int v : adj.get(u))
      if (!seen[v]) { seen[v] = true; q.add(v); }
  }
  return order;
}`,
  "graph-dfs": `static void dfs(List<List<Integer>> adj, int u, boolean[] seen, List<Integer> order) {
  seen[u] = true;
  order.add(u);
  for (int v : adj.get(u)) if (!seen[v]) dfs(adj, v, seen, order);
}`,
  "toposort": `static List<Integer> toposort(List<List<Integer>> adj) {
  int[] indeg = new int[adj.size()];
  for (List<Integer> outs : adj) for (int v : outs) indeg[v]++;
  Queue<Integer> q = new ArrayDeque<>();
  for (int i = 0; i < indeg.length; i++) if (indeg[i] == 0) q.add(i);
  List<Integer> order = new ArrayList<>();
  while (!q.isEmpty()) {
    int u = q.poll();
    order.add(u);
    for (int v : adj.get(u)) if (--indeg[v] == 0) q.add(v);
  }
  return order;
}`,
  "union-find": `class DSU {
  int[] parent;
  DSU(int n) {
    parent = new int[n];
    for (int i = 0; i < n; i++) parent[i] = i;
  }
  int find(int x) {
    while (parent[x] != x) x = parent[x] = parent[parent[x]];
    return x;
  }
  void union(int a, int b) { parent[find(a)] = find(b); }
}`,
};
