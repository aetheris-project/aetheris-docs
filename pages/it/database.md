# Database

PostgreSQL è il database di produzione. SQLite disponibile per demo.

## Setup PostgreSQL

```bash
sudo -u postgres psql <<'SQL'
CREATE USER aetheris WITH PASSWORD 'change-me-strong';
CREATE DATABASE aetheris OWNER aetheris;
GRANT ALL PRIVILEGES ON DATABASE aetheris TO aetheris;
SQL
```

In `.env`:

```ini
DATABASE_URL=postgresql://aetheris:change-me-strong@127.0.0.1:5432/aetheris
```

## Migrations

```bash
npx prisma generate
npx prisma migrate deploy
```

Nelle Docker le migration partono automaticamente ad ogni boot.

## SQLite (solo demo)

Il backend Python supporta SQLite senza configurazione:

```ini
AETHERIS_BACKEND_DB=backend/aetheris.db
```

## Backup

```bash
pg_dump -U aetheris aetheris > backup.sql
```

Ripristino: `psql -U aetheris aetheris < backup.sql`.

Vedi anche: [Backup e ripristino](backup-and-restore.md), [Variabili d'ambiente](environment-variables.md).
