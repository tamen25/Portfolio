export const SITE = {
  name: "Tamen Dutta",
  initials: "TD",
  // Placeholder until Tamen supplies a real city (spec: Decisions table).
  city: "the mountains",
  email: "jj794001@gmail.com",
  github: "https://github.com/tamen25",
  roles: ["Creative", "CloudOps", "Photographer", "Builder"],
  loadingWords: ["Design", "Create", "Inspire"],
  description:
    "Designing seamless digital interactions by focusing on the unique nuances which bring systems to life.",
};

// Where the hub's segments point. Real subdomain URLs are injected at
// deploy time via env; local defaults match each site's dev port.
export const SITE_LINKS = {
  photography:
    process.env.NEXT_PUBLIC_PHOTOGRAPHY_URL ?? "http://localhost:3001",
  cloudops: process.env.NEXT_PUBLIC_CLOUDOPS_URL ?? "http://localhost:3000",
};

export const SOCIALS = [
  { label: "GitHub", href: SITE.github },
  // Placeholders until real profiles are supplied.
  { label: "Twitter", href: "https://twitter.com" },
  { label: "LinkedIn", href: "https://linkedin.com" },
  { label: "Dribbble", href: "https://dribbble.com" },
];
