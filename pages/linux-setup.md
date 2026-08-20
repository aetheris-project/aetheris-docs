# Linux setup

Production deployment on Ubuntu 22.04 / Debian 12.

## Install dependencies

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
```

## Build and run

```bash
git clone https://github.com/aetheris-project/aetheris-app.git
cd aetheris-app
npm ci && npx prisma generate && npx prisma migrate deploy
npm run build
cp .env.example .env   # edit DATABASE_URL, REDIS_URL, etc.
```

## Systemd services

The automated installer generates units under `deploy/`. Copy and enable:

```bash
sudo cp deploy/*.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now aetheris-web aetheris-worker aetheris-backend
```

## Firewall

Open ports 80 and 443. Keep PostgreSQL (5432) and Redis (6379) on loopback only.

```bash
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
```

See also: [Installation](installation.md), [Reverse proxy](reverse-proxy.md).
