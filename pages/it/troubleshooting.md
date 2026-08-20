# Troubleshooting

Problemi comuni, sintomi e soluzioni.

## Flow di diagnosi

1. `docker compose ps` — tutti i servizi sono `Up`?
2. `curl http://localhost:8000/health` — backend healthy?
3. `docker compose logs --tail=200` — controlla errori.
4. `docker compose exec redis redis-cli ping` — Redis vivo?
5. `docker compose exec postgres pg_isready` — Database raggiungibile?

## Fix rapidi

| Sintomo | Fix |
| --- | --- |
| Web non parte | Controlla `.env` — variabile esatta nel messaggio di errore |
| `docker compose up` fallisce su Windows | Abilita backend WSL2 in Docker Desktop |
| Migrations non partono | `docker compose logs web` — entrypoint le esegue al boot |
| Job provisioning bloccati | Log worker — solitamente 401 da key Pterodactyl ruotata |
| Console senza frame | Reverse proxy deve inoltrare `Upgrade` + `Connection: upgrade` |
| Backend restituisce 422 | Email usa TLD riservato (`.local`, `.test`) |
| Redis connection refused | Imposta `REDIS_URL` all'indirizzo host se in container |

Vedi anche: [Logging](logging.md), [Monitoraggio](monitoring.md).
