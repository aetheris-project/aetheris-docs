# REST API reference

The Aetheris control panel exposes a JSON REST API. This page summarizes the
platform endpoints; the machine-readable contract is the bundled
[OpenAPI 3.1 specification](../public/openapi.yaml).

## Conventions

- Base URL: `https://app.example.com/api`.
- Authentication: `Authorization: Bearer <session>` for platform endpoints;
  payment webhooks use provider signatures.
- Content type: `application/json` on requests and responses.
- Errors: `{ "error": { "code": string, "message": string, "details"?: object } }`
  with appropriate HTTP status codes.

## Endpoints

### Whitelabel

| Method | Path | Description |
| --- | --- | --- |
| GET | `/whitelabel` | Dynamic whitelabel configuration for the tenant (`?organization=<slug>`) |
| PUT | `/admin/whitelabel` | Update brand, theme, navigation and module toggles |

### Servers

| Method | Path | Description |
| --- | --- | --- |
| GET | `/servers` | List the caller's servers |
| POST | `/servers` | Provision a server (plan + node selection) |
| GET | `/servers/{id}` | Server detail with resources and state |
| DELETE | `/servers/{id}` | Terminate the workload |
| POST | `/servers/{id}/power` | Body `{ "signal": "start" \| "stop" \| "restart" \| "kill" }` |
| GET | `/servers/{id}/telemetry` | Latest telemetry sample |
| GET | `/servers/{id}/console` | Console session (WebSocket URL + one-time token) |
| GET | `/servers/{id}/backups` | List backups |
| POST | `/servers/{id}/backups` | Create a backup, body `{ "name": string }` |
| POST | `/servers/{id}/backups/{backupId}/restore` | Restore a backup |
| DELETE | `/servers/{id}/backups/{backupId}` | Delete a backup |

### Billing

| Method | Path | Description |
| --- | --- | --- |
| GET | `/billing/summary` | MRR, outstanding, overdue and collected amounts |
| GET | `/billing/invoices` | List invoices with lines and payments |
| GET | `/billing/invoices/{id}` | Single invoice detail |
| POST | `/billing/invoices` | Create an invoice with lines, VAT and an optional coupon |
| POST | `/billing/invoices/{id}/pay` | Settle an invoice (direct/demo payment) |
| POST | `/billing/invoices/{id}/refund` | Refund a paid invoice (admin) |
| GET | `/billing/coupons` | List coupons |
| POST | `/billing/coupons` | Create a coupon (admin) |
| DELETE | `/billing/coupons/{id}` | Disable a coupon (admin) |
| POST | `/billing/webhooks/{provider}` | Idempotent payment webhook ingress (stripe, paypal, mollie) |
| POST | `/billing/dunning/run` | Run the dunning state machine (admin) |
| GET | `/billing/dunning/status` | Invoice status counts and grace period |

Invoice creation bodies use
`{ "client", "currency", "due_days", "coupon_code", "lines": [{ "description", "quantity", "unit_cents", "tax_rate_pct" }] }`.
Webhook bodies use `{ "event", "payment_id", "invoice_number" | "invoice_id", "amount_cents", "currency" }`
with `event` one of `payment.succeeded`, `payment.failed`, `payment.refunded`.

### Catalog (game hosting)

| Method | Path | Description |
| --- | --- | --- |
| GET | `/catalog/games` | Game catalog with resource presets and pricing |
| GET | `/catalog/games/{slug}` | Single game entry (metadata, image, presets) |

See [Game hosting](../wiki/game-hosting.md) for the full catalog and the
provisioning flow.

### Admin

| Method | Path | Description |
| --- | --- | --- |
| GET | `/admin/nodes` | Node list with utilization |
| POST | `/admin/hypervisors` | Register a hypervisor credential |
| POST | `/admin/hypervisors/{id}/sync` | Synchronize nodes and eggs from the backend |
| GET | `/admin/audit` | Audit log stream |
| PUT | `/admin/settings` | Platform-level settings |

### System

| Method | Path | Description |
| --- | --- | --- |
| GET | `/system/status` | Version, latest GitHub release and update availability |
| GET | `/system/cron` | List scheduled jobs (cron) |
| POST | `/system/cron` | Create a scheduled job |
| PATCH | `/system/cron/{id}` | Update a scheduled job |
| DELETE | `/system/cron/{id}` | Delete a scheduled job |
| POST | `/system/cron/{id}/run` | Trigger a job immediately |
| GET | `/system/sftp` | List SFTP file-access users |
| POST | `/system/sftp` | Create an SFTP user |
| PATCH | `/system/sftp/{id}` | Update an SFTP user |
| DELETE | `/system/sftp/{id}` | Delete an SFTP user |

Cron job bodies use the shape `{ "name", "schedule", "task", "enabled" }`
where `schedule` is a five-field cron expression and `task` is one of
`backup`, `invoice.dunning`, `snapshot.prune`, `sync.pterodactyl`,
`sync.proxmox`, `sync.virtfusion`, `report.daily`. SFTP user bodies use
`{ "server_id", "username", "home_path", "enabled" }`.

```json
// GET /system/status
{
  "version": "1.0.0",
  "latest_release": { "tag": "v1.1.0", "url": "...", "published_at": "2026-08-15T10:00:00Z" },
  "update_available": true,
  "environment": "production",
  "healthy": true
}
```

## Webhooks

| Provider | Path | Signature header |
| --- | --- | --- |
| Stripe | `/webhooks/stripe` | `Stripe-Signature` |
| PayPal | `/webhooks/paypal` | `PAYPAL-TRANSMISSION-SIG` |
| Mollie | `/webhooks/mollie` | HMAC in `Authorization` |

Webhook handlers verify signatures, enqueue billing jobs and return `200`
quickly; processing happens in the `aetheris.billing` queue.

## Status codes

| Code | Meaning |
| --- | --- |
| 200 | Success |
| 201 | Resource created |
| 202 | Accepted for background processing |
| 400 | Validation failure |
| 401 | Missing or invalid credentials |
| 403 | Insufficient role |
| 404 | Resource not found |
| 409 | State conflict (e.g. suspend on a terminated server) |
| 429 | Rate limited |
| 500 | Backend error |
| 502 | Upstream hypervisor error |

## Authentication

### Sessions (interactive clients)

1. `POST /auth/login` with `{ "email": string, "password": string }`.
2. The response contains an access token (15 minute lifetime) and a refresh
   token (rotation on every use, revocable).
3. Send the access token as `Authorization: Bearer <token>` on every
   request. When it expires, exchange the refresh token at
   `POST /auth/refresh`.

### API keys (machines and scripts)

Create an API key in the Admin Panel or via `POST /admin/api-keys`:

```http
Authorization: Bearer <admin-jwt>

POST /admin/api-keys
Content-Type: application/json

{ "label": "deploy-bot", "scopes": ["servers:write", "billing:read"] }
```

API keys never expire by default but can be revoked at any time; the audit
log records every use. Keep them in your secret manager.

## Pagination and filtering

List endpoints are paginated. Query parameters:

| Parameter | Default | Description |
| --- | --- | --- |
| `page` | `1` | 1-based page number |
| `per_page` | `50` | Page size, max `100` |
| `sort` | `created_at:desc` | `field:asc` or `field:desc` |
| `filter` | - | `key=value` pairs, comma separated |

Example:

```http
GET /billing/invoices?page=2&per_page=25&sort=due_date:asc&filter=status=open
```

Responses include a pagination envelope:

```json
{
  "data": [],
  "meta": { "page": 2, "per_page": 25, "total": 312, "total_pages": 13 }
}
```

## Idempotency

Write operations accept an `Idempotency-Key` header. Retrying the same
request with the same key returns the original result instead of executing
again - essential for provisioning and payments from scripts with retries.

```http
POST /servers
Idempotency-Key: deploy-2026-08-20-01
Content-Type: application/json
```

## Rate limits

| Scope | Limit | Window |
| --- | --- | --- |
| Login | 5 attempts | 15 minutes per account |
| Public endpoints | 60 requests | 1 minute per IP |
| Authenticated API | 600 requests | 1 minute per key |
| Payment endpoints | 20 requests | 1 minute per account |

Exceeding a limit returns `429` with a `Retry-After` header.

## Error format

All errors use a consistent shape:

```json
{
  "error": {
    "code": "node_unreachable",
    "message": "Node fra-01 did not respond",
    "details": { "node_id": "fra-01", "attempts": 3 }
  }
}
```

Machine-readable `code` values are stable across versions; `message` is
human-facing and may change.

## Example: provision a server

```bash
TOKEN=$(curl -sS -X POST http://app.example.com/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"ops@example.com","password":"secret"}' \
  | jq -r '.accessToken')

curl -sS -X POST http://app.example.com/api/servers \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Idempotency-Key: deploy-001' \
  -H 'Content-Type: application/json' \
  -d '{"plan":"vps-4","node":"fra-01","egg":"nodejs-20"}'
```

## SDK clients

Generated clients can be produced from `openapi.yaml` with any OpenAPI
generator (openapi-generator, orval, openapi-typescript). The typed driver
contracts in `src/lib/adapters/hypervisors/types.ts` are the canonical
TypeScript source for hypervisor-facing shapes.
