# Installer automatico

La repo `aetheris-installer` include un wizard terminale in stile archinstall e
una modalità non interattiva completamente scriptabile per distribuire il
control plane Aetheris su Linux, macOS e Windows. Crea il layout di deployment,
scrive i file di ambiente, installa le dipendenze, genera le unità di servizio
native per il sistema operativo rilevato e verifica il risultato.

Repository: <https://github.com/aetheris-project/aetheris-installer>

## Requisiti

- Python 3.10 o successivo
- Node.js 20.x LTS (solo per i componenti web/app)
- git

## Installa l'installer

```bash
git clone https://github.com/aetheris-project/aetheris-installer.git
cd aetheris-installer
python -m venv .venv

# Windows
.venv\Scripts\activate
# Linux / macOS
source .venv/bin/activate

pip install pytest   # serve solo per la suite di test
```

## Wizard interattivo

```bash
python -m aetheris_installer
```

Su terminali con supporto curses si apre uno schermo in stile archinstall:
usa le frecce (o `j`/`k`) per muoverti, `Space` per attivare/disattivare un
componente, `Invio` per avviare l'installazione e `q` per uscire. Su terminali
senza curses (in particolare Windows) l'installer ripiega su semplici prompt.

Componenti che puoi attivare:

| Componente | Installa |
| --- | --- |
| Website | Sito marketing e demo interattiva |
| App | Control plane, motore di billing, driver hypervisor |
| Backend | API REST Python (FastAPI, SQLite) |
| Docs | Wiki Nextra (opzionale) |
| Servizi | Unità systemd / launchd / Windows Task Scheduler |

## Modalità non interattiva

```bash
python -m aetheris_installer --yes
```

Il flag `--yes` esegue ogni passo con i default ed è sicuro per CI e script di
provisioning. I preset e le variabili d'ambiente `AETHERIS_INSTALL_*`
configurano tutto il resto:

```bash
AETHERIS_INSTALL_WEB_PORT=5555 \
AETHERIS_INSTALL_ADMIN_EMAIL=ops@example.com \
python -m aetheris_installer --yes
```

I preset sono file JSON che mappano qualsiasi campo di configurazione:

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

## Cosa scrive

```
aetheris-deploy/
├── aetheris-app/
│   ├── .env                      # ambiente app
│   └── backend/
│       ├── .env                  # ambiente backend
│       └── .venv/                # virtualenv Python
├── aetheris-website/             # checkout del sito
├── aetheris-docs/                # checkout dei docs (opzionale)
└── deploy/
    ├── aetheris-web.service      # Linux: unità systemd
    ├── aetheris-worker.service
    ├── aetheris-backend.service
    ├── com.aetheris.backend.plist   # macOS: launchd
    ├── start-backend.bat            # Windows: script di avvio
    ├── start-web.bat
    └── register-schtasks.cmd
```

L'installer non scrive mai fuori dalla directory target. Esegui `--dry-run`
per stampare ogni azione senza toccare il disco.

## Flag

| Flag | Effetto |
| --- | --- |
| `--yes` | Esecuzione non interattiva con i default |
| `--preset PATH` | Carica un file preset JSON |
| `--target DIR` | Directory di deployment (default `./aetheris-deploy`) |
| `--web-port N` | Porta del server web |
| `--backend-port N` | Porta dell'API backend |
| `--admin-email` / `--admin-password` | Credenziali superadmin |
| `--dry-run` | Stampa le azioni senza scrivere |
| `--skip-checks` | Salta i controlli preflight |
| `--skip-deps` | Salta l'installazione delle dipendenze |
| `--no-services` | Non scrivere i file di servizio |
| `--no-app` / `--no-backend` / `--no-website` | Selezione componenti |

Codici di uscita: `0` successo; `1` fallimento preflight o di un passo.

## Prossimi passi

- Guida per-OS completa: vedi `installation.md`.
- Riferimento backend Python: vedi `backend.md`.
- Temi e whitelabel: vedi `theming.md`.
