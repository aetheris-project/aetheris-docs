# Moduli e integrazioni

Oltre ai temi, la piattaforma Aetheris può essere estesa con **moduli** e
**integrazioni**. Un modulo è un'unità impacchettata di funzionalità (un
gateway di pagamento, un canale di notifica, un driver di storage, un pannello
UI); un'integrazione è il cablaggio concreto di un modulo verso un servizio
esterno.

## Manifest del modulo

Ogni modulo include un `manifest.json` che lo descrive:

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
  "license": "MIT",
  "entry": "src/index.ts",
  "requires": ["billing"],
  "description": "Accetta pagamenti crypto tramite Coinbase Commerce.",
  "documentation": "README.md"
}
```

Campi del manifest:

| Campo | Obbligatorio | Descrizione |
| --- | --- | --- |
| `id` | sì | Identificatore univoco in kebab-case |
| `name` | sì | Nome leggibile del modulo |
| `category` | sì | `payment-gateway`, `notification`, `storage`, `utility`, `panel` |
| `version` | sì | Versione semantica |
| `author` | sì | `name` e handle `github` del manutentore |
| `license` | sì | Identificatore licenza SPDX |
| `entry` | sì | Punto di ingresso principale relativo alla radice del modulo |
| `requires` | no | Funzionalità piattaforma richieste (`billing`, `vncConsole`, ...) |
| `description` | sì | Descrizione in una riga mostrata nello store |
| `documentation` | no | Percorso relativo del README del modulo |

## Creare un modulo

1. Clona la repository degli addon e crea una cartella sotto `addons/` con il
   nome dell'id del modulo:

   ```bash
   git clone https://github.com/aetheris-project/aetheris-addons.git
   cd aetheris-addons
   mkdir -p addons/gateway-coinbase/src
   ```

2. Scrivi `manifest.json` seguendo lo schema sopra.
3. Implementa il punto di ingresso del modulo. I gateway di pagamento
   implementano il contratto `PaymentGateway`, i canali di notifica il
   contratto `NotificationChannel`, i driver di storage il contratto
   `StorageDriver` - le definizioni dei tipi vivono in `types/` alla radice
   della repository.
4. Scrivi un `README.md` che documenti setup, variabili d'ambiente e utilizzo.
5. Valida il manifest:

   ```bash
   python tools/validate.py addons/gateway-coinbase
   ```

6. Apri una pull request. Vedi la pagina dello store per il flusso di
   contribuzione.

## Contratti dei moduli

### Gateway di pagamento

```ts
interface PaymentGateway {
  readonly id: string;
  createCheckout(amountCents: number, currency: string, metadata: Record<string, string>): Promise<CheckoutSession>;
  capturePayment(sessionId: string): Promise<PaymentResult>;
  refund(paymentId: string, amountCents?: number): Promise<RefundResult>;
  verifyWebhook(payload: string, signature: string): Promise<WebhookEvent>;
}
```

### Canale di notifica

```ts
interface NotificationChannel {
  readonly id: string;
  send(message: NotificationMessage): Promise<void>;
  test(): Promise<void>;
}
```

## Sviluppo locale

I moduli sono TypeScript puro senza dipendenze runtime dall'SDK della
piattaforma. Esegui `npm run typecheck` dalla radice della repository per il
typecheck di ogni modulo e `python -m pytest` per la suite di validazione dei
manifest.

## Vedi anche

- [Store delle integrazioni](store.md) - dove vengono pubblicati i moduli
  accettati.
- [Adapter hypervisor personalizzato](../sdk/custom-adapter.md) - estensione
  del livello hypervisor.
- [Temi e whitelabel](theming.md) - estensione del livello temi.
