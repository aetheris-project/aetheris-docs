import type { DocsThemeConfig } from "nextra-theme-docs";

const config: DocsThemeConfig = {
  logo: (
    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
      <span
        style={{
          display: "flex",
          height: "1.75rem",
          width: "1.75rem",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "0.5rem",
          backgroundColor: "#10B981",
          color: "#09090B",
          fontWeight: 800,
          fontSize: "0.75rem"
        }}
      >
        A
      </span>
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
