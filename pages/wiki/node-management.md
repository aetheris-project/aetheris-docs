# Node management

Hypervisor nodes are the machines that host your servers.

## Add a node

Admin → Nodes → Add Node, or via the API:

```bash
curl -sS http://127.0.0.1:8000/api/nodes \
  -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "pve-01",
    "kind": "proxmox",
    "host": "10.0.0.10",
    "port": 8006,
    "credentials": {"token_id":"...", "token_secret":"..."}
  }'
```

## Node kinds

| Kind | API | Use case |
| --- | --- | --- |
| `pterodactyl` | Wings + Panel | Game servers, containers |
| `proxmox` | Proxmox VE API v2 | VMs, LXC containers |
| `virtfusion` | VirtFusion REST | VM lifecycle |

## Sync nodes

After adding credentials, click **Synchronize nodes** in the Admin Panel (or `POST /api/nodes/sync`). This pulls live telemetry, server counts and resource usage from the hypervisor.

## Telemetry

```bash
curl -sS http://127.0.0.1:8000/api/nodes/{id}/telemetry \
  -H "Authorization: Bearer $TOKEN"
```

Returns CPU, memory, disk and network usage in real time.

See also: [Pterodactyl bridge](pterodactyl-bridge.md), [Proxmox VE setup](proxmox-setup.md), [VirtFusion setup](virtfusion-setup.md).
