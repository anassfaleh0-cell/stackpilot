import { Container, Section } from "@/components/ui/container"
import { Badge } from "@/components/ui/badge"
import { Card, CardTitle, CardDescription } from "@/components/ui/card"
import { Breadcrumbs } from "@/components/seo/breadcrumbs"
import { BreadcrumbSchema, CollectionPageSchema, ItemListSchema, FAQSchema, ArticleSchema } from "@/components/seo/json-ld"
import { createMetadata } from "@/lib/metadata"
import { site, categories } from "@/lib/constants"
import { getAllReviews, getAllGuides, getAllComparisons, getAllBlogPosts, getAllGlossaryTerms } from "@/lib/content/registry"
import { getCategoryKnowledge } from "@/lib/content/category-knowledge"
import { entityGraph } from "@/lib/content/entity-graph"
import { ReviewFilter } from "@/components/entity/review-filter"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Star, ArrowRight, BookOpen, GitCompare, FileText, Brain, Building2, DollarSign, Shield, Users, Search, CheckCircle2, XCircle, Lightbulb, TrendingUp, AlertTriangle, HelpCircle, ChevronRight, Sparkles } from "lucide-react"
import { BrandPattern, BrandDivider } from "@/components/brand/patterns"
import { getContentTitle } from "@/lib/content/registry"

export async function generateStaticParams() {
  return categories.map((cat) => ({ slug: cat.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const category = categories.find((c) => c.slug === slug)
  if (!category) return {}
  const knowledge = getCategoryKnowledge(slug)
  return createMetadata({
    title: `Best ${category.name} Software 2026: Reviews, Comparisons & Buying Guide`,
    description: knowledge?.description || `Discover the best ${category.name.toLowerCase()} software tools. Expert reviews, comparisons, and buying guides to help you choose the right solution.`,
    path: `/category/${slug}`,
  })
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const category = categories.find((c) => c.slug === slug)
  if (!category) notFound()

  const knowledge = getCategoryKnowledge(slug)
  const reviews = getAllReviews().filter((r) => r.category === category.name)
  const guides = getAllGuides().filter((g) => g.category === category.name)
  const comparisons = getAllComparisons().filter((c) => c.category === category.name)
  const posts = getAllBlogPosts().filter((p) => p.category === category.name)
  const glossary = getAllGlossaryTerms().filter((t) => t.category === category.name)
  const bestPick = [...reviews].sort((a, b) => b.rating - a.rating)[0]

  const catGraph = entityGraph.getCategoryGraph(category.name)
  const buyerJourney = entityGraph.getBuyerJourneyPath(category.name)

  const smbPick = [...reviews].filter((r) => r.pricing === "Freemium" || r.pricing === "Free" || r.pricing === "Free Trial").sort((a, b) => b.rating - a.rating)[0]
  const enterprisePick = comparisons.length > 0 ? comparisons[0] : null
  const aiPick = reviews.find((r) => r.name.toLowerCase().includes("ai") || r.category.toLowerCase().includes("ai"))
  const freePick = reviews.find((r) => r.pricing === "Free" || r.pricing === "Freemium")

  return (
    <>
      <CollectionPageSchema name={category.name} description={`Best ${category.name.toLowerCase()} software tools`} url={`${site.url}/category/${category.slug}`} />
      {reviews.length > 0 && <ItemListSchema items={reviews.map(r => ({ name: r.name, url: `${site.url}/reviews/${r.slug}` }))} url={`${site.url}/category/${category.slug}`} />}
      {knowledge?.faqs && <FAQSchema questions={knowledge.faqs} />}
      <BreadcrumbSchema items={[{ name: "Home", href: "/" }, { name: category.name, href: `/category/${slug}` }]} />
      <Container className="pt-8">
        <Breadcrumbs items={[{ name: "Software Categories", href: "/reviews" }, { name: category.name }]} />
      </Container>

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <BrandPattern variant="grid" opacity={0.25} className="text-primary" />
        <Container className="relative py-12 sm:py-16">
          <Badge variant="default" className="mb-4">{category.count} Tools Reviewed</Badge>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
            Best {category.name} Software 2026
          </h1>
          {knowledge?.longDescription ? (
            <p className="text-lg text-muted-foreground max-w-3xl text-pretty leading-relaxed">
              {knowledge.longDescription}
            </p>
          ) : (
            <p className="text-lg text-muted-foreground max-w-2xl text-pretty">
              Our expert picks for the best {category.name.toLowerCase()} tools. Each reviewed and rated by our team.
            </p>
          )}
        </Container>
      </section>

      <div className="grid lg:grid-cols-[1fr_300px] gap-8">
        {/* Main Content */}
        <div>
          {/* Market Overview */}
          {knowledge?.marketOverview && (
            <Section>
              <Container>
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp size={20} className="text-primary" />
                  <h2 className="text-2xl font-bold">Market Overview</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed text-pretty">{knowledge.marketOverview}</p>
              </Container>
            </Section>
          )}

          {/* Best Pick */}
          {bestPick && (
            <Section>
              <Container>
                <div className="rounded-xl border border-primary/20 bg-primary-subtle/50 p-6 sm:p-8">
                  <Badge variant="default" className="mb-3">Best in {category.name} 2026</Badge>
                  <h2 className="text-2xl font-bold mb-2">{bestPick.name}</h2>
                  <p className="text-muted-foreground mb-4">{bestPick.tagline}</p>
                  <div className="flex flex-wrap items-center gap-4 text-sm mb-4">
                    <span className="flex items-center gap-1"><Star size={14} className="fill-accent text-accent" /> {bestPick.rating}/5</span>
                    {bestPick.priceRange && <span className="text-muted-foreground flex items-center gap-1"><DollarSign size={14} />{bestPick.priceRange}</span>}
                    <span className="text-muted-foreground">{bestPick.pricing}</span>
                  </div>
                  <Link href={`/reviews/${bestPick.slug}`} className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
                    Read full review <ArrowRight size={12} />
                  </Link>
                </div>
              </Container>
            </Section>
          )}

          {/* AI Search Overview */}
          <Section>
            <Container>
              <div className="flex items-center gap-2 mb-4">
                <Sparkles size={20} className="text-primary" />
                <h2 className="text-2xl font-bold">AI Search Overview</h2>
              </div>
              <div className="rounded-xl border border-primary/10 bg-primary-subtle/30 p-5 space-y-3" itemScope itemType="https://schema.org/Article">
                <meta itemProp="name" content={`Best ${category.name} Software 2026`} />
                <meta itemProp="description" content={knowledge?.longDescription?.slice(0, 300) || knowledge?.description || ""} />
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {knowledge?.description}
                </p>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground mb-1">Key Entities</p>
                    <div className="flex flex-wrap gap-1">
                      {[...reviews.slice(0, 8)].map((r) => (
                        <span key={r.slug} className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">{r.name}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground mb-1">Related Topics</p>
                    <div className="flex flex-wrap gap-1">
                      {knowledge?.decisionFactors?.slice(0, 5).map((f, i) => (
                        <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-muted-bg text-muted-foreground">{f.factor}</span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="pt-2 border-t border-border/50">
                  <p className="text-xs text-muted-foreground">
                    Category: <strong>{category.name}</strong> · {reviews.length} tools · {guides.length} guides · {comparisons.length} comparisons · {glossary.length} glossary terms
                  </p>
                </div>
              </div>
            </Container>
          </Section>

          {/* Buyer Journey */}
          {buyerJourney.length > 0 && (
            <Section>
              <Container>
                <div className="flex items-center gap-2 mb-6">
                  <Search size={20} className="text-primary" />
                  <h2 className="text-2xl font-bold">Your Buying Journey</h2>
                </div>
                <div className="space-y-4">
                  {buyerJourney.map((stage) => (
                    <details key={stage.stage} className="group rounded-xl border border-border overflow-hidden">
                      <summary className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted-bg transition-colors font-medium capitalize">
                        <span className="flex items-center gap-2">
                          {stage.stage === "awareness" && <Lightbulb size={16} className="text-primary" />}
                          {stage.stage === "consideration" && <BookOpen size={16} className="text-primary" />}
                          {stage.stage === "evaluation" && <GitCompare size={16} className="text-primary" />}
                          {stage.stage === "decision" && <Star size={16} className="text-primary" />}
                          {stage.stage} ({stage.content.length})
                        </span>
                        <ChevronRight size={16} className="transition-transform group-open:rotate-90" />
                      </summary>
                      <div className="p-4 pt-0 border-t border-border space-y-2">
                        {stage.content.map((item) => {
                          const path = item.type === "software" ? "reviews" : `${item.type}s`
                          return (
                            <Link key={item.slug} href={`/${path}/${item.slug}`} className="block text-sm text-muted-foreground hover:text-primary transition-colors py-1 px-2 rounded hover:bg-muted-bg">
                              {item.name}
                            </Link>
                          )
                        })}
                      </div>
                    </details>
                  ))}
                </div>
              </Container>
            </Section>
          )}

          {/* Buyer Considerations */}
          {knowledge?.buyerConsiderations && knowledge.buyerConsiderations.length > 0 && (
            <Section>
              <Container>
                <div className="flex items-center gap-2 mb-6">
                  <CheckCircle2 size={20} className="text-primary" />
                  <h2 className="text-2xl font-bold">What to Consider Before Buying</h2>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  {knowledge.buyerConsiderations.map((item, i) => (
                    <Card key={i} className="p-4">
                      <p className="text-sm text-muted-foreground leading-relaxed">{item}</p>
                    </Card>
                  ))}
                </div>
              </Container>
            </Section>
          )}

          {/* Common Mistakes */}
          {knowledge?.commonMistakes && knowledge.commonMistakes.length > 0 && (
            <Section>
              <Container>
                <div className="flex items-center gap-2 mb-6">
                  <AlertTriangle size={20} className="text-warning" />
                  <h2 className="text-2xl font-bold">Common Buying Mistakes</h2>
                </div>
                <div className="space-y-3">
                  {knowledge.commonMistakes.map((mistake, i) => (
                    <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-warning-subtle/30 border border-warning/10">
                      <XCircle size={16} className="text-warning mt-0.5 shrink-0" />
                      <p className="text-sm text-muted-foreground">{mistake}</p>
                    </div>
                  ))}
                </div>
              </Container>
            </Section>
          )}

          {/* Decision Factors */}
          {knowledge?.decisionFactors && knowledge.decisionFactors.length > 0 && (
            <Section>
              <Container>
                <div className="flex items-center gap-2 mb-6">
                  <Brain size={20} className="text-primary" />
                  <h2 className="text-2xl font-bold">Decision Framework</h2>
                </div>
                <div className="space-y-3">
                  {knowledge.decisionFactors.map((f, i) => (
                    <Card key={i} className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-sm">{f.factor}</h3>
                            <Badge variant={f.importance === "Critical" ? "danger" : f.importance === "High" ? "warning" : "secondary"} className="text-[10px]">{f.importance}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{f.description}</p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </Container>
            </Section>
          )}

          {/* Best For */}
          <Section>
            <Container>
              <div className="flex items-center gap-2 mb-6">
                <Users size={20} className="text-primary" />
                <h2 className="text-2xl font-bold">Best Software by Use Case</h2>
              </div>
              <div className="grid sm:grid-cols-3 gap-4">
                {smbPick && (
                  <Card className="p-5">
                    <Building2 size={20} className="text-primary mb-2" />
                    <h3 className="font-semibold text-sm mb-1">Best for SMB</h3>
                    <Link href={`/reviews/${smbPick.slug}`} className="text-primary text-sm font-medium hover:underline">{smbPick.name}</Link>
                    {knowledge?.bestFor.smb && <p className="text-xs text-muted-foreground mt-1">{knowledge.bestFor.smb}</p>}
                  </Card>
                )}
                {enterprisePick && (
                  <Card className="p-5">
                    <Shield size={20} className="text-primary mb-2" />
                    <h3 className="font-semibold text-sm mb-1">Best for Enterprise</h3>
                    <Link href={`/comparisons/${enterprisePick.slug}`} className="text-primary text-sm font-medium hover:underline">{enterprisePick.title}</Link>
                    {knowledge?.bestFor.enterprise && <p className="text-xs text-muted-foreground mt-1">{knowledge.bestFor.enterprise}</p>}
                  </Card>
                )}
                {freePick && (
                  <Card className="p-5">
                    <DollarSign size={20} className="text-success mb-2" />
                    <h3 className="font-semibold text-sm mb-1">Best Free Tool</h3>
                    <Link href={`/reviews/${freePick.slug}`} className="text-primary text-sm font-medium hover:underline">{freePick.name}</Link>
                    {knowledge?.bestFor.free && <p className="text-xs text-muted-foreground mt-1">{knowledge.bestFor.free}</p>}
                  </Card>
                )}
              </div>
            </Container>
          </Section>

          {/* Pricing Overview */}
          {knowledge?.pricingOverview && (
            <Section>
              <Container>
                <div className="flex items-center gap-2 mb-4">
                  <DollarSign size={20} className="text-primary" />
                  <h2 className="text-2xl font-bold">Pricing Overview</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed">{knowledge.pricingOverview}</p>
              </Container>
            </Section>
          )}

          <BrandDivider />

          {/* All Reviews */}
          <Section>
            <Container>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold">All {category.name} Reviews</h2>
                  <p className="text-sm text-muted-foreground mt-1">{reviews.length} tools tested and rated</p>
                </div>
                <Link href="/reviews" className="text-sm text-primary hover:underline hidden sm:inline-flex items-center gap-1">View all <ArrowRight size={12} /></Link>
              </div>
              {reviews.length > 0 ? (
                <ReviewFilter reviews={reviews.filter(r => r.slug !== bestPick?.slug)} category={category.name} />
              ) : (
                <div className="text-center py-16">
                  <p className="text-muted-foreground">No reviews yet in this category. Check back soon.</p>
                </div>
              )}
            </Container>
          </Section>

          {/* Comparisons */}
          {comparisons.length > 0 && (
            <Section>
              <Container>
                <h2 className="text-2xl font-bold mb-6">{category.name} Comparisons</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {comparisons.map((c) => (
                    <Link key={c.slug} href={`/comparisons/${c.slug}`} className="group card-hover">
                      <Card className="p-4 flex items-center gap-3">
                        <GitCompare size={20} className="text-primary shrink-0" />
                        <div>
                          <CardTitle className="text-sm group-hover:text-primary transition-colors">{c.title}</CardTitle>
                          {c.winner && <p className="text-xs text-success mt-0.5">{c.winner} wins</p>}
                        </div>
                      </Card>
                    </Link>
                  ))}
                </div>
              </Container>
            </Section>
          )}

          {/* Guides */}
          {guides.length > 0 && (
            <Section>
              <Container>
                <h2 className="text-2xl font-bold mb-6">{category.name} Buying Guides</h2>
                <div className="grid sm:grid-cols-2 gap-6">
                  {guides.map(g => (
                    <Link key={g.slug} href={`/guides/${g.slug}`} className="group card-hover">
                      <Card className="h-full">
                        <div className="flex items-center gap-2 mb-2">
                          <BookOpen size={14} className="text-primary" />
                          <Badge variant={g.difficulty === "Beginner" ? "success" : g.difficulty === "Intermediate" ? "warning" : "danger"} className="text-[10px]">{g.difficulty}</Badge>
                        </div>
                        <CardTitle className="text-sm group-hover:text-primary transition-colors">{g.title}</CardTitle>
                        <CardDescription className="mt-1.5 text-xs">{g.description}</CardDescription>
                        <p className="text-xs text-muted-foreground mt-2">{g.readingTime} min read</p>
                      </Card>
                    </Link>
                  ))}
                </div>
              </Container>
            </Section>
          )}

          {/* Glossary */}
          {glossary.length > 0 && (
            <Section>
              <Container>
                <h2 className="text-2xl font-bold mb-6">Related {category.name} Terms</h2>
                <div className="flex flex-wrap gap-2">
                  {glossary.map((t) => (
                    <Link key={t.slug} href={`/glossary/${t.slug}`} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-border text-xs text-muted-foreground hover:text-primary hover:border-primary/30 transition-colors">
                      {t.term}
                    </Link>
                  ))}
                </div>
              </Container>
            </Section>
          )}

          {/* Research & Blog */}
          {posts.length > 0 && (
            <Section>
              <Container>
                <h2 className="text-2xl font-bold mb-6">Latest {category.name} Research</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {posts.slice(0, 4).map((p) => (
                    <Link key={p.slug} href={`/blog/${p.slug}`} className="group card-hover">
                      <Card className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <FileText size={14} className="text-primary" />
                          <span className="text-xs text-muted-foreground">{new Date(p.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                        </div>
                        <CardTitle className="text-sm group-hover:text-primary transition-colors">{p.title}</CardTitle>
                        <CardDescription className="text-xs mt-1">{p.description}</CardDescription>
                      </Card>
                    </Link>
                  ))}
                </div>
              </Container>
            </Section>
          )}

          {/* Related Categories */}
          {knowledge?.relatedCategories && knowledge.relatedCategories.length > 0 && (
            <Section>
              <Container>
                <h2 className="text-2xl font-bold mb-6">Related Categories</h2>
                <div className="flex flex-wrap gap-2">
                  {knowledge.relatedCategories.map((rcSlug) => {
                    const rc = categories.find((c) => c.slug === rcSlug)
                    if (!rc) return null
                    return (
                      <Link key={rcSlug} href={`/category/${rcSlug}`} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-border text-xs text-muted-foreground hover:text-primary hover:border-primary/30 transition-colors">
                        {rc.name}
                      </Link>
                    )
                  })}
                </div>
              </Container>
            </Section>
          )}

          {/* FAQ */}
          {knowledge?.faqs && knowledge.faqs.length > 0 && (
            <Section>
              <Container>
                <div className="flex items-center gap-2 mb-6">
                  <HelpCircle size={20} className="text-primary" />
                  <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
                </div>
                <div className="space-y-3 max-w-3xl">
                  {knowledge.faqs.map((faq, i) => (
                    <details key={i} className="group rounded-xl border border-border overflow-hidden">
                      <summary className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted-bg transition-colors font-medium text-sm">
                        {faq.question}
                        <ChevronRight size={14} className="transition-transform group-open:rotate-90 shrink-0" />
                      </summary>
                      <div className="p-4 pt-0 border-t border-border">
                        <p className="text-sm text-muted-foreground">{faq.answer}</p>
                      </div>
                    </details>
                  ))}
                </div>
              </Container>
            </Section>
          )}
        </div>

        {/* Sidebar */}
        <aside className="hidden lg:block">
          <div className="sticky top-24 space-y-6">
            {bestPick && (
              <Card className="p-4">
                <Badge variant="default" className="mb-2">Best Pick</Badge>
                <p className="font-semibold text-sm">{bestPick.name}</p>
                <div className="flex items-center gap-1 text-sm text-accent mt-1">
                  <Star size={12} className="fill-accent" />
                  {bestPick.rating}/5
                </div>
                <Link href={`/reviews/${bestPick.slug}`} className="block text-xs text-primary mt-2 hover:underline">Read review →</Link>
              </Card>
            )}
            {buyerJourney.length > 0 && (
              <Card className="p-4">
                <h3 className="font-semibold text-sm mb-3">On this page</h3>
                <nav className="space-y-1.5">
                  {knowledge?.marketOverview && <a href="#market-overview" className="block text-xs text-muted-foreground hover:text-foreground transition-colors">Market Overview</a>}
                  <a href="#buyer-journey" className="block text-xs text-muted-foreground hover:text-foreground transition-colors">Buyer Journey</a>
                  {knowledge?.buyerConsiderations && <a href="#considerations" className="block text-xs text-muted-foreground hover:text-foreground transition-colors">Considerations</a>}
                  {knowledge?.commonMistakes && <a href="#mistakes" className="block text-xs text-muted-foreground hover:text-foreground transition-colors">Common Mistakes</a>}
                  <a href="#reviews" className="block text-xs text-muted-foreground hover:text-foreground transition-colors">All Reviews</a>
                  <a href="#faq" className="block text-xs text-muted-foreground hover:text-foreground transition-colors">FAQ</a>
                </nav>
              </Card>
            )}
            <Card className="p-4">
              <h3 className="font-semibold text-sm mb-2">Content Count</h3>
              <div className="space-y-1.5 text-xs text-muted-foreground">
                <p>{reviews.length} reviews</p>
                <p>{comparisons.length} comparisons</p>
                <p>{guides.length} guides</p>
                <p>{posts.length} research articles</p>
                <p>{glossary.length} glossary terms</p>
              </div>
            </Card>
          </div>
        </aside>
      </div>
    </>
  )
}
