import { Container, Section, SectionHeader } from "@/components/ui/container"
import { Badge } from "@/components/ui/badge"
import { Card, CardTitle, CardDescription } from "@/components/ui/card"
import { Breadcrumbs } from "@/components/seo/breadcrumbs"
import { BreadcrumbSchema, CollectionPageSchema, ItemListSchema } from "@/components/seo/json-ld"
import { site } from "@/lib/constants"
import { createMetadata } from "@/lib/metadata"
import { getAllBest } from "@/lib/content/registry"
import { REDIRECTED_BEST_SLUGS } from "@/lib/sitemap/redirected-content"
import { getPagination } from "@/lib/pagination"
import Link from "next/link"
import { Star } from "lucide-react"
import { BrandPattern } from "@/components/brand/patterns"

export const metadata = createMetadata({
  title: "Best Software Tools by Category",
  description: "Compare software options by category using recorded product details, selection criteria, and practical trade-offs for business buying decisions.",
  path: "/best",
})

export const dynamic = "force-static"

export default function BestPage() {
  const pages = getAllBest().filter((item) => !REDIRECTED_BEST_SLUGS.has(item.slug))
  const pagination = getPagination({ page: 1, perPage: 24, total: pages.length })
  const pageItems = pages.slice(pagination.start, pagination.end)

  return (
    <>
      <CollectionPageSchema name="Best Software Tools" description="Software options by category with recorded product details, selection criteria, and trade-offs" url={`${site.url}/best`} />
      <ItemListSchema items={pageItems.map(p => ({ name: p.title, url: `${site.url}/best/${p.slug}` }))} url={`${site.url}/best`} />
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
              Compare software options by category using recorded product details, selection criteria, and practical trade-offs. Verify current features and pricing with vendors before choosing.
            </p>
          </SectionHeader>
        </Container>
      </section>
      <Section>
        <Container>
          {pageItems.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {pageItems.map((page) => (
                <Link key={page.slug} href={`/best/${page.slug}`} className="group card-hover">
                  <Card className="h-full flex flex-col">
                    <div className="flex items-start justify-between mb-3">
                      <Badge variant="secondary">{page.category}</Badge>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Star size={12} /> {page.picks.length} picks
                      </span>
                    </div>
                    <CardTitle className="group-hover:text-primary transition-colors">{page.title}</CardTitle>
                    <CardDescription className="mt-1.5 line-clamp-4">{page.description}</CardDescription>
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
