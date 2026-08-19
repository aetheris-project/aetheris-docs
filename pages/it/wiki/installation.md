# Guida all'installazione

Questa guida copre il deployment del control plane Aetheris su Linux, Windows
e macOS, sia con l'installer automatico (`aetheris-installer`) sia manualmente.
La piattaforma è un unico motore di billing, un unico portale clienti e un
unico set di driver hypervisor (Pterodactyl, Proxmox VE, VirtFusion).

Tempo stimato: 15 minuti automatico, 60 minuti manuale.

## Scegli il tuo sistema operativo

| OS | Setup consigliato | Note |
| --- | --- | --- |
| Linux (Ubuntu 22.04 / Debian 12) | Produzione | servizi systemd, Nginx, Certbot |
| Windows 10/11 | Docker Desktop (WSL2) o nativo | Stessa stack Docker di Linux; niente WSL con Docker Desktop |
| macOS 13+ | Sviluppo | launchd plist, prerequisiti Homebrew |

Su ogni sistema operativo il percorso più rapido e ripetibile è Docker
(sezione 2): esegue database, Redis, web, worker e backend Python con gli
stessi comandi su Linux, macOS e Windows.

## 1. Installer automatico (tutti i sistemi operativi)

La repo `aetheris-installer` fornisce un wizard in stile archinstall e una
modalità `--yes` completamente scriptabile. Riferimento completo: `installer.md`.

```bash
git clone https://github.com/aetheris-project/aetheris-installer.git
cd aetheris-installer
python -m aetheris_installer --yes
```

Esegui prima `--dry-run` per rivedere ogni azione senza toccare il disco:

```bash
python -m aetheris_installer --yes --dry-run
```

L'installer scrive il layout di deployment sotto `./aetheris-deploy`, crea i
file `.env` di app e backend, installa le dipendenze Node e Python, genera le
unità di servizio per l'OS rilevato e verifica gli endpoint.

## 2. Docker (tutti i sistemi operativi)

L'intera stack è distribuita come immagini Docker e si comporta in modo
identico su Linux, macOS e Windows (Docker Desktop con backend WSL2). Questo è
il percorso consigliato su Windows: niente Node, Python, PostgreSQL o Redis da
installare nativamente.

### 2.1 Prerequisiti

- Docker Engine 24+ su Linux, oppure Docker Desktop su Windows / macOS.
- Almeno 4 GB di RAM disponibili per il motore Docker.
- Un terminale (PowerShell, Git Bash o una shell).

### 2.2 Avvia la stack

```bash
git clone https://github.com/aetheris-project/aetheris-app.git
cd aetheris-app
cp .env.example .env
# imposta un AETHERIS_SECRET forte (>= 32 caratteri), es. openssl rand -hex 32
AETHERIS_SECRET=$(openssl rand -hex 32)
docker compose up -d --build
```

Servizi avviati da `docker-compose.yml`:

| Servizio | Nome container | Porta esposta |
| --- | --- | --- |
| PostgreSQL 16 | aetheris-db | 5432 |
| Redis 7 | aetheris-redis | 6379 |
| Web Next.js | aetheris-web | 3000 |
| Worker BullMQ | aetheris-worker | - |
| Backend Python | aetheris-backend | 8000 |

### 2.3 Verifica

```bash
docker compose ps                       # tutti i servizi healthy
curl -sS -o /dev/null -w '%{http_code}\n' http://localhost:3000/login
curl -sS http://localhost:8000/health
```

### 2.4 Specifiche per Windows

1. Installa Docker Desktop da https://www.docker.com/products/docker-desktop/
   e mantieni il backend WSL2 predefinito.
2. Esegui i comandi da PowerShell o Git Bash; il file compose non richiede
   modifiche di percorso o di fine riga (l'entrypoint del container è LF-safe).
3. Tutto gira in container Linux: non servono distribuzioni WSL né toolchain
   native.

### 2.5 Operazioni

```bash
docker compose logs -f web       # log web
docker compose logs -f worker    # log worker
docker compose down              # stop (i volumi dati restano)
docker compose down -v           # stop e cancellazione volumi dati
```

L'entrypoint applica le migrazioni Prisma pendenti a ogni boot, quindi una
stack nuova è pronta al primo avvio. Per esporre la web UI dietro Nginx/Caddy,
fai da proxy a `http://127.0.0.1:3000` (vedi il blocco Nginx nella sezione
Linux per gli header WebSocket richiesti dalla console VNC).

## 3. Linux (produzione)

### 3.1 Prerequisiti

Supportati: Ubuntu 22.04 LTS (consigliato) e Debian 12.

| Risorsa | Minimo | Consigliato |
| --- | --- | --- |
| CPU | 2 vCPU | 4 vCPU |
| RAM | 2 GB | 4 GB |
| Disco | 10 GB liberi | 20 GB NVMe |
| Rete | 100 Mbps | 1 Gbps |

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs postgresql redis-server nginx certbot python3-certbot-nginx
```

Apri `80/tcp` e `443/tcp` sul firewall; tieni PostgreSQL e Redis solo su
loopback.

```bash
sudo -u postgres psql <<'SQL'
CREATE USER aetheris WITH PASSWORD 'change-me-strong';
CREATE DATABASE aetheris OWNER aetheris;
GRANT ALL PRIVILEGES ON DATABASE aetheris TO aetheris;
SQL
redis-cli ping   # atteso: PONG
```

### 3.2 Percorso automatico

```bash
python -m aetheris_installer --yes \
  --target /opt/aetheris \
  --web-port 3000 \
  --admin-email ops@example.com \
  --admin-password 'a-very-long-password'
```

L'installer scrive le unità systemd (`aetheris-web.service`,
`aetheris-worker.service`, `aetheris-backend.service`) sotto
`/opt/aetheris/deploy`. Installale e avviale:

```bash
sudo cp /opt/aetheris/deploy/*.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now aetheris-web aetheris-worker aetheris-backend
```

### 3.3 Percorso manuale

```bash
git clone https://github.com/aetheris-project/aetheris-app.git
sudo mkdir -p /opt
sudo mv aetheris-app /opt/aetheris-app   # le unità systemd sotto assumono questo percorso
cd /opt/aetheris-app
npm ci
npx prisma generate
npx prisma migrate deploy
npm run build
cp .env.example .env
```

Imposta almeno in `.env`:

```ini
DATABASE_URL=postgresql://aetheris:change-me-strong@127.0.0.1:5432/aetheris
REDIS_URL=redis://127.0.0.1:6379
AETHERIS_APP_URL=https://app.example.com
AETHERIS_SECRET=<openssl rand -hex 32>
NEXTAUTH_URL=https://app.example.com
NEXTAUTH_SECRET=<openssl rand -hex 32>
```

Crea il super-admin (hashing scrypt, idempotente):

```bash
DATABASE_URL='postgresql://aetheris:change-me-strong@127.0.0.1:5432/aetheris' \
ADMIN_EMAIL='ops@example.com' \
ADMIN_PASSWORD='a-very-long-password' \
node --input-type=module -e "
import { PrismaClient } from '@prisma/client';
import { scryptSync, randomBytes } from 'node:crypto';
const salt = randomBytes(16).toString('hex');
const hash = scryptSync(process.env.ADMIN_PASSWORD, salt, 64).toString('hex');
const prisma = new PrismaClient();
await prisma.user.upsert({
  where: { email: process.env.ADMIN_EMAIL },
  update: {},
  create: { email: process.env.ADMIN_EMAIL, passwordHash: 'scrypt:' + salt + ':' + hash, role: 'superadmin', name: 'Aetheris Administrator' }
});
await prisma.$disconnect();
"
```

### 3.4 Unità systemd (manuale)

`/etc/systemd/system/aetheris-web.service`:

```ini
[Unit]
Description=Aetheris control plane (Next.js)
After=network.target postgresql.service redis-server.service
Wants=network.target

[Service]
Type=simple
WorkingDirectory=/opt/aetheris-app
EnvironmentFile=/opt/aetheris-app/.env
ExecStart=/usr/bin/node /opt/aetheris-app/node_modules/next/dist/bin/next start -p 3000
Restart=on-failure
RestartSec=3

[Install]
WantedBy=multi-user.target
```

`/etc/systemd/system/aetheris-worker.service`:

```ini
[Unit]
Description=Aetheris background workers (BullMQ)
After=network.target redis-server.service
Wants=network.target

[Service]
Type=simple
WorkingDirectory=/opt/aetheris-app
EnvironmentFile=/opt/aetheris-app/.env
ExecStart=/usr/bin/node /opt/aetheris-app/node_modules/.bin/tsx /opt/aetheris-app/src/workers/index.ts
Restart=on-failure
RestartSec=5

[Install]
WantedBy=multi-user.target
```

`/etc/systemd/system/aetheris-backend.service` (API REST Python):

```ini
[Unit]
Description=Aetheris Python backend API
After=network.target
Wants=network.target

[Service]
Type=simple
WorkingDirectory=/opt/aetheris-app/backend
ExecStart=/opt/aetheris-app/backend/.venv/bin/python -m uvicorn aetheris_backend.main:app --host 127.0.0.1 --port 8000
Restart=on-failure
RestartSec=3

[Install]
WantedBy=multi-user.target
```

### 3.5 Reverse proxy Nginx e TLS

`/etc/nginx/sites-available/aetheris`:

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name app.example.com;

    client_max_body_size 32m;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        # Richiesto dal tunnel WebSocket della console VNC.
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_read_timeout 600s;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/aetheris /etc/nginx/sites-enabled/aetheris
sudo nginx -t
sudo systemctl reload nginx
sudo certbot --nginx -d app.example.com
```

## 4. Windows

Il percorso più veloce su Windows è l'installer automatico, che genera script
di avvio e registrazione in Task Scheduler. WSL2 è consigliato per
un'esperienza simile alla produzione.

### 4.1 Windows nativo (automatico)

```bash
git clone https://github.com/aetheris-project/aetheris-installer.git
cd aetheris-installer
python -m venv .venv
.venv\Scripts\activate
python -m aetheris_installer --yes
```

L'installer scrive `deploy\start-backend.bat`, `deploy\start-web.bat`
e `deploy\register-schtasks.cmd`. Avvia i servizi in due terminali:

```bat
aetheris-deploy\aetheris-app\backend\start-backend.bat
aetheris-deploy\aetheris-app\start-web.bat
```

Registrali all'avvio (una volta, da Amministratore):

```bat
aetheris-deploy\deploy\register-schtasks.cmd
```

### 4.2 Windows nativo (manuale)

```bat
git clone https://github.com/aetheris-project/aetheris-app.git
cd aetheris-app
npm ci
npx prisma generate
npx prisma migrate deploy
npm run build
copy .env.example .env
npm run start   # in stile produzione; usa npm run dev durante lo sviluppo
```

Il backend Python:

```bat
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
python run.py --port 8000
```

Requisiti su Windows: Node.js 20.x LTS, Python 3.10+ e un PostgreSQL/Redis
locale (oppure usa il backend Python con SQLite per le demo, che non ne
richiede).

### 4.3 Windows via WSL2

Installa WSL2 con Ubuntu 22.04, poi segui alla lettera la sezione Linux:

```bash
wsl --install -d Ubuntu-22.04
wsl
# poi: le istruzioni Linux della sezione 3
```

## 5. macOS

### 5.1 Prerequisiti

Installa i prerequisiti con Homebrew:

```bash
brew install node@20 postgresql@16 redis nginx
brew services start postgresql@16
brew services start redis
```

### 5.2 Percorso automatico

```bash
python -m aetheris_installer --yes \
  --target ~/aetheris \
  --backend-port 8000
```

L'installer scrive `com.aetheris.backend.plist` sotto `deploy/`. Caricalo con
launchd:

```bash
mkdir -p ~/Library/LaunchAgents
cp ~/aetheris/deploy/com.aetheris.backend.plist ~/Library/LaunchAgents/
launchctl bootstrap gui/$(id -u) ~/Library/LaunchAgents/com.aetheris.backend.plist
# per scaricarlo: launchctl bootout gui/$(id -u) ~/Library/LaunchAgents/com.aetheris.backend.plist
```

### 5.3 Percorso manuale

```bash
git clone https://github.com/aetheris-project/aetheris-app.git
cd aetheris-app
npm ci
npx prisma generate
npx prisma migrate deploy
npm run build
cp .env.example .env
npm run dev
```

Backend Python (per demo, SQLite non richiede un server database):

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python run.py --port 8000
```

Nota su Apple Silicon: Node.js e Python si installano puliti con Homebrew e
`pyenv`; tutti i driver sono client HTTP puri, quindi non servono binding
nativi.

## 6. Collegare Pterodactyl (tutte le piattaforme)

1. Crea una chiave Application API nel Pannello Pterodactyl
   (`Admin -> Application API`) con lettura/scrittura su Servers, Nodes,
   Allocations, Eggs e Users. Salvala come `PTERODACTYL_APP_API_KEY`.
2. Crea una chiave Client API dal front end
   (`Account -> API Credentials`) per power, telemetria, token console e
   backup. Salvala come `PTERODACTYL_CLIENT_API_KEY`.
3. Verifica la connettività:

```bash
curl -sS -H "Authorization: Bearer $PTERODACTYL_APP_API_KEY" \
     -H "Accept: application/vnd.pterodactyl.v1+json" \
     "https://panel.example.com/api/application/nodes?per_page=1"
```

4. Nell'Admin Panel, sotto `Nodes`, aggiungi una credenziale hypervisor di tipo
   `pterodactyl`, poi `Synchronize nodes`. Assegna gli egg ai piani prodotto.

Flusso di provisioning: il cliente ordina un piano, Aetheris sceglie il nodo
target, risolve un'allocazione libera e chiama `POST /api/application/servers`
con egg, immagine, limiti di risorse e feature. Sospensione, rebuild e
terminazione usano l'Application API; power, telemetria, console e backup la
Client API.

Setup di Proxmox VE e VirtFusion: vedi `proxmox-setup.md` e
`virtfusion-setup.md`.

## 7. Checklist di verifica

```bash
# Il web risponde
curl -sS -o /dev/null -w '%{http_code}\n' http://127.0.0.1:3000/login

# Il backend Python è healthy
curl -sS http://127.0.0.1:8000/health

# I worker stanno processando le code (Linux)
sudo journalctl -u aetheris-worker -n 50 --no-pager

# Redis è usato da BullMQ
redis-cli keys 'bull:*' | head
```

## 8. Troubleshooting

| Sintomo | Causa e fix |
| --- | --- |
| Il web non parte, errore di ambiente | `src/lib/config/env.ts` si ferma con la variabile esatta. Impostala in `.env` e riavvia. |
| `prisma migrate deploy` fallisce | Conferma che `DATABASE_URL` usi un utente con diritti `CREATE`. |
| Job di provisioning bloccati in coda | Controlla i log del worker; la causa più comune è una 401 da una chiave Pterodactyl ruotata. |
| La console non mostra frame | Il reverse proxy deve inoltrare `Upgrade` e `Connection: upgrade` (sezione 3.5). |
| Il login del backend restituisce 422 | L'email usa un TLD riservato (`.local`, `.test`); usa un dominio reale o `example.com`. |
| `docker compose up` fallisce su Windows | Abilita il backend WSL2 nelle impostazioni di Docker Desktop e riavvia il motore. |
| Le migrazioni non girano nei container | L'entrypoint esegue `prisma migrate deploy` al boot; controlla `docker compose logs web`. |
| Redis connection refused | Redis ascolta su loopback; se Aetheris gira in un container imposta `REDIS_URL` all'indirizzo host. |

## 9. Prossimi passi

- Riferimento installer automatico: `installer.md`.
- Riferimento backend Python: `backend.md`.
- Temi e whitelabel: `theming.md`.
- Moduli e integrazioni: `addons.md`.
- Store delle integrazioni: `store.md`.
- Whitelabel dinamico via Admin Panel: `whitelabel.md`.
- Bridge Pterodactyl: `pterodactyl-bridge.md`.
- Backend hypervisor personalizzato: `../sdk/custom-adapter.md`.
- Riferimento API REST: `../api/reference.md`.
