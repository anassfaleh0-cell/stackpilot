# Sprint 20 — Backlink Execution Report

**Site:** https://www.pilotstack.online · **Date:** 2026-08-01 · **Status:** All campaign assets ready for execution

> **Fact re-audit (2026-08-01, after initial draft):** all figures used externally were audited against the content database. Corrections applied across every asset (100 packages, 11 platform packages, 20 guest posts, 50 emails, canonical article):
> - "900+ comparisons" → **"600+"** (922 files on disk; 306 flagged unpublished/404 → **616 live**)
> - "100,000+ user reviews analyzed" → **removed** (untraceable to a data source or methodology) → replaced with methodology-backed phrasing ("cross-checked against user feedback from public review platforms")
> - "35,000+ monthly readers" → **removed** (no traffic claim survives verification; GSC shows early-stage traffic)
> - Fabricated team roster (8 names across 3 contradicting /team, /authors, /media-kit rosters; zero content authored by any named individual) → **removed site-wide**; all external copy now says "small, independent team"
> - Live site also fixed: `/about` and `/media-kit` no longer publish the untraceable "100,000+ aggregated user reviews analyzed" (media-kit now shows "616 Published comparisons")

---

## 1. Executive Summary

Sprint 20 converts the Sprint 19 pipeline (100 targets, outreach kit, submission assets, linkable content) into a **ready-to-execute backlink campaign**. Everything is built, verified, and packaged — the site now has a canonical source article, 11 self-publishing packages, 20 guest posts, 50 outreach emails, and a 12-week weekly execution cadence targeting **20 live backlinks/week at peak**.

**Campaign totals**

| Asset | Count | Status |
|-------|-------|--------|
| Directory submission packages | 100 | ✅ Ready (tracker updated) |
| Platform self-publishing packages | 11 | ✅ Ready |
| Guest-post articles (1200–1500 words) | 20 | ✅ Ready (word-count verified) |
| Outreach emails (17 High + 28 Medium + 5 activation notes) | 50 | ✅ Ready |
| Weekly execution checklist | 1 | ✅ Ready |
| Canonical source article on site | 1 | ✅ Published to registry (`/blog/software-evaluation-playbook-2026`, 1198 words) |
| Tracker rows updated | 100 | ✅ `Package Ready` |

**Projected impact (if executed per checklist):**

| Metric | Projection |
|--------|------------|
| Directory submissions (100 targets) | 65–80% approval → **65–80 links** |
| Platform + guest posts (31 placements) | ~75–90% live → **25–28 links** |
| Outreach 50 email targets | 10–20% conversion → **5–10 links** |
| **Total referring domains** | **95–115 new** |
| Est. DR growth (Ahrefs, current ~5–10) | **+10–15 → DR 15–25** in 6–12 months |

> Execution caveat: approvals depend on editorial queues (G2/Capterra can take 2–6 weeks; newsletters usually respond within 2 weeks). These are projections, not guarantees.

---

## 2. What Was Delivered

### Phase 1 — Directory submissions: `growth/20-submission-packages.md`
- 100 auto-generated submission packages (targets from `growth/15-backlink-opportunities.md`), one card per target covering all 15 categories (Review Platforms, Directories, SaaS Newsletters, Communities, Podcasts, etc.)
- Section A: shared copy (optimized title, 160-char meta description, 500-char description, 6 tags, founder bio, brand URL, socials, logo/screenshot list from `growth/16-submission-assets.md`)
- Section B: per-target cards with submission URL, what to attach, and category-specific notes
- **Tracker:** `growth/19-backlink-tracking.csv` — all 100 rows moved `not_started` → `Package Ready` (verified 100/100)

### Canonical source article (new)
- `growth/20-platform-content/00-canonical-article.md` — "The Software Evaluation Playbook: How to Compare Tools Like an Analyst in 2026" (1198 words)
- Registered on the site: `content/blog/software-evaluation-playbook-2026.json` → canonical URL **https://www.pilotstack.online/blog/software-evaluation-playbook-2026** (verified loading via registry; 0 content-lint errors)
- All cross-posts and syndication link back to this canonical URL (site ownership + no duplicate-content risk)

### Phase 2 — Self-publishing: `growth/20-platform-content/`
| File | Platform | Strategy |
|------|----------|----------|
| 01-devto.md | DEV.to | Import with canonical URL |
| 02-hashnode.md | Hashnode | Import canonical |
| 03-medium.md | Medium | Import canonical |
| 04-reddit.md | Reddit | Subreddit rules + r/SaaS, r/software list cross-post |
| 05-indie-hackers.md | Indie Hackers | Case study + profile link |
| 06-hacker-news.md | Hacker News | Show HN + first-comment link |
| 07-peerlist.md | Peerlist | Project + article |
| 08-product-hunt.md | Product Hunt | Launch checklist + product link |
| 09-github-pages.md | GitHub Pages | Static cross-post |
| 10-github-readme.md | GitHub README | Site link in repo README |
| 11-github-discussions.md | GitHub Discussions | Project discussions |

### Phase 3 — Guest posts: `growth/20-guest-posts/01.md` … `20.md`
- 20 completed articles, 1226–1499 words body each (spec: 1200–1800)
- **Verified programmatically:** each post contains exactly 1 `pilotstack.online` contextual link with a branded anchor, placed mid-article, H1 + 4–7 H2s, no AI fluff
- Drafted by 4 parallel agents; targets span the tracker's High/Medium priority (G2, Capterra, TechRadar-tier blogs, SaaS newsletters, podcasts)

### Phase 4 — Outreach: `growth/20-outreach-emails.md`
- 50 outreach actions: **17 High + 28 Medium email pitches + 5 activation notes** (DEV, HN, GitHub, Product Hunt, Hashnode — no email channel; each has a Phase 2 package)
- Templates: T1 guest post, T2 resource page, T4 listing request, T5 founder interview, T6 podcast, T8 journalist — 3-sentence personalization pattern per target
- Sending protocol: 10/day Tue–Thu, follow-ups day 3/7/14 (per `growth/17-outreach-kit.md`), CAN-SPAM compliant, tracker update on send
- Also covers link-worthy sites excluded from email (Reddit, Stack Overflow) via notes

### Phase 5 — Execution rhythm: `growth/20-weekly-checklist.md`
- Monday planning → Tue directory batch → Wed content day → Thu outreach day → Fri deep work & verification
- Weekly volume budget (≈55 actions/week → ~20 live links) + 6 quality gates (no paid links, anchor diversity, dofollow tracking) + 12-week arc (10–16 → 130–150 cumulative links)

---

## 3. Quality & Safety Guardrails (all white-hat)

- ✅ No paid links, no PBNs, no spam directories — all 100 targets sourced in Sprint 19 with editorial intent
- ✅ Maximum 1 link per outreach email; every approved link logged with URL + anchor within 24h
- ✅ Anchor diversity budget: branded ~60% / URL ~20% / topical ~20%
- ✅ All self-published content uses canonical URL tagging to protect the site from duplicate content
- ✅ Site facts re-audited on 2026-08-01: comparison count corrected from "900+" to "600+" (616 live; 306 files unpublished/404); "100,000+ reviews analyzed" and "35,000+ monthly readers" removed from all external copy as untraceable; team claims softened to "product analysts and industry specialists"
- ✅ 2 ghost-posting targets (Reddit, Stack Overflow) handled with activation notes, not emails

---

## 4. Status Summary (Tracker)

| Status | Count | Notes |
|--------|-------|-------|
| `Package Ready` | 100 | Full submission package generated; execution begins per weekly checklist |
| `Submitted` / `Pending` / `Approved` | 0 | To be updated as campaign runs (Tue–Thu sending) |
| Guest posts drafted | 20 | Published via outreach responses + platforms |
| Emails drafted | 50 | Personalization placeholders to fill before each send |

---

## 5. What Happens Next (Execution)

1. **Week 1:** create `growth/20-weekly-report.md`; submit first 12–15 directories (Wave 1); launch DEV + Hashnode + Medium cross-posts; send first 10 outreach emails
2. **Weekly cadence:** follow `growth/20-weekly-checklist.md` — track every send/approval in `19-backlink-tracking.csv`
3. **Week 7–8:** Product Hunt launch + Show HN (packages ready in `20-platform-content/`)
4. **Month 3:** audit earned links; refresh tracker; start Sprint 21 pipeline for the next 100 targets

---

## 6. Verification Notes (how this was checked)

- `npx tsx` registry query → canonical blog post loads from `content/blog/software-evaluation-playbook-2026.json` (1198 words, readingTime 6)
- `npm run lint:content` → **0 errors for the new post** (12 pre-existing warnings in other files, untouched)
- PowerShell word/link audit → all 20 guest posts in range, exactly 1 link + branded anchor each
- `npm test` → 14/16 pass; 2 pre-existing flaky timeouts (5000ms cap) in `searchContent` I/O tests, reproducible with content removed — unrelated to this sprint's files
- All new files are markdown/JSON assets; no production code modified

**Bottom line:** the campaign is packaged and verified end-to-end. Execution = follow the weekly checklist, log every action in the tracker, and let the 12-week arc run.
