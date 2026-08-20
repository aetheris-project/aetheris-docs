# Pannello admin

Panoramica del pannello di controllo admin.

## Sezioni

| Sezione | URL | Descrizione |
| --- | --- | --- |
| Overview | `/admin` | Statistiche, gauge nodi, attività recente |
| Status | `/admin/status` | Versione, check aggiornamento, salute |
| Nodes | `/admin/nodes` | Credenziali hypervisor, telemetry, sync |
| Servers | `/admin/servers` | Tutti i server, azioni power |
| Billing | `/admin/billing` | Piani, fatture, coupon, pagamenti |
| Cron | `/admin/cron` | Task schedulati, trigger manuali |
| SFTP | `/admin/sftp` | Utenti file access per server |
| Whitelabel | `/admin/whitelabel` | Branding, logo, colore accent |
| Settings | `/admin/settings` | Config piattaforma, API key |

## Accesso

Solo utenti con ruolo `superadmin` o `admin` possono accedere al pannello admin.

Vedi anche: [Gestione utenti](user-management.md), [Architettura](architecture.md).
