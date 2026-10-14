import React from "react"
import { Container, Section } from "@/components/ui/container"
import { Badge } from "@/components/ui/badge"
import { Breadcrumbs } from "@/components/seo/breadcrumbs"
import { BreadcrumbSchema, ArticleSchema, WebPageSchema } from "@/components/seo/json-ld"
import { site } from "@/lib/constants"
import { createMetadata } from "@/lib/metadata"
import { getStatistic, getAllStatistics } from "@/lib/content/registry"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowRight, ExternalLink, Code } from "lucide-react"
import { isNoindexed } from "@/lib/noindex"
import { InFeedAd } from "@/components/ads"

export function generateStaticParams() {
  return getAllStatistics().map((item) => ({ slug: item.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const registry = getStatistic(slug)
  if (!registry) return {}
  const noindexed = isNoindexed("statistics", slug)
  return createMetadata({
    title: registry.title,
    description: registry.description,
    path: `/statistics/${slug}`,
    ogType: "article",
    publishedAt: registry.publishedAt,
    updatedAt: registry.updatedAt,
    articleSection: registry.category,
    noIndex: noindexed,
  })
}

export default async function StatPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const registry = getStatistic(slug)
  if (!registry) notFound()
  const page = {
    title: registry.title,
    description: registry.description,
    lastUpdated: registry.updatedAt || registry.publishedAt,
    sections: registry.sections.map((section) => ({
      title: section.title,
      body: section.body,
      stats: section.stats.map((stat) => ({
        value: stat.value,
        label: stat.label,
        source: stat.source,
        sourceUrl: stat.sourceUrl || "#",
      })),
    })),
  }

  return (
    <>
      <ArticleSchema title={page.title} description={page.description} publishedAt={registry?.publishedAt || "2026-01-15"} author="PilotStack Team" url={`${site.url}/statistics/${slug}`} />
      <WebPageSchema name={page.title} description={page.description} url={`${site.url}/statistics/${slug}`} />
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
              <span>{page.sections.reduce((a, s) => a + s.stats.length, 0)} data points</span>
            </div>

            <div className="mb-6 p-3 rounded-lg bg-primary-subtle/10 border border-primary/20 text-xs text-muted-foreground">
              <span className="font-semibold text-foreground">Source review status</span>
              {" — "}Numeric market claims are withheld until their source, scope, date, and verification record can be checked. Last guide update: {page.lastUpdated}.
            </div>

            {page.sections.map((section, i) => (
              <React.Fragment key={section.title}>
                <section className="mb-12">
                  <h2 className="text-2xl font-bold tracking-tight mb-6">{section.title}</h2>
                  {section.body ? (
                    <div className="mb-5 text-sm text-muted-foreground leading-relaxed space-y-3">
                      {section.body.split(/\n+/).filter(Boolean).map((para, idx) => (
                        <p key={idx}>{para}</p>
                      ))}
                    </div>
                  ) : null}
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
                {i === Math.floor(page.sections.length / 2) - 1 && page.sections.length >= 3 && (
                  <section className="my-10">
                    <InFeedAd className="mx-auto max-w-[728px]" />
                  </section>
                )}
              </React.Fragment>
            ))}

            <section className="mb-10 p-5 rounded-xl border border-primary/20 bg-primary-subtle/10">
              <h2 className="text-lg font-bold mb-3">How to use this research guide</h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                Use this guide to decide which metrics matter for your category and which questions to ask vendors. Do not treat unsourced estimates or broad market claims as evidence of product quality or fit.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                When you encounter a market or ROI claim, check its original report, publication date, geography, sample, definition, and calculation. Different sources may measure different populations and cannot be combined without explaining those differences.
              </p>
            </section>

            <div className="mt-12 p-5 rounded-xl bg-surface-secondary border border-border text-xs text-muted-foreground">
              <p className="font-semibold text-foreground mb-2">Methodology & Data Sources</p>
              <p className="leading-relaxed">This page is currently a research guide while older numeric records undergo source-provenance review. Figures will be restored only when the source link and supporting methodology are documented. PilotStack does not guarantee third-party claims. See our <Link href="/methodology" className="text-primary hover:underline">research methodology</Link> for details.</p>
            </div>

            <div className="mt-6 p-5 rounded-xl bg-surface-secondary border border-border text-xs">
              <p className="font-semibold text-foreground mb-3 flex items-center gap-1.5"><Code size={14} /> Share this guide</p>
              <p className="text-muted-foreground mb-3">Use the HTML below to link to this category research guide with attribution.</p>
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
