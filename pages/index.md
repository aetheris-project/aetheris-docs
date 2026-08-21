# Aetheris documentation

Aetheris is an enterprise billing and virtualization management platform that
converges WHMCS, FOSSBilling, Pterodactyl Panel, Proxmox VE and VirtFusion into
a single control panel: one billing engine, one client portal and one set of
hypervisor drivers, with total admin control and dynamic whitelabeling.

> **Need this in another language?** Use the language selector in the top navigation bar to auto-translate the documentation. Available in English, Italian, Spanish, French, German, Portuguese and more.

## Download

The Windows Installer is distributed from the GitHub Releases feed of the
`aetheris-windows-installer` repository:

```bash
curl -L -o aetheris-windows-installer.exe ^
  https://github.com/aetheris-project/aetheris-windows-installer/releases/latest/download/aetheris-windows-installer.exe
```

PowerShell:

```powershell
Invoke-WebRequest -Uri https://github.com/aetheris-project/aetheris-windows-installer/releases/latest/download/aetheris-windows-installer.exe -OutFile aetheris-windows-installer.exe
```

You can also install it directly with winget:

```
winget install AetherisProject.AetherisWindowsInstaller
```

The source code of every component lives under the
[`aetheris-project`](https://github.com/aetheris-project) organization;
clone any repository with `git clone https://github.com/aetheris-project/<repo>.git`.

## Getting started

- [Installation guide](installation.md) - per-OS deployment on Linux,
  Windows and macOS, automated and manual paths.
- [System requirements](system-requirements.md) - minimum and recommended
  hardware for development and production.
- [Automated installer](installer.md) - archinstall-style TUI wizard and
  non-interactive `--yes` mode with native service generation.
- [Windows Installer](windows-installer.md) - the native Windows
  installer (winget): dependencies, Docker stack, uninstall and packaging.
- [Environment variables](environment-variables.md) - every `.env` variable
  the platform reads.
- [Upgrades](upgrades.md) - the supported upgrade path, verification
  checklist and rollback procedure.

## Platform setup

- [Linux setup](linux-setup.md) - production deployment on Ubuntu/Debian.
- [Windows setup](windows-setup.md) - Docker Desktop, winget or native.
- [macOS setup](macos-setup.md) - Homebrew, launchd and dev setup.
- [Docker deployment](docker.md) - fastest path on any OS.
- [Reverse proxy](reverse-proxy.md) - Nginx and Caddy with TLS.
- [SSL / TLS](ssl-tls.md) - certificate provisioning and renewal.
- [Database](database.md) - PostgreSQL setup, SQLite for demos.
- [Redis](redis.md) - queue and cache configuration.
- [Prisma](prisma.md) - migrations, schema and studio.
- [Ports and networking](ports.md) - all TCP ports used by the stack.

## Architecture and platform

- [Architecture](architecture.md) - components, data flow, scaling
  topologies and failure domains.
- [Python backend](backend.md) - the REST API, its data model and how to
  run it standalone.
- [Admin panel](admin-panel.md) - overview of the admin control panel.
- [Client portal](client-portal.md) - the customer-facing dashboard.
- [User management](user-management.md) - users, roles and permissions.
- [API authentication](api-authentication.md) - login, tokens and roles.
- [Server provisioning](server-provisioning.md) - how servers are created.
- [Node management](node-management.md) - hypervisor nodes and telemetry.
- [Cron jobs](cron-jobs.md) - scheduled background tasks.
- [SFTP users](sftp.md) - file access management.
- [VNC console](vnc-console.md) - real-time terminal access.
- [Webhooks](webhooks.md) - outbound event notifications.
- [Logging](logging.md) - where to find logs for each service.

## Billing

- [Billing engine](billing.md) - invoicing, VAT, coupons, provider
  webhooks, dunning and refunds.
- [Billing plans](billing-plans.md) - create and manage hosting plans.

## Hypervisors

- [Pterodactyl bridge](pterodactyl-bridge.md) - Application and Client API
  configuration, node synchronization and daemon requirements.
- [Proxmox VE setup](proxmox-setup.md) - API v2 credentials, storage and
  template configuration.
- [VirtFusion setup](virtfusion-setup.md) - REST API credentials and VM
  provisioning.

## Customization

- [Theming and whitelabeling](theming.md) - dark / light / system themes
  and runtime accents.
- [Dynamic whitelabeling](whitelabel.md) - runtime branding without
  rebuilds.
- [Game hosting](game-hosting.md) - the game catalog, the Pterodactyl
  eggs and how servers are ordered and provisioned.
- [Modules and integrations](addons.md) - extend the platform with
  modules and integrations beyond themes.
- [Integration store](store.md) - free ready-made integrations, i.e. the
  accepted pull requests in the addons repository.
- [Custom adapter SDK](sdk/custom-adapter.md) - implement a new hypervisor
  backend against the driver contract.

## Operations

- [Security](security.md) - credential encryption, authentication, RBAC
  and the hardening checklist.
- [Backup and restore](backup-and-restore.md) - what to back up, how to
  schedule it and the recovery runbooks.
- [Monitoring and operations](monitoring.md) - health endpoints, logs,
  metrics and alerting.
- [Updates](updates.md) - how to update Aetheris.
- [Troubleshooting](troubleshooting.md) - the most common problems and
  their fixes.

## Reference

- [Development](development.md) - repository layout, local setup, code
  conventions and the release workflow.
- [REST API reference](rest-api/reference.md) - the complete OpenAPI-based API
  documentation.
- [OpenAPI specification](https://github.com/aetheris-project/aetheris-docs/blob/main/public/openapi.yaml) - machine-readable API contract.
- [Glossary](glossary.md) - the terms used across the platform.

## Contributing

Aetheris is an open-source project and we welcome contributions. All improvements
go through Pull Requests with automated CI checks (lint, typecheck, build, tests)
before manual review by @Leo-Galli.

- [Contributing guide](contributing.md) - how to submit PRs and what to expect
- [CONTRIBUTING.md](https://github.com/aetheris-project/aetheris-app/blob/main/CONTRIBUTING.md) - detailed guidelines

## Support

For commercial support, licensing questions, custom integrations or
partnerships, write to **hello@another-horizon.eu**. Bug reports and feature
requests belong on the issue trackers of the individual repositories under the
[`aetheris-project`](https://github.com/aetheris-project) organization.
