# VirtFusion setup

Aetheris drives VirtFusion through its bearer-token REST API (`/api/v1`) for
VM lifecycle, power control, snapshots and host telemetry.

## 1. Create an API token

In the VirtFusion control panel: `Account -> API Keys -> Create`. Copy the
token immediately; VirtFusion shows it once.

In Aetheris, add a hypervisor credential of kind `virtfusion`:

| Field | Example |
| --- | --- |
| API URL | `https://vf.example.com` |
| API key | the generated token |

Environment equivalents: `VIRTFUSION_URL`, `VIRTFUSION_API_KEY`.

## 2. Templates and plans

VirtFusion provisions VMs from templates and plans. Reference both in the
Aetheris plan:

- `image` - the VirtFusion template name.
- `templateExternalId` - the VirtFusion plan name.

Aetheris maps resource limits to the payload fields `cpu_cores`, `ram_mb` and
`disk_gb`.

## 3. Lifecycle mapping

| Aetheris operation | VirtFusion endpoint |
| --- | --- |
| Provision | `POST /api/v1/vms` |
| Start / Stop / Restart | `POST /api/v1/vms/{id}/power/{start\|shutdown\|restart}` |
| Suspend / Unsuspend | Power stop / power start |
| Terminate | `DELETE /api/v1/vms/{id}` |
| Rebuild | `PUT /api/v1/vms/{id}` |
| Snapshots | `/api/v1/vms/{id}/snapshots*` |
| Nodes | `GET /api/v1/servers` |

## 4. Console limitation

VirtFusion does not expose a public console WebSocket API. The driver's
`openConsole` raises `NOT_SUPPORTED`; the client portal falls back to a link
to the VirtFusion UI. Route noVNC through the VirtFusion proxy endpoint if
your deployment provides one.

## 5. Telemetry

VirtFusion reports statistics via its webhook/statistics endpoint rather than
a polling REST endpoint. The driver returns zeroed samples after verifying VM
reachability; wire the webhook receiver in `src/app/api` to populate the
telemetry tables for dashboards.
