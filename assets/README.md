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
| `sound/guitar.mp3` | an acoustic strum or a single plucked string |
| `sound/drawing.mp3` | pencil on paper |
| `sound/games.mp3` | a controller click or coin blip |

Keep each under ~100 KB and about a second long. Until a file exists the bubble
synthesises its own version of that sound, so the page is playable without audio
and every bubble already sounds different.

Music is two bubbles, not one: guitar for playing, singing for your voice.

## If the bubbles are separate art in Figma
Export each as its own SVG and we swap the CSS circles for them. The
`--x` / `--y` / `--size` custom properties stay, so positioning carries over.

## Licensing note
If you pull sounds from Freesound or similar, keep a note of the licence and
attribution here — some require credit even for personal sites.

## Bubble sketches

One drawing per bubble, in `assets/bubbles/`, named for its `data-sound`:

`reading.svg` · `plane.svg` · `singing.svg` · `guitar.svg` · `drawing.svg` · `games.svg`

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

## Where to get the real sounds

Checked 5 October 2026. A portfolio that advertises your services counts as
commercial use, so avoid anything marked non-commercial.

| Source | Licence | Attribution |
| --- | --- | --- |
| [Pixabay](https://pixabay.com/sound-effects/) | Pixabay Content Licence, commercial use allowed | Not required |
| [Freesound](https://freesound.org/) | Varies per sound: CC0, CC-BY, or CC-BY-NC | CC0 none, CC-BY yes, **avoid CC-BY-NC** |
| [Mixkit](https://mixkit.co/free-sound-effects/) | Own free licence, reported commercial-safe | Reported none — read the licence modal first |
| [Zapsplat](https://www.zapsplat.com/) | Free tier | Required unless you pay |
| [OpenGameArt](https://opengameart.org/) | CC0 / CC-BY | Depends on the sound |

Start with Pixabay: no account, no attribution, and the filter for short clips is good.

**Do not use the BBC Sound Effects archive.** It is lovely and it is licensed for
personal and educational use only, which a professional portfolio is not.

### What to search for

| bubble | search terms |
| --- | --- |
| reading | page turn · book page flip · riffling pages |
| plane | airplane takeoff · jet flyby · cabin chime |
| singing | record yourself — see below |
| guitar | acoustic guitar strum · guitar pluck · nylon string |
| drawing | pencil on paper · pencil sketching |
| games | arcade coin · game blip · controller click |

**Sing the singing one yourself.** It is the one bubble where a stock clip will
always sound like a stock clip, it sidesteps licensing entirely, and a visitor
hearing your actual voice is a better moment than anything you can download.
Phone voice memo is fine.

### Making them sit together

The thing that makes six clips feel like one set is matched loudness and length,
not matched style. With ffmpeg:

```
ffmpeg -i raw.wav -t 1.2 -af "afade=t=out:st=0.9:d=0.3,loudnorm=I=-18:TP=-2" -b:a 128k sound/reading.mp3
```

That trims to 1.2s, fades the tail so it does not cut off hard, and normalises to
the same target as the others. Run the same command for all six and nothing will
jump out louder than the rest.

### Licences you used

Keep a record here as you add files, so you can answer the question later:

| file | source + link | licence | credit needed |
| --- | --- | --- | --- |
| | | | |
