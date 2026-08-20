# User management

How users, roles and permissions work in Aetheris.

## Roles

| Role | Access |
| --- | --- |
| `superadmin` | Everything — create admins, manage billing, delete nodes |
| `admin` | Manage nodes, servers, cron jobs, SFTP users |
| `user` | Client portal — view servers, pay invoices, console access |

## Create a user

Admin → Users → Add User, or via the API:

```bash
curl -sS http://127.0.0.1:8000/api/auth/users \
  -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{"email":"dev@example.com","password":"strong-password","role":"admin","name":"Developer"}'
```

## Authentication flow

1. User submits email + password.
2. Backend verifies scrypt hash, returns HMAC-signed JWT.
3. JWT is sent as `Authorization: Bearer <token>` on every request.
4. Tokens expire after `AETHERIS_TOKEN_TTL` seconds (default 24h).

## API keys

Machine accounts can use per-user API keys (created in the Admin Panel) for headless integrations. API keys bypass the login flow and authenticate directly.

## Password policy

- Hashed with scrypt (per-user salt, 64-byte key).
- No forced rotation — use strong passwords and rotate manually.
- Set `AETHERIS_SECRET` to a strong value in production.

See also: [Security](security.md), [API authentication](api-authentication.md).
