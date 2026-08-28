# Independent verification 2 — PASS

Verified 2026-08-28 against candidate
`2c9a0ff72be8346b15b8fb42b497f6a3bf0bd3f1` from a clean detached worktree
at `/tmp/tab-playbook-qa`.

- Live URL: <https://tab-markup-playground.sociobot.in>
- Product class: static-web PWA; no sign-in, backend API, payment, or
  server-side product endpoint is present.
- Verdict: **PASS.** No acceptance defects were found. The two blockers in the
  previous report (sub-44px controls and non-immutable asset caching) are
  repaired in both the candidate and live deployment.

## Local reproducibility

Using Node 22.23.2, the following all passed from the clean checkout:

```sh
npm ci
npm audit --audit-level=high
npm test
npx tsc --noEmit
npm run build
npm run test:e2e
```

- `npm ci` installed 54 packages; audit reported 0 vulnerabilities.
- Unit/configuration: **9/9** Vitest tests passed.
- There is no lint script in `package.json`; the available TypeScript check is
  included in `npm run build` and was also run explicitly.
- The exact production command completed and produced `dist/`.
- Playwright: **14/14** configured desktop Chromium and 390 x 844 mobile runs
  passed (including the intentional project-specific skips as passing suite
  behavior).
- Production app JS is **12,052 B** (4.99 KB gzip); CSS is **15,467 B**
  (4.25 KB gzip); the mobile AVIF hero is **15,300 B**. All are within the
  200 KB JS, 50 KB CSS, and 300 KB image budgets; no webfont is downloaded.

## Product and recovery exercise

Fresh live Chromium exercise at desktop 1440 x 1000 and mobile 390 x 844:

1. Authored `@key D | D | Bm7 | G | A7 |` plus one tab string. It mapped four
   chords, showed `vi⁷` in Intervals, transposed to E, and applied the changed
   key/chords while preserving tab fret numbers.
2. Copied a fragment-based share link; the clipboard URL contained `exercise=`.
   No exercise content was sent in request paths or queries.
3. Entered invalid `@key H` and `Nope`; received the line-level error and
   blocked-share recovery message. Restoring valid markup worked.
4. Cleared then Undo-cleared a draft successfully. A valid exactly-8,000-byte
   draft remained shareable; 8,001 characters produced the documented size
   error.
5. Keyboard ArrowRight moved the roving tab focus to Fretboard; the focused
   tab had a visible `rgb(101, 230, 196) solid 3px` ring. There was no trap.
6. Under reduced motion, panel animation/transition durations computed to
   `0.01ms`. At 390px the document was exactly 390px wide with no page overflow;
   the intentional fretboard scroller remained available.

No console errors or uncaught page errors occurred in the local or live
desktop/mobile runs. Full-page desktop and mobile screenshots were visually
reviewed: the workbench stacks intentionally, controls remain usable, and no
clipping was observed.

## Accessibility and privacy

- Fresh `@axe-core/playwright` scans of `/`, `/privacy/`, and `/terms/` at both
  desktop and 390px had **zero serious/critical findings** (zero findings of
  any impact).
- Each page has `lang="en"`, a title, exactly one h1, a main landmark, and
  complete image alt text. All visible interactive targets measured at least
  44 x 44 CSS px on app and legal pages at both widths.
- Normal-flow live requests were same-origin only. Source review and browser
  evidence show localStorage for drafts and URL fragments for sharing; there
  are no analytics, telemetry, third-party scripts, fonts, trackers, accounts,
  or uploads. The static service worker fetches only same-origin shell assets.
- No API endpoint exists, so rate-limit testing is not applicable. No sign-in
  exists, so external identity-tenant testing is not applicable.

## PWA, headers, performance, and deployment identity

- On live, `/sw.js` controlled the page, `registration.update()` left no
  waiting worker, cache state was only `tab-playbook-v2`, and an offline reload
  rendered the shell with `Offline · edits still work`.
- SHA-256 matched every built `dist/assets/*` file and the live index, privacy,
  terms, worker, and manifest responses. `staticwebapp.config.json` itself is
  intentionally not a public file: its public URL falls through to the app
  shell; live response policies below independently confirm it is active.
- Live content-hashed JS, CSS, and AVIF assets return
  `Cache-Control: public, max-age=31536000, immutable`. HTML/legal pages return
  `no-cache, max-age=0, must-revalidate`; the worker returns
  `no-cache, no-store, must-revalidate`.
- Live root and assets send the self-only CSP (`default-src`, `script-src`,
  `style-src`, `connect-src`, and `worker-src` all `'self'`; no
  `unsafe-inline`), HSTS, nosniff, strict-origin referrer policy, and restrictive
  camera/microphone/geolocation Permissions-Policy.
- Fresh Lighthouse 12.8.2 mobile on live: Performance **99**, Accessibility
  **100**, Best Practices **100**, SEO **100**; FCP **1.7 s**, LCP **1.9 s**,
  TBT **60 ms**, CLS **0**.

## Defects

None found. This report supersedes neither the historical failed report nor
its repair history; it independently confirms the specified repaired candidate
and deployed artifacts pass the acceptance contract.
