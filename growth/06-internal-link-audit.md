# Internal Link Audit

## Top Linked Pages (appear in nav + footer)

| Page | Nav | Footer | Total |
|------|-----|--------|-------|
| `/reviews` | 1 (Reviews) | 1 (Explore) | 2 |
| `/comparisons` | 1 (Comparisons) | 1 (Explore) | 2 |
| `/guides` | 1 (Guides) | 1 (Explore) | 2 |
| `/best` | 1 (Best Software) | 1 (Explore) | 2 |
| `/use-cases` | 1 (Use Cases) | 1 (Explore) | 2 |
| `/industries` | 1 (Industries) | 1 (Explore) | 2 |
| `/hubs` | 1 (By Business Type) | 1 (Explore) | 2 |
| `/blog` | 1 (Research) | 1 (Explore) | 2 |
| `/alternatives` | 1 (Alternatives) | 1 (Explore) | 2 |
| `/about` | 1 (secondaryNav) | 1 (Company) | 2 |
| `/methodology` | 1 (secondaryNav) | 1 (Policies) | 2 |
| `/` (home) | 0 (nav) | 1 (logo) + 1 (logo in header) | 2 |

These 12 pages are the most visible, appearing in at least two major navigation surfaces.

### Footer-only pages (single source, still well-linked)

| Page | Source |
|------|--------|
| `/category/*` | 1 (Footer — Categories) |
| `/editorial-policy` | 2 (Footer — Editorial + Policies) |
| `/editorial-independence` | 2 (Footer — Editorial + Policies) |
| `/affiliate-disclosure` | 2 (Footer — Editorial + Policies) |
| `/advertising-disclosure` | 2 (Footer — Editorial + Policies) |
| `/corrections-policy` | 2 (Footer — Editorial + Policies) |
| `/research-methodology` | 1 (Footer — Editorial) |
| `/fact-checking-policy` | 1 (Footer — Editorial) |
| `/how-we-test-software` | 1 (Footer — Editorial) |
| `/authors` | 1 (Footer — Editorial) |
| `/brand-assets` | 1 (Footer — Company) |
| `/media-kit` | 1 (Footer — Company) |
| `/press` | 1 (Footer — Company) |
| `/contact` | 1 (Footer — Company) |
| `/privacy` | 1 (Footer — Company) |
| `/cookies` | 1 (Footer — Company) |
| `/terms` | 1 (Footer — Company) |
| `/search` | 1 (Header icon) |

## Weakly Linked Pages

Pages in the sitemap that appear in **zero** nav, footer, or editorial link groups. Their only internal links come from content body copy or listing pages.

| Page | Internal Links from Nav/Footer/Editorial |
|------|------------------------------------------|
| `/glossary` | **0** |
| `/tools` | **0** |
| `/tools/tco-calculator` | **0** |
| `/tools/software-comparison` | **0** |
| `/statistics` | **0** |
| `/research` | **0** |
| `/dashboard` | **0** |
| `/authors/pilotstack-team` | **0** |
| `/authors/alex-chen` | **0** |
| `/authors/sarah-mitchell` | **0** |
| `/authors/jordan-park` | **0** |
| `/authors/priya-sharma` | **0** |

These pages depend entirely on in-content contextual links. /research and /statistics are especially notable omissions given their priority scores (0.7 and 0.8 in the sitemap).

## Orphan Analysis

| Page | Has Internal Link? | Source |
|------|-------------------|--------|
| `/brand-assets` | ✅ Yes | Footer — Company |
| `/media-kit` | ✅ Yes | Footer — Company |
| `/cookies` | ✅ Yes | Footer — Company |
| `/dashboard` | ❌ **No** | Nowhere in nav, footer, or editorial links |

`/dashboard` is the only true orphan among the new pages. It's in the sitemap but unreachable from any navigation surface.

## Anchor Text Diversity

### Nav bar anchor text

| Current Label | Target | Issue | Suggestion |
|---------------|--------|-------|------------|
| Reviews | `/reviews` | Generic — could be anything | "Software Reviews" |
| Best Software | `/best` | Vague — best for what? | "Best-of Lists" or "Top Software" |
| By Business Type | `/hubs` | Unclear — sounds like a filter, not a destination | "Business Hubs" or "By Industry" |
| Research | `/blog` | Misleading — "/blog" is a blog, not a research portal | "Blog" or "Articles" |
| Alternatives | `/alternatives` | OK, but repetitive in content | "Software Alternatives" |

### Footer category labels

Category links (`/category/*`) use the raw category name as anchor text. These are fine for SEO but miss an opportunity to signal value (e.g., "AI & ML Tools" instead of "AI & Machine Learning").

### Duplicate anchor text across sections

- "Editorial Policy" and "Affiliate Disclosure" appear in **both** the Editorial and Policies footer columns (exact duplicate links on the same page).
- "Editorial Independence" and "Corrections Policy" also duplicated.

This creates redundant links and dilutes link equity.

## Recommendations

### 1. Add contextual links from relevant content pages

- Link to `/glossary` from review and guide content (inline tooltip or "See glossary term").
- Link to `/statistics` from relevant data-heavy reviews and comparisons.
- Link to `/research` from `/methodology`, `/editorial-policy`, and `/about`.
- Link to `/tools/*` from `/comparisons` and `/guides` where readers would use the matrix.
- Add `/dashboard` to the header user menu or account-related section — currently unreachable.

### 2. Cross-link between brand pages

- `/brand-assets` should link to `/media-kit` and vice versa.
- `/press` should link to both `/media-kit` and `/brand-assets`.
- `/about` should link to `/press` and `/contact`.
- Ensure the "Press & Media" page surfaces `/brand-assets` and `/media-kit` links.

### 3. Add related content sections

- On `/reviews`, `/comparisons`, and `/guides` listing pages, add a "Related Tools" or "Explore More" sidebar linking to `/tools/*`, `/statistics`, and `/glossary`.
- On article pages, add a "Further Reading" section that links to relevant `/research/*` and `/statistics/*` content.
- Consider a "Popular Tools" or "Trending Comparisons" widget in the sidebar to create more internal links.

### 4. Improve footer link organization

- **Deduplicate**: Remove the redundant editorial links in the "Policies" column since they already appear in "Editorial." Replace with: `/research`, `/statistics`, `/glossary`, `/tools`.
- **Restructure Company column**: Add `/dashboard` if applicable, or add a "Tools" column.
- **Add a "Resources" column** with links to `/glossary`, `/statistics`, `/research`, and `/tools`. This would resolve all weakly linked pages in one change.
- **Rename nav labels** for clarity (see Anchor Text Diversity table).

### 5. Fix the `/dashboard` orphan

- Add to the primary nav (e.g., as a logged-in user link).
- Add to the footer "Company" or new "Account" column.
- If `/dashboard` requires authentication, ensure there's a login/register flow that points to it.

## Summary

| Category | Count |
|----------|-------|
| Pages in nav | 11 |
| Pages in footer | 50+ |
| Pages in sitemap only (weakly linked) | 8 static + 5 author pages |
| True orphans | 1 (`/dashboard`) |
| Duplicate footer links | 4 pairs |
