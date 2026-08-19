# Adapter hypervisor personalizzato

Ogni backend supportato da Aetheris è una classe che implementa l'interfaccia
`HypervisorDriver` da `src/lib/adapters/hypervisors/types.ts` in
`aetheris-app`. Aggiungere un nuovo backend è una modifica su un singolo file
più una voce di registry.

## Il contratto

```ts
interface HypervisorDriver {
  readonly kind: HypervisorKind;      // "pterodactyl" | "proxmox" | "virtfusion" | <il tuo>
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

## Regole di implementazione

1. **Statelessness.** I driver non devono conservare stato per richiesta. La
   configurazione è fissata alla costruzione; tutto il resto appartiene al
   chiamante o al backend. Questo permette a un'istanza di servire sia il
   livello API sia i worker.
2. **Errori.** Lancia `HypervisorDriverError` con un `kind`, un
   `DriverErrorCode` dall'unione (`UNAUTHORIZED`, `NOT_FOUND`, `RATE_LIMITED`,
   `VALIDATION`, `TIMEOUT`, `CONFLICT`, `BACKEND_ERROR`, `NETWORK`,
   `NOT_SUPPORTED`) e uno `status` quando il backend ne restituisce uno.
3. **Rate limiting.** I backend con limiti di rate devono throttlare le
   richieste in uscita. Copia la classe token-bucket da `pterodactyl.ts`.
4. **Timeout.** Ogni fetch deve avere un timeout (`AbortSignal.timeout`); il
   campo di configurazione `timeoutMs` è la manopola.
5. **Type guard.** Valida le risposte backend prima dell'uso. I payload
   malformati devono lanciare `HypervisorDriverError`, mai emergere come
   accesso a undefined.
6. **Console.** Se il backend non ha un'API console, lancia `NOT_SUPPORTED`;
   il portale ripiega su un deep link.

## Registrazione

1. Aggiungi il kind all'unione `HypervisorKind` in `types.ts` e un'interfaccia
   di configurazione a `HypervisorConfig`.
2. Implementa il driver in `src/lib/adapters/hypervisors/<nome>.ts`.
3. Aggiungi uno schema zod a `src/lib/adapters/hypervisors/index.ts` ed
   estendi lo switch `instantiate`.
4. Aggiungi una riga a `DRIVER_CATALOG` che dichiari i tipi di virtualizzazione
   supportati.
5. Aggiungi il valore enum all'enum Prisma `HypervisorKind` e migra.

## Scheletro d'esempio

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
    // salva la config, costruisci il limiter token-bucket
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

  // ... tutti i restanti metodi dell'interfaccia
}
```

## Test

Aggiungi un test driver sotto `src/lib/adapters/hypervisors/__tests__` che
mocka `fetch` e verifica: percorsi di successo, mapping errori per status
code, rate limiting e comportamento dei timeout. Esegui con `npm test`.
