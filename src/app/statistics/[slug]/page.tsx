import React from "react"
import { Container, Section } from "@/components/ui/container"
import { Badge } from "@/components/ui/badge"
import { Breadcrumbs } from "@/components/seo/breadcrumbs"
import { BreadcrumbSchema, ArticleSchema, WebPageSchema, DatasetSchema } from "@/components/seo/json-ld"
import { site } from "@/lib/constants"
import { createMetadata } from "@/lib/metadata"
import { getStatistic, getAllStatistics } from "@/lib/content/registry"
import { getSafeStatisticNarrative } from "@/lib/content/statistic-narrative"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowRight, ExternalLink, Code } from "lucide-react"
import { isNoindexed } from "@/lib/noindex"
import { InFeedAd } from "@/components/ads"

function statisticDescription(title: string, category?: string): string {
  const subject = category?.trim() || "software"
  return `${title} is a source-checking guide for ${subject} software research. Verify original reports, market definitions, reporting periods, and survey populations before relying on figures. Numeric values are shown only when source provenance is documented.`
}

// Published content is built ahead of time so Workers never render JSON-backed pages on demand.
export const dynamic = "force-static"
export const dynamicParams = false

export function generateStaticParams() {
  return getAllStatistics().map((item) => ({ slug: item.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const registry = getStatistic(slug)
  if (registry) {
    const noindexed = isNoindexed("statistics", slug)
    return createMetadata({ title: registry.title, description: statisticDescription(registry.title, registry.category), path: `/statistics/${slug}`, ogType: "article", publishedAt: registry.publishedAt, updatedAt: registry.updatedAt, articleSection: registry.category, noIndex: noindexed })
  }
  return {}
}

export default async function StatPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const registry = getStatistic(slug)
  const page = registry ? {
    title: registry.title,
    description: statisticDescription(registry.title, registry.category),
    lastUpdated: registry.updatedAt || registry.publishedAt,
    sections: registry.sections.map((s) => ({
      title: s.title,
      body: s.body,
      stats: s.stats.map((st) => ({ value: st.value, label: st.label, source: st.source, sourceUrl: typeof st.sourceUrl === "string" && /^https?:\/\//i.test(st.sourceUrl) ? st.sourceUrl : "" })),
    })),
  } : null

  if (!page) notFound()

  const ignoredTerms = new Set(["software", "market", "statistics", "guide", "guides", "2026", "data", "industry", "industries", "business", "businesses", "report", "reports"])
  const toTerms = (value: string) => new Set(value.toLowerCase().split(/[^a-z0-9]+/).filter((term) => term.length > 3 && !ignoredTerms.has(term)))
  const currentTerms = toTerms(`${slug} ${page.title} ${page.description} ${registry?.category || ""}`)
  const relatedStatistics = getAllStatistics()
    .filter((item) => item.slug !== slug)
    .map((item) => {
      const candidateTerms = toTerms(`${item.slug} ${item.title} ${item.description} ${item.category || ""}`)
      const overlap = [...currentTerms].filter((term) => candidateTerms.has(term)).length
      const sameCategory = Boolean(registry?.category && item.category && registry.category.toLowerCase() === item.category.toLowerCase())
      return { item, score: overlap * 3 + (sameCategory ? 5 : 0) }
    })
    .sort((a, b) => b.score - a.score || a.item.title.localeCompare(b.item.title))
    .slice(0, 8)

  return (
    <>
      <ArticleSchema title={page.title} description={page.description} publishedAt={registry?.publishedAt || "2026-01-15"} author="PilotStack Team" url={`${site.url}/statistics/${slug}`} />
      <WebPageSchema name={page.title} description={page.description} url={`${site.url}/statistics/${slug}`} mainEntity={{ "@type": "Dataset", name: page.title, description: page.description }} />
      <DatasetSchema name={page.title} description={page.description} url={`${site.url}/statistics/${slug}`} datePublished={registry?.publishedAt || undefined} dateModified={registry?.updatedAt || undefined} keywords={[page.title, "software statistics", "market data"]} />
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

            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-6 pb-4 border-b border-border">
              <svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /></svg>
              <span>Last updated: {page.lastUpdated}</span>
              <span className="text-border-light">|</span>
              <svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
              <span>{page.sections.reduce((a, s) => a + s.stats.length, 0)} statistic records</span>
            </div>

            <div className="mb-6 p-3 rounded-lg bg-primary-subtle/10 border border-primary/20 text-xs text-muted-foreground">
              <span className="font-semibold text-foreground">Source-linked statistics</span>
              {" — "}Source links may lead to publisher pages rather than the exact original report. Figures without a direct source link are withheld until they can be checked; confirm the exact number, definition, geography, and publication date before relying on a number. Last updated {page.lastUpdated}.
            </div>

            {page.sections.map((section, i) => (
              <React.Fragment key={section.title}>
                <section className="mb-12">
                  <h2 className="text-2xl font-bold tracking-tight mb-6">{section.title}</h2>
                  {section.body ? (
                    <div className="mb-5 text-sm text-muted-foreground leading-relaxed space-y-3">
                      {getSafeStatisticNarrative(section.title, registry?.category || "software", section.body, registry?.sourceAuditComplete === true).split(/\n+/).filter(Boolean).map((para, idx) => (
                        <p key={idx}>{para}</p>
                      ))}
                    </div>
                  ) : null}
                  <div className="grid sm:grid-cols-2 gap-4">
                    {section.stats.map((stat) => {
                      const sourceVerified = registry?.sourceAuditComplete === true && Boolean(stat.sourceUrl)
                      return (
                        <div key={stat.label} className="rounded-xl border border-border bg-card p-5 hover:border-primary/20 transition-colors">
                          {sourceVerified ? <div className="text-3xl sm:text-4xl font-bold gradient-text mb-1">{stat.value}</div> : <div className="text-lg font-semibold text-muted-foreground mb-1">Figure not verified</div>}
                          <p className="text-sm text-muted-foreground mb-3">{stat.label}</p>
                          {sourceVerified && stat.sourceUrl ? (
                            <a href={stat.sourceUrl} target="_blank" rel="noopener noreferrer nofollow" className="inline-flex items-center gap-1 text-xs text-primary hover:underline">
                              Source: {stat.source} <ExternalLink size={10} />
                            </a>
                          ) : (
                            <div className="text-xs text-muted-foreground space-y-2">
                              <p>Source named: {stat.source || "not recorded"}. The numeric value remains unverified until the original report or dataset is checked.</p>
                              {stat.sourceUrl ? <a href={stat.sourceUrl} target="_blank" rel="noopener noreferrer nofollow" className="inline-flex items-center gap-1 text-primary hover:underline">Open publisher source <ExternalLink size={10} /></a> : null}
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </section>
                {registry?.sourceAuditComplete === true && page.sections.some((section) => section.stats.length > 0) && i === Math.floor(page.sections.length / 2) - 1 && page.sections.length >= 3 && (
                  <section className="my-10">
                    <InFeedAd className="mx-auto max-w-[728px]" />
                  </section>
                )}
              </React.Fragment>
            ))}

            <section className="mb-10 p-5 rounded-xl border border-primary/20 bg-primary-subtle/10">
              <h2 className="text-lg font-bold mb-3">How to interpret these statistics</h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                The figures above are comparison points, not a single performance benchmark. Before using a statistic in a buying or strategy decision, check the reporting period, geography, sample or market definition, and whether the source measures vendors, organizations, users, or revenue.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Sources can use different methodologies and time windows. A higher or lower figure should therefore be interpreted in context rather than combined with another source as though both measured exactly the same population. For decisions about a specific vendor, use these industry figures as background and verify the vendor's current documentation separately.
              </p>
            </section>

            <div className="mt-12 p-5 rounded-xl bg-surface-secondary border border-border text-xs text-muted-foreground">
              <p className="font-semibold text-foreground mb-2">Methodology & Data Sources</p>
              <p className="leading-relaxed">Statistics shown here come from stored content records. Source attribution may identify a publisher without linking to the exact report; where a direct source URL is missing, the numeric figure is withheld. Update dates describe the content record and do not guarantee annual re-verification. See our <Link href="/methodology" className="text-primary hover:underline">research methodology</Link> for details.</p>
            </div>

            <section className="mt-12 mb-10" aria-labelledby="related-market-research">
              <h2 id="related-market-research" className="text-xl font-bold tracking-tight mb-3">Related market research</h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">Explore adjacent research topics and compare definitions carefully. Check the original report, geography, population, and reporting period before using figures in a business decision.</p>
              <div className="grid sm:grid-cols-2 gap-3">
                {relatedStatistics.map(({ item }) => (
                  <Link key={item.slug} href={`/statistics/${item.slug}`} className="rounded-lg border border-border p-4 hover:border-primary/30 transition-colors">
                    <span className="block text-sm font-semibold text-foreground mb-1">{item.title}</span>
                    <span className="block text-xs text-muted-foreground leading-relaxed">{item.category || "Market research"}</span>
                  </Link>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-3">Browse the <Link href="/statistics" className="text-primary hover:underline">full research guide directory</Link> for other categories.</p>
            </section>

            <div className="mt-6 p-5 rounded-xl bg-surface-secondary border border-border text-xs">
              <p className="font-semibold text-foreground mb-3 flex items-center gap-1.5"><Code size={14} /> Embed this page</p>
              <p className="text-muted-foreground mb-3">Copy the HTML below to link to this statistics page with attribution on your website or blog.</p>
              <pre className="overflow-x-auto rounded-lg bg-card border border-border p-3 text-[11px] leading-relaxed text-muted-foreground font-mono select-all">
                {`<a href="${site.url}/statistics/${slug}" target="_blank" rel="noopener">${page.title}</a>\n<small>Data compiled by <a href="${site.url}" target="_blank" rel="noopener">PilotStack</a></small>`}
              </pre>
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
