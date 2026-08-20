# Reverse proxy

Expose Aetheris behind Nginx or Caddy with TLS.

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
        # Required for VNC console WebSocket:
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_read_timeout 600s;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/aetheris /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
sudo certbot --nginx -d app.example.com
```

## Caddy (auto-TLS)

```
app.example.com {
    reverse_proxy 127.0.0.1:3000
}
```

Caddy automatically provisions and renews TLS certificates.

## WebSocket headers

The VNC console requires `Upgrade` and `Connection: upgrade` headers. Without them the console shows no frames. Both Nginx and Caddy handle this correctly with the configs above.

See also: [Installation](installation.md), [SSL/TLS](ssl-tls.md).
