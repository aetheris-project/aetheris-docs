# Client portal

The customer-facing dashboard where users manage their servers.

## Pages

| Page | URL | Description |
| --- | --- | --- |
| Server list | `/` | All servers with resource stats |
| Server console | `/console/{id}` | VNC console, power controls |
| Billing | `/billing` | Invoices, payment methods |
| Store | `/store` | Available plans |

## Features

- **Real-time console** — WebSocket-based VNC terminal.
- **Power controls** — Start, stop, restart from the dashboard.
- **Resource gauges** — CPU, RAM, disk usage in real time.
- **Invoice management** — View, pay, download invoices.
- **Sign out** — Clears the session token.

## Styling

Built with the same v3 design system as the rest of the platform. The client layout includes a sticky header with logo, status badge and sign-out button.

See also: [Admin panel](admin-panel.md), [User management](user-management.md).
