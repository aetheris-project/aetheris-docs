# Piani di fatturazione

Come creare e gestire piani di hosting.

## Crea un piano

Admin → Billing → Plans, o via API:

```bash
curl -sS http://127.0.0.1:8000/api/servers/plans \
  -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{"name":"Starter","price":9.99,"currency":"EUR","interval":"monthly","vcpu":2,"memoryMb":2048,"diskMb":51200}'
```

## Campi del piano

| Campo | Descrizione |
| --- | --- |
| `name` | Nome visualizzato |
| `price` | Importo per intervallo |
| `currency` | Codice ISO 4217 |
| `interval` | `monthly`, `quarterly`, `yearly` |
| `vcpu`, `memoryMb`, `diskMb` | Limiti risorse |

## Sconti e coupon

Crea codici coupon in Admin → Billing → Coupons.

Vedi anche: [Billing](billing.md), [Backend](backend.md).
