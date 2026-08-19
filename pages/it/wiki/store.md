# Store delle integrazioni

Lo store delle integrazioni elenca moduli pronti all'uso per la piattaforma
Aetheris, disponibili gratuitamente. **Ogni voce dello store è una pull request
accettata** nella repository
[aetheris-addons](https://github.com/aetheris-project/aetheris-addons): nulla
viene pubblicato senza passare dalla review.

## Come le contribuzioni diventano voci dello store

1. Un contributore implementa un modulo in un fork o branch di
   `aetheris-addons` (vedi [Moduli e integrazioni](addons.md)).
2. Apre una pull request. I controlli automatici validano il manifest,
   eseguono il typecheck del modulo e la suite di test.
3. Un manutentore revisiona e fa il merge della pull request.
4. Il `manifest.json` del modulo viene raccolto dal registry dello store
   (`store.json` alla radice della repository) e appare nello store del sito.

## Linee guida di contribuzione

- Segui esattamente lo schema del manifest - i manifest non validi fanno
  fallire la CI.
- Includi un `README.md` che documenti setup e variabili d'ambiente.
- Aggiungi test sotto `tests/` per qualsiasi logica non banale.
- Usa i contratti dei moduli in `types/`; non importare interni della
  piattaforma.
- Mantieni il modulo senza dipendenze; gli import dell'SDK piattaforma non
  sono ammessi.

## Richiedere un modulo

Apri un'issue in `aetheris-addons` con il label `module-request` descrivendo
il gateway o la utility di cui hai bisogno. La community e i manutentori
possono occuparsene.

## Moduli pubblicati

Vedi lo [store del sito](https://aetheris.enterprise/store) per l'elenco live,
oppure leggi `store.json` direttamente nella repository degli addon. Categorie
attualmente disponibili:

- Gateway di pagamento (crypto, wallet, processori alternativi)
- Canali di notifica (Slack, Telegram, Discord)
- Utility (logging, monitoring, webhook)

## Vedi anche

- [Moduli e integrazioni](addons.md) - come costruire un modulo.
- [Guida alla contribuzione](https://github.com/aetheris-project/aetheris-addons/blob/main/CONTRIBUTING.md) -
  il flusso di contribuzione completo.
