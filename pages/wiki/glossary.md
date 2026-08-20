# Glossary

A quick reference for the terms used across the Aetheris platform and this
documentation.

| Term | Definition |
| --- | --- |
| Account | An identity that signs in to the portal; may own servers and invoices. |
| Admin panel | The operator-facing area of the control plane: nodes, plans, billing, whitelabel. |
| Allocation | A slice of a node's resources (IP, port range, CPU, RAM, disk) assignable to servers. |
| API key | A long-lived machine credential for calling the REST API. |
| Audit log | Append-only record of every privileged action: who, what, when, from which IP. |
| Billing engine | The subsystem that turns plans into invoices, proration and dunning. |
| Client portal | The end-user area: servers, console, backups, invoices, payments. |
| Control plane | The whole management layer (web + API + workers) that runs the platform. |
| Driver | A typed integration with an external system (Pterodactyl, Proxmox VE, VirtFusion). |
| Dunning | The automated process of retrying failed payments and escalating reminders. |
| Egg | A Pterodactyl container specification that defines how a server image runs. |
| Idempotency key | A stable identifier that makes retries safe: the same key never applies twice. |
| Invoice | A billable document with lines, taxes and a due date. |
| Nest | A Pterodactyl collection of eggs sharing a base image. |
| Node | A hypervisor or panel host that runs the servers you provision. |
| Plan | A product definition: resources, price, billing period, limits. |
| Proration | Charging only for the fraction of the billing period actually used. |
| Provisioning | The lifecycle of creating, suspending, unsuspending and terminating servers. |
| Queue | A Redis-backed BullMQ queue of background jobs (provisioning, billing, webhooks). |
| Tenant / Organization | The top-level scope that owns users, nodes, plans and invoices. |
| Theme | A named set of design tokens (colors, typography, surfaces) for the UI. |
| Webhook | An outbound HTTP notification of an event, signed with HMAC-SHA256. |
| Whitelabel | The runtime-reconfigurable branding of the platform (name, logo, colors, domain). |
| Worker | A process that consumes BullMQ queues and executes background jobs. |
