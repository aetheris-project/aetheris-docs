# Backend Python

API REST FastAPI autocontenuta in `aetheris-app/backend`. Fornisce autenticazione, gestione nodi, provisioning server, billing e temi whitelabel.

## Quick start

```bash
cd aetheris-app/backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
python run.py --port 8000 --reload
```

Documentazione API: <http://127.0.0.1:8000/docs>

Admin predefinito: `admin@example.com` / `admin-aetheris-2026`

## Cosa fornisce

- **Auth**: token JWT, hash scrypt, API key per utente
- **Tenancy**: ogni riga filtrata per `organization_id`
- **Billing**: piani, abbonamenti, fatture, prorata, dunning
- **Whitelabel**: config runtime servita da `/api/whitelabel`
- **System**: cron job, utenti SFTP, stato piattaforma

Vedi anche: [API backend](backend-api.md), [Autenticazione API](api-authentication.md).
