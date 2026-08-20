# Temi

Sistema di temi guidato da token con due dimensioni indipendenti: tema sito (dark/light/system) e colore accent (emerald/indigo/amber).

## Token CSS

Variabili CSS su `:root` che controllano l'intera UI:

```css
:root {
  --aetheris-bg: 9 9 11;
  --aetheris-surface: 20 20 24;
  --aetheris-accent: 16 185 129;
  --aetheris-accent-strong: 5 150 105;
}
```

## Colori accent

| Accent | RGB | Caso d'uso |
| --- | --- | --- |
| Emerald | `16 185 129` | Default — pulito, professionale |
| Indigo | `99 102 241` | Feel tech / SaaS |
| Amber | `245 158 11` | Caldo / energico |

Cambia con `[data-accent="emerald"]` su `<html>`.

## Modalità dark / light

Applica `[data-theme="dark"]` o `[data-theme="light"]` su `<html>`.

Vedi anche: [Token reference](theming-tokens.md), [Whitelabeling](whitelabel.md).
