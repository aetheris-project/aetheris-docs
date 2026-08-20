# Game hosting

Linea completa di game hosting sopra il bridge Pterodactyl. Ogni gioco è un egg Pterodactyl, un'immagine Docker e una voce di catalogo.

## Catalogo API

```bash
GET /api/catalog/games          # lista giochi
GET /api/catalog/games/{slug}   # dettagli + preset
```

## Giochi supportati

| Gioco | Slug | Porta predefinita |
| --- | --- | --- |
| Minecraft Java | `minecraft-java` | 25565 |
| Minecraft Bedrock | `minecraft-bedrock` | 19132 |
| Ark: Survival Evolved | `ark` | 7778 |
| Valheim | `valheim` | 2456 |
| Rust | `rust` | 28015 |
| Palworld | `palworld` | 8211 |

## Come funziona

1. Il client seleziona un gioco dallo store.
2. Aetheris trova un nodo Pterodactyl con l'egg corrispondente.
3. Il server viene creato con l'immagine Docker del gioco.
4. Il client accede alla console via VNC.

Vedi anche: [Bridge Pterodactyl](pterodactyl-bridge.md), [Provisioning server](server-provisioning.md).
