# Modules and integrations

Beyond themes, the Aetheris platform can be extended with **modules** and
**integrations**. A module is a packaged unit of functionality (a payment
gateway, a notification channel, a storage driver, a UI panel); an integration
is the concrete wiring of a module to an external service.

## Module manifest

Every module ships a `manifest.json` that describes it:

```json
{
  "id": "gateway-coinbase",
  "name": "Coinbase Commerce",
  "category": "payment-gateway",
  "version": "1.0.0",
  "author": {
    "name": "Leonardo Galli",
    "github": "Leo-Galli"
  },
  "license": "AGPL-3.0",
  "entry": "src/index.ts",
  "requires": ["billing"],
  "description": "Accept crypto payments through Coinbase Commerce.",
  "documentation": "README.md"
}
```

Manifest fields:

| Field | Required | Description |
| --- | --- | --- |
| `id` | yes | Unique kebab-case identifier |
| `name` | yes | Human-readable module name |
| `category` | yes | `payment-gateway`, `notification`, `storage`, `utility`, `panel` |
| `version` | yes | Semantic version |
| `author` | yes | `name` and `github` handle of the maintainer |
| `license` | yes | License identifier (e.g. `AGPL-3.0`) |
| `entry` | yes | Main entry point relative to the module root |
| `requires` | no | Platform features the module depends on (`billing`, `vncConsole`, ...) |
| `description` | yes | One-line description shown in the store |
| `documentation` | no | Relative path to the module README |

## Creating a module

1. Clone the addons repository and create a folder under `addons/` named after
   the module id:

   ```bash
   git clone https://github.com/aetheris-project/aetheris-addons.git
   cd aetheris-addons
   mkdir -p addons/gateway-coinbase/src
   ```

2. Write `manifest.json` following the schema above.
3. Implement the module entry point. Payment gateways implement the
   `PaymentGateway` contract, notification channels the `NotificationChannel`
   contract, storage drivers the `StorageDriver` contract - the type
   definitions live in `types/` at the repository root.
4. Write a `README.md` documenting setup, environment variables and usage.
5. Validate the manifest:

   ```bash
   python tools/validate.py addons/gateway-coinbase
   ```

6. Open a pull request. See the store page for the contribution flow.

## Module contracts

### Payment gateway

```ts
interface PaymentGateway {
  readonly id: string;
  createCheckout(amountCents: number, currency: string, metadata: Record<string, string>): Promise<CheckoutSession>;
  capturePayment(sessionId: string): Promise<PaymentResult>;
  refund(paymentId: string, amountCents?: number): Promise<RefundResult>;
  verifyWebhook(payload: string, signature: string): Promise<WebhookEvent>;
}
```

### Notification channel

```ts
interface NotificationChannel {
  readonly id: string;
  send(message: NotificationMessage): Promise<void>;
  test(): Promise<void>;
}
```

## Local development

Modules are plain TypeScript with no runtime dependency on the platform SDK.
Run `npm run typecheck` from the repository root to typecheck every module,
and `python -m pytest` to run the manifest validation suite.

## See also

- [Integration store](store.md) - where accepted modules are published.
- [Custom hypervisor adapter](../sdk/custom-adapter.md) - extending the
  hypervisor layer.
- [Theming and whitelabeling](theming.md) - extending the theme layer.
