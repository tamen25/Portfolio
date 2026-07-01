# CloudOps — Portfolio Build

A standalone, deploy-anywhere copy of the **CloudOps storefront** — a Next.js 15
App Router site showcasing a fully-instrumented, multi-tenant SaaS platform on
Kubernetes. This build runs entirely on **mock data**: no AWS, no Cognito, no
Tempo/Mimir/Loki, no order-api. Everything that was "live" is now simulated so
the whole site — including the operator console — looks active out of the box.

Intended for deployment to **Vercel** or **Netlify** as a portfolio piece.

## Quick start

```bash
npm install
npm run dev      # http://localhost:3000
```

No `.env` needed. See `.env.example` for what the original app wired up.

## What's here

- **Marketing / architecture pages** — Home, Platform, Architecture, Diagrams,
  Pipeline. Rich animated diagrams, the real showpieces.
- **Operator console** (all mock-fed, all public):
  - `/console` — live service map, nodes pulsing with synthetic traffic
  - `/services` — per-service rps / error-rate grid
  - `/traces` — streaming recent traces + click-through span waterfall
  - `/load` — traffic generator with working Start/Stop and climbing counters

## How the "live" data works

The page components are **unchanged** from the real app. Only the `/api/*` route
handlers were swapped to read from `src/lib/mock/data.ts`, which produces
realistic, slowly-drifting synthetic data seeded by the wall clock. See
`PLAN.md` for the full architecture and the roadmap for further development.

## Relationship to the source project

This is a **copy**. The original lives in the private CloudOps monorepo at
`apps/storefront` and remains a working part of that project. This repo is
free to diverge.
