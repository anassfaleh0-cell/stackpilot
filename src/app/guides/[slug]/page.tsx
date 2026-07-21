import { Container } from "@/components/ui/container"
import { Badge } from "@/components/ui/badge"
import { Breadcrumbs } from "@/components/seo/breadcrumbs"
import { BreadcrumbSchema, HowToSchema, WebPageSchema, ArticleSchema, FAQSchema, OrganizationSchema } from "@/components/seo/json-ld"
import { site, categories } from "@/lib/constants"
import { createMetadata } from "@/lib/metadata"
import { truncate, formatDate } from "@/lib/utils"
import { getGuide, getContentTitle } from "@/lib/content/registry"
import { getAllGuides } from "@/lib/content/registry"
import { InternalLinks } from "@/components/content/internal-links"
import { notFound } from "next/navigation"
import Link from "next/link"
import { EditorialHero, EditorialSectionIllustration, GlassCard, InfoCard } from "@/components/dynamic"
import { EditorialProcess, RelatedContent } from "@/components/dynamic-client"
import { EEATProcess } from "@/components/seo/editorial-process"
import { BrandDivider } from "@/components/brand/patterns"
import { CheckCircle2, BookOpen, Clock, Layers, Lightbulb } from "lucide-react"

export function generateStaticParams() {
  return getAllGuides().map((g) => ({ slug: g.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const guide = getGuide(slug)
  if (!guide) return {}
  const seoDesc = truncate(guide.description, 160)
  return createMetadata({ title: truncate(guide.title, 60), description: seoDesc, path: `/guides/${slug}`, ogType: "article", publishedAt: guide.lastUpdated, updatedAt: guide.lastUpdated, articleSection: guide.category, readingTime: guide.readingTime })
}

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const guide = getGuide(slug)
  if (!guide) notFound()

  return (
    <>
      <BreadcrumbSchema items={[{ name: "Home", href: "/" }, { name: "Guides", href: "/guides" }, { name: guide.title, href: `/guides/${slug}` }]} />
      <HowToSchema name={guide.title} description={guide.description} steps={guide.sections.map((s) => ({ name: s.title, text: s.body }))} />
      <ArticleSchema title={guide.title} description={guide.description} publishedAt={guide.lastUpdated} updatedAt={guide.lastUpdated} author={guide.author} url={`${site.url}/guides/${slug}`} wordCount={guide.sections.reduce((a, s) => a + s.body.split(/\s+/).length, 0)} category={guide.category} />
      <OrganizationSchema />
      <FAQSchema questions={guide.sections.slice(0, 5).map(s => ({ question: s.title, answer: truncate(s.body, 120) }))} path={`/guides/${slug}`} />
      <WebPageSchema name={guide.title} description={guide.description} url={`${site.url}/guides/${slug}`} dateModified={guide.lastUpdated} mainEntity={guide.relatedTools.length > 0 ? { "@type": "ItemList", itemListElement: guide.relatedTools.map((t, i) => ({ "@type": "ListItem", position: i + 1, item: { "@type": "SoftwareApplication", name: getContentTitle("review", t) || t, url: `${site.url}/reviews/${t}` } })) } : undefined} />
      <Container className="pt-8">
        <Breadcrumbs items={[{ name: "Guides", href: "/guides" }, { name: guide.title }]} />
      </Container>
      <article className="pb-16">
        <Container>
          <div className="max-w-3xl mx-auto">
            {/* Hero */}
            <div className="mb-6">
              <EditorialHero
                slug={guide.slug}
                title={guide.title}
                subtitle={guide.description}
                category={guide.category}
                variant="guide"
                className="w-full min-h-[180px] sm:min-h-[220px]"
              />
            </div>

            {/* Meta bar */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <Badge variant="default">{guide.category}</Badge>
              <Badge variant={guide.difficulty === "Beginner" ? "success" : guide.difficulty === "Intermediate" ? "warning" : "danger"}>
                {guide.difficulty}
              </Badge>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock size={12} /> {guide.readingTime} min read
              </span>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Layers size={12} /> {guide.sections.length} sections
              </span>
            </div>

            {/* Author & metadata */}
            <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mb-6">
              <span className="flex items-center gap-1">
                <svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                By {guide.author}
              </span>
              <span className="flex items-center gap-1">
                <svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /></svg>
                Updated {formatDate(guide.lastUpdated)}
              </span>
              <a href="/methodology" className="hover:text-primary transition-colors underline underline-offset-2">Our methodology</a>
            </div>

            {/* Quick info cards */}
            <div className="grid sm:grid-cols-3 gap-3 mb-8">
              <InfoCard icon={<Clock size={16} stroke="var(--primary)" />} value={`${guide.readingTime} min`} title="Reading Time" />
              <InfoCard icon={
                <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 3v18h18M7 16l4-8 4 4 4-6" />
                </svg>
              } value={guide.sections.length.toString()} title="Sections" />
              <InfoCard icon={
                <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707" />
                </svg>
              } value={guide.difficulty} title="Difficulty" />
            </div>

            {/* EEAT Process */}
            <EEATProcess category={guide.category} />

            {/* Process architecture */}
            <EditorialProcess sections={guide.sections} slug={guide.slug} category={guide.category} />

            <BrandDivider />

            {/* Content sections with timeline */}
            <div className="space-y-12 mt-4">
              {guide.sections.map((section, i) => (
                <section key={i} className="scroll-mt-24" id={`section-${i}`}>
                  <EditorialSectionIllustration slug={guide.slug} category={guide.category} index={i} />
                  <h2 className="text-xl font-semibold tracking-tight mb-4 flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white text-sm font-bold shrink-0">{i + 1}</span>
                    {section.title}
                  </h2>
                  {section.type === "list" && section.items ? (
                    <>
                      {section.body && (
                        <p className="text-muted-foreground leading-relaxed mb-4 pl-11">{section.body}</p>
                      )}
                      <div className="space-y-3 pl-11">
                        {section.items.map((item, j) => (
                          <div key={j} className="flex items-start gap-3 text-sm">
                            <CheckCircle2 size={16} className="text-success shrink-0 mt-0.5" />
                            <span className="text-foreground">{item}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : section.type === "checklist" && section.body ? (
                    <div className="space-y-3 pl-11">
                      {section.body.split("?").filter(Boolean).map((item, j) => (
                        <div key={j} className="flex items-start gap-3 text-sm">
                          <CheckCircle2 size={16} className="text-primary shrink-0 mt-0.5" />
                          <span className="text-foreground">{item}{item.trim().endsWith("?") ? "" : "?"}</span>
                        </div>
                      ))}
                    </div>
                  ) : section.type === "table" && section.columns && section.rows ? (
                    <div className="overflow-x-auto pl-11">
                      <table className="w-full text-sm border-collapse">
                        <thead>
                          <tr className="border-b border-border">
                            {section.columns.map((col, j) => (
                              <th key={j} className="text-left py-2 px-3 font-semibold text-foreground">{col}</th>
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
                  ) : (
                    <p className="text-muted-foreground leading-relaxed pl-11">{section.body}</p>
                  )}

                  {/* Expert tip every 3 sections */}
                  {i % 3 === 2 && (
                    <div className="mt-6 ml-11 rounded-xl border border-accent/20 bg-accent-subtle/30 p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Lightbulb size={14} className="text-accent" />
                        <span className="text-xs font-semibold text-accent">Expert tip</span>
                      </div>
                      <p className="text-sm text-foreground">
                        {section.items
                          ? `When working through "${section.title}", focus on the areas most relevant to your specific use case.`
                          : `This section is foundational — take time to understand it before moving forward.`
                        }
                      </p>
                    </div>
                  )}
                </section>
              ))}
            </div>

            <BrandDivider />

            {/* Guide Summary */}
            <div className="mt-4">
              <GlassCard>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <BookOpen size={16} className="text-primary" />
                    <span className="font-semibold text-sm">Guide Summary</span>
                  </div>
                  <div className="grid sm:grid-cols-3 gap-4">
                    {guide.sections.slice(0, 3).map((s, i) => (
                      <div key={i} className="text-sm">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary-subtle text-primary text-xs font-bold shrink-0">{i + 1}</span>
                          <span className="font-medium text-xs">{s.title}</span>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed ml-7">{s.body.slice(0, 100).trim()}...</p>
                      </div>
                    ))}
                  </div>
                </div>
              </GlassCard>
            </div>

            <InternalLinks category={guide.category} excludeSlug={guide.slug} />

            {(() => {
              const cat = categories.find(c => c.name === guide.category)
              if (!cat) return null
              return (
                <section className="mt-16">
                  <h2 className="text-2xl font-bold tracking-tight mb-6">Related Categories</h2>
                  <div className="flex flex-wrap gap-2">
                    {categories.filter(c => c.name !== guide.category).slice(0, 6).map(c => (
                      <Link key={c.slug} href={`/category/${c.slug}`} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-border text-xs text-muted-foreground hover:text-primary hover:border-primary/30 transition-colors">
                        {c.name}
                      </Link>
                    ))}
                  </div>
                </section>
              )
            })()}
          </div>
        </Container>
      </article>
    </>
  )
}
