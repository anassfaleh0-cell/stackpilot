import { Container, Section } from "@/components/ui/container"
import { Badge } from "@/components/ui/badge"
import { Card, CardTitle, CardDescription } from "@/components/ui/card"
import { Breadcrumbs } from "@/components/seo/breadcrumbs"
import { BreadcrumbSchema, CollectionPageSchema, ItemListSchema } from "@/components/seo/json-ld"
import { createMetadata } from "@/lib/metadata"
import { site, categories } from "@/lib/constants"
import { getAllReviews, getAllGuides, getAllComparisons, getAllBlogPosts } from "@/lib/content/registry"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Star, ArrowRight, BookOpen, GitCompare, FileText } from "lucide-react"
import { BrandPattern, BrandDivider } from "@/components/brand/patterns"

export async function generateStaticParams() {
  return categories.map((cat) => ({ slug: cat.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const category = categories.find((c) => c.slug === slug)
  if (!category) return {}
  return createMetadata({
    title: `Best ${category.name} Software`,
    description: `Discover the best ${category.name.toLowerCase()} software tools. Expert reviews, comparisons, and buying guides to help you choose the right solution.`,
    path: `/category/${slug}`,
  })
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const category = categories.find((c) => c.slug === slug)
  if (!category) notFound()

  const reviews = getAllReviews().filter((r) => r.category === category.name)
  const guides = getAllGuides().filter((g) => g.category === category.name)
  const comparisons = getAllComparisons().filter((c) => c.category === category.name)
  const posts = getAllBlogPosts().filter((p) => p.category === category.name)
  const bestPick = reviews.sort((a, b) => b.rating - a.rating)[0]

  return (
    <>
      <CollectionPageSchema name={category.name} description={`Best ${category.name.toLowerCase()} software tools`} url={`${site.url}/category/${category.slug}`} />
      {reviews.length > 0 && <ItemListSchema items={reviews.map(r => ({ name: r.name, url: `${site.url}/reviews/${r.slug}` }))} />}
      <BreadcrumbSchema items={[{ name: "Home", href: "/" }, { name: category.name, href: `/category/${slug}` }]} />
      <Container className="pt-8">
        <Breadcrumbs items={[{ name: "Reviews", href: "/reviews" }, { name: category.name }]} />
      </Container>

      <section className="relative overflow-hidden border-b border-border">
        <BrandPattern variant="grid" opacity={0.25} className="text-primary" />
        <Container className="relative py-16 sm:py-20">
          <Badge variant="default" className="mb-4">{category.count} Tools</Badge>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">Best {category.name} Software</h1>
          <p className="text-lg text-muted-foreground max-w-2xl text-pretty">
            Our expert picks for the best {category.name.toLowerCase()} tools. Each reviewed and rated by our team.
          </p>
        </Container>
      </section>

      {bestPick && (
        <Section>
          <Container>
            <div className="rounded-xl border border-primary/20 bg-primary-subtle/50 p-6 sm:p-8">
              <Badge variant="default" className="mb-3">Best in {category.name}</Badge>
              <h2 className="text-2xl font-bold mb-2">{bestPick.name}</h2>
              <p className="text-muted-foreground mb-4">{bestPick.tagline}</p>
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <span className="flex items-center gap-1"><Star size={14} className="fill-accent text-accent" /> {bestPick.rating}/5</span>
                {bestPick.priceRange && <span className="text-muted-foreground">{bestPick.priceRange}</span>}
                <span className="text-muted-foreground">{bestPick.pricing}</span>
              </div>
              <Link href={`/reviews/${bestPick.slug}`} className="inline-flex items-center gap-1 mt-4 text-sm font-medium text-primary hover:underline">
                Read full review <ArrowRight size={12} />
              </Link>
            </div>
          </Container>
        </Section>
      )}

      <Section>
        <Container>
          {reviews.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {reviews.filter(r => r.slug !== bestPick?.slug).map((tool, i) => (
                <Link key={tool.slug} href={`/reviews/${tool.slug}`} className="group card-hover" style={{ animationDelay: `${i * 40}ms` }}>
                  <Card className="h-full flex flex-col">
                    <div className="flex items-start justify-between mb-3">
                      <Badge variant="secondary">{tool.category}</Badge>
                      <div className="flex items-center gap-1 text-sm font-medium text-accent">
                        <Star size={14} className="fill-accent text-accent" />
                        {tool.rating}
                      </div>
                    </div>
                    <CardTitle className="group-hover:text-primary transition-colors">{tool.name}</CardTitle>
                    <CardDescription className="mt-1.5">{tool.tagline}</CardDescription>
                    {tool.priceRange && <p className="text-xs text-muted-foreground mt-2">{tool.priceRange}</p>}
                    <div className="mt-4 pt-4 border-t border-border flex items-center gap-1 text-xs font-medium text-muted-foreground group-hover:text-primary transition-colors mt-auto">
                      Read review <ArrowRight size={12} className="transition-transform group-hover:translate-x-0.5" />
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-muted-foreground">No reviews yet in this category. Check back soon.</p>
            </div>
          )}
        </Container>
      </Section>

      {guides.length > 0 && (
        <Section>
          <Container>
            <h2 className="text-2xl font-bold mb-6">{category.name} Buying Guides</h2>
            <div className="grid sm:grid-cols-2 gap-6">
              {guides.map(g => (
                <Link key={g.slug} href={`/guides/${g.slug}`} className="group card-hover">
                  <Card className="h-full"><CardTitle className="text-sm group-hover:text-primary transition-colors">{g.title}</CardTitle><CardDescription className="mt-1.5">{g.description}</CardDescription></Card>
                </Link>
              ))}
            </div>
          </Container>
        </Section>
      )}
    </>
  )
}
