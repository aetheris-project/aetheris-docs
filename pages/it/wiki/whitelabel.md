# Whitelabel dinamico

Ogni superficie di branding è configurabile a runtime dall'Admin Panel e
salvata in PostgreSQL, con una cache Redis davanti. Non servono rebuild né
redeploy.

## Superfici configurabili

| Superficie | Salvata come | Consumata da |
| --- | --- | --- |
| Nome e tagline piattaforma | `WhitelabelConfig.brand` | Header, footer, email, meta tag |
| URL logo | `WhitelabelConfig.brand` | Header, footer, fatture |
| Tema accento (emerald / indigo / amber) | `WhitelabelConfig.theme.accent` | Variabili CSS via `data-accent` |
| Raggio bordi e font family | `WhitelabelConfig.theme` | Design token |
| Link di navigazione | `WhitelabelConfig.navigation` | Header del sito e sitemap |
| Template email | `WhitelabelConfig.emailTemplates` | Rendering email dei worker |
| Routing dominio personalizzato | `Organization.customDomain` | Routing edge per tenant |
| Toggle moduli integrazione | `WhitelabelConfig.modules` | Feature flag nella UI |

## Come funziona

1. L'Admin Panel scrive una riga `WhitelabelConfig` per l'organizzazione.
2. `GET /api/whitelabel?organization=<slug>` legge Redis
   (`aetheris:whitelabel:<slug>`, TTL 300 secondi) e ripiega su PostgreSQL,
   poi ripopola la cache.
3. Il sito marketing (`aetheris-website`) recupera questo endpoint tramite
   `NEXT_PUBLIC_WHITELABEL_URL` e lo unisce in deep-merge sopra il default
   statico in `lib/config/whitelabel.json`.
4. Il `WhitelabelProvider` imposta `data-accent` sulla radice del documento,
   attivando il blocco di variabili CSS per l'accento selezionato. Il primo
   paint usa il JSON statico, quindi il branding non dipende mai dai tempi di
   rete (zero layout shift).

## Token accento

| Accento | Primary | Strong | Soft |
| --- | --- | --- | --- |
| Emerald | `#10B981` | `#059669` | `rgba(16,185,129,0.12)` |
| Indigo | `#6366F1` | `#4F46E5` | `rgba(99,102,241,0.12)` |
| Amber | `#F59E0B` | `#D97706` | `rgba(245,158,11,0.12)` |

## Template email

I template email vivono in `WhitelabelConfig.emailTemplates`, chiavati per
evento. Il worker li renderizza con le variabili del job che li ha triggerati:

| Chiave | Trigger | Variabili |
| --- | --- | --- |
| `invoice.created` | Fattura generata | `invoice_number`, `amount`, `due_date`, `brand_name` |
| `invoice.paid` | Pagamento riuscito | `invoice_number`, `amount`, `transaction_id` |
| `server.suspended` | Dunning esaurito | `server_name`, `brand_name`, `support_url` |
| `server.provisioned` | Server pronto | `server_name`, `ipv4`, `console_url` |

## Domini personalizzati

Imposta `Organization.customDomain` e instrada il tenant attraverso l'edge
(reverse proxy `AETHERIS_APP_URL` con match `Host`). L'endpoint whitelabel
risolve il tenant per dominio quando il parametro `organization` è assente.
