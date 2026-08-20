# Whitelabel — API and configuration

Endpoints, email templates, custom domains and configuration reference.

## Read active configuration

```http
GET /api/whitelabel?organization=<slug>
```

Response:

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

## Update configuration (admin)

```http
PUT /api/whitelabel
Authorization: Bearer <admin-jwt>
Content-Type: application/json
```

Writes PostgreSQL and invalidates Redis cache.

## Configuration reference

```json
{
  "brand": {
    "name": "Aetheris",
    "tagline": "Billing and virtualization control panel",
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
      "body": "Hello,\nyour invoice of {{amount}} is due on {{due_date}}."
    }
  },
  "modules": {
    "billing": true,
    "vncConsole": true,
    "pterodactyl": true
  }
}
```

## Email templates

| Key | Trigger | Variables |
| --- | --- | --- |
| `invoice.created` | Invoice generated | `invoice_number`, `amount`, `due_date`, `brand_name` |
| `invoice.paid` | Payment succeeded | `invoice_number`, `amount`, `transaction_id` |
| `invoice.dunning` | Payment retry | `invoice_number`, `attempt`, `next_attempt` |
| `server.suspended` | Dunning exhausted | `server_name`, `brand_name`, `support_url` |
| `server.provisioned` | Server ready | `server_name`, `ipv4`, `console_url` |
| `account.welcome` | Account created | `account_email`, `brand_name`, `portal_url` |

Variables use `{{double_braces}}` and are HTML-escaped.

## Custom domains

1. Set `Organization.customDomain` in the Admin Panel.
2. Point DNS: `CNAME panel.mybrand.com → panel.aetheris-web.vercel.app`.
3. Route by Host header in your reverse proxy.

The whitelabel endpoint resolves the tenant by domain automatically.

## Cache

- Redis TTL: 300 seconds.
- Writes invalidate immediately.
- When Redis is down, falls back to PostgreSQL.
- `cache` field in response indicates source.

See also: [Whitelabel overview](whitelabel.md), [Theming](theming.md).
