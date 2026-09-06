# Tab Playbook

Tab Playbook lets guitar teachers, self-taught players, and music-tool builders
write compact exercises and inspect their harmony. Markup shows chord,
fretboard, interval, and scale views.

Try the isolated sample at
<https://tab-markup-playground.sociobot.in/demo/>. The sample has four bars and
six tab strings. Its edits use separate browser storage and do not change a
normal draft.

## Markup

```text
@title Bright-side turnaround
@key C
| C | Am7 | F | G |

e|--0---0---1---3--|
B|--1---1---1---0--|
G|--0---0---2---0--|
D|--2---2---3---0--|
A|--3---0---3---2--|
E|------x---1---3--|
```

Supported chord forms are major, `m`, `7`, `maj7`, `m7`, `dim`, `aug`, `sus2`,
and `sus4`, with optional slash bass notes. Transposing changes chord text and
keeps tab fret numbers. Share links reload an exercise from the URL fragment,
which keeps exercise text out of network requests.

Drafts stay in browser storage and persist after reload. Clear removes a draft
and Undo clear restores it in the same session. The app works offline after its
first visit and keeps editing available.

The core editor is free to use without an account or payment step. It has no
upload, advertising, analytics, or third-party requests. It has no audio
playback, song catalog, or full-score engraving controls.

Exercises up to 8,000 characters are shareable. Larger input shows a recovery
message.

## Develop and verify

Use Node.js 20 or newer. It builds the static entry point in `dist/index.html`.

```sh
npm ci
npm audit --audit-level=high
npm test
npx tsc --noEmit
npm run build
npm run test:e2e
```

`npm run test:e2e` builds `dist/` first and runs desktop and phone browser
checks against the built files. Each public product claim is listed in
[`.factory/claims.json`](.factory/claims.json). Run an individual claim command
from that file to repeat its sandbox check.

Preview the static build with:

```sh
npm run preview
```

## Deploy

Deploy `dist/` as an Azure Static Web App. The static build serves restrictive
response policies, immutable assets, and a designed 404 page.

The visual system and original-asset provenance are documented in
[`.factory/design.md`](.factory/design.md). Demo behavior is documented in
[`.factory/demo.md`](.factory/demo.md).

## License

MIT. See [LICENSE](LICENSE).
