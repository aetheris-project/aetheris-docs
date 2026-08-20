# Billing plans

How to create and manage hosting plans.

## Create a plan

Admin → Billing → Plans, or via the API:

```bash
curl -sS http://127.0.0.1:8000/api/servers/plans \
  -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "Starter",
    "price": 9.99,
    "currency": "EUR",
    "interval": "monthly",
    "vcpu": 2,
    "memoryMb": 2048,
    "diskMb": 51200
  }'
```

## Plan fields

| Field | Description |
| --- | --- |
| `name` | Display name (shown in the store) |
| `price` | Amount per interval |
| `currency` | ISO 4217 code (EUR, USD, GBP, …) |
| `interval` | `monthly`, `quarterly`, `yearly` |
| `vcpu`, `memoryMb`, `diskMb` | Resource limits |
| `egg_id` | Pterodactyl egg (for game hosting) |

## Discounts and coupons

Create coupon codes in Admin → Billing → Coupons. Coupons can be percentage-based or fixed-amount, with optional expiration dates and usage limits.

## Invoicing

- Invoices are generated automatically at the start of each billing interval.
- Proration applies when plans change mid-cycle.
- The `billing` queue handles generation, payment capture and dunning.

See also: [Billing engine](billing.md), [Backend](backend.md).
