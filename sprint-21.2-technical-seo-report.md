# Sprint 21.2 — Complete Technical SEO Investigation & Fix Report

**Date:** 2026-08-08 · **Branch:** master · **Working tree:** fixes implemented + fully validated, **NOT committed/pushed** (awaiting approval)

---

## 1. ROOT CAUSES FOUND

| # | Root cause | Evidence | Impact |
|---|---|---|---|
| A | Global title template `%s | PilotStack` appended 13 chars to every title | 483 built pages had `<title>` 61–73 chars | Ahrefs "96 titles too long" (real count: 483) |
| B | `/best/*` template passed short formulaic descriptions (38–69 chars) straight to meta | 86 `/best/*` + 2 `/tools/*` pages <70 chars | Ahrefs "129 short meta descriptions" (real: 89) |
| C | Same aggregateRating emitted 3× per product (ProductSchema + ReviewSchema + SoftwareSchema; ItemList `softwareApp` nodes on comparison pages) | 1,383 duplicate-rating instances across 767 pages | Ahrefs 1,041 rich-results + 182 schema.org errors |
| D | `/comparisons` rendered all 616 cards server-side; `/category/*` passed full review objects (incl. content sections) as props to a client component | `/comparisons` 2,573KB; `/category/developer-tools` 2,121KB | Ahrefs "2 pages >2MB"; slow pages |
| E | Sitemap contained `/search` (noindexed) and `/dashboard` (robots-blocked) | sitemap.ts static entries; robots.ts disallow | GSC "1 blocked by robots"; Ahrefs "sitemap 1×noindex" |
| F | `/team` indexable but absent from sitemap + near-orphan (1 internal link) | live sitemap lacks /team; link graph = 1 linker | Ahrefs "1 indexable page not in sitemap"; contributes to discovered-not-indexed |
| G | 72 glossary terms render <300 words (avg glossary page 348 words) | built-HTML word counts | Thin content; likely indexed slowly |
| H | 891 discovered-not-indexed: no technical blocker (see §5) — young site + ~1,600 URLs generated in bulk sprints + thin subset + (previously) 4 near-orphans | all 891-class URLs: 200, self-canonical, robots allow, in sitemap | Normal crawl/index backlog, not an error |
| I | 404s: no deleted app routes in git history; one real slug rename `calndly → calendly`; remainder = legacy/removed content not enumerable without GSC export | git log —diff-filter=D/R | GSC "35×404" (see §6) |
| J | Trailing-slash 308 normalization (`/blog/`, `/research/`, `/statistics/`) | production HEAD checks | GSC "3 redirect"; Ahrefs "4×3XX" — **benign, standard Next/Vercel behavior, sitemap uses non-slash URLs** |
| K | "27 noindex": only `/search` emits noindex in code (intentional). Rest are stale GSC entries from removed pages | grep noIndex = 1 occurrence; crawl = 0 noindex in sitemap | No action needed |
| L | "1,664 missing alt": current build has 0 `<img>` without alt (3 decorative imgs all have `alt=""` + `aria-hidden`) | built-HTML audit | Stale Ahrefs crawl data |
| M | IndexNow: key file public + 200, `submitUrl` on revalidate | production check | Functional; no action |

## 2. FILES CHANGED (all local, uncommitted)

| File | Change |
|---|---|
| `src/app/layout.tsx` | title template `%s | PilotStack` → `%s` |
| `src/app/sitemap.ts` | removed `/search`, `/dashboard`; **added `/team`** |
| `src/app/sitemap-html/page.tsx` | removed Dashboard link |
| `src/app/best/[slug]/page.tsx` | meta description enrichment when <120 chars |
| `src/app/tools/[slug]/page.tsx` | 2 longer descriptions |
| `src/app/reviews/[slug]/page.tsx` | schema dedup; author name now links to `/authors/pilotstack-team` |
| `src/app/comparisons/[slug]/page.tsx` | schema dedup (ReviewSchema, softwareApp nodes) |
| `src/app/comparisons/page.tsx` | ComparisonGrid integration |
| `src/app/category/[slug]/page.tsx` | ReviewFilter minimal field projections |
| `src/components/seo/json-ld.tsx` | ReviewSchema drops aggregateRating/reviewCount |
| `src/components/entity/comparison-grid.tsx` | **new** client grid: 96 SSR cards + "Show more" |
| `src/components/layout/footer.tsx` | added "Our Team" link (Company column) |
| `src/lib/metadata.ts` | title cap 60 → 58 (ellipsis/entity headroom) |

Debug-only untracked artifacts (never staged): `_audit-*.cjs`, `_seo21-*.json`, `_probe-*`, `_diag-*`, screenshots, logs.

## 3. EXACT CHANGES PROPOSED

1. **Titles (483→28):** layout template → `%s`; `createMetadata` cap 58. Remaining 28 are `&amp;` raw-length artifacts — **decoded titles are ≤60 chars (verified)**, left untouched per "don't optimize character counts blindly".
2. **Descriptions (89→1):** `/best/*` composes `${desc} We ranked the top options with detailed pros and cons, pricing, and the best alternatives to help you choose.` when <120 chars; 2 `/tools/*` descriptions lengthened. Remaining 1 = `/search` (noindexed).
3. **Schema (1,383 duplicates→0):** aggregateRating now emitted **once per product per page** — review pages: ProductSchema; comparison pages: SoftwareSchema. ReviewSchema emits Product+Review (no rating). Ratings are real content data (`tool.rating`/`reviewCount` from JSON — not invented).
4. **Size (2→0):** `/comparisons` = client `ComparisonGrid` (96 SSR cards, progressive "Show more", compact props); `/category/*` = ReviewFilter props projected to `{slug,name,tagline,category,rating,priceRange,pricing}`.
5. **Sitemap:** removed `/search` + `/dashboard`; added `/team` (indexable, was missing). 1,670 URLs total.
6. **Internal linking:** `/team` in footer; author name linked from all 151 review pages; `/authors/pilotstack-team` 1→152 links, `/team` 1→2+ links.

## 4. BEFORE → AFTER

| Metric | Before | After (built & verified) |
|---|---|---|
| Titles >60 chars | 483 | 28 (entity artifacts, decoded ≤60) |
| Descriptions <70 | 89 | 1 (`/search`, noindexed) |
| Pages >2MB | 2 | 0 |
| Duplicate aggregateRating instances | 1,383 | 0 |
| Sitemap URLs | 1,669 (incl. /search, /dashboard) | 1,670 (pollution removed, /team added) |
| Sitemap URL integrity (200/canonical/robots) | — | 1,670/1,670 pass |
| Near-orphan indexable pages | 4 (/team, /tools ×2, /authors) | 0 (2 internal Next pages + /dashboard remain excluded by design) |
| `/comparisons` HTML | 2,573KB | 607KB (96 SSR cards kept — no SEO content loss) |
| `/category/developer-tools` HTML | 2,121KB | 861KB |

## 5. THE 891 "DISCOVERED, NOT INDEXED" — BREAKDOWN & ROOT CAUSE

**Method:** all 891-candidate URLs (entire sitemap) were crawled locally: **100% HTTP 200, 100% self-canonical, 100% robots-allow, 100% in sitemap, 0 noindex, 0 duplicates**. No technical exclusion mechanism exists. Patterns by template (evidence-based estimate — exact URL membership requires GSC export):

| Pattern | Estimated share | Pages | Assessment |
|---|---|---|---|
| Solid content generated in recent sprints (reviews 152 / comparisons 617 / best 191 / guides 101 / alternatives 101 / use-cases 50 / industries 51 / blog 97 / statistics 105 / research 33 / hubs 11 / categories 12) | **~85–90%** | ~1,520 | Healthy pages awaiting Google's crawl/processing. Site launched 2026 with ~1,600 URLs added in bulk generation sprints → classic crawl backlog. Avg words: reviews 3,717 / best 1,645 / comparisons 1,691 / guides 1,698 — not thin |
| Thin glossary terms (<300 words) | **~8%** | 72 of 123 | Content-quality issue, not technical. Enrichment = future content sprint (proposed, not done) |
| Near-orphan utility pages (/team, /tools ×2, /authors/pilotstack-team) | **<1%** | 4 | **Fixed this sprint** (footer + 151 author links + sitemap) |
| Other (tool pages 335 avg words, team 298) | ~1% | 3 | Monitor; optionally enrich tools pages |

**Root cause:** crawl/indexing backlog on a young site + thin sub-pages + (fixed) weak links. **No canonical/indexability/sitemap conflicts.** Do NOT mass-submit; see §13 strategy.

## 6. THE 35×404 — BREAKDOWN

The GSC 404 URL list is **not present in the repository** (no export exists — verified). Evidence available:
- **0 app routes ever deleted** (git log --diff-filter=D on src/app)
- **1 real slug rename:** `reviews/calndly → reviews/calendly` (R099) — old URL now 404s
- 306 unpublished comparison JSONs exist (filtered at build since inception — `published !== false` in current registry; historically possibly indexable → 404 candidates)
- `/research/saas-pricing-benchmark-2026`: **NOT deployed** (Sprint 21 uncommitted) — will return 200 after Sprint 21 is committed+deployed; it is not one of GSC's 35 (never served)
- Remaining: legacy framework-era URLs / bot noise / query variants

**Rule applied:** no redirects invented without a real replacement. Triage requires the GSC export — export "404" → review each (recommended: check backlinks first; 301 only where a clear equivalent exists, e.g. calndly → calendly).

## 7. THE 27 NOINDEX — BREAKDOWN

- **1 real:** `/search` (`noIndex: true`, intentional — thin client search page, noindexed + **removed from sitemap** this sprint)
- **26 stale:** no other noindex source exists in code (grep `noIndex` = 1 hit) and built crawl shows 0 noindex pages besides `/search` + Next-internal `/_not-found`, `/_global-error`. These are GSC entries for pages removed in earlier builds
- No valuable landing page is accidentally noindexed. No sitemap contains a noindex URL (verified)

## 8. ROBOTS-BLOCKED URL

- `/dashboard` — intentional: internal placeholder metrics page (all-zero values), robots disallow `/dashboard/` kept, **removed from sitemap**, not linked from nav/footer (only sitemap-html, which was cleaned). Documented, no further action.

## 9. CANONICALS

- All 1,670 sitemap URLs: self-referencing, absolute, `https://www.pilotstack.online` — crawl-verified 100%
- 0 accidental homepage canonicals, 0 pagination/filter conflicts (no pagination exists)
- GSC "1 alternate canonical" = infra-level non-www→www 308 (verified) or trailing-slash variants — benign, no code action

## 10. INTERNAL LINK ARCHITECTURE

- Global nav (9) + footer (5 columns: all 9 categories, all editorial/company/policy pages) → every hub has 1,672 unique linkers
- Near-orphans found & fixed: `/team` (footer+sitemap), `/authors/pilotstack-team` (151 review author links), `/tools/*` (homepage + /tools index + cross-links; acceptable)
- "12 pages linking to broken": 0 broken internal links in current build (190k links checked) — stale data
- "43 mixed dofollow/nofollow": external affiliate/outbound links with intentional nofollow — by design
- "5 only-one-dofollow": were the near-orphans above — now resolved
- No link spam added; anchors contextual (footer labels, author byline)

## 11. SITEMAP — LIVE VERIFICATION (100% INTEGRITY)

Crawl of all 1,670 sitemap URLs (local production server):
- **1,670/1,670 → HTTP 200**
- **1,670/1,670 canonical matches sitemap URL** (only `/rss.xml` lacks canonical/robots/JSON-LD — it is an XML feed; correct by design)
- 0 noindex, 0 robots-blocked, 0 duplicates, no internal/search/dashboard URLs
- lastModified = build date (regenerated each deploy; acceptable)
- `/team` now included; `/search` + `/dashboard` excluded

## 12. STRUCTURED DATA

- 0 parse errors across 1,672 HTML pages
- 0 duplicate aggregateRating (was 1,383)
- 0 invalid `@id` values
- One rating entity per product per page; ratings/`ratingCount` = real visible content JSON values
- ReviewSchema now emits Product + single Review (Google review-snippet pattern) without fake aggregate

## 13. GOOGLE INDEXING STRATEGY (for the 891)

1. **Commit + deploy this sprint + Sprint 21** (research page returns 200, sitemap grows).
2. After deployment: use GSC **URL Inspection → Request Indexing** in **batches** for highest-value clusters: `/best/*` (191), `/research/*` (33), new `/comparisons/*`, `/reviews/*` updates. Max ~10–20/day, prioritised.
3. Glossary (72 thin terms): **do not request indexing yet** — enrich content first (future content sprint: add usage examples/related tool links to the template or JSON). 
4. `/tools/*` (+/team): indexed via sitemap + footer; no action.
5. **No mass submission** (IndexNow does not control Google; revalidate hook already pings IndexNow for Bing/others).
6. Re-audit in 4 weeks: GSC index coverage should show discovered-not-indexed decreasing as the backlog clears.

## 14. PERFORMANCE

- 0 pages >2MB; `/comparisons` 607KB with **96 server-rendered cards preserved** (no SEO content loss); Show-more is client-only append
- `/category/*` serialized-props bloat eliminated (861KB worst page)
- No SSR duplication introduced; chunks normal (largest 221KB)
- No Core Web Vitals regression expected (no new blocking scripts; one small client component)

## 15. VALIDATION RESULTS

| Check | Result |
|---|---|
| `npx tsc --noEmit` | 0 errors |
| `npm run build` (1,673 pages) | exit 0 |
| ESLint (all changed files) | 0 errors (pre-existing unused-import warnings only) |
| `npm run lint:content` | 12 pre-existing warnings (baseline) |
| Built-HTML audits (titles/descs/sizes/schema/links/noindex/alt) | all targets green |
| Full sitemap crawl (1,670 URLs) | 100% 200 + canonical + robots |
| Production spot-check (pre-deploy baseline): 12 representative URLs | 200, canonical correct, `index, follow`; `/blog/` etc. 308 → trailing-slash normalization (benign); robots 200; sitemap 200; IndexNow key 200; apex→www 308 |

## POST-DEPLOY PRODUCTION VERIFICATION CHECKLIST (Phase 15)
Homepage, `/sitemap.xml`, `/robots.txt`, `/team`, `/tools/tco-calculator`, `/best/best-accounting-software`, `/comparisons/1password-vs-bitwarden`, `/reviews/figma`, `/guides/project-management-software-buyers-guide`, `/research/saas-pricing-benchmark-2026` (after Sprint 21), `/blog/`, `/glossary/workflow-automation` → expect 200, indexable, self-canonical, valid JSON-LD.

---

## STATUS
- All 21.2 fixes implemented locally + validated (including this session's `/team` sitemap/footer + author-link additions).
- **Nothing committed or pushed.** Working tree also contains uncommitted Sprint 21 artifacts (unchanged, untouched).
- Proposed commit: `fix(seo): resolve technical indexing and audit issues`
- Optional follow-up (not done, not part of this commit): glossary/tool page content enrichment; GSC 404 export triage; after deploy, batched index requests.
