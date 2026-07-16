import { Container, Section } from "@/components/ui/container"
import { Breadcrumbs } from "@/components/seo/breadcrumbs"
import { BreadcrumbSchema } from "@/components/seo/json-ld"
import { createMetadata } from "@/lib/metadata"

export const metadata = createMetadata({
  title: "Terms of Service",
  description: "StackPilot's terms of service govern the use of our website and content.",
  path: "/terms",
})

export default function TermsPage() {
  return (
    <>
      <BreadcrumbSchema items={[{ name: "Home", href: "/" }, { name: "Terms of Service", href: "/terms" }]} />
      <Container className="pt-8">
        <Breadcrumbs items={[{ name: "Terms of Service" }]} />
      </Container>
      <Section className="pt-0">
        <Container>
          <div className="max-w-3xl mx-auto prose prose-slate">
            <h1 className="text-4xl font-bold tracking-tight mb-6">Terms of Service</h1>
            <p className="text-muted"><em>Last updated: July 2026</em></p>
            <h2>Acceptance of Terms</h2>
            <p>By accessing or using StackPilot, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our website.</p>
            <h2>Content</h2>
            <p>All content on StackPilot is provided for informational purposes only. We strive for accuracy but make no warranties about the completeness or reliability of our content. Tool ratings, reviews, and recommendations represent the opinions of our reviewers.</p>
            <h2>Affiliate Disclosure</h2>
            <p>StackPilot may earn affiliate commissions from some of the products and services we review. This does not affect our editorial independence or the objectivity of our reviews.</p>
            <h2>Intellectual Property</h2>
            <p>All content, trademarks, and intellectual property on StackPilot are owned by or licensed to us. You may not reproduce, distribute, or create derivative works without our express permission.</p>
            <h2>Limitation of Liability</h2>
            <p>StackPilot shall not be liable for any damages arising from your use of or inability to use our website or the content provided.</p>
            <h2>Changes</h2>
            <p>We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting.</p>
          </div>
        </Container>
      </Section>
    </>
  )
}
