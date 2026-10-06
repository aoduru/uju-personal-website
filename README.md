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

Pastel palette: a cream page, a soft blue sky wash behind the hero so the bubbles
float in air, and one pastel per interest (lilac, sky, rose, peach, mint, butter).
Text is `--ink` #3A2E2C; pink text uses `--accent-ink` #9E5956, which clears 4.5:1
on every background here. `--accent` #CA8A88 is for bubbles, rules and hovers only.

### Comparing page backgrounds

`?bg=cream` (default) · `?bg=white` · `?bg=sky`

To make one permanent, set `--page` in `:root`.

### Theme

The button under the hero cycles auto → light → dark and remembers the choice.
Dark is a night sky, not a brown room.
