# Backup and restore

This page is the operational reference for protecting your Aetheris
installation. It covers what to back up, how to schedule backups, and the
exact steps to restore after a failure.

## What to back up

| Data | Where it lives | Required for restore |
| --- | --- | --- |
| PostgreSQL database | PostgreSQL data volume | Yes - all business data |
| Encrypted credentials | Inside PostgreSQL | Yes (part of the database) |
| Redis | Redis data dir (AOF) | No for restore, yes for zero-loss billing |
| Application state | `aetheris-app` clone + `.env` | Yes - keep the `.env` file |
| Uploads / attachments | app data volume | Depends on your install |

The single most important item is the PostgreSQL database: it contains
accounts, nodes, servers, invoices, the audit log and the encrypted
credentials. A full restore of the platform is: database + `.env` +
application source.

## Backing up PostgreSQL

### Live dump with docker compose

```bash
docker compose exec -T postgres pg_dump \
  --username=aetheris \
  --dbname=aetheris \
  --format=custom \
  > aetheris-$(date +%F).dump
```

- `--format=custom` gives you compressed, restore-time-selectable dumps.
- Always pipe through `-T` (no TTY) when running from a script.
- Store the dump off-host (S3, another machine, a NAS) and encrypt it if it
  leaves your network.

### Automated cron example

```bash
#!/usr/bin/env bash
set -euo pipefail

BACKUP_DIR="/var/backups/aetheris"
STAMP=$(date +%F-%H%M)
KEEP=14

mkdir -p "$BACKUP_DIR"
docker compose -f /opt/aetheris/docker-compose.yml exec -T postgres \
  pg_dump --username=aetheris --dbname=aetheris --format=custom \
  > "$BACKUP_DIR/aetheris-$STAMP.dump"

# Rotate: keep the last 14 dumps
find "$BACKUP_DIR" -name 'aetheris-*.dump' -mtime +$KEEP -delete
```

Add it to crontab:

```cron
0 2 * * * /usr/local/bin/aetheris-backup.sh
```

### Point-in-time recovery (production)

For production installs enable PostgreSQL WAL archiving or use a managed
provider with PITR (Neon, RDS, Cloud SQL). This lets you restore to any
moment, not just the last scheduled dump.

## Backing up Redis

Redis holds the BullMQ queues and the whitelabel cache. A lost queue means
retries and in-flight jobs are lost; billing workers pick up again from the
database on the next cycle, so the impact is limited. For zero-loss
operation:

1. Enable AOF persistence in `redis.conf`:
   ```
   appendonly yes
   appendfsync everysec
   ```
2. Snapshot the data directory together with the PostgreSQL backup.
3. Add a Redis replica in a second availability zone if Redis availability
   is business-critical.

## Backing up the environment

The `.env` file in the application directory contains the secrets the
stack needs to start (database password, Redis password, master key,
gateway keys). Without it a restore cannot decrypt credentials or reach
the databases.

```bash
cp /opt/aetheris/aetheris-app/.env /var/backups/aetheris/.env
```

Store it in your secret manager as well, so a full host loss is
recoverable.

## Restore runbook

### Full restore on a new host

1. Install the prerequisites (see [Installation](installation.md)).
2. Clone the application and restore the `.env` file:
   ```bash
   git clone https://github.com/aetheris-project/aetheris-app.git
   cp /path/to/backup/.env aetheris-app/.env
   ```
3. Start PostgreSQL and Redis containers first, wait for them to be ready.
4. Restore the database:
   ```bash
   docker compose exec -T postgres pg_restore \
     --username=aetheris \
     --dbname=aetheris \
     --clean \
     --if-exists \
     < aetheris-2026-08-20.dump
   ```
5. Start the rest of the stack:
   ```bash
   docker compose up -d
   ```
6. Verify: log in to the admin panel, check the node list, run one
   test provisioning and confirm the audit log contains recent entries.

### Restoring into an existing installation

If the stack is already running, restore the database first (stop web,
API and workers so nothing writes during the restore), then start them
again:

```bash
docker compose stop web api worker
docker compose exec -T postgres pg_restore --username=aetheris --dbname=aetheris --clean --if-exists < aetheris-2026-08-20.dump
docker compose start
```

## Disaster recovery test plan

A backup you have never restored is not a backup. Run this quarterly:

1. Spin up a scratch host with the same OS and prerequisites.
2. Follow the full restore runbook above.
3. Verify: admin login, node connectivity, an invoice generation, a
   webhook delivery.
4. Tear the scratch host down.

Time the exercise and keep the result in your runbook; the goal is a
restore in under one hour for a single-host install.
