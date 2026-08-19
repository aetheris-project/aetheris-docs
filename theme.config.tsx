import type { DocsThemeConfig } from "nextra-theme-docs";

const config: DocsThemeConfig = {
  logo: (
    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
      <svg
        width="28"
        height="28"
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="docLogoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: "#34D399" }} />
            <stop offset="50%" style={{ stopColor: "#10B981" }} />
            <stop offset="100%" style={{ stopColor: "#059669" }} />
          </linearGradient>
        </defs>
        <path
          d="M32 2 L58 17 L58 47 L32 62 L6 47 L6 17 Z"
          fill="none"
          stroke="url(#docLogoGrad)"
          strokeWidth="3"
        />
        <path
          d="M32 8 L52 20 L52 44 L32 56 L12 44 L12 20 Z"
          fill="url(#docLogoGrad)"
          opacity="0.15"
        />
        <path
          d="M32 16 L48 48 L43 48 L40 42 L24 42 L21 48 L16 48 Z M27 38 L37 38 L32 24 Z"
          fill="url(#docLogoGrad)"
        />
        <circle cx="32" cy="8" r="3" fill="#10B981" />
        <circle cx="10" cy="22" r="2.5" fill="#10B981" opacity="0.7" />
        <circle cx="54" cy="22" r="2.5" fill="#10B981" opacity="0.7" />
        <circle cx="10" cy="42" r="2.5" fill="#10B981" opacity="0.7" />
        <circle cx="54" cy="42" r="2.5" fill="#10B981" opacity="0.7" />
        <circle cx="32" cy="56" r="3" fill="#10B981" />
      </svg>
      <span style={{ fontWeight: 600 }}>Aetheris Docs</span>
    </div>
  ),
  project: {
    link: "https://github.com/aetheris-enterprise"
  },
  docsRepositoryBase: "https://github.com/aetheris-enterprise/aetheris-docs",
  footer: {
    text: "Aetheris documentation. Billing and virtualization control plane for the enterprise."
  },
  head: (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta property="og:title" content="Aetheris Documentation" />
      <meta
        property="og:description"
        content="Installation guides, Pterodactyl and Proxmox bridge configuration, custom adapter SDK and REST API reference."
      />
      <link rel="icon" type="image/png" href="/icon.png" />
      <link rel="shortcut icon" type="image/x-icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" href="/app-icon.png" />
      <meta name="theme-color" content="#09090B" />
    </>
  ),
  sidebar: {
    defaultMenuCollapseLevel: 1
  },
  search: {
    placeholder: "Search the wiki..."
  }
};

export default config;
