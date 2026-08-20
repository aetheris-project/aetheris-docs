# Windows Installer

The `aetheris-windows-installer` repository ships the official way to run
the Aetheris control plane on Windows 10/11. The platform itself runs as a
Docker stack (web, worker, Python backend, PostgreSQL, Redis); this
installer manages everything around it - dependency installation, cloning
and starting the stack, and a complete teardown.

Repository: <https://github.com/aetheris-project/aetheris-windows-installer>

## Installation

### Via winget (recommended)

```powershell
winget install AetherisProject.AetherisWindowsInstaller
```

Winget resolves the release asset from GitHub, verifies its SHA-256
checksum against the published manifest and installs Docker Desktop and
Git for Windows as declared dependencies. The installer itself requires no
elevated privileges beyond what Docker Desktop needs.

### Manual

Download `aetheris-windows-installer.exe` from the
[latest release](https://github.com/aetheris-project/aetheris-windows-installer/releases)
and run it. Double-clicking opens the interactive TUI wizard.

## What the installer manages

| Concern | How |
| --- | --- |
| Docker Desktop | Installed via winget (`Docker.DockerDesktop`), auto-started |
| Git for Windows | Installed via winget (`Git.Git`), required for cloning |
| Node.js LTS | Optional dependency install via winget |
| Python 3.12 | Optional dependency install via winget |
| The stack | Clones `aetheris-app` and runs `docker compose up -d --build` |
| Uninstall | Stops the stack, removes volumes and the application directory |

## Interactive wizard

Launch the exe (or run `aetheris-windows-installer` from a terminal) to
open the curses TUI wizard with arrow-key navigation, a box-drawing frame
and the Aetheris accent color. On terminals without curses support the
wizard falls back to plain-text prompts automatically.

Steps in the wizard:

1. **Welcome** - summary of what will be installed.
2. **Target directory** - choose where `aetheris-app` will live.
3. **Environment file** - write `.env` now (recommended) or later manually.
4. **Database engine** - PostgreSQL container (default) or a local SQLite
   `.db` file (recommended for tests).
5. **Dependency check** - verify Docker Desktop, git, Node.js and Python.
6. **Install** - winget installs missing dependencies, the app is cloned,
   the stack starts, and the result is verified.

### TUI keys

| Key | Action |
| --- | --- |
| Up / Down | Move the selection |
| Space / Enter | Confirm and advance |
| q / Esc | Back / quit |

## Command line

The exe is fully scriptable:

| Flag | Effect |
| --- | --- |
| `--yes` | Non-interactive mode with defaults (CI-friendly) |
| `--target PATH` | Target directory for the checkout |
| `--deps` | Install dependencies only (Docker Desktop, Git, Node, Python) |
| `--software` | Install the stack only (clone + `compose up`) |
| `--both` | Dependencies and stack |
| `--uninstall` | Stop the stack, remove volumes and the app directory |
| `--dry-run` | Print every command without executing anything |
| `--version` | Print the version and exit |

### Examples

```powershell
# Preview everything without touching the machine
aetheris-windows-installer --both --dry-run

# Full non-interactive install with a custom target
aetheris-windows-installer --both --target D:\aetheris

# Dependencies only (you already cloned the repo manually)
aetheris-windows-installer --deps

# Tear everything down
aetheris-windows-installer --uninstall
```

## The Docker stack

After a successful install, the following containers run (from
`docker compose ps` in the app directory):

| Service | Purpose | Port |
| --- | --- | --- |
| `aetheris-web` | Next.js control plane | 3000 |
| `aetheris-worker` | BullMQ background worker | - |
| `aetheris-backend` | FastAPI Python API | 8000 |
| `aetheris-postgres` | PostgreSQL database | 5432 |
| `aetheris-redis` | Queue and cache | 6379 |

Open <http://127.0.0.1:3000> for the control plane and
<http://127.0.0.1:8000/docs> for the interactive API documentation.

## Verifying the install

```powershell
# Containers are up
docker compose ps

# The web app answers
curl.exe -fsSI http://127.0.0.1:3000 | Select-Object -First 1

# The backend is healthy
curl.exe -fsS http://127.0.0.1:8000/health

# Docker itself is healthy
docker info --format "{{.ServerVersion}}"
```

## Uninstalling

Run the exe with `--uninstall`, or manually:

```powershell
cd <target>\aetheris-app
docker compose down -v
cd ..
Remove-Item -Recurse -Force <target>
```

`--uninstall` stops the stack, removes the Docker volumes and deletes the
application directory. It does not remove Docker Desktop, git or the other
dependencies - those stay available for other projects.

## Troubleshooting

| Symptom | Fix |
| --- | --- |
| `Docker Desktop is not running` | Start Docker Desktop and wait for the engine; re-run the installer |
| `git not found` | The installer installs Git via winget; restart the terminal afterwards |
| `compose up` fails | Check `docker compose logs --tail=100`; the `.env` file in the app directory usually holds the cause |
| Port 3000/8000 already in use | Stop the other service, or edit the port mapping in `docker-compose.yml` |
| Windows Defender blocks the exe | The binary is unsigned; click *More info > Run anyway* once |
| Winget reports a hash mismatch | Update the manifest from the repo (`winget/`) before submitting to winget-pkgs |

## Development

Build the exe from source:

```bash
cd aetheris-windows-installer
python -m venv .venv
.venv\Scripts\activate
pip install -e .[build]
python tools/build_exe.py
```

The PyInstaller entry point lives in `aetheris_wininstaller/__main__.py`
and must use absolute imports (relative imports crash inside a PyInstaller
bundle). The curses-based TUI falls back to plain prompts when
`windows-curses` is not bundled.

```bash
# Run the test suite (40+ tests)
.venv\Scripts\python -m pytest -q
```

## Winget packaging

The repository keeps the winget manifests under `winget/`:

```text
winget/
├── AetherisProject.AetherisWindowsInstaller.installer.yaml
├── AetherisProject.AetherisWindowsInstaller.locale.en-US.yaml
├── AetherisProject.AetherisWindowsInstaller.locale.it-IT.yaml
└── AetherisProject.AetherisWindowsInstaller.yaml
```

The installer declares `Docker.DockerDesktop` and `Git.Git` as
`Dependencies`, so winget installs them automatically. When a new release
is cut:

1. Rebuild the exe and compute the new SHA-256:
   ```powershell
   Get-FileHash .\dist\aetheris-windows-installer.exe -Algorithm SHA256
   ```
2. Update `InstallerSha256` in the installer manifest.
3. Validate: `winget validate --manifest winget`.
4. Push the manifests to `microsoft/winget-pkgs` under
   `manifests/a/AetherisProject/AetherisWindowsInstaller/<version>/`.

## Next steps

- Cross-platform installer: see `installer.md`.
- Per-OS setup: see `installation.md`.
- The stack itself: see `architecture.md` and `backend.md`.
- Operations: `monitoring.md`, `backup-and-restore.md`, `upgrades.md`.
