import { Container, Section, SectionHeader } from "@/components/ui/container"
import { Badge } from "@/components/ui/badge"
import { Breadcrumbs } from "@/components/seo/breadcrumbs"
import { BreadcrumbSchema, CollectionPageSchema, ItemListSchema } from "@/components/seo/json-ld"
import { site } from "@/lib/constants"
import { createMetadata } from "@/lib/metadata"
import { getAllComparisons } from "@/lib/content/registry"
import { ComparisonGrid } from "@/components/entity/comparison-grid"
import { BrandPattern } from "@/components/brand/patterns"

export const metadata = createMetadata({
  title: "Software Comparisons",
  description: "Side-by-side comparisons of the most popular software tools. See how they stack up across features, pricing, and user satisfaction.",
  path: "/comparisons",
})

export default function ComparisonsPage() {
  const comparisons = getAllComparisons()

  return (
    <>
      <CollectionPageSchema name="Software Comparisons" description="Side-by-side comparisons of the most popular software tools" url={`${site.url}/comparisons`} />
      <ItemListSchema items={comparisons.map(c => ({ name: c.title, url: `${site.url}/comparisons/${c.slug}` }))} url={`${site.url}/comparisons`} />
      <BreadcrumbSchema items={[{ name: "Home", href: "/" }, { name: "Comparisons", href: "/comparisons" }]} />
      <Container className="pt-8">
        <Breadcrumbs items={[{ name: "Comparisons" }]} />
      </Container>

      <section className="relative overflow-hidden border-b border-border">
        <BrandPattern variant="cross" opacity={0.2} className="text-primary" />
        <Container className="relative py-16 sm:py-20">
          <SectionHeader className="mb-0">
            <Badge variant="default" className="mb-4">Comparisons</Badge>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">Side-by-side comparisons</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
              We pit the most popular tools against each other so you can see exactly how they compare across features, pricing, and user experience.
            </p>
          </SectionHeader>
        </Container>
      </section>

      <Section>
        <Container>
          {comparisons.length > 0 ? (
            <ComparisonGrid items={comparisons.map((c) => ({ slug: c.slug, title: c.title, category: c.category, winner: c.winner, description: c.description }))} />
          ) : (
            <p className="text-center text-muted-foreground py-12">No comparisons available yet. Check back soon.</p>
          )}
        </Container>
      </Section>
    </>
  )
}
