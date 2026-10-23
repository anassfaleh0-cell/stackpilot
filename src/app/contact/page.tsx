import { Container } from "@/components/ui/container"
import { Breadcrumbs } from "@/components/seo/breadcrumbs"
import { BreadcrumbSchema, WebPageSchema } from "@/components/seo/json-ld"
import { site } from "@/lib/constants"
import { createMetadata } from "@/lib/metadata"

const contactEmail = "contact@pilotstack.online"

export const metadata = createMetadata({
  title: "Contact PilotStack — Feedback, Corrections & Partnerships",
  description:
    "Contact PilotStack to report factual errors, request corrections, suggest software coverage, ask about editorial standards, or discuss business inquiries.",
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
        description="Contact PilotStack about software reviews, corrections, research, and business inquiries."
        url={`${site.url}/contact`}
      />
      <Container className="pt-8">
        <Breadcrumbs items={[{ name: "Contact" }]} />
      </Container>

      <Container className="pt-8 pb-16 sm:pb-20 lg:pb-24">
        <article className="mx-auto max-w-3xl">
          <div className="rounded-xl border border-border bg-muted-bg p-6 sm:p-8">
            <p className="mb-2 text-sm font-medium text-primary">Reader support and editorial feedback</p>
            <h1 className="mb-4 text-3xl font-bold tracking-tight">Contact PilotStack</h1>
            <p className="mb-5 leading-relaxed text-muted-foreground">
              Contact us about the information published on PilotStack, a software profile you are evaluating, or a question about how our research and editorial policies work. Email is our official contact channel.
            </p>
            <a
              className="inline-flex min-h-11 items-center rounded-lg bg-primary px-5 text-sm font-semibold text-white underline-offset-4 hover:bg-primary-dark hover:underline"
              href="mailto:contact@pilotstack.online?subject=PilotStack%20feedback"
            >
              Email {contactEmail}
            </a>
            <p className="mt-4 text-sm text-muted-foreground">
              For the quickest review, include the relevant page URL, a short description of your question, and any public source that helps us verify the details.
            </p>
          </div>

          <section className="mt-8">
            <h2 className="mb-4 text-xl font-bold">How to contact us</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-border p-5">
                <h3 className="mb-2 font-semibold">Corrections and factual feedback</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  If a price, feature, product description, comparison, or other statement appears inaccurate, send the URL and identify the exact claim. A vendor documentation link or other reliable evidence is helpful. We assess reports before making changes; sending a correction does not guarantee a particular outcome.
                </p>
              </div>
              <div className="rounded-xl border border-border p-5">
                <h3 className="mb-2 font-semibold">Research and coverage suggestions</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Suggest a software product, category, buyer problem, or comparison you would like us to consider. Explain the audience and decision the proposed coverage would help with. Suggestions are reviewed for relevance and usefulness, not accepted automatically.
                </p>
              </div>
              <div className="rounded-xl border border-border p-5">
                <h3 className="mb-2 font-semibold">Editorial policy and methodology</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Ask how an editorial score is interpreted, how recorded facts differ from verified claims, or where commercial and affiliate relationships are disclosed. Our <a className="underline underline-offset-4 hover:text-primary" href="/methodology">methodology</a> and <a className="underline underline-offset-4 hover:text-primary" href="/editorial-policy">editorial policy</a> provide additional context.
                </p>
              </div>
              <div className="rounded-xl border border-border p-5">
                <h3 className="mb-2 font-semibold">Business and partnership inquiries</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Use the same email for business inquiries and potential partnerships. Commercial proposals are considered separately from editorial assessment; payment or a partnership proposal is not a guarantee of coverage, a positive review, or a particular ranking.
                </p>
              </div>
            </div>
          </section>

          <section className="mt-8 rounded-xl border border-border p-5">
            <h2 className="mb-2 text-lg font-bold">Privacy and safe communication</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Please do not send passwords, payment-card details, government identification numbers, private customer records, or other sensitive personal information. Email is not intended for urgent security incidents or confidential file transfers. Read our <a className="underline underline-offset-4 hover:text-primary" href="/privacy">Privacy Policy</a> for information about how contact messages and site data are handled.
            </p>
          </section>
        </article>
      </Container>
    </>
  )
}
