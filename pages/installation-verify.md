# Verification checklist

Confirm every service is running after deployment.

## Health checks

```bash
# Web responds
curl -sS -o /dev/null -w '%{http_code}\n' http://127.0.0.1:3000/login

# Python backend
curl -sS http://127.0.0.1:8000/health

# Workers processing queues (Linux)
sudo journalctl -u aetheris-worker -n 50 --no-pager

# Redis has BullMQ keys
redis-cli keys 'bull:*' | head
```

## Docker

```bash
docker compose ps   # all services healthy
```

## Common issues

| Symptom | Fix |
| --- | --- |
| Web fails to start | Check `.env` — the exact variable is in the error message |
| `docker compose up` fails on Windows | Enable WSL2 backend in Docker Desktop |
| Migrations don't run | Check `docker compose logs web` |
| Provisioning jobs stuck | Worker logs — usually a 401 from a rotated Pterodactyl key |
| Console shows no frames | Reverse proxy must forward `Upgrade` and `Connection: upgrade` |
| Backend returns 422 | Email uses a reserved TLD (`.local`, `.test`) |
| Redis connection refused | Set `REDIS_URL` to the host address if running in a container |

See also: [Troubleshooting](troubleshooting.md), [Installation](installation.md).
