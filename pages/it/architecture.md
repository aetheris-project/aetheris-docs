# Architettura

Come è costruito Aetheris e come i componenti comunicano.

## Componenti

| Componente | Ruolo | Porta |
| --- | --- | --- |
| App web | Portale client, pannello admin (Next.js) | 3000 |
| Backend | REST API, auth, billing (FastAPI) | 8000 |
| Worker | Job BullMQ background | — |
| PostgreSQL | Store dati principale | 5432 |
| Redis | Code, cache, rate limiting | 6379 |

## Topologie di deploy

| Topologia | Caso d'uso |
| --- | --- |
| Singolo host | La maggior parte dei deployment |
| Tier separato | Flotte sopra qualche centinaio di server |
| Multi-regione | Deployment geografici distribuiti |

## Domini di guasto

| Guasto | Impatto | Mitigazione |
| --- | --- | --- |
| Web app giù | Portale irraggiungibile | Repliche multiple, health check |
| API giù | Tutte le operazioni falliscono | Repliche, probe `/health` |
| Worker giù | Code si accumulano | Restart policy, alert queue lag |
| PostgreSQL giù | Read/scrive fallisce | Backup PITR, provider gestito |
| Redis giù | Code e cache persi | Persistenza AOF, replica |

Vedi anche: [Docker](docker.md), [Backend](backend.md), [Porte](ports.md).
