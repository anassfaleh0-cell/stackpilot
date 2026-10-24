import { Container, Section } from "@/components/ui/container"
import { Badge } from "@/components/ui/badge"
import { Card, CardTitle, CardDescription } from "@/components/ui/card"
import { Breadcrumbs } from "@/components/seo/breadcrumbs"
import { BreadcrumbSchema } from "@/components/seo/json-ld"
import { createMetadata } from "@/lib/metadata"
import { isPublicAuthor } from "@/lib/authors"
import { AuthorAvatar } from "@/components/editorial/author-avatar"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export const metadata = createMetadata({
  title: "Authors & Editorial Byline",
  description: "PilotStack uses a publisher byline for its software reviews and guides. The byline is not a claim of a staffed research team or independent live-product trials.",
  path: "/authors",
})

const authors = [
  {
    slug: "pilotstack-team",
    name: "PilotStack Team",
    role: "Publisher Byline",
    bio: "This is the publisher byline used on PilotStack content, not a biography of a named individual. Pages draw on structured product records and public sources; the byline does not imply that every product was independently trialed in a live environment.",
  },
]

export default function AuthorsPage() {
  return (
    <>
      <BreadcrumbSchema items={[{ name: "Home", href: "/" }, { name: "Authors", href: "/authors" }]} />
      <Container className="pt-8">
        <Breadcrumbs items={[{ name: "Authors" }]} />
      </Container>
      <Section className="pt-0">
        <Container>
          <div className="max-w-4xl mx-auto">
            <Badge variant="default" className="mb-4">Editorial Byline</Badge>
            <h1 className="text-4xl font-bold tracking-tight mb-4">How PilotStack Content Is Attributed</h1>
            <p className="text-lg text-muted-foreground mb-10 max-w-2xl">
              PilotStack uses a publisher byline for content attribution. It should not be read as a staff directory, proof of individual credentials, or a claim that every product has been independently tested.
            </p>

            <div className="grid sm:grid-cols-2 gap-6">
              {authors.filter((author) => isPublicAuthor(author.slug)).map((author) => (
                <Link key={author.slug} href={`/authors/${author.slug}`} className="group card-hover-lift">
                  <Card className="p-6 h-full flex flex-col">
                    <div className="flex items-start gap-4 mb-4">
                      <AuthorAvatar name={author.name} size="md" />
                      <div>
                        <CardTitle className="text-base group-hover:text-primary transition-colors">{author.name}</CardTitle>
                        <Badge variant="secondary" className="mt-1 text-xs">{author.role}</Badge>
                      </div>
                    </div>
                    <CardDescription className="text-sm leading-relaxed">{author.bio}</CardDescription>
                    <div className="mt-auto pt-4 flex items-center gap-1 text-xs font-medium text-muted-foreground group-hover:text-primary transition-colors">
                      View profile <ArrowRight size={12} />
                    </div>
                  </Card>
                </Link>
              ))}
            </div>

            <div className="mt-10 p-6 rounded-xl bg-muted-bg border border-border">
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-2">How we score</h2>
              <p className="text-sm text-muted-foreground">
                The published rubric describes nine editorial rating dimensions. A score is shown as verified only when its inputs and calculation can be checked; recorded values are not third-party user-review averages or proof of independent live-product trials.{" "}
                <Link href="/methodology" className="text-primary hover:underline">Read the full methodology</Link>
              </p>
            </div>
            <section className="mt-8 space-y-6">
              <div>
                <h2 className="text-xl font-bold mb-2">Sources and evidence limits</h2>
                <p className="text-sm leading-relaxed text-muted-foreground">Software features, prices and plan terms change. Where a current primary source or reproducible calculation is not available, the page should state that limitation rather than imply a verified fact. Readers should confirm important purchase, security and compliance details directly with the vendor before relying on them.</p>
              </div>
              <div>
                <h2 className="text-xl font-bold mb-2">Updates and corrections</h2>
                <p className="text-sm leading-relaxed text-muted-foreground">If you find a factual issue, send the page URL, the exact statement and a reliable supporting source through our <Link href="/contact" className="text-primary hover:underline">contact page</Link>. Corrections are reviewed for evidence and context; a report does not guarantee that a claim will be changed in a particular way.</p>
              </div>
              <div>
                <h2 className="text-xl font-bold mb-2">Editorial and commercial transparency</h2>
                <p className="text-sm leading-relaxed text-muted-foreground">Affiliate links or advertising may support the publication, but commercial relationships should not be treated as evidence that a product is best. See the <Link href="/editorial-policy" className="text-primary hover:underline">editorial policy</Link> and <Link href="/affiliate-disclosure" className="text-primary hover:underline">affiliate disclosure</Link> for more detail.</p>
              </div>
            </section>
          </div>
        </Container>
      </Section>
    </>
  )
}
