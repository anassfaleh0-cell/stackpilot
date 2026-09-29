# SEO WAVE 1 — AUDIT (10 GSC-visibility pages)

**Site:** PilotStack — https://www.pilotstack.online
**GSC period audited:** 21 September 2026 → 27 September 2026
**Source:** latest GSC export supplied with this task (clicks + impressions, no per-page Position)
**Scope:** ONLY the 10 URLs below. No URL, route, sitemap or schema-architecture changes.

> Note on Position: the export contains no per-page Position column, so no current ranking
> position is assumed anywhere in this audit. Ranking movement is left to future GSC data.

---

## 0. Template / rendering inventory (how each URL is actually built)

All 10 URLs are **dynamic routes driven by JSON content files**. This matters because
"internal links" and "metadata" only appear on a page if the *route template* renders them.

| URL pattern | Route file | Content file | Rendered link surfaces |
|---|---|---|---|
| `/category/[slug]` | `src/app/category/[slug]/page.tsx` | `content/categories/*.json` + `getCategoryKnowledge()` | reviews, comparisons, guides, glossary, blog, buyer-journey (entity graph), related categories, `InternalLinks` |
| `/use-cases/[slug]` | `src/app/use-cases/[slug]/page.tsx` | `content/use-cases/*.json` | recommendation cards → `/reviews/*`, `InternalLinks`, `EnhancedRelatedContent` |
| `/guides/[slug]` | `src/app/guides/[slug]/page.tsx` | `content/guides/*.json` | `InternalLinks`, related-category pills, free tools |
| `/reviews/[slug]` | `src/app/reviews/[slug]/page.tsx` | `content/reviews/*.json` | sidebar `alternatives`, `SemanticLinks` (comparisons/guides/blog/alternatives), `AutoComparison`, `InternalLinks`, related-category pills, prev/next |
| `/blog/[slug]` | `src/app/blog/[slug]/page.tsx` | `content/blog/*.json` | `RelatedContent` (relatedGuides/relatedComparisons/relatedGlossary), auto related reviews, author block |

### Template defects found during audit (relevant to these 10 pages only)

1. **`CategoryKnowledge.internalLinks` is declared in the type but never rendered.**
   → safe, data-gated opportunity: render it only when a category file supplies it.
2. **`relatedCategories` in category JSON stores category *names*, but the template matches on *slug***
   (`categories.find(c => c.slug === rcSlug)`), so the "Related Categories" block renders **nothing**
   on every category page. Fixing the *data* for the 3 target categories is scoped to those pages.
3. **Use-case `relatedComparisons` / `relatedPosts` are never passed to `EnhancedRelatedContent`**
   (it is called with no `items`, so it returns `null`). Guided fix: pass the curated arrays.
4. **Guide `relatedGuides` / `relatedComparisons` / `relatedPosts` are never rendered** (only used in
   schema). Guided fix: render them, data-gated (only ~26/100 guides carry data).
5. **Blog body is markdown, but the blog template renders every blank-line block as a plain `<p>`**,
   so `## Heading` and `| table |` rows appear as literal text on the page (93 of 97 posts).
6. **Category/guide/review meta templates truncate at 58 chars** (`createMetadata`), which clips the
   analytics category title and all three review titles mid-phrase.

### Indexability map (from `noindex-list.json`) — used to pick link targets

| Type | Total | Indexable (`keep`) |
|---|---|---|
| reviews | 151 | 151 |
| blog | 97 | 97 |
| guides | 100 | 50 |
| comparisons | 928 | 50 |
| alternatives | 101 | 30 |
| best | 196 | 20 |
| use-cases, category, hubs, industries, research | all | all |

**Rule applied when adding links:** prefer indexable targets; never link a target that does not exist;
never link to an unpublished (`published: false`) comparison — those are filtered out by
`getAllComparisons()` anyway.

---

## PAGE 1 — `/use-cases/best-seo-for-agencies`

- **GSC impressions:** 124 (#2)
- **Current title:** `Best SEO Tools for Agencies 2026`
- **Current meta description:** `Best SEO Tools for Agencies: Ahrefs (4.7/5), SEMrush (4.6/5). Selection criteria: Multi-project management and scalability, White-label and.` — **broken, cut off mid-phrase**
- **H1:** `Best SEO Tools for Agencies 2026` (from `EditorialHero`)
- **H2/H3:** Top Recommendations · Selection Criteria · Common Mistakes · FAQs · sidebar (Recommended Tools)
- **Main search intent:** *which SEO software should a digital/SEO agency use to run multi-client work, reporting and rank tracking* — commercial investigation / list-evaluation.
- **Existing coverage:** 2 tools (Ahrefs, SEMrush), 6 selection criteria (multi-project, white-label reporting, keyword/rank tracking, backlinks, technical audit, API), 4 pitfalls, 4 FAQs (Ahrefs vs SEMrush, agency-only features, plan project limits, agency ROI reporting).
- **Content gaps:** no opening "what agencies actually need" paragraph (hero subtitle is the broken string above); no pricing/plan-scaling consideration despite it being an explicit topic; no agency workflow / client-reporting narrative; no white-label reporting *workflow* framing; no explicit "how to evaluate" summary.
- **Tables:** none (page template has no table renderer for use cases).
- **FAQs:** 4 — solid, factual, already in `FAQSchema`.
- **Structured data:** `BreadcrumbSchema`, `ArticleSchema`, `WebPageSchema` (+ItemList), `ItemListSchema`, `CollectionPageSchema`, `AboutPageSchema`, `FAQSchema`.
- **Existing internal links:** 2 recommendation cards → `/reviews/ahrefs`, `/reviews/semrush`; sidebar repeats them; `InternalLinks` (Marketing & SEO) → 4 reviews / 4 comparisons / 4 guides / 4 best / 4 alternatives.
- **Related pages available:** `/comparisons/ahrefs-vs-semrush` (indexable), `/guides/building-your-seo-toolkit` (indexable), `/blog/best-seo-tools-for-agencies`, `/blog/seo-tool-stack-2026`, `/blog/seo-tools-pricing-guide`, `/use-cases/best-marketing-for-agencies`, `/reviews/moz`.
- **Cannibalization risk:** **HIGH** — `/blog/best-seo-tools-for-agencies` ("Best SEO Tools for Agencies in 2026") targets the same head term. Both indexable.
- **Trust elements:** "By PilotStack Team", `lastUpdated`, "How we test" → `/methodology`. No invented prices or ratings beyond existing 4.7/4.6 scores.

## PAGE 2 — `/category/marketing-seo`

- **GSC impressions:** 129 (#1)
- **Current title:** `Best Marketing & SEO Software 2026: Reviews & Buying Guide` (58 chars — exactly at the truncation limit)
- **Current meta description:** `Find the best marketing & seo software with expert reviews, pricing comparisons, and buying tips. 39 tools tested and rated for 2026.` (template-generated; lower-cases the category name awkwardly)
- **H1:** `Best Marketing & SEO Software 2026`
- **H2/H3:** Market Overview · Best in Category · AI Search Overview · Your Buying Journey · What to Consider Before Buying · Common Buying Mistakes · Decision Framework · Best Software by Use Case · Pricing Overview · All Marketing & SEO Reviews · Comparisons · Buying Guides · Related Terms · Latest Research · Related Categories · FAQ
- **Main search intent:** *explore/compare marketing & SEO software categories and tools* — category discovery / commercial browse.
- **Existing coverage:** very rich (8 buyer considerations, 6 mistakes, 8 decision factors, 6 FAQs, market overview, pricing overview, buyer journey).
- **Content gaps:** the page never states **what this category contains and what a visitor can do here** in the first screen; `description` (used in AI Search Overview + `WebPageSchema`) is a one-line list, not an explanation of the category; sub-topic organisation exists only as prose inside `longDescription`.
- **Tables:** none rendered.
- **FAQs:** 6, in `FAQSchema`.
- **Structured data:** `WebPage`, `CollectionPage`, `ItemList` (9 reviews), `FAQ`, `Breadcrumb`.
- **Existing internal links:** 9 reviews, 4 comparisons, 6 guides, glossary terms, 4 blog posts, buyer-journey links, `InternalLinks`.
- **Broken link block:** `relatedCategories` = `["CRM & Sales","Analytics & Data","Design & Creative","AI & Machine Learning"]` are **names**, template matches **slugs** → renders 0 links.
- **Cannibalization risk:** LOW internally; overlaps conceptually with `/best/marketing-seo-*` (20 of 196 `best` pages are indexable — `best-marketing-seo-agencies` is **noindexed**, so no conflict).

## PAGE 3 — `/guides/accounting-software-pricing`

- **GSC impressions:** 70 (#3)
- **Current title:** `Accounting Software Pricing Guide 2026`
- **Current meta description:** `Intermediate Finance & Accounting guide (~10 min read): how to evaluate the right Accounting Software Pricing.` — **template-generated, low search intent, no cost/pricing value proposition**
- **H1:** `Accounting Software Pricing Guide 2026`
- **H2/H3:** 12 numbered sections — Pricing Models · QuickBooks · Xero · FreshBooks · Wave · Comparison Table · Hidden Costs · Enterprise Pricing · Free Plans & Trials · ROI Analysis · TCO Buyer Checklist · FAQ-style list
- **Main search intent:** *how much does accounting software cost, what pricing models exist, what drives total cost* — informational/commercial.
- **Existing coverage:** strong: pricing models, 4 vendor breakdowns with verified figures, side-by-side table, hidden costs list, enterprise pricing, free/trial, ROI, TCO checklist, 10 FAQ items.
- **Content gaps:** no explicit **monthly vs annual billing** section (only one checklist line); no explicit **per-user pricing** discussion; no **accounting software by business size** framing (freelancer → SMB → mid-market → enterprise is scattered across vendor sections); no explicit **evaluation** step-by-step; **investment-company / firm accounting** angle not addressed (per-company pricing for accountants/bookkeepers is mentioned only inside the pricing-models section).
- **Tables:** 1 (`Accounting Software Pricing Comparison Table`, 4 vendors × 6 columns) — rendered as a real HTML table.
- **FAQs:** rendered as a 10-item checklist-style list; `FAQSchema` is derived from the **first 5 section titles** (existing template behaviour — not modified).
- **Structured data:** `Breadcrumb`, `HowTo`, `Article`, `FAQ`, `WebPage` (+ItemList of related tools).
- **Existing internal links:** `relatedTools` (quickbooks/xero/freshbooks) appear in schema only; `InternalLinks` (Finance & Accounting); related-category pills; free tools card.
- **Dead link data:** `relatedGuides` (3) and `relatedComparisons` (2) are **never rendered**; `relatedPosts` is `[]`. `quickbooks-vs-xero` and `quickbooks-vs-freshbooks` are both `published: false` → filtered out of `getAllComparisons()` even if rendered.
- **Cannibalization risk:** MEDIUM — `/blog/accounting-software-cost-2026` ("Accounting Software Cost Analysis for 2026") and `/guides/how-to-choose-accounting-software` overlap. All three indexable.
- **Verified pricing present:** yes (QuickBooks $15/$35/$55/$100, Xero $7.50/$15/$34.50, FreshBooks $19/$33/$60, Wave free, processing fees). **No new price will be invented.**

## PAGE 4 — `/reviews/linear`

- **GSC impressions:** 47 (#4)
- **Current title:** `Linear Review (2026): Pricing, Pros, Cons & Top Alternatives` (60 chars → **clipped to "…Cons & Top…"** by the 58-char limit)
- **Current meta description:** `Hands-on Linear review. See real pros, cons, pricing details, and the best alternatives before you buy. Expert-tested for 2026.` (shared template)
- **H1:** `Linear Review 2026`
- **H2/H3:** 33 content sections + Quick Answer · TL;DR · Key Takeaways · Who should buy / avoid · Pros & Cons · Third-Party Reviews · Rating Overview · Company Overview · Security & Compliance · Capabilities · Use Cases & Fit · Integrations · Pricing Plans · Before You Buy · Feature Breakdown · Top Alternatives · Sources & Methodology · FAQ (20)
- **Main search intent:** *is Linear good, what does it cost, what are its limits and alternatives* — product evaluation.
- **Existing coverage:** comprehensive section set (pricing explained, hidden costs, migration, security, API, verdict).
- **Content gaps:** several sections are thin — **Industry Fit (48 words)**, **Competitor Analysis (59 words)**, **API & Automation (69 words)**; no plain "what Linear is / who it is for" summary that matches "what is Linear" queries beyond the description; FAQ set contains near-duplicates (`What is Linear best used for?` / `What is Linear best for?`, `How much does Linear cost?` / `How linear pricing works?`).
- **Tables:** none (feature matrix component instead).
- **FAQs:** 20, in `FAQSchema`.
- **Structured data:** `Breadcrumb`, `Product` (aggregateRating 4.8 / 893), `Review`, `Software` (offers only if entity pricing exists), `WebPage`, `Article`, `FAQ`.
- **Existing internal links:** sidebar `alternatives` = [asana, monday-com]; `SemanticLinks` = comparisons/guides/blog/alternatives from `relatedComparisons|relatedGuides|relatedPosts|alternatives`.
- **Dead/broken link data:** `relatedComparisons` = `["notion-vs-linear"]` → **`published: false`**, silently filtered by `getAllComparisons()` → **0 comparison links render**. `relatedGuides` (2) and `relatedPosts` (2) do render via `SemanticLinks`.
- **Available link targets:** indexable comparisons containing Linear → `/comparisons/asana-vs-linear` (keep) ; other published Linear comparisons: `linear-vs-jira`, `linear-vs-clickup` (published, but noindexed). Guides: `how-to-choose-project-management-software`, `project-management-pricing-guide` (both indexable). Blog: `best-project-management-software-2026`, `project-management-software-pricing`.
- **Cannibalization risk:** LOW — `/comparisons/linear-vs-jira*`, `/alternatives/linear-alternatives` (noindexed), `/best/best-project-management-*` (mostly noindexed).

## PAGE 5 — `/reviews/figma`

- **GSC impressions:** 38 (#5)
- **Current title:** `Figma Review (2026): Pricing, Pros, Cons & Top Alternatives` (59 → **clipped**)
- **Current meta description:** shared review template (see Page 4).
- **H1:** `Figma Review 2026`
- **H2/H3:** same 33-section review skeleton as Page 4; FAQ (20).
- **Main search intent:** *what Figma does, collaboration/design/prototyping capability, pricing, alternatives* — product evaluation.
- **Existing coverage:** strong (real-time collaboration, components/plugins, developer handoff, offline limits, performance limits, font licensing).
- **Content gaps:** Industry Fit (54 words) and Competitor Analysis (63 words) are thin; `whoShouldUse`/`whoShouldNotUse` exist in data but are not rendered; FAQ near-duplicates (`What is Figma best used for?` / `What is Figma best for?`, `How much does Figma cost?` / `How Figma pricing works?`).
- **Tables:** none rendered.
- **FAQs:** 20, in `FAQSchema`.
- **Structured data:** same as Page 4 (aggregateRating 4.8 / 2147).
- **Existing internal links:** sidebar `alternatives` = [canva] only; `SemanticLinks` comparisons = `figma-vs-sketch` → **`published: false`, filtered → 0 comparison links**.
- **Available link targets:** published + indexable comparisons → `figma-vs-adobe-xd` (keep), `figma-vs-framer` (keep), `canva-vs-sketch` (keep), `framer-vs-sketch` (keep). Guides → `design-software-buyers-guide`, `how-to-choose-design-software`, `software-evaluation-checklist` (all indexable). Blog → `figma-vs-sketch-deep-dive`, `prototyping-tools-comparison`, `design-software-cost-2026`. Reviews → `sketch`, `adobe-xd`, `framer`, `invision` (all indexable).
- **Cannibalization risk:** LOW — `/alternatives/figma-alternatives` is indexable but different intent (alternatives list vs review).

## PAGE 6 — `/use-cases/best-hr-for-small-business`

- **GSC impressions:** 35 (#6)
- **Current title:** `Best HR Software for Small Business 2026`
- **Current meta description:** `Best HR Software for Small Business: ADP (4/5), BambooHR (4.3/5), Gusto (4.5/5), Rippling (4.5/5). Selection criteria: Affordability, Ease of.` — **broken, cut mid-phrase**
- **H1:** `Best HR Software for Small Business 2026`
- **H2/H3:** Top Recommendations · Selection Criteria · Common Mistakes · FAQs · sidebar
- **Main search intent:** *which HR software is right for a small business* — commercial investigation.
- **Existing coverage:** 4 tools (ADP, BambooHR, Gusto, Rippling), 5 selection criteria, 4 pitfalls, 3 FAQs.
- **Content gaps — the weakest page in the wave:**
  - `useCaseDescription` is **generic template prose** ("Small Business teams face unique challenges when selecting hr & people software…") and never mentions HR itself: employee records, onboarding, payroll, time & attendance, compliance, integrations.
  - all 4 recommendations share **identical** `bestFor` ("Small Business hr & people needs") and **identical** `keyFeatures` ("Core platform / API access / Security") — no differentiation, no topical depth.
  - selection criteria are one-line and do not cover payroll, onboarding, time/attendance, compliance.
  - FAQ #2 states an unsupported flat price range.
  - `relatedComparisons` = `[]` → no comparison links; `relatedGuides` = 1.
- **Tables:** none.
- **FAQs:** 3, in `FAQSchema`.
- **Structured data:** same set as Page 1 (`ItemList` of 4 tools with ratings).
- **Existing internal links:** 4 recommendation cards → reviews; `InternalLinks` (HR & People).
- **Available link targets:** indexable comparisons → `bamboohr-vs-adp`, `gusto-vs-rippling`, `adp-vs-deel`, `rippling-vs-adp`, `gusto-vs-deel`. Guides (indexable) → `how-to-choose-hr-software`, `hr-software-pricing-guide`, `hr-software-buyers-guide`, `employee-onboarding-software-guide`? *(only indexable ones will be used)*. Blog → `hr-software-cost-2026`, `best-hr-software-2026`.
- **Cannibalization risk:** MEDIUM — `/blog/best-hr-software-2026` ("Best HR Software") and noindexed `/best/best-hr-people-small-business`.

## PAGE 7 — `/category/productivity`

- **GSC impressions:** 32 (#7)
- **Current title:** `Best Productivity Software 2026: Reviews & Buying Guide` (55 chars)
- **Current meta description:** template-generated (`Find the best productivity software with expert reviews… 51 tools tested and rated for 2026.`)
- **H1:** `Best Productivity Software 2026`
- **H2/H3:** same 16-block category skeleton as Page 2.
- **Main search intent:** *discover and compare productivity software* — category discovery.
- **Existing coverage:** rich prose (market overview, considerations, mistakes, decision factors, 6 FAQs).
- **Content gaps:** first screen does not say what "Productivity" covers here or what the visitor can do; no sub-topic organisation surfaced as links; `relatedCategories` = names → **0 links render**.
- **Tables:** none.
- **FAQs:** 6, in `FAQSchema`.
- **Structured data:** `WebPage`, `CollectionPage`, `ItemList`, `FAQ`, `Breadcrumb`.
- **Existing internal links:** 10 reviews (Notion, Todoist, Evernote, Obsidian, Roam, Calendly, Acuity, Cal.com, Jotform, Typeform), 4 comparisons, 8 guides, blog posts, `InternalLinks`.
- **Available link targets:** indexable guides → `how-to-choose-collaboration-software`, `remote-team-collaboration-guide`, `software-evaluation-checklist`, `task-management-systems-comparison`(check), `workflow-automation-guide`(check); indexable comparisons → `airtable-vs-notion`, `confluence-vs-notion`, `calendly-vs-acuity`, `calendly-vs-cal-com`; blog → `productivity-tools-cost-2026`, `note-taking-apps-comparison`, `task-management-software`, `time-tracking-tools`.
- **Cannibalization risk:** LOW — `/best/best-productivity-tools` exists but `best-productivity-software` is the only indexable `best` productivity page.

## PAGE 8 — `/blog/ai-software-cost-comparison-2026`

- **GSC impressions:** 29 (#8)
- **Current title:** `AI Software Cost Comparison 2026`
- **Current meta description:** `A transparent breakdown of what major AI tools actually cost in 2026, from free tiers to enterprise plans, to help you budget effectively.` (good, could name the pricing-model angle)
- **H1:** `AI Software Cost Comparison 2026`
- **H2/H3:** **none render correctly** — the body uses `## Headings`, which the blog template emits as literal paragraph text (`## ChatGPT Pricing Tiers`), and one markdown table is emitted as literal `| Tool | Free Tier | …` lines.
- **Main search intent:** *what does AI software cost in 2026, how do AI pricing models compare* — informational/commercial.
- **Existing coverage:** ChatGPT, Claude, Google (Workspace + consumer), Jasper tiers; a price-point comparison table; usage-based limits; plan-choice guidance.
- **Content gaps:** no explicit **pricing-model taxonomy** (flat subscription vs per-seat vs usage/token vs API vs hybrid); no **how to compare total cost** method; no **consumer vs team vs enterprise** framing as its own section; no note that enterprise quotes are non-public (mentioned only briefly).
- **Tables:** 1 markdown table (5 rows × 5 cols) — currently rendered as raw text.
- **FAQs:** none on the page, no `FAQSchema` (blog template emits only `BlogPosting` + `WebPage`).
- **Existing internal links:** `RelatedContent` → `relatedGuides` (1), `relatedComparisons` (3), `relatedGlossary` (5); auto "Related Reviews" (up to 3, derived from body mentions).
- **Cannibalization risk:** MEDIUM — `/blog/ai-pricing-models-explained` and `/guides/ai-tool-pricing-guide` (indexable) cover adjacent ground; `/blog/ai-tools-2026-guide` also overlaps.
- **Verified pricing present:** yes (ChatGPT/Claude/Gemini/Jasper figures already in the file). **No new 2026 price will be fabricated.**

## PAGE 9 — `/reviews/stripe`

- **GSC impressions:** 27 (#9)
- **Current title:** `Stripe Review (2026): Pricing, Pros, Cons & Top Alternatives` (60 → **clipped**)
- **Current meta description:** shared review template.
- **H1:** `Stripe Review 2026`
- **H2/H3:** same 33-section review skeleton; FAQ (20).
- **Main search intent:** *what Stripe is, fees/pricing, fit for a business, alternatives* — product evaluation.
- **Existing coverage:** strong (API-first, Radar fraud, Billing, Connect, 135+ currencies, support limits, account holds).
- **Content gaps:** `alternatives: []` → **sidebar "Alternatives" block does not render at all**; `relatedComparisons` = `["quickbooks-vs-xero"]` → `published: false` → **0 comparison links**; `relatedGuides`/`relatedPosts` do render; Industry Fit (51 words) thin; FAQ includes `Does Stripe work offline?` (poor fit for payment infrastructure) and near-duplicate pricing questions.
- **Tables:** none rendered.
- **FAQs:** 20, in `FAQSchema`.
- **Structured data:** same as Page 4 (aggregateRating 4.7 / 18000).
- **Available link targets:** published+relevant comparisons → `stripe-vs-paypal`, `stripe-vs-square`, `stripe-vs-paddle`. Reviews → `paypal`, `square`, `paddle` (all indexable). Guides (indexable) → `finance-software-buyers-guide`, `software-evaluation-checklist`, `saas-implementation-best-practices`. Blog → `quickbooks-vs-xero-guide`.
- **Cannibalization risk:** LOW — `/alternatives/stripe-alternatives` is noindexed.

## PAGE 10 — `/category/analytics-data`

- **GSC impressions:** 27 (#10)
- **Current title:** `Best Analytics & Data Software 2026: Reviews & Buying Guide` (59 chars → **clipped at 58**)
- **Current meta description:** template-generated (`Find the best analytics & data software… 49 tools tested and rated for 2026.`)
- **H1:** `Best Analytics & Data Software 2026`
- **H2/H3:** same 16-block category skeleton as Page 2.
- **Main search intent:** *discover/compare analytics & data platforms* — category discovery.
- **Existing coverage:** rich prose (warehouse/lake/lakehouse, BI, governance, pricing overview, 6 FAQs).
- **Content gaps:** category purpose not stated on first screen; sub-topics (BI, warehousing, product analytics, privacy analytics, data governance) exist only inside prose, not as navigable links; `relatedCategories` = names → **0 links render**.
- **Tables:** none.
- **FAQs:** 6, in `FAQSchema`.
- **Structured data:** `WebPage`, `CollectionPage`, `ItemList`, `FAQ`, `Breadcrumb`.
- **Existing internal links:** 9 reviews, comparisons, guides, blog, `InternalLinks`.
- **Available link targets:** indexable guides → `how-to-choose-analytics-software`, `analytics-pricing-guide`, `business-intelligence-platform-guide`, `data-governance-guide`, `data-engineering-pipeline-guide`, `saas-metrics-and-kpis`; indexable comparisons → `google-analytics-vs-matomo`, `google-analytics-vs-amplitude`, `google-analytics-vs-hotjar`, `amplitude-vs-hotjar`, `hotjar-vs-fullstory`; blog → `google-analytics-alternatives`, `ga4-vs-mixpanel`, `analytics-platform-cost-2026`, `best-analytics-platforms-2026`.
- **Cannibalization risk:** LOW — `/best/best-analytics-*` family mostly noindexed.

---

## Cross-page cannibalization matrix (Phase 5)

| Cluster | Target page | Overlapping indexable pages | Differentiation decision |
|---|---|---|---|
| SEO agency tools | `/use-cases/best-seo-for-agencies` | `/blog/best-seo-tools-for-agencies`, `/blog/seo-tool-stack-2026` | Use-case page = **agency operating model** (multi-client, white-label reporting, plan limits, evaluation). Blog = tool round-up. Cross-link with descriptive, non-identical anchors. |
| Accounting pricing | `/guides/accounting-software-pricing` | `/blog/accounting-software-cost-2026`, `/guides/how-to-choose-accounting-software` | Guide = **cost structures & TCO**; blog = annual cost analysis; how-to-choose = selection process. Cross-link each way. |
| AI cost | `/blog/ai-software-cost-comparison-2026` | `/blog/ai-pricing-models-explained`, `/guides/ai-tool-pricing-guide` | This post = **vendor-by-vendor price points + how to compare**; models guide = model taxonomy; tool guide = buying process. |
| Small-business HR | `/use-cases/best-hr-for-small-business` | `/blog/best-hr-software-2026`, noindexed `/best/best-hr-people-small-business` | Use-case page = **small-business decision criteria** (payroll, onboarding, compliance, budget). Blog = general round-up. |
| Reviews | `/reviews/{linear,figma,stripe}` | comparison & alternative pages | Reviews keep product-evaluation intent; comparisons/alternatives keep vs-list intent; link between them, do not merge. |
| Categories | `/category/{marketing-seo,productivity,analytics-data}` | `/best/*` (mostly noindexed) | Category = discovery hub. No change to `best` pages. |

**No page will be deleted or redirected.** Overlap is resolved by tightening each page's stated
purpose and by contextual cross-linking only.

---

## Trust inventory (Phase 7) — must be preserved, not weakened

- `/methodology` linked from all three content templates ("How we test" / "Our methodology").
- `/fact-checking-policy`, `/editorial-independence`, `/advertising-disclosure`,
  `/corrections-policy`, `/affiliate-disclosure` — all exist as routes; **untouched**.
- Review pages carry `Sources & Methodology`, "No vendor payment or sponsorship influenced this
  review", affiliate-commission disclosure, and `lastReviewed` dates — **untouched**.
- Ratings (`rating`, `reviewCount`) come from existing JSON — **no rating, review count, price,
  certification, customer number or market-share figure will be created in this wave.**
- Existing market/pricing figures inside category JSON are pre-existing project data; new prose
  will not add new numeric claims.

---

## Planned change set (Phase 2–4) — high value only

| # | Page | Data changes | Template changes |
|---|---|---|---|
| 1 | `/use-cases/best-seo-for-agencies` | fix broken description; rewrite intro; add pricing/evaluation criteria; fix `relatedComparisons` to `ahrefs-vs-semrush`; add `relatedGuides`/`relatedPosts` | pass curated related items to `EnhancedRelatedContent` (data-gated) |
| 2 | `/category/marketing-seo` | clarify `description`; convert `relatedCategories` to slugs; add `internalLinks`; add optional `metaDescription` | render `knowledge.internalLinks` when present; prefer `metaDescription` for `<meta description>` |
| 3 | `/guides/accounting-software-pricing` | rewrite description; add monthly-vs-annual / per-user / by-business-size / evaluation sections; point `relatedGuides` at indexable guides; add `relatedPosts` | render `RelatedContent` for guides (data-gated) |
| 4 | `/reviews/linear` | `seoTitle`/`seoDescription`; replace dead `relatedComparisons` with published ones; expand thin sections; de-duplicate 2 FAQ pairs | honour optional `seoTitle`/`seoDescription` in review metadata (fallback = current template) |
| 5 | `/reviews/figma` | same as #4 | same as #4 |
| 6 | `/use-cases/best-hr-for-small-business` | fix broken description; rewrite intro around real HR scope; per-tool `bestFor`/`keyFeatures` sourced from each tool's own review JSON; expand criteria; remove unsupported price range; add `relatedComparisons`/`relatedGuides`/`relatedPosts` | pass curated related items to `EnhancedRelatedContent` (data-gated) |
| 7 | `/category/productivity` | same treatment as #2 | same as #2 |
| 8 | `/blog/ai-software-cost-comparison-2026` | retitle + strengthen description; add pricing-model / total-cost / plan-type sections using only figures already in the file | render markdown `##` headings, tables and `**bold**` as HTML so the H2 structure exists |
| 9 | `/reviews/stripe` | `seoTitle`/`seoDescription`; populate `alternatives`; replace dead comparison with published Stripe comparisons; de-duplicate weak FAQ | same as #4 |
| 10 | `/category/analytics-data` | same treatment as #2 | same as #2 |

**Explicitly NOT changing:** URLs, route files' paths, `generateStaticParams`, sitemap, robots,
`noindex-list.json`, database/schema, affiliate logic, trust/editorial pages, any page outside the 10.
