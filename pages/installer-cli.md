# Installer — CLI reference

All flags, environment variables and exit codes for the automated installer.

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

## Environment variables

Every flag has an env equivalent. Flags > env > preset.

| Variable | Default | Effect |
| --- | --- | --- |
| `AETHERIS_INSTALL_TARGET` | `./aetheris-deploy` | Deployment directory |
| `AETHERIS_INSTALL_WEB_PORT` | `3000` | Web server port |
| `AETHERIS_INSTALL_BACKEND_PORT` | `8000` | Backend API port |
| `AETHERIS_INSTALL_ADMIN_EMAIL` | `admin@example.com` | Superadmin email |
| `AETHERIS_INSTALL_ADMIN_PASSWORD` | random | Superadmin password |
| `AETHERIS_INSTALL_WITH_WEBSITE` | `1` | Install website |
| `AETHERIS_INSTALL_WITH_APP` | `1` | Install app |
| `AETHERIS_INSTALL_WITH_BACKEND` | `1` | Install backend |
| `AETHERIS_INSTALL_WITH_DOCS` | `0` | Install docs |
| `AETHERIS_INSTALL_WITH_SERVICES` | `1` | Write service units |

## Preset files

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

## Exit codes

| Code | Meaning |
| --- | --- |
| `0` | Success |
| `1` | Preflight or step failure |
| `2` | Invalid arguments or preset |
| `3` | Missing dependency (git, node, python) |

## Layout written

```
aetheris-deploy/
├── aetheris-app/
│   ├── .env
│   └── backend/.env
├── aetheris-website/
├── aetheris-docs/          (optional)
└── deploy/
    ├── *.service           (Linux)
    ├── *.plist             (macOS)
    └── *.bat / *.cmd       (Windows)
```

## Uninstall

```bash
# Linux
sudo systemctl stop aetheris-web aetheris-backend aetheris-worker
rm -rf ./aetheris-deploy

# Windows
schtasks /Delete /TN AetherisWeb /F
rmdir /s /q aetheris-deploy
```

See also: [Installation](installation.md), [Environment variables](environment-variables.md).
