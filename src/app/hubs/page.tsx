import { Container, Section, SectionHeader } from "@/components/ui/container"
import { Badge } from "@/components/ui/badge"
import { Card, CardTitle, CardDescription } from "@/components/ui/card"
import { Breadcrumbs } from "@/components/seo/breadcrumbs"
import { BreadcrumbSchema, CollectionPageSchema, ItemListSchema } from "@/components/seo/json-ld"
import { site } from "@/lib/constants"
import { createMetadata } from "@/lib/metadata"
import { getAllHubs } from "@/lib/content/registry"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { BrandPattern } from "@/components/brand/patterns"

export const metadata = createMetadata({
  title: "Software by Business Type",
  description: "Curated software stacks and recommendations tailored to your business type. Find the right tools for startups, agencies, enterprises, and more.",
  path: "/hubs",
})

export default function HubsPage() {
  const hubs = getAllHubs()

  return (
    <>
      <CollectionPageSchema name="Software by Business Type" description="Tailored software recommendations for every business type" url={`${site.url}/hubs`} />
      <ItemListSchema items={hubs.map(h => ({ name: h.title, url: `${site.url}/hubs/${h.slug}` }))} url={`${site.url}/hubs`} />
      <BreadcrumbSchema items={[{ name: "Home", href: "/" }, { name: "By Business Type", href: "/hubs" }]} />
      <Container className="pt-8">
        <Breadcrumbs items={[{ name: "By Business Type" }]} />
      </Container>
      <section className="relative overflow-hidden border-b border-border">
        <BrandPattern variant="circuit" opacity={0.15} className="text-primary" />
        <Container className="relative py-16 sm:py-20">
          <SectionHeader className="mb-0">
            <Badge variant="default" className="mb-4">Business Hubs</Badge>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">Software by business type</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
              Curated software stacks tailored to your organization type. Find the right tools for your unique challenges.
            </p>
          </SectionHeader>
        </Container>
      </section>
      <Section>
        <Container>
          {hubs.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {hubs.map((hub) => (
              <Link key={hub.slug} href={`/hubs/${hub.slug}`} className="group card-hover">
                <Card className="h-full flex flex-col">
                  <CardTitle className="group-hover:text-primary transition-colors">{hub.title}</CardTitle>
                  <CardDescription className="mt-1.5">{hub.description}</CardDescription>
                  <div className="mt-auto pt-4 border-t border-border">
                    <span className="text-xs text-muted-foreground">{hub.recommendations.length} software recommendations</span>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
          ) : (
            <p className="text-center text-muted-foreground py-12">No hubs available yet.</p>
          )}
        </Container>
      </Section>
    </>
  )
}
