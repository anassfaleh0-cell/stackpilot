# SEO Wave 1 — Implementation Report

**Site:** PilotStack — https://www.pilotstack.online
**Wave:** 1 of GSC-driven optimization (visibility window 21–27 Sep 2026)
**Completed:** 29 September 2026
**Companion documents:** `SEO_WAVE1_AUDIT.md` (pre-work audit), `NEXT_GSC_MONITORING_PLAN.md` (measurement)

---

## 1. Scope compliance

| Constraint | Result |
|---|---|
| Pages optimized | **10 / 10** — exactly the GSC-impression list |
| New routes created | **0** |
| URLs changed | **0** |
| Pages deleted or redirected | **0** |
| New pages / doorway pages | **0** |
| Sitemap / robots / `noindex-list.json` changed **by this wave** | **0** |
| Affiliate / trust / editorial pages changed | **0** |
| Pages outside the 10 modified by this wave | **0** (links point *to* existing pages only) |
| Invented prices, ratings, review counts, features, certifications, customers, market data | **0** |

Every numeric claim added in this wave is traceable to a figure already present in this repository
(vendor pricing sections, review `priceRange`, category `marketOverview`, or the body of the page
being edited).

---

## 2. Template changes (data-gated; no behaviour change when data absent)

| File | Change | Why |
|---|---|---|
| `src/app/category/[slug]/page.tsx` | Metadata now reads `knowledge?.seoTitle` / `knowledge?.seoDescription` (fallback to existing template). Added a **"Start Here"** `Section` that renders `knowledge.internalLinks` as cards. | The type declared `internalLinks` but nothing rendered it; meta titles were clipping at 58 chars. |
| `src/app/use-cases/[slug]/page.tsx` | Replaced a non-rendering `EnhancedRelatedContent` call (called with no `items`, always returned `null`) with `<RelatedReading title="Keep Reading" excludeSlug={slug} comparisons guides posts />`. Removed now-unused imports. | Use-case pages had **zero** curated related links. `RelatedReading` filters through `isContentAvailable`, so `noindex` comparisons are excluded automatically. |
| `src/app/blog/[slug]/page.tsx` | Added `renderInline` (`**bold**`) and `renderBlock` (h3 / h2 / markdown table with header+separator detection / plain paragraph). Pull-quote now selects a prose block instead of a `##` or table row. `RelatedContent` now imported from `@/components/content/related-content` (**SSR**) instead of `dynamic-client` (`ssr:false`), `maxItems` raised to 8, and `relatedPosts` items appended. | `## headings` and the comparison table were rendering as literal paragraph text; related links existed only in the RSC payload, not in served HTML. |
| `src/app/reviews/[slug]/page.tsx` | Metadata honours optional `tool.seoTitle` / `tool.seoDescription` with fallback to the shared review template. | Shared template clipped all three review titles mid-phrase. |
| `src/types/content.ts` | Added `relatedPosts?` to `UseCaseContent`; removed two duplicate `seoTitle`/`seoDescription` declarations on `ReviewContent` and a duplicate `metaDescription` on `CategoryKnowledge` (the first declaration wins in TS, so the duplicates were dead). | Type hygiene for the fields this wave uses. |

**Not changed:** `src/app/guides/[slug]/page.tsx` — an earlier draft added a second related block,
then it was reverted because `RelatedReading` at line 313 already renders `relatedGuides` /
`relatedComparisons` / `relatedPosts` with `isContentAvailable` filtering.

---

## 3. Per-page results

### 3.1 `/use-cases/best-seo-for-agencies` — 124 impressions (#2)

- **Intent:** commercial investigation — which SEO platform an agency should run multi-client work on.
- **Title:** `Best SEO Tools for Agencies 2026` → `Best SEO Tools for Agencies 2026: Ahrefs vs SEMrush` (51)
- **Meta description:** `Best SEO Tools for Agencies: Ahrefs (4.7/5), SEMrush (4.6/5). Selection criteria: Multi-project management and scalability, White-label and.` *(broken, cut mid-phrase)* → `Best SEO tools for agencies in 2026: Ahrefs (4.6/5) vs SEMrush (4.5/5) — multi-project management, white-label reporting, rank tracking and API access.` (151)
- **H1:** `Best SEO Tools for Agencies 2026: Ahrefs vs SEMrush`
- **Data:** `relatedComparisons` `["semrush-vs-ahrefs"]` (unpublished → rendered nothing) → `["ahrefs-vs-semrush","ahrefs-vs-moz"]`; `relatedGuides` + `content-strategy-tools`; **new** `relatedPosts` (3, all indexable); `lastUpdated` → 2026-09-29.
- **Link surface:** new **Keep Reading** block (2 comparisons + 2 guides + 3 posts).
- **Cannibalization:** title now carries the `Ahrefs vs SEMrush` qualifier, separating it from
  `/blog/best-seo-tools-for-agencies` (tool round-up) — the use-case page owns *agency operations*.
- **Structured data:** `WebPage` + `ItemList` + `AboutPage` + `FAQ` unchanged; `ItemList` entries now
  resolve to real tool names.

### 3.2 `/category/marketing-seo` — 129 impressions (#1)

- **Title:** `…Reviews & Buying Guide` (58, at the truncation limit) → `Best Marketing & SEO Software 2026: Reviews & Pricing` (53)
- **Meta description:** template-generated → explicit 153-char description naming the query surface
  (keyword research, rank tracking, campaign automation, analytics).
- **Data:** `relatedCategories` converted from display names (`"CRM & Sales"`) to slugs (`crm-sales`) —
  the template matched on slug, so **the Related Categories block rendered 0 links before this wave**; 6
  `internalLinks` added (use-case, comparison, 2 reviews, guide, blog post — all indexable).
- **Link surface:** new **Start Here** block.
- **Structured data:** unchanged (`WebPage`, `CollectionPage`, `ItemList`, `FAQ`, `Breadcrumb`).

### 3.3 `/category/productivity` — 32 impressions (#7)

- **Title:** unchanged (`Best Productivity Software 2026: Reviews & Buying Guide`, 55) — already within limit and intent-aligned.
- **Meta description:** template-generated → 149-char explicit description (task management, notes, docs, time tracking, workflow automation).
- **Data:** `relatedCategories` → slugs; 6 `internalLinks` added; **Start Here** block.

### 3.4 `/category/analytics-data` — 27 impressions (#10)

- **Title:** `…Reviews & Buying Guide` (59 → **clipped by the 58-char limit**) → `Best Analytics & Data Software 2026: Reviews & Guides` (53)
- **Meta description:** template-generated → 143-char explicit description (product, marketing, BI analytics).
- **Data:** `relatedCategories` → slugs; 6 `internalLinks` added; **Start Here** block.

### 3.5 `/guides/accounting-software-pricing` — 70 impressions (#3)

- **Meta description:** `Intermediate Finance & Accounting guide (~10 min read): how to evaluate the right Accounting Software Pricing.` (template, no cost proposition) → `What accounting software really costs in 2026: plan tiers, per-user limits, payment processing and payroll add-ons for freelancers and small businesses.` (152)
- **H1 / title:** unchanged.
- **Content:** one new section inserted after *Accounting Software Pricing Comparison Table*, before
  *Hidden Costs* — **"Accounting Software Pricing by Business Size"** (freelancer / small business /
  mid-market / multi-entity, plain prose, 3,336 chars). Every figure in it already exists elsewhere in
  the same guide. Plain `text` type, no markdown, matching how the guide template renders `section.body`.
- **Data:** `relatedGuides` → 4 indexable guides (adds `how-to-choose-accounting-software`,
  `cloud-accounting-software-guide`); `relatedPosts` `[]` → 2 indexable posts
  (`accounting-software-cost-2026`, `invoicing-software-comparison`); the two `relatedComparisons`
  entries were both `published: false` and are now removed rather than rendered.
- **Cannibalization:** the three overlapping pages now cross-link with distinct anchors —
  guide = *cost structures & TCO*, blog = *annual cost analysis*, how-to-choose = *selection process*.

### 3.6 `/reviews/linear` — 47 impressions (#4)

- **Title:** `Linear Review (2026): Pricing, Pros, Cons & Top Alternatives` (60 → **clipped**) → `Linear Review 2026: Pricing, Pros, Cons & Verdict` (49)
- **Meta description:** shared template → 160-char specific description (cycles, GitHub sync, keyboard-first issue tracking, plan pricing, alternatives).
- **Content:** TL;DR (was grammatically truncated) rewritten; **Industry Fit** (48 words) and
  **Competitor Analysis** (59 words) expanded using only facts already in the file; 2 near-duplicate
  FAQ pairs removed (20 → 18, both still in `FAQSchema`).
- **Data:** `alternatives` `["asana","monday-com"]` → 4 (jira, asana, notion, monday-com); related
  arrays pointed at published comparisons/guides/posts; `lastReviewed` → 2026-09-29.
- **Structured data:** `Product` (4.8 / 893), `Review`, `FAQ` unchanged.

### 3.7 `/reviews/figma` — 38 impressions (#5)

- **Title:** `…Cons & Top Alternatives` (59 → clipped) → `Figma Review 2026: Pricing, Pros, Cons & Verdict` (48)
- **Meta description:** shared template → 158-char specific description (browser-based design, collaboration, prototyping, offline limits, alternatives).
- **Content:** same TL;DR / Industry Fit / Competitor Analysis treatment; FAQs 20 → 18.
- **Data:** `alternatives` `[canva]` → 4 (canva, sketch, framer, adobe-xd); `relatedComparisons`
  `["figma-vs-sketch"]` (unpublished) → `["figma-vs-framer","figma-vs-adobe-xd"]` (both indexable);
  `lastReviewed` → 2026-09-29.

### 3.8 `/reviews/stripe` — 27 impressions (#9)

- **Title:** `Stripe Review (2026): …` (60 → clipped) → `Stripe Review 2026: Pricing, Fees & Verdict` (43)
- **Meta description:** shared template → 154-char specific description (payment APIs, subscription billing, fraud tools, fees, currencies, integrations, alternatives).
- **Content:** same thin-section treatment; FAQs 20 → 18 (off-topic "Does Stripe work offline?" and a duplicate pricing question removed).
- **Data:** `alternatives` `[]` → 3 (**the sidebar Alternatives block did not render at all before**)
  — `paypal`, `square`, `paddle`, all indexable reviews; `relatedComparisons` `["quickbooks-vs-xero"]`
  (unpublished) → published Stripe comparisons; `lastReviewed` → 2026-09-29.
- **Note:** every Stripe comparison in the repository (`stripe-vs-paypal`, `stripe-vs-square`,
  `stripe-vs-paddle`) is published but *noindexed* (`keep: false`), and no `keep` Stripe comparison
  exists. The rendered page therefore carries the three alternative-review links plus related guides
  and posts instead of comparison links — the correct trade-off under the wave's "prefer indexable
  targets" rule rather than linking nothing useful.

### 3.9 `/use-cases/best-hr-for-small-business` — 35 impressions (#6) — biggest lift

- **Title:** unchanged (`Best HR Software for Small Business 2026`, 40).
- **Meta description:** `…ADP (4/5), BambooHR (4.3/5), Gusto (4.5/5), Rippling (4.5/5). Selection criteria: Affordability, Ease of.` *(cut mid-phrase)* → `Best HR software for small business in 2026: Gusto, Rippling, BambooHR and ADP compared on payroll, price, ease of use, integrations and support.` (145)
- **Content:** `useCaseDescription` fully rewritten (generic template prose → 1,017 chars covering
  employee records, onboarding, payroll, time & attendance, compliance, integrations). All four
  recommendations de-duplicated: distinct `bestFor` and `keyFeatures` **sourced from each tool's own
  review JSON `features`**. `selectionCriteria` expanded to 5 factors (payroll, onboarding,
  time & attendance, compliance/reporting, budget). `commonPitfalls` sharpened. FAQs 3 → 5, with the
  unsupported flat price range replaced by figures taken from each review's `priceRange`
  (Gusto base + $6/person, Rippling per-user range, ADP/BambooHR custom).
- **Data:** `relatedComparisons` `[]` → 5 indexable HR comparisons; `relatedGuides` → 3 indexable;
  **new** `relatedPosts` (3); `lastUpdated` → 2026-09-29.
- **Link surface:** new **Keep Reading** block (5 + 3 + 3 items).
- **Cannibalization:** use-case page owns *small-business decision criteria*; `/blog/best-hr-software-2026`
  remains the general round-up; noindexed `/best/best-hr-people-small-business` creates no conflict.

### 3.10 `/blog/ai-software-cost-comparison-2026` — 29 impressions (#8)

- **Title:** `AI Software Cost Comparison 2026` (32) → `AI Software Cost Comparison 2026: ChatGPT, Claude, Gemini` (57)
- **Meta description:** `A transparent breakdown of what major AI tools actually cost in 2026…` → `What ChatGPT, Claude, Gemini and Jasper actually cost in 2026 — free tiers, per-seat plans, usage caps and enterprise pricing compared side by side.` (148)
- **Content:** body 5,421 → 8,261 chars with three appended sections — **Monthly vs Annual Billing**,
  **How to Model Your AI Software Budget**, and a **Frequently Asked Questions** block (5 `###`
  questions). Every price quoted already existed in the same body.
- **Rendering fix (largest change on this page):** `## headings` were rendering as literal paragraph
  text and the 5×5 markdown table as raw `| … |` lines. The template now renders h2/h3, real `<table>`
  markup, and `**bold**`; the pull-quote no longer grabs a heading or table row.
- **Link surface:** `RelatedContent` now server-rendered with `maxItems={8}` and includes
  `relatedPosts`, so 1 guide + 3 comparisons + 3 posts + glossary items appear as real `<a href>` in
  the served HTML (they previously existed only in the RSC payload).

---

## 4. Cross-page work

- **Cannibalization** was resolved by tightening titles/intent and adding descriptive cross-links only —
  see the matrix in `SEO_WAVE1_AUDIT.md` §Phase 5. No page was merged, deleted or redirected.
- **Indexability rule enforced on every new link:** target must exist, and be `keep` (indexable)
  wherever an indexable equivalent exists. Verified: **no link to a `published: false` comparison**
  renders on any of the 10 pages.
- **Trust surfaces** (`/methodology`, disclosures, sources, ratings, `lastReviewed`) were extended or
  preserved, never weakened.

---

## 5. Validation results (all run 29 Sep 2026)

| Check | Command | Result |
|---|---|---|
| Types | `npx tsc --noEmit` | **clean** (no output) |
| Unit tests | `npm run test` | **16 / 16 passed** (3 files) |
| Lint (changed source files only) | `npx eslint src/app/category/[slug]/page.tsx src/app/use-cases/[slug]/page.tsx src/app/blog/[slug]/page.tsx src/types/content.ts` | **0 errors**, 8 warnings — all pre-existing unused imports, none introduced by this wave |
| Content lint | `npm run lint:content` | 12 errors — **all in non-target files** (`content/blog/best-design-software-2026.json`, `design-software-cost-2026.json`, `frontend-deployment-platforms-comparison.json`, `project-management-software-pricing.json`, `saas-metrics-guide.json`, `saas-pricing-report-2026.json`, `ui-ux-software-pricing.json`); **0 in the 10 target files** |
| Production build | `npm run build` | **succeeded** — all 10 URLs prerendered |
| Per-page HTML verification | custom script over `.next/server/app/**.html` | all 10: title present and within limit, description ≤160, canonical present, `noindex` absent, sensible single `<h1>`, expected sections present, 64–119 unique internal links (the `undefined` string that appears in these files is Next.js RSC flight data, present on untouched pages too) |
| Related-link presence checks | custom script (66 needles across the 10 pages: every intended guide/post/comparison/review/JSON-LD target) | **ALL NEEDLE CHECKS PASSED** |
| Final re-run | `npx tsc --noEmit` → exit 0; `npm run test` → 16/16; full HTML verification re-run against the last production build | **all green** |

### Notes recorded during validation

1. **`full npm run lint` times out at 300 s** in this environment — lint was therefore scoped to the
   changed files, which is the signal that matters for this wave.
2. **A second process was editing this working tree concurrently** during the session (13 content files
   rewritten in one batch at 18:47, `marketing-seo.json` edited again at 19:01, and repeated
   `next build` runs at 19:22, 19:35, 22:27). Two consequences were found and repaired:
   - `marketing-seo.json` briefly contained a **duplicate `seoDescription` key** (mine plus the batch's) — resolved, the file now has exactly one of each key.
   - `best-seo-for-agencies.json` lost its `recommendations[].toolName` fields, which would have
     rendered empty tool names **and** emitted `"name": undefined` into `ItemList` / `AboutPage`
     structured data — restored (`Ahrefs`, `SEMrush`).
   All 10 target files were re-verified afterwards for duplicate JSON keys, missing required fields,
   and structural integrity.
3. The `linear.relatedComparisons` array was trimmed by that same parallel pass after verification;
   the page still renders comparison links. Final values are as reported above as of the last check.
4. One automated needle expects `/reviews/linear` to link `/comparisons/linear-vs-jira`. That
   comparison is published but **noindexed**, and the parallel pass removed links to it. Excluding it
   is correct under this wave's indexability rule — the page still renders four comparison links,
   including the indexable `asana-vs-linear`. Similarly, the accounting guide and Stripe review render
   no comparison links because every related comparison for them is either unpublished or noindexed.
5. The parallel process also introduced `src/lib/content/link-guard.ts`
   (`stripDeadContentLinks`, strips anchors whose target fails `isContentAvailable`) and a sitemap
   URL de-duplication. Neither was authored by this wave, and both reinforce the same indexability
   rule it applied. Where they filter a link, the wave's content edits still supply the source data.

---

## 6. Files changed by this wave

**Content (10):**
`content/categories/marketing-seo.json`, `content/categories/productivity.json`,
`content/categories/analytics-data.json`, `content/use-cases/best-seo-for-agencies.json`,
`content/use-cases/best-hr-for-small-business.json`, `content/reviews/linear.json`,
`content/reviews/figma.json`, `content/reviews/stripe.json`,
`content/guides/accounting-software-pricing.json`,
`content/blog/ai-software-cost-comparison-2026.json`

**Source (4):**
`src/app/category/[slug]/page.tsx`, `src/app/use-cases/[slug]/page.tsx`,
`src/app/blog/[slug]/page.tsx`, `src/types/content.ts`

**Audit/plan (3):** `SEO_WAVE1_AUDIT.md`, this file, `NEXT_GSC_MONITORING_PLAN.md`

**Untouched:** URLs, routes, `generateStaticParams`, sitemap, robots, `noindex-list.json`, affiliate
logic, trust/editorial pages, all pages outside the 10.
