# macOS installation

Run Aetheris on macOS 13+.

## Prerequisites

```bash
brew install node@20 postgresql@16 redis nginx
brew services start postgresql@16
brew services start redis
```

## Automated path

```bash
python -m aetheris_installer --yes \
  --target ~/aetheris \
  --backend-port 8000
```

Load the launchd plist:

```bash
cp ~/aetheris/deploy/com.aetheris.backend.plist ~/Library/LaunchAgents/
launchctl bootstrap gui/$(id -u) ~/Library/LaunchAgents/com.aetheris.backend.plist
```

## Manual path

```bash
git clone https://github.com/aetheris-project/aetheris-app.git
cd aetheris-app
npm ci && npx prisma generate && npx prisma migrate deploy
npm run build
cp .env.example .env
npm run dev
```

## Python backend (SQLite demo)

No database server needed:

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python run.py --port 8000
```

## Docker

Docker Desktop on macOS works identically to Linux. Use ARM64 images for Apple Silicon.

See also: [macOS setup](macos-setup.md), [Installation](installation.md).
