import { Container, Section, SectionHeader } from "@/components/ui/container"
import { Badge } from "@/components/ui/badge"
import { Card, CardTitle, CardDescription } from "@/components/ui/card"
import { Breadcrumbs } from "@/components/seo/breadcrumbs"
import { BreadcrumbSchema, CollectionPageSchema, ItemListSchema } from "@/components/seo/json-ld"
import { site } from "@/lib/constants"
import { createMetadata } from "@/lib/metadata"
import { getAllReviews } from "@/lib/content/registry"
import { categories } from "@/lib/constants"
import Link from "next/link"
import { Star, ArrowRight } from "lucide-react"
import { BrandPattern, BrandDivider } from "@/components/brand/patterns"

export const metadata = createMetadata({
  title: "Software Reviews",
  description: "In-depth, unbiased reviews of the best software tools. Expert analysis, real user feedback, and detailed feature comparisons.",
  path: "/reviews",
})

export default function ReviewsPage() {
  const tools = getAllReviews()

  return (
    <>
      <CollectionPageSchema name="Software Reviews" description="In-depth, unbiased reviews of the best software tools" url={`${site.url}/reviews`} />
      <ItemListSchema items={tools.map(t => ({ name: t.name, url: `${site.url}/reviews/${t.slug}` }))} url={`${site.url}/reviews`} />
      <BreadcrumbSchema items={[{ name: "Home", href: "/" }, { name: "Reviews", href: "/reviews" }]} />
      <Container className="pt-8">
        <Breadcrumbs items={[{ name: "Reviews" }]} />
      </Container>

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <BrandPattern variant="dots" opacity={0.2} className="text-primary" />
        <Container className="relative py-16 sm:py-20">
          <SectionHeader className="mb-0">
            <Badge variant="default" className="mb-4">Software Reviews</Badge>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
              In-depth software reviews
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
              Every tool is tested, evaluated, and scored by our expert team. No fluff, no bias — just the information you need to make the right choice.
            </p>
          </SectionHeader>
        </Container>
      </section>

      {/* Grid */}
      <Section>
        <Container>
          {tools.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-reveal">
            {tools.map((tool, i) => (
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
                  <div className="mt-4 pt-4 border-t border-border flex items-center gap-1 text-xs font-medium text-muted-foreground group-hover:text-primary transition-colors mt-auto">
                    Read review <ArrowRight size={12} className="transition-transform group-hover:translate-x-0.5" />
                  </div>
                </Card>
              </Link>
            ))}
          </div>
          ) : (
            <p className="text-center text-muted-foreground py-12">No reviews available yet. Check back soon.</p>
          )}
        </Container>
      </Section>

      <BrandDivider />

      {/* Categories */}
      <Section className="pt-0">
        <Container>
          <SectionHeader className="mb-12">
            <h2 className="text-2xl font-bold tracking-tight">Browse by category</h2>
          </SectionHeader>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {categories.map((cat) => (
              <Link key={cat.slug} href={`/category/${cat.slug}`} className="group card-hover">
                <Card className="flex items-center justify-between p-4">
                  <span className="font-medium text-sm">{cat.name}</span>
                  <ArrowRight size={14} className="text-muted-foreground group-hover:text-primary transition-colors" />
                </Card>
              </Link>
            ))}
          </div>
        </Container>
      </Section>
    </>
  )
}
