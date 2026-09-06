# Verification 3: Write and explain guitar exercises — FAIL

Verified on 2026-09-06 at
<https://tab-markup-playground.sociobot.in>.

## Verdict

**FAIL — 1 medium finding and 2 untested public claims.**

The editor, isolated sample, live deployment, accessibility, privacy behavior,
offline path, and all 16 declared claim commands passed. Two additional public
behaviors are absent from the claim inventory and tagged tests. The claims
contract requires zero untested claims, so the product is not accepted.

## First screen before scrolling

- Job: write and explain guitar exercises.
- Audience: guitar teachers, self-taught players, and tool builders who want a
  quick theory view.
- First action: **Try it with sample data**. Its adjacent text says that it
  loads four bars with chord, tab, and theory views.
- The first screen also shows that the core editor is free, drafts stay in the
  browser, and offline use starts after the first visit.

All of this was visible at scroll position zero in fresh 1440 × 1000 and
390 × 844 browser contexts. Screenshots are stored at
`/work/.evidence/tab-playbook-verification-3/tab-live-desktop-first.png` and
`/work/.evidence/tab-playbook-verification-3/tab-live-phone-first.png`.

## Reviewed versions

- Implementation candidate and deployed product:
  `1d1e47f018800e6739f38d07600aef5b60b24e33`.
- Documentation supplied with the assignment:
  `975771a4d277394463d5da8cdeffc2234e5ebac9`.
- Work-order checkout before this report:
  `2c10ef278c81d091ccc2da09386dbca9f6eb5dfa`.
  Its change after the documentation commit is Graphify output only.
- A clean detached clone at `/tmp/tab-playbook-verification-3` was checked out
  at the implementation candidate. It remained clean after verification.

A fresh candidate build was compared byte for byte with the live origin.
Twenty of twenty public files matched, including all HTML pages, JavaScript,
CSS, images, manifest, worker, robots file, and sitemap. The designed 404 body
also matches `dist/404.html`. Later documentation and Graphify commits do not
require a different product image.

## Finding

### F1 — Medium — Two public actions have no declared claim or tagged test

The editor publicly offers both of these behaviors on `/` and `/demo/`:

1. The **Copy markup** button promises to copy the current markup.
2. The sentence **Ctrl + Enter copies the share link** promises a keyboard
   shortcut.

Neither behavior is listed in `.factory/claims.json`. No test exercises the
**Copy markup** button or presses Ctrl+Enter. A source search found only the UI
copy and implementation handlers; the 16 `@claim:` tags correspond one-to-one
with the existing 16 declared IDs.

Both behaviors worked in a manual live check: copied markup exactly matched the
editor value, and Ctrl+Enter produced a same-origin URL with an `exercise=`
fragment. This proves the current implementation works, but it does not meet
the required per-build claim contract.

Required disposition: add declared claims with observable tagged tests for both
behaviors, or remove the public promises and controls. Run each resulting claim
command from a clean checkout.

Untested public claim count: **2**.

## Declared claim commands

Every command in `.factory/claims.json` was run individually after `npm ci` in
the clean candidate checkout. All exited successfully.

| Claim ID | Individual result |
| --- | --- |
| `demo-sample` | Pass: 2 browser projects |
| `demo-isolation` | Pass: 2 browser projects |
| `theory-views` | Pass: 2 browser projects |
| `chord-forms` | Pass: 2 browser projects |
| `transpose-keeps-tab` | Pass: 2 browser projects |
| `share-link` | Pass: 2 browser projects |
| `share-privacy` | Pass: 2 browser projects |
| `draft-persistence` | Pass: 2 browser projects |
| `clear-undo` | Pass: 2 browser projects |
| `offline-after-first-visit` | Pass: desktop; documented mobile project skip |
| `local-first` | Pass: 2 browser projects |
| `scope` | Pass: 2 browser projects |
| `size-limit` | Pass: 2 browser projects |
| `free-core` | Pass: 2 browser projects |
| `clean-build` | Pass: 1 build assertion |
| `deployment-policy` | Pass: 2 browser projects |

The declared inventory contains 16 IDs, and source inspection found exactly one
matching `@claim:<id>` occurrence for each, with no extra tags. F1 records the
two public behaviors missing from that inventory.

## Clean-checkout results

Environment: Node 22.23.2 and npm 10.9.8.

```text
npm ci                         passed; 54 packages installed
npm audit --audit-level=high   passed; 0 vulnerabilities
npm test                       passed; 6 tests
npx tsc --noEmit               passed
npm run build                  passed; dist/index.html produced
npm run test:build-claim       passed; 1 test
npm run test:e2e               passed; 39 tests, 1 documented mobile skip
```

The production build contains 12.27 KB of app JavaScript and 18.02 KB of CSS
before gzip. The phone hero AVIF is 15,300 bytes. These pass the static-product
budgets.

## Live sample and main workflow

Fresh desktop and phone contexts followed the first-screen sample action. Both
loaded `Four-bar G warmup`, four chord cards, six tab strings, and populated
theory output. The persistent **Demo — sample data, nothing is saved** label,
**Reset demo**, and **Start for real** controls remained visible. Reset restored
the shipped sample. Leaving demo removed the demo key and restored the untouched
normal draft; only `tab-playbook:draft:v1` remained.

The live desktop workflow also passed these checks:

- A D, Bm7, G, A7 exercise populated chord, fretboard, interval, and scale
  views.
- Transposing by two semitones produced E, C♯m7, A, and B7 while retaining the
  tab frets.
- A copied fragment link reloaded the same exercise in another fresh page, and
  no exercise text appeared in a request.
- Invalid key and chord input produced a line error. Sharing was blocked with a
  recovery instruction and focus returned to the editor.
- A valid 8,000-character exercise produced a share link. At 8,001 characters,
  the editor showed the documented limit message.
- Clear persisted an empty draft across reload. Undo clear restored content in
  the same session.
- A damaged fragment kept the editor usable and showed its recovery message.
- With clipboard permission denied, the editor reported the block, focused the
  text area, and selected the markup for manual copying.
- With browser storage unavailable, the sample still loaded and rendered; the
  save state changed to **Storage unavailable** without a console error.

Populated screenshots are stored at
`/work/.evidence/tab-playbook-verification-3/tab-live-desktop-demo.png` and
`/work/.evidence/tab-playbook-verification-3/tab-live-phone-demo.png`.

## Accessibility, keyboard, mobile, and motion

- Axe found zero violations of any impact on `/`, `/demo/`, `/privacy/`,
  `/terms/`, and the 404 page at desktop and phone sizes.
- Each checked page has `lang="en"`, one `h1`, one `main`, a route-specific
  title, and no page-level horizontal overflow.
- Every visible interactive target on those routes measured at least 44 × 44
  CSS pixels.
- Skip links focused the workbench or legal main. Arrow keys and End changed
  and focused the roving theory tabs. Focus rings remained visible.
- Reduced-motion contexts computed a maximum animation duration of 0.01 ms.
- The phone layout showed no clipping. The fretboard retains its labeled
  horizontal scroller.
- The factory URL verifier passed in 581 ms with no console errors, one `h1`,
  English language, a main landmark, complete image alt text, and labeled
  buttons. Its output is under
  `/work/.evidence/tab-playbook-verification-3/`.

The only console message during route checks was the browser's expected failed
resource message for the deliberate HTTP 404. It is not a defect.

## Privacy, offline use, routes, and deployment

- The complete exercised flow made same-origin GET requests only. It made no
  third-party, analytics, advertising, upload, account, or payment request.
- Share data remained in the URL fragment and never appeared in a request URL.
- The product stores no server-side user state. Privacy deletion is local:
  Clear removes the draft content, while reset and exit remove demo content
  without changing the normal draft. There is no backend privacy-request data
  path to exercise.
- The live worker controlled the page, had no waiting update, and exposed only
  cache `tab-playbook-v3`. After switching offline, `/demo/` reloaded and a new
  four-chord edit rendered without errors.
- `/`, `/demo`, `/demo/`, `/privacy/`, and `/terms/` return HTTP 200 with their
  required titles. A missing route returns the designed Tab Playbook page with
  HTTP 404 and a working editor link.
- Every navigational link resolved successfully. The sitemap lists all real
  routes, and the robots file is reachable.
- HTML is revalidated. Hashed assets return
  `public, max-age=31536000, immutable`; `sw.js` returns
  `no-cache, no-store, must-revalidate`.
- Responses include the self-only CSP, HSTS, `nosniff`, strict-origin referrer
  policy, and restrictive permissions policy. No blocked-resource error was
  observed.

Lighthouse 13.4.1 mobile scores were 100 Performance, 100 Accessibility, 100
Best Practices, and 100 SEO. FCP was 1.0 s, LCP 1.1 s, TBT 0 ms, and CLS 0. The
JSON output is
`/work/.evidence/tab-playbook-verification-3/tab-lighthouse-verification-3.json`.

## Earlier finding disposition

| Earlier finding | Current evidence | Disposition |
| --- | --- | --- |
| Sub-44 px controls | All visible controls pass at desktop and phone sizes | Repaired |
| Hashed assets lacked immutable caching | Live hashed assets have one-year immutable caching | Repaired |
| CSP was missing | Live responses carry the restrictive self-only CSP | Repaired |
| Sample overwrote normal drafts | Separate keys, reset, and exit preserve the normal draft | Repaired |
| Sixteen public claims lacked tagged tests | All 16 declared commands and tags pass; F1 records two newly identified omissions | Partially repaired |
| First screen and page order failed | Job, audience, action, facts, steps, and scope are present | Repaired |
| Skip link did not reach the editor | It focuses `#workbench` | Repaired |
| Demo route and designed 404 were absent | Both demo forms work; unknown paths return the styled HTTP 404 | Repaired |
| Metadata and shared structure were incomplete | Real routes have metadata, navigation, footer, version, and sitemap entries | Repaired |

`.factory/verification-2.md` reported no defects under its earlier checklist.
Those paths were exercised again. F1 is a claim-inventory gap not covered by
that checklist.

## Not applicable

This is a static PWA with no backend, API, authentication, tenants, server
database, payment flow, CLI, library package, or desktop artifact. Tenant
isolation, restart persistence, health, 429/`Retry-After`, and clean consumer
installation checks do not apply. The brief does not need an AI feature.

## Final result

- Verdict: **FAIL**
- Finding count: **1**
- Untested claim count: **2**

A successful test run does not override the missing claim coverage.
