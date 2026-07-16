import { Container, Section } from "@/components/ui/container"
import { Badge } from "@/components/ui/badge"
import { Card, CardTitle, CardDescription } from "@/components/ui/card"
import { Breadcrumbs } from "@/components/seo/breadcrumbs"
import { BreadcrumbSchema } from "@/components/seo/json-ld"
import { createMetadata } from "@/lib/metadata"
import { categories } from "@/lib/constants"
import { getAllReviews } from "@/lib/content/registry"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Star } from "lucide-react"

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

  return (
    <>
      <BreadcrumbSchema items={[{ name: "Home", href: "/" }, { name: category.name, href: `/category/${slug}` }]} />
      <Container className="pt-8">
        <Breadcrumbs items={[{ name: "Categories", href: "/reviews" }, { name: category.name }]} />
      </Container>
      <Section className="pt-0">
        <Container>
          <Badge variant="default" className="mb-4">{category.count} Tools</Badge>
          <h1 className="text-4xl font-bold tracking-tight mb-4">Best {category.name} Software</h1>
          <p className="text-lg text-muted mb-12">Our expert picks for the best {category.name.toLowerCase()} tools. Each reviewed and rated by our team.</p>
          {reviews.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {reviews.map((tool) => (
                <Link key={tool.slug} href={`/reviews/${tool.slug}`} className="group">
                  <Card className="h-full hover:border-primary/30">
                    <div className="flex items-start justify-between mb-3">
                      <Badge variant="secondary">{tool.category}</Badge>
                      <div className="flex items-center gap-1 text-sm font-medium text-amber-600">
                        <Star size={14} className="fill-amber-400 text-amber-400" /> {tool.rating}
                      </div>
                    </div>
                    <CardTitle className="group-hover:text-primary transition-colors">{tool.name}</CardTitle>
                    <CardDescription className="mt-1.5">{tool.tagline}</CardDescription>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted py-12">No reviews yet in this category. Check back soon.</p>
          )}
        </Container>
      </Section>
    </>
  )
}
