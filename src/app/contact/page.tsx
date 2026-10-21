import { Container } from "@/components/ui/container"
import { Breadcrumbs } from "@/components/seo/breadcrumbs"
import { BreadcrumbSchema, WebPageSchema } from "@/components/seo/json-ld"
import { site } from "@/lib/constants"
import { createMetadata } from "@/lib/metadata"
import { ContactForm } from "@/components/pages/contact-form"
import { ToastProvider } from "@/components/ui/toast"
import { SocialLinkList } from "@/components/brand/social-icons"

export const metadata = createMetadata({
  title: "Contact PilotStack — Feedback, Corrections & Partnerships",
  description: "Get in touch with the PilotStack team. Send feedback about a review, report an error, suggest a topic or tool for future coverage, or ask about partnerships.",
  path: "/contact",
})

export default function ContactPage() {
  const contactFormConfigured = Boolean(process.env.RESEND_API_KEY && process.env.CONTACT_FROM_EMAIL)

  return (
    <>
      <BreadcrumbSchema items={[{ name: "Home", href: "/" }, { name: "Contact", href: "/contact" }]} />
      <WebPageSchema name="Contact PilotStack" description="Get in touch with the PilotStack team." url={`${site.url}/contact`} />
      <Container className="pt-8">
        <Breadcrumbs items={[{ name: "Contact" }]} />
      </Container>
      {contactFormConfigured ? (
        <ToastProvider>
          <ContactForm />
        </ToastProvider>
      ) : (
        <Container className="pt-8">
          <div className="max-w-xl mx-auto rounded-xl border border-border bg-muted-bg p-6">
            <h1 className="text-2xl font-bold mb-3">Get in touch</h1>
            <p className="text-sm text-muted-foreground">
              The contact form is temporarily unavailable because email delivery is not configured. Messages are not stored or sent through this form right now. Please use the email links below instead.
            </p>
          </div>
        </Container>
      )}
      <Container className="pb-16 sm:pb-20 lg:pb-24">
        <div className="max-w-2xl mx-auto mt-16 p-6 rounded-xl bg-muted-bg border border-border">
          <h2 className="text-lg font-bold mb-2">Other ways to reach us</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Prefer email? Write to us directly at{" "}
            <a href="mailto:hello@pilotstack.online" className="text-primary hover:underline font-medium">
              hello@pilotstack.online
            </a>
          </p>
          <p className="text-sm text-muted-foreground mb-4">
            For privacy-related inquiries, contact us at{" "}
            <a href="mailto:privacy@pilotstack.online" className="text-primary hover:underline font-medium">
              privacy@pilotstack.online
            </a>
          </p>
        </div>
        <div className="max-w-2xl mx-auto mt-6 p-6 rounded-xl bg-muted-bg border border-border">
          <h2 className="text-lg font-bold mb-2">Official Community</h2>
          <p className="text-sm text-muted-foreground mb-4">Join the PilotStack community:</p>
          <SocialLinkList />
        </div>
      </Container>
    </>
  )
}
