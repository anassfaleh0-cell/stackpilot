import { Container, Section } from "@/components/ui/container"
import { Breadcrumbs } from "@/components/seo/breadcrumbs"
import { BreadcrumbSchema, WebPageSchema } from "@/components/seo/json-ld"
import { site } from "@/lib/constants"
import { createMetadata } from "@/lib/metadata"

export const metadata = createMetadata({
  title: "DMCA Policy — Copyright Infringement Notification",
  description: "PilotStack's DMCA policy explains how to report copyright infringement and how we handle takedown requests under the Digital Millennium Copyright Act.",
  path: "/dmca",
})

export default function DMCAPage() {
  return (
    <>
      <BreadcrumbSchema items={[{ name: "Home", href: "/" }, { name: "DMCA Policy", href: "/dmca" }]} />
      <WebPageSchema name="DMCA Policy" description="PilotStack's DMCA policy for copyright infringement notifications." url={`${site.url}/dmca`} />
      <Container className="pt-8">
        <Breadcrumbs items={[{ name: "DMCA Policy" }]} />
      </Container>
      <Section className="pt-0">
        <Container>
          <div className="max-w-3xl mx-auto prose prose-slate">
            <h1 className="text-4xl font-bold tracking-tight mb-6">DMCA Policy</h1>
            <p className="text-muted-foreground"><em>Last updated: September 2026</em></p>

            <p>PilotStack respects the intellectual property rights of others and expects the same from our users. We comply with the Digital Millennium Copyright Act (DMCA) and will respond promptly to claims of copyright infringement reported to our designated copyright agent.</p>

            <h2>Filing a DMCA Takedown Notice</h2>
            <p>If you believe that content hosted on PilotStack infringes your copyright, please submit a written DMCA takedown notice to our designated copyright agent containing the following information:</p>
            <ul>
              <li><strong>Physical or electronic signature</strong> of the copyright owner or authorized agent</li>
              <li><strong>Identification of the copyrighted work</strong> claimed to have been infringed</li>
              <li><strong>Identification of the infringing material</strong> and its location on PilotStack (URL or page description)</li>
              <li><strong>Your contact information</strong> — name, address, telephone number, and email address</li>
              <li><strong>A statement of good faith belief</strong> that the use of the material is not authorized by the copyright owner, its agent, or the law</li>
              <li><strong>A statement under penalty of perjury</strong> that the information in the notification is accurate and that you are authorized to act on behalf of the copyright owner</li>
            </ul>

            <h2>Counter-Notification</h2>
            <p>If you believe your content was removed or disabled by mistake or misidentification, you may file a counter-notification with our copyright agent. Your counter-notification must include:</p>
            <ul>
              <li>Your physical or electronic signature</li>
              <li>Identification of the material that was removed and its prior location</li>
              <li>A statement under penalty of perjury that the material was removed due to mistake or misidentification</li>
              <li>Your name, address, and telephone number</li>
              <li>Consent to the jurisdiction of the federal court in your district</li>
            </ul>

            <h2>Repeat Infringers</h2>
            <p>PilotStack maintains a policy of terminating the accounts of users who are identified as repeat infringers. We may also, at our sole discretion, limit access to the site or terminate accounts of any users who infringe any intellectual property rights of others, whether or not there is any repeat infringement.</p>

            <h2>Designated Copyright Agent</h2>
            <p>Please send all DMCA notices and counter-notifications to:</p>
            <div className="p-4 rounded-xl bg-muted-bg border border-border my-4">
              <p className="text-sm"><strong>Copyright Agent</strong></p>
              <p className="text-sm">PilotStack</p>
              <p className="text-sm">Email: dmca@pilotstack.online</p>
              <p className="text-sm">Subject line: DMCA Takedown Request</p>
            </div>

            <h2>Response Timeline</h2>
            <p>We will respond to valid DMCA notices within 24-48 hours during business days. Materials may be removed or access disabled pending investigation. We will notify the affected user of the takedown and provide information about filing a counter-notification.</p>

            <h2>Good Faith Exceptions</h2>
            <p>Content may not be removed if it falls under fair use, commentary, criticism, news reporting, or other exceptions under copyright law. Reviews, comparisons, and editorial content on PilotStack may reference or quote copyrighted material under fair use provisions.</p>

            <h2>Contact</h2>
            <p>For questions about this DMCA policy, contact us at <strong>dmca@pilotstack.online</strong>.</p>
          </div>
        </Container>
      </Section>
    </>
  )
}
