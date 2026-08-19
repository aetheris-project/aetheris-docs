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

## Client SDK

Client generati possono essere prodotti da `openapi.yaml` con qualsiasi
generatore OpenAPI (openapi-generator, orval, openapi-typescript). I contratti
driver tipizzati in `src/lib/adapters/hypervisors/types.ts` sono la fonte
TypeScript canonica per le forme rivolte agli hypervisor.
