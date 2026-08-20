# VNC console

Real-time server terminal access from the client portal.

## How it works

1. Client opens `/console/{serverId}`.
2. Backend generates a temporary VNC token from the hypervisor.
3. Client connects via WebSocket to the VNC proxy.
4. Terminal frames stream in real time.

## Prerequisites

- The hypervisor (Pterodactyl, Proxmox or VirtFusion) must support VNC.
- The reverse proxy must forward `Upgrade` and `Connection: upgrade` headers.
- WebSocket timeout should be at least 600 seconds.

## Troubleshooting

| Symptom | Fix |
| --- | --- |
| Console shows "Connecting..." forever | Check WebSocket headers in Nginx/Caddy |
| Blank screen | VNC may not be enabled on the hypervisor |
| Connection drops | Increase `proxy_read_timeout` to 600s |
| "Token expired" | Re-open the console page to get a fresh token |

## Reverse proxy config

```nginx
proxy_set_header Upgrade $http_upgrade;
proxy_set_header Connection "upgrade";
proxy_read_timeout 600s;
```

See also: [Reverse proxy](reverse-proxy.md), [Troubleshooting](troubleshooting.md).
