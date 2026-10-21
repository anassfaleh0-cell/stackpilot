import { Container, Section } from "@/components/ui/container"
import { Breadcrumbs } from "@/components/seo/breadcrumbs"
import { BreadcrumbSchema, WebPageSchema } from "@/components/seo/json-ld"
import { site } from "@/lib/constants"
import { createMetadata } from "@/lib/metadata"

export const metadata = createMetadata({
  title: "Privacy Policy — How PilotStack Handles Your Data",
  description: "PilotStack's privacy policy explains how we collect, use, protect, and manage personal data, including the rights and choices that may apply under privacy laws.",
  path: "/privacy",
})

export default function PrivacyPage() {
  return (
    <>
      <BreadcrumbSchema items={[{ name: "Home", href: "/" }, { name: "Privacy Policy", href: "/privacy" }]} />
      <WebPageSchema name="Privacy Policy" description="PilotStack's privacy policy — how we collect, use, and protect your data." url={`${site.url}/privacy`} />
      <Container className="pt-8">
        <Breadcrumbs items={[{ name: "Privacy Policy" }]} />
      </Container>
      <Section className="pt-0">
        <Container>
          <div className="max-w-3xl mx-auto prose prose-slate">
            <h1 className="text-4xl font-bold tracking-tight mb-6">Privacy Policy</h1>
            <p className="text-muted-foreground"><em>Last updated: October 14, 2026</em></p>

            <h2>Information We Collect</h2>
            <p>We collect only the information necessary to provide and improve PilotStack:</p>
            <ul>
              <li><strong>Information you provide:</strong> Name and email address when you subscribe to our newsletter or submit a contact form. Please avoid including sensitive personal information in messages.</li>
              <li><strong>Information collected automatically:</strong> Depending on your consent choices and enabled services, analytics or advertising providers may process page visits, referral source, browser and device information, online identifiers, and approximate geographic region. PilotStack does not request precise location data from visitors.</li>
              <li><strong>Information we do not request:</strong> Our forms are not designed to collect payment information, government IDs, or sensitive personal data. Please do not submit this information. If you send it inadvertently, contact us so we can review the request.</li>
            </ul>

            <h2>How We Use Your Information</h2>
            <p>We use collected information solely to:</p>
            <ul>
              <li>Deliver the content and services you request</li>
              <li>If a newsletter is introduced, send messages only after explicit opt-in and any required confirmation; newsletter signup is currently unavailable and no subscription is saved.</li>
              <li>Analyze aggregate traffic patterns to improve our content and user experience</li>
              <li>Respond to support inquiries and feedback</li>
            </ul>
            <p>We do not sell personal information for money. Advertising and analytics providers may process online identifiers and usage data as described below; depending on the provider, configuration, and applicable law, some advertising-related disclosures may be treated as “sharing.” PilotStack does not make decisions about individuals using these data for eligibility or similarly significant effects.</p>

            <h2>Cookies and Tracking</h2>
            <p>We use a minimal set of cookies to operate the site. You can manage cookie preferences through your browser settings or our cookie consent banner at any time.</p>
            <ul>
              <li><strong>Essential cookies:</strong> Required for site functionality (e.g., session management). No opt-out needed as these are necessary for operation.</li>
              <li><strong>Analytics and experience measurement:</strong> After you consent to analytics, we may load Google Analytics and Microsoft Clarity. These services help us understand page usage and usability; depending on their configuration, they may process device and browser information, interaction events, and session-replay or heatmap data. We do not describe this data as anonymous in every circumstance. You can refuse or withdraw analytics consent using Cookie Settings. See <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Google’s privacy policy</a> and <a href="https://privacy.microsoft.com/privacystatement" target="_blank" rel="noopener noreferrer">Microsoft’s privacy statement</a>.</li>
              <li><strong>Advertising cookies (Google AdSense):</strong> We are preparing to use Google AdSense. If advertising is enabled and an ad slot is configured, Google and its partners may use cookies or similar technologies to serve and measure ads, including personalized ads where permitted. The AdSense script is loaded only after you grant advertising consent. You can manage ad personalization in <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer">Google Ads Settings</a> or opt out of some third-party vendors&apos; personalized advertising at <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer">www.aboutads.info</a>. Before serving personalized ads in the EEA, UK, or Switzerland, we will configure a Google-certified CMP that supports the IAB Transparency and Consent Framework, as required by Google&apos;s policy.</li>
            </ul>

            <h2>Data Retention</h2>
            <p>We retain your personal information only as long as necessary:</p>
            <ul>
              <li>Newsletter signup is currently unavailable because no mailing-list provider is connected. Submitting the newsletter form does not save an email address or create a subscription. If we enable a provider later, this policy will be updated to describe its retention practices.</li>
              <li>Contact messages are retained only as needed to respond, handle follow-up, and meet applicable recordkeeping obligations. Retention can also depend on the email or support systems used to receive them.</li>
              <li>Analytics retention depends on the service and configuration described in this policy.</li>
            </ul>

            <h2>Your Rights (GDPR)</h2>
            <p>If you are a resident of the European Economic Area, you have the following rights under the General Data Protection Regulation (GDPR):</p>
            <ul>
              <li><strong>Right to access:</strong> Request a copy of the personal data we hold about you.</li>
              <li><strong>Right to rectification:</strong> Request correction of inaccurate or incomplete data.</li>
              <li><strong>Right to erasure ("Right to be forgotten"):</strong> Request deletion of your personal data when it is no longer necessary for the purpose collected.</li>
              <li><strong>Right to restrict processing:</strong> Request that we limit how we use your data.</li>
              <li><strong>Right to data portability:</strong> Request a machine-readable copy of your data to transfer to another service.</li>
              <li><strong>Right to object:</strong> Object to processing of your data for analytics or marketing purposes.</li>
            </ul>
            <p>To exercise any of these rights, contact us at privacy@pilotstack.online. We aim to respond within the time required by applicable privacy law.</p>

            <h2>Your Rights (CCPA)</h2>
            <p>If you are a resident of California, you have the following rights under the California Consumer Privacy Act (CCPA):</p>
            <ul>
              <li><strong>Right to know:</strong> Request disclosure of the categories and specific pieces of personal information we have collected about you.</li>
              <li><strong>Right to delete:</strong> Request deletion of personal information we have collected, subject to certain exceptions.</li>
              <li><strong>Right to opt out of sale or sharing:</strong> We do not sell personal information for money. However, some advertising technology can involve disclosure of online identifiers or browsing activity for cross-context behavioral advertising, which may be treated as “sharing” under California law depending on the circumstances. To opt out of advertising-related processing on this site, open Cookie Settings and turn off advertising consent. You may also contact privacy@pilotstack.online to submit a privacy request.</li>
              <li><strong>Right to non-discrimination:</strong> We will not discriminate against you for exercising any of your CCPA rights.</li>
            </ul>
            <p>To exercise your CCPA rights, contact us at privacy@pilotstack.online. We will verify your identity before processing your request.</p>

            <h2>Data Security</h2>
            <p>We implement appropriate technical and organizational measures to protect your personal data, including:</p>
            <ul>
              <li>Encryption in transit is used for site traffic through the hosting and network infrastructure.</li>
              <li><strong>Storage protections:</strong> Data stored by third-party services is subject to the security controls and configuration of those providers. We review their available security documentation and limit access to systems under our control.</li>
              <li>Regular security reviews of our infrastructure and dependencies</li>
              <li>Access controls limiting data access to authorized personnel only</li>
            </ul>

            <h2>Third-Party Services</h2>
            <p>We use limited third-party services that may process your data under their own privacy frameworks:</p>
            <ul>
              <li><strong>Google AdSense (planned):</strong> We are preparing AdSense integration, but advertising inventory may not be active until ad slots are configured. If ads are enabled, Google may process information as described in its <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">privacy policy</a>. You can control ad personalization in your <a href="https://myaccount.google.com/data-and-privacy" target="_blank" rel="noopener noreferrer">Google Account settings</a>.</li>
              <li><strong>Newsletter:</strong> No mailing-list provider is currently configured, so we do not store newsletter signup addresses or send newsletters. If a provider is added, we will update this policy before enabling signups.</li>
              <li><strong>Analytics and session measurement:</strong> Google Analytics and Microsoft Clarity may process usage and interaction data after analytics consent. Exact data collection and retention depend on each service’s configuration and current terms.</li>
              <li><strong>Tag management:</strong> Google Tag Manager may load third-party tags only after both analytics and advertising preferences are enabled in our consent interface. Tags configured in that container may have their own data practices, which are governed by the relevant provider’s policies.</li>
              <li><strong>Hosting:</strong> Our website is hosted on Vercel&apos;s infrastructure, which provides security and privacy documentation for its infrastructure and processing services.</li>
            </ul>
            <p>Where required, we use appropriate contractual safeguards with third-party processors and review their published privacy and data-processing terms.</p>

            <h2>International Data Transfers</h2>
            <p>If personal data is transferred internationally, the applicable provider terms and lawful transfer safeguards depend on the service and destination. Contact privacy@pilotstack.online for information about the safeguards relevant to a specific service.</p>

            <h2>Changes to This Policy</h2>
            <p>If we operate a newsletter, we will notify subscribers of material changes where appropriate. The "Last updated" date at the top of this page reflects the most recent revision. We encourage visitors to review the policy periodically.</p>

            <h2>Contact</h2>
            <p>For privacy-related inquiries or to exercise your data rights, contact us at <strong>privacy@pilotstack.online</strong>. We aim to respond to all requests within 30 days.</p>
          </div>
        </Container>
      </Section>
    </>
  )
}
