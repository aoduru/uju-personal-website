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
| `sound/peel-sticker.mp3` | a sticker coming off its backing — plays under every peel |
| `sound/page-peel.mp3` | reserved for the page peel, not wired up yet |

Aim for about a second. Longer is survivable — the page fades any clip out at
1.6s and stops the previous one when a new bubble is popped — but a clip that is
genuinely short sounds better than a long one cut off. Until a file exists the bubble
synthesises its own version of that sound, so the page is playable without audio
and every bubble already sounds different.

Music is two stickers, not one: guitar for playing, singing for your voice.

## If the stickers are separate art in Figma
Export each as its own SVG and we swap the CSS circles for them. The
`--x` / `--y` / `--size` custom properties stay, so positioning carries over.

## Licensing note
If you pull sounds from Freesound or similar, keep a note of the licence and
attribution here — some require credit even for personal sites.

## Bubble sketches

One drawing per bubble, in `assets/stickers/`, named for its `data-sound`:

`reading` · `plane` · `singing` · `guitar` · `drawing` · `games`
— each as `.png` (preferred for your art) or `.svg`

Until a file lands, the bubble shows its word instead, so nothing looks broken.

### Drawing the die cut in

The white sticker border should be drawn into the PNG itself, following the
shape of the drawing rather than a square. That is how real sticker art works,
it costs nothing at runtime, and it lets you control where the border is thick
or thin. Keep the weight consistent across all six so they read as one sheet.

Contour works per sticker, so the set can migrate one drawing at a time: put
`data-art="contour"` on that `<button class="sticker">` and only it loses the
card. `plane` is already there. Once every drawing carries its own die cut,
move the attribute to `<body>` once and delete the per-sticker ones.

Contour art is cropped tight rather than padded, so it fills its own box —
which is why the plane now reads larger than the carded ones. They will match
again when they are all contour.

Setting `data-art="contour"` That drops the square card, the pastel fill
and the box shadow, leaving the artwork, a shadow that traces its cut edge, and
the gloss sweep. Until then the square cards stay, so the page never looks
half-finished mid-redraw.

**The plane cannot stay white.** With no square behind it, a white plane with a
white die cut is invisible on a blush page. Give it a colour as you redraw.

**PNG or SVG, either works.** The page tries `.png` first, then `.svg`, then shows
the word. PNG is the right choice for hand-drawn or painted art — tracing a sketch
to SVG flattens the texture that makes it yours.

What makes them drop in cleanly:

- **Export at 512x512.** That is about 8x what the biggest bubble renders (around
  65px), so it stays crisp on retina and survives you enlarging the stickers later.
- **Square artboard**, with the drawing filling about 70% of it. The bubble sizes
  the art to 62% of its diameter, so leaving air in the export keeps the sketch
  off the rim.
- **One consistent stroke weight across all six.** This is what makes them read as
  a set rather than six unrelated drawings — more than style does.
- **Transparent background**, and run them through ImageOptim or TinyPNG before
  committing. Line art usually lands at 20-60KB each.
- **`currentColor` strokes only apply to SVG.** A PNG keeps the colours you drew,
  which means it will not recolour itself in dark mode. That is fine while the
  site is light by default; if a sketch ever looks wrong against the night sky, a
  CSS filter fixes it without redrawing anything.
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

| sticker | search terms |
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

### Starting offsets

Recordings arrive with silence at the front and their best moment some way in,
so `TRIM` at the top of `js/stickers.js` says where each one starts, how loud it
sits and how long it runs. Measured from the files rather than guessed:

| file | starts at | why |
| --- | --- | --- |
| `peel-sticker.mp3` | 0.30s | 18s of takes; the first clean peel is at 0.3 |
| `singing.mp3` | 1.10s | 11s recording whose strongest phrase begins there |

If you replace either file, re-check the offset or the clip will open on silence.

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
| reading.mp3 | likely Pixabay (freesound_community upload) | confirm | confirm |
| plane.mp3 | | | |
| guitar.mp3 | | | |
| drawing.mp3 | likely Pixabay (freesound_community upload) | confirm | confirm |
| games.mp3 | | | |
| singing.mp3 | not added yet | | |

The `freesound_community-*` originals still in your Downloads are the Pixabay
republishing account, which is CC0 and needs no credit — but confirm where each
one actually came from before you fill this in.
