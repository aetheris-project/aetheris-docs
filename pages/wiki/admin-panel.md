# Admin panel

Quick overview of the admin control panel.

## Sections

| Section | URL | Description |
| --- | --- | --- |
| Overview | `/admin` | Stats, node gauges, recent activity |
| Status | `/admin/status` | Version, update check, system health |
| Nodes | `/admin/nodes` | Hypervisor credentials, telemetry, sync |
| Servers | `/admin/servers` | All provisioned servers, power actions |
| Billing | `/admin/billing` | Plans, invoices, coupons, payments |
| Cron | `/admin/cron` | Scheduled tasks, manual triggers |
| SFTP | `/admin/sftp` | File access users per server |
| Whitelabel | `/admin/whitelabel` | Branding, logo, accent color |
| Settings | `/admin/settings` | Platform config, API keys |

## Access

Only users with `superadmin` or `admin` role can access the admin panel. The client portal (`/`) is available to all authenticated users.

## Styling

The admin panel uses the same v3 design system as the website — glassmorphism, grain overlay, dual-orb gradients. Styles are in `app/globals.css`.

See also: [User management](user-management.md), [Architecture](architecture.md).
