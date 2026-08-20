# Windows Installer — Development

Build from source and winget packaging.

## Build the exe

```bash
cd aetheris-windows-installer
python -m venv .venv
.venv\Scripts\activate
pip install -e .[build]
python tools/build_exe.py
```

Entry point: `aetheris_wininstaller/__main__.py` (absolute imports required for PyInstaller).

## Run tests

```bash
.venv\Scripts\python -m pytest -q
```

70+ tests covering the wizard, CLI flags and stack management.

## Winget packaging

Manifests live under `winget/`:

```text
winget/
├── AetherisProject.AetherisWindowsInstaller.installer.yaml
├── AetherisProject.AetherisWindowsInstaller.locale.en-US.yaml
├── AetherisProject.AetherisWindowsInstaller.locale.it-IT.yaml
└── AetherisProject.AetherisWindowsInstaller.yaml
```

Release workflow:

1. Rebuild the exe and get the SHA-256:
   ```powershell
   Get-FileHash .\dist\aetheris-windows-installer.exe -Algorithm SHA256
   ```
2. Update `InstallerSha256` in the manifest.
3. Validate: `winget validate --manifest winget`.
4. Push to `microsoft/winget-pkgs`.

See also: [CLI reference](windows-installer-cli.md), [Installation](installation.md).
