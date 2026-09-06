# Tab Playbook review handoff

Work order: `tab-markup-playground-review-1`

Reviewed: 2026-09-06

Live URL: <https://tab-markup-playground.sociobot.in>

Implementation: `12c4005d1372de54fb4952ef5406576c9cbbde1b`

Documentation baseline: `7f0725431951260bf29fd2945e0c99a0644d5138`

Checkout: `b84f243c29de8522c3cdbdcec61421335886fd5f`

## Result

**FAIL — 6 findings and 16 untested public claims.**

The core editor works and the live files match the reviewed build. The release
does not meet the current demo, claim, first-screen, skip-link, routing, and
site-metadata contracts. See `.factory/review-1.md` for full evidence.

## Verification completed

```sh
npm ci
npm audit --audit-level=high
npm test
npx tsc --noEmit
npm run build
npm run test:e2e
```

The clean checkout passed 9 unit/config tests and 12 browser runs with 2
intentional skips. The build produced `dist/`. Live desktop and phone checks
covered sample loading, realistic populated output, normal author/transpose/
share behavior, invalid input, 8,000/8,001-character boundaries, clear/undo,
damaged-link recovery, keyboard and focus, reduced motion, Axe, offline/update,
privacy traffic, links, route titles, legal pages, and unknown routes.

Lighthouse mobile scored 100 for performance, accessibility, best practices,
and SEO. LCP was 1.1 s, TBT 0 ms, and CLS 0. The current live assets match the
local production build by SHA-256.

## Work left

1. Add an isolated one-click demo with its required label, reset, exit, route,
   storage namespace, and `.factory/demo.md`.
2. Add `.factory/claims.json` and one tagged sandbox test for every retained
   public claim.
3. Rewrite and complete the first screen and landing-page order, then add
   `.factory/copy-audit.md`.
4. Repair the skip link, demo route, designed 404, route metadata, header,
   footer, and sitemap.

No product code was modified during this review.
