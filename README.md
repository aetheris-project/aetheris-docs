<p align="center">
  <img src="assets/icon.png" alt="Aetheris" width="80">
</p>

<h1 align="center">Aetheris Docs</h1>

<p align="center">
  <strong>Wiki, installation guides, developer SDK and OpenAPI specifications</strong>
</p>

<p align="center">
  <a href="https://aetheris-docs.vercel.app">Production</a>
</p>

---

Wiki, installation guides, developer SDK and OpenAPI specifications for the
Aetheris billing and virtualization platform.

Production: https://aetheris-docs.vercel.app

## Overview

Aetheris converges WHMCS, FOSSBilling, Pterodactyl Panel, Proxmox VE and
VirtFusion into a single enterprise control plane. This repository documents
every surface of the platform:

- Bare-metal installation guides for Ubuntu 22.04 LTS and Debian 12
  (automated installer and fully manual path with Nginx, Certbot and Systemd).
- Pterodactyl daemon bridge configuration: Application and Client API key
  scopes, node synchronization and the full lifecycle endpoint mapping.
- Proxmox VE API v2 setup: API users, storage, templates and VM/container
  provisioning.
- VirtFusion REST API setup with its console limitation.
- Dynamic whitelabeling reference: runtime branding without rebuilds.
- Custom hypervisor adapter SDK: the `HypervisorDriver` contract and how to
  implement a new backend.
- REST API reference and a complete OpenAPI 3.1 specification.

## Tech stack

- Nextra 2 (Next.js 14 documentation framework)
- MDX pages with built-in search, code highlighting and copy buttons
- OpenAPI 3.1 specification served from `public/openapi.yaml`
- Deployed on Vercel

## Repository layout

```text
aetheris-docs/
├── pages/
│   ├── index.md                    # Wiki landing page
│   ├── wiki/                       # Installation and bridge guides
│   │   ├── installation.md
│   │   ├── pterodactyl-bridge.md
│   │   ├── proxmox-setup.md
│   │   ├── virtfusion-setup.md
│   │   └── whitelabel.md
│   ├── sdk/custom-adapter.md       # Custom hypervisor adapter guide
│   └── api/reference.md            # REST API reference
├── public/openapi.yaml             # Machine-readable API contract
├── theme.config.tsx                # Nextra theme and navigation
└── package.json
```

## Local development

```bash
npm install
npm run dev
```

The wiki is available at http://localhost:3000.

## Production

```bash
npm run build
npm run start
```

The repository is linked to the `aetheris-docs` project on Vercel; pushes to
`main` trigger production deployments automatically.

## Related repositories

- [aetheris-website](https://github.com/aetheris-project/aetheris-website) -
  marketing site and interactive product demo
- [aetheris-app](https://github.com/aetheris-project/aetheris-app) - billing
  core, admin control plane and hypervisor drivers

## License

Proprietary enterprise software. See the license agreement distributed with
the organization account.
