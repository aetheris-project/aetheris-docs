# Setup macOS

Eseguire Aetheris su macOS 13+.

## Prerequisiti

```bash
brew install node@20 postgresql@16 redis nginx
brew services start postgresql@16
brew services start redis
```

## Build ed esecuzione

```bash
git clone https://github.com/aetheris-project/aetheris-app.git
cd aetheris-app
npm ci && npx prisma generate && npx prisma migrate deploy
npm run build
cp .env.example .env
npm run dev
```

## Backend Python (demo SQLite)

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python run.py --port 8000
```

## Docker

Docker Desktop su macOS funziona identico a Linux. Usa le immagini ARM64 per Apple Silicon.

Vedi anche: [Installazione](installation.md), [Docker](docker.md).
