import { writeFile } from "node:fs/promises";
import path from "node:path";
import { BASE_PHOTOS, COLLECTION_PREFERENCE } from "@/lib/photos";
import {
  applyOverrides,
  validateOrder,
  validateOverrides,
  normalizeOrder,
  normalizeOverrides,
  serializeJson,
  type OrderMap,
  type Overrides,
} from "@/lib/arrange";

const LIB = path.join(process.cwd(), "src", "lib");
const ORDER_FILE = path.join(LIB, "photo-order.json");
const OVERRIDES_FILE = path.join(LIB, "photo-overrides.json");

/**
 * Dev-only: persists curation from /arrange. `overrides` (moves + hidden) is
 * validated against the full manifest; `order` is validated against the
 * post-override photo set, since you order what's actually shown. Both files
 * are read by the site at build time. Refuses to run outside `next dev`.
 */
export async function POST(request: Request) {
  if (process.env.NODE_ENV !== "development") {
    return new Response(null, { status: 404 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ errors: ["invalid JSON body"] }, { status: 400 });
  }

  const rawOverrides = (body as { overrides?: unknown })?.overrides ?? {
    moves: {},
    hidden: [],
  };
  const rawOrder = (body as { order?: unknown })?.order ?? {};

  // Collections a photo may be moved into: known ones plus any already present.
  const allowedCollections = [
    ...new Set([
      ...COLLECTION_PREFERENCE,
      ...BASE_PHOTOS.map((p) => p.collection),
    ]),
  ];

  const overrideErrors = validateOverrides(
    rawOverrides,
    BASE_PHOTOS,
    allowedCollections,
  );
  if (overrideErrors.length) {
    return Response.json({ errors: overrideErrors }, { status: 400 });
  }

  const overrides = normalizeOverrides(rawOverrides as Overrides, BASE_PHOTOS);
  const effectivePhotos = applyOverrides(BASE_PHOTOS, overrides);

  const orderErrors = validateOrder(rawOrder, effectivePhotos);
  if (orderErrors.length) {
    return Response.json({ errors: orderErrors }, { status: 400 });
  }

  const order = normalizeOrder(rawOrder as OrderMap, effectivePhotos);

  await writeFile(OVERRIDES_FILE, serializeJson(overrides), "utf8");
  await writeFile(ORDER_FILE, serializeJson(order), "utf8");

  return Response.json({
    saved: {
      order: Object.keys(order),
      moves: Object.keys(overrides.moves).length,
      hidden: overrides.hidden.length,
    },
  });
}
