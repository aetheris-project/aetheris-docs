# Billing — Invoicing

Invoice generation, proration, dunning and webhooks.

## Invoice generation

Invoices are created by the `billing` BullMQ queue:

```bash
curl -sS http://127.0.0.1:8000/api/billing/invoices \
  -H "Authorization: Bearer $TOKEN"
```

## Proration

When a plan changes mid-cycle, the invoice is prorated:

- New plan costs more → credit remaining time, charge difference.
- New plan costs less → credit the difference to next invoice.

## Dunning cycle

| Day | Action |
| --- | --- |
| 0 | Invoice created, `pending` |
| Due date | `overdue` — first retry email |
| +1 day | Second retry attempt |
| +3 days | Third retry, server suspended |
| +7 days | Final attempt |
| +14 days | Invoice marked `failed`, server terminated |

## Coupons

Create in Admin → Billing → Coupons:

```bash
curl -sS http://127.0.0.1:8000/api/billing/coupons \
  -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{"code":"SUMMER20","type":"percentage","value":20,"max_uses":100}'
```

## Webhooks

Payment events trigger outbound webhooks:

| Event | When |
| --- | --- |
| `invoice.created` | Invoice generated |
| `invoice.paid` | Payment received |
| `invoice.overdue` | Past due date |
| `server.suspended` | Dunning exhausted |

See also: [Webhooks](webhooks.md), [Billing plans](billing-plans.md).
