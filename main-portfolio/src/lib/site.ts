const isProd = process.env.NODE_ENV === "production";

export const CLOUDOPS_URL =
  process.env.NEXT_PUBLIC_CLOUDOPS_URL ||
  (isProd ? "https://cloudops.tamendutta.com" : "http://localhost:3000");

export const PHOTOS_URL =
  process.env.NEXT_PUBLIC_PHOTOS_URL ||
  (isProd ? "https://photography.tamendutta.com" : "http://localhost:3001");

export const SITE = {
  name: "Tamen Dutta",
  role: "Developer × Photographer",
  email: "tamendutta25@gmail.com",
  location: "Bangalore, IN",
  domain: "https://tamendutta.com",
  socials: [
    { label: "GitHub", href: "https://github.com/tamen25" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/tamen-dutta/" },
    { label: "Instagram", href: "https://www.instagram.com/tamendutta/" },
  ],
  bio: {
    dev: "I build resilient interfaces and API-first systems. Comfortable across the stack — from low-level performance work to design-driven product engineering.",
    photo:
      "I chase quiet light and loud shadows. My frames sit somewhere between documentary honesty and cinematic restraint.",
    bridge:
      "Two crafts, one obsession: pattern. Whether it's a well-typed function or a well-timed frame, I'm looking for the shape underneath.",
  },
  about: {
    dev: "Typed systems, visible state, small ships. I like software that can explain itself — and deleting more code than I add.",
    photo:
      "High passes and dark skies — Iceland, Spiti, Leh, Sikkim, and long nights pointed at the stars, waiting for light to cooperate.",
  },
  stack: [
    "TypeScript",
    "React",
    "Next.js",
    "Node.js",
    "Python",
    "PostgreSQL",
    "Docker",
    "AWS",
    "TailwindCSS",
  ],
};

export type Project = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  stack: string[];
  href: string | null;
  preview: string | null;
  accent: "dev" | "photo";
};

export const PROJECTS: Project[] = [
  {
    id: "cloudops",
    title: "CloudOps Console",
    subtitle: "Observability, end to end",
    description:
      "A live observability console — distributed traces, metrics and logs rendered as one navigable system.",
    stack: ["Next.js", "TypeScript", "Tailwind"],
    href: CLOUDOPS_URL,
    preview: "/previews/cloudops.jpg",
    accent: "dev",
  },
  {
    id: "photography",
    title: "Photography",
    subtitle: "Frames from the field",
    description:
      "A dark, cinematic gallery of real work — Iceland, Spiti, Leh, Sikkim, and the night sky.",
    stack: ["Next.js", "TypeScript", "Tailwind"],
    href: PHOTOS_URL,
    preview: "/previews/photography.jpg",
    accent: "photo",
  },
  {
    id: "fable-showcase",
    title: "Fable Showcase",
    subtitle: "Twenty-five sites, zero templates",
    description:
      "A hall of twenty-five fundamentally different websites — WebGL instruments, a playable game, generated films, and a real 3D statue. Every door opens.",
    stack: ["Three.js", "WebGL", "GSAP"],
    href: "https://fable-index.netlify.app",
    preview: "/previews/fable-showcase.png",
    accent: "dev",
  },
  {
    id: "next-02",
    title: "In orbit",
    subtitle: "Next frame",
    description: "New collections are being edited. Check back soon.",
    stack: [],
    href: null,
    preview: null,
    accent: "photo",
  },
];

export const MANIFESTO_LINES = [
  "const principles = [",
  '  "ship small, ship often",',
  '  "make state visible",',
  '  "delete more than you add",',
  "];",
  "",
  "export function ship(idea: Idea): Product {",
  "  return refine(build(idea)); // keep going.",
  "}",
];
