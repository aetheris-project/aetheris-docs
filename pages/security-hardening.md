# Security — Hardening

Detailed security controls and production checklist.

## Credential encryption

Hypervisor tokens and gateway secrets use AES-256-GCM:

```text
plaintext → AES-256-GCM (key from AETHERIS_MASTER_KEY) → nonce + ciphertext + tag → PostgreSQL
```

- Key from environment, never from database.
- Fresh random nonce per secret.
- Authentication tag prevents tampering.

## Password hashing

scrypt with per-user salt, 64-byte key, constant-time comparison:

```text
password → scrypt(salt, 64) → "scrypt:<salt>:<hash>" → PostgreSQL
```

## JWT tokens

- HMAC-signed, stateless.
- Default TTL: 86400 seconds (24h).
- Configurable via `AETHERIS_TOKEN_TTL`.

## RBAC

| Role | Permissions |
| --- | --- |
| `superadmin` | Everything — users, admin, billing, nodes, delete |
| `admin` | Manage nodes, servers, cron, SFTP |
| `user` | Client portal — view servers, pay invoices, console |

## Network hardening

```bash
# Firewall
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
# Keep PostgreSQL and Redis on loopback only

# PostgreSQL
sudo -u postgres psql -c "ALTER USER aetheris PASSWORD 'strong-password';"

# Redis
# /etc/redis/redis.conf
bind 127.0.0.1
requirepass strong-redis-password
```

## Audit logging

Every write operation (create, update, delete) is recorded in the `audit_log` table with user, timestamp, action and affected resource.

See also: [Security overview](security.md), [User management](user-management.md).
