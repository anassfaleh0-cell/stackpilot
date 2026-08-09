# Phase 9 — Internal Authority Map (Flagship Link Strategy)

> Sprint 21 · Internal-linking plan that concentrates the site's strongest existing authority onto the flagship (**SaaS Pricing Benchmark 2026**, `/research/saas-pricing-benchmark-2026`) and spreads its equity back to category pages, pricing guides, and the review corpus.

---

## 1. Authority Flow Map

```
                 ┌────────────────────────────┐
                 │  HOMEPAGE (highest DR)     │
                 │  "Featured Research" card  │  ← NEW (this sprint)
                 └──────────────┬─────────────┘
                                │
                 ┌──────────────▼─────────────┐
                 │  /research (index, newest  │
                 │  first — auto)             │
                 └──────────────┬─────────────┘
                                │
                 ┌──────────────▼───────────────┐
                 │  FLAGSHIP: saas-pricing-     │
                 │  benchmark-2026              │
                 └──────┬──────────────┬────────┘
                        │              │
        ┌───────────────▼────┐   ┌─────▼─────────────────┐
        │ Outbound (done in  │   │ Inbound planned:      │
        │ JSON related*):    │   │ - pricing guides      │
        │ 5 comparisons      │   │   (software-cost-     │
        │ 5 guides           │   │   analysis, accounting│
        │ 4 blog posts       │   │   -pricing, crm-      │
        └────────────────────┘   │   pricing, ...)       │
                                │ - 12 category pages    │
                                │ - blog pricing posts   │
                                └────────────────────────┘
```

## 2. Inbound Links — Implemented This Sprint

| Source | Implementation | Anchor | Status |
|--------|---------------|--------|--------|
| Homepage | New "Featured Research" section (3 latest reports; flagship is newest → first card) | Report title (branded partial) | **Implemented** (`src/app/page.tsx`) |
| `/research` index | Auto-listed; sorted by date desc → flagship appears first | Title + description | Auto (registry) |
| Sitemap | `/research/<slug>` auto-added via `getAllResearch()` | — | Auto |
| llms.txt | Listed under "Research reports" section | — | Phase 10 |

## 3. Inbound Links — Planned (Content-Layer, Post-Sprint)

These require editing existing content JSONs (not code). Listed with exact anchors per `21-anchor-strategy.md` (partial-match dominant):

| Source page | Anchor | Type |
|-------------|--------|------|
| `guides/software-cost-analysis` | "SaaS pricing benchmark 2026" | Partial → flagship |
| `guides/accounting-software-pricing` | "our 2026 pricing benchmark" | Partial |
| `guides/crm-pricing-guide` | "CRM starting prices in our benchmark" | Partial |
| `guides/analytics-pricing-guide` | "verified pricing data" | Partial |
| `guides/project-management-pricing-guide` | "project management pricing benchmarks" | Partial |
| `guides/ai-tool-pricing-guide` | "AI tool pricing data" | Partial |
| `guides/hr-software-pricing-guide` | "HR software pricing benchmarks" | Partial |
| `blog/saas-pricing-report-2026` | "PilotStack's pricing benchmark" | Branded |
| `blog/seo-tools-pricing-guide` | "our verified pricing data" | Partial |
| 12 category pages | "Latest research" section is blog-only today; extend to include research JSON matching category — future code change (note: research categories are report-type based, not category-name based, so mapping needs a `relatedCategories` field) | Future |

## 4. Outbound Links — Already Live (from the flagship JSON)

- 5 comparisons: semrush-vs-ahrefs, quickbooks-vs-xero, asana-vs-monday-com, salesforce-vs-hubspot, figma-vs-sketch
- 5 guides: software-cost-analysis, accounting-software-pricing, crm-pricing-guide, analytics-pricing-guide, project-management-pricing-guide
- 4 blog posts: saas-pricing-report-2026, ai-pricing-models-explained, seo-tools-pricing-guide, productivity-tools-cost-2026
- Methodology → `/research-methodology` (template link)
- Data sources → `/reviews`, GitHub toolkit, drift report (in JSON)

## 5. Rules

1. **One directional loop only** — pages link to the flagship; the flagship links to a curated subset; no link churn between report pages.
2. **Anchor discipline** — homepage uses the title; content pages use partial-match; no exact-match stacking from multiple sources (see `21-anchor-strategy.md` §3).
3. **Freshness loop** — when the benchmark is refreshed (quarterly), the homepage card auto-updates (date sort) and the "What Changed" section is updated.

## 6. Acceptance Criteria

- [x] Homepage features the flagship (implemented)
- [x] Research index + sitemap auto-surface it
- [x] Outbound related content wired (5/5/4)
- [x] 12 planned inbound content-layer links with anchors specified
- [ ] 12 planned links applied (content edit work — deferred to keep this sprint's diff focused on code + flagship; tracked here)
