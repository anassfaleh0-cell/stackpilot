import { Container } from "@/components/ui/container"
import { Breadcrumbs } from "@/components/seo/breadcrumbs"
import { BreadcrumbSchema, OrganizationSchema, WebPageSchema } from "@/components/seo/json-ld"
import { site, categories } from "@/lib/constants"
import { createMetadata } from "@/lib/metadata"
import { getAllReviews, getAllComparisons, getAllGuides, getAllBest, getAllAlternatives, getAllUseCases, getAllIndustries, getAllHubs, getAllBlogPosts } from "@/lib/content/registry"
import Link from "next/link"

export const metadata = createMetadata({
  title: "Sitemap — All Pages",
  description: "Complete sitemap of all pages on PilotStack. Browse reviews, comparisons, guides, best software picks, alternatives, and more.",
  path: "/sitemap-html",
})

export default function SitemapPage() {
  const reviews = getAllReviews()
  const comparisons = getAllComparisons()
  const guides = getAllGuides()
  const best = getAllBest()
  const alternatives = getAllAlternatives()
  const useCases = getAllUseCases()
  const industries = getAllIndustries()
  const hubs = getAllHubs()
  const blog = getAllBlogPosts()

  return (
    <>
      <BreadcrumbSchema items={[{ name: "Home", href: "/" }, { name: "Sitemap", href: "/sitemap-html" }]} />
      <OrganizationSchema />
      <WebPageSchema name="Sitemap — All Pages" description="Complete sitemap of all pages on PilotStack." url={`${site.url}/sitemap-html`} />
      <Container className="pt-8">
        <Breadcrumbs items={[{ name: "Sitemap" }]} />
      </Container>
      <article className="pb-16">
        <Container>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Sitemap</h1>
          <p className="text-muted-foreground mb-10">Browse all {reviews.length + comparisons.length + guides.length + best.length + alternatives.length + useCases.length + industries.length + hubs.length + blog.length + categories.length + 30}+ pages on PilotStack.</p>

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

            <Section title={`Research & Blog (${blog.length})`}>
              <Link href="/blog" className="text-sm text-primary hover:underline block mb-2">All Research</Link>
              {blog.map(b => (
                <Link key={b.slug} href={`/blog/${b.slug}`} className="block text-sm text-muted-foreground hover:text-primary transition-colors py-0.5">{b.title}</Link>
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
              <Link href="/terms" className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-border text-xs text-muted-foreground hover:text-primary transition-colors">Terms</Link>
              <Link href="/editorial-policy" className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-border text-xs text-muted-foreground hover:text-primary transition-colors">Editorial Policy</Link>
              <Link href="/affiliate-disclosure" className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-border text-xs text-muted-foreground hover:text-primary transition-colors">Affiliate Disclosure</Link>
              <Link href="/how-we-test-software" className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-border text-xs text-muted-foreground hover:text-primary transition-colors">How We Test</Link>
              <Link href="/brand-assets" className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-border text-xs text-muted-foreground hover:text-primary transition-colors">Brand Assets</Link>
              <Link href="/media-kit" className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-border text-xs text-muted-foreground hover:text-primary transition-colors">Media Kit</Link>
              <Link href="/press" className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-border text-xs text-muted-foreground hover:text-primary transition-colors">Press</Link>
              <Link href="/statistics" className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-border text-xs text-muted-foreground hover:text-primary transition-colors">Statistics</Link>
              <Link href="/research" className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-border text-xs text-muted-foreground hover:text-primary transition-colors">Research</Link>
              <Link href="/dashboard" className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-border text-xs text-muted-foreground hover:text-primary transition-colors">Dashboard</Link>
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
