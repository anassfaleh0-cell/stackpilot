import { Container, Section, SectionHeader } from "@/components/ui/container"
import { Badge } from "@/components/ui/badge"
import { Card, CardTitle, CardDescription } from "@/components/ui/card"
import { Breadcrumbs } from "@/components/seo/breadcrumbs"
import { BreadcrumbSchema } from "@/components/seo/json-ld"
import { createMetadata } from "@/lib/metadata"
import { getAllComparisons } from "@/lib/content/registry"
import Link from "next/link"
import { Crosshair } from "lucide-react"

export const metadata = createMetadata({
  title: "Software Comparisons",
  description: "Side-by-side comparisons of the most popular software tools. See how they stack up across features, pricing, and user satisfaction.",
  path: "/comparisons",
})

export default function ComparisonsPage() {
  const comparisons = getAllComparisons()

  return (
    <>
      <BreadcrumbSchema items={[{ name: "Home", href: "/" }, { name: "Comparisons", href: "/comparisons" }]} />
      <Container className="pt-8">
        <Breadcrumbs items={[{ name: "Comparisons" }]} />
      </Container>
      <Section className="pt-0">
        <Container>
          <SectionHeader className="mb-12">
            <Badge variant="default" className="mb-4">Comparisons</Badge>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">Side-by-side comparisons</h1>
            <p className="text-lg text-muted">We pit the most popular tools against each other so you can see exactly how they compare across features, pricing, and user experience.</p>
          </SectionHeader>
          <div className="grid sm:grid-cols-2 gap-6">
            {comparisons.map((cmp) => (
              <Link key={cmp.slug} href={`/comparisons/${cmp.slug}`} className="group">
                <Card className="h-full hover:border-primary/30">
                  <div className="flex items-start justify-between mb-3">
                    <Badge variant="secondary">{cmp.category}</Badge>
                    <Crosshair size={16} className="text-muted" />
                  </div>
                  <CardTitle className="group-hover:text-primary transition-colors">{cmp.title}</CardTitle>
                  <CardDescription className="mt-1.5">{cmp.description}</CardDescription>
                </Card>
              </Link>
            ))}
          </div>
        </Container>
      </Section>
    </>
  )
}
