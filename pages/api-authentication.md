# API authentication

How to authenticate with the Aetheris REST API.

## Login

```bash
TOKEN=$(curl -sS http://127.0.0.1:8000/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"admin@example.com","password":"admin-aetheris-2026"}' \
  | python -c "import sys,json;print(json.load(sys.stdin)['token'])")
```

## Use the token

```bash
curl -sS http://127.0.0.1:8000/api/nodes \
  -H "Authorization: Bearer $TOKEN"
```

## Token lifetime

- Default TTL: 86400 seconds (24 hours).
- Controlled by `AETHERIS_TOKEN_TTL` environment variable.
- Tokens are HMAC-signed; no database lookup needed.

## Roles

| Role | Access |
| --- | --- |
| `superadmin` | Full access — all endpoints |
| `admin` | Manage nodes, servers, billing, cron, SFTP |
| `user` | Read-only — list servers, view invoices, power actions |

## Password hashing

Passwords are hashed with **scrypt** (per-user salt, constant-time compare). The hash format is `scrypt:<salt>:<hash>`.

See also: [Backend](backend.md), [REST API reference](../rest-api/reference.md).
