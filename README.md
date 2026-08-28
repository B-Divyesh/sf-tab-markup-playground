# Tab Playbook

Tab Playbook turns a compact guitar exercise into four learner-visible views:
chord tones, a neck-wide fretboard map, Roman-numeral harmony, and the major
scale. It is for guitar teachers, self-taught players, and music-tool builders
who need something lighter than a notation suite.

Live: <https://tab-markup-playground.sociobot.in>

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

Supported chord qualities are major, `m`, `7`, `maj7`, `m7`, `dim`, `aug`,
`sus2`, and `sus4`, with optional slash bass notes. Tab lines are displayed as
written; applying a transposition changes the key and chord symbols but leaves
fret numbers unchanged.

Drafts use browser local storage. Share links encode the exercise in the URL
fragment, so no exercise text is uploaded. The product intentionally has no
audio, song catalog, or full score engraving.

## Develop and verify

Requires Node.js 20 or newer.

```sh
npm ci
npm run dev
npm test
npm run build
npm run test:e2e
```

The production command is exactly `npm run build`. It writes the static site to
`dist/` with `dist/index.html` at its root. Preview it with `npm run preview`.

## Deploy

Deploy `dist/` as an Azure Static Web App. `staticwebapp.config.json` is copied
into the build and supplies navigation fallback, MIME types, a restrictive
Content Security Policy, short-lived document/service-worker caching, and
one-year immutable caching for content-hashed assets. No infrastructure,
billing, analytics, or runtime secrets are needed.

The interface design and asset provenance are documented in
[`.factory/design.md`](.factory/design.md). The generated hero source and its
prompt sidecar live in `assets/src/`.

## License

MIT. See [LICENSE](LICENSE).
