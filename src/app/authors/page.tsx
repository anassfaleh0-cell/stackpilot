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
  title: "PilotStack Editorial Byline",
  description: "Learn what the PilotStack publication byline represents and how software pages are prepared from recorded data and published scoring rules.",
  path: "/authors",
})

const authors = [
  {
    slug: "pilotstack-team",
    name: "PilotStack Team",
    role: "Publication byline",
    bio: "This is the publication byline used for pages prepared from recorded product information and published scoring rules; it is not an individual biography or a claim of hands-on testing for every product.",
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
            <Badge variant="default" className="mb-4">Editorial byline</Badge>
            <h1 className="text-4xl font-bold tracking-tight mb-4">About the PilotStack editorial byline</h1>
            <p className="text-lg text-muted-foreground mb-10 max-w-2xl">
              PilotStack currently publishes under one publication byline. The byline identifies the site responsible for the content; it does not imply that every product has been hands-on tested by a named reviewer.
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
