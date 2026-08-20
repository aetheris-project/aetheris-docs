# Billing engine

Production-shaped invoicing core: quote → invoice → discount → settle → chase → refund. All money stored as integer cents.

## Concepts

| Concept | Description |
| --- | --- |
| Invoice | Charge with line items, VAT, discount, due date |
| Line item | `description`, `quantity`, `unit_cents`, per-line VAT |
| Coupon | Percentage or fixed discount with cap and expiry |
| Payment | Settled, failed or refunded attempt |
| Dunning | State machine that escalates unpaid invoices |

## Invoice lifecycle

```
draft → pending → paid
              → overdue → failed
              → void
paid → refunded
```

## Quick links

- [Billing invoicing](billing-invoicing.md) — invoice generation, dunning, webhooks
- [Billing plans](billing-plans.md) — create and manage plans

See also: [Backend API](backend-api.md), [Architecture](architecture.md).
