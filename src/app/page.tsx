import Link from "next/link"
import { Container, Section, SectionHeader } from "@/components/ui/container"
import { Button } from "@/components/ui/button"
import { Card, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { categories } from "@/lib/constants"
import { getAllReviews } from "@/lib/content/registry"
import { ArrowRight, Star, BarChart3, Shield, Zap, ChevronRight } from "lucide-react"
import { BreadcrumbSchema } from "@/components/seo/json-ld"

const stats = [
  { value: "1,200+", label: "Software Reviews" },
  { value: "250+", label: "Expert Guides" },
  { value: "35K+", label: "Monthly Readers" },
  { value: "98%", label: "Reader Satisfaction" },
]

export default function HomePage() {
  return (
    <>
      <BreadcrumbSchema items={[{ name: "Home", href: "/" }]} />

      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
        <Container className="relative py-20 sm:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="default" className="mb-6">Trusted by 35,000+ decision-makers</Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] mb-6">
              Navigate your{" "}
              <span className="gradient-text">software stack</span>
              {" "}with confidence
            </h1>
            <p className="text-lg sm:text-xl text-muted leading-relaxed max-w-2xl mx-auto mb-10">
              Expert reviews, honest comparisons, and practical guides to help you choose, implement, and optimize the right tools for your business.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/reviews"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary text-white hover:bg-primary-dark shadow-sm hover:shadow-md h-12 px-8 text-base font-medium transition-all duration-200"
              >
                Browse Reviews <ArrowRight size={16} />
              </Link>
              <Link
                href="/comparisons"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-transparent hover:bg-muted-bg h-12 px-8 text-base font-medium transition-all duration-200"
              >
                Compare Tools
              </Link>
            </div>
            <div className="mt-12 flex items-center justify-center gap-8 text-sm text-muted">
              <span className="flex items-center gap-1.5"><Star size={14} className="text-amber-500 fill-amber-500" /> 4.8 avg. rating</span>
              <span className="flex items-center gap-1.5"><Shield size={14} className="text-emerald-500" /> Unbiased reviews</span>
              <span className="flex items-center gap-1.5"><Zap size={14} className="text-primary" /> Updated weekly</span>
            </div>
          </div>
        </Container>
      </section>

      <Section>
        <Container>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center p-6 rounded-xl border border-border bg-card">
                <div className="text-3xl sm:text-4xl font-bold gradient-text mb-1">{stat.value}</div>
                <div className="text-sm text-muted">{stat.label}</div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Section className="bg-muted-bg/50">
        <Container>
          <SectionHeader className="mb-12">
            <Badge variant="default" className="mb-4">Featured Tools</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              Curated software picks
            </h2>
            <p className="text-muted">
              Hand-picked and rigorously reviewed tools across every category.
            </p>
          </SectionHeader>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {getAllReviews().slice(0, 6).map((tool) => (
              <Link key={tool.slug} href={`/reviews/${tool.slug}`} className="group">
                <Card className="h-full hover:border-primary/30 transition-all duration-300">
                  <div className="flex items-start justify-between mb-3">
                    <Badge variant="secondary">{tool.category}</Badge>
                    <div className="flex items-center gap-1 text-sm font-medium text-amber-600">
                      <Star size={14} className="fill-amber-400 text-amber-400" />
                      {tool.rating}
                    </div>
                  </div>
                  <CardTitle className="group-hover:text-primary transition-colors">{tool.name}</CardTitle>
                  <CardDescription className="mt-1.5">{tool.tagline}</CardDescription>
                </Card>
              </Link>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link
              href="/reviews"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-transparent hover:bg-muted-bg h-12 px-8 text-base font-medium transition-all duration-200"
            >
              View all reviews <ChevronRight size={16} />
            </Link>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <SectionHeader className="mb-12">
            <Badge variant="default" className="mb-4">Categories</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              Browse by category
            </h2>
            <p className="text-muted">
              Find the right tools for every department and use case.
            </p>
          </SectionHeader>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <Link key={cat.slug} href={`/category/${cat.slug}`}>
                <Card className="flex items-center justify-between p-4 hover:border-primary/30 transition-all">
                  <span className="font-medium text-sm">{cat.name}</span>
                  <span className="text-xs text-muted">{cat.count}</span>
                </Card>
              </Link>
            ))}
          </div>
        </Container>
      </Section>

      <Section className="bg-gradient-to-br from-primary/5 to-secondary/5 border-y border-border">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <Badge variant="default" className="mb-4">Free Tools</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              Make smarter decisions
            </h2>
            <p className="text-muted mb-8">
              Use our free interactive tools to compare pricing, calculate ROI, and find the perfect software fit.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/tools"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary text-white hover:bg-primary-dark shadow-sm hover:shadow-md h-12 px-8 text-base font-medium transition-all duration-200"
              >
                <BarChart3 size={16} /> Explore Free Tools
              </Link>
              <Link
                href="/reviews"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-transparent hover:bg-muted-bg h-12 px-8 text-base font-medium transition-all duration-200"
              >
                Browse Reviews
              </Link>
            </div>
          </div>
        </Container>
      </Section>

      <Section id="newsletter">
        <Container>
          <SectionHeader className="mb-12">
            <Badge variant="default" className="mb-4">Newsletter</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              Expert advice, straight to your inbox
            </h2>
            <p className="text-muted">
              Join 35,000+ professionals who rely on StackPilot for software buying decisions.
            </p>
          </SectionHeader>
          <div className="mx-auto max-w-md">
              <form action="/api/newsletter" method="POST" className="flex gap-3">
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                autoComplete="email"
                aria-label="Email address for newsletter"
                className="flex-1 h-12 px-4 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                required
              />
              <Button type="submit" size="lg">Subscribe</Button>
            </form>
            <p className="mt-3 text-xs text-muted text-center">No spam. Unsubscribe anytime.</p>
          </div>
        </Container>
      </Section>
    </>
  )
}
