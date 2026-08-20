# Installation guide

Deploy the Aetheris control panel on Linux, Windows or macOS. The fastest path is Docker — it works identically on every OS.

Estimated time: 15 minutes automated, 60 minutes manual.

## Choose your path

| Path | Best for | Time |
| --- | --- | --- |
| [Automated installer](installation-automated.md) | All OS — TUI wizard | 15 min |
| [Docker](docker.md) | All OS — no native tools | 10 min |
| [Linux production](linux-setup.md) | Ubuntu / Debian servers | 60 min |
| [Windows](windows-setup.md) | Desktop or server | 15 min |
| [macOS](macos-setup.md) | Development | 20 min |

## Choose your OS

| OS | Recommended setup |
| --- | --- |
| Linux (Ubuntu 22.04 / Debian 12) | Production — systemd, Nginx, Certbot |
| Windows 10/11 | Docker Desktop (WSL2) or native |
| macOS 13+ | Development — Homebrew, launchd |

## Quick start (Docker)

```bash
git clone https://github.com/aetheris-project/aetheris-app.git
cd aetheris-app
cp .env.example .env
docker compose up -d --build
```

That's it. The stack includes PostgreSQL, Redis, Next.js web, BullMQ worker and the Python backend.

## Connecting hypervisors

After deployment, connect your hypervisors in the Admin Panel → Nodes:

1. Add Pterodactyl, Proxmox VE or VirtFusion credentials.
2. Click **Synchronize nodes**.
3. Assign eggs / templates to billing plans.

Full details: [Pterodactyl bridge](pterodactyl-bridge.md), [Proxmox VE setup](proxmox-setup.md), [VirtFusion setup](virtfusion-setup.md).

## Verification

```bash
curl -sS -o /dev/null -w '%{http_code}\n' http://127.0.0.1:3000/login
curl -sS http://127.0.0.1:8000/health
```

See also: [System requirements](system-requirements.md), [Environment variables](environment-variables.md), [Troubleshooting](troubleshooting.md).
