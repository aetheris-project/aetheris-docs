# Troubleshooting — Services

Crash loops, environment errors and migration failures.

## Services restart or crash-loop

```bash
docker compose logs --tail=100 <service>
```

| Cause | Fix |
| --- | --- |
| Wrong env variable | Compare `.env` with `.env.example` |
| Database not reachable | Check `DATABASE_URL` host/port and `pg_isready` |
| Redis not reachable | Check `REDIS_URL` — default is `redis://redis:6379` in Docker |
| Port conflict | Change port in `.env` or stop the conflicting service |

## Migration failures

```bash
# Check migration status
docker compose exec web npx prisma migrate status

# Force apply pending migrations
docker compose exec web npx prisma migrate deploy
```

| Symptom | Fix |
| --- | --- |
| `P3009` migrate failed | Check `DATABASE_URL` user has `CREATE` rights |
| `P3010` migration too long | Reset: `npx prisma migrate reset` (dev only) |
| Deadlock | Restart PostgreSQL, retry |

## Backend won't start

```bash
# Check Python errors
docker compose logs backend --tail=50

# Test manually
docker compose exec backend python -c "from aetheris_backend.main import app; print('OK')"
```

Common: missing `AETHERIS_SECRET` or wrong `AETHERIS_BACKEND_DB` path.

## Worker not processing jobs

```bash
# Check BullMQ queues
docker compose exec redis redis-cli llen bull:provisioning:wait

# Check worker logs
docker compose logs worker --tail=100
```

Usually a 401 from a rotated hypervisor API key.

See also: [Logging](logging.md), [Troubleshooting networking](troubleshooting-networking.md).
