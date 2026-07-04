import manifest from "./photo-manifest.json";

/**
 * Collections are derived from the manifest (which `npm run sync-instagram`
 * regenerates from Instagram), so ids are open-ended. The six original
 * collections plus "journal" (untagged posts) have curated names/blurbs.
 */
export type CollectionId = string;

type ManifestEntry = {
  id: string;
  collection: string;
  src: string;
  width: number;
  height: number;
  /** Present on Instagram-synced entries. */
  alt?: string;
  permalink?: string | null;
  timestamp?: string | null;
};

export type Exif = {
  focal: string;
  aperture: string;
  shutter: string;
  iso: number;
  /** true while the values are sample data, not read from a real frame */
  sample: boolean;
};

export type Photo = {
  id: string;
  src: string;
  alt: string;
  collection: CollectionId;
  width: number;
  height: number;
  permalink?: string | null;
  exif?: Exif;
};

export type Collection = {
  id: CollectionId;
  name: string;
  blurb: string;
  coverId?: string;
};

/** Curated names, blurbs, and preferred covers for known collections. */
const COLLECTION_META: Record<
  string,
  { name: string; blurb: string; coverId?: string }
> = {
  iceland: {
    name: "Iceland",
    blurb: "Ten days around the ring road, chasing weather and aurora.",
    coverId: "iceland-day-10-kirk-au",
  },
  spiti: {
    name: "Spiti",
    blurb: "The cold desert at altitude, and its very dark skies.",
    coverId: "spiti-milky-lang-2",
  },
  astro: {
    name: "Deep sky",
    blurb: "Galaxies, nebulae, and one good comet.",
    coverId: "astro-andromeda-2022",
  },
  moon: {
    name: "Moon",
    blurb: "One subject, photographed for years.",
    coverId: "moon-moonhdr",
  },
  leh: {
    name: "Leh",
    blurb: "High passes and still lakes in Ladakh.",
    coverId: "leh-tso2",
  },
  sikkim: {
    name: "Sikkim",
    blurb: "The eastern Himalaya at sunrise.",
    coverId: "sikkim-ravangla-buddha",
  },
  journal: {
    name: "Field notes",
    blurb: "Everything else from the feed.",
  },
};

/** Known collections come first, in this order; new ones follow. */
const COLLECTION_PREFERENCE = [
  "iceland",
  "spiti",
  "astro",
  "moon",
  "leh",
  "sikkim",
  "journal",
];

/**
 * Captions for frames whose filenames map to known places and subjects.
 * Anything not listed falls back to a humanized slug.
 */
const ALT: Record<string, string> = {
  // Iceland: ten days, in day order
  "iceland-aurora-kirk": "Aurora over Kirkjufell",
  "iceland-aurora-plane": "Aurora above the DC-3 wreck at Sólheimasandur",
  "iceland-day-1-reyk": "Reykjavík from above, day one",
  "iceland-day-1-sun-voyager": "The Sun Voyager at dusk, Reykjavík",
  "iceland-day-2-geysir": "Strokkur erupting at Geysir",
  "iceland-day-2-gulfoss": "Gullfoss in full flow",
  "iceland-day-2-lava-1": "Fresh lava field on Reykjanes",
  "iceland-day-2-lava-2": "Cooling lava, up close",
  "iceland-day-2-lava-3": "Steam over the new lava",
  "iceland-day-3-plane-river": "Braided river across the black sands",
  "iceland-day-3-plane": "The DC-3 wreck at Sólheimasandur",
  "iceland-day-3-sei": "Seljalandsfoss",
  "iceland-day-3-skoga": "Skógafoss",
  "iceland-day-4-bsbeach": "Black sand beach at Reynisfjara",
  "iceland-day-4-dbeach": "Ice on Diamond Beach",
  "iceland-day-4-dlighthouse": "Dyrhólaey lighthouse in sea mist",
  "iceland-day-4-glace": "Glacier front on the south coast",
  "iceland-day-4-mann": "Glacier tongue under a midnight sky",
  "iceland-day-4-mannp": "Glacier tongue, wider frame",
  "iceland-day-4-river1": "Meltwater river, south coast",
  "iceland-day-4-skogad": "Skógafoss at dusk",
  "iceland-day-5-br": "Crossing toward the east fjords",
  "iceland-day-5-brn": "The east road, after dark",
  "iceland-day-5-road": "Ring road running east",
  "iceland-day-5-tower": "Lone tower under a heavy sky",
  "iceland-day-5-vestra": "Vestrahorn",
  "iceland-day-5-vestrad": "Vestrahorn at dusk",
  "iceland-day-5-vestraedge": "The dune edge below Vestrahorn",
  "iceland-day-5-vestraocean": "Vestrahorn from the tide line",
  "iceland-day-5-whale": "A whale breaks the surface",
  "iceland-day-6-stongsunset": "Low sun over the highland plain",
  "iceland-day-7-aurora": "Aurora, night seven",
  "iceland-day-7-aurora-2": "Curtains of aurora, night seven",
  "iceland-day-7-godafoss": "Goðafoss",
  "iceland-day-7-hvitserkur": "Hvítserkur sea stack",
  "iceland-day-8-aurora-rey": "Aurora on the drive back",
  "iceland-day-8-dynjandi-beach": "The shore below Dynjandi",
  "iceland-day-8-dynjandi": "Dynjandi",
  "iceland-day-8-lake-1": "Still water in the Westfjords",
  "iceland-day-8-road": "Gravel road, Westfjords",
  "iceland-day-9-kirkm": "Kirkjufell in daylight",
  "iceland-day-9-lighthouse": "Lighthouse on Snæfellsnes",
  "iceland-day-9-mountain": "Snæfellsnes ridge",
  "iceland-day-9-road": "Road under the mountains",
  "iceland-day-10-church-1": "Búðakirkja, the black church",
  "iceland-day-10-church-2": "The black church, closer",
  "iceland-day-10-kirk-au": "Last aurora over Kirkjufell",
  "iceland-day-10-mountain-2": "Mountain wall, day ten",
  "iceland-vestra-3": "Vestrahorn, third visit",

  // Spiti
  "spiti-cass-and-and": "Cassiopeia and Andromeda",
  "spiti-cb-1": "The Chandra Bhaga peaks",
  "spiti-cb-2": "Chandra Bhaga at evening",
  "spiti-cb-hd": "Chandra Bhaga in sharp light",
  "spiti-chand-house": "Stone house at Chandratal",
  "spiti-chand-house-2": "House below the stars, Chandratal",
  "spiti-chand1": "Chandratal",
  "spiti-chandra-4": "Chandratal, still water",
  "spiti-chandra-lake-2": "Chandratal lake",
  "spiti-chit-1": "Chitkul",
  "spiti-cygnus-mount": "Cygnus over the peaks",
  "spiti-dhankar1": "Dhankar monastery",
  "spiti-dhankar-back": "The badlands behind Dhankar",
  "spiti-dipper": "The Big Dipper over the valley",
  "spiti-kaza-moon": "Moonrise over Kaza",
  "spiti-kaza-eve": "Kaza at evening",
  "spiti-kaza-road": "The road out of Kaza",
  "spiti-key-1": "Key monastery",
  "spiti-key-homes": "Homes below Key monastery",
  "spiti-key-z-1": "Key monastery, long lens",
  "spiti-key-moon": "Moon over Key monastery",
  "spiti-kumzum-1": "Prayer flags at Kunzum La",
  "spiti-lang-trails": "Star trails over Langza",
  "spiti-langza-buddha": "The Langza Buddha under the Milky Way",
  "spiti-langza-bush": "Dry scrub at Langza",
  "spiti-langza-cyg-2": "Cygnus rising over Langza",
  "spiti-langza-pano": "Langza panorama",
  "spiti-langza-andro": "Andromeda over Langza",
  "spiti-lang-milk-p": "Milky Way panorama, Langza",
  "spiti-light": "A shaft of light on the peaks",
  "spiti-mandi-1": "Mandi valley",
  "spiti-mandi-1-crop": "Mandi valley, square crop",
  "spiti-milky-pn-chand": "Milky Way panorama at Chandratal",
  "spiti-milky-sub": "The galactic core",
  "spiti-milky-and-rho": "The core and Rho Ophiuchi",
  "spiti-milky-lang-2": "Milky Way over Langza",
  "spiti-mountain-300-1": "Peaks at 300mm",
  "spiti-mountainroad": "Mountain road",
  "spiti-mountain-light": "Evening light on the peaks",
  "spiti-mountain-m": "Moon over the ridge",
  "spiti-mountain-man": "A figure below the mountains",
  "spiti-mountain-p": "Peaks, stitched wide",
  "spiti-nako-road-1": "The road to Nako",
  "spiti-nako-road": "Cliff road near Nako",
  "spiti-rakcham-mw": "Milky Way over Rakcham",
  "spiti-rak-window": "A window in Rakcham",
  "spiti-rho-150": "Rho Ophiuchi at 150mm",
  "spiti-rho-plant": "Rho Ophiuchi behind dry stalks",
  "spiti-riverside": "The Spiti river",
  "spiti-roadscape-1": "Roadscape",
  "spiti-shim-o": "Foothill town at dusk",
  "spiti-spi-1": "Spiti valley, stitched wide",
  "spiti-temple": "Temple rooftop",
  "spiti-valley-evening": "The valley at evening",

  // Deep sky
  "astro-andromeda-2022": "The Andromeda galaxy",
  "astro-caliple": "The California nebula and the Pleiades",
  "astro-flame-o": "The Flame and Horsehead nebulae",
  "astro-flame": "The Flame nebula",
  "astro-ghost-of-cass": "The Ghost of Cassiopeia",
  "astro-neo-edit": "Comet NEOWISE",
  "astro-neowise-ins": "Comet NEOWISE over the rooftops",
  "astro-neowisse": "Comet NEOWISE at nightfall",
  "astro-orionpix": "The Orion nebula",
  "astro-whirlpool": "The Whirlpool galaxy",
  "astro-witch": "The Witch Head nebula",

  // Moon
  "moon-alm-full": "Full moon, low on the horizon",
  "moon-clouds-1": "Moon through passing clouds",
  "moon-clouds-20": "Moonlight behind the cloud bank",
  "moon-fh": "Half moon in a clear sky",
  "moon-full-moon-21-10-21": "Full moon, October 2021",
  "moon-full": "Full moon",
  "moon-halo": "A 22° halo around the moon",
  "moon-kon-1": "Moonrise, first frame",
  "moon-kon-2": "Moonrise, second frame",
  "moon-moonhdr": "The full moon in HDR",
  "moon-moonrise": "Moonrise",
  "moon-moon-hdr": "Full moon detail",
  "moon-dsc0004-edit-2": "Waning crescent",

  // Leh
  "leh-valley-01": "Green valley below the pass",
  "leh-valley-02": "Switchbacks into the valley",
  "leh-valley-03": "River braiding through the gorge",
  "leh-valley-04": "Peaks above the road",
  "leh-valley-05": "Camp in the high valley",
  "leh-sarchu-1": "Night camp at Sarchu",
  "leh-tso2": "Pangong Tso",
  "leh-umingla-bikes": "Motorbikes below Umling La",

  // Sikkim
  "sikkim-mountainsr": "The Kangchenjunga range at first light",
  "sikkim-nest": "Treetop nest at 600mm",
  "sikkim-ravangla-buddha": "The Buddha of Ravangla",
  "sikkim-sun600-1": "Sunrise at 600mm, frame one",
  "sikkim-sun600-2": "Sunrise at 600mm, frame two",
  "sikkim-sun600-3": "Sunrise at 600mm, frame three",
  "sikkim-sun600-4": "Sunrise at 600mm, frame four",
  "sikkim-temple-pano": "Monastery courtyard, stitched wide",
  "sikkim-waterfall": "Waterfall in the hills",
};

const humanize = (id: string, collection: CollectionId): string => {
  const words = id.slice(collection.length + 1).replace(/-/g, " ");
  return words.charAt(0).toUpperCase() + words.slice(1);
};

export const PHOTOS: Photo[] = (manifest as ManifestEntry[]).map((m) => ({
  id: m.id,
  src: m.src,
  collection: m.collection,
  width: m.width,
  height: m.height,
  alt: m.alt ?? ALT[m.id] ?? humanize(m.id, m.collection),
  permalink: m.permalink ?? null,
}));

/** Collections present in the manifest, known ones first. */
export const COLLECTIONS: Collection[] = [
  ...new Set(PHOTOS.map((p) => p.collection)),
]
  .sort((a, b) => {
    const ia = COLLECTION_PREFERENCE.indexOf(a);
    const ib = COLLECTION_PREFERENCE.indexOf(b);
    return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib) || a.localeCompare(b);
  })
  .map((id) => {
    const meta = COLLECTION_META[id];
    return {
      id,
      name: meta?.name ?? id.charAt(0).toUpperCase() + id.slice(1),
      blurb: meta?.blurb ?? "",
      coverId: meta?.coverId,
    };
  });

export const photoById = (id: string): Photo => {
  const photo = PHOTOS.find((p) => p.id === id);
  if (!photo) throw new Error(`unknown photo id: ${id}`);
  return photo;
};

/**
 * Editorial slots pin a specific frame but must survive the manifest being
 * regenerated from Instagram: if the pinned id is gone, fall back to a
 * deterministic frame so layouts stay filled and builds never crash.
 */
export const pinnedPhoto = (id: string, fallbackIndex = 0): Photo =>
  PHOTOS.find((p) => p.id === id) ?? PHOTOS[fallbackIndex % PHOTOS.length];

/**
 * Hand-curated display order per collection. List photo ids here in the
 * order they should appear on the site; anything not listed follows after
 * the curated ones, keeping import (filename) order. Edit freely; a test
 * fails on any id that does not exist.
 */
export const ORDER: Partial<Record<CollectionId, string[]>> = {
  // Example:
  // iceland: [
  //   "iceland-aurora-kirk",
  //   "iceland-day-10-kirk-au",
  //   "iceland-day-5-vestra",
  // ],
};

export const photosByCollection = (id: CollectionId): Photo[] => {
  const photos = PHOTOS.filter((p) => p.collection === id);
  const order = ORDER[id];
  if (!order?.length) return photos;
  const rank = new Map(order.map((photoId, i) => [photoId, i]));
  return [...photos].sort(
    (a, b) =>
      (rank.get(a.id) ?? order.length) - (rank.get(b.id) ?? order.length),
  );
};

const maybePhotoById = (id: string | undefined): Photo | undefined =>
  id ? PHOTOS.find((p) => p.id === id) : undefined;

export const collectionCover = (id: CollectionId): Photo => {
  const collection = COLLECTIONS.find((c) => c.id === id);
  return (
    maybePhotoById(collection?.coverId) ?? photosByCollection(id)[0]
  );
};

const aspect = (p: Photo) => p.width / p.height;

/** Pinned classic when present; otherwise the first landscape frame. */
export const HERO_PHOTO: Photo =
  maybePhotoById("iceland-aurora-kirk") ??
  PHOTOS.find((p) => aspect(p) > 1.1) ??
  PHOTOS[0];

/** Pinned classic when present; otherwise the widest frame available. */
export const PANORAMA_PHOTO: Photo =
  maybePhotoById("iceland-day-8-dynjandi-beach") ??
  [...PHOTOS].sort((a, b) => aspect(b) - aspect(a))[0];

/** Newest frames for the strip; falls back to the curated classics. */
const CURATED_STRIP = [
  "iceland-day-7-godafoss",
  "spiti-dipper",
  "astro-neowisse",
  "moon-moonrise",
  "leh-umingla-bikes",
  "sikkim-sun600-2",
];

export const INSTAGRAM_PHOTOS: Photo[] = CURATED_STRIP.every((id) =>
  PHOTOS.some((p) => p.id === id),
)
  ? CURATED_STRIP.map(photoById)
  : PHOTOS.slice(0, 6);

export const formatExif = (e: Exif): string =>
  `${e.focal} · ${e.aperture} · ${e.shutter} · ISO ${e.iso}`;
