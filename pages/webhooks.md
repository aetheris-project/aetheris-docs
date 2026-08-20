# Webhooks

Outbound webhooks notify external systems of platform events.

## Register a webhook

In the Admin Panel → Settings → Webhooks, or via the API:

```bash
curl -sS http://127.0.0.1:8000/api/webhooks \
  -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{"url":"https://example.com/hook","events":["server.provisioned","invoice.paid"]}'
```

## Events

| Event | Trigger |
| --- | --- |
| `server.provisioned` | Server created and running |
| `server.suspended` | Server suspended (payment failure) |
| `server.terminated` | Server deleted |
| `invoice.created` | New invoice generated |
| `invoice.paid` | Payment received |
| `invoice.overdue` | Payment past due |
| `node.offline` | Node heartbeat missed |

## Payload

Every webhook delivers a JSON body with `event`, `timestamp` and `data` fields. The signature is in the `X-Aetheris-Signature` header (HMAC-SHA256).

## Retry policy

Failed deliveries are retried up to 5 times with exponential backoff (1m, 5m, 30m, 2h, 12h).

See also: [Architecture](architecture.md), [Security](security.md).
