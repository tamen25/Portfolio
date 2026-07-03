# CLAUDE.md

Guidance for Claude Code when working in this repository.

## What this repo is

A **monorepo of independent website projects**. Each website is a self-contained
folder at the repo root with its own `package.json`, dependencies, and tooling.
There is no shared root `package.json` or workspace manager — sites do not share
dependencies.

## Layout

```
Portfolio/                 # repo root (remote: github.com/tamen25/Portfolio.git)
├── main-portfolio/        # root-domain 3D-creator landing page
├── cloudops-portfolio/    # Next.js + TypeScript + Tailwind site
└── <future-site>/         # each new website added as its own top-level folder
```

## Working in a site

Always `cd` into the specific site folder before running commands — scripts and
dependencies are per-site, not global.

### cloudops-portfolio (Next.js + TypeScript)

```bash
cd cloudops-portfolio
npm install            # install deps
npm run dev            # start dev server (next dev)
npm run build          # production build
npm run lint           # eslint src test scripts
npm test               # tsx --test test/*.test.ts
npm run test:coverage  # tests with coverage thresholds
npm run contract-check # tsx scripts/contract-check.ts
```

### photography-portfolio (Next.js + TypeScript)

```bash
cd photography-portfolio
npm install            # install deps
npm run dev            # start dev server (next dev; use -p 3001 if 3000 is busy)
npm run build          # production build
npm run lint           # eslint
npm test               # tsx --test test/*.test.ts
```

### main-portfolio (Next.js + TypeScript)

The root-domain landing page ("Jack — 3D Creator" design).

```bash
cd main-portfolio
npm install            # install deps
npm run dev            # start dev server on port 3002
npm run build          # production build
npm run lint           # eslint
npm test               # tsx --test test/*.test.ts
```

## Adding a new website

1. Create a new top-level folder at the repo root.
2. Scaffold the project inside it (its own `package.json`, `.gitignore` optional —
   the root `.gitignore` already covers `node_modules/`, build output, env files).
3. Update the table in `README.md`.
4. Add a per-site section to this file with its actual scripts.

## Conventions

- Keep each site independent; do not hoist dependencies to the root.
- Commit build artifacts are ignored via the root `.gitignore`.
- Each site keeps its own `.env.example`; real `.env` files are gitignored.
