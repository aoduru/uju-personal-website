# Assets to drop in

## The illustration
- `me-in-bubble.svg` (or `.png`) — you, curled and reading, floating in the big
  bubble. Transparent background. The layout sizes it to 46% of the stage, so
  anything 800–1200px wide is plenty. If the file is missing the page draws a
  dashed placeholder circle rather than breaking.

## Bubble sounds
One file per bubble, named to match its `data-sound` attribute in `index.html`:

| file | what it should be |
| --- | --- |
| `sound/reading.mp3` | a book riffling its pages |
| `sound/plane.mp3` | a plane taking off, or the fasten-seatbelt chime |
| `sound/singing.mp3` | a sung note or short phrase |
| `sound/drawing.mp3` | pencil on paper |
| `sound/games.mp3` | a controller click or coin blip |
| `sound/cooking.mp3` | a pan sizzling |

Keep each under ~100 KB and about a second long. Until a file exists the bubble
synthesises its own version of that sound, so the page is playable without audio
and every bubble already sounds different.

## If the bubbles are separate art in Figma
Export each as its own SVG and we swap the CSS circles for them. The
`--x` / `--y` / `--size` custom properties stay, so positioning carries over.

## Licensing note
If you pull sounds from Freesound or similar, keep a note of the licence and
attribution here — some require credit even for personal sites.

## Bubble sketches

One drawing per bubble, in `assets/bubbles/`, named for its `data-sound`:

`reading.svg` · `plane.svg` · `singing.svg` · `drawing.svg` · `games.svg` · `cooking.svg`

Until a file lands, the bubble shows its word instead, so nothing looks broken.

What makes them drop in cleanly:

- **SVG over PNG.** It stays sharp at any bubble size, and the file is tiny.
- **Square artboard**, with the drawing filling about 70% of it. The bubble sizes
  the art to 62% of its diameter, so leaving air in the export keeps the sketch
  off the rim.
- **One consistent stroke weight across all six.** This is what makes them read as
  a set rather than six unrelated drawings — more than style does.
- **Set strokes to `currentColor`** if you want them to pick up the pink and flip
  automatically in dark mode. If you export from Figma with a fixed colour, send
  them anyway and I will convert.
- No text inside the drawing — the label is handled in HTML for screen readers.

`_example.svg` in that folder is a working reference — a book, one stroke weight,
`currentColor`, 100x100 viewBox, drawing filling about 70% of the artboard. Rename a
copy of it to any bubble name to check your export pipeline before drawing all six.
