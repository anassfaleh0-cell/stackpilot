import { Container, Section, SectionHeader } from "@/components/ui/container"
import { Badge } from "@/components/ui/badge"
import { Card, CardTitle, CardDescription } from "@/components/ui/card"
import { Breadcrumbs } from "@/components/seo/breadcrumbs"
import { BreadcrumbSchema } from "@/components/seo/json-ld"
import { createMetadata } from "@/lib/metadata"
import { site, categories } from "@/lib/constants"
import { getAllReviews, getAllComparisons, getAllGuides, getAllBlogPosts } from "@/lib/content/registry"
import Link from "next/link"
import { Calculator, Scale, ArrowRight, Star, BookOpen, GitCompare, FileText } from "lucide-react"

export const metadata = createMetadata({
  title: "Free Software Tools",
  description: "Free interactive tools to help you compare software, calculate TCO, and make better buying decisions across 12 software categories.",
  path: "/tools",
})

const tools = [
  { slug: "tco-calculator", name: "TCO Calculator", description: "Calculate the total cost of ownership for any software tool.", icon: Calculator },
  { slug: "software-comparison", name: "Software Comparison Matrix", description: "Compare multiple tools side by side across dozens of criteria.", icon: Scale },
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
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">Smarter decisions, free tools</h1>
            <p className="text-lg text-muted">Interactive calculators and comparison tools to help you evaluate software with data, not guesswork.</p>
          </SectionHeader>
          <div className="grid sm:grid-cols-2 gap-6 max-w-3xl mx-auto mb-20">
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

          <SectionHeader className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">Explore by category</h2>
            <p className="text-muted-foreground">Browse our content ecosystem across {categories.length} software categories.</p>
          </SectionHeader>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {catCounts.map(c => (
              <Link key={c.slug} href={`/category/${c.slug}`} className="group">
                <Card className="h-full hover:border-primary/30 transition-all">
                  <CardTitle className="text-sm group-hover:text-primary transition-colors">{c.name}</CardTitle>
                  <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted-foreground">
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
