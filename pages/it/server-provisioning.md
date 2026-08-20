# Provisioning server

Come Aetheris crea e gestisce server di gioco e VM.

## Flow di provisioning

1. Client seleziona un piano dallo store.
2. Aetheris sceglie il nodo migliore (meno carico, risorse corrispondenti).
3. Risolve un'allocazione IP libera.
4. Chiama l'API hypervisor per creare il server.
5. Salva i metadata in PostgreSQL.
6. Invia webhook di provisioning completato.

## Azioni power

| Azione | Pterodactyl | Proxmox | VirtFusion |
| --- | --- | --- | --- |
| Start | Client API | `POST /status` | `POST /start` |
| Stop | Client API | `POST /status` | `POST /stop` |
| Restart | Client API | `POST /status` | `POST /restart` |
| Terminate | Application API | `DELETE` | `DELETE` |

## Sospensione

Quando una fattura va in scadenza, la coda `dunning` sospende il server dopo il periodo di grazia. Il server viene riattivato automaticamente al pagamento.

Vedi anche: [Architettura](architecture.md), [Billing](billing.md).
