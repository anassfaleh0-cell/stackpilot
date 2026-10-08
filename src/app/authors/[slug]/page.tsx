import { Container, Section } from "@/components/ui/container"
import { Badge } from "@/components/ui/badge"
import { Card, CardTitle, CardDescription } from "@/components/ui/card"
import { Breadcrumbs } from "@/components/seo/breadcrumbs"
import { BreadcrumbSchema } from "@/components/seo/json-ld"
import { site } from "@/lib/constants"
import { createMetadata } from "@/lib/metadata"
import { isPublicAuthor } from "@/lib/authors"
import { AuthorAvatar } from "@/components/editorial/author-avatar"
import { notFound } from "next/navigation"
import Link from "next/link"
import { BookOpen, Calendar } from "lucide-react"
import { getAllReviews, getAllGuides, getAllBlogPosts } from "@/lib/content/registry"
import { ReviewCardGrid } from "@/components/entity/review-card-grid"
import { SocialFooterIcons } from "@/components/brand/social-icons"
import sitemapRoute from "@/app/sitemap"

const sitemapEntries = sitemapRoute()
const countIn = (segment: string) => sitemapEntries.filter((e) => e.url.includes(segment)).length
const reviewCount = countIn("/reviews/")
const comparisonCount = countIn("/comparisons/")

const authorSocial = {
  twitter: site.links.twitter,
  github: site.links.github,
  linkedin: site.links.linkedin,
}

const authors = {
  "pilotstack-team": {
    name: "PilotStack Team",
    role: "Editorial Team",
    bio: "The PilotStack editorial team publishes software reviews, comparisons, guides, and research using the site's published scoring, sourcing, and update policies.",
    avatar: null,
    expertise: ["Software research", "Pricing analysis", "Software comparison", "B2B software buying"],
    credentials: ["Published software reviews and comparisons", "Public methodology and editorial policies"],
    social: { twitter: authorSocial.twitter, github: authorSocial.github, linkedin: authorSocial.linkedin },
    worksFor: "PilotStack",
    knowsAbout: ["Software Reviews", "Software Comparison", "B2B Software", "Market Research"],
  },
}

export const authorSlugs: string[] = Object.keys(authors)

export function generateStaticParams() {
  return Object.keys(authors).map((slug) => ({ slug }))
}

export const dynamicParams = false

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const author = authors[slug as keyof typeof authors]
  if (!author) return {}
  return createMetadata({
    title: `${author.name} - ${author.role}`,
    description: `${author.name} is ${author.role} at PilotStack. ${author.bio.slice(0, 150)}`,
    path: `/authors/${slug}`,
    noIndex: !isPublicAuthor(slug),
  })
}

export default async function AuthorPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const author = authors[slug as keyof typeof authors]
  if (!author) notFound()

  const allReviews = getAllReviews().filter((r) => r.author === author.name)
  const allGuides = getAllGuides().filter((g) => g.author === author.name)
  const allPosts = getAllBlogPosts().filter((p) => p.author === author.name)

  return (
    <>
      <BreadcrumbSchema items={[{ name: "Home", href: "/" }, { name: "Authors", href: "/authors" }, { name: author.name, href: `/authors/${slug}` }]} />
      <Container className="pt-8">
        <Breadcrumbs items={[{ name: "Authors", href: "/authors" }, { name: author.name }]} />
      </Container>
      <Section className="pt-0">
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col sm:flex-row items-start gap-6 mb-10">
              <AuthorAvatar name={author.name} src={author.avatar} size="lg" />
              <div>
                <Badge variant="secondary" className="mb-2">{author.role}</Badge>
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">{author.name}</h1>
                <p className="text-muted-foreground leading-relaxed">{author.bio}</p>
                <div className="flex flex-wrap gap-2 mt-4">
                  {author.expertise.map((area) => (
                    <Badge key={area} variant="outline">{area}</Badge>
                  ))}
                </div>
                <div className="mt-3 text-xs text-muted-foreground">
                  {author.credentials.map((c) => (
                    <span key={c} className="flex items-center gap-1">
                      <span className="text-primary">•</span> {c}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-3 mt-4">
                  {Object.entries(author.social).map(([platform, url]) => (
                    <a key={platform} href={url} target="_blank" rel="noopener noreferrer" className="text-xs font-medium text-muted-foreground hover:text-primary transition-colors capitalize">
                      {platform === "twitter" ? "X" : platform} ↗
                    </a>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-10">
              {allReviews.length > 0 && (
                <section>
                  <h2 className="text-xl font-bold mb-4">Reviews by {author.name}</h2>
                  <ReviewCardGrid items={allReviews.map(r => ({ slug: r.slug, name: r.name, category: r.category, rating: r.rating, tagline: r.tagline }))} />
                </section>
              )}

              {allGuides.length > 0 && (
                <section>
                  <h2 className="text-xl font-bold mb-4">Guides by {author.name}</h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {allGuides.map((g) => (
                      <Link key={g.slug} href={`/guides/${g.slug}`} className="group card-hover-lift">
                        <Card className="p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="secondary" className="text-xs">{g.category}</Badge>
                            <Badge variant="outline" className="text-xs">{g.difficulty}</Badge>
                          </div>
                          <CardTitle className="text-base group-hover:text-primary transition-colors">{g.title}</CardTitle>
                          <CardDescription className="text-xs mt-1">{g.description}</CardDescription>
                          <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                            <BookOpen size={12} /> {g.readingTime} min read
                          </div>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </section>
              )}

              {allPosts.length > 0 && (
                <section>
                  <h2 className="text-xl font-bold mb-4">Articles by {author.name}</h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {allPosts.map((p) => (
                      <Link key={p.slug} href={`/blog/${p.slug}`} className="group card-hover-lift">
                        <Card className="p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="secondary" className="text-xs">{p.category}</Badge>
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Calendar size={10} /> {new Date(p.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                            </span>
                          </div>
                          <CardTitle className="text-base group-hover:text-primary transition-colors">{p.title}</CardTitle>
                          <CardDescription className="text-xs mt-1">{p.description}</CardDescription>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </section>
              )}

              {allReviews.length === 0 && allGuides.length === 0 && allPosts.length === 0 && (
                <p className="text-muted-foreground text-sm">No content published yet.</p>
              )}
            </div>
            <div className="mt-12 p-6 rounded-xl bg-muted-bg border border-border">
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-3">Follow PilotStack</h2>
              <SocialFooterIcons />
            </div>
          </div>
        </Container>
      </Section>
    </>
  )
}
