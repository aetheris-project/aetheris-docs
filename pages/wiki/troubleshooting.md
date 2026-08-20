# Troubleshooting

This page collects the most common problems, their symptoms, and the exact
commands to diagnose and fix them. Start with the flow below, then jump to
the section that matches your symptom.

## Diagnosis flow

1. Check the web tier: `docker compose ps` - are all services `Up`?
2. Check the API: `curl http://localhost:8000/health/ready`.
3. Check the logs: `docker compose logs -f --tail=200 api worker`.
4. Check Redis: `docker compose exec redis redis-cli ping` (expect `PONG`).
5. Check the database: `docker compose exec postgres pg_isready`.

## Services restart or crash-loop

**Symptom**: `docker compose ps` shows `Restarting` for one service.

**Diagnose**:

```bash
docker compose logs --tail=100 <service>
```

**Common causes**:

| Cause | Fix |
| --- | --- |
| Wrong environment variable | Compare `.env` with `.env.example` |
| Database not reachable | Check `DATABASE_URL` host/port and `pg_isready` |
| Redis password mismatch | Check `REDIS_URL` matches `redis.conf` |
| Out of memory | `docker stats`; add swap or raise the container limit |
| Port already in use | `ss -ltnp`; change the port in `.env` |

## Portal loads but API calls fail

**Symptom**: the UI renders but every panel shows an error state.

**Diagnose**:

```bash
docker compose logs --tail=50 api
curl -s http://localhost:8000/health/ready
```

**Fixes**:

- If `/health/ready` returns `503`: PostgreSQL or Redis is down; start it
  and wait for readiness.
- If the browser console shows CORS errors: the web app calls the API from
  a different origin; set the correct public URL in `.env`.
- If requests hang: the API is overwhelmed; check queue depth and CPU.

## Provisioning never completes

**Symptom**: a server stays in `provisioning` state.

**Diagnose**:

```bash
docker compose logs --tail=100 worker
```

Check the worker log for the provisioning job and its idempotency key.
Common causes:

| Cause | Fix |
| --- | --- |
| Hypervisor token expired | Regenerate the token in the panel / provider |
| Worker cannot reach the hypervisor | Firewall, DNS, VPN |
| Nest/egg IDs are stale | Re-sync nests and eggs from the driver |
| Allocation pool exhausted | Add allocations to the node in the admin panel |
| Queue retry loop | Fix the underlying error; jobs retry with backoff |

## Billing jobs do not run

**Symptom**: invoices are not generated on schedule.

**Diagnose**:

```bash
docker compose logs --tail=100 worker
docker compose exec redis redis-cli LLEN bull:billing
```

- Empty queue with no worker activity: the worker is down or the schedule
  was not registered; restart the worker.
- Queue growing: the worker is stuck on one job; find it in the logs and
  fix or remove the poison job.

## Login fails even with correct credentials

1. Confirm the account exists: check the `users` table via psql.
2. Confirm the audit log records the attempt and the failure reason.
3. Reset the password through the admin panel; do not edit the hash by
   hand.
4. If rate limiting kicked in (too many attempts), wait for the window to
   expire or clear the Redis key for that account.

## Redis: `maxmemory` reached

**Symptom**: writes start failing with `OOM command not allowed when used
memory > maxmemory`.

```bash
docker compose exec redis redis-cli INFO memory
docker compose exec redis redis-cli --bigkeys
```

- Reduce TTLs on the cache keys (`CONFIG GET maxmemory-policy`, use
  `allkeys-lru`).
- Scale Redis memory. See [Monitoring](monitoring.md) for capacity rules.

## PostgreSQL: disk full

**Symptom**: writes fail, `pg_isready` succeeds but queries time out.

```bash
df -h
docker compose exec postgres du -sh /var/lib/postgresql/data
```

- Remove old backups and WAL segments.
- `VACUUM FULL` after large deletions (scheduled, not during peak).
- Move the data dir to a larger volume; see [Backup and restore](backup-and-restore.md).

## Webhooks not delivered

1. Check the webhook queue: `docker compose exec redis redis-cli LLEN bull:webhooks`.
2. Check the worker log for the delivery attempt and HTTP status.
3. Confirm the endpoint responds within the timeout and returns 2xx.
4. Confirm the HMAC secret matches on both sides; every delivery is signed.

## Windows installer problems

See the dedicated [Installer](installer.md) page for exit codes, silent
flags and the uninstall behavior. Common cases:

- `docker.exe was not found on PATH`: install or start Docker Desktop, then
  re-run with `--software`.
- The TUI does not render colors: run in a terminal that supports ANSI or
  use the plain-text fallback.
- The installer exits 1 with a `dependency:` step failed: re-run the failed
  winget install manually and retry.

## Still stuck?

Collect this information before opening an issue on
`aetheris-project/aetheris-app`:

1. `docker compose ps` and `docker compose logs --tail=100` output.
2. The exact error message and the step that produced it.
3. The versions: `docker compose version`, platform version from the admin
   footer, and the OS.

For commercial support or a guaranteed response time, contact
**hello@another-horizon.eu** with the information above already attached.
