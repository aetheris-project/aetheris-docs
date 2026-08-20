# Documentazione Aetheris

Aetheris è una piattaforma enterprise di facturazione e virtualizzazione che converge WHMCS, FOSSBilling, Pterodactyl Panel, Proxmox VE e VirtFusion in un unico pannello di controllo.

## Iniziare

- [Guida all'installazione](installation.md) — deploy su Linux, Windows e macOS
- [Requisiti di sistema](system-requirements.md) — hardware minimo e consigliato
- [Variabili d'ambiente](environment-variables.md) — tutte le variabili `.env`

## Piattaforme

- [Setup Linux](linux-setup.md) — deploy produzione su Ubuntu/Debian
- [Setup Windows](windows-setup.md) — Docker Desktop, winget o nativo
- [Setup macOS](macos-setup.md) — Homebrew, launchd e sviluppo
- [Deploy con Docker](docker.md) — il percorso più rapido

## Infrastruttura

- [Architettura](architecture.md) — componenti, data flow, scaling
- [Database](database.md) — PostgreSQL setup, SQLite per demo
- [Redis](redis.md) — configurazione code e cache
- [Reverse proxy](reverse-proxy.md) — Nginx e Caddy con TLS
- [SSL / TLS](ssl-tls.md) — certificati e rinnovo

## Piattaforma

- [Backend Python](backend.md) — REST API, autenticazione, billing
- [Pannello admin](admin-panel.md) — panoramica del pannello admin
- [Portale client](client-portal.md) — dashboard cliente
- [Gestione utenti](user-management.md) — utenti, ruoli e permessi
- [Autenticazione API](api-authentication.md) — login, token, ruoli
- [Provisioning server](server-provisioning.md) — come vengono creati i server

## Fatturazione

- [Motore di fatturazione](billing.md) — fatturazione, IVA, coupon
- [Piani di fatturazione](billing-plans.md) — creare e gestire piani

## Personalizzazione

- [Temi](theming.md) — token CSS, colori accent, design system
- [Whitelabeling](whitelabel.md) — branding runtime senza rebuild
- [Game hosting](game-hosting.md) — catalogo giochi e eggs Pterodactyl

## Operazioni

- [Sicurezza](security.md) — crittografia, autenticazione, RBAC
- [Backup e ripristino](backup-and-restore.md) — cosa salvare e come ripristinare
- [Monitoraggio](monitoring.md) — health endpoint, log, metriche
- [Troubleshooting](troubleshooting.md) — problemi comuni e soluzioni

## Supporto

Per supporto commerciale: **hello@another-horizon.eu**. Bug report e feature request sugli issue tracker dei singoli repository.
