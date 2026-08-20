# Theming

Token-driven theme system with two independent dimensions: site theme (dark/light/system) and accent color (emerald/indigo/amber).

## Theme tokens

CSS variables on `:root` control the entire UI:

```css
:root {
  --aetheris-bg: 9 9 11;
  --aetheris-surface: 20 20 24;
  --aetheris-accent: 16 185 129;
  --aetheris-accent-strong: 5 150 105;
}
```

## Accent colors

| Accent | RGB | Use case |
| --- | --- | --- |
| Emerald | `16 185 129` | Default — clean, professional |
| Indigo | `99 102 241` | Tech / SaaS feel |
| Amber | `245 158 11` | Warm / energetic |

Switch via `[data-accent="emerald"]` on `<html>`.

## Dark / light modes

Apply `[data-theme="dark"]` or `[data-theme="light"]` on `<html>`. Light mode adjusts surface colors and gradients.

## Quick links

- [Theming tokens](theming-tokens.md) — full token reference, custom themes
- [Whitelabeling](whitelabel.md) — runtime branding without rebuilds

See also: [Whitelabel API](whitelabel-api.md), [Architecture](architecture.md).
