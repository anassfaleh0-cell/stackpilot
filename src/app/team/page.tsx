import { Container, Section } from "@/components/ui/container"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Breadcrumbs } from "@/components/seo/breadcrumbs"
import { BreadcrumbSchema } from "@/components/seo/json-ld"
import { createMetadata } from "@/lib/metadata"
import { AuthorAvatar } from "@/components/editorial/author-avatar"

export const metadata = createMetadata({
  title: "Who Maintains PilotStack?",
  description: "Learn who the PilotStack publication byline represents and how its recorded-data and editorial methodology works.",
  path: "/team",
})

export default function TeamPage() {
  return (
    <>
      <BreadcrumbSchema items={[{ name: "Home", href: "/" }, { name: "Publisher", href: "/team" }]} />
      <Container className="pt-8">
        <Breadcrumbs items={[{ name: "Publisher" }]} />
      </Container>
      <Section className="pt-0">
        <Container>
          <div className="max-w-3xl mx-auto">
            <Badge variant="default" className="mb-4">Publisher</Badge>
            <h1 className="text-4xl font-bold tracking-tight mb-4">Who maintains PilotStack?</h1>
            <p className="text-lg text-muted-foreground text-pretty mb-8">
              PilotStack is an independent software research publication maintained by its site owner. The “PilotStack Team” byline identifies publication-level content; it is not a claim that multiple named reviewers personally tested every product. Our scoring rules and data notes are public so readers can judge the basis of each page.
            </p>
            <Card className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <AuthorAvatar name="PilotStack Team" size="md" />
                <div>
                  <h2 className="font-semibold">PilotStack Team</h2>
                  <p className="text-xs text-muted-foreground">Publication byline</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                This byline represents the PilotStack publication rather than an individual biography. Pages are prepared from recorded product information and the published methodology; we do not claim hands-on testing unless a page explicitly says so.
                Commercial relationships, when present, are disclosed and do not determine editorial scores or conclusions.
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
