import { Container, Section } from "@/components/ui/container"
import { Badge } from "@/components/ui/badge"
import { Breadcrumbs } from "@/components/seo/breadcrumbs"
import { BreadcrumbSchema, WebPageSchema } from "@/components/seo/json-ld"
import { site } from "@/lib/constants"
import { createMetadata } from "@/lib/metadata"

export const metadata = createMetadata({
  title: "About PilotStack — Our Mission & Editorial Standards",
  description: "Learn how PilotStack researches software, evaluates product fit, distinguishes verified facts from editorial judgment, and handles corrections and commercial relationships.",
  path: "/about",
})

const principles = [
  {
    title: "Start with the buyer's decision",
    body: "We organize information around practical questions: who a product may suit, which workflows to test, what trade-offs to consider, and what to confirm before paying or migrating.",
  },
  {
    title: "Separate evidence from interpretation",
    body: "Vendor statements, recorded profile data, and PilotStack's editorial assessment are not interchangeable. Where a fact, price, rating, or feature has not been verified, we say so instead of presenting it as independently confirmed.",
  },
  {
    title: "Explain limitations",
    body: "No product is the right fit for every organization. Reviews should identify meaningful constraints and circumstances in which another approach may work better, not simply list benefits.",
  },
  {
    title: "Keep commercial relationships transparent",
    body: "PilotStack may earn revenue from affiliate links or other disclosed commercial relationships. Such relationships are not a substitute for evidence and do not determine editorial scores or conclusions.",
  },
]

export default function AboutPage() {
  return (
    <>
      <BreadcrumbSchema items={[{ name: "Home", href: "/" }, { name: "About", href: "/about" }]} />
      <WebPageSchema name="About PilotStack" description="Learn about PilotStack's mission, research process, editorial standards, and commercial disclosures." url={`${site.url}/about`} />
      <Container className="pt-8">
        <Breadcrumbs items={[{ name: "About" }]} />
      </Container>
      <Section className="pt-0">
        <Container>
          <article className="max-w-3xl mx-auto">
            <Badge variant="default" className="mb-4">About PilotStack</Badge>
            <h1 className="text-4xl font-bold tracking-tight mb-6">Software decisions deserve clear evidence</h1>
            <div className="prose prose-slate max-w-none">
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                PilotStack is an independently operated software research publication. We publish reviews, comparisons, buying guides, and practical resources intended to help people evaluate business software with more clarity and less guesswork.
              </p>
              <p className="text-muted-foreground mb-4">
                Choosing software can involve more than comparing feature lists. Teams need to understand the work a product is designed for, the effort required to adopt it, its limits, how it fits with existing systems, and the total cost of using it. Our content is organized to help readers ask those questions before making a purchase or migration decision.
              </p>
              <p className="text-muted-foreground mb-4">
                PilotStack is a research and editorial resource, not a software vendor or a certification body. A published profile does not mean that PilotStack has personally tested every feature, interviewed the vendor, or independently verified every commercial term. We identify the status of important claims where that status is known. Older recorded editorial scores can remain visible as clearly labeled provisional values. They are not treated as independently verified, third-party user averages, or evidence of hands-on testing unless their source, calculation, and testing status are documented. Readers should consult the evidence notes and limitations. We encourage readers to confirm time-sensitive details with the vendor before relying on them.
              </p>

              <h2 className="text-2xl font-bold mt-10 mb-4">How we research software</h2>
              <p className="text-muted-foreground mb-4">
                Our research begins with the intended buyer and use case. We organize the available product information into practical evaluation areas such as workflow fit, core capabilities, administration, integrations, security considerations, pricing structure, implementation effort, and migration risk. Not every category is equally relevant to every product.
              </p>
              <p className="text-muted-foreground mb-4">
                We distinguish recorded product information from editorial interpretation. Current prices, plan limits, security certifications, integration availability, and third-party review totals can change or vary by plan and region. When we cannot substantiate a detail, it should be treated as unverified rather than as a confirmed fact. Readers should check the vendor's current documentation and contract terms for decisions that depend on those details.
              </p>
              <p className="text-muted-foreground mb-4">
                Comparisons are most useful when they explain meaningful differences. We aim to describe the problem each product solves, the circumstances in which each option may fit, the trade-offs a buyer should investigate, and the questions that a trial or vendor conversation should answer. Products that solve different problems should not be treated as direct substitutes simply because they appear in the same broad category.
              </p>

              <h2 className="text-2xl font-bold mt-10 mb-4">Editorial scoring and updates</h2>
              <p className="text-muted-foreground mb-4">
                Where an editorial score is published, it represents PilotStack's assessment under the stated methodology; it is not the same as a third-party customer-review average. Readers can consult our <a href="/methodology">scoring methodology</a> for the criteria and interpretation. We do not treat a missing value as a zero score or as proof that a product lacks a capability.
              </p>
              <p className="text-muted-foreground mb-4">
                Software products evolve. We review material changes when reliable information is available and identify details that require fresh confirmation. A page's presence on the site is not a promise that every data point has been independently tested on the date of reading. If you find a factual error, outdated claim, broken reference, or unclear distinction between evidence and opinion, please contact us with the page URL and supporting context so it can be assessed.
              </p>

              <h2 className="text-2xl font-bold mt-10 mb-4">Independence and revenue</h2>
              <p className="text-muted-foreground mb-4">
                PilotStack may use affiliate links or other commercial relationships to support the publication. If a reader follows an affiliate link and completes a qualifying action, PilotStack may receive compensation at no additional cost to the reader, depending on the partner's terms. Not every link is an affiliate link, and the presence of a commercial relationship should be disclosed clearly.
              </p>
              <p className="text-muted-foreground mb-4">
                Compensation is not evidence that a product is better, and it should not be represented as proof of independent testing. Editorial assessments and commercial disclosures serve different purposes; consult our <a href="/affiliate-disclosure">affiliate disclosure</a>, <a href="/advertising-disclosure">advertising disclosure</a>, and <a href="/editorial-independence">editorial independence policy</a> for more detail.
              </p>

              <h2 className="text-2xl font-bold mt-10 mb-4">Corrections and reader feedback</h2>
              <p className="text-muted-foreground mb-4">
                Useful feedback is specific and checkable. When reporting an issue, include the page URL, the statement in question, why it may be inaccurate, and a reliable source or explanation if available. We assess submitted corrections and update content when the evidence supports a change. You can also suggest a product, comparison, or buyer question for future coverage; suggestions are considered for relevance and usefulness, not as a guarantee of publication.
              </p>
              <p className="text-muted-foreground mb-4">
                Contact us at <a href="mailto:contact@pilotstack.online">contact@pilotstack.online</a>. Please do not include passwords, payment information, or sensitive personal data in your message.
              </p>

              <h2 className="text-2xl font-bold mt-10 mb-4">Our editorial principles</h2>
              <div className="grid sm:grid-cols-2 gap-4 not-prose">
                {principles.map((principle) => (
                  <section key={principle.title} className="p-4 rounded-xl border border-border bg-muted-bg">
                    <h3 className="font-semibold mb-2">{principle.title}</h3>
                    <p className="text-sm text-muted-foreground">{principle.body}</p>
                  </section>
                ))}
              </div>

              <div className="mt-10 flex flex-wrap gap-3">
                <a href="/methodology" className="button-press inline-flex items-center justify-center rounded-lg bg-primary text-white hover:bg-primary-dark shadow-button h-10 px-5 text-sm font-medium transition-all duration-200">Read the methodology</a>
                <a href="/editorial-policy" className="inline-flex items-center justify-center rounded-lg border border-border h-10 px-5 text-sm font-medium hover:bg-muted-bg">Editorial policy</a>
                <a href="/contact" className="inline-flex items-center justify-center rounded-lg border border-border h-10 px-5 text-sm font-medium hover:bg-muted-bg">Contact PilotStack</a>
              </div>
            </div>
          </article>
        </Container>
      </Section>
    </>
  )
}
