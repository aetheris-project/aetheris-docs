# Motore di fatturazione

Core di fatturazione production-ready: preventivo → fattura → sconto → incasso → recupero → rimborso. Tutti i soldi memorizzati come interi (centesimi).

## Concetti

| Concetto | Descrizione |
| --- | --- |
| Fattura | Addebito con righe, IVA, sconto, data scadenza |
| Riga | `descrizione`, `quantità`, `prezzo_unitario`, IVA per riga |
| Coupon | Sconto percentuale o fisso con cap e scadenza |
| Payment | Tentativo incassato, fallito o rimborsato |
| Dunning | Macchina a stati che scala fatture non pagate |

## Ciclo della fattura

```
bozza → in sospeso → pagata
                → scaduta → fallita
                → annullata
pagata → rimborsata`
```

Vedi anche: [Invoicing](billing-invoicing.md), [Piani](billing-plans.md).
