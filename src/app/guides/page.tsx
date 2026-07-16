import { Container, Section, SectionHeader } from "@/components/ui/container"
import { Badge } from "@/components/ui/badge"
import { Card, CardTitle, CardDescription } from "@/components/ui/card"
import { Breadcrumbs } from "@/components/seo/breadcrumbs"
import { BreadcrumbSchema } from "@/components/seo/json-ld"
import { createMetadata } from "@/lib/metadata"
import { getAllGuides } from "@/lib/content/registry"
import Link from "next/link"

export const metadata = createMetadata({
  title: "Software Guides",
  description: "Comprehensive guides to help you choose, implement, and optimize software tools for your business.",
  path: "/guides",
})

export default function GuidesPage() {
  const guides = getAllGuides()

  return (
    <>
      <BreadcrumbSchema items={[{ name: "Home", href: "/" }, { name: "Guides", href: "/guides" }]} />
      <Container className="pt-8">
        <Breadcrumbs items={[{ name: "Guides" }]} />
      </Container>
      <Section className="pt-0">
        <Container>
          <SectionHeader className="mb-12">
            <Badge variant="default" className="mb-4">Guides</Badge>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">Expert guides</h1>
            <p className="text-lg text-muted">Structured, actionable guides to help you make smarter software decisions at every stage.</p>
          </SectionHeader>
          <div className="grid sm:grid-cols-2 gap-6">
            {guides.map((guide) => (
              <Link key={guide.slug} href={`/guides/${guide.slug}`} className="group">
                <Card className="h-full hover:border-primary/30">
                  <div className="flex items-start justify-between mb-3">
                    <Badge variant="secondary">{guide.category}</Badge>
                    <span className="text-xs text-muted">{guide.readingTime} min read</span>
                  </div>
                  <CardTitle className="group-hover:text-primary transition-colors">{guide.title}</CardTitle>
                  <CardDescription className="mt-1.5">{guide.description}</CardDescription>
                  <div className="mt-4">
                    <Badge variant={guide.difficulty === "Beginner" ? "success" : guide.difficulty === "Intermediate" ? "warning" : "danger"}>
                      {guide.difficulty}
                    </Badge>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </Container>
      </Section>
    </>
  )
}
