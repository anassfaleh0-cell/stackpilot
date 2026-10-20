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
            <p className="text-muted-foreground"><em>Last updated: October 18, 2026</em></p>

            <h2>Information We Collect</h2>
            <p>We collect only the information necessary to provide and improve PilotStack:</p>
            <ul>
              <li><strong>Information you provide:</strong> Name and email address when you subscribe to our newsletter, submit a contact form, or respond to a survey.</li>
              <li><strong>Information collected automatically:</strong> If you consent to optional analytics, Google Analytics and Microsoft Clarity may process page views, referral source, browser and device information, approximate region, and interaction/session data. Hosting infrastructure may also process technical request data to deliver and protect the site.</li>
              <li><strong>Information we do not request through our forms:</strong> Payment information, government IDs, or sensitive personal data. Please do not include sensitive information in messages.</li>
            </ul>

            <h2>How We Use Your Information</h2>
            <p>We use collected information solely to:</p>
            <ul>
              <li>Deliver the content and services you request</li>
              <li>Process contact requests when email delivery is configured; otherwise, the contact form directs you to the published email address and does not report a successful submission</li>
              <li>Handle newsletter signup attempts; a mailing-list provider is not currently connected, so signup attempts are not saved as subscriptions</li>
              <li>Analyze aggregate traffic patterns to improve our content and user experience</li>
              <li>Respond to support inquiries and feedback</li>
            </ul>
            <p>We do not sell personal information. Optional analytics and advertising tools are loaded according to your consent choices and may process information under their own privacy policies.</p>

            <h2>Cookies and Tracking</h2>
            <p>We use browser storage to remember your theme and consent choices. Optional analytics and advertising scripts are loaded only according to the choices recorded in the cookie consent banner. You can reopen cookie settings from the site controls.</p>
            <ul>
              <li><strong>Essential browser storage:</strong> Theme and consent preferences are saved in local storage so the site can remember your choices; these preferences are not themselves cookies.</li>
              <li><strong>Analytics tools:</strong> Google Analytics and Microsoft Clarity are loaded only after analytics consent. They may process page-view, device, and interaction/session data according to their own policies and configuration.</li>
              <li><strong>Advertising cookies (Google AdSense):</strong> If AdSense is enabled on the site and you consent to advertising, Google may use cookies to serve and measure ads, including personalized ads based on visits to this and other websites. You can manage personalization in <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer">Google Ads Settings</a> or opt out of some participating vendors through <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer">www.aboutads.info</a>.</li>
            </ul>

            <h2>Data Retention</h2>
            <p>We retain your personal information only as long as necessary:</p>
            <ul>
              <li>Newsletter signups are not currently saved because a mailing-list provider is not connected.</li>
              <li>If contact email delivery is configured, submitted messages are sent to the designated mailbox through the configured delivery provider; copies may remain in that mailbox according to its retention settings. If delivery is not configured, the form returns an error and does not report the submission as sent.</li>
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
              <li><strong>Right to opt out:</strong> Opt out of the sale of your personal information. We do not sell personal information for money. Depending on advertising settings and applicable law, some disclosures for targeted advertising may be treated as sharing. You can decline advertising in our cookie settings and contact us to exercise any applicable opt-out rights.</li>
              <li><strong>Right to non-discrimination:</strong> We will not discriminate against you for exercising any of your CCPA rights.</li>
            </ul>
            <p>To exercise your CCPA rights, contact us at privacy@pilotstack.online. We will verify your identity before processing your request.</p>

            <h2>Data Security</h2>
            <p>We implement appropriate technical and organizational measures to protect your personal data, including:</p>
            <ul>
              <li>Encryption in transit is used for site traffic through the hosting and network infrastructure.</li>
              <li>We avoid storing contact form submissions in a separate PilotStack database; when delivery is enabled, message handling also depends on the configured email provider and recipient mailbox.</li>
              
              
            </ul>

            <h2>Third-Party Services</h2>
            <p>We use limited third-party services that may process your data under their own privacy frameworks:</p>
            <ul>
              <li><strong>Google AdSense:</strong> If advertising is enabled after approval and you consent, Google may process information to serve and measure ads. Google&apos;s privacy policy is available at <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">policies.google.com/privacy</a>. You can control ad personalization in your <a href="https://myaccount.google.com/data-and-privacy" target="_blank" rel="noopener noreferrer">Google Account settings</a>.</li>
              <li><strong>Contact email delivery:</strong> If configured, contact-form messages are transmitted through Resend to the designated recipient. If delivery is not configured, the form does not claim that a message was sent.</li>
              <li><strong>Analytics:</strong> Google Analytics and Microsoft Clarity load only after analytics consent. Their processing and retention depend on their own policies and the configured settings.</li>
              <li><strong>Hosting:</strong> Our website is hosted on Vercel&apos;s infrastructure, which provides security and privacy documentation for its infrastructure and processing services.</li>
            </ul>
            <p>Third-party processing and international transfers depend on the service and its configuration. We review provider privacy and data-processing terms, and will provide information about applicable transfer safeguards on request where available.</p>

            <h2>International Data Transfers</h2>
            <p>Some service providers may process information in countries outside your own. Any international transfer is subject to applicable legal requirements and the relevant provider arrangements. Contact us if you need information about the safeguards applicable to a particular service.</p>

            <h2>Changes to This Policy</h2>
            <p>We will publish material policy changes on this page and update the revision date. Where applicable law requires additional notice or consent, we will follow the relevant requirement. The "Last updated" date reflects the most recent revision.</p>

            <h2>Contact</h2>
            <p>For privacy-related inquiries or to exercise your data rights, contact us at <strong>privacy@pilotstack.online</strong>. We aim to respond within the period required by applicable privacy law.</p>
          </div>
        </Container>
      </Section>
    </>
  )
}
