# Prisma

Database access and migrations in Aetheris.

## Generate client

```bash
npx prisma generate
```

## Run migrations

```bash
npx prisma migrate deploy
```

In Docker this runs automatically on container start.

## Create a migration

```bash
npx prisma migrate dev --name add_feature
```

This creates a new SQL file in `prisma/migrations/` and applies it to your local dev database.

## Schema location

The Prisma schema lives at `prisma/schema.prisma` in the `aetheris-app` repo.

## Reset database (dev only)

```bash
npx prisma migrate reset
```

⚠️ This drops and recreates the database. Do not use in production.

## Studio (visual browser)

```bash
npx prisma studio
```

Opens a web UI at `localhost:5555` to browse and edit data.

See also: [Database](database.md), [Backend](backend.md).
