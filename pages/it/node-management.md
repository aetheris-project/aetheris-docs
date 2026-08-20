# Gestione nodi

Gli hypervisor node sono le macchine che ospitano i server.

## Aggiungi un nodo

Admin → Nodes → Add Node, o via API:

```bash
curl -sS http://127.0.0.1:8000/api/nodes \
  -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{"name":"pve-01","kind":"proxmox","host":"10.0.0.10","port":8006,"credentials":{"token_id":"...","token_secret":"..."}}'
```

## Tipi di nodo

| Tipo | API | Caso d'uso |
| --- | --- | --- |
| `pterodactyl` | Wings + Panel | Server di gioco, container |
| `proxmox` | Proxmox VE API v2 | VM, container LXC |
| `virtfusion` | VirtFusion REST | Lifecycle VM |

## Sincronizzazione

Dopo aver aggiunto le credenziali, clicca **Synchronize nodes** nel Pannello Admin.

Vedi anche: [Bridge Pterodactyl](pterodactyl-bridge.md), [Setup Proxmox](proxmox-setup.md).
