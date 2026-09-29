# MarketPlace

A full-stack marketplace application with a Next.js storefront, an Express API, Prisma, PostgreSQL, authentication, product management, orders, and SSLCommerz sandbox payments.

## Live Demo

[Open the deployed marketplace](https://market-place-delta-jade.vercel.app)

## Features

- Browse marketplace products and categories
- User authentication with JWT
- Product and category management
- Order creation and order tracking
- SSLCommerz sandbox payment integration
- Configurable homepage settings
- Image uploads for local/server deployments
- PostgreSQL persistence through Prisma
- Deployable storefront and API architecture

## Tech Stack

### Frontend

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- ESLint

### Backend

- Node.js
- Express 5
- Prisma 7
- PostgreSQL
- JWT authentication
- SSLCommerz payments

## Project Structure

```text
MarketPlace/
├── client/              # Next.js storefront
├── server/              # Express API and Prisma backend
├── DEPLOY.md            # Deployment instructions for Vercel and Render
└── package.json         # Root dependency configuration
```

## Getting Started

### Prerequisites

- Node.js 20 or later recommended
- npm
- A PostgreSQL database
- SSLCommerz sandbox credentials for testing payments

### 1. Clone the repository

```bash
git clone https://github.com/HasibulIslam007/MarketPlace.git
cd MarketPlace
```

### 2. Install dependencies

Install dependencies for both applications:

```bash
cd client
npm install

cd ../server
npm install
```

### 3. Configure the API

Create `server/.env` from the example file:

```bash
cd server
cp .env.example .env
```

On Windows PowerShell, use:

```powershell
Copy-Item .env.example .env
```

Set the following values in `server/.env`:

```env
DATABASE_URL="postgresql://user:password@host/database?sslmode=require"
JWT_SECRET=replace_with_a_long_random_secret
SSLCOMMERZ_STORE_ID=your_sandbox_store_id
SSLCOMMERZ_STORE_PASSWORD=your_sandbox_store_password
SSLCOMMERZ_IS_LIVE=false
CLIENT_URL=http://localhost:3000
SERVER_PUBLIC_URL=https://your-public-server-url.example.com
```

Do not commit real secrets or production credentials.

### 4. Start the API

```bash
cd server
npm run dev
```

The API runs using the server configuration in `server/index.js`.

### 5. Start the storefront

In a second terminal:

```bash
cd client
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

If the API is running at a different URL, create `client/.env.local` and set:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## Available Scripts

### Client scripts

Run from `client/`:

| Command | Description |
|---|---|
| `npm run dev` | Start the Next.js development server |
| `npm run build` | Create a production build |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint |

### Server scripts

Run from `server/`:

| Command | Description |
|---|---|
| `npm run dev` | Generate Prisma Client and start the API with Nodemon |
| `npm start` | Generate Prisma Client and start the API |
| `npm run generate` | Generate Prisma Client |
| `npm run seed:catalog` | Seed the product catalog |

## API Areas

The backend contains routes for:

- Authentication
- Products
- Categories
- Orders
- Payments
- Homepage settings
- File uploads

The API health endpoint is available at `/api/health` after the server starts.

## Deployment

The recommended deployment setup is:

- **Client:** Vercel with `client/` as the root directory
- **API:** Render with `server/` as the root directory
- **Database:** PostgreSQL, such as Neon

See [DEPLOY.md](./DEPLOY.md) for environment variables, deployment commands, SSLCommerz callback requirements, and post-deployment checks.

## Security Notes

- Use a strong, unique `JWT_SECRET` in production.
- Keep database, payment, and authentication credentials private.
- Use HTTPS for production deployments.
- Keep `SSLCOMMERZ_IS_LIVE=false` while testing with sandbox credentials.
- Local uploads may not persist on serverless hosting; use a persistent storage provider for production images.

## License

This project currently does not include a dedicated open-source license.
