import test from "node:test";
import assert from "node:assert/strict";
import { meshLayout } from "../src/lib/mesh-layout";
import { SERVICES } from "../src/lib/mock/data";

test("meshLayout returns a position for every service", () => {
  const layout = meshLayout();
  for (const svc of SERVICES) {
    assert.ok(layout.has(svc), `missing position for ${svc}`);
  }
  assert.equal(layout.size, SERVICES.length);
});

test("meshLayout is deterministic", () => {
  const a = meshLayout();
  const b = meshLayout();
  for (const svc of SERVICES) {
    assert.deepEqual(a.get(svc), b.get(svc));
  }
});

test("meshLayout gives every node a distinct position", () => {
  const layout = meshLayout();
  const seen = new Set<string>();
  for (const pos of layout.values()) {
    const key = pos.map((n) => n.toFixed(4)).join(",");
    assert.ok(!seen.has(key), `duplicate position ${key}`);
    seen.add(key);
  }
});

test("api-gateway sits at the shallowest X (root of fan-out)", () => {
  const layout = meshLayout();
  const rootX = layout.get("api-gateway")![0];
  for (const svc of SERVICES) {
    if (svc === "api-gateway") continue;
    assert.ok(layout.get(svc)![0] >= rootX, `${svc} should be at or right of root`);
  }
});
