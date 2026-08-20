# Sicurezza

La sicurezza è una preoccupazione di primo livello in Aetheris: la piattaforma
conserva dati di billing, detiene le credenziali di hypervisor e gateway di
pagamento, ed espone un portale clienti pubblico. Questa pagina documenta i
controlli integrati e la checklist di hardening da applicare prima di andare
in produzione.

## Controlli integrati

### Crittografia delle credenziali a riposo

I token degli hypervisor, i segreti dei gateway e le password SMTP non vengono
mai memorizzati in chiaro. Il backend crittografa ogni segreto con AES-256-GCM
prima che tocchi il database:

```text
segreto in chiaro
      |
      v
   AES-256-GCM        <- chiave da AETHERIS_MASTER_KEY (32 byte casuali, base64)
      |
      v
   nonce (12 byte) + ciphertext + auth tag
      |
      v
   salvato in PostgreSQL
```

- La chiave master viene letta dall'ambiente, mai dal database.
- Ogni segreto riceve un nonce casuale fresco; l'auth tag rende rilevabile
  qualsiasi manomissione.
- Ruota la chiave master ri-crittografando i segreti con un job di
  manutenzione documentato (vedi sotto).

### Autenticazione

| Superficie | Meccanismo |
| --- | --- |
| Portale clienti | Email + password, hash scrypt, sessione JWT |
| Pannello admin | Stessi account, rotte protette per ruolo |
| API REST | `Authorization: Bearer <jwt>` o API key |
| API degli hypervisor | Token per driver, salvati crittografati |
| Consegna webhook | Firma HMAC-SHA256 per endpoint |

Le password sono hashate con scrypt usando un sale casuale per utente e un
work factor scelto per la latenza di login interattivo. I token di accesso JWT
sono a vita breve (15 minuti); i refresh token vengono ruotati a ogni uso e
possono essere revocati.

### Controllo degli accessi basato sui ruoli (RBAC)

Due ruoli integrati:

- **Admin**: nodi, piani, server, billing, whitelabel, utenti.
- **Client**: possiede i server assegnati al proprio account, può
  avviare/fermare, riavviare, aprire la console, creare backup e vedere le
  fatture.

L'autorizzazione è applicata nel layer API su ogni rotta; il layer web non si
fida mai dei flag lato client. Tutte le operazioni distruttive scrivono una
voce nell'audit log immutabile (tabella `audit_log`): chi, cosa, quando, da
quale IP.

### Rate limiting e protezione dagli abusi

- Rate limit per account sul login (mitiga il credential stuffing).
- Limiti per IP sul portale pubblico e sugli endpoint di contatto.
- Token bucket basati su Redis sugli endpoint di pagamento.
- Chiavi di idempotenza sulle operazioni di provisioning e billing, così le
  richieste duplicate non raddoppiano mai provisioning o addebiti.

### Traffico in uscita

Il layer worker parla con gli hypervisor su TLS. I certificati vengono
verificati; non è consentito alcun fallback non sicuro. Gli endpoint webhook
ricevono eventi firmati con HMAC-SHA256 usando un segreto per endpoint che
configuri tu.

## Checklist di hardening per il deploy

### 1. TLS ovunque

Termina TLS al bordo (Nginx/Caddy/load balancer) e forza HTTPS:

```nginx
server {
    listen 80;
    server_name panel.example.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name panel.example.com;

    ssl_certificate     /etc/letsencrypt/live/panel.example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/panel.example.com/privkey.pem;
    ssl_protocols       TLSv1.2 TLSv1.3;
    ssl_ciphers         HIGH:!aNULL:!MD5;
}
```

### 2. Segreti e ambiente

- Imposta una `AETHERIS_MASTER_KEY` forte (generala con
  `openssl rand -base64 32`) e conservala in un secret manager.
- Non committare mai `.env`; l'installer ne genera una con valori casuali.
- Ruota i token di gateway e hypervisor dal Pannello Admin quando cambia il
  personale.

### 3. Database e Redis

- PostgreSQL: usa un utente dedicato, rifiuta l'auth `trust`, abilita SSL,
  limita l'accesso di rete alla subnet dell'app.
- Redis: bind a localhost o a una rete privata, richiedi `requirepass` e non
  esporre mai la porta pubblicamente.

### 4. Rete

- Non esporre PostgreSQL (5432) o Redis (6379) su internet.
- Solo 80/443 (web) e 8000 (API, se la usi direttamente) dovrebbero essere
  raggiungibili dall'esterno.
- Metti i worker nella stessa rete privata degli hypervisor che gestiscono.

### 5. Aggiornamenti

Iscriviti agli annunci di release e applica gli aggiornamenti di sicurezza
alla piattaforma, all'OS host e alle immagini dei container. Vedi
[Upgrades](upgrades.md) per il percorso di upgrade supportato.

## Rotazione della chiave master

La rotazione di `AETHERIS_MASTER_KEY` richiede di ri-crittografare i segreti
salvati:

1. Ferma workers e API (nessuna scrittura durante la rotazione).
2. Imposta la nuova chiave come `AETHERIS_MASTER_KEY` nell'ambiente.
3. Esegui il task di manutenzione che decrittografa con la vecchia chiave e
   ri-crittografa con la nuova per ogni riga della tabella delle credenziali.
4. Riavvia lo stack e verifica una chiamata a un hypervisor e una consegna
   webhook.

## Runbook di risposta agli incidenti

1. **Contieni**: revoca le API key/token interessati dal Pannello Admin.
2. **Preserva**: fai uno snapshot del volume PostgreSQL ed esporta l'audit log.
3. **Indaga**: correla l'audit log con i log di accesso del web server.
4. **Recupera**: ruota tutti i segreti, ricostruisci gli host dalle immagini,
   ripristina i dati dall'ultimo backup pulito (vedi
   [Backup e restore](backup-and-restore.md)).
5. **Impara**: documenta la root cause e aggiorna questo runbook.

## Segnalare una vulnerabilità

Se trovi un problema di sicurezza, apri un advisory privato sul repository
`aetheris-project/aetheris-app` o contatta direttamente i maintainer. Per
favore non divulgare le vulnerabilità pubblicamente prima che venga rilasciato
un fix.
