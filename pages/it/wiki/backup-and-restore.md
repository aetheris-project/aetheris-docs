# Backup e restore

Questa pagina è il riferimento operativo per proteggere la tua installazione
Aetheris. Copre cosa fare il backup, come pianificarlo e i passi esatti per il
ripristino dopo un guasto.

## Cosa includere nel backup

| Dato | Dove vive | Necessario per il restore |
| --- | --- | --- |
| Database PostgreSQL | Volume dati PostgreSQL | Sì - tutti i dati di business |
| Credenziali crittografate | Dentro PostgreSQL | Sì (fa parte del database) |
| Redis | Directory dati Redis (AOF) | No per il restore, sì per un billing a perdita zero |
| Stato applicazione | Clone `aetheris-app` + `.env` | Sì - conserva il file `.env` |
| Upload / allegati | Volume dati app | Dipende dall'installazione |

L'elemento più importante è il database PostgreSQL: contiene account, nodi,
server, fatture, l'audit log e le credenziali crittografate. Un restore
completo della piattaforma è: database + `.env` + sorgente dell'applicazione.

## Backup di PostgreSQL

### Dump live con docker compose

```bash
docker compose exec -T postgres pg_dump \
  --username=aetheris \
  --dbname=aetheris \
  --format=custom \
  > aetheris-$(date +%F).dump
```

- `--format=custom` dà dump compressi e selezionabili al momento del restore.
- Usa sempre `-T` (niente TTY) quando esegui da uno script.
- Conserva il dump fuori dall'host (S3, un'altra macchina, un NAS) e
  crittografalo se esce dalla tua rete.

### Esempio di cron automatizzato

```bash
#!/usr/bin/env bash
set -euo pipefail

BACKUP_DIR="/var/backups/aetheris"
STAMP=$(date +%F-%H%M)
KEEP=14

mkdir -p "$BACKUP_DIR"
docker compose -f /opt/aetheris/docker-compose.yml exec -T postgres \
  pg_dump --username=aetheris --dbname=aetheris --format=custom \
  > "$BACKUP_DIR/aetheris-$STAMP.dump"

# Rotazione: conserva gli ultimi 14 dump
find "$BACKUP_DIR" -name 'aetheris-*.dump' -mtime +$KEEP -delete
```

Aggiungilo al crontab:

```cron
0 2 * * * /usr/local/bin/aetheris-backup.sh
```

### Point-in-time recovery (produzione)

Per le installazioni in produzione abilita l'archiviazione WAL di PostgreSQL o
usa un provider gestito con PITR (Neon, RDS, Cloud SQL). Questo ti permette di
ripristinare in qualsiasi momento, non solo all'ultimo dump pianificato.

## Backup di Redis

Redis contiene le code BullMQ e la cache whitelabel. Una coda persa significa
retry e job in flight persi; i worker di billing riprendono dal database al
ciclo successivo, quindi l'impatto è limitato. Per un funzionamento a perdita
zero:

1. Abilita la persistenza AOF in `redis.conf`:
   ```
   appendonly yes
   appendfsync everysec
   ```
2. Fai uno snapshot della directory dati insieme al backup PostgreSQL.
3. Aggiungi una replica Redis in una seconda availability zone se la
   disponibilità di Redis è critica per il business.

## Backup dell'ambiente

Il file `.env` nella directory dell'applicazione contiene i segreti di cui lo
stack ha bisogno per avviarsi (password del database, password Redis, chiave
master, chiavi dei gateway). Senza di esso un restore non può decrittografare
le credenziali né raggiungere i database.

```bash
cp /opt/aetheris/aetheris-app/.env /var/backups/aetheris/.env
```

Conservalo anche nel tuo secret manager, così una perdita totale dell'host è
recuperabile.

## Runbook di restore

### Restore completo su un nuovo host

1. Installa i prerequisiti (vedi [Installazione](installation.md)).
2. Clona l'applicazione e ripristina il file `.env`:
   ```bash
   git clone https://github.com/aetheris-project/aetheris-app.git
   cp /path/to/backup/.env aetheris-app/.env
   ```
3. Avvia prima i container PostgreSQL e Redis e attendi che siano pronti.
4. Ripristina il database:
   ```bash
   docker compose exec -T postgres pg_restore \
     --username=aetheris \
     --dbname=aetheris \
     --clean \
     --if-exists \
     < aetheris-2026-08-20.dump
   ```
5. Avvia il resto dello stack:
   ```bash
   docker compose up -d
   ```
6. Verifica: accedi al pannello admin, controlla l'elenco dei nodi, esegui un
   provisioning di prova e conferma che l'audit log contenga voci recenti.

### Restore su un'installazione esistente

Se lo stack è già in esecuzione, ripristina prima il database (ferma web, API
e workers così niente scrive durante il restore), poi riavviali:

```bash
docker compose stop web api worker
docker compose exec -T postgres pg_restore --username=aetheris --dbname=aetheris --clean --if-exists < aetheris-2026-08-20.dump
docker compose start
```

## Piano di test del disaster recovery

Un backup mai ripristinato non è un backup. Esegui questo test ogni trimestre:

1. Avvia un host di prova con lo stesso OS e gli stessi prerequisiti.
2. Segui il runbook di restore completo qui sopra.
3. Verifica: login admin, connettività dei nodi, generazione di una fattura,
   una consegna webhook.
4. Smantella l'host di prova.

Misura la durata e conserva il risultato nel tuo runbook; l'obiettivo è un
restore in meno di un'ora per un'installazione su host singolo.
