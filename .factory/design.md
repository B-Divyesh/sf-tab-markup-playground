# Tab Playbook — visual thesis

## Direction: pocket demoscene workstation

Tab is already a grid, and guitar learning is a practice of finding repeating
patterns. Tab Playbook treats the page like a tiny late-90s music utility:
precise pixel corners, single-pixel rails, an oscilloscope-like grid, and bright
note lights. It is playful enough to invite experimentation but restrained
enough for a teacher to use while explaining harmony. Decoration always carries
meaning: lit frets are notes, the tracker strip is the active progression, and
the generated hero depicts text becoming a playable harmonic map.

This is deliberately a single dark mode. A dark, explicitly painted stage makes
fret and interval lamps readable and matches the demoscene direction; every text
and UI token has been checked against that stage.

## Palette

- `void #080b12` — page background, derived from an unlit rehearsal room.
- `deck #101722` and `deck-raised #172231` — instrument/workbench surfaces.
- `paper #f4f0df` — primary copy, like a warm chord-sheet page (15.7:1 on void).
- `mist #a9b5c5` — secondary copy (9.1:1 on void).
- `signal #f4df4e` — active notes and primary action; black label (15.1:1).
- `pulse #65e6c4` — harmonic/valid state and focus rails (12.2:1 on void).
- `coral #ff7a78` — parsing errors and destructive signals (7.5:1 on void).
- `violet #a992ff` — interval/scale contrast (8.2:1 on void).

Color is never the only carrier: labels, shapes, and text accompany each state.

## Type and rhythm

Two local/system families, no runtime font request:

- Interface and prose: `Inter`, loaded from a checked-in WOFF2 subset when
  available, falling back to `system-ui`.
- Markup, note names, and tracker labels: `IBM Plex Mono`, loaded locally as a
  WOFF2 subset with a system monospace fallback.

Type scale: 13 / 16 / 20 / 28 / 44 px. Body never drops below 16 px. Labels may
use 13 px only with increased tracking. Spacing follows a 4/8 px rhythm, with
24–32 px section gaps and a readable 68-character prose measure.

## Shape, assets, and interaction grammar

Corners are clipped at 6 px or square; shadows are hard 4 px offsets rather than
soft SaaS-card blurs. One-pixel grid textures and authored SVG note/fret glyphs
support the UI. Controls depress by 2 px. The selected analysis tab gains both a
yellow top rail and an `aria-selected` state. Fret cells light from the nut
outward when content changes. Keyboard command labels are visible where useful.

The hero raster is an original generated pixel-art still: a compact guitar neck
emerging from a tracker/grid workstation, note nodes glowing in the product
palette. It explains the transformation from terse text to harmonic map rather
than acting as filler. It has no text, logo, people, or branded equipment.

## Motion policy

State transitions last 160–220 ms and animate only opacity or transform. A new
analysis view rises 4 px; share feedback snaps into the originating button; note
lamps stagger once for at most 280 ms. Nothing loops. Under
`prefers-reduced-motion: reduce`, all movement and smooth scrolling become
instant while state, depth, and focus remain visible through borders and color.

## Responsive intent

Desktop is a two-deck workstation: authoring left, analysis right. Under 900 px
it becomes one reading column with a sticky-but-not-fixed view selector. At
390 px, explanatory hero copy is shortened, shortcut hints collapse, fretboards
scroll horizontally with an explicit label, and all controls remain at least
44 px. The editor remains first so the write → inspect loop is intact.

## Generated asset prompt sheet and provenance

Use case: `stylized-concept`. Asset type: landing/editor hero illustration.
Subject: a guitar fretboard emerging diagonally from a tiny music tracker/grid
workstation, with abstract chord blocks resolving into luminous note nodes.
World/materials: 1990s demoscene pixel-art, crisp stepped pixels, matte charcoal
hardware, subtle CRT bloom, no readable interface text. Light: dark rehearsal
room, controlled yellow/mint/violet signal lights. Composition: wide 3:2 scene,
subject weighted right with calm dark negative space on the left, no frame.
Palette words: inky navy, warm paper, signal yellow, mint pulse, violet accent,
coral used sparingly. Negative list: photorealism, generic gradient, real person,
hands, brands, logos, watermark, legible text, notation symbols that could be
mistaken for authoritative engraving, excessive glow, visual noise.

Provenance: generated for Tab Playbook on 2026-08-27 with the factory-image
deployment via `/opt/fleet/lib/gen-image.sh`. Original product asset; prompt is
stored alongside the source image. The footer discloses generated imagery.
