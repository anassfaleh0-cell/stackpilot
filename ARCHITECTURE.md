# Architecture Decision Records

## ADR-001: JSON-based Content Registry

**Status**: Accepted  
**Date**: 2026-07-16

### Context
The platform needs to scale from 60 pages to 100K+ pages. Hardcoded data in component files doesn't scale.

### Decision
Store all content as individual JSON files in `content/` directory organized by content type. A registry module (`src/lib/content/registry.ts`) reads these files and provides typed accessors.

### Consequences
- **Positive**: Adding a new review = adding one JSON file. No code changes required.
- **Positive**: Content can be generated, imported, or migrated independently of the application code.
- **Positive**: TypeScript provides full type safety for content structures.
- **Negative**: Requires filesystem access (SSG generates all pages at build time).
- **Negative**: Not suitable for real-time content updates without rebuild (use ISR + revalidation API for that).

### Future Considerations
- Category pages could be auto-generated from content metadata instead of constants.
- Pagination is required once content exceeds ~50 items per listing.

---

## ADR-002: Static Site Generation with ISR

**Status**: Accepted  
**Date**: 2026-07-16

### Context
Content pages need fast load times and SEO benefits. Dynamic server rendering adds latency.

### Decision
Use `generateStaticParams()` + SSG for all content pages. Provide `/api/revalidate` for on-demand revalidation when content changes.

### Consequences
- **Positive**: All content pages are pre-rendered to static HTML at build time.
- **Positive**: Near-instant page loads and optimal Core Web Vitals.
- **Positive**: Full SEO crawlability.
- **Negative**: Content updates require either a rebuild or an ISR revalidation call.
- **Negative**: Build time increases linearly with content volume.

---

## ADR-003: CSS Variables for Theming

**Status**: Accepted  
**Date**: 2026-07-16

### Context
The platform needs light and dark mode support without a client-side JavaScript toggle. Tailwind CSS v4 is the styling framework.

### Decision
Use CSS custom properties for all theme colors. Dark mode is activated via `@media (prefers-color-scheme: dark)`. No manual theme toggle for MVP (avoids flash-of-wrong-theme and JS overhead).

### Consequences
- **Positive**: Zero JavaScript for theme switching.
- **Positive**: Respects OS-level accessibility preferences.
- **Positive**: Works immediately, no flash.
- **Negative**: Users cannot manually override their theme preference.
- **Negative**: Dark mode cannot be toggled within a session.

---

## ADR-004: Component Design System

**Status**: Accepted  
**Date**: 2026-07-16

### Context
UI consistency requires a shared component library rather than ad-hoc styling.

### Decision
Build a minimal design system in `src/components/ui/` with composable primitives (Button, Card, Input, Badge, etc.) using `cn()` utility, CSS variables, and Tailwind classes. No external component library dependency.

### Consequences
- **Positive**: Full control over component behavior and styling.
- **Positive**: No external dependency risk.
- **Positive**: Components are lightweight and tree-shakeable.
- **Negative**: Requires ongoing maintenance as the system grows.

---

## ADR-005: API Routes over Server Actions

**Status**: Accepted  
**Date**: 2026-07-16

### Context
Forms and dynamic data need server-side processing. Next.js 16 supports both API routes and Server Actions.

### Decision
Use standard Web API Routes (`Request`/`Response`) rather than Server Actions. Avoids `next/server` import issues with Next.js 16 and keeps the API layer framework-agnostic.

### Consequences
- **Positive**: Compatible with Next.js 16 type constraints.
- **Positive**: API routes are portable to other frameworks.
- **Positive**: Simple, well-understood pattern.
- **Negative**: Less integrated than Server Actions (no progressive enhancement built-in).

---

## ADR-006: Topic Clusters for SEO

**Status**: Accepted  
**Date**: 2026-07-16

### Context
SEO requires topical authority through interconnected content clusters rather than isolated pages.

### Decision
Build a topic taxonomy system (`src/lib/topics.ts`) that assigns content to topics with weights. Topics support parent-child hierarchy for sub-topic clustering.

### Consequences
- **Positive**: Enables automated related content recommendations.
- **Positive**: Supports topic cluster pillar/cluster SEO strategy.
- **Positive**: Reduces orphan pages through automatic internal linking.
- **Negative**: Requires manual topic assignment for each content item.
- **Negative**: Taxonomy needs periodic review and maintenance.

---

## ADR-007: No External SEO Plugin

**Status**: Accepted  
**Date**: 2026-07-16

### Context
The project previously included `next-sitemap`. Next.js 16 provides built-in sitemap, robots.txt, and manifest generation.

### Decision
Remove `next-sitemap` dependency. Use Next.js built-in `sitemap.ts`, `robots.ts`, and `manifest.ts`. Implement structured data via custom JSON-LD components.

### Consequences
- **Positive**: One fewer dependency to maintain.
- **Positive**: Full control over sitemap generation (dynamic content from registry).
- **Positive**: No version conflicts with Next.js releases.
- **Negative**: More code to maintain internally.

---

## ADR-008: Testing Strategy

**Status**: Accepted  
**Date**: 2026-07-16

### Context
The platform needs automated testing to prevent regressions as content and code scale.

### Decision
Three-tier testing:
1. **Unit tests** (Vitest): Test utilities, content registry, pagination logic
2. **E2E tests** (Playwright): Test page rendering, navigation, forms, a11y, SEO
3. **Link validation** (Linkinator): Check for broken links across all pages

### Consequences
- **Positive**: Comprehensive coverage across all risk levels.
- **Positive**: Fast unit tests for rapid feedback.
- **Positive**: E2E tests catch integration issues.
- **Negative**: E2E tests require build + server (slower feedback loop).
