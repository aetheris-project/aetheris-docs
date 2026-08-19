# Configurazione VirtFusion

Aetheris pilota VirtFusion tramite la sua REST API con bearer token (`/api/v1`)
per il ciclo di vita VM, il controllo power, gli snapshot e la telemetria host.

## 1. Crea un token API

Nel pannello di controllo VirtFusion: `Account -> API Keys -> Create`. Copia
subito il token; VirtFusion lo mostra una sola volta.

In Aetheris, aggiungi una credenziale hypervisor di tipo `virtfusion`:

| Campo | Esempio |
| --- | --- |
| API URL | `https://vf.example.com` |
| API key | il token generato |

Equivalenti ambiente: `VIRTFUSION_URL`, `VIRTFUSION_API_KEY`.

## 2. Template e piani

VirtFusion provisiona le VM da template e piani. Referenzia entrambi nel piano
Aetheris:

- `image` - il nome del template VirtFusion.
- `templateExternalId` - il nome del piano VirtFusion.

Aetheris mappa i limiti di risorse sui campi payload `cpu_cores`, `ram_mb` e
`disk_gb`.

## 3. Mapping del ciclo di vita

| Operazione Aetheris | Endpoint VirtFusion |
| --- | --- |
| Provisioning | `POST /api/v1/vms` |
| Start / Stop / Restart | `POST /api/v1/vms/{id}/power/{start\|shutdown\|restart}` |
| Suspend / Unsuspend | Power stop / power start |
| Termina | `DELETE /api/v1/vms/{id}` |
| Rebuild | `PUT /api/v1/vms/{id}` |
| Snapshot | `/api/v1/vms/{id}/snapshots*` |
| Nodi | `GET /api/v1/servers` |

## 4. Limite della console

VirtFusion non espone una WebSocket API di console pubblica. `openConsole` del
driver lancia `NOT_SUPPORTED`; il portale clienti ripiega su un link all'UI
VirtFusion. Instrada noVNC attraverso l'endpoint proxy VirtFusion se il tuo
deployment ne fornisce uno.

## 5. Telemetria

VirtFusion riporta le statistiche tramite il suo endpoint webhook/statistiche
piuttosto che un endpoint REST di polling. Il driver restituisce campioni
azzerati dopo aver verificato la raggiungibilità della VM; collega il receiver
webhook in `src/app/api` per popolare le tabelle di telemetria per le
dashboard.
