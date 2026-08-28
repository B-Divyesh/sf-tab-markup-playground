# Independent verification — FAIL

Verified 2026-08-28 against candidate `270697f9d17a2c8efd636c1bfd236a59361c41d5`.

- Candidate worktree: clean detached worktree at `/tmp/tab-playbook-verify-270697f`
- Live URL: <https://tab-markup-playground.sociobot.in>
- Scope: static-web editor, legal pages, production build, live deployment, PWA,
  privacy/network behavior, keyboard/accessibility, mobile, and performance.

## Verdict

**FAIL.** The smallest useful product works and the live deployment is the
candidate, but two acceptance requirements are not met: 44 px interactive
targets and immutable caching of hashed static assets. Product code was not
changed during verification.

## Reproducible defects

### Medium — interactive targets fall below the 44 × 44 px requirement

Measured in a fresh Chromium run at both desktop and 390 × 844 mobile:

- `Apply to text` measures **131 × 40 px**.
- The header `TAB PLAYBOOK` home link measures **157 × 24 px**.
- Footer `Privacy` and `Terms` links measure **47 × 20 px** and **38 × 20 px**.

This violates the factory accessibility/design contract requiring touch/click
targets of at least 44 × 44 CSS px. The compact action is in the core
transpose workflow, so the issue is not limited to incidental footer content.

### Medium — hashed assets are not long-lived immutable cached in production

The live `main-DBbEJ_6A.js`, `styles-BfjrDgGb.css`, and `hero-640.avif` all
respond with:

```text
Cache-Control: public, must-revalidate, max-age=30
```

The performance contract requires long-lived immutable caching for hashed
assets. The candidate's `staticwebapp.config.json` provides only global
headers and no asset cache override, so the configuration does not meet that
requirement.

### Low — no Content-Security-Policy response header

The live site does supply HSTS, `X-Content-Type-Options: nosniff`, strict
origin referrer policy, and a restrictive camera/microphone/geolocation
Permissions-Policy. It does **not** supply `Content-Security-Policy`. This is
a response-policy hardening gap, not the primary reason for the FAIL verdict.

## Evidence that passed

### Clean install, tests, and build

Executed in the clean detached worktree with Node 22.23.2:

```sh
npm ci
npm test
npm run build
npm run test:e2e
```

- `npm ci`: 54 packages installed; `npm audit`: 0 vulnerabilities.
- `npm test`: **6/6** Vitest tests passed.
- `npm run build`: TypeScript `--noEmit` check and Vite production build
  passed. There is no separate lint script in `package.json`.
- `npm run test:e2e`: **6 passed, 2 expected project-skips** across desktop
  Chromium and the configured 390 × 844 mobile project.
- Production artifacts: initial app JS **12,159 B** (**5,046 B gzip**) and CSS
  **14,687 B** (**4,071 B gzip**); both are below the 200 KB / 50 KB budgets.
  No fonts are downloaded. The mobile hero AVIF is **15,300 B**.
- Fresh Lighthouse 12.8.2 mobile simulation against the production preview:
  Performance **100**, Accessibility **100**, Best Practices **100**, SEO
  **100**; FCP **1.2 s**, LCP **1.2 s**, CLS **0**, TBT **10 ms**.

### End-to-end behavior

Independently exercised on the exact production build and again on the live
URL:

1. Authored a four-bar D exercise with one ASCII tab string. The editor mapped
   four chords, rendered the fretboard and harmonic `vi⁷` view, transposed to
   E, and applied the changed key/chords while retaining tab fret numbers.
2. Used keyboard arrow navigation across the roving analysis tabs, verified a
   3 px mint visible focus ring, and used Ctrl+Enter to copy a share link.
3. Entered unsupported `@key H` and chord `Nope`; the line-level error and
   blocked-share recovery message appeared. Restoring valid markup worked.
4. Cleared and undo-restored a draft. An exactly 8,000-character valid draft
   remained shareable; 8,001 characters produced the documented size error.
5. At 390 px there was no page-level horizontal overflow (`scrollWidth =
   clientWidth = 390`); the intended horizontal fretboard scroller remained.
   Desktop and mobile screenshots were manually reviewed.
6. With reduced motion emulated, a panel animation duration computed to
   `0.01ms` and document scroll behavior to `auto`.

### Accessibility, privacy, and browser behavior

- Axe on live desktop root, live 390 px root, `/privacy/`, and `/terms/`:
  **0 serious/critical findings** (and no lower-impact findings).
- All normal interactive controls are reachable by keyboard. The roving tab
  list exposes only its selected tab in the Tab sequence as expected, with
  arrows/Home/End moving selection and focus.
- Live normal-flow browser requests were same-origin only. There are no
  third-party scripts, fonts, telemetry, or analytics requests.
- Source and browser exercise show drafts are localStorage-only and shared
  markup is URL-fragment encoded; it is not sent as a request path or query.
- No console errors or uncaught page errors occurred during independent local
  desktop/mobile or live desktop flows.
- Semantic basics are present: English language, titles, one h1 per page,
  header/main/footer landmarks, skip links, image alt text, privacy page, and
  terms page.

### PWA and deployment identity

- On live, the service worker is controlling the page at `/sw.js`; its
  `tab-playbook-v1` cache contained 11 entries. Calling
  `registration.update()` retained the current active worker with no waiting
  worker. After reload and forced offline mode, the live shell reloaded and
  announced `OFFLINE · EDITS STILL WORK` without console errors.
- Live root, production JS, CSS, privacy page, terms page, and sampled hero
  AVIF SHA-256 hashes exactly match the artifacts built from the candidate.
  The live asset references are `main-DBbEJ_6A.js` and `styles-BfjrDgGb.css`.
- Navigation fallback returns the app shell for an unknown route as configured.

## Required remediation before approval

1. Make every interactive target at least 44 × 44 px, including the compact
   transpose action and header/footer links, then rerun the 390 px measurement.
2. Configure Azure Static Web Apps route/header rules so fingerprinted JS, CSS,
   images, and other immutable assets receive a long-lived immutable
   `Cache-Control` value. Keep HTML and `sw.js` short-lived/revalidated so
   updates remain discoverable.
3. Add a Content-Security-Policy appropriate to this local-first static app.
4. Re-run this verification after the revised deployment is live.
