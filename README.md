# uju-portfolio

Portfolio site for Uju Duru. Plain HTML, CSS and one small JS file — no framework,
no build step. Open `index.html` or serve the folder.

```
index.html        header, bubble hero, section stubs, footer
css/style.css     design tokens at the top, then header / hero / footer
js/bubbles.js     bubble popping + sound, display-font switcher
assets/           illustration and sounds (see assets/README.md)
```

## Trying the display font

Seven candidates are wired up. Append a query string to compare them on the real page:

`?font=albert` · `?font=alexandria` · `?font=hanken` · `?font=maven`
`?font=merriweather` · `?font=mona` · `?font=museo`

To make one permanent, set `--font-display` in `css/style.css` and update the
Google Fonts `<link>` in `index.html`.

## Colour

All colour lives in `:root` in `css/style.css`, with a dark-mode block below it.
Replace the placeholder values with the Figma ones.
