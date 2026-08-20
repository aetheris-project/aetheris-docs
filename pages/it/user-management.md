# Gestione utenti

Come funzionano utenti, ruoli e permessi in Aetheris.

## Ruoli

| Ruolo | Accesso |
| --- | --- |
| `superadmin` | Tutto — crea admin, gestisci billing, elimina nodi |
| `admin` | Gestisci nodi, server, cron, SFTP |
| `user` | Portale client — visualizza server, paga fatture, console |

## Crea un utente

```bash
curl -sS http://127.0.0.1:8000/api/auth/users \
  -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{"email":"dev@example.com","password":"strong-password","role":"admin","name":"Developer"}'
```

## Flow di autenticazione

1. Utente invia email + password.
2. Backend verifica hash scrypt, restituisce JWT HMAC-signed.
3. JWT inviato come `Authorization: Bearer <token>` ad ogni richiesta.
4. I token scadono dopo `AETHERIS_TOKEN_TTL` secondi (default 24h).

Vedi anche: [Sicurezza](security.md), [Autenticazione API](api-authentication.md).
