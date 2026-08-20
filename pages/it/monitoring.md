# Monitoraggio

Endpoint di health, posizioni log, metriche e pattern di alerting.

## Health check

```bash
# Backend
curl -sS http://127.0.0.1:8000/health

# Web
curl -sS -o /dev/null -w '%{http_code}\n' http://127.0.0.1:3000/login

# Redis
redis-cli ping   # PONG

# PostgreSQL
pg_isready       # accepting connections
```

## Log

```bash
# Docker
docker compose logs -f web
docker compose logs -f backend
docker compose logs -f worker

# Systemd
journalctl -u aetheris-web -f
journalctl -u aetheris-backend -f
```

## Metriche

| Metrica | Fonte |
| --- | --- |
| Uptime servizi | Health endpoint |
| Code BullMQ | `redis-cli llen bull:*:wait` |
| Errori provisioning | Log worker |
| Fatture in sospeso | `GET /api/billing/invoices?status=overdue` |

## Alert suggeriti

| Alert | Soglia |
| --- | --- |
| Web app giù | Health check fallisce 3 volte |
| Code accumulate | `wait` > 100 per 5 minuti |
| Fatture scadute | > 0 per 24 ore |
| Disco pieno | > 85% usage |

Vedi anche: [Logging](logging.md), [Troubleshooting](troubleshooting.md).
