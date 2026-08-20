# Logging

Dove trovare i log di ogni servizio.

## Deploy Docker

```bash
docker compose logs web          # Next.js
docker compose logs backend      # Python backend
docker compose logs worker       # BullMQ workers
docker compose logs -f web       # follow mode
docker compose logs --tail 100   # ultime 100 righe
```

## Systemd (Linux)

```bash
journalctl -u aetheris-web -f
journalctl -u aetheris-backend -f
journalctl -u aetheris-worker -f
journalctl -u aetheris-web --since 1h
```

## Health check

```bash
curl -sS http://127.0.0.1:8000/health
# {"status":"ok","version":"1.0.0"}
```

Vedi anche: [Monitoraggio](monitoring.md), [Troubleshooting](troubleshooting.md).
