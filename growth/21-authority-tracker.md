# Phase 14 — Authority KPI Dashboard

> Sprint 21 · Living dashboard for the authority-recovery program. Update monthly (see `21-90-day-authority-plan.md` §4). **Baseline captured 2026-08-07.**

---

## 1. Baseline (2026-08-07)

| Metric | Baseline | Source |
|--------|----------|--------|
| Domain Rating | ≈ 0.2 | Ahrefs (per brief) |
| Live external referring domains | ~1 (GitHub, self-owned) | Tracker / Ahrefs |
| Pages indexed | 1,800+ | GSC |
| Tier A/B targets (tracked) | 47 (18 A + 29 B) | `19-backlink-tracking.csv` |
| Tier C/D targets (tracked) | 53 (29 C + 24 D) | `19-backlink-tracking.csv` |
| Status: Submitted | 1 (GitHub) | Tracker |
| Status: Package Ready | 99 | Tracker |
| Flagship live | ✅ saas-pricing-benchmark-2026 | Site |
| Homepage flagship link | ✅ Featured Research section | Site |

## 2. Monthly Tracking Table (fill per review)

| Month | New RD (90-day goal) | Tier A/B links | Pitches sent | Anchor: branded % | Exact-match % | Flagship citations | Review profiles | Notes |
|-------|----------------------|----------------|--------------|-------------------|---------------|--------------------|-----------------|-------|
| M1 (Sep) | — | — | — | — | — | — | — | |
| M2 (Oct) | — | — | — | — | — | — | — | |
| M3 (Nov) | — | — | — | — | — | — | — | |

## 3. Tracker Status Formula (monthly update)

1. `Submissions = status=Submitted` count
2. `Live = link_url non-empty` count (distinct domains)
3. `Editorial = live ∩ (Tier A ∪ Tier B)`
4. `Exact anchors = anchor_text exactly matches target keyword`
5. Anchor ratio check: branded ≥ 45%, exact ≤ 8%, partial+generic remainder

## 4. Alert Conditions

- [ ] Exact-match share > 10% → halt exact-anchor asks, diversify (see `21-anchor-strategy.md`)
- [ ] Any E-tier link goes live (paid/spam) → disavow candidate, log immediately
- [ ] Two consecutive months with 0 new Tier A/B links → rework pitch angle against flagship data
- [ ] Flagship 404 or schema missing → block new outreach until fixed

## 5. Tooling

- Ahrefs (RD, referring domains, anchor distribution, content explorer for citations)
- Google Search Console (branded impressions, indexation of flagship)
- Google Alerts + Ahrefs Alerts (unlinked mentions → reclamation)
- `growth/19-backlink-tracking.csv` (single source of truth for execution)
- `growth/21-pricing-benchmark-data.json` (data integrity for pitches)

## 6. Acceptance Criteria

- [x] Baseline captured from real sources
- [x] Monthly tracking table with formulas
- [x] Alert conditions defined
- [x] Tooling list complete
