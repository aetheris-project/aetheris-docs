# Windows Installer

The official way to run Aetheris on Windows 10/11. It manages Docker Desktop, Git and the full Docker stack.

Repository: <https://github.com/aetheris-project/aetheris-windows-installer>

## Download

### curl (Git Bash / WSL / any terminal)

```bash
curl -L -o aetheris-windows-installer.exe ^
  https://github.com/aetheris-project/aetheris-windows-installer/releases/latest/download/aetheris-windows-installer.exe
```

Pin a specific version:

```bash
curl -L -o aetheris-windows-installer.exe ^
  https://github.com/aetheris-project/aetheris-windows-installer/releases/download/v1.0.0/aetheris-windows-installer.exe
```

### PowerShell

```powershell
Invoke-WebRequest -Uri https://github.com/aetheris-project/aetheris-windows-installer/releases/latest/download/aetheris-windows-installer.exe -OutFile aetheris-windows-installer.exe
```

### winget (recommended)

```powershell
winget install AetherisProject.AetherisWindowsInstaller
```

Winget downloads the installer and its dependencies (Docker Desktop, Git) automatically. You can also browse the [latest release](https://github.com/aetheris-project/aetheris-windows-installer/releases) on GitHub.

Verify the download with:

```
certutil -hashfile aetheris-windows-installer.exe SHA256
```

The published hash lives in the [winget manifest](https://github.com/aetheris-project/aetheris-windows-installer/blob/main/winget/AetherisProject.AetherisWindowsInstaller.installer.yaml).

## What it does

| Feature | Description |
| --- | --- |
| Install dependencies | Docker Desktop, Git, Node.js, Python via winget |
| Install stack | Clone `aetheris-app` + `docker compose up -d --build` |
| Start / stop | `docker compose up -d` / `docker compose stop` |
| Status | `docker compose ps` with colored output |
| Logs | Live `docker compose logs -f` in the TUI |
| Self-update | Checks GitHub Releases and updates itself |
| Software update | `docker compose pull` + `up -d` |
| Uninstall | Stop stack, remove volumes and app directory |

## Quick links

- [Setup and wizard](windows-installer-setup.md) — interactive and CLI flow
- [CLI reference](windows-installer-cli.md) — all flags and examples
- [Development](windows-installer-dev.md) — build from source, winget packaging

See also: [Installation](installation.md), [Docker](docker.md).
