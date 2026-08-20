# Backup e ripristino

Proteggere l'installazione Aetheris — cosa salvare, come pianificarlo e come ripristinare.

## Cosa salvare

| Dati | Posizione | Necessario |
| --- | --- | --- |
| Database PostgreSQL | Volume dati | ✅ Tutti i dati business |
| Stato applicazione | `aetheris-app` + `.env` | ✅ Mantieni `.env` |
| Redis (AOF) | Dir dati Redis | Opzionale (billing zero-loss) |
| Upload | Volume dati app | Dipende dall'install |

**PostgreSQL è l'elemento più importante** — contiene account, nodi, server, fatture, log audit e credenziali crittografate.

## Backup rapido

```bash
# Docker
docker compose exec -T postgres pg_dump --username=aetheris --dbname=aetheris --format=custom > backup.dump

# Ripristino
cat backup.dump | docker compose exec -T postgres pg_restore --username=aetheris --dbname=aetheris --clean
```

Vedi anche: [Monitoraggio](monitoring.md), [Aggiornamenti](upgrades.md).
