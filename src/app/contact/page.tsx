import { Container } from "@/components/ui/container"
import { Breadcrumbs } from "@/components/seo/breadcrumbs"
import { BreadcrumbSchema } from "@/components/seo/json-ld"
import { createMetadata } from "@/lib/metadata"
import { ContactForm } from "@/components/pages/contact-form"
import { ToastProvider } from "@/components/ui/toast"
import { SocialLinkList } from "@/components/brand/social-icons"

export const metadata = createMetadata({
  title: "Contact",
  description: "Get in touch with the PilotStack team. Have a question about a review, want to suggest a tool for testing, or interested in partnering with us? We'd love to hear from you.",
  path: "/contact",
})

export default function ContactPage() {
  return (
    <>
      <BreadcrumbSchema items={[{ name: "Home", href: "/" }, { name: "Contact", href: "/contact" }]} />
      <Container className="pt-8">
        <Breadcrumbs items={[{ name: "Contact" }]} />
      </Container>
      <ToastProvider>
        <ContactForm />
      </ToastProvider>
      <Container className="pb-16 sm:pb-20 lg:pb-24">
        <div className="max-w-2xl mx-auto mt-16 p-6 rounded-xl bg-muted-bg border border-border">
          <h2 className="text-lg font-bold mb-2">Official Community</h2>
          <p className="text-sm text-muted-foreground mb-4">Join the PilotStack community:</p>
          <SocialLinkList />
        </div>
      </Container>
    </>
  )
}
