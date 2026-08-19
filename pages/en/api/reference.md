# REST API reference

The Aetheris control plane exposes a JSON REST API. This page summarizes the
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
| GET | `/billing/invoices` | List invoices for the tenant |
| GET | `/billing/invoices/{id}` | Invoice with lines and payments |
| POST | `/billing/invoices/{id}/pay` | Trigger a payment attempt |
| GET | `/billing/payment-methods` | Saved payment methods |
| POST | `/billing/subscriptions` | Subscribe to a plan |

### Admin

| Method | Path | Description |
| --- | --- | --- |
| GET | `/admin/nodes` | Node list with utilization |
| POST | `/admin/hypervisors` | Register a hypervisor credential |
| POST | `/admin/hypervisors/{id}/sync` | Synchronize nodes and eggs from the backend |
| GET | `/admin/audit` | Audit log stream |
| PUT | `/admin/settings` | Platform-level settings |

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

## SDK clients

Generated clients can be produced from `openapi.yaml` with any OpenAPI
generator (openapi-generator, orval, openapi-typescript). The typed driver
contracts in `src/lib/adapters/hypervisors/types.ts` are the canonical
TypeScript source for hypervisor-facing shapes.
