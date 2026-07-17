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
  description: "Meet the StackPilot editorial team — experienced software analysts, researchers, and industry specialists who test and review every tool on our platform.",
  path: "/authors",
})

const authors = [
  { slug: "stackpilot-team", name: "StackPilot Team", role: "Editorial Team", bio: "Collective expertise of our editorial team spanning software engineering, product management, digital marketing, and enterprise IT." },
  { slug: "alex-chen", name: "Alex Chen", role: "Senior Software Analyst", bio: "Developer tools, AI platforms, and productivity software specialist with a software engineering background." },
  { slug: "sarah-mitchell", name: "Sarah Mitchell", role: "CRM & Marketing Analyst", bio: "CRM, marketing automation, and sales tools expert with hands-on marketing operations experience." },
  { slug: "jordan-park", name: "Jordan Park", role: "Research Analyst", bio: "Market research and data analysis lead with expertise in pricing research and industry benchmarks." },
  { slug: "priya-sharma", name: "Priya Sharma", role: "Editorial Director", bio: "Editorial quality, fact-checking, and content standards overseer with 12+ years in B2B content." },
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
              Every review on StackPilot is written by experienced analysts who test software hands-on. Our team brings together expertise across software engineering, product management, marketing, and data science.
            </p>

            <div className="grid sm:grid-cols-2 gap-6">
              {authors.map((author) => (
                <Link key={author.slug} href={`/authors/${author.slug}`} className="group card-hover-lift">
                  <Card className="p-6 h-full flex flex-col">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-muted-bg flex items-center justify-center shrink-0 border border-border">
                        <span className="text-lg font-bold text-primary">{author.name.charAt(0)}</span>
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
          </div>
        </Container>
      </Section>
    </>
  )
}
