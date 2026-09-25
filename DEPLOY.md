# Marketplace — deploy online with Vercel (+ Render for the API)

This repo has two apps:

| App | Folder | Hosting |
|---|---|---|
| Storefront (Next.js) | `client/` | **Vercel project #1** (Root Directory = `client`) |
| API (Express + Prisma + Postgres) | `server/` | **Render** (recommended) or Vercel project #2 |

> Why not everything on one Vercel project? Vercel is serverless and its
> filesystem is ephemeral — `/uploads` files disappear and the `/uploads`
> route exists only to warn you. Render keeps a real server + disk.

---

## 0. Push to GitHub

```powershell
git add -A
git commit -m "Make project Vercel-ready"
git pull --rebase origin main
git push origin main
```

---

## 1. Deploy the API on Render (recommended, free)

1. Go to https://dashboard.render.com → **New + → Web Service** → connect
   `MarketPlace` repo.
2. Settings:
   - **Root Directory:** `server`
   - **Build Command:** `npm install && npx prisma generate --schema prisma/schema.prisma`
   - **Start Command:** `node index.js`
   - Instance type: Free (OK for sandbox payments).
3. **Environment variables** (Render → Environment):
   - `DATABASE_URL` = your Neon Postgres URL (same value as in `server/.env`)
   - `JWT_SECRET` = a long random string (generate a new one for production!)
   - `CLIENT_URL` = `https://<your-store>.vercel.app` (you'll update this after step 2)
   - `SERVER_PUBLIC_URL` = `https://<your-api>.onrender.com`
   - `SSLCOMMERZ_STORE_ID`, `SSLCOMMERZ_STORE_PASSWORD`, `SSLCOMMERZ_IS_LIVE=false`
4. **Deploy**, then test: `https://<your-api>.onrender.com/api/health`
   should return `{"ok":true,...}`.

> First request after idle can take ~30–60s on Render free tier (cold start).
> That's normal.

### (Alternative) Deploy the API on Vercel instead

1. Vercel → **Add New → Project** → same repo, **Root Directory = `server`**.
2. Env vars: same list as Render above (plus `CLIENT_URL`).
3. Deploy. Test `https://<your-api>.vercel.app/api/health`.
4. ⚠️ Local `/uploads` won't persist — use image URLs (Cloudinary/S3) for
   product images instead of the upload endpoint.

---

## 2. Deploy the storefront on Vercel

1. Vercel → **Add New → Project** → same repo, **Root Directory = `client`**,
   Framework preset = Next.js (auto).
2. **Environment variable** (Vercel → Settings → Environment Variables,
   all environments):
   - `NEXT_PUBLIC_API_URL` = `https://<your-api>.onrender.com`
     (or your `server` Vercel URL if you chose that path)
3. **Deploy.** The build (`next build`) passes even if the API is briefly
   unreachable — public pages fall back to empty data and revalidate every
   60s (`client/lib/api.ts`).
4. Back in Render, set `CLIENT_URL` to your real store URL
   (`https://<your-store>.vercel.app`) and redeploy the API so CORS +
   SSLCommerz redirects allow it.

---

## 3. SSLCommerz checklist (sandbox)

- `SERVER_PUBLIC_URL` must be **public HTTPS** (Render/Vercel URL) so
  `success/fail/cancel/ipn` callbacks reach your API — `localhost` won't work.
- In live mode set `SSLCOMMERZ_IS_LIVE=true` + live store credentials; in
  sandbox keep it `false`.

## 4. Post-deploy smoke test

- Store: `https://<your-store>.vercel.app/products` shows products.
- API: `https://<your-api>.onrender.com/api/products` returns JSON.
- Admin login on the store, add a product with an **https image URL**
  (not a local upload when on Vercel).

## Files changed for deployment

- `client/lib/api.ts` — build-safe fetch fallbacks + trailing-slash trim.
- `client/next.config.ts` — allow remote API/user images.
- `client/vercel.json` — storefront project config.
- `server/index.js` — restricted CORS (`CLIENT_URL`), `/api/health`, serverless export.
- `server/vercel.json` — optional API-on-Vercel config.
- `server/routes/uploads.js` — clear error on Vercel instead of silent file loss.
