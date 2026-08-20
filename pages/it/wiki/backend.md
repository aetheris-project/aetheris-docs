# Backend Python

Il control plane include un'API REST Python autonoma in `aetheris-app/backend`.
Fornisce autenticazione, gestione nodi, provisioning server, billing e temi
whitelabel su un database SQLite a configurazione zero, quindi sviluppo e demo
funzionano senza PostgreSQL o Redis.

## Avvio rapido

```bash
cd aetheris-app/backend
python -m venv .venv

# Windows
.venv\Scripts\activate
# Linux / macOS
source .venv/bin/activate

pip install -r requirements.txt
python run.py --port 8000 --reload
```

Al primo avvio crea `aetheris.db` e lo popola con un utente admin, quattro nodi,
quattro piani, server demo e fatture.

Credenziali admin predefinite (da cambiare in produzione):

```text
email:    admin@example.com
password: admin-aetheris-2026
```

Documentazione API interattiva: <http://127.0.0.1:8000/docs>

## Configurazione

| Variabile | Default | Scopo |
| --- | --- | --- |
| `AETHERIS_BACKEND_DB` | `backend/aetheris.db` | Percorso database SQLite |
| `AETHERIS_SECRET` | valore solo-dev | Segreto firma token HMAC |
| `AETHERIS_TOKEN_TTL` | `86400` | Durata token in secondi |
| `AETHERIS_CORS_ORIGINS` | `*` | Origini CORS separate da virgola |
| `ADMIN_EMAIL` | `admin@example.com` | Email superadmin del seed |
| `ADMIN_PASSWORD` | `admin-aetheris-2026` | Password superadmin del seed |

## Panoramica API

| Metodo | Percorso | Auth | Descrizione |
| --- | --- | --- | --- |
| GET | `/health` | - | Salute del servizio |
| POST | `/api/auth/login` | - | Login, restituisce bearer token |
| GET | `/api/auth/me` | user | Utente corrente |
| GET | `/api/auth/users` | admin | Elenco utenti |
| GET | `/api/nodes` | user | Elenco nodi |
| POST | `/api/nodes` | admin | Crea nodo |
| GET | `/api/nodes/{id}/telemetry` | user | Telemetria nodo |
| GET | `/api/servers` | user | Elenco server |
| GET | `/api/servers/plans` | user | Elenco piani |
| POST | `/api/servers` | admin | Provisioning server |
| POST | `/api/servers/{id}/power` | user | start / stop / restart |
| DELETE | `/api/servers/{id}` | admin | Termina server |
| GET | `/api/billing/summary` | user | Riepilogo billing |
| GET | `/api/billing/invoices` | user | Elenco fatture |
| POST | `/api/billing/invoices/{id}/pay` | user | Paga fattura |
| GET | `/api/theme` | - | Tema whitelabel corrente |
| PUT | `/api/theme` | admin | Aggiorna tema whitelabel |
| GET | `/api/system/status` | - | Versione, ultima release, disponibilità aggiornamenti |
| GET | `/api/system/cron` | user | Elenca i job schedulati |
| POST | `/api/system/cron` | admin | Crea un job cron |
| PATCH | `/api/system/cron/{id}` | admin | Aggiorna un job cron |
| DELETE | `/api/system/cron/{id}` | admin | Elimina un job cron |
| POST | `/api/system/cron/{id}/run` | admin | Esegue un job manualmente |
| GET | `/api/system/sftp` | user | Elenca gli utenti SFTP |
| POST | `/api/system/sftp` | admin | Crea un utente SFTP |
| PATCH | `/api/system/sftp/{id}` | admin | Aggiorna un utente SFTP |
| DELETE | `/api/system/sftp/{id}` | admin | Elimina un utente SFTP |

## Autenticazione

Le password sono hashate con scrypt (salt per utente, confronto a tempo
costante). Il login restituisce un bearer token firmato HMAC che scade dopo
`AETHERIS_TOKEN_TTL` secondi:

```bash
curl -sS http://127.0.0.1:8000/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"admin@example.com","password":"admin-aetheris-2026"}'
```

Usa il token restituito su ogni chiamata autenticata:

```bash
curl -sS http://127.0.0.1:8000/api/nodes \
  -H "Authorization: Bearer $TOKEN"
```

## Esempio: provisioning di un server

```bash
# Scegli un piano e un nodo
PLAN=$(curl -sS http://127.0.0.1:8000/api/servers/plans | python -c "import sys,json;print(json.load(sys.stdin)[0]['id'])")
NODE=$(curl -sS http://127.0.0.1:8000/api/nodes -H "Authorization: Bearer $TOKEN" | python -c "import sys,json;print(json.load(sys.stdin)[0]['id'])")

curl -sS http://127.0.0.1:8000/api/servers \
  -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d "{\"plan_id\":$PLAN,\"node_id\":$NODE,\"template\":\"Node.js\"}"
```

## Test

```bash
pip install -r requirements-dev.txt
pytest -q
```

La suite gira su un database temporaneo isolato e copre auth, gestione nodi,
provisioning, azioni power, billing e aggiornamenti tema.

## Note di produzione

## Endpoint di sistema (status, cron, SFTP)

### Stato piattaforma e controllo aggiornamenti

```bash
curl -sS http://127.0.0.1:8000/api/system/status
```

```json
{
  "version": "1.0.0",
  "latest_release": {
    "tag": "v1.1.0",
    "url": "https://github.com/aetheris-project/aetheris-app/releases/tag/v1.1.0",
    "published_at": "2026-08-15T10:00:00Z"
  },
  "update_available": true,
  "environment": "development",
  "healthy": true
}
```

L'endpoint risolve l'ultima release GitHub (in cache, non fallisce mai per
problemi di rete) e la confronta con la versione in esecuzione, così la
pagina Status dell'admin può mostrare un banner di upgrade senza
infrastruttura aggiuntiva.

### Job schedulati (cron)

```bash
# Elenca i job
curl -sS http://127.0.0.1:8000/api/system/cron -H "Authorization: Bearer $TOKEN"

# Crea un job di backup notturno
curl -sS http://127.0.0.1:8000/api/system/cron -X POST \
  -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' \
  -d '{"name":"Nightly backups","schedule":"0 3 * * *","task":"backup","enabled":true}'

# Esegui un job subito (esecuzione manuale)
curl -sS http://127.0.0.1:8000/api/system/cron/1/run -X POST \
  -H "Authorization: Bearer $TOKEN"
```

Valori `task` supportati: `backup`, `invoice.dunning`, `snapshot.prune`,
`sync.pterodactyl`, `sync.proxmox`, `sync.virtfusion`, `report.daily`.
Il campo `schedule` è un'espressione cron standard a cinque campi.

### Utenti SFTP

```bash
# Elenca gli utenti (con il nome del server)
curl -sS http://127.0.0.1:8000/api/system/sftp -H "Authorization: Bearer $TOKEN"

# Crea un account di accesso file sul server 1
curl -sS http://127.0.0.1:8000/api/system/sftp -X POST \
  -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' \
  -d '{"server_id":1,"username":"webuser","home_path":"/home/container","enabled":true}'
```

Gli username devono iniziare con una lettera minuscola e contenere solo
lettere minuscole, cifre e underscore. La coppia `(server_id, username)` è
univoca.

## Note di produzione

- Imposta un `AETHERIS_SECRET` forte (es. `openssl rand -hex 32`).
- Esegui con un supervisor di processo (systemd / launchd / Task Scheduler);
  l'installer automatico genera le unità per te - vedi `installer.md`.
- Sostituisci il database SQLite con PostgreSQL per deployment
  multi-istanza; il livello API è storage-agnostico.
