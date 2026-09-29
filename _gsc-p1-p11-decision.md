# GSC Indexation Recovery — P1–P11 Decision Record

- **Site:** https://www.pilotstack.online
- **Date:** 2026-09-29
- **Source of P1–P11:** `_gsc-indexation-recovery-report.md` → §13.3 *"Pending — requires human approval"*
- **Purpose:** classify every pending item before any further code change, then implement only what is provably safe.
- **Session constraint:** a second OpenCode session is concurrently editing this tree. Every edit below is an exact-string, surgical edit; no file owned by the other session is rewritten wholesale.
- **Prohibitions carried forward:** no commit / push / deploy / remote-branch change; no mass page generation; no emitting all slugs into `generateStaticParams()`; no placeholder pages; no `noindex` used as a status substitute; no change to valid URLs; no content rewriting, bulk title changes, new SEO pages, large page removals, affiliate/editorial changes, fabricated content or keyword stuffing; **AdSense stack, CSP, consent, `ads.txt`, `robots.txt` untouched.**

## Decision classes

| Class | Meaning |
|---|---|
| **SAFE TO FIX NOW** | Evidence complete, blast radius understood, no valid URL or intentional-indexing decision changed. Applied in this session. |
| **ALREADY FIXED** | Superseded by an earlier verified change in this session. |
| **DO NOT IMPLEMENT YET** | Requires a human publishing / indexing decision or data that does not exist in this repo. |
| **NEEDS MODIFICATION** | The report's proposed fix is unsafe or provably wrong as written; a different fix is required before it can be approved. |

---

## Summary

| # | Issue (abbrev.) | Decision | Applied in this session |
|---|---|---|---|
| P1 | 573 remaining internal links → 404 | **SAFE TO FIX NOW** | Yes — `isContentAvailable()` guards at all link emitters |
| P2 | 17 dead `/best/*` → `/reviews/*` links + JSON-LD | **SAFE TO FIX NOW** | Yes |
| P3 | Byline hard-codes wrong author (152 inlinks) | **SAFE TO FIX NOW** (fix amended) | Yes |
| P4 | 241 soft-404 pages return HTTP 200 | **SAFE TO FIX NOW — Option A** (B & C = **DO NOT IMPLEMENT**) | Yes — `src/app/loading.tsx` removed |
| P5 | 59 `published:true` comparisons are 404, not noindex | **DO NOT IMPLEMENT YET** | No |
| P6 | 50 guides: sitemap says index, `noindex-list.json` says noindex | **DO NOT IMPLEMENT YET** | No |
| P7 | 48 live `/best/*` absent from sitemap | **DO NOT IMPLEMENT YET** | No |
| P8 | 5 redirects → 404 | **SAFE TO FIX NOW** (delete rules 1–5; keep rule for `/reviews/calndly`) | Yes |
| P9 | 31 thin glossary terms in sitemap | **DO NOT IMPLEMENT YET** | No |
| P10 | `npm test` timeout failure | **SAFE TO FIX NOW** | Yes — `testTimeout` raised |
| P11 | "Alternate page with proper canonical tag" = 2 | **DO NOT IMPLEMENT YET** (no action possible) | No |

---

## P1 — 573 remaining internal links → 404

**1. Exact issue.** After the three earlier fixes (sitemap dedupe, `sitemap-html` comparison filter, `/comparisons` hub filter) the crawl still reports **573 internal links pointing at URLs that return 404**, originating from 222 pages — mainly `category/*`, `reviews/*`, `guides/*`, `best/*`, `use-cases/*`, `alternatives/*`.

**2. Report evidence.** Phase 13.3 row P1: *"crawl: 573 dead links from 222 pages"*.

**3. Independent re-verification (this session).** A static reference scan over every `content/**.json` file (`_p_refscan.cjs`) found **1,199 references that resolve to a 404 target**, split into two mechanically different causes:

| Cause | Targets | Refs | Why it 404s |
|---|---|---|---|
| No content file at all | 96 | 107 | `getX()` returns `null` → `notFound()` (comparisons 34, glossary 39, blog 9, guides 8, **reviews 17** = exactly P2) |
| File exists but unreachable | 169 | 1,092 | **`comparisons` only (723 refs)** — `src/app/comparisons/[slug]/page.tsx:23` sets `export const dynamicParams = false` **and** `:27` filters `isNoindexed()` out of `generateStaticParams()`, so a `published:true` + `noindex-listed` comparison is a genuine **404**, not a noindex page |

The other routes are *not* in this bucket: only `comparisons/[slug]` and `authors/[slug]` set `dynamicParams = false`. For `reviews`, `glossary`, `best`, `guides`, `blog`, `research`, `alternatives`, `statistics` the GSP filters noindex but `dynamicParams` defaults to `true`, so a noindex-listed slug still renders on demand as **200 + `noindex` meta** — reachable, not a 404.

**4. Proposed fix (report).** "filter comparison links by `isNoindexed()` in `src/app/category/[slug]/page.tsx` and `src/app/reviews/[slug]/page.tsx`".

**5. Fix actually applied (superset, same mechanism).** The report names two files; the real emitter set is larger, so the same one-line guard was applied at every site that can emit a bad link, using the codebase's **own canonical helper** `isContentAvailable(type, slug)` (`src/lib/content/registry.ts`), which already documents itself as *"Use this before emitting an internal link so we never send users or crawlers to unpublished or suppressed content."* Using the existing helper (instead of sprinkling `isNoindexed()`) keeps one authority for "can we link to this?" and reuses the convention the concurrent session already introduced in `related-reading.tsx`.

**6. Risk.** **Low.** Purely subtractive: removes links, never creates or rewrites a URL, never changes a valid page's status, indexability, canonical or content. The only behavioural nuance is that `isContentAvailable()` also withholds links to *reachable-but-noindex* content — that is the helper's stated intent and matches the report's own "filter by `isNoindexed()`" wording.

**7. SEO / indexation impact.** Positive. Google stops wasting crawl on URLs that can only end in 404; "Discovered – currently not indexed" and "Crawled – currently not indexed" shrink because link equity is no longer poured into dead ends. No indexed URL loses an inbound link.

**8. Decision.** **SAFE TO FIX NOW.**

**9. Exact files.**
- `src/components/entity/semantic-links.tsx` — `reviews/*` "Related Content" card (largest single source)
- `src/app/category/[slug]/page.tsx` — comparison list + enterprise-pick link
- `src/app/page.tsx` — homepage "Trending Comparisons"
- `src/lib/content/internal-links.ts` — `getRelatedByCategory()` used by the `InternalLinks` block
- `src/components/content/related-content.tsx` — generic related cards
- `src/components/content/enhanced-related-content.tsx` — generic related cards
- `src/app/blog/[slug]/page.tsx`, `src/app/research/[slug]/page.tsx` — `relatedComparisons` filters
- `src/app/rss.xml/route.ts`, `src/app/api/search/route.ts`, `src/lib/indexnow.ts` — non-HTML URL surfaces
- (already correct, unchanged) `src/components/content/related-reading.tsx`, `src/components/entity/comparison-grid.tsx`, `src/app/comparisons/page.tsx`, `src/app/sitemap-html/page.tsx`, `src/app/sitemap.ts`

**10. Validation required.** Rebuild + local crawl: **internal links → 404 = 0**; sitemap → 404 = 0; sitemap → noindex = 0; no sitemap duplicates.

---

## P2 — 17 dead review links + JSON-LD mentions

**1. Exact issue.** `/best/*` pages render `<Link href={/reviews/${pick.toolSlug}}>` for every pick with no existence check, and push the same URLs into `ArticleSchema.mentions`, `ItemListSchema` and `WebPageSchema.mainEntity`. 17 pick slugs have **no review content file at all**.

**2. Report evidence.** Phase 13.3 row P2: *"`/best/*` links to `brevo`, `klaviyo`, `drip`, `omnisend`, `timely`, … with no content file"*.

**3. Re-verification.** `_p_refscan.cjs` independently reports **`reviews` = 17 dead targets, 17 refs, all from `best/*/picks.toolSlug`** — an exact match. Confirmed slugs: `visme`, `postermywall`, `affinity-designer`, `klaviyo`, `omnisend`, `drip`, `brevo`, `quickbooks-self-employed`, `google-tasks`, `toggl-track`, `timely`, … Each rendered at three `<Link>` sites (lines 121, 149, 207) plus three structured-data sites (lines 44, 46, 47).

**4. Proposed fix (report).** Guard `<Link>` with `getReview(p.toolSlug)`; drop missing entries from `mentions` / `ItemListSchema`.

**5. Fix actually applied.** Exactly that: a `hasReview()` guard at the three `<Link>` sites (rendering plain, unlinked text so the pick's rank/rationale is preserved — no content removed from the page), and `.filter(...)` on the pick arrays feeding `ArticleSchema.mentions`, `ItemListSchema.items` and `WebPageSchema.mainEntity.itemListElement`. `getReview` was already imported at line 8.

**6. Risk.** **Low.** Removes links and structured-data entries that point at non-existent pages. Publishing 17 new review pages to satisfy them would be mass page generation and is out of scope.

**7. SEO / indexation impact.** Positive for structured data: Google currently receives `ItemList` entries whose URLs 404, which can suppress rich results for the whole page. Removing them makes the remaining schema truthful.

**8. Decision.** **SAFE TO FIX NOW.**

**9. Exact files.** `src/app/best/[slug]/page.tsx` (lines 44, 46, 47, 121, 149, 207).

**10. Validation required.** Build + tsc + eslint; local crawl shows **zero `/best/* → /reviews/*` 404 links**; JSON-LD of every `/best/*` page parses and contains no `/reviews/` URL that 404s.

---

## P3 — Byline points at the wrong author (152 inlinks)

**1. Exact issue.** `src/app/reviews/[slug]/page.tsx:118` renders `Reviewed by <Link href="/authors/pilotstack-team">{tool.author}</Link>` — the **displayed** name is the real author, the **link target** is always the PilotStack Team page.

**2. Report evidence.** Phase 13.3 row P3: *"hard-codes `/authors/pilotstack-team`; actual authors are `sarah-chen` / `marcus-rivera` / `emily-nakamura`"*, 152 inlinks.

**3. Re-verification.** Review `author` fields are `Emily Nakamura` (60), `Marcus Rivera` (54), `Sarah Chen` (37) = 151 reviews. The author registry `src/app/authors/[slug]/page.tsx:21-66` defines exactly four keys — `sarah-chen`, `marcus-rivera`, `emily-nakamura`, `pilotstack-team` — with matching `name` values, and **`:72 export const dynamicParams = false`**, so any other slug is an instant 404. Consequence today: `/authors/pilotstack-team` absorbs 151 inlinks while `:90` filters its review grid by `author === "PilotStack Team"` → **zero reviews shown**, and the three real author pages receive **zero inbound links** from reviews (orphan risk).

**4. Proposed fix (report).** "derive the slug from `tool.author` (lower-case, spaces → `-`) with a `pilotstack-team` fallback".

**5. Fix actually applied (amended — see decision).** Derive `tool.author → slug` by lower-casing and replacing whitespace with `-`, then **verify the derived slug is a registered author key**; if not, render the byline as plain text with no link. Verified: all four names map exactly onto the four registry keys, so in practice every review still links — just to its real author.

**6. Risk.** **Low, but user-visible** (link target changes). The report's fix as written is **unsafe without the allowlist**: because `authors/[slug]` is `dynamicParams = false`, any author name added later with an unexpected form (punctuation, multi-space, "Dr. …") would silently mint a **new 404 link**, replacing one bug with another. The allowlist removes that failure mode.

**7. SEO / indexation impact.** Positive. Correct author↔page association strengthens E-E-A-T signals; three previously orphaned author pages gain internal links; the Team page stops collecting links that resolve to an empty review grid.

**8. Decision.** **SAFE TO FIX NOW — with the amended fix (allowlist guard required).**

**9. Exact files.** `src/app/reviews/[slug]/page.tsx` (line 118, plus a module-level author-slug helper).

**10. Validation required.** Build + tsc + eslint; local crawl confirms every `/authors/*` URL emitted returns 200; `/authors/pilotstack-team` no longer receives review bylines; `sarah-chen` / `marcus-rivera` / `emily-nakamura` each do.

---

## P4 — 241 soft-404 pages return HTTP 200

**1. Exact issue.** Every invalid content slug (`/reviews/nope`, `/best/nope`, `/guides/nope`, `/alternatives/nope`, `/use-cases/nope`, `/statistics/nope`, `/glossary/nope`, `/research/nope`, `/blog/nope`, `/category/nope`, `/hubs/nope`, `/industries/nope`) returned **HTTP 200** with the "This page doesn't exist" UI, `index, follow`, no canonical and ~0 content words — a textbook soft-404.

**2. Report evidence.** Phase 9.2 (reproduced locally), Phase 13.3 row P4: *"241 soft-404 pages return HTTP 200"*.

**3. Root cause (proved, not assumed).** `src/app/loading.tsx` is the **only** loading boundary in `src/app` — a global, app-root skeleton. On a server render, Next.js flushes the loading shell **and its HTTP status (200)** before the route's `notFound()` resolves. The 200 is therefore committed by the streaming shell; the subsequent `notFound()` can only change the body, never the status. `/comparisons/*` was immune because it sets `dynamicParams = false` (Next answers 404 before any shell is produced).

**4. Options as given (report).** **A** remove `src/app/loading.tsx`; **B** emit every content slug from `generateStaticParams()`; **C** `dynamicParams = false` on `reviews` + `blog`.

**5. Investigation performed (explicitly required before deletion).**

| Question | Finding |
|---|---|
| **Scope** | Exactly one file, `src/app/loading.tsx` (22 lines, a skeleton of `<Skeleton>` elements). No route-segment `loading.tsx` exists anywhere under `src/app`. Companion files `not-found.tsx`, `error.tsx` are separate and untouched. |
| **UX impact** | The build classifies every page route as `○ (Static)` or `● (SSG)`; the only `ƒ (Dynamic)` outputs are `/*/-/opengraph-image`, `/rss.xml` and the middleware proxy — **no dynamic page route exists**, so the skeleton is never actually served for a real page. Its only live effect is the client-navigation shell, whose absence is stock Next.js behaviour (keep showing the current page until the next payload arrives). |
| **Does `notFound()` then yield a real 404?** | **Yes — proved by build experiment.** |

**6. Experiment and result.**
- Backed up the file to `%TEMP%\opencode\loading.tsx.orig`, removed `src/app/loading.tsx`, ran `npm run build` (clean), started `.next/standalone/server.js` on port 3171 with `Host: www.pilotstack.online`, and probed 14 invalid + 14 valid URLs (`_exp_loading.cjs`).
- **Invalid → 404: 14/14 PASS.** `invalidNon404 = 0`.
- **Valid → 200: 13/14 PASS** (the single "FAIL" was my own bad probe choice — `/best/best-ai-coding-tools` has `content/best/best-ai-coding-tools.json` with **`published: false`**, so `getBest()` returned `null` and the page has *always* thrown `notFound()`. Removing `loading.tsx` only changed its status from soft-404-200 to genuine 404. **No valid URL regressed.**)
- Valid URLs confirmed 200: `/`, `/reviews/figma`, `/reviews/linear`, `/comparisons`, `/comparisons/adp-vs-deel`, `/use-cases/best-accounting-for-startups`, `/statistics/aerospace-software`, `/research/ai-productivity-report-2026`, `/tools/tco-calculator`, `/search`, `/sitemap-html`, `/sitemap.xml`, `/robots.txt`.
- Valid comparison probe slug was derived at runtime (`adp-vs-deel`), so the test is not hard-coded to a lucky URL.

**7. Risk.** **Low–Medium**, and materially lower than the report's "Medium/High" once scoped: the skeleton serves no real page (all routes prerendered), so the practical change is the default Next.js navigation behaviour. Option **B** (emit all slugs into `generateStaticParams()`) would **explode build size and publish 404-only URLs as real pages** — explicitly prohibited by scope. Option **C** would fix only `reviews` + `blog` and leave 224 URLs broken while adding a second `dynamicParams=false` route.

**8. SEO / indexation impact.** Directly and substantially positive: 241 URLs stop reporting as **Soft-404** and become a truthful **404**, which Google processes as a terminal, cheap outcome instead of a quality signal against the site. Crawl budget is no longer spent on pages that never existed.

**9. Decision.** **SAFE TO FIX NOW — Option A applied.** `src/app/loading.tsx` removed (backup retained at `%TEMP%\opencode\loading.tsx.orig`). **Options B and C: DO NOT IMPLEMENT** — B violates the mass-generation prohibition, C is redundant now that A is proven.

**10. Exact files.** `src/app/loading.tsx` (deleted). No other file.

**11. Validation required.** Build + tsc + eslint; local probe: **14/14 invalid → 404**, all sampled valid → 200; re-crawl soft-404 count = 0.

---

## P5 — 59 `published:true` comparisons are 404, not noindex

**1. Exact issue.** 59 comparisons have `published: true` and are listed in `noindex-list.json`, but `src/app/comparisons/[slug]/page.tsx` combines `dynamicParams = false` (line 23) with a noindex filter on `generateStaticParams()` (line 27). The route therefore **404s** instead of rendering `200 + noindex`.

**2. Report evidence.** Phase 8.1, Phase 13.3 row P5.

**3. Proposed fix (report).** Remove `isNoindexed()` from that route's `generateStaticParams()`, **or** accept them as intentional removals.

**4. Risk.** Medium — changes what Google sees for 59 URLs (404 ↔ 200+noindex).

**5. SEO / indexation impact.** Deciding "publish" turns 59 URLs from 404 into indexable-or-noindex pages; deciding "accept" keeps them 404 but requires unlinking them (P1) so they stop being crawled. Either way this is a **publishing/indexing decision**, which is outside the approved scope ("no mass page generation", "no `noindex` as a status substitute", "no change to valid URLs").

**6. Decision.** **DO NOT IMPLEMENT YET.** It is also **inconsistent with P1's chosen direction**: P1 stops linking to them as unreachable, which is only coherent if P5 later confirms they are meant to stay unreachable. Note that P1's guard is written to be *reversible* — if P5 later opts to restore them, removing the `isNoindexed()` filter from the route is sufficient and no P1 code needs to change.

**7. Exact files (if approved later).** `src/app/comparisons/[slug]/page.tsx`.

**8. Validation required (if approved later).** Build; each of the 59 URLs returns the agreed status; sitemap membership matches; no internal link points at a 404.

---

## P6 — 50 guides: sitemap says index, `noindex-list.json` says noindex

**1. Exact issue.** 50 guides appear in `sitemap.xml` (published for indexing) while `noindex-list.json` lists them as noindex. Three signals — sitemap, `noindex-list.json`, `generateMetadata()` — disagree.

**2. Report evidence.** Phase 4.3, Phase 13.3 row P6.

**3. Proposed fix (report).** Align all three: either drop them from the sitemap **and** enforce `noindex` in `generateMetadata()`, or clear them from `noindex-list.json`.

**4. Risk.** Medium.

**5. SEO / indexation impact.** High-leverage but directional: option 1 removes 50 URLs from the indexable set; option 2 adds them. `registry.ts` already documents that for guides `noindex-list.json` *"only controls `generateStaticParams()`"* — i.e. the file is currently doing two different jobs, and choosing which job it keeps is editorial.

**6. Decision.** **DO NOT IMPLEMENT YET.** Publishing/editorial decision.

**7. Exact files (if approved later).** `noindex-list.json`, `src/app/sitemap.ts`, `src/app/guides/[slug]/page.tsx`.

**8. Validation required (if approved later).** For all 50: sitemap membership, `robots` meta and `generateStaticParams()` membership agree.

---

## P7 — 48 live `/best/*` pages absent from the sitemap

**1. Exact issue.** 48 `/best/*` pages return 200 but are not in `sitemap.xml`.

**2. Report evidence.** Phase 7.4, Phase 13.3 row P7.

**3. Proposed fix (report).** Add an `isQuality(b.slug, "best")` publishing decision, then either include or deliberately exclude.

**4. Risk.** Medium.

**5. SEO / indexation impact.** Including them grows the indexable set and surfaces the highest-commercial-intent pages; excluding them is a deliberate cull. Either way it is a **publishing decision**.

**6. Decision.** **DO NOT IMPLEMENT YET.**

**7. Exact files (if approved later).** `src/app/sitemap.ts`, `noindex-list.json`.

**8. Validation required (if approved later).** Every 200 `/best/*` either is in the sitemap or is deliberately excluded; no sitemap entry 404s.

---

## P8 — 5 redirects → 404

**1. Exact issue.** Six `redirects()` rules exist in `next.config.ts`; five of them answer `308` and land on a URL that then returns **404**.

**2. Report evidence.** Phase 3, Phase 13.3 row P8: *"publish the `*-vs-zoho-crm` destinations, or delete rules 1–5 so sources fail fast"*.

**3. Re-verification (this session).** All six rules were checked file-by-file:

| # | Source | Dest | Source file | Dest file | Dest `published` | Chain |
|---|---|---|---|---|---|---|
| 1 | `/reviews/calndly` | `/reviews/calendly` | absent | present | *unset* (treated published) | **308 → 200 — healthy, keep** |
| 2 | `/comparisons/close-crm-vs-zoho-crm` | `/comparisons/close-crm-vs-zoho` | present | present | **`false`** | 308 → 404 |
| 3 | `/comparisons/outreach-io-vs-zoho` | `/comparisons/outreach-io-vs-zoho-crm` | present | present | **`false`** | 308 → 404 |
| 4 | `/comparisons/pipedrive-vs-zoho` | `/comparisons/pipedrive-vs-zoho-crm` | present | present | **`false`** | 308 → 404 |
| 5 | `/comparisons/salesloft-vs-zoho` | `/comparisons/salesloft-vs-zoho-crm` | present | present | **`false`** | 308 → 404 |
| 6 | `/comparisons/zendesk-vs-zoho` | `/comparisons/zendesk-vs-zoho-crm` | present | present | **`false`** | 308 → 404 |

Decisive detail: **for all five broken rules both endpoints are `published: false`.** These redirects do not protect a working URL — they bounce a dead URL onto another dead URL. Neither side is a valid URL today, so deleting a rule changes no working address.

**4. Proposed fix (report).** Publish the destinations, or delete rules 1–5.

**5. Fix actually applied.** Delete rules 2–6 (the report's "1–5" = the five broken ones; rule 1 in my numbering is the healthy `/reviews/calndly` typo-correction and is **kept**). Only the `redirects()` array is touched — `headers()`, the CSP block, the `ads.txt`/`robots.txt` passthroughs and `output: "standalone"` are **not** edited.

**6. Risk.** **Low.** Removing a redirect whose source and destination are both unpublished moves the source from `308 → 404` to a direct `404` — a cleaner terminal state. GSC's "Redirect" bucket (4 URLs) resolves into the legitimate "404" bucket instead of pending forever. Fully reversible if the comparisons are ever published.

**7. SEO / indexation impact.** Positive-to-neutral: eliminates five redirect chains Google must resolve to discover a 404, freeing crawl budget; no link equity is lost because the destination carries none.

**8. Decision.** **SAFE TO FIX NOW** — delete the five broken rules, keep `/reviews/calndly`.

**9. Exact files.** `src/app/../next.config.ts` → `redirects()` array only.

**10. Validation required.** Build; `/reviews/calndly` → 308 → 200; the five removed sources → 404 with **no redirect hop**; CSP/`ads.txt`/consent unaffected (spot-check a page and `ads.txt`).

---

## P9 — 31 thin glossary terms in the sitemap

**1. Exact issue.** 31 glossary terms in `sitemap.xml` fall well under the quality bar (median 212 words).

**2. Report evidence.** Phase 10.3, Phase 13.3 row P9.

**3. Proposed fix (report).** Expand to ≥400 words, or noindex them.

**4. Risk.** Low per item, but this is **content authoring** — explicitly out of scope ("no content rewriting", "no fabricated content").

**5. SEO / indexation impact.** Thin-but-honest pages are better than noindex-by-default; expanding them is the right long-term answer, but the expansion has to be written, not synthesised to hit a word count.

**6. Decision.** **DO NOT IMPLEMENT YET.**

**7. Exact files (if approved later).** `content/glossary/*.json` (31 files).

**8. Validation required (if approved later).** Word counts ≥400, or `noindex` applied consistently across meta + sitemap.

---

## P10 — `npm test` timeout failure

**1. Exact issue.** `npm test` intermittently fails: `src/test/registry.test.ts > searchContent > is case-insensitive` times out at 5000 ms. Reproduced **before and after** this session's changes — pre-existing and unrelated to any edited file.

**2. Report evidence.** Phase 12.1, Phase 13.3 row P10: *"raise `testTimeout` or mark the case slow"*.

**3. Proposed fix (report).** Raise `testTimeout` in `vitest.config.ts`, or mark the case slow.

**4. Fix actually applied.** `testTimeout` (and `hookTimeout`) raised in `vitest.config.ts`. The suite runs under RAM pressure alongside two sessions and two production servers, so the default 5000 ms is below the machine's real scheduling latency; the assertion itself is sound and is still executed.

**5. Risk.** **Low.** Test-runner configuration only — no product code, no assertion removed or weakened.

**6. SEO / indexation impact.** None directly; it removes a false negative so the validation gate is trustworthy.

**7. Decision.** **SAFE TO FIX NOW.**

**8. Exact files.** `vitest.config.ts`.

**9. Validation required.** `npm test` → all suites pass.

---

## P11 — "Alternate page with proper canonical tag" = 2

**1. Exact issue.** GSC reports 2 URLs under *Alternate page with proper canonical tag*, but the bucket could not be reproduced: the independent crawl found **0 canonical mismatches**.

**2. Report evidence.** Phase 13.3 row P11: *"not reproducible (0 mismatches); obtain a per-URL GSC export before acting"*.

**3. Proposed fix (report).** Obtain a per-URL GSC export first.

**4. Risk.** None as reported — but acting blind on a 2-URL bucket risks touching healthy canonicals.

**5. SEO / indexation impact.** Unknown until the URLs are known.

**6. Decision.** **DO NOT IMPLEMENT YET — no action possible.** A bucket of 2 unidentifiable URLs cannot be diagnosed from this repo; the required input (GSC per-URL export) does not exist here. This is the correct *outcome* for this bucket: "alternate + proper canonical" is Google agreeing with the page, not an error to fix.

**7. Exact files.** None.

**8. Validation required.** Provide `pages-all...csv` from GSC → re-diagnose.

---

## Cross-cutting notes

- **P4 is the load-bearing fix.** It converts 241 soft-404 200s into truthful 404s and was the only item the report marked Medium/High; it is now empirically proven rather than assumed, with options B and C explicitly rejected for cause.
- **P1 and P5 are coupled.** P1 stops linking to the 59 unreachable comparisons; P5 decides whether they stay unreachable. P1 is written so it survives either P5 outcome.
- **P3's report fix was amended, not followed blindly** — `authors/[slug]` is `dynamicParams = false`, so an unguarded slug derivation would have created a new 404 class. The allowlist makes it safe.
- **Nothing in the DO-NOT-YET group is blocking**: P5, P6, P7, P9 are editorial/publishing decisions; P11 needs data that only exists in GSC.
- **AdSense stack, CSP, consent, `ads.txt`, `robots.txt`, publisher ID, loader and placements: untouched.**
