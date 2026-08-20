# Pterodactyl bridge configuration

Aetheris drives a Pterodactyl Panel through two API surfaces. This page
documents the daemon requirements, key scopes, node synchronization and the
exact endpoints the driver calls.

## API surfaces

| Surface | Base path | Used for |
| --- | --- | --- |
| Application API | `/api/application` | Nodes, allocations, nests, eggs, server create/suspend/unsuspend/delete |
| Client API | `/api/client` | Power signals, resource telemetry, console WebSocket tokens, backups |

The driver is `src/lib/adapters/hypervisors/pterodactyl.ts` in `aetheris-app`.

## Daemon requirements

The Wings daemon on each node must satisfy:

- Node.js 16+ (Wings bundles its own runtime since 1.11).
- Docker Engine with a storage driver supporting overlay2.
- Outbound network access to the panel and to the image registries used by the
  eggs you expose.
- The panel must be able to reach the daemon on the port configured per node
  (default `8080`).
- Firewall: allow the daemon API port from the panel, and the container port
  range allocated per node.

Verify a daemon from the panel: `Nodes -> <node> -> Configuration` and check
the health indicator. Aetheris trusts the panel's node status during
synchronization.

## Key scopes

### Application API key

Create in the panel under `Admin -> Application API`. Required permissions:

- Read and write: `Servers`, `Nodes`, `Allocations`, `Eggs`, `Users`.

Store as `PTERODACTYL_APP_API_KEY`.

### Client API key

Create in the panel front end under `Account -> API Credentials` while logged
in as an administrator. Required endpoints:

- `GET/POST /api/client/servers/{id}/power`
- `GET /api/client/servers/{id}/resources`
- `GET /api/client/servers/{id}/websocket`
- `GET/POST /api/client/servers/{id}/backups`
- `POST /api/client/servers/{id}/backups/{backup}/restore`
- `DELETE /api/client/servers/{id}/backups/{backup}`

Store as `PTERODACTYL_CLIENT_API_KEY`.

## Node synchronization

1. In the Aetheris Admin Panel, add a hypervisor credential of kind
   `pterodactyl` with both keys.
2. Run `Synchronize nodes`. Aetheris calls `GET /api/application/nodes` and
   records each node's name, FQDN, memory, disk and CPU capacity into the
   `Node` table.
3. Run `Synchronize eggs`. Aetheris enumerates nests with
   `GET /api/application/nests` and eggs with
   `GET /api/application/nests/{id}/eggs`, then exposes them as plan templates.

Synchronization is idempotent: rows are matched by `(hypervisorId, externalId)`.

## Provisioning contract

When a client orders a plan, Aetheris builds this payload:

```json
{
  "name": "web-prod-01",
  "user": 42,
  "egg": 15,
  "docker_image": "ghcr.io/pterodactyl/yolks:nodejs_20",
  "startup": "",
  "environment": { "NODE_ENV": "production", "PORT": "3000" },
  "limits": { "memory": 8192, "swap": 2048, "disk": 81920, "io": 500, "cpu": 0 },
  "feature_limits": { "databases": 0, "allocations": 1, "backups": 5 },
  "allocation": { "default": 118, "additional": [] },
  "start_on_completion": true
}
```

`user` is the numeric Pterodactyl user id of the client; Aetheris resolves it
during account linking (email match against `GET /api/application/users`).

## Lifecycle mapping

| Aetheris operation | Pterodactyl endpoint |
| --- | --- |
| Provision | `POST /api/application/servers` |
| Suspend | `POST /api/application/servers/{id}/suspend` |
| Unsuspend | `POST /api/application/servers/{id}/unsuspend` |
| Terminate | `DELETE /api/application/servers/{id}?force=1` |
| Power start/stop/restart/kill | `POST /api/client/servers/{id}/power` |
| Telemetry | `GET /api/client/servers/{id}/resources` |
| Console | `GET /api/client/servers/{id}/websocket` |
| Backups | `/api/client/servers/{id}/backups*` |

Write endpoints that require the numeric server id resolve it first via
`GET /api/application/servers/{identifier}`. All requests carry the header
`Accept: application/vnd.pterodactyl.v1+json` and are rate-limited by a
token bucket (default 10 requests per second).

## Verification

```bash
curl -sS -H "Authorization: Bearer $PTERODACTYL_APP_API_KEY" \
     -H "Accept: application/vnd.pterodactyl.v1+json" \
     "https://panel.example.com/api/application/nodes?per_page=1"
```

Expect HTTP 200. The installer runs this check during `bin/install.sh`.
