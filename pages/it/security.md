# Sicurezza

Controlli integrati e checklist di hardening per la produzione.

## Controlli integrati

- **Crittografia AES-256-GCM** per token hypervisor, segreti gateway, password SMTP.
- **Hash scrypt** per le password con salt per utente.
- **Token JWT** con TTL configurabile.
- **RBAC** — ruoli superadmin, admin, user.
- **CORS** — origini consentite configurabili.
- **Rate limiting** — throttling per IP via Redis.

## Checklist di hardening

| Area | Azione |
| --- | --- |
| `AETHERIS_SECRET` | Imposta un valore forte (≥ 32 char) |
| `NEXTAUTH_SECRET` | Imposta un valore forte |
| Database | Limita a loopback, usa password forte |
| Redis | Bind a loopback, abilita AOF |
| TLS | Usa sempre HTTPS in produzione |
| Firewall | Apri solo 80/443, DB/Redis su loopback |
| Credenziali admin | Cambia i default immediatamente |

Vedi anche: [Gestione utenti](user-management.md), [Variabili d'ambiente](environment-variables.md).
