# Theming — Token reference

Full CSS token reference and custom theme creation.

## Dark mode tokens

```css
:root {
  --aetheris-bg: 9 9 11;
  --aetheris-surface: 20 20 24;
  --aetheris-raised: 26 26 31;
  --aetheris-border: 39 39 42;
  --aetheris-fg: 250 250 250;
  --aetheris-muted: 161 161 170;
  --aetheris-faint: 113 113 122;
  --aetheris-accent: 16 185 129;
  --aetheris-accent-strong: 5 150 105;
  --aetheris-accent-soft: rgba(16, 185, 129, 0.12);
}
```

## Light mode overrides

```css
[data-theme="light"] {
  --aetheris-bg: 250 250 250;
  --aetheris-surface: 255 255 255;
  --aetheris-fg: 9 9 11;
  --aetheris-border: 228 228 231;
}
```

## Accent injection

Each accent defines three values:

| Token | Description |
| --- | --- |
| `--aetheris-accent` | Main accent (buttons, links, highlights) |
| `--aetheris-accent-strong` | Darker variant (gradients, hover) |
| `--aetheris-accent-soft` | Transparent background (badges, pills) |

## Custom themes

Create a CSS file in `aetheris-themes/themes/`:

```css
[data-accent="mycolor"] {
  --aetheris-accent: 139 92 246;
  --aetheris-accent-strong: 124 58 237;
  --aetheris-accent-soft: rgba(139, 92, 246, 0.12);
}
```

Apply with `data-accent="mycolor"` on `<html>`.

## Component classes

| Class | Description |
| --- | ---|
| `.aetheris-card` | Glass card with border and shadow |
| `.aetheris-card-hover` | Card with hover lift effect |
| `.aetheris-btn-primary` | Gradient accent button |
| `.aetheris-btn-secondary` | Glass outline button |
| `.aetheris-btn-ghost` | Transparent hover button |
| `.aetheris-kicker` | Small uppercase label |
| `.aetheris-icon` | Icon container with glow |
| `.aetheris-input` | Styled form input |
| `.aetheris-nav-link` | Sidebar navigation link |
| `.aetheris-nav-link-active` | Active nav link |

See also: [Theming overview](theming.md), [Whitelabeling](whitelabel.md).
