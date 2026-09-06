# Review: Write and explain guitar exercises — FAIL

Reviewed on 2026-09-06 at
<https://tab-markup-playground.sociobot.in>.

## Verdict

**FAIL — 6 findings, including 2 high-severity findings, and 16 untested public claims.**

The editor completes its main author, inspect, transpose, and share workflow.
It does not meet the required demo, claim, first-screen, accessibility, routing,
and metadata contracts. A successful test run is not a product PASS.

## Reviewed versions

- Implementation reviewed: `12c4005d1372de54fb4952ef5406576c9cbbde1b`
  (`fix: close verifier release blockers`).
- Documentation baseline: `7f0725431951260bf29fd2945e0c99a0644d5138`.
- Work-order checkout: `b84f243c29de8522c3cdbdcec61421335886fd5f`.
  This later commit changes Graphify output only.
- The files served live match the production build from the checkout. SHA-256
  matched all HTML pages, the worker, manifest, robots and sitemap files, JS,
  CSS, four hero images, and the icon.

## First screen before scrolling

- Job shown: write a compact original guitar exercise, inspect theory views,
  transpose it, and share it.
- Audience shown: none. Teachers, self-taught players, and music-tool builders
  are not named on the first screen.
- First action shown on desktop and phone: `Open the workbench`.
  `Try it with sample data` is not present.
- The only fully visible actions before scrolling were the home link and
  `Open the workbench` at both 1440 × 1000 and 390 × 844.

## Findings

### F1 — High — The sample is not an isolated demo and overwrites real draft data

There is no `Try it with sample data` action, persistent
`Demo — sample data, nothing is saved` label, `Reset demo`, or `Start for real`.
`/demo` returns the normal home page with the home title. `.factory/demo.md` is
missing.

In a fresh browser, I saved `@title Private real draft` in the normal editor,
then selected `Load example`. The app replaced the same
`tab-playbook:draft:v1` localStorage value with
`@title Simple gifts — opening idea`. Reloading retained the sample and the
real draft was gone. This proves the sample changes normal user data instead
of using a separate demo namespace.

Required result: provide the one-click demo, its persistent controls and label,
the direct demo URL, separate demo storage, and `.factory/demo.md`. Leaving or
resetting the demo must not modify normal draft data.

### F2 — High — Public claims have no claim inventory or tagged tests

`.factory/claims.json` is missing, and the repository has no `@claim:` tests.
There were therefore no declared claim commands to run. Sixteen distinct
public claim groups remain untested under the required sandbox contract; the
inventory is below.

Required result: list every retained claim in `.factory/claims.json`, add one
observable `@claim:<id>` test per claim, and run each listed command from the
demo entry point. Remove claims that cannot be tested.

### F3 — Medium — The first screen and page order do not meet the plain-words contract

The headline `Make the neck explain the tab` is metaphorical and does not name
the job directly. The first screen omits the audience and the required three
plain facts about privacy, offline use, and price. Its primary action opens the
workbench rather than loading sample data. The page also omits the required
three-step `How it works` section.

Decorative copy such as `TEXT IN · THEORY OUT`, `Signal map 01`, and
`Small enough to teach from` conflicts with the no-lore and no-mood-heading
rule. `.factory/copy-audit.md` is missing.

Required result: use a job-naming heading, name the audience and first action,
show three facts, add the three-step explanation, remove decorative labels,
and supply the sentence audit.

### F4 — Medium — The skip link does not skip to the editor

The first keyboard focus is a visible, high-contrast `Skip to editor` link,
but its target is `#main`. The `main` element starts at the hero, not the
editor. After Enter, focus remained on `BODY` and `scrollY` remained 0. A
keyboard user still reaches the home link and hero action before the editor.

Required result: make the link target and focus the workbench or editor while
preserving the visible focus treatment.

### F5 — Medium — Required routes and 404 behavior are absent

`/demo` is not a demo route and does not set `Demo — Tab Playbook` as its
title. An unknown path such as `/does-not-exist-review-1` returns HTTP 200 and
the home page. There is no styled 404 document or route with a way back.

The issue is not that a deliberate 404 would be an error. The defect is that
the required deliberate 404 page and HTTP status do not exist.

Required result: add the real demo route and a product-styled 404 response.

### F6 — Low — Required metadata and shared site structure are incomplete

The home, privacy, and terms pages have no canonical link, Open Graph image or
metadata, Twitter card metadata, or Apple touch icon. The header has no site
navigation. Footers omit `Built by Param Factory` and a version/build ID. The
sitemap omits the required demo route.

Required result: add the required metadata to every route, use the standard
header and footer structure, and list all real routes in the sitemap.

## Untested public claims

The count below is **16**. Existing broad unit and browser tests do not satisfy
the contract because no claim is listed and no test carries the required tag.

| ID | Public claim group | Where | Manual observation | Required claim test |
| --- | --- | --- | --- | --- |
| C01 | Markup becomes chord, fretboard, interval, and scale views | Home, README | Worked | Missing |
| C02 | Listed chord qualities and slash bass notes are supported | README | Only a subset is covered by current tests | Missing |
| C03 | Transpose changes key and chords but keeps tab frets | Home, README | Worked | Missing |
| C04 | A share link reloads the exercise | Home, README | Worked | Missing |
| C05 | Share text stays in the URL fragment and is not uploaded | Home, privacy, README | Worked; request log stayed same-origin and contained no text | Missing |
| C06 | Drafts stay in browser storage and persist | Home, privacy, README | Worked | Missing |
| C07 | Clear removes the saved exercise and Undo restores it | Privacy, home controls | Worked in the active session | Missing |
| C08 | Offline use works after the first load and edits still work | Header, privacy | Offline reload worked | Missing |
| C09 | There is no account, server database, upload, or tracking | Home, privacy | No product backend or tracking request was observed | Missing |
| C10 | There are no ads, behavioral analytics, third-party fonts, or third-party scripts | Privacy | Observed traffic was same-origin | Missing |
| C11 | The product has no audio, song catalog, or full score engraving | Home, README | Source and UI agree | Missing |
| C12 | The loaded example is public-domain material | Button feedback | Not proven by a sandbox test | Missing |
| C13 | Exercises at 8,000 characters remain shareable and larger input is rejected | Error path | 8,000 worked; 8,001 showed the size error | Missing |
| C14 | Node 20+, clean install, tests, and build produce `dist/index.html` | README | Worked with Node 22 | Missing |
| C15 | Deployment configuration supplies restrictive CSP and cache policies | README | Local tests and live headers passed | Missing |
| C16 | The footer artwork is original and generated for this product | Footer, design docs | Provenance files exist; no claim test exists | Missing |

## Main workflow and recovery evidence

- The one-click `Load example` content is realistic: four G-major bars and six
  tab strings produce chord names, Roman numerals, chord tones, and a populated
  fretboard. Its data-isolation behavior fails F1.
- A fresh D-major four-bar exercise rendered `I`, `vi⁷`, `IV`, and `V⁷`.
  Previewing +2 showed key E. Applying it changed the key and chord symbols and
  preserved every tab fret.
- The copied fragment link loaded the same exercise in another clean context.
  No exercise text appeared in a request URL.
- Invalid key `H` and chord `Nope` produced a line-level error. Share was
  blocked with a recovery instruction and focus returned to the editor.
- A valid 8,000-character exercise was shareable. A valid 8,001-character
  exercise showed `Keep exercises under 8,000 characters`.
- Clear produced the empty state and Undo restored the draft. A damaged share
  fragment showed an error while leaving the editor usable.

## Browser, accessibility, privacy, and performance evidence

- Fresh desktop 1440 × 1000 and phone 390 × 844 browsers had no console or
  page errors. The phone had no page-level horizontal overflow.
- Axe Playwright scans on the populated live desktop and phone pages reported
  zero violations. The repository suite also scans home, privacy, and terms.
- Arrow, Home, and End operate the theory tabs. The selected keyboard tab had
  a 3 px mint focus outline. Every visible target passed the existing 44 px
  checks. F4 records the separate skip-link failure.
- Reduced motion changed panel animation and transition durations to 0.01 ms.
- The live service worker controlled the page, had no waiting update, and used
  only `tab-playbook-v2`. Offline reload displayed
  `Offline · edits still work` with no console error.
- Requests during editing, sample loading, sharing, and offline setup were
  same-origin. The privacy link to `https://sociobot.in` returned HTTP 200.
- The factory URL verifier passed: HTTPS 200, title, `lang="en"`, one h1,
  main landmark, image alt, labeled buttons, and no console error.
- Lighthouse 12.8.2 mobile: Performance 100, Accessibility 100, Best Practices
  100, SEO 100; FCP 0.8 s, LCP 1.1 s, TBT 0 ms, CLS 0.
- Production JS is 12,052 bytes (4.99 KB gzip), CSS is 15,467 bytes
  (4.25 KB gzip), and the mobile AVIF is 15,300 bytes. Budgets pass.

## Clean-checkout commands

Run in a detached worktree at `b84f243c29de8522c3cdbdcec61421335886fd5f`
with Node 22.23.2:

```sh
npm ci
npm audit --audit-level=high
npm test
npx tsc --noEmit
npm run build
npm run test:e2e
```

Results: dependency install and audit passed with zero vulnerabilities; 9 of 9
unit/config tests passed; TypeScript passed; the build produced `dist/`; and
Playwright reported 12 passed and 2 intentional project skips. The repository
declares no lint command. No claim command exists because the required claims
file is absent.

## Earlier findings

All findings from `.factory/verification.md` remain repaired:

- Former sub-44 px targets: passed the current desktop and phone suite.
- Former non-immutable asset caching: live hashed assets return
  `public, max-age=31536000, immutable`.
- Former missing CSP: live responses carry the restrictive self-only policy,
  with no `unsafe-inline` and no blocked-resource console error.

`.factory/verification-2.md` reported no defects under its earlier checklist.
This review proves the current disposition of its tested paths and records the
six contract findings above.

## Not applicable

This is a static web product with no product API, authentication, tenants,
server-side state, or SQLite database. Backend tenant isolation, restart
persistence, health, and 429/`Retry-After` checks do not apply. There is no
installed CLI, library package, or desktop artifact to test.
