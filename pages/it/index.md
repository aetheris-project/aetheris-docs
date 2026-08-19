# Documentazione Aetheris

Aetheris è una piattaforma enterprise di billing e gestione della
virtualizzazione che converge WHMCS, FOSSBilling, Pterodactyl Panel, Proxmox VE
e VirtFusion in un unico control plane.

Questa wiki copre:

- [Guida all'installazione](wiki/installation.md) - deployment per-OS su Linux,
  Windows e macOS, con percorso automatico e manuale.
- [Installer automatico](wiki/installer.md) - wizard TUI in stile archinstall e
  modalità non interattiva `--yes` con generazione nativa dei servizi.
- [Backend Python](wiki/backend.md) - API REST FastAPI autonoma con SQLite,
  autenticazione, billing e provisioning.
- [Temi e whitelabel](wiki/theming.md) - temi scuri / chiari / di sistema e
  accenti a runtime.
- [Moduli e integrazioni](wiki/addons.md) - come estendere la piattaforma con
  addon e moduli oltre ai temi.
- [Store delle integrazioni](wiki/store.md) - integrazioni gratuite pronte,
  ovvero le pull request accettate nella repo addon.
- [Bridge Pterodactyl](wiki/pterodactyl-bridge.md) - configurazione Application
  e Client API, sincronizzazione nodi e requisiti del daemon.
- [Configurazione Proxmox VE](wiki/proxmox-setup.md) - credenziali API v2,
  storage e configurazione template.
- [Configurazione VirtFusion](wiki/virtfusion-setup.md) - credenziali REST API
  e provisioning VM.
- [Whitelabel dinamico](wiki/whitelabel.md) - branding a runtime senza rebuild.
- [SDK adapter personalizzato](sdk/custom-adapter.md) - implementa un nuovo
  backend hypervisor secondo il contratto driver.
- [Riferimento API REST](api/reference.md) - endpoint della piattaforma e
  specifica OpenAPI inclusa.

## Mappa dei repository

| Repository | Scopo |
| --- | --- |
| `aetheris-project/aetheris-website` | Sito marketing, demo interattiva, SEO dinamica |
| `aetheris-project/aetheris-app` | Core billing, admin control plane, driver, portale clienti |
| `aetheris-project/aetheris-docs` | Questa wiki, SDK e specifiche API |
| `aetheris-project/aetheris-installer` | Installer automatico cross-platform |
| `aetheris-project/aetheris-addons` | Moduli e integrazioni, store e PR accettate |
| `aetheris-project/aetheris-ops` | Scansione ottimizzazioni sistema e gestione aggiornamenti |
| `aetheris-project/aetheris-themes` | Guida, template e validator per i temi |
