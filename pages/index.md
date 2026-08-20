# Aetheris documentation

Aetheris is an enterprise billing and virtualization management platform that
converges WHMCS, FOSSBilling, Pterodactyl Panel, Proxmox VE and VirtFusion into
a single control plane: one billing engine, one client portal and one set of
hypervisor drivers, with total admin control and dynamic whitelabeling.

## Getting started

- [Installation guide](wiki/installation.md) - per-OS deployment on Linux,
  Windows and macOS, automated and manual paths.
- [Automated installer](wiki/installer.md) - archinstall-style TUI wizard and
  non-interactive `--yes` mode with native service generation.
- [Windows Installer](wiki/windows-installer.md) - the native Windows
  installer (winget): dependencies, Docker stack, uninstall and packaging.
- [Upgrades](wiki/upgrades.md) - the supported upgrade path, verification
  checklist and rollback procedure.

## Understanding the platform

- [Architecture](wiki/architecture.md) - components, data flow, scaling
  topologies and failure domains.
- [Python backend](wiki/backend.md) - the REST API, its data model and how to
  run it standalone.
- [Billing engine](wiki/billing.md) - invoicing, VAT, coupons, provider
  webhooks, dunning and refunds.
- [Game hosting](wiki/game-hosting.md) - the game catalog, the Pterodactyl
  eggs and how servers are ordered and provisioned.
- [Theming and whitelabeling](wiki/theming.md) - dark / light / system themes
  and runtime accents.
- [Dynamic whitelabeling](wiki/whitelabel.md) - runtime branding without
  rebuilds.
- [Glossary](wiki/glossary.md) - the terms used across the platform.

## Integrating

- [Pterodactyl bridge](wiki/pterodactyl-bridge.md) - Application and Client API
  configuration, node synchronization and daemon requirements.
- [Proxmox VE setup](wiki/proxmox-setup.md) - API v2 credentials, storage and
  template configuration.
- [VirtFusion setup](wiki/virtfusion-setup.md) - REST API credentials and VM
  provisioning.
- [Modules and integrations](wiki/addons.md) - extend the platform with
  modules and integrations beyond themes.
- [Integration store](wiki/store.md) - free ready-made integrations, i.e. the
  accepted pull requests in the addons repository.
- [Custom adapter SDK](sdk/custom-adapter.md) - implement a new hypervisor
  backend against the driver contract.

## Operating

- [Security](wiki/security.md) - credential encryption, authentication, RBAC
  and the hardening checklist.
- [Backup and restore](wiki/backup-and-restore.md) - what to back up, how to
  schedule it and the recovery runbooks.
- [Monitoring and operations](wiki/monitoring.md) - health endpoints, logs,
  metrics and alerting.
- [Troubleshooting](wiki/troubleshooting.md) - the most common problems and
  their fixes.

## Building

- [Development](wiki/development.md) - repository layout, local setup, code
  conventions and the release workflow.
- [REST API reference](rest-api/reference.md) - the complete OpenAPI-based API
  documentation.
- [OpenAPI specification](https://github.com/aetheris-project/aetheris-docs/blob/main/public/openapi.yaml) - machine-readable API contract.

## Support

For commercial support, licensing questions, custom integrations or
partnerships, write to **hello@another-horizon.eu**. Bug reports and feature
requests belong on the issue trackers of the individual repositories under the
[`aetheris-project`](https://github.com/aetheris-project) organization.
