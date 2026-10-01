# Marketplace Client (Next.js)

This is the storefront app for the Marketplace project. It consumes the API served by the `server/` app.

## Prerequisites

- Node.js 20+
- Running API server (default: `http://localhost:5000`)

## Local development

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create `client/.env.local`:

   ```bash
   NEXT_PUBLIC_API_URL=http://localhost:5000
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open `http://localhost:3000`.

## Available scripts

- `npm run dev` — start Next.js in development mode
- `npm run build` — create a production build
- `npm run start` — run the production build
- `npm run lint` — run ESLint

## App routes

The app includes public and auth/checkout flows such as:

- `/products`
- `/search`
- `/cart`
- `/checkout`
- `/login`
- `/signup`
- `/admin`

## API integration notes

- API base URL comes from `NEXT_PUBLIC_API_URL` in `client/lib/api.ts`.
- If not set, it falls back to `http://localhost:5000`.
- Public data fetches are configured with revalidation and build-safe fallbacks in `client/lib/api.ts`.

## Deployment

For deployment instructions, see `../DEPLOY.md` (repository root).
