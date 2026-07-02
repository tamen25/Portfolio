# Portfolio

A monorepo containing multiple website projects. Each website lives in its own
top-level folder and is self-contained (its own dependencies, build, and config).

## Websites

| Folder | Stack | Description |
| ------ | ----- | ----------- |
| [`main-portfolio/`](./main-portfolio) | Next.js + TypeScript + Tailwind | Root-domain hub landing page linking to all sites |
| [`cloudops-portfolio/`](./cloudops-portfolio) | Next.js + TypeScript + Tailwind | CloudOps portfolio site |
| [`photography-portfolio/`](./photography-portfolio) | Next.js + TypeScript + Tailwind | Landscape photography portfolio |

## Structure

```
Portfolio/
├── cloudops-portfolio/   # Next.js site
└── <future-site>/        # each new website is added as its own folder
```

## Working on a site

Each site is independent — `cd` into its folder and use its own scripts:

```bash
cd cloudops-portfolio
npm install
npm run dev
```

## Adding a new website

1. Create a new top-level folder (e.g. `my-new-site/`).
2. Scaffold the project inside it.
3. Commit — the root `.gitignore` already covers common build artifacts.
