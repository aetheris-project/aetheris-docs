<p align="center">
  <img src="assets/icon.svg" alt="Aetheris Docs" width="88" style="filter: drop-shadow(0 0 20px rgba(14,165,233,0.5))">
</p>

<h1 align="center">Aetheris Docs</h1>

<p align="center">
  <strong>Wiki · Installation guides · Developer SDK · OpenAPI specifications</strong>
</p>

<p align="center">
  <a href="https://aetheris-docs.vercel.app"><img src="https://img.shields.io/badge/Live%20Wiki-aetheris--docs.vercel.app-059669?style=for-the-badge&logo=vercel&logoColor=white" alt="Live Wiki"></a>
  <a href="https://aetheris-docs.vercel.app/wiki/installation"><img src="https://img.shields.io/badge/Installation-Guide-0EA5E9?style=for-the-badge&logo=bookstack" alt="Installation"></a>
  <a href="https://aetheris-docs.vercel.app/api/reference"><img src="https://img.shields.io/badge/REST%20API-Reference-85EA2D?style=for-the-badge&logo=openapiinitiative&logoColor=white" alt="API Reference"></a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Nextra-2-000000?style=flat-square&logo=next.js&logoColor=white" alt="Nextra">
  <img src="https://img.shields.io/badge/Next.js-14-000000?style=flat-square&logo=next.js&logoColor=white" alt="Next.js">
  <img src="https://img.shields.io/badge/MDX-Pages-111111?style=flat-square" alt="MDX">
  <img src="https://img.shields.io/badge/OpenAPI-3.1-85EA2D?style=flat-square&logo=openapiinitiative&logoColor=white" alt="OpenAPI">
  <img src="https://img.shields.io/badge/Deploys%20on-Vercel-000000?style=flat-square&logo=vercel&logoColor=white" alt="Vercel">
  <img src="https://img.shields.io/badge/Multi--Language-12%20langs-10B981?style=flat-square" alt="Languages">
</p>

---

<br>

> **Official documentation** for the Aetheris billing & virtualization
> platform. Per-OS installation walkthroughs, the automated installer
> reference, hypervisor bridge setup guides, the custom hypervisor SDK, the
> full REST API reference and a complete OpenAPI 3.1 spec.
>
> Powered by **Nextra 2** with built-in search, code highlighting, copy
> buttons and a live 12-language translator.

<br>

## 📚 What's Inside

| Section | What you'll find |
|---|---|
| 🚀 **Installation** | Per-OS guides for **Linux** (systemd/Nginx/Certbot), **Windows** (native + WSL2) and **macOS** (launchd) — both automated installer + fully manual walkthrough |
| 🪄 **Installer ref** | `aetheris-installer` wizard flags · `--yes` headless mode · presets · env overrides · Windows installer TUI options |
| 🦕 **Pterodactyl bridge** | App and Client API key scopes · node sync · full lifecycle endpoint mapping |
| 🖥️ **Proxmox VE setup** | API user creation · storage pools · VM templates · container provisioning |
| ⚡ **VirtFusion setup** | Bearer token · REST mapping · console limitations |
| 💠 **Whitelabel** | Runtime branding without rebuilds · custom domain routing · email template variables |
| 🎨 **Theming** | Design tokens · accent variables · dark/light/system · custom theme authoring guide |
| 🧩 **SDK** | `HypervisorDriver` contract · implementing a new backend · validation registry |
| ⚙️ **Backend API** | Python FastAPI reference · auth · provisioning · billing callbacks |
| 🌐 **REST API** | Full endpoint reference · webhook fan-out · complete machine-readable [OpenAPI 3.1 spec](public/openapi.yaml) |

<br>

## 🏗️ Tech Stack

- **Nextra 2** — Next.js 14 documentation framework
- **MDX pages** — built-in search, Shiki syntax highlighting, one-click copy
- **OpenAPI 3.1** specification served from `public/openapi.yaml`
- **Live multi-language translator** powered by Google Translate — 12 languages
- **Charcoal/emerald dark enterprise UI** consistent with the main platform
- Deployed on **Vercel** (pushes to `main` → production auto-deploy)

<br>

## 🚀 Local Development

```bash
npm install
npm run dev
```

Wiki is live at **http://localhost:3000** with instant HMR on every page.

```bash
npm run build   # Production build
npm run start   # Serve production build locally
```

<br>

## 📦 Repository Layout

```text
aetheris-docs/
├── pages/
│   ├── index.md                          # Wiki landing page
│   ├── _meta.json / _app.tsx
│   ├── wiki/
│   │   ├── installation.md               # 🚀 Per-OS install guide
│   │   ├── installer.md                  # 🪄 Automated installer reference
│   │   ├── windows-installer.md          # 🪟 Windows TUI installer
│   │   ├── backend.md                    # ⚙️ Python backend (FastAPI)
│   │   ├── theming.md / tokens.md        # 🎨 Theme system
│   │   ├── whitelabel.md                 # 💠 Runtime branding
│   │   ├── pterodactyl-bridge.md         # 🦕 Daemon bridge
│   │   ├── proxmox-setup.md              # 🖥️ Proxmox VE API v2
│   │   ├── virtfusion-setup.md           # ⚡ VirtFusion REST
│   │   ├── architecture.md               # 🏗️ System diagrams
│   │   ├── billing.md / plans.md         # 💰 Billing engine
│   │   ├── node-management.md            # 🧭 Allocations, pools, drain
│   │   ├── security.md / hardening.md    # 🔐 CSP, HSTS, encryption
│   │   ├── docker.md                     # 🐳 Docker compose variants
│   │   ├── troubleshooting.md            # 🩺 Networking + services
│   │   └── ... (40+ pages total)
│   ├── sdk/custom-adapter.md             # 🧩 Write a new driver backend
│   └── api/reference.md                  # 🌐 REST API + webhooks
├── public/
│   ├── openapi.yaml                      # 📜 OpenAPI 3.1 machine-readable spec
│   ├── robots.txt / sitemap.xml
│   ├── icon.svg / logo.svg
│   └── og-image.svg
├── components/
│   └── LanguageTranslator.tsx            # 🌐 12-lang live translator
├── styles/docs.css                       # 🎨 Aetheris charcoal UI layer
├── theme.config.tsx                      # ⚙️ Nextra theme, nav, banner, footer
├── package.json / tsconfig.json
└── CONTRIBUTING.md / LICENSE.md
```

---

<p align="center">
  <strong>Made with 💙 by <a href="https://github.com/Leo-Galli">Leonardo Galli</a> and the docs contributors</strong>
</p>

<p align="center">
  <a href="https://github.com/aetheris-project/aetheris-app">App</a>
  ·
  <a href="https://github.com/aetheris-project/aetheris-website">Website</a>
  ·
  <a href="https://github.com/aetheris-project/aetheris-installer">Installer</a>
  ·
  <a href="https://discord.gg/6GcfebuT2A">Discord</a>
  ·
  <a href="https://paypal.me/LeonardoGalliITA">Donate</a>
</p>

## 📄 License

Licensed under **GNU Affero General Public License v3.0 (AGPL-3.0)**.
See [LICENSE.md](LICENSE.md).
