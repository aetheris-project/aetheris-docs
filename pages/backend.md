# Python backend

Self-contained FastAPI REST API in `aetheris-app/backend`. Provides authentication, node management, server provisioning, billing and whitelabel themes.

## Quick start

```bash
cd aetheris-app/backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
python run.py --port 8000 --reload
```

API docs: <http://127.0.0.1:8000/docs>

Default admin: `admin@example.com` / `admin-aetheris-2026`

## What it provides

- **Auth**: JWT tokens, scrypt password hashing, per-user API keys.
- **Tenancy**: every row scoped by `organization_id`.
- **Billing**: plans, subscriptions, invoices, proration, dunning.
- **Whitelabel**: runtime config served at `/api/whitelabel`.
- **System**: cron jobs, SFTP users, platform status.

## Quick links

- [Backend API](backend-api.md) — full endpoint reference
- [API authentication](api-authentication.md) — login, tokens, roles

See also: [Architecture](architecture.md), [Environment variables](environment-variables.md).
