# Environment variables

Quick reference for every `.env` variable the Aetheris platform reads.

## Web app (Next.js)

| Variable | Required | Default | Description |
| --- | --- | --- | --- |
| `DATABASE_URL` | ✅ | — | PostgreSQL connection string |
| `REDIS_URL` | ✅ | — | Redis connection string |
| `AETHERIS_SECRET` | ✅ | — | HMAC token signing secret (≥ 32 chars) |
| `NEXTAUTH_URL` | ✅ | — | Public URL of the web app (e.g. `https://app.example.com`) |
| `NEXTAUTH_SECRET` | ✅ | — | NextAuth session encryption key |
| `AETHERIS_APP_URL` | — | `NEXTAUTH_URL` | Override URL for internal redirects |
| `AETHERIS_BACKEND_URL` | — | `http://127.0.0.1:8000` | Python backend URL |
| `AETHERIS_REDIS_URL` | — | falls back to `REDIS_URL` | Separate Redis for BullMQ queues |
| `NODE_ENV` | — | `production` | `production` or `development` |

## Python backend (FastAPI)

| Variable | Required | Default | Description |
| --- | --- | --- | --- |
| `AETHERIS_BACKEND_DB` | — | `backend/aetheris.db` | SQLite database path |
| `AETHERIS_SECRET` | ✅ | — | HMAC token signing secret |
| `AETHERIS_TOKEN_TTL` | — | `86400` | Token lifetime in seconds |
| `AETHERIS_CORS_ORIGINS` | — | `*` | Comma-separated CORS origins |
| `ADMIN_EMAIL` | — | `admin@example.com` | Seeded superadmin email |
| `ADMIN_PASSWORD` | — | `admin-aetheris-2026` | Seeded superadmin password |

## Hypervisor drivers

| Variable | Description |
| --- | --- |
| `PTERODACTYL_APP_API_KEY` | Pterodactyl Application API key (read/write) |
| `PTERODACTYL_CLIENT_API_KEY` | Pterodactyl Client API key (power, console, telemetry) |
| `PTERODACTYL_PANEL_URL` | Pterodactyl Panel base URL |
| `PROXMOX_API_TOKEN` | Proxmox VE API v2 token (`user@realm!token`) |
| `PROXMOX_API_SECRET` | Proxmox VE API token secret |
| `PROXMOX_URL` | Proxmox VE API base URL |
| `VIRTFUSION_API_KEY` | VirtFusion bearer token |
| `VIRTFUSION_URL` | VirtFusion API base URL |

## Payment gateways

| Variable | Description |
| --- | --- |
| `STRIPE_SECRET_KEY` | Stripe secret API key |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret |
| `PAYPAL_CLIENT_ID` | PayPal REST API client ID |
| `PAYPAL_CLIENT_SECRET` | PayPal REST API secret |
| `MOLLIE_API_KEY` | Mollie API key |

See also: [Backend](backend.md), [Architecture](architecture.md), [Pterodactyl bridge](pterodactyl-bridge.md).
