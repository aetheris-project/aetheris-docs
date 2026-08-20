# Webhook

Webhook outbound notificano sistemi esterni degli eventi della piattaforma.

## Registra un webhook

Admin Panel → Settings → Webhooks, o via API:

```bash
curl -sS http://127.0.0.1:8000/api/webhooks \
  -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{"url":"https://example.com/hook","events":["server.provisioned","invoice.paid"]}'
```

## Eventi

| Evento | Trigger |
| --- | --- |
| `server.provisioned` | Server creato e attivo |
| `server.suspended` | Server sospeso (mancato pagamento) |
| `server.terminated` | Server eliminato |
| `invoice.created` | Nuova fattura generata |
| `invoice.paid` | Pagamento ricevuto |
| `invoice.overdue` | Pagamento in scadenza |

## Retry

Fino a 5 tentativi con backoff esponenziale (1m, 5m, 30m, 2h, 12h).

Vedi anche: [Architettura](architecture.md), [Sicurezza](security.md).
