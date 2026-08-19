# Automated installer

The `aetheris-installer` repository ships an archinstall-style terminal
wizard and a fully scriptable non-interactive mode for deploying the
Aetheris control plane on Linux, macOS and Windows. It creates the
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
| App | Control plane, billing engine, hypervisor drivers |
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

## Next steps

- Full per-OS guidance: see `installation.md`.
- Python backend reference: see `backend.md`.
- Theming and whitelabeling: see `theming.md`.
