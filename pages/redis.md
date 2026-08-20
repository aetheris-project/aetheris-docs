# Redis

Redis powers BullMQ queues, caching, rate limiting and WebSocket pub/sub.

## Setup

```bash
sudo apt install redis-server
sudo systemctl enable --now redis-server
redis-cli ping   # expect: PONG
```

## Configuration

```ini
REDIS_URL=redis://127.0.0.1:6379
```

## Usage in Aetheris

| Feature | How Redis is used |
| --- | --- |
| BullMQ queues | Job scheduling, retries, rate limiting |
| Session cache | Token and user data cache |
| Rate limiting | Per-IP request throttling |
| WebSocket pub/sub | Real-time console and telemetry |

## Persistence (production)

Enable AOF for durability:

```conf
# /etc/redis/redis.conf
appendonly yes
appendfsync everysec
```

## Health check

```bash
redis-cli ping
# PONG

redis-cli info keyspace
```

See also: [Architecture](architecture.md), [Environment variables](environment-variables.md).
