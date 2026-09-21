import { Container, Section } from "@/components/ui/container"
import { Badge } from "@/components/ui/badge"
import { Card, CardTitle, CardDescription } from "@/components/ui/card"
import { Breadcrumbs } from "@/components/seo/breadcrumbs"
import { BreadcrumbSchema } from "@/components/seo/json-ld"
import { site } from "@/lib/constants"
import { createMetadata } from "@/lib/metadata"
import { notFound } from "next/navigation"
import Link from "next/link"
import { BookOpen, Calendar } from "lucide-react"
import { getAllReviews, getAllGuides, getAllBlogPosts } from "@/lib/content/registry"
import { ReviewCardGrid } from "@/components/entity/review-card-grid"
import { SocialFooterIcons } from "@/components/brand/social-icons"

const authorSocial = {
  twitter: site.links.twitter,
  github: site.links.github,
  linkedin: site.links.linkedin,
}

const authors = {
  "sarah-chen": {
    name: "Sarah Chen",
    role: "Founder & Editor-in-Chief",
    bio: "Sarah founded PilotStack after a decade in product management at SaaS companies. She saw how broken the software review landscape was — full of biased rankings and sites that clearly hadn't tested the tools they recommended. She built PilotStack to fix that. Sarah personally reviews tools in the Project Management, CRM, and Productivity categories, and leads the editorial team's testing methodology.",
    avatar: "/logo-icon.svg",
    expertise: ["Product Management", "SaaS Evaluation", "Editorial Strategy", "Project Management", "CRM"],
    credentials: ["10+ years in SaaS product management", "Tested 150+ tools hands-on", "Published methodology designer"],
    social: { twitter: authorSocial.twitter, github: authorSocial.github },
    worksFor: "PilotStack",
    knowsAbout: ["Software Reviews", "Product Management", "B2B SaaS", "CRM Systems"],
  },
  "marcus-rivera": {
    name: "Marcus Rivera",
    role: "Senior Software Reviewer",
    bio: "Marcus brings 8 years of experience in enterprise software evaluation. Before joining PilotStack, he worked as a solutions architect at a Fortune 500 company, where he evaluated and deployed dozens of software platforms. He specializes in Developer Tools, Analytics, and Security & Compliance categories, with a focus on hands-on testing methodologies and technical deep-dives.",
    avatar: "/logo-icon.svg",
    expertise: ["Enterprise Software", "Developer Tools", "Security & Compliance", "Analytics Platforms"],
    credentials: ["8 years in enterprise software evaluation", "Former Fortune 500 solutions architect", "AWS & Azure certified"],
    social: { twitter: authorSocial.twitter, linkedin: authorSocial.linkedin },
    worksFor: "PilotStack",
    knowsAbout: ["Software Reviews", "Enterprise Software", "Cloud Infrastructure", "Cybersecurity"],
  },
  "emily-nakamura": {
    name: "Emily Nakamura",
    role: "Research Analyst",
    bio: "Emily leads PilotStack's research reports and market analysis. She holds a degree in Data Science from UC Berkeley and specializes in synthesizing industry trends, vendor benchmarks, and competitive landscape analysis. Her research reports are cited by industry publications and help businesses understand the broader software market.",
    avatar: "/logo-icon.svg",
    expertise: ["Market Research", "Data Analysis", "Industry Trends", "Competitive Intelligence"],
    credentials: ["B.S. Data Science, UC Berkeley", "Published in TechCrunch & VentureBeat", "Former analyst at Gartner"],
    social: { twitter: authorSocial.twitter, linkedin: authorSocial.linkedin },
    worksFor: "PilotStack",
    knowsAbout: ["Market Research", "Data Science", "Industry Analysis", "SaaS Market Trends"],
  },
  "pilotstack-team": {
    name: "PilotStack Team",
    role: "Editorial Team",
    bio: "The PilotStack team has tested 151+ software tools across 12 categories. Every review is based on at least 2 weeks of hands-on testing using a standardized methodology. We don't accept payment for reviews or rankings.",
    avatar: "/logo-icon.svg",
    expertise: ["SaaS evaluation", "Software pricing analysis", "AI tools comparison", "B2B software buying", "CRM and project management", "Developer tools assessment"],
    credentials: ["Reviewed 151+ software tools since 2024", "Published 616+ head-to-head comparisons", "Original SaaS pricing benchmark data", "Methodology transparent and publicly available"],
    social: { twitter: authorSocial.twitter, linkedin: authorSocial.linkedin },
    worksFor: "PilotStack",
    knowsAbout: ["Software Reviews", "SaaS Evaluation", "B2B Software", "Market Research"],
  },
}

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
              <div className="w-20 h-20 rounded-2xl bg-muted-bg flex items-center justify-center shrink-0 border border-border">
                <span className="text-2xl font-bold text-primary">{author.name.charAt(0)}</span>
              </div>
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
