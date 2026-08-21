# Contributing to Aetheris

Thank you for your interest in contributing to Aetheris! This document explains how to contribute to any of the Aetheris repositories.

## How to Contribute

### 1. Fork and Clone

1. Fork the repository you want to contribute to
2. Clone your fork locally
3. Create a new branch for your changes

```bash
git clone https://github.com/YOUR_USERNAME/REPO_NAME.git
cd REPO_NAME
git checkout -b feature/your-feature-name
```

### 2. Make Your Changes

- Follow the existing code style and conventions
- Write clear commit messages
- Add tests if applicable
- Update documentation if needed

### 3. Submit a Pull Request

1. Push your branch to your fork
2. Open a Pull Request against the `main` branch of the upstream repository
3. Fill in the PR template with a clear description of your changes

## Automated Checks

All Pull Requests go through **automated CI checks** before they can be merged. These checks run automatically when you open or update a PR:

### Required Checks (must pass)

| Check | Description |
|---|---|
| **Lint** | Code formatting and style validation (ESLint, prettier) |
| **Type Check** | TypeScript type validation (no type errors) |
| **Build** | Production build verification (no build errors) |
| **Tests** | Unit and integration tests (all tests pass) |

### Optional Checks (informational)

| Check | Description |
|---|---|
| **Bundle Size** | Impact on JavaScript bundle size |
| **Lighthouse** | Performance, accessibility and SEO scores |

## Review Process

1. **Automated checks** run first - all must pass
2. **Automated review** checks for common issues (security, performance, accessibility)
3. **Manual review** by @Leo-Galli or a maintainer
4. **Merge** after approval and all checks pass

### What we look for in a review

- Code quality and readability
- Test coverage for new features
- Documentation updates
- No breaking changes (or clearly documented)
- Security considerations
- Performance impact

## Repository-Specific Guides

### aetheris-app (Main Platform)

- Follow Next.js and TypeScript conventions
- Add Prisma migrations for database changes
- Update the API documentation for new endpoints

### aetheris-website (Marketing Site)

- Follow the Aetheris Design System (CSS variables)
- Ensure responsive design on all breakpoints
- Test on both light and dark themes

### aetheris-docs (Documentation)

- Use Markdown for content pages
- Follow the existing page structure
- Add entries to `_meta.json` for new pages

### aetheris-addons (Integration Store)

- Follow the addon manifest format
- Include README.md with setup instructions
- Add the addon to `store.json`

### aetheris-game-eggs (Game Server Eggs)

- Follow the egg.json PTDL_v2 schema
- Include Dockerfile and README
- Run the validator before submitting

### aetheris-windows-installer (Windows Installer)

- Test on Windows 10 and 11
- Follow Python coding conventions
- Add tests for new features

## Code of Conduct

- Be respectful and constructive
- Focus on the code, not the person
- Help others learn and grow
- Welcome newcomers and first-time contributors

## Questions?

If you have questions about contributing, open a Discussion in the relevant repository or contact us at hello@another-horizon.eu.
