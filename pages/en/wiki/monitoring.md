# Monitoring and operations

This page covers the health endpoints, log locations, metrics and alerting
patterns you need to operate Aetheris in production.

## Health endpoints

The backend exposes two endpoints that load balancers and uptime monitors
can use:

| Endpoint | Meaning |
| --- | --- |
| `GET /health` | Process is up. Returns `{"status":"ok"}` |
| `GET /health/ready` | Ready to serve: checks PostgreSQL and Redis connectivity |

The web app serves the portal at `/`; monitoring it with a HEAD request
confirms the edge is healthy.

### Readiness probe configuration

```yaml
# docker-compose service snippet
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:8000/health/ready"]
  interval: 30s
  timeout: 5s
  retries: 3
  start_period: 20s
```

## Logs

### Docker compose

```bash
# Follow everything
docker compose logs -f --tail=200

# A single service
docker compose logs -f web
docker compose logs -f worker
docker compose logs -f api

# Since a timestamp
docker compose logs --since 1h api
```

### Log structure

Logs are plain text with a timestamp and level. The worker logs every job
with its idempotency key, so you can trace a provisioning from request to
completion:

```text
2026-08-20 14:02:11 INFO  worker  provisioning job 8f3a1c start (key prov_ab12)
2026-08-20 14:02:12 INFO  worker  provisioning job 8f3a1c pterodactyl create ok
2026-08-20 14:02:14 INFO  worker  provisioning job 8f3a1c billing invoice issued #1042
2026-08-20 14:02:14 INFO  worker  provisioning job 8f3a1c complete
```

## Metrics

The metrics endpoint (`/metrics`, Prometheus text format) exposes:

- **HTTP**: request rate, latency histogram, error rate by route.
- **Workers**: queue depth, jobs processed, job duration, retry counts.
- **Billing**: invoices issued, dunning events, gateway failures.
- **System**: event loop lag, open connections.

### Example Prometheus scrape config

```yaml
scrape_configs:
  - job_name: aetheris
    metrics_path: /metrics
    static_configs:
      - targets: ["api.internal:8000"]
```

### Suggested Grafana dashboard panels

| Panel | Query idea | Alert threshold |
| --- | --- | --- |
| API error rate | `sum(rate(http_requests_total{status=~"5.."}[5m])) / sum(rate(http_requests_total[5m]))` | > 1% for 10m |
| Queue lag | `max(aetheris_queue_depth)` | > 500 for 5m |
| Worker failures | `rate(aetheris_jobs_failed_total[15m])` | > 0 for 15m |
| Payment failures | `rate(aetheris_gateway_failures_total[1h])` | > 5 in 1h |
| Disk on host | node exporter `node_filesystem_avail_bytes` | < 20% |

## Alerting runbook

Alert on the failure of the platform, not on every log line. Start with
five alerts:

1. **Instance down** - HTTP probe on `/health/ready` fails for 2 minutes.
2. **API error rate** - 5xx rate above 1% for 10 minutes.
3. **Queue lag** - any BullMQ queue deeper than 500 jobs for 5 minutes.
4. **Worker dead** - no heartbeat for 10 minutes (workers emit a heartbeat
   metric every 30s).
5. **Backup failed** - the backup script exits non-zero (see
   [Backup and restore](backup-and-restore.md)).

For each alert define: who pages, what to check first (logs, queue depth,
recent deploys) and the rollback step.

## Uptime monitoring

Point an external uptime service at:

- `https://panel.example.com/` (portal reachable)
- `https://panel.example.com/api/health/ready` (API + DB + Redis)

## Capacity planning

| Signal | Watch when |
| --- | --- |
| API p95 latency > 250ms | Scale API replicas |
| Queue depth grows faster than it drains | Scale workers |
| PostgreSQL CPU sustained > 70% | Add indexes, then a bigger tier |
| Redis memory > 70% of maxmemory | Tune TTLs, then add memory |

See [Architecture](architecture.md) for the scaling topology and
[Troubleshooting](troubleshooting.md) for common failure signatures.
