# Phase 8 — Anchor Strategy

> Sprint 21 · Anchor-text plan mapped to the flagship (SaaS Pricing Benchmark 2026) and the live site. Target distribution: **branded 50% · partial-match 30% · exact-match 5% · generic/URL 15%** (exact-match kept deliberately low — the site's anchor profile is essentially new, so the safest start is branded + partial).

---

## 1. Target Ratios

| Anchor type | Target share | 90-day goal (of ~25 live links) | Why |
|-------------|--------------|--------------------------------|-----|
| Branded ("PilotStack", "PilotStack's research") | 50% | ~12 | Builds brand search demand; safest anchor for a site with a young profile |
| Partial-match ("SaaS pricing data", "our software pricing benchmark") | 30% | ~8 | Relevance signals for the flagship keyword themes |
| Exact-match ("SaaS pricing benchmark 2026") | 5% | ~1–2 | One clean exact-match per quarter; avoid concentration |
| Generic/URL ("click here", bare URL) | 15% | ~4 | Natural citations, directories, roundups |

---

## 2. Anchor Plan by Source Type

| Source type | Recommended anchor | Example | Link target |
|-------------|--------------------|---------|-------------|
| Tier-A editorial (guest posts) | Branded + partial | "PilotStack's 2026 pricing benchmark found…" | Flagship |
| Tier-A editorial (data quotes) | Partial | "median SaaS starting price ($19.99/mo)" | Flagship |
| Tier-B curated directories | Branded | "PilotStack" | Homepage |
| Tier-B podcasts/interviews | Branded + URL | "pilotstack.online" | Homepage / About |
| Tier-B communities (dev.to/Hashnode) | Branded (canonical cross-posts) | "PilotStack" | Homepage |
| Tier-C directories | Branded / URL | "PilotStack" | Homepage |
| Tier-C roundups/newsletters | Partial | "software pricing benchmarks" | Flagship |
| Tier-D listings | URL | "https://www.pilotstack.online" | Homepage |
| GitHub / toolkit | Branded | "PilotStack" (already live) | Homepage + toolkit |
| Internal links (site-wide) | Partial + exact (controlled) | "SaaS pricing benchmark 2026" | Flagship (from category pages, pricing guides) |

---

## 3. Exact-Match Budget (5%, ~2 links max this quarter)

1. **Flagship title keyword:** "SaaS pricing benchmark 2026" — only from a high-authority source (SEJ/SEL guest contribution, if accepted) or one natural directory citation.
2. **Category keyword:** "software pricing benchmarks" — from a roundup/newsletter citation (TLDR, SaaStr Daily).
3. **Do not use:** "best software reviews", "software review sites" as exact anchors — these would be aggressive for the homepage's current authority.

---

## 4. Anchor Rules

1. **Never force anchors** — if the publisher writes "PilotStack" or pastes the URL, accept it; do not request rewrites beyond a natural "PilotStack's research" mention.
2. **Alternate by source** — same publisher should not carry both an exact-match and a branded anchor to the same page.
3. **Vary link targets** — ~70% of external links to the flagship, ~20% homepage, ~10% deep pages (pricing guides, category pages).
4. **Internal anchors support the flagship** — Phase 9 maps internal linking; internal partial anchors are safe because they are within our control.
5. **Log every live anchor** in the tracker (`anchor_text` column already exists) — quarterly review against the 50/30/5/15 ratios.

---

## 5. Sample Anchor Sheet (first 12 planned links)

| # | Source (planned) | Anchor | Type | Target |
|---|------------------|--------|------|--------|
| 1 | GitHub toolkit (live) | "PilotStack" | Branded | Homepage |
| 2 | GitHub Pages (live) | "Explore 150+ reviews and 600+ comparisons" | Partial | Homepage |
| 3 | GitHub Discussions (live) | "PilotStack" | Branded | Homepage |
| 4 | SEJ guest post (contribution 21) | "PilotStack's 2026 pricing benchmark" | Branded | Flagship |
| 5 | SEJ guest post (in-text stat) | "median SaaS starting price" | Partial | Flagship |
| 6 | MarTech (contribution 22) | "PilotStack" | Branded | Flagship |
| 7 | TLDR roundup | "software pricing benchmarks" | Exact | Flagship |
| 8 | SaaSHub listing | "PilotStack" | Branded | Homepage |
| 9 | AlternativeTo listing | "PilotStack" | Branded | Homepage |
| 10 | dev.to cross-post | "PilotStack" | Branded | Homepage |
| 11 | SaaStr Daily | "our pricing benchmark" | Partial | Flagship |
| 12 | Startup Digest | "pilotstack.online" | URL | Homepage |

---

## 6. Acceptance Criteria

- [x] Ratio targets defined (50/30/5/15)
- [x] Anchor rules per source type
- [x] Exact-match budget capped and mapped
- [x] Anchor rules (no forcing, variance, logging)
- [x] 12-link sample anchor sheet
