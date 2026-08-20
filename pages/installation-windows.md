# Windows installation

Run Aetheris on Windows 10/11.

## Recommended: Docker Desktop

No native tools needed:

```powershell
git clone https://github.com/aetheris-project/aetheris-app.git
cd aetheris-app
cp .env.example .env
docker compose up -d --build
```

## Via winget

```powershell
winget install AetherisProject.AetherisWindowsInstaller
```

Launches a TUI wizard that manages Docker Desktop and the stack.

## Native install (automated)

```powershell
git clone https://github.com/aetheris-project/aetheris-installer.git
cd aetheris-installer
python -m venv .venv
.venv\Scripts\activate
python -m aetheris_installer --yes
```

Start services in two terminals:

```bat
aetheris-deploy\aetheris-app\backend\start-backend.bat
aetheris-deploy\aetheris-app\start-web.bat
```

Register auto-start (run once as Administrator):

```bat
aetheris-deploy\deploy\register-schtasks.cmd
```

## Native install (manual)

Requires Node.js 20+ and Python 3.10+:

```powershell
cd aetheris-app
npm ci && npx prisma generate && npx prisma migrate deploy
npm run build
npm run start
```

## WSL2

```powershell
wsl --install -d Ubuntu-22.04
wsl
# follow Linux instructions
```

See also: [Windows setup](windows-setup.md), [Installation](installation.md).
