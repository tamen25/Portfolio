import test from "node:test";
import assert from "node:assert/strict";
import {
  applyOverrides,
  validateOrder,
  validateOverrides,
  normalizeOrder,
  normalizeOverrides,
  serializeJson,
  type Overrides,
} from "../src/lib/arrange";
import { BASE_PHOTOS, PHOTOS, ORDER, OVERRIDES } from "../src/lib/photos";

const photos = [
  { id: "iceland-a", collection: "iceland" },
  { id: "iceland-b", collection: "iceland" },
  { id: "iceland-c", collection: "iceland" },
  { id: "moon-a", collection: "moon" },
];
const collections = ["iceland", "moon", "astro"];

const empty: Overrides = { moves: {}, hidden: [], featured: {} };
const ov = (o: Partial<Overrides>): Overrides => ({
  moves: {},
  hidden: [],
  featured: {},
  ...o,
});

// ---- applyOverrides ----

test("applyOverrides with no overrides is a pass-through", () => {
  assert.deepEqual(applyOverrides(photos, empty), photos);
});

test("applyOverrides hides photos", () => {
  const out = applyOverrides(photos, ov({ hidden: ["moon-a"] }));
  assert.deepEqual(out.map((p) => p.id), ["iceland-a", "iceland-b", "iceland-c"]);
});

test("applyOverrides moves a photo to another collection", () => {
  const out = applyOverrides(photos, ov({ moves: { "moon-a": "iceland" } }));
  assert.equal(out.find((p) => p.id === "moon-a")!.collection, "iceland");
});

test("applyOverrides tolerates stale ids in overrides", () => {
  const out = applyOverrides(
    photos,
    ov({ moves: { "gone-x": "moon" }, hidden: ["gone-y"] }),
  );
  assert.equal(out.length, photos.length);
});

// ---- validateOrder ----

test("validateOrder accepts a valid partial order and empty map", () => {
  assert.deepEqual(validateOrder({ iceland: ["iceland-b", "iceland-a"] }, photos), []);
  assert.deepEqual(validateOrder({}, photos), []);
});

test("validateOrder rejects bad shapes, dupes, unknown/wrong-collection ids", () => {
  assert.equal(validateOrder(null, photos).length, 1);
  assert.equal(validateOrder([], photos).length, 1);
  assert.ok(validateOrder({ iceland: "iceland-a" }, photos).length > 0);
  assert.match(validateOrder({ iceland: ["iceland-a", "iceland-a"] }, photos).join(), /duplicate/);
  assert.match(validateOrder({ iceland: ["nope"] }, photos).join(), /unknown photo id/);
  assert.match(validateOrder({ iceland: ["moon-a"] }, photos).join(), /unknown photo id/);
});

// ---- validateOverrides ----

test("validateOverrides accepts valid moves and hidden", () => {
  assert.deepEqual(
    validateOverrides(
      { moves: { "moon-a": "iceland" }, hidden: ["iceland-c"] },
      photos,
      collections,
    ),
    [],
  );
});

test("validateOverrides rejects non-object and bad move/hidden shapes", () => {
  assert.equal(validateOverrides(null, photos, collections).length, 1);
  assert.ok(validateOverrides({ moves: [], hidden: [] }, photos, collections).length > 0);
  assert.ok(validateOverrides({ moves: {}, hidden: "x" }, photos, collections).length > 0);
});

test("validateOverrides flags unknown photo ids and unknown target collections", () => {
  assert.match(
    validateOverrides({ moves: { "ghost": "iceland" }, hidden: [] }, photos, collections).join(),
    /unknown photo id/,
  );
  assert.match(
    validateOverrides({ moves: { "moon-a": "nowhere" }, hidden: [] }, photos, collections).join(),
    /unknown collection/,
  );
  assert.match(
    validateOverrides({ moves: {}, hidden: ["ghost"] }, photos, collections).join(),
    /unknown photo id/,
  );
  assert.match(
    validateOverrides({ moves: {}, hidden: ["moon-a", "moon-a"] }, photos, collections).join(),
    /duplicate/,
  );
});

test("validateOverrides flags bad featured slots, ids, and hidden targets", () => {
  assert.deepEqual(
    validateOverrides(
      { moves: {}, hidden: [], featured: { wideFrame: "iceland-a" } },
      photos,
      collections,
    ),
    [],
  );
  assert.match(
    validateOverrides(
      { moves: {}, hidden: [], featured: { nosuchslot: "iceland-a" } },
      photos,
      collections,
    ).join(),
    /unknown slot/,
  );
  assert.match(
    validateOverrides(
      { moves: {}, hidden: [], featured: { wideFrame: "ghost" } },
      photos,
      collections,
    ).join(),
    /unknown photo id/,
  );
  assert.match(
    validateOverrides(
      { moves: {}, hidden: ["iceland-a"], featured: { wideFrame: "iceland-a" } },
      photos,
      collections,
    ).join(),
    /hidden photo/,
  );
});

// ---- normalizeOrder ----

test("normalizeOrder drops empty and import-order lists, sorts keys", () => {
  const normalized = normalizeOrder(
    {
      moon: ["moon-a"], // matches import order -> dropped
      iceland: ["iceland-c", "iceland-a", "iceland-b"],
      astro: [], // empty -> dropped
    },
    photos,
  );
  assert.deepEqual(normalized, { iceland: ["iceland-c", "iceland-a", "iceland-b"] });
});

// ---- normalizeOverrides ----

test("normalizeOverrides drops no-op moves, stale ids, sorts and dedupes", () => {
  const normalized = normalizeOverrides(
    ov({
      moves: {
        "moon-a": "iceland", // real move -> kept
        "iceland-a": "iceland", // no-op (own collection) -> dropped
        "ghost": "moon", // stale -> dropped
      },
      hidden: ["iceland-c", "iceland-c", "ghost"], // dedupe + drop stale
    }),
    photos,
  );
  assert.deepEqual(normalized, {
    moves: { "moon-a": "iceland" },
    hidden: ["iceland-c"],
    featured: {},
  });
});

test("normalizeOverrides keeps valid featured slots, drops stale/hidden ones", () => {
  const normalized = normalizeOverrides(
    ov({
      hidden: ["iceland-c"],
      featured: {
        wideFrame: "iceland-a", // valid -> kept
        strip1: "ghost", // stale -> dropped
        strip2: "iceland-c", // hidden -> dropped
      },
    }),
    photos,
  );
  assert.deepEqual(normalized.featured, { wideFrame: "iceland-a" });
});

// ---- serialize ----

test("serializeJson writes pretty JSON with trailing newline", () => {
  const text = serializeJson({ moves: {}, hidden: [], featured: {} });
  assert.ok(text.endsWith("}\n"));
  assert.deepEqual(JSON.parse(text), { moves: {}, hidden: [], featured: {} });
});

// ---- integration with the real manifest ----

test("saved overrides validate against the real base manifest", () => {
  const known = [...new Set(BASE_PHOTOS.map((p) => p.collection))];
  assert.deepEqual(validateOverrides(OVERRIDES, BASE_PHOTOS, known), []);
});

test("saved order validates against the curated (effective) photos", () => {
  assert.deepEqual(validateOrder(ORDER, PHOTOS), []);
});

test("PHOTOS is BASE_PHOTOS with overrides applied", () => {
  assert.deepEqual(PHOTOS, applyOverrides(BASE_PHOTOS, OVERRIDES));
});
