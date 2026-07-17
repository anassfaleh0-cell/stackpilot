import { Container, Section, SectionHeader } from "@/components/ui/container"
import { Badge } from "@/components/ui/badge"
import { Card, CardTitle, CardDescription } from "@/components/ui/card"
import { Breadcrumbs } from "@/components/seo/breadcrumbs"
import { BreadcrumbSchema, CollectionPageSchema, ItemListSchema } from "@/components/seo/json-ld"
import { site } from "@/lib/constants"
import { createMetadata } from "@/lib/metadata"
import { getAllGuides } from "@/lib/content/registry"
import Link from "next/link"
import { ArrowRight, Clock, Layers } from "lucide-react"
import { BrandPattern } from "@/components/brand/patterns"

export const metadata = createMetadata({
  title: "Software Guides",
  description: "Comprehensive software buying guides, implementation tutorials, and best practices to help businesses choose, deploy, and optimize the right tools across every category.",
  path: "/guides",
})

export default function GuidesPage() {
  const guides = getAllGuides()

  return (
    <>
      <CollectionPageSchema name="Expert Guides" description="Comprehensive software buying guides and implementation tutorials" url={`${site.url}/guides`} />
      <ItemListSchema items={guides.map(g => ({ name: g.title, url: `${site.url}/guides/${g.slug}` }))} url={`${site.url}/guides`} />
      <BreadcrumbSchema items={[{ name: "Home", href: "/" }, { name: "Guides", href: "/guides" }]} />
      <Container className="pt-8">
        <Breadcrumbs items={[{ name: "Guides" }]} />
      </Container>

      <section className="relative overflow-hidden border-b border-border">
        <BrandPattern variant="circuit" opacity={0.15} className="text-primary" />
        <Container className="relative py-16 sm:py-20">
          <SectionHeader className="mb-0">
            <Badge variant="default" className="mb-4">Guides</Badge>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">Expert guides</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
              Structured, actionable guides to help you make smarter software decisions at every stage.
            </p>
          </SectionHeader>
        </Container>
      </section>

      <Section>
        <Container>
          {guides.length > 0 ? (
          <div className="grid sm:grid-cols-2 gap-6">
            {guides.map((guide) => (
              <Link key={guide.slug} href={`/guides/${guide.slug}`} className="group card-hover">
                <Card className="h-full flex flex-col">
                  <div className="flex items-start justify-between mb-3">
                    <Badge variant="secondary">{guide.category}</Badge>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock size={12} /> {guide.readingTime} min
                    </span>
                  </div>
                  <CardTitle className="group-hover:text-primary transition-colors">{guide.title}</CardTitle>
                  <CardDescription className="mt-1.5">{guide.description}</CardDescription>
                  <div className="mt-4 flex items-center gap-2 mt-auto pt-4 border-t border-border">
                    <Badge variant={guide.difficulty === "Beginner" ? "success" : guide.difficulty === "Intermediate" ? "warning" : "danger"}>
                      {guide.difficulty}
                    </Badge>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Layers size={12} /> {guide.sections.length} sections
                    </span>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
          ) : (
            <p className="text-center text-muted-foreground py-12">No guides available yet. Check back soon.</p>
          )}
        </Container>
      </Section>
    </>
  )
}
