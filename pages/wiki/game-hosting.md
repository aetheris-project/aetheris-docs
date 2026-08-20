# Game hosting

Aetheris ships a complete game hosting product line on top of its Pterodactyl
bridge. Every game is a first-class citizen: a **Pterodactyl egg** in the
[aetheris-game-eggs](https://github.com/aetheris-project/aetheris-game-eggs)
repository, a **runtime image** published to the GitHub Container Registry, and
a **catalog entry** with resource presets and retail pricing served by the
Aetheris control plane API.

## Catalog

The catalog is available to any client at:

```
GET /api/catalog/games
GET /api/catalog/games/{slug}
```

Each entry returns the game metadata, the Docker image, the default port and
the deployable presets (vCPU, memory, disk, slots and monthly price in cents):

```bash
curl -s https://api.aetheris.example/api/catalog/games/minecraft-java | jq
```

```json
{
  "slug": "minecraft-java",
  "name": "Minecraft Java",
  "category": "minecraft",
  "default_port": 25565,
  "min_memory_mb": 1024,
  "presets": [
    { "name": "Iron", "vcpu": 1, "memory_mb": 2048, "disk_gb": 10, "slots": 10, "price_cents": 499 },
    { "name": "Gold", "vcpu": 2, "memory_mb": 4096, "disk_gb": 20, "slots": 20, "price_cents": 899 }
  ]
}
```

### Games

| Game | Slug | Category | Default port | Minimum memory |
| --- | --- | --- | --- | --- |
| Minecraft Java | `minecraft-java` | minecraft | 25565 | 1 GB |
| 7 Days to Die | `7dtd` | survival | 26900 | 4 GB |
| V Rising | `vrising` | survival | 9874 | 4 GB |
| Counter-Strike 2 | `cs2` | fps | 27015 | 2 GB |
| Rust | `rust` | survival | 28015 | 8 GB |
| ARK: Survival Ascended | `ark-asa` | survival | 7777 | 8 GB |
| Valheim | `valheim` | survival | 2456 | 2 GB |
| Terraria | `terraria` | sandbox | 7777 | 1 GB |
| Palworld | `palworld` | survival | 8211 | 4 GB |
| Factorio | `factorio` | automation | 34197 | 1 GB |
| Enshrouded | `enshrouded` | survival | 15636 | 4 GB |
| Don't Starve Together | `dst` | survival | 10999 | 1 GB |
| Team Fortress 2 | `tf2` | fps | 27015 | 2 GB |
| SCP: Secret Laboratory | `scpsl` | horror | 7777 | 2 GB |

## Egg catalog

The [aetheris-game-eggs](https://github.com/aetheris-project/aetheris-game-eggs)
repository holds **27 drop-in Pterodactyl eggs** (`PTDL_v2` schema), each with:

1. `egg.json` - the Pterodactyl manifest: image, startup command, stop command,
   configuration parsing and install variables.
2. `install.sh` - a deterministic installer (checksummed downloads, idempotent).
3. `images/<game>/Dockerfile` - the runtime container image.

### Import into Pterodactyl

```bash
cd /var/www/pterodactyl
php artisan p:egg:import /path/to/aetheris-game-eggs/eggs/minecraft/java/egg.json
```

### Minecraft family

| Egg | Purpose |
| --- | --- |
| `eggs/minecraft/java` | Vanilla / Paper / Purpur / Fabric with Aikar's flags |
| `eggs/minecraft/forge` | Forge mod loader with automatic version resolution |
| `eggs/minecraft/paper` | Paper fork with latest-version resolution |
| `eggs/minecraft/velocity` | Velocity network proxy |
| `eggs/minecraft/bedrock` | Bedrock Edition server |

### SteamCMD family

| Egg | App ID |
| --- | --- |
| `eggs/7dtd` | 294420 |
| `eggs/vrising` | 1829350 |
| `eggs/enshrouded` | 2278520 |
| `eggs/dst` | 343946 |
| `eggs/scpsl` | 996560 |
| `eggs/tf2` | 232250 |
| `eggs/l4d2` | 222860 |
| `eggs/conan-exiles` | 443030 |
| `eggs/space-engineers` | 298740 |
| `eggs/starbound` | 211820 |

### Other games

| Egg | Install method |
| --- | --- |
| `eggs/terraria` | TShock / vanilla server binary |
| `eggs/valheim` | SteamCMD (app 896660) |
| `eggs/palworld` | SteamCMD (app 2394010) |
| `eggs/ark-asa` | SteamCMD (app 2430930) |
| `eggs/cs2` | SteamCMD (app 740) |
| `eggs/rust` | SteamCMD (app 258550) |
| `eggs/gmod` | SteamCMD (app 4020) |
| `eggs/fivem` | FiveM artifacts server |
| `eggs/project-zomboid` | SteamCMD (app 380870) |
| `eggs/factorio` | Factorio headless archive |
| `eggs/satisfactory` | SteamCMD (app 1690800) |
| `eggs/vintage-story` | Vintage Story Linux server archive |

## Ordering a server

The control plane provisions game servers through the Pterodactyl driver:

1. The client picks a game and a preset from `/api/catalog/games`.
2. The billing engine creates a pending invoice for the preset price
   (see [Billing](billing.md)).
3. On payment, the provisioner calls the Pterodactyl Application API,
   selects a node with capacity, targets the nest/egg from this repository
   and creates the server with the preset's resource limits.
4. The client receives the server credentials and can open the
   [VNC console](/console/{serverId}) or manage the server from the panel.

## Extending the catalog

New SteamCMD or Minecraft-family games are added by editing the declarative
table in `aetheris-game-eggs/tools/generate_eggs.py` and running:

```bash
python tools/generate_eggs.py
python tools/validate_eggs.py
```

Hand-tuned eggs (for example `minecraft/java`) stay checked in and are not
overwritten by the generator. See `docs/egg-authoring.md` in that repository
for the full authoring guide.
