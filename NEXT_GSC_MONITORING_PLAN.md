# Next GSC Monitoring Plan — Post Wave 1

**Site:** PilotStack — https://www.pilotstack.online
**Baseline period:** 21 September 2026 → 27 September 2026 (the export used for `SEO_WAVE1_AUDIT.md`)
**Wave 1 shipped:** 29 September 2026
**Why this document exists:** the baseline export contained **clicks and impressions but no per-page
Position column**, so nothing in the audit claimed a ranking position. All position statements start
from the first measurement taken *after* this wave.

---

## 1. Baseline (do not lose this — re-paste it every time)

| # | URL | Impressions (21–27 Sep) |
|---|---|---|
| 1 | `/category/marketing-seo` | 129 |
| 2 | `/use-cases/best-seo-for-agencies` | 124 |
| 3 | `/guides/accounting-software-pricing` | 70 |
| 4 | `/reviews/linear` | 47 |
| 5 | `/reviews/figma` | 38 |
| 6 | `/use-cases/best-hr-for-small-business` | 35 |
| 7 | `/category/productivity` | 32 |
| 8 | `/blog/ai-software-cost-comparison-2026` | 29 |
| 9 | `/reviews/stripe` | 27 |
| 10 | `/category/analytics-data` | 27 |
| | **Total** | **558** |

Export a fresh baseline in GSC for **21–27 Sep 2026 including Position, CTR and average position**
(the previous export omitted them) and store it beside this file before the first checkpoint.

---

## 2. Checkpoint schedule

| Checkpoint | Dates (2026) | Purpose |
|---|---|---|
| **T+0** | 29 Sep | Ship. Request indexing for all 10 URLs via URL Inspection. Record the "submitted/crawled" state of each. |
| **T+3** | 2 Oct | Early anomaly check only (drops, crawl errors, accidental noindex). *No SEO conclusions.* |
| **T+7** | 6 Oct | First meaningful signal: recrawl + reindex should be complete for most URLs. |
| **T+14** | 13 Oct | Primary decision point — impressions/CTR trend vs baseline. |
| **T+28** | 26 Oct | Full cycle; compare against baseline and decide Wave 2 scope. |
| **T+56** | 23 Nov | Confirm the T+28 move was not a spike. |

Run each checkpoint as a **28-day window ending on the checkpoint date**, plus a 7-day window for the
trend line. Compare like with like (same window length, same comparison period).

---

## 3. What to pull at every checkpoint

For each of the 10 URLs, export from GSC → Performance → Search results (with the URL filter on):

1. **Clicks, Impressions, CTR, Average position** — 7-day and 28-day windows.
2. **Queries** (top 20) with impressions + position, split by **Page** in the query table so you see
   which queries the *page* actually answers.
3. **Countries** — confirm the impression base is the intended market.
4. **Devices** — desktop vs mobile CTR gaps (template changes affect mobile layout most).
5. **Coverage / Indexing → Pages** for the 10 URLs: *Indexed*, *Crawled – currently not indexed*,
   *Discovered – currently not indexed*, *Excluded by noindex*.
6. **Search Appearance** — sitelinks on the three category hubs, FAQ rich results on reviews/guides.

Record everything in a single sheet with these columns so T+n can be diffed mechanically:
`date | url | clicks_7d | impr_7d | ctr_7d | pos_7d | clicks_28d | impr_28d | ctr_28d | pos_28d | indexed_state | notes`

---

## 4. Signals and thresholds

### Positive (expected)
- **Impressions up ≥ 15% at T+14** on the two biggest pages (`/category/marketing-seo`,
  `/use-cases/best-seo-for-agencies`) — new titles/descriptions widen the query surface Google tests.
- **Impressions up ≥ 10%** on `/use-cases/best-hr-for-small-business` — it gained 11 new internal
  links and a full topical rewrite, the largest change in the wave.
- **CTR up ≥ 0.3 pp** on any page — titles were previously clipped or generic; CTR should move before
  position does.
- **New queries appearing** that were absent in baseline (especially *pricing*, *cost*, *vs*,
  *for agencies*, *for small business*) — evidence the intent alignment is working.

### Neutral — do not react
- Small position movement (±3) in the first 14 days. Titles changed on 8 of 10 pages; Google re-tests
  query mapping. Movement either way before T+28 is expected volatility.
- A temporary impressions spike on a page whose CTR is flat — usually a test of the new title against
  a broader query set.

### Negative — investigate
- **Impressions down ≥ 25% at T+28** on any page, sustained across two consecutive checkpoints.
- **CTR down ≥ 0.3 pp with impressions up** — title promises more than the page delivers; tighten the
  title, do not revert it.
- **Page drops out of *Indexed***, or appears as *Excluded by noindex* — regression. Check
  `noindex-list.json` diff immediately.
- **Query set collapses to only branded terms** — the page stopped matching its commercial queries.
- **Two of the 10 pages ranking alternately for the same query** (classic cannibalization signature).

---

## 5. Cannibalization watch list

Monitor these pairs jointly — if both pages appear for the same query across two consecutive
checkpoints, tighten one anchor/title rather than merging anything.

| Cluster | Pages to compare |
|---|---|
| SEO agency tools | `/use-cases/best-seo-for-agencies` vs `/blog/best-seo-tools-for-agencies` |
| Accounting pricing | `/guides/accounting-software-pricing` vs `/blog/accounting-software-cost-2026` vs `/guides/how-to-choose-accounting-software` |
| AI cost | `/blog/ai-software-cost-comparison-2026` vs `/blog/ai-pricing-models-explained` vs `/guides/ai-tool-pricing-guide` |
| Small-business HR | `/use-cases/best-hr-for-small-business` vs `/blog/best-hr-software-2026` |

---

## 6. Technical re-checks (run before each of T+7, T+14, T+28)

1. `npm run build` → confirm the 10 URLs are still prerendered (no route was added or removed).
2. `npx tsc --noEmit` and `npm run test` → clean.
3. Confirm on the built HTML for all 10: canonical == the URL, no `noindex`, one `<h1>`,
   description ≤ 160 chars, and the **Start Here** / **Keep Reading** blocks still present.
4. Confirm no link to a `published: false` comparison has crept in (data-only change in a content
   file can reintroduce this).
5. Diff `content/` against the Wave 1 snapshot — this repository has other automated processes writing
   to it; duplicate JSON keys or deleted `toolName` fields are the failure modes seen so far.

---

## 7. Rules for the next 28 days

- **Do not touch titles again before T+28** unless the negative thresholds above are hit. Repeated
  title edits reset the re-testing clock and make attribution impossible.
- **Do not delete, merge, redirect or noindex anything** in this wave's scope. Zero URL changes was a
  hard constraint of Wave 1 and remains the default.
- **Do not add new pages** to "cover" a query. Wave 2 is a *re-prioritization of the same method*,
  not page generation.
- **Do not fabricate data.** Any new number must already exist in the repository or be citable.
- Re-run the same validation suite before and after any change; if `npm run build` or the tests fail,
  the change does not ship.

---

## 8. Wave 2 selection criteria (decide at T+28)

Rank the wider inventory by:

1. **Pages with ≥ 20 impressions in the baseline window but outside Wave 1** — same opportunity, same
   method (metadata + intent alignment + internal links + structured-data audit).
2. **Pages where Wave 1 produced a measurable CTR or impressions gain** — template changes proved out,
   extend to sibling templates only if they are already data-gated.
3. **Query clusters where two indexable pages showed cannibalization** — resolve by tightening
   stated purpose, never by deletion.
4. **Templates that still truncate or drop content** — audit showed category/review meta templates
   clipping at 58 chars; other templates were not all audited for the same defect.

Defer indefinitely: `/comparisons` at 928 pages (50 indexable), `/best` at 196 (20 indexable) —
these are structural, not Wave-1-scale, and are explicitly out of scope for this method.
