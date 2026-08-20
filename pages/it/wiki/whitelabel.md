# Whitelabeling dinamico

Ogni superficie di branding è configurabile a runtime dal Pannello Admin e
persistita in PostgreSQL, con una cache Redis davanti. Nessun rebuild o
redeploy è richiesto: cambia un logo, un colore accent o il nome della
piattaforma e la pagina successiva lo riflette.

## Superfici configurabili

| Superficie | Salvata in | Consumata da |
| --- | --- | --- |
| Nome e tagline della piattaforma | `WhitelabelConfig.brand` | Header, footer, email, meta tag |
| URL dei logo | `WhitelabelConfig.brand` | Header, footer, fatture |
| Tema accent (emerald / indigo / amber) | `WhitelabelConfig.theme.accent` | Variabili CSS via `data-accent` |
| Border radius e font family | `WhitelabelConfig.theme` | Design token |
| Link di navigazione | `WhitelabelConfig.navigation` | Header del sito e sitemap |
| Template email | `WhitelabelConfig.emailTemplates` | Rendering email del worker |
| Routing del dominio personalizzato | `Organization.customDomain` | Routing al bordo per tenant |
| Toggle dei moduli di integrazione | `WhitelabelConfig.modules` | Feature flag nell'interfaccia |

## Come funziona

1. Il Pannello Admin scrive una riga `WhitelabelConfig` per l'organizzazione.
2. `GET /api/whitelabel?organization=<slug>` legge Redis
   (`aetheris:whitelabel:<slug>`, TTL 300 secondi) e ricade su PostgreSQL,
   poi ripopola la cache.
3. Il sito marketing (`aetheris-website`) interroga questo endpoint tramite
   `NEXT_PUBLIC_WHITELABEL_URL` e fa un deep-merge sul default statico in
   `lib/config/whitelabel.json`.
4. Il `WhitelabelProvider` imposta `data-accent` sulla root del documento,
   attivando il blocco di variabili CSS per l'accent selezionato. Il primo
   paint usa il JSON statico, quindi il branding non dipende mai dai tempi di
   rete (zero layout shift).

## Riferimento della configurazione

Un oggetto di configurazione completo ha questo aspetto:

```json
{
  "brand": {
    "name": "Aetheris",
    "tagline": "Control plane di billing e virtualizzazione",
    "logoUrl": "https://cdn.example.com/logo.svg",
    "domain": "aetheris.enterprise"
  },
  "theme": {
    "accent": "emerald",
    "borderRadius": "0.75rem",
    "fontFamily": "Inter, system-ui, sans-serif"
  },
  "navigation": [
    { "label": "Prodotto", "href": "#product" },
    { "label": "Demo live", "href": "/demo", "cta": true }
  ],
  "emailTemplates": {
    "invoice.created": {
      "subject": "La tua fattura {{invoice_number}} da {{brand_name}}",
      "body": "Ciao,\nla tua fattura di {{amount}} scade il {{due_date}}.\n{{brand_name}}"
    }
  },
  "modules": {
    "billing": true,
    "vncConsole": true,
    "pterodactyl": true
  }
}
```

### Riferimento dei campi

| Campo | Tipo | Descrizione |
| --- | --- | --- |
| `brand.name` | string | Nome della piattaforma mostrato in header, footer ed email. |
| `brand.tagline` | string | Descrizione di una riga sotto il logo. |
| `brand.logoUrl` | string (URL) | Logo quadrato, usato a 24-48px. Preferisci un SVG. |
| `brand.domain` | string | Dominio canonico per canonical tag e link. |
| `theme.accent` | enum | `emerald` \| `indigo` \| `amber`. |
| `theme.borderRadius` | string | Token CSS border-radius per card e bottoni. |
| `theme.fontFamily` | string | Font stack CSS per tutta l'interfaccia. |
| `navigation` | array | Link ordinati; `cta: true` renderizza un bottone primario. |
| `emailTemplates` | object | Template per evento con `subject` e `body`. |
| `modules` | object | Feature toggle consumati dall'interfaccia. |

## API

### Leggere la configurazione attiva

```http
GET /api/whitelabel?organization=<slug>
```

Risposta `200`:

```json
{
  "organization": "aetheris",
  "config": {
    "brand": { "name": "Aetheris", "tagline": "..." },
    "theme": { "accent": "emerald" },
    "navigation": [],
    "emailTemplates": {},
    "modules": {}
  },
  "cache": "redis"
}
```

`cache` è `redis` o `database` a seconda di dove è stata servita la riga.

### Aggiornare la configurazione (admin)

```http
PUT /api/whitelabel
Authorization: Bearer <admin-jwt>
Content-Type: application/json
```

Il body ha la stessa forma del riferimento qui sopra. L'aggiornamento scrive
su PostgreSQL e invalida la chiave Redis così la lettura successiva è fresca.

## Domini personalizzati

Assegna a un tenant il proprio dominio così portale e pannello admin vengono
serviti sotto il brand del cliente.

### 1. Imposta il dominio personalizzato

Nel Pannello Admin imposta `Organization.customDomain` (per esempio
`panel.mymarca.com`).

### 2. Punta il DNS al bordo della piattaforma

```text
CNAME panel.mymarca.com -> panel.aetheris.enterprise
```

### 3. Routing per Host header (esempio Nginx)

```nginx
server {
    listen 443 ssl;
    server_name panel.mymarca.com;

    ssl_certificate     /etc/letsencrypt/live/panel.mymarca.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/panel.mymarca.com/privkey.pem;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

L'endpoint whitelabel risolve il tenant per dominio quando il parametro
`organization` è assente, quindi ogni pagina sotto il dominio personalizzato
viene brandizzata automaticamente per quel tenant.

## Template email

I template vivono in `WhitelabelConfig.emailTemplates`, con chiave per
evento. Il worker li renderizza con le variabili del job che li ha innescati:

| Chiave | Trigger | Variabili |
| --- | --- | --- |
| `invoice.created` | Fattura generata | `invoice_number`, `amount`, `due_date`, `brand_name` |
| `invoice.paid` | Pagamento riuscito | `invoice_number`, `amount`, `transaction_id` |
| `invoice.dunning` | Riprova pagamento avviata | `invoice_number`, `attempt`, `next_attempt` |
| `server.suspended` | Dunning esaurito | `server_name`, `brand_name`, `support_url` |
| `server.provisioned` | Server pronto | `server_name`, `ipv4`, `console_url` |
| `account.welcome` | Account creato | `account_email`, `brand_name`, `portal_url` |

Le variabili usano `{{doppie_graffe}}` e vengono HTML-escaped dal renderer.
Includi sempre `brand_name` così i destinatari vedono il tuo brand anche se un
template viene personalizzato in seguito.

## Cache e consistenza

- Il TTL della chiave Redis è 300 secondi. Le scritture la invalidano
  subito, quindi gli aggiornamenti sono visibili alla lettura successiva.
- Il sito marketing mantiene il proprio fallback statico in
  `lib/config/whitelabel.json`; se l'API è irraggiungibile il sito si
  renderizza comunque con il branding di default.
- Quando Redis è giù, le letture ricadono automaticamente su PostgreSQL; il
  campo `cache` nella risposta ti dice quale percorso ha servito i dati.

## Permessi

Solo gli utenti `admin` possono leggere e scrivere la configurazione
whitelabel. Le letture tramite l'endpoint pubblico sono limitate
all'organizzazione richiesta e non espongono mai segreti (i body dei template
email vengono restituiti, ma mai password SMTP o API key).

## Best practice

- Mantieni i logo come SVG sotto i 64KB e servili da un CDN con cache.
- Testa i cambi di accent in staging prima di pubblicarli: il token accent
  tocca ogni bottone, link e highlight dell'interfaccia.
- Usa `theme.borderRadius` e `theme.fontFamily` con parsimonia - cambiarli
  può alterare visibilmente il layout; mantieni i valori dentro i token del
  design system.
- Scrivi i template email con la variante plain-text e quella HTML; il worker
  ricade sul plain-text quando manca l'HTML.
