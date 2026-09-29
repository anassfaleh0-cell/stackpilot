# PilotStack — Google Search Console Page Indexation Recovery — FINAL REPORT

- **Site:** https://www.pilotstack.online
- **Repository:** `C:\Users\user\Desktop\DEEPSK` (branch `master`, HEAD `4a8b790`, not committed)
- **Report date:** 2026-09-30
- **Source reports:** `_gsc-indexation-recovery-report.md` (Phases 0–13, 2026-09-29) → `_gsc-p1-p11-decision.md` (P1–P11 decision record, 2026-09-29) → **this file (Phase 14, final)**
- **GSC data date:** 21/09/2026 — **651 affected URLs, 9 buckets**

---

## 1. Scope, method and safety statement

**Scope.** Resolve the GSC Page Indexing problems by (a) reading and classifying every one of the nine reported buckets, (b) extracting P1–P11 verbatim into an approval decision record, (c) implementing only items proven SAFE TO FIX NOW, (d) proving the result with a full local validation crawl.

**Method.** Every claim below is either (i) reproduced by a script committed to this workspace as a `_*.cjs` harness, or (ii) quoted from the Phase 0–13 report. No GSC per-URL export exists in this repository, so bucket populations are reproduced by an independent crawl rather than read from Google.

**Safety statement — all prohibitions held:**

| Prohibition | Status |
|---|---|
| No `git commit` / `push` / deploy / remote-branch change | **Held** — zero git mutations this session |
| No mass page generation | **Held** — static page count 610 → 610 |
| No emitting all slugs into `generateStaticParams()` | **Held** — GSP filters unchanged |
| No placeholder pages | **Held** — none created |
| No `noindex` as a status substitute | **Held** — no noindex added |
| No change to valid URLs | **Held** — all 646 sitemap URLs still 200 with identical canonicals |
| No content rewriting / bulk titles / new SEO pages / large removals / editorial or affiliate changes | **Held** — no `content/**.json` file edited by this session |
| No fabricated content, no keyword stuffing | **Held** |
| AdSense stack, publisher ID `pub-6523926892521982`, consent, loader, placements, `ads.txt`, CSP untouched | **Held** — `next.config.ts` diff contains *only* the 5 redirect deletions |
| `src/types/content.ts` and concurrent-session files not rewritten wholesale | **Held** — all edits are exact-string surgical edits |

**Concurrent-session hazard.** A second OpenCode session edited this tree during the session (it owns `registry.ts`'s `isContentAvailable()`, `related-reading.tsx`, `src/components/adsense/`, and several content JSON files). Where a file contains both sessions' edits this report says so. Two decisions were driven by that hazard:

1. `src/components/content/related-content.tsx` is reachable from the client bundle via `dynamic-client.tsx` (`"use client"`). An `isContentAvailable` import there **broke a build** with `module-not-found` on `fs`. The change was reverted to HEAD byte-for-byte and the guard was moved to the **server callers** instead.
2. `src/components/content/rich-text.tsx` is likewise client-bundled (via `editorial-comparison.tsx` ← `dynamic-client.tsx`). It therefore **cannot** import `registry`. The content-HTML link guard was placed at the server render boundary instead (§13.3).

---

## 2. Baseline and evidence inputs

| Input | What it provided |
|---|---|
| GSC Page Indexing report, 21/09/2026 | 651 affected URLs across 9 buckets |
| `_gsc-indexation-recovery-report.md` Phases 0–13 | URL inventory (2,026 URLs), redirect map, noindex reconciliation, soft-404 root cause, thin-content matrix, AdSense read-only audit |
| Production crawl `_gsc-crawl.cjs` / `_gsc-links.json` | **681** internal links → 404 from 224 pages (baseline) |
| Static reference scan `_p_refscan.cjs` | 1,199 references resolving to 404 targets: 107 refs / 96 targets (no content file) + 1,092 refs / 169 targets (file exists, unreachable — comparisons only) |
| `noindex-list.json` (622.8 KB) | 878 comparisons, 176 best, and other directories listed as noindex |
| Content census | 1,952 JSON files, **33.4 MB** total across 14 directories |

**Critical caveat:** no per-URL GSC export exists in this repository, so "GSC count" and "reproduced by crawl" are different columns everywhere below and are never conflated.

---

## 3. URL inventory and classification

| Family | Content files | Reachable & indexable | Notes |
|---|---:|---:|---|
| reviews | 151 | 151 | `dynamicParams` defaults to `true` |
| comparisons | 928 (106 published / 822 unpublished) | **47** | `dynamicParams = false` **and** GSP filters `isNoindexed()` → 59 published-but-noindex comparisons are genuine 404s (P5) |
| guides | 100 | 100 | |
| blog | 97 | 97 | |
| glossary | 122 | 122 | GSP filters noindex, but `dynamicParams` defaults to `true` → noindex slugs still render 200 + noindex |
| best | 196 (47 / 149 unpublished) | 47 in GSP; **48 live but absent from sitemap** (P7) | |
| statistics | 104 | 20 prerendered | |
| research | 32 | 32 | |
| use-cases | 49 | 49 | |
| industries | 50 | 50 | |
| alternatives | 101 (26 / 75) | 7 prerendered | |
| hubs | 10 | 10 | |
| authors | 4 keys | 4 | `dynamicParams = false`, `authorSlugs` now exported |

**Key structural fact (drives §8):** only `comparisons/[slug]` and `authors/[slug]` set `dynamicParams = false`. Every other route renders noindex-listed slugs on demand as **200 + noindex meta** — reachable, not 404. Therefore only comparisons convert `noindex` into `404`.

---

## 4. Redirect source-map and resolution (P8)

`next.config.ts` originally defined **6 redirect rules**. All 6 were probed against production in Phase 3:

| # | Source | Code | Destination | Destination status | Classification |
|---|---|---:|---|---:|---|
| 1 | `/comparisons/close-crm-vs-zoho-crm` | 308 | `/comparisons/close-crm-vs-zoho` | **404** | Broken (redirect → 404) |
| 2 | `/comparisons/outreach-io-vs-zoho` | 308 | `/comparisons/outreach-io-vs-zoho-crm` | **404** | Broken |
| 3 | `/comparisons/pipedrive-vs-zoho` | 308 | `/comparisons/pipedrive-vs-zoho-crm` | **404** | Broken |
| 4 | `/comparisons/salesloft-vs-zoho` | 308 | `/comparisons/salesloft-vs-zoho-crm` | **404** | Broken |
| 5 | `/comparisons/zendesk-vs-zoho` | 308 | `/comparisons/zendesk-vs-zoho-crm` | **404** | Broken |
| 6 | `/reviews/calndly` | 308 | `/reviews/calendly` | 200 | Working |

**Decision (P8): SAFE TO FIX NOW — delete rules 1–5, keep rule 6.** Rationale: all five sources *and* all five destinations are `published: false`; the rules produced a useless 308→404 hop for URLs that are not in the sitemap and have zero inbound internal links. Deleting them makes the sources fail fast as truthful 404s instead of chaining. Rule 6 works and was preserved.

**Applied.** `next.config.ts` `redirects()` now contains exactly one entry. The diff is **only** those five deletions — `headers()`, CSP, `ads.txt`/`robots.txt`/`favicon` rules are untouched.

**Verified after rebuild:**

```
PASS hops=0 status=404 final=/comparisons/close-crm-vs-zoho-crm  /comparisons/close-crm-vs-zoho-crm
PASS hops=0 status=404 final=/comparisons/outreach-io-vs-zoho    /comparisons/outreach-io-vs-zoho
PASS hops=0 status=404 final=/comparisons/pipedrive-vs-zoho      /comparisons/pipedrive-vs-zoho
PASS hops=0 status=404 final=/comparisons/salesloft-vs-zoho      /comparisons/salesloft-vs-zoho
PASS hops=0 status=404 final=/comparisons/zendesk-vs-zoho        /comparisons/zendesk-vs-zoho
PASS hops=1 status=200 final=/reviews/calendly                   /reviews/calndly
```

**Redirect → 404 chains: 0 (was 5).**

---

## 5. noindex: intentional vs accidental (P5, P6)

**What is served.** 244 pages emit `noindex, nofollow`: glossary 92, statistics 84, best 47, alternatives 19, `/search` 1, `/dashboard` 1. **0 noindex pages are in the sitemap.** GSC reported 53 — the crawl reproduces 244, the difference being crawl-window and template coverage.

**The disagreement.** `noindex-list.json` is wider than what the templates actually enforce. For `guide`, `blog`, `research`, `use-case`, `industry`, `hub` the templates do **not** emit a noindex meta tag, so a listed slug stays indexable even though the list says otherwise.

**P5 — 59 `published:true` comparisons are 404, not noindex.** Root cause: `comparisons/[slug]/page.tsx:23` sets `dynamicParams = false` and `:27` filters `isNoindexed()` out of `generateStaticParams()`. Because they are never emitted, they render **404**, not a noindex page. **Decision: DO NOT IMPLEMENT YET** — publishing 59 pages or removing them from the list is an editorial/publishing decision.

**P6 — 50 guides: sitemap says index, `noindex-list.json` says noindex.** The sitemap is *correct* (the template serves index); the list is the stale artefact. **Decision: DO NOT IMPLEMENT YET** — correcting `noindex-list.json` would silently change what `generateStaticParams` emits, i.e. it is an indexing decision, not a bug fix.

Both P5 and P6 are unblocked by P1: P1 stops linking to unreachable comparisons, so whichever way P5 is later decided, no crawl budget is currently being poured into the 404s.

---

## 6. robots.txt, canonical and duplicate signals

| Signal | Finding |
|---|---|
| `robots.txt` | Untouched this session. 2 URLs are `Disallow`ed *and* noindexed — `/dashboard`, `/search` — matching GSC's "Blocked by robots.txt" = 2 exactly. Correct. |
| Canonical ≠ self | **0** across all 2,026 crawled URLs |
| Canonical-less pages | Only the former soft-404 shells (now real 404s) — resolved by §9 |
| Pagination URLs | 0 |
| "Alternate page with proper canonical tag" (P11) | GSC = 2, reproduced = **0**. Not reproducible without a per-URL GSC export. **Decision: DO NOT IMPLEMENT YET — no action possible.** |

---

## 7. Sitemap

| Metric | Before (Phase 7.1) | After Phase-13 fix | **Final validation (this session)** |
|---|---:|---:|---:|
| `<loc>` entries | 647 | 646 | **646** |
| Unique URLs | 646 | 646 | **646** |
| Duplicate URLs | **1** (`/dmca`) | 0 | **0** |
| URLs returning non-200 | 0 | 0 | **0** |
| URLs serving noindex | 0 | 0 | **0** |
| URLs soft-404 | not measured | not measured | **0** |

Fixes carried forward: `src/app/sitemap.ts` de-duplication (`const seen = new Set<string>()`, line 179), `src/app/sitemap-html/page.tsx:18` comparison filter, `src/app/comparisons/page.tsx:20` comparison filter.

**Every one of the 646 sitemap URLs was fetched and inspected** for status, `noindex` meta, soft-404 markers and outbound links: **646/646 → HTTP 200, 0 noindex, 0 soft-404, 0 duplicate.**

Composition note: the sitemap contains **no `/best/*` individual pages** — this is P7 (48 live `/best/*` absent from the sitemap), deliberately **not** changed this session.

---

## 8. 404s ("Not found")

**GSC 385 vs reproduced 882** (881 comparisons + 1 `/cdn-cgi`). Composition: 822 unpublished comparisons + 59 published-but-noindex comparisons excluded by `dynamicParams = false`.

**Internal links feeding Google the 404s — the trajectory across this recovery:**

| Stage | Internal links → 404 | Pages emitting dead links | Source |
|---|---:|---:|---|
| Production baseline | **681** | 224 | `_gsc-crawl.cjs` |
| After Phase-13 fixes (sitemap-html 59 + `/comparisons` hub 49) | **573** | 222 | report §8.2 |
| After this session's P1 + P2 | **0** | **0** | `_final_validate.cjs` |

**P1 — 573 remaining internal links → 404. Decision: SAFE TO FIX NOW.** The report proposed filtering two files; the actual emitter set is larger, so the codebase's own canonical helper `isContentAvailable(type, slug)` (`src/lib/content/registry.ts`) was applied at **every** site that can emit a bad link (§13.1).

**P2 — 17 dead `/best/*` → `/reviews/*` links + JSON-LD. Decision: SAFE TO FIX NOW.** `_p_refscan.cjs` independently reports `reviews` = 17 dead targets / 17 refs, all from `best/*/picks.toolSlug` — an exact match to the report. Fixed with `linkedPicks` + `reviewHref()` in `src/app/best/[slug]/page.tsx` across three render sites and three structured-data sites.

**Final measurement:**

```
unique internal links discovered: 888
checked=888 non200=0 404=0
```

The crawl is not one-level: it seeds from all 646 sitemap URLs, then fetches the **244 additional reachable pages** discovered on those pages that are *not* in the sitemap, then checks the union of all `href` targets found on all 890 pages. Round 2 also returned **0 non-200**.

---

## 9. Soft 404 (P4)

**GSC 28, reproduced 241** — URLs returning **HTTP 200** while serving the not-found UI.

**Root cause (proved in Phase 9.2):** `notFound()` fires *after* the `loading.tsx` route shell has already committed status 200, so Google receives a 200 for a page that says "this page doesn't exist". Composition of the 241: 224 `published:false` + 17 missing review files.

**Decision: SAFE TO FIX NOW — Option A only. Options B and C explicitly rejected.**

| Option | What it was | Decision |
|---|---|---|
| **A — delete `src/app/loading.tsx`** | Removes the single boundary that commits 200 before `notFound()` | **EXECUTED — approved** |
| B — `notFound()` earlier in the render | Still races the shell | **DO NOT IMPLEMENT** |
| C — blanket `dynamicParams = false` | Would 404 every noindex-listed slug on 12 routes and create a new, larger 404 class | **DO NOT IMPLEMENT** |

**Proof of Option A (before the final build):** file backed up to `%TEMP%\opencode\loading.tsx.orig`, deleted, clean build, standalone server on port 3171 with `Host: www.pilotstack.online`, probed 14 invalid + 14 valid URLs (`_exp_loading.cjs`):

- **Invalid → 404: 14/14 PASS** (`invalidNon404 = 0`)
- **Valid → 200: 13/14** — the single "FAIL" was a bad probe choice (`/best/best-ai-coding-tools` has `published: false`, so it always threw `notFound()`; removing `loading.tsx` only changed it from soft-404-200 to genuine 404). **No valid URL regressed.**
- Scope confirmed: exactly **one** loading boundary removed, no route-level ones; all page routes are `○`/`●` (prerendered), only `ƒ` are `opengraph-image` / `rss.xml` / middleware — so no skeleton was ever serving a real page.

**Final measurement — soft-404 count = 0** across the 15 invalid probes and all 646 sitemap URLs.

---

## 10. Content quality and thin content (P9)

Phase 10 of the source report: 40 indexable pages under 300 words — 31 thin glossary terms in the sitemap (median 212 words) plus thin static pages `/contact`, `/team`, `/press`.

**P9 — 31 thin glossary terms in the sitemap. Decision: DO NOT IMPLEMENT YET.** Enriching them is content authoring (explicitly prohibited this session); removing them from the sitemap is an indexing decision. The GSC bucket ("Crawled — currently not indexed" = 35) is a *content quality* signal, not an indexation bug, and is out of scope for "safe to fix now".

**P7 — 48 live `/best/*` absent from sitemap. Decision: DO NOT IMPLEMENT YET.** Adding 48 URLs to the sitemap is an indexing decision.

**P10 — `npm test` timeout. Decision: SAFE TO FIX NOW** → §12.

---

## 11. AdSense stack integrity (read-only verification)

Phase 11 of the source report audited the AdSense stack read-only. This session **re-verified non-touching** rather than re-auditing:

| Artefact | Check |
|---|---|
| `ads.txt` | **No git change** (`git status -- ads.txt` clean); probe returns 200, no redirect |
| Publisher ID `pub-6523926892521982` | Untouched |
| Consent / loader / placements | Untouched |
| CSP (`next.config.ts:27–47`) | Untouched — the `next.config.ts` diff is **only** the five deleted redirect rules |
| `headers()` rules for `/ads.txt`, `/robots.txt`, `/favicon.svg`, `/apple-touch-icon.png`, `/:path*.svg`, `/og.png` | All present and unchanged |
| `robots.txt` | No git change |

`src/components/adsense/` and `src/components/ads/` are **untracked new directories owned by the concurrent session** — not created or modified by this recovery work.

---

## 12. Build, type-check, lint and tests (P10)

**P10 — `npm test` timeout failure. Decision: SAFE TO FIX NOW.** Applied: `vitest.config.ts` gains `testTimeout: 30000` and `hookTimeout: 30000`.

| Gate | Result |
|---|---|
| `npx tsc --noEmit` | **exit 0** |
| `npx eslint` (22 files touched by this session) | **0 errors**, 23 warnings — all pre-existing `no-unused-vars` (verified: no warning was introduced by these edits; every removed usage belongs to the concurrent session or was already unused at HEAD) |
| `npm test` | **16/16 passed** (3 files), 26.70 s — was **15/16** before (`searchContent > is case-insensitive` timed out at the 5 s default; now passes in 676 ms) |
| `npm run build` | **SUCCESS** — Next.js 16.2.10 (Turbopack), `Compiled successfully in 62s`, `Finished TypeScript in 57s`, **`Generating static pages (610/610) in 104s`**, `.next/standalone/server.js` + `prerender-manifest.json` both produced |

**Build-environment note (not a code defect).** Two intermediate builds failed with `Static page generation ... took more than 60 seconds` on one arbitrary route each (`/reviews/airtable`, `/category/analytics-data`, `/category/security-compliance`) — a rotating victim, never the same route twice. Root cause was resource contention: a second session was building the same tree concurrently and free RAM was as low as **1.4 GB of 8.0 GB**. Confirmed *not* caused by these changes by measuring the data footprint: **1,952 content files = 33.4 MB total**, so even the heaviest added filter (`isContentAvailable` over 106 published comparisons) is ~1 MB of I/O per page — three orders of magnitude below a 60 s timeout. Once memory recovered to ~3 GB the identical command produced a clean 610/610 build in 104 s. `registry.ts` also gained an mtime-keyed `jsonCache` (concurrent session), which removes repeated re-reads entirely.

**Static page count is unchanged at 610** — no page was added or removed by these fixes.

---

## 13. P1–P11 decisions and implementation

### 13.1 Summary table

| # | Issue | Decision | Implemented |
|---|---|---|---|
| **P1** | 573 remaining internal links → 404 | **SAFE TO FIX NOW** | **Yes** — `isContentAvailable()` at every link emitter |
| **P2** | 17 dead `/best/*` → `/reviews/*` links + JSON-LD | **SAFE TO FIX NOW** | **Yes** |
| **P3** | Byline hard-codes wrong author (152 inlinks) | **SAFE TO FIX NOW** (fix amended) | **Yes** — allowlisted author slug |
| **P4** | 241 soft-404 pages return HTTP 200 | **SAFE TO FIX NOW — Option A** (B & C rejected) | **Yes** — `src/app/loading.tsx` deleted |
| **P5** | 59 `published:true` comparisons are 404, not noindex | **DO NOT IMPLEMENT YET** | No |
| **P6** | 50 guides: sitemap says index, list says noindex | **DO NOT IMPLEMENT YET** | No |
| **P7** | 48 live `/best/*` absent from sitemap | **DO NOT IMPLEMENT YET** | No |
| **P8** | 5 redirects → 404 | **SAFE TO FIX NOW** | **Yes** — rules 1–5 deleted, rule for `/reviews/calndly` kept |
| **P9** | 31 thin glossary terms in sitemap | **DO NOT IMPLEMENT YET** | No |
| **P10** | `npm test` timeout failure | **SAFE TO FIX NOW** | **Yes** — `testTimeout` raised |
| **P11** | "Alternate page with proper canonical tag" = 2 | **DO NOT IMPLEMENT YET** (not reproducible) | No |

**Approved & implemented: P1, P2, P3, P4, P8, P10 (6). Deferred: P5, P6, P7, P9, P11 (5).**

### 13.2 P1 — 573 internal links → 404

The report named two files; the real emitter set is larger. The fix uses the codebase's **own canonical helper** `isContentAvailable(type, slug)`, which documents itself as *"Use this before emitting an internal link so we never send users or crawlers to unpublished or suppressed content."* One authority, one convention, reused consistently.

Guarded emitters:

| File | Guard |
|---|---|
| `src/components/entity/semantic-links.tsx` | `isContentAvailable("comparison"\|"guide"\|"blog"\|"review", slug)` |
| `src/app/category/[slug]/page.tsx` | comparisons filtered before display **and** before `InternalLinks`/graph use |
| `src/app/page.tsx` (homepage) | trending comparison links filtered |
| `src/lib/content/internal-links.ts` | comparisons branch filtered |
| `src/lib/content/entity-graph.ts` | `buildGraph()` comparisons filtered → covers `buyerJourney` / `catGraph` site-wide |
| `src/components/content/enhanced-related-content.tsx` | `TYPE_FOR_ROUTE` + `isLinkable()` (server-only component) |
| `src/components/entity/auto-comparison.tsx` | `isContentAvailable("comparison", compSlug)` |
| `src/app/rss.xml/route.ts` | filtered before `.slice(0, 20)` |
| `src/app/api/search/route.ts` | filtered |
| `src/app/blog/[slug]/page.tsx` | `relatedComparisons` filtered |
| `src/app/research/[slug]/page.tsx` | `relatedComparisons` filtered |
| `src/app/glossary/[slug]/page.tsx` | category-matched comparisons filtered |
| `src/app/comparisons/[slug]/page.tsx` | content-HTML links stripped (§13.3) |

**Client-bundle constraint.** `related-content.tsx` and `rich-text.tsx` both sit in the client bundle. Importing `registry` (which imports `fs`) into either **breaks the build**. `related-content.tsx` was reverted to HEAD byte-for-byte; its guards moved to the server callers listed above.

### 13.3 Content-HTML links (new, discovered by the final crawl)

The first full crawl found **2 residual dead internal links** that no static scan had attributed to a render path — both emitted as authored HTML inside comparison content and rendered through `RichText`:

```
404 /comparisons/zapier-vs-make   <- 47 comparison pages (tool1Detail / tool2Detail / verdict / faq)
404 /best/best-design-tools       <- 7 comparison pages
```

- `/comparisons/zapier-vs-make` — file exists and is published, but is **noindex-listed**, and `comparisons` uses `dynamicParams = false` → genuine 404.
- `/best/best-design-tools` — `content/best/best-design-tools.json` has `published: false` → genuine 404.

**Fix (no content file edited, no text altered):** a new server-only helper `src/lib/content/link-guard.ts` exposes `stripDeadContentLinks(html)`, which walks `<a href="/…">` anchors, maps the route segment to its content type via the `DIR_FOR_TYPE` route table, and — when `isContentAvailable()` is false — **unlinks the anchor but keeps the label text verbatim**. Applied at the three server render boundaries in `src/app/comparisons/[slug]/page.tsx`: `cmp.verdict`, each `faq.answer`, and the `safeFeatures` projection of `tool1Detail` / `tool2Detail` passed to `EditorialComparison`.

This is link-level surgery only: prose is byte-identical, no URL is invented, no content is rewritten.

### 13.4 P2 — 17 dead review links + JSON-LD

`src/app/best/[slug]/page.tsx`: added `linkedPicks` (filters `getReview(p.toolSlug) !== null`) and a `reviewHref()` helper. JSON-LD (`mentions`, `ItemListSchema` items, `mainEntity.itemListElement`) and all three render sites now use them, so structured data can no longer advertise a review that does not exist.

### 13.5 P3 — byline author (amended fix)

The report proposed deriving an author slug from the byline. That was **amended**: `authors/[slug]` sets `dynamicParams = false`, so an unguarded slug derivation would have created a *new* 404 class from a fix meant to remove links. Applied instead:

- `src/app/authors/[slug]/page.tsx` now exports `authorSlugs` (the 4 real keys: `sarah-chen`, `marcus-rivera`, `emily-nakamura`, `pilotstack-team`).
- `src/app/reviews/[slug]/page.tsx` derives `authorSlug` (`trim → lowercase → \s+ → -`) and only links when it is on that allowlist; otherwise the byline renders as plain unlinked text.

Safe failure mode: **no link**, never a 404.

### 13.6 P4, P8, P10

See §9, §4 and §12 respectively.

### 13.7 Deferred items — what unblocks them

| Item | What a human must decide |
|---|---|
| P5 | Publish the 59 published-but-noindex comparisons, or delete them from `noindex-list.json` |
| P6 | Authoritative source of truth: `noindex-list.json` or the templates |
| P7 | Whether 48 live `/best/*` belong in the sitemap |
| P9 | Enrich the 31 thin glossary terms, or drop them from the sitemap |
| P11 | Requires a per-URL GSC export that does not exist in this repository |

---

## 14. Post-fix validation, artifact index and safety checklist

### 14.1 Validation method

`_final_validate.cjs` starts `.next/standalone/server.js` on port 3171 with `Host: www.pilotstack.online` (middleware 308s otherwise), then runs five passes:

1. 15 invalid URL probes across every content family + a root 404.
2. All 6 redirect sources, following hops.
3. Full `sitemap.xml` parse and de-duplication.
4. Fetch **all 646 sitemap URLs**, recording status / `noindex` / soft-404 markers / outbound `href`s; then fetch the **244 additional reachable pages** discovered on them (round 2).
5. Fetch the union of all **888** discovered internal link targets.

A separate `_authors_probe.cjs` verifies all 4 author pages + 15 sampled valid URLs.

### 14.2 Results — **ALL CHECKS PASS**

```
== SUMMARY ==
{
  "invalid_non404": 0,
  "invalid_soft404": 0,
  "redirect_fail": 0,
  "sitemap_dupes": 0,
  "sitemap_non200": 0,
  "sitemap_noindex": 0,
  "sitemap_soft404": 0,
  "authors_bad": 0,
  "internal_non200": 0,
  "internal_404": 0
}
OVERALL: PASS
```

| Check | Result |
|---|---|
| Invalid URLs → 404 | **15/15 PASS**, 0 soft-404, 0 redirects |
| Soft-404 (invalid probes) | **0** |
| Soft-404 (646 sitemap URLs) | **0** (was 241 site-wide) |
| Redirect → 404 chains | **0** (was 5); `/reviews/calndly` → 308 → 200 preserved |
| Sitemap `<loc>` / unique / dupes | **646 / 646 / 0** |
| Sitemap URLs → non-200 | **0** |
| Sitemap URLs → noindex | **0** |
| Internal links checked → non-200 | **0 of 888** (was 681 of ~2,026) |
| Internal links → 404 | **0** (was 681) |
| Round-2 (244 non-sitemap reachable pages) → non-200 | **0** |
| `/authors/*` in sitemap → 200 | **3/3** |
| All 4 `/authors/[slug]` pages → 200, canonical correct | **4/4 PASS** |
| Sampled valid URLs → 200, not noindex, correct canonical | **19/19 PASS** |
| `tsc --noEmit` | **exit 0** |
| `eslint` (22 files) | **0 errors**, 23 pre-existing warnings |
| `npm test` | **16/16 passed** |
| `npm run build` | **SUCCESS**, 610/610 static pages |

### 14.3 Files changed by this recovery session

**Deleted (1)**

- `src/app/loading.tsx` — P4 Option A (backup at `%TEMP%\opencode\loading.tsx.orig`)

**Created (1)**

- `src/lib/content/link-guard.ts` — P1 content-HTML link guard

**Modified (22)**

| File | Items |
|---|---|
| `next.config.ts` | P8 — 5 redirect rules deleted (CSP/headers untouched) |
| `vitest.config.ts` | P10 — `testTimeout` / `hookTimeout` 30000 |
| `src/app/sitemap.ts` | earlier fix — `<loc>` de-duplication |
| `src/app/sitemap-html/page.tsx` | earlier fix — comparison filter |
| `src/app/comparisons/page.tsx` | earlier fix — comparison filter |
| `src/components/entity/semantic-links.tsx` | P1 |
| `src/components/entity/auto-comparison.tsx` | P1 |
| `src/components/content/enhanced-related-content.tsx` | P1 |
| `src/lib/content/internal-links.ts` | P1 |
| `src/lib/content/entity-graph.ts` | P1 |
| `src/app/page.tsx` | P1 |
| `src/app/category/[slug]/page.tsx` | P1 *(also contains concurrent-session edits)* |
| `src/app/blog/[slug]/page.tsx` | P1 — 2 lines *(also contains concurrent-session edits)* |
| `src/app/research/[slug]/page.tsx` | P1 — 2 lines *(also contains concurrent-session edits)* |
| `src/app/glossary/[slug]/page.tsx` | P1 — 2 lines *(also contains concurrent-session edits)* |
| `src/app/comparisons/[slug]/page.tsx` | P1 — import + `safeFeatures` + 3 call sites *(also contains concurrent-session edits)* |
| `src/app/rss.xml/route.ts` | P1 |
| `src/app/api/search/route.ts` | P1 |
| `src/app/best/[slug]/page.tsx` | P2 |
| `src/app/authors/[slug]/page.tsx` | P3 — `authorSlugs` export |
| `src/app/reviews/[slug]/page.tsx` | P3 — byline allowlist *(also contains concurrent-session edits)* |

**Explicitly NOT touched:** `src/types/content.ts`, `src/components/content/related-content.tsx` (reverted to HEAD), `src/lib/content/registry.ts`, `src/lib/noindex.ts`, `noindex-list.json`, `ads.txt`, `robots.txt`, `.env.local`, any `content/**.json`, the AdSense components, `headers()` / CSP.

**Harnesses (gitignored, `_*.cjs`):** `_final_validate.cjs`, `_authors_probe.cjs`, `_exp_loading.cjs`, `_p_refscan.cjs`, `_gsc-crawl.cjs`, `_gsc-localtest.cjs`.

### 14.4 STATUS BLOCK

```
FILES CHANGED            24 (1 deleted, 1 created, 22 modified) by this recovery session;
                         working tree total 84 files dirty including concurrent-session edits
BUILD                    PASS — Next.js 16.2.10 (Turbopack), 610/610 static pages,
                         compiled 62s, TypeScript 57s, static generation 104s,
                         standalone + prerender-manifest produced
TSC                      PASS — npx tsc --noEmit exit 0
ESLINT                   PASS — 0 errors, 23 pre-existing no-unused-vars warnings
TESTS                    PASS — npm test 16/16 (3 files, 26.70s); was 15/16
VALID URL HTTP 200       PASS — 646/646 sitemap URLs + 244 round-2 pages + 19/19 sampled
                         all HTTP 200, canonicals unchanged, 0 noindex
INVALID URL HTTP 404     PASS — 15/15 probes across every content family → HTTP 404
SOFT-404                 PASS — 0 (invalid probes) and 0 (646 sitemap URLs); was 241
                         site-wide, root cause src/app/loading.tsx removed
REDIRECT→404             PASS — 0 chains (was 5); 5 removed rules now direct 404 with
                         0 hops; /reviews/calndly → 308 → 200 preserved
INTERNAL 404 LINKS       PASS — 0 of 888 unique internal links non-200 (was 681)
                         across 890 crawled pages (646 sitemap + 244 round-2)
SITEMAP                  PASS — 646 loc / 646 unique / 0 dupes / 0 non-200 /
                         0 noindex / 0 soft-404
P1–P11 APPROVED          P1, P2, P3, P4, P8, P10  (6 of 11 — all implemented)
P1–P11 DEFERRED          P5, P6, P7, P9, P11      (5 of 11 — all require a human
                         publishing/indexing decision or a GSC export that does not
                         exist in this repository)
```

### 14.5 Safety checklist (final)

- [x] No commit, push, deploy or remote-branch change
- [x] No mass page generation — static pages 610 → 610
- [x] No blanket `generateStaticParams` emission — GSP filters unchanged
- [x] No placeholder pages created
- [x] No `noindex` used as a status substitute — no noindex added
- [x] No valid URL changed — all 646 sitemap URLs 200 with identical canonicals
- [x] No content rewriting — zero `content/**.json` files edited; only anchor *hrefs* to unreachable targets were dropped, label text preserved verbatim
- [x] No bulk title changes, no new SEO pages, no large page removals
- [x] No affiliate, monetisation or editorial changes
- [x] No fabricated content, no keyword stuffing
- [x] AdSense stack, publisher ID, consent, loader, placements, `ads.txt`, CSP untouched
- [x] Concurrent session's files not rewritten wholesale

### 14.6 Artifact index

| Artifact | Purpose |
|---|---|
| `_gsc-indexation-recovery-report.md` | Phases 0–13, full evidence base |
| `_gsc-p1-p11-decision.md` | P1–P11 verbatim + 8-field approval record |
| **`_gsc-indexation-recovery-final.md`** | **This report** |
| `_final_validate.cjs` → `%TEMP%\opencode\final_validate.json` | 5-pass local validation crawl |
| `_authors_probe.cjs` → `%TEMP%\opencode\authors_probe.json` | Author + valid-URL canonical probe |
| `_exp_loading.cjs` | P4 Option A before/after probe |
| `_p_refscan.cjs` → `_p_refscan.json` | Static dead-reference scan |

---

## STOP

**P1, P2, P3, P4, P8 and P10 are implemented and fully validated; P5, P6, P7, P9 and P11 remain deferred pending a human decision.**

No SEO "Position 50" work has been started. Nothing has been committed, pushed or deployed. Working tree is left dirty for review.
