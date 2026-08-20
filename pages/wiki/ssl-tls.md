# SSL / TLS

Aetheris requires HTTPS in production. The reverse proxy terminates TLS.

## Option 1: Certbot (Nginx)

```bash
sudo certbot --nginx -d app.example.com
sudo certbot renew --dry-run   # verify auto-renewal
```

## Option 2: Caddy (automatic)

Caddy provisions and renews certificates automatically. No extra steps.

## Option 3: Let's Encrypt standalone

```bash
sudo certbot certonly --standalone -d app.example.com
```

Point your Nginx config at the generated certificate files.

## Environment variables

When behind a reverse proxy, set these so Next.js generates correct URLs:

```ini
NEXTAUTH_URL=https://app.example.com
AETHERIS_APP_URL=https://app.example.com
```

Also update the Pterodactyl Panel URL in the Admin → Nodes section if the panel is behind TLS.

See also: [Reverse proxy](reverse-proxy.md), [Installation](installation.md).
