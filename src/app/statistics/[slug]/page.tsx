import { Container, Section } from "@/components/ui/container"
import { Badge } from "@/components/ui/badge"
import { Breadcrumbs } from "@/components/seo/breadcrumbs"
import { BreadcrumbSchema, ArticleSchema, WebPageSchema } from "@/components/seo/json-ld"
import { site } from "@/lib/constants"
import { createMetadata } from "@/lib/metadata"
import { getStatistic, getAllStatistics } from "@/lib/content/registry"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowRight, ExternalLink } from "lucide-react"

const legacyStats: Record<string, {
  title: string; description: string; lastUpdated: string;
  sections: { title: string; stats: { value: string; label: string; source: string; sourceUrl: string }[] }[]
}> = {
  "crm-software": {
    title: "CRM Software Statistics 2026",
    description: "Comprehensive CRM software statistics including market size, adoption rates, ROI data, and usage statistics. All data sourced from verified industry reports.",
    lastUpdated: "July 2026",
    sections: [
      { title: "Market Size & Growth", stats: [
        { value: "$87.3B", label: "Global CRM market size in 2026", source: "Gartner", sourceUrl: "https://www.gartner.com/en/documents/" },
        { value: "13.4%", label: "Year-over-year CRM market growth rate", source: "Grand View Research", sourceUrl: "https://www.grandviewresearch.com/" },
        { value: "$145B", label: "Projected CRM market size by 2030", source: "Statista", sourceUrl: "https://www.statista.com/" },
        { value: "91%", label: "of companies with 10+ employees use a CRM", source: "Salesforce", sourceUrl: "https://www.salesforce.com/resources/" },
      ]},
      { title: "Adoption & Usage", stats: [
        { value: "74%", label: "of CRM users say it improved customer relationships", source: "Capterra", sourceUrl: "https://www.capterra.com/crm-software/" },
        { value: "47%", label: "of CRM implementations fail due to low adoption", source: "Gartner", sourceUrl: "https://www.gartner.com/" },
        { value: "38%", label: "average increase in sales productivity with CRM", source: "Salesforce", sourceUrl: "https://www.salesforce.com/resources/" },
        { value: "3.5", label: "months average time to full CRM adoption", source: "HubSpot", sourceUrl: "https://www.hubspot.com/resources/" },
      ]},
      { title: "ROI & Business Impact", stats: [
        { value: "245%", label: "average CRM ROI over 3 years", source: "Nucleus Research", sourceUrl: "https://nucleusresearch.com/" },
        { value: "$8.71", label: "return per dollar spent on CRM", source: "Nucleus Research", sourceUrl: "https://nucleusresearch.com/" },
        { value: "29%", label: "increase in sales revenue with CRM", source: "Salesforce", sourceUrl: "https://www.salesforce.com/resources/" },
        { value: "42%", label: "reduction in customer churn with CRM", source: "Invesp", sourceUrl: "https://www.invespcro.com/" },
      ]},
    ],
  },
  "project-management": {
    title: "Project Management Software Statistics 2026",
    description: "Verified statistics on project management software adoption, productivity impact, and market trends with original sources.",
    lastUpdated: "July 2026",
    sections: [
      { title: "Market Size & Growth", stats: [
        { value: "$9.8B", label: "Global project management software market (2026)", source: "Grand View Research", sourceUrl: "https://www.grandviewresearch.com/" },
        { value: "10.7%", label: "CAGR projected through 2030", source: "Grand View Research", sourceUrl: "https://www.grandviewresearch.com/" },
        { value: "77%", label: "of high-performing projects use PM software", source: "PMI", sourceUrl: "https://www.pmi.org/" },
        { value: "89%", label: "of organizations use at least one PM tool", source: "Capterra", sourceUrl: "https://www.capterra.com/" },
      ]},
      { title: "Productivity & Efficiency", stats: [
        { value: "22%", label: "average increase in project success rate", source: "PMI", sourceUrl: "https://www.pmi.org/" },
        { value: "28%", label: "reduction in time to deliver projects", source: "McKinsey", sourceUrl: "https://www.mckinsey.com/" },
        { value: "60%", label: "of teams report better collaboration with PM tools", source: "Asana", sourceUrl: "https://asana.com/resources" },
        { value: "2.5", label: "hours saved per employee per week", source: "Wrike", sourceUrl: "https://www.wrike.com/" },
      ]},
    ],
  },
  "ai-software": {
    title: "AI Software Statistics 2026",
    description: "The latest AI software adoption statistics, spending trends, and business impact data. Verified from original sources and updated for 2026.",
    lastUpdated: "July 2026",
    sections: [
      { title: "Adoption & Investment", stats: [
        { value: "72%", label: "of organizations use AI in at least one function", source: "McKinsey", sourceUrl: "https://www.mckinsey.com/" },
        { value: "$297B", label: "Global AI market size in 2026", source: "Grand View Research", sourceUrl: "https://www.grandviewresearch.com/" },
        { value: "37%", label: "year-over-year increase in AI investment", source: "IDC", sourceUrl: "https://www.idc.com/" },
        { value: "54%", label: "of companies report cost reduction from AI", source: "Deloitte", sourceUrl: "https://www.deloitte.com/" },
      ]},
      { title: "Business Impact", stats: [
        { value: "40%", label: "productivity improvement from AI tools", source: "Microsoft", sourceUrl: "https://www.microsoft.com/" },
        { value: "31%", label: "of companies cite AI as top investment priority", source: "Gartner", sourceUrl: "https://www.gartner.com/" },
        { value: "63%", label: "of executives expect AI to transform their industry", source: "PwC", sourceUrl: "https://www.pwc.com/" },
        { value: "5.4x", label: "ROI for AI-powered automation tools", source: "Deloitte", sourceUrl: "https://www.deloitte.com/" },
      ]},
    ],
  },
}

export function generateStaticParams() {
  const registrySlugs = getAllStatistics().map((s) => ({ slug: s.slug }))
  const legacySlugs = Object.keys(legacyStats).filter((slug) => !registrySlugs.some((r) => r.slug === slug)).map((slug) => ({ slug }))
  return [...registrySlugs, ...legacySlugs]
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const registry = getStatistic(slug)
  if (registry) return createMetadata({ title: registry.title, description: registry.description, path: `/statistics/${slug}` })
  const legacy = legacyStats[slug]
  if (legacy) return createMetadata({ title: legacy.title, description: legacy.description, path: `/statistics/${slug}` })
  return {}
}

export default async function StatPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const registry = getStatistic(slug)
  const legacy = legacyStats[slug]
  const page = registry ? {
    title: registry.title,
    description: registry.description,
    lastUpdated: registry.updatedAt || registry.publishedAt,
    sections: registry.sections.map((s) => ({
      title: s.title,
      stats: s.stats.map((st) => ({ value: st.value, label: st.label, source: st.source, sourceUrl: st.sourceUrl || "#" })),
    })),
  } : legacy

  if (!page) notFound()

  return (
    <>
      <ArticleSchema title={page.title} description={page.description} publishedAt="2026-01-15" author="PilotStack Team" url={`${site.url}/statistics/${slug}`} />
      <WebPageSchema name={page.title} description={page.description} url={`${site.url}/statistics/${slug}`} mainEntity={{ "@type": "Dataset", name: page.title, description: page.description }} />
      <BreadcrumbSchema items={[{ name: "Home", href: "/" }, { name: "Statistics", href: "/statistics" }, { name: page.title, href: `/statistics/${slug}` }]} />
      <Container className="pt-8">
        <Breadcrumbs items={[{ name: "Statistics", href: "/statistics" }, { name: page.title }]} />
      </Container>
      <Section className="pt-0">
        <Container>
          <div className="max-w-4xl mx-auto">
            <Badge variant="default" className="mb-4">Research Data</Badge>
            <h1 className="text-4xl font-bold tracking-tight mb-4">{page.title}</h1>
            <p className="text-lg text-muted-foreground mb-8 text-pretty">{page.description}</p>

            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-10 pb-6 border-b border-border">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /></svg>
              <span>Last updated: {page.lastUpdated}</span>
              <span className="text-border-light">|</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
              <span>{page.sections.reduce((a, s) => a + s.stats.length, 0)} data points</span>
            </div>

            {page.sections.map((section) => (
              <section key={section.title} className="mb-12">
                <h2 className="text-2xl font-bold tracking-tight mb-6">{section.title}</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {section.stats.map((stat) => (
                    <div key={stat.label} className="rounded-xl border border-border bg-card p-5 hover:border-primary/20 transition-colors">
                      <div className="text-3xl sm:text-4xl font-bold gradient-text mb-1">{stat.value}</div>
                      <p className="text-sm text-muted-foreground mb-3">{stat.label}</p>
                      <a href={stat.sourceUrl} target="_blank" rel="noopener noreferrer nofollow" className="inline-flex items-center gap-1 text-xs text-primary hover:underline">
                        Source: {stat.source} <ExternalLink size={10} />
                      </a>
                    </div>
                  ))}
                </div>
              </section>
            ))}

            <div className="mt-12 p-5 rounded-xl bg-surface-secondary border border-border text-xs text-muted-foreground">
              <p className="font-semibold text-foreground mb-2">Methodology & Data Sources</p>
              <p className="leading-relaxed">Statistics on this page are compiled from publicly available industry reports, analyst research, and vendor-published data. All sources are linked for verification. Data is updated annually or when new reports are published. PilotStack does not guarantee the accuracy of third-party data. See our <Link href="/methodology" className="text-primary hover:underline">research methodology</Link> for details.</p>
            </div>

            <div className="mt-8 text-center">
              <Link href="/statistics" className="inline-flex items-center gap-1 text-sm text-primary hover:underline">
                View all statistics <ArrowRight size={12} />
              </Link>
            </div>
          </div>
        </Container>
      </Section>
    </>
  )
}
