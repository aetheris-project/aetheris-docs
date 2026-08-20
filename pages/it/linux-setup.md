# Setup Linux

Deploy in produzione su Ubuntu 22.04 / Debian 12.

## Prerequisiti

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

## Percorso automatico

```bash
python -m aetheris_installer --yes \
  --target /opt/aetheris \
  --web-port 3000 \
  --admin-email ops@example.com \
  --admin-password 'a-very-long-password'
```

## Percorso manuale

```bash
git clone https://github.com/aetheris-project/aetheris-app.git
sudo mv aetheris-app /opt/aetheris-app
cd /opt/aetheris-app
npm ci && npx prisma generate && npx prisma migrate deploy
npm run build
cp .env.example .env
```

## Systemd

```bash
sudo cp /opt/aetheris/deploy/*.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now aetheris-web aetheris-worker aetheris-backend
```

## Firewall

```bash
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
```

Vedi anche: [Reverse proxy](reverse-proxy.md), [Installazione](installation.md).
