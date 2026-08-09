# GitHub Pages — Documentation Site

> **Setup:** create repo `pilotstack/docs` (public). GitHub Pages renders from the branch `/docs` folder or via Actions. Use plain Markdown + a Jekyll theme (e.g., `jekyll-theme-cayman`) or a static generator. Domain: `https://pilotstack.github.io/docs` (or custom subdomain `docs.pilotstack.online` via CNAME).
> **Purpose:** hosts the free, reusable evaluation toolkit (scorecard CSV, trial checklist, methodology) — a genuinely useful artifact that earns natural links and anchors the awesome-list PRs (Phase 1 target #41).

---

## File Structure

```
docs/
├── README.md               (landing page, links to pilotstack.online)
├── _config.yml             (theme + title)
├── scorecard.md            (weighted scorecard explanation + CSV embed)
├── scorecard.csv           (downloadable template)
├── trial-checklist.md      (12-task two-week trial checklist)
├── methodology.md          (mirrors /methodology on the site, links back)
└── index.md                (optional redirect to README)
```

## README.md (landing) — content

```markdown
# PilotStack Evaluation Toolkit

Free, reusable templates for evaluating business software — created by the reviewers at PilotStack, who test every tool hands-on for two weeks before reviewing it.

## What's here
- **Weighted scorecard** (CSV) — score features, ease of use, support, value, and performance on a 1–5 scale, weighted to your priorities.
- **Two-week trial checklist** — the 12 tasks that expose any SaaS product's real weaknesses.
- **Methodology** — how we cross-check user feedback from public review platforms against hands-on tests.

## License
MIT — use, fork, remix. If you use it publicly, a link back is appreciated, not required.

## More
Read the full playbook: [The Software Evaluation Playbook](https://www.pilotstack.online/blog/software-evaluation-playbook-2026)
Explore 150+ reviews and 600+ comparisons: [pilotstack.online](https://www.pilotstack.online)
```

**Link placement (required):** two links above — one to the playbook (contextual), one branded anchor `pilotstack.online` (natural, in the footer line). Both DoFollow from GitHub Pages (default links are not nofollowed).

## scorecard.md — summary + CSV

```markdown
# The Weighted Scorecard

Score every finalist on the same 1–5 scale. Weights should sum to 100% and reflect your priorities — a team with no admins weights Ease of Use heavily; an enterprise with compliance needs weights Support and Performance.

Download: [scorecard.csv](scorecard.csv)

| Dimension | Weight | Notes |
|-----------|--------|-------|
| Features | 25% | Only features relevant to your 3 core workflows |
| Ease of Use | 25% | Time-to-first-value, admin burden |
| Support | 20% | Response time, quality of answers |
| Value | 15% | Total cost of ownership, not sticker price |
| Performance | 15% | Speed, reliability, API limits |
```

## trial-checklist.md — 12 tasks

1. Complete the core workflow end-to-end without help
2. Import real data (contacts/tasks/records) — time it
3. Invite a non-technical teammate and watch them try
4. Configure user roles and permissions
5. Test search + filters with production-scale data
6. Build the report you'd send to management
7. Send a support ticket through the customer channel; measure response
8. Test the mobile experience with the worst-case workflow
9. Try to export all your data (full export)
10. Check the changelog and roadmap for the last 6 months
11. Review API limits and integration quality
12. Ask the sales rep for the itemized 3-year quote

## methodology.md

Mirror the site's /methodology content; first paragraph links back: "Published by the **PilotStack** team — [full methodology](https://www.pilotstack.online/methodology)."

---

## Checklist

- [ ] CNAME file → custom domain if used
- [ ] Repo description: "Free software evaluation toolkit by PilotStack"
- [ ] Repo website field → https://pilotstack.github.io/docs
- [ ] RSS/sitemap (Jekyll default) — GH Pages handles SEO meta via theme
- [ ] Link the docs repo from the main `pilotstack` GitHub org profile
- [ ] Update tracker: GitHub (awesome lists) related PRs reference the toolkit URL
