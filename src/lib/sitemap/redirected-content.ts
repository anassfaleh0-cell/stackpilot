/**
 * Content URLs intentionally consolidated by permanent redirects.
 * These source URLs must not appear in the XML sitemap because their canonical
 * destination is a different, existing page.
 */
export const REDIRECTED_ALTERNATIVE_SLUGS = new Set([
  "grammarly-alternatives",
])

export const REDIRECTED_BEST_SLUGS = new Set([
  "best-productivity-startups",
  "project-management-software",
  // Permanent legacy aliases: preserve redirects but never advertise old
  // URLs as indexable canonical pages in the XML sitemap or prerender list.
  "best-crm-sales-small-business",
  "best-enterprise-analytics",
  "best-project-management-small-business",
])

export const REDIRECTED_GUIDE_SLUGS = new Set([
  "best-seo-for-agencies",
  "software-evaluation-playbook-2026",
  "software-evaluation-playbook",
])

export const REDIRECTED_REVIEW_SLUGS = new Set([
  "calndly",
  "acuity-scheduling",
  "affinity-designer",
  "quickbooks-self-employed",
  "slack-huddles",
])
