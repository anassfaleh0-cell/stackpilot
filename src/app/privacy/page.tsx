import { Container, Section } from "@/components/ui/container"
import { Breadcrumbs } from "@/components/seo/breadcrumbs"
import { BreadcrumbSchema } from "@/components/seo/json-ld"
import { createMetadata } from "@/lib/metadata"

export const metadata = createMetadata({
  title: "Privacy Policy",
  description: "PilotStack's privacy policy explains how we collect, use, protect, and manage your personal data in compliance with GDPR and CCPA.",
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
            <p className="text-muted-foreground"><em>Last updated: July 16, 2026</em></p>

            <h2>Information We Collect</h2>
            <p>We collect only the information necessary to provide and improve PilotStack:</p>
            <ul>
              <li><strong>Information you provide:</strong> Name and email address when you subscribe to our newsletter, submit a contact form, or respond to a survey.</li>
              <li><strong>Information collected automatically:</strong> Page visits, referral source, browser type, device type, and approximate geographic region via analytics cookies. We do not collect precise location data or fingerprint your device.</li>
              <li><strong>Information we do not collect:</strong> We never collect payment information, government IDs, sensitive personal data, or browsing history outside our domain.</li>
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
            <p>We use a minimal set of cookies to operate the site. You can manage cookie preferences through your browser settings at any time.</p>
            <ul>
              <li><strong>Essential cookies:</strong> Required for site functionality (e.g., session management). No opt-out needed as these are necessary for operation.</li>
              <li><strong>Analytics cookies:</strong> We use a privacy-preserving analytics service to understand which pages are most visited and how users navigate the site. These are anonymized and do not identify individual visitors.</li>
              <li><strong>Third-party cookies:</strong> We do not use advertising cookies, social media pixels, or cross-site tracking cookies.</li>
            </ul>

            <h2>Data Retention</h2>
            <p>We retain your personal information only as long as necessary:</p>
            <ul>
              <li>Newsletter subscriber data is retained until you unsubscribe, at which point it is deleted within 30 days.</li>
              <li>Contact form submissions are retained for 12 months and then deleted.</li>
              <li>Anonymized analytics data is retained for 26 months per standard anonymization practices.</li>
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
            <p>To exercise any of these rights, contact us at privacy@pilotstack.online. We will respond within 30 days as required by GDPR.</p>

            <h2>Your Rights (CCPA)</h2>
            <p>If you are a resident of California, you have the following rights under the California Consumer Privacy Act (CCPA):</p>
            <ul>
              <li><strong>Right to know:</strong> Request disclosure of the categories and specific pieces of personal information we have collected about you.</li>
              <li><strong>Right to delete:</strong> Request deletion of personal information we have collected, subject to certain exceptions.</li>
              <li><strong>Right to opt out:</strong> Opt out of the sale of your personal information. We do not sell personal information, so no action is needed.</li>
              <li><strong>Right to non-discrimination:</strong> We will not discriminate against you for exercising any of your CCPA rights.</li>
            </ul>
            <p>To exercise your CCPA rights, contact us at privacy@pilotstack.online. We will verify your identity before processing your request.</p>

            <h2>Data Security</h2>
            <p>We implement appropriate technical and organizational measures to protect your personal data, including:</p>
            <ul>
              <li>Encryption in transit via TLS 1.3 for all site traffic</li>
              <li>Encryption at rest for any stored personal data</li>
              <li>Regular security reviews of our infrastructure and dependencies</li>
              <li>Access controls limiting data access to authorized personnel only</li>
            </ul>

            <h2>Third-Party Services</h2>
            <p>We use limited third-party services that may process your data under their own privacy frameworks:</p>
            <ul>
              <li><strong>Newsletter delivery:</strong> We use a third-party email service to send newsletters to subscribers who have opted in. This service acts as a data processor under GDPR Article 28.</li>
              <li><strong>Analytics:</strong> We use privacy-focused analytics that anonymize IP addresses and do not share data with advertising networks.</li>
              <li><strong>Hosting:</strong> Our website is hosted on Vercel's infrastructure, which is SOC 2 certified and GDPR-compliant.</li>
            </ul>
            <p>We require all third-party processors to maintain GDPR and CCPA compliance through Data Processing Agreements.</p>

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
