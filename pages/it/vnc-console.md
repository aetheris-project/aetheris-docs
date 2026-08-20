# Console VNC

Accesso terminale real-time ai server dal portale client.

## Come funziona

1. Client apre `/console/{serverId}`.
2. Backend genera un token VNC temporaneo dall'hypervisor.
3. Client si connette via WebSocket al proxy VNC.
4. Frame del terminale in streaming real-time.

## Prerequisiti

- L'hypervisor deve supportare VNC.
- Il reverse proxy deve inoltrare header `Upgrade` e `Connection: upgrade`.
- Timeout WebSocket almeno 600 secondi.

## Troubleshooting

| Sintomo | Fix |
| --- | --- |
| Console mostra "Connecting..." | Controlla header WebSocket in Nginx/Caddy |
| Schermo vuoto | VNC potrebbe non essere abilitato sull'hypervisor |
| Connessione cade | Aumenta `proxy_read_timeout` a 600s |
| "Token expired" | Riapri la pagina console per un token fresco |

Vedi anche: [Reverse proxy](reverse-proxy.md), [Troubleshooting](troubleshooting.md).
