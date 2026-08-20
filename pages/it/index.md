# Documentazione Aetheris

Aetheris è una piattaforma enterprise di billing e gestione della
virtualizzazione che converge WHMCS, FOSSBilling, Pterodactyl Panel, Proxmox
VE e VirtFusion in un'unica control plane: un solo billing engine, un solo
portale clienti e un unico set di driver per gli hypervisor, con controllo
admin totale e whitelabeling dinamico.

## Per iniziare

- [Guida all'installazione](wiki/installation.md) - deploy per-OS su Linux,
  Windows e macOS, percorsi automatizzati e manuali.
- [Installer automatizzato](wiki/installer.md) - wizard TUI stile archinstall
  e modalità non interattiva `--yes` con generazione nativa dei servizi.
- [Installer Windows](wiki/windows-installer.md) - l'installer nativo per
  Windows (winget): dipendenze, stack Docker, disinstallazione e packaging.
- [Aggiornamenti](wiki/upgrades.md) - il percorso di upgrade supportato, la
  checklist di verifica e la procedura di rollback.

## Capire la piattaforma

- [Architettura](wiki/architecture.md) - componenti, flusso dei dati,
  topologie di scaling e domini di failure.
- [Backend Python](wiki/backend.md) - l'API REST, il suo modello dati e come
  eseguirla standalone.
- [Temi e whitelabeling](wiki/theming.md) - temi dark / light / system e
  accenti a runtime.
- [Whitelabeling dinamico](wiki/whitelabel.md) - branding a runtime senza
  rebuild.
- [Glossario](wiki/glossary.md) - i termini usati in tutta la piattaforma.

## Integrare

- [Bridge Pterodactyl](wiki/pterodactyl-bridge.md) - configurazione
  Application e Client API, sincronizzazione dei nodi e requisiti del daemon.
- [Setup Proxmox VE](wiki/proxmox-setup.md) - credenziali API v2, storage e
  configurazione dei template.
- [Setup VirtFusion](wiki/virtfusion-setup.md) - credenziali REST API e
  provisioning delle VM.
- [Moduli e integrazioni](wiki/addons.md) - estendi la piattaforma con moduli
  e integrazioni oltre i temi.
- [Store delle integrazioni](wiki/store.md) - integrazioni pronte gratuite,
  cioè le pull request accettate nel repository degli addon.
- [SDK custom adapter](sdk/custom-adapter.md) - implementa un nuovo backend
  hypervisor contro il contratto driver.

## Operare

- [Sicurezza](wiki/security.md) - crittografia delle credenziali,
  autenticazione, RBAC e checklist di hardening.
- [Backup e restore](wiki/backup-and-restore.md) - cosa fare il backup, come
  pianificarlo e i runbook di recupero.
- [Monitoraggio e operazioni](wiki/monitoring.md) - endpoint di health, log,
  metriche e alerting.
- [Risoluzione dei problemi](wiki/troubleshooting.md) - i problemi più comuni
  e le loro soluzioni.

## Sviluppare

- [Sviluppo](wiki/development.md) - struttura dei repository, setup locale,
  convenzioni di codice e workflow di release.
- [Riferimento API REST](api/reference.md) - la documentazione API completa
  basata su OpenAPI.
- [Specifica OpenAPI](https://github.com/aetheris-project/aetheris-docs/blob/main/public/openapi.yaml) - contratto API machine-readable.

## Supporto

Per supporto commerciale, domande sulle licenze, integrazioni personalizzate o
partnership, scrivi a **hello@another-horizon.eu**. Segnalazioni di bug e
richieste di funzionalità vanno nei tracker dei singoli repository
sotto l'organizzazione [`aetheris-project`](https://github.com/aetheris-project).
