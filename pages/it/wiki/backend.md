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

- Imposta un `AETHERIS_SECRET` forte (es. `openssl rand -hex 32`).
- Esegui con un supervisor di processo (systemd / launchd / Task Scheduler);
  l'installer automatico genera le unità per te - vedi `installer.md`.
- Sostituisci il database SQLite con PostgreSQL per deployment
  multi-istanza; il livello API è storage-agnostico.
