# Backup and restore

Protect your Aetheris installation — what to back up, how to schedule it, and how to recover.

## What to back up

| Data | Location | Required |
| --- | --- | --- |
| PostgreSQL database | Data volume | ✅ All business data |
| Application state | `aetheris-app` + `.env` | ✅ Keep `.env` |
| Redis (AOF) | Redis data dir | Optional (zero-loss billing) |
| Uploads | App data volume | Depends on install |

**PostgreSQL is the single most important item** — it contains accounts, nodes, servers, invoices, audit log and encrypted credentials.

## Quick backup

```bash
# Docker
docker compose exec -T postgres pg_dump --username=aetheris --dbname=aetheris --format=custom > backup.dump

# Restore
cat backup.dump | docker compose exec -T postgres pg_restore --username=aetheris --dbname=aetheris --clean
```

## Quick links

- [Backup runbooks](backup-runbooks.md) — scheduled backups, restore procedures, disaster recovery

See also: [Monitoring](monitoring.md), [Upgrades](upgrades.md).
