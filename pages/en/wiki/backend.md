# Python backend

The control plane ships a self-contained Python REST API in
`aetheris-app/backend`. It provides authentication, node management,
server provisioning, billing and whitelabel themes on a zero-configuration
SQLite database, so development and demos run without PostgreSQL or Redis.

## Quick start

```bash
cd aetheris-app/backend
python -m venv .venv

# Windows
.venv\Scripts\activate
# Linux / macOS
source .venv/bin/activate

pip install -r requirements.txt
python run.py --port 8000 --reload
```

The first start creates `aetheris.db` and seeds it with an admin user,
four nodes, four plans, demo servers and invoices.

Default admin credentials (change them in production):

```text
email:    admin@example.com
password: admin-aetheris-2026
```

Interactive API documentation: <http://127.0.0.1:8000/docs>

## Configuration

| Variable | Default | Purpose |
| --- | --- | --- |
| `AETHERIS_BACKEND_DB` | `backend/aetheris.db` | SQLite database path |
| `AETHERIS_SECRET` | dev-only value | HMAC token signing secret |
| `AETHERIS_TOKEN_TTL` | `86400` | Token lifetime in seconds |
| `AETHERIS_CORS_ORIGINS` | `*` | Comma-separated CORS origins |
| `ADMIN_EMAIL` | `admin@example.com` | Seeded superadmin email |
| `ADMIN_PASSWORD` | `admin-aetheris-2026` | Seeded superadmin password |

## API overview

| Method | Path | Auth | Description |
| --- | --- | --- | --- |
| GET | `/health` | - | Service health |
| POST | `/api/auth/login` | - | Login, returns bearer token |
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
| GET | `/api/theme` | - | Current whitelabel theme |
| PUT | `/api/theme` | admin | Update whitelabel theme |

## Authentication

Passwords are hashed with scrypt (per-user salt, constant-time compare).
Logging in returns an HMAC-signed bearer token that expires after
`AETHERIS_TOKEN_TTL` seconds:

```bash
curl -sS http://127.0.0.1:8000/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"admin@example.com","password":"admin-aetheris-2026"}'
```

Use the returned token on every authenticated call:

```bash
curl -sS http://127.0.0.1:8000/api/nodes \
  -H "Authorization: Bearer $TOKEN"
```

## Example: provision a server

```bash
# Pick a plan and a node
PLAN=$(curl -sS http://127.0.0.1:8000/api/servers/plans | python -c "import sys,json;print(json.load(sys.stdin)[0]['id'])")
NODE=$(curl -sS http://127.0.0.1:8000/api/nodes -H "Authorization: Bearer $TOKEN" | python -c "import sys,json;print(json.load(sys.stdin)[0]['id'])")

curl -sS http://127.0.0.1:8000/api/servers \
  -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d "{\"plan_id\":$PLAN,\"node_id\":$NODE,\"template\":\"Node.js\"}"
```

## Tests

```bash
pip install -r requirements-dev.txt
pytest -q
```

The suite runs against an isolated temporary database and covers auth,
node management, provisioning, power actions, billing and theme updates.

## Production notes

- Set a strong `AETHERIS_SECRET` (e.g. `openssl rand -hex 32`).
- Run with a process supervisor (systemd / launchd / Task Scheduler); the
  automated installer generates the units for you - see `installer.md`.
- Replace the SQLite database with PostgreSQL for multi-instance
  deployments; the API layer is storage-agnostic.
