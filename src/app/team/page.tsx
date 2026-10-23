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
  description: "Learn how PilotStack is independently operated, how its publisher byline works, and how its software research handles sources and evidence limitations.",
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
              PilotStack is independently operated and uses a publisher byline rather than presenting this page as a staffed research department. Content attribution is explained on our{" "}
              <Link href="/authors">authors</Link> page. Our methodology explains the scoring criteria and makes clear that a stored figure is verified only when its source and calculation can be checked.
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
