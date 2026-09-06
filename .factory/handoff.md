# Tab Playbook verification 3 handoff

Work order: `tab-markup-playground-verify-3`

Verified: 2026-09-06

Live URL: <https://tab-markup-playground.sociobot.in>

## Result

**FAIL — 1 medium finding and 2 untested public claims.**

Implementation reviewed:
`1d1e47f018800e6739f38d07600aef5b60b24e33`. Documentation supplied:
`975771a4d277394463d5da8cdeffc2234e5ebac9`. The later work-order checkout
commit changes Graphify output only. Twenty of twenty public build artifacts
match the live deployment byte for byte.

All 16 declared claim commands passed individually from a clean detached clone.
The clean install and audit, 6 unit tests, TypeScript check, production build,
build claim, and browser suite also passed. The browser suite reported 39
passes and its one documented mobile service-worker skip.

Fresh desktop and phone checks passed the sample, isolated storage, reset,
start-for-real, authoring, theory, transpose, share, invalid input, 8,000/8,001
boundary, recovery, keyboard, focus, responsive, reduced-motion, legal, 404,
privacy-traffic, and offline/update paths. Axe found no violations on five
routes at both sizes. Lighthouse 13.4.1 scored 100 in all four categories.

The remaining finding is claim coverage. **Copy markup** and the visible
**Ctrl + Enter copies the share link** shortcut both work live, but neither is
listed in `.factory/claims.json` or exercised by a tagged claim test. The
claims contract therefore prevents a PASS until both behaviors have declared
observable tests or the public promises are removed.

Full evidence and required disposition are in
[`.factory/verification-3.md`](verification-3.md). The report is copied to
`/work/.evidence/qa-report.md`; machine-readable status is in
`/work/.evidence/qa-result.json`. No product code was changed. Existing
Graphify changes remain preserved and uncommitted.

## Prior repair record

Work order: `tab-markup-playground-repair-3`
Completed: 2026-09-06
Live URL: <https://tab-markup-playground.sociobot.in>

## Shipped implementation

Implementation SHA: `1d1e47f018800e6739f38d07600aef5b60b24e33`
Documentation baseline: `1d1e47f018800e6739f38d07600aef5b60b24e33`
The handoff report is committed separately after this deployed implementation;
it does not require a new product image.
Initial handoff-report commit: `6eadf588f7e655af264308b143a2a6d26e3da4d3`
(report-only; the implementation above remains the deployed product image).

Tab Playbook now lets guitar teachers, self-taught players, and music-tool
builders write an exercise, inspect its theory views, transpose it, and share
it. The first action is **Try it with sample data**, which opens `/demo/` with
a populated four-bar exercise.

## Review findings resolved

- **F1, unsafe sample handling:** `/demo/` has the persistent **Demo — sample
  data, nothing is saved** banner, Reset demo, and Start for real. Demo edits
  use `tab-playbook:demo:draft:v1`; normal drafts use
  `tab-playbook:draft:v1`. Reset and exit do not alter a normal draft.
- **F2, missing claim tests:** `.factory/claims.json` declares 16 public
  claims. Each has exactly one tagged outcome test and documented command.
- **F3, first screen and page order:** the home page names the job, audience,
  sample action, price/privacy/offline facts, three-step instructions, and
  product scope. `.factory/copy-audit.md` records the sentence audit.
- **F4, skip link:** Skip to editor targets and focuses the workbench.
- **F5, routes and 404:** `/demo` and `/demo/` serve the demo title. Unknown
  paths serve the designed `404.html` with HTTP 404.
- **F6, metadata and structure:** every route has canonical, Open Graph,
  Twitter, favicon/Apple-touch metadata, shared navigation and footer, and the
  sitemap lists the demo route.

Earlier verification findings remain repaired: all visible targets are at least
44 px; hashed assets are immutable; documents and `sw.js` are revalidated; and
the live CSP is self-only without inline styles.

## Verification

From a fresh detached checkout of the implementation SHA:

```sh
npm ci
npm audit --audit-level=high
npm test
npx tsc --noEmit
npm run build
npm run test:build-claim
npm run test:e2e
```

- Install and audit completed with zero vulnerabilities.
- Unit tests: 6 passed. Build-output claim: 1 passed.
- Production build produced `dist/index.html`.
- Browser suite: 39 passed, with 1 intentional mobile skip for the desktop-only
  dedicated service-worker context.
- All 16 commands listed in `.factory/claims.json` passed individually.
- The browser suite covers normal authoring, invalid markup, 8,000/8,001
  character boundaries, recovery, keyboard tabs, focus, links, titles, cache
  headers, 404, privacy traffic, offline reload/update, reduced motion, touch
  targets, and Axe.

Live checks used fresh desktop (1440 × 1000) and phone (390 × 844) contexts.
Both showed the job, audience, and sample action before scrolling. In each,
the sample loaded populated chords and tab, the demo label persisted, reset
restored the sample, and leaving demo preserved a real draft. No console errors
occurred. Live offline verification found service-worker cache
`tab-playbook-v3`, no waiting update, an offline reload, and editable markup.
The factory URL verifier also passed in 682 ms with a title, `lang="en"`, one
`h1`, a main landmark, complete image alt text, labeled buttons, and no console
errors.

Live Axe scans found zero violations on `/`, `/demo/`, `/privacy/`, and
`/terms/` at both sizes. Lighthouse 13.4.1 mobile scored 100 for Performance,
Accessibility, Best Practices, and SEO (FCP 0.8 s, LCP 1.1 s, TBT 40 ms, CLS
0).

The production bundle is 12.27 KB JavaScript and 18.02 KB CSS before gzip; the
largest initial hero asset is 15.3 KB AVIF. The 1200 × 630 social image is an
optimized 244,510-byte PNG and is not loaded as page content.

Deployment succeeded to the existing static app. The HTTPS origin serves the
implementation title, direct demo route, immutable hashed assets, self-only
CSP, non-cached worker, and deliberate styled HTTP 404.

## Notes

- The brief is free-only. There is no paid offer or billing dependency.
- This static product has no backend, tenant state, server database, rate
  limits, or installed CLI artifact; backend/tenant/429 checks do not apply.
- Original hero, social, and touch assets with provenance are recorded in
  `.factory/design.md`.
- `.factory/catalog-description.txt` was copied to
  `/work/.evidence/catalog-description.txt`.
- Pre-existing Graphify output changes were left unmodified and uncommitted.

No known product gaps remain.
