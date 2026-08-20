# Ports and networking

All TCP ports used by the Aetheris stack.

| Service | Port | Protocol | Exposed externally? |
| --- | --- | --- | --- |
| Next.js web | 3000 | HTTP | Yes (behind reverse proxy) |
| Python backend | 8000 | HTTP | No — loopback only |
| PostgreSQL | 5432 | TCP | No — loopback only |
| Redis | 6379 | TCP | No — loopback only |
| Pterodactyl Panel | 80 / 443 | HTTP/S | Yes (external) |
| Proxmox VE | 8006 | HTTPS | Yes (external) |
| VirtFusion | 443 | HTTPS | Yes (external) |

**Production tip:** Only ports 80 and 443 should face the internet. Run the web app behind Nginx or Caddy and keep PostgreSQL, Redis and the backend on loopback.

See also: [Installation](installation.md), [Architecture](architecture.md).
