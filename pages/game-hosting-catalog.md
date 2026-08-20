# Game hosting — Catalog

Full game catalog, resource presets and pricing.

## Catalog entries

Each game entry includes:

```json
{
  "slug": "minecraft-java",
  "name": "Minecraft Java",
  "category": "minecraft",
  "image": "ghcr.io/aetheris-project/minecraft-java:latest",
  "defaultPort": 25565,
  "presets": [
    { "name": "Starter", "vcpu": 2, "memoryMb": 2048, "diskMb": 10240, "slots": 10, "priceCents": 999 },
    { "name": "Pro", "vcpu": 4, "memoryMb": 4096, "diskMb": 20480, "slots": 50, "priceCents": 1999 }
  ]
}
```

## Resource presets

| Preset | vCPU | RAM | Disk | Slots | Price/mo |
| --- | --- | --- | --- | --- | --- |
| Starter | 2 | 2 GB | 10 GB | 10 | €9.99 |
| Pro | 4 | 4 GB | 20 GB | 50 | €19.99 |
| Enterprise | 8 | 8 GB | 50 GB | 200 | €49.99 |

## Pterodactyl eggs

Each game maps to a Pterodactyl egg in the [aetheris-game-eggs](https://github.com/aetheris-project/aetheris-game-eggs) repository. Assign eggs to plans in Admin → Billing → Plans.

## Provisioning flow

1. Client selects game and preset.
2. Aetheris finds a node with the matching egg and free allocation.
3. Calls `POST /api/application/servers` with egg, image, resources.
4. Server starts, client gets console access.

See also: [Pterodactyl bridge](pterodactyl-bridge.md), [Billing plans](billing-plans.md).
