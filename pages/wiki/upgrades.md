# Upgrades

This page documents the supported upgrade path, what changes between
releases, and how to roll back safely.

## Release model

Aetheris follows semantic versioning:

- **Minor** (x.y.0): new features, non-breaking changes.
- **Patch** (x.y.z): bug fixes and security updates.
- **Major** (x.0.0): breaking changes, documented migration steps.

Upgrade one minor version at a time. Jumping several versions at once is
supported only if the release notes explicitly say so.

## Before you upgrade

1. **Back up** (mandatory): see [Backup and restore](backup-and-restore.md).
   At minimum take a fresh PostgreSQL dump and a copy of `.env`.
2. **Read the release notes** for every version between yours and the
   target.
3. **Check the changelog for migrations**: if a release ships database
   migrations, they run automatically on startup but require a writable
   database and enough disk space.
4. **Schedule a maintenance window** if the upgrade restarts services or
   runs long migrations.

## Upgrade procedure (Docker)

The recommended path uses the tagged images:

```bash
cd /opt/aetheris

# 1. Pull the new images
docker compose pull

# 2. Back up before touching anything (already done above, repeat to be safe)
docker compose exec -T postgres pg_dump --username=aetheris --dbname=aetheris --format=custom > pre-upgrade.dump

# 3. Recreate the containers with the new images
docker compose up -d

# 4. Wait for readiness and verify
curl -fsS http://localhost:8000/health/ready
docker compose ps
```

## Upgrade procedure (bare metal)

1. Stop the services: `sudo systemctl stop aetheris-api aetheris-worker aetheris-web`.
2. Pull the new application code:
   ```bash
   cd /opt/aetheris/aetheris-app
   git pull --ff-only
   npm ci --omit=dev && npm run build
   pip install -r backend/requirements.txt
   ```
3. Run any database migrations.
4. Start the services: `sudo systemctl start aetheris-api aetheris-worker aetheris-web`.
5. Verify with the health endpoints.

## Verifying an upgrade

Run this checklist after every upgrade:

```bash
# API healthy and DB reachable
curl -fsS http://localhost:8000/health/ready

# Portal serves
curl -fsSI https://panel.example.com/ | head -1

# Worker processes jobs
docker compose logs --tail=50 worker

# A provisioning still works (create a scratch server, then delete it)
```

Also check the admin panel: node list, plan list, and one invoice
generation.

## Rolling back

Rollback = restore the previous images + restore the pre-upgrade dump.

```bash
# 1. Point back at the previous image tag
#    (edit docker-compose.yml / .env image tags to the previous version)

# 2. Restore the pre-upgrade database dump
docker compose stop web api worker
docker compose exec -T postgres pg_restore --username=aetheris --dbname=aetheris --clean --if-exists < pre-upgrade.dump
docker compose start

# 3. Verify
curl -fsS http://localhost:8000/health/ready
```

If migrations ran during the upgrade, restoring the pre-upgrade dump is
mandatory before starting the older version: never run a newer schema on
an older application.

## Upgrading the Windows installer

The winget package manages its own updates. To update the installed
installer:

```powershell
winget upgrade AetherisProject.AetherisWindowsInstaller
```

To update the Aetheris stack itself after a new release:

```powershell
aetheris-windows-installer --software
```

## Staying informed

- Release notes: GitHub Releases on `aetheris-project/aetheris-app`.
- Breaking changes: always listed at the top of the release notes.
- Subscribe to the repository for notifications on new tags.
