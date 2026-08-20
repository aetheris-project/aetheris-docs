# Aetheris documentation

Aetheris is an enterprise billing and virtualization management platform that
converges WHMCS, FOSSBilling, Pterodactyl Panel, Proxmox VE and VirtFusion into
a single control panel: one billing engine, one client portal and one set of
hypervisor drivers, with total admin control and dynamic whitelabeling.

## Getting started

- [Installation guide](wiki/installation.md) - per-OS deployment on Linux,
  Windows and macOS, automated and manual paths.
- [System requirements](wiki/system-requirements.md) - minimum and recommended
  hardware for development and production.
- [Automated installer](wiki/installer.md) - archinstall-style TUI wizard and
  non-interactive `--yes` mode with native service generation.
- [Windows Installer](wiki/windows-installer.md) - the native Windows
  installer (winget): dependencies, Docker stack, uninstall and packaging.
- [Environment variables](wiki/environment-variables.md) - every `.env` variable
  the platform reads.
- [Upgrades](wiki/upgrades.md) - the supported upgrade path, verification
  checklist and rollback procedure.

## Platform setup

- [Linux setup](wiki/linux-setup.md) - production deployment on Ubuntu/Debian.
- [Windows setup](wiki/windows-setup.md) - Docker Desktop, winget or native.
- [macOS setup](wiki/macos-setup.md) - Homebrew, launchd and dev setup.
- [Docker deployment](wiki/docker.md) - fastest path on any OS.
- [Reverse proxy](wiki/reverse-proxy.md) - Nginx and Caddy with TLS.
- [SSL / TLS](wiki/ssl-tls.md) - certificate provisioning and renewal.
- [Database](wiki/database.md) - PostgreSQL setup, SQLite for demos.
- [Redis](wiki/redis.md) - queue and cache configuration.
- [Prisma](wiki/prisma.md) - migrations, schema and studio.
- [Ports and networking](wiki/ports.md) - all TCP ports used by the stack.

## Architecture and platform

- [Architecture](wiki/architecture.md) - components, data flow, scaling
  topologies and failure domains.
- [Python backend](wiki/backend.md) - the REST API, its data model and how to
  run it standalone.
- [Admin panel](wiki/admin-panel.md) - overview of the admin control panel.
- [Client portal](wiki/client-portal.md) - the customer-facing dashboard.
- [User management](wiki/user-management.md) - users, roles and permissions.
- [API authentication](wiki/api-authentication.md) - login, tokens and roles.
- [Server provisioning](wiki/server-provisioning.md) - how servers are created.
- [Node management](wiki/node-management.md) - hypervisor nodes and telemetry.
- [Cron jobs](wiki/cron-jobs.md) - scheduled background tasks.
- [SFTP users](wiki/sftp.md) - file access management.
- [VNC console](wiki/vnc-console.md) - real-time terminal access.
- [Webhooks](wiki/webhooks.md) - outbound event notifications.
- [Logging](wiki/logging.md) - where to find logs for each service.

## Billing

- [Billing engine](wiki/billing.md) - invoicing, VAT, coupons, provider
  webhooks, dunning and refunds.
- [Billing plans](wiki/billing-plans.md) - create and manage hosting plans.

## Hypervisors

- [Pterodactyl bridge](wiki/pterodactyl-bridge.md) - Application and Client API
  configuration, node synchronization and daemon requirements.
- [Proxmox VE setup](wiki/proxmox-setup.md) - API v2 credentials, storage and
  template configuration.
- [VirtFusion setup](wiki/virtfusion-setup.md) - REST API credentials and VM
  provisioning.

## Customization

- [Theming and whitelabeling](wiki/theming.md) - dark / light / system themes
  and runtime accents.
- [Dynamic whitelabeling](wiki/whitelabel.md) - runtime branding without
  rebuilds.
- [Game hosting](wiki/game-hosting.md) - the game catalog, the Pterodactyl
  eggs and how servers are ordered and provisioned.
- [Modules and integrations](wiki/addons.md) - extend the platform with
  modules and integrations beyond themes.
- [Integration store](wiki/store.md) - free ready-made integrations, i.e. the
  accepted pull requests in the addons repository.
- [Custom adapter SDK](sdk/custom-adapter.md) - implement a new hypervisor
  backend against the driver contract.

## Operations

- [Security](wiki/security.md) - credential encryption, authentication, RBAC
  and the hardening checklist.
- [Backup and restore](wiki/backup-and-restore.md) - what to back up, how to
  schedule it and the recovery runbooks.
- [Monitoring and operations](wiki/monitoring.md) - health endpoints, logs,
  metrics and alerting.
- [Updates](wiki/updates.md) - how to update Aetheris.
- [Troubleshooting](wiki/troubleshooting.md) - the most common problems and
  their fixes.

## Reference

- [Development](wiki/development.md) - repository layout, local setup, code
  conventions and the release workflow.
- [REST API reference](rest-api/reference.md) - the complete OpenAPI-based API
  documentation.
- [OpenAPI specification](https://github.com/aetheris-project/aetheris-docs/blob/main/public/openapi.yaml) - machine-readable API contract.
- [Glossary](wiki/glossary.md) - the terms used across the platform.

## Support

For commercial support, licensing questions, custom integrations or
partnerships, write to **hello@another-horizon.eu**. Bug reports and feature
requests belong on the issue trackers of the individual repositories under the
[`aetheris-project`](https://github.com/aetheris-project) organization.
