# Phase 6 — Digital PR Kit

> Sprint 21 · Press and journalist outreach assets built around the **SaaS Pricing Benchmark 2026** (the Phase 5 flagship). Every statistic below is real, computed from the 151-tool review corpus on 2026-08-07 (see `growth/21-pricing-benchmark-data.json`). No fabricated data points.

---

## 1. One-Page Press Summary (for journalists, 60-second read)

**Headline angle:** *"The median SaaS product now starts at $19.99/month — and 51% of software is freemium."*

**PilotStack** — an independent software research site with 151 hands-on product reviews — published the **SaaS Pricing Benchmark 2026**, the first pricing benchmark computed directly from a verified review database rather than vendor claims.

**Five quotable data points (all original, all reproducible):**

1. Median SaaS starting price: **$19.99/mo** (middle 50%: $11–$39/mo)
2. **51%** of software tools are freemium; **41%** offer a free tier somewhere in the price ladder
3. Most expensive category: **Marketing & SEO at $99/mo** median starting price (Ahrefs, SEMrush, Marketo)
4. Cheapest categories: **Security & Compliance ($7/mo)** and **HR & People ($8/mo)**
5. **6.6% of tools (1 in 15) publish no public pricing** — "contact sales" is still common in enterprise software

**Why it matters:** Comparison sites routinely serve stale pricing (PilotStack's own Pricing Drift Report found 7 of 11 verified tools had misreported prices). This benchmark gives buyers, analysts, and journalists a defensible baseline.

**Methodology:** All stats computed by a versioned script from 151 reviews, each with a structured pricing model + verified price range. Script: `scripts/compute-pricing-benchmark.js`. Reproducible on request.

**Contact:** via site contact form — https://www.pilotstack.online/contact

---

## 2. Pitch Email — Journalists & Newsletters (Template PR-1)

> **Subject:** New data: median SaaS price is $19.99/mo (151 tools, verified)
>
> Hi [First name],
>
> I'm from PilotStack, an independent software research site. We just published the first SaaS pricing benchmark computed from our own verified review database — 151 tools, each with a price range checked at review time.
>
> A few findings your readers might cite:
> - The median software tool now starts at **$19.99/mo**; the middle 50% runs $11–$39/mo
> - **51% of tools are freemium** — free-first is now the default entry strategy
> - **Marketing & SEO is the priciest category** (median $99/mo start), security the cheapest ($7/mo)
> - **1 in 15 tools hides its pricing** behind "contact sales"
>
> Full report: https://www.pilotstack.online/research/saas-pricing-benchmark-2026
> Methodology + reproducible script: linked in the report's Data Sources.
>
> Happy to provide category-specific breakdowns or a custom slice of the dataset. No strings attached.
>
> Best,
> PilotStack Research Team

---

## 3. Pitch Email — Category-Focused (Template PR-2)

> **Subject:** [Category] pricing data — starting prices for 12 tools, verified
>
> Hi [First name],
>
> Writing with original pricing data for [CATEGORY] coverage: our team reviewed [N] tools in this category hands-on, and the median starting price is **[PRICE]/mo** — [NOTABLE CONTRAST, e.g., "a fraction of what most roundups imply"].
>
> The full category table is public at https://www.pilotstack.online/research/saas-pricing-benchmark-2026 (12 categories, 151 tools). Happy to share the underlying per-tool ranges.
>
> Best,
> PilotStack Research Team

---

## 4. Social Media Kit (launch burst, 5 posts)

1. **Data hook (X/LinkedIn):** "We reviewed 151 software tools. The median starting price is $19.99/mo. 51% are freemium. 41% have a free tier. Full benchmark: [link]"
2. **Category contrast:** "Marketing & SEO tools start at a median $99/mo. Security tools? $7/mo. Same year, same economy: [link]"
3. **The hidden-pricing stat:** "1 in 15 software tools has no public price. We tracked which categories hide it: [link]"
4. **Buyer tip:** "Budget from the category median, not the cheapest tool. Here's why — with the data: [link]"
5. **Methodology note (credibility):** "Every number in our pricing benchmark is reproducible. The script is public: [link]"

---

## 5. Replying to HARO-Style Queries (Template PR-3)

> **Query fit:** software pricing, SaaS costs, freemium trends, category cost comparisons, hidden pricing, B2B buying budgets.
>
> Hi [Editor],
>
> Relevant data from PilotStack's SaaS Pricing Benchmark 2026 (151 verified tools):
> - Median starting price **$19.99/mo**; middle 50% $11–$39/mo
> - **51% freemium**, 41% with a free tier
> - Marketing & SEO median start **$99/mo** (priciest); Security & Compliance **$7/mo** (cheapest)
> - **6.6% of tools (1 in 15)** offer custom-only pricing
>
> Source: https://www.pilotstack.online/research/saas-pricing-benchmark-2026
> Permission granted to cite with attribution to PilotStack.
>
> Best,
> PilotStack Research Team

---

## 6. Pitch Targets (first wave, 10)

| Target | Tier (from 21-authority-targets.md) | Channel | Angle |
|--------|-------------------------------------|---------|-------|
| Search Engine Journal | A | Email (PR-1) | Pricing data + SEO tools category ($99/mo stat) |
| Search Engine Land | A | Email (PR-1) | Same + methodology transparency |
| MarTech | A | Email (PR-2) | MarTech category breakdown |
| Content Marketing Institute | A | Email (PR-1) | Freemium + content-tool pricing |
| TLDR | B | Submission form | "Median SaaS price $19.99/mo" hook |
| The Rundown AI | B | Email | AI category data ($20/mo median start) |
| Ben's Bites | C | Email | AI tools pricing slice |
| SaaS Weekly | D | Form/email | SaaS pricing roundup entry |
| Startup Digest | C | Form | Startup-relevant pricing stats |
| SaaStr Daily | B | Email | SaaS operator pricing trends |

---

## 7. PR Kit Acceptance Criteria

- [x] One-page summary with real, sourced data points only
- [x] 3 pitch templates (journalist, category, HARO-style)
- [x] 5-post social launch kit
- [x] First-wave target list mapped to authority tiers
- [x] Every stat traceable to `growth/21-pricing-benchmark-data.json`
