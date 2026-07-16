import { Container, Section, SectionHeader } from "@/components/ui/container"
import { Badge } from "@/components/ui/badge"
import { Card, CardTitle, CardDescription } from "@/components/ui/card"
import { Breadcrumbs } from "@/components/seo/breadcrumbs"
import { BreadcrumbSchema } from "@/components/seo/json-ld"
import { createMetadata } from "@/lib/metadata"
import { getAllReviews } from "@/lib/content/registry"
import { categories } from "@/lib/constants"
import Link from "next/link"
import { Star, ArrowRight } from "lucide-react"

export const metadata = createMetadata({
  title: "Software Reviews",
  description: "In-depth, unbiased reviews of the best software tools. Expert analysis, real user feedback, and detailed feature comparisons.",
  path: "/reviews",
})

export default function ReviewsPage() {
  const tools = getAllReviews()

  return (
    <>
      <BreadcrumbSchema items={[{ name: "Home", href: "/" }, { name: "Reviews", href: "/reviews" }]} />
      <Container className="pt-8">
        <Breadcrumbs items={[{ name: "Reviews" }]} />
      </Container>

      <Section className="pt-0">
        <Container>
          <SectionHeader className="mb-12">
            <Badge variant="default" className="mb-4">Software Reviews</Badge>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
              In-depth software reviews
            </h1>
            <p className="text-lg text-muted">
              Every tool is tested, evaluated, and scored by our expert team. No fluff, no bias — just the information you need to make the right choice.
            </p>
          </SectionHeader>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map((tool) => (
              <Link key={tool.slug} href={`/reviews/${tool.slug}`} className="group">
                <Card className="h-full hover:border-primary/30">
                  <div className="flex items-start justify-between mb-3">
                    <Badge variant="secondary">{tool.category}</Badge>
                    <div className="flex items-center gap-1 text-sm font-medium text-amber-600">
                      <Star size={14} className="fill-amber-400 text-amber-400" />
                      {tool.rating}
                    </div>
                  </div>
                  <CardTitle className="group-hover:text-primary transition-colors">{tool.name}</CardTitle>
                  <CardDescription className="mt-1.5">{tool.tagline}</CardDescription>
                </Card>
              </Link>
            ))}
          </div>
        </Container>
      </Section>

      <Section className="bg-muted-bg/50">
        <Container>
          <SectionHeader className="mb-12">
            <h2 className="text-2xl font-bold">Browse by category</h2>
          </SectionHeader>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <Link key={cat.slug} href={`/category/${cat.slug}`}>
                <Card className="flex items-center justify-between p-4 hover:border-primary/30">
                  <span className="font-medium text-sm">{cat.name}</span>
                  <ArrowRight size={14} className="text-muted" />
                </Card>
              </Link>
            ))}
          </div>
        </Container>
      </Section>
    </>
  )
}
