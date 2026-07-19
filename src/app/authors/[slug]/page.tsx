import { Container, Section } from "@/components/ui/container"
import { Badge } from "@/components/ui/badge"
import { Card, CardTitle, CardDescription } from "@/components/ui/card"
import { Breadcrumbs } from "@/components/seo/breadcrumbs"
import { BreadcrumbSchema, PersonSchema } from "@/components/seo/json-ld"
import { site } from "@/lib/constants"
import { createMetadata } from "@/lib/metadata"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowRight, Star, BookOpen, Calendar } from "lucide-react"
import { getAllReviews, getAllGuides, getAllBlogPosts } from "@/lib/content/registry"
import { SocialFooterIcons } from "@/components/brand/social-icons"

const authors = {
  "pilotstack-team": {
    name: "PilotStack Team",
    role: "Editorial Team",
    bio: "The PilotStack editorial team brings together experienced software analysts, product managers, and technical writers with over 50 years of combined experience evaluating B2B software across CRM, project management, analytics, developer tools, HR, and marketing categories.",
    avatar: "/logo-icon.svg",
    expertise: ["Software Reviews", "Market Research", "Software Comparison"],
    credentials: ["50+ years combined experience", "Hands-on testing of 100+ tools"],
    social: { twitter: "https://x.com/pilotstackon", github: "https://github.com/pilotstack" },
    worksFor: "PilotStack",
    knowsAbout: ["Software Reviews", "Market Research", "B2B SaaS"],
  },
  "alex-chen": {
    name: "Alex Chen",
    role: "Senior Software Analyst",
    bio: "Alex specializes in developer tools, AI platforms, and productivity software. With a background in software engineering and product management, he brings a practitioner's perspective to every review. He has tested over 40 developer tools and AI platforms hands-on.",
    avatar: "/logo-icon.svg",
    expertise: ["Developer Tools", "AI & Machine Learning", "Productivity"],
    credentials: ["Former Senior Engineer at SaaS companies", "10+ years in software development"],
    social: { twitter: "https://x.com/pilotstackon", github: "https://github.com/pilotstack" },
    worksFor: "PilotStack",
    knowsAbout: ["Developer Tools", "AI Platforms", "Productivity Software", "Software Engineering"],
  },
  "sarah-mitchell": {
    name: "Sarah Mitchell",
    role: "CRM & Marketing Analyst",
    bio: "Sarah covers CRM, marketing automation, and sales tools. She previously led marketing operations at a B2B SaaS company where she managed a tech stack of 30+ tools. She evaluates tools based on real-world workflows, not just feature checklists.",
    avatar: "/logo-icon.svg",
    expertise: ["CRM & Sales", "Marketing & SEO", "Analytics"],
    credentials: ["Former Marketing Operations Lead", "8+ years in B2B marketing"],
    social: { twitter: "https://x.com/pilotstackon", linkedin: "https://linkedin.com/company/pilotstack" },
    worksFor: "PilotStack",
    knowsAbout: ["CRM", "Marketing Automation", "Sales Tools", "B2B Marketing"],
  },
  "jordan-park": {
    name: "Jordan Park",
    role: "Research Analyst",
    bio: "Jordan leads our market research and data analysis. He designs and executes our pricing research, market benchmarks, and trend reports. His background in data science ensures our research methodology meets academic rigor standards.",
    avatar: "/logo-icon.svg",
    expertise: ["Market Research", "Data Analysis", "Pricing Analysis"],
    credentials: ["MS in Data Science", "5+ years in tech market research"],
    social: { twitter: "https://x.com/pilotstackon", github: "https://github.com/pilotstack" },
    worksFor: "PilotStack",
    knowsAbout: ["Market Research", "Data Analysis", "Pricing Strategy", "Data Science"],
  },
  "priya-sharma": {
    name: "Priya Sharma",
    role: "Editorial Director",
    bio: "Priya oversees editorial quality, fact-checking, and content standards at PilotStack. She ensures every review meets our rigorous methodology and editorial policy before publication. She has 12+ years of experience in B2B content and software journalism.",
    avatar: "/logo-icon.svg",
    expertise: ["Editorial Standards", "Content Strategy", "Quality Assurance"],
    credentials: ["12+ years in B2B content", "Former Editor at tech publications"],
    social: { twitter: "https://x.com/pilotstackon", linkedin: "https://linkedin.com/company/pilotstack" },
    worksFor: "PilotStack",
    knowsAbout: ["Editorial Standards", "Content Strategy", "Software Journalism", "Quality Assurance"],
  },
}

export function generateStaticParams() {
  return Object.keys(authors).map((slug) => ({ slug }))
}

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
      <PersonSchema name={author.name} url={`${site.url}/authors/${slug}`} description={author.bio} knowsAbout={author.knowsAbout} />
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
                  <div className="grid sm:grid-cols-2 gap-4">
                    {allReviews.map((r) => (
                      <Link key={r.slug} href={`/reviews/${r.slug}`} className="group card-hover-lift">
                        <Card className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <Badge variant="secondary" className="text-xs">{r.category}</Badge>
                            <div className="flex items-center gap-1 text-sm font-medium text-accent">
                              <Star size={12} className="fill-accent text-accent" />
                              {r.rating}
                            </div>
                          </div>
                          <CardTitle className="text-base group-hover:text-primary transition-colors">{r.name}</CardTitle>
                          <CardDescription className="text-xs mt-1">{r.tagline}</CardDescription>
                        </Card>
                      </Link>
                    ))}
                  </div>
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
