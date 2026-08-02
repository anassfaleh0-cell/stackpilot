import { Container, Section } from "@/components/ui/container"
import { Badge } from "@/components/ui/badge"
import { Card, CardTitle, CardDescription } from "@/components/ui/card"
import { Breadcrumbs } from "@/components/seo/breadcrumbs"
import { BreadcrumbSchema } from "@/components/seo/json-ld"
import { createMetadata } from "@/lib/metadata"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export const metadata = createMetadata({
  title: "Our Authors & Editorial Team",
  description: "PilotStack content is produced by a small, independent team following a published methodology — hands-on testing, transparent scoring, and no vendor-paid placement.",
  path: "/authors",
})

const authors = [
  {
    slug: "pilotstack-team",
    name: "PilotStack Team",
    role: "Editorial Team",
    bio: "Every review on PilotStack is produced by our small, independent team following our published methodology: hands-on testing for a minimum of two weeks, scored against a five-dimension rubric, and cross-checked against public user feedback from G2, Capterra, and TrustRadius.",
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
            <Badge variant="default" className="mb-4">Our Team</Badge>
            <h1 className="text-4xl font-bold tracking-tight mb-4">Meet Our Editorial Team</h1>
            <p className="text-lg text-muted-foreground mb-10 max-w-2xl">
              PilotStack is run by a small, independent team. We don&apos;t publish individual bios at
              this stage, but our full testing process is public.
            </p>

            <div className="grid sm:grid-cols-2 gap-6">
              {authors.map((author) => (
                <Link key={author.slug} href={`/authors/${author.slug}`} className="group card-hover-lift">
                  <Card className="p-6 h-full flex flex-col">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-muted-bg flex items-center justify-center shrink-0 border border-border">
                        <span className="text-lg font-bold text-primary">PT</span>
                      </div>
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
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-2">How we test</h2>
              <p className="text-sm text-muted-foreground">
                Every review follows our published methodology: hands-on testing for a minimum of two
                weeks, scored against a five-dimension rubric, and cross-checked against public user
                feedback from G2, Capterra, and TrustRadius.{" "}
                <Link href="/methodology" className="text-primary hover:underline">Read the full methodology →</Link>
              </p>
            </div>
          </div>
        </Container>
      </Section>
    </>
  )
}
