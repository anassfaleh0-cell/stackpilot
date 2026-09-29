# SEO Position 30–60 Optimization — Implementation Report

**Site:** PilotStack (`https://www.pilotstack.online`)
**Phase:** 12 (implementation complete, verified)
**Scope:** 15 pages currently earning GSC impressions at roughly positions 30–60, plus the shared route templates that control how those pages emit metadata, structured data and internal links.
**Companion document:** `SEO_POSITION_50_AUDIT.md` (Phase 1 — diagnosis, target query mapping, defect register D1–D10).

---

## 0. Verification — final tree

| Gate | Command | Result |
|---|---|---|
| Typecheck | `npx tsc --noEmit` | **0 errors** |
| Unit tests | `npx vitest run --no-file-parallelism` | **3 files, 16/16 passed** |
| Production build | `npm run build` | **Compiled successfully · 610/610 static pages · 0 page failures** |
| Target link integrity | scan of all `related*` fields on the 15 targets | **87/87 resolve to published + indexable content · 0 dead** |
| ESLint (delta) | before/after per-file diff of `npm run lint` | **0 new problems in `src/`** |
| Content lint | `npm run lint:content` | 12 errors — all pre-existing, all in untouched `content/blog/*` |

Build note: two earlier attempts failed with `took more than 60 seconds` page-export timeouts while the machine was at 100 % CPU / ~1 GB free (a concurrent session was saturating the box). The clean run above was taken at ~14 % load. The failures were environmental and affected unrelated pages (`/reviews/terraform`, `/blog/payroll-software-comparison`) — they are timeouts, not code errors.

---

## 1. Shared template / renderer changes

These are the highest-leverage edits: they fix defects that affected every page on the route, not just the 15 targets.

| # | File | Change |
|---|---|---|
| 1 | `src/components/content/related-reading.tsx` | **New component.** Renders curated `relatedTools` / `relatedComparisons` / `relatedGuides` / `relatedPosts` arrays as grouped in-page links. Silently drops any slug that is unpublished or noindexed. |
| 2 | `src/lib/content/registry.ts` | **New `isContentAvailable(type, slug)`** — publication + indexability gate used before any internal link is emitted. `NOINDEX_ENFORCED` = `review, comparison, best, alternative, glossary, statistic` (routes that really emit `noindex` or are excluded from the build). Guides / blog / research / use-cases / industries / hubs stay linkable because their templates never set `noIndex`. |
| 3 | `src/types/content.ts` | Optional `seoTitle` / `seoDescription` on `ReviewContent` and `CategoryKnowledge`; optional `faqs?: FAQItem[]` on `GuideContent`. All opt-in — pages without the fields keep their existing templates. |
| 4 | `src/app/reviews/[slug]/page.tsx` | `generateMetadata` now prefers `tool.seoTitle` / `tool.seoDescription`, falling back to the old one-size-fits-all template. |
| 5 | `src/app/guides/[slug]/page.tsx` | (a) **Checklist sections now render `section.items`** — previously 17 of 19 guide checklists rendered only their intro sentence. (b) Visible FAQ section when `guide.faqs` exists. (c) `<RelatedReading>` block. (d) **New `deriveGuideFaqs()`** feeding `FAQPage` schema — see §2. |
| 6 | `src/app/use-cases/[slug]/page.tsx` | (a) New **"At a Glance"** comparison table (tool · rating · best for · pricing · review link), sourced from `recommendations` + `getReview().priceRange`. (b) `<RelatedReading>` block. (c) Removed an `EnhancedRelatedContent` call that received no `items` and rendered `null`. |
| 7 | `src/app/category/[slug]/page.tsx` | **`relatedCategories` now matched by slug *or* name**, and the href uses the resolved slug. Before this, the "Related Categories" block rendered **nothing on all 12 category pages** because the JSON stored names while the template matched on slug. |
| 8 | `src/app/comparisons/[slug]/page.tsx` | `<RelatedReading>` block (the `relatedComparisons` / `relatedGuides` / `relatedPosts` arrays were declared but never rendered). |

---

## 2. Metadata & structured data

### 2.1 Titles and meta descriptions

`createMetadata()` truncates titles at **58** characters and descriptions at **160**, both at a word boundary. Every review was previously served one identical template (`"{Name} Review (2026): Pricing, Pros, Cons & Top Alternatives"`), which clipped mid-phrase.

Per-page `seoTitle` / `seoDescription` added (all comfortably inside both limits):

| Page | `seoTitle` (chars) | `seoDescription` (chars) |
|---|---|---|
| `/reviews/ahrefs` | `Ahrefs Review 2026: Pricing, Pros, Cons & Verdict` (49) | 130 |
| `/reviews/semrush` | `SEMrush Review 2026: Pricing, Pros, Cons & Verdict` (50) | 125 |
| `/reviews/quickbooks` | `QuickBooks Review 2026: Pricing, Pros, Cons & Verdict` (53) | 132 |
| `/reviews/xero` | `Xero Review 2026: Pricing, Pros, Cons & Verdict` (47) | 133 |
| `/reviews/asana` | `Asana Review 2026: Pricing, Pros, Cons & Verdict` (48) | 123 |
| `/reviews/canva` | `Canva Review 2026: Pricing, Pros, Cons & Verdict` (48) | 119 |
| `/category/marketing-seo` | `Best Marketing & SEO Software 2026: Reviews & Pricing` (53) | 153 (pre-existing) |

`/reviews/linear` and `/reviews/figma` already carried `seoTitle` / `seoDescription` in the tree at the time of writing.

Descriptions were written from the pages' own content — no invented statistics, prices or review counts.

### 2.2 FAQPage schema

`GuidePage` previously built `FAQPage` markup from **section titles** ("Keyword Research Tools" → `<h3>` question), which search engines reject as non-genuine FAQ markup.

New `deriveGuideFaqs()` resolves in order:

1. explicit `guide.faqs`
2. Q/A parsed from a `list` section titled *"Frequently Asked…"* (`**Question?** Answer` and `Question? Answer` formats both handled; only items that parse into a genuine question ending in `?` are used)
3. previous behaviour as a last resort

This yields real question/answer pairs on **17 guides** that already contained FAQ prose as list sections (including two of the targets: `/guides/accounting-software-pricing` and `/guides/how-to-choose-accounting-software`), with **no on-page duplication** — the schema is derived from content that is already rendered.

`/guides/building-your-seo-toolkit` had no FAQ content at all, so five genuine Q/As were added as a `faqs` block, drawn verbatim from the guide's own sections (tool choice, audit cadence, crawl-error priority, content-tool threshold, rank-tracking ground truth). It now gets both a visible FAQ section and correct schema.

### 2.3 Structured-data consistency

`/use-cases/best-seo-for-agencies` emitted `softwareApp.aggregateRating` of **4.7 / 4.6** while the linked review pages and `ReviewSchema` say **4.6 / 4.5**. Two conflicting ratings for the same entity on the same site. `recommendations[].rating` and the hero description were aligned to the canonical review ratings.

---

## 3. Internal linking

### 3.1 Dead / suppressed link sources removed

Audit found 18 of 89 declared internal relations pointing at unpublished or noindexed content. On the 15 targets:

| Page | Was | Now |
|---|---|---|
| `/guides/building-your-seo-toolkit` | `semrush-vs-ahrefs` (unpublished) | `ahrefs-vs-semrush` (published, indexable) |
| `/guides/accounting-software-pricing` | `quickbooks-vs-xero`, `quickbooks-vs-freshbooks` (both unpublished) | `[]` — no Finance & Accounting comparison is published |
| `/guides/how-to-choose-accounting-software` | same two unpublished | `[]` |
| `/comparisons/ahrefs-vs-semrush` | `semrush-vs-moz`, `mailchimp-vs-activecampaign` (both noindexed) | `ahrefs-vs-moz` |
| `/comparisons/asana-vs-linear` | `linear-vs-jira`, `notion-vs-clickup` (both noindexed) | `asana-vs-clickup`, `clickup-vs-monday-com` |
| `/reviews/ahrefs` | `semrush-vs-ahrefs` (unpublished) | `ahrefs-vs-semrush`, `ahrefs-vs-moz` |
| `/reviews/semrush` | `semrush-vs-ahrefs` (unpublished) | `ahrefs-vs-semrush` |
| `/reviews/linear` | `linear-vs-jira`, `linear-vs-clickup` (both noindexed) | `asana-vs-linear` |
| `/reviews/asana` | `asana-vs-monday-com` (unpublished) | `asana-vs-linear`, `asana-vs-clickup` |
| `/reviews/canva` | `figma-vs-sketch` (unpublished) | `canva-vs-sketch`, `canva-vs-adobe-express` |
| `/reviews/quickbooks`, `/reviews/xero` | `quickbooks-vs-xero` (unpublished) | `[]` |

**Result: 87 of 87 related links across the 15 targets now resolve to published, indexable content.**

### 3.2 New link surfaces

- `RelatedReading` now renders on **guides**, **comparisons** and **use-cases** — three route templates that previously declared related-content arrays and never displayed them.
- Category `relatedCategories` block is no longer dead (slug-or-name match).
- Category `knowledge.internalLinks` (declared in the type, never rendered) is now rendered as a "Start Here" block on `/category/marketing-seo`.

---

## 4. Per-page change summary (15 targets)

| # | URL | Metadata | Structured data | Content | Internal links |
|---|---|---|---|---|---|
| 1 | `/use-cases/best-seo-for-agencies` | — | `aggregateRating` reconciled to 4.6 / 4.5 | description rating text fixed | all related verified |
| 2 | `/guides/accounting-software-pricing` | — | FAQPage now genuine Q/A | — | 2 unpublished comparisons removed |
| 3 | `/category/marketing-seo` | `seoTitle` added | — | — | `relatedCategories` + `internalLinks` now render |
| 4 | `/reviews/linear` | already present | — | — | 2 noindexed comparisons removed |
| 5 | `/reviews/figma` | already present | — | — | verified clean |
| 6 | `/reviews/ahrefs` | `seoTitle` + `seoDescription` | — | — | unpublished comparison repointed |
| 7 | `/reviews/semrush` | `seoTitle` + `seoDescription` | — | — | unpublished comparison repointed |
| 8 | `/guides/building-your-seo-toolkit` | — | FAQPage schema + visible FAQ section | 5 FAQs added | comparison repointed to published |
| 9 | `/comparisons/ahrefs-vs-semrush` | — | — | — | 2 noindexed → 1 indexable; `RelatedReading` added |
| 10 | `/guides/how-to-choose-accounting-software` | — | FAQPage now genuine Q/A | — | 2 unpublished comparisons removed |
| 11 | `/reviews/quickbooks` | `seoTitle` + `seoDescription` | — | — | unpublished comparison removed |
| 12 | `/reviews/xero` | `seoTitle` + `seoDescription` | — | — | unpublished comparison removed |
| 13 | `/reviews/asana` | `seoTitle` + `seoDescription` | — | — | unpublished comparison repointed ×2 |
| 14 | `/comparisons/asana-vs-linear` | — | — | — | 2 noindexed removed; `RelatedReading` added |
| 15 | `/reviews/canva` | `seoTitle` + `seoDescription` | — | — | unpublished comparison repointed |

Routes, URLs, slugs and the sitemap were not touched.

---

## 5. What was deliberately NOT done

Per the task constraints:

- ❌ No URL, route, slug or filename changes; no redirects.
- ❌ No pages created, deleted, merged or split; no mass page generation.
- ❌ No `sitemap.ts` changes; no `noindex-list.json` changes; no database/schema changes.
- ❌ No fabricated prices, ratings, review counts, statistics or testimonials.
- ❌ No keyword stuffing, no doorway/duplicate pages, no thin near-duplicates.
- ❌ No affiliate, ad or monetisation changes; no removal of legal/trust/disclosure content.
- ❌ No promise or prediction of Position 1 — this work improves relevance, coverage and internal signals; ranking movement is left to GSC data.

Scope was held to the 15 audited pages. The only changes that touch pages outside the target set are shared-renderer fixes (checklist rendering, `relatedCategories` matching, FAQ schema derivation, `RelatedReading`), which correct defects rather than add content.

---

## 6. Known issues and caveats

1. **No GSC export in the repository.** Target selection and query mapping were taken from the signals supplied in the brief. To measure results you need a post-deploy GSC pull (see §7).
2. **`npm run lint` and `npm run lint:content` were already red before this work.**
   - ESLint: 700 problems total, of which **332 errors + 204 warnings come from 74 stray root-level `*.js` / `*.mjs` probe scripts** (`_a.js`, `_print-bodies.js`, `_debugfix.js`, `_git-check.js`, …) left behind by earlier sessions. `src/` carries 47 errors / 90 warnings, **none introduced here** (verified by diffing per-file counts before and after).
   - `lint:content`: 12 errors, all `Unverified $ figure` warnings in seven untouched `content/blog/*.json` files.
   - Cleaning those stray scripts out of the repo root (or adding an `.eslintignore`) would make both gates meaningful again.
3. **Concurrent editing.** A second OpenCode session was actively writing to this working tree during part of this task. Per instruction, edits were paused until it went idle, then resumed with a re-read of every file before each edit. The two sets of changes merged cleanly — final verification in §0 was run on the merged tree. Some changes visible in `git status` (e.g. `src/app/blog/[slug]/page.tsx`, `content/reviews/stripe.json`, `src/app/sitemap.ts`) come from that session, not from this report.
4. **Build sensitivity.** `next build` exports 610 pages with 3 workers and a 60 s per-page timeout; it flakes when the machine is loaded. Run it at low load.
5. **`getComparison()` returns `null` for unpublished content**, so dead comparison links were already being filtered at render time — the data cleanup in §3.1 restores links that were being silently dropped, rather than fixing visible 404s.

---

## 7. How to measure

1. Re-crawl or re-deploy, then confirm the 15 URLs are indexed and their titles/descriptions render un-truncated in the SERP.
2. Pull GSC for 4–8 weeks post-deploy and compare, per target URL:
   - **average position** on the mapped queries from `SEO_POSITION_50_AUDIT.md`
   - **impressions** (expect these to move first)
   - **CTR** — the main lever from the title/description work
3. Confirm rich results: FAQ rich results where eligible, and consistent `aggregateRating` between `/use-cases/best-seo-for-agencies` and its linked reviews.
4. Re-run `npm run seo:links` to confirm no new outbound internal links point at unpublished or noindexed content.
