# Tab Playbook — build handoff

Work order: `tab-markup-playground-build-1`

Completed: 2026-08-28

## What shipped

- A production Vite + vanilla TypeScript static app in `dist/`.
- A compact parser for `@title`, `@key`, chord-bar rows, slash chords, common
  open-chord qualities, comments, and optional six-string ASCII tab.
- Four live teaching views: chord tones, a 13-fret chord map, Roman-numeral
  harmonic flow, and a major-scale degree map.
- Non-destructive preview transposition plus an explicit “Apply to text” path.
  Chord/key symbols transpose; tab fret numbers intentionally remain as written
  and the UI says so.
- Share links that encode the complete exercise in the URL fragment. Exercise
  text is never uploaded. The current draft persists in local storage.
- Error and empty states, an undoable clear action, clipboard failure feedback,
  an online/offline indicator, and a service-worker shell verified by an actual
  offline reload.
- Keyboard-operable analysis tabs (Arrow keys, Home, End), Ctrl/Cmd+Enter share,
  visible focus styles, live status regions, 44 px controls, responsive layout
  checked at 390×844, and reduced-motion fallbacks.
- Privacy and terms pages, manifest/icon, Azure Static Web Apps routing/security
  config, robots.txt, sitemap, README, and MIT license.
- A product-specific pixel/demoscene visual system documented in `design.md`.
  The original generated hero, exact prompt, generator metadata, AVIF/WebP
  derivatives, and public disclosure are included. Largest delivered hero is
  47 KB; the mobile WebP is 23 KB.

## Verification

Run from a clean clone with Node.js 20+:

```sh
npm ci
npm test
npm run build
npm run test:e2e
```

- `npm test`: 6 unit tests passed.
- `npm run build`: passed with Vite 8.2.2; `dist/index.html` exists.
- `npm run test:e2e`: 6 passed / 2 intentionally project-skipped across desktop
  Chromium and 390 px mobile Chromium. Covers author → analyze → transpose →
  share, keyboard tabs, mobile target size, complete axe scan, zero console/page
  errors, and offline reload.
- `npm audit`: 0 vulnerabilities.
- Production bundle: 12.15 KB JS / 14.68 KB CSS uncompressed (5.05 KB / 4.10
  KB gzip), well below the 200 KB / 50 KB budgets.
- Lighthouse 12.8.2, default mobile emulation against the production preview:
  Performance 100, Accessibility 100, Best Practices 100, SEO 100; LCP 1.2 s,
  CLS 0, TBT 60 ms, FCP 0.9 s.
- Manual screenshots reviewed at 1440×1000 and 390×844. Generated art was
  visually inspected for malformed text, brands, unsafe symbols, and palette
  drift; none found.

## Known boundaries

- This is intentionally an educational visualization, not score engraving,
  audio playback, fingering advice, or a copyrighted-song library.
- Enharmonic output currently favors sharps (`A♯` rather than `B♭`). Flat input
  is accepted.
- Applying transposition does not rewrite tab fret numbers because doing so
  safely requires fingering/range decisions. The transposed theory views remain
  fully useful without modifying the source.

## Suggested next steps

- Add an explicit sharp/flat spelling preference.
- Add printable classroom exercise sheets only if the free format gains use.
- Broaden the chord grammar and optional tunings based on teacher feedback.
