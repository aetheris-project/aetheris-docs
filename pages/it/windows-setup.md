# Setup Windows

Eseguire Aetheris su Windows 10/11.

## Consigliato: Docker Desktop

```powershell
git clone https://github.com/aetheris-project/aetheris-app.git
cd aetheris-app
cp .env.example .env
docker compose up -d --build
```

Nessuno strumento nativo necessario.

## Tramite winget

```powershell
winget install AetherisProject.AetherisWindowsInstaller
```

Lancia un wizard TUI che gestisce Docker Desktop e il stack.

## Installazione nativa (automatica)

```powershell
git clone https://github.com/aetheris-project/aetheris-installer.git
cd aetheris-installer
python -m venv .venv
.venv\Scripts\activate
python -m aetheris_installer --yes
```

## WSL2

```powershell
wsl --install -d Ubuntu-22.04
wsl
# segui le istruzioni Linux
```

Vedi anche: [Installazione](installation.md), [Windows Installer](windows-installer.md).
