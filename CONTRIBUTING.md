# Contributing to StackPilot

## Adding Content

The easiest way to contribute is by adding content files.

### Add a Review

Create `content/reviews/{slug}.json` following the `ReviewContent` type:

```json
{
  "slug": "my-tool",
  "name": "My Tool",
  "tagline": "Short description",
  "description": "Long description",
  "category": "Productivity",
  "website": "https://example.com",
  "pricing": "Freemium",
  "rating": 4.5,
  "reviewCount": 100,
  "pros": ["...", "..."],
  "cons": ["...", "..."],
  "features": [
    {"name": "Feature", "description": "...", "available": true, "category": "Core"}
  ],
  "ratings": [
    {"label": "Features", "score": 4.5}
  ],
  "content": [
    {"title": "Overview", "body": "...", "type": "text"}
  ],
  "faqs": [
    {"question": "...", "answer": "..."}
  ],
  "alternatives": ["tool-slug-1", "tool-slug-2"],
  "relatedGuides": ["guide-slug-1"],
  "lastReviewed": "2026-07-01",
  "author": "StackPilot Team"
}
```

### Add a Comparison, Guide, Glossary Term, or Blog Post

Create the corresponding JSON file in `content/comparisons/`, `content/guides/`, `content/glossary/`, or `content/blog/`. Use the nearest existing file as a template.

### Run validation

```bash
npm run build         # Will catch TypeScript errors
npm test              # Will validate content registry reads
```

## Adding Components

1. Create the component in `src/components/ui/` (design system), `src/components/content/` (content-specific), or `src/components/layout/`
2. Use `cn()` for class merging
3. Use CSS variables for colors (`var(--background)`, `var(--foreground)`, etc.)
4. Support dark mode via `prefers-color-scheme`
5. Include ARIA attributes for accessibility
6. Export from the component file directly

## Adding API Routes

1. Create `src/app/api/{name}/route.ts`
2. Use standard `Request` / `Response` Web APIs (not `NextRequest`/`NextResponse`)
3. Add input validation and sanitization
4. Add rate limiting for form submissions
5. Return appropriate HTTP status codes

## Code Standards

- TypeScript strict mode — no `any`, no `// @ts-ignore`
- No placeholder text or Lorem Ipsum
- No inline styles — use Tailwind classes or CSS variables
- Semantic HTML — use `<nav>`, `<main>`, `<article>`, `<section>`, `<aside>`, `<header>`, `<footer>`
- All interactive elements must be keyboard accessible
- All images must have descriptive `alt` text
- Forms must have labeled inputs (`htmlFor`/`id`)
- No hardcoded text that should come from content

## Pull Request Checklist

Before submitting:
- [ ] `npm run check:all` passes (build + tests)
- [ ] No new TypeScript errors
- [ ] No broken links
- [ ] Content is original, accurate, and helpful
- [ ] Accessibility verified (keyboard nav, screen reader)
- [ ] Responsive design verified (mobile, tablet, desktop)
- [ ] Dark mode renders correctly

## Development Workflow

```bash
# Start development server
npm run dev

# Run unit tests (fast)
npm test

# Run E2E tests (requires build)
npm run build
npm run test:e2e

# Full validation
npm run check:all
```
