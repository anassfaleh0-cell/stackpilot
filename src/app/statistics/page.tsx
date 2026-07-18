import { Container, Section } from "@/components/ui/container"
import { Badge } from "@/components/ui/badge"
import { Card, CardTitle, CardDescription } from "@/components/ui/card"
import { Breadcrumbs } from "@/components/seo/breadcrumbs"
import { BreadcrumbSchema, CollectionPageSchema } from "@/components/seo/json-ld"
import { createMetadata } from "@/lib/metadata"
import Link from "next/link"
import { ArrowRight, BarChart3 } from "lucide-react"
import { BrandPattern } from "@/components/brand/patterns"

export const metadata = createMetadata({
  title: "Software Statistics & Market Data",
  description: "Verified software statistics, market research, and industry benchmarks. Updated yearly with original sources. Data-driven insights for B2B software buyers.",
  path: "/statistics",
})

const statCategories = [
  {
    title: "CRM Software Statistics",
    description: "Market size, adoption rates, ROI data, and usage statistics for the CRM industry. Updated 2026.",
    slug: "crm-software",
    count: 24,
  },
  {
    title: "Project Management Statistics",
    description: "Project management software adoption, productivity gains, and market trends with verified data sources.",
    slug: "project-management",
    count: 18,
  },
  {
    title: "AI Software Statistics",
    description: "Artificial intelligence software adoption rates, spending trends, and business impact statistics for 2026.",
    slug: "ai-software",
    count: 31,
  },
  {
    title: "Developer Tools Statistics",
    description: "Developer tool usage, adoption rates, and spending statistics. CI/CD, cloud platforms, and DevOps data.",
    slug: "developer-tools",
    count: 22,
  },
  {
    title: "Marketing Software Statistics",
    description: "Marketing technology adoption, Martech stack spending, and ROI statistics for digital marketing tools.",
    slug: "marketing-software",
    count: 27,
  },
  {
    title: "HR Software Statistics",
    description: "HR technology adoption, HRIS spending, and workforce management statistics with original sources.",
    slug: "hr-software",
    count: 15,
  },
]

export default function StatisticsPage() {
  return (
    <>
      <CollectionPageSchema name="Software Statistics & Market Data" description="Verified software statistics with original sources" url="https://pilotstack.online/statistics" />
      <BreadcrumbSchema items={[{ name: "Home", href: "/" }, { name: "Statistics", href: "/statistics" }]} />
      <Container className="pt-8">
        <Breadcrumbs items={[{ name: "Statistics" }]} />
      </Container>
      <section className="relative overflow-hidden border-b border-border">
        <BrandPattern variant="dots" opacity={0.2} className="text-primary" />
        <Container className="relative py-16 sm:py-20">
          <div className="max-w-3xl mx-auto text-center">
            <Badge variant="default" className="mb-4">Research Data</Badge>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">Software Statistics & Market Data</h1>
            <p className="text-lg text-muted-foreground text-pretty">
              Verified statistics, market research, and industry benchmarks for B2B software categories. All data sourced from original research and updated yearly.
            </p>
          </div>
        </Container>
      </section>
      <Section>
        <Container>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {statCategories.map((cat) => (
              <Link key={cat.slug} href={`/statistics/${cat.slug}`} className="group card-hover">
                <Card className="h-full flex flex-col">
                  <div className="flex items-center gap-2 mb-3">
                    <BarChart3 size={16} className="text-primary" />
                    <span className="text-xs text-muted-foreground">{cat.count} data points</span>
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
