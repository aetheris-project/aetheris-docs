# Redis

Redis alimenta le code BullMQ, la cache, il rate limiting e il pub/sub WebSocket.

## Setup

```bash
sudo apt install redis-server
sudo systemctl enable --now redis-server
redis-cli ping   # PONG
```

## Configurazione

```ini
REDIS_URL=redis://127.0.0.1:6379
```

## Utilizzo in Aetheris

| Funzionalità | Come usa Redis |
| --- | --- |
| Code BullMQ | Schedulazione job, retry, rate limiting |
| Cache sessione | Token e dati utente |
| Rate limiting | Throttling per IP |
| WebSocket pub/sub | Console e telemetry real-time |

## Persistenza (produzione)

Abilita AOF per durabilità:

```conf
appendonly yes
appendfsync everysec
```

Vedi anche: [Architettura](architecture.md), [Variabili d'ambiente](environment-variables.md).
