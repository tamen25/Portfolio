export type TreeNode = { id: number; value: number; x: number; y: number };
export type Edge = [number, number];
export type TreeState = {
  nodes: TreeNode[];
  edges: Edge[];
  highlightIds: number[];
  order?: number[];
};

type BNode = { value: number; left?: BNode; right?: BNode; id: number };

export function buildBST(values: number[]): BNode | undefined {
  let root: BNode | undefined;
  let idc = 0;
  for (const v of values) {
    const node: BNode = { value: v, id: idc++ };
    if (!root) {
      root = node;
      continue;
    }
    let cur = root;
    while (true) {
      if (v < cur.value) {
        if (!cur.left) {
          cur.left = node;
          break;
        }
        cur = cur.left;
      } else {
        if (!cur.right) {
          cur.right = node;
          break;
        }
        cur = cur.right;
      }
    }
  }
  return root;
}

export function layout(root: BNode | undefined): { nodes: TreeNode[]; edges: Edge[] } {
  const nodes: TreeNode[] = [];
  const edges: Edge[] = [];
  let xCounter = 0;
  function walk(n: BNode | undefined, depth: number): void {
    if (!n) return;
    walk(n.left, depth + 1);
    const x = xCounter++;
    nodes.push({ id: n.id, value: n.value, x, y: depth });
    if (n.left) edges.push([n.id, n.left.id]);
    if (n.right) edges.push([n.id, n.right.id]);
    walk(n.right, depth + 1);
  }
  walk(root, 0);
  return { nodes, edges };
}

export function inorder(n: BNode | undefined, out: number[]): void {
  if (!n) return;
  inorder(n.left, out);
  out.push(n.value);
  inorder(n.right, out);
}
export function preorder(n: BNode | undefined, out: number[]): void {
  if (!n) return;
  out.push(n.value);
  preorder(n.left, out);
  preorder(n.right, out);
}
export function postorder(n: BNode | undefined, out: number[]): void {
  if (!n) return;
  postorder(n.left, out);
  postorder(n.right, out);
  out.push(n.value);
}
export { type BNode };
