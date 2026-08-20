# Setup VirtFusion

Configurazione del bridge VirtFusion per il ciclo di vita delle VM.

## Cosa serve

| Chiave | Descrizione |
| --- | --- |
| `VIRTFUSION_URL` | URL API VirtFusion (es. `https://virt.example.com`) |
| `VIRTFUSION_API_KEY` | Bearer token API |

## Configura nel Pannello Admin

1. Admin → Nodes → Add Node.
2. Kind: `virtfusion`.
3. Inserisci URL e API Key.
4. Clicca **Synchronize nodes**.

## Supportato

| Operazione | Endpoint |
| --- | --- |
| Lifecycle VM | `POST /api/v1/servers` |
| Power | `POST /api/v1/servers/{id}/start` |
| Snapshot | `POST /api/v1/servers/{id}/snapshot` |
| Telemetry | `GET /api/v1/servers/{id}/telemetry` |

Vedi anche: [Gestione nodi](node-management.md), [Provisioning server](server-provisioning.md).
