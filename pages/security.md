# Security

Built-in controls and hardening checklist for production.

## Built-in controls

- **AES-256-GCM encryption** for hypervisor tokens, gateway secrets, SMTP passwords.
- **scrypt password hashing** with per-user salt.
- **JWT bearer tokens** with configurable TTL.
- **RBAC** — superadmin, admin, user roles.
- **CORS** — configurable allowed origins.
- **Rate limiting** — per-IP request throttling via Redis.

## Hardening checklist

| Area | Action |
| --- | ---|
| `AETHERIS_SECRET` | Set a strong value (≥ 32 chars) |
| `NEXTAUTH_SECRET` | Set a strong value |
| Database | Restrict to loopback, use strong password |
| Redis | Bind to loopback, enable AOF |
| TLS | Always use HTTPS in production |
| Firewall | Only open 80/443, keep DB/Redis on loopback |
| Admin credentials | Change defaults immediately |

## Quick links

- [Security hardening](security-hardening.md) — detailed controls and checklist
- [User management](user-management.md) — roles and permissions

See also: [Architecture](architecture.md), [Environment variables](environment-variables.md).
