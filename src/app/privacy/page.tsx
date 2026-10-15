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
              <li><strong>Information you provide:</strong> Name and email address when you subscribe to our newsletter, submit a contact form, or respond to a survey.</li>
              <li><strong>Information collected automatically:</strong> Page visits, referral source, browser type, device type, and approximate geographic region via analytics cookies. We do not collect precise location data or fingerprint your device.</li>
              <li><strong>Information we do not request:</strong> Our forms are not designed to collect payment information, government IDs, or sensitive personal data. Please do not submit this information. If you send it inadvertently, contact us so we can review the request.</li>
            </ul>

            <h2>How We Use Your Information</h2>
            <p>We use collected information solely to:</p>
            <ul>
              <li>Deliver the content and services you request</li>
              <li>Send newsletter emails (only with your explicit consent via double opt-in)</li>
              <li>Analyze aggregate traffic patterns to improve our content and user experience</li>
              <li>Respond to support inquiries and feedback</li>
            </ul>
            <p>We never sell your personal information to third parties. We never use your data for automated decision-making or profiling beyond aggregate analytics.</p>

            <h2>Cookies and Tracking</h2>
            <p>We use a minimal set of cookies to operate the site. You can manage cookie preferences through your browser settings or our cookie consent banner at any time.</p>
            <ul>
              <li><strong>Essential cookies:</strong> Required for site functionality (e.g., session management). No opt-out needed as these are necessary for operation.</li>
              <li><strong>Analytics and experience measurement:</strong> After you consent to analytics, we may load Google Analytics and Microsoft Clarity. These services help us understand page usage and usability; depending on their configuration, they may process device and browser information, interaction events, and session-replay or heatmap data. We do not describe this data as anonymous in every circumstance. You can refuse or withdraw analytics consent using Cookie Settings. See <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Google’s privacy policy</a> and <a href="https://privacy.microsoft.com/privacystatement" target="_blank" rel="noopener noreferrer">Microsoft’s privacy statement</a>.</li>
              <li><strong>Advertising cookies (Google AdSense):</strong> We use Google AdSense to display advertisements on PilotStack. Google AdSense uses cookies to serve ads based on your prior visits to our website or other websites on the internet. Google&apos;s use of advertising cookies enables it and its partners to serve ads based on your visit to our site and/or other sites on the internet. You may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer">Google Ads Settings</a>. Alternatively, you can opt out of some third-party vendors&apos; use of cookies for personalized advertising by visiting <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer">www.aboutads.info</a>.</li>
            </ul>

            <h2>Data Retention</h2>
            <p>We retain your personal information only as long as necessary:</p>
            <ul>
              <li>Newsletter subscriber information is handled by our email service provider while you remain subscribed. Deletion timing after unsubscribe depends on the provider's processing and backup-retention practices.</li>
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
              <li><strong>Google AdSense:</strong> We use Google AdSense to display advertisements. Google may collect data about your visits to our site and other websites to serve personalized ads. Google&apos;s privacy policy is available at <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">policies.google.com/privacy</a>. You can control ad personalization in your <a href="https://myaccount.google.com/data-and-privacy" target="_blank" rel="noopener noreferrer">Google Account settings</a>.</li>
              <li><strong>Newsletter delivery:</strong> We use a third-party email service to send newsletters to subscribers who have opted in. This service acts as a data processor under GDPR Article 28.</li>
              <li><strong>Analytics and session measurement:</strong> Google Analytics and Microsoft Clarity may process usage and interaction data after analytics consent. Exact data collection and retention depend on each service’s configuration and current terms.</li>
              <li><strong>Tag management:</strong> Google Tag Manager may load third-party tags only after both analytics and advertising preferences are enabled in our consent interface. Tags configured in that container may have their own data practices, which are governed by the relevant provider’s policies.</li>
              <li><strong>Hosting:</strong> Our website is hosted on Vercel&apos;s infrastructure, which provides security and privacy documentation for its infrastructure and processing services.</li>
            </ul>
            <p>Where required, we use appropriate contractual safeguards with third-party processors and review their published privacy and data-processing terms.</p>

            <h2>International Data Transfers</h2>
            <p>If we transfer personal data from the EEA to countries not deemed adequate by the European Commission, we rely on Standard Contractual Clauses (SCCs) as the transfer mechanism under GDPR Article 46.</p>

            <h2>Changes to This Policy</h2>
            <p>We will notify subscribers of material changes to this privacy policy via email. The "Last updated" date at the top of this page reflects the most recent revision. Continued use of PilotStack after changes constitutes acceptance of the updated policy.</p>

            <h2>Contact</h2>
            <p>For privacy-related inquiries or to exercise your data rights, contact us at <strong>privacy@pilotstack.online</strong>. We aim to respond to all requests within 30 days.</p>
          </div>
        </Container>
      </Section>
    </>
  )
}
