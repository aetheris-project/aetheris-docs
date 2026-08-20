# Docker installation

The entire Aetheris stack runs in Docker on Linux, macOS and Windows. This is the recommended path — no native tools needed.

## Prerequisites

- Docker Engine 24+ (Linux) or Docker Desktop (Windows / macOS).
- At least 4 GB RAM allocated to Docker.

## Start the stack

```bash
git clone https://github.com/aetheris-project/aetheris-app.git
cd aetheris-app
cp .env.example .env
AETHERIS_SECRET=$(openssl rand -hex 32)
docker compose up -d --build
```

## Services

| Container | Port | Description |
| --- | --- | --- |
| `aetheris-web` | 3000 | Next.js web app |
| `aetheris-backend` | 8000 | Python FastAPI |
| `aetheris-worker` | — | BullMQ background jobs |
| `aetheris-db` | 5432 | PostgreSQL 16 |
| `aetheris-redis` | 6379 | Redis 7 |

## Verify

```bash
docker compose ps
curl -sS -o /dev/null -w '%{http_code}\n' http://localhost:3000/login
curl -sS http://localhost:8000/health
```

## Common commands

```bash
docker compose logs -f web       # follow web logs
docker compose logs -f worker    # follow worker logs
docker compose down              # stop (volumes kept)
docker compose down -v           # stop + wipe data
docker compose up -d --build     # rebuild and restart
```

## Windows notes

- Install Docker Desktop with WSL2 backend.
- Use PowerShell or Git Bash — no path changes needed.
- All containers run Linux internally.

## Behind a reverse proxy

Proxy `http://127.0.0.1:3000`. Include WebSocket headers for the VNC console:

```nginx
proxy_set_header Upgrade $http_upgrade;
proxy_set_header Connection "upgrade";
proxy_read_timeout 600s;
```

See also: [Reverse proxy](reverse-proxy.md), [Docker reference](docker.md).
