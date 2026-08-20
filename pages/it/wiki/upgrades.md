# Aggiornamenti

Questa pagina documenta il percorso di upgrade supportato, cosa cambia tra le
release e come eseguire il rollback in sicurezza.

## Modello di release

Aetheris segue il versionamento semantico:

- **Minor** (x.y.0): nuove funzionalità, modifiche non breaking.
- **Patch** (x.y.z): bug fix e aggiornamenti di sicurezza.
- **Major** (x.0.0): modifiche breaking, con passi di migrazione documentati.

Aggiorna una versione minor alla volta. Saltare più versioni insieme è
supportato solo se le release note lo dicono esplicitamente.

## Prima dell'upgrade

1. **Backup** (obbligatorio): vedi [Backup e restore](backup-and-restore.md).
   Come minimo fai un dump fresco di PostgreSQL e una copia di `.env`.
2. **Leggi le release note** di ogni versione tra la tua e l'obiettivo.
3. **Controlla il changelog per le migrazioni**: se una release porta
   migrazioni del database, partono automaticamente all'avvio ma richiedono
   un database scrivibile e abbastanza spazio su disco.
4. **Pianifica una finestra di manutenzione** se l'upgrade riavvia i servizi o
   esegue migrazioni lunghe.

## Procedura di upgrade (Docker)

Il percorso consigliato usa le immagini con tag:

```bash
cd /opt/aetheris

# 1. Scarica le nuove immagini
docker compose pull

# 2. Backup prima di toccare qualsiasi cosa (già fatto sopra, ripeti per sicurezza)
docker compose exec -T postgres pg_dump --username=aetheris --dbname=aetheris --format=custom > pre-upgrade.dump

# 3. Ricrea i container con le nuove immagini
docker compose up -d

# 4. Attendi la prontezza e verifica
curl -fsS http://localhost:8000/health/ready
docker compose ps
```

## Procedura di upgrade (bare metal)

1. Ferma i servizi: `sudo systemctl stop aetheris-api aetheris-worker aetheris-web`.
2. Scarica il nuovo codice dell'applicazione:
   ```bash
   cd /opt/aetheris/aetheris-app
   git pull --ff-only
   npm ci --omit=dev && npm run build
   pip install -r backend/requirements.txt
   ```
3. Esegui le eventuali migrazioni del database.
4. Avvia i servizi: `sudo systemctl start aetheris-api aetheris-worker aetheris-web`.
5. Verifica con gli endpoint di health.

## Verifica di un upgrade

Esegui questa checklist dopo ogni upgrade:

```bash
# API sana e DB raggiungibile
curl -fsS http://localhost:8000/health/ready

# Il portale serve
curl -fsSI https://panel.example.com/ | head -1

# I worker elaborano job
docker compose logs --tail=50 worker

# Un provisioning funziona ancora (crea un server di prova, poi eliminalo)
```

Controlla anche il pannello admin: elenco nodi, elenco piani e una
generazione di fattura.

## Rollback

Rollback = riportare le immagini precedenti + ripristinare il dump
pre-upgrade.

```bash
# 1. Ripunta al tag immagine precedente
#    (modifica i tag immagine in docker-compose.yml / .env alla versione precedente)

# 2. Ripristina il dump del database pre-upgrade
docker compose stop web api worker
docker compose exec -T postgres pg_restore --username=aetheris --dbname=aetheris --clean --if-exists < pre-upgrade.dump
docker compose start

# 3. Verifica
curl -fsS http://localhost:8000/health/ready
```

Se durante l'upgrade sono partite migrazioni, ripristinare il dump pre-upgrade
è obbligatorio prima di avviare la versione precedente: non eseguire mai uno
schema più nuovo su un'applicazione più vecchia.

## Aggiornare l'installer Windows

Il pacchetto winget gestisce i propri aggiornamenti. Per aggiornare
l'installer installato:

```powershell
winget upgrade AetherisProject.AetherisWindowsInstaller
```

Per aggiornare lo stack Aetheris dopo una nuova release:

```powershell
aetheris-windows-installer --software
```

## Rimanere informati

- Release note: GitHub Releases su `aetheris-project/aetheris-app`.
- Modifiche breaking: elencate sempre in cima alle release note.
- Iscriviti al repository per le notifiche sui nuovi tag.
