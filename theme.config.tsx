import type { DocsThemeConfig } from "nextra-theme-docs";
import { useConfig } from "nextra-theme-docs";
import { useRouter } from "next/router";
import { LanguageTranslator } from "./components/LanguageTranslator";

const DOCS_URL = "https://aetheris-docs.vercel.app";
const GITHUB = "https://github.com/aetheris-project";
const DOCS_REPO = `${GITHUB}/aetheris-docs`;

function Logo() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
      <svg
        width="28"
        height="28"
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
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
          style={{ filter: "drop-shadow(0 0 6px rgba(16,185,129,0.55))" }}
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
      </svg>
      <span style={{ fontWeight: 700, letterSpacing: "-0.02em" }}>Aetheris Docs</span>
    </div>
  );
}

const config: DocsThemeConfig = {
  logo: <Logo />,
  useNextSeoProps() {
    const { asPath } = useRouter();
    const title = asPath === "/" ? "Aetheris Docs" : undefined;
    return { titleTemplate: "%s - Aetheris Docs", defaultTitle: title };
  },
  head() {
    const { route } = useRouter();
    const config = useConfig();
    const title = `${config.title}${config.title ? " - " : ""}Aetheris Docs`;
    const description =
      "Documentation for the Aetheris billing and virtualization control panel: installation, architecture, hypervisor bridges (Pterodactyl, Proxmox VE, VirtFusion), the automated installers, the Python backend API and the REST API reference.";

    return (
      <>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{config.title ? `${config.title} - Aetheris Docs` : "Aetheris Docs"}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={`${DOCS_URL}${route === "/" ? "" : route}`} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Aetheris Docs" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={`${DOCS_URL}${route === "/" ? "" : route}`} />
        <meta property="og:image" content={`${DOCS_URL}/logo.svg`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={`${DOCS_URL}/logo.svg`} />
        <link rel="icon" type="image/svg+xml" href="/icon.svg" />
        <meta name="theme-color" content="#09090B" />
        <meta name="color-scheme" content="dark" />
      </>
    );
  },
  navbar: {
    extraContent: () => <LanguageTranslator />
  },
  darkMode: true,
  nextThemes: {
    defaultTheme: "dark"
  },
  primaryHue: { dark: 160, light: 160 },
  primarySaturation: { dark: 84, light: 84 },
  project: {
    link: `${GITHUB}/aetheris-app`,
    icon: (
      <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
        <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
      </svg>
    )
  },
  docsRepositoryBase: DOCS_REPO,
  editLink: {
    text: "Edit this page on GitHub",
    component: ({ filePath, ...props }) => {
      // Map the file path to the correct GitHub URL
      const url = `${DOCS_REPO}/edit/main/pages/${filePath}`;
      return <a href={url} target="_blank" rel="noopener noreferrer" {...props} />;
    }
  },
  sidebar: {
    defaultMenuCollapseLevel: 1,
    toggleButton: true
  },
  banner: {
    key: "contribution-banner",
    text: (
      <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        Want to contribute? All improvements go through Pull Requests with automated checks before review by
        <a
          href="https://github.com/Leo-Galli"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#10b981", fontWeight: 600 }}
        >
          @Leo-Galli
        </a>
        <a
          href={`${GITHUB}/aetheris-app/blob/main/CONTRIBUTING.md`}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#10b981", textDecoration: "underline" }}
        >
          Read the guide
        </a>
      </span>
    )
  },
  search: {
    placeholder: "Search the docs..."
  },
  toc: {
    title: "On this page"
  },
  footer: {
    text: (
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", width: "100%" }}>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "1.5rem", fontSize: "0.8em" }}>
          <a href="https://discord.gg/6GcfebuT2A" target="_blank" rel="noopener noreferrer" style={{ color: "#10b981" }}>Discord community</a>
          <a href={`${GITHUB}/aetheris-app`} style={{ color: "inherit" }}>aetheris-app</a>
          <a href={`${GITHUB}/aetheris-website`} style={{ color: "inherit" }}>aetheris-website</a>
          <a href={`${GITHUB}/aetheris-windows-installer`} style={{ color: "inherit" }}>aetheris-windows-installer</a>
          <a href={`${GITHUB}/aetheris-game-eggs`} style={{ color: "inherit" }}>aetheris-game-eggs</a>
          <a href={`${GITHUB}/aetheris-addons`} style={{ color: "inherit" }}>aetheris-addons</a>
          <a href={`${GITHUB}/aetheris-docs`} style={{ color: "inherit" }}>aetheris-docs</a>
        </div>
        <div style={{ fontSize: "0.75em", opacity: 0.6, textAlign: "center" }}>
          <p>Copyright (C) 2026 Leonardo Galli (Leo-Galli), Aetheris Project - AGPL-3.0</p>
          <p style={{ marginTop: "0.25rem" }}>
            All contributions require a Pull Request with automated CI checks (lint, typecheck, build) before manual review.
            Contact:{" "}
            <a href="mailto:hello@another-horizon.eu" style={{ color: "inherit" }}>hello@another-horizon.eu</a>
          </p>
        </div>
      </div>
    )
  }
};

export default config;
