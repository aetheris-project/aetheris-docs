# Docker deployment

The fastest way to run Aetheris on any OS.

## Quick start

```bash
git clone https://github.com/aetheris-project/aetheris-app.git
cd aetheris-app
cp .env.example .env
# edit .env — set AETHERIS_SECRET, DATABASE_URL, REDIS_URL
docker compose up -d --build
```

## Services

| Container | Image | Port |
| --- | --- | --- |
| `aetheris-web` | Next.js | 3000 |
| `aetheris-backend` | FastAPI | 8000 |
| `aetheris-worker` | BullMQ | — |
| `aetheris-db` | PostgreSQL 16 | 5432 |
| `aetheris-redis` | Redis 7 | 6379 |

## Common commands

```bash
docker compose ps              # status
docker compose logs -f web     # web logs
docker compose logs -f worker  # worker logs
docker compose down            # stop (volumes kept)
docker compose down -v         # stop + wipe data
docker compose up -d --build   # rebuild and restart
```

## Windows notes

- Install Docker Desktop with the WSL2 backend.
- Use PowerShell or Git Bash — no path changes needed.
- All containers run Linux; no WSL distributions required.

See also: [Installation](installation.md), [Environment variables](environment-variables.md).
