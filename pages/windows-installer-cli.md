# Windows Installer — CLI reference

All command-line flags for the installer exe.

## Flags

| Flag | Effect |
| --- | --- |
| `--dir PATH` | Target directory for the checkout |
| `--deps` | Install dependencies only |
| `--software` | Install the stack only |
| `--both` | Dependencies + stack |
| `--uninstall` | Stop stack, remove volumes and app directory |
| `--status` | Show container state |
| `--start` | `docker compose up -d` |
| `--stop` | `docker compose stop` |
| `--logs` | Print last N log lines |
| `--tail N` | Log lines for `--logs` (default 200) |
| `--update-stack` | Pull latest images + recreate |
| `--update` | Self-update (asks twice) |
| `--update-check` | Check if newer release exists |
| `--db postgres\|sqlite` | Database engine |
| `--no-env` | Skip writing `.env` |
| `--dry-run` | Print commands without executing |
| `--version` | Print version and exit |

## Examples

```powershell
# Preview without touching the machine
aetheris-windows-installer --both --dry-run

# Full non-interactive install
aetheris-windows-installer --both --dir D:\aetheris

# Dependencies only
aetheris-windows-installer --deps

# Day-to-day management
aetheris-windows-installer --status
aetheris-windows-installer --start
aetheris-windows-installer --stop
aetheris-windows-installer --logs --tail 300

# Update
aetheris-windows-installer --update-stack
aetheris-windows-installer --update

# Tear down
aetheris-windows-installer --uninstall
```

See also: [Setup](windows-installer-setup.md), [Development](windows-installer-dev.md).
