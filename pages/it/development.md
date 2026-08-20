# Sviluppo

Per contributori e operatori che eseguono Aetheris da sorgente.

## Layout dei repository

| Repository | Scopo |
| --- | --- |
| `aetheris-app` | App web, backend, worker, schema Prisma |
| `aetheris-website` | Sito marketing con demo interattiva |
| `aetheris-docs` | Questa wiki, guida SDK, OpenAPI |
| `aetheris-addons` | Moduli, temi, store integrazioni |
| `aetheris-windows-installer` | Installer TUI Windows + winget |
| `aetheris-installer` | Installer automatico Linux/macOS |

## Sviluppo locale

```bash
# Avvia PostgreSQL + Redis
docker compose up -d postgres redis

# Web app
npm ci && npx prisma migrate dev && npm run dev

# Backend
cd backend && python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt && python run.py --reload
```

Vedi anche: [Architettura](architecture.md), [Backend](backend.md).
