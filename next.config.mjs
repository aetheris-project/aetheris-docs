import nextra from "nextra";

const withNextra = nextra({
  theme: "nextra-theme-docs",
  themeConfig: "./theme.config.tsx",
  defaultShowCopyCode: true,
  latex: false,
  flexsearch: {
    codeblocks: false
  }
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  async redirects() {
    return [
      {
        source: "/",
        destination: "/en",
        permanent: false
      }
    ];
  }
};

// NOTE: do not add the Next.js `i18n` key here - Nextra implements its own
// locale routing (see the `i18n` option in theme.config.tsx) and the two
// conflict, causing every page to 404 at runtime.

export default withNextra(nextConfig);
