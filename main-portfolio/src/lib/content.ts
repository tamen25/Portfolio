import { SITE_LINKS } from "./site";

export type WorkCard = {
  id: string;
  title: string;
  category: string;
  /** null = future-site placeholder card */
  href: string | null;
  /** null = CSS art card (set `art`) */
  image: string | null;
  alt: string;
  art?: string;
  /** grid span + aspect classes; bento rows are 7/5 then 5/7 */
  layout: string;
};

export const WORKS: WorkCard[] = [
  {
    id: "photography",
    title: "Landscape Photography",
    category: "Photography portfolio",
    href: SITE_LINKS.photography,
    image: "/cards/photography.jpg",
    alt: "Aurora over the church at Kirkjufell, Iceland",
    layout: "md:col-span-7 aspect-[4/3] md:aspect-[7/4]",
  },
  {
    id: "cloudops",
    title: "CloudOps",
    category: "Cloud & DevOps portfolio",
    href: SITE_LINKS.cloudops,
    image: null,
    alt: "",
    art: "art-cloudops",
    layout: "md:col-span-5 aspect-[4/3] md:aspect-[5/4]",
  },
  {
    id: "future-1",
    title: "Next Project",
    category: "In the works",
    href: null,
    image: null,
    alt: "",
    art: "art-future",
    layout: "md:col-span-5 aspect-[4/3] md:aspect-[5/4]",
  },
  {
    id: "future-2",
    title: "Something New",
    category: "Coming soon",
    href: null,
    image: null,
    alt: "",
    art: "art-future",
    layout: "md:col-span-7 aspect-[4/3] md:aspect-[7/4]",
  },
];

export const JOURNAL = [
  {
    id: "terraform-photos",
    title: "What Terraform taught me about composing photographs",
    readTime: "6 min read",
    date: "Jun 2026",
    image: "/journal/j1.jpg",
  },
  {
    id: "midnight-deploys",
    title: "Midnight deploys and midnight suns",
    readTime: "4 min read",
    date: "May 2026",
    image: "/journal/j2.jpg",
  },
  {
    id: "slow-systems",
    title: "Slow photography, fast systems",
    readTime: "5 min read",
    date: "Apr 2026",
    image: "/journal/j3.jpg",
  },
  {
    id: "spiti-notes",
    title: "Field notes from Spiti: packing for altitude",
    readTime: "7 min read",
    date: "Mar 2026",
    image: "/journal/j4.jpg",
  },
];

export const EXPLORATIONS = [
  { id: "e1", image: "/explore/e1.jpg", alt: "Geysir erupting, Iceland", rotate: "-rotate-3" },
  { id: "e2", image: "/explore/e2.jpg", alt: "Gullfoss waterfall, Iceland", rotate: "rotate-2" },
  { id: "e3", image: "/explore/e3.jpg", alt: "Chandra Taal lake, Spiti", rotate: "-rotate-2" },
  { id: "e4", image: "/explore/e4.jpg", alt: "Chandra Bhaga range, Spiti", rotate: "rotate-3" },
  { id: "e5", image: "/explore/e5.jpg", alt: "Black church of Budir, Iceland", rotate: "-rotate-1" },
  { id: "e6", image: "/explore/e6.jpg", alt: "House under Chandra peaks, Spiti", rotate: "rotate-1" },
];

export const STATS = [
  { value: "20+", label: "Years Experience" },
  { value: "95+", label: "Projects Done" },
  { value: "200%", label: "Satisfied Clients" },
];
