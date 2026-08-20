# Backend — API reference

All REST endpoints, configuration and examples.

## Configuration

| Variable | Default | Description |
| --- | --- | --- |
| `AETHERIS_BACKEND_DB` | `backend/aetheris.db` | SQLite path |
| `AETHERIS_SECRET` | — | HMAC signing secret |
| `AETHERIS_TOKEN_TTL` | `86400` | Token lifetime (seconds) |
| `AETHERIS_CORS_ORIGINS` | `*` | CORS origins |
| `ADMIN_EMAIL` | `admin@example.com` | Seeded admin email |
| `ADMIN_PASSWORD` | `admin-aetheris-2026` | Seeded admin password |

## Endpoints

| Method | Path | Auth | Description |
| --- | --- | --- | --- |
| GET | `/health` | — | Health check |
| POST | `/api/auth/login` | — | Login → bearer token |
| GET | `/api/auth/me` | user | Current user |
| GET | `/api/auth/users` | admin | List users |
| GET | `/api/nodes` | user | List nodes |
| POST | `/api/nodes` | admin | Create node |
| GET | `/api/nodes/{id}/telemetry` | user | Node telemetry |
| GET | `/api/servers` | user | List servers |
| GET | `/api/servers/plans` | user | List plans |
| POST | `/api/servers` | admin | Provision server |
| POST | `/api/servers/{id}/power` | user | start / stop / restart |
| DELETE | `/api/servers/{id}` | admin | Terminate server |
| GET | `/api/billing/summary` | user | Billing summary |
| GET | `/api/billing/invoices` | user | List invoices |
| POST | `/api/billing/invoices/{id}/pay` | user | Pay invoice |
| GET | `/api/theme` | — | Current theme |
| PUT | `/api/theme` | admin | Update theme |
| GET | `/api/system/status` | — | Version, update check |
| GET | `/api/system/cron` | user | List cron jobs |
| POST | `/api/system/cron` | admin | Create cron job |
| PATCH | `/api/system/cron/{id}` | admin | Update cron job |
| DELETE | `/api/system/cron/{id}` | admin | Delete cron job |
| POST | `/api/system/cron/{id}/run` | admin | Trigger job |
| GET | `/api/system/sftp` | user | List SFTP users |
| POST | `/api/system/sftp` | admin | Create SFTP user |
| PATCH | `/api/system/sftp/{id}` | admin | Update SFTP user |
| DELETE | `/api/system/sftp/{id}` | admin | Delete SFTP user |

## Login example

```bash
curl -sS http://127.0.0.1:8000/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"admin@example.com","password":"admin-aetheris-2026"}'
```

## Tests

```bash
pip install -r requirements-dev.txt
pytest -q
```

See also: [API authentication](api-authentication.md), [Backend overview](backend.md).
