# Aggiornamenti

Come aggiornare Aetheris all'ultima versione.

## Docker

```bash
cd aetheris-app
git pull origin main
docker compose up -d --build
```

Le migration partono automaticamente all'avvio del container.

## Manuale (systemd)

```bash
cd /opt/aetheris-app
git pull origin main
npm ci && npx prisma migrate deploy
npm run build
sudo systemctl restart aetheris-web aetheris-worker aetheris-backend
```

## Verifica aggiornamenti

Il Pannello Admin → Status mostra l'ultima release GitHub e se è disponibile un aggiornamento.

## Rollback

```bash
git log --oneline -10      # trova l'ultimo commit buono
git checkout <commit>      # pin a quella versione
docker compose up -d --build
```

Vedi anche: [Installazione](installation.md), [Monitoraggio](monitoring.md).
