# Variabili d'ambiente

Riferimento rapido per ogni variabile `.env` della piattaforma.

## Web app (Next.js)

| Variabile | Obbligatoria | Default | Descrizione |
| --- | --- | --- | --- |
| `DATABASE_URL` | ✅ | — | Stringa connessione PostgreSQL |
| `REDIS_URL` | ✅ | — | Stringa connessione Redis |
| `AETHERIS_SECRET` | ✅ | — | Segreto HMAC (≥ 32 char) |
| `NEXTAUTH_URL` | ✅ | — | URL pubblico della web app |
| `NEXTAUTH_SECRET` | ✅ | — | Chiave crittografia sessione |
| `AETHERIS_BACKEND_URL` | — | `http://127.0.0.1:8000` | URL backend Python |

## Backend Python (FastAPI)

| Variabile | Obbligatoria | Default | Descrizione |
| --- | --- | --- | --- |
| `AETHERIS_BACKEND_DB` | — | `backend/aetheris.db` | Percorso SQLite |
| `AETHERIS_SECRET` | ✅ | — | Segreto HMAC |
| `AETHERIS_TOKEN_TTL` | — | `86400` | TTL token (secondi) |

## Hypervisor

| Variabile | Descrizione |
| --- | --- |
| `PTERODACTYL_APP_API_KEY` | Chiave Application API Pterodactyl |
| `PTERODACTYL_CLIENT_API_KEY` | Chiave Client API Pterodactyl |
| `PROXMOX_API_TOKEN` | Token API Proxmox VE |
| `VIRTFUSION_API_KEY` | Bearer token VirtFusion |

## Gateway pagamento

| Variabile | Descrizione |
| --- | --- |
| `STRIPE_SECRET_KEY` | Chiave segreta Stripe |
| `STRIPE_WEBHOOK_SECRET` | Segreto webhook Stripe |
| `PAYPAL_CLIENT_ID` | Client ID PayPal |
| `MOLLIE_API_KEY` | Chiave API Mollie |

Vedi anche: [Backend](backend.md), [Architettura](architecture.md).
