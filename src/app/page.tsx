import Link from "next/link"
import { Container, Section } from "@/components/ui/container"
import { Card, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { categories } from "@/lib/constants"
import { getAllReviews, getAllComparisons, getAllGuides, getAllBlogPosts } from "@/lib/content/registry"
import { ArrowRight, Star, BarChart3, Shield, Zap, Compass, ExternalLink } from "lucide-react"
import { BreadcrumbSchema } from "@/components/seo/json-ld"
import { BrandPattern, BrandOrb, BrandDivider } from "@/components/brand/patterns"

const stats = [
  { value: "1,200+", label: "Software Reviews" },
  { value: "250+", label: "Expert Guides" },
  { value: "35K+", label: "Monthly Readers" },
  { value: "98%", label: "Reader Satisfaction" },
]

export default function HomePage() {
  const reviews = getAllReviews()
  const comparisons = getAllComparisons()
  const guides = getAllGuides()
  const posts = getAllBlogPosts()

  return (
    <>
      <BreadcrumbSchema items={[{ name: "Home", href: "/" }]} />

      {/* ── Hero ── */}
      <section className="relative overflow-hidden border-b border-border">
        <BrandPattern variant="grid" opacity={0.3} className="text-primary" />
        <BrandOrb size={600} className="top-[-200px] right-[-200px]" />
        <BrandOrb size={400} color="var(--secondary)" className="bottom-[-150px] left-[-150px]" />
        <Container className="relative py-24 sm:py-32 lg:py-36">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 animate-fade-in">
              <TrustBadge>Independent reviews since 2024</TrustBadge>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight leading-[1.02] mb-6 text-balance">
              Navigate your{" "}
              <span className="gradient-text">software stack</span>
              {" "}with confidence
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-10 text-pretty">
              Expert reviews, honest comparisons, and practical guides — every tool tested and evaluated by our team so you can choose with certainty.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/reviews"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary text-white hover:bg-primary-dark shadow-button hover:shadow-button-hover active:shadow-inner h-12 px-8 text-base font-medium transition-all duration-200"
              >
                Browse Reviews <ArrowRight size={16} />
              </Link>
              <Link
                href="/comparisons"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-background/80 hover:bg-muted-bg h-12 px-8 text-base font-medium transition-all duration-200"
              >
                Compare Tools
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* ── Trust Stats ── */}
      <section className="border-b border-border">
        <Container className="py-12 sm:py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border rounded-xl overflow-hidden">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-card p-8 text-center">
                <div className="text-3xl sm:text-4xl font-bold gradient-text mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Featured Reviews ── */}
      <Section>
        <Container>
          <div className="flex items-end justify-between mb-12">
            <div>
              <Badge variant="default" className="mb-4">Featured Tools</Badge>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-balance">
                Curated software picks
              </h2>
            </div>
            <Link
              href="/reviews"
              className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              View all <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.slice(0, 6).map((tool, i) => (
              <Link key={tool.slug} href={`/reviews/${tool.slug}`} className="group card-hover" style={{ animationDelay: `${i * 60}ms` }}>
                <Card className="h-full flex flex-col">
                  <div className="flex items-start justify-between mb-3">
                    <Badge variant="secondary">{tool.category}</Badge>
                    <div className="flex items-center gap-1 text-sm font-medium text-accent">
                      <Star size={14} className="fill-accent text-accent" />
                      {tool.rating}
                    </div>
                  </div>
                  <CardTitle className="group-hover:text-primary transition-colors">{tool.name}</CardTitle>
                  <CardDescription className="mt-1.5">{tool.tagline}</CardDescription>
                  <div className="mt-4 pt-4 border-t border-border flex items-center gap-1 text-xs font-medium text-muted-foreground group-hover:text-primary transition-colors">
                    Read review <ArrowRight size={12} className="transition-transform group-hover:translate-x-0.5" />
                  </div>
                </Card>
              </Link>
            ))}
          </div>
          <div className="mt-10 text-center sm:hidden">
            <Link
              href="/reviews"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-transparent hover:bg-muted-bg h-12 px-8 text-base font-medium transition-all duration-200"
            >
              View all reviews <ArrowRight size={16} />
            </Link>
          </div>
        </Container>
      </Section>

      <BrandDivider />

      {/* ── Trending Comparisons ── */}
      {comparisons.length > 0 && (
        <Section className="py-0 sm:py-0 lg:py-0">
          <Container>
            <div className="flex items-end justify-between mb-12">
              <div>
                <Badge variant="default" className="mb-4">Comparisons</Badge>
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-balance">
                  Side-by-side analysis
                </h2>
              </div>
              <Link
                href="/comparisons"
                className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                View all <ArrowRight size={14} />
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 gap-6">
              {comparisons.slice(0, 4).map((cmp) => (
                <Link key={cmp.slug} href={`/comparisons/${cmp.slug}`} className="group card-hover">
                  <Card className="h-full flex flex-col">
                    <div className="flex items-start justify-between mb-3">
                      <Badge variant="secondary">{cmp.category}</Badge>
                      {cmp.winner && (
                        <span className="text-xs font-medium text-success flex items-center gap-1">
                          <Shield size={12} /> {cmp.winner} wins
                        </span>
                      )}
                    </div>
                    <CardTitle className="group-hover:text-primary transition-colors">{cmp.title}</CardTitle>
                    <CardDescription className="mt-1.5">{cmp.description}</CardDescription>
                  </Card>
                </Link>
              ))}
            </div>
          </Container>
        </Section>
      )}

      <BrandDivider />

      {/* ── Expert Guides ── */}
      {guides.length > 0 && (
        <Section className="py-0 sm:py-0 lg:py-0">
          <Container>
            <div className="flex items-end justify-between mb-12">
              <div>
                <Badge variant="default" className="mb-4">Guides</Badge>
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-balance">
                  Expert buying guides
                </h2>
              </div>
              <Link
                href="/guides"
                className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                View all <ArrowRight size={14} />
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {guides.slice(0, 3).map((guide) => (
                <Link key={guide.slug} href={`/guides/${guide.slug}`} className="group card-hover">
                  <Card className="h-full flex flex-col">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="secondary">{guide.category}</Badge>
                      <Badge variant={guide.difficulty === "Beginner" ? "success" : guide.difficulty === "Intermediate" ? "warning" : "danger"}>
                        {guide.difficulty}
                      </Badge>
                    </div>
                    <CardTitle className="group-hover:text-primary transition-colors">{guide.title}</CardTitle>
                    <CardDescription className="mt-1.5">{guide.description}</CardDescription>
                    <div className="mt-auto pt-4 text-xs text-muted-foreground">
                      {guide.readingTime} min read · {guide.sections.length} sections
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </Container>
        </Section>
      )}

      <BrandDivider />

      {/* ── Categories ── */}
      <Section className="py-0 sm:py-0 lg:py-0">
        <Container>
          <div className="flex items-end justify-between mb-12">
            <div>
              <Badge variant="default" className="mb-4">Categories</Badge>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-balance">
                Browse by category
              </h2>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {categories.map((cat) => (
              <Link key={cat.slug} href={`/category/${cat.slug}`} className="group card-hover">
                <Card className="flex items-center justify-between p-4">
                  <span className="font-medium text-sm">{cat.name}</span>
                  <span className="text-xs text-muted-foreground tabular-nums">{cat.count}</span>
                </Card>
              </Link>
            ))}
          </div>
        </Container>
      </Section>

      <BrandDivider />

      {/* ── Latest from Blog ── */}
      {posts.length > 0 && (
        <Section className="py-0 sm:py-0 lg:py-0">
          <Container>
            <div className="flex items-end justify-between mb-12">
              <div>
                <Badge variant="default" className="mb-4">Blog</Badge>
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-balance">
                  Insights &amp; analysis
                </h2>
              </div>
              <Link
                href="/blog"
                className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                View all <ArrowRight size={14} />
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.slice(0, 3).map((post) => (
                <Link key={post.slug} href={`/blog/${post.slug}`} className="group card-hover">
                  <Card className="h-full flex flex-col">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="secondary">{post.category}</Badge>
                      <span className="text-xs text-muted-foreground">{post.readingTime} min read</span>
                    </div>
                    <CardTitle className="group-hover:text-primary transition-colors">{post.title}</CardTitle>
                    <CardDescription className="mt-1.5">{post.description}</CardDescription>
                    <div className="mt-auto pt-4 text-xs text-muted-foreground">
                      {post.author}
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </Container>
        </Section>
      )}

      <BrandDivider />

      {/* ── CTA ── */}
      <Section className="py-0 sm:py-0 lg:py-0">
        <Container>
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/[0.04] to-secondary/[0.04] border border-border p-10 sm:p-14 lg:p-16 text-center">
            <BrandOrb size={300} className="top-[-100px] right-[-100px]" />
            <div className="relative">
              <Badge variant="default" className="mb-4">Free Tools</Badge>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4 text-balance">
                Make smarter decisions
              </h2>
              <p className="text-muted-foreground mb-8 max-w-lg mx-auto text-pretty">
                Use our free interactive tools to compare pricing, calculate ROI, and find the perfect software fit.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/tools"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary text-white hover:bg-primary-dark shadow-button hover:shadow-button-hover h-12 px-8 text-base font-medium transition-all duration-200"
                >
                  <BarChart3 size={16} /> Explore Free Tools
                </Link>
                <Link
                  href="/reviews"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-background/80 hover:bg-muted-bg h-12 px-8 text-base font-medium transition-all duration-200"
                >
                  Browse Reviews
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* ── Newsletter ── */}
      <Section id="newsletter">
        <Container>
          <div className="mx-auto max-w-xl text-center mb-8">
            <Badge variant="default" className="mb-4">Newsletter</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4 text-balance">
              Expert advice, straight to your inbox
            </h2>
            <p className="text-muted-foreground text-pretty">
              Join 35,000+ professionals who rely on StackPilot for software buying decisions. No spam, unsubscribe anytime.
            </p>
          </div>
          <div className="mx-auto max-w-md">
            <form action="/api/newsletter" method="POST" className="flex gap-3">
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                autoComplete="email"
                aria-label="Email address for newsletter"
                className="flex-1 h-12 px-4 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                required
              />
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary text-white hover:bg-primary-dark shadow-button hover:shadow-button-hover h-12 px-6 text-sm font-medium transition-all duration-200 shrink-0"
              >
                Subscribe
              </button>
            </form>
          </div>
        </Container>
      </Section>
    </>
  )
}

function TrustBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="trust-badge">{children}</span>
  )
}
