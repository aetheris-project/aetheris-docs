# Bridge Pterodactyl

Configurazione del bridge Pterodactyl per game hosting e server container.

## Cosa serve

| Chiave | Dove | Scopo |
| --- | --- | --- |
| `PTERODACTYL_APP_API_KEY` | Admin Panel → Application API | CRUD server, nodi, allocazioni |
| `PTERODACTYL_CLIENT_API_KEY` | Frontend → API Credentials | Power, telemetry, console, backup |
| `PTERODACTYL_PANEL_URL` | `.env` | URL del Pterodactyl Panel |

## Verifica connettività

```bash
curl -sS -H "Authorization: Bearer $PTERODACTYL_APP_API_KEY" \
  -H "Accept: application/vnd.pterodactyl.v1+json" \
  "https://panel.example.com/api/application/nodes?per_page=1"
```

## Sincronizzazione nodi

Nel Pannello Admin → Nodes → Aggiungi credenziale `pterodactyl` → **Synchronize nodes**.

## Flow di provisioning

1. Client ordina un piano.
2. Aetheris seleziona il nodo con l'egg corrispondente.
3. Risolve un'allocazione libera.
4. Chiama `POST /api/application/servers`.
5. Server creato, client accede alla console.

Vedi anche: [Provisioning server](server-provisioning.md), [Game hosting](game-hosting.md).
