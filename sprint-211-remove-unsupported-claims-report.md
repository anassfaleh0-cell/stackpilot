# Sprint 21.1 — Remove Unsupported Homepage Claims: Final Report

> **Scope:** Remove every unsupported numerical social-proof claim on PilotStack, preserving SEO structure, JSON-LD, sitemap, and the real flagship benchmark data. **No commit/push — awaiting approval.**

---

## 1. Every Fabricated Claim Found

| # | Claim | File | Component |
|---|-------|------|-----------|
| 1 | `"35K+ Monthly Readers"` | `src/app/page.tsx:31` | Homepage Trust Stats block (stats array) |
| 2 | `"98% Reader Satisfaction"` | `src/app/page.tsx:32` | Homepage Trust Stats block (stats array) |
| 3 | `"Join 35,000+ professionals who rely on PilotStack…"` | `src/app/page.tsx:440` | Homepage Newsletter section |

**Repository-wide sweep results:**
- `src/`, `public/`, `content/`, JSON, MD/TXT: no other occurrences of "35K+ Monthly Readers", "35,000+ professionals", "98% Reader Satisfaction", "Monthly Readers", "Reader Satisfaction", or "Join 35,000".
- Only non-site matches: the internal sprint docs (`growth/21-ai-seo-protection.md`, `sprint-21-authority-recovery-report.md`) that flagged these claims as the issue — documentation of the audit trail, not site content.
- The only remaining `35K` string in code is `editorial-pricing-ladder.tsx:215` — "1 brand voice, 35K words", a **Jasper plan-feature spec** in the pre-existing editorial pricing-ladder widget (third-party product data, not a PilotStack claim; untouched).
- No "trusted by", "used by leading", "100K+ users", "50K+ readers", "thousands of readers", or similar patterns anywhere in `src/`.
- `content/statistics/*` figures ("$94B+ market", "1201+ organizations") are pre-existing market-stat content pages with declared (if generic) sources — not PilotStack social proof; out of scope, untouched.

## 2. File + Component Where Found

All three claims were in **`src/app/page.tsx`**:
- Trust Stats section (`<section>{"Trust Stats"}` at line 75-87) — 4-tile grid rendering the `stats` array (lines 28-33).
- Newsletter section (`<Section id="newsletter">` at line ~433) — paragraph under the heading.

## 3. Replacement Text

Fabricated audience claims replaced with **verifiable, computed registry counts** (same design: 4-tile grid, no layout change):

| Before | After | Evidence |
|--------|-------|----------|
| `35K+ Monthly Readers` | `${comparisons.length}+` → **"Expert Comparisons"** | 616 live comparisons (registry filters `published !== false`; verified 616 = sprint-20 audit figure) |
| `98% Reader Satisfaction` | `${allResearch.length}+` → **"Research Reports"** | 32 research reports in `content/research/` |
| (2 real stats kept) | "Software Reviews" = **151+** · "Expert Guides" = **100+** | Files in `content/reviews/`, `content/guides/` |

Newsletter line:
- **Before:** "Join 35,000+ professionals who rely on PilotStack for software buying decisions. No spam, unsubscribe anytime."
- **After:** "Independent research and hands-on software reviews, straight to your inbox. No spam, unsubscribe anytime."

No invented numbers introduced anywhere — every displayed figure is computed from the live content registry at render time.

## 4. Number of Unsupported Claims Removed

**3** (two stat tiles + one newsletter sentence).

## 5. Structured-Data Changes

**None required / none made.**
- Homepage JSON-LD audit: only `BreadcrumbSchema` (plus `Organization`/`WebSite` from layout) — no aggregateRating, reviewCount, interactionStatistic, or audience-size nodes anywhere; nothing fabricated was in structured data.
- `json-ld.tsx` aggregateRating path (`aggregateRatingNode`) is guarded (`ratingValue`/`reviewCount` must be finite numbers from review corpus data, not hardcoded) — review-page ratings come from per-tool review JSON fields, not invented.
- Flagship benchmark data **untouched** (per §7 of the brief): 133 parseable reviews, $19.99 median remain sourced from `scripts/compute-pricing-benchmark.js`; `growth/21-pricing-benchmark-data.json` unchanged; methodology preserved.

## 6. Build Status

✅ `next build` — **EXIT 0**, all 1,682 static pages generated.
- Built homepage HTML verified: `35K`/`35,000`/`98%`/`Monthly Readers`/`Join 35` all **absent**; new stats present (`151+`, `616+`, "Expert Comparisons", "Research Reports").
- Sitemap verified: flagship + all research entries intact.
- Research index page verified: flagship still listed.
- Homepage section count unchanged (Trust Stats tile grid still 4 tiles — no layout regression).

## 7. TypeScript Status

✅ `npx tsc --noEmit` — **EXIT 0**.

## 8. Lint Status

- ✅ ESLint on `src/app/page.tsx` — **EXIT 0**.
- ✅ `npm run lint:content` — only the same 12 pre-existing blog-file pricing warnings (untouched, pre-dating this sprint).

## 9. SEO/Schema Status

✅ All preserved and re-verified in build artifacts:
- Homepage `BreadcrumbList` ✓, `Organization` ✓
- Flagship `FAQPage` JSON-LD ✓, report schema ✓
- Sitemap ✓ (flagship + research entries), robots.txt ✓, canonical/metadata untouched, no duplicate metadata introduced

## 10. Files Modified

| File | Change |
|------|--------|
| `src/app/page.tsx` | Trust Stats: removed 2 fabricated tiles, replaced with computed `comparisons.length` + `allResearch.length`; newsletter copy replaced; `getAllResearch` import added |

**Status: NOT committed, NOT pushed — awaiting approval.**
