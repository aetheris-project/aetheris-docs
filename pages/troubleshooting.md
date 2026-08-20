# Troubleshooting

Common problems, symptoms and fixes.

## Diagnosis flow

1. `docker compose ps` — are all services `Up`?
2. `curl http://localhost:8000/health` — backend healthy?
3. `docker compose logs --tail=200` — check for errors.
4. `docker compose exec redis redis-cli ping` — Redis alive?
5. `docker compose exec postgres pg_isready` — Database reachable?

## Quick fixes

| Symptom | Fix |
| --- | --- |
| Web fails to start | Check `.env` — exact variable in error message |
| `docker compose up` fails on Windows | Enable WSL2 backend in Docker Desktop |
| Migrations don't run | `docker compose logs web` — entrypoint runs them on boot |
| Provisioning jobs stuck | Worker logs — usually 401 from rotated Pterodactyl key |
| Console shows no frames | Reverse proxy must forward `Upgrade` + `Connection: upgrade` |
| Backend returns 422 | Email uses reserved TLD (`.local`, `.test`) |
| Redis connection refused | Set `REDIS_URL` to host address if in container |
| Port already in use | Change port in `.env` or stop the other service |

## Detailed guides

- [Troubleshooting services](troubleshooting-services.md) — crash loops, env errors, migrations
- [Troubleshooting networking](troubleshooting-networking.md) — proxy, WebSocket, TLS issues

See also: [Logging](logging.md), [Monitoring](monitoring.md).
