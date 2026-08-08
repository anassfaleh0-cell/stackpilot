import { Container } from "@/components/ui/container"
import { Badge } from "@/components/ui/badge"
import { Breadcrumbs } from "@/components/seo/breadcrumbs"
import { BreadcrumbSchema, ArticleSchema, FAQSchema, WebPageSchema } from "@/components/seo/json-ld"
import { site } from "@/lib/constants"
import { createMetadata } from "@/lib/metadata"
import { getResearch, getAllResearch, getAllComparisons, getContentTitle } from "@/lib/content/registry"
import { notFound } from "next/navigation"
import { ExternalLink, Clock, User, Calendar, CheckCircle2, Lightbulb } from "lucide-react"
import { EditorialHero, GlassCard } from "@/components/dynamic"
import { RelatedContent } from "@/components/dynamic-client"

export function generateStaticParams() {
  return getAllResearch().map((r) => ({ slug: r.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const report = getResearch(slug)
  if (!report) return {}
  return createMetadata({ title: report.title, description: report.description, path: `/research/${report.slug}`, ogType: "article", publishedAt: report.publishedAt, updatedAt: report.updatedAt, articleSection: report.category })
}

export default async function ResearchPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const report = getResearch(slug)
  if (!report) notFound()

  return (
    <>
      <BreadcrumbSchema items={[{ name: "Home", href: "/" }, { name: "Research", href: "/research" }, { name: report.title, href: `/research/${slug}` }]} />
      <ArticleSchema title={report.title} description={report.description} publishedAt={report.publishedAt} updatedAt={report.updatedAt || report.publishedAt} author={report.author} url={`${site.url}/research/${slug}`} />
      <WebPageSchema name={report.title} description={report.description} url={`${site.url}/research/${slug}`} mainEntity={{ "@type": "Report", name: report.title, description: report.description, category: report.category }} />
      {report.faqs && report.faqs.length > 0 && <FAQSchema questions={report.faqs} path={`/research/${slug}`} />}
      <Container className="pt-8">
        <Breadcrumbs items={[{ name: "Research", href: "/research" }, { name: report.title }]} />
      </Container>
      <article className="pb-16">
        <Container>
          <div className="mb-8">
            <EditorialHero slug={report.slug} title={report.title} subtitle={report.description} category={report.category} variant="review" className="w-full min-h-[200px] sm:min-h-[240px]" />
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mb-4 pb-4 border-b border-border">
            <Badge variant="default">{report.reportType}</Badge>
            <span className="flex items-center gap-1"><User size={12} />{report.author}</span>
            <span className="flex items-center gap-1"><Calendar size={12} />{report.publishedAt}</span>
            <span className="flex items-center gap-1"><Clock size={12} />{report.readingTime} min read</span>
            <a href="/research-methodology" className="hover:text-primary transition-colors underline underline-offset-2">Methodology</a>
          </div>

          <div className="mb-6 p-3 rounded-lg bg-primary-subtle/10 border border-primary/20 text-xs text-muted-foreground">
            <span className="font-semibold text-foreground">Data compiled by PilotStack</span>
            {" — "}Original research with verified data sources. Free to cite with attribution.
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              {report.keyFindings.length > 0 && (
                <section className="mb-10 p-5 rounded-xl border border-primary/20 bg-primary-subtle/10">
                  <div className="flex items-center gap-2 mb-3">
                    <Lightbulb size={16} className="text-primary" />
                    <h2 className="text-lg font-bold">Key Findings</h2>
                  </div>
                  <ul className="space-y-2">
                    {report.keyFindings.map((finding, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                        <CheckCircle2 size={14} className="text-primary mt-0.5 shrink-0" />
                        <span>{finding}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {report.sections.map((section, i) => (
                <section key={i} className="mb-10">
                  <h2 className="text-2xl font-bold tracking-tight mb-4">{section.title}</h2>
                  {section.type === "list" && section.items ? (
                    <>
                      <p className="text-muted-foreground leading-relaxed mb-4">{section.body}</p>
                      <ul className="space-y-2">
                        {section.items.map((item, j) => (
                          <li key={j} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <CheckCircle2 size={14} className="text-success mt-0.5 shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </>
                  ) : section.type === "table" && section.columns && section.rows ? (
                    <>
                      {section.body && <p className="text-muted-foreground leading-relaxed mb-4">{section.body}</p>}
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm border-collapse">
                          <thead>
                            <tr className="border-b border-border">
                              {section.columns.map((col, j) => (
                                <th key={j} scope="col" className="text-left py-2 px-3 font-semibold text-foreground">{col}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {section.rows.map((row, j) => (
                              <tr key={j} className="border-b border-border/50 hover:bg-accent-subtle/20 transition-colors">
                                {row.map((cell, k) => (
                                  <td key={k} className="py-2.5 px-3 text-muted-foreground">{cell}</td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </>
                  ) : (
                    <p className="text-muted-foreground leading-relaxed">{section.body}</p>
                  )}
                </section>
              ))}

              <section className="mb-10 p-5 rounded-xl border border-border">
                <h2 className="text-lg font-bold mb-3">Methodology</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">{report.methodology}</p>
                {report.dataSources.length > 0 && (
                  <div className="mt-3">
                    <h3 className="font-semibold text-sm mb-2">Data Sources</h3>
                    <ul className="space-y-1">
                      {report.dataSources.map((source, i) => (
                        <li key={i}>
                          <a href={source.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-primary hover:underline">
                            {source.name} <ExternalLink size={10} />
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </section>

              {report.faqs && report.faqs.length > 0 && (
                <section className="mb-10">
                  <h2 className="text-2xl font-bold tracking-tight mb-4">Frequently Asked Questions</h2>
                  <div className="space-y-4">
                    {report.faqs.map((faq, i) => (
                      <div key={i} className="p-4 rounded-xl border border-border">
                        <h3 className="font-semibold text-sm mb-2">{faq.question}</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">{faq.answer}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>

            <aside className="lg:col-span-1">
              <div className="sticky-sidebar space-y-6">
                <GlassCard>
                  <div className="p-4">
                    <h3 className="font-semibold mb-3 text-sm">Report Details</h3>
                    <div className="space-y-2 text-xs text-muted-foreground">
                      <p>Type: <span className="text-foreground">{report.reportType}</span></p>
                      <p>Published: <span className="text-foreground">{report.publishedAt}</span></p>
                      <p>Reading time: <span className="text-foreground">{report.readingTime} min</span></p>
                      <p>Author: <span className="text-foreground">{report.author}</span></p>
                    </div>
                  </div>
                </GlassCard>

                {report.keyFindings.length > 0 && (
                  <GlassCard>
                    <div className="p-4">
                      <h3 className="font-semibold mb-3 text-sm">Key Findings</h3>
                      <ul className="space-y-1.5">
                        {report.keyFindings.map((finding, i) => (
                          <li key={i} className="text-xs text-muted-foreground flex items-start gap-1.5">
                            <span className="text-primary mt-0.5">•</span>
                            <span>{finding.length > 80 ? finding.slice(0, 80) + "..." : finding}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </GlassCard>
                )}

                <GlassCard>
                  <div className="p-4">
                    <h3 className="font-semibold mb-3 text-sm">Share</h3>
                    <p className="text-xs text-muted-foreground">Found this useful? Share it with your network.</p>
                  </div>
                </GlassCard>
              </div>
            </aside>
          </div>

          <RelatedContent
            items={[
              ...(report.relatedComparisons || []).filter(s => getAllComparisons().some(c => c.slug === s)).map(s => ({ slug: s, type: "comparison" as const, title: getContentTitle("comparison", s) ?? undefined })),
              ...(report.relatedGuides || []).filter(s => getContentTitle("guide", s)).map(s => ({ slug: s, type: "guide" as const, title: getContentTitle("guide", s) ?? undefined })),
              ...(report.relatedPosts || []).filter(s => getContentTitle("blog", s)).map(s => ({ slug: s, type: "blog" as const, title: getContentTitle("blog", s) ?? undefined })),
            ]}
            title="Related Resources"
          />
        </Container>
      </article>
    </>
  )
}
