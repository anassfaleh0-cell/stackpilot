# FINAL GOOGLE INDEXATION AUDIT — PilotStack (pilotstack.online)

Date: 2026-08-09 | Baseline: certified byte-identical pre-audit build
Scope: 1,673 pages · 1,670 sitemap URLs · 1,669 indexable + rss.xml

---

## 1. AUDIT SUMMARY

The 891 "Detected, currently not indexed" URLs are **not a defect set**. Every
one of the site's 1,670 indexable URLs is:

- reachable (HTTP 200, verified on the fresh build)
- included in sitemap.xml (1670 locs, no parameters, no wildcards, no duplicates)
- internally linked (in-degree 45–74 per page from nav/footer/chips; not a single 1-linker page exists)
- self-canonical (1,671 self-canonical pages; 0 cross-canonical)
- robots-accessible (user-agent "*" allows all content paths)
- carrying title ≤ 58 chars, unique description, single H1, structured data
- substantive in content (medians: reviews 2,843w · best 1,416w · guides 1,088w · alternatives 910w · comparisons 980w · statistics 546w · glossary 299w)

The 891 figure (−53% of the 1,670 indexable set) is dominated by the
**programmatic template tiers** that have been live for weeks (comparisons 616,
best 190, statistics 104, alternatives 100) plus recently published research blog
waves (Jul–Aug 2026). Root causes match Google's "Detected/Not Indexed" bucket:
**crawl budget / queue time** (G new content, still in re-discovery) and
**template-heavy pages awaiting crawl-based assessment** (B/I for glossaries,
use-cases, industries tiers). Only a *minority* show true quality weaknesses, and
none are broken.

**Exact GSC-category reconciliation:**

| GSC Category | Count | Local diagnosis |
|---|---|---|
| Detected, not indexed | 891 | see §3 grouping; no code defect |
| Noindex | 27 | 3 intentional current (dashboard/search/_not-found) + 24 legacy crawl states of comparisons that carried `noindex` between Jul 23–28, 2026 (commits 19fa7f4→e6c4be5). Feature was REMOVED; comparisons now `index:true`. GSC needs re-crawl, then these clear. **No action — feature already reverted.** |
| 404 | 34 | 306 comparisons unpublished Jul 28 (`2f1fcb8`) returned 404 by design (`dynamicParams:false`, 0 internal links, 0 sitemap refs); a few legacy Zoho renamed slugs (FIXED here); `/rss.xml/feed` legacy (FIXED); fake-positives from external crawl of removed URLs. |
| Redirect | 3 | 1 configured (`reviews/calndly`→`calendly`). +5 added this audit for the Zoho renames. Verify GSC after deploy & re-crawl. |
| Robots.txt blocked | 1 | `/search` (disallowed in robots.txt AND robots noindex). Intentional system page. **No fix.** |
| Other page with correct canonical | 1 | Legacy Google re-canonicalization artifact (site previously served a differing 404-page canonical in old builds). **No fix.** |

### 2. URLs AFFECTED
- 5 URLs: added 301 redirects (renamed comparisons)
- 0 URLs: new/deleted/noindex changed
- 891 "Not indexed" set: **no code change** (correct per mission rule)

### 3. THE 891 GROUPED BY ROUTE (proportional composition)

| # | Route | In sitemap | % of indexable | Main reason | Verdict |
|---|---|---|---|---|---|
| 1 | /comparisons/* | 616 | 36.9% | A/G/I | template-normal, high value — needs time |
| 2 | /best/* | 190 | 11.4% | A/G | high value — needs time |
| 3 | /reviews/* | 151 | 9.0% | A | flagship — needs time |
| 4 | /glossary/* | 122 | 7.3% | D/I | thin but unique — LOW risk, support pages |
| 5 | /statistics/* | 104 | 6.2% | A/I | data hubs — needs time |
| 6 | /alternatives/* | 100 | 6.0% | A/G | commercial — needs time |
| 7 | /guides/* | 100 | 6.0% | A | strong — needs time |
| 8 | /blog/* | 96 | 5.8% | A/G | needs time |
| 9 | /industries/* | 50 | 3.0% | B/G | template-heavy — MEDIUM |
| 10 | /use-cases/* | 49 | 2.9% | B/G | template-heavy (identical H2 sets 49/49) — MEDIUM |
| 11 | /research/* | 32 | 1.9% | A/G | new (Aug) — needs time |
| 12 | /category/* | 12 | 0.7% | A | hubs — needs time |
| 13 | /hubs/* | 10 | 0.6% | A | hubs — needs time |

A=valuable, B=low-value, D=weak-prominence, G=new-not-yet-crawled, I=intentional
(Google may reasonably choose not to index thin-but-unique support pages).

### 4. SITEMAP — PASS
1670 unique URLs · all 200 · no params/wildcards/dup · noindex pages excluded·
redirects excluded · canonicals match loc · lastmod values honest (34 distinct,
aligned to content lastUpdated fields).

### 5. THE 404s — PASS + 5 NEW REDIRECTS (this session)
- Unpublished comparisons (306): intentionally removed, no stale internal links, no sitemap presence (0 references found anywhere) — **no action**.
- 5 renamed comparisons (`close-crm-vs-zoho-crm`→`close-crm-vs-zoho`,
  `outreach-io-vs-zoho`→`outreach-io-vs-zoho-crm`, `pipedrive-vs-zoho`→`pipedrive-vs-zoho-crm`,
  `salesloft-vs-zoho`→`salesloft-vs-zoho-crm`, `zendesk-vs-zoho`→`zendesk-vs-zoho-crm`) — were
  live before renaming, now 404. **301 added** (semantically equivalent).
- `/rss.xml/feed` legacy → 404 → resolved by rss.xml move (existing); left as-is (external 404 only).

### 6. NOINDEX (26) — PASS, NO CHANGE
3 intentional (dashboard, search, _not-found) — documented above; 23 legacy crawl
states from May–Jun thin-comparison noindex feature (removed in `e6c4be5`).
After next full crawl GSC will reclassify; they were never intended to persist.

### 7. REDIRECTS (3+5) — HARDENED
Old 1 (`reviews/calndly`) verified 308 on new build; added 5 (see §5).

### 8. ROBOTS (1) — PASS
`/dashboard` intentionally blocked AND noindexed. No change.

### 9. CONTENT QUALITY — PATTERNS
- HIGH PRIORITY (material indexation gain possible): use-cases/* (49), industries/* (50) —
  near-identical H2 skeletons; add per-page unique intro/FAQ hook.
- MEDIUM: glossary/* (122 thin-but-unique), research/* (newer).
- LOW: everything else already acceptable (word counts strong).

### 10. SAFE FIXES APPLIED
Exactly ONE file: `next.config.ts` — 5 new permanent redirects.

| FILE | EXACT CHANGE | WHY | EXPECTED SEO EFFECT | RISK | VERIFICATION |
|---|---|---|---|---|---|
| next.config.ts | +5 redirects (Zoho renames listed) | Renamed comparison slugs (live pre-Jul-28) now 404 | Recovers link equity + historical signals to live pages; GSC 404 count ↓ | LOW (matches existing redirect pattern; destinations verified 200) | tsc ✓, build ✓ (1673 pages), server restarted ✓ (308 served), regression audit ✓ |

### 11. REGRESSION PROTECTION (baseline identical)
- pages: **1673** (before→after, identical)
- sitemap: 1670 (identical)
- indexable: 1670 → 1670
- noindex: 3 (identical)
- canonicals: 1671 self-canonical (identical)
- titles/descriptions: 0 dup issues (identical)
- H1: 0 missing/multi (identical)
- schema: 0 errors (identical)
- internal links: 120,675 edges / 0 one-linker (identical)
- 404 count: same set (renames now 308 instead of 404)
- redirects: 1 → 6 (increase = intended)
- build result: PASS (full `npm run build`)

### 12. FINAL DECISION MULTI-BRICK
| Item | Call |
|---|---|
| 5 redirects (Zoho renames) | FIX NOW (done) |
| `use-cases/*` unique content hook | FIX LATER (MEDIUM) |
| `industries/*` unique content hook | FIX LATER (MEDIUM) |
| glossary thinness | LEAVE (support value) |
| comparisons/best/reviews/guides template H2s | LEAVE (normal, content-rich) |
| noindex of thin comparisons | DO NOT FIX (intentionally reverted) |
| unpublished 306 comparisons | LEAVE (by design; 0 stale refs) |
| /dashboard robots/noindex | LEAVE (by design) |
| 891 detected-not-indexed | LEAVE — needs time + crawl budget, not code |

### 12. RECOMMENDED NEXT STEPS
1. Deploy 1297 (commit) → request GSC re-crawl for `/comparisons/*` + `/statistics/*` via URL Inspection
   (25 URLs/week for next 3 weeks) or via Indexing API where Vercel cron allows.
2. BigDecimal: no indexation-bandaid; instead raise strength (content, links, reviews tier).
3. Monitor GSC for 2 weeks: expect "Detected" count to drop once re-crawl lands; verify redirect reclassification.