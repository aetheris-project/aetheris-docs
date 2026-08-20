# Automated installer

The `aetheris-installer` repository provides an archinstall-style TUI wizard and a fully scriptable `--yes` mode.

## Quick start

```bash
git clone https://github.com/aetheris-project/aetheris-installer.git
cd aetheris-installer
python -m aetheris_installer --yes
```

## Dry run

Review every action without touching disk:

```bash
python -m aetheris_installer --yes --dry-run
```

## What it does

1. Detects the operating system (Linux, macOS, Windows).
2. Creates `./aetheris-deploy` with the full deployment layout.
3. Writes `.env` files for the web app and backend.
4. Installs Node and Python dependencies.
5. Generates service units (systemd / launchd / Task Scheduler).
6. Verifies the endpoints.

## Linux with systemd

```bash
sudo cp /opt/aetheris/deploy/*.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now aetheris-web aetheris-worker aetheris-backend
```

## macOS with launchd

```bash
cp ~/aetheris/deploy/com.aetheris.backend.plist ~/Library/LaunchAgents/
launchctl bootstrap gui/$(id -u) ~/Library/LaunchAgents/com.aetheris.backend.plist
```

## Windows

The installer writes `start-backend.bat`, `start-web.bat` and `register-schtasks.cmd`.

See also: [Installation](installation.md), [Installer reference](installer.md).
