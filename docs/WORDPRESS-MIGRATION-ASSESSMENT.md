# PilotStack WordPress Migration Assessment

Status: planning/documentation only. This document does not change the production application, DNS, Vercel configuration, or current content.

## Decision summary

Do not switch `pilotstack.online` to WordPress yet. First build and test an import/export proof of concept on a separate branch and a separate staging environment. Keep the existing Next.js/Vercel application and its URLs as the reference until the WordPress version passes the acceptance checks below.

The repository inventory currently shows approximately:
- 2,526 tracked files overall.
- 2,008 files under `content/`, approximately 34.1 MB.
- 928 comparison records, 152 review records, 196 `best` records, 100 guide records, 97 blog records, 122 glossary records, 101 alternatives records, 104 statistics records, 50 industry records, and other content collections.
- `showcase-screenshots/` contains 76 files and approximately 28.7 MB.

These are repository file counts/sizes, not a measurement of the final WordPress database or the full production website. Confirm the current branch and inventory again before an actual migration.

## Recommended architecture

Use WordPress as a content management system with a custom theme and custom plugin for PilotStack-specific data. Avoid representing every page as an ordinary blog post if that would lose structured fields or page behavior.

Suggested content types:
- Reviews
- Comparisons
- Guides
- Blog posts
- Glossary terms
- Alternatives
- Best-software lists
- Use cases
- Industries
- Research
- Statistics
- Hubs

Use WordPress taxonomies for categories and relevant topic groupings. Store structured comparison/review data in registered post meta or a documented custom-table design; choose one approach after a small proof of concept. Do not make paid plugins or paid APIs a requirement.

## Source-to-WordPress field mapping

### Reviews
- `slug` -> post slug; preserve the existing public path `/reviews/{slug}`.
- `name` -> title; `tagline` and `description` -> editorial intro/summary.
- `website`, `pricing`, `priceRange`, `rating`, `reviewCount` -> registered structured fields.
- `pros`, `cons`, `features`, `ratings`, `faqs` -> structured data rendered by the theme.
- `content` -> review body, retaining headings, lists, tables, and links.
- `contentPublished`, `contentModified`, `author` -> publication/modification metadata and author relationship.
- `alternatives`, `relatedComparisons`, `relatedGuides`, `relatedPosts` -> validated internal relationships.

### Comparisons
- `slug` -> existing `/comparisons/{slug}` path.
- `title`, `description`, `category`, `tool1`, `tool2`, `winner` -> title, excerpt, taxonomy, and comparison fields.
- `features`, `verdict`, `faqs`, `lastUpdated`, `tool1Slug`, `tool2Slug`, `published` -> structured fields and rendered sections.
- Resolve tool references against imported review records; flag missing references instead of inventing replacements.

### Other collections
Create explicit mappings per schema for guides, blog, glossary, alternatives, best lists, use cases, industries, research, statistics, and hubs. Preserve each collection's sections, FAQs, related links, author, dates, and metadata where present. Do not flatten all JSON into unformatted body text.

## URL and SEO requirements

1. Preserve every valid existing public URL exactly wherever practical, including trailing-slash behavior.
2. Export a before-migration URL inventory from the current sitemap and a crawl of the live site.
3. Match each old URL to a WordPress URL. If a path genuinely changes, add a one-hop permanent 301 redirect to the closest equivalent page. Do not redirect unrelated pages to the homepage.
4. Preserve unique title and description, canonical URL, index/follow directives, Open Graph/Twitter metadata, language declaration, breadcrumbs, and appropriate structured data.
5. Generate a valid XML sitemap that includes only canonical, indexable, successful pages. Keep robots.txt accessible and verify it does not block CSS/JS or important content.
6. Preserve the AdSense publisher line in `/ads.txt` exactly and verify the production response after any eventual cutover.
7. Keep internal links, image alt text, author pages, privacy/terms/cookie pages, affiliate disclosures, and consent behavior working.
8. Do not blindly import `noindex-list.json` as a permanent SEO policy. Review its current purpose and each URL's intended state before migration.

## Importer requirements

Build a repeatable, idempotent importer that:
- Validates JSON against schemas before writing records.
- Uses the source slug as a stable unique key, so rerunning an import updates records instead of creating duplicates.
- Logs imported, updated, skipped, and failed records with reasons.
- Sanitizes HTML and URLs; never execute content as code.
- Imports in batches and can resume after interruption.
- Resolves relationships after primary records exist.
- Exports a CSV/JSON reconciliation report: source count, destination count, duplicate slugs, missing fields, unresolved relationships, and content hashes.
- Supports a dry-run mode and never deletes existing records by default.

## Read-only inventory helper

A first read-only helper is available at `scripts/wordpress-migration-inventory.mjs`. From the repository root, run `node scripts/wordpress-migration-inventory.mjs` to print a JSON report of content file counts/sizes, invalid JSON, invalid top-level records, missing key fields, duplicate slugs, and candidate path mappings. Candidate prefixes reflect known App Router route names where applicable; provenance metadata and unknown collections are not assigned public URLs. Unsafe slug syntax is flagged and does not receive a candidate URL. Candidate paths must still be reconciled against the generated sitemap and current routing behavior; the script does not import content or modify source files.

A fixture-based regression test is available at `scripts/test-wordpress-migration-inventory.mjs`. Run it from the repository root with `node scripts/test-wordpress-migration-inventory.mjs`. It creates temporary test fixtures and checks duplicate slugs, malformed JSON, non-object records, missing fields, provenance metadata, and unsafe path candidates, then removes the fixtures. Neither the inventory nor the regression test has been executed in a local checkout in this session; run both before relying on their output.

## Staging acceptance checklist

- [ ] Export and retain a read-only copy of source content and media.
- [ ] Confirm WordPress/PHP/database versions supported by the chosen host.
- [ ] Import a representative sample first: 10 reviews, 20 comparisons, 5 guides, 5 blog posts, and examples from each other collection.
- [ ] Compare rendered page content, tables, FAQs, metadata, schema, mobile layout, and internal links against the current site.
- [ ] Test Unicode, apostrophes, ampersands, long slugs, empty optional fields, and malformed source records.
- [ ] Crawl staging and confirm there are no accidental 404s, redirect loops, duplicate canonicals, or staging pages indexable by search engines.
- [ ] Validate sitemap XML, robots.txt, ads.txt, HTTPS, privacy/consent behavior, and affiliate disclosures.
- [ ] Test backups and restore a staging copy.
- [ ] Load-test representative pages and establish realistic resource limits before choosing a host.
- [ ] Keep staging noindex/password-protected; never let staging compete with production in search.
- [ ] Produce a final old-URL/new-URL diff and a rollback plan.
- [ ] Obtain explicit approval before changing DNS, merging migration code into the production branch, or switching the live domain.

## Cost and traffic guardrails

A WordPress codebase is free, but hosting, domain renewal, backups, email, and some migration work may cost money. Do not purchase a hosting plan until its upfront payment, renewal price, storage, database limits, CPU/RAM limits, backup policy, and traffic terms are clear. A low-cost shared plan must not be assumed capable of supporting extremely high traffic targets.

With a zero budget, use local development or an existing available staging environment for the proof of concept. Do not move DNS or cancel the current setup as a cost-saving experiment.

## Rollback plan

Keep the current production application, repository history, domain DNS values, and an export of content available until cutover has been verified. Record current DNS settings before any approved change. If the new site fails acceptance checks, do not cut over; if an approved cutover later fails, restore the recorded DNS configuration and revalidate HTTPS and key routes.

## Scope and current status

This is a migration assessment, not a completed migration. No WordPress instance has been provisioned; no source content has been imported; no production code, DNS, or deployment settings have been changed.
