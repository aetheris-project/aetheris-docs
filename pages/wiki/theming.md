# Theming and whitelabeling

Every surface of the Aetheris platform follows a token-driven theme
system. Two independent dimensions can be changed at runtime without a
rebuild:

1. **Site theme** - dark, light or system, applied as `[data-theme]` on
   the document root and persisted in `localStorage`.
2. **Accent color** - emerald, indigo or amber, applied as `[data-accent]`
   through CSS variables.

## Theme tokens

Design tokens live in `app/globals.css` as RGB triplets on `:root`:

```css
:root {
  --aetheris-bg: 9 9 11;        /* page background */
  --aetheris-surface: 20 20 24; /* cards and panels */
  --aetheris-raised: 26 26 31;  /* raised surfaces */
  --aetheris-border: 39 39 42;  /* borders */
  --aetheris-fg: 250 250 250;   /* text */
  --aetheris-muted: 161 161 170;
  --aetheris-faint: 113 113 122;
  --aetheris-accent: 16 185 129; /* default accent */
  --aetheris-accent-strong: 5 150 105;
  --aetheris-accent-soft: rgba(16, 185, 129, 0.12);
  color-scheme: dark;
}
```

The light theme overrides the same tokens under
`[data-theme="light"]`, so every component that uses the tokens
(`bg-surface`, `border-edge`, `text-muted`, `text-ink`, ...) adapts
automatically. The VNC console screen intentionally stays black in both
themes because it is a terminal.

## Accent colors

```css
[data-accent="indigo"] {
  --aetheris-accent: 99 102 241;
  --aetheris-accent-strong: 79 70 229;
  --aetheris-accent-soft: rgba(99, 102, 241, 0.12);
}

[data-accent="amber"] {
  --aetheris-accent: 245 158 11;
  --aetheris-accent-strong: 217 119 6;
  --aetheris-accent-soft: rgba(245, 158, 11, 0.12);
}
```

## Whitelabel configuration

The static source of truth lives in
`aetheris-website/lib/config/whitelabel.json`. When
`NEXT_PUBLIC_WHITELABEL_URL` is set, the client merges a remote
configuration over the static defaults at runtime (no rebuild).

The Python backend exposes the theme through the API:

```bash
# Read the current theme
curl -sS http://127.0.0.1:8000/api/theme

# Update it (admin token required)
curl -sS http://127.0.0.1:8000/api/theme \
  -X PUT \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{"accent":"indigo","radius":12}'
```

```json
{
  "accent": "indigo",
  "radius": 12,
  "font_family": "",
  "accents": ["emerald", "indigo", "amber"]
}
```

The theme is persisted in the `settings` table and survives restarts.

## Demo

The interactive demo (`/demo`) exposes both dimensions live: the accent
swatches in the frame header switch the platform accent, and the theme
toggle switches dark, light and system. Changes are persisted in
`localStorage` (`aetheris-theme`) and applied before first paint by an
inline script in the root layout, so there is no flash of the wrong theme.

## Adding a new accent

1. Add an `[data-accent="..."]` block in `app/globals.css` with the three
   token values (plus a light-mode variant if needed).
2. Add the accent to `AccentName` in
   `lib/config/whitelabel.ts` and to `accents` in the static JSON.
3. Add a swatch to `ACCENT_SWATCHES` in
   `components/website/InteractiveDemo.tsx`.
4. If the backend should serve it, extend `ThemeConfig` in
   `aetheris-app/backend/aetheris_backend/schemas.py`.
