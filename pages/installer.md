# Automated installer

The `aetheris-installer` repository ships an archinstall-style terminal wizard for deploying Aetheris on Linux, macOS and Windows.

Repository: <https://github.com/aetheris-project/aetheris-installer>

## Requirements

- Python 3.10+
- Node.js 20.x LTS (for web/app components)
- git

## Quick start

```bash
git clone https://github.com/aetheris-project/aetheris-installer.git
cd aetheris-installer
python -m venv .venv && source .venv/bin/activate
python -m aetheris_installer --yes
```

## What it does

1. Detects the OS (Linux / macOS / Windows).
2. Creates `./aetheris-deploy` with the full layout.
3. Writes `.env` files for web app and backend.
4. Installs Node and Python dependencies.
5. Generates service units (systemd / launchd / Task Scheduler).
6. Verifies endpoints.

## Quick links

- [CLI reference](installer-cli.md) — all flags, env vars, exit codes
- [Installation guide](installation.md) — per-OS deployment paths

See also: [Installation](installation.md), [Environment variables](environment-variables.md).
