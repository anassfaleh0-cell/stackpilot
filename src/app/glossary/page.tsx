import { Container, Section, SectionHeader } from "@/components/ui/container"
import { Badge } from "@/components/ui/badge"
import { Card, CardTitle, CardDescription } from "@/components/ui/card"
import { Breadcrumbs } from "@/components/seo/breadcrumbs"
import { BreadcrumbSchema } from "@/components/seo/json-ld"
import { createMetadata } from "@/lib/metadata"
import { getAllGlossaryTerms } from "@/lib/content/registry"
import Link from "next/link"
import { Book } from "lucide-react"

export const metadata = createMetadata({
  title: "Glossary of Software Terms",
  description: "Comprehensive glossary of software, SaaS, and technology terms with clear definitions, real-world examples, and related concepts. Understand the terminology that matters for your business.",
  path: "/glossary",
})

export default function GlossaryPage() {
  const terms = getAllGlossaryTerms()

  return (
    <>
      <BreadcrumbSchema items={[{ name: "Home", href: "/" }, { name: "Glossary", href: "/glossary" }]} />
      <Container className="pt-8">
        <Breadcrumbs items={[{ name: "Glossary" }]} />
      </Container>
      <Section className="pt-0">
        <Container>
          <SectionHeader className="mb-12">
            <Badge variant="default" className="mb-4">Glossary</Badge>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">Software glossary</h1>
            <p className="text-lg text-muted">Clear, concise definitions of the most important software and technology terms.</p>
          </SectionHeader>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {terms.map((item) => (
              <Link key={item.slug} href={`/glossary/${item.slug}`} className="group">
                <Card className="h-full hover:border-primary/30">
                  <div className="flex items-start justify-between mb-2">
                    <Badge variant="secondary">{item.category}</Badge>
                    <Book size={14} className="text-muted" />
                  </div>
                  <CardTitle className="text-base group-hover:text-primary transition-colors">{item.term}</CardTitle>
                  <CardDescription className="mt-1 text-xs">{item.definition}</CardDescription>
                </Card>
              </Link>
            ))}
          </div>
        </Container>
      </Section>
    </>
  )
}
