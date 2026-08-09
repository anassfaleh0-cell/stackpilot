# Phase 4 — Linkable Assets (10–15 Ideas)

> Sprint 21 · Evaluated linkable asset ideas against **what already exists on the live site** and **what the review corpus can support today** — no fabrication. Assets that require original data collection are explicitly marked **REQUIRES RESEARCH** and are not included in the Phase 5 flagship decision.

---

## 1. Evaluation Summary

| # | Asset | Status | Effort | Link magnet value | Notes |
|---|-------|--------|--------|-------------------|-------|
| 1 | **SaaS Pricing Benchmark 2026** | **BUILDABLE NOW** | Medium | High | Structured `pricing`/`priceRange` data exists across the 130+ review corpus |
| 2 | **Software Evaluation Playbook** | **LIVE** (blog/software-evaluation-playbook-2026) | Done | Medium-High | Published; still needs a research-page counterpart |
| 3 | **Software Evaluation Toolkit (scorecard, methodology)** | **LIVE** (GitHub Pages) | Done | Medium | GitHub Pages + repo; already linked from tracker |
| 4 | **Review Methodology Report** | **LIVE** (research-methodology page) | Done | Medium | E-E-A-T anchor for all editorial outreach |
| 5 | Category pricing snapshots (12 categories) | **BUILDABLE NOW** | Medium | Medium | Slice of asset #1 by category |
| 6 | Rating distribution benchmarks by category | **BUILDABLE NOW** | Low | Medium | Corpus ratings are structured |
| 7 | Feature availability index (SSO, API, free tier by category) | **BUILDABLE NOW** | Low | Medium | `features[].available` is structured |
| 8 | The State of Software Reviews 2026 | **REQUIRES RESEARCH** | High | High | Needs review-platform data aggregation; out of scope for this sprint |
| 9 | The Real Cost of Software Switching | **REQUIRES RESEARCH** | High | High | Needs survey or churn data we don't have |
| 10 | Fake Review Index | **REQUIRES RESEARCH** | Very high | Very high | High-risk methodology; not this sprint |
| 11 | How Long It Takes to Evaluate Software | **REQUIRES RESEARCH** | High | Medium | Needs reader/behavioral data |
| 12 | 2026 Software Glossary (expand) | **BUILDABLE NOW** | Low | Low-Medium | 32+ glossary terms exist; expansion is incremental |
| 13 | Vendor Evaluation Checklist (PDF) | **BUILDABLE NOW** | Low | Medium | Derivative of toolkit methodology |
| 14 | Software Renewal & Audit Calendar | **BUILDABLE NOW** | Low | Low-Medium | Template asset; weak link magnet alone |
| 15 | B2B Software Stack Report | **REQUIRES RESEARCH** | High | Medium | Needs stack/spend data we don't have |

**Verdict:** 6 assets are buildable from the existing corpus today; 5 more require research; the Software Evaluation Playbook + toolkit are already live. **The strongest buildable asset is #1 (SaaS Pricing Benchmark 2026)** — it is original, quantitative, citable, and fully supported by the verified `priceRange`/`pricing` fields in the review corpus.

---

## 2. Flagship Asset Recommendation (for Phase 5)

### SaaS Pricing Benchmark 2026
- **What it is:** A research report computing real pricing benchmarks from PilotStack's verified review database: pricing model distribution (free/freemium/paid) by category, median/typical price ranges per category, feature-availability vs. price relationships.
- **Why it wins:**
  1. **Original data** — derived from the site's own 130+ tool reviews (each with structured `pricing` and `priceRange` fields), not recycled vendor claims.
  2. **Citable** — the exact kind of stat journalists, comparison sites, and newsletters link to ("PilotStack's 2026 benchmark found X%").
  3. **Reusable** — feeds Phase 6 PR kit data points, Phase 7 expert contributions, Phase 8 anchor strategy, and Phase 9 internal linking.
  4. **Honest** — methodology is transparent, sample size is disclosed, limits are documented (Phase 5 §Methodology).
- **Pages it will link to:** 12 category pages, best-of guides, pricing guides (e.g., `guides/accounting-software-pricing`, `guides/ai-tool-pricing-guide`, `guides/analytics-pricing-guide`), and the reviews corpus.
- **Related existing assets that strengthen it:** `research/saas-pricing-drift-report-2026.json` (pricing-movement methodology precedent), `/research-methodology` page, Software Evaluation Playbook.

### Asset #2 fallback (if pricing data were insufficient — it is not)
- The existing **Software Evaluation Playbook** could be republished as a `/research` report. Not needed — pricing data is sufficient and the playbook already lives in `/blog`.

---

## 3. Execution Order for Assets

| Priority | Asset | When | Purpose |
|----------|-------|------|---------|
| 1 | SaaS Pricing Benchmark 2026 | Phase 5 (this sprint) | Flagship — anchor for all editorial outreach |
| 2 | Category pricing snapshots | Post-launch, incremental | Deep-link distribution for category pages |
| 3 | Rating distribution + feature availability benchmarks | Post-launch, incremental | Additional citable stats, low effort |
| 4 | Vendor Evaluation Checklist PDF | Post-launch | Resource-page target (Tier B/C resource pages) |
| 5 | Glossary expansion | Continuous | LLM/GEO citations |
| 6–15 | REQUIRES RESEARCH assets | Future sprints | Marked; do not fabricate |

---

## 4. Publishing Checklist (per buildable asset)

- [ ] Stable URL under `/research/<slug>` (static, no params)
- [ ] Structured JSON in `content/research/` → auto-published by registry + sitemap
- [ ] ArticleSchema + Report WebPageSchema + BreadcrumbSchema (template already renders)
- [ ] Methodology section with sample size, date range, and limits
- [ ] Data sources section with real URLs
- [ ] Key Findings box (3–6 items)
- [ ] Internal links to category pages + pricing guides + related research
- [ ] Quarterly refresh date noted (benchmarks go stale)
- [ ] Citation-ready summary (Phase 6 PR kit uses it)

---

## 5. Acceptance Criteria

- [x] 10–15 assets listed with honest status (buildable / live / requires research)
- [x] No fabricated assets or statistics — every claim maps to a real corpus field or live page
- [x] Flagship recommendation chosen with rationale (SaaS Pricing Benchmark 2026)
- [ ] Flagship published as a real site page (Phase 5)
