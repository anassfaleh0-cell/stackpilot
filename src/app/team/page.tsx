import { Container, Section } from "@/components/ui/container"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Breadcrumbs } from "@/components/seo/breadcrumbs"
import { BreadcrumbSchema } from "@/components/seo/json-ld"
import { createMetadata } from "@/lib/metadata"
import { AuthorAvatar } from "@/components/editorial/author-avatar"
import Link from "next/link"

export const metadata = createMetadata({
  title: "Publisher & Editorial Process",
  description: "How PilotStack attributes its software reviews and explains its scoring method, source limitations, and commercial disclosures.",
  path: "/team",
})

export default function TeamPage() {
  return (
    <>
      <BreadcrumbSchema items={[{ name: "Home", href: "/" }, { name: "Publisher & Editorial Process", href: "/team" }]} />
      <Container className="pt-8">
        <Breadcrumbs items={[{ name: "Publisher & Editorial Process" }]} />
      </Container>
      <Section className="pt-0">
        <Container>
          <div className="max-w-3xl mx-auto">
            <Badge variant="default" className="mb-4">Publisher Information</Badge>
            <h1 className="text-4xl font-bold tracking-tight mb-4">How PilotStack Content Is Attributed</h1>
            <p className="text-lg text-muted-foreground text-pretty mb-8">
              PilotStack uses a publisher byline for its content. This page is not a staff directory, and a byline should not be taken as proof of hands-on product testing. Read our{" "}
              <Link href="/authors">authors</Link> pages, and the process behind every score is public.
            </p>
            <Card className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <AuthorAvatar name="PilotStack Editorial" size="md" />
                <div>
                  <h2 className="font-semibold">PilotStack Editorial</h2>
                  <p className="text-xs text-muted-foreground">Publisher Byline</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                PilotStack publishes its scoring and sourcing methodology so readers can understand how editorial scores are calculated and where the evidence has limits.
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
