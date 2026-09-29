# PilotStack — Google Search Console Page Indexing Recovery Report

**Site:** https://www.pilotstack.online
**Repository:** `C:\Users\user\Desktop\DEEPSK` (branch `master`, HEAD `4a8b790`)
**GSC snapshot analysed:** 21/09/2026 (651 affected URLs, 9 buckets)
**Crawl executed:** 29/09/2026 (2026 unique URLs)
**Report generated:** 29/09/2026

---

## 0. Scope, method and safety statement

### What was and was not done

| Action | Status |
|---|---|
| Read-only evidence gathering (crawl, source audit, sitemap parse, AdSense verification) | Done |
| Code fixes (3 files, +20/−3 lines) | Done — see Phase 13 |
| `git commit` | **Not done** |
| `git push` | **Not done** |
| Deploy / Vercel configuration change | **Not done** |
| Ads.txt, CSP, consent defaults, AdSense loader, Hilltop behaviour | **Untouched** |
| `robots.txt` rules | **Untouched** |
| Redirect rules in `next.config.ts` | **Untouched** (documented only) |
| Any URL removed from the sitemap to shrink GSC numbers | **Not done** |
| Fabricated content, sources, statistics | **None** |

### Critical caveat — no per-URL GSC export exists

The repository contains **only aggregate GSC counts**. There is no per-URL (URL Inspection / "Pages" detail) export for 21/09/2026.

Consequently, **every bucket population in this report was reproduced independently** by:

1. Fetching the live `sitemap.xml` and `robots.txt`.
2. Building a crawler (`_gsc-crawl.cjs`) that resolves the internal link graph and requests every discovered URL.
3. Cross-referencing against `content/**`, `noindex-list.json`, `generateStaticParams()` in each route, and `next.config.ts`.

Where a bucket could **not** be reproduced from the repository (e.g. "Alternate page with proper canonical tag"), this is stated explicitly rather than guessed. A per-URL GSC export is required to close those items.

### Concurrent-session hazard

A **second OpenCode session is editing this working tree at the same time** (7 OpenCode processes observed; files under `content/**`, `src/app/**`, `src/lib/content/registry.ts` and `src/types/content.ts` are being modified concurrently).

Mitigations applied:

* `src/types/content.ts` and `src/app/guides/[slug]/page.tsx` were **not** modified by this session.
* Fixes were restricted to the smallest possible diffs; where a file was being actively edited, the edit was a single additive line and was verified afterwards to coexist with the other session's changes.
* Two transient failures observed during the session (duplicate-identifier errors in `src/types/content.ts`) were **caused by and then fixed by the other session**; they are reported as observations, not as defects of the indexation work.

---

## Phase 0 — Baseline and freeze check

| Item | Value |
|---|---|
| HEAD | `4a8b790` *"feat: add SEO health check and linking audit scripts"* |
| Tracking | `master` … `origin/master` (in sync, no local commits) |
| Pre-existing modified files at session start | 22 files (+265/−71) — treated as the legitimate current repository state |
| Modified files at report time | 35 (22 pre-existing + 13 from the concurrent session) |
| Files changed by this session | 3 (`src/app/sitemap.ts`, `src/app/sitemap-html/page.tsx`, `src/app/comparisons/page.tsx`) |
| Freeze check | **FAILED** — the tree changed during the session (concurrent agent). Proceeded under explicit acknowledgement of the concurrent session. |

---

## Phase 1 — Evidence inputs

| Input | Source | Result |
|---|---|---|
| Sitemap | live `https://www.pilotstack.online/sitemap.xml` | 647 `<loc>` entries → **646 unique** (1 duplicate) |
| Sitemap history | `sitemap-urls.txt` (09/08/2026) | 1670 entries — the sitemap has shrunk by **1023 URLs** since August |
| Robots | live `/robots.txt` | Disallows `/api/`, `/admin/`, `/dashboard`, `/search`, `/_global-error` |
| URL inventory | `_gsc-inventory.json` | **2026 URLs**, full status/canonical/robots/word/inlink matrix |
| Link graph | `_gsc-links.json` | source → target map for every 200 page |
| Content authority | `noindex-list.json` (generated 2026-09-19) | 1799 files, 1351 `noindex`, 448 `keep` |
| Route authority | `generateStaticParams()` per route | determines which slugs are prerendered |
| Redirect authority | `next.config.ts` `redirects()` | 6 rules |
| Legacy URL universe | `_legacy-urls.json`, `crawl-final-urls.json`, `unpublished-comparisons.txt` (822 lines) | legacy/discovery set |

---

## Phase 2 — URL inventory and classification

### 2.1 Status distribution

| Status | Count | Share |
|---|---:|---:|
| 200 | 1144 | 56.5% |
| 404 | 882 | 43.5% |
| 3xx (chain) | 5 | (subset of the 882 — they land on 404) |
| **Total** | **2026** | |

### 2.2 Content families

| Family | URLs | 200 | 404 | meta-noindex | In sitemap | 200 w/ 0 words | Thin (<300w) | Median words |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| alternatives | 102 | 102 | 0 | 19 | 8 | 75 | 1 | 0 |
| authors | 5 | 5 | 0 | 0 | 4 | 0 | 2 | 2274 |
| best | 197 | 197 | 0 | 47 | 1 | 149 | 0 | 0 |
| blog | 98 | 98 | 0 | 0 | 98 | 0 | 0 | 755 |
| category | 12 | 12 | 0 | 0 | 12 | 0 | 0 | 3091 |
| comparisons | 929 | 48 | 881 | 0 | 48 | 0 | 0 | 5089 |
| glossary | 123 | 123 | 0 | 92 | 31 | 0 | 117 | 212 |
| guides | 101 | 101 | 0 | 0 | 101 | 0 | 0 | 914 |
| hubs | 11 | 11 | 0 | 0 | 11 | 0 | 1 | 2987 |
| industries | 51 | 51 | 0 | 0 | 51 | 0 | 1 | 527 |
| research | 33 | 33 | 0 | 0 | 33 | 0 | 0 | 617 |
| reviews | 169 | 169 | 0 | 0 | 152 | 17 | 0 | 2023 |
| statistics | 105 | 105 | 0 | 84 | 21 | 0 | 0 | 847 |
| use-cases | 50 | 50 | 0 | 0 | 50 | 0 | 0 | 541 |
| static/trust pages | 30 | 30 | 0 | 0 | 30 | 0 | 3 | 389 |
| system (`/search`, `/dashboard`) | 2 | 2 | 0 | 2 | 0 | 0 | 2 | — |
| assets (`*.svg`, `*.png`, `rss.xml`, …) | 20 | 20 | 0 | 0 | 1 | — | — | — |

### 2.3 Route families identified

`reviews`, `comparisons`, `guides`, `blog`, `glossary`, `best`, `alternatives`, `use-cases`, `industries`, `hubs`, `research`, `statistics`, `category`, `authors`, `tools`, plus ~30 static pages.

---

## Phase 3 — Redirect source-map

`next.config.ts` defines **6 redirect rules**. All 6 were probed against production.

| # | Source | Code | Target | Target status | In sitemap | Internal inlinks | Verdict |
|---|---|---|---|---|---|---:|---|
| 1 | `/comparisons/close-crm-vs-zoho-crm` | 308 | `/comparisons/close-crm-vs-zoho` | **404** | No | 0 | **Broken (redirect → 404)** |
| 2 | `/comparisons/outreach-io-vs-zoho` | 308 | `/comparisons/outreach-io-vs-zoho-crm` | **404** | No | 0 | **Broken (redirect → 404)** |
| 3 | `/comparisons/pipedrive-vs-zoho` | 308 | `/comparisons/pipedrive-vs-zoho-crm` | **404** | No | 0 | **Broken (redirect → 404)** |
| 4 | `/comparisons/salesloft-vs-zoho` | 308 | `/comparisons/salesloft-vs-zoho-crm` | **404** | No | 0 | **Broken (redirect → 404)** |
| 5 | `/comparisons/zendesk-vs-zoho` | 308 | `/comparisons/zendesk-vs-zoho-crm` | **404** | No | 0 | **Broken (redirect → 404)** |
| 6 | `/reviews/calndly` | 308 | `/reviews/calendly` | 200 | No | 0 | Working |

**Chains:** 0 (single hop each). **Looping redirects:** 0. **HTTP→HTTPS and apex→www:** handled by middleware, all return 308 to `https://www.pilotstack.online/...` (verified locally by supplying a `Host` header).

**Classification:** the 5 broken rules are slug-normalisation redirects (`*-vs-zoho` → `*-vs-zoho-crm`, and the inverse for rule 1) whose **destination was subsequently unpublished**. They are not in the sitemap and have **zero inbound internal links**, so they only affect URLs Google discovered historically. This matches the GSC *"Page with redirect"* bucket (count 4; the crawl finds 5 — one of the five may be outside GSC's crawl window).

**Action taken:** none. These rules work exactly as written; the defect is the unpublished destination, which is a content-curation decision, not a redirect-configuration error. Changing them would alter the site's redirect architecture without a proven regression. **Recommendation for approval:** either publish the `*-vs-zoho-crm` destinations, or delete rules 1–5 so the sources fail fast as real 404s instead of chaining to a 404.

---

## Phase 4 — noindex: intentional vs accidental

Three independent sources of truth disagree, so they are reported separately.

### 4.1 What the pages actually serve (`<meta name="robots">`)

| meta robots value | Pages |
|---|---:|
| `index, follow` | 887 |
| `noindex, nofollow` | 244 |
| absent (404 responses) | 882 |
| absent (assets) | 13 |
| **Total** | **2026** |

`X-Robots-Tag` header: present on **0** pages.

### 4.2 The 244 `noindex, nofollow` pages

| Family | Pages | In sitemap | Intentional? |
|---|---:|---:|---|
| glossary | 92 | 0 | Yes — thin evergreen stubs, excluded from sitemap |
| statistics | 84 | 0 | Yes — excluded from sitemap |
| best | 47 | 0 | Yes — excluded from sitemap |
| alternatives | 19 | 0 | Yes — excluded from sitemap |
| `/dashboard` | 1 | 0 | Yes — system page, robots-blocked |
| `/search` | 1 | 0 | Yes — system page, robots-blocked |
| **Total** | **244** | **0** | |

**Verdict: 0 accidental noindex.** Every noindex page is excluded from the sitemap — the XML sitemap and the meta tags agree perfectly. This bucket needs no repair.

### 4.3 The disagreement: `noindex-list.json` vs what is served

`noindex-list.json` marks **1351 files** as `noindex`. Only **242** of them actually serve a noindex tag. The remaining **231 pages serve `index, follow` while the curation list says "noindex":**

| Family | Listed `noindex` | Served `index, follow` | Why |
|---|---:|---:|---|
| guides | 50 | **50** | `isNoindexed()` is used in `generateStaticParams()` but **not** in `generateMetadata()` for `guides/[slug]` |
| best | 176 | **129** | the other 47 serve noindex; 129 are `published:false` (soft-404, no meta control) |
| alternatives | 71 | **52** | the other 19 serve noindex; 52 are `published:false` (soft-404) |
| comparisons | 878 | 0 | `dynamicParams = false` converts them to 404 before any meta is emitted |
| glossary / statistics | 92 / 84 | 0 | correctly enforced |

**The one genuine, actionable inconsistency is the 50 guides**: they are in the XML sitemap, they render full content (median 914 words), they serve `index, follow`, and they are also in the sitemap — but `noindex-list.json` says they should be noindexed. Three sources, two answers. This is a **decision item, not a bug to auto-fix** (see Phase 13, "Pending approval").

---

## Phase 5 — robots.txt

```
User-agent: *
Disallow: /api/
Disallow: /admin/
Disallow: /dashboard
Disallow: /search
Disallow: /_global-error
```

| Disallowed path with internal links | Status | meta robots | In sitemap | Internal inlinks | Verdict |
|---|---|---|---|---:|---|
| `/dashboard` | 200 | `noindex, nofollow` | No | 1 | Intentional system page — **no change** |
| `/search` | 200 | `noindex, nofollow` | No | 1131 | Intentional system page (in the global nav) — **no change** |
| `/api/*`, `/admin/*`, `/_global-error` | — | — | No | 0 | No crawlable content — **no change** |

**GSC "Blocked by robots.txt" = 2** reconciles exactly with `/dashboard` + `/search`. Both are doubly protected (robots **and** noindex), both are out of the sitemap. **Legitimate, requires no action.**

Sitemap URLs blocked by robots.txt: **0**.

---

## Phase 6 — Canonical, alternate and duplicate signals

| Check | Result |
|---|---|
| Canonical present on 200 HTML pages | 890 / 1134 |
| Canonical ≠ self | **0** |
| Canonical groups with >1 URL | **0** |
| hreflang / `rel=alternate` | **0** |
| AMP / `?amp` alternates | **0** |
| Pagination URLs (`?page=`, `/page/N`) | **0** — `src/components/ui/pagination.tsx` exists but is **not imported anywhere** |
| 200 pages with **no** canonical | 244 |
| ↳ of those, soft-404 shells | 241 |
| ↳ genuine pages without canonical | **3** (`/contact`, `/team`, `/search` — plus `/dashboard`, `/manifest.webmanifest` depending on content type) |

**Interpretation:** GSC reports *"Duplicate, submitted URL not selected by user" = 5* and *"Alternate page with proper canonical tag" = 2*.

* The duplicate bucket is **not** caused by pagination (no pagination URLs exist) and **not** by conflicting canonicals (canonical ≠ self = 0). The only URLs missing a canonical are the soft-404 shells, which emit byte-identical boilerplate — that is a plausible duplicate source.
* The alternate-canonical bucket could **not be reproduced**: zero canonical mismatches were found across all 2026 URLs. **A per-URL GSC export is required** to identify these 2 URLs. No action is taken on unverified evidence.

---

## Phase 7 — Sitemap

### 7.1 Before / after

| Metric | Before | After fix |
|---|---:|---:|
| `<loc>` entries | 647 | **646** |
| Unique URLs | 646 | **646** |
| Duplicate URLs | **1** (`/dmca`) | **0** |
| URLs returning non-200 | 0 | 0 |
| URLs serving noindex | 0 | 0 |
| URLs with 0 content words | 0 | 0 |
| URLs < 300 words | 39 | 39 |

### 7.2 Duplicate root cause (FIXED)

`/dmca` was emitted **twice**:

1. `src/app/sitemap.ts:45` — hard-coded in `staticPages`.
2. `src/app/sitemap.ts:46-51` — via `editorialLinks` from `src/lib/constants.ts`, which contains `href: "/dmca"`.

Google treats duplicate `<loc>` entries as a sitemap error and may de-prioritise the whole file.

**Fix:** `src/app/sitemap.ts` now de-duplicates the assembled entry list by URL (first definition wins, preserving the `yearly`/`0.2` metadata for `/dmca`).

**Verified** against a production build served locally:

```
sitemap.xml status=200 locs=646 unique=646
dmca entries=1 -> https://www.pilotstack.online/dmca
duplicate urls=0
```

### 7.3 Sitemap composition (after fix)

| Segment | URLs |
|---|---:|
| `/reviews/*` (+ hub) | 152 |
| `/guides/*` (+ hub) | 101 |
| `/blog/*` (+ hub) | 98 |
| `/use-cases/*` (+ hub) | 50 |
| `/industries/*` (+ hub) | 51 |
| `/comparisons/*` (+ hub) | 48 |
| `/research/*` (+ hub) | 33 |
| `/glossary/*` (+ hub) | 31 |
| `/category/*` | 12 |
| `/hubs/*` (+ hub) | 11 |
| `/statistics/*` (+ hub) | 21 |
| `/authors/*` (+ hub) | 4 |
| `/alternatives/*` (+ hub) | 8 |
| `/tools/*` | 3 |
| `/best` (hub only) | 1 |
| static / policy / trust | 23 |
| **Total** | **646** |

### 7.4 Sitemap ↔ route consistency

| Family | In sitemap | In `generateStaticParams()` | Consistent? |
|---|---:|---:|---|
| reviews | 151 + hub | 151 | ✅ |
| blog | 97 + hub | 97 | ✅ |
| glossary | 30 + hub | 30 | ✅ |
| statistics | 20 + hub | 20 | ✅ |
| alternatives | 7 + hub | 7 | ✅ |
| research | 32 + hub | 32 | ✅ |
| use-cases | 49 + hub | 49 | ✅ |
| industries | 50 + hub | 50 | ✅ |
| hubs | 10 + hub | 10 | ✅ |
| category | 12 | 12 | ✅ |
| comparisons | 47 + hub | 47 | ✅ |
| **guides** | **100 + hub** | **50** | ⚠️ **50 sitemap URLs are not prerendered** |
| **best** | **hub only** | **0** | ⚠️ 48 pages render live content but are **absent from the sitemap** |

* **Guides:** 50 sitemap URLs are excluded from `generateStaticParams()` by `isNoindexed()`. They still return **200 with full content and `index, follow`** (rendered on demand, `dynamicParams` default `true`), so no URL is broken — but the sitemap advertises URLs the build does not prerender. Resolution is entangled with the 50-guide noindex decision in Phase 4.3.
* **Best:** 48 pages return 200 with real content (≥500 words) yet **none** are in the sitemap. 149 further `/best/*` URLs are `published:false`.

**Sitemap orphans: 0. Sitemap URLs with 1–2 inlinks: 3.** The XML sitemap is well linked.

---

## Phase 8 — 404s ("Not found")

| Metric | Value |
|---|---:|
| Total 404 responses | 882 |
| 404s **in the sitemap** | **0** |
| 404s with ≥1 internal inbound link | 60 |
| Total internal links pointing at 404s | 681 |
| Distinct pages emitting dead links | 224 |
| 404 by family | comparisons 881, `/cdn-cgi` 1 |

### 8.1 Why 881 comparison URLs return 404

| Segment of the 928 `content/comparisons/*.json` files | Count | Behaviour |
|---|---:|---|
| `published: true` **and** `keep` in `noindex-list.json` | **47** | 200 ✅ |
| `published: true` **and** `noindex` in `noindex-list.json` | **59** | **404** ⚠️ |
| `published: false` | 822 | 404 ✅ intended |

`src/app/comparisons/[slug]/page.tsx` sets `export const dynamicParams = false` and its `generateStaticParams()` filters with `!isNoindexed("comparisons", slug)`. With `dynamicParams = false`, anything not returned by `generateStaticParams()` becomes a **hard 404**.

Therefore **`isNoindexed()` on this route does not produce a `noindex` tag — it produces a 404.** For the 59 files that are `published: true`, "noindex" and "404" are not the same thing: the content exists and would render if it were reachable.

The other 822 are genuinely unpublished (`published: false`, i.e. `unpublished-comparisons.txt` = 822 lines) and **should** be 404.

**GSC "404 (Not found)" = 385** is a crawl-window subset of these 882. Since **0 of them are in the sitemap**, they are not a sitemap-quality problem; they are a discovery/linking problem — see 8.2.

### 8.2 Internal links feeding Google the 404s (FIXED IN PART)

Top sources of dead internal links **before** this session's fixes:

| Source page | Dead links out |
|---:|---:|
| `/sitemap-html` | 59 |
| `/comparisons` (hub) | 49 |
| `/category/crm-sales` | 10 |
| `/category/communication` | 10 |
| `/category/finance-accounting` | 9 |
| `/category/developer-tools` | 8 |
| `/category/productivity` | 6 |
| `/category/project-management` | 5 |
| `/reviews/*` (23 distinct reviews) | 4–5 each |
| … (224 pages total) | **681 total** |

| Metric | Before | After this session's fixes |
|---|---:|---:|
| Internal links → 404 | **681** | **573** |
| Pages emitting dead links | 224 | 222 |

**Fixed (108 links):** `/sitemap-html` and the `/comparisons` hub were listing `getAllComparisons()` output — 106 published entries — while the route only prerenders 47. Both now filter with `isNoindexed("comparisons", slug)`, identical to `sitemap.ts`.

**Verified on a production build:**

```
sitemap-html status=200 comparison links=47 unique=47
sitemap-html comparison links NOT 200: 0
```

**Not fixed (573 links):** category pages and individual review pages also link to unpublished comparisons; and `src/app/best/[slug]/page.tsx` links to 17 review slugs with no content file (see Phase 9.3). These live in files being edited by the concurrent session — see Phase 13 "Pending approval".

### 8.3 `/cdn-cgi`

One 404 on `/cdn-cgi/*` (Cloudflare probe path). Not a site page. **Ignore.**

---

## Phase 9 — Soft 404

### 9.1 Scale

| Metric | Value |
|---|---:|
| URLs returning **HTTP 200** with **0 content words** | **241** |
| ↳ `best/*` | 149 |
| ↳ `alternatives/*` | 75 |
| ↳ `reviews/*` | 17 |
| Of those, in the sitemap | **0** |
| Of those, carrying a canonical | **0** |
| Of those, with ≥1 internal inbound link | 18 (24 total links) |
| GSC "Soft 404" bucket | 28 (crawl-window subset) |

### 9.2 Root cause — proven, reproducible locally

The response is a **fully rendered not-found page served with HTTP 200**.

Evidence from production:

| Signal | Value |
|---|---|
| HTTP status | `200` |
| `x-matched-path` | `/reviews/[slug]` |
| `x-nextjs-prerender` | `1` |
| RSC error digest | `"digest":"NEXT_HTTP_ERROR_FALLBACK;404"` |
| HTML contains the not-found UI | `"This page doesn't exist"` + `"Go home"` — **present** |
| `<link rel="canonical">` | absent |
| `<meta name="robots">` | `index, follow` |
| Body size | ~78 KB of layout boilerplate |
| Visible content words | 0 |

`notFound()` **is** being called — the correct UI renders — but the status line has already been committed as `200`.

**Reproduced on the local production build** (`node .next/standalone/server.js`, `Host: www.pilotstack.online`):

| Path | Local status |
|---|---:|
| `/reviews/definitely-not-real-xyz-9999` | **200** (soft 404) |
| `/best/best-ai-coding-tools` | **200** (soft 404) |
| `/alternatives/totally-not-a-real-tool` | **200** (soft 404) |
| `/guides/definitely-not-real-xyz` | **200** (soft 404) |
| `/comparisons/definitely-not-real-xyz` | **404** ✅ |
| `/nope-does-not-exist` | **404** ✅ |

So this is **not** a Vercel cache artefact and **not** a deploy misconfiguration — it is reproducible from the repository's own build.

**Mechanism:** the app root has `src/app/loading.tsx`. Every `[slug]` route is an async server component, so Next flushes the streaming shell with status `200` as soon as the page suspends. `notFound()` is thrown *after* that flush, so it renders the not-found boundary inside an already-200 stream and can no longer change the status code.

**The two routes that return a correct 404 do so for a different reason:**

* `/comparisons/[slug]` sets `export const dynamicParams = false` → the request is rejected **before** any component renders.
* Root-level unknown paths match the `not-found` route directly → Next resolves 404 before flushing.

### 9.3 Composition of the 241

| Cause | Count | Explanation |
|---|---:|---|
| `published: false` in the content JSON | **224** | `getX()` returns `null` → `notFound()` → 200 shell (best 149, alternatives 75) |
| Content file missing entirely | **17** | `/reviews/affinity-designer`, `around`, `brevo`, `clockify`, `drip`, `google-tasks`, `harvest`, `klaviyo`, `luma`, `omnisend`, `postermywall`, `quickbooks-self-employed`, `slack-huddles`, `timely`, `toggl-track`, `trackingtime`, `visme` |

All **17 missing review slugs are linked from `best/*` pages** — `src/app/best/[slug]/page.tsx` renders `<Link href={`/reviews/${pick.toolSlug}`}>` at lines 121, 149 and 207 with **no existence check**, and the same slugs are emitted into `ArticleSchema.mentions`, `ItemListSchema` and `WebPageSchema` JSON-LD (lines 44, 46, 47) via `p.toolSlug`.

### 9.4 `/authors/pilotstack-team`

`src/app/reviews/[slug]/page.tsx:118` hard-codes:

```tsx
Reviewed by <Link href="/authors/pilotstack-team">{tool.author}</Link>
```

This link is present on **all 151 review pages** (152 inbound links). The target is **not in the sitemap**, renders **92 words** (thin), and every review's `author` field is actually one of `Sarah Chen` (37), `Marcus Rivera` (54) or `Emily Nakamura` (60) — all of which have their own fully-built author pages (`/authors/sarah-chen` 2274 words, `/authors/marcus-rivera` 3455, `/authors/emily-nakamura` 3955).

So 151 pages point their byline at the wrong, thin, unlisted target. **Fix proposed** (Phase 13): derive the slug from `tool.author` with a `pilotstack-team` fallback.

### 9.5 Why `dynamicParams = false` is NOT a blanket fix

| Route | In sitemap | In `generateStaticParams()` | `published:true` but excluded | Safe to set `dynamicParams = false`? |
|---|---:|---:|---:|---|
| reviews | 151 | 151 | 0 | ✅ **Yes** — fixes the 17 shells, loses nothing |
| blog | 97 | 97 | 0 | ✅ Yes (no shells today) |
| comparisons | 47 | 47 | 59 | ⚠️ Would make 59 published pages permanently 404 |
| guides | 100 | 50 | 50 | ❌ **No** — would 404 50 sitemap URLs |
| glossary | 30 | 30 | 92 | ❌ **No** — would 404 92 live noindex pages |
| statistics | 20 | 20 | 84 | ❌ **No** — would 404 84 live noindex pages |
| alternatives | 7 | 7 | 19 | ❌ **No** — would 404 19 live noindex pages |
| best | 0 | 0 | 48 | ❌ **No** — would 404 all 48 pages with real content |

Turning a live `noindex` page into a `404` is a regression: Google's own guidance is to keep the page and noindex it when it must exist for users. The soft-404 repair therefore needs an explicit decision between:

* **Option A** — remove `src/app/loading.tsx` (fixes status codes globally; costs the instant-loading shell on every navigation).
* **Option B** — include every content file in `generateStaticParams()` so unpublished slugs are prerendered as real 404s at build time.
* **Option C** — apply `dynamicParams = false` only to `reviews` and `blog` (provably safe today), and leave the remaining 224 shells for a content decision.

**No option was chosen unilaterally.**

---

## Phase 10 — Content quality and thin content

### 10.1 Family quality matrix (200 responses only)

| Family | URLs | Median words | % < 300w | % < 500w | No canonical | meta-noindex | Empty | In sitemap | Median inlinks |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| comparisons | 48 | 5089 | 0% | 0% | 0 | 0 | 0 | 48 | 31 |
| reviews | 169 | 2023 | 10% | 10% | 17 | 0 | 17 | 152 | 14 |
| guides | 101 | 914 | 0% | 0% | 0 | 0 | 0 | 101 | 25 |
| blog | 98 | 754 | 0% | 8% | 0 | 0 | 0 | 98 | 5 |
| glossary | 123 | 212 | **95%** | 99% | 0 | 92 | 0 | 31 | 51 |
| statistics | 105 | 847 | 0% | 0% | 0 | 84 | 0 | 21 | 3 |
| research | 33 | 617 | 0% | 0% | 0 | 0 | 0 | 33 | 3 |
| use-cases | 50 | 541 | 0% | 16% | 0 | 0 | 0 | 50 | 4 |
| industries | 51 | 527 | 2% | 2% | 0 | 0 | 0 | 51 | 3 |
| hubs | 11 | 2987 | 9% | 9% | 0 | 0 | 0 | 11 | 3 |
| category | 12 | 3074 | 0% | 0% | 0 | 0 | 0 | 12 | 1131 |
| alternatives | 102 | 0 | **75%** | 75% | 75 | 19 | **75** | 8 | 0 |
| best | 197 | 0 | **76%** | 76% | 149 | 47 | **149** | 1 | 0 |
| authors | 5 | 2274 | 40% | 40% | 0 | 0 | 0 | 4 | — |

### 10.2 Summary

| Bucket | Count |
|---|---:|
| Healthy & indexable | 606 |
| Thin (< 300 words) but indexable | 40 |
| Correctly `noindex` | 244 |
| No canonical (soft-404 shells) | 241 |
| **Total 200 pages** | **1144** |

### 10.3 Thin-content detail

* **Glossary — 117 of 123 pages below 300 words (median 212).** 92 of them already carry `noindex`; the remaining **31 are in the sitemap** and indexable. These 31 are the most likely candidates for GSC *"Crawled – currently not indexed"* (= 35).
* **Static/trust pages below 300 words:** `/contact` (80), `/team` (95), `/press` (212) — all in the sitemap. Legitimate thin utility pages; not worth padding.
* **System pages:** `/search` (3 words), `/dashboard` (113) — noindex + robots-blocked; correct.

### 10.4 Orphans and link equity (independent `scripts/linking-audit.js`)

| Metric | Value |
|---|---:|
| 200 pages with **0** incoming internal links | 223 |
| 200 pages with 1–2 incoming links | 27 |
| **Sitemap** pages with 0 incoming links | **0** |
| Sitemap pages with 1–2 incoming links | 3 |
| Files with zero incoming links | comparisons 782, glossary 122, alternatives 101, use-cases 49, industries 50, research 32, statistics 104, best 196, hubs 10, guides 37, blog 21, reviews 3 |

The sitemap is healthy; the long tail of unpublished/unlinked files is what inflates GSC *"Discovered – currently not indexed"* (= 137).

---

## Phase 11 — AdSense stack integrity (read-only verification)

Nothing in this phase was modified.

| Check | Result |
|---|---|
| `ads.txt` on apex | 200, `google.com, pub-6523926892521982, DIRECT, f08c47fec0942fa0` |
| `ads.txt` on `www` | 200 (no redirect) |
| `ads.txt?x=1` | 200 (no redirect) |
| AdSense loader (`src/app/layout.tsx:116`) | present |
| Consent defaults (`src/app/layout.tsx`) | present |
| GTM | `GTM-KMQBGRJW` |
| GA4 | `G-WZ6LVYH8ML` |
| Publisher id in page HTML | present on **26/26** sampled pages |
| AdSense loader in page HTML | present on **26/26** |
| Consent present | present on **26/26** |
| Hilltop tokens in HTML | **0** on every sampled page |
| Injection tokens (`window.open`, `location.replace`, `beforeunload`, `document.write`) | **0** on every sampled page |
| Trust/policy pages sampled | 19/19 → 200 |
| `adsbygoogle` / `pagead2.googlesyndication` markers in crawl | present on all 1144 200 pages |

### CSP (`next.config.ts:27–47`)

The CSP does **not** contain the literal strings `googleadservices.com`, `adservice.google.com` or `c.clarity.ms`, but it does contain `pagead2.googlesyndication.com`, `*.googlesyndication.com`, `*.google.com`, `stats.g.doubleclick.net`, `googleads.g.doubleclick.net`, `*.adtrafficquality.google`, `*.clarity.ms`.

**Status: report-only, protected, unchanged.** No CSP edit was made or is recommended at this time. Re-testing should be driven by real AdSense disapproval evidence, not by string presence.

---

## Phase 12 — Build, type-check, lint and tests

| Gate | Command | Result |
|---|---|---|
| Production build | `npm run build` (Next 16.2.10, Turbopack, `NODE_OPTIONS=--max-old-space-size=4096`) | ✅ **PASS (exit 0)** |
| Type check | `npx tsc --noEmit` | ✅ **PASS (exit 0)** |
| ESLint (changed files) | `npx eslint src/app/sitemap.ts src/app/sitemap-html/page.tsx src/app/comparisons/page.tsx` | ✅ **PASS (exit 0)** |
| Unit tests | `npm test` (vitest, jsdom) | ⚠️ **15 passed / 1 failed (exit 1)** |

### 12.1 Test failure detail (pre-existing, unrelated to this session's changes)

```
FAIL src/test/registry.test.ts > searchContent > is case-insensitive
Error: Test timed out in 5000ms.
  ❯ src/test/registry.test.ts:20:3
Test Files  1 failed | 2 passed (3)
Tests       1 failed | 15 passed (16)
```

`searchContent()` scans the whole content corpus (~1799 JSON files) and exceeds vitest's default 5000 ms `testTimeout`. Reproduced **identically before and after** this session's edits. None of the three files changed by this session are imported by that test.

**Also observed:** the default `npm test` invocation initially failed with `[vitest-pool]: Failed to start forks worker` / `Timeout waiting for worker to respond` under machine load; `npx vitest run --pool=forks --no-file-parallelism --maxWorkers=1` (the RAM-safe invocation) runs reliably.

**Recommendation (not applied — outside scope):** raise the timeout for that single test, or add `testTimeout` to `vitest.config.ts`.

### 12.2 Concurrent-session breakage observed (not caused by this session)

Mid-session, `npx tsc --noEmit` reported 4 × `TS2300 Duplicate identifier 'seoTitle'/'seoDescription'` in `src/types/content.ts`. The git diff showed the same two properties added twice by the concurrent agent's in-progress edit. The other session corrected it; the final `tsc --noEmit` is clean. **This file was not modified by this session.**

---

## Phase 13 — GSC fix report

### 13.1 Bucket reconciliation

GSC populations below are the reported aggregate counts for 21/09/2026. "Reproduced" = what the independent 29/09/2026 crawl measured, because no per-URL export exists.

| GSC bucket | GSC count | Reproduced by crawl | Root cause | Fixed | Legitimate remaining | Redirected |
|---|---:|---|---|---|---|---|
| **404 (Not found)** | 385 | 882 hard 404s (881 comparisons + 1 `/cdn-cgi`) | 822 unpublished comparisons + 59 `published:true` comparisons excluded by `isNoindexed()` under `dynamicParams=false`; **0 in sitemap**; 681 internal links fed them | **108 internal dead links removed** (`/sitemap-html` 59, `/comparisons` 49) | 882 URLs remain 404 (correct for the 822 unpublished; **59 published ones need a decision**); `/cdn-cgi` is a Cloudflare artefact | n/a |
| **Noindex tag detected** | 53 | **244** pages serve `noindex, nofollow` | intentional exclusions (glossary 92, statistics 84, best 47, alternatives 19, `/search` 1, `/dashboard` 1) | 0 — **nothing to fix** | all 244; **0 noindex pages in the sitemap** | n/a |
| **Blocked by robots.txt** | 2 | `/dashboard` + `/search` (exactly 2) | intentional `Disallow` + `noindex, nofollow` | 0 | both — no change | n/a |
| **Page with redirect** | 4 | 5 × `308 → 404` chains in `next.config.ts` | slug-normalisation redirects whose destinations were unpublished | 0 (documented, not changed) | 5 sources, not in sitemap, 0 inlinks | **needs approval** |
| **Soft 404** | 28 | **241** URLs return HTTP 200 with the not-found UI | `notFound()` fires *after* the `loading.tsx` shell has committed status 200 (proved locally); composition: 224 `published:false` + 17 missing review files | 0 (root cause documented, fix needs a decision) | 241 URLs, **0 in sitemap**, 18 with inbound links | n/a |
| **Duplicate, submitted URL not selected by user** | 5 | sitemap had **1 duplicate `<loc>`**; canonical≠self = 0; pagination URLs = 0 | duplicate `/dmca` in `staticPages` + `editorialLinks`; soft-404 shells emit no canonical and are byte-identical | ✅ **sitemap de-duplicated (647 → 646, 0 duplicates verified)** | remainder attributable to the canonical-less soft-404 shells (fixed only if Phase 9.5 is approved) | n/a |
| **Alternate page with proper canonical tag** | 2 | **0** — no canonical mismatch found across all 2026 URLs | not reproducible from the repository | 0 | **unresolved — requires a per-URL GSC export** | n/a |
| **Crawled – currently not indexed** | 35 | 40 indexable pages < 300 words | thin glossary (31 in sitemap, median 212w) + thin static pages | 0 | 31 thin glossary terms + `/contact`, `/team`, `/press` | n/a |
| **Discovered – currently not indexed** | 137 | 223 orphans (0 inlinks), 27 weakly linked | crawl budget spent on unlinked/low-value URLs; sitemap itself has 0 orphans | 0 | long tail of unpublished files still reachable from content templates | n/a |
| **Total** | **651** | — | — | **108 dead links + 1 sitemap duplicate** | — | — |

### 13.2 Changes actually made in this session

Three files, **+20 / −3 lines**. Nothing committed, pushed or deployed.

| # | File | Change | Verified by |
|---|---|---|---|
| 1 | `src/app/sitemap.ts` | De-duplicate the assembled sitemap entry list by URL (first definition wins) | Production build served locally: `locs=646 unique=646`, `dmca entries=1`, `duplicate urls=0` |
| 2 | `src/app/sitemap-html/page.tsx` | Filter `getAllComparisons()` with `isNoindexed("comparisons", slug)`, matching `sitemap.ts` | Production build: `comparison links=47 unique=47`, `comparison links NOT 200: 0` (was 106 links, **59 dead**) |
| 3 | `src/app/comparisons/page.tsx` | Same filter on the hub listing + `isNoindexed` import | `npx tsc --noEmit` 0, `npx eslint` 0; the concurrent session's `BannerAd` insertion verified intact in the same file |

**Net effect:** 647 → 646 sitemap entries with zero duplicates; 108 fewer internal links pointing at 404s (681 → 573).

### 13.3 Pending — requires human approval

These were identified with evidence but **not** applied, because they either carry user-visible risk or live in files the concurrent session is actively editing.

| # | Issue | Evidence | Proposed fix | Risk | Where |
|---|---|---|---|---|---|
| P1 | **573 remaining internal links → 404** (category pages, review pages) | crawl: 573 dead links from 222 pages | filter comparison links by `isNoindexed()` in `src/app/category/[slug]/page.tsx` and `src/app/reviews/[slug]/page.tsx` | Low — same pattern as #2/#3 | files edited by concurrent session |
| P2 | **17 dead review links + JSON-LD mentions** | `/best/*` links to `brevo`, `klaviyo`, `drip`, `omnisend`, `timely`, … with no content file | guard `<Link>` at `src/app/best/[slug]/page.tsx:121,149,207` with `getReview(p.toolSlug)`; drop missing entries from `mentions`/`ItemListSchema` (lines 44,46,47) | Low — removes links & structured-data entries that point at 200-soft-404s | file edited by concurrent session |
| P3 | **Byline points at the wrong author** (152 inlinks) | `src/app/reviews/[slug]/page.tsx:118` hard-codes `/authors/pilotstack-team`; actual authors are `sarah-chen` / `marcus-rivera` / `emily-nakamura` | derive the slug from `tool.author` (lower-case, spaces → `-`) with a `pilotstack-team` fallback | Low — but user-visible link change | file edited by concurrent session |
| P4 | **241 soft-404 pages return HTTP 200** | proved locally (Phase 9.2) | choose Option A (remove `src/app/loading.tsx`), Option B (emit all content slugs from `generateStaticParams()`), or Option C (safe-only `dynamicParams=false` on `reviews`+`blog`) | **Medium/High** — A changes global navigation UX, B changes build shape, C leaves 224 unfixed | needs a decision |
| P5 | **59 `published:true` comparisons are 404, not noindex** | Phase 8.1 | either remove `isNoindexed()` from that route's `generateStaticParams()` (restores `noindex` behaviour) or accept them as intentional removals | Medium — changes what Google sees for 59 URLs | decision needed |
| P6 | **50 guides: sitemap says index, `noindex-list.json` says noindex** | Phase 4.3 | align all three: either drop them from the sitemap and enforce `noindex` in `generateMetadata()`, or clear them from `noindex-list.json` | Medium | decision needed |
| P7 | **48 live `/best/*` pages are absent from the sitemap** | Phase 7.4 | add `isQuality(b.slug, "best")` publishing decision, then either include or deliberately exclude | Medium | decision needed |
| P8 | **5 redirects → 404** | Phase 3 | publish the `*-vs-zoho-crm` destinations, or delete rules 1–5 so sources fail fast | Low | `next.config.ts` — protected by scope rules |
| P9 | **31 thin glossary terms in the sitemap** | Phase 10.3, median 212 words | expand to ≥400 words or noindex them | Low | content work |
| P10 | **`npm test` timeout failure** | Phase 12.1 | raise `testTimeout` or mark the case slow | Low | `vitest.config.ts` / test file |
| P11 | **"Alternate page with proper canonical tag" = 2** | not reproducible (0 mismatches) | obtain a per-URL GSC export before acting | None — no action possible | GSC |

### 13.4 Post-approval plan

1. Apply P1–P3 (pure link hygiene, lowest risk) and re-run `npm run build` + `npm test`.
2. Take the decision on P4–P7 as one bundle — they are all consequences of `noindex-list.json`, `published`, `generateStaticParams()` and the sitemap disagreeing.
3. Re-crawl with `_gsc-crawl.cjs` and confirm: internal links → 404 = **0**, soft-404 = **0 or agreed number**, sitemap duplicates = **0**, sitemap non-200 = **0**.
4. Deploy, then in GSC: **Sitemaps** → resubmit `https://www.pilotstack.online/sitemap.xml`; **URL Inspection** → "Request indexing" on the highest-value repaired URLs; **Pages** → "Validate fix" on each bucket.
5. Re-check after 7–14 days; GSC bucket counts only move after Google recrawls.
6. Only after indexation is clean, submit the **second AdSense application** — Phase 11 confirms the technical AdSense stack is already intact, so the rejection risk is content/indexation, not implementation.

---

## Appendix A — Artifact index

| File | Purpose |
|---|---|
| `_gsc-crawl.cjs` | crawler producing the full URL inventory and link graph |
| `_gsc-inventory.json` | 2026-URL dataset (status, canonical, robots, words, inlinks, sitemap flag, content flags) |
| `_gsc-links.json` | source → target internal link graph |
| `_gsc-family-quality.json` | per-family word/thin/noindex/link metrics |
| `_gsc-adsense-check.json` | Phase 11 AdSense/CSP/trust-page results |
| `_gsc-report.cjs`, `_gsc-report2.cjs` | report table generators |
| `_gsc-verify.cjs`, `_gsc-verify2.cjs` | post-fix verification (sitemap dedupe, dead-link removal) |
| `_gsc-localtest.cjs` | local production server harness used to reproduce the soft-404 status bug |
| `_gsc-analyze*.cjs`, `_gsc-probe*.cjs` | supporting analysis scripts |
| `sitemap-urls.txt` | sitemap snapshot from 09/08/2026 (1670 entries) |
| `unpublished-comparisons.txt` | 822 unpublished comparison slugs |
| `noindex-list.json` | authority for `isNoindexed()` (1351 noindex / 448 keep) |

All `*.cjs` artifacts are covered by `.gitignore:47` (`_*.cjs`) and are intentionally not tracked.

---

## Appendix B — Safety checklist

| Requirement | Status |
|---|---|
| No blanket `noindex` / canonical rules added | ✅ |
| No URL deleted from the sitemap to shrink GSC numbers | ✅ (only a *duplicate* of an existing URL was removed) |
| No fabricated content / sources / statistics / traffic numbers | ✅ |
| Certified AdSense stack untouched | ✅ |
| Consent defaults untouched | ✅ |
| `ads.txt` untouched | ✅ |
| CSP untouched | ✅ |
| Hilltop behaviour untouched | ✅ |
| Working redirect architecture untouched | ✅ (5 broken rules documented, not modified) |
| `robots.txt` untouched | ✅ |
| Intentional noindex / robots exclusions preserved | ✅ (244 noindex + 2 robots-blocked pages all retained) |
| No commit / no push / no deploy | ✅ |
| Concurrent session's files not clobbered | ✅ (verified `BannerAd` edit still present after this session's edit) |

---

**END OF REPORT — AWAITING HUMAN APPROVAL BEFORE ANY COMMIT, PUSH OR DEPLOY.**
