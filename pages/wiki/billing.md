# Billing engine

The Aetheris billing engine is a production-shaped invoicing core exposed by
the Python backend under `/api/billing`. It covers the complete lifecycle of a
charge: quote, invoice, discount, settle, chase and refund.

All money is stored as **integer cents** to avoid floating point drift.

## Concepts

| Concept | Description |
| --- | --- |
| Invoice | A charge with one or more line items, VAT, discount and a due date. |
| Line item | `description`, `quantity`, `unit_cents`, per-line VAT rate. |
| Coupon | Percentage or fixed-amount discount with usage cap and expiry. |
| Payment | A settled, failed or refunded attempt recorded against an invoice. |
| Dunning | The state machine that escalates unpaid invoices. |

### Invoice states

```
draft -> pending -> paid
                -> overdue -> failed
                -> void
paid  -> refunded
```

- `pending` invoices past their due date become `overdue` on the next dunning
  run.
- `overdue` invoices older than the grace period (7 days by default) become
  `failed`.
- `paid` invoices can be refunded, which moves them to `refunded` and records
  a refund payment.

## Invoice numbering

Invoice numbers are sequential and year-scoped:

```
INV-2026-00001
INV-2026-00002
```

The sequence is derived from the highest number in the current year, so it
survives restarts and concurrent creation.

## Creating an invoice

```
POST /api/billing/invoices
```

```json
{
  "client": "Acme Corp",
  "currency": "EUR",
  "due_days": 14,
  "coupon_code": "WELCOME10",
  "lines": [
    { "description": "Minecraft Pro - 4 vCPU / 8 GB", "quantity": 2, "unit_cents": 4990, "tax_rate_pct": 22 },
    { "description": "Backup add-on", "quantity": 1, "unit_cents": 990, "tax_rate_pct": 22 }
  ]
}
```

The engine computes, in order:

1. `subtotal` = sum of `quantity x unit_cents`
2. `discount` = coupon percentage of the subtotal, or fixed amount (capped)
3. `tax` = the subtotal-weighted average VAT rate applied to the taxable amount
4. `amount` = taxable + tax

## Coupons

```
POST   /api/billing/coupons          (admin)  create
GET    /api/billing/coupons                   list
DELETE /api/billing/coupons/{id}     (admin)  disable
```

A coupon is either a percentage (`percent_off`) or a fixed amount
(`amount_off_cents`) - never both - and can be capped by `max_uses` and
`expires_at`. Coupons are validated at invoice creation: unknown, disabled,
expired, exhausted or currency-mismatched codes are rejected.

## Settling invoices

Two paths settle an invoice:

**Direct payment** (demo / manual):

```
POST /api/billing/invoices/{id}/pay?provider=stripe
```

**Provider webhooks** - the production path. Stripe, PayPal and Mollie all
deliver asynchronous events; Aetheris exposes an idempotent ingress:

```
POST /api/billing/webhooks/{provider}
```

```json
{
  "event": "payment.succeeded",
  "payment_id": "pi_3Oabc123",
  "invoice_number": "INV-2026-00001",
  "amount_cents": 13383,
  "currency": "EUR"
}
```

Supported events:

| Event | Effect |
| --- | --- |
| `payment.succeeded` | Invoice becomes `paid`, payment recorded |
| `payment.failed` | Payment recorded as failed, invoice becomes `failed` |
| `payment.refunded` | Invoice becomes `refunded`, refund payment recorded |

Replays are safe: the same `payment_id` is only recorded once.

> Production note: the demo ingress verifies the payload shape only. Deployments
> must validate the provider signature - `Stripe-Signature` for Stripe, PayPal
> transmission headers, Mollie webhook token - before forwarding to this route.

## Dunning

```
POST /api/billing/dunning/run      (admin)  run the state machine
GET  /api/billing/dunning/status            counts and grace period
```

The dunning task is also wired into the cron system as the `invoice.dunning`
job. The escalation is:

1. `pending` and past due -> `overdue`
2. `overdue` and older than the grace period -> `failed`

## Refunds

```
POST /api/billing/invoices/{id}/refund   (admin)
```

Only `paid` invoices can be refunded. The invoice moves to `refunded` and a
`refunded` payment is recorded with a generated refund id.

## Summary

```
GET /api/billing/summary
```

Returns MRR, outstanding, overdue and failed amounts plus the amount collected
in the current month - the numbers that power the admin dashboard.
