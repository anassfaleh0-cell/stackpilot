import { Container, Section, SectionHeader } from "@/components/ui/container"
import { Badge } from "@/components/ui/badge"
import { Card, CardTitle, CardDescription } from "@/components/ui/card"
import { Breadcrumbs } from "@/components/seo/breadcrumbs"
import { BreadcrumbSchema } from "@/components/seo/json-ld"
import { createMetadata } from "@/lib/metadata"
import { site, categories } from "@/lib/constants"
import { getAllReviews, getAllComparisons, getAllGuides, getAllBlogPosts } from "@/lib/content/registry"
import Link from "next/link"
import { Calculator, Scale, ArrowRight, Star, BookOpen, GitCompare, FileText, TrendingUp, Target, Layers, DollarSign } from "lucide-react"
import { BannerAd } from "@/components/ads"

export const metadata = createMetadata({
  title: "Free Software Tools",
  description: "Free software decision tools to compare options, estimate total cost, calculate ROI, score vendors, and model your SaaS stack before you buy.",
  path: "/tools",
})

const tools = [
  { slug: "tco-calculator", name: "TCO Calculator", description: "Estimate the true 1-year and 3-year cost of software beyond the subscription price.", icon: Calculator },
  { slug: "software-comparison", name: "Software Comparison Matrix", description: "Compare multiple tools side by side across the criteria that matter to your team.", icon: Scale },
  { slug: "roi-calculator", name: "Software ROI Calculator", description: "Estimate payback, annual savings, and return on investment from a software purchase.", icon: TrendingUp },
  { slug: "software-scorecard", name: "Software Scorecard", description: "Weight your priorities and score software options against a consistent buying framework.", icon: Target },
  { slug: "saas-stack-cost-calculator", name: "SaaS Stack Cost Calculator", description: "Add your software subscriptions and see your total monthly and annual stack cost.", icon: Layers },
  { slug: "software-pricing-calculator", name: "Software Pricing Calculator", description: "Model per-user pricing, seats, billing periods, and add-ons before you buy.", icon: DollarSign },
]

export default function ToolsPage() {
  const catCounts = categories.map(c => ({
    name: c.name,
    slug: c.slug,
    reviews: getAllReviews().filter(r => r.category === c.name).length,
    guides: getAllGuides().filter(g => g.category === c.name).length,
    comparisons: getAllComparisons().filter(cmp => cmp.category === c.name).length,
    posts: getAllBlogPosts().filter(p => p.category === c.name).length,
  }))

  return (
    <>
      <BreadcrumbSchema items={[{ name: "Home", href: "/" }, { name: "Tools", href: "/tools" }]} />
      <Container className="pt-8">
        <Breadcrumbs items={[{ name: "Free Tools" }]} />
      </Container>
      <Section className="pt-0">
        <Container>
          <SectionHeader className="mb-12">
            <Badge variant="default" className="mb-4">Free Tools</Badge>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">Free Software Decision Tools</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Compare software, estimate total cost, calculate ROI, score your options, and model your SaaS stack before you commit.</p>
          </SectionHeader>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto mb-20">
            {tools.map((tool) => (
              <Link key={tool.slug} href={`/tools/${tool.slug}`} className="group">
                <Card className="h-full hover:border-primary/30 text-center">
                  <tool.icon size={32} className="mx-auto mb-4 text-primary" />
                  <CardTitle className="group-hover:text-primary transition-colors">{tool.name}</CardTitle>
                  <CardDescription className="mt-1.5">{tool.description}</CardDescription>
                </Card>
              </Link>
            ))}
          </div>

          {/* Ad: After section header */}
          <Section>
            <Container>
              <BannerAd className="mx-auto max-w-[728px]" />
            </Container>
          </Section>

          <SectionHeader className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">Explore by category</h2>
            <p className="text-muted-foreground-foreground">Browse our content ecosystem across {categories.length} software categories.</p>
          </SectionHeader>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {catCounts.map(c => (
              <Link key={c.slug} href={`/category/${c.slug}`} className="group">
                <Card className="h-full hover:border-primary/30 transition-all">
                  <CardTitle className="text-sm group-hover:text-primary transition-colors">{c.name}</CardTitle>
                  <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted-foreground-foreground">
                    {c.reviews > 0 && <span className="flex items-center gap-1"><Star size={11} /> {c.reviews} reviews</span>}
                    {c.guides > 0 && <span className="flex items-center gap-1"><BookOpen size={11} /> {c.guides} guides</span>}
                    {c.comparisons > 0 && <span className="flex items-center gap-1"><GitCompare size={11} /> {c.comparisons} comparisons</span>}
                    {c.posts > 0 && <span className="flex items-center gap-1"><FileText size={11} /> {c.posts} articles</span>}
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
