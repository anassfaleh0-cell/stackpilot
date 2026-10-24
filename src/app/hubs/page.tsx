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
  description: "Practical software selection guides for startups, agencies, enterprises, and other organizations, with criteria for workflow fit, integrations, data protection, and total cost.",
  path: "/hubs",
})

export default function HubsPage() {
  const hubs = getAllHubs()

  return (
    <>
      <CollectionPageSchema name="Software by Business Type" description="Practical software selection guides by business type" url={`${site.url}/hubs`} />
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
              Compare software for your organization using workflow requirements, integrations, data protection, implementation effort, and total cost. Verify product-specific claims with current vendor documentation.
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
                    <span className="text-xs text-muted-foreground">{hub.recommendations.length} products to evaluate</span>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
          ) : (
            <p className="text-center text-muted-foreground py-12">No hubs available yet.</p>
          )}
          <section className="mt-14 max-w-4xl mx-auto border-t border-border pt-8">
            <h2 className="text-2xl font-bold tracking-tight mb-3">Choose software for the way your organization works</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">Company size is only a starting point. A startup may need stronger access controls than a larger team, while an agency may prioritize client workspaces and reporting. Use the business-type guides to identify requirements, then verify each product against your own workflows.</p>
            <h3 className="text-lg font-semibold mb-2">Questions to answer before shortlisting</h3>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-5">
              <li>Who will use the software, who administers it, and which permissions are required?</li>
              <li>Which systems must integrate, and what data needs to move between them?</li>
              <li>What are the security, privacy, retention and audit requirements for your industry?</li>
              <li>How much setup, migration, training and ongoing administration can the team support?</li>
              <li>What is the total cost at today's size and at the expected size over the next one to three years?</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed">Treat each recommendation as a candidate for evaluation rather than an automatic endorsement. Features, pricing and regulatory obligations vary by plan, region and contract; check current vendor documentation and test important workflows before committing.</p>
          </section>
        </Container>
      </Section>
    </>
  )
}
