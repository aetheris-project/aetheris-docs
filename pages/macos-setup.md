# macOS setup

Running Aetheris on macOS 13+.

## Install prerequisites

```bash
brew install node@20 postgresql@16 redis nginx
brew services start postgresql@16
brew services start redis
```

## Build and run

```bash
git clone https://github.com/aetheris-project/aetheris-app.git
cd aetheris-app
npm ci && npx prisma generate && npx prisma migrate deploy
npm run build
cp .env.example .env
npm run dev
```

## Python backend (SQLite demo)

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python run.py --port 8000
```

## launchd (production)

The automated installer generates `com.aetheris.backend.plist`:

```bash
cp deploy/com.aetheris.backend.plist ~/Library/LaunchAgents/
launchctl bootstrap gui/$(id -u) ~/Library/LaunchAgents/com.aetheris.backend.plist
```

## Docker

Docker Desktop on macOS works identically to the Linux path. Use the Apple Silicon (ARM64) images — all Aetheris containers support multi-arch.

See also: [Installation](installation.md), [Docker](docker.md).
