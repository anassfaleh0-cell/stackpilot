import { Container, Section } from "@/components/ui/container"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Breadcrumbs } from "@/components/seo/breadcrumbs"
import { BreadcrumbSchema } from "@/components/seo/json-ld"
import { createMetadata } from "@/lib/metadata"
import { AuthorAvatar } from "@/components/editorial/author-avatar"
import Link from "next/link"

export const metadata = createMetadata({
  title: "Publisher & Editorial Process | PilotStack",
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
            <Badge variant="default" className="mb-4">About the Publisher</Badge>
            <h1 className="text-4xl font-bold tracking-tight mb-4">PilotStack Publisher & Editorial Process</h1>
            <p className="text-lg text-muted-foreground text-pretty mb-8">
              PilotStack is independently operated and uses a publisher byline rather than presenting this page as a staffed research department. Content attribution is explained on our{" "}
              <Link href="/authors">authors</Link> page. Our methodology explains the scoring criteria and makes clear that a stored figure is verified only after source verification confirms its provenance and calculation can be checked.
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
            <section className="mt-8 space-y-6">
              <div>
                <h2 className="text-xl font-bold mb-2">How content is prepared</h2>
                <p className="text-sm leading-relaxed text-muted-foreground">PilotStack organizes software research into reviews, comparisons, buying guides and workflow resources. These formats serve different purposes: a review describes what a buyer should investigate about one product; a comparison tests the differences relevant to a specific decision; and a guide explains a repeatable evaluation process. The presence of a page does not mean every feature, price or rating has been independently tested.</p>
              </div>
              <div>
                <h2 className="text-xl font-bold mb-2">Evidence and corrections</h2>
                <p className="text-sm leading-relaxed text-muted-foreground">Where current primary evidence is unavailable, product-specific details should be treated as unverified rather than assumed to be current. Readers and vendors can report an exact claim and provide a public source through the <Link href="/contact" className="text-primary hover:underline">contact page</Link>. Reports are reviewed for relevance and evidence; corrections may update the text, date or stated limitation.</p>
              </div>
              <div>
                <h2 className="text-xl font-bold mb-2">Commercial relationships</h2>
                <p className="text-sm leading-relaxed text-muted-foreground">PilotStack may earn commissions from qualifying affiliate links and may display advertising. Such commercial relationships should be disclosed and should not be presented as evidence that a product is objectively best. Review the <Link href="/affiliate-disclosure" className="text-primary hover:underline">affiliate disclosure</Link> and <Link href="/editorial-policy" className="text-primary hover:underline">editorial policy</Link> for additional context.</p>
              </div>
            </section>
          </div>
        </Container>
      </Section>
    </>
  )
}
