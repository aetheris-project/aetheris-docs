# Aetheris documentation

Aetheris is an enterprise billing and virtualization management platform that
converges WHMCS, FOSSBilling, Pterodactyl Panel, Proxmox VE and VirtFusion into
a single control plane.

This wiki covers:

- [Installation guide](wiki/installation.md) - bare-metal deployment on Ubuntu
  22.04 LTS and Debian 12, automated and manual paths.
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
| `aetheris-enterprise/aetheris-website` | Marketing site, interactive demo, dynamic SEO |
| `aetheris-enterprise/aetheris-app` | Billing core, admin control plane, drivers, client portal |
| `aetheris-enterprise/aetheris-docs` | This wiki, SDK and API specifications |
