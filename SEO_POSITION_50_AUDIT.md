# SEO_POSITION_50_AUDIT.md

**Project:** PilotStack (Next.js 16 App Router, content-driven from `content/**.json`)
**Date:** 2026-09-29
**Scope:** Existing pages receiving Google Search Console impressions at approximately positions 30–60.
**Method:** Static audit of route templates, metadata generation, content JSON, structured-data emission, published/noindex state, and internal-link graph. No GSC export file exists in the repository, so the impression/query signals supplied in the brief are used as the primary prioritisation input, supplemented by published-content availability checks.

---

## 0. How this site actually renders (read this first)

Understanding the render pipeline was a prerequisite for a correct audit, because several SEO-relevant
fields exist in the content schema but are **never rendered**, and several rendered values are
**not** taken from the content file.

| Route | Template | Title source | H1 source | Meta description source | Related links actually rendered |
|---|---|---|---|---|---|
| `/use-cases/[slug]` | `src/app/use-cases/[slug]/page.tsx` | `uc.title` | `uc.title` (EditorialHero) | `truncate(uc.description,160)` | `InternalLinks` (category), `EnhancedRelatedContent` **called with no `items` → renders nothing** |
| `/guides/[slug]` | `src/app/guides/[slug]/page.tsx` | `guide.title` | `guide.title` (EditorialHero) | `truncate(guide.description,160)` | `InternalLinks` (category) only. `relatedGuides` / `relatedComparisons` / `relatedTools` / `relatedPosts` **declared but never rendered** |
| `/category/[slug]` | `src/app/category/[slug]/page.tsx` | hardcoded `Best {name} Software 2026: Reviews & Buying Guide` | hardcoded `Best {name} Software 2026` | hardcoded template string | `knowledge.relatedCategories` **broken** (see §2), `knowledge.internalLinks` **declared in `CategoryKnowledge` but never rendered** |
| `/reviews/[slug]` | `src/app/reviews/[slug]/page.tsx` | hardcoded `{name} Review (2026): Pricing, Pros, Cons & Top Alternatives` | `{name} Review 2026` | hardcoded template string | `SemanticLinks` renders `relatedComparisons`/`relatedGuides`/`relatedPosts`/`alternatives` (**filtered to published only**) |
| `/comparisons/[slug]` | `src/app/comparisons/[slug]/page.tsx` | hardcoded `{tool1} vs {tool2} (2026): Which One Wins?` | `cmp.title` | `cmp.description` | `InternalLinks` (category) only. `relatedGuides` / `relatedComparisons` / `relatedPosts` **declared but never rendered** |

Additional shared behaviour:

* `createMetadata()` (`src/lib/metadata.ts`) hard-truncates every title at **58** characters at a word boundary, and every description at **160**.
* `noindex-list.json` suppresses 1,351 of 1,799 content files. `isNoindexed()` is honoured by
  `reviews`, `comparisons`, `best`, `alternatives`, `glossary`, `statistics`, `research`, `blog`
  templates and by `sitemap.ts`. **Guides are only filtered out of `generateStaticParams`; their
  metadata never sets `noIndex`.** Categories never consult it at all.
* Guides' `FAQPage` schema is currently built from `guide.sections.slice(0,5)` → *question = section
  title, answer = 120-char truncation of the section body*. Those are not questions. This is an
  accuracy problem (Phase 7), not a ranking lever.

### Publication state of the link targets the priority pages already reference

Checked against `published !== false` **and** `noindex-list.json`:

| Referenced slug | Referenced from | State |
|---|---|---|
| `semrush-vs-ahrefs` | use-case SEO-agencies, Ahrefs review, SEMrush review, SEO toolkit guide | **`published:false` → unreachable.** Published twin exists: `ahrefs-vs-semrush` |
| `quickbooks-vs-xero`, `quickbooks-vs-freshbooks` | QuickBooks review, Xero review, 2 accounting guides | **`published:false` → unreachable.** No published Finance & Accounting comparison exists at all |
| `notion-vs-linear` | Linear review | **`published:false` → unreachable.** Published twin for the GSC query exists: `asana-vs-linear` |
| `figma-vs-sketch` | Figma review, Canva review | **`published:false` → unreachable.** Published: `figma-vs-adobe-xd`, `figma-vs-framer`, `canva-vs-sketch` |
| `asana-vs-monday-com` | Asana review | **`published:false` → unreachable.** Published: `asana-vs-linear`, `asana-vs-clickup`, `asana-vs-trello` |
| `semrush-vs-moz`, `mailchimp-vs-activecampaign` | Ahrefs vs SEMrush | **`noindex`** |
| `linear-vs-jira`, `notion-vs-clickup` | Asana vs Linear | **`noindex`** |

Net effect: **18 of 89 checked internal relations on the priority pages point at content that cannot
be reached**, so `SemanticLinks` silently drops them and the guide/use-case/comparison templates never
emit them at all.

---

## 1. Selected pages (15)

Prioritisation: explicit GSC impression signals first, then the strongest same-cluster neighbours that
can be improved through content quality, topical coverage and internal linking only.

### P1 — explicit GSC signals

---

### A. `/use-cases/best-seo-for-agencies` — **PRIORITY: HIGH**

* **Main target query:** `best tools for seo agency` / `best seo software for agencies`
* **Secondary query cluster:** `agency seo tools`, `seo software for an agency`, `seo tools for digital agency`, `seo campaign management software`, `seo reporting tools for agencies`, `seo management software for agencies`
* **GSC:** ~62 impressions
* **Current title:** `Best SEO Tools for Agencies 2026` (32 chars, no truncation)
* **Current H1:** `Best SEO Tools for Agencies 2026`
* **Current meta description:** `Best SEO Tools for Agencies: Ahrefs (4.7/5), SEMrush (4.6/5). Selection criteria: Multi-project management and scalability, White-label and.` — **cut mid-phrase ("and.")**
* **H2/H3:** Top Recommendations · Selection Criteria · Common Mistakes · FAQs (all `<h2>`); recommendation names are links, not headings
* **Search intent:** transactional/commercial investigation — "give me the best SEO tools *for running an agency*", i.e. multi-client, white-label, reporting, scalability.
* **Main topic:** agency SEO tooling. **Secondary:** multi-client management, white-label reporting, rank tracking, technical SEO, keyword research, backlink analysis, API/integrations, pricing limits.
* **Existing strengths:** `useCaseDescription` is genuinely agency-specific and already covers keyword research, rank tracking, backlink analysis, site auditing, white-label reporting, multi-project dashboards, team collaboration, report templates, API access and GSC/GA integration. Six weighted selection criteria. Four solid FAQs including verified project-limit data. Breadcrumb/Article/CollectionPage/ItemList/About/FAQ schema present.
* **Content gaps:**
  1. Meta description is truncated machine output — the single biggest CTR defect at position 30–60.
  2. Query cluster terms `campaign management`, `reporting tools`, `digital agency` have no natural heading-level coverage.
  3. Only **2** recommendations for a "best tools" query — thin topical completeness vs. the SERP.
  4. No pricing/scalability consideration as a named criterion.
  5. No at-a-glance comparison table (Phase 3.5).
  6. `EnhancedRelatedContent` renders **nothing** (no `items` passed).
* **Internal-link opportunities:**
  * `relatedComparisons: ["semrush-vs-ahrefs"]` → dead; repoint to **`/comparisons/ahrefs-vs-semrush`** (published).
  * `relatedGuides: ["building-your-seo-toolkit"]` → valid but **never rendered**.
  * Add contextual links to `/reviews/ahrefs`, `/reviews/semrush`, `/reviews/moz`, `/category/marketing-seo`.
* **Cannibalization risk:** **MEDIUM.**
  * `/best/marketing-seo-agencies` ("Best Marketing & SEO Software for Agencies") is `published:false` → 404, so it is *not* competing. Do not revive it.
  * `/use-cases/best-marketing-for-agencies` (Marketing Software for Agencies) overlaps but is a broader marketing stack; keep this page SEO-tool-only.
  * `/category/marketing-seo` must own "marketing & SEO software" generically, not "SEO tools for agencies".
* **Recommended changes:** rewrite `description`; add 2 selection criteria (campaign management/workflow, pricing & plan limits); add 4 FAQs covering campaign management software, reporting cadence, digital-agency stack, integrations/scalability; add Moz as a third recommendation using its existing published review data; align recommendation ratings with the canonical review ratings; repoint `relatedComparisons`; render related links + comparison table.
* **Priority: HIGH**

---

### B. `/guides/accounting-software-pricing` — **PRIORITY: HIGH**

* **Main target query:** `accounting software pricing` / `accounting software price`
* **Secondary query cluster:** `accounting software guide`, `accounting software for investment company`, `fixed pricing for accounting firms`
* **GSC:** ~60 impressions
* **Current title:** `Accounting Software Pricing Guide 2026` (38 chars)
* **Current H1:** `Accounting Software Pricing Guide 2026`
* **Current meta description:** `Intermediate Finance & Accounting guide (~10 min read): how to evaluate the right Accounting Software Pricing.` — **template filler, ungrammatical, no price/value proposition**
* **H2/H3:** 12 numbered `<h2>` sections (pricing models → QuickBooks → Xero → FreshBooks → Wave → comparison table → hidden costs → enterprise → free plans → ROI → TCO checklist → FAQ list)
* **Search intent:** informational/commercial — "what does accounting software cost and how is it priced".
* **Main topic:** accounting software pricing models and total cost. **Secondary:** payment-processing fees, add-ons, enterprise/ERP pricing, free tiers, ROI, TCO.
* **Existing strengths:** genuinely detailed, vendor-specific, has a real comparison table (4 rows × 6 cols), a 10-item hidden-cost list, a 14-item TCO checklist and a 10-question FAQ list. `relatedTools: quickbooks/xero/freshbooks`. Numbers are internally consistent.
* **Content gaps:**
  1. Meta description is unusable.
  2. Cluster terms **`accounting software for investment company`** and **`fixed pricing for accounting firms`** are not covered anywhere on the page (per-company/partner pricing is mentioned in passing in §0; multi-entity is buried in the hidden-cost list).
  3. **Bug:** `section.type === "checklist"` renders `section.body.split("?")` and **ignores `section.items`** → the entire 14-item TCO checklist (the highest-value block on the page) is *not rendered*; only the intro sentence shows up as a pseudo-question ending in "?". Same bug affects **17 of 19 checklist sections across guides**.
  4. No `FAQPage` schema: schema is generated from section titles (inaccurate), while the real Q&A in §11 is schema-less and not shown as an FAQ block.
  5. `relatedComparisons` points at two unpublished pages; `relatedGuides`/`relatedTools` are never rendered.
* **Internal-link opportunities:** `/guides/how-to-choose-accounting-software`, `/guides/cloud-accounting-software-guide`, `/guides/finance-software-buyers-guide`, `/reviews/quickbooks`, `/reviews/xero`, `/reviews/freshbooks`, `/category/finance-accounting`.
* **Cannibalization risk:** **LOW.** `/guides/how-to-choose-accounting-software` owns *selection*; this page owns *pricing*. Keep the split explicit — the pricing page must not become a "how to choose" page.
* **Recommended changes:** rewrite `description`; fix the checklist renderer; convert §11 into a real `faqs` array rendered as an FAQ section and used for `FAQPage` schema; add one section covering firm/investment-company pricing models using only statements already present in the page (Xero partner pricing, QuickBooks Online Accountant, multi-entity costs, Sage Intacct); repoint `relatedComparisons` → published guides; render related tools/guides.
* **Priority: HIGH**

---

### C. `/category/marketing-seo` — **PRIORITY: HIGH**

* **Main target query:** `marketing & seo software` / `best marketing and SEO software`
* **Secondary query cluster:** category-level SEO/marketing software queries (`seo software`, `marketing tools`, `best seo tools`, tool-category comparisons)
* **GSC:** ~71 impressions (highest of the set)
* **Current title:** `Best Marketing & SEO Software 2026: Reviews & Buying Guide` (exactly 58 chars — no truncation, but at the limit)
* **Current H1:** `Best Marketing & SEO Software 2026`
* **Current meta description:** `Find the best marketing & seo software with expert reviews, pricing comparisons, and buying tips. 9 tools tested and rated for 2026.` — lower-cased `marketing & seo` reads as machine output.
* **H2/H3:** Market Overview · Best in Marketing & SEO 2026 · AI Search Overview · Your Buying Journey · What to Consider Before Buying · Common Buying Mistakes · Decision Framework · Best Software by Use Case · Pricing Overview · All Marketing & SEO Reviews · Comparisons · Buying Guides · Related Terms · Latest Research · Related Categories · Frequently Asked Questions
* **Search intent:** navigational/commercial category hub — "show me the software in this category and help me shortlist".
* **Main topic:** marketing & SEO software category. **Secondary:** market overview, buying journey, decision factors, pricing bands, per-use-case picks.
* **Existing strengths:** genuinely long-form; `longDescription`, `marketOverview`, `pricingOverview`, `buyerConsiderations`, `commonMistakes`, `decisionFactors`, `buyerJourney`, `bestFor`, 6 FAQs; CollectionPage/ItemList/FAQ/Breadcrumb/WebPage schema.
* **Content gaps:**
  1. **`knowledge.relatedCategories` never renders** — all 12 category files store *names* (`"CRM & Sales"`) but the template matches `categories.find(c => c.slug === rcSlug)` (`crm-sales`). The entire Related Categories block is dead on every category page.
  2. `knowledge.internalLinks` is declared in `CategoryKnowledge` but never rendered, and no category file populates it.
  3. "Key Entities" chips (top tools) are `<span>`, not links — a listed-but-unlinked entity set.
  4. Meta description is a lower-cased template string.
  5. No SEO-tool-specific FAQ coverage beyond one generic "What is SEO…" question.
* **Internal-link opportunities:** `/reviews/ahrefs`, `/reviews/semrush`, `/reviews/moz`, `/reviews/mailchimp`, `/guides/building-your-seo-toolkit`, `/use-cases/best-seo-for-agencies`, `/guides/email-marketing-pricing-guide`.
* **Cannibalization risk:** **LOW–MEDIUM.** Must not absorb "best SEO tools for agencies" (owned by A). Keep category FAQs generic to the category, not agency-specific.
* **Recommended changes:** fix `relatedCategories` lookup (name-or-slug); render `knowledge.internalLinks` and populate it for this category; link the entity chips; add optional `seoTitle`/`seoDescription` support and set a natural description; add 2 category-level SEO FAQs; keep H1/title.
* **Priority: HIGH**

---

### D. `/reviews/linear` — **PRIORITY: HIGH**

* **Main target query:** `linear reviews` / `linear review`
* **Secondary query cluster:** `linear project management tool`, `asana vs linear`
* **GSC:** ~42 impressions
* **Current title:** `Linear Review (2026): Pricing, Pros, Cons & Top Alternatives` (60 chars) → **truncated by `createMetadata` to** `Linear Review (2026): Pricing, Pros, Cons & Top…`
* **Current H1:** `Linear Review 2026`
* **Current meta description:** `Hands-on Linear review. See real pros, cons, pricing details, and the best alternatives before you buy. Expert-tested for 2026.` — identical template on all 151 reviews, no Linear-specific terms.
* **H2/H3:** Identity/Quick Answer/TL;DR/Key Takeaways (h2) → Who should buy / Who should avoid → Pros & Cons → Third-Party Reviews → Rating Overview → Company Overview → Security & Compliance → Capabilities → Use Cases & Fit → Integrations → Pricing Plans → Before You Buy → 33 content sections → Feature Breakdown → Top Alternatives → Sources & Methodology → FAQ (20) → Related Content.
* **Search intent:** review/commercial investigation for Linear as a PM/issue-tracking tool.
* **Main topic:** Linear. **Secondary:** issue tracking, cycles/roadmaps, Jira alternative, pricing, integrations, AI triage.
* **Existing strengths:** 33 content sections, 20 FAQs, pros/cons, entity data (company, security, capabilities, use cases, integrations, pricing plans), full schema stack (Product + Review + SoftwareApplication + WebPage + Article + FAQ), Sources & Methodology + affiliate disclosure, sidebar rating breakdown.
* **Content gaps / defects:**
  1. Title truncated mid-phrase in the SERP.
  2. **Factual contradiction on the same page:** Executive Summary says *"over 3,500 user reviews with a 4.8/5 rating"* while TL;DR, Rating Overview, Industry Fit, the visible badge, the sidebar and `Product.aggregateRating` all say **893**. This is the clearest E-E-A-T defect found in the audit.
  3. `relatedComparisons: ["notion-vs-linear"]` is unpublished → `SemanticLinks` drops it, so the review currently emits **zero comparison links**, even though `/comparisons/asana-vs-linear` is published and is the page that should own the `asana vs linear` query.
  4. `relatedGuides` valid but could carry the pricing intent (`project-management-pricing-guide`).
* **Internal-link opportunities:** `/comparisons/asana-vs-linear` (published, owns the comparison query), `/comparisons/linear-vs-clickup`? → **no** (noindex); `/reviews/clickup`, `/reviews/jira`, `/reviews/asana`, `/guides/how-to-choose-project-management-software`, `/guides/project-management-pricing-guide`, `/category/project-management`.
* **Cannibalization risk:** **MEDIUM.** `/comparisons/asana-vs-linear` must own `asana vs linear`. The review should **link to** it, never target it. `/alternatives/linear-alternatives` is `noindex`.
* **Recommended changes:** add `seoTitle`/`seoDescription`; correct the 3,500 → 893 contradiction; set `relatedComparisons: ["asana-vs-linear", "notion-vs-linear"]`; add `project-management-pricing-guide` to `relatedGuides`.
* **Priority: HIGH**

---

### E. `/reviews/figma` — **PRIORITY: HIGH**

* **Main target query:** `figma review`
* **Secondary query cluster:** `figma pricing`, `figma alternatives`, design-tool comparisons
* **GSC:** ~27 impressions
* **Current title:** `Figma Review (2026): Pricing, Pros, Cons & Top Alternatives` (59) → **truncated to** `Figma Review (2026): Pricing, Pros, Cons & Top…`
* **Current H1:** `Figma Review 2026`
* **Current meta description:** same 151-review template — no Figma-specific terms.
* **H2/H3:** same structural stack as `/reviews/linear` (33 content sections, 20 FAQs).
* **Search intent:** review/commercial investigation for Figma.
* **Main topic:** Figma. **Secondary:** collaborative interface design, prototyping, design systems, Sketch/Adobe XD alternatives, freemium pricing.
* **Existing strengths:** deep section coverage, entity data (4M+ users, SOC 2/ISO 27001, integrations), full schema, methodology + disclosure.
* **Content gaps / defects:**
  1. Title truncated.
  2. `relatedComparisons: ["figma-vs-sketch"]` is unpublished → dropped; **zero comparison links** render despite three published Figma comparisons existing.
  3. Generic meta description.
* **Internal-link opportunities:** `/comparisons/figma-vs-adobe-xd`, `/comparisons/figma-vs-framer`, `/reviews/canva`, `/reviews/sketch`, `/reviews/adobe-xd`, `/guides/design-software-buyers-guide`, `/category/design-creative`.
* **Cannibalization risk:** **LOW.** `/alternatives/figma-alternatives` is `published:false` → 404; do not revive.
* **Recommended changes:** add `seoTitle`/`seoDescription`; repoint `relatedComparisons` to published comparisons; keep H1.
* **Priority: HIGH**

---

### P2 — same-cluster high-opportunity pages

---

### F. `/reviews/ahrefs` — **PRIORITY: HIGH**

* **Main query:** `ahrefs review`; **cluster:** `ahrefs pricing`, `ahrefs vs semrush`, `seo tool`
* **Current title:** `Ahrefs Review (2026): Pricing, Pros, Cons & Top Alternatives` (60) → **truncated**
* **Meta:** shared 151-review template.
* **Strengths:** 31 sections, 20 FAQs, entity data, full schema.
* **Gaps:** truncated title; `relatedComparisons: ["semrush-vs-ahrefs"]` unpublished → no comparison link rendered even though `/comparisons/ahrefs-vs-semrush` exists and is the canonical page for the Ahrefs/SEMrush query.
* **Internal-link opportunity:** `/comparisons/ahrefs-vs-semrush`, `/comparisons/ahrefs-vs-moz`, `/guides/building-your-seo-toolkit`.
* **Cannibalization:** must not compete with `/comparisons/ahrefs-vs-semrush` for `ahrefs vs semrush`.
* **Priority: HIGH**

### G. `/reviews/semrush` — **PRIORITY: HIGH**

* **Main query:** `semrush review`; **cluster:** `semrush pricing`, `seo software`, `agency seo tools`
* **Title:** truncated (61 chars). **Meta:** shared template.
* **Strengths:** 33 sections, 20 FAQs, entity data.
* **Gaps:** same dead `semrush-vs-ahrefs` reference; `relatedGuides` omits the SEO toolkit guide that is the natural next read for this cluster.
* **Internal-link opportunity:** `/comparisons/ahrefs-vs-semrush`, `/guides/building-your-seo-toolkit`, `/use-cases/best-seo-for-agencies`.
* **Cannibalization:** review owns `semrush review`; comparison owns `ahrefs vs semrush`.
* **Priority: HIGH**

### H. `/guides/building-your-seo-toolkit` — **PRIORITY: HIGH**

* **Main query:** `SEO toolkit` / `build an SEO stack`; **cluster:** `keyword research tools`, `rank tracking`, `SEO reporting`
* **Current title:** `SEO Stack: Building Your Toolkit` (32) — clear but does not surface "SEO tools/guide".
* **Current meta:** `Intermediate Marketing & SEO guide (~12 min read): how to evaluate the right SEO Stack. Start with SEMrush or Ahrefs to uncover high-volume,.` — **cut mid-sentence.**
* **H2/H3:** Keyword Research Tools · Technical SEO Auditing · Backlink Analysis and Link Building · Content Optimization · Rank Tracking and Position Monitoring · Building Automated Reports · Toolkit Selection Checklist
* **Strengths:** exactly the section set the agency query cluster needs (incl. *Building Automated Reports*).
* **Gaps:** truncated meta; `relatedComparisons: ["semrush-vs-ahrefs"]` unpublished; `relatedTools` (`semrush`, `ahrefs`, `google-analytics`) never rendered; checklist section drops its items (same bug as B).
* **Internal-link opportunities:** `/reviews/ahrefs`, `/reviews/semrush`, `/comparisons/ahrefs-vs-semrush`, `/use-cases/best-seo-for-agencies`, `/category/marketing-seo`.
* **Cannibalization:** LOW — this page owns *how to build the stack*; A owns *best tools for agencies*.
* **Priority: HIGH**

### I. `/comparisons/ahrefs-vs-semrush` — **PRIORITY: MEDIUM**

* **Main query:** `ahrefs vs semrush`; **cluster:** `semrush or ahrefs`, `which is better for SEO`
* **Current title:** `Ahrefs vs SEMrush (2026): Which One Wins?` (41). **H1:** `Ahrefs vs SEMrush`. **Meta:** truncated at 160 (`...SEMrush from.`).
* **Strengths:** 39 feature rows, 25 FAQs, 12.9k-char verdict, review/Product/Software schema.
* **Gaps:** meta cut mid-sentence; `relatedComparisons` (`semrush-vs-moz`, `mailchimp-vs-activecampaign`) are both `noindex` → related block would be empty; no rendered related-guides block at all despite `relatedGuides` being declared.
* **Internal-link opportunities:** `/reviews/ahrefs`, `/reviews/semrush`, `/guides/building-your-seo-toolkit`, `/comparisons/ahrefs-vs-moz`.
* **Cannibalization:** **HIGH if not handled** — this page must remain the sole owner of `ahrefs vs semrush`; the two reviews link *to* it.
* **Priority: MEDIUM**

### J. `/guides/how-to-choose-accounting-software` — **PRIORITY: MEDIUM**

* **Main query:** `how to choose accounting software`; **cluster:** `accounting software selection`, `accounting software guide`
* **Current title:** `How to Choose Accounting Software` (33). **Meta:** `Beginner Finance & Accounting guide (~15 min read): how to evaluate the right Accounting Software. Accounting software is the financial backbone.` — cut mid-thought.
* **Strengths:** 10 sections incl. scorecard, TCO, budget-by-business-type, FAQ section; `relatedTools: quickbooks/xero/freshbooks`.
* **Gaps:** truncated meta; dead `quickbooks-vs-*` comparisons; `relatedGuides`/`relatedTools` never rendered; checklist section drops its 10 items.
* **Internal-link opportunities:** `/guides/accounting-software-pricing`, `/guides/finance-software-buyers-guide`, `/reviews/quickbooks`, `/reviews/xero`, `/category/finance-accounting`.
* **Cannibalization:** **MEDIUM** vs. B — this page owns *selection criteria*, B owns *pricing*. Make the split explicit in each page's intro and cross-link with descriptive anchors.
* **Priority: MEDIUM**

### K. `/reviews/quickbooks` — **PRIORITY: MEDIUM**

* **Main query:** `quickbooks review`; **cluster:** `quickbooks pricing`, `quickbooks cost`
* **Title:** truncated (64 chars — worst in the set). **Meta:** shared template.
* **Strengths:** 28 sections, 20 FAQs, entity data.
* **Gaps:** title truncation; `relatedComparisons: ["quickbooks-vs-xero"]` unpublished → no comparison link; `relatedGuides` omits the pricing guide.
* **Internal-link opportunity:** `/guides/accounting-software-pricing`, `/guides/how-to-choose-accounting-software`, `/reviews/xero`, `/reviews/freshbooks`.
* **Priority: MEDIUM**

### L. `/reviews/xero` — **PRIORITY: MEDIUM**

* **Main query:** `xero review`; **cluster:** `xero pricing`, `xero vs quickbooks`
* **Title:** 58 chars — *just* survives truncation. **Meta:** shared template.
* **Gaps:** dead `quickbooks-vs-xero`; `relatedGuides: ["saas-metrics-and-kpis","crm-selection-guide"]` is **off-topic** for a cloud accounting review (should be accounting guides).
* **Internal-link opportunity:** `/guides/accounting-software-pricing`, `/guides/cloud-accounting-software-guide`, `/reviews/quickbooks`, `/reviews/freshbooks`.
* **Priority: MEDIUM**

### M. `/reviews/asana` — **PRIORITY: MEDIUM**

* **Main query:** `asana review`; **cluster:** `asana pricing`, `asana vs linear`
* **Title:** truncated (59). **Meta:** shared template.
* **Gaps:** `relatedComparisons: ["asana-vs-monday-com"]` unpublished → no comparison link even though `/comparisons/asana-vs-linear` is published and is a GSC query for the Linear cluster.
* **Internal-link opportunity:** `/comparisons/asana-vs-linear`, `/comparisons/asana-vs-clickup`, `/reviews/linear`, `/guides/how-to-choose-project-management-software`.
* **Cannibalization:** review owns `asana review`; comparison owns `asana vs linear`.
* **Priority: MEDIUM**

### N. `/comparisons/asana-vs-linear` — **PRIORITY: MEDIUM**

* **Main query:** `asana vs linear`; **cluster:** `linear vs asana`, `which is better`
* **Current title:** `Asana vs Linear (2026): Which One Wins?` (39). **H1:** `Asana vs Linear`. **Meta:** truncated at 160 (`...Asana from Free – $24.99/mo per user,.`).
* **Strengths:** 39 features, 25 FAQs, published & in `keep`.
* **Gaps:** truncated meta; `relatedComparisons` includes two `noindex` slugs; no rendered related-guides block.
* **Internal-link opportunities:** `/reviews/asana`, `/reviews/linear`, `/guides/how-to-choose-project-management-software`, `/guides/project-management-pricing-guide`.
* **Cannibalization:** **HIGH if not handled** — must remain the owner of `asana vs linear`.
* **Priority: MEDIUM**

### O. `/reviews/canva` — **PRIORITY: MEDIUM**

* **Main query:** `canva review`; **cluster:** `canva vs figma`, `figma alternative`
* **Title:** truncated (59). **Meta:** shared template.
* **Gaps:** `relatedComparisons: ["figma-vs-sketch"]` unpublished; alternatives include `figma` ✓.
* **Internal-link opportunity:** `/comparisons/canva-vs-sketch`, `/comparisons/canva-vs-framer`, `/reviews/figma`, `/guides/design-software-buyers-guide`.
* **Priority: MEDIUM**

---

## 2. Cross-cutting defects found (fix once, benefit every selected page)

| # | Defect | Where | Fix |
|---|---|---|---|
| D1 | Checklist sections ignore `section.items` → 17 guide checklists render only their intro sentence | `src/app/guides/[slug]/page.tsx` | Render `items` when present; keep the `body.split("?")` fallback |
| D2 | `relatedCategories` matches on `slug` but data stores `name` → Related Categories never renders on any of the 12 category pages | `src/app/category/[slug]/page.tsx` | Match name **or** slug |
| D3 | `knowledge.internalLinks` declared in `CategoryKnowledge`, never rendered, never populated | category template + `marketing-seo.json` | Render when present; populate for the target category |
| D4 | `EnhancedRelatedContent` invoked with no `items` → dead call | use-case template | Pass real items from `relatedComparisons`/`relatedGuides` |
| D5 | `relatedGuides`/`relatedComparisons`/`relatedTools`/`relatedPosts` declared on guides, use-cases and comparisons but never rendered | guide / use-case / comparison templates | Render as filtered, contextually-labelled related blocks |
| D6 | Review titles are 59–64 chars → `createMetadata` truncates almost every review title mid-phrase | review template | Optional per-page `seoTitle` (opt-in; only selected pages change) |
| D7 | Review meta descriptions are one identical template across 151 pages | review template | Optional per-page `seoDescription` (opt-in) |
| D8 | Guide `FAQPage` schema built from section titles, not questions | guide template | Use real `guide.faqs` when present; leave fallback untouched elsewhere |
| D9 | 18 of 89 internal relations on target pages point at unpublished/noindex content | content JSON | Repoint to published equivalents or drop |
| D10 | Recommendation ratings on the SEO-agency use case (4.7 / 4.6) disagree with the canonical reviews (4.6 / 4.5) and with `/best/marketing-seo-agencies` | `best-seo-for-agencies.json` | Align to the review source of truth |

---

## 3. Cannibalization register

| Intent | Canonical owner | Must not compete | Resolution |
|---|---|---|---|
| `best seo software for agencies` | `/use-cases/best-seo-for-agencies` | `/best/marketing-seo-agencies` (already `published:false` — leave it), `/use-cases/best-marketing-for-agencies` | Keep A SEO-tool-specific; keep marketing-for-agencies on the broader marketing stack |
| `marketing & seo software` | `/category/marketing-seo` | `/use-cases/best-seo-for-agencies` | Category stays generic; no agency-specific FAQ added there |
| `ahrefs vs semrush` | `/comparisons/ahrefs-vs-semrush` | `/reviews/ahrefs`, `/reviews/semrush` | Reviews link to the comparison; neither review targets the head-to-head term |
| `asana vs linear` | `/comparisons/asana-vs-linear` | `/reviews/linear`, `/reviews/asana` | Reviews link to the comparison |
| `figma review` | `/reviews/figma` | `/alternatives/figma-alternatives` (already `published:false`) | Leave unpublished |
| `accounting software pricing` | `/guides/accounting-software-pricing` | `/guides/how-to-choose-accounting-software` (§"Total Cost of Ownership") | Pricing page owns cost/price models; selection guide owns criteria — stated explicitly in each intro |
| `quickbooks vs xero` | *no published owner* | quickbooks/xero reviews | Do not create a page; do not link to the unpublished comparison |

---

## 4. What will NOT be done

* No URL, route, filename, sitemap or `noindex-list.json` changes.
* No new pages, no page deletions, no redirects.
* No database or content-schema migrations (only **optional** additive fields).
* No invented prices, ratings, review counts, customer numbers, integrations or certifications.
* No keyword stuffing; no doorway or duplicate pages; no universal "winner" declarations added.
* No affiliate-link or monetization changes; no removal of legal/trust/disclosure blocks.
* No mass rewrite of the 151 reviews / 130 guides / 50 comparisons — changes are opt-in per content file.
