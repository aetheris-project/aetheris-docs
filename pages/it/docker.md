# Deploy con Docker

L'intero stack Aetheris funziona in Docker su Linux, macOS e Windows. Il percorso consigliato — senza strumenti nativi.

## Prerequisiti

- Docker Engine 24+ (Linux) o Docker Desktop (Windows / macOS).
- Almeno 4 GB RAM allocati a Docker.

## Avvia il stack

```bash
git clone https://github.com/aetheris-project/aetheris-app.git
cd aetheris-app
cp .env.example .env
AETHERIS_SECRET=$(openssl rand -hex 32)
docker compose up -d --build
```

## Servizi

| Container | Porta | Descrizione |
| --- | --- | --- |
| `aetheris-web` | 3000 | App web Next.js |
| `aetheris-backend` | 8000 | Python FastAPI |
| `aetheris-worker` | — | Job BullMQ |
| `aetheris-db` | 5432 | PostgreSQL 16 |
| `aetheris-redis` | 6379 | Redis 7 |

## Verifica

```bash
docker compose ps
curl -sS -o /dev/null -w '%{http_code}\n' http://localhost:3000/login
curl -sS http://localhost:8000/health
```

## Comandi comuni

```bash
docker compose logs -f web       # log web
docker compose logs -f worker    # log worker
docker compose down              # ferma (volumi conservati)
docker compose down -v           # ferma + cancella dati
docker compose up -d --build     # ricostruisci e riavvia
```

Vedi anche: [Reverse proxy](reverse-proxy.md), [Installazione](installation.md).
