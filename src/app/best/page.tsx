import { Container, Section, SectionHeader } from "@/components/ui/container"
import { Badge } from "@/components/ui/badge"
import { Card, CardTitle, CardDescription } from "@/components/ui/card"
import { Breadcrumbs } from "@/components/seo/breadcrumbs"
import { BreadcrumbSchema, CollectionPageSchema, ItemListSchema } from "@/components/seo/json-ld"
import { site } from "@/lib/constants"
import { createMetadata } from "@/lib/metadata"
import { getAllBest } from "@/lib/content/registry"
import Link from "next/link"
import { ArrowRight, Star } from "lucide-react"
import { BrandPattern } from "@/components/brand/patterns"

export const metadata = createMetadata({
  title: "Best Software Tools by Category",
  description: "Expert-curated lists of the best software tools across every category. Editor-reviewed, research-backed recommendations for every business need.",
  path: "/best",
})

export default function BestPage() {
  const pages = getAllBest()

  return (
    <>
      <CollectionPageSchema name="Best Software Tools" description="Editor-reviewed best software recommendations by category" url={`${site.url}/best`} />
      <ItemListSchema items={pages.map(p => ({ name: p.title, url: `${site.url}/best/${p.slug}` }))} url={`${site.url}/best`} />
      <BreadcrumbSchema items={[{ name: "Home", href: "/" }, { name: "Best Software", href: "/best" }]} />
      <Container className="pt-8">
        <Breadcrumbs items={[{ name: "Best Software" }]} />
      </Container>
      <section className="relative overflow-hidden border-b border-border">
        <BrandPattern variant="circuit" opacity={0.15} className="text-primary" />
        <Container className="relative py-16 sm:py-20">
          <SectionHeader className="mb-0">
            <Badge variant="default" className="mb-4">Best of the Best</Badge>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">Best software by category</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
              Research-backed, editor-reviewed recommendations for every software category. Updated quarterly.
            </p>
          </SectionHeader>
        </Container>
      </section>
      <Section>
        <Container>
          {pages.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {pages.map((page) => (
              <Link key={page.slug} href={`/best/${page.slug}`} className="group card-hover">
                <Card className="h-full flex flex-col">
                  <div className="flex items-start justify-between mb-3">
                    <Badge variant="secondary">{page.category}</Badge>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Star size={12} /> {page.picks.length} picks
                    </span>
                  </div>
                  <CardTitle className="group-hover:text-primary transition-colors">{page.title}</CardTitle>
                  <CardDescription className="mt-1.5">{page.description}</CardDescription>
                </Card>
              </Link>
            ))}
          </div>
          ) : (
            <p className="text-center text-muted-foreground py-12">No pages available yet.</p>
          )}
        </Container>
      </Section>
    </>
  )
}
