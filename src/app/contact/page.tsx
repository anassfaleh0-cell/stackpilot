import { Container } from "@/components/ui/container"
import { Breadcrumbs } from "@/components/seo/breadcrumbs"
import { BreadcrumbSchema, WebPageSchema } from "@/components/seo/json-ld"
import { site } from "@/lib/constants"
import { createMetadata } from "@/lib/metadata"

const contactEmail = "contact@pilotstack.online"

export const metadata = createMetadata({
  title: "Contact PilotStack — Feedback, Corrections & Partnerships",
  description:
    "Contact PilotStack about software reviews, corrections, research, or business inquiries.",
  path: "/contact",
})

export default function ContactPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", href: "/" },
          { name: "Contact", href: "/contact" },
        ]}
      />
      <WebPageSchema
        name="Contact PilotStack"
        description="Contact PilotStack about reviews, corrections, and business inquiries."
        url={`${site.url}/contact`}
      />
      <Container className="pt-8">
        <Breadcrumbs items={[{ name: "Contact" }]} />
      </Container>

      <Container className="pt-8">
        <div className="mx-auto max-w-2xl rounded-xl border border-border bg-muted-bg p-6">
          <h1 className="mb-3 text-2xl font-bold">Contact PilotStack</h1>
          <p className="mb-4 text-sm text-muted-foreground">
            Send feedback about a review, report a factual error, suggest a
            topic, or ask about a business inquiry. Email is the official contact channel.
          </p>
          <a
            className="inline-flex underline underline-offset-4"
            href="mailto:contact@pilotstack.online"
          >
            {contactEmail}
          </a>
        </div>
      </Container>

      <Container className="pb-16 sm:pb-20 lg:pb-24">
        <div className="mx-auto mt-8 max-w-2xl rounded-xl border border-border bg-muted-bg p-6">
          <h2 className="mb-2 text-lg font-bold">What to contact us about</h2>
          <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
            <li>Corrections to software facts, ratings, or pricing details</li>
            <li>Suggestions for reviews, comparisons, and research</li>
            <li>Questions about our editorial methodology or disclosures</li>
            <li>Business and partnership inquiries</li>
          </ul>
          <p className="mt-4 text-sm text-muted-foreground">
            Please do not include passwords, payment details, or other sensitive
            personal information in your message.
          </p>
        </div>
      </Container>
    </>
  )
}
