# Whititelabeling

Ogni superficie di branding è configurabile a runtime dal Pannello Admin. Nessun rebuild richiesto.

## Cosa puoi cambiare

| Superficie | Esempio |
| --- | --- |
| Nome piattaforma e tagline | Header, footer, email, meta tag |
| URL logo | Header, footer, fatture |
| Tema accent | Emerald / Indigo / Amber via CSS |
| Border radius e font | Design token |
| Link navigazione | Header sito e sitemap |
| Template email | Rendering email worker |
| Dominio custom | Edge routing per tenant |
| Toggle moduli | Feature flags nella UI |

## Come funziona

1. Il Pannello Admin scrive una riga `WhitelabelConfig` in PostgreSQL.
2. `GET /api/whitelabel?organization=<slug>` legge Redis (TTL 300s), fallback a PostgreSQL.
3. Il sito web recupera e merge con il default statico.
4. `WhitelabelProvider` imposta `data-accent` su `<html>`.

Vedi anche: [API Whitelabel](whitelabel-api.md), [Temi](theming.md).
