# Cron jobs

Scheduled background tasks managed by the platform.

## Create a job

Admin → Cron → Add Job, or via the API:

```bash
curl -sS http://127.0.0.1:8000/api/system/cron \
  -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{"name":"Nightly backups","schedule":"0 3 * * *","task":"backup","enabled":true}'
```

## Task types

| Task | Description |
| --- | --- |
| `backup` | Snapshot and offsite copy |
| `invoice.dunning` | Retry failed payments |
| `snapshot.prune` | Clean old snapshots |
| `sync.pterodactyl` | Pull Pterodactyl node state |
| `sync.proxmox` | Pull Proxmox VE node state |
| `sync.virtfusion` | Pull VirtFusion node state |
| `report.daily` | Generate daily summary |

## Schedule format

Standard 5-field cron: `minute hour day-of-month month day-of-week`

Examples:
- `0 3 * * *` — every day at 3 AM
- `0 */6 * * *` — every 6 hours
- `30 2 * * 1` — Monday at 2:30 AM

## Run manually

```bash
curl -sS http://127.0.0.1:8000/api/system/cron/{id}/run \
  -X POST \
  -H "Authorization: Bearer $TOKEN"
```

See also: [Backend](backend.md), [Architecture](architecture.md).
