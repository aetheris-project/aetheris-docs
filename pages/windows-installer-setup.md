# Windows Installer — Setup

Interactive wizard and first-time installation.

## Interactive wizard

Launch the exe to open the curses TUI wizard with arrow-key navigation.

**Setup section:**

1. **Install dependencies only** — Docker Desktop, Git, Node.js, Python
2. **Install software only** — clone + start Docker stack
3. **Install dependencies and software** — full setup
4. **Uninstall** — stop stack, remove volumes and app directory

**Manage section:**

5. **Stack status** — colored per service state
6. **Start / Stop the stack**
7. **Console** — live `docker compose logs -f`

**Updates section:**

9. **Update installer** — self-update from GitHub Releases
10. **Update software** — pull latest images, recreate containers

Update actions always ask for confirmation **twice**.

## TUI keys

| Key | Action |
| --- | --- |
| Up / Down or j / k | Move selection |
| Space / Enter | Confirm |
| q / Esc | Back / quit |

## Verifying the install

```powershell
docker compose ps
curl.exe -fsSI http://127.0.0.1:3000 | Select-Object -First 1
curl.exe -fsS http://127.0.0.1:8000/health
```

## Uninstalling

Run `--uninstall` or manually:

```powershell
cd <target>\aetheris-app
docker compose down -v
cd ..
Remove-Item -Recurse -Force <target>
```

See also: [CLI reference](windows-installer-cli.md), [Installation](installation.md).
