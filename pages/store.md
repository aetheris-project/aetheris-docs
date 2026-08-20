# Integration store

The integration store lists ready-to-use modules for the Aetheris platform,
available free of charge. **Every store entry is an accepted pull request** in
the [aetheris-addons](https://github.com/aetheris-project/aetheris-addons)
repository: nothing is published without going through review.

## How contributions become store entries

1. A contributor implements a module in a fork or branch of `aetheris-addons`
   (see [Modules and integrations](addons.md)).
2. They open a pull request. Automated checks validate the manifest, typecheck
   the module and run the test suite.
3. A maintainer reviews and merges the pull request.
4. The module's `manifest.json` is picked up by the store registry
   (`store.json` at the repository root) and appears on the website store.

## Contributing guidelines

- Follow the manifest schema exactly - invalid manifests fail CI.
- Include a `README.md` documenting setup and environment variables.
- Add tests under `tests/` for any non-trivial logic.
- Use the module contracts in `types/`; do not import platform internals.
- Keep the module dependency-free; platform SDK imports are not allowed.

## Requesting a module

Open an issue in `aetheris-addons` with the `module-request` label describing
the gateway or utility you need. The community and maintainers can pick it up.

## Published modules

See the [website store](https://aetheris-web.vercel.app/store) for the live list,
or read `store.json` directly in the addons repository. Categories currently
available:

- Payment gateways (crypto, wallets, alternative processors)
- Notification channels (Slack, Telegram, Discord)
- Utilities (logging, monitoring, webhooks)

## See also

- [Modules and integrations](addons.md) - how to build a module.
- [Contributing guide](https://github.com/aetheris-project/aetheris-addons/blob/main/CONTRIBUTING.md) -
  the full contribution workflow.
