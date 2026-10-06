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
