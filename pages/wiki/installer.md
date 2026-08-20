# Automated installer

The `aetheris-installer` repository ships an archinstall-style terminal
wizard and a fully scriptable non-interactive mode for deploying the
Aetheris control panel on Linux, macOS and Windows. It creates the
deployment layout, writes environment files, installs dependencies,
generates native service units for the detected operating system and
verifies the result.

Repository: <https://github.com/aetheris-project/aetheris-installer>

## Requirements

- Python 3.10 or newer
- Node.js 20.x LTS (only when installing the web/app components)
- git

## Install the installer

```bash
git clone https://github.com/aetheris-project/aetheris-installer.git
cd aetheris-installer
python -m venv .venv

# Windows
.venv\Scripts\activate
# Linux / macOS
source .venv/bin/activate

pip install pytest   # only needed for the test suite
```

## Interactive wizard

```bash
python -m aetheris_installer
```

On terminals with curses support this opens an archinstall-style screen:
use the arrow keys (or `j`/`k`) to move, `Space` to toggle a component,
`Enter` to start the installation and `q` to quit. On terminals without
curses (notably Windows) the installer falls back to plain prompts.

Components you can toggle:

| Component | Installs |
| --- | --- |
| Website | Marketing site and interactive demo |
| App | Control panel, billing engine, hypervisor drivers |
| Backend | Python REST API (FastAPI, SQLite) |
| Docs | Nextra wiki (optional) |
| Services | systemd / launchd / Windows Task Scheduler units |

## Non-interactive mode

```bash
python -m aetheris_installer --yes
```

The `--yes` flag runs every step with defaults and is safe for CI and
provisioning scripts. Presets and `AETHERIS_INSTALL_*` environment
variables configure everything else:

```bash
AETHERIS_INSTALL_WEB_PORT=5555 \
AETHERIS_INSTALL_ADMIN_EMAIL=ops@example.com \
python -m aetheris_installer --yes
```

Presets are JSON files mapping any configuration field:

```json
{
  "target_dir": "./aetheris-deploy",
  "with_website": true,
  "with_app": true,
  "with_backend": true,
  "web_port": 3000,
  "backend_port": 8000,
  "admin_email": "admin@example.com"
}
```

```bash
python -m aetheris_installer --preset presets/dev.json --yes
```

## What it writes

```
aetheris-deploy/
├── aetheris-app/
│   ├── .env                      # app environment
│   └── backend/
│       ├── .env                  # backend environment
│       └── .venv/                # Python virtual environment
├── aetheris-website/             # website checkout
├── aetheris-docs/                # docs checkout (optional)
└── deploy/
    ├── aetheris-web.service      # Linux: systemd units
    ├── aetheris-worker.service
    ├── aetheris-backend.service
    ├── com.aetheris.backend.plist   # macOS: launchd
    ├── start-backend.bat            # Windows: start scripts
    ├── start-web.bat
    └── register-schtasks.cmd
```

The installer never writes outside the target directory. Run
`--dry-run` to print every action without touching disk.

## Flags

| Flag | Effect |
| --- | --- |
| `--yes` | Run non-interactively with defaults |
| `--preset PATH` | Load a JSON preset file |
| `--target DIR` | Deployment directory (default `./aetheris-deploy`) |
| `--web-port N` | Web server port |
| `--backend-port N` | Backend API port |
| `--admin-email` / `--admin-password` | Superadmin credentials |
| `--dry-run` | Print actions without writing |
| `--skip-checks` | Skip preflight checks |
| `--skip-deps` | Skip dependency installation |
| `--no-services` | Do not write service files |
| `--no-app` / `--no-backend` / `--no-website` | Component selection |

Exit codes: `0` success; `1` preflight or step failure.

## Environment variables

Every `--flag` has an environment equivalent. Flags win over variables;
variables win over preset files.

| Variable | Default | Effect |
| --- | --- | --- |
| `AETHERIS_INSTALL_TARGET` | `./aetheris-deploy` | Deployment directory |
| `AETHERIS_INSTALL_WEB_PORT` | `3000` | Web server port |
| `AETHERIS_INSTALL_BACKEND_PORT` | `8000` | Backend API port |
| `AETHERIS_INSTALL_ADMIN_EMAIL` | `admin@example.com` | Superadmin email |
| `AETHERIS_INSTALL_ADMIN_PASSWORD` | random | Superadmin password |
| `AETHERIS_INSTALL_WITH_WEBSITE` | `1` | Install the website |
| `AETHERIS_INSTALL_WITH_APP` | `1` | Install the app |
| `AETHERIS_INSTALL_WITH_BACKEND` | `1` | Install the backend |
| `AETHERIS_INSTALL_WITH_DOCS` | `0` | Install the docs |
| `AETHERIS_INSTALL_WITH_SERVICES` | `1` | Write service units |

## Exit codes

| Code | Meaning |
| --- | --- |
| `0` | Success |
| `1` | Preflight check or step failure |
| `2` | Invalid arguments or preset file |
| `3` | Missing required dependency (git, node, python) |

## Verifying the install

After a successful run, check:

```bash
# Services are active (Linux)
sudo systemctl status aetheris-web aetheris-backend aetheris-worker

# The web app answers
curl -fsSI http://127.0.0.1:3000 | head -1

# The backend is healthy
curl -fsS http://127.0.0.1:8000/health

# The log shows no errors
journalctl -u aetheris-worker -n 20 --no-pager
```

## Uninstalling

The installer does not register itself as a system package. To remove a
deployment:

```bash
# Linux: stop and disable the units, then delete the directory
sudo systemctl stop aetheris-web aetheris-backend aetheris-worker
sudo systemctl disable aetheris-web aetheris-backend aetheris-worker
rm -rf ./aetheris-deploy

# Windows: stop the scheduled tasks, then delete the directory
schtasks /End /TN AetherisWeb
schtasks /Delete /TN AetherisWeb /F
rmdir /s /q aetheris-deploy
```

## TUI keys (curses screen)

| Key | Action |
| --- | --- |
| Up / Down, `j` / `k` | Move the selection |
| `Space` | Toggle a component (website / app / backend / docs / services) |
| `Enter` | Confirm and advance |
| `q` / Esc | Go back / quit |

On terminals without curses support the installer falls back to plain
numbered prompts automatically.

## Troubleshooting the installer

- **`git not found`**: install git and add it to PATH, then re-run.
- **`port already in use`**: pass `--web-port` / `--backend-port` or the
  `AETHERIS_INSTALL_*_PORT` variables.
- **Systemd units fail to start**: run `journalctl -u aetheris-backend -n 50`
  and check the `.env` files inside the deployment directory.
- **Backend cannot reach SQLite**: the backend runs its own `aetheris.db`
  in `aetheris-app/backend`; check write permissions on that directory.
- **CI keeps failing on `--yes`**: use `--skip-checks` only after you have
  verified the preflight manually once.

## Next steps

- Full per-OS guidance: see `installation.md`.
- Python backend reference: see `backend.md`.
- Theming and whitelabeling: see `theming.md`.
- Operations: see `monitoring.md`, `backup-and-restore.md` and
  `upgrades.md`.
