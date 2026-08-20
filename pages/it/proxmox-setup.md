# Setup Proxmox VE

Configurazione del bridge Proxmox VE per VM e container LXC.

## Cosa serve

| Chiave | Descrizione |
| --- | --- |
| `PROXMOX_URL` | URL API Proxmox (es. `https://10.0.0.10:8006`) |
| `PROXMOX_API_TOKEN` | Token API (`user@realm!token-id`) |
| `PROXMOX_API_SECRET` | Secret del token |

## Configura nel Pannello Admin

1. Admin → Nodes → Add Node.
2. Kind: `proxmox`.
3. Inserisci URL, Token ID e Token Secret.
4. Clicca **Synchronize nodes**.

## Supportato

| Risorsa | API |
| --- | --- |
| VM QEMU | `POST /nodes/{node}/qemu` |
| Container LXC | `POST /nodes/{node}/lxc` |
| Snapshot | `POST /nodes/{node}/{type}/{vmid}/snapshot` |
| Power | `POST /nodes/{node}/{type}/{vmid}/status` |

Vedi anche: [Gestione nodi](node-management.md), [Provisioning server](server-provisioning.md).
