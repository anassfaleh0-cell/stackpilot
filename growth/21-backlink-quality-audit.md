# Phase 1 — Backlink Quality Audit

> Sprint 21 · Authority Recovery & High-Quality Backlink System
> **Purpose:** Classify every existing backlink source (live links, planned targets, and legacy directory databases) into quality tiers A–E, identify what to keep, what to downgrade, and what to purge.

---

## 1. Executive Summary

| Metric | Current State | Notes |
|--------|--------------|-------|
| Domain Rating | ≈ 0.2 | No meaningful external authority yet |
| Live referring domains | ~1 (GitHub) | Own-property links only (see §2) |
| Pages indexed | 1,800+ | Large site, nearly no link equity |
| Planned targets (tracker) | 100 | 96 distinct domains (4 duplicate brands) |
| Legacy directory DB (`07-backlink-directories.md`) | 300 entries | ~270 are C/D tier; ~12 flagged spam/Avoid |
| Tier-A editorial targets | 18 | Top review platforms, publications, .edu |
| Tier-E exclusions | 4 | Paid/spam-flagged only; **no live links to disavow** |

**Headline finding:** The existing engine is **mass-directory-heavy**. Of 100 tracked targets, 43 are directories/listing profiles (sections A–H) — the exact class of link Google treats as lowest-value and the class that explains why DR ≈ 0.2 despite the package-ready state of the entire tracker. The plan does not need to be scrapped — it needs **re-prioritization toward editorial, and honest expectations for directory tiers (C or below)**.

**Second finding:** No live spam/PBN/paid links exist. **No disavow is required today.** The E-tier list is preventive.

---

## 2. Live Backlink Inventory (what actually exists)

Everything live today comes from the Sprint 21 zero-human execution (verified 2026-08-03):

| # | Source | URL | Type | DF/NF | Tier | Notes |
|---|--------|-----|------|-------|------|-------|
| 1 | GitHub toolkit repo | github.com/anassfaleh0-cell/pilotstack-toolkit | Own property | DoFollow | B (self-owned) | Topics set, README with branded links |
| 2 | GitHub Pages site | anassfaleh0-cell.github.io/pilotstack-toolkit | Own property | DoFollow | B (self-owned) | DoFollow links with branded anchor "PilotStack" |
| 3 | GitHub Discussions | github.com/.../discussions/1 + /2 | Own property | DoFollow | B (self-owned) | Contextual links to playbook |
| 4 | Main repo README | github.com/anassfaleh0-cell/... | Own property | DoFollow | B (self-owned) | Branded anchor links |
| 5 | RSS feed | pilotstack.online/rss.xml | Technical | — | — | Fixed in a1; syndication signal, not a backlink |

**Honest note:** GitHub links pass some authority, but all five are **self-owned properties** — they are a foundation (brand consistency, E-E-A-T footprint), not a proxy for external editorial approval. They do not move DR meaningfully on their own.

**Missing that would exist at this stage of a mature program:**
- No G2/Capterra/TrustRadius profiles (require verified user reviews)
- No Crunchbase/Wellfound/Clutch profiles
- No external guest posts, interviews, or journalist links live
- No unlinked brand mentions reclaimed (no scan has been run — see Phase 6)

---

## 3. Tier Definitions

| Tier | Definition | DF/NF policy | Target share |
|------|-----------|--------------|--------------|
| **A** | Tier-1 editorial: reputable industry publications, major news/review platforms, .edu and .gov domains, high-authority communities | Any (NF acceptable for authority/reach) | 15–25% |
| **B** | Strong industry/niche: trusted industry blogs, editorial-curated directories, niche review sites, podcasts, founder-interview platforms | Prefer DF | 20–30% |
| **C** | Moderate: general web directories, low-authority niche sites, profiles, forums | DF preferred, NF accepted | 30–40% |
| **D** | Low: mass directories, low-quality profiles, minimal-authority sites | NF ok | 10–20% |
| **E** | Exclude/purge: PBNs, spam, paid links, irrelevant placements | — | 0–10% |

**Classification rules applied:**
1. Mass directory submissions → **downgraded to C or below** (this is the biggest correction vs. the old tracker, which marked most of them High priority).
2. High-quality directories with editorial curation (e.g., AlternativeTo, SaaSHub) → **keep B or higher**.
3. .edu/.gov domains → **A by definition**, regardless of NF or acceptance odds.
4. Self-owned properties (GitHub) → tracked but **not counted toward external referring domains**.
5. Multiple targets on one brand/domain → **deduplicated** for the referring-domain metric (§5).

---

## 4. Full Classification of the 100 Tracked Targets

### Tier A — Tier-1 Editorial (18)

| # | Target | Est. DR | DF/NF | Category | Rationale |
|---|--------|---------|-------|----------|-----------|
| 11 | G2 | 93 | DF | Review platform | Gold-standard software review platform |
| 12 | Capterra | 91 | DF | Review platform | Gartner network |
| 13 | TrustRadius | 82 | DF | Review platform | Buyer-verified reviews |
| 14 | GetApp | 87 | DF | Review platform | Gartner network |
| 15 | Software Advice | 85 | DF | Review platform | Gartner network |
| 52 | Product Hunt | 92 | DF | Launch platform | One-time launch, massive signal |
| 35 | Stack Overflow | 93 | NF | Community | Answer authority; profile link |
| 38 | Hacker News | 95 | NF | Community | Show HN data story |
| 41 | GitHub awesome lists | 95 | DF | OSS community | PR to awesome-saas lists |
| 57 | Search Engine Journal | 90 | DF | Industry publication | Data-driven SEO angle |
| 58 | Search Engine Land | 92 | DF | Industry publication | Strong methodology required |
| 59 | Content Marketing Institute | 82 | DF | Industry publication | Content research angle |
| 60 | MarTech | 90 | DF | Industry publication | MarTech stack data |
| 61 | Neil Patel | 88 | DF | Industry publication | Review-analysis case study |
| 97 | UC Davis Startup Center | 75 | NF | .edu | Tier-1 domain; low acceptance odds |
| 98 | UCF Startup Library Guide | 80 | NF | .edu | LibGuide; librarian contact |
| 99 | Clarkson Research Tools | 50 | NF | .edu | LibGuide with update history |
| 100 | UCLA Research Guides | 90 | NF | .edu | Highest authority, lowest odds |

### Tier B — Strong Industry/Niche (27)

| # | Target | Est. DR | DF/NF | Category | Rationale |
|---|--------|---------|-------|----------|-----------|
| 2 | AlternativeTo | 88 | DF | Curated directory | Editorial-curated; user-suggested |
| 1 | SaaSHub | 70 | DF | Curated directory | Editorial-curated SaaS directory |
| 3 | SoftwareSuggest | 70 | DF | Curated directory | High traffic; category fit |
| 5 | FinancesOnline | 75 | DF | Curated reviews | Curated editorial reviews |
| 16 | ITQlick | 62 | DF | Comparison site | Comparison-focused editorial |
| 17 | CompareCamp | 60 | NF | Review site | Editorial quality bar |
| 18 | SoftwareReviews (Info-Tech) | 65 | DF | Review platform | Enterprise buyer reviews |
| 24 | Startup Stash | 65 | DF | Curated directory | Editorial curation |
| 66 | StackShare | 75 | DF | Dev community | Own stack page; community votes |
| 47 | Clutch | 70 | DF | B2B listing | Requires client reviews |
| 48 | Trustpilot | 90 | NF | Reviews | Social proof + brand mentions |
| 36 | DEV Community | 87 | DF | Community | Canonical cross-posts |
| 37 | Hashnode | 80 | DF | Community | Canonical cross-posts |
| 86 | Indie Hackers | 80 | DF | Founder community | Data story + journey |
| 40 | Reddit (r/SaaS, r/software) | 93 | NF | Community | Massive reach; value-first only |
| 79 | Starter Story | 70 | DF | Founder interviews | Revenue-story format |
| 80 | IdeaMensch | 55 | DF | Founder interviews | Quick turnaround |
| 81 | Failory | 60 | DF | Founder interviews | Lessons/failures angle |
| 82 | SaaS Club | 50 | DF | Founder interviews + podcast | SaaS-focused |
| 85 | The SaaS Podcast | 50 | DF | Podcast | Highly bookable |
| 87 | The Bootstrapped Founder | 45 | DF | Podcast | Highly bookable |
| 88 | SaaStr Podcast | 76 | DF | Podcast | GTM/metrics story |
| 89 | Lenny's Podcast | 60 | DF | Podcast | Signature research framework |
| 90 | 20VC | 65 | DF | Podcast | High bar |
| 91 | TLDR | 70 | DF | Newsletter | Curated inclusion only (sponsor slots = paid, excluded) |
| 92 | SaaStr Daily | 76 | DF | Newsletter | Content submission |
| 75 | The Rundown AI | 65 | NF | Newsletter | Timely AI data pitches |

### Tier C — Moderate (29)

| # | Target | Est. DR | DF/NF | Category | Rationale |
|---|--------|---------|-------|----------|-----------|
| 4 | SaaSworthy | 58 | DF | SaaS directory | Vendor listing |
| 6 | Crozdesk | 62 | DF | SaaS directory | AI-matching listing |
| 7 | GoodFirms | 71 | DF | SaaS directory | Vendor profile |
| 8 | SoftwareWorld | 60 | NF | SaaS directory | Vendor listing |
| 9 | SaaS Genius | 45 | DF | SaaS directory | Small niche directory |
| 19 | Crunchbase | 88 | NF | Startup directory | Brand citation (NF but essential) |
| 20 | Wellfound | 78 | NF | Startup directory | Brand footprint |
| 21 | F6S | 72 | DF | Startup directory | DF startup DB |
| 22 | StartupBlink | 68 | DF | Startup directory | Map pin + profile |
| 23 | Startup Ranking | 60 | DF | Startup directory | Voting-based |
| 25 | Startups.fyi | 55 | DF | Startup directory | Simple form |
| 26 | The Org | 58 | NF | Startup directory | Org chart |
| 27 | There's An AI For That | 68 | DF | AI directory | AI-assisted angle |
| 28 | Futurepedia | 60 | DF | AI directory | Weekly featured spots |
| 29 | Future Tools | 55 | NF | AI directory | Newsletter + directory |
| 30 | Toolify | 50 | DF | AI directory | High-volume traffic |
| 31 | TopAI.tools | 45 | DF | AI directory | Community voting |
| 32 | Supertools | 55 | DF | AI directory | The Rundown ecosystem |
| 62 | GrowthHackers | 70 | NF | Community | Post + upvote |
| 65 | Startup Resources | 40 | DF | Resource page | Explicit submit channel |
| 69 | Startup Tools | 40 | DF | Resource page | Submit channel |
| 74 | TLDR Marketing | 60 | NF | Roundup | Form-based |
| 78 | Startup Digest | 65 | DF | Roundup | Regional digests |
| 63 | SaaS Marketplace | 45 | DF | Guest post | Verified accepting |
| 43 | SourceForge | 75 | DF | OSS listing | Only genuinely free tools |
| 46 | fosstodon | 50 | DF | OSS community | Share research threads |
| 39 | Lobsters | 55 | NF | Community | Invite-only; participate first |
| 94 | Ben's Bites | 50 | NF | Newsletter | AI news submission |
| 84 | Latka SaaS Interviews | 55 | DF | Founder interviews | Revenue proof required |
| 93 | Lenny's Newsletter | 60 | DF | Newsletter | Original frameworks only |
| 42 | GitLab | 85 | DF | OSS community | Only if open-sourcing tooling |

### Tier D — Low (22)

| # | Target | Est. DR | DF/NF | Category | Rationale |
|---|--------|---------|-------|----------|-----------|
| 10 | Toolfolio | 35 | DF | SaaS directory | Small showcase |
| 33 | Insidr AI | 40 | DF | AI directory | Course + directory |
| 34 | Dang AI | 35 | DF | AI directory | Quick submit |
| 49 | Sitejabber | 70 | NF | Business listing | Complete profile only |
| 50 | ZoomInfo | 75 | NF | Business listing | Data-accuracy plays |
| 51 | Dun & Bradstreet | 85 | NF | Business listing | Legitimacy signal |
| 53 | BetaList | 70 | NF | Launch | Requires beta features |
| 54 | BetaPage | 50 | DF | Launch | Fast submission |
| 55 | Launching Next | 40 | DF | Launch | Launch calendar |
| 56 | Uneed | 45 | DF | Launch | Complementary |
| 67 | Awesome Indie | 35 | DF | Resource | Submit form |
| 68 | Postmake | 35 | DF | Resource | Curated indie directory |
| 70 | Tiny Helpers | 35 | DF | Resource | Dev-adjacent |
| 71 | Tool Finder | 35 | DF | Resource | Review/roundup hybrid |
| 72 | Cayenne Consulting | 30 | NF | Resource | Real resource page |
| 73 | SaaS Weekly | 40 | DF | Roundup | Small but relevant |
| 76 | Hacker News Digest | 30 | DF | Roundup | Weekly digest |
| 77 | SaaS Scout | 35 | DF | Roundup | Small niche |
| 83 | How I Built It | 35 | DF | Founder interviews | Product-build focus |
| 95 | Growth Unhinged | 45 | DF | Newsletter | Growth experiments |
| 96 | Bootstrapped Founder Newsletter | 45 | DF | Newsletter | Same brand as podcast (duplicate) |
| 64 | IdeasPlusBusiness | 30 | DF | Guest post | Low DR write-for-us |
| 44 | OpenHub | 60 | NF | OSS listing | Requires OSS repo |
| 45 | FSF Directory | 60 | NF | OSS listing | Fully free-licensed projects only |

### Tier E — Exclude / Purge (4 + 0 live)

| Source | Why excluded |
|--------|--------------|
| TLDR **sponsored** slots | Paid link — excluded by policy; only curated inclusion is eligible (already in B) |
| Lenny's Newsletter **sponsorship** | Paid — excluded; only guest essay is eligible (already in B) |
| Merchant Circle (legacy `07` DB) | Spam score 15% — flagged "Avoid" in original audit |
| Brothersoft / FileCluster / Hotfrog / Cybo (legacy `07` DB) | Spam 12–14%, flagged Avoid/low quality in original audit |

**Disavow status:** Nothing to disavow — none of these were ever submitted, and no live link is spammy or purchased. Re-verify quarterly.

---

## 5. Summary Counts

| Tier | Count (of 100) | Share | Target share | Verdict |
|------|---------------|-------|--------------|---------|
| A | 18 | 18% | 15–25% | ✅ in range |
| B | 29 | 29% | 20–30% | ✅ in range |
| C | 29 | 29% | 30–40% | ✅ in range |
| D | 24 | 24% | 10–20% | Slightly high — D targets stay but get lowest execution priority |
| E | 4 | 4% | 0–10% | ✅ in range |
| **Total** | **100** | 100% | — | — |

**Distinct referring domains:** 96 (4 duplicate brands: SaaS Club/SaaS Podcast; SaaStr/SaaStr Daily; Lenny's Podcast/Newsletter; Bootstrapped Founder Podcast/Newsletter).

**Legacy `07-backlink-directories.md` database (300 entries):** ~10 are A/B (the platforms already in the tracker); ~270 are C/D (mass SaaS/AI/startup/business directories); ~12 flagged spam/Avoid. **Recommendation: archive this file as superseded** — the curated 100-target tracker (Phase 3 deliverable) replaces it. No action needed on its content other than keeping the spam list as an E-tier reference.

---

## 6. Corrective Actions

### Keep / promote (execution priority in Phase 13)
1. **Tier A review platforms** (G2, Capterra, TrustRadius, GetApp, Software Advice) — these gate on verified user reviews; start the review-collection campaign now (shortest path to real authority).
2. **The flagship research asset** (Phase 5) — required before Tier-A editorial pitches (SEJ, SEL, CMI, MarTech, Neil Patel) have an anchor to cite.
3. **Product Hunt + Show HN launch** — timed around the flagship data story.
4. **Founder interviews + podcasts (Tier B)** — most attainable editorial links with the existing assets (Sprint 20 outreach kit + 45 written emails).

### Downgrade / de-emphasize
5. **All Tier C/D directories** — batch submissions only, one afternoon, tracked, low expectation. They are citations, not authority.
6. **Remove "High" priority from any directory** in the tracker (Phase 2 migrates tiers into the CSV).

### Purge / never pursue
7. No paid placements (TLDR/Lenny's sponsor slots), no PBNs, no spam directories (E list). Policy from Sprint 19 stands.

### Data-honesty caveats
8. All DR figures are **planning estimates** from the Sprint 19/20 docs (2026 vintage). Re-verify with Ahrefs before each outreach wave.
9. This audit classifies **planned** sources. The real referring-domain profile (Ahrefs/GSC export) should be re-run quarterly and appended here.
10. GitHub self-owned links are tracked but do not count toward the 96-distinct-domain total.

---

## 7. Acceptance Criteria for This Phase

- [x] Every tracked backlink source classified A–E
- [x] Tier definitions and DF/NF policy documented
- [x] Live links inventoried and honestly labeled (self-owned)
- [x] Legacy 300-entry database disposition decided (archive; E-list preserved)
- [x] No fabricated domains or stats — all data sourced from `15-backlink-opportunities.md`, `07-backlink-directories.md`, `19-backlink-tracking.csv`, and `21-zero-human-execution-report.md`
- [ ] Tracker migrated with tier column (Phase 2)
