# Updates

How to update Aetheris to the latest version.

## Docker deployments

```bash
cd aetheris-app
git pull origin main
docker compose up -d --build
```

Migrations run automatically on container start.

## Manual (systemd)

```bash
cd /opt/aetheris-app
git pull origin main
npm ci
npx prisma migrate deploy
npm run build
sudo systemctl restart aetheris-web aetheris-worker aetheris-backend
```

## Check for updates

The Admin → Status page shows the latest GitHub release and whether an update is available. The backend caches the release check to avoid rate limits.

## Rollback

```bash
git log --oneline -10      # find the last good commit
git checkout <commit>      # pin to that version
docker compose up -d --build
# or: npm run build && sudo systemctl restart aetheris-web
```

See also: [Upgrades](upgrades.md), [Installation](installation.md).
