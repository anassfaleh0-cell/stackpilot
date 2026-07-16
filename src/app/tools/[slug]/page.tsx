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
    name: "TCO Calculator", description: "Calculate the total cost of ownership for any software tool.", icon: Calculator,
    content: [
      "Our TCO (Total Cost of Ownership) Calculator helps you estimate the true cost of adopting a new software tool. Beyond the subscription price, factor in implementation costs, training time, integration expenses, and ongoing maintenance.",
      "To get started, enter your expected number of users, the monthly subscription cost per user, and estimated implementation hours. The calculator will provide a comprehensive 1-year and 3-year total cost projection.",
    ],
  },
  "software-comparison": {
    name: "Software Comparison Matrix", description: "Compare multiple tools side by side across dozens of criteria.", icon: Scale,
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
  return createMetadata({ title: tool.name, description: tool.description, path: `/tools/${slug}` })
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
            <Card className="bg-muted-bg/50 p-8 text-center">
              <p className="text-muted mb-4">This interactive tool is coming soon. In the meantime, explore our reviews and comparisons.</p>
              <div className="flex gap-3 justify-center">
                <Link href="/reviews" className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary text-white hover:bg-primary-dark shadow-sm hover:shadow-md h-10 px-6 text-sm font-medium transition-all duration-200">
                  Browse Reviews <ArrowRight size={14} />
                </Link>
                <Link href="/comparisons" className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-transparent hover:bg-muted-bg h-10 px-6 text-sm font-medium transition-all duration-200">
                  View Comparisons
                </Link>
              </div>
            </Card>
          </div>
        </Container>
      </article>
    </>
  )
}
