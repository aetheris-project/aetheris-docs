# Configurazione bridge Pterodactyl

Aetheris pilota un Pterodactyl Panel tramite due superfici API. Questa pagina
documenta i requisiti del daemon, gli scope delle chiavi, la sincronizzazione
dei nodi e gli endpoint esatti chiamati dal driver.

## Superfici API

| Superficie | Base path | Usata per |
| --- | --- | --- |
| Application API | `/api/application` | Nodi, allocazioni, nest, egg, creazione/sospensione/ripristino/eliminazione server |
| Client API | `/api/client` | Segnali power, telemetria risorse, token WebSocket console, backup |

Il driver è `src/lib/adapters/hypervisors/pterodactyl.ts` in `aetheris-app`.

## Requisiti del daemon

Il daemon Wings su ogni nodo deve soddisfare:

- Node.js 16+ (Wings include il proprio runtime dalla 1.11).
- Docker Engine con uno storage driver che supporti overlay2.
- Accesso di rete in uscita al pannello e ai registry di immagini usati dagli
  egg che esponi.
- Il pannello deve poter raggiungere il daemon sulla porta configurata per nodo
  (default `8080`).
- Firewall: consenti la porta API del daemon dal pannello e l'intervallo di
  porte container allocato per nodo.

Verifica un daemon dal pannello: `Nodes -> <node> -> Configuration` e controlla
l'indicatore di salute. Aetheris si fida dello stato nodo del pannello durante
la sincronizzazione.

## Scope delle chiavi

### Application API key

Crealo nel pannello sotto `Admin -> Application API`. Permessi richiesti:

- Lettura e scrittura: `Servers`, `Nodes`, `Allocations`, `Eggs`, `Users`.

Salvala come `PTERODACTYL_APP_API_KEY`.

### Client API key

Crealo nel front end del pannello sotto `Account -> API Credentials` con login
da amministratore. Endpoint richiesti:

- `GET/POST /api/client/servers/{id}/power`
- `GET /api/client/servers/{id}/resources`
- `GET /api/client/servers/{id}/websocket`
- `GET/POST /api/client/servers/{id}/backups`
- `POST /api/client/servers/{id}/backups/{backup}/restore`
- `DELETE /api/client/servers/{id}/backups/{backup}`

Salvala come `PTERODACTYL_CLIENT_API_KEY`.

## Sincronizzazione nodi

1. Nell'Admin Panel Aetheris, aggiungi una credenziale hypervisor di tipo
   `pterodactyl` con entrambe le chiavi.
2. Esegui `Synchronize nodes`. Aetheris chiama `GET /api/application/nodes` e
   registra nome, FQDN, memoria, disco e capacità CPU di ogni nodo nella
   tabella `Node`.
3. Esegui `Synchronize eggs`. Aetheris enumera i nest con
   `GET /api/application/nests` e gli egg con
   `GET /api/application/nests/{id}/eggs`, poi li espone come template piano.

La sincronizzazione è idempotente: le righe sono abbinate per
`(hypervisorId, externalId)`.

## Contratto di provisioning

Quando un cliente ordina un piano, Aetheris costruisce questo payload:

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

`user` è l'id utente numerico Pterodactyl del cliente; Aetheris lo risolve
durante il collegamento account (match email contro
`GET /api/application/users`).

## Mapping del ciclo di vita

| Operazione Aetheris | Endpoint Pterodactyl |
| --- | --- |
| Provisioning | `POST /api/application/servers` |
| Sospendi | `POST /api/application/servers/{id}/suspend` |
| Ripristina | `POST /api/application/servers/{id}/unsuspend` |
| Termina | `DELETE /api/application/servers/{id}?force=1` |
| Power start/stop/restart/kill | `POST /api/client/servers/{id}/power` |
| Telemetria | `GET /api/client/servers/{id}/resources` |
| Console | `GET /api/client/servers/{id}/websocket` |
| Backup | `/api/client/servers/{id}/backups*` |

Gli endpoint di scrittura che richiedono l'id numerico del server lo risolvono
prima via `GET /api/application/servers/{identifier}`. Tutte le richieste
portano l'header `Accept: application/vnd.pterodactyl.v1+json` e sono
rate-limited da un token bucket (default 10 richieste al secondo).

## Verifica

```bash
curl -sS -H "Authorization: Bearer $PTERODACTYL_APP_API_KEY" \
     -H "Accept: application/vnd.pterodactyl.v1+json" \
     "https://panel.example.com/api/application/nodes?per_page=1"
```

Atteso HTTP 200. L'installer esegue questo controllo durante `bin/install.sh`.
