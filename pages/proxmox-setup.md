# Proxmox VE setup

Aetheris drives Proxmox VE through API v2 (`/api2/json`) for QEMU virtual
machines and LXC containers.

## 1. Create an API user

In the Proxmox web UI:

1. `Datacenter -> Permissions -> Users -> Add`.
2. User name: `aetheris`, realm `PAM`, set a strong password.
3. `Datacenter -> Permissions -> Add` and grant the roles:
   - `PVEVMAdmin` on the pool or datacenter (VM lifecycle and VNC proxy).
   - `PVEVMUser` on the target storage (template and disk access).
4. If snapshots are used for backups, grant `PVEDatastoreUser` on the backup
   storage.

## 2. Register the credential in Aetheris

In the Admin Panel, add a hypervisor credential of kind `proxmox`:

| Field | Example |
| --- | --- |
| API URL | `https://pve.example.com:8006` |
| User | `aetheris@pam` |
| Password | the user password |
| Storage | `local-lvm` or your ZFS pool name |
| Verify TLS | `true` (set `false` only for self-signed without proxy TLS) |

Environment equivalents: `PROXMOX_URL`, `PROXMOX_USER`, `PROXMOX_PASSWORD`,
`PROXMOX_VERIFY_TLS`.

## 3. Templates and images

### QEMU

Upload an ISO or a VZDump template to the configured storage, then reference it
by its full storage path in the plan, for example:

```
local:iso/ubuntu-22.04.4-live-server-amd64.iso
```

### LXC

Download a container template from `Storage -> CT Templates`, then reference it
in the plan as:

```
local:vztmpl/ubuntu-22.04-standard_22.04-1_amd64.tar.zst
```

Aetheris passes the value through as the `ostemplate` parameter during
creation.

## 4. Network model

Aetheris provisions VMs on the default bridge `vmbr0` with virtio networking.
To use another bridge, edit the driver default in
`src/lib/adapters/hypervisors/proxmox.ts` or extend the plan with a network
configuration field.

## 5. Lifecycle mapping

| Aetheris operation | Proxmox endpoint |
| --- | --- |
| Provision (QEMU) | `POST /nodes/{node}/qemu` |
| Provision (LXC) | `POST /nodes/{node}/lxc` |
| Start / Stop / Reboot | `POST /nodes/{node}/{type}/{vmid}/status/{start\|shutdown\|reboot}` |
| Suspend / Resume | `POST /nodes/{node}/{type}/{vmid}/status/{suspend\|resume}` |
| Terminate | `DELETE /nodes/{node}/{type}/{vmid}` (+ `purge=1` with snapshots) |
| Telemetry | `GET /nodes/{node}/{type}/{vmid}/status/current` |
| Console | `POST /nodes/{node}/{type}/{vmid}/vncproxy` + `vncwebsocket` |
| Backups | `POST/DELETE /nodes/{node}/{type}/{vmid}/snapshot*` |

Server identifiers use the format `node:qemu|...|vmid`, for example
`pve01:qemu:104`.

## 6. TLS notes

Proxmox ships a self-signed certificate by default. The driver uses the fetch
API, which cannot disable certificate verification; terminate TLS at an Nginx
or HAProxy reverse proxy in front of `:8006` and keep `PROXMOX_VERIFY_TLS`
at `true` in production.
