import type { DesignEntry } from "../types";
import { ArchBuilder } from "../builder";

// grid coordinates are 0..1; the renderer maps them into the stage
const C = {
  client: { id: "client", label: "Client", kind: "client" as const, x: 0.08, y: 0.5 },
  cdn: { id: "cdn", label: "CDN", kind: "cdn" as const, x: 0.28, y: 0.22 },
  gateway: { id: "gateway", label: "API Gateway", kind: "gateway" as const, x: 0.28, y: 0.78 },
  service: { id: "service", label: "Shorten Service", kind: "service" as const, x: 0.54, y: 0.5 },
  cache: { id: "cache", label: "Redis Cache", kind: "cache" as const, x: 0.8, y: 0.24 },
  db: { id: "db", label: "Key–Value Store", kind: "db" as const, x: 0.8, y: 0.76 },
};

const steps = [
  "client sends long URL / requests a short code",
  "read-heavy redirects served from the edge via CDN",
  "gateway terminates TLS, rate-limits, routes writes",
  "service generates a unique short code, writes mapping",
  "cache hot codes; most redirects never touch the DB",
  "persist code → URL in a partitioned key–value store",
];

const build = () =>
  new ArchBuilder()
    .step({
      add: [C.client],
      focus: C.client.id,
      narration: "A client wants to shorten a URL and, later, follow a short link.",
      stepLine: 0,
    })
    .step({
      add: [C.cdn],
      connect: [{ from: C.client.id, to: C.cdn.id, label: "GET /{code}" }],
      focus: C.cdn.id,
      narration: "Redirects dominate (10:1 reads). Serve them from the edge.",
      stepLine: 1,
    })
    .step({
      add: [C.gateway],
      connect: [{ from: C.client.id, to: C.gateway.id, label: "POST /shorten" }],
      focus: C.gateway.id,
      narration: "Writes go through a gateway: TLS, auth, and rate limiting.",
      stepLine: 2,
    })
    .step({
      add: [C.service],
      connect: [
        { from: C.gateway.id, to: C.service.id },
        { from: C.cdn.id, to: C.service.id, label: "miss" },
      ],
      focus: C.service.id,
      narration: "The service mints a base-62 code and stores the mapping.",
      stepLine: 3,
    })
    .step({
      add: [C.cache],
      connect: [{ from: C.service.id, to: C.cache.id, label: "code→URL" }],
      focus: C.cache.id,
      narration: "Hot codes live in Redis, so most redirects skip the database.",
      stepLine: 4,
    })
    .step({
      add: [C.db],
      connect: [{ from: C.service.id, to: C.db.id, label: "on miss" }],
      focus: C.db.id,
      narration: "The source of truth is a partitioned key–value store keyed by code.",
      stepLine: 5,
    })
    .build();

export const urlShortener: DesignEntry = {
  slug: "url-shortener",
  name: "URL Shortener",
  summary:
    "Turn long URLs into short codes and redirect on lookup — the canonical read-heavy design.",
  tags: ["read-heavy", "caching", "hashing", "key-value"],
  scale: "100M new links/mo · 10:1 read:write",
  build,
  steps,
  notes: [
    {
      heading: "Requirements",
      body: [
        "Functional: shorten a URL to a unique code; redirect code → original URL.",
        "Non-functional: redirects are low-latency and highly available; codes never collide.",
        "Out of scope for v1: custom aliases, analytics, link expiry.",
      ],
    },
    {
      heading: "Capacity",
      body: [
        "~100M writes/month ≈ 40 writes/s; reads ~400/s at 10:1.",
        "5 years ≈ 6B links. Base-62, 7 chars = 62^7 ≈ 3.5T — comfortable headroom.",
        "Mapping row ~500 bytes → ~3 TB at 6B links, before replication.",
      ],
    },
    {
      heading: "API",
      body: [
        "POST /shorten { url } → { code, shortUrl }",
        "GET /{code} → 301 redirect to the original URL",
      ],
    },
    {
      heading: "Short code",
      body: [
        "Base-62 encode a unique 64-bit id (counter or snowflake) → collision-free by construction.",
        "Alternative: hash(url) truncated + collision check — simpler reads, extra write cost on collisions.",
      ],
    },
    {
      heading: "Tradeoffs",
      body: [
        "Cache-aside on the service keeps reads off the DB; accept brief staleness on updates.",
        "301 vs 302: 301 is cacheable (fewer origin hits) but hides analytics; pick per product need.",
        "Partition the KV store by code prefix; redirects are single-key lookups, so no cross-shard joins.",
      ],
    },
  ],
};
