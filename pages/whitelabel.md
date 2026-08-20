# Dynamic whitelabeling

Every branding surface is configurable at runtime from the Admin Panel. No rebuild required — change a logo, accent color or platform name and the next page load reflects it.

## What you can change

| Surface | Example |
| --- | --- |
| Platform name and tagline | Header, footer, emails, meta tags |
| Logo URLs | Header, footer, invoices |
| Accent theme | Emerald / Indigo / Amber via CSS variables |
| Border radius and font | Design tokens |
| Navigation links | Site header and sitemap |
| Email templates | Worker email rendering |
| Custom domains | Edge routing per tenant |
| Module toggles | Feature flags in the UI |

## How it works

1. Admin Panel writes a `WhitelabelConfig` row in PostgreSQL.
2. `GET /api/whitelabel?organization=<slug>` reads Redis (300s TTL), falls back to PostgreSQL.
3. The website fetches this and deep-merges over the static default.
4. `WhitelabelProvider` sets `data-accent` on `<html>`, activating CSS variables.

First paint uses the static JSON — zero layout shift.

## Quick links

- [Whitelabel API](whitelabel-api.md) — endpoints, email templates, custom domains
- [Theming](theming.md) — CSS tokens, accent colors, design system

See also: [Admin panel](admin-panel.md), [Backend](backend.md).
