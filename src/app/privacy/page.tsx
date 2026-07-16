import { Container, Section } from "@/components/ui/container"
import { Breadcrumbs } from "@/components/seo/breadcrumbs"
import { BreadcrumbSchema } from "@/components/seo/json-ld"
import { createMetadata } from "@/lib/metadata"

export const metadata = createMetadata({
  title: "Privacy Policy",
  description: "StackPilot's privacy policy outlines how we collect, use, and protect your personal data.",
  path: "/privacy",
})

export default function PrivacyPage() {
  return (
    <>
      <BreadcrumbSchema items={[{ name: "Home", href: "/" }, { name: "Privacy Policy", href: "/privacy" }]} />
      <Container className="pt-8">
        <Breadcrumbs items={[{ name: "Privacy Policy" }]} />
      </Container>
      <Section className="pt-0">
        <Container>
          <div className="max-w-3xl mx-auto prose prose-slate">
            <h1 className="text-4xl font-bold tracking-tight mb-6">Privacy Policy</h1>
            <p className="text-muted"><em>Last updated: July 2026</em></p>
            <h2>Information We Collect</h2>
            <p>We collect information you provide directly to us, such as when you subscribe to our newsletter, submit a contact form, or create an account. This may include your name, email address, and any other information you choose to provide.</p>
            <h2>How We Use Your Information</h2>
            <p>We use the information we collect to provide, maintain, and improve our services, to send you technical notices and support messages, and to communicate with you about our content.</p>
            <h2>Cookies</h2>
            <p>We use cookies and similar tracking technologies to track activity on our website and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.</p>
            <h2>Third-Party Services</h2>
            <p>We may employ third-party companies and individuals to facilitate our website, provide analytics services, or assist in analyzing how our service is used. These third parties have access to your personal information only to perform these tasks on our behalf.</p>
            <h2>Contact</h2>
            <p>If you have any questions about this Privacy Policy, please contact us through our contact page.</p>
          </div>
        </Container>
      </Section>
    </>
  )
}
