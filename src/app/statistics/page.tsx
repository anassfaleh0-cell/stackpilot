import { Container, Section } from "@/components/ui/container"
import { Badge } from "@/components/ui/badge"
import { Card, CardTitle, CardDescription } from "@/components/ui/card"
import { Breadcrumbs } from "@/components/seo/breadcrumbs"
import { BreadcrumbSchema, CollectionPageSchema } from "@/components/seo/json-ld"
import { createMetadata } from "@/lib/metadata"
import { getAllStatistics } from "@/lib/content/registry"
import Link from "next/link"
import { ArrowRight, BarChart3 } from "lucide-react"
import { BrandPattern } from "@/components/brand/patterns"
import { site } from "@/lib/constants"
import { BannerAd } from "@/components/ads"
import { getPagination } from "@/lib/pagination"

export const metadata = createMetadata({
  title: "Software Market Research Guides",
  description: "Category-specific guides to evaluating software markets, checking source quality, and choosing metrics that matter. Numeric claims appear only after source verification.",
  path: "/statistics",
})

export const dynamic = "force-static"

export default function StatisticsPage() {
  const statCategories = getAllStatistics().map((s) => ({
    title: s.title,
    description: s.description,
    slug: s.slug,
    count: s.stats ? s.stats.length : 0,
  }))
  const pagination = getPagination({ page: 1, perPage: 24, total: statCategories.length })
  const pageStatCategories = statCategories.slice(pagination.start, pagination.end)

  return (
    <>
      <CollectionPageSchema name="Software Market Research Guides" description="Category-specific guides to evaluating software markets and verifying evidence" url={`${site.url}/statistics`} />
      <BreadcrumbSchema items={[{ name: "Home", href: "/" }, { name: "Statistics", href: "/statistics" }]} />
      <Container className="pt-8">
        <Breadcrumbs items={[{ name: "Statistics" }]} />
      </Container>
      <section className="relative overflow-hidden border-b border-border">
        <BrandPattern variant="dots" opacity={0.2} className="text-primary" />
        <Container className="relative py-16 sm:py-20">
          <div className="max-w-3xl mx-auto text-center">
            <Badge variant="default" className="mb-4">Market Research Guides</Badge>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">Software Market Research Guides</h1>
            <p className="text-lg text-muted-foreground text-pretty">
              Explore practical guides for evaluating software categories, choosing meaningful metrics, and checking market claims against original sources. Numeric estimates are withheld until their supporting evidence is documented.
            </p>
          </div>
        </Container>
      </section>

      {/* Ad: After section header */}
      <Section>
        <Container>
          <BannerAd className="mx-auto max-w-[728px]" />
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {pageStatCategories.map((cat) => (
              <Link key={cat.slug} href={`/statistics/${cat.slug}`} className="group card-hover">
                <Card className="h-full flex flex-col">
                  <div className="flex items-center gap-2 mb-3">
                    <BarChart3 size={16} className="text-primary" />
                    <span className="text-xs text-muted-foreground">{cat.count > 0 ? `${cat.count} source-verified data points` : "Source audit in progress"}</span>
                  </div>
                  <CardTitle className="group-hover:text-primary transition-colors">{cat.title}</CardTitle>
                  <CardDescription className="mt-1.5">{cat.description}</CardDescription>
                  <div className="mt-auto pt-4 flex items-center gap-1 text-xs font-medium text-muted-foreground group-hover:text-primary transition-colors">
                    View statistics <ArrowRight size={12} />
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </Container>
      </Section>
    </>
  )
}
