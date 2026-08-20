# Windows setup

Running Aetheris on Windows 10/11.

## Recommended: Docker Desktop

```powershell
# Install Docker Desktop from docker.com (WSL2 backend)
git clone https://github.com/aetheris-project/aetheris-app.git
cd aetheris-app
cp .env.example .env
docker compose up -d --build
```

No native Node.js, Python, PostgreSQL or Redis needed.

## Via winget

```powershell
winget install AetherisProject.AetherisWindowsInstaller
```

Launches a TUI wizard that manages the Docker stack automatically.

## Native install (automated)

```powershell
git clone https://github.com/aetheris-project/aetheris-installer.git
cd aetheris-installer
python -m venv .venv
.venv\Scripts\activate
python -m aetheris_installer --yes
```

Generates `start-web.bat`, `start-backend.bat` and Task Scheduler entries.

## Native install (manual)

Requires Node.js 20+ and Python 3.10+:

```powershell
cd aetheris-app
npm ci
npx prisma generate
npx prisma migrate deploy
npm run build
npm run start
```

## WSL2

Install Ubuntu 22.04 in WSL2, then follow the Linux instructions:

```powershell
wsl --install -d Ubuntu-22.04
wsl
# follow: installation.md → section 2 (Docker) or 3 (Linux)
```

See also: [Installation](installation.md), [Windows Installer](windows-installer.md).
