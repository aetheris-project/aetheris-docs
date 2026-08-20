# Game hosting

Complete game hosting product line on top of the Pterodactyl bridge. Every game is a Pterodactyl egg, a Docker image and a catalog entry.

## Catalog API

```bash
GET /api/catalog/games          # list all games
GET /api/catalog/games/{slug}   # game details + presets
```

## Supported games

| Game | Slug | Default port |
| --- | --- | --- |
| Minecraft Java | `minecraft-java` | 25565 |
| Minecraft Bedrock | `minecraft-bedrock` | 19132 |
| Ark: Survival Evolved | `ark` | 7778 |
| Valheim | `valheim` | 2456 |
| Rust | `rust` | 28015 |
| Palworld | `palworld` | 8211 |

## How it works

1. Client selects a game from the store.
2. Aetheris picks a Pterodactyl node with the matching egg.
3. Server is provisioned with the game's Docker image.
4. Client gets console access via the VNC console.

## Quick links

- [Game hosting catalog](game-hosting-catalog.md) — full catalog, presets, pricing

See also: [Pterodactyl bridge](pterodactyl-bridge.md), [Server provisioning](server-provisioning.md).
