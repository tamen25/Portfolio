# Deploy Guide — cloudops-portfolio → Vercel + Namecheap subdomain

> Follow this top to bottom when you're ready to go live. Chosen setup:
> **Vercel** (free Hobby tier) + a **subdomain** on your **Namecheap** domain
> (single CNAME record). No environment variables required.

## Why Vercel (decided)

This is a Next.js 15 app with dynamic API routes (`/api/observe/*`, `/api/load/*`)
and middleware (rate-limit). Vercel is built by the Next.js team, so App Router +
middleware + API routes work with zero adapter config. `output: "standalone"` in
`next.config.ts` is harmless on Vercel (ignored). The strict CSP in `next.config.ts`
only allows `'self'` sources and blocks nothing, because the app loads no external
scripts/fonts/CDNs. Free Hobby tier covers a personal portfolio.

---

## Part 1 — Push the code to GitHub

Vercel deploys from the GitHub repo. The site lives in the `cloudops-portfolio/`
subfolder of the `Portfolio` monorepo — Vercel is told that in Part 2.

Make sure everything is committed and pushed:

```bash
rtk git add -A
rtk git commit -m "chore: prep for deploy"
rtk git push
```

---

## Part 2 — Import into Vercel

1. Go to **vercel.com** → **Sign in with GitHub**.
2. **Add New… → Project** → find **`tamen25/Portfolio`** → **Import**.
3. **CRITICAL — set the Root Directory:** on the config screen find
   **Root Directory** → **Edit** → select **`cloudops-portfolio`**.
   (Without this, Vercel tries to build the repo root and fails.)
4. Framework Preset auto-detects **Next.js**. Leave build command / output at defaults.
5. **Environment Variables:** none. Skip.
6. Click **Deploy**. ~1–2 min. You get a live `*.vercel.app` URL.
7. Open it → confirm `/console`, `/services`, `/traces`, `/load` animate on mock data.

---

## Part 3 — Add your subdomain in Vercel

1. Project → **Settings → Domains**.
2. Enter your subdomain, e.g. **`portfolio.YOURDOMAIN.com`** → **Add**.
3. Vercel shows a **CNAME** to create. It will look like:
   - **Type:** `CNAME`  **Name:** `portfolio`  **Value:** `cname.vercel-dns.com`
   - Keep this tab open — copy the exact Value it shows you.

---

## Part 4 — Add the DNS record in Namecheap

1. **namecheap.com** → **Domain List** → **Manage** on your domain.
2. **Advanced DNS** tab → **Host Records** → **Add New Record**:
   - **Type:** `CNAME Record`
   - **Host:** `portfolio`  ← just the label, NOT `portfolio.YOURDOMAIN.com`
   - **Value:** `cname.vercel-dns.com`  ← exactly what Vercel showed
   - **TTL:** `Automatic`
3. Click the green **checkmark** to save.

⚠️ Gotcha: Namecheap ships a default `CNAME www → parkingpage.com` and a URL
redirect record. Leave them — they don't conflict with your `portfolio` host.
Don't delete records you didn't add.

---

## Part 5 — Verify

- DNS propagates in ~5–30 min. Vercel auto-detects it and issues a free SSL cert.
- The domain in Vercel → Settings → Domains flips from ⚠️ to ✅.
- Visit `https://portfolio.YOURDOMAIN.com` → loads with a valid padlock.

---

## Fill-in values (edit before you start)

| Field            | Your value                          |
|------------------|-------------------------------------|
| Domain           | `YOURDOMAIN.com`                    |
| Subdomain label  | `portfolio` (or `cloudops` / `demo`)|
| Full URL         | `portfolio.YOURDOMAIN.com`          |
| CNAME value      | (from Vercel, usually `cname.vercel-dns.com`) |

---

## Redeploys

Every `git push` to the default branch auto-deploys. No manual step.
```bash
rtk git add -A && rtk git commit -m "…" && rtk git push
```

## Troubleshooting

- **Build fails at import:** Root Directory not set to `cloudops-portfolio` (Part 2.3).
- **Domain stuck on ⚠️:** DNS not propagated yet, or Host has the full domain
  instead of just `portfolio`. Recheck Part 4.
- **Something looks blocked in console:** check the browser devtools Console for a
  CSP violation; the CSP lives in `next.config.ts`. (Current CSP blocks nothing
  for this app.)
