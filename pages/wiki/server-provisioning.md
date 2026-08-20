# Server provisioning

How Aetheris creates and manages game servers and VMs.

## Provisioning flow

1. Client selects a plan from the store.
2. Aetheris picks the best node (least loaded, matching resources).
3. Resolves a free IP allocation.
4. Calls the hypervisor API to create the server:
   - **Pterodactyl**: `POST /api/application/servers`
   - **Proxmox**: `POST /nodes/{node}/qemu` or `/lxc`
   - **VirtFusion**: `POST /api/v1/servers`
5. Stores server metadata in PostgreSQL.
6. Sends provisioning-complete webhook.

## Power actions

| Action | Pterodactyl | Proxmox | VirtFusion |
| --- | --- | --- | --- |
| Start | Client API | `POST /status` | `POST /start` |
| Stop | Client API | `POST /status` | `POST /stop` |
| Restart | Client API | `POST /status` | `POST /restart` |
| Reinstall | Application API | `POST /status` (reinstall) | `POST /reinstall` |
| Terminate | Application API | `DELETE /nodes/{node}/qemu/{vmid}` | `DELETE /servers/{id}` |

## Suspension

When an invoice goes overdue, the `dunning` queue suspends the server after the configured grace period. The server is unsuspended automatically once payment is received.

## Idempotency

Every provisioning job carries an idempotency key. Retries after crashes never double-provision or double-charge.

See also: [Architecture](architecture.md), [Billing engine](billing.md).
