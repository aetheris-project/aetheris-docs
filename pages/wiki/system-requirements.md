# System requirements

Minimum and recommended hardware for Aetheris.

## Minimum (development / demo)

| Resource | Value |
| --- | --- |
| CPU | 2 vCPU |
| RAM | 2 GB |
| Disk | 10 GB free |
| OS | Ubuntu 22.04, Debian 12, Windows 10/11, macOS 13+ |

## Recommended (production)

| Resource | Value |
| --- | --- |
| CPU | 4 vCPU |
| RAM | 4 GB |
| Disk | 20 GB NVMe |
| Network | 1 Gbps |

## Docker deployments

- Docker Engine 24+ or Docker Desktop (WSL2 backend on Windows).
- At least 4 GB RAM allocated to the Docker engine.
- Containers run Linux; no native toolchain needed on the host.

## Software prerequisites

| Dependency | Version | Notes |
| --- | --- | --- |
| Node.js | ≥ 20 LTS | `apt install nodejs` or nvm |
| Python | ≥ 3.10 | For the backend and installer |
| PostgreSQL | ≥ 16 | Can be replaced with SQLite for demos |
| Redis | ≥ 7 | Required for queues and caching |
| Docker | ≥ 24 | Optional — the recommended deployment path |

See also: [Installation](installation.md), [Docker](docker.md).
