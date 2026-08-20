# Reverse proxy

Esporre Aetheris dietro Nginx o Caddy con TLS.

## Nginx

```nginx
server {
    listen 80;
    server_name app.example.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        # Necessario per VNC console WebSocket:
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_read_timeout 600s;
    }
}
```

## Caddy (TLS automatico)

```
app.example.com {
    reverse_proxy 127.0.0.1:3000
}
```

Caddy gestisce e rinnova i certificati TLS automaticamente.

## Header WebSocket

La console VNC richiede header `Upgrade` e `Connection: upgrade`. Senza di essi la console non mostra frame.

Vedi anche: [SSL/TLS](ssl-tls.md), [Installazione](installation.md).
