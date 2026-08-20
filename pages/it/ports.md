# Porte e rete

Tutte le porte TCP usate dallo stack Aetheris.

| Servizio | Porta | Protocollo | Esposta esternamente? |
| --- | --- | --- | --- |
| Next.js web | 3000 | HTTP | Sì (dietro reverse proxy) |
| Python backend | 8000 | HTTP | No — solo loopback |
| PostgreSQL | 5432 | TCP | No — solo loopback |
| Redis | 6379 | TCP | No — solo loopback |
| Pterodactyl Panel | 80 / 443 | HTTP/S | Sì (esterno) |
| Proxmox VE | 8006 | HTTPS | Sì (esterno) |
| VirtFusion | 443 | HTTPS | Sì (esterno) |

**Tip produzione:** Solo le porte 80 e 443 dovrebbero affacciare su internet.

Vedi anche: [Installazione](installation.md), [Architettura](architecture.md).
