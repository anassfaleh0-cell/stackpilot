import { Container, Section } from "@/components/ui/container"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Breadcrumbs } from "@/components/seo/breadcrumbs"
import { BreadcrumbSchema } from "@/components/seo/json-ld"
import { createMetadata } from "@/lib/metadata"
import { AuthorAvatar } from "@/components/editorial/author-avatar"
import Link from "next/link"

export const metadata = createMetadata({
  title: "Our Team — Meet the PilotStack Editorial Team",
  description: "PilotStack is run by a small, independent team. Every page follows our published methodology: recorded scoring, transparent sourcing, and no vendor-paid placement.",
  path: "/team",
})

export default function TeamPage() {
  return (
    <>
      <BreadcrumbSchema items={[{ name: "Home", href: "/" }, { name: "Our Team", href: "/team" }]} />
      <Container className="pt-8">
        <Breadcrumbs items={[{ name: "Our Team" }]} />
      </Container>
      <Section className="pt-0">
        <Container>
          <div className="max-w-3xl mx-auto">
            <Badge variant="default" className="mb-4">Our People</Badge>
            <h1 className="text-4xl font-bold tracking-tight mb-4">Meet the PilotStack Team</h1>
            <p className="text-lg text-muted-foreground text-pretty mb-8">
              PilotStack is maintained by a small editorial team. Editorial roles are published on our{" "}
              <Link href="/authors">authors</Link> pages, and the process behind every score is public.
            </p>
            <Card className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <AuthorAvatar name="PilotStack Team" size="md" />
                <div>
                  <h2 className="font-semibold">PilotStack Team</h2>
                  <p className="text-xs text-muted-foreground">Editorial & Research</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                PilotStack publishes its scoring and sourcing methodology so readers can understand how pages are structured.
                Commercial relationships, including affiliate relationships or advertising where applicable, are
                disclosed and are not intended to determine editorial scores or conclusions.
              </p>
              <Link href="/methodology" className="text-sm text-primary hover:underline">
                Read our full methodology →
              </Link>
            </Card>
          </div>
        </Container>
      </Section>
    </>
  )
}
