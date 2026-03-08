## Founder Radar Frontend

This frontend now includes two experiences:

- Public marketing site at `/` with 3D storyscrolling and request-access funnel
- Authenticated product app (`/login`, `/feed`, `/explore`, etc.)

## Local Development

Install dependencies and start the dev server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for marketing and [http://localhost:3000/feed](http://localhost:3000/feed) for app routes.

## Environment Variables

Create `.env.local` in `frontend/` with:

```bash
# Marketing site URL (used in SEO + email verify links)
NEXT_PUBLIC_MARKETING_URL=http://localhost:3000

# Backend API base used by frontend server routes
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
BACKEND_URL=http://127.0.0.1:8000

# Feature flags
NEXT_PUBLIC_ENABLE_3D=true
NEXT_PUBLIC_ENABLE_GYRO=false

# Request-access persistence and email are now handled by backend env vars
```

## Marketing Site Notes

- 3D stack: `@react-three/fiber`, `@react-three/drei`
- Motion: `framer-motion` + `lenis`
- Fallback tiers: `full`, `lite`, `static` based on WebGL/capability checks
- Request access API routes:
	- `POST /api/request-access`
	- `GET /api/request-access/verify?token=...`

These frontend routes proxy to backend persistence APIs:

- `POST /api/marketing/request-access`
- `GET /api/marketing/request-access/verify?token=...`

## Verification Checklist

Run:

```bash
npm run lint
npm run build
```

Manual checks:

- Hero/Problem/Solution/How-it-Works/Social-Proof/Pricing/Request-Access sections render
- Request Access form submits and verify link page works
- Reduced motion and no-WebGL fallback render readable static experience
- Feed/dashboard routes still function

## Deploy on Vercel

Deploy with Vercel using the same environment variables above. Keep `NEXT_PUBLIC_ENABLE_GYRO=false` for launch stability, and enable only after device-level testing.

Post-deploy smoke test:

1. Load `/` on desktop + mobile
2. Submit request access form and verify email flow
3. Confirm `/verify?token=...` resolves successfully
4. Confirm app routes (`/login`, `/feed`) still work
