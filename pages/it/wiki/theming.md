# Temi e whitelabel

Ogni superficie della piattaforma Aetheris segue un sistema di temi guidato da
token. Due dimensioni indipendenti possono essere modificate a runtime senza
rebuild:

1. **Tema del sito** - scuro, chiaro o di sistema, applicato come
   `[data-theme]` sulla radice del documento e salvato in `localStorage`.
2. **Colore accento** - emerald, indigo o amber, applicato come
   `[data-accent]` tramite variabili CSS.

## Token del tema

I token di design vivono in `app/globals.css` come triplette RGB su `:root`:

```css
:root {
  --aetheris-bg: 9 9 11;        /* sfondo pagina */
  --aetheris-surface: 20 20 24; /* card e pannelli */
  --aetheris-raised: 26 26 31;  /* superfici rialzate */
  --aetheris-border: 39 39 42;  /* bordi */
  --aetheris-fg: 250 250 250;   /* testo */
  --aetheris-muted: 161 161 170;
  --aetheris-faint: 113 113 122;
  --aetheris-accent: 16 185 129; /* accento predefinito */
  --aetheris-accent-strong: 5 150 105;
  --aetheris-accent-soft: rgba(16, 185, 129, 0.12);
  color-scheme: dark;
}
```

Il tema chiaro sovrascrive gli stessi token sotto `[data-theme="light"]`,
quindi ogni componente che usa i token (`bg-surface`, `border-edge`,
`text-muted`, `text-ink`, ...) si adatta automaticamente. Lo schermo della
console VNC resta volutamente nero in entrambi i temi perché è un terminale.

## Colori accento

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

## Configurazione whitelabel

La fonte statica di verità vive in
`aetheris-website/lib/config/whitelabel.json`. Quando è impostato
`NEXT_PUBLIC_WHITELABEL_URL`, il client unisce una configurazione remota sopra
i default statici a runtime (senza rebuild).

Il backend Python espone il tema tramite l'API:

```bash
# Leggi il tema corrente
curl -sS http://127.0.0.1:8000/api/theme

# Aggiornalo (serve token admin)
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

Il tema è salvato nella tabella `settings` e sopravvive ai riavvii.

## Demo

La demo interattiva (`/demo`) espone entrambe le dimensioni dal vivo: gli
swatch di accento nell'header del frame cambiano l'accento della piattaforma e
il toggle del tema cambia scuro, chiaro e di sistema. Le modifiche sono salvate
in `localStorage` (`aetheris-theme`) e applicate prima del primo paint da uno
script inline nel layout radice, quindi non c'è flash del tema sbagliato.

## Aggiungere un nuovo accento

1. Aggiungi un blocco `[data-accent="..."]` in `app/globals.css` con i tre
   valori token (più una variante light se serve).
2. Aggiungi l'accento a `AccentName` in `lib/config/whitelabel.ts` e ad
   `accents` nel JSON statico.
3. Aggiungi uno swatch ad `ACCENT_SWATCHES` in
   `components/website/InteractiveDemo.tsx`.
4. Se deve servirlo il backend, estendi `ThemeConfig` in
   `aetheris-app/backend/aetheris_backend/schemas.py`.
