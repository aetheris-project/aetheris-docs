# Requisiti di sistema

Hardware minimo e consigliato per Aetheris.

## Minimo (sviluppo / demo)

| Risorsa | Valore |
| --- | --- |
| CPU | 2 vCPU |
| RAM | 2 GB |
| Disco | 10 GB liberi |
| OS | Ubuntu 22.04, Debian 12, Windows 10/11, macOS 13+ |

## Consigliato (produzione)

| Risorsa | Valore |
| --- | --- |
| CPU | 4 vCPU |
| RAM | 4 GB |
| Disco | 20 GB NVMe |
| Rete | 1 Gbps |

## Deploy Docker

- Docker Engine 24+ o Docker Desktop (backend WSL2 su Windows).
- Almeno 4 GB RAM allocati al Docker engine.

## Prerequisiti software

| Dipendenza | Versione | Note |
| --- | --- | --- |
| Node.js | ≥ 20 LTS | `apt install nodejs` o nvm |
| Python | ≥ 3.10 | Per backend e installer |
| PostgreSQL | ≥ 16 | Sostituibile con SQLite per demo |
| Redis | ≥ 7 | Necessario per code e cache |
| Docker | ≥ 24 | Opzionale — percorso consigliato |

Vedi anche: [Installazione](installation.md), [Docker](docker.md).
