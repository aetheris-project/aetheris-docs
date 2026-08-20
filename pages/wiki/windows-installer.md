# Windows Installer

The `aetheris-windows-installer` repository ships the official way to run
the Aetheris control panel on Windows 10/11. The platform itself runs as a
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
| Start / stop | `docker compose up -d` / `docker compose stop` (volumes kept) |
| Status | `docker compose ps`, colored per container state |
| Logs console | Live `docker compose logs -f` inside the wizard |
| Update installer | Checks the GitHub Releases feed and self-updates with confirmation |
| Update software | `docker compose pull` + `up -d` to the latest images (data kept) |
| Uninstall | Stops the stack, removes volumes and the application directory |

## Interactive wizard

Launch the exe (or run `aetheris-windows-installer` from a terminal) to
open the curses TUI wizard with arrow-key navigation, a box-drawing frame
and the Aetheris accent color. On terminals without curses support the
wizard falls back to plain-text prompts automatically.

The main menu is split into three sections:

**Setup** - first-time installation:

1. **Install dependencies only** - winget installs Docker Desktop, Git,
   Node.js LTS and Python.
2. **Install software only** - clone `aetheris-app` and start the Docker
   stack.
3. **Install dependencies and software** - full setup in one pass.
4. **Uninstall** - stop the stack, remove the volumes and the app
   directory.

**Manage the stack** - day-to-day operations after installation:

5. **Stack status** - `docker compose ps`, colored per service state
   (running green, exited red, restarting amber).
6. **Start the stack** - `docker compose up -d`.
7. **Stop the stack** - `docker compose stop` (containers and volumes are
   kept, so the next start is fast).
8. **Console - live stack logs** - streams `docker compose logs -f` in
   real time with the service name highlighted in the accent color.

**Updates** - keep everything current:

9. **Update the installer** - checks the GitHub Releases feed for a newer
   build of the wizard itself, downloads the executable and applies it. A
   banner on the main menu announces an available update as soon as the
   wizard starts. The wizard closes and relaunches as the new version
   automatically.
10. **Update Aetheris software** - pulls the latest container images
    (`docker compose pull`) and recreates the containers (`docker compose
    up -d`). Volumes and data are kept; a short downtime occurs.

Update actions always ask for confirmation **twice**: the first Enter arms
 the action, the second one starts it.

### TUI keys

| Key | Action |
| --- | --- |
| Up / Down or j / k | Move the selection |
| Space / Enter | Confirm and advance |
| q / Esc | Back / quit / stop following the log console |

## Command line

The exe is fully scriptable:

| Flag | Effect |
| --- | --- |
| `--dir PATH` | Target directory for the checkout |
| `--deps` | Install dependencies only (Docker Desktop, Git, Node, Python) |
| `--software` | Install the stack only (clone + `compose up`) |
| `--both` | Dependencies and stack |
| `--uninstall` | Stop the stack, remove volumes and the app directory |
| `--status` | Show the running state of every container (`docker compose ps`) |
| `--start` | Bring the stack up (`docker compose up -d`) |
| `--stop` | Stop the stack, keeping containers and volumes |
| `--logs` | Print the last `--tail` lines of the whole stack |
| `--tail N` | Number of log lines for `--logs` (default 200) |
| `--update-stack` | Update the software to the latest images (`compose pull` + `up -d`) |
| `--update` | Self-update the installer (asks for confirmation twice) |
| `--update-check` | Check whether a newer installer release exists |
| `--db postgres\|sqlite` | Database engine used by the stack commands |
| `--no-env` | Skip writing the `.env` file now |
| `--dry-run` | Print every command without executing anything |
| `--version` | Print the version and exit |

### Examples

```powershell
# Preview everything without touching the machine
aetheris-windows-installer --both --dry-run

# Full non-interactive install with a custom target
aetheris-windows-installer --both --dir D:\aetheris

# Dependencies only (you already cloned the repo manually)
aetheris-windows-installer --deps

# Day-to-day management
aetheris-windows-installer --status
aetheris-windows-installer --start
aetheris-windows-installer --stop
aetheris-windows-installer --logs --tail 300

# Update the software to the latest images
aetheris-windows-installer --update-stack

# Self-update the installer (asks for confirmation)
aetheris-windows-installer --update
aetheris-windows-installer --update-check

# Tear everything down
aetheris-windows-installer --uninstall
```

Management commands (`--status`, `--start`, `--stop`, `--logs`) resolve the
compose file automatically: the engine recorded in the installed `.env`
(`AETHERIS_DB_MODE`) wins, otherwise the `--db` flag decides.

## The Docker stack

After a successful install, the following containers run (from
`docker compose ps` in the app directory):

| Service | Purpose | Port |
| --- | --- | --- |
| `aetheris-web` | Next.js control panel | 3000 |
| `aetheris-worker` | BullMQ background worker | - |
| `aetheris-backend` | FastAPI Python API | 8000 |
| `aetheris-postgres` | PostgreSQL database | 5432 |
| `aetheris-redis` | Queue and cache | 6379 |

Open <http://127.0.0.1:3000> for the control panel and
<http://127.0.0.1:8000/docs> for the interactive API documentation.

## Managing the stack

Everything the wizard can do is also available as plain commands, both from
the installer itself (see `--status` / `--start` / `--stop` / `--logs`
above) and from the app repository, which ships a cross-platform manager:

```powershell
# From the aetheris-app checkout, on Windows (Docker Desktop)
powershell -ExecutionPolicy Bypass -File scripts\manage.ps1 status
powershell -ExecutionPolicy Bypass -File scripts\manage.ps1 start
powershell -ExecutionPolicy Bypass -File scripts\manage.ps1 stop
powershell -ExecutionPolicy Bypass -File scripts\manage.ps1 logs -Follow
powershell -ExecutionPolicy Bypass -File scripts\manage.ps1 down
```

```bash
# From the aetheris-app checkout, on Linux / macOS / Git Bash
bash scripts/manage.sh status
bash scripts/manage.sh start
bash scripts/manage.sh logs -f
```

Both scripts read `AETHERIS_DB_MODE` from the local `.env` and select
`docker-compose.sqlite.yml` automatically, so they always manage the stack
exactly as it was installed.

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
# Run the test suite (70+ tests)
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
