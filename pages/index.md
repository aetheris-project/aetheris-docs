# Aetheris documentation

Aetheris is an enterprise billing and virtualization management platform that
converges WHMCS, FOSSBilling, Pterodactyl Panel, Proxmox VE and VirtFusion into
a single control plane.

This wiki covers:

- [Installation guide](wiki/installation.md) - per-OS deployment on Linux,
  Windows and macOS, automated and manual paths.
- [Automated installer](wiki/installer.md) - archinstall-style TUI wizard and
  non-interactive `--yes` mode with native service generation.
- [Python backend](wiki/backend.md) - self-contained FastAPI REST API with
  SQLite, auth, billing and provisioning.
- [Theming and whitelabeling](wiki/theming.md) - dark / light / system themes
  and runtime accents.
- [Pterodactyl bridge](wiki/pterodactyl-bridge.md) - Application and Client API
  configuration, node synchronization and daemon requirements.
- [Proxmox VE setup](wiki/proxmox-setup.md) - API v2 credentials, storage and
  template configuration.
- [VirtFusion setup](wiki/virtfusion-setup.md) - REST API credentials and VM
  provisioning.
- [Dynamic whitelabeling](wiki/whitelabel.md) - runtime branding without
  rebuilds.
- [Custom adapter SDK](sdk/custom-adapter.md) - implement a new hypervisor
  backend against the driver contract.
- [REST API reference](api/reference.md) - platform endpoints and the bundled
  OpenAPI specification.

## Repository map

| Repository | Purpose |
| --- | --- |
| `aetheris-project/aetheris-website` | Marketing site, interactive demo, dynamic SEO |
| `aetheris-project/aetheris-app` | Billing core, admin control plane, drivers, client portal |
| `aetheris-project/aetheris-docs` | This wiki, SDK and API specifications |
| `aetheris-project/aetheris-installer` | Automated cross-platform installer |
