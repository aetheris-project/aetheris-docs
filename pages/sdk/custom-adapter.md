# Custom hypervisor adapter

Every backend Aetheris supports is a class implementing the
`HypervisorDriver` interface from `src/lib/adapters/hypervisors/types.ts` in
`aetheris-app`. Adding a new backend is a single-file change plus one registry
entry.

## The contract

```ts
interface HypervisorDriver {
  readonly kind: HypervisorKind;      // "pterodactyl" | "proxmox" | "virtfusion" | <yours>
  readonly configName: string;

  health(): Promise<HealthReport>;
  listNodes(): Promise<NodeDefinition[]>;
  getNode(nodeExternalId: string): Promise<NodeDefinition>;
  listAllocations(nodeExternalId: string): Promise<Allocation[]>;
  listEggs(nestExternalId?: string): Promise<EggDefinition[]>;

  listServers(filter?: ListServersFilter): Promise<ServerInfo[]>;
  getServer(serverExternalId: string): Promise<ServerInfo>;
  provision(request: ProvisionRequest): Promise<ProvisionResult>;
  rebuild(request: RebuildRequest): Promise<ServerInfo>;
  suspend(serverExternalId: string, reason?: string): Promise<ServerInfo>;
  unsuspend(serverExternalId: string): Promise<ServerInfo>;
  terminate(serverExternalId: string, options?: TerminateOptions): Promise<void>;

  power(serverExternalId: string, signal: PowerSignal): Promise<void>;
  getTelemetry(serverExternalId: string): Promise<TelemetrySample>;
  openConsole(serverExternalId: string): Promise<ConsoleSession>;

  listBackups(serverExternalId: string): Promise<BackupInfo[]>;
  createBackup(serverExternalId: string, name: string): Promise<BackupInfo>;
  restoreBackup(serverExternalId: string, backupExternalId: string): Promise<void>;
  deleteBackup(serverExternalId: string, backupExternalId: string): Promise<void>;

  supports(type: VirtualizationType): boolean;
}
```

## Implementation rules

1. **Statelessness.** Drivers must not hold per-request state. Configuration
   is fixed at construction; everything else belongs to the caller or the
   backend. This lets one instance serve the API layer and workers.
2. **Errors.** Throw `HypervisorDriverError` with a `kind`, a
   `DriverErrorCode` from the union (`UNAUTHORIZED`, `NOT_FOUND`,
   `RATE_LIMITED`, `VALIDATION`, `TIMEOUT`, `CONFLICT`, `BACKEND_ERROR`,
   `NETWORK`, `NOT_SUPPORTED`) and a `status` when the backend returns one.
3. **Rate limiting.** Backends with rate limits must throttle outbound
   requests. Copy the token-bucket class from `pterodactyl.ts`.
4. **Timeouts.** Every fetch must carry a timeout
   (`AbortSignal.timeout`); the config field `timeoutMs` is the knob.
5. **Type guards.** Validate backend responses before use. Malformed payloads
   must raise `HypervisorDriverError`, never surface as undefined access.
6. **Console.** If the backend has no console API, throw `NOT_SUPPORTED`;
   the portal falls back to a deep link.

## Registration

1. Add the kind to the `HypervisorKind` union in `types.ts` and a config
   interface to `HypervisorConfig`.
2. Implement the driver in `src/lib/adapters/hypervisors/<name>.ts`.
3. Add a zod schema to `src/lib/adapters/hypervisors/index.ts` and extend the
   `instantiate` switch.
4. Add a row to `DRIVER_CATALOG` declaring the supported virtualization types.
5. Add the enum value to the Prisma `HypervisorKind` enum and migrate.

## Example skeleton

```ts
import {
  HypervisorDriverError,
  type HypervisorDriver,
  type ProvisionRequest,
  type ProvisionResult
} from "./types";

export class ExampleDriver implements HypervisorDriver {
  readonly kind = "example" as const;
  readonly configName: string;

  constructor(config: { name: string; baseUrl: string; token: string }) {
    this.configName = config.name;
    // store config, build the token-bucket limiter
  }

  supports(type: "vm" | "container"): boolean {
    return type === "vm";
  }

  async provision(request: ProvisionRequest): Promise<ProvisionResult> {
    const response = await fetch(`${this.baseUrl}/vms`, {
      method: "POST",
      headers: { Authorization: `Bearer ${this.token}` },
      body: JSON.stringify({ name: request.name, cores: request.resources.vcpu }),
      signal: AbortSignal.timeout(15_000)
    });
    if (!response.ok) {
      throw new HypervisorDriverError({
        kind: this.kind,
        code: "BACKEND_ERROR",
        message: `provision failed with HTTP ${response.status}`,
        status: response.status
      });
    }
    const created = (await response.json()) as { id: string };
    return { serverExternalId: created.id, state: "installing" };
  }

  // ... all remaining interface methods
}
```

## Testing

Add a driver test under `src/lib/adapters/hypervisors/__tests__` that mocks
`fetch` and asserts: success paths, error mapping per status code, rate
limiting, and timeout behavior. Run with `npm test`.
