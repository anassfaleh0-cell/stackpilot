import { Container } from "@/components/ui/container"
import { Card } from "@/components/ui/card"
import { Breadcrumbs } from "@/components/seo/breadcrumbs"
import { BreadcrumbSchema } from "@/components/seo/json-ld"
import { createMetadata } from "@/lib/metadata"
import { toolPages } from "@/lib/constants"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Calculator, Scale, ArrowRight, type LucideIcon } from "lucide-react"

const toolsData: Record<string, { name: string; description: string; icon: LucideIcon; content: string[] }> = {
  "tco-calculator": {
    name: "TCO Calculator", description: "Calculate the total cost of ownership for any software tool, including implementation, training, integration, and maintenance costs over 1 and 3 years.", icon: Calculator,
    content: [
      "Our TCO (Total Cost of Ownership) Calculator helps you estimate the true cost of adopting a new software tool. Beyond the subscription price, factor in implementation costs, training time, integration expenses, and ongoing maintenance.",
      "To get started, enter your expected number of users, the monthly subscription cost per user, and estimated implementation hours. The calculator will provide a comprehensive 1-year and 3-year total cost projection.",
    ],
  },
  "software-comparison": {
    name: "Software Comparison Matrix", description: "Compare multiple tools side by side across features, pricing, ease of use, support, and integrations with weighted scoring.", icon: Scale,
    content: [
      "Our Software Comparison Matrix helps you evaluate multiple tools side by side across the criteria that matter most to your business. Score each tool on features, pricing, ease of use, support, and integrations.",
      "Simply add the tools you're considering, rate them across our standardized criteria, and the matrix will automatically calculate weighted scores to help you identify the best option.",
    ],
  },
}

export function generateStaticParams() {
  return toolPages.map((t) => ({ slug: t.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const tool = toolsData[slug]
  if (!tool) return {}
  const toolTitle = slug === "tco-calculator" ? "TCO Calculator — Compare Total Cost of Ownership" : tool.name
  return createMetadata({ title: toolTitle, description: tool.description, path: `/tools/${slug}` })
}

export default async function ToolPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const tool = toolsData[slug]
  if (!tool) notFound()
  const Icon = tool.icon

  return (
    <>
      <BreadcrumbSchema items={[{ name: "Home", href: "/" }, { name: "Free Tools", href: "/tools" }, { name: tool.name, href: `/tools/${slug}` }]} />
      <Container className="pt-8">
        <Breadcrumbs items={[{ name: "Free Tools", href: "/tools" }, { name: tool.name }]} />
      </Container>
      <article className="pb-16">
        <Container>
          <div className="max-w-3xl mx-auto">
            <Icon size={40} className="text-primary mb-4" />
            <h1 className="text-4xl font-bold tracking-tight mb-4">{tool.name}</h1>
            <p className="text-lg text-muted mb-8">{tool.description}</p>
            <div className="prose prose-slate max-w-none mb-8 space-y-4">
              {tool.content.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
            <div className="rounded-xl border border-border bg-card p-8">
              <h2 className="text-xl font-bold mb-4">How to Use This Tool</h2>
              <div className="prose prose-slate max-w-none space-y-3 text-sm text-muted-foreground">
                {slug === "tco-calculator" ? (
                  <>
                    <p>To calculate total cost of ownership, list every cost category: subscription fees, implementation and data migration, training and change management, integration with existing tools, and ongoing administration. Add a 15-20% contingency buffer for unexpected expenses. Multiply monthly per-user costs by your expected user count and contract length. Compare the 1-year and 3-year projections to understand how costs compound. For a detailed breakdown, see our <Link href="/guides/saas-implementation-best-practices" className="text-primary hover:underline">SaaS implementation guide</Link>.</p>
                    <p>Most organizations underestimate training and adoption costs by 40-60%. Budget at least 20 hours of paid training time per user in the first year, plus ongoing support. Integration costs vary widely: simple API connections may cost $5,000-15,000, while complex enterprise integrations can exceed $100,000.</p>
                  </>
                ) : (
                  <>
                    <p>When comparing software, create a weighted scorecard based on your specific priorities. List your top 5-7 evaluation criteria, assign weights that reflect their importance (features 25%, pricing 20%, ease of use 20%, support 15%, integrations 10%, security 10%), then rate each tool on a 1-5 scale for each criterion. The weighted total reveals which tool best fits your needs.</p>
                    <p>Focus your comparison on the features your team will actually use daily, not every feature the vendor offers. Read our <Link href="/guides/how-to-choose-crm-software" className="text-primary hover:underline">software selection guide</Link> for a step-by-step evaluation framework, or browse <Link href="/comparisons" className="text-primary hover:underline">head-to-head comparisons</Link> of specific tools.</p>
                  </>
                )}
              </div>
            </div>
            <div className="flex gap-3 justify-center mt-8">
              <Link href="/reviews" className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary text-white hover:bg-primary-dark shadow-sm hover:shadow-md h-10 px-6 text-sm font-medium transition-all duration-200">
                Browse Reviews <ArrowRight size={14} />
              </Link>
              <Link href="/comparisons" className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-transparent hover:bg-muted-bg h-10 px-6 text-sm font-medium transition-all duration-200">
                View Comparisons
              </Link>
            </div>
          </div>
        </Container>
      </article>
    </>
  )
}
