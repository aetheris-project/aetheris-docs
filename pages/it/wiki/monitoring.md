# Monitoraggio e operazioni

Questa pagina copre gli endpoint di health, le posizioni dei log, le metriche
e i pattern di alerting che ti servono per operare Aetheris in produzione.

## Endpoint di health

Il backend espone due endpoint che load balancer e monitor di uptime possono
usare:

| Endpoint | Significato |
| --- | --- |
| `GET /health` | Il processo è attivo. Restituisce `{"status":"ok"}` |
| `GET /health/ready` | Pronto a servire: verifica la connettività di PostgreSQL e Redis |

La web app serve il portale su `/`; monitorarla con una richiesta HEAD
conferma che il bordo è sano.

### Configurazione del readiness probe

```yaml
# snippet del servizio docker-compose
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:8000/health/ready"]
  interval: 30s
  timeout: 5s
  retries: 3
  start_period: 20s
```

## Log

### Docker compose

```bash
# Segui tutto
docker compose logs -f --tail=200

# Un singolo servizio
docker compose logs -f web
docker compose logs -f worker
docker compose logs -f api

# Da un timestamp
docker compose logs --since 1h api
```

### Struttura dei log

I log sono testo semplice con timestamp e livello. Il worker registra ogni job
con la sua chiave di idempotenza, così puoi tracciare un provisioning dalla
richiesta al completamento:

```text
2026-08-20 14:02:11 INFO  worker  provisioning job 8f3a1c start (key prov_ab12)
2026-08-20 14:02:12 INFO  worker  provisioning job 8f3a1c pterodactyl create ok
2026-08-20 14:02:14 INFO  worker  provisioning job 8f3a1c billing invoice issued #1042
2026-08-20 14:02:14 INFO  worker  provisioning job 8f3a1c complete
```

## Metriche

L'endpoint delle metriche (`/metrics`, formato testo Prometheus) espone:

- **HTTP**: tasso di richieste, istogramma della latenza, tasso di errore per
  rotta.
- **Workers**: profondità delle code, job elaborati, durata dei job, conteggi
  dei retry.
- **Billing**: fatture emesse, eventi di dunning, failure dei gateway.
- **Sistema**: event loop lag, connessioni aperte.

### Esempio di config di scrape Prometheus

```yaml
scrape_configs:
  - job_name: aetheris
    metrics_path: /metrics
    static_configs:
      - targets: ["api.internal:8000"]
```

### Pannelli Grafana suggeriti

| Pannello | Idea di query | Soglia di alert |
| --- | --- | --- |
| Tasso di errore API | `sum(rate(http_requests_total{status=~"5.."}[5m])) / sum(rate(http_requests_total[5m]))` | > 1% per 10m |
| Lag delle code | `max(aetheris_queue_depth)` | > 500 per 5m |
| Failure dei worker | `rate(aetheris_jobs_failed_total[15m])` | > 0 per 15m |
| Failure dei pagamenti | `rate(aetheris_gateway_failures_total[1h])` | > 5 in 1h |
| Disco sull'host | node exporter `node_filesystem_avail_bytes` | < 20% |

## Runbook di alerting

Fai l'alert sul fallimento della piattaforma, non su ogni riga di log. Inizia
con cinque alert:

1. **Istanza giù** - il probe HTTP su `/health/ready` fallisce per 2 minuti.
2. **Tasso di errore API** - 5xx sopra l'1% per 10 minuti.
3. **Lag delle code** - una qualsiasi coda BullMQ più profonda di 500 job per
   5 minuti.
4. **Worker morto** - nessun heartbeat per 10 minuti (i worker emettono una
   metrica di heartbeat ogni 30s).
5. **Backup fallito** - lo script di backup esce con codice non-zero (vedi
   [Backup e restore](backup-and-restore.md)).

Per ogni alert definisci: chi viene paginato, cosa controllare per primo (log,
profondità delle code, deploy recenti) e il passo di rollback.

## Monitoraggio uptime

Punta un servizio di uptime esterno su:

- `https://panel.example.com/` (portale raggiungibile)
- `https://panel.example.com/api/health/ready` (API + DB + Redis)

## Capacity planning

| Segnale | Controlla quando |
| --- | --- |
| API p95 > 250ms | Scala le repliche API |
| La profondità delle code cresce più di quanto si svuota | Scala i worker |
| CPU PostgreSQL sostenuta > 70% | Aggiungi indici, poi un tier più grande |
| Memoria Redis > 70% di maxmemory | Ottimizza i TTL, poi aggiungi memoria |

Vedi [Architettura](architecture.md) per la topologia di scaling e
[Troubleshooting](troubleshooting.md) per le firme di failure comuni.
