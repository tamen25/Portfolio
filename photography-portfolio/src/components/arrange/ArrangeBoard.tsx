"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import {
  applyOverrides,
  FEATURED_SLOTS,
  SLOT_META,
  type FeaturedSlot,
  type Overrides,
  type OrderMap,
} from "@/lib/arrange";

type BoardPhoto = {
  id: string;
  collection: string;
  src: string;
  alt: string;
  width: number;
  height: number;
  permalink: string | null;
};

type BoardCollection = { id: string; name: string };

type Props = {
  /** Full manifest, in import order, before any curation. */
  photos: BoardPhoto[];
  collections: BoardCollection[];
  savedOrder: Partial<Record<string, string[]>>;
  savedOverrides: Overrides;
  /** Currently-resolved photo id per home slot (explicit choice or fallback). */
  featuredResolved: Record<FeaturedSlot, string | null>;
};

/** Same rank logic as photosByCollection: curated ids lead, the rest follow. */
const applyOrder = (ids: string[], curated: string[] | undefined): string[] => {
  if (!curated?.length) return ids;
  const rank = new Map(curated.map((id, i) => [id, i]));
  return [...ids].sort(
    (a, b) => (rank.get(a) ?? curated.length) - (rank.get(b) ?? curated.length),
  );
};

const move = (ids: string[], from: number, to: number): string[] => {
  const next = [...ids];
  const [moved] = next.splice(from, 1);
  next.splice(to, 0, moved);
  return next;
};

const sameSet = (a: string[], b: string[]) =>
  a.length === b.length && a.every((v, i) => v === b[i]);

export function ArrangeBoard({
  photos,
  collections,
  savedOrder,
  savedOverrides,
  featuredResolved,
}: Props) {
  const photoById = useMemo(
    () => new Map(photos.map((p) => [p.id, p] as const)),
    [photos],
  );

  // Curation state, seeded from the saved files.
  const [moves, setMoves] = useState<Record<string, string>>(
    () => savedOverrides.moves ?? {},
  );
  const [hidden, setHidden] = useState<Set<string>>(
    () => new Set(savedOverrides.hidden ?? []),
  );
  const [featured, setFeatured] = useState<Partial<Record<FeaturedSlot, string>>>(
    () => savedOverrides.featured ?? {},
  );
  // When set, clicking a photo assigns it to this home slot instead of opening.
  const [picking, setPicking] = useState<FeaturedSlot | null>(null);
  // Per-collection order, keyed by collection id. Seeded from savedOrder and
  // extended lazily as moves create new arrangements.
  const [order, setOrder] = useState<Record<string, string[]>>(
    () => ({ ...savedOrder }) as Record<string, string[]>,
  );

  const [dragId, setDragId] = useState<string | null>(null);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  // Effective, curated photo set (hidden dropped, moves applied), mirroring
  // what the live site derives. Recomputed as curation changes.
  const overrides: Overrides = useMemo(
    () => ({ moves, hidden: [...hidden], featured }),
    [moves, hidden, featured],
  );
  const effective = useMemo(
    () => applyOverrides(photos, overrides),
    [photos, overrides],
  );

  // Photos shown per collection, in the current (possibly reordered) order.
  const byCollection = useMemo(() => {
    const map: Record<string, BoardPhoto[]> = {};
    for (const c of collections) {
      const inC = effective.filter((p) => p.collection === c.id);
      const importIds = inC.map((p) => p.id);
      const arranged = applyOrder(importIds, order[c.id]);
      map[c.id] = arranged.map((id) => photoById.get(id)!);
    }
    return map;
  }, [collections, effective, order, photoById]);

  const hiddenPhotos = useMemo(
    () => photos.filter((p) => hidden.has(p.id)),
    [photos, hidden],
  );

  const touch = () => {
    setDirty(true);
    setStatus(null);
  };

  const reorder = (collection: string, from: number, to: number) => {
    if (from === to) return;
    const ids = byCollection[collection].map((p) => p.id);
    setOrder((prev) => ({ ...prev, [collection]: move(ids, from, to) }));
    touch();
  };

  const moveToCollection = (id: string, target: string) => {
    const photo = photoById.get(id)!;
    setMoves((prev) => {
      const next = { ...prev };
      if (target === photo.collection) delete next[id];
      else next[id] = target;
      return next;
    });
    // Drop any stale order references so the moved photo lands at the end of
    // its new collection until dragged.
    setOrder((prev) => {
      const next = { ...prev };
      for (const key of Object.keys(next)) {
        next[key] = next[key].filter((oid) => oid !== id);
      }
      return next;
    });
    touch();
  };

  const setHiddenState = (id: string, hide: boolean) => {
    setHidden((prev) => {
      const next = new Set(prev);
      if (hide) next.add(id);
      else next.delete(id);
      return next;
    });
    if (hide) {
      setOrder((prev) => {
        const next = { ...prev };
        for (const key of Object.keys(next)) {
          next[key] = next[key].filter((oid) => oid !== id);
        }
        return next;
      });
      // A hidden photo can't fill a home slot; drop it back to its fallback.
      setFeatured((prev) => {
        const next = { ...prev };
        for (const slot of FEATURED_SLOTS) {
          if (next[slot] === id) delete next[slot];
        }
        return next;
      });
    }
    touch();
  };

  // Photo currently filling each slot: explicit choice, else the resolved
  // fallback the server computed. Explicit choices override the fallback.
  const slotPhotoId = (slot: FeaturedSlot): string | null =>
    featured[slot] ?? featuredResolved[slot];

  const assignSlot = (slot: FeaturedSlot, id: string) => {
    setFeatured((prev) => ({ ...prev, [slot]: id }));
    setPicking(null);
    touch();
  };

  const clearSlot = (slot: FeaturedSlot) => {
    setFeatured((prev) => {
      const next = { ...prev };
      delete next[slot];
      return next;
    });
    touch();
  };

  const onPhotoClick = (id: string) => {
    if (picking) assignSlot(picking, id);
  };

  const save = async () => {
    setSaving(true);
    setStatus(null);
    // Only keep orders that differ from import order, to keep the file small.
    const orderPayload: OrderMap = {};
    for (const c of collections) {
      const importIds = effective
        .filter((p) => p.collection === c.id)
        .map((p) => p.id);
      const current = byCollection[c.id].map((p) => p.id);
      if (!sameSet(current, importIds)) orderPayload[c.id] = current;
    }
    try {
      const res = await fetch("/api/arrange", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order: orderPayload, overrides }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setStatus(
          `Save failed: ${(data.errors ?? [res.statusText]).join("; ")}`,
        );
      } else {
        setDirty(false);
        setStatus("Saved. Reload the gallery to see the result.");
      }
    } catch (err) {
      setStatus(`Save failed: ${err instanceof Error ? err.message : err}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="mx-auto max-w-[1400px] px-6 pb-32">
      <header className="sticky top-0 z-10 -mx-6 mb-4 border-b border-ridge bg-night/95 px-6 py-4 backdrop-blur">
        <div className="flex flex-wrap items-center gap-4">
          <div>
            <h1 className="font-display text-2xl font-medium tracking-tight">
              Arrange
            </h1>
            <p className="text-sm text-overcast">
              Reorder · move between collections · hide · pick home-page images.
              Dev tool — saves to photo-order.json & photo-overrides.json,
              applied site-wide at build time.
            </p>
          </div>
          <div className="ml-auto flex items-center gap-3">
            {status && (
              <span
                className={`text-sm ${status.startsWith("Save failed") ? "text-alpenglow" : "text-overcast"}`}
              >
                {status}
              </span>
            )}
            {dirty && !status && (
              <span className="text-sm text-alpenglow">Unsaved changes</span>
            )}
            <button
              type="button"
              onClick={save}
              disabled={!dirty || saving}
              className="border border-snowlight/40 px-4 py-2 text-sm tracking-wide transition-colors hover:border-alpenglow hover:text-alpenglow disabled:cursor-default disabled:opacity-40 disabled:hover:border-snowlight/40 disabled:hover:text-snowlight"
            >
              {saving ? "Saving…" : "Save"}
            </button>
          </div>
        </div>
      </header>

      {picking && (
        <div className="sticky top-[73px] z-10 -mx-6 mb-2 flex items-center justify-between bg-alpenglow/15 px-6 py-2 text-sm text-alpenglow">
          <span>
            Pick a photo below for “{SLOT_META[picking].label}” — click any
            frame.
          </span>
          <button
            type="button"
            onClick={() => setPicking(null)}
            className="underline underline-offset-4 hover:text-snowlight"
          >
            cancel
          </button>
        </div>
      )}

      {/* Home-page image slots */}
      <section className="pt-8">
        <h2 className="font-display text-xl font-medium tracking-tight">
          Home page images
        </h2>
        <p className="text-sm text-overcast">
          Choose which frame fills each slot on the landing page. Empty = an
          automatic pick.
        </p>
        <div className="mt-4 grid grid-cols-[repeat(auto-fill,minmax(170px,1fr))] gap-3">
          {FEATURED_SLOTS.map((slot) => {
            const id = slotPhotoId(slot);
            const p = id ? photoById.get(id) : undefined;
            const explicit = Boolean(featured[slot]);
            return (
              <div
                key={slot}
                className={`border p-1.5 ${picking === slot ? "border-alpenglow" : "border-ridge"}`}
              >
                <div className="relative aspect-[3/2] w-full overflow-hidden bg-ridge">
                  {p && (
                    <Image
                      src={p.src}
                      alt={p.alt}
                      fill
                      sizes="200px"
                      className="object-cover"
                    />
                  )}
                </div>
                <div className="mt-1.5 flex items-baseline justify-between gap-2">
                  <span className="truncate text-xs text-snowlight">
                    {SLOT_META[slot].label}
                  </span>
                  <span className="shrink-0 text-[10px] text-overcast">
                    {explicit ? "chosen" : "auto"}
                  </span>
                </div>
                {SLOT_META[slot].hint && (
                  <p className="truncate text-[10px] text-overcast">
                    {SLOT_META[slot].hint}
                  </p>
                )}
                <div className="mt-1 flex items-center gap-3 text-[11px]">
                  <button
                    type="button"
                    onClick={() =>
                      setPicking((cur) => (cur === slot ? null : slot))
                    }
                    className="text-alpenglow underline-offset-2 hover:underline"
                  >
                    {picking === slot ? "picking…" : "change"}
                  </button>
                  {explicit && (
                    <button
                      type="button"
                      onClick={() => clearSlot(slot)}
                      className="text-overcast underline-offset-2 hover:text-snowlight hover:underline"
                    >
                      reset
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {collections.map((c) => {
        const shown = byCollection[c.id];
        if (!shown.length) return null;
        const importIds = effective
          .filter((p) => p.collection === c.id)
          .map((p) => p.id);
        const curated = !sameSet(shown.map((p) => p.id), importIds);
        return (
          <section key={c.id} className="pt-10">
            <div className="flex items-baseline gap-3">
              <h2 className="font-display text-xl font-medium tracking-tight">
                {c.name}
              </h2>
              <span className="text-sm text-overcast">
                {shown.length} {shown.length === 1 ? "frame" : "frames"} ·{" "}
                {curated ? "curated order" : "import order"}
              </span>
              {curated && (
                <button
                  type="button"
                  onClick={() => {
                    setOrder((prev) => {
                      const next = { ...prev };
                      delete next[c.id];
                      return next;
                    });
                    touch();
                  }}
                  className="text-sm text-overcast underline decoration-ridge underline-offset-4 transition-colors hover:text-alpenglow"
                >
                  reset order
                </button>
              )}
            </div>
            <div className="mt-4 grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-2">
              {shown.map((p, i) => (
                <PhotoTile
                  key={p.id}
                  photo={p}
                  index={i}
                  total={shown.length}
                  collections={collections}
                  picking={picking !== null}
                  isDragging={dragId === p.id}
                  onClick={() => onPhotoClick(p.id)}
                  onDragStart={() => setDragId(p.id)}
                  onDragEnd={() => setDragId(null)}
                  onDragOverTile={() => {
                    if (!dragId || dragId === p.id) return;
                    const from = shown.findIndex((q) => q.id === dragId);
                    if (from === -1) return; // dragged from another collection
                    reorder(c.id, from, i);
                  }}
                  onNudge={(dir) => reorder(c.id, i, i + dir)}
                  onMove={(target) => moveToCollection(p.id, target)}
                  onHide={() => setHiddenState(p.id, true)}
                />
              ))}
            </div>
          </section>
        );
      })}

      {hiddenPhotos.length > 0 && (
        <section className="pt-12">
          <h2 className="font-display text-xl font-medium tracking-tight text-overcast">
            Hidden ({hiddenPhotos.length})
          </h2>
          <p className="text-sm text-overcast">
            Removed from the site. Files stay on disk; a re-sync won&apos;t bring
            them back into view. Restore any below.
          </p>
          <div className="mt-4 grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-2">
            {hiddenPhotos.map((p) => (
              <div key={p.id} className="group relative border border-ridge">
                <Image
                  src={p.src}
                  alt={p.alt}
                  width={p.width}
                  height={p.height}
                  sizes="150px"
                  className="aspect-[4/3] w-full object-cover opacity-40 grayscale"
                />
                <button
                  type="button"
                  onClick={() => setHiddenState(p.id, false)}
                  className="absolute inset-x-0 bottom-0 bg-night/85 py-1 text-xs text-alpenglow opacity-0 transition-opacity group-hover:opacity-100 focus:opacity-100"
                >
                  restore
                </button>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}

function PhotoTile({
  photo,
  index,
  total,
  collections,
  picking,
  isDragging,
  onClick,
  onDragStart,
  onDragEnd,
  onDragOverTile,
  onNudge,
  onMove,
  onHide,
}: {
  photo: BoardPhoto;
  index: number;
  total: number;
  collections: BoardCollection[];
  picking: boolean;
  isDragging: boolean;
  onClick: () => void;
  onDragStart: () => void;
  onDragEnd: () => void;
  onDragOverTile: () => void;
  onNudge: (dir: -1 | 1) => void;
  onMove: (target: string) => void;
  onHide: () => void;
}) {
  return (
    <div
      draggable={!picking}
      onClick={picking ? onClick : undefined}
      onDragStart={(e) => {
        onDragStart();
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/plain", photo.id);
      }}
      onDragEnd={onDragEnd}
      onDragOver={(e) => {
        e.preventDefault();
        onDragOverTile();
      }}
      className={`group relative select-none border transition ${
        picking
          ? "cursor-pointer hover:border-alpenglow hover:brightness-110"
          : "cursor-grab active:cursor-grabbing"
      } ${
        isDragging
          ? "border-alpenglow opacity-40"
          : picking
            ? "border-transparent"
            : "border-transparent hover:border-ridge"
      }`}
    >
      <Image
        src={photo.src}
        alt={photo.alt}
        width={photo.width}
        height={photo.height}
        sizes="180px"
        className="pointer-events-none aspect-[4/3] w-full object-cover"
      />
      <span className="absolute left-1 top-1 bg-night/80 px-1.5 py-0.5 font-exif text-xs text-snowlight">
        {index + 1}
      </span>

      {/* Controls are hidden in picking mode so the whole tile is a target. */}
      {!picking && (
        <button
          type="button"
          aria-label={`Hide ${photo.alt}`}
          title="Hide from site"
          onClick={onHide}
          className="absolute right-1 top-1 hidden h-6 w-6 items-center justify-center bg-night/80 text-sm text-overcast transition-colors hover:text-alpenglow group-hover:flex group-focus-within:flex"
        >
          ✕
        </button>
      )}

      {/* Reorder + move controls, bottom. Suppressed while picking. */}
      <div
        className={`absolute inset-x-0 bottom-0 hidden flex-col gap-1 bg-night/85 p-1 ${picking ? "" : "group-hover:flex group-focus-within:flex"}`}
      >
        <div className="flex items-center justify-between">
          <button
            type="button"
            aria-label={`Move ${photo.alt} earlier`}
            disabled={index === 0}
            onClick={() => onNudge(-1)}
            className="px-2 text-sm text-overcast hover:text-alpenglow disabled:opacity-30 disabled:hover:text-overcast"
          >
            ←
          </button>
          <span className="max-w-[60%] truncate text-[10px] text-overcast">
            {photo.id}
          </span>
          <button
            type="button"
            aria-label={`Move ${photo.alt} later`}
            disabled={index === total - 1}
            onClick={() => onNudge(1)}
            className="px-2 text-sm text-overcast hover:text-alpenglow disabled:opacity-30 disabled:hover:text-overcast"
          >
            →
          </button>
        </div>
        <select
          aria-label={`Move ${photo.alt} to another collection`}
          value={photo.collection}
          onChange={(e) => onMove(e.target.value)}
          className="w-full bg-ridge px-1 py-0.5 text-[11px] text-snowlight outline-none"
        >
          {collections.map((c) => (
            <option key={c.id} value={c.id}>
              {c.id === photo.collection ? `● ${c.name}` : `→ ${c.name}`}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
