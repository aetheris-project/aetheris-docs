# Guida all'installazione

Deploy del pannello di controllo Aetheris su Linux, Windows o macOS. Il percorso più rapido è Docker — funziona identico su ogni OS.

Tempo stimato: 15 minuti automatico, 60 minuti manuale.

## Scegli il percorso

| Percorso | Ideale per | Tempo |
| --- | --- | --- |
| [Installer automatico](installation-automated.md) | Tutti gli OS — wizard TUI | 15 min |
| [Docker](docker.md) | Tutti gli OS — senza strumenti nativi | 10 min |
| [Linux produzione](linux-setup.md) | Server Ubuntu / Debian | 60 min |
| [Windows](windows-setup.md) | Desktop o server | 15 min |
| [macOS](macos-setup.md) | Sviluppo | 20 min |

## Quick start (Docker)

```bash
git clone https://github.com/aetheris-project/aetheris-app.git
cd aetheris-app
cp .env.example .env
docker compose up -d --build
```

Il stack include PostgreSQL, Redis, web Next.js, worker BullMQ e il backend Python.

## Verifica

```bash
curl -sS -o /dev/null -w '%{http_code}\n' http://127.0.0.1:3000/login
curl -sS http://127.0.0.1:8000/health
```

Vedi anche: [Requisiti di sistema](system-requirements.md), [Variabili d'ambiente](environment-variables.md), [Troubleshooting](troubleshooting.md).
