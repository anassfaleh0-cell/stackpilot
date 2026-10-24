import { Container } from "@/components/ui/container"
import { Card } from "@/components/ui/card"
import { Breadcrumbs } from "@/components/seo/breadcrumbs"
import { BreadcrumbSchema } from "@/components/seo/json-ld"
import { createMetadata } from "@/lib/metadata"
import { toolPages } from "@/lib/constants"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Calculator, Scale, ArrowRight, TrendingUp, Target, Layers, DollarSign, type LucideIcon } from "lucide-react"
import { DecisionTool } from "@/components/tools/decision-tool"

const toolsData: Record<string, { name: string; description: string; icon: LucideIcon; kind: "tco" | "comparison" | "roi" | "scorecard" | "stack" | "pricing"; content: string[] }> = {
  "tco-calculator": {
    kind: "tco", name: "TCO Calculator", description: "Calculate the total cost of ownership for any software tool, including implementation, training, integration, and maintenance costs over 1 and 3 years.", icon: Calculator,
    content: [
      "Our TCO (Total Cost of Ownership) Calculator helps you estimate the true cost of adopting a new software tool. Beyond the subscription price, factor in implementation costs, training time, integration expenses, and ongoing maintenance.",
      "To get started, enter your expected number of users, the monthly subscription cost per user, and estimated implementation hours. The calculator will provide a comprehensive 1-year and 3-year total cost projection.",
      "Include costs that are easy to overlook: migration, admin time, premium support, required integrations, usage overages, taxes, and renewal changes. Keep one-time costs separate from recurring costs so the multi-year estimate does not accidentally count the same expense twice.",
      "Run at least a low, expected, and high scenario for seats and usage. Treat results as estimates based on your inputs, not a quote or a guarantee; verify plan limits and contractual charges with the vendor."
    ],
  },
  "software-comparison": {
    kind: "comparison", name: "Software Comparison Matrix", description: "Compare multiple tools side by side across features, pricing, ease of use, support, and integrations with weighted scoring.", icon: Scale,
    content: [
      "Our Software Comparison Matrix helps you evaluate multiple tools side by side across the criteria that matter most to your business. Score each tool on features, pricing, ease of use, support, and integrations.",
      "Simply add the tools you're considering, rate them across our standardized criteria, and the matrix will automatically calculate weighted scores to help you identify the best option.",
      "Define mandatory requirements before assigning weighted scores. A missing security control, required integration, or essential workflow should be treated as a blocker rather than offset by high marks in unrelated categories.",
      "For every score, record the evidence behind it: a test result, vendor document, quote, or an unresolved question. Use identical tasks and assumptions for each product; the resulting score organizes judgment but is not an objective benchmark."
    ],
  },
  "roi-calculator": {
    kind: "roi",
    name: "Software ROI Calculator",
    description: "Estimate annual savings, return on investment, and payback period for a software purchase.",
    icon: TrendingUp,
    content: [
      "Estimate whether a software investment can pay for itself by comparing annual software cost with the value of time saved and other measurable benefits.",
      "Use conservative assumptions. The result is an estimate, not a guarantee, and should be compared with your actual business case.",
      "Separate cash savings from capacity released. Hours saved create financial value only when the time can be redeployed, reduces paid overtime, avoids hiring, or produces another measurable benefit.",
      "Include implementation, migration, training, ongoing administration and renewal costs. Run conservative and optimistic scenarios, and avoid counting the same benefit in more than one category."
    ],
  },
  "software-scorecard": {
    kind: "scorecard",
    name: "Software Scorecard",
    description: "Score software options against the criteria that matter most to your team.",
    icon: Target,
    content: [
      "Turn subjective software research into a repeatable scorecard. Rate features, price, ease of use, integrations, and support from 1 to 5.",
      "Use the same criteria for every vendor so the result reflects fit rather than marketing claims.",
      "Set weights before scoring and explain why each requirement matters. Keep mandatory needs as pass/fail checks so a high total cannot hide a critical gap.",
      "Attach evidence to each rating and mark unknowns as unverified rather than guessing. Revisit the score when a trial, vendor answer or quote changes the evidence."
    ],
  },
  "saas-stack-cost-calculator": {
    kind: "stack",
    name: "SaaS Stack Cost Calculator",
    description: "Estimate monthly and annual software spend across your stack, compare categories, and identify duplicate or underused subscriptions before deciding what to consolidate.",
    icon: Layers,
    content: [
      "Add the recurring cost of major software categories to see how much your stack costs each month and year.",
      "Use the total to identify overlapping subscriptions, unused tools, and areas where consolidation may reduce spend.",
      "Normalize billing periods before comparing: convert annual subscriptions to a monthly equivalent, separate one-time implementation costs, and include seat growth, taxes, usage charges and add-ons where known.",
      "Do not remove a tool based on cost overlap alone. Check integrations, data ownership, security requirements and the operational cost of migrating workflows before consolidating subscriptions."
    ],
  },
  "software-pricing-calculator": {
    kind: "pricing",
    name: "Software Pricing Calculator",
    description: "Model software subscription costs based on seats, per-user pricing, and add-ons.",
    icon: DollarSign,
    content: [
      "Estimate what a software plan could cost at your expected seat count instead of relying only on the advertised starting price.",
      "Add recurring or annual extras to get a more realistic budget estimate.",
      "Check how the vendor bills guests, inactive users, contact counts, storage, API calls, premium support and overages. A starting price may not represent the tier that includes the features your workflow requires.",
      "Compare monthly and annual billing using the same period and seat assumptions. Verify current plan limits, taxes, renewal terms and cancellation conditions directly with the vendor before purchase."
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
            <div className="rounded-xl border border-border bg-card p-8 mb-8">
              <h2 className="text-xl font-bold mb-4">Interactive Calculator</h2>
              <DecisionTool kind={tool.kind} />
            </div>
            <div className="rounded-xl border border-border bg-card p-8">
              <h2 className="text-xl font-bold mb-4">How to Use This Tool</h2>
              <div className="prose prose-slate max-w-none space-y-3 text-sm text-muted-foreground">
                {slug === "tco-calculator" ? (
                  <>
                    <p>To calculate total cost of ownership, list every cost category: subscription fees, implementation and data migration, training and change management, integration with existing tools, and ongoing administration. Add a 15-20% contingency buffer for unexpected expenses. Multiply monthly per-user costs by your expected user count and contract length. Compare the 1-year and 3-year projections to understand how costs compound. For a detailed breakdown, see our <Link href="/guides/saas-implementation-best-practices" className="text-primary hover:underline">SaaS implementation guide</Link>.</p>
                    <p>Training and integration costs depend on the software, deployment model, data migration, and your existing stack. Estimate these costs using vendor quotes and your own internal labor rates; treat generic benchmarks as prompts for questions, not as a substitute for a project-specific estimate.</p>
                  </>
                ) : (
                  <>
                    <p>When comparing software, create a weighted scorecard based on your specific priorities. List your top 5-7 evaluation criteria, assign weights that reflect their importance (features 25%, pricing 20%, ease of use 20%, support 15%, integrations 10%, security 10%), then rate each tool on a 1-5 scale for each criterion. The weighted total reveals which tool best fits your needs.</p>
                    <p>Focus your comparison on the features your team will actually use daily, not every feature the vendor offers. Read our <Link href="/methodology" className="text-primary hover:underline">review methodology</Link> for the criteria and evidence standard, or browse <Link href="/comparisons" className="text-primary hover:underline">head-to-head comparisons</Link> of specific tools.</p>
                  </>
                )}
              </div>
            </div>
            <section className="mt-8 rounded-xl border border-border bg-muted-bg p-6">
              <h2 className="text-xl font-bold mb-2">Related free tools</h2>
              <p className="text-sm text-muted-foreground mb-4">Use another calculator or planning tool to check a different part of your software decision.</p>
              <div className="grid sm:grid-cols-2 gap-3">
                {toolPages.filter((item) => item.slug !== slug).map((item) => (
                  <Link key={item.slug} href={`/tools/${item.slug}`} className="rounded-lg border border-border bg-card p-3 hover:border-primary/40 transition-colors">
                    <span className="font-medium text-sm">{item.name}</span>
                    <span className="block text-xs text-muted-foreground mt-1">Open tool <ArrowRight size={12} className="inline" /></span>
                  </Link>
                ))}
              </div>
            </section>
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
