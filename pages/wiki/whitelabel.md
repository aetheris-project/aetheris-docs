# Dynamic whitelabeling

Every branding surface is configurable at runtime from the Admin Panel and
persisted in PostgreSQL, with a Redis cache in front. No rebuild or redeploy
is required: change a logo, an accent color or the platform name and the next
page load reflects it.

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

## Configuration reference

A full configuration object looks like this:

```json
{
  "brand": {
    "name": "Aetheris",
    "tagline": "Billing and virtualization control plane",
    "logoUrl": "https://cdn.example.com/logo.svg",
    "domain": "aetheris-web.vercel.app"
  },
  "theme": {
    "accent": "emerald",
    "borderRadius": "0.75rem",
    "fontFamily": "Inter, system-ui, sans-serif"
  },
  "navigation": [
    { "label": "Product", "href": "#product" },
    { "label": "Live demo", "href": "/demo", "cta": true }
  ],
  "emailTemplates": {
    "invoice.created": {
      "subject": "Your invoice {{invoice_number}} from {{brand_name}}",
      "body": "Hello,\nyour invoice of {{amount}} is due on {{due_date}}.\n{{brand_name}}"
    }
  },
  "modules": {
    "billing": true,
    "vncConsole": true,
    "pterodactyl": true
  }
}
```

### Field reference

| Field | Type | Description |
| --- | --- | --- |
| `brand.name` | string | Platform name shown in header, footer and emails. |
| `brand.tagline` | string | One-line description under the logo. |
| `brand.logoUrl` | string (URL) | Square logo, used at 24-48px. Prefer an SVG. |
| `brand.domain` | string | Canonical domain for canonical tags and links. |
| `theme.accent` | enum | `emerald` \| `indigo` \| `amber`. |
| `theme.borderRadius` | string | CSS border-radius token for cards and buttons. |
| `theme.fontFamily` | string | CSS font stack for the whole UI. |
| `navigation` | array | Ordered links; `cta: true` renders as a primary button. |
| `emailTemplates` | object | Per-event templates with `subject` and `body`. |
| `modules` | object | Feature toggles consumed by the UI. |

## API

### Read the active configuration

```http
GET /api/whitelabel?organization=<slug>
```

Response `200`:

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

`cache` is `redis` or `database` depending on where the row was served from.

### Update the configuration (admin)

```http
PUT /api/whitelabel
Authorization: Bearer <admin-jwt>
Content-Type: application/json
```

The body is the same shape as the reference above. The update writes
PostgreSQL and invalidates the Redis key so the next read is fresh.

## Custom domains

Assign a tenant its own domain so the portal and admin panel are served under
the client's brand.

### 1. Set the custom domain

In the Admin Panel, set `Organization.customDomain` (for example
`panel.mybrand.com`).

### 2. Point DNS at the platform edge

```text
CNAME panel.mybrand.com -> panel.aetheris-web.vercel.app
```

### 3. Route by Host header (Nginx example)

```nginx
server {
    listen 443 ssl;
    server_name panel.mybrand.com;

    ssl_certificate     /etc/letsencrypt/live/panel.mybrand.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/panel.mybrand.com/privkey.pem;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

The whitelabel endpoint resolves the tenant by domain when the
`organization` parameter is absent, so every page under the custom domain is
branded for that tenant automatically.

## Email templates

Templates live in `WhitelabelConfig.emailTemplates`, keyed by event. The
worker renders them with the variables of the triggering job:

| Key | Trigger | Variables |
| --- | --- | --- |
| `invoice.created` | Invoice generated | `invoice_number`, `amount`, `due_date`, `brand_name` |
| `invoice.paid` | Payment succeeded | `invoice_number`, `amount`, `transaction_id` |
| `invoice.dunning` | Payment retry started | `invoice_number`, `attempt`, `next_attempt` |
| `server.suspended` | Dunning exhausted | `server_name`, `brand_name`, `support_url` |
| `server.provisioned` | Server ready | `server_name`, `ipv4`, `console_url` |
| `account.welcome` | Account created | `account_email`, `brand_name`, `portal_url` |

Variables use `{{double_braces}}` and are HTML-escaped by the renderer.
Always include `brand_name` so recipients see your brand even if a template
is customized later.

## Cache and consistency

- The Redis key TTL is 300 seconds. Writes invalidate it immediately, so
  updates are visible on the next read.
- The marketing site keeps its own static fallback in
  `lib/config/whitelabel.json`; if the API is unreachable the site still
  renders with the default branding (see `Security` for the resilience
  behavior).
- When Redis is down, reads fall back to PostgreSQL automatically; the
  `cache` field in the response tells you which path served the data.

## Permissions

Only `admin` users can read and write the whitelabel configuration. Reads
through the public endpoint are scoped to the requested organization and
never expose secrets (email template bodies are returned, but never SMTP
passwords or API keys).

## Best practices

- Keep logos as SVGs under 64KB and serve them from a CDN with caching.
- Test accent changes in a staging environment before publishing: the accent
  token affects every button, link and highlight in the UI.
- Use `theme.borderRadius` and `theme.fontFamily` sparingly - changing them
  can visibly alter the layout; keep the values within the design system
  tokens.
- Write email templates with the plain-text and the HTML variant; the worker
  falls back to plain text when HTML is missing.
