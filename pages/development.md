# Development

For contributors and operators running Aetheris from source.

## Repository layout

| Repository | Purpose |
| --- | --- |
| `aetheris-app` | Web app, backend, workers, Prisma schema |
| `aetheris-website` | Marketing site with interactive demo |
| `aetheris-docs` | This wiki, SDK guide, OpenAPI spec |
| `aetheris-addons` | Modules, themes, integrations store |
| `aetheris-windows-installer` | Windows TUI installer + winget |
| `aetheris-installer` | Linux/macOS automated installer |

## Local development

```bash
# Start PostgreSQL + Redis
docker compose up -d postgres redis

# Web app
npm ci && npx prisma migrate dev && npm run dev

# Backend
cd backend && python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt && python run.py --reload
```

## Quick links

- [Development conventions](development-conventions.md) — code style, testing, release workflow

See also: [Architecture](architecture.md), [Backend](backend.md).
