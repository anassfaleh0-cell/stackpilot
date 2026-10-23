import { Container } from "@/components/ui/container"
import { Breadcrumbs } from "@/components/seo/breadcrumbs"
import { BreadcrumbSchema, WebPageSchema } from "@/components/seo/json-ld"
import { site, categories, toolPages, editorialLinks } from "@/lib/constants"
import { PUBLIC_AUTHOR_SLUGS } from "@/lib/authors"
import { createMetadata } from "@/lib/metadata"
import { getAllReviews, getAllComparisons, getAllGuides, getAllBest, getAllAlternatives, getAllUseCases, getAllIndustries, getAllHubs, getAllBlogPosts, getAllResearch, getResearch, getAllStatistics, getAllGlossaryTerms } from "@/lib/content/registry"
import { isNoindexed } from "@/lib/noindex"
import { isRetiredComparisonSlug } from "@/lib/sitemap/retired-comparisons"
import { REDIRECTED_ALTERNATIVE_SLUGS, REDIRECTED_BEST_SLUGS } from "@/lib/sitemap/redirected-content"
import Link from "next/link"

export const metadata = createMetadata({
  title: "HTML Sitemap — Public Content Directory",
  description: "Browse PilotStack’s public software content, tool pages, author profiles, and editorial resources.",
  path: "/sitemap-html",
})

function isPublished<T extends { slug: string }>(record: T): boolean {
  return (record as T & { publicationStatus?: string }).publicationStatus !== "draft"
}

export default function SitemapPage() {
  const reviews = getAllReviews().filter(r => isPublished(r) && !isNoindexed("reviews", r.slug))
  const comparisons = getAllComparisons().filter(c => isPublished(c) && !isRetiredComparisonSlug(c.slug) && !isNoindexed("comparisons", c.slug))
  const guides = getAllGuides().filter(g => isPublished(g) && !isNoindexed("guides", g.slug))
  const best = getAllBest().filter(b => isPublished(b) && !REDIRECTED_BEST_SLUGS.has(b.slug))
  const alternatives = getAllAlternatives().filter(a => isPublished(a) && !REDIRECTED_ALTERNATIVE_SLUGS.has(a.slug))
  const useCases = getAllUseCases().filter(isPublished)
  const industries = getAllIndustries().filter(isPublished)
  const hubs = getAllHubs().filter(isPublished)
  const blog = getAllBlogPosts().filter(isPublished)
  const research = getAllResearch().filter(isPublished)
  // Keep the source-audited pricing benchmark discoverable even if the bulk research
  // registry omits it during normalization; the XML sitemap carries the same fallback.
  const pricingBenchmark = getResearch("saas-pricing-benchmark-2026")
  if (pricingBenchmark && isPublished(pricingBenchmark) && !research.some((item) => item.slug === pricingBenchmark.slug)) {
    research.push(pricingBenchmark)
  }
  const statistics = getAllStatistics().filter(isPublished)
  const glossary = getAllGlossaryTerms().filter(g => isPublished(g) && !isNoindexed("glossary", g.slug))

  return (
    <>
      <BreadcrumbSchema items={[{ name: "Home", href: "/" }, { name: "Sitemap", href: "/sitemap-html" }]} />
      <WebPageSchema name="HTML Sitemap — Public Content Directory" description="Browse public reviews, comparisons, guides, glossary entries, tool pages, author profiles, and editorial resources on PilotStack." url={`${site.url}/sitemap-html`} />
      <Container className="pt-8">
        <Breadcrumbs items={[{ name: "Sitemap" }]} />
      </Container>
      <article className="pb-16">
        <Container>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Sitemap</h1>
          <p className="text-muted-foreground mb-10">Browse published reviews, comparisons, guides, glossary entries, tool pages, author profiles, and editorial resources on PilotStack.</p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <Section title={`Reviews (${reviews.length})`}>
              <Link href="/reviews" className="text-sm text-primary hover:underline block mb-2">All Reviews</Link>
              {reviews.map(r => (
                <Link key={r.slug} href={`/reviews/${r.slug}`} className="block text-sm text-muted-foreground hover:text-primary transition-colors py-0.5">{r.name}</Link>
              ))}
            </Section>

            <Section title={`Comparisons (${comparisons.length})`}>
              <Link href="/comparisons" className="text-sm text-primary hover:underline block mb-2">All Comparisons</Link>
              {comparisons.map(c => (
                <Link key={c.slug} href={`/comparisons/${c.slug}`} className="block text-sm text-muted-foreground hover:text-primary transition-colors py-0.5">{c.title}</Link>
              ))}
            </Section>

            <Section title={`Glossary (${glossary.length})`}>
              <Link href="/glossary" className="text-sm text-primary hover:underline block mb-2">All Glossary Terms</Link>
              {glossary.map(g => (
                <Link key={g.slug} href={`/glossary/${g.slug}`} className="block text-sm text-muted-foreground hover:text-primary transition-colors py-0.5">{g.term}</Link>
              ))}
            </Section>

            <Section title={`Tools & Calculators (${toolPages.length})`}>
              <Link href="/tools" className="text-sm text-primary hover:underline block mb-2">All Tools</Link>
              {toolPages.map(tool => (
                <Link key={tool.slug} href={`/tools/${tool.slug}`} className="block text-sm text-muted-foreground hover:text-primary transition-colors py-0.5">{tool.name}</Link>
              ))}
            </Section>

            <Section title={`Authors (${PUBLIC_AUTHOR_SLUGS.length})`}>
              <Link href="/authors" className="text-sm text-primary hover:underline block mb-2">All Authors</Link>
              {PUBLIC_AUTHOR_SLUGS.map(slug => (
                <Link key={slug} href={`/authors/${slug}`} className="block text-sm text-muted-foreground hover:text-primary transition-colors py-0.5">{String(slug) === "pilotstack-team" ? "PilotStack Team" : String(slug).replace(/-/g, " ")}</Link>
              ))}
            </Section>

            <Section title={`Best Software (${best.length})`}>
              <Link href="/best" className="text-sm text-primary hover:underline block mb-2">All Best Software</Link>
              {best.map(b => (
                <Link key={b.slug} href={`/best/${b.slug}`} className="block text-sm text-muted-foreground hover:text-primary transition-colors py-0.5">{b.title}</Link>
              ))}
            </Section>

            <Section title={`Guides (${guides.length})`}>
              <Link href="/guides" className="text-sm text-primary hover:underline block mb-2">All Guides</Link>
              {guides.map(g => (
                <Link key={g.slug} href={`/guides/${g.slug}`} className="block text-sm text-muted-foreground hover:text-primary transition-colors py-0.5">{g.title}</Link>
              ))}
            </Section>

            <Section title={`Alternatives (${alternatives.length})`}>
              <Link href="/alternatives" className="text-sm text-primary hover:underline block mb-2">All Alternatives</Link>
              {alternatives.map(a => (
                <Link key={a.slug} href={`/alternatives/${a.slug}`} className="block text-sm text-muted-foreground hover:text-primary transition-colors py-0.5">{a.title}</Link>
              ))}
            </Section>

            <Section title={`Use Cases (${useCases.length})`}>
              <Link href="/use-cases" className="text-sm text-primary hover:underline block mb-2">All Use Cases</Link>
              {useCases.map(u => (
                <Link key={u.slug} href={`/use-cases/${u.slug}`} className="block text-sm text-muted-foreground hover:text-primary transition-colors py-0.5">{u.title}</Link>
              ))}
            </Section>

            <Section title={`Industries (${industries.length})`}>
              <Link href="/industries" className="text-sm text-primary hover:underline block mb-2">All Industries</Link>
              {industries.map(i => (
                <Link key={i.slug} href={`/industries/${i.slug}`} className="block text-sm text-muted-foreground hover:text-primary transition-colors py-0.5">{i.title}</Link>
              ))}
            </Section>

            <Section title={`By Business Type (${hubs.length})`}>
              <Link href="/hubs" className="text-sm text-primary hover:underline block mb-2">All Hubs</Link>
              {hubs.map(h => (
                <Link key={h.slug} href={`/hubs/${h.slug}`} className="block text-sm text-muted-foreground hover:text-primary transition-colors py-0.5">{h.title}</Link>
              ))}
            </Section>

            <Section title={`Research & Blog (${blog.length + research.length})`}>
              <Link href="/blog" className="text-sm text-primary hover:underline block mb-2">All Blog Posts</Link>
              {blog.map(b => (
                <Link key={b.slug} href={`/blog/${b.slug}`} className="block text-sm text-muted-foreground hover:text-primary transition-colors py-0.5">{b.title}</Link>
              ))}
              <Link href="/research" className="text-sm text-primary hover:underline block mb-2 mt-4">Research Reports</Link>
              {research.map(r => (
                <Link key={r.slug} href={`/research/${r.slug}`} className="block text-sm text-muted-foreground hover:text-primary transition-colors py-0.5">{r.title}</Link>
              ))}
            </Section>

            <Section title={`Statistics (${statistics.length})`}>
              <Link href="/statistics" className="text-sm text-primary hover:underline block mb-2">All Statistics</Link>
              {statistics.map(s => (
                <Link key={s.slug} href={`/statistics/${s.slug}`} className="block text-sm text-muted-foreground hover:text-primary transition-colors py-0.5">{s.title}</Link>
              ))}
            </Section>
          </div>

          <Section title={`Categories (${categories.length})`}>
            <div className="flex flex-wrap gap-2">
              {categories.map(c => (
                <Link key={c.slug} href={`/category/${c.slug}`} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-border text-xs text-muted-foreground hover:text-primary hover:border-primary/30 transition-colors">{c.name}</Link>
              ))}
            </div>
          </Section>

          <Section title="Key Pages">
            <div className="flex flex-wrap gap-2">
              <Link href="/" className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-border text-xs text-muted-foreground hover:text-primary transition-colors">Home</Link>
              <Link href="/about" className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-border text-xs text-muted-foreground hover:text-primary transition-colors">About</Link>
              <Link href="/methodology" className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-border text-xs text-muted-foreground hover:text-primary transition-colors">Methodology</Link>
              <Link href="/team" className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-border text-xs text-muted-foreground hover:text-primary transition-colors">Team</Link>
              <Link href="/contact" className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-border text-xs text-muted-foreground hover:text-primary transition-colors">Contact</Link>
              <Link href="/privacy" className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-border text-xs text-muted-foreground hover:text-primary transition-colors">Privacy</Link>
              <Link href="/cookies" className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-border text-xs text-muted-foreground hover:text-primary transition-colors">Cookies</Link>
              <Link href="/terms" className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-border text-xs text-muted-foreground hover:text-primary transition-colors">Terms</Link>
              <Link href="/editorial-policy" className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-border text-xs text-muted-foreground hover:text-primary transition-colors">Editorial Policy</Link>
              <Link href="/affiliate-disclosure" className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-border text-xs text-muted-foreground hover:text-primary transition-colors">Affiliate Disclosure</Link>
              <Link href="/how-we-test-software" className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-border text-xs text-muted-foreground hover:text-primary transition-colors">How We Score</Link>
              <Link href="/brand-assets" className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-border text-xs text-muted-foreground hover:text-primary transition-colors">Brand Assets</Link>
              <Link href="/media-kit" className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-border text-xs text-muted-foreground hover:text-primary transition-colors">Media Kit</Link>
              <Link href="/press" className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-border text-xs text-muted-foreground hover:text-primary transition-colors">Press</Link>
              <Link href="/statistics" className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-border text-xs text-muted-foreground hover:text-primary transition-colors">Statistics</Link>
              <Link href="/research" className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-border text-xs text-muted-foreground hover:text-primary transition-colors">Research</Link>
              <Link href="/sitemap-html" className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-border text-xs text-muted-foreground hover:text-primary transition-colors">HTML Sitemap</Link>
            </div>
          </Section>
          <Section title={`Editorial Resources (${editorialLinks.length})`}>
            <div className="flex flex-wrap gap-2">
              {editorialLinks.map(link => (
                <Link key={link.href} href={link.href} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-border text-xs text-muted-foreground hover:text-primary transition-colors">{link.label}</Link>
              ))}
            </div>
          </Section>
        </Container>
      </article>
    </>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-base font-bold mb-3 border-b border-border pb-1.5">{title}</h2>
      {children}
    </div>
  )
}
