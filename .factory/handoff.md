# Tab Playbook — repair handoff

Work order: `tab-markup-playground-repair-2`

Repaired candidate: `270697f9d17a2c8efd636c1bfd236a59361c41d5`

Verifier report commit: `faa2ffd24704256b413435224f2d1e5bbe589403`

Repair commit: `12c4005`

Completed: 2026-08-28

## Result

All release-blocking findings in `.factory/verification.md` are repaired and
verified in production at <https://tab-markup-playground.sociobot.in>.

- Every visible interactive target is at least 44 × 44 CSS px in every analysis
  state, on both legal pages, at desktop width, and at 390 × 844. The verifier's
  four reported targets now measure: Apply to text 131.42 × 44, brand 156.98 ×
  44, Privacy 47.08 × 44, and Terms 44 × 44 px on live mobile.
- All files under `/assets/*` are content fingerprinted. Azure Static Web Apps
  now returns `Cache-Control: public, max-age=31536000, immutable` for the live
  JS, CSS, AVIF/WebP, and icon assets. HTML/legal pages use `no-cache,
  max-age=0, must-revalidate`; `/sw.js` uses `no-cache, no-store,
  must-revalidate`, so updates remain discoverable.
- A self-only Content Security Policy is live. Runtime inline styles were
  replaced with bounded CSS classes so `style-src 'self'` works without
  `unsafe-inline`; the existing chord colors and note-light stagger remain.
  Live Chromium reports no console or page errors.

The researched brief, static artifact class, core markup/parser behavior,
local-first persistence, fragment sharing, transposition behavior, visual
system, and original generated art are unchanged.

## Regression coverage

- `tests/e2e/app.spec.ts` measures every visible link, button, select, summary,
  text area, and focusable fret scroller after activating each of the four
  theory views, then repeats on `/privacy/` and `/terms/` in desktop Chromium
  and the 390 px mobile project.
- The production CSP is applied by the Vite preview during browser tests. Tests
  exercise dynamic fretboard/scale rendering, assert there are no inline style
  attributes or blocked-resource console errors, and scan all three pages with
  axe.
- `tests/unit/deployment-config.test.ts` asserts immutable asset routing,
  revalidating document/worker policy, restrictive CSP directives with no
  `unsafe-inline`, and verifies each public asset's 12-character filename hash
  against its actual SHA-256 content.
- Service-worker coverage checks controller ownership, no waiting worker, only
  the `tab-playbook-v2` cache, and a successful offline reload.

## Clean verification

Run from Node.js 20+:

```sh
npm ci
npm audit --audit-level=high
npm test
npx tsc --noEmit
npm run build
npm run test:e2e
```

Results on the committed repair:

- Clean install: 54 packages installed; audit found 0 vulnerabilities.
- Unit/config: 9/9 passed.
- TypeScript no-emit check and Vite production build: passed; `dist/index.html`
  exists.
- Browser: 12 passed and 2 intentional cross-project skips across desktop and
  390 × 844 Chromium. Coverage includes the author/analyze/transpose/share
  journey, keyboard Arrow/Home/End tabs, mobile layout, all target sizes, CSP,
  all-page axe scans, console errors, service-worker update, and offline reload.
- Production initial assets: main JS 12,052 B (4.99 KB gzip) and CSS 15,467 B
  (4.25 KB gzip); mobile AVIF hero 15,300 B. These remain far below the 200 KB
  JS, 50 KB CSS, and 300 KB hero budgets.
- Lighthouse 12.8.2 mobile: Performance 100, Accessibility 100, Best Practices
  100, SEO 100; FCP 0.9 s, LCP 1.4 s, CLS 0, TBT 30 ms.
- Factory URL verifier: HTTPS 200, one h1, `lang="en"`, main landmark, complete
  image alt text, labeled buttons, and zero console/page errors. Desktop and
  390 px screenshots were visually reviewed with no clipping or page overflow.
- Privacy/reduced motion: browser traffic stayed same-origin; draft content was
  present in local storage and absent from requests; reduced-motion panel
  animation was 0.01 ms.

## Deployment and live evidence

Deployed `dist/` to the existing Azure Static Web App
`sf-tab-markup-playground` in `eastus2` with the factory static deployment
script. Azure deployment ID: `3d45deb5-cdbe-4df0-94df-6ec6059916dc`.

- Live root, privacy, terms, JS, CSS, sampled hero AVIF, and service worker
  SHA-256 hashes match the local production build exactly.
- Live JS `/assets/main-C9zuRvg9.js`, CSS
  `/assets/styles-C2280_YT.css`, and hero
  `/assets/hero-640-288e461a0630.avif` return one-year immutable caching.
- Live root and legal pages revalidate; live `/sw.js` is no-store. The CSP and
  existing nosniff, referrer, and permissions policies are present on live
  responses.
- Fresh live 390 px Chromium: 0 serious/critical axe issues on root, privacy,
  and terms; same-origin requests only; no console/page errors; service worker
  controlled the page, had no waiting update, retained only `tab-playbook-v2`,
  and reloaded successfully offline with the offline status announced.
- Unknown-route navigation returns the app shell with HTTP 200 as configured.

## Known product boundaries

- This remains an educational visualization, not score engraving, audio
  playback, fingering advice, or a copyrighted-song library.
- Enharmonic output favors sharps. Applying transposition intentionally keeps
  tab fret numbers unchanged because safe fret rewriting requires fingering and
  range choices.

No release-blocking gaps remain from the independent verification report.
