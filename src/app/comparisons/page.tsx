import { Container, Section, SectionHeader } from "@/components/ui/container"
import { Badge } from "@/components/ui/badge"
import { Card, CardTitle, CardDescription } from "@/components/ui/card"
import { Breadcrumbs } from "@/components/seo/breadcrumbs"
import { BreadcrumbSchema } from "@/components/seo/json-ld"
import { createMetadata } from "@/lib/metadata"
import { getAllComparisons } from "@/lib/content/registry"
import Link from "next/link"
import { ArrowRight, Crosshair, Shield } from "lucide-react"
import { BrandPattern } from "@/components/brand/patterns"

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

      <section className="relative overflow-hidden border-b border-border">
        <BrandPattern variant="cross" opacity={0.2} className="text-primary" />
        <Container className="relative py-16 sm:py-20">
          <SectionHeader className="mb-0">
            <Badge variant="default" className="mb-4">Comparisons</Badge>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">Side-by-side comparisons</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
              We pit the most popular tools against each other so you can see exactly how they compare across features, pricing, and user experience.
            </p>
          </SectionHeader>
        </Container>
      </section>

      <Section>
        <Container>
          <div className="grid sm:grid-cols-2 gap-6">
            {comparisons.map((cmp) => (
              <Link key={cmp.slug} href={`/comparisons/${cmp.slug}`} className="group card-hover">
                <Card className="h-full flex flex-col">
                  <div className="flex items-start justify-between mb-3">
                    <Badge variant="secondary">{cmp.category}</Badge>
                    {cmp.winner ? (
                      <span className="text-xs font-medium text-success flex items-center gap-1">
                        <Shield size={12} /> {cmp.winner} wins
                      </span>
                    ) : (
                      <Crosshair size={16} className="text-muted-foreground" />
                    )}
                  </div>
                  <CardTitle className="group-hover:text-primary transition-colors">{cmp.title}</CardTitle>
                  <CardDescription className="mt-1.5">{cmp.description}</CardDescription>
                  <div className="mt-4 pt-4 border-t border-border flex items-center gap-1 text-xs font-medium text-muted-foreground group-hover:text-primary transition-colors mt-auto">
                    View comparison <ArrowRight size={12} className="transition-transform group-hover:translate-x-0.5" />
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
