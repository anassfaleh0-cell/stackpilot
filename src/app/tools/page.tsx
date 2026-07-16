import { Container, Section, SectionHeader } from "@/components/ui/container"
import { Badge } from "@/components/ui/badge"
import { Card, CardTitle, CardDescription } from "@/components/ui/card"
import { Breadcrumbs } from "@/components/seo/breadcrumbs"
import { BreadcrumbSchema } from "@/components/seo/json-ld"
import { createMetadata } from "@/lib/metadata"
import Link from "next/link"
import { Calculator, Scale, ArrowRight } from "lucide-react"

export const metadata = createMetadata({
  title: "Free Software Tools",
  description: "Free interactive tools to help you compare software, calculate ROI, and make better buying decisions.",
  path: "/tools",
})

const tools = [
  { slug: "tco-calculator", name: "TCO Calculator", description: "Calculate the total cost of ownership for any software tool.", icon: Calculator },
  { slug: "software-comparison", name: "Software Comparison Matrix", description: "Compare multiple tools side by side across dozens of criteria.", icon: Scale },
]

export default function ToolsPage() {
  return (
    <>
      <BreadcrumbSchema items={[{ name: "Home", href: "/" }, { name: "Tools", href: "/tools" }]} />
      <Container className="pt-8">
        <Breadcrumbs items={[{ name: "Free Tools" }]} />
      </Container>
      <Section className="pt-0">
        <Container>
          <SectionHeader className="mb-12">
            <Badge variant="default" className="mb-4">Free Tools</Badge>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">Smarter decisions, free tools</h1>
            <p className="text-lg text-muted">Interactive calculators and comparison tools to help you evaluate software with data, not guesswork.</p>
          </SectionHeader>
          <div className="grid sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {tools.map((tool) => (
              <Link key={tool.slug} href={`/tools/${tool.slug}`} className="group">
                <Card className="h-full hover:border-primary/30 text-center">
                  <tool.icon size={32} className="mx-auto mb-4 text-primary" />
                  <CardTitle className="group-hover:text-primary transition-colors">{tool.name}</CardTitle>
                  <CardDescription className="mt-1.5">{tool.description}</CardDescription>
                </Card>
              </Link>
            ))}
          </div>
        </Container>
      </Section>
    </>
  )
}
