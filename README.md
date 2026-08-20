<p align="center">
  <img src="assets/icon.svg" alt="Aetheris" width="88">
</p>

<h1 align="center">Aetheris Docs</h1>

<p align="center">
  <strong>Wiki, installation guides, developer SDK and OpenAPI specifications</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Nextra-2-000000?logo=next.js&logoColor=white" alt="Nextra">
  <img src="https://img.shields.io/badge/Next.js-14-black?logo=next.js" alt="Next.js">
  <img src="https://img.shields.io/badge/OpenAPI-3.1-85EA2D?logo=openapiinitiative&logoColor=white" alt="OpenAPI 3.1">
  <a href="https://aetheris-docs.vercel.app"><img src="https://img.shields.io/badge/Production-aetheris--docs.vercel.app-2ea44f" alt="Production"></a>
</p>

---

Wiki, installation guides, developer SDK and OpenAPI specifications for the
Aetheris billing and virtualization platform.

## Overview

Aetheris converges WHMCS, FOSSBilling, Pterodactyl Panel, Proxmox VE and
VirtFusion into a single enterprise control plane. This repository documents
every surface of the platform:

- Per-OS installation guides for **Linux (systemd/Nginx/Certbot)**,
  **Windows (native + WSL2)** and **macOS (launchd)**, with both an automated
  installer path and a fully manual walkthrough.
- Automated installer reference: the `aetheris-installer` wizard and
  non-interactive `--yes` mode.
- Pterodactyl daemon bridge configuration: Application and Client API key
  scopes, node synchronization and the full lifecycle endpoint mapping.
- Proxmox VE API v2 setup: API users, storage, templates and VM/container
  provisioning.
- VirtFusion REST API setup with its console limitation.
- Dynamic whitelabeling reference: runtime branding without rebuilds.
- Theming reference: tokens, accents and the dark/light/system theme system.
- Python backend reference: the FastAPI REST service included in
  `aetheris-app/backend`.
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
│   ├── wiki/
│   │   ├── installation.md         # Per-OS install guide (Linux / Windows / macOS)
│   │   ├── installer.md            # Automated installer reference
│   │   ├── backend.md              # Python backend API reference
│   │   ├── theming.md              # Theme tokens, accents, whitelabel
│   │   ├── pterodactyl-bridge.md   # Daemon requirements, key scopes, API mapping
│   │   ├── proxmox-setup.md        # API user, storage, templates
│   │   ├── virtfusion-setup.md
│   │   └── whitelabel.md           # Dynamic branding without rebuilds
│   ├── sdk/custom-adapter.md       # Custom hypervisor adapter guide
│   └── api/reference.md            # REST API reference
├── public/
│   ├── openapi.yaml                # Machine-readable API contract
│   ├── robots.txt                  # Search engine directives
│   └── sitemap.xml                 # All wiki pages for indexing
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
- [aetheris-installer](https://github.com/aetheris-project/aetheris-installer) -
  automated cross-platform installer

## License

Aetheris is licensed under the [GNU Affero General Public License v3.0](LICENSE.md) (AGPL-3.0). You may use, study, modify and redistribute it for any purpose, provided that any distributed or network-served modified version keeps this license, preserves the copyright notice of the original author (Leonardo Galli / Leo-Galli) and releases its source code under AGPL-3.0. The Aetheris core and the author's credit may not be removed.
