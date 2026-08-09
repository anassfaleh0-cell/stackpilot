# Sprint 21 — Authority Recovery & High-Quality Backlink System: Final Report

> **Scope:** Convert PilotStack's low-authority link profile (DR ≈ 0.2, ~1 live external link) into a white-hat editorial authority system: full backlink quality audit, quality-tiered target list, digital PR kit, expert contribution pipeline, anchor strategy, internal authority map, AI-SEO protection, and a published flagship research asset — SaaS Pricing Benchmark 2026 (computed from the site's own 151-review corpus).
> **Compliance:** No PBNs, no paid links, no spam directories, no mass guest posting, no fabricated statistics. Every figure traces to the live review corpus or verifiable site data.
> **Deliverables:** 10 growth docs · upgraded tracker · flagship research page (live, built, sitemapped) · computation script + dataset · llms.txt update. **No git commit/push — pending approval.**

---

## 1. Backlink Quality Audit (A–E)

Full audit in `growth/21-backlink-quality-audit.md` — all 100 sprint-19 targets + legacy sources classified:

| Tier | Definition | Count | Action |
|------|-----------|-------|--------|
| A | Top editorial authority (DR 75+, tech/SaaS-focused) | 18 | 90-day editorial outreach |
| B | Strong authority, direct fit | 29 | 90-day editorial outreach |
| C | Decent authority / lightweight listing | 29 | Batch submissions (2 waves) |
| D | Low authority or marginal relevance | 24 | Batch submissions (opportunistic) |
| E | Spam / paid / irrelevant | 4 (prev.) | **Excluded — preventive only** |

Key findings:
- Legacy `07-backlink-directories.md` DB (~300 entries) verdict: **archive** — ~270 C/D, ~12 spam/"Avoid"; only E-list preserved (no live spam links found → **no disavow needed**).
- 4 duplicate brands → **96 distinct referring domains**; GitHub self-owned links tracked but excluded from external RD.
- Old engine was mass-directory-heavy (43/100 targets); audit corrects the mix toward editorial (A/B = 47).
- Tracker upgraded: `growth/19-backlink-tracking.csv` now has `tier` column (A=18/B=29/C=29/D=24, verified PowerShell round-trip, 101 lines, zero unmapped).

---

## 2. Authority Target List

`growth/21-authority-targets.md` — generated directly from the CSV: tiered quick-reference tables, 90-day goals per tier, and a 6-point verification checklist (DR live-check, content fit, one-link-per-email rule, anchor budget, log-within-24h rule, spam check).

---

## 3. Linkable Assets Analysis

`growth/21-linkable-assets.md` — 15 ideas evaluated: **6 buildable now**, 5 requires-research, 3 already live. Flagship recommendation: **SaaS Pricing Benchmark** (data uniquely owned by the site's review corpus, journalistically relevant, evergreen + refreshable).

---

## 4. Flagship Asset (Live Page + Code)

**SaaS Pricing Benchmark 2026** — `/research/saas-pricing-benchmark-2026` (content/research/saas-pricing-benchmark-2026.json)

- **Reproducible:** `scripts/compute-pricing-benchmark.js` computes every number from `content/reviews/*.json` (source of truth). Data snapshot: `growth/21-pricing-benchmark-data.json`.
- **Real data (not fabricated):** 151 reviews, all with `priceRange`; 133 parseable numeric (88%), 10 custom-only, 8 unparseable. Median start **$19.99/mo**, 51% freemium, 41% free tier, avg rating 4.33. Category medians: Marketing/SEO $99 (highest), Security $7 / HR $8 (lowest). Per-category sanity-checked (e.g., HR $8 driven by HiBob $8–15, Zoho People $3–10).
- **Page features (code):** `ContentSection` + `columns/rows` (table rendering) and `ResearchContent.faqs` added to `src/types/content.ts`; research page now renders tables + FAQ section; **FAQSchema is now actually emitted** (was imported-but-dead; 5 FAQs). 5 outbound comparison links, 5 guide links, 4 blog post links (all real, live).
- **Homepage:** new "Original Research" section (3 latest reports, flagship first) — `src/app/page.tsx`.
- **Verification (build artifacts):** page prerendered (1682/1682 static pages, build EXIT 0); `FAQPage` JSON-LD present; table + key findings render; sitemap contains the URL; research index lists it; homepage links to it.

---

## 5. Digital PR Kit

`growth/21-digital-pr-kit.md` — press summary with real data points, 3 ready-to-send templates (PR-1 journalist hook / PR-2 category roundup / PR-3 HARO-style response), 5-post social kit, and 10 first-wave pitch targets mapped to tiers.

---

## 6. Expert Contributions

`growth/21-expert-contributions.md` — all 20 existing guest drafts inventoried (titles verified; **draft 09 "SaaS Pricing Models Explained" flagged for flagship-data upgrade**), 3 new flagship-driven contribution outlines (SEJ, MarTech/TLDR, CMI/SaaStr), 12-week sequencing, no-paid/no-fabrication rules reaffirmed.

---

## 7. Anchor Strategy

`growth/21-anchor-strategy.md` — 50% branded / 30% partial / 5% exact / 15% generic; 12-link sample sheet; exact-match budget capped at 2 total (penalty risk); logged anchor audit monthly.

---

## 8. Internal Authority Map

`growth/21-internal-authority-map.md` — homepage (new section), research index, and sitemap now point at the flagship. 12 planned content-layer inbound links (pricing guides/blog) documented with anchors — deferred as content edits, tracked in the doc. Outbound links from flagship live.

---

## 9. AI-SEO Protection

`growth/21-ai-seo-protection.md` — robots.ts verified: **all AI crawlers allowed** (GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot, Google-Extended, etc.) — no change needed. `public/llms.txt` (static, hand-edited) updated: flagship added under "Research reports" + count 31→32. FAQSchema confirmed new; table support verified in page code.

⚠️ **Open flag (unresolved from sprint 20):** homepage still displays **"35K+ Monthly Readers"** and **"98% Reader Satisfaction"** (`src/app/page.tsx` stats block) and newsletter section "Join 35,000+ professionals" — sprint-20's report claims these were "removed from all external copy" as untraceable, but they are still live. This is a credibility blocker for editorial outreach (journalists verify claims) and violates the no-fabrication rule. **Recommended: remove both before any outreach.** (Not changed in this sprint — flagged for approval.)

---

## 10. Sitemap / Robots for New Asset

Verdict (verified in built artifacts): sitemap auto-includes the flagship via `getAllResearch()` (confirmed in `.next` output) — no sitemap edit needed. Robots unchanged (all AI crawlers already allowed). Nothing to modify.

---

## 11. Tracking CSV with Quality Scores

`growth/19-backlink-tracking.csv` — tier column added (Phase 2, verified round-trip); quality score = tier (A–D). This is the execution source of truth for the tracker.

---

## 12. 90-Day Authority Plan

`growth/21-90-day-authority-plan.md` — realistic goals (8–15 new external referring domains; 4–8 Tier A/B links), 12-week cadence table (Days 1–30 foundations/review platforms, 31–60 editorial push, 61–90 Product Hunt + amplification), weekly 30-min routine, monthly 60-min review, honest DR-lag caveat documented.

---

## 13. KPI Dashboard

`growth/21-authority-tracker.md` — baseline captured (DR ≈ 0.2, ~1 RD, 47 A/B + 53 C/D tracked), monthly tracking table with formulas, alert conditions (anchor over-concentration, E-tier live links, stalled editorial, flagship 404), tooling list.

---

## Validation Summary

| Check | Result |
|-------|--------|
| `npx tsc --noEmit` | ✅ EXIT 0 |
| `npm run build` (1682 pages) | ✅ EXIT 0 |
| Flagship page prerendered + FAQPage JSON-LD + table + sitemap + homepage link | ✅ verified in build artifacts |
| `npm run lint:content` | ✅ flagship file clean (12 pre-existing blog warnings untouched) |
| `npm run lint` | ⚠️ 238 pre-existing errors (policy pages, effect setState, old scripts) — none in files touched this sprint; research page unused imports cleaned |
| `npm run test` | ⚠️ 15/16 pass; 1 pre-existing flake: `searchContent` "case-insensitive" times out at 5s (two full-corpus scans = 5.4s on this machine; `searchContent` doesn't read research content, so unaffected by this sprint) |

**Not committed/pushed — awaiting approval.** Flags for approval: (1) remove homepage fabricated stats; (2) nothing else outstanding.
