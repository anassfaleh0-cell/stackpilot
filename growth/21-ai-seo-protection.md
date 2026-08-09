# Phase 10 — AI-SEO & Technical Authority Protection

> Sprint 21 · Audit of AI-crawler access, schema coverage, and citation readiness for the flagship (**SaaS Pricing Benchmark 2026**) and the site.

---

## 1. AI Crawler Access (robots.ts) — PASS

All major AI crawlers are explicitly allowed (verified in `src/app/robots.ts`):

| Bot | Status |
|-----|--------|
| GPTBot / OAI-SearchBot / ChatGPT-User | ✅ allowed |
| ClaudeBot | ✅ allowed |
| PerplexityBot | ✅ allowed |
| Google-Extended / GoogleOther | ✅ allowed |
| Applebot-Extended | ✅ allowed |
| Bingbot / CCBot / Bytespider / meta-externalagent | ✅ allowed |
| Sitemap | ✅ `/sitemap.xml` linked |

**No change needed.** The flagship is eligible for AI-crawler indexing from day one.

## 2. llms.txt — UPDATED

`public/llms.txt` is a static file (no generation script — verified). Updates applied:

- Added **SaaS Pricing Benchmark 2026** at the top of the "Research reports" section with a data-rich one-liner (median $19.99/mo, 51% freemium, category table) so LLM agents surface the flagship first.
- Updated the "All research reports" count 31 → 32.

## 3. Structured Data on the Flagship — PASS (with FAQSchema added)

The research template now renders for the flagship:

| Schema | Status |
|--------|--------|
| ArticleSchema | ✅ (template) |
| WebPageSchema with `mainEntity: Report` | ✅ (template) |
| BreadcrumbSchema | ✅ (template) |
| FAQSchema | ✅ **NEW** — previously imported but never rendered; wired this sprint (`src/app/research/[slug]/page.tsx`), with 5 questions in the flagship JSON |

## 4. Table Rendering (for AI + human readability)

- `ContentSection` type extended with `columns`/`rows`; research page renders `type: "table"` sections (mirrors the guides pattern). The flagship's 12-category benchmark table uses it.

## 5. Citation-Readiness Checklist (flagship)

- [x] Stable static URL: `/research/saas-pricing-benchmark-2026`
- [x] "Free to cite with attribution" notice (template-level, all research pages)
- [x] Data sources with real URLs (corpus, script, methodology, drift report)
- [x] Reproducible computation script public (`scripts/compute-pricing-benchmark.js`)
- [x] Methodology with sample size, parse rules, exclusions, point-in-time caveat
- [x] Published/updated dates present
- [x] Internal links to 5 comparisons + 5 guides + 4 posts
- [ ] Quarterly refresh cadence documented in plan (`21-90-day-authority-plan.md`, Phase 13)

## 6. Known Issues Flagged (not fixed in this sprint — out of backlink scope)

1. **Homepage trust-stats block** claims "35K+ Monthly Readers" and "98% Reader Satisfaction" (`src/app/page.tsx` stats array) — these figures were flagged as fabricated during the Sprint 20 fact audit and **still appear on the homepage**. Sprint 20's removal appears to have missed this block. Recommend removal before any editorial outreach (PR kit quotes methodology, not traffic).
2. Research category values ("Benchmark", "Pricing", etc.) don't map 1:1 to site categories — category pages can't auto-surface research reports without a `relatedCategories` field (noted in `21-internal-authority-map.md` §3).

## 7. Acceptance Criteria

- [x] AI robots verified allowed
- [x] llms.txt updated with flagship + count
- [x] Schema audit complete; FAQSchema added
- [x] Table support verified
- [x] Citation-readiness checklist green (except quarterly cadence → Phase 13)
- [x] Fabricated homepage stats flagged for removal
