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
