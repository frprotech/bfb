# Buure für Biendli – Landing Page

Static, dependency-free front end, structured for a straightforward WordPress rebuild.

```
index.html
assets/
  css/
    tokens.css       colours, type scale, spacing, radii, motion (single source of truth)
    base.css         reset, typography, layout primitives, reveal/motion primitives
    components.css   label, buttons, nav, mobile menu, callout, cards, form, logo slider
    sections.css     hero, über uns, programm, newsletter, partner, footer
  js/
    main.js          header, mobile menu, button text roll, heading reveal,
                     scroll reveals, hero parallax, active nav, partner slider
  img/               logo (colour + negative), favicon, partner logos, Infomaniak
```

Run locally: open `index.html`, or `npx http-server .`

## Handover notes

- **Photos:** hero and newsletter use labelled placeholders (`.ph`). Replace each with the `<img>` shown in the HTML comment next to it; overlays already guarantee text contrast.
- **Newsletter:** the form is a stand-in for the Infomaniak embed.
- **Partner logos:** add `<li class="logo-tile">` items (up to 9). Arrows appear automatically once the logos no longer fit; no autoplay. `--w` tunes each logo's optical width.
- **Logo:** `logo-bfb.png` / `logo-bfb-negativ.png` were derived from the supplied artwork; swap for vector files once final.
- **Accessibility:** one H1, semantic landmarks, visible form label, rem-based type, all text ≥ 4.5:1, `prefers-reduced-motion` disables all motion. Content is fully visible without JS.
