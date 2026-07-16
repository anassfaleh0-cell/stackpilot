# StackPilot 🧭

Enterprise-grade B2B SaaS reviews platform. In-depth software reviews, expert comparisons, actionable guides, and free interactive tools to help businesses make confident software decisions.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 16.2.10 (Turbopack) |
| **Language** | TypeScript 5.x (strict mode) |
| **Styling** | Tailwind CSS v4 |
| **Fonts** | Geist (next/font) |
| **Icons** | Lucide React |
| **Image format** | AVIF + WebP via next/image |
| **Content** | JSON-driven registry (`content/`) |
| **Testing** | Vitest + Playwright |
| **PWA** | Manifest + Service Worker ready |

## Quick Start

```bash
# Install dependencies
npm install

# Development
npm run dev

# Production build
npm run build

# Production server
npm start

# Tests
npm test               # Unit tests
npm run test:e2e      # E2E tests (Playwright)

# Check all
npm run check:all     # Tests + build
```

## Architecture

```
deepsk/
├── content/            # JSON content files (scalable to 100K+ pages)
│   ├── reviews/
│   ├── comparisons/
│   ├── guides/
│   ├── glossary/
│   └── blog/
├── src/
│   ├── app/            # Next.js App Router pages
│   │   ├── api/        # API routes (contact, newsletter, search, revalidate)
│   │   └── [...slug]/  # Dynamic page templates
│   ├── components/
│   │   ├── content/    # Content-specific components (related-content)
│   │   ├── layout/     # Layout components (header, footer, nav)
│   │   ├── pages/      # Page-level client components (forms, search)
│   │   ├── seo/        # SEO components (breadcrumbs, JSON-LD)
│   │   └── ui/         # Design system (button, card, input, toast, etc.)
│   ├── lib/
│   │   ├── content/    # Content registry (reads JSON files)
│   │   ├── constants.ts
│   │   ├── metadata.ts # SEO metadata factory
│   │   ├── pagination.ts
│   │   ├── topics.ts   # Topic cluster taxonomy
│   │   └── utils.ts
│   ├── templates/       # Page templates (extensible)
│   ├── test/            # Unit tests (Vitest)
│   └── types/           # TypeScript declarations
├── e2e/                # E2E tests (Playwright)
├── public/             # Static assets
└── vitest.config.ts
```

## Content System

Content is stored as JSON files in `content/`. Adding a new page is as simple as adding a new JSON file:

```json
// content/reviews/my-tool.json
{
  "slug": "my-tool",
  "name": "My Tool",
  "category": "Productivity",
  "rating": 4.5,
  // ... full ReviewContent type
}
```

The content registry (`src/lib/content/registry.ts`) auto-discovers files and provides typed accessor functions like `getReview()`, `getAllReviews()`, etc.

### Content Types

| Type | Directory | Template | Registry Function |
|------|-----------|----------|------------------|
| Review | `content/reviews/` | `reviews/[slug]/page.tsx` | `getReview()` / `getAllReviews()` |
| Comparison | `content/comparisons/` | `comparisons/[slug]/page.tsx` | `getComparison()` / `getAllComparisons()` |
| Guide | `content/guides/` | `guides/[slug]/page.tsx` | `getGuide()` / `getAllGuides()` |
| Glossary | `content/glossary/` | `glossary/[slug]/page.tsx` | `getGlossaryTerm()` / `getAllGlossaryTerms()` |
| Blog | `content/blog/` | `blog/[slug]/page.tsx` | `getBlogPost()` / `getAllBlogPosts()` |

## Design System

Components in `src/components/ui/` form the design system:

- **Button** — variants: default, secondary, ghost, danger; sizes: sm, lg
- **Card** — with CardTitle, CardDescription sub-components
- **Badge** — variants: default, secondary, success, warning, danger
- **Input** — with label, error, ARIA support
- **Textarea** — with label, error, ARIA support
- **Select** — with label, error, options
- **Container / Section / SectionHeader** — layout primitives
- **Pagination** — accessible pagination with page numbers
- **EmptyState** — empty/not-found state component
- **Skeleton** — loading skeleton (CardSkeleton, ReviewListSkeleton, PageSkeleton)
- **Toast** — notification system (ToastProvider + useToast hook)

### Styling Patterns

- `cn()` utility (clsx + tailwind-merge) for class merging
- CSS variables for theming (light/dark via `prefers-color-scheme`)
- `gradient-text` class for gradient headings
- `animate-fade-in` / `animate-skeleton` for motion
- `prefers-reduced-motion` respected globally

## SEO & Accessibility

- Metadata factory (`createMetadata()`) for consistent OpenGraph/Twitter
- Structured data: Organization, Website, BreadcrumbList, Article, FAQ, HowTo, SoftwareApplication
- Dynamic XML sitemap (50+ entries)
- RSS feed (auto-generated from content registry)
- robots.txt (disallows /api/, /admin/, /_next/, /search)
- WCAG 2.2 AA: skip-to-content link, ARIA landmarks, aria-current, focus management, keyboard nav
- Semantic HTML throughout
- Viewport and color-scheme meta tags

## API Endpoints

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/contact` | POST | Contact form with validation + rate limiting |
| `/api/newsletter` | POST | Email subscription with validation + rate limiting |
| `/api/search` | GET | Content search across all types |
| `/api/revalidate` | POST | ISR revalidation webhook |

## Performance Optimizations

- `next/font` with `display:swap`, subsets, preload
- AVIF/WebP image formats
- `sharp` for production image optimization
- Security headers (CSP, HSTS, XFO, etc.)
- `output: "standalone"` for optimized Docker deployments
- Static page generation (SSG) for all content pages
- Compressed responses (Brotli/GZip)
- Immutable caching for static assets
- Lazy loading for non-critical components

## Testing Strategy

```bash
# Unit tests
npm test              # Vitest — 10 tests covering utils + content registry

# E2E tests (requires build + running server)
npm run test:e2e      # Playwright — 20+ tests across pages, a11y, SEO, forms, 404s, navigation

# Link validation (requires running server)
npm run check:links   # Linkinator — validates all internal and external links
```

## Security

- Content Security Policy (CSP) restricts scripts, styles, fonts, and connections
- HSTS with preload (63072000s)
- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- Permissions-Policy restricts camera, microphone, geolocation
- Input sanitization on all API routes
- Rate limiting on contact and newsletter endpoints
- IP masking in logs
- No secrets in codebase

## Deployment

### Docker

```dockerfile
FROM node:22-alpine AS runner
WORKDIR /app
COPY .next/standalone ./
COPY public ./public
EXPOSE 3000
ENV NODE_ENV=production
CMD ["node", "server.js"]
```

### Environment Variables

None required for basic operation. Add for analytics, monitoring, and external services as needed.

## Contributing

1. Add content by creating JSON files in `content/`
2. Add components in `src/components/ui/` following existing patterns
3. Add API routes in `src/app/api/`
4. Run `npm run check:all` before submitting changes
5. Ensure all tests pass and build succeeds

## License

Private — All rights reserved.
