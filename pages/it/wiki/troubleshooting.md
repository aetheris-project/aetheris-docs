# Risoluzione dei problemi

Questa pagina raccoglie i problemi più comuni, i loro sintomi e i comandi
esatti per diagnosticarli e risolverli. Inizia dal flusso qui sotto, poi vai
alla sezione che corrisponde al tuo sintomo.

## Flusso di diagnosi

1. Controlla il tier web: `docker compose ps` - tutti i servizi sono `Up`?
2. Controlla l'API: `curl http://localhost:8000/health/ready`.
3. Controlla i log: `docker compose logs -f --tail=200 api worker`.
4. Controlla Redis: `docker compose exec redis redis-cli ping` (attesa `PONG`).
5. Controlla il database: `docker compose exec postgres pg_isready`.

## I servizi riavviano o vanno in crash-loop

**Sintomo**: `docker compose ps` mostra `Restarting` per un servizio.

**Diagnosi**:

```bash
docker compose logs --tail=100 <servizio>
```

**Cause comuni**:

| Causa | Fix |
| --- | --- |
| Variabile d'ambiente sbagliata | Confronta `.env` con `.env.example` |
| Database irraggiungibile | Controlla host/porta di `DATABASE_URL` e `pg_isready` |
| Password Redis non corrispondente | Controlla che `REDIS_URL` corrisponda a `redis.conf` |
| Memoria esaurita | `docker stats`; aggiungi swap o alza il limite del container |
| Porta già in uso | `ss -ltnp`; cambia la porta in `.env` |

## Il portale carica ma le chiamate API falliscono

**Sintomo**: l'interfaccia si renderizza ma ogni pannello mostra uno stato di
errore.

**Diagnosi**:

```bash
docker compose logs --tail=50 api
curl -s http://localhost:8000/health/ready
```

**Fix**:

- Se `/health/ready` restituisce `503`: PostgreSQL o Redis è giù; avvialo e
  attendi la prontezza.
- Se la console del browser mostra errori CORS: la web app chiama l'API da
  un'origine diversa; imposta l'URL pubblico corretto in `.env`.
- Se le richieste si bloccano: l'API è sovraccarica; controlla profondità
  delle code e CPU.

## Il provisioning non completa mai

**Sintomo**: un server resta in stato `provisioning`.

**Diagnosi**:

```bash
docker compose logs --tail=100 worker
```

Controlla nel log del worker il job di provisioning e la sua chiave di
idempotenza. Cause comuni:

| Causa | Fix |
| --- | --- |
| Token dell'hypervisor scaduto | Rigenera il token nel pannello / provider |
| Il worker non raggiunge l'hypervisor | Firewall, DNS, VPN |
| ID di nest/egg obsoleti | Risincronizza nest ed egg dal driver |
| Pool di allocazioni esaurito | Aggiungi allocazioni al nodo nel pannello admin |
| Loop di retry della coda | Correggi l'errore sottostante; i job ritentano con backoff |

## I job di billing non girano

**Sintomo**: le fatture non vengono generate secondo pianificazione.

**Diagnosi**:

```bash
docker compose logs --tail=100 worker
docker compose exec redis redis-cli LLEN bull:billing
```

- Coda vuota senza attività del worker: il worker è giù o lo schedule non è
  stato registrato; riavvia il worker.
- Coda in crescita: il worker è bloccato su un job; trovalo nei log e correggi
  o rimuovi il job avvelenato.

## Il login fallisce anche con credenziali corrette

1. Conferma che l'account esista: controlla la tabella `users` via psql.
2. Conferma che l'audit log registri il tentativo e il motivo del fallimento.
3. Reimposta la password dal pannello admin; non modificare l'hash a mano.
4. Se è scattato il rate limiting (troppi tentativi), attendi la scadenza
   della finestra o pulisci la chiave Redis per quell'account.

## Redis: `maxmemory` raggiunta

**Sintomo**: le scritture iniziano a fallire con `OOM command not allowed when
used memory > maxmemory`.

```bash
docker compose exec redis redis-cli INFO memory
docker compose exec redis redis-cli --bigkeys
```

- Riduci i TTL sulle chiavi di cache (`CONFIG GET maxmemory-policy`, usa
  `allkeys-lru`).
- Scala la memoria di Redis. Vedi [Monitoraggio](monitoring.md) per le regole
  di capacità.

## PostgreSQL: disco pieno

**Sintomo**: le scritture falliscono, `pg_isready` riesce ma le query vanno in
timeout.

```bash
df -h
docker compose exec postgres du -sh /var/lib/postgresql/data
```

- Rimuovi backup e segmenti WAL vecchi.
- Esegui `VACUUM FULL` dopo eliminazioni grandi (pianificato, non nel picco).
- Sposta la directory dati su un volume più grande; vedi
  [Backup e restore](backup-and-restore.md).

## Webhook non consegnati

1. Controlla la coda dei webhook: `docker compose exec redis redis-cli LLEN bull:webhooks`.
2. Controlla nel log del worker il tentativo di consegna e lo stato HTTP.
3. Conferma che l'endpoint risponda entro il timeout e restituisca 2xx.
4. Conferma che il segreto HMAC corrisponda su entrambi i lati; ogni
   consegna è firmata.

## Problemi con l'installer Windows

Vedi la pagina dedicata [Installer](installer.md) per i codici di uscita, i
flag silent e il comportamento di disinstallazione. Casi comuni:

- `docker.exe was not found on PATH`: installa o avvia Docker Desktop, poi
  riesegui con `--software`.
- Il TUI non mostra i colori: esegui in un terminale che supporta ANSI o usa
  il fallback plain-text.
- L'installer esce con 1 e uno step `dependency:` fallito: riesegui
  manualmente l'install winget fallito e riprova.

## Ancora bloccato?

Raccogli queste informazioni prima di aprire un issue su
`aetheris-project/aetheris-app`:

1. Output di `docker compose ps` e `docker compose logs --tail=100`.
2. Il messaggio di errore esatto e lo step che lo ha prodotto.
3. Le versioni: `docker compose version`, versione della piattaforma dal
   footer admin e l'OS.

Per supporto commerciale o tempi di risposta garantiti, contatta
**hello@another-horizon.eu** con le informazioni sopra già allegate.
