# Installation guide

This guide covers deploying the Aetheris control plane on Linux, Windows
and macOS, both with the automated installer (`aetheris-installer`) and
manually. The platform is one billing engine, one client portal and one
set of hypervisor drivers (Pterodactyl, Proxmox VE, VirtFusion).

Estimated time: 15 minutes automated, 60 minutes manual.

## Choose your operating system

| OS | Recommended setup | Notes |
| --- | --- | --- |
| Linux (Ubuntu 22.04 / Debian 12) | Production | systemd services, Nginx, Certbot |
| Windows 10/11 | Docker Desktop (WSL2) or native | Same Docker stack as Linux; no WSL needed with Docker Desktop |
| macOS 13+ | Development | launchd plist, Homebrew prerequisites |

On every operating system the fastest repeatable path is Docker (section 2):
it runs the database, Redis, web, workers and the Python backend with the
same commands on Linux, macOS and Windows.

The automated installer detects the operating system and generates the
right service units for it. The manual sections below cover each OS in
detail.

## 1. Automated installer (all operating systems)

The `aetheris-installer` repository provides an archinstall-style wizard
and a fully scriptable `--yes` mode. Full reference: `installer.md`.

```bash
git clone https://github.com/aetheris-project/aetheris-installer.git
cd aetheris-installer
python -m aetheris_installer --yes
```

Run `--dry-run` first to review every action without touching disk:

```bash
python -m aetheris_installer --yes --dry-run
```

The installer writes the deployment layout under `./aetheris-deploy`,
creates the app and backend `.env` files, installs Node and Python
dependencies, generates service units for the detected OS and verifies
the endpoints.

## 2. Docker (all operating systems)

The entire stack ships as Docker images and behaves identically on Linux,
macOS and Windows (Docker Desktop with the WSL2 backend). This is the
recommended path on Windows - no Node, Python, PostgreSQL or Redis needs to
be installed natively.

### 2.1 Prerequisites

- Docker Engine 24+ on Linux, or Docker Desktop on Windows / macOS.
- At least 4 GB of RAM available to the Docker engine.
- A terminal (PowerShell, Git Bash or a shell).

### 2.2 Start the stack

```bash
git clone https://github.com/aetheris-project/aetheris-app.git
cd aetheris-app
cp .env.example .env
# set a strong AETHERIS_SECRET (>= 32 chars), e.g. openssl rand -hex 32
AETHERIS_SECRET=$(openssl rand -hex 32)
docker compose up -d --build
```

Services brought up by `docker-compose.yml`:

| Service | Container name | Exposed port |
| --- | --- | --- |
| PostgreSQL 16 | aetheris-db | 5432 |
| Redis 7 | aetheris-redis | 6379 |
| Next.js web | aetheris-web | 3000 |
| BullMQ worker | aetheris-worker | - |
| Python backend | aetheris-backend | 8000 |

### 2.3 Verify

```bash
docker compose ps                       # all services healthy
curl -sS -o /dev/null -w '%{http_code}\n' http://localhost:3000/login
curl -sS http://localhost:8000/health
```

### 2.4 Windows specifics

1. Install Docker Desktop from https://www.docker.com/products/docker-desktop/
   and keep the default WSL2 backend.
2. Run the commands from PowerShell or Git Bash; the compose file needs no
   path or line-ending changes (the container entrypoint is LF-safe).
3. Everything runs inside Linux containers, so there is no need for WSL
   distributions or native toolchains.

### 2.5 Operations

```bash
docker compose logs -f web       # web logs
docker compose logs -f worker    # worker logs
docker compose down              # stop (data volumes kept)
docker compose down -v           # stop and wipe data volumes
```

The entrypoint applies pending Prisma migrations on every boot, so a fresh
stack is ready on first start. To expose the web UI behind Nginx/Caddy, proxy
`http://127.0.0.1:3000` (see the Nginx block in the Linux section for the
WebSocket headers required by the VNC console).

## 3. Linux (production)

### 3.1 Prerequisites

Supported: Ubuntu 22.04 LTS (recommended) and Debian 12.

| Resource | Minimum | Recommended |
| --- | --- | --- |
| CPU | 2 vCPU | 4 vCPU |
| RAM | 2 GB | 4 GB |
| Disk | 10 GB free | 20 GB NVMe |
| Network | 100 Mbps | 1 Gbps |

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs postgresql redis-server nginx certbot python3-certbot-nginx
```

Open `80/tcp` and `443/tcp` on the firewall; keep PostgreSQL and Redis on
loopback only.

```bash
sudo -u postgres psql <<'SQL'
CREATE USER aetheris WITH PASSWORD 'change-me-strong';
CREATE DATABASE aetheris OWNER aetheris;
GRANT ALL PRIVILEGES ON DATABASE aetheris TO aetheris;
SQL
redis-cli ping   # expect: PONG
```

### 3.2 Automated path

```bash
python -m aetheris_installer --yes \
  --target /opt/aetheris \
  --web-port 3000 \
  --admin-email ops@example.com \
  --admin-password 'a-very-long-password'
```

The installer writes systemd units (`aetheris-web.service`,
`aetheris-worker.service`, `aetheris-backend.service`) under
`/opt/aetheris/deploy`. Install and start them:

```bash
sudo cp /opt/aetheris/deploy/*.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now aetheris-web aetheris-worker aetheris-backend
```

### 3.3 Manual path

```bash
git clone https://github.com/aetheris-project/aetheris-app.git
sudo mkdir -p /opt
sudo mv aetheris-app /opt/aetheris-app   # the systemd units below assume this path
cd /opt/aetheris-app
npm ci
npx prisma generate
npx prisma migrate deploy
npm run build
cp .env.example .env
```

Set at minimum in `.env`:

```ini
DATABASE_URL=postgresql://aetheris:change-me-strong@127.0.0.1:5432/aetheris
REDIS_URL=redis://127.0.0.1:6379
AETHERIS_APP_URL=https://app.example.com
AETHERIS_SECRET=<openssl rand -hex 32>
NEXTAUTH_URL=https://app.example.com
NEXTAUTH_SECRET=<openssl rand -hex 32>
```

Create the super-admin (scrypt hashing, idempotent):

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

### 3.4 Systemd units (manual)

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

`/etc/systemd/system/aetheris-backend.service` (Python REST API):

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

### 3.5 Nginx reverse proxy and TLS

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
        # Required for the VNC console WebSocket tunnel.
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

The fastest path on Windows is Docker (section 2), which needs no native
toolchain at all. For a native install, the automated installer generates
start scripts and Task Scheduler registration. WSL2 is recommended for a
production-like experience.

### 4.1 Windows via winget (recommended)

The Aetheris Windows Installer is available on the Windows Package Manager:

```
winget install AetherisProject.AetherisWindowsInstaller
```

This downloads the standalone TUI wizard, which manages Docker Desktop,
Git, and the full Docker stack. After install, follow the interactive
screens to choose your directory, database engine, and environment settings.

### 4.2 Native Windows (automated)

```bash
git clone https://github.com/aetheris-project/aetheris-installer.git
cd aetheris-installer
python -m venv .venv
.venv\Scripts\activate
python -m aetheris_installer --yes
```

The installer writes `deploy\start-backend.bat`, `deploy\start-web.bat`
and `deploy\register-schtasks.cmd`. Start the services in two terminals:

```bat
aetheris-deploy\aetheris-app\backend\start-backend.bat
aetheris-deploy\aetheris-app\start-web.bat
```

Register them to start at login (run once, as Administrator):

```bat
aetheris-deploy\deploy\register-schtasks.cmd
```

### 4.3 Native Windows (manual)

```bat
git clone https://github.com/aetheris-project/aetheris-app.git
cd aetheris-app
npm ci
npx prisma generate
npx prisma migrate deploy
npm run build
copy .env.example .env
npm run start   # production-like; use npm run dev while developing
```

The Python backend:

```bat
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
python run.py --port 8000
```

Requirements on Windows: Node.js 20.x LTS, Python 3.10+ and a local
PostgreSQL/Redis (or use the SQLite-backed Python backend for demos, which
needs none).

### 4.4 Windows via WSL2

Install WSL2 with Ubuntu 22.04, then follow the Linux section verbatim:

```bash
wsl --install -d Ubuntu-22.04
wsl
# then: the Linux instructions from section 2
```

## 5. macOS

### 5.1 Prerequisites

Install prerequisites with Homebrew:

```bash
brew install node@20 postgresql@16 redis nginx
brew services start postgresql@16
brew services start redis
```

### 5.2 Automated path

```bash
python -m aetheris_installer --yes \
  --target ~/aetheris \
  --backend-port 8000
```

The installer writes `com.aetheris.backend.plist` under `deploy/`. Load
it with launchd:

```bash
mkdir -p ~/Library/LaunchAgents
cp ~/aetheris/deploy/com.aetheris.backend.plist ~/Library/LaunchAgents/
launchctl bootstrap gui/$(id -u) ~/Library/LaunchAgents/com.aetheris.backend.plist
# to unload later: launchctl bootout gui/$(id -u) ~/Library/LaunchAgents/com.aetheris.backend.plist
```

### 5.3 Manual path

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

Python backend (for demos, SQLite needs no database server):

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python run.py --port 8000
```

Note on Apple Silicon: Node.js and Python install cleanly via Homebrew and
`pyenv`; all drivers are pure HTTP clients, so no native bindings are
required.

## 6. Connecting Pterodactyl (all platforms)

1. Create an Application API key in the Pterodactyl Admin Panel
   (`Admin -> Application API`) with read/write on Servers, Nodes,
   Allocations, Eggs and Users. Store it as `PTERODACTYL_APP_API_KEY`.
2. Create a Client API key from the front end
   (`Account -> API Credentials`) for power, telemetry, console tokens and
   backups. Store it as `PTERODACTYL_CLIENT_API_KEY`.
3. Verify connectivity:

```bash
curl -sS -H "Authorization: Bearer $PTERODACTYL_APP_API_KEY" \
     -H "Accept: application/vnd.pterodactyl.v1+json" \
     "https://panel.example.com/api/application/nodes?per_page=1"
```

4. In the Admin Panel under `Nodes`, add a hypervisor credential of kind
   `pterodactyl`, then `Synchronize nodes`. Assign eggs to product plans.

Provisioning flow: the client orders a plan, Aetheris picks the target
node, resolves a free allocation and calls `POST /api/application/servers`
with the egg, image, resource and feature limits. Suspension, rebuild and
termination map to the Application API; power, telemetry, console and
backups map to the Client API.

Proxmox VE and VirtFusion setup: see `proxmox-setup.md` and
`virtfusion-setup.md`.

## 7. Verification checklist

```bash
# Web responds
curl -sS -o /dev/null -w '%{http_code}\n' http://127.0.0.1:3000/login

# Python backend is healthy
curl -sS http://127.0.0.1:8000/health

# Workers are processing queues (Linux)
sudo journalctl -u aetheris-worker -n 50 --no-pager

# Redis is used by BullMQ
redis-cli keys 'bull:*' | head
```

## 8. Troubleshooting

| Symptom | Cause and fix |
| --- | --- |
| Web fails to start, environment error | `src/lib/config/env.ts` aborts with the exact variable. Set it in `.env` and restart. |
| `docker compose up` fails on Windows | Enable the WSL2 backend in Docker Desktop settings and restart the engine. |
| Migrations don't run in containers | The entrypoint runs `prisma migrate deploy` on boot; check `docker compose logs web`. |
| `prisma migrate deploy` fails | Confirm `DATABASE_URL` uses a user with `CREATE` rights. |
| Provisioning jobs stuck in queue | Check the worker logs; most common cause is a 401 from a rotated Pterodactyl key. |
| Console shows no frames | The reverse proxy must forward `Upgrade` and `Connection: upgrade` (section 2.5). |
| Backend login returns 422 | The email uses a reserved TLD (`.local`, `.test`); use a real domain or `example.com`. |
| Redis connection refused | Redis binds to loopback; if Aetheris runs in a container, set `REDIS_URL` to the host address. |

## 9. Next steps

- Automated installer reference: `installer.md`.
- Python backend reference: `backend.md`.
- Themes and whitelabeling: `theming.md`.
- Dynamic whitelabeling via the Admin Panel: `whitelabel.md`.
- Pterodactyl bridge: `pterodactyl-bridge.md`.
- Custom hypervisor backend: `../sdk/custom-adapter.md`.
- REST API reference: `../rest-api/reference.md`.
