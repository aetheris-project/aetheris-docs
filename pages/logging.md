# Logging

Where to find logs for each service.

## Docker deployments

```bash
docker compose logs web          # Next.js web app
docker compose logs backend      # Python backend
docker compose logs worker       # BullMQ workers
docker compose logs -f web       # follow mode
docker compose logs --tail 100   # last 100 lines
```

## Systemd (Linux)

```bash
journalctl -u aetheris-web -f            # web app
journalctl -u aetheris-backend -f        # backend
journalctl -u aetheris-worker -f         # workers
journalctl -u aetheris-web --since 1h    # last hour
```

## Python backend (standalone)

Logs go to stdout. Run with `--reload` in development for auto-restart on changes.

## Log levels

| Level | When |
| --- | --- |
| `INFO` | Normal operations — requests, provisioning |
| `WARNING` | Recoverable issues — retryable job failures |
| `ERROR` | Unrecoverable — database down, key rotation |

## Health check

```bash
curl -sS http://127.0.0.1:8000/health
# {"status":"ok","version":"1.0.0"}
```

See also: [Monitoring](monitoring.md), [Troubleshooting](troubleshooting.md).
