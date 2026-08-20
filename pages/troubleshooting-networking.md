# Troubleshooting — Networking

Reverse proxy, WebSocket and TLS issues.

## Console shows no frames

The VNC console requires WebSocket upgrade headers:

```nginx
proxy_set_header Upgrade $http_upgrade;
proxy_set_header Connection "upgrade";
proxy_read_timeout 600s;
```

Test: `curl -i -N -H "Upgrade: websocket" -H "Connection: Upgrade" http://localhost:3000`

## CORS errors

Backend must allow the web app origin:

```ini
AETHERIS_CORS_ORIGINS=https://app.example.com
```

## TLS issues

| Symptom | Fix |
| --- | --- |
| Mixed content | Ensure `NEXTAUTH_URL` uses `https://` |
| Certificate expired | `sudo certbot renew` |
| WebSocket fails over TLS | Reverse proxy must forward upgrade headers on 443 |

## DNS / routing

| Symptom | Fix |
| --- | --- |
| Custom domain shows default branding | Check `Organization.customDomain` in Admin Panel |
| 502 Bad Gateway | Web app not running — `docker compose ps` |
| 504 Gateway Timeout | Backend too slow — check `docker compose logs backend` |

See also: [Reverse proxy](reverse-proxy.md), [SSL/TLS](ssl-tls.md).
