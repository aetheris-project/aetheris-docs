# Sviluppo

Questa pagina è per i contributor e per gli operatori che vogliono eseguire
Aetheris dal sorgente, estenderlo o compilare l'installer Windows.

## Struttura dei repository

Aetheris è organizzato come un insieme di repository monorepo-ready sotto
l'organizzazione GitHub `aetheris-project`:

| Repository | Scopo |
| --- | --- |
| `aetheris-app` | Web app, backend, workers, schema Prisma, script di installazione |
| `aetheris-website` | Sito marketing con la demo interattiva del prodotto |
| `aetheris-docs` | Questa wiki, la guida SDK e la specifica OpenAPI |
| `aetheris-addons` | Store di moduli, temi e integrazioni |
| `aetheris-windows-installer` | Installer TUI Windows + manifest winget |
| `aetheris-installer` | Installer automatizzato Linux/macOS |

## Ambiente di sviluppo locale

### Web + backend (Docker)

```bash
git clone https://github.com/aetheris-project/aetheris-app.git
cd aetheris-app
cp .env.example .env

# Avvia solo PostgreSQL + Redis per un loop interno veloce
docker compose up -d postgres redis

npm install
npx prisma migrate dev
npm run dev          # web su :3000
cd backend && pip install -r requirements.txt && python run.py --reload
```

### Type checking e test

```bash
# Web app (TypeScript strict)
cd aetheris-app
npx tsc --noEmit
npm test

# Backend Python
cd backend
python -m pytest
```

La suite di test deve restare verde prima di qualsiasi merge; la CI la esegue
a ogni push e pull request.

## Convenzioni di codice

- **TypeScript**: strict mode, nessuna fuga di `any`, tipi di ritorno
  espliciti sulle funzioni esportate.
- **Python**: PEP 8, type hint sulle funzioni pubbliche, docstring in stile
  Google.
- **Solo inglese** in codice, commenti, stringhe UI e documentazione.
- **CLS = 0**: le animazioni e i toggle non devono spostare il layout; usa
  spazio riservato o transform.
- **Componenti**: un componente per file, esportato come named export.
- **Test**: ogni nuovo comportamento viene distribuito con un test; mocka
  tutte le chiamate di rete.

## Sviluppo dei driver

I backend degli hypervisor implementano il contratto driver in
`aetheris-app/lib/adapters/hypervisors`. L'interfaccia completa, i modelli di
lifecycle tipizzati e la tassonomia degli errori sono documentati nel README
del repository e nella pagina [Custom adapter SDK](../sdk/custom-adapter.md).

Per aggiungere un driver:

1. Crea `lib/adapters/hypervisors/<nome>.ts` implementando l'interfaccia.
2. Aggiungi un tipo config discriminato e una voce di catalogo con
   validazione.
3. Aggiungi unit test con un layer HTTP mockato.
4. Registra il driver nel registry così il Pannello Admin può istanziarlo per
   nome.

## Compilare l'installer Windows

L'installer è un eseguibile one-file PyInstaller compilato da
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

L'eseguibile finisce in `dist/aetheris-windows-installer.exe`. Testalo prima
della release:

```bash
./dist/aetheris-windows-installer.exe --version
./dist/aetheris-windows-installer.exe --both --dry-run
```

Esegui la suite di test: `python -m pytest -q`.

### Checklist di release (installer)

1. Aumenta la versione in `aetheris_wininstaller/__init__.py`,
   `tools/version_info.txt` e `pyproject.toml`.
2. Esegui i test e ricompila l'eseguibile.
3. Verifica `--version`, `--both --dry-run` e l'avvio del TUI.
4. Crea una release GitHub con l'eseguibile allegato.
5. Aggiorna le manifest winget in `winget/` (nuovo hash, nuova versione) e
   apri una PR su `microsoft/winget-pkgs` (vedi `winget/README.md`).

## Workflow delle pull request

1. Crea un branch da `main`, chiamalo `feature/<descrizione-breve>` o
   `fix/<descrizione-breve>`.
2. Mantieni la modifica focalizzata; un cambiamento logico per PR.
3. Includi i test per il nuovo comportamento.
4. Apri la PR verso `main` e collega l'issue se esiste.
5. La CI deve passare prima del merge.

## Contribuire alla documentazione

Le pagine della wiki vivono in `aetheris-docs/pages/en/wiki` (inglese) e
`aetheris-docs/pages/it/wiki` (italiano). Mantieni sincronizzate entrambe le
lingue quando cambi una pagina. Verifica la build della docs:

```bash
cd aetheris-docs
npm install
npm run build
```
