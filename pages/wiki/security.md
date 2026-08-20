# Security

Security is a first-class concern in Aetheris: the platform stores billing
data, holds credentials for hypervisors and payment gateways, and exposes a
public client portal. This page documents the controls that are built in
and the hardening checklist you should apply before going live.

## Built-in controls

### Credential encryption at rest

Hypervisor tokens, gateway secrets and SMTP passwords are never stored in
plain text. The backend encrypts every secret with AES-256-GCM before it
touches the database:

```text
plaintext secret
      |
      v
   AES-256-GCM        <- key from AETHERIS_MASTER_KEY (32 random bytes, base64)
      |
      v
   nonce (12 bytes) + ciphertext + auth tag
      |
      v
   stored in PostgreSQL
```

- The master key is read from the environment, never from the database.
- Each secret gets a fresh random nonce; the authentication tag makes
  tampering detectable.
- Rotate the master key by re-encrypting secrets with a documented
  maintenance job (see below).

### Authentication

| Surface | Mechanism |
| --- | --- |
| Client portal | Email + password, scrypt-hashed, JWT session |
| Admin panel | Same accounts, role-gated routes |
| REST API | `Authorization: Bearer <jwt>` or API key |
| Hypervisor APIs | Driver-scoped tokens, stored encrypted |
| Webhook delivery | HMAC-SHA256 signature per endpoint |

Passwords are hashed with scrypt using a per-user random salt and a
work factor chosen for interactive login latency. JWT access tokens are
short-lived (15 minutes); refresh tokens are rotated on every use and can
be revoked.

### Role-based access control

Two built-in roles:

- **Admin**: nodes, plans, servers, billing, whitelabel, users.
- **Client**: owns the servers assigned to their account, can start/stop,
  reboot, open the console, create backups and view invoices.

Authorization is enforced in the API layer on every route; the web layer
never trusts client-side flags. All destructive operations write an entry
to the immutable audit log (`audit_log` table): who, what, when, from
which IP.

### Rate limiting and abuse protection

- Per-account rate limits on login (mitigates credential stuffing).
- Per-IP limits on the public portal and contact endpoints.
- Redis-backed token buckets on payment endpoints.
- Idempotency keys on provisioning and billing operations, so duplicate
  requests never double-provision or double-charge.

### Outbound traffic

The worker layer talks to hypervisors over TLS. Certificates are verified;
no insecure fallback is allowed. Webhook endpoints receive events signed
with HMAC-SHA256 using a per-endpoint secret you configure.

## Deployment hardening checklist

### 1. TLS everywhere

Terminate TLS at the edge (Nginx/Caddy/load balancer) and force HTTPS:

```nginx
server {
    listen 80;
    server_name panel.example.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name panel.example.com;

    ssl_certificate     /etc/letsencrypt/live/panel.example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/panel.example.com/privkey.pem;
    ssl_protocols       TLSv1.2 TLSv1.3;
    ssl_ciphers         HIGH:!aNULL:!MD5;
}
```

### 2. Secrets and environment

- Set a strong `AETHERIS_MASTER_KEY` (generate with
  `openssl rand -base64 32`) and store it in a secret manager.
- Never commit `.env`; the installer generates one with random values.
- Rotate gateway and hypervisor tokens in the Admin Panel when staff
  changes.

### 3. Database and Redis

- PostgreSQL: use a dedicated user, reject `trust` auth, enable SSL,
  restrict network access to the app subnet.
- Redis: bind to localhost or a private network, require
  `requirepass`, and never expose the port publicly.

### 4. Network

- Do not expose PostgreSQL (5432) or Redis (6379) to the internet.
- Only 80/443 (web) and 8000 (API, if you use it directly) should be
  reachable from outside.
- Place workers on the same private network as the hypervisors they
  manage.

### 5. Updates

Subscribe to release announcements and apply security updates to the
platform, the host OS and the container images. See [Upgrades](upgrades.md)
for the supported upgrade path.

## Master key rotation

Rotating `AETHERIS_MASTER_KEY` requires re-encrypting stored secrets:

1. Stop the workers and API (no writes while rotating).
2. Set the new key as `AETHERIS_MASTER_KEY` in the environment.
3. Run the maintenance task that decrypts with the old key and re-encrypts
   with the new one for every row in the credentials table.
4. Restart the stack and verify a hypervisor call and a webhook delivery.

## Incident response runbook

1. **Contain**: revoke the affected API keys/tokens from the Admin Panel.
2. **Preserve**: snapshot the PostgreSQL volume and export the audit log.
3. **Investigate**: correlate the audit log with web server access logs.
4. **Recover**: rotate all secrets, rebuild hosts from images, restore data
   from the last clean backup (see [Backup and restore](backup-and-restore.md)).
5. **Learn**: document the root cause and update this runbook.

## Reporting a vulnerability

If you find a security issue, open a private advisory on the
`aetheris-project/aetheris-app` repository or contact the maintainers
directly. Please do not disclose vulnerabilities publicly before a fix is
released.
