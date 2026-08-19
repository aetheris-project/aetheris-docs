# Installation guide

This guide walks through a production deployment of the Aetheris control plane
(`aetheris-app`) on a single server, connected to Pterodactyl, Proxmox VE and
VirtFusion. Both the automated installer and the fully manual path are covered.

Estimated time: 30 minutes for the automated path, 60 minutes manual.

## 1. Server prerequisites

Supported operating systems:

- Ubuntu 22.04 LTS (recommended)
- Debian 12

Minimum specifications:

| Resource | Minimum | Recommended |
| --- | --- | --- |
| CPU | 2 vCPU | 4 vCPU |
| RAM | 2 GB | 4 GB |
| Disk | 10 GB free | 20 GB NVMe |
| Network | 100 Mbps | 1 Gbps |

Required software versions:

| Software | Minimum | Install |
| --- | --- | --- |
| Node.js | 20.x LTS | `curl -fsSL https://deb.nodesource.com/setup_20.x \| sudo -E bash -` |
| PostgreSQL | 16 | `sudo apt install postgresql-16` |
| Redis | 7 | `sudo apt install redis-server` |
| Nginx | 1.22 | `sudo apt install nginx` |
| Certbot | latest | `sudo apt install certbot python3-certbot-nginx` |

Open ports on the host firewall:

- `80/tcp` and `443/tcp` - web and TLS termination.
- `5432/tcp` - PostgreSQL, restricted to localhost or a private network only.
- `6379/tcp` - Redis, restricted to localhost only.

### 1.1 PostgreSQL setup

```bash
sudo -u postgres psql <<'SQL'
CREATE USER aetheris WITH PASSWORD 'change-me-strong';
CREATE DATABASE aetheris OWNER aetheris;
GRANT ALL PRIVILEGES ON DATABASE aetheris TO aetheris;
SQL
```

Verify the connection:

```bash
PGPASSWORD='change-me-strong' psql -h 127.0.0.1 -U aetheris -d aetheris -c 'SELECT 1;'
```

### 1.2 Redis setup

Redis binds to loopback by default, which is correct. Confirm:

```bash
redis-cli ping   # expect: PONG
```

## 2. Automated installer

Clone the repository and run the non-interactive installer. Every value is
passed through environment variables; the installer never prompts.

```bash
git clone https://github.com/aetheris-enterprise/aetheris-app.git
cd aetheris-app

DATABASE_URL='postgresql://aetheris:change-me-strong@127.0.0.1:5432/aetheris' \
REDIS_URL='redis://127.0.0.1:6379' \
AETHERIS_APP_URL='https://app.example.com' \
ADMIN_EMAIL='ops@example.com' \
ADMIN_PASSWORD='a-very-long-password-here' \
PTERODACTYL_URL='https://panel.example.com' \
PTERODACTYL_APP_API_KEY='ptla_xxxxxxxxxxxxxxxx' \
PTERODACTYL_CLIENT_API_KEY='ptlc_xxxxxxxxxxxxxxxx' \
bash bin/install.sh --yes --systemd --nginx
```

What the installer does, in order:

1. Preflight: verifies bash, Node.js >= 20, npm, openssl, memory and disk.
2. Loads `.env` (created from `.env.example` when missing) and validates that
   `DATABASE_URL`, `REDIS_URL` and `AETHERIS_APP_URL` are present.
3. Installs dependencies with `npm ci` when a lockfile exists.
4. Probes PostgreSQL reachability, runs `prisma generate` and
   `prisma migrate deploy`.
5. Probes Redis with a raw `PING`/`PONG` exchange.
6. Verifies the Pterodactyl Application API with a `GET /api/application/nodes`
   call using the provided key.
7. Creates the super-admin account (idempotent; scrypt password hashing).
8. With `--systemd`: writes `aetheris-web.service` and `aetheris-worker.service`
   and reloads systemd.
9. With `--nginx`: writes an Nginx site template to `deploy/aetheris.conf`.

Start the services:

```bash
sudo systemctl enable --now aetheris-web aetheris-worker
sudo systemctl status aetheris-web --no-pager
```

Flags:

| Flag | Effect |
| --- | --- |
| `--yes` | Run non-interactively (required). |
| `--skip-checks` | Skip memory, disk and reachability probes. |
| `--systemd` | Install systemd units (requires root). |
| `--nginx` | Write the Nginx site template (requires root). |

Exit codes: `0` success; `1` preflight; `2` dependencies; `3` database;
`4` Redis; `5` Pterodactyl verification; `6` super-admin creation.

## 3. Manual setup

The manual path covers the same steps without the installer.

### 3.1 Dependencies and build

```bash
git clone https://github.com/aetheris-enterprise/aetheris-app.git
cd aetheris-app
npm ci
npx prisma generate
npx prisma migrate deploy
npm run build
```

### 3.2 Environment

```bash
cp .env.example .env
```

Edit `.env` and set at minimum:

```ini
DATABASE_URL=postgresql://aetheris:change-me-strong@127.0.0.1:5432/aetheris
REDIS_URL=redis://127.0.0.1:6379
AETHERIS_APP_URL=https://app.example.com
AETHERIS_SECRET=<openssl rand -hex 32>
NEXTAUTH_URL=https://app.example.com
NEXTAUTH_SECRET=<openssl rand -hex 32>
```

Generate secrets:

```bash
openssl rand -hex 32
```

### 3.3 Super-admin account

Create the initial administrator with the same script the installer uses:

```bash
DATABASE_URL='postgresql://aetheris:change-me-strong@127.0.0.1:5432/aetheris' \
ADMIN_EMAIL='ops@example.com' \
ADMIN_PASSWORD='a-very-long-password-here' \
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
await prisma.\$disconnect();
"
```

### 3.4 Systemd units

Web server (`/etc/systemd/system/aetheris-web.service`):

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
User=aetheris
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
```

Background workers (`/etc/systemd/system/aetheris-worker.service`):

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
User=aetheris
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
```

```bash
sudo useradd --system --home /opt/aetheris-app --shell /usr/sbin/nologin aetheris
sudo chown -R aetheris:aetheris /opt/aetheris-app
sudo systemctl daemon-reload
sudo systemctl enable --now aetheris-web aetheris-worker
```

### 3.5 Nginx reverse proxy

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
```

### 3.6 TLS with Certbot

```bash
sudo certbot --nginx -d app.example.com
sudo systemctl status certbot.timer --no-pager   # automatic renewal
```

## 4. Connecting Pterodactyl

### 4.1 Create the Application API key

In the Pterodactyl Admin Panel: `Admin -> Application API -> Create`.

Grant read/write to:

- Servers
- Nodes
- Allocations
- Eggs
- Users

Copy the key (shown once). In Aetheris, store it as `PTERODACTYL_APP_API_KEY`.

### 4.2 Create the Client API key

Log in as an administrator on the Pterodactyl front end, then
`Account -> API Credentials -> Create`. This key drives power actions,
resource telemetry, console WebSocket tokens and backups. Store it as
`PTERODACTYL_CLIENT_API_KEY`.

### 4.3 Verify connectivity

```bash
curl -sS -H "Authorization: Bearer $PTERODACTYL_APP_API_KEY" \
     -H "Accept: application/vnd.pterodactyl.v1+json" \
     "https://panel.example.com/api/application/nodes?per_page=1"
```

Expected: HTTP 200 with a JSON `data` array. The installer performs this check
automatically.

### 4.4 Register the node bridge in Aetheris

In the Admin Panel under `Nodes`:

1. Add a hypervisor credential of kind `pterodactyl` with the base URL and
   both keys.
2. Click `Synchronize nodes`. Aetheris reads `/api/application/nodes` and
   stores each node with its allocation capacity.
3. Assign eggs to product plans. Aetheris reads nests and eggs from
   `/api/application/nests/{id}/eggs` and exposes them as selectable templates.

Provisioning flow: the client orders a plan, Aetheris picks the target node,
resolves a free allocation, and calls `POST /api/application/servers` with the
egg, image, resource limits and feature limits. Suspension, rebuild and
termination map to the Application API; power, telemetry, console and backups
map to the Client API.

## 5. Connecting Proxmox VE

1. Create an API-capable user in the Proxmox web UI
   (`Datacenter -> Permissions -> Users`) with `PVEVMAdmin` and
   `PVEVMUser` roles and a password.
2. In Aetheris, add a hypervisor credential of kind `proxmox` with the API URL
   (`https://pve.example.com:8006`), user (`user@pam`), password and default
   storage pool.
3. Set `PROXMOX_VERIFY_TLS=false` only if Proxmox uses a self-signed
   certificate and TLS is not terminated by a reverse proxy.

See `pterodactyl-bridge.md` and `proxmox-setup.md` in this wiki for the full
bridge configuration including daemon requirements.

## 6. Verification checklist

Run this after installation:

```bash
# Web responds
curl -sS -o /dev/null -w '%{http_code}\n' https://app.example.com/login   # 200

# Worker is processing queues
sudo journalctl -u aetheris-worker -n 50 --no-pager

# Redis is used by BullMQ
redis-cli keys 'bull:*' | head

# Pterodactyl bridge is live (Admin Panel -> Nodes shows synchronized nodes)

# TLS certificate is valid
echo | openssl s_client -connect app.example.com:443 -servername app.example.com 2>/dev/null | openssl x509 -noout -dates
```

## 7. Troubleshooting

| Symptom | Cause and fix |
| --- | --- |
| Web fails to start, environment error | `src/lib/config/env.ts` aborts with the exact variable. Set it in `.env` and restart. |
| `prisma migrate deploy` fails | Confirm `DATABASE_URL` uses a user with `CREATE` rights; rerun `sudo -u postgres` grants from section 1.1. |
| Provisioning jobs stuck in queue | Check `journalctl -u aetheris-worker`; most common cause is a 401 from a rotated Pterodactyl key. |
| Console shows no frames | The Nginx proxy must forward `Upgrade` and `Connection: upgrade` headers (section 3.5) for the WebSocket tunnel. |
| Redis connection refused | Redis binds to loopback; if Aetheris runs in a container, set `REDIS_URL` to the host address and bind Redis accordingly. |
| Certbot fails to obtain a certificate | Ensure port 80 is reachable and the DNS A/AAAA record for the domain points at this server. |

## 8. Next steps

- Configure dynamic whitelabeling: see `whitelabel.md`.
- Build a custom backend: see the SDK guide `../sdk/custom-adapter.md`.
- Consume the platform API: see `../api/reference.md` and the bundled
  `public/openapi.yaml`.
