# Assets to drop in

## The illustration
- `me-in-bubble.svg` (or `.png`) — you floating in the big bubble, transparent background.
  Export at 2x if PNG. The layout sizes it to 46% of the stage, so anything 800–1200px wide is plenty.
  If the file is missing, the page draws a dashed circle placeholder instead of breaking.

## Bubble sounds
One file per bubble, named to match its `data-sound` attribute in `index.html`:

- `sound/drawing.mp3`
- `sound/games.mp3`
- `sound/music.mp3`
- `sound/spatial.mp3`
- `sound/cooking.mp3`
- `sound/reading.mp3`

Keep them under ~100 KB each and under a second long. Until a file exists, the bubble
synthesises a pop, so you can ship without audio and add it later.

## If the bubbles are separate art in Figma
Export each bubble as its own SVG and we'll swap the CSS circles for them. The
`--x` / `--y` / `--size` custom properties on each `.bubble` stay the same, so
positioning carries over.
