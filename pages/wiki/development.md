# Development

This page is for contributors and for operators who want to run Aetheris
from source, extend it, or build the Windows installer.

## Repository layout

Aetheris is organized as a monorepo-ready set of repositories under the
`aetheris-project` GitHub organization:

| Repository | Purpose |
| --- | --- |
| `aetheris-app` | Web app, backend, workers, Prisma schema, install scripts |
| `aetheris-website` | Marketing site with the interactive product demo |
| `aetheris-docs` | This wiki, the SDK guide and the OpenAPI specification |
| `aetheris-addons` | Modules, themes and integrations store |
| `aetheris-windows-installer` | Windows TUI installer + winget manifests |
| `aetheris-installer` | Linux/macOS automated installer |

## Local development environment

### Web + backend (Docker)

```bash
git clone https://github.com/aetheris-project/aetheris-app.git
cd aetheris-app
cp .env.example .env

# Start PostgreSQL + Redis only for a fast inner loop
docker compose up -d postgres redis

npm install
npx prisma migrate dev
npm run dev          # web on :3000
cd backend && pip install -r requirements.txt && python run.py --reload
```

### Type checking and tests

```bash
# Web app (strict TypeScript)
cd aetheris-app
npx tsc --noEmit
npm test

# Python backend
cd backend
python -m pytest
```

The test suite must stay green before any merge; CI runs it on every push
and pull request.

## Code conventions

- **TypeScript**: strict mode, no `any` leaks, explicit return types on
  exported functions.
- **Python**: PEP 8, type hints on public functions, docstrings in
  Google style.
- **English only** in code, comments, UI strings and documentation.
- **CLS = 0**: animations and toggles must not shift layout; use reserved
  space or transforms.
- **Components**: one component per file, exported as a named export.
- **Tests**: every new behavior ships with a test; mock all network calls.

## Driver development

Hypervisor backends implement the driver contract in
`aetheris-app/lib/adapters/hypervisors`. The full interface, the typed
lifecycle models and the error taxonomy are documented in the repository
README and in the [Custom adapter SDK](../sdk/custom-adapter.md) page.

To add a driver:

1. Create `lib/adapters/hypervisors/<name>.ts` implementing the interface.
2. Add a discriminated config type and a catalog entry with validation.
3. Add unit tests with a mocked HTTP layer.
4. Register the driver in the registry so the Admin Panel can instantiate
   it by name.

## Building the Windows installer

The installer is a PyInstaller one-file executable built from
`aetheris-windows-installer`:

```bash
cd aetheris-windows-installer
python -m venv .venv
# Windows:
.venv\Scripts\activate
# Linux / macOS:
source .venv/bin/activate

pip install -e ".[dev]" pyinstaller windows-curses
python tools/build_exe.py
```

The executable lands in `dist/aetheris-windows-installer.exe`. Test it
before releasing:

```bash
./dist/aetheris-windows-installer.exe --version
./dist/aetheris-windows-installer.exe --both --dry-run
```

Run the test suite: `python -m pytest -q`.

### Release checklist (installer)

1. Bump the version in `aetheris_wininstaller/__init__.py`,
   `tools/version_info.txt` and `pyproject.toml`.
2. Run the tests and rebuild the executable.
3. Verify `--version`, `--both --dry-run` and the TUI launch.
4. Create a GitHub release with the executable attached.
5. Update the winget manifests in `winget/` (new hash, new version) and
   open a PR to `microsoft/winget-pkgs` (see `winget/README.md`).

## Pull request workflow

1. Branch from `main`, name it `feature/<short-description>` or
   `fix/<short-description>`.
2. Keep the change focused; one logical change per PR.
3. Include tests for new behavior.
4. Open the PR against `main` and link the issue if one exists.
5. CI must pass before merge.

## Contributing documentation

Wiki pages live in `aetheris-docs/pages/wiki` (single language, English).
Each page is a Markdown file; the sidebar order is defined by
`pages/wiki/_meta.json`. Run the docs build to verify:

```bash
cd aetheris-docs
npm install
npm run build
```
