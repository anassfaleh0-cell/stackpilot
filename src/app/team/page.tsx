import { Container, Section } from "@/components/ui/container"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Breadcrumbs } from "@/components/seo/breadcrumbs"
import { BreadcrumbSchema } from "@/components/seo/json-ld"
import { createMetadata } from "@/lib/metadata"
import Link from "next/link"

export const metadata = createMetadata({
  title: "Our Team — Meet the PilotStack Editorial Team",
  description: "PilotStack is run by a small, independent team. Every review follows our published methodology: hands-on testing, transparent scoring, and no vendor-paid placement.",
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
              PilotStack is run by a small, independent team. Every review follows our published
              methodology — no individual bios are published at this stage, but the process behind
              every score is public.
            </p>
            <Card className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-white text-sm font-bold shrink-0">
                  PT
                </div>
                <div>
                  <h2 className="font-semibold">PilotStack Team</h2>
                  <p className="text-xs text-muted-foreground">Editorial & Research</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                Every review on PilotStack follows our published methodology: hands-on testing for a
                minimum of two weeks, scored against a five-dimension rubric, and cross-checked
against public user feedback from G2, Capterra, and TrustRadius. We don&apos;t publish
individual bios at this stage, but our full testing process is public.
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
