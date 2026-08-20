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
| GET | `/api/system/status` | - | Version, latest release, update availability |
| GET | `/api/system/cron` | user | List scheduled jobs |
| POST | `/api/system/cron` | admin | Create a cron job |
| PATCH | `/api/system/cron/{id}` | admin | Update a cron job |
| DELETE | `/api/system/cron/{id}` | admin | Delete a cron job |
| POST | `/api/system/cron/{id}/run` | admin | Trigger a job manually |
| GET | `/api/system/sftp` | user | List SFTP users |
| POST | `/api/system/sftp` | admin | Create an SFTP user |
| PATCH | `/api/system/sftp/{id}` | admin | Update an SFTP user |
| DELETE | `/api/system/sftp/{id}` | admin | Delete an SFTP user |

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

## System endpoints (status, cron, SFTP)

### Platform status and update check

```bash
curl -sS http://127.0.0.1:8000/api/system/status
```

```json
{
  "version": "1.0.0",
  "latest_release": {
    "tag": "v1.1.0",
    "url": "https://github.com/aetheris-project/aetheris-app/releases/tag/v1.1.0",
    "published_at": "2026-08-15T10:00:00Z"
  },
  "update_available": true,
  "environment": "development",
  "healthy": true
}
```

The endpoint resolves the latest GitHub release (cached, never raises on
network failure) and compares it against the running version, so the admin
Status page can show an upgrade banner without any extra infrastructure.

### Scheduled jobs (cron)

```bash
# List jobs
curl -sS http://127.0.0.1:8000/api/system/cron -H "Authorization: Bearer $TOKEN"

# Create a nightly backup job
curl -sS http://127.0.0.1:8000/api/system/cron -X POST \
  -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' \
  -d '{"name":"Nightly backups","schedule":"0 3 * * *","task":"backup","enabled":true}'

# Trigger a job immediately (manual run)
curl -sS http://127.0.0.1:8000/api/system/cron/1/run -X POST \
  -H "Authorization: Bearer $TOKEN"
```

Supported `task` values: `backup`, `invoice.dunning`, `snapshot.prune`,
`sync.pterodactyl`, `sync.proxmox`, `sync.virtfusion`, `report.daily`.
The `schedule` field is a standard five-field cron expression.

### SFTP users

```bash
# List users (joins the server name)
curl -sS http://127.0.0.1:8000/api/system/sftp -H "Authorization: Bearer $TOKEN"

# Create a file-access account on server 1
curl -sS http://127.0.0.1:8000/api/system/sftp -X POST \
  -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' \
  -d '{"server_id":1,"username":"webuser","home_path":"/home/container","enabled":true}'
```

Usernames must start with a lowercase letter and contain only lowercase
letters, digits and underscores. The pair `(server_id, username)` is unique.

## Production notes

- Set a strong `AETHERIS_SECRET` (e.g. `openssl rand -hex 32`).
- Run with a process supervisor (systemd / launchd / Task Scheduler); the
  automated installer generates the units for you - see `installer.md`.
- Replace the SQLite database with PostgreSQL for multi-instance
  deployments; the API layer is storage-agnostic.
