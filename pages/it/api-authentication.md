# Autenticazione API

Come autenticarsi con la REST API di Aetheris.

## Login

```bash
TOKEN=$(curl -sS http://127.0.0.1:8000/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"admin@example.com","password":"admin-aetheris-2026"}' \
  | python -c "import sys,json;print(json.load(sys.stdin)['token'])")
```

## Usa il token

```bash
curl -sS http://127.0.0.1:8000/api/nodes \
  -H "Authorization: Bearer $TOKEN"
```

## Durata token

- TTL predefinito: 86400 secondi (24 ore).
- Controllato da `AETHERIS_TOKEN_TTL`.
- Token HMAC-signed — nessun lookup database.

## Ruoli

| Ruolo | Accesso |
| --- | --- |
| `superadmin` | Tutto — tutti gli endpoint |
| `admin` | Gestisci nodi, server, billing, cron, SFTP |
| `user` | Read-only — lista server, visualizza fatture, power action |

Vedi anche: [Backend](backend.md), [Gestione utenti](user-management.md).
