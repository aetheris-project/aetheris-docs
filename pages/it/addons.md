# Moduli e integrazioni

Oltre i temi, la piattaforma Aetheris può essere estesa con **moduli** e **integrazioni**.

## Moduli vs Integrazioni

| Tipo | Descrizione | Esempio |
| --- | --- | --- |
| Modulo | Pacchetto di funzionalità (UI + logica) | Gateway pagamento, canale notifica |
| Integrazione | Connessione a un servizio esterno | Stripe, PayPal, SMTP |

## modulo bootstrap

Ogni modulo espone:

```python
# modulo/__init__.py
from aetheris_addons.base import Module

class MyModule(Module):
    name = "my-module"
    version = "1.0.0"

    def on_load(self):
        """Chiamato quando il modulo viene caricato."""
        pass

    def on_unload(self):
        """Chiamato quando il modulo viene rimosso."""
        pass
```

## Scoprire moduli

- [Store integrazioni](store.md) — moduli pronti all'uso
- [aetheris-addons](https://github.com/aetheris-project/aetheris-addons) — repository dei moduli

Vedi anche: [Store](store.md), [Whitelabeling](whitelabel.md).
