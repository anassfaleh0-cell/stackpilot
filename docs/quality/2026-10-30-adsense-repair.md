# AdSense rejection repair — 30 October 2026

The owner reports an AdSense rejection. The rejection notice was not supplied, so its official reason is unknown. This change does not certify AdSense approval or index recovery.

## Confirmed blockers

- The default branch did not build: the external-link regular expression in `rich-text.tsx` contained doubled escapes. The same parse error prevented route and rendering suites from loading.
- GitHub quality-gate run 40983630196 failed its unit-test step. The dependent Cloudflare production workflow skipped deployment. Source commits therefore cannot be treated as proof of a live update.
- The comparison display guard interpreted negated “overall winner” disclosures as positive unsupported claims, replacing product-specific decisions with generic copy.
- Review related-comparison lists could recommend unrelated products based only on a shared catalog category.

## Repairs

Correct the link parser, retain narrowly negated winner disclosures while rejecting actual unsupported endorsements, keep product-specific cross-category context, and prioritize a comparison's own curated links. Review comparison recommendations must include the reviewed product and match product categories.

Add dated vendor-documentation evidence to Linear, Asana, ClickUp and Asana vs ClickUp. Source notes are separate from legacy score verification and identify documentation-only scope. Numerical ratings remain provisional. The comparison now provides explicit use-case recommendations.

Update outdated assertions that demanded generic industry titles or rejected a negated winner statement. Preserve tests for unsupported numeric claims, malformed markup, evidence status, routing and relevance. Complete the typed comparison fixture rather than suppressing TypeScript checks.

## Remaining editorial work

The repository risk audit flags 151 review ratings awaiting evidence, 64 reviews without score provenance and 193 best-list pages needing long-form review. These are source-level triage counts, not a verified count of violations visible to visitors. A passing technical gate is not a substitute for editorial assessment.

Prioritize actual source-backed buyer information, documented score calculations and distinct product-specific conclusions. Do not invent hands-on tests, numeric ratings, prices or authors. Obtain the actual rejection notice before attributing rejection to a specific policy.

## Sources checked

- https://linear.app/pricing
- https://asana.com/pricing
- https://clickup.com/pricing

Retrieved 30 October 2026. Vendor documentation supports the bounded plan facts in the new panels; buying implications are editorial analysis. Recheck changing terms before purchase.
