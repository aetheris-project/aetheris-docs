# Development — Conventions

Code style, testing and release workflow.

## Code style

- TypeScript strict mode for the web app.
- Python with `ruff` for the backend.
- Tailwind CSS for styling — no custom CSS unless token-driven.
- Conventional commits: `feat:`, `fix:`, `chore:`, `docs:`.

## Testing

```bash
# Web app
npm test

# Backend
cd backend && pip install -r requirements-dev.txt && pytest -q

# Docs build
cd aetheris-docs && npm run build
```

## Prisma workflow

```bash
npx prisma migrate dev --name feature_name   # create migration
npx prisma generate                          # regenerate client
npx prisma migrate deploy                    # apply in production
```

## Release workflow

1. Create a feature branch.
2. Make changes, run tests.
3. Open a PR against `main`.
4. Merge after review.
5. Vercel auto-deploys `main` to production.

## Environment setup

Copy `.env.example` and fill in:

```ini
DATABASE_URL=postgresql://aetheris:password@127.0.0.1:5432/aetheris
REDIS_URL=redis://127.0.0.1:6379
AETHERIS_SECRET=<random-32-chars>
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=<random-32-chars>
```

See also: [Development overview](development.md), [Architecture](architecture.md).
