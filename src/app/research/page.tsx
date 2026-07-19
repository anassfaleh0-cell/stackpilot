import { Container, Section } from "@/components/ui/container"
import { Badge } from "@/components/ui/badge"
import { Card, CardTitle, CardDescription } from "@/components/ui/card"
import { Breadcrumbs } from "@/components/seo/breadcrumbs"
import { BreadcrumbSchema, CollectionPageSchema } from "@/components/seo/json-ld"
import { createMetadata } from "@/lib/metadata"
import Link from "next/link"
import { ArrowRight, FileText } from "lucide-react"
import { BrandPattern } from "@/components/brand/patterns"
import { site } from "@/lib/constants"

export const metadata = createMetadata({
  title: "Research Reports",
  description: "Original research reports on software pricing, market trends, and industry benchmarks. Data-driven insights for B2B technology buyers.",
  path: "/research",
})

const reports = [
  {
    title: "SaaS Pricing Report 2026",
    description: "Comprehensive analysis of SaaS pricing trends across 12 categories. Includes pricing model distribution, average seat costs, and enterprise vs. SMB pricing analysis.",
    slug: "saas-pricing-report-2026",
    date: "June 2026",
    readTime: "15 min",
  },
  {
    title: "Developer Tools Market Report 2026",
    description: "Market analysis of the developer tools ecosystem including CI/CD, cloud platforms, version control, and monitoring tool adoption rates and spending patterns.",
    slug: "developer-tools-market-2026",
    date: "May 2026",
    readTime: "12 min",
  },
  {
    title: "AI Software Adoption Benchmarks 2026",
    description: "Benchmark data on AI software adoption across industries including spending per employee, ROI timelines, and tool selection criteria.",
    slug: "ai-adoption-benchmarks-2026",
    date: "April 2026",
    readTime: "18 min",
  },
]

export default function ResearchPage() {
  return (
    <>
      <CollectionPageSchema name="Research Reports" description="Original research reports on software pricing, market trends, and industry benchmarks" url={`${site.url}/research`} />
      <BreadcrumbSchema items={[{ name: "Home", href: "/" }, { name: "Research", href: "/research" }]} />
      <Container className="pt-8">
        <Breadcrumbs items={[{ name: "Research" }]} />
      </Container>
      <section className="relative overflow-hidden border-b border-border">
        <BrandPattern variant="grid" opacity={0.3} className="text-primary" />
        <Container className="relative py-16 sm:py-20">
          <div className="max-w-3xl mx-auto text-center">
            <Badge variant="default" className="mb-4">Original Research</Badge>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">Research Reports</h1>
            <p className="text-lg text-muted-foreground text-pretty">
              Data-driven research reports on software pricing, market trends, and industry benchmarks. Our team analyzes market data to help you make informed decisions.
            </p>
          </div>
        </Container>
      </section>
      <Section>
        <Container>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {reports.length > 0 ? reports.map((report) => (
              <Link key={report.slug} href={`/research/${report.slug}`} className="group card-hover">
                <Card className="h-full flex flex-col">
                  <div className="flex items-center gap-2 mb-3">
                    <FileText size={16} className="text-primary" />
                    <span className="text-xs text-muted-foreground">{report.date}</span>
                  </div>
                  <CardTitle className="group-hover:text-primary transition-colors">{report.title}</CardTitle>
                  <CardDescription className="mt-1.5">{report.description}</CardDescription>
                  <div className="mt-auto pt-4 flex items-center gap-1 text-xs font-medium text-muted-foreground">
                    <span>{report.readTime} read</span>
                    <span className="text-border-light mx-1">·</span>
                    <span className="group-hover:text-primary transition-colors">Read report <ArrowRight size={12} /></span>
                  </div>
                </Card>
              </Link>
            )) : (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground">Research reports are being published. Check back soon.</p>
              </div>
            )}
          </div>
        </Container>
      </Section>
    </>
  )
}
