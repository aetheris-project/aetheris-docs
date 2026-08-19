# Dynamic whitelabeling

Every branding surface is configurable at runtime from the Admin Panel and
persisted in PostgreSQL, with a Redis cache in front. No rebuild or redeploy
is required.

## Configurable surfaces

| Surface | Stored as | Consumed by |
| --- | --- | --- |
| Platform name and tagline | `WhitelabelConfig.brand` | Header, footer, emails, meta tags |
| Logo URLs | `WhitelabelConfig.brand` | Header, footer, invoices |
| Accent theme (emerald / indigo / amber) | `WhitelabelConfig.theme.accent` | CSS variables via `data-accent` |
| Border radius and font family | `WhitelabelConfig.theme` | Design tokens |
| Navigation links | `WhitelabelConfig.navigation` | Site header and sitemap |
| Email templates | `WhitelabelConfig.emailTemplates` | Worker email rendering |
| Custom domain routing | `Organization.customDomain` | Edge routing per tenant |
| Integration module toggles | `WhitelabelConfig.modules` | Feature flags in the UI |

## How it works

1. The Admin Panel writes a `WhitelabelConfig` row for the organization.
2. `GET /api/whitelabel?organization=<slug>` reads Redis
   (`aetheris:whitelabel:<slug>`, TTL 300 seconds) and falls back to
   PostgreSQL, then repopulates the cache.
3. The marketing site (`aetheris-website`) fetches this endpoint through
   `NEXT_PUBLIC_WHITELABEL_URL` and deep-merges it over the static default in
   `lib/config/whitelabel.json`.
4. The `WhitelabelProvider` sets `data-accent` on the document root, activating
   the CSS variable block for the selected accent. The first paint uses the
   static JSON, so branding never depends on network timing (zero layout
   shift).

## Accent tokens

| Accent | Primary | Strong | Soft |
| --- | --- | --- | --- |
| Emerald | `#10B981` | `#059669` | `rgba(16,185,129,0.12)` |
| Indigo | `#6366F1` | `#4F46E5` | `rgba(99,102,241,0.12)` |
| Amber | `#F59E0B` | `#D97706` | `rgba(245,158,11,0.12)` |

## Email templates

Email templates live in `WhitelabelConfig.emailTemplates`, keyed by event.
The worker renders them with the variables of the triggering job:

| Key | Trigger | Variables |
| --- | --- | --- |
| `invoice.created` | Invoice generated | `invoice_number`, `amount`, `due_date`, `brand_name` |
| `invoice.paid` | Payment succeeded | `invoice_number`, `amount`, `transaction_id` |
| `server.suspended` | Dunning exhausted | `server_name`, `brand_name`, `support_url` |
| `server.provisioned` | Server ready | `server_name`, `ipv4`, `console_url` |

## Custom domains

Set `Organization.customDomain` and route the tenant through the edge
(`AETHERIS_APP_URL` reverse proxy with a `Host` match). The whitelabel
endpoint resolves the tenant by domain when the `organization` parameter is
absent.
