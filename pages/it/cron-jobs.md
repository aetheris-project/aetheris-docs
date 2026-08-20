# Job schedulati

Task background schedulati dalla piattaforma.

## Crea un job

Admin → Cron → Add Job, o via API:

```bash
curl -sS http://127.0.0.1:8000/api/system/cron \
  -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{"name":"Backup notturno","schedule":"0 3 * * *","task":"backup","enabled":true}'
```

## Tipi di task

| Task | Descrizione |
| --- | --- |
| `backup` | Snapshot e copia offsite |
| `invoice.dunning` | Retry pagamenti falliti |
| `snapshot.prune` | Pulizia vecchi snapshot |
| `sync.pterodactyl` | Stato nodi Pterodactyl |
| `sync.proxmox` | Stato nodi Proxmox VE |
| `sync.virtfusion` | Stato nodi VirtFusion |

## Formato cron

5 campi: `minuto ora giorno-mese mese giorno-settimana`

Esempi:
- `0 3 * * *` — ogni giorno alle 3:00
- `0 */6 * * *` ogni 6 ore
- `30 2 * * 1` — lunedì alle 2:30

## Esegui manualmente

```bash
curl -sS http://127.0.0.1:8000/api/system/cron/{id}/run \
  -X POST -H "Authorization: Bearer $TOKEN"
```

Vedi anche: [Backend](backend.md), [Architettura](architecture.md).
