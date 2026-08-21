# Contributing to Aetheris

Aetheris is an open-source project and we welcome contributions from the community. This guide explains how to contribute to any of the Aetheris repositories.

## How Contributions Work

All improvements to Aetheris go through **Pull Requests**. This ensures:

1. **Automated quality checks** run before any human review
2. **Consistent code style** across all repositories
3. **No breaking changes** reach the main branch
4. **Documentation stays up to date**

## Step-by-Step Process

### 1. Fork the Repository

Choose the repository you want to contribute to and fork it:

| Repository | Purpose |
|---|---|
| [aetheris-app](https://github.com/aetheris-project/aetheris-app) | Main platform (Next.js + Prisma) |
| [aetheris-website](https://github.com/aetheris-project/aetheris-website) | Marketing site |
| [aetheris-docs](https://github.com/aetheris-project/aetheris-docs) | Documentation wiki |
| [aetheris-addons](https://github.com/aetheris-project/aetheris-addons) | Integration store |
| [aetheris-game-eggs](https://github.com/aetheris-project/aetheris-game-eggs) | Game server eggs |
| [aetheris-windows-installer](https://github.com/aetheris-project/aetheris-windows-installer) | Windows installer |
| [aetheris-installer](https://github.com/aetheris-project/aetheris-installer) | Linux/macOS installer |

### 2. Create a Branch

```bash
git checkout -b feature/your-feature-name
```

Use descriptive branch names:
- `feature/add-new-payment-gateway`
- `fix/login-redirect-bug`
- `docs/update-installation-guide`

### 3. Make Your Changes

- Follow the existing code style
- Write clear commit messages
- Add tests for new features
- Update documentation if needed

### 4. Open a Pull Request

Push your changes and open a PR against the `main` branch. Fill in the PR template:

```markdown
## Description
Brief description of what this PR does.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Refactoring

## Testing
- [ ] Tests pass locally
- [ ] New tests added (if applicable)

## Checklist
- [ ] Code follows project conventions
- [ ] Documentation updated
- [ ] No breaking changes
```

## Automated CI Checks

Every Pull Request triggers **automated checks**. All required checks must pass before a maintainer will review your PR.

### Required Checks

| Check | What it validates |
|---|---|
| **Lint** | Code formatting, unused imports, style rules |
| **Type Check** | TypeScript types, no `any` types, strict mode |
| **Build** | Production build completes without errors |
| **Tests** | All unit and integration tests pass |

### How Checks Work

1. You push commits to your PR branch
2. GitHub Actions runs the CI pipeline automatically
3. Check results appear on the PR page
4. All checks must be green (passing) before merge

### If Checks Fail

1. Click on the failing check to see the error details
2. Fix the issue locally
3. Push a new commit to your PR branch
4. Checks will re-run automatically

## Review Process

After all automated checks pass:

1. **Automated review** - Bot checks for common issues
2. **Manual review** - @Leo-Galli reviews the code
3. **Feedback** - You may be asked to make changes
4. **Approval** - Once approved, your PR is merged

### What Reviewers Look For

- **Code quality**: Readable, maintainable, following conventions
- **Test coverage**: New features should have tests
- **Documentation**: Updates to relevant docs
- **Security**: No vulnerabilities introduced
- **Performance**: No unnecessary performance impact
- **Breaking changes**: Clearly documented and justified

## Repository-Specific Guidelines

### aetheris-app (Main Platform)

```bash
# Setup
npm install
npx prisma generate
npm run dev

# Before submitting
npm run lint
npm run typecheck
npm run build
npm test
```

### aetheris-website (Marketing Site)

```bash
# Setup
npm install
npm run dev

# Before submitting
npm run build  # Must complete without errors
```

### aetheris-docs (Documentation)

- Use Markdown for content
- Add new pages to `_meta.json`
- Test build: `npm run build`

### aetheris-addons (Integration Store)

- Follow the addon manifest format in `manifest.json`
- Include `README.md` with setup instructions
- Add your addon to `store.json`

### aetheris-game-eggs (Game Server Eggs)

- Follow the egg.json PTDL_v2 schema
- Include `Dockerfile` and `README.md`
- Run validation: `python tools/validate_eggs.py`

### aetheris-windows-installer (Windows Installer)

- Test on Windows 10 and 11
- Follow Python coding conventions
- Run tests: `python -m pytest`

## Getting Help

- Open a Discussion in the relevant repository
- Contact: hello@another-horizon.eu
- Join the community on Discord (link in the repository)

## License

By contributing to Aetheris, you agree that your contributions will be licensed under the AGPL-3.0 license.
