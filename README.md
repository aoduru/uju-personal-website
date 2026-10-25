# uju-portfolio

Portfolio site for Uju Duru. Plain HTML, CSS and one small JS file — no framework,
no build step. Open `index.html` or serve the folder.

```
index.html                  header, bubble hero, case study cards, section stubs, footer
case-studies/_template.html the case study template — copy it per project
css/style.css               design tokens at the top, then header / hero / cards / footer
css/case-study.css          case study page layout (reuses the tokens)
js/site.js                  every page: theme, ?bg= / ?font= trials, footer year
js/bubbles.js               bubble popping + sound
js/carousel.js              arrow buttons for the swipeable cards
js/case-study.js            highlights the current section in "On this page"
assets/                     illustration and sounds (see assets/README.md)
```

## Adding a case study

1. Copy `case-studies/_template.html` to `case-studies/<slug>.html` and fill it in.
   Grey italic text is a writing prompt; replace it and drop the `hint` class.
2. Put the card cover at `assets/projects/<slug>.png` (1600x1200, 4:3). Until it
   exists the card shows a pastel wash, so nothing looks broken.
3. In `index.html`, copy one `<li class="project-card">`, set its `--tint`, name
   and `href`. The cards swipe on touch, scroll on a trackpad, and have arrows.

## Trying the display font

Seven candidates are wired up. Append a query string to compare them on the real page:

`?font=albert` · `?font=alexandria` · `?font=hanken` · `?font=maven`
`?font=merriweather` · `?font=mona` · `?font=museo`

To make one permanent, set `--font-display` in `css/style.css` and update the
Google Fonts `<link>` in `index.html`.

## Colour

All colour lives in `:root` in `css/style.css`, with a dark-mode block below it.

Pastel palette: a blush page (#FBF1EE) throughout, with one pastel per interest
(lilac, sky, rose, butter, peach, mint) carrying the colour instead.
Text is `--ink` #3A2E2C; pink text uses `--accent-ink` #9E5956, which clears 4.5:1
on every background here. `--accent` #CA8A88 is for bubbles, rules and hovers only.

### Comparing page backgrounds

`?bg=blush` (default) · `?bg=cream` · `?bg=white`

To make one permanent, set `--page` in `:root`.

### Theme

**The site is light by default for everyone**, whatever their system is set to.
Dark mode exists but only arrives when a visitor asks for it: the button under
the hero cycles light → dark → auto (auto follows their OS) and remembers the
choice in that browser. Dark is a night sky, not a brown room.

If you ever want the site to follow the visitor's system again, change
`:root[data-theme="auto"]` back to `:root:not([data-theme="light"])` in the
`prefers-color-scheme` block and make `light` the last mode in `MODES`.
