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
import { isNoindexed } from "@/lib/noindex"

export const metadata = createMetadata({
  title: "Software Market Research Guides",
  description: "Category-specific guides to evaluating software markets, checking source quality, and choosing metrics that matter. Numeric claims appear only after source verification.",
  path: "/statistics",
  noIndex: true,
})

export const dynamic = "force-static"

export default function StatisticsPage() {
  const statCategories = getAllStatistics().filter((s) => !isNoindexed("statistics", s.slug)).map((s) => ({
    title: s.title,
    description: s.description,
    slug: s.slug,
    count: s.stats ? s.stats.length : 0,
  }))

  return (
    <>
      {statCategories.length > 0 && <CollectionPageSchema name="Software Market Research Guides" description="Source-audited category research" url={`${site.url}/statistics`} />}
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
              Use this source-quality checklist before relying on a software-market estimate. Evaluate the original publisher, market definition, geography, survey population, and reporting date. Only fully source-audited statistical reports are listed below.
            </p>
          </div>
        </Container>
      </section>

      <Section>
        <Container>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {statCategories.length === 0 && (
              <article className="col-span-full max-w-4xl space-y-6">
                <h2 className="text-2xl font-semibold">How to evaluate a software market statistic</h2>
                <p className="text-muted-foreground leading-relaxed">
                  A publisher name alone does not establish that a percentage, market-size
                  estimate, or vendor count is accurate. Before relying on a figure, look for
                  the original source document and check whether it measures the same market
                  and time period as your decision.
                </p>
                <ol className="list-decimal space-y-3 pl-6 text-sm leading-relaxed text-muted-foreground">
                  <li><strong className="text-foreground">Find the exact source.</strong> A link to a publisher homepage is not enough. Locate the study, page, table, or public dataset that states the figure.</li>
                  <li><strong className="text-foreground">Read the definitions.</strong> Check whether the author means market revenue, subscriptions, vendors, active users, or surveyed businesses.</li>
                  <li><strong className="text-foreground">Check scope and timing.</strong> Confirm the geography, sample size, reporting period, and whether a figure is measured or forecast.</li>
                  <li><strong className="text-foreground">Check the calculation.</strong> Percentages need a denominator; growth rates need a comparable baseline. Estimates from incompatible methods should not be combined.</li>
                  <li><strong className="text-foreground">Record the review date.</strong> Keep the original URL and the date checked so a future reader can repeat the source verification.</li>
                </ol>
                <p className="text-muted-foreground">
                  For software decisions, begin with our{" "}
                  <Link href="/methodology" className="text-primary underline underline-offset-4">editorial methodology</Link>
                  {" "}and{" "}
                  <Link href="/reviews" className="text-primary underline underline-offset-4">software reviews</Link>.
                  Neither should be interpreted as a substitute for a primary statistical source.
                </p>
              </article>
            )}
            {statCategories.map((cat) => (
              <Link key={cat.slug} href={`/statistics/${cat.slug}`} className="group card-hover">
                <Card className="h-full flex flex-col">
                  <div className="flex items-center gap-2 mb-3">
                    <BarChart3 size={16} className="text-primary" />
                    <span className="text-xs text-muted-foreground">{cat.count > 0 ? `${cat.count} recorded metrics; source verification varies` : "Source audit in progress"}</span>
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
