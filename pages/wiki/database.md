# Database

PostgreSQL is the production database. SQLite is available for demos.

## PostgreSQL setup

```bash
sudo -u postgres psql <<'SQL'
CREATE USER aetheris WITH PASSWORD 'change-me-strong';
CREATE DATABASE aetheris OWNER aetheris;
GRANT ALL PRIVILEGES ON DATABASE aetheris TO aetheris;
SQL
```

Set in `.env`:

```ini
DATABASE_URL=postgresql://aetheris:change-me-strong@127.0.0.1:5432/aetheris
```

## Migrations

```bash
npx prisma generate
npx prisma migrate deploy
```

Migrations run automatically in Docker on every boot.

## SQLite (demos only)

The Python backend supports zero-config SQLite — no database server needed. Set:

```ini
AETHERIS_BACKEND_DB=backend/aetheris.db
```

## Backup

```bash
pg_dump -U aetheris aetheris > backup.sql
```

Restore with `psql -U aetheris aetheris < backup.sql`.

See also: [Backup and restore](backup-and-restore.md), [Environment variables](environment-variables.md).
