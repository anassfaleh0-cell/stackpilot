import { Container } from "@/components/ui/container"
import { Badge } from "@/components/ui/badge"
import { Breadcrumbs } from "@/components/seo/breadcrumbs"
import { BreadcrumbSchema, SoftwareSchema, ReviewSchema, FAQSchema } from "@/components/seo/json-ld"
import { Card } from "@/components/ui/card"
import { site } from "@/lib/constants"
import { createMetadata } from "@/lib/metadata"
import { getReview } from "@/lib/content/registry"
import { getAllReviews } from "@/lib/content/registry"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Star, Check, X, ExternalLink, ThumbsUp, AlertTriangle, ChevronRight } from "lucide-react"

export function generateStaticParams() {
  return getAllReviews().map((r) => ({ slug: r.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const tool = getReview(slug)
  if (!tool) return {}
  return createMetadata({
    title: `${tool.name} Review 2026`,
    description: `Read our in-depth ${tool.name} review. Expert analysis, features, pricing, pros & cons, and alternatives. ${tool.tagline}`,
    path: `/reviews/${tool.slug}`,
    ogType: "article",
    publishedAt: tool.lastReviewed,
  })
}

export default async function ReviewPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const tool = getReview(slug)
  if (!tool) notFound()

  const alternatives = getAllReviews().filter((r) => r.slug !== tool.slug).slice(0, 4)

  return (
    <>
      <BreadcrumbSchema items={[
        { name: "Home", href: "/" },
        { name: "Reviews", href: "/reviews" },
        { name: tool.name, href: `/reviews/${tool.slug}` },
      ]} />
      <ReviewSchema name={tool.name} description={tool.description} rating={tool.rating} reviewCount={tool.reviewCount} url={`${site.url}/reviews/${tool.slug}`} />
      <SoftwareSchema name={tool.name} description={tool.tagline} applicationCategory="BusinessApplication" />
      <FAQSchema questions={tool.faqs} />

      <Container className="pt-8">
        <Breadcrumbs items={[{ name: "Reviews", href: "/reviews" }, { name: tool.name }]} />
      </Container>

      <article>
        <Container>
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <Badge variant="default">{tool.category}</Badge>
                <div className="flex items-center gap-1 text-sm">
                  <Star size={14} className="fill-amber-400 text-amber-400" />
                  <span className="font-semibold">{tool.rating}</span>
                  <span className="text-muted">/ 5.0</span>
                  <span className="text-xs text-muted">({tool.reviewCount} reviews)</span>
                </div>
              </div>
              <h1 className="text-4xl font-bold tracking-tight mb-4">{tool.name} Review 2026</h1>
              <p className="text-lg text-muted leading-relaxed mb-8">{tool.description}</p>

              <div className="flex flex-wrap gap-3 mb-12">
                <a
                  href={`https://www.google.com/search?q=${encodeURIComponent(tool.name + " official website")}`}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary text-white hover:bg-primary-dark shadow-sm hover:shadow-md h-10 px-6 text-sm font-medium transition-all duration-200"
                >
                  Visit Website <ExternalLink size={14} />
                </a>
                <Link
                  href={`/comparisons`}
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-transparent hover:bg-muted-bg h-10 px-6 text-sm font-medium transition-all duration-200"
                >
                  Compare alternatives <ChevronRight size={14} />
                </Link>
              </div>

              <section className="mb-12">
                <h2 className="text-2xl font-bold mb-6">Pros &amp; Cons</h2>
                <div className="grid sm:grid-cols-2 gap-6">
                  <Card>
                    <div className="flex items-center gap-2 text-emerald-600 font-semibold mb-4">
                      <ThumbsUp size={16} /> Pros
                    </div>
                    <ul className="space-y-3">
                      {tool.pros.map((pro) => (
                        <li key={pro} className="flex items-start gap-2 text-sm">
                          <Check size={14} className="mt-0.5 text-emerald-500 shrink-0" />
                          <span>{pro}</span>
                        </li>
                      ))}
                    </ul>
                  </Card>
                  <Card>
                    <div className="flex items-center gap-2 text-red-600 font-semibold mb-4">
                      <AlertTriangle size={16} /> Cons
                    </div>
                    <ul className="space-y-3">
                      {tool.cons.map((con) => (
                        <li key={con} className="flex items-start gap-2 text-sm">
                          <X size={14} className="mt-0.5 text-red-500 shrink-0" />
                          <span>{con}</span>
                        </li>
                      ))}
                    </ul>
                  </Card>
                </div>
              </section>

              {tool.content.map((section, i) => (
                <section key={i} className="mb-12">
                  <h2 className="text-2xl font-bold mb-4">{section.title}</h2>
                  {section.type === "list" && section.items ? (
                    <>
                      <p className="text-muted leading-relaxed mb-4">{section.body}</p>
                      <ul className="space-y-2">
                        {section.items.map((item, j) => (
                          <li key={j} className="flex items-start gap-2 text-sm text-muted">
                            <Check size={14} className="mt-0.5 text-primary shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </>
                  ) : (
                    <p className="text-muted leading-relaxed">{section.body}</p>
                  )}
                </section>
              ))}

              <section className="mb-12">
                <h2 className="text-2xl font-bold mb-6">Feature Breakdown</h2>
                <div className="space-y-6">
                  {[
                    { label: "Core", items: tool.features.filter((f) => f.category === "Core") },
                    { label: "Collaboration", items: tool.features.filter((f) => f.category === "Collaboration") },
                    { label: "Integrations", items: tool.features.filter((f) => f.category === "Integrations") },
                  ].filter((g) => g.items.length > 0).map((group) => (
                    <div key={group.label}>
                      <h3 className="font-semibold mb-3 text-sm uppercase tracking-wider text-muted">{group.label}</h3>
                      <div className="grid sm:grid-cols-2 gap-3">
                        {group.items.map((f) => (
                          <div key={f.name} className="flex items-start gap-2 text-sm">
                            <span className="text-emerald-500 shrink-0 mt-0.5"><Check size={14} /></span>
                            <div>
                              <span className="font-medium">{f.name}</span>
                              <p className="text-xs text-muted">{f.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            <aside className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                <Card>
                  <h3 className="font-semibold mb-3">Rating Breakdown</h3>
                  <div className="space-y-3">
                    {tool.ratings.map((item) => (
                      <div key={item.label}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-muted">{item.label}</span>
                          <span className="font-medium">{item.score}/5</span>
                        </div>
                        <div className="h-1.5 bg-muted-bg rounded-full overflow-hidden">
                          <div className="h-full bg-primary rounded-full" style={{ width: `${(item.score / 5) * 100}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card>
                  <h3 className="font-semibold mb-3">Alternatives</h3>
                  <div className="space-y-2">
                    {alternatives.map((alt) => (
                      <Link key={alt.slug} href={`/reviews/${alt.slug}`} className="block text-sm text-muted hover:text-primary transition-colors">
                        {alt.name} — <span className="text-xs">{alt.rating}/5</span>
                      </Link>
                    ))}
                  </div>
                </Card>

                <Card>
                  <h3 className="font-semibold mb-3">Review Summary</h3>
                  <p className="text-sm text-muted">{tool.name} earns a {tool.rating}/5 for its exceptional feature set and user experience.</p>
                </Card>
              </div>
            </aside>
          </div>

          <section className="mt-16 mb-16">
            <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
            <div className="space-y-4 max-w-3xl">
              {tool.faqs.map((faq) => (
                <Card key={faq.question}>
                  <h3 className="font-semibold mb-2">{faq.question}</h3>
                  <p className="text-sm text-muted">{faq.answer}</p>
                </Card>
              ))}
            </div>
            <div className="mt-4 text-center">
              <p className="text-xs text-muted">
                Prices and ratings are approximate and may vary. Last updated {tool.lastReviewed}.
              </p>
            </div>
          </section>
        </Container>
      </article>
    </>
  )
}
