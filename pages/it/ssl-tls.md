# SSL / TLS

Aetheris richiede HTTPS in produzione. Il reverse proxy termina il TLS.

## Opzione 1: Certbot (Nginx)

```bash
sudo certbot --nginx -d app.example.com
sudo certbot renew --dry-run   # verifica rinnovo automatico
```

## Opzione 2: Caddy (automatico)

Caddy gestisce e rinnova i certificati automaticamente. Nessun passo extra.

## Variabili d'ambiente

Dietro reverse proxy, imposta:

```ini
NEXTAUTH_URL=https://app.example.com
AETHERIS_APP_URL=https://app.example.com
```

Vedi anche: [Reverse proxy](reverse-proxy.md), [Installazione](installation.md).
