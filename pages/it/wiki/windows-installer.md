# Installer Windows

Il repository `aetheris-windows-installer` fornisce il modo ufficiale per
eseguire la piattaforma Aetheris su Windows 10/11. La piattaforma gira come
stack Docker (web, worker, backend Python, PostgreSQL, Redis); questo
installer gestisce tutto il resto - installazione delle dipendenze, clonazione
e avvio dello stack e disinstallazione completa.

Repository: <https://github.com/aetheris-project/aetheris-windows-installer>

## Installazione

### Tramite winget (consigliato)

```powershell
winget install AetherisProject.AetherisWindowsInstaller
```

Winget scarica l'asset della release da GitHub, verifica il checksum SHA-256
contro il manifest pubblicato e installa Docker Desktop e Git for Windows
come dipendenze dichiarate. L'installer stesso non richiede privilegi
elevati oltre a quelli necessari a Docker Desktop.

### Manuale

Scarica `aetheris-windows-installer.exe` dall'
[ultima release](https://github.com/aetheris-project/aetheris-windows-installer/releases)
ed eseguilo. Il doppio click apre la procedura guidata TUI interattiva.

## Cosa gestisce l'installer

| Aspetto | Come |
| --- | --- |
| Docker Desktop | Installato via winget (`Docker.DockerDesktop`), avvio automatico |
| Git for Windows | Installato via winget (`Git.Git`), necessario per il clone |
| Node.js LTS | Installazione opzionale tramite winget |
| Python 3.12 | Installazione opzionale tramite winget |
| Lo stack | Clona `aetheris-app` ed esegue `docker compose up -d --build` |
| Disinstallazione | Ferma lo stack, rimuove i volumi e la directory dell'app |

## Procedura guidata interattiva

Avvia l'exe (oppure esegui `aetheris-windows-installer` da un terminale) per
aprire la procedura TUI curses con navigazione frecce, cornice box-drawing e
il colore accent di Aetheris. Su terminali senza supporto curses la procedura
ricade automaticamente su prompt in testo semplice.

Passaggi della procedura:

1. **Benvenuto** - riepilogo di cosa verrà installato.
2. **Directory di destinazione** - scegli dove vivrà `aetheris-app`.
3. **File ambiente** - scrivi `.env` ora (consigliato) o più tardi a mano.
4. **Motore database** - container PostgreSQL (default) o file SQLite
   locale `.db` (consigliato per i test).
5. **Controllo dipendenze** - verifica Docker Desktop, git, Node.js e Python.
6. **Installazione** - winget installa le dipendenze mancanti, l'app viene
   clonata, lo stack parte e il risultato viene verificato.

### Tasti della TUI

| Tasto | Azione |
| --- | --- |
| Su / Giù | Sposta la selezione |
| Spazio / Invio | Conferma e avanza |
| q / Esc | Indietro / esci |

## Riga di comando

L'exe è completamente scriptabile:

| Flag | Effetto |
| --- | --- |
| `--yes` | Modalità non interattiva con i default (adatta alla CI) |
| `--target PATH` | Directory di destinazione per il checkout |
| `--deps` | Installa solo le dipendenze (Docker Desktop, Git, Node, Python) |
| `--software` | Installa solo lo stack (clone + `compose up`) |
| `--both` | Dipendenze e stack |
| `--uninstall` | Ferma lo stack, rimuove i volumi e la directory dell'app |
| `--dry-run` | Stampa ogni comando senza eseguire nulla |
| `--version` | Stampa la versione ed esce |

### Esempi

```powershell
# Anteprima di tutto senza toccare la macchina
aetheris-windows-installer --both --dry-run

# Installazione completa non interattiva con target personalizzato
aetheris-windows-installer --both --target D:\aetheris

# Solo dipendenze (hai già clonato il repo a mano)
aetheris-windows-installer --deps

# Smonta tutto
aetheris-windows-installer --uninstall
```

## Lo stack Docker

Dopo un'installazione riuscita girano i seguenti container (da
`docker compose ps` nella directory dell'app):

| Servizio | Scopo | Porta |
| --- | --- | --- |
| `aetheris-web` | Control plane Next.js | 3000 |
| `aetheris-worker` | Worker BullMQ in background | - |
| `aetheris-backend` | API Python FastAPI | 8000 |
| `aetheris-postgres` | Database PostgreSQL | 5432 |
| `aetheris-redis` | Coda e cache | 6379 |

Apri <http://127.0.0.1:3000> per il control plane e
<http://127.0.0.1:8000/docs> per la documentazione API interattiva.

## Verifica dell'installazione

```powershell
# I container sono attivi
docker compose ps

# L'app web risponde
curl.exe -fsSI http://127.0.0.1:3000 | Select-Object -First 1

# Il backend è sano
curl.exe -fsS http://127.0.0.1:8000/health

# Docker stesso è sano
docker info --format "{{.ServerVersion}}"
```

## Disinstallazione

Esegui l'exe con `--uninstall`, oppure manualmente:

```powershell
cd <target>\aetheris-app
docker compose down -v
cd ..
Remove-Item -Recurse -Force <target>
```

`--uninstall` ferma lo stack, rimuove i volumi Docker e cancella la directory
dell'applicazione. Non rimuove Docker Desktop, git o le altre dipendenze -
restano disponibili per altri progetti.

## Risoluzione dei problemi

| Sintomo | Soluzione |
| --- | --- |
| `Docker Desktop is not running` | Avvia Docker Desktop e attendi il motore; rilancia l'installer |
| `git not found` | L'installer installa Git via winget; riapri il terminale dopo |
| `compose up` fallisce | Controlla `docker compose logs --tail=100`; di solito la causa è nel file `.env` nella directory dell'app |
| Porta 3000/8000 occupata | Ferma l'altro servizio, oppure modifica il mapping in `docker-compose.yml` |
| Windows Defender blocca l'exe | Il binario non è firmato; clicca *More info > Run anyway* una volta |
| Winget segnala hash errato | Aggiorna il manifest dal repo (`winget/`) prima di inviarlo a winget-pkgs |

## Sviluppo

Compila l'exe dai sorgenti:

```bash
cd aetheris-windows-installer
python -m venv .venv
.venv\Scripts\activate
pip install -e .[build]
python tools/build_exe.py
```

L'entry point PyInstaller vive in `aetheris_wininstaller/__main__.py` e deve
usare import assoluti (gli import relativi crasano dentro un bundle
PyInstaller). La TUI curses ricade su prompt semplici quando
`windows-curses` non è incluso nel bundle.

```bash
# Esegui la suite di test (40+ test)
.venv\Scripts\python -m pytest -q
```

## Packaging winget

Il repository tiene i manifest winget sotto `winget/`:

```text
winget/
├── AetherisProject.AetherisWindowsInstaller.installer.yaml
├── AetherisProject.AetherisWindowsInstaller.locale.en-US.yaml
├── AetherisProject.AetherisWindowsInstaller.locale.it-IT.yaml
└── AetherisProject.AetherisWindowsInstaller.yaml
```

L'installer dichiara `Docker.DockerDesktop` e `Git.Git` come `Dependencies`,
così winget li installa automaticamente. Quando esce una nuova release:

1. Ricompila l'exe e calcola il nuovo SHA-256:
   ```powershell
   Get-FileHash .\dist\aetheris-windows-installer.exe -Algorithm SHA256
   ```
2. Aggiorna `InstallerSha256` nel manifest installer.
3. Valida: `winget validate --manifest winget`.
4. Invia i manifest a `microsoft/winget-pkgs` sotto
   `manifests/a/AetherisProject/AetherisWindowsInstaller/<version>/`.

## Passi successivi

- Installer multipiattaforma: vedi `installer.md`.
- Setup per ogni OS: vedi `installation.md`.
- Lo stack stesso: vedi `architecture.md` e `backend.md`.
- Operazioni: `monitoring.md`, `backup-and-restore.md`, `upgrades.md`.
