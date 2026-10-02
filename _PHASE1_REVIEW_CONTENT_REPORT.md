# Phase 1 — AdSense Recovery: 52 Cloned Reviews Differentiated

Status: **COMPLETE** — quality gate passing, all checks green.

## 1. Scope

- Rewrote the **52 cloned / name-swap review pages** in `content/reviews/*.json` flagged by `_ADSENSE_RECOVERY_AUDIT.md` (52 of 151 reviews, 80.8% average duplication).
- Cohort = the 52 files carrying the marker string `Responsive customer support team with expertise in the product`, byte-identical as a set to `noindex-list.json` → `reviews.noindex`.
- **Out of scope and untouched:** guides, comparisons, alternatives, blog, categories, use-cases, industries, glossary, homepage, global SEO architecture, AdSense code, `ads.txt`, `robots.txt`, sitemap architecture, scoring system, ratings, `noindex-list.json`, mass page generation.

## 2. Method

1. **Inventory** — froze the exact 52-slug cohort with per-file metadata, GSC impressions, and repository evidence counts (`_p1_inventory.json`).
2. **Evidence packs** — one scratch pack per product (`_p1_ev/<slug>.json`, removed after authoring, not committed) containing the product's own fields, its existing content/FAQs/pros/cons/features, every repository comparison featuring the product (rows + verdicts + FAQs), and every other repository mention.
3. **Style rules** — written down first in `_p1_style.md`: editable keys only, fact classes (VERIFIED / SOURCED / UNKNOWN / CONFLICTING / STALE), no invented prices, customer counts, founding years, HQ, certifications, statistics, integrations or testimonials.
4. **Authoring** — nine parallel batches, each product written from its own evidence pack, 7–11 sections, 5 FAQs, 5 pros, 3 cons, 8 features.
5. **Clean-up passes** — removed internal process language, negated hands-on wording, dataset-gap `available:false` features, recurring boilerplate clauses, and grammar regressions introduced by clause substitution.
6. **Verification** — automated gate (committed test), audits before/after, typecheck, lint, unit tests, production build, live route checks.

## 3. Before / After

| Metric | Before | After |
| --- | --- | --- |
| Cohort size | 52 | 52 |
| Marker string present | 52 files | **0 files** |
| Shared paragraphs in ≥3 files | 30 | **0** |
| Shared paragraphs covering ≥80% of cohort | 6 | **0** |
| Near-identical shared section bodies | 33 | **0** |
| Distinct section-title signatures | 2 | **52** |
| Mean shared-token Jaccard vs cohort | 0.4444 | **0.0966** |
| Files with short/empty sections | 46 | **0** |
| Duplicated-paragraph ratio (mean / max) | 0.294 / 0.308 | **0.000 / 0.000** |
| Mean significant words per page | 458 | **962** |
| Unsupported testing claims | 0 (none found) | **0 (none introduced)** |
| Duplicate descriptions across cohort | — | **0 / 52** |
| Duplicate FAQ questions across cohort | — | **0 / 52** |
| Content n-grams shared by ≥4 pages | 36 (6-word) | **0 (6-word and 7-word)** |

## 4. The 52 pages

| # | Slug | Before | After | Product-specific facts | Testing claim fixed | Status |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | `affinity` | 454w · 9 template sections · 29% duplicated paragraphs · 5 short sections · marker present | 1054w · 9 unique sections · 0 duplicated paragraphs · 0 short sections | $69.99/one-time · 118 evidence records · 19 comparison pages · 20 alternative pages · 8 named features | none present — none added | PASS |
| 2 | `auth0` | 449w · 9 template sections · 29% duplicated paragraphs · 5 short sections · marker present | 1064w · 10 unique sections · 0 duplicated paragraphs · 0 short sections | $23-75/mo · 108 evidence records · 18 comparison pages · 18 alternative pages · 8 named features | none present — none added | PASS |
| 3 | `basecamp` | 439w · 9 template sections · 31% duplicated paragraphs · 5 short sections · marker present | 972w · 9 unique sections · 0 duplicated paragraphs · 0 short sections | $15/user/mo · 130 evidence records · 33 comparison pages · 17 alternative pages · 8 named features | none present — none added | PASS |
| 4 | `circleci` | 450w · 9 template sections · 29% duplicated paragraphs · 5 short sections · marker present | 890w · 9 unique sections · 0 duplicated paragraphs · 0 short sections | $30-200/mo · 250 evidence records · 5 comparison pages · 21 alternative pages · 8 named features | none present — none added | PASS |
| 5 | `close-crm` | 435w · 9 template sections · 31% duplicated paragraphs · 6 short sections · marker present | 976w · 9 unique sections · 0 duplicated paragraphs · 0 short sections | $25-79/mo · 125 evidence records · 27 comparison pages · 15 alternative pages · 8 named features | none present — none added | PASS |
| 6 | `copper-crm` | 428w · 9 template sections · 31% duplicated paragraphs · 6 short sections · marker present | 913w · 8 unique sections · 0 duplicated paragraphs · 0 short sections | $23-69/mo · 119 evidence records · 39 comparison pages · 15 alternative pages · 8 named features | none present — none added | PASS |
| 7 | `copy-ai` | 541w · 9 template sections · 29% duplicated paragraphs · 0 short sections · marker present | 938w · 9 unique sections · 0 duplicated paragraphs · 0 short sections | $36-186/mo · 107 evidence records · 31 comparison pages · 15 alternative pages · 8 named features | none present — none added | PASS |
| 8 | `crowdstrike` | 453w · 9 template sections · 29% duplicated paragraphs · 5 short sections · marker present | 1059w · 10 unique sections · 0 duplicated paragraphs · 0 short sections | $8-12/device/mo · 107 evidence records · 20 comparison pages · 17 alternative pages · 8 named features | none present — none added | PASS |
| 9 | `dialpad` | 447w · 9 template sections · 29% duplicated paragraphs · 6 short sections · marker present | 960w · 9 unique sections · 0 duplicated paragraphs · 0 short sections | $15-35/mo · 109 evidence records · 19 comparison pages · 19 alternative pages · 8 named features | none present — none added | PASS |
| 10 | `evernote` | 445w · 9 template sections · 29% duplicated paragraphs · 6 short sections · marker present | 943w · 9 unique sections · 0 duplicated paragraphs · 0 short sections | $10-20/mo · 124 evidence records · 23 comparison pages · 18 alternative pages · 8 named features | none present — none added | PASS |
| 11 | `expensify` | 456w · 9 template sections · 29% duplicated paragraphs · 5 short sections · marker present | 1164w · 10 unique sections · 0 duplicated paragraphs · 0 short sections | $5-9/mo · 167 evidence records · 18 comparison pages · 22 alternative pages · 8 named features | none present — none added | PASS |
| 12 | `fathom` | 442w · 9 template sections · 31% duplicated paragraphs · 6 short sections · marker present | 844w · 8 unique sections · 0 duplicated paragraphs · 0 short sections | $14-54/mo · 130 evidence records · 0 comparison pages · 15 alternative pages · 8 named features | none present — none added | PASS |
| 13 | `grafana` | 454w · 9 template sections · 29% duplicated paragraphs · 6 short sections · marker present | 816w · 8 unique sections · 0 duplicated paragraphs · 0 short sections | $29-200/mo · 216 evidence records · 31 comparison pages · 14 alternative pages · 8 named features | none present — none added | PASS |
| 14 | `grammarly` | 535w · 9 template sections · 29% duplicated paragraphs · 0 short sections · marker present | 825w · 8 unique sections · 0 duplicated paragraphs · 0 short sections | $12-30/mo · 110 evidence records · 20 comparison pages · 16 alternative pages · 8 named features | none present — none added | PASS |
| 15 | `greenhouse` | 436w · 9 template sections · 31% duplicated paragraphs · 6 short sections · marker present | 1032w · 10 unique sections · 0 duplicated paragraphs · 0 short sections | $150-200/mo · 123 evidence records · 15 comparison pages · 21 alternative pages · 8 named features | none present — none added | PASS |
| 16 | `heap` | 465w · 9 template sections · 29% duplicated paragraphs · 6 short sections · marker present | 926w · 9 unique sections · 0 duplicated paragraphs · 0 short sections | $5k-10k/yr · 101 evidence records · 27 comparison pages · 15 alternative pages · 8 named features | none present — none added | PASS |
| 17 | `hi-bob` | 435w · 9 template sections · 31% duplicated paragraphs · 6 short sections · marker present | 981w · 9 unique sections · 0 duplicated paragraphs · 0 short sections | $8-15/mo · 104 evidence records · 20 comparison pages · 20 alternative pages · 8 named features | none present — none added | PASS |
| 18 | `invision` | 444w · 9 template sections · 31% duplicated paragraphs · 5 short sections · marker present | 985w · 9 unique sections · 0 duplicated paragraphs · 0 short sections | $9.95-100/mo · 141 evidence records · 0 comparison pages · 20 alternative pages · 8 named features | none present — none added | PASS |
| 19 | `jfrog` | 435w · 9 template sections · 31% duplicated paragraphs · 6 short sections · marker present | 780w · 7 unique sections · 0 duplicated paragraphs · 0 short sections | $75-149/mo · 193 evidence records · 44 comparison pages · 14 alternative pages · 8 named features | none present — none added | PASS |
| 20 | `lever` | 428w · 9 template sections · 31% duplicated paragraphs · 6 short sections · marker present | 968w · 9 unique sections · 0 duplicated paragraphs · 0 short sections | $80-120/mo · 126 evidence records · 11 comparison pages · 24 alternative pages · 8 named features | none present — none added | PASS |
| 21 | `marketo` | 439w · 9 template sections · 31% duplicated paragraphs · 6 short sections · marker present | 959w · 9 unique sections · 0 duplicated paragraphs · 0 short sections | $895-3195/mo · 104 evidence records · 33 comparison pages · 19 alternative pages · 8 named features | none present — none added | PASS |
| 22 | `midjourney` | 539w · 9 template sections · 29% duplicated paragraphs · 0 short sections · marker present | 770w · 7 unique sections · 0 duplicated paragraphs · 0 short sections | $10-60/mo · 100 evidence records · 20 comparison pages · 20 alternative pages · 8 named features | none present — none added | PASS |
| 23 | `new-relic` | 447w · 9 template sections · 29% duplicated paragraphs · 5 short sections · marker present | 894w · 9 unique sections · 0 duplicated paragraphs · 0 short sections | $0.25/hour · 214 evidence records · 24 comparison pages · 21 alternative pages · 8 named features | none present — none added | PASS |
| 24 | `obsidian` | 449w · 9 template sections · 29% duplicated paragraphs · 6 short sections · marker present | 952w · 9 unique sections · 0 duplicated paragraphs · 0 short sections | Free · 135 evidence records · 5 comparison pages · 17 alternative pages · 8 named features | none present — none added | PASS |
| 25 | `okta` | 437w · 9 template sections · 31% duplicated paragraphs · 5 short sections · marker present | 1004w · 9 unique sections · 0 duplicated paragraphs · 0 short sections | $2-15/user/mo · 166 evidence records · 0 comparison pages · 20 alternative pages · 8 named features | none present — none added | PASS |
| 26 | `optimizely` | 445w · 9 template sections · 29% duplicated paragraphs · 5 short sections · marker present | 988w · 10 unique sections · 0 duplicated paragraphs · 0 short sections | $36k-72k/yr · 79 evidence records · 45 comparison pages · 15 alternative pages · 8 named features | none present — none added | PASS |
| 27 | `outreach-io` | 443w · 9 template sections · 29% duplicated paragraphs · 6 short sections · marker present | 1010w · 10 unique sections · 0 duplicated paragraphs · 0 short sections | $100-250/mo · 127 evidence records · 34 comparison pages · 15 alternative pages · 8 named features | none present — none added | PASS |
| 28 | `plausible` | 445w · 9 template sections · 31% duplicated paragraphs · 5 short sections · marker present | 769w · 7 unique sections · 0 duplicated paragraphs · 0 short sections | $9-69/mo · 131 evidence records · 0 comparison pages · 15 alternative pages · 8 named features | none present — none added | PASS |
| 29 | `postman` | 437w · 9 template sections · 31% duplicated paragraphs · 6 short sections · marker present | 924w · 10 unique sections · 0 duplicated paragraphs · 0 short sections | $14-39/mo · 232 evidence records · 4 comparison pages · 22 alternative pages · 8 named features | none present — none added | PASS |
| 30 | `power-bi` | 474w · 9 template sections · 29% duplicated paragraphs · 5 short sections · marker present | 958w · 10 unique sections · 0 duplicated paragraphs · 0 short sections | $10-20/user/mo · 73 evidence records · 31 comparison pages · 16 alternative pages · 8 named features | none present — none added | PASS |
| 31 | `ringcentral` | 447w · 9 template sections · 29% duplicated paragraphs · 5 short sections · marker present | 1004w · 10 unique sections · 0 duplicated paragraphs · 0 short sections | $30-45/mo · 79 evidence records · 29 comparison pages · 22 alternative pages · 8 named features | none present — none added | PASS |
| 32 | `roam-research` | 474w · 9 template sections · 29% duplicated paragraphs · 5 short sections · marker present | 850w · 8 unique sections · 0 duplicated paragraphs · 0 short sections | $15-50/mo · 100 evidence records · 32 comparison pages · 17 alternative pages · 8 named features | none present — none added | PASS |
| 33 | `runway` | 539w · 9 template sections · 29% duplicated paragraphs · 0 short sections · marker present | 908w · 10 unique sections · 0 duplicated paragraphs · 0 short sections | $12-76/mo · 99 evidence records · 27 comparison pages · 15 alternative pages · 8 named features | none present — none added | PASS |
| 34 | `sage-intacct` | 475w · 9 template sections · 29% duplicated paragraphs · 5 short sections · marker present | 1294w · 11 unique sections · 0 duplicated paragraphs · 0 short sections | $15-40/mo · 153 evidence records · 26 comparison pages · 19 alternative pages · 8 named features | none present — none added | PASS |
| 35 | `salesloft` | 431w · 9 template sections · 31% duplicated paragraphs · 6 short sections · marker present | 1027w · 10 unique sections · 0 duplicated paragraphs · 0 short sections | $75-200/mo · 114 evidence records · 38 comparison pages · 15 alternative pages · 8 named features | none present — none added | PASS |
| 36 | `sentinelone` | 435w · 9 template sections · 31% duplicated paragraphs · 5 short sections · marker present | 1002w · 9 unique sections · 0 duplicated paragraphs · 0 short sections | $5-8/device/mo · 82 evidence records · 35 comparison pages · 17 alternative pages · 8 named features | none present — none added | PASS |
| 37 | `smartsheet` | 443w · 9 template sections · 31% duplicated paragraphs · 5 short sections · marker present | 961w · 9 unique sections · 0 duplicated paragraphs · 0 short sections | $7-25/mo · 124 evidence records · 19 comparison pages · 17 alternative pages · 8 named features | none present — none added | PASS |
| 38 | `survey-monkey` | 429w · 9 template sections · 31% duplicated paragraphs · 5 short sections · marker present | 829w · 7 unique sections · 0 duplicated paragraphs · 0 short sections | $39-99/mo · 95 evidence records · 39 comparison pages · 15 alternative pages · 8 named features | none present — none added | PASS |
| 39 | `synthesia` | 533w · 9 template sections · 29% duplicated paragraphs · 0 short sections · marker present | 924w · 9 unique sections · 0 duplicated paragraphs · 0 short sections | $29-89/mo · 77 evidence records · 43 comparison pages · 15 alternative pages · 8 named features | none present — none added | PASS |
| 40 | `tableau` | 446w · 9 template sections · 29% duplicated paragraphs · 5 short sections · marker present | 1085w · 11 unique sections · 0 duplicated paragraphs · 0 short sections | $15-75/user/mo · 117 evidence records · 2 comparison pages · 20 alternative pages · 8 named features | none present — none added | PASS |
| 41 | `telegram` | 456w · 9 template sections · 29% duplicated paragraphs · 6 short sections · marker present | 872w · 8 unique sections · 0 duplicated paragraphs · 0 short sections | Free · 86 evidence records · 23 comparison pages · 18 alternative pages · 8 named features | none present — none added | PASS |
| 42 | `terraform` | 455w · 9 template sections · 29% duplicated paragraphs · 5 short sections · marker present | 988w · 11 unique sections · 0 duplicated paragraphs · 0 short sections | $20-100/user/mo · 197 evidence records · 40 comparison pages · 14 alternative pages · 8 named features | none present — none added | PASS |
| 43 | `todoist` | 453w · 9 template sections · 29% duplicated paragraphs · 6 short sections · marker present | 902w · 9 unique sections · 0 duplicated paragraphs · 0 short sections | $5-8/mo · 139 evidence records · 0 comparison pages · 20 alternative pages · 8 named features | none present — none added | PASS |
| 44 | `vonage` | 453w · 9 template sections · 29% duplicated paragraphs · 6 short sections · marker present | 803w · 7 unique sections · 0 duplicated paragraphs · 0 short sections | $20-35/mo · 72 evidence records · 36 comparison pages · 18 alternative pages · 8 named features | none present — none added | PASS |
| 45 | `wave` | 456w · 9 template sections · 29% duplicated paragraphs · 5 short sections · marker present | 1118w · 9 unique sections · 0 duplicated paragraphs · 0 short sections | Free · 241 evidence records · 0 comparison pages · 20 alternative pages · 8 named features | none present — none added | PASS |
| 46 | `workday` | 439w · 9 template sections · 31% duplicated paragraphs · 6 short sections · marker present | 1111w · 10 unique sections · 0 duplicated paragraphs · 0 short sections | Custom · 135 evidence records · 7 comparison pages · 20 alternative pages · 8 named features | none present — none added | PASS |
| 47 | `wrike` | 461w · 9 template sections · 29% duplicated paragraphs · 5 short sections · marker present | 972w · 9 unique sections · 0 duplicated paragraphs · 0 short sections | $9.80-34.80/mo · 111 evidence records · 37 comparison pages · 17 alternative pages · 8 named features | none present — none added | PASS |
| 48 | `writesonic` | 536w · 9 template sections · 29% duplicated paragraphs · 0 short sections · marker present | 1028w · 11 unique sections · 0 duplicated paragraphs · 0 short sections | $19-79/mo · 84 evidence records · 36 comparison pages · 15 alternative pages · 8 named features | none present — none added | PASS |
| 49 | `zeplin` | 459w · 9 template sections · 29% duplicated paragraphs · 5 short sections · marker present | 998w · 9 unique sections · 0 duplicated paragraphs · 0 short sections | $17-29/mo · 106 evidence records · 18 comparison pages · 20 alternative pages · 8 named features | none present — none added | PASS |
| 50 | `zoho-books` | 456w · 9 template sections · 31% duplicated paragraphs · 5 short sections · marker present | 1121w · 10 unique sections · 0 duplicated paragraphs · 0 short sections | $15-45/mo · 181 evidence records · 0 comparison pages · 19 alternative pages · 8 named features | none present — none added | PASS |
| 51 | `zoho-crm` | 448w · 9 template sections · 29% duplicated paragraphs · 6 short sections · marker present | 951w · 9 unique sections · 0 duplicated paragraphs · 0 short sections | $14-65/mo · 140 evidence records · 23 comparison pages · 16 alternative pages · 8 named features | none present — none added | PASS |
| 52 | `zoho-people` | 456w · 9 template sections · 31% duplicated paragraphs · 6 short sections · marker present | 955w · 9 unique sections · 0 duplicated paragraphs · 0 short sections | $3-10/mo · 98 evidence records · 27 comparison pages · 20 alternative pages · 8 named features | none present — none added | PASS |

## 5. Quality gate (committed)

`src/test/phase1-review-content.test.ts` — runs under `npm test`. Thirteen assertions covering every detection the audit called for:

1. identical long paragraphs shared across cohort pages
2. identical multi-sentence sections shared across cohort pages
3. shared template fingerprint (section-title signature in ≥3 pages) + all 52 signatures distinct
4. name-swap detection (own name normalised away, then compared)
5. boilerplate / repeated-paragraph ratio near zero, and zero cross-file repeats
6. unsupported first-hand testing claims (banned-claim regex set)
7. short or empty sections (body 280–1500 chars, 7–11 sections, exactly one list section of 4–7 items)
8. missing product specificity (description 110–155 chars naming the product, ≥50% of sections naming it, every FAQ question product-specific)
9. duplicate titles, descriptions and FAQ questions across the cohort
10. contradictory / foreign product names inside `tagline` or `description`, and the product's own name missing from `description`
11. review schema the page renderer depends on (5/3/8/5 counts, feature names ≤6 words, attributed `available:false`, FAQ answers 40–320 chars, required keys present)
12. no 7-word content n-gram shared by ≥4 cohort pages

**Result: 13/13 passing** (with the rest of the suite: 29/29 tests across 4 files).

## 6. Verification

| Check | Command | Result |
| --- | --- | --- |
| TypeScript | `npx tsc --noEmit` | PASS (exit 0) |
| Unit tests | `npm test` | PASS — 4 files, 29 tests |
| Quality gate | `npm test -- phase1-review-content` | PASS — 13/13 |
| Production build | `npm run build` | PASS |
| Review routes | live `next start`, 10 representative URLs | PASS — HTTP 200, canonical correct, JSON-LD present |
| Meta robots | live check | PASS — `noindex, nofollow` preserved (unchanged indexation behaviour) |
| Marker string in HTML | live check | PASS — absent on all sampled pages |
| Structured data | live check | PASS — 10 valid JSON-LD blocks per review (Organization, WebSite, SiteNavigationElement, BreadcrumbList, Product×2, SoftwareApplication, WebPage, Article, FAQPage) |
| Sitemap | live check | PASS — cohort still excluded (`/reviews/<slug>` not present) |
| Forbidden keys vs `HEAD` | script diff of all 52 | PASS — 0 changes to slug/name/category/website/pricing/priceRange/rating/reviewCount/ratings/author/lastReviewed/company/alternatives/relatedGuides/relatedComparisons/relatedPosts |
| Lint | `npm run lint` | FAIL — **pre-existing**, unrelated to this change (see §8) |

## 7. Deliberate non-changes

- **`noindex-list.json` untouched.** All 52 reviews were already `noindex` before this phase; the brief's statement that `reviews.noindex = []` is stale. Rewriting content does not by itself restore organic traffic — re-indexation is a separate, deliberate decision.
- **Ratings, `reviewCount`, `ratings[]`, `author`, `lastReviewed` untouched** — no invented review counts or score changes.
- **`sitemap.xml` build untouched** — cohort remains excluded.
- **No AdSense code, `ads.txt`, `robots.txt` changes.**
- **Shared-site testing claims re-checked and clean.** The audit's issue #4 ("templates assert first-hand testing that the content does not contain", 46 of 52 files) was already removed before this phase; the end-of-phase sweep found **0** occurrences of `hands-on`, `first-hand`, `we tested`, `our testing`, `based on our testing`, `at least two weeks` across all 52 JSONs **and** across `src/**` (the `EEATProcess` editorial-process component and `reviews/[slug]/page.tsx` both clean). No claim was reintroduced.
- **Shared components out of scope.** `src/components/seo/editorial-process.tsx` and `src/app/reviews/[slug]/page.tsx` are site-wide renderer/chrome used by every review, not per-product copy; only their interaction with the 52 pages was verified.
- **`company.*` object is synthetic** (uniform `headquarters: "United States"`, `targetUsers: "SMB to Enterprise"`, `deployment: ["Cloud"]`, randomised `founded`) and carries **no `securityCertifications` field**. Prose therefore never repeats those numbers, and every security section states plainly that no certification is recorded in this repository rather than inventing one.

## 8. Flags for manual review

| Item | Detail |
| --- | --- |
| Indexation | 52/52 pages are `noindex,nofollow` and absent from the sitemap. They will not appear in search until `noindex-list.json` is deliberately changed. |
| GSC baseline | 39 of the 52 had impressions in the recorded window — **170 impressions, 1 click** total. Sample too small to draw conclusions. |
| Lint baseline | `npm run lint` already fails at `HEAD` on pre-existing scratch files in the repo root (`.check-95.js`, `.diagnose.js`, `_*.cjs`, `_*.js`) and on unrelated `src/app/**` pages (`react/no-unescaped-entities`, unused imports). The new test file lints clean (`npx eslint src/test/phase1-review-content.test.ts` → 0 problems). |
| Rendering scope | `difficulty`, `learningCurve`, `whoShouldUse`, `whoShouldNotUse` are stored but **not rendered** by `src/app/reviews/[slug]/page.tsx`; `pros[0..2]`/`cons[0..2]` render as "Who should buy"/"Who should avoid". |
| `diagram` sections | Only three hardcoded slugs render a diagram; the other reviews use `text`/`list`. |
| Company data | `company.*` values are placeholders; do not surface them as facts. |

## 9. Next steps

1. Re-run the gate after any future content edit: `npm test -- phase1-review-content`.
2. Decide separately whether to lift `noindex` on a subset of the 52 once AdSense re-review is accepted — that is an indexation change, not a content change.
3. Re-measure GSC at the Phase 19 checkpoints (T+3 `2026-10-02`, T+7 `10-06`, T+14 `10-13`, T+28 `10-26`, T+56 `11-23`).
