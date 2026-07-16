import { Container } from "@/components/ui/container"
import { Breadcrumbs } from "@/components/seo/breadcrumbs"
import { BreadcrumbSchema } from "@/components/seo/json-ld"
import { createMetadata } from "@/lib/metadata"
import { ContactForm } from "@/components/pages/contact-form"

export const metadata = createMetadata({
  title: "Contact",
  description: "Get in touch with the StackPilot team. We'd love to hear from you.",
  path: "/contact",
})

export default function ContactPage() {
  return (
    <>
      <BreadcrumbSchema items={[{ name: "Home", href: "/" }, { name: "Contact", href: "/contact" }]} />
      <Container className="pt-8">
        <Breadcrumbs items={[{ name: "Contact" }]} />
      </Container>
      <ContactForm />
    </>
  )
}
