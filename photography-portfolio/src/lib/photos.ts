export type CollectionId = "ridgelines" | "coasts" | "nightfall";

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
  exif?: Exif;
};

export type Collection = { id: CollectionId; name: string; blurb: string };

export const COLLECTIONS: Collection[] = [
  { id: "ridgelines", name: "Ridgelines", blurb: "High ground, thin light." },
  { id: "coasts", name: "Coasts", blurb: "Where the land gives up." },
  { id: "nightfall", name: "Nightfall", blurb: "After the sun, before the dark." },
];

const exif = (
  focal: string,
  aperture: string,
  shutter: string,
  iso: number,
): Exif => ({ focal, aperture, shutter, iso, sample: true });

// Placeholder photos: seeded picsum URLs. Real photos land in /public/photos
// and replace `src` here; nothing else in the app changes.
const ph = (
  id: string,
  collection: CollectionId,
  alt: string,
  width: number,
  height: number,
  e?: Exif,
): Photo => ({
  id,
  collection,
  alt,
  width,
  height,
  exif: e,
  src: `https://picsum.photos/seed/${id}/${width}/${height}`,
});

export const PHOTOS: Photo[] = [
  ph("ridgelines-01", "ridgelines", "Sunlit ridge above a valley of cloud", 1600, 2000, exif("24mm", "f/8", "1/250s", 100)),
  ph("ridgelines-02", "ridgelines", "Snow arete under a clearing storm", 1600, 1067, exif("70mm", "f/11", "1/500s", 200)),
  ph("ridgelines-03", "ridgelines", "Scree slope in late amber light", 1600, 1200, exif("35mm", "f/8", "1/320s", 100)),
  ph("ridgelines-04", "ridgelines", "Twin summits over morning fog", 1600, 1000, exif("50mm", "f/10", "1/400s", 100)),
  ph("ridgelines-05", "ridgelines", "Cairn on a windswept saddle", 1600, 2000, exif("28mm", "f/9", "1/250s", 125)),
  ph("ridgelines-06", "ridgelines", "Last light on a limestone crest", 1600, 1067, exif("85mm", "f/5.6", "1/640s", 200)),
  ph("coasts-01", "coasts", "Sea stack against silver overcast", 1600, 2000, exif("24mm", "f/11", "2s", 64)),
  ph("coasts-02", "coasts", "Tide lines braided across dark sand", 1600, 1067, exif("35mm", "f/8", "1/125s", 100)),
  ph("coasts-03", "coasts", "Basalt shelf under incoming swell", 1600, 1200, exif("21mm", "f/13", "4s", 64)),
  ph("coasts-04", "coasts", "Lighthouse in drifting sea mist", 1600, 1000, exif("70mm", "f/8", "1/200s", 160)),
  ph("coasts-05", "coasts", "Kelp beds at minus tide", 1600, 2000, exif("28mm", "f/9", "1/100s", 100)),
  ph("coasts-06", "coasts", "Storm front crossing the headland", 1600, 1067, exif("50mm", "f/10", "1/800s", 200)),
  ph("nightfall-01", "nightfall", "Milky Way over a dry lakebed", 1600, 2000, exif("14mm", "f/1.8", "20s", 3200)),
  ph("nightfall-02", "nightfall", "Alpenglow fading from a granite wall", 1600, 1067, exif("70mm", "f/5.6", "1/60s", 400)),
  ph("nightfall-03", "nightfall", "Moonrise between two peaks", 1600, 1200, exif("135mm", "f/4", "1/30s", 800)),
  ph("nightfall-04", "nightfall", "Blue hour over a frozen tarn", 1600, 1000, exif("24mm", "f/8", "8s", 100)),
  ph("nightfall-05", "nightfall", "Star trails above a lone pine", 1600, 2000, exif("20mm", "f/2.8", "30s", 1600)),
  ph("nightfall-06", "nightfall", "Dusk band over rolling foothills", 1600, 1067, exif("50mm", "f/7.1", "1/25s", 320)),
];

export const HERO_PHOTO: Photo = ph(
  "hero-dusk-ridge",
  "ridgelines",
  "Dusk light over a long mountain ridge",
  2400,
  1400,
  exif("35mm", "f/11", "1/60s", 64),
);

export const PANORAMA_PHOTO: Photo = ph(
  "wide-frame-panorama",
  "ridgelines",
  "Panorama of a ridgeline holding the last light",
  2400,
  1000,
  exif("70mm", "f/8", "1/125s", 100),
);

export const photosByCollection = (id: CollectionId): Photo[] =>
  PHOTOS.filter((p) => p.collection === id);

export const collectionCover = (id: CollectionId): Photo =>
  photosByCollection(id)[0];

export const INSTAGRAM_PHOTOS: Photo[] = COLLECTIONS.flatMap((c) =>
  photosByCollection(c.id).slice(0, 2),
);

export const formatExif = (e: Exif): string =>
  `${e.focal} · ${e.aperture} · ${e.shutter} · ISO ${e.iso}`;
