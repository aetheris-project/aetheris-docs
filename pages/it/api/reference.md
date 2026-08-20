# Riferimento API REST

Il control plane Aetheris espone un'API REST JSON. Questa pagina riassume gli
endpoint della piattaforma; il contratto machine-readable è la specifica
[OpenAPI 3.1 inclusa](../public/openapi.yaml).

## Convenzioni

- Base URL: `https://app.example.com/api`.
- Autenticazione: `Authorization: Bearer <session>` per gli endpoint della
  piattaforma; i webhook di pagamento usano le firme del provider.
- Content type: `application/json` su richieste e risposte.
- Errori: `{ "error": { "code": string, "message": string, "details"?: object } }`
  con i codici di stato HTTP appropriati.

## Endpoint

### Whitelabel

| Metodo | Percorso | Descrizione |
| --- | --- | --- |
| GET | `/whitelabel` | Configurazione whitelabel dinamica per il tenant (`?organization=<slug>`) |
| PUT | `/admin/whitelabel` | Aggiorna brand, tema, navigazione e toggle moduli |

### Server

| Metodo | Percorso | Descrizione |
| --- | --- | --- |
| GET | `/servers` | Elenca i server del chiamante |
| POST | `/servers` | Provisioning di un server (piano + selezione nodo) |
| GET | `/servers/{id}` | Dettaglio server con risorse e stato |
| DELETE | `/servers/{id}` | Termina il workload |
| POST | `/servers/{id}/power` | Body `{ "signal": "start" \| "stop" \| "restart" \| "kill" }` |
| GET | `/servers/{id}/telemetry` | Ultimo campione di telemetria |
| GET | `/servers/{id}/console` | Sessione console (URL WebSocket + token one-time) |
| GET | `/servers/{id}/backups` | Elenco backup |
| POST | `/servers/{id}/backups` | Crea un backup, body `{ "name": string }` |
| POST | `/servers/{id}/backups/{backupId}/restore` | Ripristina un backup |
| DELETE | `/servers/{id}/backups/{backupId}` | Elimina un backup |

### Billing

| Metodo | Percorso | Descrizione |
| --- | --- | --- |
| GET | `/billing/invoices` | Elenca le fatture del tenant |
| GET | `/billing/invoices/{id}` | Fattura con righe e pagamenti |
| POST | `/billing/invoices/{id}/pay` | Avvia un tentativo di pagamento |
| GET | `/billing/payment-methods` | Metodi di pagamento salvati |
| POST | `/billing/subscriptions` | Sottoscrivi un piano |

### Admin

| Metodo | Percorso | Descrizione |
| --- | --- | --- |
| GET | `/admin/nodes` | Elenco nodi con utilizzo |
| POST | `/admin/hypervisors` | Registra una credenziale hypervisor |
| POST | `/admin/hypervisors/{id}/sync` | Sincronizza nodi e egg dal backend |
| GET | `/admin/audit` | Stream del log audit |
| PUT | `/admin/settings` | Impostazioni a livello piattaforma |

### Sistema

| Metodo | Percorso | Descrizione |
| --- | --- | --- |
| GET | `/system/status` | Versione, ultima release GitHub e disponibilità aggiornamenti |
| GET | `/system/cron` | Elenca i job schedulati (cron) |
| POST | `/system/cron` | Crea un job schedulato |
| PATCH | `/system/cron/{id}` | Aggiorna un job schedulato |
| DELETE | `/system/cron/{id}` | Elimina un job schedulato |
| POST | `/system/cron/{id}/run` | Esegue un job immediatamente |
| GET | `/system/sftp` | Elenca gli utenti SFTP per l'accesso file |
| POST | `/system/sftp` | Crea un utente SFTP |
| PATCH | `/system/sftp/{id}` | Aggiorna un utente SFTP |
| DELETE | `/system/sftp/{id}` | Elimina un utente SFTP |

I body dei job cron usano la forma `{ "name", "schedule", "task", "enabled" }`
dove `schedule` è un'espressione cron a cinque campi e `task` è uno tra
`backup`, `invoice.dunning`, `snapshot.prune`, `sync.pterodactyl`,
`sync.proxmox`, `sync.virtfusion`, `report.daily`. I body degli utenti SFTP
usano `{ "server_id", "username", "home_path", "enabled" }`.

```json
// GET /system/status
{
  "version": "1.0.0",
  "latest_release": { "tag": "v1.1.0", "url": "...", "published_at": "2026-08-15T10:00:00Z" },
  "update_available": true,
  "environment": "production",
  "healthy": true
}
```

## Webhook

| Provider | Percorso | Header firma |
| --- | --- | --- |
| Stripe | `/webhooks/stripe` | `Stripe-Signature` |
| PayPal | `/webhooks/paypal` | `PAYPAL-TRANSMISSION-SIG` |
| Mollie | `/webhooks/mollie` | HMAC in `Authorization` |

Gli handler dei webhook verificano le firme, accodano i job di billing e
restituiscono `200` subito; l'elaborazione avviene nella coda `aetheris.billing`.

## Codici di stato

| Codice | Significato |
| --- | --- |
| 200 | Successo |
| 201 | Risorsa creata |
| 202 | Accettato per elaborazione in background |
| 400 | Fallimento di validazione |
| 401 | Credenziali mancanti o non valide |
| 403 | Ruolo insufficiente |
| 404 | Risorsa non trovata |
| 409 | Conflitto di stato (es. sospensione su un server terminato) |
| 429 | Rate limited |
| 500 | Errore backend |
| 502 | Errore hypervisor upstream |

## Autenticazione

### Sessioni (client interattivi)

1. `POST /auth/login` con `{ "email": string, "password": string }`.
2. La risposta contiene un access token (durata 15 minuti) e un refresh
   token (rotazione a ogni uso, revocabile).
3. Invia l'access token come `Authorization: Bearer <token>` su ogni
   richiesta. Quando scade, scambia il refresh token su
   `POST /auth/refresh`.

### API key (macchine e script)

Crea una API key nel Pannello Admin o tramite `POST /admin/api-keys`:

```http
Authorization: Bearer <admin-jwt>

POST /admin/api-keys
Content-Type: application/json

{ "label": "deploy-bot", "scopes": ["servers:write", "billing:read"] }
```

Le API key non scadono per default ma possono essere revocate in qualsiasi
momento; l'audit log registra ogni uso. Conservale nel tuo secret manager.

## Paginazione e filtri

Gli endpoint di elenco sono paginati. Parametri di query:

| Parametro | Default | Descrizione |
| --- | --- | --- |
| `page` | `1` | Numero di pagina (da 1) |
| `per_page` | `50` | Dimensione pagina, max `100` |
| `sort` | `created_at:desc` | `field:asc` o `field:desc` |
| `filter` | - | Coppie `key=value`, separate da virgola |

Esempio:

```http
GET /billing/invoices?page=2&per_page=25&sort=due_date:asc&filter=status=open
```

Le risposte includono un envelope di paginazione:

```json
{
  "data": [],
  "meta": { "page": 2, "per_page": 25, "total": 312, "total_pages": 13 }
}
```

## Idempotenza

Le operazioni di scrittura accettano l'header `Idempotency-Key`. Ripetere la
stessa richiesta con la stessa chiave restituisce il risultato originale
invece di eseguirla di nuovo - essenziale per provisioning e pagamenti da
script con retry.

```http
POST /servers
Idempotency-Key: deploy-2026-08-20-01
Content-Type: application/json
```

## Rate limit

| Scope | Limite | Finestra |
| --- | --- | --- |
| Login | 5 tentativi | 15 minuti per account |
| Endpoint pubblici | 60 richieste | 1 minuto per IP |
| API autenticata | 600 richieste | 1 minuto per chiave |
| Endpoint di pagamento | 20 richieste | 1 minuto per account |

Il superamento del limite restituisce `429` con l'header `Retry-After`.

## Formato degli errori

Tutti gli errori usano una forma consistente:

```json
{
  "error": {
    "code": "node_unreachable",
    "message": "Il nodo fra-01 non ha risposto",
    "details": { "node_id": "fra-01", "attempts": 3 }
  }
}
```

I codici `code` machine-readable sono stabili tra le versioni; `message` è
rivolto agli umani e può cambiare.

## Esempio: provisionare un server

```bash
TOKEN=$(curl -sS -X POST http://app.example.com/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"ops@example.com","password":"secret"}' \
  | jq -r '.accessToken')

curl -sS -X POST http://app.example.com/api/servers \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Idempotency-Key: deploy-001' \
  -H 'Content-Type: application/json' \
  -d '{"plan":"vps-4","node":"fra-01","egg":"nodejs-20"}'
```

## Client SDK

Client generati possono essere prodotti da `openapi.yaml` con qualsiasi
generatore OpenAPI (openapi-generator, orval, openapi-typescript). I contratti
driver tipizzati in `src/lib/adapters/hypervisors/types.ts` sono la fonte
TypeScript canonica per le forme rivolte agli hypervisor.
