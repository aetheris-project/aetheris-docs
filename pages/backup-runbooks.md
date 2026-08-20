# Backup — Runbooks

Scheduled backups, restore procedures and disaster recovery.

## Scheduled backups (cron)

```bash
# Daily at 3 AM
0 3 * * * cd /opt/aetheris && docker compose exec -T postgres pg_dump --username=aetheris --dbname=aetheris --format=custom > /backups/aetheris-$(date +\%F).dump
```

## Restore procedure

### 1. Stop the web app

```bash
docker compose stop web worker
```

### 2. Restore the database

```bash
cat backup.dump | docker compose exec -T postgres pg_restore \
  --username=aetheris --dbname=aetheris --clean --if-exists
```

### 3. Restart

```bash
docker compose up -d
```

### 4. Verify

```bash
curl -sS http://localhost:8000/health
curl -sS -o /dev/null -w '%{http_code}\n' http://localhost:3000/login
```

## Disaster recovery

If the entire host is lost:

1. Install Docker on a new machine.
2. Clone `aetheris-app`, restore `.env`.
3. Restore PostgreSQL from backup.
4. `docker compose up -d --build`.

## What's NOT in the backup

- Docker images (re-pulled on `docker compose up --build`)
- Node modules (re-installed on `npm ci`)
- TLS certificates (re-issued by Certbot)

See also: [Backup overview](backup-and-restore.md), [Upgrades](upgrades.md).
