# Portale client

Dashboard per i clienti dove gestiscono i loro server.

## Pagine

| Pagina | URL | Descrizione |
| --- | --- | --- |
| Lista server | `/` | Tutti i server con statistiche risorse |
| Console server | `/console/{id}` | Console VNC, controlli power |
| Fatturazione | `/billing` | Fatture, metodi di pagamento |
| Store | `/store` | Piani disponibili |

## Funzionalità

- **Console real-time** — terminale VNC via WebSocket.
- **Controlli power** — start, stop, restart dalla dashboard.
- **Gauge risorse** — CPU, RAM, disco in real-time.
- **Gestione fatture** — visualizza, paga, scarica fatture.

Vedi anche: [Pannello admin](admin-panel.md), [Gestione utenti](user-management.md).
