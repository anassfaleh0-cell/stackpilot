import { Container, Section } from "@/components/ui/container"
import { Badge } from "@/components/ui/badge"
import { Card, CardTitle, CardDescription } from "@/components/ui/card"
import { Breadcrumbs } from "@/components/seo/breadcrumbs"
import { BreadcrumbSchema } from "@/components/seo/json-ld"
import { createMetadata } from "@/lib/metadata"
import { isPublicAuthor } from "@/lib/authors"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export const metadata = createMetadata({
  title: "Our Authors & Editorial Team",
  description: "PilotStack content is produced by a small, independent team following a published methodology — recorded scoring, transparent sourcing, and no vendor-paid placement.",
  path: "/authors",
})

const authors = [
  {
    slug: "sarah-chen",
    name: "Sarah Chen",
    role: "Founder & Editor-in-Chief",
    bio: "Sarah founded PilotStack and edits coverage in the Project Management, CRM & Sales, and Productivity categories, working to the site's published scoring and sourcing rules.",
    initials: "SC",
  },
  {
    slug: "marcus-rivera",
    name: "Marcus Rivera",
    role: "Senior Software Reviewer",
    bio: "Marcus writes PilotStack's coverage of Developer Tools, Analytics, and Security & Compliance, recording how products are documented and configured alongside the site's nine category scores.",
    initials: "MR",
  },
  {
    slug: "emily-nakamura",
    name: "Emily Nakamura",
    role: "Research Analyst",
    bio: "Emily leads PilotStack's research and market analysis pages, covering Finance, HR, Marketing, Communication and Design tools with an emphasis on recorded pricing and category data.",
    initials: "EN",
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
              Our editorial team publishes coverage across 12 categories. Every page follows the same published scoring and sourcing rules.
            </p>

            <div className="grid sm:grid-cols-2 gap-6">
              {authors.filter((author) => isPublicAuthor(author.slug)).map((author) => (
                <Link key={author.slug} href={`/authors/${author.slug}`} className="group card-hover-lift">
                  <Card className="p-6 h-full flex flex-col">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-muted-bg flex items-center justify-center shrink-0 border border-border">
                        <span className="text-lg font-bold text-primary">{author.initials}</span>
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
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-2">How we score</h2>
              <p className="text-sm text-muted-foreground">
                Every page carries nine recorded category scores on a 1-5 scale, with the overall rating as their
                mean rounded to one decimal. Figures come from one recorded source each, reused everywhere a tool
                appears, and facts we cannot source are omitted or marked unverified.{" "}
                <Link href="/methodology" className="text-primary hover:underline">Read the full methodology</Link>
              </p>
            </div>
          </div>
        </Container>
      </Section>
    </>
  )
}
