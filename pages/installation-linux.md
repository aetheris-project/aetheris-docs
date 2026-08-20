# Linux production setup

Deploy Aetheris on Ubuntu 22.04 LTS or Debian 12.

## Prerequisites

| Resource | Minimum | Recommended |
| --- | --- | --- |
| CPU | 2 vCPU | 4 vCPU |
| RAM | 2 GB | 4 GB |
| Disk | 10 GB free | 20 GB NVMe |

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs postgresql redis-server nginx certbot python3-certbot-nginx
```

## Database

```bash
sudo -u postgres psql <<'SQL'
CREATE USER aetheris WITH PASSWORD 'change-me-strong';
CREATE DATABASE aetheris OWNER aetheris;
GRANT ALL PRIVILEGES ON DATABASE aetheris TO aetheris;
SQL
redis-cli ping   # expect: PONG
```

## Automated path

```bash
python -m aetheris_installer --yes \
  --target /opt/aetheris \
  --web-port 3000 \
  --admin-email ops@example.com \
  --admin-password 'a-very-long-password'
```

Install the generated systemd units:

```bash
sudo cp /opt/aetheris/deploy/*.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now aetheris-web aetheris-worker aetheris-backend
```

## Manual path

```bash
git clone https://github.com/aetheris-project/aetheris-app.git
sudo mv aetheris-app /opt/aetheris-app
cd /opt/aetheris-app
npm ci && npx prisma generate && npx prisma migrate deploy
npm run build
cp .env.example .env
```

Set in `.env`:

```ini
DATABASE_URL=postgresql://aetheris:change-me-strong@127.0.0.1:5432/aetheris
REDIS_URL=redis://127.0.0.1:6379
AETHERIS_SECRET=<openssl rand -hex 32>
NEXTAUTH_URL=https://app.example.com
NEXTAUTH_SECRET=<openssl rand -hex 32>
```

## Systemd units

`/etc/systemd/system/aetheris-web.service`:

```ini
[Unit]
Description=Aetheris control panel (Next.js)
After=network.target postgresql.service redis-server.service

[Service]
Type=simple
WorkingDirectory=/opt/aetheris-app
EnvironmentFile=/opt/aetheris-app/.env
ExecStart=/usr/bin/node /opt/aetheris-app/node_modules/next/dist/bin/next start -p 3000
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

Similar units for `aetheris-worker.service` and `aetheris-backend.service`.

## Firewall

```bash
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
```

Keep PostgreSQL (5432) and Redis (6379) on loopback only.

## TLS

```bash
sudo certbot --nginx -d app.example.com
```

See also: [Reverse proxy](reverse-proxy.md), [Installation](installation.md).
